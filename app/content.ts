// Everything on the site comes from this file. Edit here, push, and Vercel redeploys.

// The site uses three colors that follow the hero line:
// "grid" (blue, power grid work), "lab" (purple, research tools), "heart" (red, medicine).
export type Tone = "grid" | "lab" | "heart";

export const profile = {
  name: "Zain Rizvi",
  eyebrow: "Computer Engineering + Computer Science at Northeastern",
  tagline: "Software for real data, from the power grid to the heartbeat.",
  intro:
    "I study Computer Engineering and Computer Science at Northeastern. I build software for people working with real data, from power grid models to research tools, and I want to end up where software meets medicine.",
  // Phrases in the intro that light up in color as you scroll past.
  // If you reword the intro, keep these matching (or delete one to skip it).
  introHighlights: {
    grid: "power grid models",
    lab: "research tools",
    heart: "medicine",
  } as Partial<Record<Tone, string>>,
  github: "https://github.com/ZainR525",
  // Leave any of these empty and the link won't show.
  email: "zain.f.rizvi2007@gmail.com",
  linkedin: "https://www.linkedin.com/in/zain-rizvi-704b5621a",
  resume: "/resume.pdf", // the file lives in /public
};

// The two captions under the hero line.
export const signalCaptions = {
  grid: "Power grid demand over a day, the data I work with now",
  heart: "A heartbeat, where I want to go",
};

export type Experience = {
  org: string;
  context?: string;
  role: string;
  dates: string;
  tone: Tone;
  points: string[];
};

export const experience: Experience[] = [
  {
    org: "FIU EPSi Lab",
    context: "DOE-funded, in partnership with FPL",
    role: "Machine Learning Research Intern",
    dates: "Jun 2026 – Present",
    tone: "grid",
    points: [
      "Built a working federated learning demo using FedAvg on PJM energy grid data in Python, so utilities can train a shared model without handing over their raw data.",
      "Wrote the learning docs and presentation decks the team used, including the deck for a vendor meeting with Databricks and NextEra.",
    ],
  },
  {
    org: "Oak Ridge National Laboratory",
    context: "Northeastern research practicum, for ORNL PI Dr. Rajeev Kumar",
    role: "Project Lead, Research Practicum",
    dates: "Jan – May 2026",
    tone: "lab",
    points: [
      "Led 4 undergraduates, working with graduate students, to design, build, and deploy a research web app in TypeScript, React, and Next.js on Vercel.",
      "The app gives scientists browser-based access to Polymer Chemistry-Informed Neural Network (PCINN) predictions and molecular weight distribution data.",
      "Built a parameter sweep tool that varies one input across a range and updates every output in real time, replacing one-at-a-time prediction runs, plus batch prediction from uploaded files.",
      "Designed an Arrhenius analysis feature from scratch so scientists can validate experimental results against model predictions across temperature ranges.",
      "Moved model training into the app with configurable hyperparameters and live progress, instead of a separate offline step.",
    ],
  },
  {
    org: "Cleveland Clinic",
    role: "Summer Scholar",
    dates: "Jun – Aug 2024",
    tone: "heart",
    points: [
      "Completed 200 hours of clinical shadowing through the summer scholar program.",
    ],
  },
];

// art picks the drawing on a project's tile: "network", "ultrasound", "bars",
// or "candles". Leave it out and the tile gets a plain line.
export type ProjectArt = "network" | "ultrasound" | "bars" | "candles";

export type Project = {
  name: string;
  description: string;
  stack: string[];
  tone: Tone;
  art?: ProjectArt;
  status?: string;
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    name: "Federated learning on PJM grid data",
    description:
      "A local federated learning setup using FedAvg. Each client trains on its own slice of PJM energy data and only the model weights get shared and averaged.",
    stack: ["Python", "FedAvg"],
    tone: "grid",
    art: "network",
    link: {
      label: "Code on GitHub",
      href: "https://github.com/ZainR525/PJMfederatedmodel",
    },
  },
  {
    name: "Ultrasound vein finder",
    description:
      "Team engineering project at Northeastern: an ultrasound device that helps nurses locate veins.",
    stack: ["Engineering design", "Ultrasound"],
    tone: "heart",
    art: "ultrasound",
  },
  {
    name: "Personal health data analysis",
    description:
      "Learning pandas by digging into my own WHOOP data.",
    stack: ["Python", "pandas"],
    tone: "heart",
    art: "bars",
    status: "In progress",
  },
  {
    name: "ML trading bot",
    description:
      "A machine learning trading bot, starting with paper trading before any real money is involved.",
    stack: ["Python", "Machine learning"],
    tone: "lab",
    art: "candles",
    status: "In progress",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "Swift", "SQL", "HTML/CSS"],
  },
  { group: "Frontend and mobile", items: ["React", "Next.js", "SwiftUI"] },
  {
    group: "Data and ML",
    items: ["Machine learning", "Neural networks", "Federated learning", "scikit-learn", "pandas", "Databricks"],
  },
  {
    group: "Tools",
    items: ["Git", "GitHub", "Linux", "Vercel", "Firebase", "Google Cloud", "Xcode", "Arduino"],
  },
];

export const education = {
  school: "Northeastern University",
  degree: "B.S. in Computer Engineering and Computer Science",
  graduation: "Expected May 2029",
  gpa: "3.83",
  details: ["Dean's List, Fall 2025 and Spring 2026"],
};
