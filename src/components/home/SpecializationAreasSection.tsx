"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { MediaReference, Project, ProjectCategory } from "@/types/portfolio";

interface SpecializationAreasSectionProps {
  categories: ProjectCategory[];
  projects: Project[];
}

const pageSize = 3;

export function SpecializationAreasSection({
  categories,
  projects,
}: SpecializationAreasSectionProps) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));
  const visibleCategories = categories.slice(page * pageSize, page * pageSize + pageSize);

  const projectByCategory = useMemo(() => {
    const entries: Array<[string, Project | undefined]> = categories.map((category) => [
      category.id,
      projects.find((project) => project.categoryIds.includes(category.id)),
    ]);

    return new Map(entries);
  }, [categories, projects]);

  function previousPage() {
    setPage((current) => (current - 1 + totalPages) % totalPages);
  }

  function nextPage() {
    setPage((current) => (current + 1) % totalPages);
  }

  return (
    <section className="bg-neutral-50 px-6 py-24 text-neutral-950 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-8">
          <p className="section-label">Áreas de especialización</p>

          {totalPages > 1 ? (
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-xl text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950"
                aria-label="Categorías anteriores"
                onClick={previousPage}
              >
                ‹
              </button>
              <span className="text-sm text-neutral-500">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-xl text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                aria-label="Categorías siguientes"
                onClick={nextPage}
              >
                ›
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {visibleCategories.map((category) => (
            <CategoryPreviewCard
              key={category.id}
              category={category}
              project={projectByCategory.get(category.id)}
            />
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-between sm:hidden">
            <button
              type="button"
              className="border border-neutral-200 px-4 py-3 text-sm"
              onClick={previousPage}
            >
              Anterior
            </button>
            <span className="text-sm text-neutral-500">
              {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              className="border border-neutral-200 px-4 py-3 text-sm"
              onClick={nextPage}
            >
              Siguiente
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

interface CategoryPreviewCardProps {
  category: ProjectCategory;
  project?: Project;
}

function CategoryPreviewCard({ category, project }: CategoryPreviewCardProps) {
  const previewMedia: MediaReference | undefined = project?.coverMedia ?? category.coverMedia;
  const previewHref = project ? `/proyectos/${project.slug}` : `/proyectos?categoria=${category.slug}`;
  const previewAlt = previewMedia?.altText ?? `${category.name} - arquitectura`;

  return (
    <article className="group">
      <div className="flex items-start justify-between gap-6">
        <h3 className="font-title text-2xl font-medium">{category.name}</h3>
        <Link
          href={`/proyectos?categoria=${category.slug}`}
          className="mt-1 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 transition hover:text-neutral-950"
        >
          Ver todos →
        </Link>
      </div>

      <Link href={previewHref} className="mt-7 block aspect-[4/3] overflow-hidden bg-neutral-200">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#f2f0eb,#b8bab1_48%,#333)]" />
          {previewMedia ? (
            <Image
              src={previewMedia.url}
              alt={previewAlt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/28 to-transparent" />
        </div>
      </Link>

      {category.description ? (
        <p className="mt-5 text-sm leading-7 text-neutral-600">{category.description}</p>
      ) : null}
    </article>
  );
}
