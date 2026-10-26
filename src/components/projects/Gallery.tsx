"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { ProjectImage } from "@/data/projects";

/**
 * Project gallery with a lightbox built on the native <dialog> element, which
 * provides focus containment, Escape-to-close and an inert background.
 */
export function Gallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState(0);
  const current = images[index];

  const open = (next: number, button: HTMLButtonElement) => {
    opener.current = button;
    setIndex(next);
    dialog.current?.showModal();
  };
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + images.length) % images.length), [images.length]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (event: KeyboardEvent) => {
      if (!el.open) return;
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-12 md:gap-6">
        {images.map((image, i) => {
          const span =
            images.length === 2 ? "md:col-span-6" : i === 0 ? "md:col-span-12" : i % 3 === 1 ? "md:col-span-7" : "md:col-span-5";
          return (
            <li key={image.src} className={span}>
              <button
                type="button"
                onClick={(event) => open(i, event.currentTarget)}
                data-cursor="Open Gallery"
                className="group relative block w-full overflow-hidden bg-ivory-deep"
                style={{ aspectRatio: i === 0 && images.length > 2 ? "21 / 9" : String(Math.max(image.ratio, 1.2)) }}
                aria-label={`Open image ${i + 1} of ${images.length}: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes={i === 0 ? "100vw" : "(min-width: 768px) 55vw, 100vw"}
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                />
                <span className="eyebrow absolute bottom-3 left-3 rounded-full bg-charcoal/70 px-3 py-1.5 text-ivory opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  View {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialog}
        aria-label={`${title} gallery`}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-charcoal/97 p-0 text-ivory backdrop:bg-charcoal/80"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        onClose={() => opener.current?.focus()}
      >
        <div className="flex h-full flex-col">
          <div className="container-x flex items-center justify-between py-4">
            <p className="eyebrow text-ivory/70" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/30 hover:border-ivory"
              aria-label="Close gallery"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <figure className="container-x flex min-h-0 flex-1 flex-col pb-4">
            <div className="relative min-h-0 flex-1">
              {current && (
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="animate-[page-enter_0.5s_ease-out] object-contain"
                />
              )}
            </div>
            <figcaption className="mt-4 text-center text-sm text-ivory/75">{current?.alt}</figcaption>
          </figure>
          {images.length > 1 && (
            <div className="container-x flex justify-center gap-3 pb-6">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-ivory/30 hover:border-ivory"
                aria-label="Previous image"
              >
                <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-ivory/30 hover:border-ivory"
                aria-label="Next image"
              >
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
