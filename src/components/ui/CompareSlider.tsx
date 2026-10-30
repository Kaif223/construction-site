"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MoveHorizontal } from "lucide-react";

type Side = { src: string; alt: string; label: string };

/**
 * Before/after comparison. A native range input drives the split, so it works
 * with pointer, touch and keyboard (arrow keys, Home/End) out of the box.
 */
export function CompareSlider({
  before,
  after,
  initial = 50,
  label,
  valueText,
  className = "",
}: {
  before: Side;
  after: Side;
  initial?: number;
  /** Accessible name of the slider, e.g. "Compare drawing and built". */
  label: string;
  /** Spoken value; "{value}" is replaced with the percentage. */
  valueText: string;
  className?: string;
}) {
  const [position, setPosition] = useState(initial);
  const id = useId();

  return (
    // The comparison is spatial (drawing on the left, building on the right), so it stays left-to-right in every language.
    <div className={className} dir="ltr">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-graphite select-none md:aspect-[16/9]"
      >
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={before.src}
            alt={before.alt}
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover"
          />
        </div>

        <span className="eyebrow pointer-events-none absolute top-4 left-4 rounded-full bg-charcoal/75 px-3 py-1.5 text-ivory backdrop-blur">
          {before.label}
        </span>
        <span className="eyebrow pointer-events-none absolute top-4 right-4 rounded-full bg-ivory/90 px-3 py-1.5 text-charcoal">
          {after.label}
        </span>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-ivory"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-orange text-charcoal shadow-lg">
            <MoveHorizontal className="h-5 w-5" />
          </span>
        </div>

        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-valuetext={valueText.replace("{value}", String(position))}
          className="peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-orange ring-inset peer-focus-visible:ring-2"
        />
      </div>
    </div>
  );
}
