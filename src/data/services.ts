import { slugify } from "@/lib/slugify";

export type ServiceItem = {
  id: string;
  name: string;
  summary: string;
};

export type ServiceCategory = {
  slug: string;
  code: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  intro: string;
  image: string;
  imageAlt: string;
  deliverables: string[];
  relatedProjects: string[];
  services: ServiceItem[];
};

type Raw = Omit<ServiceCategory, "services"> & { services: [string, string][] };

const raw: Raw[] = [
  {
    slug: "planning-design",
    code: "A",
    number: "01",
    title: "Planning & Design",
    shortTitle: "Design & Architecture",
    summary:
      "Architecture, engineering and visualisation that turn an idea into buildable, budgeted drawings.",
    intro:
      "Good buildings are decided long before the first excavation. Our planning team brings architects, structural and civil engineers, interior and landscape designers into one conversation, so the drawings you approve are coordinated, buildable and priced with realistic assumptions.",
    image: "/images/services/planning-design.jpg",
    imageAlt: "An architect marking up a printed building plan with a scale ruler",
    deliverables: [
      "Measured site survey and assessment report",
      "Concept, layout and elevation drawings",
      "Structural and services coordination",
      "3D visualisations for key spaces",
      "Preliminary budget and feasibility notes",
    ],
    relatedProjects: ["cedar-ridge-residence", "linden-family-house"],
    services: [
      ["Architectural design", "Concept-to-detail architecture shaped around how you will actually live or work."],
      ["Residential planning", "Room relationships, light, circulation and future flexibility for homes of every size."],
      ["Commercial architectural design", "Efficient, compliant layouts for offices, retail and mixed-use buildings."],
      ["Structural engineering", "Calculations and structural drawings for foundations, frames, slabs and roofs."],
      ["Civil engineering", "Grading, drainage, access and external works designed around the site."],
      ["Site surveys", "Measured surveys capturing boundaries, levels and existing structures."],
      ["Land & site assessment", "Early review of soil, access, orientation and constraints before you commit."],
      ["Building plans & drawings", "Coordinated drawing sets for approvals, pricing and construction."],
      ["2D floor plans", "Clear, dimensioned plans that make layout decisions easy to compare."],
      ["3D architectural visualisation", "Photorealistic views that let you walk through the design before it is built."],
      ["Interior design", "Material palettes, joinery, lighting and furniture planning for finished interiors."],
      ["Landscape design", "Gardens, terraces and planting plans that extend the architecture outdoors."],
      ["Space planning", "Optimised layouts for homes, offices and retail floors."],
      ["Construction consultancy", "Independent advice on methods, sequencing, contracts and risk."],
      ["Feasibility & preliminary budgeting", "Early cost ranges and options so the brief matches the budget."],
    ],
  },
  {
    slug: "complete-construction",
    code: "B",
    number: "02",
    title: "Complete Construction",
    shortTitle: "Complete Construction",
    summary:
      "New homes, villas, apartments and commercial buildings — from excavation to roof.",
    intro:
      "We manage the full build: groundworks, structure, envelope and roof, with one coordinated programme and one point of responsibility. Each stage is inspected before the next begins, so quality is built in rather than checked at the end.",
    image: "/images/services/construction.jpg",
    imageAlt: "A site team in high-visibility vests standing on a newly poured concrete slab",
    deliverables: [
      "Construction programme with milestones",
      "Stage-by-stage quality inspections",
      "Weekly progress reporting",
      "Coordinated trades under one contract",
    ],
    relatedProjects: ["cedar-ridge-residence", "northgate-commercial", "linden-family-house"],
    services: [
      ["New house construction", "Complete construction of new family homes from foundation to handover."],
      ["Luxury villa construction", "High-specification villas with exacting detailing and finishes."],
      ["Residential buildings", "Low- and mid-rise residential blocks built to a coordinated programme."],
      ["Apartments & multi-unit housing", "Efficient construction of repeatable, well-detailed units."],
      ["Commercial buildings", "Shells and fit-outs for commercial and mixed-use developments."],
      ["Offices & retail spaces", "Workplaces and storefronts delivered around business timelines."],
      ["Warehouses & industrial buildings", "Large-span structures, slabs and loading areas."],
      ["Foundations & excavation", "Setting out, excavation and foundations engineered for the soil conditions."],
      ["Structural framing", "Concrete, steel or timber frames built to the structural design."],
      ["Brickwork & masonry", "Load-bearing and infill masonry with clean, consistent coursing."],
      ["Concrete work", "Slabs, columns, beams and retaining walls, poured and cured correctly."],
      ["Reinforcement & formwork", "Accurate steel fixing and formwork that leaves crisp concrete faces."],
      ["Roof construction", "Flat and pitched roofs, insulated and detailed against weather."],
      ["Waterproofing & damp protection", "Membranes, tanking and damp-proof courses where water is a risk."],
      ["Boundary walls & gates", "Secure, well-proportioned boundaries that suit the architecture."],
      ["Driveways & paving", "Durable driveways with correct sub-base, falls and drainage."],
      ["Extensions & additional floors", "Structurally assessed extensions and vertical additions."],
    ],
  },
  {
    slug: "interior-finishing",
    code: "C",
    number: "03",
    title: "Interior Finishing",
    shortTitle: "Interior Finishing",
    summary:
      "Stone, tile, timber, joinery, ceilings and paint — the details you touch every day.",
    intro:
      "Finishing is where precision becomes visible. Our finishing teams set out stone and tile from a planned grid, coordinate joinery with services, and protect completed work until handover, so every surface arrives clean and aligned.",
    image: "/images/services/interior-finishing.jpg",
    imageAlt: "A double-height living room with timber stair, white walls and large windows",
    deliverables: [
      "Finishes schedule and sample approvals",
      "Set-out drawings for stone and tile",
      "Joinery shop drawings",
      "Snagging list and final clean",
    ],
    relatedProjects: ["atrium-stone-floors", "oak-quartz-kitchen", "travertine-bath-suite"],
    services: [
      ["Marble installation", "Book-matched and planned marble floors, walls and vanities."],
      ["Granite installation", "Hard-wearing granite for kitchens, stairs and high-traffic floors."],
      ["Natural stone installation", "Limestone, travertine and slate laid with careful set-out."],
      ["Ceramic tile installation", "Wall and floor tiling with straight joints and correct falls."],
      ["Porcelain tile installation", "Large-format porcelain installed flat with levelling systems."],
      ["Bathroom finishing", "Tiling, sanitaryware, glass and fittings for finished bathrooms."],
      ["Kitchen finishing", "Worktops, splashbacks and cabinetry finishing details."],
      ["Flooring installation", "Prepared screeds and finished floors in every material."],
      ["Wooden flooring", "Engineered and solid timber floors with proper acclimatisation."],
      ["Ceiling design", "Ceilings planned around lighting, acoustics and services."],
      ["False ceilings", "Suspended ceilings that conceal services while keeping access."],
      ["Gypsum work", "Partitions, bulkheads and cornices in gypsum board."],
      ["Wall panelling", "Timber, fabric and decorative panelling with concealed fixings."],
      ["Decorative wall finishes", "Lime plaster, micro-cement and textured specialist finishes."],
      ["Painting & polishing", "Prepared, primed and evenly finished paintwork and polished surfaces."],
      ["Wallpaper installation", "Pattern-matched wallcoverings on properly prepared walls."],
      ["Doors & windows", "Supply and installation of internal doors and window systems."],
      ["Aluminium & glass work", "Glazed partitions, shower screens and aluminium frames."],
      ["Wardrobes & built-in storage", "Built-in storage designed to the millimetre."],
      ["Custom cabinetry", "Made-to-measure joinery for living, working and storage spaces."],
      ["Kitchen installation", "Complete kitchen fitting coordinated with plumbing and electrical work."],
    ],
  },
  {
    slug: "electrical",
    code: "D",
    number: "04",
    title: "Electrical Services",
    shortTitle: "Electrical",
    summary:
      "Safe, well-planned power, lighting, solar, security and data — installed and tested.",
    intro:
      "Electrical work is planned with the architecture, not after it. We design circuits, lighting and data routes alongside the layout, install to the applicable regulations, and test and document every circuit before handover.",
    image: "/images/services/electrical.jpg",
    imageAlt: "An electrician in a hard hat and gloves working on an exterior electrical box",
    deliverables: [
      "Electrical layout and lighting plan",
      "Load calculations for main boards",
      "Test results and circuit schedule",
      "As-installed drawings",
    ],
    relatedProjects: ["meridian-workplace", "linden-family-house"],
    services: [
      ["Complete house electrical installation", "Full electrical systems for new homes and full renovations."],
      ["Electrical wiring", "New wiring and rewiring with properly sized, protected circuits."],
      ["Switches & sockets", "Well-placed outlets and controls, installed level and secure."],
      ["Lighting design & installation", "Layered lighting schemes for function, mood and architecture."],
      ["Interior & exterior lighting", "Fixtures inside and out, including façade and garden lighting."],
      ["Distribution boards", "Correctly rated consumer units and sub-distribution boards."],
      ["Circuit protection", "Breakers and residual-current protection matched to each circuit."],
      ["Earthing & grounding", "Earthing systems installed and tested for safety."],
      ["Electrical inspection", "Condition reports for existing installations."],
      ["Backup power systems", "Generator and battery backup for essential circuits."],
      ["Solar panel installation", "Roof and ground-mounted solar arrays with safe isolation."],
      ["Inverter installation", "Inverter systems integrated with solar and backup supplies."],
      ["Smart-home wiring", "Structured wiring for automation, lighting control and sensors."],
      ["Security & CCTV installation", "Camera, alarm and intercom cabling and equipment."],
      ["Data & networking cabling", "Structured data cabling and Wi-Fi infrastructure."],
    ],
  },
  {
    slug: "plumbing-water",
    code: "E",
    number: "05",
    title: "Plumbing & Water Systems",
    shortTitle: "Plumbing & Water",
    summary:
      "Supply, drainage, hot water and sanitaryware — pressure-tested before it is hidden.",
    intro:
      "Most plumbing disappears behind walls and floors, so we test it before it does. Supply and drainage are routed with access in mind, pressure-tested, photographed and recorded, giving you a reference for any future maintenance.",
    image: "/images/services/plumbing.jpg",
    imageAlt: "Grey water supply pipes, valves and meters mounted on a red brick wall",
    deliverables: [
      "Plumbing and drainage layout",
      "Pressure-test records",
      "Photo record of concealed pipework",
      "Fixture and valve schedule",
    ],
    relatedProjects: ["travertine-bath-suite", "oak-quartz-kitchen"],
    services: [
      ["Complete plumbing installation", "Whole-building supply, waste and fixture installation."],
      ["Water supply systems", "Mains connection, distribution and pressure management."],
      ["Drainage systems", "Foul and surface drainage designed with correct falls."],
      ["Bathroom plumbing", "Concealed systems, mixers and drainage for bathrooms."],
      ["Kitchen plumbing", "Sinks, appliances and filtration connections."],
      ["Pipe installation & replacement", "New pipework and replacement of corroded or failing lines."],
      ["Water tank installation", "Overhead and underground storage tanks."],
      ["Water pump installation", "Booster and transfer pumps sized to demand."],
      ["Water filtration systems", "Whole-house and point-of-use filtration."],
      ["Sanitary fixture installation", "WCs, basins and fittings installed level and sealed."],
      ["Shower & bathtub installation", "Walk-in showers, trays and freestanding baths."],
      ["Leak detection & repair", "Locating and repairing leaks with minimal disruption."],
      ["Sewer & drainage maintenance", "Clearing, inspection and repair of drainage runs."],
      ["Rainwater drainage", "Gutters, downpipes and surface water management."],
      ["Hot-water systems", "Cylinders, instantaneous heaters and solar hot water."],
    ],
  },
  {
    slug: "hvac-mechanical",
    code: "F",
    number: "06",
    title: "HVAC & Mechanical",
    shortTitle: "HVAC & Mechanical",
    summary:
      "Cooling, heating and ventilation planned with the building, not added afterwards.",
    intro:
      "Comfortable buildings depend on air that is properly planned. We size equipment to the space, route ductwork around the structure and ceilings, and commission systems so they run efficiently from day one.",
    image: "/images/services/hvac-mechanical.jpg",
    imageAlt: "An open-plan office with exposed concrete ceiling and visible services",
    deliverables: [
      "Load assessment and equipment sizing",
      "Duct and pipe routing drawings",
      "Commissioning records",
      "Maintenance schedule",
    ],
    relatedProjects: ["meridian-workplace", "northgate-commercial"],
    services: [
      ["Air conditioning installation", "Split, multi-split and ducted systems installed and commissioned."],
      ["HVAC planning", "System selection and sizing based on the building and its use."],
      ["Ventilation systems", "Fresh-air and heat-recovery ventilation for healthy interiors."],
      ["Exhaust systems", "Kitchen, bathroom and plant-room extraction."],
      ["Heating solutions", "Underfloor heating, radiators and heat pumps."],
      ["Ductwork", "Insulated, sealed ductwork coordinated with ceilings and structure."],
      ["Mechanical equipment installation", "Plant, pumps and fans placed for access and acoustics."],
      ["Preventive maintenance", "Scheduled servicing to keep systems efficient and reliable."],
    ],
  },
  {
    slug: "renovation-maintenance",
    code: "G",
    number: "07",
    title: "Renovation & Maintenance",
    shortTitle: "Renovation & Restoration",
    summary:
      "Whole-home and commercial renovations, structural repairs and ongoing care.",
    intro:
      "Renovation starts with understanding what is already there. We investigate before we demolish, protect the parts of a building that are worth keeping, and phase the work so homes and businesses can keep functioning where possible.",
    image: "/images/services/renovation.jpg",
    imageAlt: "A room mid-renovation with exposed brick, timber props and stripped walls",
    deliverables: [
      "Condition survey before work starts",
      "Phased renovation plan",
      "Protection of retained finishes",
      "Maintenance recommendations at handover",
    ],
    relatedProjects: ["travertine-bath-suite", "oak-quartz-kitchen"],
    services: [
      ["Complete home renovation", "Whole-house renovation planned as one coordinated project."],
      ["Apartment renovation", "Renovations managed around building rules and neighbours."],
      ["Kitchen renovation", "Layout, services, cabinetry and finishes renewed together."],
      ["Bathroom renovation", "Strip-out to finished bathroom with waterproofing done properly."],
      ["Office renovation", "Phased workplace upgrades that limit business disruption."],
      ["Commercial renovation", "Retail and commercial refurbishments to agreed programmes."],
      ["Structural repairs", "Engineered repairs to beams, columns, slabs and walls."],
      ["Crack repair", "Diagnosing the cause of cracking before repairing it."],
      ["Roof repair", "Leak investigation and repair of flat and pitched roofs."],
      ["Waterproofing", "Remedial waterproofing for roofs, wet rooms and basements."],
      ["Damp treatment", "Identifying moisture sources and treating them at the root."],
      ["Repainting", "Interior and exterior repainting with proper preparation."],
      ["Floor replacement", "Removing failed floors and installing new finishes."],
      ["Plumbing repairs", "Leaks, blockages and failed fittings repaired."],
      ["Electrical repairs", "Fault finding and safe repairs to existing installations."],
      ["General property maintenance", "Planned and reactive maintenance for homes and buildings."],
    ],
  },
  {
    slug: "exterior-outdoor",
    code: "H",
    number: "08",
    title: "Exterior & Outdoor Works",
    shortTitle: "Exterior & Landscaping",
    summary:
      "Façades, pools, landscapes and outdoor rooms that complete the architecture.",
    intro:
      "The spaces around a building deserve the same care as the rooms inside it. We design and build façades, terraces, pools and gardens with proper drainage, lighting and durable materials suited to the climate.",
    image: "/images/services/exterior-landscape.jpg",
    imageAlt: "A swimming pool surrounded by stone terraces, loungers and Mediterranean planting",
    deliverables: [
      "External works and drainage plan",
      "Planting and lighting layout",
      "Material samples for hard landscaping",
      "Care guide for planting and pools",
    ],
    relatedProjects: ["garden-pavilion", "cedar-ridge-residence"],
    services: [
      ["Landscaping", "Hard and soft landscaping built to a considered plan."],
      ["Garden construction", "Beds, lawns, paths and retaining features."],
      ["Outdoor lighting", "Path, feature and security lighting for gardens and façades."],
      ["Swimming pools", "Pool structures, finishes, filtration and surrounds."],
      ["Pergolas & outdoor structures", "Timber, steel and aluminium shade structures."],
      ["Exterior painting", "Weather-resistant coatings for walls, trims and metalwork."],
      ["Façade design", "Façade composition, materials and detailing."],
      ["Stone cladding", "Natural and engineered stone cladding with secure fixings."],
      ["Exterior tiles", "Frost- and slip-resistant tiles for terraces and steps."],
      ["Parking areas", "Parking surfaces with correct base, falls and markings."],
      ["Interlocking pavers", "Permeable and interlocking paving systems."],
      ["Outdoor kitchens", "Built-in grills, worktops and services for outdoor cooking."],
      ["Boundary walls", "Rendered, stone and masonry boundary walls."],
      ["Gates & railings", "Metal and timber gates, railings and balustrades."],
    ],
  },
  {
    slug: "specialist-systems",
    code: "I",
    number: "09",
    title: "Specialist Systems",
    shortTitle: "Specialist Systems",
    summary:
      "Fire safety, security, insulation, energy efficiency and smart-home automation.",
    intro:
      "Specialist systems are where buildings become safer, quieter and more efficient. We coordinate certified specialists where the work requires them and integrate their systems with the rest of the build, so nothing is an afterthought.",
    image: "/images/services/specialist.jpg",
    imageAlt: "Dark glass office towers rising against an overcast sky",
    deliverables: [
      "Specialist scope and coordination plan",
      "Integration with electrical and structural drawings",
      "Testing and commissioning records",
      "Operation guides for installed systems",
    ],
    relatedProjects: ["northgate-commercial", "meridian-workplace"],
    services: [
      ["Fire safety systems", "Coordinated fire safety provisions for homes and commercial buildings."],
      ["Fire alarms & detection", "Detection and alarm systems installed and tested."],
      ["Fire-rated installations", "Fire-rated doors, boards and penetration sealing."],
      ["Building security systems", "Integrated alarms, sensors and monitoring."],
      ["CCTV & access control", "Cameras, door entry and controlled access."],
      ["Lift & elevator coordination", "Shaft, pit and power coordination with lift specialists."],
      ["Acoustic insulation", "Sound separation between rooms, floors and units."],
      ["Thermal insulation", "Roof, wall and floor insulation to reduce energy use."],
      ["Energy-efficiency improvements", "Upgrades that make existing buildings cheaper to run."],
      ["Solar energy solutions", "Solar generation and storage designed for your usage."],
      ["Smart-home automation", "Lighting, climate, shading and security controlled from one system."],
    ],
  },
];

export const serviceCategories: ServiceCategory[] = raw.map((category) => ({
  ...category,
  services: category.services.map(([name, summary]) => ({
    id: slugify(name),
    name,
    summary,
  })),
}));

export function getServiceCategory(slug: string) {
  return serviceCategories.find((category) => category.slug === slug);
}

export const totalServiceCount = serviceCategories.reduce(
  (sum, category) => sum + category.services.length,
  0,
);

/** The six groupings shown on the homepage overview. */
export const homepageServiceGroups = [
  { slug: "planning-design", title: "Design & Architecture" },
  { slug: "complete-construction", title: "Complete Construction" },
  { slug: "interior-finishing", title: "Interior Finishing" },
  { slug: "electrical", title: "Electrical & Plumbing", alsoSlug: "plumbing-water" },
  { slug: "renovation-maintenance", title: "Renovation & Restoration" },
  { slug: "exterior-outdoor", title: "Exterior & Landscaping" },
] as const;
