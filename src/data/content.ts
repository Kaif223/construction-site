export type JourneyStage = {
  number: string;
  title: string;
  description: string;
  checks: string[];
  image: string;
  imageAlt: string;
};

export const journeyStages: JourneyStage[] = [
  {
    number: "01",
    title: "Site preparation",
    description:
      "The site is surveyed, cleared, levelled and set out. Access, drainage and temporary services are arranged before heavy work begins.",
    checks: ["Boundary and level survey", "Soil assessment", "Setting-out verified"],
    image: "/images/journey/01-site-preparation.jpg",
    imageAlt: "Aerial view of excavators levelling an earthwork site",
  },
  {
    number: "02",
    title: "Foundation",
    description:
      "Excavations are inspected, reinforcement is fixed and checked, and foundations are poured to the engineer's design.",
    checks: ["Excavation depth inspected", "Reinforcement approved", "Concrete tested"],
    image: "/images/journey/02-foundation.jpg",
    imageAlt: "Aerial view of concrete foundations being poured on a cleared site",
  },
  {
    number: "03",
    title: "Structural construction",
    description:
      "Columns, beams and slabs rise floor by floor. Formwork, steel and concrete are checked against the structural drawings at every level.",
    checks: ["Column and beam alignment", "Slab levels", "Curing periods respected"],
    image: "/images/journey/03-structure.jpg",
    imageAlt: "Construction workers fixing tall steel reinforcement cages for concrete columns",
  },
  {
    number: "04",
    title: "Brickwork & enclosure",
    description:
      "Walls, openings and the roof close the building in. Once it is weathertight, internal trades can work without interruption.",
    checks: ["Openings to size", "Damp-proof course", "Roof weathertight"],
    image: "/images/journey/04-enclosure.jpg",
    imageAlt: "A builder working on top of a timber wall frame against a blue sky",
  },
  {
    number: "05",
    title: "Electrical & plumbing",
    description:
      "First-fix wiring, pipework and ducts are routed through walls and floors, then tested and photographed before anything is covered.",
    checks: ["Pressure tests", "Circuit continuity", "Photo record before closing"],
    image: "/images/journey/05-services.jpg",
    imageAlt: "An electrician in a yellow hard hat standing beside an installed electrical box",
  },
  {
    number: "06",
    title: "Plastering & waterproofing",
    description:
      "Walls are plastered true and wet areas are tanked. Waterproofing is flood-tested before tiling begins.",
    checks: ["Wall flatness", "Membrane continuity", "Flood test in wet rooms"],
    image: "/images/journey/06-plaster.jpg",
    imageAlt: "An interior under renovation with stripped walls, exposed brick and timber props",
  },
  {
    number: "07",
    title: "Flooring & marble",
    description:
      "Screeds are levelled and cured, then stone, tile and timber are set out from a planned grid so joints and veining align.",
    checks: ["Screed moisture readings", "Set-out approved", "Lippage within tolerance"],
    image: "/images/journey/07-flooring.jpg",
    imageAlt: "A geometric stone floor of black, white and amber blocks",
  },
  {
    number: "08",
    title: "Painting & interior finishing",
    description:
      "Paint, joinery, fixtures and lighting bring the interiors together. Every surface is protected until handover.",
    checks: ["Paint coverage", "Joinery alignment", "Fixture function"],
    image: "/images/journey/08-finishing.jpg",
    imageAlt: "A finished living room with tan leather sofa, plants and a gallery wall of framed prints",
  },
  {
    number: "09",
    title: "Inspection & handover",
    description:
      "A room-by-room inspection, snag resolution and final clean. You receive drawings, test records, warranties from suppliers and care guides.",
    checks: ["Joint snagging walk", "Systems demonstrated", "Handover documents"],
    image: "/images/journey/09-handover.jpg",
    imageAlt: "A completed white villa with a pool and loungers on a sunny day",
  },
];

