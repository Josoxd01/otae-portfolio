"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { ProjectMedia } from "@/types/portfolio";

interface ProjectMediaGalleryProps {
  background?: "base" | "soft";
  media: ProjectMedia[];
  title: string;
}

export function ProjectMediaGallery({ background = "soft", media, title }: ProjectMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeMedia = activeIndex === null ? undefined : media[activeIndex];

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + media.length) % media.length,
        );
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % media.length,
        );
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, media.length]);

  if (media.length === 0) {
    return null;
  }

  function previousImage() {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + media.length) % media.length,
    );
  }

  function nextImage() {
    setActiveIndex((current) => (current === null ? current : (current + 1) % media.length));
  }

  return (
    <section
      className={`px-6 py-12 sm:px-8 lg:px-12 lg:py-16 ${
        background === "soft" ? "bg-neutral-50" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-8">
          <h2 className="font-title text-3xl font-medium text-neutral-950 sm:text-4xl">
            {title}
          </h2>
          <p className="hidden text-sm text-neutral-400 sm:block">
            {media.length} {media.length === 1 ? "imagen" : "imágenes"}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="group cursor-pointer text-left focus:outline-none"
              aria-label={`Abrir ${item.title ?? title}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-neutral-200">
                <span className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
                <Image
                  src={item.url}
                  alt={item.altText ?? item.title ?? title}
                  fill
                  quality={90}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 px-6 text-center opacity-0 transition duration-300 group-hover:bg-black/34 group-hover:opacity-100 group-focus-visible:bg-black/34 group-focus-visible:opacity-100">
                  <span>
                    {item.title ? (
                      <span className="block font-title text-xl font-medium leading-tight text-white">
                        {item.title}
                      </span>
                    ) : null}
                    <span className="mt-3 block text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-white/72">
                      Ver imagen
                    </span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeMedia ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeMedia.title ?? title}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-white/25 text-2xl text-white/80 transition hover:bg-white hover:text-neutral-950"
            aria-label="Cerrar visor"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(null);
            }}
          >
            ×
          </button>

          {media.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/25 text-3xl text-white/80 transition hover:bg-white hover:text-neutral-950"
                aria-label="Imagen anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  previousImage();
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/25 text-3xl text-white/80 transition hover:bg-white hover:text-neutral-950"
                aria-label="Imagen siguiente"
                onClick={(event) => {
                  event.stopPropagation();
                  nextImage();
                }}
              >
                ›
              </button>
            </>
          ) : null}

          <figure
            className="flex h-full max-h-[86vh] w-full max-w-6xl flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 w-full flex-1">
              <Image
                src={activeMedia.url}
                alt={activeMedia.altText ?? activeMedia.title ?? title}
                fill
                quality={95}
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {activeMedia.title ? (
              <figcaption className="max-w-3xl text-center text-sm leading-relaxed text-white/72 sm:text-base">
                {activeMedia.title}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </section>
  );
}
