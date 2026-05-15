"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/AdminToastProvider";
import {
  getAdminCategories,
  getAdminCategory,
  saveAdminCategory,
} from "@/lib/admin/portfolio-admin";
import { slugify } from "@/lib/portfolio-helpers";
import { uploadCategoryCoverMedia } from "@/lib/storage";
import type { ProjectCategory } from "@/types/portfolio";

interface AdminCategoryFormClientProps {
  categoryId?: string;
}

export function AdminCategoryFormClient({ categoryId }: AdminCategoryFormClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [category, setCategory] = useState<ProjectCategory>(() => createEmptyCategory());
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(categoryId));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCategory() {
      try {
        const [categories, firestoreCategory] = await Promise.all([
          getAdminCategories(),
          categoryId ? getAdminCategory(categoryId) : Promise.resolve(undefined),
        ]);

        if (isMounted && firestoreCategory) {
          setCategory(firestoreCategory);
        } else if (isMounted && !categoryId) {
          setCategory((current) => ({
            ...current,
            sortOrder: getNextCategorySortOrder(categories),
          }));
        }
      } catch (error) {
        console.warn("Could not load category.", error);
        setErrorMessage("No se pudo cargar la categoría.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSaving(true);

    try {
      await saveAdminCategory(normalizeCategory(category, Boolean(categoryId)));
      toast.success("Categoria guardada.");
      router.push("/admin/categories");
    } catch (error) {
      console.warn("Could not save category.", error);
      setErrorMessage("No se pudo guardar la categoría.");
      toast.error("No se pudo guardar. Intentalo nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleNameChange(value: string) {
    setCategory((current) => ({
      ...current,
      name: value,
      slug: categoryId && current.slug ? current.slug : slugify(value),
    }));
  }

  function updateField<K extends keyof ProjectCategory>(field: K, value: ProjectCategory[K]) {
    setCategory((current) => ({ ...current, [field]: value }));
  }

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    const currentCategoryId = category.id || category.slug || slugify(category.name);

    if (!file || !currentCategoryId) {
      return;
    }

    setErrorMessage("");
    setUploadMessage("");
    setIsUploadingCover(true);

    try {
      const uploaded = await uploadCategoryCoverMedia(currentCategoryId, file);
      const updatedCategory = normalizeCategory(
        {
          ...category,
          id: currentCategoryId,
          coverMedia: {
            assetType: "image",
            altText: category.name,
            storagePath: uploaded.storagePath,
            url: uploaded.url,
          },
        },
        Boolean(categoryId),
      );

      await saveAdminCategory(updatedCategory);
      setCategory(updatedCategory);
      setUploadMessage("Imagen de categoría actualizada.");
      toast.success("Imagen actualizada.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la imagen.");
      toast.error("No se pudo subir la imagen.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  return (
    <AdminShell>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label">Admin / Categorías</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">
              {categoryId ? "Editar categoría" : "Nueva categoría"}
            </h1>
          </div>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Guardando..." : "Guardar categoría"}
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <p className="mt-10 text-sm text-neutral-500">Cargando formulario...</p>
        ) : (
          <section className="mt-10 grid gap-6 border border-neutral-200 bg-white p-7 lg:grid-cols-2">
            <TextField label="Nombre" value={category.name} onChange={handleNameChange} />
            <p className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-7 text-neutral-500">
              El orden se gestiona desde el listado de categorías.
            </p>
            <label className="block lg:col-span-2">
              <FieldLabel>Descripción</FieldLabel>
              <textarea
                className="mt-3 w-full resize-y border border-neutral-300 px-4 py-3 text-sm leading-7 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                rows={5}
                value={category.description ?? ""}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </label>
            <SwitchField
              checked={category.isActive}
              label="Activa"
              onChange={(value) => updateField("isActive", value)}
            />
            <div className="lg:col-span-2">
              {category.coverMedia?.url ? (
                <div className="overflow-hidden border border-neutral-200 bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.coverMedia.url}
                    alt={category.name}
                    className="h-72 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
                  Sin imagen de categoría
                </div>
              )}
              <label className="mt-5 inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:border-neutral-300">
                {isUploadingCover ? "Subiendo..." : "Subir/reemplazar imagen"}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploadingCover || !(category.id || category.slug || category.name)}
                  onChange={handleCoverUpload}
                />
              </label>
              <p className="mt-3 text-sm text-neutral-500">
                JPG, PNG o WebP. Máximo 5 MB. Si es una categoría nueva, escribe primero el nombre.
              </p>
              {uploadMessage ? <p className="mt-3 text-sm text-neutral-500">{uploadMessage}</p> : null}
            </div>
          </section>
        )}
      </form>
    </AdminShell>
  );
}

function createEmptyCategory(): ProjectCategory {
  return {
    id: "",
    name: "",
    slug: "",
    categoryGroup: "portfolio_area",
    sortOrder: 1,
    isActive: true,
  };
}

function getNextCategorySortOrder(categories: ProjectCategory[]) {
  const maxSortOrder = categories.reduce(
    (maxOrder, category) => Math.max(maxOrder, category.sortOrder ?? 0),
    0,
  );

  return maxSortOrder > 0 ? maxSortOrder + 1 : 1;
}

function normalizeCategory(category: ProjectCategory, keepExistingSlug: boolean): ProjectCategory {
  const slug = keepExistingSlug && category.slug ? category.slug : slugify(category.name);

  return {
    ...category,
    categoryGroup: "portfolio_area",
    id: category.id || slug,
    slug,
    description: category.description || undefined,
    coverMedia: category.coverMedia?.url
      ? {
          assetType: "image",
          url: category.coverMedia.url,
          storagePath: category.coverMedia.storagePath,
          altText: category.name,
        }
      : undefined,
  };
}

function TextField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SwitchField({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      className="flex min-h-14 cursor-pointer items-center justify-between gap-4 border border-neutral-300 px-4 py-3 text-left text-sm transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="font-medium text-neutral-800">{label}</span>
      <span className={`relative h-6 w-11 border transition ${checked ? "border-neutral-950 bg-neutral-950" : "border-neutral-300 bg-neutral-100"}`}>
        <span className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 bg-white transition ${checked ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">{children}</span>;
}
