"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminCategories, setAdminCategoryActive } from "@/lib/admin/portfolio-admin";
import type { ProjectCategory } from "@/types/portfolio";

export function AdminCategoriesPageClient() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-label">Admin / Categorías</p>
          <h1 className="mt-7 font-title text-4xl font-medium leading-tight">Categorías</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
            Ordena las áreas de especialización, tipologías y grupos editoriales del sitio.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Nueva categoría
        </Link>
      </div>

      <section className="mt-10 border border-neutral-200 bg-white">
        {isLoading ? (
          <p className="p-8 text-sm text-neutral-500">Cargando categorías...</p>
        ) : errorMessage ? (
          <p className="p-8 text-sm text-red-600">{errorMessage}</p>
        ) : (
          <div className="divide-y divide-neutral-200">
            {categories.map((category) => (
              <article
                key={category.id}
                className="grid gap-5 p-6 lg:grid-cols-[1fr_12rem_7rem_12rem] lg:items-center"
              >
                <div>
                  <h2 className="font-title text-2xl font-medium">{category.name}</h2>
                  <p className="mt-2 text-sm text-neutral-500">{category.slug}</p>
                </div>
                <p className="text-sm text-neutral-500">{category.categoryGroup}</p>
                <p className="text-sm text-neutral-500">Orden {category.sortOrder}</p>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950"
                    onClick={() => toggleCategory(category)}
                  >
                    {category.isActive ? "Desactivar" : "Activar"}
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
