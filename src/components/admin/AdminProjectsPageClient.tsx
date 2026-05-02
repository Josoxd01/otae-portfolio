"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { DragEvent, MouseEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  getAdminCategories,
  getAdminProjects,
  setAdminProjectActive,
  updateAdminProjectSortOrders,
} from "@/lib/admin/portfolio-admin";
import type { Project, ProjectCategory } from "@/types/portfolio";

const pageSizeOptions = [10, 20, 50];

export function AdminProjectsPageClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [draggedProjectId, setDraggedProjectId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [projects, setProjects] = useState<Project[]>([]);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const paginatedProjects = projects.slice((page - 1) * pageSize, page * pageSize);

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

  async function handleDrop(targetProjectId: string) {
    if (!draggedProjectId || draggedProjectId === targetProjectId || isSavingOrder) {
      setDraggedProjectId("");
      return;
    }

    const fromIndex = projects.findIndex((project) => project.id === draggedProjectId);
    const toIndex = projects.findIndex((project) => project.id === targetProjectId);

    if (fromIndex < 0 || toIndex < 0) {
      setDraggedProjectId("");
      return;
    }

    const previousProjects = projects;
    const reorderedProjects = moveProject(projects, fromIndex, toIndex).map((project, index) => ({
      ...project,
      sortOrder: index + 1,
    }));

    setProjects(reorderedProjects);
    setDraggedProjectId("");
    setErrorMessage("");
    setIsSavingOrder(true);

    try {
      await updateAdminProjectSortOrders(
        reorderedProjects.map((project) => ({
          id: project.id,
          sortOrder: project.sortOrder,
        })),
      );
    } catch (error) {
      console.warn("Could not save project order.", error);
      setProjects(previousProjects);
      setErrorMessage("No se pudo guardar el nuevo orden de proyectos.");
    } finally {
      setIsSavingOrder(false);
    }
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, projectId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", projectId);
    setDraggedProjectId(projectId);
  }

  function handleDragOver(event: DragEvent<HTMLTableRowElement>) {
    if (draggedProjectId) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }
  }

  function handleActionClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  function updatePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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
        <div className="flex flex-col gap-4 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {isSavingOrder ? "Guardando orden..." : `${projects.length} proyectos`}
            </p>
            {errorMessage ? <p className="mt-1 text-sm text-red-600">{errorMessage}</p> : null}
          </div>
          <label className="flex items-center gap-3 text-sm text-neutral-500">
            Registros por página
            <select
              className="cursor-pointer border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none"
              value={pageSize}
              onChange={(event) => updatePageSize(Number(event.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-neutral-500">Cargando proyectos...</p>
        ) : (
          <>
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
                  {paginatedProjects.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-sm text-neutral-500" colSpan={6}>
                        Todavía no hay proyectos.
                      </td>
                    </tr>
                  ) : (
                    paginatedProjects.map((project) => (
                      <tr
                        key={project.id}
                        className={`cursor-pointer align-middle transition hover:bg-neutral-50 ${
                          draggedProjectId === project.id ? "bg-neutral-50" : ""
                        }`}
                        onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(project.id)}
                      >
                        <td className="px-5 py-5">
                          <button
                            type="button"
                            className="flex cursor-grab items-center gap-3 text-left active:cursor-grabbing"
                            aria-label={`Reordenar ${project.title}`}
                            draggable={!isSavingOrder}
                            onClick={handleActionClick}
                            onDragStart={(event) => handleDragStart(event, project.id)}
                            onDragEnd={() => setDraggedProjectId("")}
                          >
                            <DragHandleIcon />
                            <span className="font-title text-2xl font-medium tabular-nums text-neutral-950">
                              {project.sortOrder}
                            </span>
                          </button>
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
                        <td className="px-5 py-5" onClick={handleActionClick}>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500">
                Página {page} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="cursor-pointer border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="cursor-pointer border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </AdminShell>
  );
}

function moveProject(projects: Project[], fromIndex: number, toIndex: number) {
  const nextProjects = [...projects];
  const [movedProject] = nextProjects.splice(fromIndex, 1);
  nextProjects.splice(toIndex, 0, movedProject);

  return nextProjects;
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

function DragHandleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24">
      <path d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
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
