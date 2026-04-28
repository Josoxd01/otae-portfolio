"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project, ProjectCategory, ProjectMedia } from "@/types/portfolio";

interface ProjectsPageClientProps {
  categories: ProjectCategory[];
  projectMediaByProjectId: Record<string, ProjectMedia[]>;
  projects: Project[];
}

interface FilterOption {
  label: string;
  value: string;
}

type FilterKey = "category" | "year" | "location";

const projectsPerPage = 3;
const heroVideoUrl =
  "https://videos.pexels.com/video-files/856192/856192-hd_1920_1080_25fps.mp4";
const heroFallbackImageUrl =
  "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=2200&q=80";

export function ProjectsPageClient({
  categories,
  projectMediaByProjectId,
  projects,
}: ProjectsPageClientProps) {
  const [categoryId, setCategoryId] = useState("all");
  const [year, setYear] = useState("all");
  const [location, setLocation] = useState("all");
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [page, setPage] = useState(1);
  const [videoFailed, setVideoFailed] = useState(false);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const categoryOptions = useMemo<FilterOption[]>(
    () => [
      { label: "Todas las áreas", value: "all" },
      ...categories.map((category) => ({ label: category.name, value: category.id })),
    ],
    [categories],
  );

  const yearOptions = useMemo<FilterOption[]>(
    () => [
      { label: "Todos los años", value: "all" },
      ...Array.from(new Set(projects.map((project) => project.year).filter(Boolean)))
        .sort((a, b) => Number(b) - Number(a))
        .map((value) => ({ label: String(value), value: String(value) })),
    ],
    [projects],
  );

  const locationOptions = useMemo<FilterOption[]>(
    () => [
      { label: "Todas las ubicaciones", value: "all" },
      ...Array.from(new Set(projects.map((project) => project.location).filter(Boolean)))
        .sort((a, b) => String(a).localeCompare(String(b)))
        .map((value) => ({ label: String(value), value: String(value) })),
    ],
    [projects],
  );

  const filteredProjects = useMemo(
    () =>
      projects
        .filter((project) => {
          const matchesCategory = categoryId === "all" || project.categoryIds.includes(categoryId);
          const matchesYear = year === "all" || String(project.year) === year;
          const matchesLocation = location === "all" || project.location === location;

          return matchesCategory && matchesYear && matchesLocation;
        })
        .sort((a, b) => {
          if (a.isFeatured !== b.isFeatured) {
            return a.isFeatured ? -1 : 1;
          }

          return a.sortOrder - b.sortOrder;
        }),
    [categoryId, location, projects, year],
  );

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / projectsPerPage));
  const visibleProjects = filteredProjects.slice((page - 1) * projectsPerPage, page * projectsPerPage);

  function updateFilter(filter: FilterKey, value: string) {
    if (filter === "category") {
      setCategoryId(value);
    }

    if (filter === "year") {
      setYear(value);
    }

    if (filter === "location") {
      setLocation(value);
    }

    setOpenFilter(null);
    setPage(1);
  }

  function resetFilters() {
    setCategoryId("all");
    setYear("all");
    setLocation("all");
    setOpenFilter(null);
    setPage(1);
  }

  return (
    <>
      <section className="relative h-[52svh] min-h-[420px] overflow-hidden bg-neutral-950 sm:h-[58svh] lg:h-[66svh]">
        <Image
          src={heroFallbackImageUrl}
          alt="Fachada arquitectónica contemporánea para el portafolio OTAE."
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!videoFailed ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={heroFallbackImageUrl}
            aria-label="Video de fondo arquitectónico del portafolio OTAE"
            onError={() => setVideoFailed(true)}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-black/18" />
      </section>

      <section className="px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 border-y border-neutral-200 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-3 md:grid-cols-3 lg:min-w-0 lg:flex-1">
              <CustomFilter
                icon={<LayersIcon />}
                isOpen={openFilter === "category"}
                label="Especialización"
                onOpenChange={() => setOpenFilter(openFilter === "category" ? null : "category")}
                onSelect={(value) => updateFilter("category", value)}
                options={categoryOptions}
                value={categoryId}
              />
              <CustomFilter
                icon={<CalendarIcon />}
                isOpen={openFilter === "year"}
                label="Año"
                onOpenChange={() => setOpenFilter(openFilter === "year" ? null : "year")}
                onSelect={(value) => updateFilter("year", value)}
                options={yearOptions}
                value={year}
              />
              <CustomFilter
                icon={<PinIcon />}
                isOpen={openFilter === "location"}
                label="Ubicación"
                onOpenChange={() => setOpenFilter(openFilter === "location" ? null : "location")}
                onSelect={(value) => updateFilter("location", value)}
                options={locationOptions}
                value={location}
              />
            </div>

            <div className="flex items-center justify-end gap-6">
              <div className="group relative">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center border border-neutral-200 text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950"
                  aria-label="Limpiar filtros"
                  onClick={resetFilters}
                >
                  <BroomIcon />
                </button>
                <span className="pointer-events-none absolute right-0 top-[calc(100%+10px)] z-30 whitespace-nowrap bg-neutral-950 px-3 py-2 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                  Limpiar filtros
                </span>
              </div>
            </div>
          </div>

          {visibleProjects.length > 0 ? (
            <div className="mt-16 space-y-24 lg:mt-20 lg:space-y-32">
              {visibleProjects.map((project, index) => (
                <ProjectBlock
                  key={project.id}
                  align={index % 2 === 0 ? "media-left" : "media-right"}
                  category={getPrimaryCategory(project, categoryById)}
                  media={getProjectImages(project, projectMediaByProjectId)}
                  project={project}
                />
              ))}
            </div>
          ) : (
            <div className="mt-16 border-y border-neutral-200 py-16 text-center">
              <p className="font-title text-3xl text-neutral-950">No hay proyectos con esos filtros.</p>
              <button
                type="button"
                className="mt-6 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950"
                onClick={resetFilters}
              >
                Restablecer búsqueda
              </button>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-20 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <p className="text-sm text-neutral-500 sm:min-w-32 sm:text-right">
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? "proyecto" : "proyectos"}
              </p>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center border border-neutral-300 text-2xl text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950 disabled:pointer-events-none disabled:opacity-35"
                disabled={page === 1}
                aria-label="Página anterior"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                ‹
              </button>
              <span className="text-sm text-neutral-500">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center border border-neutral-300 text-2xl text-neutral-950 transition hover:bg-neutral-950 hover:text-white disabled:pointer-events-none disabled:opacity-35"
                disabled={page === totalPages}
                aria-label="Página siguiente"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                ›
              </button>
            </div>
          ) : visibleProjects.length > 0 ? (
            <p className="mt-20 text-center text-sm text-neutral-500">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "proyecto" : "proyectos"}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}

