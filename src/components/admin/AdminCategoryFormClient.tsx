"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminCategory, saveAdminCategory } from "@/lib/admin/portfolio-admin";
import { uploadCategoryCoverMedia } from "@/lib/storage";
import type { CategoryGroup, ProjectCategory } from "@/types/portfolio";

const categoryGroups: CategoryGroup[] = ["portfolio_area", "typology", "content_area"];

interface AdminCategoryFormClientProps {
  categoryId?: string;
}

export function AdminCategoryFormClient({ categoryId }: AdminCategoryFormClientProps) {
  const router = useRouter();
  const [category, setCategory] = useState<ProjectCategory>(() => createEmptyCategory());
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(categoryId));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCategory() {
      if (!categoryId) {
        return;
      }

      try {
        const firestoreCategory = await getAdminCategory(categoryId);

        if (isMounted && firestoreCategory) {
          setCategory(firestoreCategory);
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
      await saveAdminCategory(normalizeCategory(category));
      router.push("/admin/categories");
    } catch (error) {
      console.warn("Could not save category.", error);
      setErrorMessage("No se pudo guardar la categoría.");
    } finally {
      setIsSaving(false);
    }
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
      const updatedCategory = normalizeCategory({
        ...category,
        id: currentCategoryId,
        coverMedia: {
          assetType: "image",
          altText: category.coverMedia?.altText || category.name,
          storagePath: uploaded.storagePath,
          url: uploaded.url,
        },
      });

      await saveAdminCategory(updatedCategory);
      setCategory(updatedCategory);
      setUploadMessage("Imagen de categoría actualizada.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la imagen.");
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
            className="inline-flex items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
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
            <TextField label="Nombre" value={category.name} onChange={(value) => updateField("name", value)} />
            <TextField label="Slug" value={category.slug} onChange={(value) => updateField("slug", slugify(value))} />
            <label className="block">
              <FieldLabel>Grupo</FieldLabel>
              <select
                className="mt-3 w-full border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none"
                value={category.categoryGroup}
                onChange={(event) => updateField("categoryGroup", event.target.value as CategoryGroup)}
              >
                {categoryGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </label>
            <NumberField label="Orden" value={category.sortOrder} onChange={(value) => updateField("sortOrder", value ?? 0)} />
            <label className="block lg:col-span-2">
              <FieldLabel>Descripción</FieldLabel>
              <textarea
                className="mt-3 w-full resize-y border border-neutral-300 px-4 py-3 text-sm leading-7 focus:border-neutral-950 focus:outline-none"
                rows={5}
                value={category.description ?? ""}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </label>
            <TextField
              label="Cover URL"
              value={category.coverMedia?.url ?? ""}
              onChange={(value) =>
                updateField("coverMedia", {
                  assetType: "image",
                  url: value,
                  storagePath: category.coverMedia?.storagePath,
                  altText: category.coverMedia?.altText,
                })
              }
            />
            <TextField
              label="Cover alt text"
              value={category.coverMedia?.altText ?? ""}
              onChange={(value) =>
                updateField("coverMedia", {
                  assetType: "image",
                  url: category.coverMedia?.url ?? "",
                  storagePath: category.coverMedia?.storagePath,
                  altText: value,
                })
              }
            />
            <div className="lg:col-span-2">
              {category.coverMedia?.url ? (
                <div className="overflow-hidden border border-neutral-200 bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.coverMedia.url}
                    alt={category.coverMedia.altText ?? category.name}
                    className="h-72 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
                  Sin imagen de categoría
                </div>
              )}
              <label className="mt-5 inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950">
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
                JPG, PNG o WebP. Máximo 5 MB. Si es una categoría nueva, escribe primero nombre o slug.
              </p>
              {uploadMessage ? <p className="mt-3 text-sm text-neutral-500">{uploadMessage}</p> : null}
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={category.isActive}
                onChange={(event) => updateField("isActive", event.target.checked)}
              />
              Activa
            </label>
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
    sortOrder: 0,
    isActive: true,
  };
}

function normalizeCategory(category: ProjectCategory): ProjectCategory {
  const slug = category.slug || slugify(category.name);

  return {
    ...category,
    id: category.id || slug,
    slug,
    description: category.description || undefined,
    coverMedia: category.coverMedia?.url
      ? {
          assetType: "image",
          url: category.coverMedia.url,
          storagePath: category.coverMedia.storagePath,
          altText: category.coverMedia.altText || category.name,
        }
      : undefined,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function TextField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NumberField({ label, onChange, value }: { label: string; onChange: (value?: number) => void; value?: number }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none" type="number" value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)} />
    </label>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">{children}</span>;
}
