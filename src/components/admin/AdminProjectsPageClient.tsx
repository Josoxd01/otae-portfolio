"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  getAdminCategories,
  getAdminProjects,
  setAdminProjectActive,
} from "@/lib/admin/portfolio-admin";
import type { Project, ProjectCategory } from "@/types/portfolio";

export function AdminProjectsPageClient() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  async function loadProjects() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const [projectData, categoryData] = await Promise.all([
        getAdminProjects(),
        getAdminCategories(),
      ]);
      setProjects(projectData);
      setCategories(categoryData);
    } catch (error) {
      console.warn("Could not load admin projects.", error);
      setErrorMessage("No se pudieron cargar los proyectos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleProject(project: Project) {
    await setAdminProjectActive(project.id, !project.isActive);
    await loadProjects();
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-label">Admin / Proyectos</p>
          <h1 className="mt-7 font-title text-4xl font-medium leading-tight">Proyectos</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
            Administra obras del portafolio, su estado de publicación y su orden editorial.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Nuevo proyecto
        </Link>
      </div>

      <section className="mt-10 overflow-hidden border border-neutral-200 bg-white">
        {isLoading ? (
          <p className="p-8 text-sm text-neutral-500">Cargando proyectos...</p>
        ) : errorMessage ? (
          <p className="p-8 text-sm text-red-600">{errorMessage}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead>
                <tr className="bg-neutral-950 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white">
                  <th className="w-24 px-5 py-4">Orden</th>
                  <th className="px-5 py-4">Proyecto</th>
                  <th className="w-32 px-5 py-4">Estado</th>
                  <th className="w-28 px-5 py-4 text-center">Destacado</th>
                  <th className="px-5 py-4">Categorías</th>
                  <th className="w-40 px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {projects.map((project) => (
                  <tr key={project.id} className="align-middle transition hover:bg-neutral-50">
                    <td className="px-5 py-5">
                      <span className="font-title text-2xl font-medium tabular-nums text-neutral-950">
                        {project.sortOrder}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <h2 className="font-title text-xl font-medium text-neutral-950">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-500">{project.slug}</p>
                    </td>
                    <td className="px-5 py-5">
                      <StatusBadge isActive={project.isActive} />
                    </td>
                    <td className="px-5 py-5 text-center">
                      <span
                        className={project.isFeatured ? "text-neutral-950" : "text-neutral-300"}
                        aria-label={project.isFeatured ? "Destacado" : "No destacado"}
                      >
                        <StarIcon filled={project.isFeatured} />
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex flex-wrap gap-2">
                        {project.categoryIds.map((categoryId) => (
                          <span
                            key={categoryId}
                            className="border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500"
                          >
                            {categoryById.get(categoryId)?.name ?? categoryId}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <IconLink
                          href={`/admin/projects/${project.id}/edit`}
                          label="Editar"
                          icon={<EditIcon />}
                        />
                        <IconLink
                          href={`/proyectos/${project.slug}`}
                          label="Ver proyecto"
                          icon={<ExternalIcon />}
                          target="_blank"
                        />
                        <IconButton
                          label={project.isActive ? "Desactivar" : "Activar"}
                          icon={project.isActive ? <EyeOffIcon /> : <EyeIcon />}
                          onClick={() => toggleProject(project)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        isActive
          ? "border-neutral-950 bg-neutral-950 text-white"
          : "border-neutral-200 text-neutral-400"
      }`}
    >
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
}

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <span className="group relative">
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center border border-neutral-200 text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950"
        aria-label={label}
        onClick={onClick}
      >
        {icon}
      </button>
      <Tooltip label={label} />
    </span>
  );
}

function IconLink({
  href,
  icon,
  label,
  target,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  target?: "_blank";
}) {
  return (
    <span className="group relative">
      <Link
        href={href}
        target={target}
        className="flex h-10 w-10 cursor-pointer items-center justify-center border border-neutral-200 text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950"
        aria-label={label}
      >
        {icon}
      </Link>
      <Tooltip label={label} />
    </span>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap bg-neutral-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
      {label}
    </span>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" className="mx-auto h-5 w-5" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24">
      <path
        d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8L12 3.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="m4 16.5-.5 4 4-.5L19 8.5 15.5 5 4 16.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="m13.8 6.7 3.5 3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M10 6H5v13h13v-5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 5h5v5M19 5l-8 8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M3.5 12s3-5.5 8.5-5.5S20.5 12 20.5 12s-3 5.5-8.5 5.5S3.5 12 3.5 12Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.8 6.9A8.8 8.8 0 0 1 12 6.5c5.5 0 8.5 5.5 8.5 5.5a15 15 0 0 1-2.2 2.9M6.7 8.5A15 15 0 0 0 3.5 12s3 5.5 8.5 5.5c1 0 1.9-.2 2.7-.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