interface CustomFilterProps {
  icon: React.ReactNode;
  isOpen: boolean;
  label: string;
  onOpenChange: () => void;
  onSelect: (value: string) => void;
  options: FilterOption[];
  value: string;
}

function CustomFilter({
  icon,
  isOpen,
  label,
  onOpenChange,
  onSelect,
  options,
  value,
}: CustomFilterProps) {
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-14 w-full items-center justify-between border border-neutral-200 bg-white px-4 text-left transition hover:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
        aria-expanded={isOpen}
        onClick={onOpenChange}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="text-neutral-500">{icon}</span>
          <span className="min-w-0">
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-neutral-400">
              {label}
            </span>
            <span className="mt-0.5 block truncate text-sm font-medium text-neutral-950">
              {selectedOption?.label}
            </span>
          </span>
        </span>
        <span className={`text-lg text-neutral-500 transition ${isOpen ? "rotate-180" : ""}`}>
          ˅
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 border border-neutral-200 bg-white p-1 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm transition ${
                option.value === value
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
              onClick={() => onSelect(option.value)}
            >
              {option.label}
              {option.value === value ? <span aria-hidden="true">•</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface ProjectBlockProps {
  align: "media-left" | "media-right";
  category?: ProjectCategory;
  media: {
    primary?: ProjectMedia;
    secondary?: ProjectMedia;
  };
  project: Project;
}

function ProjectBlock({ align, category, media, project }: ProjectBlockProps) {
  const mediaContent = <ProjectMediaComposition media={media} project={project} />;
  const textContent = (
    <div className="flex h-full flex-col justify-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
        {category?.name ?? "Proyecto"}
      </p>
      <h2 className="mt-5 font-title text-4xl font-medium leading-tight text-neutral-950 sm:text-5xl">
        {project.title}
      </h2>
      <p className="mt-5 text-sm text-neutral-500">
        {[project.location, project.year].filter(Boolean).join(" · ")}
      </p>
      <p className="mt-7 max-w-xl text-base leading-8 text-neutral-600">{project.summary}</p>
      <Link
        href={`/proyectos/${project.slug}`}
        className="mt-9 inline-flex items-center gap-3 text-sm font-semibold text-neutral-950 transition hover:gap-4"
      >
        Ver proyecto <span aria-hidden="true">→</span>
      </Link>
    </div>
  );

  return (
    <article className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:items-center">
      {align === "media-left" ? (
        <>
          {mediaContent}
          {textContent}
        </>
      ) : (
        <>
          <div className="lg:order-2">{mediaContent}</div>
          <div className="lg:order-1">{textContent}</div>
        </>
      )}
    </article>
  );
}

interface ProjectMediaCompositionProps {
  media: {
    primary?: ProjectMedia;
    secondary?: ProjectMedia;
  };
  project: Project;
}

function ProjectMediaComposition({ media, project }: ProjectMediaCompositionProps) {
  return (
    <div className="relative min-h-[360px] sm:min-h-[500px]">
      <Link
        href={`/proyectos/${project.slug}`}
        className={`group block overflow-hidden bg-neutral-200 ${
          media.secondary
            ? "absolute left-0 top-0 h-[78%] w-[82%]"
            : "relative h-[420px] w-full sm:h-[560px]"
        }`}
      >
        <ProjectImage media={media.primary} title={project.title} sizes="(min-width: 1024px) 52vw, 100vw" />
      </Link>

      {media.secondary ? (
        <Link
          href={`/proyectos/${project.slug}`}
          className="group absolute bottom-0 right-0 h-[48%] w-[46%] overflow-hidden border-[10px] border-white bg-neutral-200 shadow-[0_18px_42px_rgba(0,0,0,0.12)] sm:border-[14px]"
        >
          <ProjectImage
            media={media.secondary}
            title={`${project.title} - imagen secundaria`}
            sizes="(min-width: 1024px) 28vw, 52vw"
          />
        </Link>
      ) : null}
    </div>
  );
}

interface ProjectImageProps {
  media?: ProjectMedia;
  sizes: string;
  title: string;
}

function ProjectImage({ media, sizes, title }: ProjectImageProps) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
      {media ? (
        <Image
          src={media.url}
          alt={media.altText ?? title}
          fill
          sizes={sizes}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.018]"
        />
      ) : null}
    </div>
  );
}

