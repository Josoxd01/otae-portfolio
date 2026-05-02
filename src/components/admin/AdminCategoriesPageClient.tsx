"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { DragEvent, MouseEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  getAdminCategories,
  setAdminCategoryActive,
  updateAdminCategorySortOrders,
} from "@/lib/admin/portfolio-admin";
import type { ProjectCategory } from "@/types/portfolio";

const pageSizeOptions = [10, 20, 50];

export function AdminCategoriesPageClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [draggedCategoryId, setDraggedCategoryId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));
  const paginatedCategories = categories.slice((page - 1) * pageSize, page * pageSize);

  async function loadCategories() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      setCategories(await getAdminCategories());
    } catch (error) {
      console.warn("Could not load admin categories.", error);
      setErrorMessage("No se pudieron cargar las categorías.");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleCategory(category: ProjectCategory) {
    await setAdminCategoryActive(category.id, !category.isActive);
    await loadCategories();
  }

  async function handleDrop(targetCategoryId: string) {
    if (!draggedCategoryId || draggedCategoryId === targetCategoryId || isSavingOrder) {
      setDraggedCategoryId("");
      return;
    }

    const fromIndex = categories.findIndex((category) => category.id === draggedCategoryId);
    const toIndex = categories.findIndex((category) => category.id === targetCategoryId);

    if (fromIndex < 0 || toIndex < 0) {
      setDraggedCategoryId("");
      return;
    }

    const previousCategories = categories;
    const reorderedCategories = moveCategory(categories, fromIndex, toIndex).map((category, index) => ({
      ...category,
      sortOrder: index + 1,
    }));

    setCategories(reorderedCategories);
    setDraggedCategoryId("");
    setErrorMessage("");
    setIsSavingOrder(true);

    try {
      await updateAdminCategorySortOrders(
        reorderedCategories.map((category) => ({
          id: category.id,
          sortOrder: category.sortOrder,
        })),
      );
    } catch (error) {
      console.warn("Could not save category order.", error);
      setCategories(previousCategories);
      setErrorMessage("No se pudo guardar el nuevo orden de categorías.");
    } finally {
      setIsSavingOrder(false);
    }
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, categoryId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", categoryId);
    setDraggedCategoryId(categoryId);
  }

  function handleDragOver(event: DragEvent<HTMLTableRowElement>) {
    if (draggedCategoryId) {
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
    loadCategories();
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
          <p className="section-label">Admin / Categorías</p>
          <h1 className="mt-7 font-title text-4xl font-medium leading-tight">Categorías</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
            Ordena las áreas de especialización y controla su estado de publicación.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Nueva categoría
        </Link>
      </div>

      <section className="mt-10 overflow-hidden border border-neutral-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {isSavingOrder ? "Guardando orden..." : `${categories.length} categorías`}
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
          <p className="p-8 text-sm text-neutral-500">Cargando categorías...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-neutral-950 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white">
                    <th className="w-24 px-5 py-4">Orden</th>
                    <th className="px-5 py-4">Nombre</th>
                    <th className="w-36 px-5 py-4">Estado</th>
                    <th className="w-32 px-5 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {paginatedCategories.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-sm text-neutral-500" colSpan={4}>
                        Todavía no hay categorías.
                      </td>
                    </tr>
                  ) : (
                    paginatedCategories.map((category) => (
                      <tr
                        key={category.id}
                        className={`cursor-pointer align-middle transition hover:bg-neutral-50 ${
                          draggedCategoryId === category.id ? "bg-neutral-50" : ""
                        }`}
                        onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(category.id)}
                      >
                        <td className="px-5 py-5">
                          <button
                            type="button"
                            className="flex cursor-grab items-center gap-3 text-left active:cursor-grabbing"
                            aria-label={`Reordenar ${category.name}`}
                            draggable={!isSavingOrder}
                            onClick={handleActionClick}
                            onDragStart={(event) => handleDragStart(event, category.id)}
                            onDragEnd={() => setDraggedCategoryId("")}
                          >
                            <DragHandleIcon />
                            <span className="font-title text-2xl font-medium tabular-nums text-neutral-950">
                              {category.sortOrder}
                            </span>
                          </button>
                        </td>
                        <td className="px-5 py-5">
                          <h2 className="font-title text-xl font-medium text-neutral-950">
                            {category.name}
                          </h2>
                        </td>
                        <td className="px-5 py-5">
                          <StatusBadge isActive={category.isActive} />
                        </td>
                        <td className="px-5 py-5" onClick={handleActionClick}>
                          <div className="flex justify-end gap-2">
                            <IconLink
                              href={`/admin/categories/${category.id}/edit`}
                              label="Editar"
                              icon={<EditIcon />}
                            />
                            <IconButton
                              label={category.isActive ? "Desactivar" : "Activar"}
                              icon={category.isActive ? <EyeOffIcon /> : <EyeIcon />}
                              onClick={() => toggleCategory(category)}
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

function moveCategory(categories: ProjectCategory[], fromIndex: number, toIndex: number) {
  const nextCategories = [...categories];
  const [movedCategory] = nextCategories.splice(fromIndex, 1);
  nextCategories.splice(toIndex, 0, movedCategory);

  return nextCategories;
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
      {isActive ? "Activa" : "Inactiva"}
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
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="group relative">
      <Link
        href={href}
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
      <path
        d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
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