export type ProcessStep = {
  number: string;
  title: string;
  summary: string;
  details: string[];
  outcome: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Consultation",
    summary:
      "A conversation about what you want to build, why, and the budget and timeline you have in mind.",
    details: [
      "Discuss goals, priorities and constraints",
      "Review any drawings, photos or references you have",
      "Outline which services the project will likely need",
    ],
    outcome: "A shared understanding of the brief",
  },
  {
    number: "02",
    title: "Site visit & requirements",
    summary:
      "We visit the site or property to measure, photograph and assess conditions that affect design and cost.",
    details: [
      "Measurements and condition notes",
      "Access, services and structural observations",
      "Written list of requirements and assumptions",
    ],
    outcome: "A documented scope of work",
  },
  {
    number: "03",
    title: "Design & quotation",
    summary:
      "Drawings and specifications are developed, then priced line by line so you can see where the money goes.",
    details: [
      "Layouts, elevations and visualisations",
      "Materials and finishes schedule",
      "Itemised quotation with inclusions and exclusions",
    ],
    outcome: "Approved design and detailed quotation",
  },
  {
    number: "04",
    title: "Planning & preparation",
    summary:
      "Approvals, programme, procurement and site set-up are organised before work starts.",
    details: [
      "Construction programme with milestones",
      "Ordering of long-lead materials",
      "Site safety and logistics plan",
    ],
    outcome: "A ready site and a realistic schedule",
  },
  {
    number: "05",
    title: "Construction & progress monitoring",
    summary:
      "Coordinated trades build to the drawings, with inspections at each stage and regular progress reports.",
    details: [
      "Stage inspections before work is covered",
      "Regular progress updates with photos",
      "Change requests priced and approved in writing",
    ],
    outcome: "Visible progress, no surprises",
  },
  {
    number: "06",
    title: "Finishing, inspection & handover",
    summary:
      "Final finishes, a joint inspection, snag resolution and a complete handover pack.",
    details: [
      "Room-by-room snagging walk",
      "Systems demonstration",
      "Drawings, test records and care guides",
    ],
    outcome: "A finished building you understand",
  },
];

export type Material = {
  slug: string;
  name: string;
  code: string;
  description: string;
  uses: string[];
  care: string;
  application: "Interior" | "Exterior" | "Interior & exterior";
  image: string;
  imageAlt: string;
};

