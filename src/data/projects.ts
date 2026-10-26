/**
 * Portfolio entries.
 *
 * IMPORTANT: these are concept projects used to demonstrate the site. They are
 * not completed client work, so they have no country, city or timeline. Their
 * status is shown on every card and detail page, and areas and specifications
 * are design-brief figures, not as-built measurements. Replace with genuine
 * projects (and genuine photography) before launch.
 *
 * Arabic text for each project lives in src/content/ar/projects.ts.
 */

export type ProjectCategory = "residential" | "commercial" | "interiors" | "outdoor";

export type ProjectImage = {
  src: string;
  alt: string;
  /** Width / height ratio used to reserve layout space. */
  ratio: number;
};

export type Project = {
  slug: string;
  number: string;
  name: string;
  category: ProjectCategory;
  classification: "residential" | "commercial";
  type: string;
  /** ISO country code and city. null for concept projects, which have no real location. */
  country: string | null;
  city: string | null;
  status: "concept" | "in-progress" | "completed";
  /** Verified dates only, e.g. { start: "2025-03", end: "2026-01" }. */
  timeline: { start: string; end: string | null } | null;
  /** Area from the brief (concept) or as built (completed). */
  area: { value: number; unit: "sqm" | "sqft"; kind: "covered" | "floor" | "room" | "site" | "stone" } | null;
  summary: string;
  description: string[];
  /** Service ids from src/data/services.ts. */
  services: string[];
  specs: { label: string; value: string }[];
  materials: string[];
  cover: ProjectImage;
  gallery: ProjectImage[];
  /** Genuine before/after pair of the same view, when available. */
  beforeAfter: { before: ProjectImage; after: ProjectImage } | null;
};

export const projectCategories: ProjectCategory[] = ["residential", "commercial", "interiors", "outdoor"];

