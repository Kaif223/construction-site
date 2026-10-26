import type { Localized } from "../config/markets";

/**
 * Project-planning guide.
 *
 * `topics` is general guidance about how construction projects run.
 * `regulatory` is kept separate on purpose: it describes local approval
 * processes, must cite official sources, and must be reviewed before each
 * update. It deliberately avoids specific requirements, fees or timelines.
 */

export type PlanningTopic = {
  id: string;
  title: Localized;
  body: Localized;
  /** Shows the "varies by emirate, property type and authority" note. */
  varies: boolean;
};

export const planningTopics: PlanningTopic[] = [
  {
    id: "consultation",
    title: { en: "Initial consultation", ar: "الاستشارة الأولية" },
    body: {
      en: "A first conversation about what you want to build or change, why, and the budget and timing you have in mind. Bring photos, drawings or references — they make the conversation more useful.",
      ar: "محادثة أولى حول ما تريد بناءه أو تغييره، وأسباب ذلك، والميزانية والتوقيت المتوقعين. أحضر صوراً أو مخططات أو مراجع، فهي تجعل النقاش أكثر فائدة.",
    },
    varies: false,
  },
  {
    id: "site-assessment",
    title: { en: "Site assessment", ar: "تقييم الموقع" },
    body: {
      en: "A visit to measure, photograph and note conditions: access, existing structures, services and anything that affects design or cost. For renovations, this includes the condition of what is being kept.",
      ar: "زيارة لأخذ القياسات والتصوير وتدوين ظروف الموقع: سهولة الوصول، والمنشآت القائمة، والخدمات، وأي عوامل تؤثر في التصميم أو التكلفة. وفي أعمال التجديد يشمل ذلك حالة الأجزاء التي سيتم الإبقاء عليها.",
    },
    varies: false,
  },
  {
    id: "brief",
    title: { en: "Project brief", ar: "موجز المشروع" },
    body: {
      en: "A written list of spaces, priorities, quality expectations and constraints. A clear brief keeps design, pricing and decisions anchored to what matters to you.",
      ar: "قائمة مكتوبة بالمساحات والأولويات وتوقعات الجودة والقيود. يساعد الموجز الواضح على إبقاء التصميم والتسعير والقرارات مرتبطة بما يهمك فعلاً.",
    },
    varies: false,
  },
  {
    id: "design",
    title: { en: "Architectural design", ar: "التصميم المعماري" },
    body: {
      en: "Layouts, elevations and visualisations developed from the brief. Design drawings are also the basis for accurate pricing. Where drawings must be prepared or stamped by licensed professionals, that requirement applies regardless of who builds the project.",
      ar: "مخططات وواجهات وتصورات تُطوَّر بناءً على الموجز، وهي أيضاً أساس التسعير الدقيق. وعندما يتطلب الأمر إعداد المخططات أو اعتمادها من مختصين مرخّصين، فإن هذا المتطلب يسري بغض النظر عن الجهة المنفذة للمشروع.",
    },
    varies: true,
  },
  {
    id: "engineering",
    title: { en: "Engineering coordination", ar: "التنسيق الهندسي" },
    body: {
      en: "Structural, mechanical, electrical and plumbing design are coordinated with the architecture so services fit the structure and ceilings without late changes.",
      ar: "يتم تنسيق التصميم الإنشائي والميكانيكي والكهربائي والصحي مع التصميم المعماري، بحيث تتلاءم الخدمات مع الهيكل والأسقف دون تعديلات متأخرة.",
    },
    varies: false,
  },
  {
    id: "budget",
    title: { en: "Budget planning", ar: "تخطيط الميزانية" },
    body: {
      en: "Early ranges help test whether the brief and budget align. A detailed quotation follows once the scope is defined; it should state inclusions, exclusions, assumptions and how taxes are treated.",
      ar: "تساعد التقديرات المبكرة على التحقق من توافق الموجز مع الميزانية. ويأتي عرض السعر التفصيلي بعد تحديد نطاق العمل، وينبغي أن يوضح ما يشمله وما لا يشمله والافتراضات وطريقة احتساب الضرائب.",
    },
    varies: false,
  },
  {
    id: "responsibilities",
    title: { en: "Contractor and consultant responsibilities", ar: "مسؤوليات المقاول والاستشاري" },
    body: {
      en: "Projects may involve a design consultant, a supervising consultant and a contractor, or a design-and-build arrangement. Agree in writing who is responsible for design, approvals, supervision and quality before work starts.",
      ar: "قد يشمل المشروع استشاري تصميم واستشاري إشراف ومقاولاً، أو ترتيب تصميم وتنفيذ. اتفق كتابياً قبل بدء العمل على الجهة المسؤولة عن التصميم والموافقات والإشراف والجودة.",
    },
    varies: true,
  },
  {
    id: "approvals",
    title: { en: "Permits and approvals", ar: "التصاريح والموافقات" },
    body: {
      en: "Many construction and renovation works need approval before they start. Which authority is involved, and what it requires, depends on the emirate, the plot's location (including free zones and master communities), the property type and the scope. See the regulatory notes below.",
      ar: "تحتاج كثير من أعمال البناء والتجديد إلى موافقة قبل البدء. وتعتمد الجهة المختصة ومتطلباتها على الإمارة وموقع قطعة الأرض (بما في ذلك المناطق الحرة والمجتمعات المخططة) ونوع العقار ونطاق العمل. راجع الملاحظات التنظيمية أدناه.",
    },
    varies: true,
  },
  {
    id: "scheduling",
    title: { en: "Construction scheduling", ar: "جدولة أعمال البناء" },
    body: {
      en: "A milestone programme shows the sequence of work, long-lead materials and inspection points. It should be updated as the project moves forward, not just issued once.",
      ar: "يوضح البرنامج الزمني المرحلي تسلسل الأعمال والمواد ذات فترات التوريد الطويلة ونقاط الفحص، وينبغي تحديثه مع تقدم المشروع لا إصداره مرة واحدة فقط.",
    },
    varies: false,
  },
  {
    id: "materials",
    title: { en: "Material selection", ar: "اختيار المواد" },
    body: {
      en: "Approve finishes from physical samples, and choose materials suited to heat, sun and humidity. Confirm lead times early — imported stone and fittings can affect the programme.",
      ar: "اعتمد التشطيبات من عينات فعلية، واختر مواد تناسب الحرارة والشمس والرطوبة. وتأكد مبكراً من مدد التوريد، فالحجر والتجهيزات المستوردة قد تؤثر في البرنامج الزمني.",
    },
    varies: false,
  },
  {
    id: "supervision",
    title: { en: "Site supervision", ar: "الإشراف على الموقع" },
    body: {
      en: "Day-to-day coordination of trades, safety and quality on site. Ask who supervises your project, how often, and how you will receive progress updates.",
      ar: "التنسيق اليومي بين الحرفيين ومتابعة السلامة والجودة في الموقع. اسأل عن المسؤول عن الإشراف على مشروعك، ومعدل الإشراف، وكيف ستصلك تحديثات التقدم.",
    },
    varies: false,
  },
  {
    id: "inspections",
    title: { en: "Quality inspections", ar: "فحوصات الجودة" },
    body: {
      en: "Work should be checked before it is covered: reinforcement before concrete, pipework before tiling, waterproofing before finishes. Authority inspections may also apply at certain stages.",
      ar: "ينبغي فحص الأعمال قبل تغطيتها: حديد التسليح قبل صب الخرسانة، والتمديدات قبل التبليط، والعزل المائي قبل التشطيبات. وقد تُطلب أيضاً فحوصات من الجهات المختصة في مراحل معينة.",
    },
    varies: true,
  },
  {
    id: "handover",
    title: { en: "Completion and handover", ar: "الإنجاز والتسليم" },
    body: {
      en: "A joint snagging walk, resolution of defects, system demonstrations and a handover pack with drawings, test records and supplier warranties. Completion certificates or connections may also be required.",
      ar: "جولة مشتركة لرصد الملاحظات، ومعالجة العيوب، وشرح تشغيل الأنظمة، وتسليم ملف يضم المخططات وسجلات الاختبارات وضمانات الموردين. وقد تكون شهادات الإنجاز أو توصيلات الخدمات مطلوبة كذلك.",
    },
    varies: true,
  },
  {
    id: "renovation",
    title: { en: "Renovation planning", ar: "تخطيط التجديد" },
    body: {
      en: "Renovations start with understanding the existing building. In apartments and managed communities, building management or developer rules often govern working hours, access and the approvals needed.",
      ar: "يبدأ التجديد بفهم المبنى القائم. وفي الشقق والمجتمعات المُدارة، غالباً ما تحدد قواعد إدارة المبنى أو المطوّر ساعات العمل والدخول والموافقات المطلوبة.",
    },
    varies: true,
  },
  {
    id: "maintenance",
    title: { en: "Property maintenance", ar: "صيانة العقار" },
    body: {
      en: "Planned maintenance of cooling, plumbing, electrical systems and waterproofing catches small problems early. Keep handover documents — they make future maintenance faster and cheaper.",
      ar: "تساعد الصيانة المخططة لأنظمة التبريد والسباكة والكهرباء والعزل المائي على اكتشاف المشكلات الصغيرة مبكراً. احتفظ بمستندات التسليم، فهي تجعل الصيانة المستقبلية أسرع وأقل تكلفة.",
    },
    varies: false,
  },
];

