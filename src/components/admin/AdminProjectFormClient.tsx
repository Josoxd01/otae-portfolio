"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  createAdminProjectMedia,
  getAdminCategories,
  getAdminProject,
  getAdminProjectMedia,
  getAdminProjects,
  saveAdminProject,
  setAdminProjectMediaVisible,
} from "@/lib/admin/portfolio-admin";
import { uploadProjectCoverMedia, uploadProjectMedia } from "@/lib/storage";
import type {
  Project,
  ProjectCategory,
  ProjectMedia,
  ProjectMediaRole,
  ProjectStage,
} from "@/types/portfolio";

const projectStageOptions: Array<{ label: string; value: ProjectStage }> = [
  { label: "Conceptual", value: "conceptual" },
  { label: "Diseño", value: "design" },
  { label: "En construcción", value: "under_construction" },
  { label: "Construido", value: "built" },
  { label: "Completado", value: "completed" },
];

const mediaRoleOptions: Array<{ label: string; value: ProjectMediaRole }> = [
  { label: "Galería", value: "gallery" },
  { label: "Plano", value: "plan" },
  { label: "Render", value: "render" },
  { label: "Construcción", value: "construction" },
  { label: "Detalle", value: "detail" },
  { label: "Ficha técnica", value: "technical_sheet" },
];

interface AdminProjectFormClientProps {
  projectId?: string;
}

interface MediaFormState {
  altText: string;
  description: string;
  isVisible: boolean;
  role: ProjectMediaRole;
  sortOrder: number;
  title: string;
}