export const projects: Project[] = [
  {
    slug: "cedar-ridge-residence",
    number: "P-01",
    name: "Cedar Ridge Residence",
    category: "residential",
    classification: "residential",
    type: "Contemporary luxury residence",
    country: null,
    city: null,
    status: "concept",
    timeline: null,
    area: { value: 520, unit: "sqm", kind: "covered" },
    summary:
      "A two-storey residence of white planes and deep overhangs, arranged around a pool terrace that opens the living spaces to the garden.",
    description: [
      "Cedar Ridge is a design study for a family home that feels generous without being heavy. Two white volumes are stacked and offset, so the upper floor shades the glazed living spaces below and frames views towards the pool.",
      "The concept explores how structure, services and finishes can be coordinated from the first sketch: cantilevers sized with the structural engineer, concealed drainage behind the parapets, and a lighting scheme that turns the façade into a lantern at dusk.",
    ],
    services: ["architectural-design", "luxury-villa-construction", "swimming-pools", "lighting-design-and-installation"],
    specs: [
      { label: "Floors", value: "2 + roof terrace" },
      { label: "Structure", value: "Reinforced concrete frame" },
      { label: "Pool", value: "≈ 14 × 4 m" },
    ],
    materials: ["White render", "Porcelain terrace tiles", "Aluminium glazing", "Oak interiors"],
    cover: {
      src: "/images/projects/cedar-ridge-1.jpg",
      alt: "A white two-storey modern villa with a rectangular pool and loungers in the foreground",
      ratio: 3 / 2,
    },
    gallery: [
      {
        src: "/images/projects/cedar-ridge-2.jpg",
        alt: "A modern white house with timber soffits reflected in a pool with dark tile stripes",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/cedar-ridge-3.jpg",
        alt: "A white modern villa with pool, terrace furniture and palm planting",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/cedar-ridge-4.jpg",
        alt: "An open-plan living room with a grey sofa, timber feature wall and floor-to-ceiling glazing",
        ratio: 3 / 2,
      },
    ],
    beforeAfter: null,
  },
  {
    slug: "linden-family-house",
    number: "P-02",
    name: "Linden Family House",
    category: "residential",
    classification: "residential",
    type: "Modern family home",
    country: null,
    city: null,
    status: "concept",
    timeline: null,
    area: { value: 280, unit: "sqm", kind: "covered" },
    summary:
      "A practical family home that pairs a timber-clad volume with white render and a planted front garden.",
    description: [
      "Linden explores how a modest plot can hold a calm, light-filled family home. A timber-clad box marks the entrance and stair, while the white wings contain bedrooms above and an open kitchen and living space below.",
      "The concept prioritises everyday durability: hard-wearing floors, generous storage, and services routed so they can be maintained without opening finished walls.",
    ],
    services: ["residential-planning", "new-house-construction", "kitchen-installation", "complete-house-electrical-installation"],
    specs: [
      { label: "Floors", value: "2" },
      { label: "Bedrooms", value: "4" },
      { label: "Cladding", value: "Vertical timber + render" },
    ],
    materials: ["Thermally modified timber", "Mineral render", "Engineered oak", "Quartz worktops"],
    cover: {
      src: "/images/projects/linden-house-1.jpg",
      alt: "A two-storey modern home with a timber-clad central volume, white render and dark window frames",
      ratio: 3 / 2,
    },
    gallery: [
      {
        src: "/images/projects/linden-house-2.jpg",
        alt: "Close view of the timber-clad volume and stepping-stone path of a modern family home",
        ratio: 4 / 3,
      },
      {
        src: "/images/projects/linden-house-3.jpg",
        alt: "A bright living room with a floating timber stair, grey sofas and a dog resting on the rug",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/linden-house-4.jpg",
        alt: "A dark grey-green kitchen with white worktops and open shelving",
        ratio: 4 / 3,
      },
    ],
    beforeAfter: null,
  },
  {
    slug: "meridian-workplace",
    number: "P-03",
    name: "Meridian Workplace",
    category: "commercial",
    classification: "commercial",
    type: "Commercial office fit-out",
    country: null,
    city: null,
    status: "concept",
    timeline: null,
    area: { value: 900, unit: "sqm", kind: "floor" },
    summary:
      "An open, light-filled office with exposed concrete soffits, glazed meeting rooms and coordinated services.",
    description: [
      "Meridian is a workplace concept built around daylight and flexibility. The ceiling is left exposed to gain height, which means every duct, cable tray and light fitting has to be planned and installed as part of the architecture.",
      "Glazed meeting rooms line the core, acoustic finishes keep the open floor comfortable, and power and data run through floor boxes so the layout can change without rewiring.",
    ],
    services: ["space-planning", "offices-and-retail-spaces", "hvac-planning", "data-and-networking-cabling"],
    specs: [
      { label: "Workstations", value: "≈ 90" },
      { label: "Ceiling", value: "Exposed concrete soffit" },
      { label: "Meeting rooms", value: "6 glazed rooms" },
    ],
    materials: ["Polished concrete", "Glazed partitions", "Acoustic panels", "Black steel"],
    cover: {
      src: "/images/projects/meridian-1.jpg",
      alt: "A long open-plan office corridor with grey floors, glazed rooms and pendant lights",
      ratio: 3 / 2,
    },
    gallery: [
      {
        src: "/images/projects/meridian-2.jpg",
        alt: "An open office with a concrete ceiling, long timber table and full-height windows",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/meridian-3.jpg",
        alt: "Looking up at dark glass office towers converging against the sky",
        ratio: 3 / 2,
      },
    ],
    beforeAfter: null,
  },
  {
    slug: "travertine-bath-suite",
    number: "P-04",
    name: "Travertine Bath Suite",
    category: "interiors",
    classification: "residential",
    type: "Luxury bathroom renovation",
    country: null,
    city: null,
    status: "concept",
    timeline: null,
    area: { value: 14, unit: "sqm", kind: "room" },
    summary:
      "A calm, stone-lined bathroom with a freestanding tub, walk-in shower and concealed fittings.",
    description: [
      "This concept transforms a dated bathroom into a quiet, spa-like room. Waterproofing and falls are resolved before a single tile is set, so the walk-in shower can drain through a discreet linear channel.",
      "Tiles are set out from the centre line of the window and bath, so cuts land at the edges and every joint aligns from wall to floor.",
    ],
    services: ["bathroom-renovation", "bathroom-plumbing", "natural-stone-installation", "waterproofing"],
    specs: [
      { label: "Tile format", value: "600 × 1200 mm" },
      { label: "Shower", value: "Level-access, linear drain" },
      { label: "Heating", value: "Electric underfloor" },
    ],
    materials: ["Honed travertine", "Large-format porcelain", "Brushed nickel", "Clear glass"],
    cover: {
      src: "/images/projects/travertine-1.jpg",
      alt: "A bright bathroom with a freestanding white bath, vessel basin and a large window",
      ratio: 3 / 2,
    },
    gallery: [
      {
        src: "/images/projects/travertine-2.jpg",
        alt: "A dark porcelain-tiled bathroom with a freestanding bath and walk-in shower",
        ratio: 2 / 3,
      },
      {
        src: "/images/projects/travertine-3.jpg",
        alt: "A bathroom with a glass shower enclosure, wooden vanity and round mirror",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/travertine-4.jpg",
        alt: "A freestanding bath with plants beside a textured stone wall",
        ratio: 3 / 2,
      },
    ],
    beforeAfter: null,
  },
  {
    slug: "atrium-stone-floors",
    number: "P-05",
    name: "Atrium Stone Floors",
    category: "interiors",
    classification: "residential",
    type: "Marble & stone installation",
    country: null,
    city: null,
    status: "concept",
    timeline: null,
    area: { value: 160, unit: "sqm", kind: "stone" },
    summary:
      "A study in natural stone — veined marble, patterned floors and stacked stone feature walls.",
    description: [
      "Atrium is a materials concept for an entrance hall and living space finished in natural stone. Slabs are dry-laid and photographed before installation so the veining flows across the floor rather than stopping at every joint.",
      "The study covers substrate preparation, movement joints, sealing and protection — the unglamorous steps that decide whether stone still looks right after ten years.",
    ],
    services: ["marble-installation", "natural-stone-installation", "stone-cladding", "flooring-installation"],
    specs: [
      { label: "Slab thickness", value: "20 mm" },
      { label: "Finish", value: "Honed + sealed" },
      { label: "Feature wall", value: "Stacked natural stone" },
    ],
    materials: ["Veined marble", "Geometric stone inlay", "Stacked stone", "Granite thresholds"],
    cover: {
      src: "/images/projects/atrium-stone-1.jpg",
      alt: "Close-up of white marble with bold charcoal veining",
      ratio: 3 / 2,
    },
    gallery: [
      {
        src: "/images/projects/atrium-stone-2.jpg",
        alt: "A bright living room with exposed timber beams, arched windows and a light timber floor",
        ratio: 1,
      },
      {
        src: "/images/projects/atrium-stone-3.jpg",
        alt: "A geometric floor of black, white and amber stone in a tumbling-block pattern",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/atrium-stone-4.jpg",
        alt: "A feature wall of thin, stacked beige natural stone",
        ratio: 3 / 2,
      },
    ],
    beforeAfter: null,
  },
  {
    slug: "oak-quartz-kitchen",
    number: "P-06",
    name: "Oak & Quartz Kitchen",
    category: "interiors",
    classification: "residential",
    type: "Modern kitchen",
    country: null,
    city: null,
    status: "concept",
    timeline: null,
    area: { value: 32, unit: "sqm", kind: "room" },
    summary:
      "A bright kitchen with a monolithic island, oak joinery and pendant lighting over the worktop.",
    description: [
      "The kitchen concept centres on a single island that works as prep space, breakfast bar and social hub. Plumbing, power and extraction are planned into the island from the start, so nothing is surface-mounted later.",
      "Tall oak joinery hides appliances and storage, while warm pendant light and under-cabinet LEDs give the worktops even, shadow-free lighting.",
    ],
    services: ["kitchen-renovation", "custom-cabinetry", "kitchen-plumbing", "lighting-design-and-installation"],
    specs: [
      { label: "Island", value: "≈ 3.2 × 1.1 m" },
      { label: "Worktop", value: "20 mm quartz" },
      { label: "Joinery", value: "Oak veneer, push-to-open" },
    ],
    materials: ["Quartz", "Oak veneer", "Matte black fittings", "Porcelain splashback"],
    cover: {
      src: "/images/projects/oak-quartz-1.jpg",
      alt: "A modern kitchen with a white island, timber stools, oak cabinets and three black pendant lights",
      ratio: 3 / 2,
    },
    gallery: [
      {
        src: "/images/projects/oak-quartz-2.jpg",
        alt: "A white kitchen with marble-look worktops, hexagon tile splashback and range cooker",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/oak-quartz-3.jpg",
        alt: "A kitchen island with a gold tap, glass pendants and wooden bar stools",
        ratio: 2 / 3,
      },
      {
        src: "/images/projects/oak-quartz-4.jpg",
        alt: "A white kitchen with wire pendant lights, a large island and patterned tile splashback",
        ratio: 3 / 2,
      },
    ],
    beforeAfter: null,
  },
  {
    slug: "northgate-commercial",
    number: "P-07",
    name: "Northgate Commercial",
    category: "commercial",
    classification: "commercial",
    type: "Commercial building",
    country: null,
    city: null,
    status: "concept",
    timeline: null,
    area: { value: 6500, unit: "sqm", kind: "floor" },
    summary:
      "A mid-rise commercial building with a metallic rainscreen façade and active ground floor.",
    description: [
      "Northgate is a concept for a mixed commercial building where the façade does real work: a ventilated metal rainscreen protects the insulation, and coloured fins shade the glazing on the sunniest elevations.",
      "The concept looks at sequencing a frame, envelope and fit-out so tenants can move in floor by floor, with fire safety, lifts and access control coordinated from the outset.",
    ],
    services: ["commercial-architectural-design", "commercial-buildings", "fire-safety-systems", "lift-and-elevator-coordination"],
    specs: [
      { label: "Floors", value: "5 + basement" },
      { label: "Façade", value: "Metal rainscreen + glazing" },
      { label: "Frame", value: "Post-tensioned concrete" },
    ],
    materials: ["Aluminium rainscreen", "Double glazing", "Exposed concrete", "Steel canopies"],
    cover: {
      src: "/images/projects/northgate-1.jpg",
      alt: "A modern commercial building with a reflective metallic façade and blue fins at sunset",
      ratio: 3 / 2,
    },
    gallery: [
      {
        src: "/images/projects/northgate-2.jpg",
        alt: "A sculptural white building with angular glass and panel façade",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/northgate-3.jpg",
        alt: "An apartment building façade with dark cladding, balconies and an orange side wall",
        ratio: 3 / 2,
      },
    ],
    beforeAfter: null,
  },
  {
    slug: "garden-pavilion",
    number: "P-08",
    name: "Garden Pavilion",
    category: "outdoor",
    classification: "residential",
    type: "Landscape & outdoor living",
    country: null,
    city: null,
    status: "concept",
    timeline: null,
    area: { value: 1200, unit: "sqm", kind: "site" },
    summary:
      "An outdoor living concept with an infinity-edge pool, terraces, planting and evening lighting.",
    description: [
      "Garden Pavilion treats the garden as a series of outdoor rooms: a pool terrace, a shaded dining area and planted edges that soften the architecture.",
      "Every surface is designed for drainage first — falls, channels and permeable paving — then for comfort, with slip-resistant stone and low-glare lighting along every path.",
    ],
    services: ["landscape-design", "swimming-pools", "outdoor-lighting", "pergolas-and-outdoor-structures"],
    specs: [
      { label: "Pool", value: "Infinity edge, ≈ 12 × 5 m" },
      { label: "Terraces", value: "3 levels" },
      { label: "Lighting", value: "Low-level LED, zoned" },
    ],
    materials: ["Porcelain pavers", "Natural stone walls", "Hardwood decking", "Mosaic pool finish"],
    cover: {
      src: "/images/projects/garden-pavilion-1.jpg",
      alt: "A modern house with an infinity-edge pool and lawn in the foreground",
      ratio: 3 / 2,
    },
    gallery: [
      {
        src: "/images/projects/garden-pavilion-2.jpg",
        alt: "A white single-storey home with a pool, timber deck and tropical planting",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/garden-pavilion-3.jpg",
        alt: "A garden path lined with clipped hedges and flowering roses",
        ratio: 3 / 2,
      },
      {
        src: "/images/projects/garden-pavilion-4.jpg",
        alt: "A pool surrounded by stone walls, loungers and dense planting",
        ratio: 3 / 2,
      },
    ],
    beforeAfter: null,
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { previous, next };
}