function getPrimaryCategory(project: Project, categoryById: Map<string, ProjectCategory>) {
  if (project.primaryCategoryId) {
    return categoryById.get(project.primaryCategoryId);
  }

  return categoryById.get(project.categoryIds[0]);
}

function getProjectImages(
  project: Project,
  projectMediaByProjectId: Record<string, ProjectMedia[]>,
) {
  const projectMedia = projectMediaByProjectId[project.id] ?? [];
  const visibleImages = projectMedia
    .filter((media) => media.isVisible && media.assetType === "image")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const primary =
    visibleImages.find((media) => media.role === "cover") ??
    (project.coverMedia
      ? {
          id: project.coverMedia.id ?? `${project.id}-cover`,
          url: project.coverMedia.url,
          assetType: project.coverMedia.assetType,
          role: "cover" as const,
          title: project.coverMedia.title,
          altText: project.coverMedia.altText,
          sortOrder: 0,
          isVisible: true,
        }
      : undefined);

  const secondary = visibleImages.find((media) => media.url !== primary?.url);

  return { primary, secondary };
}

function LayersIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="m12 4 8 4-8 4-8-4 8-4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 12 8 4 8-4" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 16 8 4 8-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M7 3v4M17 3v4M4.5 9.5h15" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 5.5h11A2.5 2.5 0 0 1 20 8v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18V8a2.5 2.5 0 0 1 2.5-2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BroomIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="m14 4 6 6-8 8-6-6 8-8Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 14 6 6M3 21h8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
