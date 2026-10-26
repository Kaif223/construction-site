/**
 * Portfolio entries.
 *
 * IMPORTANT: these are concept projects used to demonstrate the site. They are
 * not completed client work. `status` is shown on every card and detail page,
 * and specifications are design-brief figures, not as-built measurements.
 * Replace with genuine projects (and genuine photography) before launch.
 */

export type ProjectCategory = "Residential" | "Commercial" | "Interiors" | "Outdoor";

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
  type: string;
  location: string | null;
  status: "Concept project";
  summary: string;
  description: string[];
  services: { label: string; categorySlug: string }[];
  specs: { label: string; value: string }[];
  materials: string[];
  cover: ProjectImage;
  gallery: ProjectImage[];
};

export const projectCategories: ProjectCategory[] = [
  "Residential",
  "Commercial",
  "Interiors",
  "Outdoor",
];

export const projects: Project[] = [
  {
    slug: "cedar-ridge-residence",
    number: "P-01",
    name: "Cedar Ridge Residence",
    category: "Residential",
    type: "Contemporary luxury residence",
    location: null,
    status: "Concept project",
    summary:
      "A two-storey residence of white planes and deep overhangs, arranged around a pool terrace that opens the living spaces to the garden.",
    description: [
      "Cedar Ridge is a design study for a family home that feels generous without being heavy. Two white volumes are stacked and offset, so the upper floor shades the glazed living spaces below and frames views towards the pool.",
      "The concept explores how structure, services and finishes can be coordinated from the first sketch: cantilevers sized with the structural engineer, concealed drainage behind the parapets, and a lighting scheme that turns the façade into a lantern at dusk.",
    ],
    services: [
      { label: "Architectural design", categorySlug: "planning-design" },
      { label: "Luxury villa construction", categorySlug: "complete-construction" },
      { label: "Swimming pools", categorySlug: "exterior-outdoor" },
      { label: "Lighting design", categorySlug: "electrical" },
    ],
    specs: [
      { label: "Covered area (brief)", value: "≈ 520 m² / 5,600 ft²" },
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
  },
  {
    slug: "linden-family-house",
    number: "P-02",
    name: "Linden Family House",
    category: "Residential",
    type: "Modern family home",
    location: null,
    status: "Concept project",
    summary:
      "A practical family home that pairs a timber-clad volume with white render and a planted front garden.",
    description: [
      "Linden explores how a modest plot can hold a calm, light-filled family home. A timber-clad box marks the entrance and stair, while the white wings contain bedrooms above and an open kitchen and living space below.",
      "The concept prioritises everyday durability: hard-wearing floors, generous storage, and services routed so they can be maintained without opening finished walls.",
    ],
    services: [
      { label: "Residential planning", categorySlug: "planning-design" },
      { label: "New house construction", categorySlug: "complete-construction" },
      { label: "Kitchen installation", categorySlug: "interior-finishing" },
      { label: "Complete house electrical", categorySlug: "electrical" },
    ],
    specs: [
      { label: "Covered area (brief)", value: "≈ 280 m² / 3,000 ft²" },
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
  },
  {
    slug: "meridian-workplace",
    number: "P-03",
    name: "Meridian Workplace",
    category: "Commercial",
    type: "Commercial office fit-out",
    location: null,
    status: "Concept project",
    summary:
      "An open, light-filled office with exposed concrete soffits, glazed meeting rooms and coordinated services.",
    description: [
      "Meridian is a workplace concept built around daylight and flexibility. The ceiling is left exposed to gain height, which means every duct, cable tray and light fitting has to be planned and installed as part of the architecture.",
      "Glazed meeting rooms line the core, acoustic finishes keep the open floor comfortable, and power and data run through floor boxes so the layout can change without rewiring.",
    ],
    services: [
      { label: "Space planning", categorySlug: "planning-design" },
      { label: "Offices & retail spaces", categorySlug: "complete-construction" },
      { label: "HVAC planning", categorySlug: "hvac-mechanical" },
      { label: "Data & networking cabling", categorySlug: "electrical" },
    ],
    specs: [
      { label: "Floor area (brief)", value: "≈ 900 m² / 9,700 ft²" },
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
  },
  {
    slug: "travertine-bath-suite",
    number: "P-04",
    name: "Travertine Bath Suite",
    category: "Interiors",
    type: "Luxury bathroom renovation",
    location: null,
    status: "Concept project",
    summary:
      "A calm, stone-lined bathroom with a freestanding tub, walk-in shower and concealed fittings.",
    description: [
      "This concept transforms a dated bathroom into a quiet, spa-like room. Waterproofing and falls are resolved before a single tile is set, so the walk-in shower can drain through a discreet linear channel.",
      "Tiles are set out from the centre line of the window and bath, so cuts land at the edges and every joint aligns from wall to floor.",
    ],
    services: [
      { label: "Bathroom renovation", categorySlug: "renovation-maintenance" },
      { label: "Bathroom plumbing", categorySlug: "plumbing-water" },
      { label: "Natural stone installation", categorySlug: "interior-finishing" },
      { label: "Waterproofing", categorySlug: "renovation-maintenance" },
    ],
    specs: [
      { label: "Room size (brief)", value: "≈ 14 m² / 150 ft²" },
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
  },
  {
    slug: "atrium-stone-floors",
    number: "P-05",
    name: "Atrium Stone Floors",
    category: "Interiors",
    type: "Marble & stone installation",
    location: null,
    status: "Concept project",
    summary:
      "A study in natural stone — veined marble, patterned floors and stacked stone feature walls.",
    description: [
      "Atrium is a materials concept for an entrance hall and living space finished in natural stone. Slabs are dry-laid and photographed before installation so the veining flows across the floor rather than stopping at every joint.",
      "The study covers substrate preparation, movement joints, sealing and protection — the unglamorous steps that decide whether stone still looks right after ten years.",
    ],
    services: [
      { label: "Marble installation", categorySlug: "interior-finishing" },
      { label: "Natural stone installation", categorySlug: "interior-finishing" },
      { label: "Stone cladding", categorySlug: "exterior-outdoor" },
      { label: "Flooring installation", categorySlug: "interior-finishing" },
    ],
    specs: [
      { label: "Stone area (brief)", value: "≈ 160 m² / 1,720 ft²" },
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
  },
  {
    slug: "oak-quartz-kitchen",
    number: "P-06",
    name: "Oak & Quartz Kitchen",
    category: "Interiors",
    type: "Modern kitchen",
    location: null,
    status: "Concept project",
    summary:
      "A bright kitchen with a monolithic island, oak joinery and pendant lighting over the worktop.",
    description: [
      "The kitchen concept centres on a single island that works as prep space, breakfast bar and social hub. Plumbing, power and extraction are planned into the island from the start, so nothing is surface-mounted later.",
      "Tall oak joinery hides appliances and storage, while warm pendant light and under-cabinet LEDs give the worktops even, shadow-free lighting.",
    ],
    services: [
      { label: "Kitchen renovation", categorySlug: "renovation-maintenance" },
      { label: "Custom cabinetry", categorySlug: "interior-finishing" },
      { label: "Kitchen plumbing", categorySlug: "plumbing-water" },
      { label: "Lighting design", categorySlug: "electrical" },
    ],
    specs: [
      { label: "Kitchen area (brief)", value: "≈ 32 m² / 345 ft²" },
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
  },
  {
    slug: "northgate-commercial",
    number: "P-07",
    name: "Northgate Commercial",
    category: "Commercial",
    type: "Commercial building",
    location: null,
    status: "Concept project",
    summary:
      "A mid-rise commercial building with a metallic rainscreen façade and active ground floor.",
    description: [
      "Northgate is a concept for a mixed commercial building where the façade does real work: a ventilated metal rainscreen protects the insulation, and coloured fins shade the glazing on the sunniest elevations.",
      "The concept looks at sequencing a frame, envelope and fit-out so tenants can move in floor by floor, with fire safety, lifts and access control coordinated from the outset.",
    ],
    services: [
      { label: "Commercial architectural design", categorySlug: "planning-design" },
      { label: "Commercial buildings", categorySlug: "complete-construction" },
      { label: "Fire safety systems", categorySlug: "specialist-systems" },
      { label: "Lift & elevator coordination", categorySlug: "specialist-systems" },
    ],
    specs: [
      { label: "Gross area (brief)", value: "≈ 6,500 m² / 70,000 ft²" },
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
  },
  {
    slug: "garden-pavilion",
    number: "P-08",
    name: "Garden Pavilion",
    category: "Outdoor",
    type: "Landscape & outdoor living",
    location: null,
    status: "Concept project",
    summary:
      "An outdoor living concept with an infinity-edge pool, terraces, planting and evening lighting.",
    description: [
      "Garden Pavilion treats the garden as a series of outdoor rooms: a pool terrace, a shaded dining area and planted edges that soften the architecture.",
      "Every surface is designed for drainage first — falls, channels and permeable paving — then for comfort, with slip-resistant stone and low-glare lighting along every path.",
    ],
    services: [
      { label: "Landscape design", categorySlug: "planning-design" },
      { label: "Swimming pools", categorySlug: "exterior-outdoor" },
      { label: "Outdoor lighting", categorySlug: "exterior-outdoor" },
      { label: "Pergolas & outdoor structures", categorySlug: "exterior-outdoor" },
    ],
    specs: [
      { label: "Site area (brief)", value: "≈ 1,200 m² / 12,900 ft²" },
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