export function AdminProjectFormClient({ projectId }: AdminProjectFormClientProps) {
  const router = useRouter();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [coverUploadMessage, setCoverUploadMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<Project>(() => createEmptyProject());
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaErrorMessage, setMediaErrorMessage] = useState("");
  const [mediaForm, setMediaForm] = useState<MediaFormState>(() => createEmptyMediaForm());
  const [projectMedia, setProjectMedia] = useState<ProjectMedia[]>([]);

  const title = projectId ? "Editar proyecto" : "Nuevo proyecto";
  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories],
  );
  const selectedCategoryLabels = form.categoryIds
    .map((categoryId) => categories.find((category) => category.id === categoryId)?.name)
    .filter(Boolean)
    .join(", ");
  const currentProjectId = form.id || projectId;
  const hasDuplicateSortOrder =
    form.sortOrder !== undefined &&
    allProjects.some((project) => project.id !== form.id && project.sortOrder === form.sortOrder);

  useEffect(() => {
    let isMounted = true;

    async function loadFormData() {
      try {
        const [allCategories, projects, project] = await Promise.all([
          getAdminCategories(),
          getAdminProjects(),
          projectId ? getAdminProject(projectId) : Promise.resolve(undefined),
        ]);

        if (!isMounted) {
          return;
        }

        setCategories(allCategories);
        setAllProjects(projects);

        if (project) {
          setForm(project);
          setProjectMedia(await getAdminProjectMedia(project.id));
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

  async function reloadProjectMedia(projectIdToLoad = currentProjectId) {
    if (!projectIdToLoad) {
      return;
    }

    setProjectMedia(await getAdminProjectMedia(projectIdToLoad));
  }

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

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !currentProjectId) {
      return;
    }

    setCoverUploadMessage("");
    setErrorMessage("");
    setIsUploadingCover(true);

    try {
      const uploaded = await uploadProjectCoverMedia(currentProjectId, file);
      const updatedProject = normalizeProject({
        ...form,
        id: currentProjectId,
        coverMedia: {
          assetType: "image",
          altText: form.coverMedia?.altText || form.title,
          storagePath: uploaded.storagePath,
          url: uploaded.url,
        },
      });

      await saveAdminProject(updatedProject);
      setForm(updatedProject);
      setCoverUploadMessage("Imagen protagonista actualizada.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la portada.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !currentProjectId) {
      return;
    }

    setMediaErrorMessage("");
    setIsUploadingMedia(true);

    try {
      const uploaded = await uploadProjectMedia(currentProjectId, file, mediaForm.role);
      await createAdminProjectMedia(currentProjectId, {
        url: uploaded.url,
        storagePath: uploaded.storagePath,
        assetType: uploaded.assetType,
        mimeType: uploaded.mimeType,
        role: mediaForm.role,
        title: mediaForm.title || file.name,
        description: mediaForm.description || undefined,
        altText: mediaForm.altText || mediaForm.title || file.name,
        sortOrder: mediaForm.sortOrder,
        isVisible: mediaForm.isVisible,
      });
      setMediaForm(createEmptyMediaForm());
      await reloadProjectMedia(currentProjectId);
    } catch (error) {
      setMediaErrorMessage(error instanceof Error ? error.message : "No se pudo subir la media.");
    } finally {
      setIsUploadingMedia(false);
    }
  }

  async function toggleMediaVisibility(media: ProjectMedia) {
    if (!currentProjectId) {
      return;
    }

    await setAdminProjectMediaVisible(currentProjectId, media.id, !media.isVisible);
    await reloadProjectMedia(currentProjectId);
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
          <div className="mt-10 space-y-8">
            <section className="border border-neutral-200 bg-white p-7">
              <SectionHeading
                label="Información general"
                title="Datos principales"
                description="Define la información editorial básica que se mostrará en el portafolio público."
              />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <TextField label="Título" value={form.title} onChange={(value) => updateField("title", value)} />
                <TextField label="Slug" value={form.slug} onChange={(value) => updateField("slug", slugify(value))} />
                <TextField label="Subtítulo" value={form.subtitle ?? ""} onChange={(value) => updateField("subtitle", value)} />
                <TextField label="Ubicación" value={form.location ?? ""} onChange={(value) => updateField("location", value)} />
                <TextArea label="Resumen" rows={4} value={form.summary} onChange={(value) => updateField("summary", value)} />
                <TextArea label="Descripción" rows={4} value={form.description} onChange={(value) => updateField("description", value)} />
                <NumberField label="Año" value={form.year} onChange={(value) => updateField("year", value)} />
                <NumberField label="Área m²" value={form.areaM2} onChange={(value) => updateField("areaM2", value)} />
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <section className="border border-neutral-200 bg-white p-7">
                <SectionHeading label="Publicación" title="Estado y orden" />
                <div className="mt-8 space-y-5">
                  <SelectField
                    label="Etapa"
                    value={form.projectStage ?? "design"}
                    options={projectStageOptions}
                    onChange={(value) => updateField("projectStage", value as ProjectStage)}
                  />
                  <NumberField label="Orden" value={form.sortOrder} onChange={(value) => updateField("sortOrder", value ?? 0)} />
                  {form.sortOrder === undefined ? (
                    <p className="text-sm text-red-600">El orden debe ser un número.</p>
                  ) : null}
                  {hasDuplicateSortOrder ? (
                    <p className="text-sm text-amber-700">
                      Otro proyecto ya usa este orden. Puedes guardarlo, pero revisa la secuencia editorial.
                    </p>
                  ) : null}
                  <CheckboxField label="Proyecto destacado" checked={form.isFeatured} onChange={(value) => updateField("isFeatured", value)} />
                  <CheckboxField label="Activo" checked={form.isActive} onChange={(value) => updateField("isActive", value)} />
                </div>
              </section>

              <section className="border border-neutral-200 bg-white p-7">
                <SectionHeading label="Especializaciones" title="Áreas del proyecto" />
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  <MultiCategorySelect
                    categories={activeCategories}
                    isOpen={isCategorySelectOpen}
                    onOpenChange={() => setIsCategorySelectOpen((current) => !current)}
                    onToggle={toggleCategory}
                    selectedIds={form.categoryIds}
                    selectedLabel={selectedCategoryLabels || "Seleccionar categorías"}
                  />
                  <SelectField
                    label="Especialización principal"
                    value={form.primaryCategoryId ?? ""}
                    options={form.categoryIds.map((categoryId) => ({
                      label: categories.find((category) => category.id === categoryId)?.name ?? categoryId,
                      value: categoryId,
                    }))}
                    onChange={(value) => updateField("primaryCategoryId", value)}
                  />
                </div>
              </section>
            </div>

            <section className="border border-neutral-200 bg-white p-7">
              <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                <SectionHeading
                  label="Imagen protagonista"
                  title="Portada del proyecto"
                  description="Esta imagen abre la página de detalle y representa el proyecto en listados."
                />
                <div>
                  {form.coverMedia?.url ? (
                    <div className="overflow-hidden border border-neutral-200 bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.coverMedia.url}
                        alt={form.coverMedia.altText ?? form.title}
                        className="h-72 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-72 items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
                      Sin portada
                    </div>
                  )}
                  <TextField
                    label="Alt text"
                    value={form.coverMedia?.altText ?? ""}
                    onChange={(value) =>
                      updateField("coverMedia", {
                        assetType: "image",
                        storagePath: form.coverMedia?.storagePath,
                        url: form.coverMedia?.url ?? "",
                        altText: value,
                      })
                    }
                  />
                  <TextField
                    label="URL de imagen"
                    value={form.coverMedia?.url ?? ""}
                    onChange={(value) =>
                      updateField("coverMedia", {
                        assetType: "image",
                        storagePath: form.coverMedia?.storagePath,
                        url: value,
                        altText: form.coverMedia?.altText,
                      })
                    }
                  />
                  <label className="mt-5 inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950">
                    {isUploadingCover ? "Subiendo..." : "Subir/reemplazar portada"}
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={!currentProjectId || isUploadingCover}
                      onChange={handleCoverUpload}
                    />
                  </label>
                  {!currentProjectId ? (
                    <p className="mt-3 text-sm text-neutral-500">Guarda el proyecto antes de subir portada.</p>
                  ) : null}
                  {coverUploadMessage ? (
                    <p className="mt-3 text-sm text-neutral-500">{coverUploadMessage}</p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="space-y-8 border border-neutral-200 bg-white p-7">
              <SectionHeading
                label="Media adicional"
                title="Galería y documentos"
                description="Agrega imágenes, planos o documentos que complementen la presentación del proyecto."
              />

              <div className="grid gap-5 lg:grid-cols-5">
                <SelectField
                  label="Role"
                  value={mediaForm.role}
                  options={mediaRoleOptions}
                  onChange={(value) => setMediaForm((current) => ({ ...current, role: value as ProjectMediaRole }))}
                />
                <TextField label="Título" value={mediaForm.title} onChange={(value) => setMediaForm((current) => ({ ...current, title: value }))} />
                <NumberField label="Orden" value={mediaForm.sortOrder} onChange={(value) => setMediaForm((current) => ({ ...current, sortOrder: value ?? 0 }))} />
                <TextField label="Alt text" value={mediaForm.altText} onChange={(value) => setMediaForm((current) => ({ ...current, altText: value }))} />
                <TextField label="Descripción" value={mediaForm.description} onChange={(value) => setMediaForm((current) => ({ ...current, description: value }))} />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <CheckboxField label="Visible" checked={mediaForm.isVisible} onChange={(value) => setMediaForm((current) => ({ ...current, isVisible: value }))} />
                <label className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
                  {isUploadingMedia ? "Subiendo..." : "Subir media"}
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    disabled={!currentProjectId || isUploadingMedia}
                    onChange={handleMediaUpload}
                  />
                </label>
              </div>

              {!currentProjectId ? (
                <p className="text-sm text-neutral-500">Guarda el proyecto antes de subir media adicional.</p>
              ) : null}
              {mediaErrorMessage ? <p className="text-sm text-red-600">{mediaErrorMessage}</p> : null}

              <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                {projectMedia.length === 0 ? (
                  <p className="py-6 text-sm text-neutral-500">Todavía no hay media adicional.</p>
                ) : (
                  projectMedia.map((media) => (
                    <article key={media.id} className="grid gap-5 py-5 lg:grid-cols-[8rem_1fr_9rem_8rem] lg:items-center">
                      <MediaPreview media={media} />
                      <div>
                        <h3 className="font-title text-xl font-medium">{media.title ?? media.id}</h3>
                        <p className="mt-1 text-sm text-neutral-500">
                          {getMediaRoleLabel(media.role)} · {media.mimeType ?? media.assetType}
                        </p>
                      </div>
                      <span className={`w-fit border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${media.isVisible ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 text-neutral-400"}`}>
                        {media.isVisible ? "Visible" : "Oculta"}
                      </span>
                      <button
                        type="button"
                        className="border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950"
                        onClick={() => toggleMediaVisibility(media)}
                      >
                        {media.isVisible ? "Ocultar" : "Mostrar"}
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>
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

function createEmptyMediaForm(): MediaFormState {
  return {
    altText: "",
    description: "",
    isVisible: true,
    role: "gallery",
    sortOrder: 0,
    title: "",
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
          storagePath: project.coverMedia.storagePath,
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

function getMediaRoleLabel(role: ProjectMediaRole) {
  return mediaRoleOptions.find((option) => option.value === role)?.label ?? role;
}

function SectionHeading({
  description,
  label,
  title,
}: {
  description?: string;
  label: string;
  title: string;
}) {
  return (
    <div>
      <p className="section-label">{label}</p>
      <h2 className="mt-4 font-title text-3xl font-medium">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">{description}</p> : null}
    </div>
  );
}

function MultiCategorySelect({
  categories,
  isOpen,
  onOpenChange,
  onToggle,
  selectedIds,
  selectedLabel,
}: {
  categories: ProjectCategory[];
  isOpen: boolean;
  onOpenChange: () => void;
  onToggle: (categoryId: string) => void;
  selectedIds: string[];
  selectedLabel: string;
}) {
  return (
    <div className="relative">
      <FieldLabel>Categorías</FieldLabel>
      <button
        type="button"
        className="mt-3 flex w-full cursor-pointer items-center justify-between border border-neutral-300 bg-white px-4 py-3 text-left text-sm transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none"
        onClick={onOpenChange}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className={`text-neutral-400 transition ${isOpen ? "rotate-180" : ""}`}>↓</span>
      </button>
      {isOpen ? (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-auto border border-neutral-200 bg-white p-2 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition hover:bg-neutral-50"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(category.id)}
                onChange={() => onToggle(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MediaPreview({ media }: { media: ProjectMedia }) {
  if (media.assetType === "pdf") {
    return (
      <a
        className="flex h-24 items-center justify-center border border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:text-neutral-950"
        href={media.url}
        target="_blank"
        rel="noreferrer"
      >
        PDF
      </a>
    );
  }

  return (
    <div className="overflow-hidden border border-neutral-200 bg-neutral-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media.url} alt={media.altText ?? media.title ?? media.id} className="h-24 w-full object-cover" />
    </div>
  );
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

function SelectField<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: T }>;
  value: string;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select className="mt-3 w-full cursor-pointer border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Seleccionar</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-neutral-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">{children}</span>;
}