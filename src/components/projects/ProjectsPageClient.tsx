"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project, ProjectCategory } from "@/types/portfolio";

interface ProjectsPageClientProps {
  categories: ProjectCategory[];
  projects: Project[];
}

const projectsPerPage = 6;
const heroImageUrl =
  "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=2200&q=80";

export function ProjectsPageClient({ categories, projects }: ProjectsPageClientProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [year, setYear] = useState("all");
  const [location, setLocation] = useState("all");
  const [page, setPage] = useState(1);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const availableYears = useMemo(
    () =>
      Array.from(new Set(projects.map((project) => project.year).filter(Boolean)))
        .sort((a, b) => Number(b) - Number(a))
        .map(String),
    [projects],
  );

  const availableLocations = useMemo(
    () =>
      Array.from(new Set(projects.map((project) => project.location).filter(Boolean)))
        .sort((a, b) => String(a).localeCompare(String(b)))
        .map(String),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [project.title, project.location, project.summary, project.description]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(normalizedSearch));

        const matchesCategory = categoryId === "all" || project.categoryIds.includes(categoryId);
        const matchesYear = year === "all" || String(project.year) === year;
        const matchesLocation = location === "all" || project.location === location;

        return matchesSearch && matchesCategory && matchesYear && matchesLocation;
      })
      .sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }

        return a.sortOrder - b.sortOrder;
      });
  }, [categoryId, location, projects, search, year]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / projectsPerPage));
  const visibleProjects = filteredProjects.slice((page - 1) * projectsPerPage, page * projectsPerPage);

  function resetFilters() {
    setSearch("");
    setCategoryId("all");
    setYear("all");
    setLocation("all");
  }

  return (
    <>
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-28 text-white sm:px-8 lg:px-12 lg:py-36">
        <Image
          src={heroImageUrl}
          alt="Fachada arquitectónica contemporánea para el portafolio OTAE."
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-62 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/38 to-black/18" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/72">
            Portafolio
          </p>
          <h1 className="mt-6 font-title text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
            Proyectos
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Una selección de trabajos donde arquitectura, construcción e interiorismo se articulan
            desde el contexto, el uso y la claridad técnica.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 border-y border-neutral-200 py-5 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_0.7fr_1fr_auto] xl:items-end">
            <FilterField label="Buscar">
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Nombre, ubicación o descripción"
                className="h-11 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
              />
            </FilterField>

            <FilterField label="Especialización">
              <select
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setPage(1);
                }}
                className="h-11 w-full appearance-none border-0 border-b border-neutral-300 bg-transparent px-0 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
              >
                <option value="all">Todas las áreas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Año">
              <select
                value={year}
                onChange={(event) => {
                  setYear(event.target.value);
                  setPage(1);
                }}
                className="h-11 w-full appearance-none border-0 border-b border-neutral-300 bg-transparent px-0 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
              >
                <option value="all">Todos</option>
                {availableYears.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Ubicación">
              <select
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setPage(1);
                }}
                className="h-11 w-full appearance-none border-0 border-b border-neutral-300 bg-transparent px-0 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
              >
                <option value="all">Todas</option>
                {availableLocations.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </FilterField>

            <button
              type="button"
              className="h-11 text-left text-sm font-semibold text-neutral-500 transition hover:text-neutral-950 xl:text-right"
              onClick={resetFilters}
            >
              Limpiar filtros
            </button>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6 text-sm text-neutral-500">
            <p>
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "proyecto encontrado" : "proyectos encontrados"}
            </p>
            <p>Página {page} de {totalPages}</p>
          </div>

          {visibleProjects.length > 0 ? (
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
              {visibleProjects.map((project, index) => (
                <ProjectEditorialCard
                  key={project.id}
                  category={getPrimaryCategory(project, categoryById)}
                  project={project}
                  prominent={isProminentProject(project, index)}
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
            <div className="mt-14 flex items-center justify-center gap-5">
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
          ) : null}
        </div>
      </section>
    </>
  );
}

interface FilterFieldProps {
  children: React.ReactNode;
  label: string;
}

function FilterField({ children, label }: FilterFieldProps) {
  return (
    <label className="block">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-neutral-400">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

interface ProjectEditorialCardProps {
  category?: ProjectCategory;
  project: Project;
  prominent: boolean;
}

function ProjectEditorialCard({ category, project, prominent }: ProjectEditorialCardProps) {
  return (
    <article className={prominent ? "lg:row-span-2" : ""}>
      <Link href={`/proyectos/${project.slug}`} className="group block">
        <div
          className={`relative overflow-hidden bg-neutral-200 ${
            prominent ? "aspect-[4/5] lg:aspect-[5/6]" : "aspect-[4/3]"
          }`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
          {project.coverMedia ? (
            <Image
              src={project.coverMedia.url}
              alt={project.coverMedia.altText ?? project.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/28 to-transparent opacity-80" />
        </div>

        <div className="mt-5 flex items-start justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
              {category?.name ?? "Proyecto"}
            </p>
            <h2 className="mt-2 font-title text-2xl font-medium text-neutral-950 sm:text-3xl">
              {project.title}
            </h2>
          </div>
          <p className="pt-1 text-right text-sm leading-6 text-neutral-500">
            {[project.location, project.year].filter(Boolean).join(" · ")}
          </p>
        </div>
      </Link>
    </article>
  );
}

function getPrimaryCategory(project: Project, categoryById: Map<string, ProjectCategory>) {
  if (project.primaryCategoryId) {
    return categoryById.get(project.primaryCategoryId);
  }

  return categoryById.get(project.categoryIds[0]);
}

function isProminentProject(project: Project, index: number) {
  return project.isFeatured || index === 0 || index === 5;
}
