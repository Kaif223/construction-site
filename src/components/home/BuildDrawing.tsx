/*
 * Elevation drawing of a two-storey villa that assembles stage by stage.
 *
 * Everything is driven by one CSS custom property, `--s`, on the `.build`
 * wrapper: 0 is an empty plot, 9 is the finished house. Each group carries
 * the stage it belongs to (`--l`, 0–8) and each element may start part-way
 * through that stage (`--d`, set with `at`) and take a fraction of it (`--len`). The rules
 * in globals.css turn that into line drawing (`.draw`), fading in (`.fill`),
 * dropping into place (`.pop`) and disappearing again (`.conceal`).
 *
 * Groups are ordered by depth, not by stage: wall infill sits over the frame,
 * glazing over the interior, and so on.
 */

type Vars = { l?: number; at?: number; len?: number; until?: number };

const vars = ({ l, at, len, until }: Vars) =>
  ({ "--l": l, "--d": at, "--len": len, "--until": until }) as React.CSSProperties;

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}z`;
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

/** Zig-zag lattice between two parallel lines, for the crane mast and jib. */
function lattice(from: number, to: number, a: number, b: number, step: number, vertical: boolean) {
  const points: string[] = [];
  const dir = to > from ? 1 : -1;
  for (let i = 0, p = from; dir > 0 ? p <= to : p >= to; i++, p += step * dir) {
    const side = i % 2 === 0 ? a : b;
    points.push(vertical ? `${side} ${p}` : `${p} ${side}`);
  }
  return `M${points.join("L")}`;
}

function Draw({ d, ...timing }: { d: string } & Vars) {
  return <path className="draw" d={d} pathLength={1} style={vars(timing)} />;
}

function Fill({ d, fill, opacity, ...timing }: { d: string; fill: string; opacity?: number } & Vars) {
  return <path className="fill" d={d} fill={fill} stroke="none" fillOpacity={opacity} style={vars(timing)} />;
}

const LOWER_COLUMNS = [134, 285, 525, 566];
const UPPER_COLUMNS = [262, 537, 660];
const OPENINGS = {
  lowerWindow: [168, 324, 80, 52],
  slider: [304, 318, 208, 90],
  ribbon: [300, 206, 215, 56],
  upperWindow: [562, 206, 78, 74],
} as const;
const openingPaths = Object.values(OPENINGS).map(([x, y, w, h]) => rect(x, y, w, h));

export function BuildDrawing({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      direction="ltr"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern id="build-soil" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 10L10 0" stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.8" />
        </pattern>
        <pattern id="build-concrete" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#e4dfd4" />
          <circle cx="2" cy="2" r="0.8" fill="currentColor" fillOpacity="0.35" />
          <circle cx="6" cy="5.5" r="0.6" fill="currentColor" fillOpacity="0.3" />
        </pattern>
        <pattern id="build-blocks" width="20" height="10" patternUnits="userSpaceOnUse">
          <rect width="20" height="10" fill="#e9e0d0" />
          <path d="M0 0.3H20M0 5.3H20M10 0.3V5.3M0.3 5.3V10" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.7" />
        </pattern>
        <pattern id="build-marble" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#f3efe8" />
          <path d="M0 14L14 0" stroke="currentColor" strokeOpacity="0.14" strokeWidth="0.7" />
        </pattern>
        <linearGradient id="build-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cdd8dc" />
          <stop offset="1" stopColor="#eef2f2" />
        </linearGradient>
      </defs>

      {/* 01 · Site preparation — soil and excavation */}
      <Fill d={rect(20, 420, 760, 42)} fill="url(#build-soil)" l={0} at={0.3} len={0.5} />

      {/* 02 · Foundation — footings in the excavation */}
      <g style={vars({ l: 1, len: 0.5 })}>
        {LOWER_COLUMNS.map((x) => (
          <Fill key={x} d={rect(x - 18, 424, 36, 16)} fill="url(#build-concrete)" />
        ))}
      </g>
      <g style={vars({ l: 1, len: 0.5 })}>
        {LOWER_COLUMNS.map((x) => (
          <Draw key={x} d={rect(x - 18, 424, 36, 16)} />
        ))}
      </g>

      {/* 03 · Structure — columns (later enclosed by walls) */}
      <g style={vars({ l: 2, len: 0.4 })}>
        {LOWER_COLUMNS.map((x) => (
          <g key={x}>
            <Fill d={rect(x - 4, 300, 8, 108)} fill="url(#build-concrete)" />
            <Draw d={rect(x - 4, 300, 8, 108)} />
          </g>
        ))}
      </g>
      <g style={vars({ l: 2, at: 0.5, len: 0.3 })}>
        {UPPER_COLUMNS.map((x) => (
          <g key={x}>
            <Fill d={rect(x - 4, 188, 8, 102)} fill="url(#build-concrete)" />
            <Draw d={rect(x - 4, 188, 8, 102)} />
          </g>
        ))}
      </g>

      {/* 04 · Enclosure — blockwork infill */}
      <g style={vars({ l: 3, len: 0.45 })}>
        <Fill d={rect(124, 300, 452, 108)} fill="url(#build-blocks)" />
        <Fill d={rect(254, 188, 414, 102)} fill="url(#build-blocks)" />
      </g>

      {/* 06 · Plaster — smooth render over the blockwork */}
      <g style={vars({ l: 5, len: 0.6 })}>
        <Fill d={rect(124, 300, 452, 108)} fill="#f6f2ea" />
        <Fill d={rect(254, 188, 414, 102)} fill="#f6f2ea" />
      </g>

      {/* 08 · Finishing — dark upper volume */}
      <Fill d={rect(254, 188, 414, 102)} fill="#2f3431" l={7} len={0.5} />

      {/* 04 · Openings left in the walls, showing the interior */}
      <g style={vars({ l: 3, at: 0.4, len: 0.4 })}>
        {openingPaths.map((d) => (
          <Fill key={d} d={d} fill="#ded7ca" />
        ))}
      </g>

      {/* 07 · Flooring & marble — stair and floor seen through the slider */}
      <Fill d={rect(304, 401, 208, 7)} fill="url(#build-marble)" l={6} len={0.5} />
      <Draw d="M314 408V398H328V388H342V378H356V368H370V358H384V348H398V338H412V328H426V318" l={6} at={0.2} len={0.6} />

      {/* 08 · Glazing */}
      <g style={vars({ l: 7, at: 0.35, len: 0.4 })}>
        {openingPaths.map((d) => (
          <Fill key={d} d={d} fill="url(#build-glass)" opacity={0.92} />
        ))}
      </g>
      {/* 09 · Handover — lights on inside */}
      <g style={vars({ l: 8, at: 0.4, len: 0.5 })}>
        {openingPaths.map((d) => (
          <Fill key={d} d={d} fill="#e86b35" opacity={0.28} />
        ))}
      </g>

      {/* 05 · Building services — runs inside the walls, concealed by plaster */}
      <g className="conceal" style={vars({ l: 4, len: 0.7, until: 5 })} strokeWidth={1.4}>
        <g stroke="#e86b35">
          <Draw d="M140 404V334H158" />
          <Draw d="M519 404V342H508" />
          <Draw d="M272 286V214H292" />
          <Draw d="M650 286V236" />
        </g>
        <g stroke="#3d6f9a">
          <Draw d="M552 408V310H574" />
          <Draw d="M664 190V286" />
          <Draw d="M300 290V282H330" />
        </g>
      </g>

      {/* 03 · Structure — slabs stay visible as bands on the elevation */}
      <g style={vars({ l: 2, at: 0.3, len: 0.3 })}>
        <Fill d={rect(116, 290, 560, 10)} fill="url(#build-concrete)" />
        <Draw d={rect(116, 290, 560, 10)} />
      </g>
      <g style={vars({ l: 2, at: 0.75, len: 0.25 })}>
        <Fill d={rect(250, 178, 426, 10)} fill="url(#build-concrete)" />
        <Draw d={rect(250, 178, 426, 10)} />
      </g>

      {/* 04 · Wall and opening outlines, parapet */}
      <g style={vars({ l: 3, len: 0.5 })}>
        <Draw d={rect(124, 300, 452, 108)} />
        <Draw d={rect(254, 188, 414, 102)} />
      </g>
      <g style={vars({ l: 3, at: 0.4, len: 0.5 })}>
        {openingPaths.map((d) => (
          <Draw key={d} d={d} />
        ))}
        <Draw d="M250 178V169H676V178" />
      </g>

      {/* 08 · Window frames and timber cladding */}
      <g style={vars({ l: 7, at: 0.5, len: 0.45 })} strokeWidth={1}>
        <Draw d="M408 318V408M356 318V408M460 318V408" />
        <Draw d="M372 206V262M444 206V262" />
        <Draw d="M601 206V280" />
        <Draw d="M208 324V376" />
      </g>
      <g style={vars({ l: 7, at: 0.2, len: 0.6 })} stroke="#a0714b" strokeWidth={1.6}>
        {Array.from({ length: 6 }, (_, i) => 258 + i * 7).map((x) => (
          <Draw key={x} d={`M${x} 192V286`} />
        ))}
        {Array.from({ length: 8 }, (_, i) => 518 + i * 7).map((x) => (
          <Draw key={x} d={`M${x} 304V404`} />
        ))}
      </g>

      {/* 06 · Waterproofing membrane on the roof; 05 · roof plant */}
      <g style={vars({ l: 5, at: 0.3, len: 0.5 })} strokeWidth={3}>
        <Draw d="M252 168H674" />
      </g>
      <g className="pop" style={vars({ l: 4, at: 0.5, len: 0.4 })}>
        <path d={rect(590, 154, 40, 14)} fill="#e4dfd4" />
        <path d="M598 154v14M606 154v14" strokeWidth={0.8} />
      </g>

      {/* 01 · Ground line, survey pegs, excavation, dimension */}
      <g style={vars({ l: 0, len: 0.5 })}>
        <Draw d="M20 420H780" />
      </g>
      <g style={vars({ l: 0, at: 0.35, len: 0.45 })}>
        <Draw d="M116 420V444H586V420" />
        <Draw d="M116 420V398L128 402L116 406" />
        <Draw d="M586 420V398L598 402L586 406" />
      </g>
      <g style={vars({ l: 0, at: 0.6, len: 0.4 })} strokeWidth={0.9}>
        <Draw d="M116 484H586M116 477V491M586 477V491" />
        <text
          className="fill"
          x="351"
          y="479"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="10"
          fontFamily="var(--font-mono)"
          letterSpacing="1.5"
        >
          14 400
        </text>
      </g>

      {/* 02 · Ground-floor slab */}
      <g style={vars({ l: 1, at: 0.45, len: 0.5 })}>
        <Fill d={rect(118, 408, 464, 12)} fill="url(#build-concrete)" />
        <Draw d={rect(118, 408, 464, 12)} />
      </g>

      {/* Tower crane: arrives with the foundations, leaves before handover */}
      <g className="conceal" style={vars({ l: 1, until: 8 })}>
        <g style={vars({ at: 0.3, len: 0.7 })} strokeWidth={1}>
          <Fill d={rect(674, 420, 48, 12)} fill="url(#build-concrete)" />
          <Draw d="M690 432V64M706 432V64" />
          <Draw d={lattice(432, 64, 690, 706, 16, true)} />
          <Draw d="M690 64L698 28L706 64" />
          <Draw d="M380 56H780M380 66H780" />
          <Draw d={lattice(380, 780, 56, 66, 16, false)} />
          <Draw d="M698 28L400 56M698 28L770 56" />
          <Fill d={rect(742, 66, 30, 20)} fill="currentColor" opacity={0.8} />
          <Draw d={rect(706, 66, 18, 16)} />
        </g>
        <g className="trolley">
          <g style={vars({ at: 0.6, len: 0.4 })} strokeWidth={1}>
            <Draw d={rect(634, 66, 12, 6)} />
            <Draw d="M640 72V150" />
            <Draw d="M636 150h8l-4 6z" />
          </g>
          <g className="conceal" style={vars({ until: 3.2 })}>
            <Fill d={rect(600, 158, 80, 8)} fill="url(#build-concrete)" at={0.6} len={0.4} />
            <Draw d={`${rect(600, 158, 80, 8)}M640 156L604 158M640 156L676 158`} at={0.6} len={0.4} />
          </g>
        </g>
      </g>

      {/* 09 · Handover — landscaping, pool, sign-off */}
      <g style={vars({ l: 8, len: 0.6 })}>
        <Fill d={`${circle(66, 330, 34)}${circle(44, 352, 22)}${circle(90, 350, 22)}`} fill="#6c7764" opacity={0.3} />
        <Draw d={`M66 420V352M66 382L50 364M66 372L82 356`} />
        <Draw d={circle(66, 330, 34)} />
        <Draw d={circle(44, 352, 22)} />
        <Draw d={circle(90, 350, 22)} />
        <Draw d="M130 420a12 12 0 0 1 24 0a12 12 0 0 1 24 0M210 420a10 10 0 0 1 20 0" />
      </g>
      <g style={vars({ l: 8, at: 0.3, len: 0.5 })}>
        <Fill d={rect(604, 421, 120, 11)} fill="#9cc4d4" />
        <Draw d={rect(604, 421, 120, 11)} />
      </g>
      <g style={vars({ l: 8, at: 0.55, len: 0.45 })} stroke="#e86b35" strokeWidth={2}>
        <Draw d={circle(735, 112, 28)} />
        <Draw d="M721 112L731 122L750 100" />
      </g>
    </svg>
  );
}
