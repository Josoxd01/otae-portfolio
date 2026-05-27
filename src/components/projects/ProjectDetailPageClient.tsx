"use client";

import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProjectMediaGallery } from "@/components/projects/ProjectMediaGallery";
import {
  type ProjectDetailPageData,
  useProjectDetailData,
} from "@/hooks/useProjectDetailData";
import type { ProjectMedia, ProjectMediaRole, ProjectStage } from "@/types/portfolio";

import type { ReactNode } from "react";

interface ProjectDetailPageClientProps {
  initialData: ProjectDetailPageData;
  slug: string;
}

const mediaRoleSections: Array<{ role: ProjectMediaRole; title: string }> = [
  { role: "gallery", title: "Galería" },
  { role: "plan", title: "Planos" },
  { role: "render", title: "Renders" },
  { role: "construction", title: "Obra" },
  { role: "detail", title: "Detalles" },
  { role: "technical_sheet", title: "Fichas técnicas" },
];

export function ProjectDetailPageClient({ initialData, slug }: ProjectDetailPageClientProps) {
  const { data, isLoading } = useProjectDetailData(slug, initialData);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="section-label">Proyecto</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">
              Cargando proyecto
            </h1>
          </div>
        </main>
        <Footer
          variant="dark"
          studioProfile={initialData.studioProfile}
          contactChannels={initialData.contactChannels}
        />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="section-label">Proyecto</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">
              No encontramos este proyecto
            </h1>
            <Link
              href="/proyectos"
              className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-neutral-950 transition hover:gap-4"
            >
              &larr; Volver a proyectos
            </Link>
          </div>
        </main>
        <Footer
          variant="dark"
          studioProfile={initialData.studioProfile}
          contactChannels={initialData.contactChannels}
        />
      </>
    );
  }

  const { categories, contactChannels, project, projectMedia, studioProfile } = data;
  const primaryCategory = project.primaryCategoryId
    ? categories.find((category) => category.id === project.primaryCategoryId)
    : categories.find((category) => category.id === project.categoryIds[0]);
  const mediaSections = getProjectMediaSections(projectMedia);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-neutral-950">
        <section className="px-0">
          <div className="relative h-[68svh] min-h-[520px] overflow-hidden bg-neutral-200 lg:h-[78svh]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
            {project.coverMedia ? (
              <Image
                src={project.coverMedia.url}
                alt={project.coverMedia.altText ?? project.title}
                fill
                priority
                quality={95}
                sizes="100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/18 to-transparent" />
          </div>
        </section>

        <section className="px-6 pb-10 pt-16 sm:px-8 lg:px-12 lg:pb-12 lg:pt-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
              <div className="max-w-4xl">
                <p className="section-label">{primaryCategory?.name ?? "Proyecto"}</p>
                <h1 className="mt-6 font-title text-4xl font-medium leading-[1.05] text-neutral-950 sm:text-5xl lg:text-6xl">
                  {project.title}
                </h1>
                <p className="mt-8 max-w-3xl text-lg leading-9 text-neutral-600">
                  {project.description}
                </p>
              </div>

              <aside className="lg:pt-14">
                <dl className="space-y-8 text-sm">
                  <ProjectFact icon={<PinIcon />} label="Ubicación" value={project.location} />
                  <ProjectFact
                    icon={<CalendarIcon />}
                    label="Año"
                    value={project.year ? String(project.year) : undefined}
                  />
                  <ProjectFact
                    icon={<RulerIcon />}
                    label="Área"
                    value={
                      project.areaM2
                        ? `${project.areaM2.toLocaleString("es-EC")} m²`
                        : undefined
                    }
                  />
                  <ProjectFact
                    icon={<StageIcon />}
                    label="Etapa"
                    value={getProjectStageLabel(project.projectStage)}
                  />
                </dl>
              </aside>
            </div>
          </div>
        </section>

        {mediaSections.map((section, index) =>
          section.imageMedia.length > 0 ? (
            <ProjectMediaGallery
              key={section.role}
              background={index === 0 ? "soft" : "base"}
              media={section.imageMedia}
              title={section.title}
            />
          ) : section.pdfMedia.length > 0 ? (
            <ProjectPdfSection
              key={section.role}
              background={index === 0 ? "soft" : "base"}
              media={section.pdfMedia}
              title={section.title}
            />
          ) : null,
        )}

        <section className="px-6 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-28">
          <div className="mx-auto max-w-7xl border-t border-neutral-200 pt-10">
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-3 text-sm font-semibold text-neutral-950 transition hover:gap-4"
            >
              ← Volver a proyectos
            </Link>
          </div>
        </section>
      </main>
      <Footer variant="dark" studioProfile={studioProfile} contactChannels={contactChannels} />
    </>
  );
}

function getProjectMediaSections(projectMedia: ProjectMedia[]) {
  return mediaRoleSections
    .map((section) => {
      const roleMedia = projectMedia
        .filter((media) => media.isVisible && media.role === section.role)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      return {
        ...section,
        imageMedia: roleMedia.filter((media) => media.assetType === "image"),
        pdfMedia: roleMedia.filter((media) => media.assetType === "pdf"),
      };
    })
    .filter((section) => section.imageMedia.length > 0 || section.pdfMedia.length > 0);
}

function ProjectPdfSection({
  background,
  media,
  title,
}: {
  background: "base" | "soft";
  media: ProjectMedia[];
  title: string;
}) {
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
            {media.length} {media.length === 1 ? "archivo" : "archivos"}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="border border-neutral-200 bg-white p-6 transition hover:border-neutral-950"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                PDF
              </span>
              <span className="mt-4 block font-title text-2xl font-medium text-neutral-950">
                {item.title ?? "Documento técnico"}
              </span>
              {item.description ? (
                <span className="mt-4 block text-sm leading-7 text-neutral-600">
                  {item.description}
                </span>
              ) : null}
              <span className="mt-6 inline-flex text-sm font-semibold text-neutral-950">
                Abrir archivo →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectFactProps {
  icon: ReactNode;
  label: string;
  value?: string;
}

function ProjectFact({ icon, label, value }: ProjectFactProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="grid grid-cols-[1.25rem_1fr] gap-5">
      <dt className="pt-0.5 text-neutral-400">{icon}</dt>
      <dd>
        <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {label}
        </span>
        <span className="mt-2 block text-base leading-none text-neutral-950">{value}</span>
      </dd>
    </div>
  );
}

function getProjectStageLabel(stage?: ProjectStage) {
  if (!stage) {
    return undefined;
  }

  const labels: Record<ProjectStage, string> = {
    conceptual: "Conceptual",
    design: "Diseño",
    under_construction: "En construcción",
    built: "Completado",
    completed: "Completado",
  };

  return labels[stage] ?? undefined;
}

function PinIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M7 3v4M17 3v4M4.5 9.5h15" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M6.5 5.5h11A2.5 2.5 0 0 1 20 8v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18V8a2.5 2.5 0 0 1 2.5-2.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m4.75 14.5 9.75-9.75 4.75 4.75-9.75 9.75-4.75-4.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="m8 12 1.5 1.5M10.5 9.5 12 11M13 7l1.5 1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function StageIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4.5 18.5h15M6 18.5V8.75l6-3.25 6 3.25v9.75"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="M9 18.5v-5h6v5M9 10.5h6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