export type RegulatoryNotes = {
  market: string;
  /** ISO date the content and links were last checked. */
  lastChecked: string;
  reviewStatus: "unreviewed" | "reviewed";
  summary: Localized;
  points: Localized[];
  sources: { name: Localized; url: string; note: Localized }[];
};

export const regulatoryNotes: Record<string, RegulatoryNotes> = {
  ae: {
    market: "ae",
    lastChecked: "2026-10-26",
    reviewStatus: "unreviewed",
    summary: {
      en: "In the UAE, building permits and construction safety are handled at emirate level. The UAE Government portal explains that local municipalities are the entities that oversee building and construction safety, and it lists each emirate's permit services.",
      ar: "في دولة الإمارات، تُدار تصاريح البناء والسلامة الإنشائية على مستوى كل إمارة. وتوضح البوابة الرسمية لحكومة الإمارات أن البلديات المحلية هي الجهات المسؤولة عن الإشراف على سلامة المباني والإنشاءات، وتعرض خدمات التصاريح الخاصة بكل إمارة.",
    },
    points: [
      {
        en: "The authority that applies depends on where the property is. Some areas, such as free zones and master-planned communities, have their own planning or building authority.",
        ar: "تعتمد الجهة المختصة على موقع العقار، إذ إن لبعض المناطق، مثل المناطق الحرة والمجتمعات المخططة، جهات تخطيط أو بناء خاصة بها.",
      },
      {
        en: "Requirements differ by emirate, property type and scope of work. Confirm them with the relevant authority — and, for apartments or community homes, with the building management or developer — before work starts.",
        ar: "تختلف المتطلبات باختلاف الإمارة ونوع العقار ونطاق العمل. تأكد منها لدى الجهة المختصة، ولدى إدارة المبنى أو المطوّر في حالة الشقق أو منازل المجتمعات، قبل بدء العمل.",
      },
      {
        en: "Some work must be carried out or certified by licensed professionals. Whether CONSTRUKT can prepare or submit any application for your project depends on the project and on authorizations that will be confirmed in writing; nothing on this website guarantees an approval.",
        ar: "يجب أن يُنفَّذ بعض الأعمال أو يُعتمد من قِبل مختصين مرخّصين. وتعتمد قدرة CONSTRUKT على إعداد أي طلب أو تقديمه لمشروعك على طبيعة المشروع وعلى التراخيص التي سيتم تأكيدها كتابياً؛ ولا يضمن أي محتوى في هذا الموقع الحصول على موافقة.",
      },
    ],
    sources: [
      {
        name: { en: "UAE Government portal — Buildings' safety", ar: "البوابة الرسمية لحكومة الإمارات — سلامة المباني" },
        url: "https://u.ae/en/information-and-services/justice-safety-and-the-law/Safety/building-safety",
        note: { en: "Federal overview and links to each emirate's permit services (English page).", ar: "نظرة عامة اتحادية وروابط لخدمات التصاريح في كل إمارة (الصفحة باللغة الإنجليزية)." },
      },
      {
        name: { en: "Dubai Municipality", ar: "بلدية دبي" },
        url: "https://www.dm.gov.ae",
        note: { en: "Building permits in Dubai outside separately governed areas.", ar: "تصاريح البناء في دبي خارج المناطق ذات الجهات المستقلة." },
      },
      {
        name: { en: "Dubai Development Authority", ar: "سلطة دبي للتطوير" },
        url: "https://dda.gov.ae",
        note: { en: "Planning and building within its designated zones.", ar: "التخطيط والبناء ضمن المناطق التابعة لها." },
      },
      {
        name: { en: "Abu Dhabi Department of Municipalities and Transport", ar: "دائرة البلديات والنقل – أبوظبي" },
        url: "https://www.dmt.gov.ae",
        note: { en: "Municipal services and building permits in Abu Dhabi.", ar: "الخدمات البلدية وتصاريح البناء في أبوظبي." },
      },
      {
        name: { en: "Sharjah City Municipality", ar: "بلدية مدينة الشارقة" },
        url: "https://www.shjmun.gov.ae",
        note: { en: "Municipal services in Sharjah city.", ar: "الخدمات البلدية في مدينة الشارقة." },
      },
      {
        name: { en: "Fujairah Municipality", ar: "بلدية الفجيرة" },
        url: "https://www.fujmun.gov.ae",
        note: { en: "Municipal services in Fujairah.", ar: "الخدمات البلدية في الفجيرة." },
      },
    ],
  },
};
