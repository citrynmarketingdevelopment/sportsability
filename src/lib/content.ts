export const contact = {
  email: "sportabilityathletics@gmail.com",
  phone: "661-427-3747",
  phoneHref: "tel:+16614273747",
  location: "Bakersfield, California",
} as const;

export type ProgramId = "group-soccer" | "individual-soccer";
export type Program = {
  id: ProgramId;
  name: string;
  shortName: string;
  price: number;
  description: string;
  features: readonly string[];
  image: string;
  homeImage: { src: string; alt: string };
};

export const programs: readonly Program[] = [
  {
    id: "group-soccer",
    name: "6-Week Adaptive Soccer",
    shortName: "Group Soccer",
    price: 210,
    description: "A place to learn the game, find a teammate, and grow in confidence. One supportive session each week for six weeks.",
    features: ["6 sessions, once a week", "Small-group adaptive soccer", "Social development woven into play", "Team-building activities", "Individualized adaptations", "Parent and athlete involvement"],
    image: "/images/group-soccer.webp",
    homeImage: {
      src: "/images/home-group-drills.webp",
      alt: "Illustrative scene of children practicing dribbling through yellow cones on a soccer field with a coach",
    },
  },
  {
    id: "individual-soccer",
    name: "1-on-1 Adaptive Soccer",
    shortName: "1-on-1 Soccer",
    price: 300,
    description: "Dedicated attention. A comfortable pace. Soccer built around your athlete’s own strengths and goals.",
    features: ["Individualized athletic goals", "Adaptive soccer skill development", "Social and communication goals where appropriate"],
    image: "/images/individual-soccer-clean.webp",
    homeImage: {
      src: "/images/home-individual-passing.webp",
      alt: "Illustrative scene of a boy practicing a pass through blue cones to his coach on a soccer field",
    },
  },
];

export const audience = ["Autism", "Down syndrome", "ADHD", "Intellectual disabilities", "Developmental delays", "Social-communication differences"];
export const tagline = "Every Athlete, Every Ability, Empowered Through Sports.";
