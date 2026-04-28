"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { MediaReference, Project, ProjectCategory } from "@/types/portfolio";

interface SpecializationAreasSectionProps {
  categories: ProjectCategory[];
  projects: Project[];
}

export function SpecializationAreasSection({
  categories,
  projects,
}: SpecializationAreasSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCategory = categories[activeIndex];

  const projectByCategory = useMemo(() => {
    const entries: Array<[string, Project | undefined]> = categories.map((category) => {
      const relatedProjects = projects.filter(
        (project) => project.coverMedia && project.categoryIds.includes(category.id),
      );
      const preferredProject =
        relatedProjects.find((project) => project.primaryCategoryId === category.id) ??
        relatedProjects.find((project) => project.coverMedia?.url !== category.coverMedia?.url) ??
        relatedProjects[0];

      return [category.id, preferredProject];
    });

    return new Map(entries);
  }, [categories, projects]);

  if (!activeCategory) {
    return null;
  }

  const relatedProject = projectByCategory.get(activeCategory.id);
  const mainMedia = getMainMedia(activeCategory, relatedProject);
  const secondaryMedia = getSecondaryMedia(activeCategory, relatedProject, projects);
  const totalItems = categories.length;

  function previousItem() {
    setActiveIndex((current) => (current - 1 + totalItems) % totalItems);
  }

  function nextItem() {
    setActiveIndex((current) => (current + 1) % totalItems);
  }

  return (
    <section className="bg-neutral-50 px-6 py-20 text-neutral-950 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-24">
        <div className="max-w-xl">
          <p className="section-label">Áreas de especialización</p>
          <h2 className="mt-7 font-title text-4xl font-medium leading-tight sm:text-5xl">
            {activeCategory.name}
          </h2>
          {activeCategory.description ? (
            <p className="mt-6 text-base leading-8 text-neutral-600 sm:text-lg">
              {activeCategory.description}
            </p>
          ) : null}

          <Link
            href={`/proyectos?categoria=${activeCategory.slug}`}
            className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-neutral-950 transition hover:gap-4"
          >
            Ver proyectos de {activeCategory.name} <span aria-hidden="true">→</span>
          </Link>

          <div className="mt-12 flex items-center gap-5">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center border border-neutral-300 text-2xl text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950"
              aria-label="Especialización anterior"
              onClick={previousItem}
            >
              ‹
            </button>
            <span className="text-sm text-neutral-500">
              {activeIndex + 1} / {totalItems}
            </span>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center border border-neutral-300 text-2xl text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
              aria-label="Especialización siguiente"
              onClick={nextItem}
            >
              ›
            </button>
          </div>

          <div className="mt-6 flex gap-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                className={`h-1.5 transition ${
                  index === activeIndex ? "w-10 bg-neutral-950" : "w-4 bg-neutral-300"
                }`}
                aria-label={`Ver especialización ${category.name}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[440px] sm:min-h-[560px] lg:min-h-[610px]">
          <div className="absolute left-0 top-0 h-[76%] w-[82%] overflow-hidden bg-neutral-200">
            <SpotlightImage
              media={mainMedia}
              alt={mainMedia?.altText ?? `${activeCategory.name} - imagen principal`}
              sizes="(min-width: 1024px) 54vw, 92vw"
              variant="main"
              priority
            />
          </div>

          <Link
            href={relatedProject ? `/proyectos/${relatedProject.slug}` : `/proyectos?categoria=${activeCategory.slug}`}
            className="group absolute bottom-0 right-0 h-[48%] w-[52%] overflow-hidden border-[10px] border-neutral-50 bg-neutral-200 shadow-[0_18px_42px_rgba(0,0,0,0.12)] sm:border-[14px] lg:h-[46%] lg:w-[47%]"
            aria-label={
              relatedProject
                ? `Ver proyecto destacado ${relatedProject.title}`
                : `Ver proyectos de ${activeCategory.name}`
            }
          >
            <SpotlightImage
              media={secondaryMedia}
              alt={
                secondaryMedia?.altText ??
                relatedProject?.title ??
                `${activeCategory.name} - proyecto relacionado`
              }
              sizes="(min-width: 1024px) 26vw, 52vw"
              variant="secondary"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/42 to-transparent px-5 pb-5 pt-16 text-white">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/70">
                Proyecto destacado
              </p>
              <h3 className="mt-2 font-title text-xl font-medium leading-tight">
                {relatedProject?.title ?? activeCategory.name}
              </h3>
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition group-hover:gap-3 group-hover:text-white">
                Ver proyecto <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function getMainMedia(category: ProjectCategory, relatedProject?: Project) {
  return category.coverMedia ?? relatedProject?.coverMedia;
}

function getSecondaryMedia(category: ProjectCategory, relatedProject: Project | undefined, projects: Project[]) {
  if (relatedProject?.coverMedia && relatedProject.coverMedia.url !== category.coverMedia?.url) {
    return relatedProject.coverMedia;
  }

  return projects.find((project) => project.coverMedia?.url !== category.coverMedia?.url)?.coverMedia;
}

interface SpotlightImageProps {
  alt: string;
  media?: MediaReference;
  priority?: boolean;
  sizes: string;
  variant: "main" | "secondary";
}

function SpotlightImage({ alt, media, priority = false, sizes, variant }: SpotlightImageProps) {
  const imageTone =
    variant === "secondary"
      ? "grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
      : "transition duration-700 hover:scale-[1.015]";

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
      {media ? (
        <Image
          src={media.url}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`absolute inset-0 h-full w-full object-cover ${imageTone}`}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      {variant === "main" ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/12 to-transparent" />
      ) : null}
    </div>
  );
}
