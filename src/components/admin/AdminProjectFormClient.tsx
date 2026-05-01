"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  getAdminCategories,
  getAdminProject,
  saveAdminProject,
} from "@/lib/admin/portfolio-admin";
import type { Project, ProjectCategory, ProjectStage } from "@/types/portfolio";

const projectStages: ProjectStage[] = [
  "conceptual",
  "design",
  "under_construction",
  "built",
  "completed",
];

interface AdminProjectFormClientProps {
  projectId?: string;
}

export function AdminProjectFormClient({ projectId }: AdminProjectFormClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<Project>(() => createEmptyProject());
  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [isSaving, setIsSaving] = useState(false);

  const title = projectId ? "Editar proyecto" : "Nuevo proyecto";
  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadFormData() {
      try {
        const [allCategories, project] = await Promise.all([
          getAdminCategories(),
          projectId ? getAdminProject(projectId) : Promise.resolve(undefined),
        ]);

        if (!isMounted) {
          return;
        }

        setCategories(allCategories);

        if (project) {
          setForm(project);
        }
      } catch (error) {
        console.warn("Could not load project form data.", error);
        setErrorMessage("No se pudo cargar la información del proyecto.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFormData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSaving(true);

    try {
      const normalizedProject = normalizeProject(form);
      await saveAdminProject(normalizedProject);
      router.push("/admin/projects");
    } catch (error) {
      console.warn("Could not save project.", error);
      setErrorMessage("No se pudo guardar el proyecto.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateField<K extends keyof Project>(field: K, value: Project[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleCategory(categoryId: string) {
    setForm((current) => {
      const exists = current.categoryIds.includes(categoryId);
      const categoryIds = exists
        ? current.categoryIds.filter((id) => id !== categoryId)
        : [...current.categoryIds, categoryId];

      return {
        ...current,
        categoryIds,
        primaryCategoryId: categoryIds.includes(current.primaryCategoryId ?? "")
          ? current.primaryCategoryId
          : categoryIds[0],
      };
    });
  }

  return (
    <AdminShell>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label">Admin / Proyectos</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">{title}</h1>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Guardando..." : "Guardar proyecto"}
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
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.72fr]">
            <section className="space-y-6 border border-neutral-200 bg-white p-7">
              <TextField label="Título" value={form.title} onChange={(value) => updateField("title", value)} />
              <TextField label="Slug" value={form.slug} onChange={(value) => updateField("slug", slugify(value))} />
              <TextField label="Subtítulo" value={form.subtitle ?? ""} onChange={(value) => updateField("subtitle", value)} />
              <TextArea label="Resumen" rows={4} value={form.summary} onChange={(value) => updateField("summary", value)} />
              <TextArea label="Descripción" rows={8} value={form.description} onChange={(value) => updateField("description", value)} />
              <div className="grid gap-5 sm:grid-cols-3">
                <TextField label="Ubicación" value={form.location ?? ""} onChange={(value) => updateField("location", value)} />
                <NumberField label="Año" value={form.year} onChange={(value) => updateField("year", value)} />
                <NumberField label="Área m²" value={form.areaM2} onChange={(value) => updateField("areaM2", value)} />
              </div>
              <TextField
                label="Cover URL"
                value={form.coverMedia?.url ?? ""}
                onChange={(value) =>
                  updateField("coverMedia", {
                    assetType: "image",
                    url: value,
                    altText: form.coverMedia?.altText,
                  })
                }
              />
              <TextField
                label="Cover alt text"
                value={form.coverMedia?.altText ?? ""}
                onChange={(value) =>
                  updateField("coverMedia", {
                    assetType: "image",
                    url: form.coverMedia?.url ?? "",
                    altText: value,
                  })
                }
              />
            </section>

            <aside className="space-y-6">
              <section className="border border-neutral-200 bg-white p-7">
                <h2 className="font-title text-2xl font-medium">Publicación</h2>
                <div className="mt-6 space-y-5">
                  <SelectField
                    label="Etapa"
                    value={form.projectStage ?? "design"}
                    options={projectStages}
                    onChange={(value) => updateField("projectStage", value as ProjectStage)}
                  />
                  <NumberField label="Orden" value={form.sortOrder} onChange={(value) => updateField("sortOrder", value ?? 0)} />
                  <CheckboxField label="Proyecto destacado" checked={form.isFeatured} onChange={(value) => updateField("isFeatured", value)} />
                  <CheckboxField label="Activo" checked={form.isActive} onChange={(value) => updateField("isActive", value)} />
                </div>
              </section>

              <section className="border border-neutral-200 bg-white p-7">
                <h2 className="font-title text-2xl font-medium">Especializaciones</h2>
                <div className="mt-6 space-y-3">
                  {activeCategories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={form.categoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
                <SelectField
                  label="Especialización principal"
                  value={form.primaryCategoryId ?? ""}
                  options={form.categoryIds}
                  optionLabels={new Map(categories.map((category) => [category.id, category.name]))}
                  onChange={(value) => updateField("primaryCategoryId", value)}
                />
              </section>
            </aside>
          </div>
        )}
      </form>
    </AdminShell>
  );
}

function createEmptyProject(): Project {
  return {
    id: "",
    title: "",
    slug: "",
    summary: "",
    description: "",
    categoryIds: [],
    isFeatured: false,
    isActive: true,
    sortOrder: 0,
    projectStage: "design",
  };
}

function normalizeProject(project: Project): Project {
  const slug = project.slug || slugify(project.title);

  return {
    ...project,
    id: project.id || slug,
    slug,
    subtitle: project.subtitle || undefined,
    location: project.location || undefined,
    primaryCategoryId: project.primaryCategoryId || project.categoryIds[0],
    coverMedia: project.coverMedia?.url
      ? {
          assetType: "image",
          url: project.coverMedia.url,
          altText: project.coverMedia.altText || project.title,
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

function TextArea({ label, onChange, rows, value }: { label: string; onChange: (value: string) => void; rows: number; value: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea className="mt-3 w-full resize-y border border-neutral-300 px-4 py-3 text-sm leading-7 focus:border-neutral-950 focus:outline-none" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({
  label,
  onChange,
  optionLabels,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  optionLabels?: Map<string, string>;
  options: string[];
  value: string;
}) {
  return (
    <label className="mt-5 block">
      <FieldLabel>{label}</FieldLabel>
      <select className="mt-3 w-full border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Seleccionar</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.get(option) ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-neutral-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">{children}</span>;
}
