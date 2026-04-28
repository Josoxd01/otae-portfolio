"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { Project, ProjectCategory } from "@/types/portfolio";

interface FeaturedProjectsCarouselProps {
  categories: ProjectCategory[];
  projects: Project[];
}

export function FeaturedProjectsCarousel({ categories, projects }: FeaturedProjectsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  useEffect(() => {
    if (projects.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [projects.length]);

  if (projects.length === 0) {
    return null;
  }

  const activeProject = projects[activeIndex];
  const primaryCategory = activeProject.primaryCategoryId
    ? categoryById.get(activeProject.primaryCategoryId)
    : undefined;

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + projects.length) % projects.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % projects.length);
  }

  return (
    <section id="proyectos" className="relative bg-neutral-950">
      <Link
        href={`/proyectos/${activeProject.slug}`}
        className="group relative flex min-h-[calc(100svh-68px)] overflow-hidden md:min-h-[640px]"
        aria-label={`Ver proyecto ${activeProject.title}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#d8d3c8,#8e9088_46%,#222)]" />
        {activeProject.coverMedia ? (
          <Image
            src={activeProject.coverMedia.url}
            alt={activeProject.coverMedia.altText ?? activeProject.title}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.015]"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/32 to-black/14" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end px-6 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-12">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/78">
              {primaryCategory?.name ?? "Proyecto"}
            </p>
            <h1 className="mt-5 font-title text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl">
              {activeProject.title}
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-8 text-white/88 sm:text-lg">
              {activeProject.summary}
            </p>
            <p className="mt-8 text-sm text-white/72">
              {[activeProject.location, activeProject.year].filter(Boolean).join(" • ")}
            </p>
          </div>
        </div>
      </Link>

      {projects.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/35 bg-white/8 text-2xl text-white transition hover:bg-white hover:text-neutral-950 sm:left-8"
            aria-label="Ver proyecto anterior"
            onClick={goToPrevious}
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/35 bg-white/8 text-2xl text-white transition hover:bg-white hover:text-neutral-950 sm:right-8"
            aria-label="Ver proyecto siguiente"
            onClick={goToNext}
          >
            ›
          </button>
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:right-8">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className={`h-1.5 transition ${
                  index === activeIndex ? "w-9 bg-white" : "w-4 bg-white/40"
                }`}
                aria-label={`Ir al proyecto ${project.title}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
