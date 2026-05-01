"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminProjects, setAdminProjectActive } from "@/lib/admin/portfolio-admin";
import type { Project } from "@/types/portfolio";

export function AdminProjectsPageClient() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  async function loadProjects() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      setProjects(await getAdminProjects());
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
          className="inline-flex items-center justify-center bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Nuevo proyecto
        </Link>
      </div>

      <section className="mt-10 border border-neutral-200 bg-white">
        {isLoading ? (
          <p className="p-8 text-sm text-neutral-500">Cargando proyectos...</p>
        ) : errorMessage ? (
          <p className="p-8 text-sm text-red-600">{errorMessage}</p>
        ) : (
          <div className="divide-y divide-neutral-200">
            {projects.map((project) => (
              <article
                key={project.id}
                className="grid gap-5 p-6 lg:grid-cols-[1fr_9rem_8rem_7rem_12rem] lg:items-center"
              >
                <div>
                  <h2 className="font-title text-2xl font-medium">{project.title}</h2>
                  <p className="mt-2 text-sm text-neutral-500">{project.slug}</p>
                </div>
                <StatusPill active={project.isActive} activeText="Activo" inactiveText="Inactivo" />
                <StatusPill active={project.isFeatured} activeText="Destacado" inactiveText="Normal" />
                <p className="text-sm text-neutral-500">Orden {project.sortOrder}</p>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950"
                    onClick={() => toggleProject(project)}
                  >
                    {project.isActive ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function StatusPill({
  active,
  activeText,
  inactiveText,
}: {
  active: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <span
      className={`w-fit border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        active
          ? "border-neutral-950 bg-neutral-950 text-white"
          : "border-neutral-200 text-neutral-400"
      }`}
    >
      {active ? activeText : inactiveText}
    </span>
  );
}
