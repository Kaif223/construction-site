import { slugify } from "../lib/slugify.ts";

/**
 * Service directory (English source content). Arabic text lives in
 * src/content/ar/services.ts, keyed by the same slugs and ids.
 *
 * Availability is NOT defined here — it is per market, in
 * src/config/markets.ts, so the directory never implies that every service is
 * offered everywhere.
 */

export type ServiceItem = {
  id: string;
  name: string;
  summary: string;
};

export type ServiceCategory = {
  slug: string;
  code: string;
  title: string;
  shortTitle: string;
  summary: string;
  intro: string;
  image: string;
  imageAlt: string;
  scope: string[];
  requirements: string[];
  deliverables: string[];
  relatedCategories: string[];
  relatedProjects: string[];
  /** Work that legally requires licensed or authorized professionals. */
  regulated: boolean;
  services: ServiceItem[];
};

type Raw = Omit<ServiceCategory, "services" | "code"> & { services: [string, string][] };

const raw: Raw[] = [
  {
    slug: "architecture-engineering",
    title: "Architecture & Engineering",
    shortTitle: "Architecture & Engineering",
    summary: "Architecture, engineering and visualisation that turn an idea into buildable, budgeted drawings.",
    intro:
      "Good buildings are decided long before the first excavation. Architects, structural and civil engineers and designers work in one conversation, so the drawings you approve are coordinated, buildable and priced on realistic assumptions.",
    image: "/images/services/planning-design.jpg",
    imageAlt: "An architect marking up a printed building plan with a scale ruler",
    scope: [
      "Site and brief review",
      "Concept, layout and elevation design",
      "Structural and services coordination",
      "Drawing sets for pricing and, where required, authority submissions",
    ],
    requirements: [
      "Plot or property details and any existing drawings",
      "Your brief: spaces, priorities and budget range",
      "Applicable plot regulations and community guidelines, where known",
    ],
    deliverables: [
      "Measured survey and site notes",
      "Concept and developed drawings",
      "3D visualisations for key spaces",
      "Preliminary budget and feasibility notes",
    ],
    relatedCategories: ["new-construction", "residential-construction", "interior-finishing"],
    relatedProjects: ["cedar-ridge-residence", "linden-family-house"],
    regulated: true,
    services: [
      ["Architectural design", "Concept-to-detail architecture shaped around how you will actually live or work."],
      ["Residential planning", "Room relationships, light, circulation and future flexibility for homes of every size."],
      ["Commercial architectural design", "Efficient layouts for offices, retail and mixed-use buildings."],
      ["Structural engineering", "Calculations and structural drawings for foundations, frames, slabs and roofs."],
      ["Civil engineering", "Grading, drainage, access and external works designed around the site."],
      ["Site surveys", "Measured surveys capturing boundaries, levels and existing structures."],
      ["Land & site assessment", "Early review of soil, access, orientation and constraints before you commit."],
      ["Building plans & drawings", "Coordinated drawing sets for pricing and construction."],
      ["2D floor plans", "Clear, dimensioned plans that make layout decisions easy to compare."],
      ["3D architectural visualisation", "Realistic views that let you walk through the design before it is built."],
      ["Interior design", "Material palettes, joinery, lighting and furniture planning for finished interiors."],
      ["Space planning", "Optimised layouts for homes, offices and retail floors."],
      ["Construction consultancy", "Advice on methods, sequencing, contracts and risk."],
      ["Feasibility & preliminary budgeting", "Early cost ranges and options so the brief matches the budget."],
    ],
  },
  {
    slug: "new-construction",
    title: "New Construction",
    shortTitle: "New Construction",
    summary: "Ways to deliver a new building — from design-and-build to shell-and-core and extensions.",
    intro:
      "New construction can be delivered in different ways depending on how much you want handled by one team. We explain the options, agree one programme, and coordinate design, structure and trades under a single point of responsibility.",
    image: "/images/process/crane.jpg",
    imageAlt: "Tower cranes above a building under construction",
    scope: [
      "Agreeing the delivery model and responsibilities",
      "Programme and procurement planning",
      "Coordination of design, structure and services",
      "Stage inspections through to handover",
    ],
    requirements: [
      "Approved or developing design drawings",
      "Plot details and site access",
      "Target budget and timeline",
    ],
    deliverables: [
      "Construction programme with milestones",
      "Stage-by-stage quality inspections",
      "Regular progress reporting",
      "Handover documents",
    ],
    relatedCategories: ["residential-construction", "commercial-construction", "structural-civil"],
    relatedProjects: ["cedar-ridge-residence", "northgate-commercial"],
    regulated: false,
    services: [
      ["Turnkey design & build", "Design and construction delivered as one coordinated package."],
      ["Shell & core construction", "Structure and envelope completed, ready for separate fit-out."],
      ["Construction project management", "Planning, scheduling and coordination of the trades on your project."],
      ["Extensions & additional floors", "Structurally assessed extensions and vertical additions."],
      ["Boundary walls & gates", "Secure, well-proportioned boundaries built with the main works."],
    ],
  },
  {
    slug: "residential-construction",
    title: "Residential Construction",
    shortTitle: "Residential",
    summary: "Villas, family homes and residential buildings, built to a coordinated programme.",
    intro:
      "Homes are built around the people who live in them. We plan layouts, structure and services together, inspect each stage before the next begins, and keep you informed with regular, plain-language updates.",
    image: "/images/brand/contact-residence.jpg",
    imageAlt: "A contemporary white villa with large glazing beside a pool",
    scope: [
      "Groundworks, foundations and structure",
      "Walls, roof and building envelope",
      "Electrical, plumbing and HVAC installation",
      "Finishing, inspection and handover",
    ],
    requirements: [
      "Plot ownership or development rights",
      "Design drawings or a brief for design",
      "Any community or developer guidelines that apply",
    ],
    deliverables: [
      "Milestone programme",
      "Material and finishes schedule",
      "Inspection records and photos",
      "Handover pack with test records",
    ],
    relatedCategories: ["architecture-engineering", "new-construction", "interior-finishing"],
    relatedProjects: ["cedar-ridge-residence", "linden-family-house", "garden-pavilion"],
    regulated: false,
    services: [
      ["New house construction", "Complete construction of new family homes from foundation to handover."],
      ["Luxury villa construction", "High-specification villas with exacting detailing and finishes."],
      ["Residential buildings", "Low- and mid-rise residential blocks built to a coordinated programme."],
      ["Apartments & multi-unit housing", "Efficient construction of repeatable, well-detailed units."],
    ],
  },
  {
    slug: "commercial-construction",
    title: "Commercial Construction",
    shortTitle: "Commercial",
    summary: "Offices, retail, warehouses and commercial buildings delivered around business timelines.",
    intro:
      "Commercial projects run on business deadlines. We plan around lease dates and operations, coordinate specialist systems early, and phase work so spaces can open as planned.",
    image: "/images/projects/northgate-2.jpg",
    imageAlt: "A sculptural white commercial building with an angular glass and panel façade",
    scope: [
      "Shell and core or full fit-out",
      "Building services and specialist systems coordination",
      "Phasing around operations or tenant dates",
      "Testing, commissioning and handover",
    ],
    requirements: [
      "Approved use and layout for the space",
      "Landlord or developer fit-out guidelines",
      "Operational constraints and key dates",
    ],
    deliverables: [
      "Programme aligned to opening dates",
      "Coordinated services drawings",
      "Commissioning records",
      "Operation and maintenance information",
    ],
    relatedCategories: ["new-construction", "hvac-mechanical", "specialist-services"],
    relatedProjects: ["northgate-commercial", "meridian-workplace"],
    regulated: false,
    services: [
      ["Commercial buildings", "Shells and fit-outs for commercial and mixed-use developments."],
      ["Offices & retail spaces", "Workplaces and storefronts delivered around business timelines."],
      ["Warehouses & industrial buildings", "Large-span structures, slabs and loading areas."],
    ],
  },
  {
    slug: "structural-civil",
    title: "Structural & Civil Works",
    shortTitle: "Structural & Civil",
    summary: "Foundations, concrete, masonry and structural repairs carried out to the engineer's design.",
    intro:
      "Structure is the part of a building you cannot easily change later. Excavations, reinforcement and concrete are checked against the engineer's drawings at each stage, and repairs start with finding the cause, not just covering the symptom.",
    image: "/images/journey/03-structure.jpg",
    imageAlt: "Construction workers fixing tall steel reinforcement cages for concrete columns",
    scope: [
      "Excavation and foundations",
      "Reinforcement, formwork and concrete",
      "Masonry and structural framing",
      "Structural investigation and repair",
    ],
    requirements: [
      "Structural drawings from a qualified engineer",
      "Soil investigation results, where available",
      "Site access for plant and deliveries",
    ],
    deliverables: [
      "Inspection checklists per pour or stage",
      "Concrete test records, where specified",
      "Photo record of concealed work",
    ],
    relatedCategories: ["new-construction", "roofing-waterproofing", "renovation-restoration"],
    relatedProjects: ["northgate-commercial"],
    regulated: true,
    services: [
      ["Foundations & excavation", "Setting out, excavation and foundations engineered for the soil conditions."],
      ["Structural framing", "Concrete, steel or timber frames built to the structural design."],
      ["Brickwork & masonry", "Load-bearing and infill masonry with clean, consistent coursing."],
      ["Concrete work", "Slabs, columns, beams and retaining walls, poured and cured correctly."],
      ["Reinforcement & formwork", "Accurate steel fixing and formwork that leaves crisp concrete faces."],
      ["Structural repairs", "Engineered repairs to beams, columns, slabs and walls."],
      ["Crack repair", "Diagnosing the cause of cracking before repairing it."],
    ],
  },
  {
    slug: "electrical",
    title: "Electrical Installations",
    shortTitle: "Electrical",
    summary: "Safe, well-planned power, lighting and data — installed and tested.",
    intro:
      "Electrical work is planned with the architecture, not after it. Circuits, lighting and data routes are designed alongside the layout, installed by qualified electricians and tested and documented before handover.",
    image: "/images/services/electrical.jpg",
    imageAlt: "An electrician in a hard hat and gloves working on an exterior electrical box",
    scope: [
      "Load assessment and circuit design",
      "Wiring, boards and protection",
      "Lighting, data and security cabling",
      "Testing, inspection and records",
    ],
    requirements: [
      "Layout drawings or room-by-room needs",
      "Existing installation details for renovations",
      "Utility connection status",
    ],
    deliverables: [
      "Electrical layout and lighting plan",
      "Circuit schedule and test results",
      "As-installed drawings",
    ],
    relatedCategories: ["solar-smart-home", "hvac-mechanical", "property-maintenance"],
    relatedProjects: ["meridian-workplace", "linden-family-house"],
    regulated: true,
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
      ["Inverter installation", "Inverter systems integrated with solar and backup supplies."],
      ["Data & networking cabling", "Structured data cabling and Wi-Fi infrastructure."],
    ],
  },
  {
    slug: "plumbing-drainage",
    title: "Plumbing & Drainage",
    shortTitle: "Plumbing & Drainage",
    summary: "Supply, drainage, hot water and sanitaryware — pressure-tested before it is hidden.",
    intro:
      "Most plumbing disappears behind walls and floors, so we test it before it does. Supply and drainage are routed with access in mind, pressure-tested, photographed and recorded for future maintenance.",
    image: "/images/services/plumbing.jpg",
    imageAlt: "Grey water supply pipes, valves and meters mounted on a red brick wall",
    scope: [
      "Water supply and distribution",
      "Foul and surface drainage",
      "Hot water, pumps, tanks and filtration",
      "Fixtures, testing and leak repair",
    ],
    requirements: [
      "Layout of wet areas",
      "Supply and drainage connection points",
      "Fixture selections, where decided",
    ],
    deliverables: [
      "Plumbing and drainage layout",
      "Pressure-test records",
      "Photo record of concealed pipework",
    ],
    relatedCategories: ["kitchens-bathrooms", "roofing-waterproofing", "property-maintenance"],
    relatedProjects: ["travertine-bath-suite", "oak-quartz-kitchen"],
    regulated: false,
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
    title: "HVAC & Mechanical Systems",
    shortTitle: "HVAC & Mechanical",
    summary: "Cooling, ventilation and mechanical systems planned with the building.",
    intro:
      "In a hot climate, cooling is not an afterthought. Equipment is sized to the space, ductwork is routed around structure and ceilings, and systems are commissioned so they run efficiently from day one.",
    image: "/images/services/hvac-mechanical.jpg",
    imageAlt: "An open-plan office with exposed concrete ceiling and visible services",
    scope: [
      "Cooling load assessment and system selection",
      "Ductwork and equipment installation",
      "Ventilation and extraction",
      "Commissioning and maintenance planning",
    ],
    requirements: [
      "Floor plans and room uses",
      "Ceiling heights and structure",
      "Preferred system type, if any",
    ],
    deliverables: [
      "Equipment sizing notes",
      "Duct and pipe routing drawings",
      "Commissioning records and maintenance schedule",
    ],
    relatedCategories: ["electrical", "commercial-construction", "property-maintenance"],
    relatedProjects: ["meridian-workplace", "northgate-commercial"],
    regulated: false,
    services: [
      ["Air conditioning installation", "Split, multi-split and ducted systems installed and commissioned."],
      ["HVAC planning", "System selection and sizing based on the building and its use."],
      ["Ventilation systems", "Fresh-air and heat-recovery ventilation for healthy interiors."],
      ["Exhaust systems", "Kitchen, bathroom and plant-room extraction."],
      ["Heating solutions", "Underfloor heating, radiators and heat pumps where required."],
      ["Ductwork", "Insulated, sealed ductwork coordinated with ceilings and structure."],
      ["Mechanical equipment installation", "Plant, pumps and fans placed for access and acoustics."],
      ["Preventive maintenance", "Scheduled servicing to keep systems efficient and reliable."],
    ],
  },
  {
    slug: "marble-stone",
    title: "Marble, Granite & Stone",
    shortTitle: "Marble & Stone",
    summary: "Book-matched marble, granite and natural stone, set out from a planned layout.",
    intro:
      "Natural stone rewards planning. Slabs are inspected and dry-laid before installation so veining flows across a room, substrates are prepared to tolerance, and finished stone is sealed and protected until handover.",
    image: "/images/materials/marble.jpg",
    imageAlt: "White marble with dramatic charcoal veining",
    scope: [
      "Stone selection support and slab approval",
      "Set-out drawings and dry-lay",
      "Installation on prepared substrates",
      "Sealing, protection and care guidance",
    ],
    requirements: [
      "Areas and finishes to be covered",
      "Stone selection or a budget for selection",
      "Substrate condition (new screed or existing floor)",
    ],
    deliverables: [
      "Approved slab and layout record",
      "Set-out drawings",
      "Care and maintenance guide",
    ],
    relatedCategories: ["flooring-tiles", "interior-finishing", "kitchens-bathrooms"],
    relatedProjects: ["atrium-stone-floors", "travertine-bath-suite"],
    regulated: false,
    services: [
      ["Marble installation", "Book-matched and planned marble floors, walls and vanities."],
      ["Granite installation", "Hard-wearing granite for kitchens, stairs and high-traffic floors."],
      ["Natural stone installation", "Limestone, travertine and slate laid with careful set-out."],
      ["Stone cladding", "Natural and engineered stone cladding with secure fixings."],
    ],
  },
  {
    slug: "flooring-tiles",
    title: "Flooring & Tiles",
    shortTitle: "Flooring & Tiles",
    summary: "Ceramic, porcelain and timber floors laid flat, true and well detailed.",
    intro:
      "A good floor starts underneath. Screeds are levelled and moisture-checked, large-format tiles are installed with levelling systems, and timber is acclimatised before it is laid.",
    image: "/images/journey/07-flooring.jpg",
    imageAlt: "A geometric floor of black, white and amber stone blocks",
    scope: [
      "Substrate assessment and preparation",
      "Tile and timber installation",
      "Movement joints, thresholds and trims",
      "Floor replacement in occupied homes",
    ],
    requirements: [
      "Floor areas and room uses",
      "Chosen or shortlisted materials",
      "Existing floor build-up for replacements",
    ],
    deliverables: [
      "Set-out plan for each area",
      "Moisture and level readings",
      "Care guide for each finish",
    ],
    relatedCategories: ["marble-stone", "interior-finishing", "renovation-restoration"],
    relatedProjects: ["atrium-stone-floors", "linden-family-house"],
    regulated: false,
    services: [
      ["Ceramic tile installation", "Wall and floor tiling with straight joints and correct falls."],
      ["Porcelain tile installation", "Large-format porcelain installed flat with levelling systems."],
      ["Flooring installation", "Prepared screeds and finished floors in every material."],
      ["Wooden flooring", "Engineered and solid timber floors with proper acclimatisation."],
      ["Floor replacement", "Removing failed floors and installing new finishes."],
      ["Exterior tiles", "Slip-resistant tiles for terraces, steps and pool surrounds."],
    ],
  },
  {
    slug: "interior-finishing",
    title: "Interior Finishing",
    shortTitle: "Interior Finishing",
    summary: "Ceilings, joinery, doors, glazing and the details you touch every day.",
    intro:
      "Finishing is where precision becomes visible. Ceilings are planned around lighting and services, joinery is coordinated with what sits behind it, and completed work is protected until handover.",
    image: "/images/services/interior-finishing.jpg",
    imageAlt: "A double-height living room with timber stair, white walls and large windows",
    scope: [
      "Ceilings, partitions and gypsum work",
      "Joinery, wardrobes and cabinetry",
      "Doors, windows and glazing",
      "Snagging and final clean",
    ],
    requirements: [
      "Room-by-room finishes intent",
      "Joinery and storage needs",
      "Lighting and services positions",
    ],
    deliverables: [
      "Finishes schedule and sample approvals",
      "Joinery shop drawings",
      "Snagging list and close-out",
    ],
    relatedCategories: ["painting-decorating", "flooring-tiles", "kitchens-bathrooms"],
    relatedProjects: ["oak-quartz-kitchen", "cedar-ridge-residence"],
    regulated: false,
    services: [
      ["Ceiling design", "Ceilings planned around lighting, acoustics and services."],
      ["False ceilings", "Suspended ceilings that conceal services while keeping access."],
      ["Gypsum work", "Partitions, bulkheads and cornices in gypsum board."],
      ["Wall panelling", "Timber, fabric and decorative panelling with concealed fixings."],
      ["Doors & windows", "Supply and installation of internal doors and window systems."],
      ["Aluminium & glass work", "Glazed partitions, shower screens and aluminium frames."],
      ["Wardrobes & built-in storage", "Built-in storage designed to the millimetre."],
      ["Custom cabinetry", "Made-to-measure joinery for living, working and storage spaces."],
    ],
  },
  {
    slug: "painting-decorating",
    title: "Painting & Decorating",
    shortTitle: "Painting",
    summary: "Interior and exterior paintwork, wallcoverings and decorative finishes.",
    intro:
      "The final coat is only as good as the preparation beneath it. Surfaces are repaired, primed and sanded, and exterior coatings are chosen for sun, heat and humidity.",
    image: "/images/journey/08-finishing.jpg",
    imageAlt: "A finished living room with tan leather sofa, plants and a gallery wall of framed prints",
    scope: [
      "Surface preparation and repair",
      "Interior and exterior painting",
      "Wallpaper and decorative finishes",
      "Protection of floors and furniture",
    ],
    requirements: [
      "Areas and surfaces to be painted",
      "Colour and finish preferences",
      "Whether rooms are occupied during work",
    ],
    deliverables: [
      "Colour and product schedule",
      "Touch-up paint and records for future maintenance",
    ],
    relatedCategories: ["interior-finishing", "renovation-restoration", "property-maintenance"],
    relatedProjects: ["linden-family-house"],
    regulated: false,
    services: [
      ["Painting & polishing", "Prepared, primed and evenly finished paintwork and polished surfaces."],
      ["Wallpaper installation", "Pattern-matched wallcoverings on properly prepared walls."],
      ["Decorative wall finishes", "Lime plaster, micro-cement and textured specialist finishes."],
      ["Repainting", "Interior and exterior repainting with proper preparation."],
      ["Exterior painting", "Weather-resistant coatings for walls, trims and metalwork."],
    ],
  },
  {
    slug: "kitchens-bathrooms",
    title: "Kitchens & Bathrooms",
    shortTitle: "Kitchens & Bathrooms",
    summary: "Complete kitchens and bathrooms — layout, services, waterproofing and finishes together.",
    intro:
      "Kitchens and bathrooms concentrate every trade into a small space. We plan layout, plumbing, electrics, ventilation and waterproofing together, so the finished room works as well as it looks.",
    image: "/images/projects/oak-quartz-2.jpg",
    imageAlt: "A white kitchen with marble-look worktops, hexagon tile splashback and range cooker",
    scope: [
      "Layout design and appliance planning",
      "Plumbing, electrical and extraction",
      "Waterproofing and tiling",
      "Cabinetry, worktops and fixtures",
    ],
    requirements: [
      "Room measurements or drawings",
      "Appliance and fixture preferences",
      "Building rules for renovation works, if in a managed community",
    ],
    deliverables: [
      "Layout and elevation drawings",
      "Waterproofing flood-test record",
      "Fixture and finish schedule",
    ],
    relatedCategories: ["plumbing-drainage", "marble-stone", "interior-finishing"],
    relatedProjects: ["oak-quartz-kitchen", "travertine-bath-suite"],
    regulated: false,
    services: [
      ["Kitchen renovation", "Layout, services, cabinetry and finishes renewed together."],
      ["Kitchen installation", "Complete kitchen fitting coordinated with plumbing and electrical work."],
      ["Kitchen finishing", "Worktops, splashbacks and cabinetry finishing details."],
      ["Bathroom renovation", "Strip-out to finished bathroom with waterproofing done properly."],
      ["Bathroom finishing", "Tiling, sanitaryware, glass and fittings for finished bathrooms."],
    ],
  },
  {
    slug: "roofing-waterproofing",
    title: "Roofing & Waterproofing",
    shortTitle: "Roofing & Waterproofing",
    summary: "Roofs, membranes and damp protection where water and heat are a risk.",
    intro:
      "Roofs and wet areas fail at the details: upstands, outlets and penetrations. We detail them carefully, flood-test waterproofing before it is covered, and investigate leaks at their source.",
    image: "/images/services/roofing-waterproofing.jpg",
    imageAlt: "A roofer wearing a safety harness working on a pitched roof",
    scope: [
      "Roof construction and insulation",
      "Membranes and tanking for roofs, basements and wet areas",
      "Leak investigation and remedial waterproofing",
      "Damp diagnosis and treatment",
    ],
    requirements: [
      "Roof or wet-area plans",
      "History of leaks or damp, for remedial work",
      "Access arrangements for roof work",
    ],
    deliverables: [
      "Waterproofing details",
      "Flood-test records",
      "Photo record before covering",
    ],
    relatedCategories: ["structural-civil", "plumbing-drainage", "renovation-restoration"],
    relatedProjects: ["travertine-bath-suite"],
    regulated: false,
    services: [
      ["Roof construction", "Flat and pitched roofs, insulated and detailed against weather."],
      ["Waterproofing & damp protection", "Membranes, tanking and damp-proof courses on new works."],
      ["Roof repair", "Leak investigation and repair of flat and pitched roofs."],
      ["Waterproofing", "Remedial waterproofing for roofs, wet rooms and basements."],
      ["Damp treatment", "Identifying moisture sources and treating them at the root."],
    ],
  },
  {
    slug: "renovation-restoration",
    title: "Renovation & Restoration",
    shortTitle: "Renovation",
    summary: "Whole-home, apartment and commercial renovations, phased around how you use the space.",
    intro:
      "Renovation starts with understanding what is already there. We investigate before we demolish, protect what is worth keeping, and phase work so homes and businesses can keep functioning where possible.",
    image: "/images/services/renovation.jpg",
    imageAlt: "A room mid-renovation with exposed brick, timber props and stripped walls",
    scope: [
      "Condition survey and investigation",
      "Strip-out and protection of retained finishes",
      "Services renewal and structural repairs as needed",
      "Refinishing, snagging and handover",
    ],
    requirements: [
      "Access to the property for survey",
      "Building or community renovation rules",
      "Occupancy plans during the works",
    ],
    deliverables: [
      "Condition survey report",
      "Phased renovation plan",
      "Maintenance recommendations at handover",
    ],
    relatedCategories: ["kitchens-bathrooms", "interior-finishing", "property-maintenance"],
    relatedProjects: ["travertine-bath-suite", "oak-quartz-kitchen"],
    regulated: false,
    services: [
      ["Complete home renovation", "Whole-house renovation planned as one coordinated project."],
      ["Apartment renovation", "Renovations managed around building rules and neighbours."],
      ["Office renovation", "Phased workplace upgrades that limit business disruption."],
      ["Commercial renovation", "Retail and commercial refurbishments to agreed programmes."],
    ],
  },
  {
    slug: "landscaping-exterior",
    title: "Landscaping & Exterior Works",
    shortTitle: "Landscaping & Exterior",
    summary: "Gardens, pools, façades and outdoor rooms designed for heat and daily use.",
    intro:
      "Outdoor spaces deserve the same care as the rooms inside. Hard landscaping, pools, shade and lighting are planned with drainage, irrigation and materials suited to sun and heat.",
    image: "/images/services/exterior-landscape.jpg",
    imageAlt: "A swimming pool surrounded by stone terraces, loungers and Mediterranean planting",
    scope: [
      "Landscape design and planting",
      "Hard landscaping, paving and walls",
      "Pools, shade structures and outdoor kitchens",
      "Façades and external lighting",
    ],
    requirements: [
      "Site plan and levels",
      "Irrigation and water supply points",
      "Community guidelines for exteriors, where applicable",
    ],
    deliverables: [
      "Landscape and lighting layout",
      "Drainage and irrigation plan",
      "Care guide for planting and pools",
    ],
    relatedCategories: ["architecture-engineering", "roofing-waterproofing", "property-maintenance"],
    relatedProjects: ["garden-pavilion", "cedar-ridge-residence"],
    regulated: false,
    services: [
      ["Landscape design", "Gardens, terraces and planting plans that extend the architecture outdoors."],
      ["Landscaping", "Hard and soft landscaping built to a considered plan."],
      ["Garden construction", "Beds, lawns, paths and retaining features."],
      ["Outdoor lighting", "Path, feature and security lighting for gardens and façades."],
      ["Swimming pools", "Pool structures, finishes, filtration and surrounds."],
      ["Pergolas & outdoor structures", "Timber, steel and aluminium shade structures."],
      ["Façade design", "Façade composition, materials and detailing."],
      ["Driveways & paving", "Durable driveways with correct sub-base, falls and drainage."],
      ["Parking areas", "Parking surfaces with correct base, falls and markings."],
      ["Interlocking pavers", "Permeable and interlocking paving systems."],
      ["Outdoor kitchens", "Built-in grills, worktops and services for outdoor cooking."],
      ["Boundary walls", "Rendered, stone and masonry boundary walls."],
      ["Gates & railings", "Metal and timber gates, railings and balustrades."],
    ],
  },
  {
    slug: "property-maintenance",
    title: "Property Maintenance",
    shortTitle: "Maintenance",
    summary: "Planned and reactive maintenance that keeps buildings safe and running well.",
    intro:
      "Buildings need care after handover. Planned maintenance catches small problems early, and reactive repairs are diagnosed before they are fixed, so the same fault does not keep returning.",
    image: "/images/services/property-maintenance.jpg",
    imageAlt: "Gloved hands working on metal ductwork",
    scope: [
      "Planned maintenance visits",
      "Reactive repairs and diagnostics",
      "Condition reports and recommendations",
    ],
    requirements: [
      "Property type and size",
      "Installed systems and their age",
      "Preferred visit frequency",
    ],
    deliverables: [
      "Maintenance schedule",
      "Visit reports with photos",
      "Recommendations for upgrades",
    ],
    relatedCategories: ["hvac-mechanical", "electrical", "plumbing-drainage"],
    relatedProjects: [],
    regulated: false,
    services: [
      ["General property maintenance", "Planned and reactive maintenance for homes and buildings."],
      ["Annual maintenance contracts", "Scheduled visits and priority repairs under an agreed contract."],
      ["Plumbing repairs", "Leaks, blockages and failed fittings repaired."],
      ["Electrical repairs", "Fault finding and safe repairs to existing installations."],
    ],
  },
  {
    slug: "solar-smart-home",
    title: "Solar & Smart-Home Systems",
    shortTitle: "Solar & Smart Home",
    summary: "Solar generation, energy efficiency and automation designed around how you use energy.",
    intro:
      "Energy systems work best when they are designed around real usage. We assess consumption, roof space and structure before proposing solar, and plan automation so it stays simple to use and maintain.",
    image: "/images/services/solar-smart-home.jpg",
    imageAlt: "Rows of solar panels on a flat roof at sunset",
    scope: [
      "Energy use and roof assessment",
      "Solar and storage system design",
      "Smart-home wiring and automation",
      "Insulation and efficiency upgrades",
    ],
    requirements: [
      "Recent utility bills or consumption data",
      "Roof plans and structure details",
      "Utility and authority connection requirements",
    ],
    deliverables: [
      "System design and layout",
      "Commissioning records",
      "User guide for installed systems",
    ],
    relatedCategories: ["electrical", "roofing-waterproofing", "specialist-services"],
    relatedProjects: [],
    regulated: true,
    services: [
      ["Solar panel installation", "Roof and ground-mounted solar arrays with safe isolation."],
      ["Solar energy solutions", "Solar generation and storage designed for your usage."],
      ["Smart-home wiring", "Structured wiring for automation, lighting control and sensors."],
      ["Smart-home automation", "Lighting, climate, shading and security controlled from one system."],
      ["Energy-efficiency improvements", "Upgrades that make existing buildings cheaper to run."],
      ["Thermal insulation", "Roof, wall and floor insulation to reduce energy use."],
    ],
  },
  {
    slug: "specialist-services",
    title: "Specialist Services",
    shortTitle: "Specialist",
    summary: "Fire safety, security, lifts and acoustic work — coordinated with certified specialists.",
    intro:
      "Specialist systems are often regulated and always need coordination. Where the work requires certified specialists, we coordinate them and integrate their systems with the rest of the build.",
    image: "/images/services/specialist.jpg",
    imageAlt: "Dark glass office towers rising against an overcast sky",
    scope: [
      "Specialist scope definition",
      "Coordination with structure and electrical works",
      "Testing and commissioning with the specialist",
    ],
    requirements: [
      "Building use and occupancy",
      "Applicable safety requirements for the project",
      "Existing systems, for upgrades",
    ],
    deliverables: [
      "Coordination plan",
      "Commissioning records from the specialist",
      "Operation guides",
    ],
    relatedCategories: ["electrical", "commercial-construction", "solar-smart-home"],
    relatedProjects: ["northgate-commercial", "meridian-workplace"],
    regulated: true,
    services: [
      ["Fire safety systems", "Coordinated fire safety provisions for homes and commercial buildings."],
      ["Fire alarms & detection", "Detection and alarm systems installed and tested."],
      ["Fire-rated installations", "Fire-rated doors, boards and penetration sealing."],
      ["Building security systems", "Integrated alarms, sensors and monitoring."],
      ["CCTV & access control", "Cameras, door entry and controlled access."],
      ["Security & CCTV installation", "Camera, alarm and intercom cabling and equipment."],
      ["Lift & elevator coordination", "Shaft, pit and power coordination with lift specialists."],
      ["Acoustic insulation", "Sound separation between rooms, floors and units."],
    ],
  },
];

const CODES = "ABCDEFGHIJKLMNOPQRS";

export const serviceCategories: ServiceCategory[] = raw.map((category, index) => ({
  ...category,
  code: CODES[index],
  services: category.services.map(([name, summary]) => ({ id: slugify(name), name, summary })),
}));

export function getServiceCategory(slug: string) {
  return serviceCategories.find((category) => category.slug === slug);
}

export function findService(serviceId: string) {
  for (const category of serviceCategories) {
    const service = category.services.find((item) => item.id === serviceId);
    if (service) return { category, service };
  }
  return undefined;
}

export const totalServiceCount = serviceCategories.reduce((sum, category) => sum + category.services.length, 0);

/** The six groupings shown on the homepage overview. */
export const homepageServiceGroups = [
  "architecture-engineering",
  "residential-construction",
  "commercial-construction",
  "interior-finishing",
  "kitchens-bathrooms",
  "renovation-restoration",
] as const;