export const materials: Material[] = [
  {
    slug: "marble",
    name: "Marble",
    code: "MT-01",
    description:
      "Metamorphic stone prized for its veining. Each slab is unique, so we dry-lay and approve layouts before installation.",
    uses: ["Floors", "Vanities", "Feature walls", "Stair treads"],
    care: "Seal after installation; clean with pH-neutral products.",
    application: "Interior",
    image: "/images/materials/marble.jpg",
    imageAlt: "White marble with dramatic charcoal veining",
  },
  {
    slug: "granite",
    name: "Granite",
    code: "MT-02",
    description:
      "Dense igneous stone with excellent resistance to heat, scratches and wear — ideal where surfaces work hard.",
    uses: ["Kitchen worktops", "Thresholds", "Stairs", "External paving"],
    care: "Very durable; periodic sealing depending on finish.",
    application: "Interior & exterior",
    image: "/images/materials/granite.jpg",
    imageAlt: "Speckled grey, black and white granite surface",
  },
  {
    slug: "ceramic",
    name: "Ceramic tiles",
    code: "MT-03",
    description:
      "Versatile glazed tiles in countless colours and formats, well suited to walls, splashbacks and mosaics.",
    uses: ["Bathroom walls", "Splashbacks", "Mosaics", "Feature tiling"],
    care: "Easy to clean; maintain grout lines.",
    application: "Interior",
    image: "/images/materials/ceramic.jpg",
    imageAlt: "White broken-tile mosaic with terracotta grout lines",
  },
  {
    slug: "porcelain",
    name: "Porcelain",
    code: "MT-04",
    description:
      "Dense, low-absorption tile available in large formats and convincing stone, concrete and timber looks.",
    uses: ["Floors", "Wet rooms", "Terraces", "Large-format walls"],
    care: "Highly stain-resistant; choose slip ratings by location.",
    application: "Interior & exterior",
    image: "/images/materials/porcelain.jpg",
    imageAlt: "A dark porcelain-tiled bathroom with a freestanding bath",
  },
  {
    slug: "wood",
    name: "Wood",
    code: "MT-05",
    description:
      "Engineered and solid timber bring warmth to floors, joinery and ceilings. Moisture control is essential.",
    uses: ["Flooring", "Joinery", "Wall panelling", "Decking"],
    care: "Acclimatise before installation; re-oil or re-lacquer as needed.",
    application: "Interior & exterior",
    image: "/images/materials/wood.jpg",
    imageAlt: "Pale weathered timber boards with visible grain",
  },
  {
    slug: "glass",
    name: "Glass",
    code: "MT-06",
    description:
      "From structural glazing to shower screens, glass brings in light while meeting safety and thermal requirements.",
    uses: ["Windows & façades", "Partitions", "Balustrades", "Shower screens"],
    care: "Specify toughened or laminated glass where required.",
    application: "Interior & exterior",
    image: "/images/materials/glass.jpg",
    imageAlt: "A reflective metal and glass commercial façade with blue fins",
  },
  {
    slug: "concrete",
    name: "Concrete",
    code: "MT-07",
    description:
      "The backbone of most structures — and, when detailed well, a refined finished surface in its own right.",
    uses: ["Structure", "Polished floors", "Exposed soffits", "Precast panels"],
    care: "Correct curing is critical; seal exposed finishes.",
    application: "Interior & exterior",
    image: "/images/materials/concrete.jpg",
    imageAlt: "A façade of large grey precast panels in shadow",
  },
  {
    slug: "stone",
    name: "Natural stone",
    code: "MT-08",
    description:
      "Limestone, sandstone and slate for cladding and landscaping, with a texture that improves as it weathers.",
    uses: ["Cladding", "Feature walls", "Garden walls", "Paving"],
    care: "Choose stone suited to the climate; seal where specified.",
    application: "Interior & exterior",
    image: "/images/materials/stone.jpg",
    imageAlt: "A wall of thin stacked beige stone",
  },
  {
    slug: "metal",
    name: "Metal",
    code: "MT-09",
    description:
      "Steel, aluminium and brass for structure, frames, balustrades and refined details.",
    uses: ["Structural steel", "Window frames", "Railings", "Hardware"],
    care: "Specify coatings for corrosion protection outdoors.",
    application: "Interior & exterior",
    image: "/images/materials/metal.jpg",
    imageAlt: "A brushed steel surface with fine directional grain",
  },
  {
    slug: "paint",
    name: "Paint finishes",
    code: "MT-10",
    description:
      "From flat mineral paints to textured plasters, the final coat depends on the preparation beneath it.",
    uses: ["Walls & ceilings", "Joinery", "Textured finishes", "Exterior coatings"],
    care: "Use washable finishes in high-traffic areas.",
    application: "Interior & exterior",
    image: "/images/materials/paint.jpg",
    imageAlt: "A white textured plaster wall surface",
  },
  {
    slug: "lighting",
    name: "Architectural lighting",
    code: "MT-11",
    description:
      "Light is a material too. Layered ambient, task and accent lighting shapes how every other finish is seen.",
    uses: ["Pendants", "Recessed downlights", "Linear LED", "Façade lighting"],
    care: "Specify warm colour temperatures and good colour rendering.",
    application: "Interior & exterior",
    image: "/images/materials/lighting.jpg",
    imageAlt: "A black cone pendant light glowing amber against a white ceiling",
  },
];

