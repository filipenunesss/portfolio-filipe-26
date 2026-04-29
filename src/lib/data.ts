export type LinkCard = {
  type: "link";
  label: string;
  area: string;
  href: string;
};

export type ActionCard = {
  type: "action";
  label: string;
  area: string;
  action: "work" | "about";
};

export type Card = LinkCard | ActionCard;

export const CARDS: Card[] = [
  { type: "action", label: "Work",      area: "work",      action: "work"  },
  { type: "action", label: "About",     area: "about",     action: "about" },
  { type: "link",   label: "Contact",   area: "contact",   href: "mailto:filipeandrenunesramos2@gmail.com" },
  { type: "link",   label: "Github",    area: "github",    href: "https://github.com/filipenunesss" },
  { type: "link",   label: "Instagram", area: "instagram", href: "https://www.instagram.com/filipenunesss" },
  { type: "link",   label: "LinkedIn",  area: "linkedin",  href: "https://www.linkedin.com/in/filipenuness/" },
  { type: "link",   label: "Piex Agency", area: "piex",    href: "https://www.piexagency.com.br" },
];

export const SKILLS = [
  "NEXT.JS ENTHUSIAST",
  "CREATIVE DEVELOPER",
  "WEB DESIGN",
  "UI/UX",
  "MOTION DESIGN",
  "TYPESCRIPT",
  "REACT",
  "TAILWIND CSS",
] as const;

export const SPOTIFY_PLAYLIST_ID = "0Yg6Dffpc3edgAK2rMmhs8";

export type Section = { title: string; items: string[] };

export const WORK = {
  company: "Libellus System",
  period: "Sep 2023 - Present",
  role: "Front-end Developer and UX Designer",
  sections: [
    {
      title: "Web Development",
      items: [
        "Scalable, component-based React applications using Hooks, Context API, and modular architecture for maintainability and reusability.",
        "Performance optimization through efficient rendering, state management, and API consumption (Axios) for fast, stable user experiences.",
      ],
    },
    {
      title: "Design & Collaboration",
      items: [
        "Translating Figma and Miro wireframes into high-fidelity, pixel-accurate interfaces aligned with the design vision.",
        "Cross-functional collaboration with product and design teams to ensure seamless design-to-development handoff.",
      ],
    },
    {
      title: "Mobile Development",
      items: [
        "Native and hybrid mobile applications with Flutter (Dart) and Android Studio (Kotlin/Java), applying clean architecture and reactive state management.",
      ],
    },
    {
      title: "AI-Augmented Development",
      items: [
        "Leveraging LLMs and AI-assisted tooling to accelerate architecture decisions, automate repetitive workflows, and validate implementation approaches.",
      ],
    },
    {
      title: "DevOps & Workflow",
      items: [
        "Git workflows with branching strategies, pull requests, and CI/CD pipelines ensuring code quality, traceability, and team efficiency.",
      ],
    },
  ] satisfies Section[],
};

export const ABOUT: Section[] = [
  {
    title: "About Me",
    items: [
      "My name is Filipe, I'm 23 years old and I'm from Uberlândia, Minas Gerais, Brazil. I have a degree in Computer Science and I'm passionate about the intersection of UX/UI and development.",
      "I'm always looking to learn and stay updated with the latest design and technology trends, creating digital products that are beautiful, functional, and impactful. Currently, I work as a lead designer and developer at a startup, while simultaneously creating my own high-quality website brand called PIEX.",
    ],
  },
  {
    title: "Skills",
    items: [
      "I have hands-on experience with React, Next.js, TypeScript, and Tailwind CSS in creating responsive, high-performance web applications, with a strong focus on writing clean and maintainable code.",
      "Experience with mobile development using Flutter and Android Studio, exploring the creation of functional applications with a good user experience.",
      "I have a solid understanding of web development best practices, including version control with Git, testing methodologies, and deployment processes, with a commitment to building scalable and efficient digital products.",
      "I possess fundamental UI/UX design skills, creating interactive, prototyped, and visually appealing interfaces using Figma and Framer.",
    ],
  },
];
