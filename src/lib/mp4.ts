export type Mp4Sample = {
  offset: number;
  size: number;
  timestamp: number;
  duration: number;
  key: boolean;
};

export type Mp4Track = {
  codec: string;
  description: Uint8Array;
  width: number;
  height: number;
  duration: number;
  samples: Mp4Sample[];
};

type Box = { type: string; start: number; end: number };

function readBoxes(view: DataView, start: number, end: number): Box[] {
  const boxes: Box[] = [];
  let pos = start;
  while (pos + 8 <= end) {
    let size = view.getUint32(pos);
    const type = String.fromCharCode(
      view.getUint8(pos + 4),
      view.getUint8(pos + 5),
      view.getUint8(pos + 6),
      view.getUint8(pos + 7),
    );
    let header = 8;
    if (size === 1) {
      size = Number(view.getBigUint64(pos + 8));
      header = 16;
    } else if (size === 0) {
      size = end - pos;
    }
    boxes.push({ type, start: pos + header, end: pos + size });
    pos += size;
  }
  return boxes;
}

function find(view: DataView, parent: Box, path: string[]): Box | undefined {
  let current: Box | undefined = parent;
  for (const type of path) {
    if (!current) return undefined;
    current = readBoxes(view, current.start, current.end).find((b) => b.type === type);
  }
  return current;
}

function hex(byte: number) {
  return byte.toString(16).padStart(2, "0");
}

export function parseMp4(buffer: ArrayBuffer): Mp4Track {
  const view = new DataView(buffer);
  const root: Box = { type: "root", start: 0, end: buffer.byteLength };
  const moov = find(view, root, ["moov"]);
  if (!moov) throw new Error("moov not found");

  const trak = readBoxes(view, moov.start, moov.end)
    .filter((b) => b.type === "trak")
    .find((t) => {
      const hdlr = find(view, t, ["mdia", "hdlr"]);
      return hdlr && view.getUint32(hdlr.start + 8) === 0x76696465;
    });
  if (!trak) throw new Error("video track not found");

  const mdhd = find(view, trak, ["mdia", "mdhd"])!;
  const timescale = view.getUint32(mdhd.start + (view.getUint8(mdhd.start) === 1 ? 20 : 12));

  const stbl = find(view, trak, ["mdia", "minf", "stbl"])!;
  const children = readBoxes(view, stbl.start, stbl.end);
  const box = (type: string) => children.find((b) => b.type === type);

  const stsd = box("stsd")!;
  const entry = readBoxes(view, stsd.start + 8, stsd.end)[0];
  const width = view.getUint16(entry.start + 24);
  const height = view.getUint16(entry.start + 26);
  const avcC = readBoxes(view, entry.start + 78, entry.end).find((b) => b.type === "avcC");
  if (!avcC) throw new Error("avcC not found");
  const description = new Uint8Array(buffer, avcC.start, avcC.end - avcC.start);
  const codec = `avc1.${hex(description[1])}${hex(description[2])}${hex(description[3])}`;

  const stsz = box("stsz")!;
  const fixedSize = view.getUint32(stsz.start + 4);
  const count = view.getUint32(stsz.start + 8);
  const sizes = Array.from({ length: count }, (_, i) =>
    fixedSize || view.getUint32(stsz.start + 12 + i * 4),
  );

  const stco = box("stco");
  const co64 = box("co64");
  const chunkBox = (stco ?? co64)!;
  const chunkCount = view.getUint32(chunkBox.start + 4);
  const chunkOffsets = Array.from({ length: chunkCount }, (_, i) =>
    stco
      ? view.getUint32(chunkBox.start + 8 + i * 4)
      : Number(view.getBigUint64(chunkBox.start + 8 + i * 8)),
  );

  const stsc = box("stsc")!;
  const stscCount = view.getUint32(stsc.start + 4);
  const stscEntries = Array.from({ length: stscCount }, (_, i) => ({
    firstChunk: view.getUint32(stsc.start + 8 + i * 12),
    samplesPerChunk: view.getUint32(stsc.start + 12 + i * 12),
  }));

  const offsets: number[] = [];
  for (let e = 0; e < stscEntries.length; e++) {
    const first = stscEntries[e].firstChunk - 1;
    const last = e + 1 < stscEntries.length ? stscEntries[e + 1].firstChunk - 1 : chunkCount;
    for (let c = first; c < last; c++) {
      let offset = chunkOffsets[c];
      for (let s = 0; s < stscEntries[e].samplesPerChunk && offsets.length < count; s++) {
        offsets.push(offset);
        offset += sizes[offsets.length - 1];
      }
    }
  }

  const stts = box("stts")!;
  const sttsCount = view.getUint32(stts.start + 4);
  const durations: number[] = [];
  for (let i = 0; i < sttsCount; i++) {
    const n = view.getUint32(stts.start + 8 + i * 8);
    const delta = view.getUint32(stts.start + 12 + i * 8);
    for (let j = 0; j < n; j++) durations.push(delta);
  }

  const stss = box("stss");
  const keyFrames = stss
    ? new Set(
        Array.from({ length: view.getUint32(stss.start + 4) }, (_, i) =>
          view.getUint32(stss.start + 8 + i * 4),
        ),
      )
    : null;

  const toMicros = 1_000_000 / timescale;
  let time = 0;
  const samples = sizes.map((size, i) => {
    const sample = {
      offset: offsets[i],
      size,
      timestamp: time * toMicros,
      duration: durations[i] * toMicros,
      key: keyFrames ? keyFrames.has(i + 1) : true,
    };
    time += durations[i];
    return sample;
  });

  return { codec, description, width, height, duration: time * toMicros, samples };
}