export const benefits = [
  {
    title: "Coordinated services",
    body: "Design, structure, services and finishes are planned together, so trades do not undo each other's work.",
  },
  {
    title: "Clear communication",
    body: "One point of contact, written decisions and plain-language explanations of every choice that affects cost or time.",
  },
  {
    title: "Organised scheduling",
    body: "A milestone programme shared from the start and updated as the project moves forward.",
  },
  {
    title: "Material & workmanship standards",
    body: "Samples approved before ordering, and work inspected at each stage before it is covered up.",
  },
  {
    title: "Detailed quotations",
    body: "Itemised pricing with inclusions, exclusions and assumptions stated — not a single number on a page.",
  },
  {
    title: "Progress reporting",
    body: "Regular updates with photos, so you can follow the build even when you cannot be on site.",
  },
  {
    title: "Professional coordination",
    body: "Procurement, deliveries, inspections and specialists managed as one plan.",
  },
  {
    title: "Transparent scope",
    body: "Changes are priced and agreed in writing before they happen, so the final account has no surprises.",
  },
];

export type Faq = { question: string; answer: string; topic: string };

export const faqs: Faq[] = [
  {
    topic: "Costs",
    question: "How much does construction cost?",
    answer:
      "It depends on location, size, structure, finishing level, site conditions and current material and labour prices. Our online estimator gives a preliminary range using example rates; a detailed quotation follows a site visit and an agreed scope.",
  },
  {
    topic: "Timelines",
    question: "How long does a typical project take?",
    answer:
      "Timelines vary with scope and approvals. A bathroom renovation may take a few weeks, while a new house usually takes many months. We agree a milestone programme before work starts and update it as the project progresses.",
  },
  {
    topic: "Materials",
    question: "Can I choose my own materials and finishes?",
    answer:
      "Yes. We provide a finishes schedule and arrange samples so you can compare options. You can also supply your own materials; we will advise on suitability and installation requirements.",
  },
  {
    topic: "Design",
    question: "Do you prepare architectural drawings?",
    answer:
      "Yes — from site surveys and 2D floor plans to coordinated architectural, structural and services drawings and 3D visualisations. Drawings can be prepared for approvals, pricing and construction.",
  },
  {
    topic: "Renovation",
    question: "Can you renovate while we continue living in the property?",
    answer:
      "Often, yes. We phase work, protect occupied areas and agree working hours. Some stages — such as major rewiring or structural work — may require parts of the home to be vacated temporarily.",
  },
  {
    topic: "Services",
    question: "Do you handle plumbing and electrical work?",
    answer:
      "Yes. Plumbing, electrical, HVAC and specialist systems are planned with the design, installed by qualified trades, and tested before being concealed.",
  },
  {
    topic: "Quotations",
    question: "What is included in a quotation?",
    answer:
      "An itemised breakdown of work, materials and allowances, with stated inclusions, exclusions and assumptions, plus a proposed payment schedule. Nothing is hidden in a single lump sum.",
  },
  {
    topic: "Payments",
    question: "How are payments structured?",
    answer:
      "Payments are typically tied to completed milestones agreed in the contract, rather than to dates. The exact schedule depends on the project and is confirmed in writing before work begins.",
  },
  {
    topic: "Site visits",
    question: "Do you visit the site before quoting?",
    answer:
      "Yes. A site visit is needed to measure, understand conditions and identify risks. Quotations prepared without one are clearly marked as preliminary.",
  },
  {
    topic: "Supervision",
    question: "Who supervises the work on site?",
    answer:
      "Each project has a designated coordinator responsible for the programme, quality checks and communication with you, supported by trade supervisors on site.",
  },
  {
    topic: "Warranties",
    question: "What warranties or workmanship policies apply?",
    answer:
      "Warranty terms depend on the contract and the products installed. Manufacturer warranties are passed on at handover, and our workmanship terms will be set out in your contract. We do not make guarantees that are not written into the agreement.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  project: string;
  /** Must be true — only verified client feedback should be published. */
  verified: true;
};

/**
 * Verified client testimonials. Intentionally empty: no genuine reviews have
 * been supplied yet, and the site must not publish invented ones.
 */
export const testimonials: Testimonial[] = [];
