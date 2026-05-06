"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent, MouseEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  createAdminProjectMedia,
  deleteAdminProjectMedia,
  getAdminCategories,
  getAdminProject,
  getAdminProjectMedia,
  getAdminProjects,
  saveAdminProject,
  setAdminProjectMediaVisible,
  updateAdminProjectMediaSortOrders,
} from "@/lib/admin/portfolio-admin";
import { slugify } from "@/lib/portfolio-helpers";
import { deleteStorageFile, uploadProjectCoverMedia, uploadProjectMedia } from "@/lib/storage";
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

const mediaRoleLabels: Record<string, string> = {
  gallery: "Galería",
  plan: "Plano",
  render: "Render",
  construction: "Construcción",
  detail: "Detalle",
  technical_sheet: "Ficha técnica",
};

type EditableMediaRole = Extract<ProjectMediaRole, "gallery" | "plan">;

interface AdminProjectFormClientProps {
  projectId?: string;
}

interface MediaFormState {
  isVisible: boolean;
  title: string;
}

export function AdminProjectFormClient({ projectId }: AdminProjectFormClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [coverUploadMessage, setCoverUploadMessage] = useState("");
  const [deletingMediaId, setDeletingMediaId] = useState("");
  const [draggedMediaId, setDraggedMediaId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<Project>(() => createEmptyProject());
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingMediaOrder, setIsSavingMediaOrder] = useState<EditableMediaRole | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [mediaErrorMessage, setMediaErrorMessage] = useState("");
  const [mediaForms, setMediaForms] = useState<Record<EditableMediaRole, MediaFormState>>(() => ({
    gallery: createEmptyMediaForm(),
    plan: createEmptyMediaForm(),
  }));
  const [projectMedia, setProjectMedia] = useState<ProjectMedia[]>([]);
  const [uploadingRole, setUploadingRole] = useState<EditableMediaRole | null>(null);

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
  const galleryMedia = sortMediaByOrder(projectMedia.filter((media) => media.role === "gallery"));
  const planMedia = sortMediaByOrder(projectMedia.filter((media) => media.role === "plan"));

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
        if (project) {
          setForm(project);
          setProjectMedia(await getAdminProjectMedia(project.id));
        } else if (!projectId) {
          setForm((current) => ({
            ...current,
            sortOrder: getNextProjectSortOrder(projects),
          }));
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
      const normalizedProject = normalizeProject(form, Boolean(projectId));
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
      const updatedProject = normalizeProject(
        {
          ...form,
          id: currentProjectId,
          coverMedia: {
            assetType: "image",
            altText: form.coverMedia?.altText || form.title,
            storagePath: uploaded.storagePath,
            url: uploaded.url,
          },
        },
        Boolean(projectId),
      );

      await saveAdminProject(updatedProject);
      setForm(updatedProject);
      setCoverUploadMessage("Imagen protagonista actualizada.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la portada.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleMediaUpload(event: ChangeEvent<HTMLInputElement>, role: EditableMediaRole) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !currentProjectId) {
      return;
    }

    const mediaForm = mediaForms[role];
    setMediaErrorMessage("");
    setUploadingRole(role);

    try {
      const uploaded = await uploadProjectMedia(currentProjectId, file, role);
      await createAdminProjectMedia(currentProjectId, {
        url: uploaded.url,
        storagePath: uploaded.storagePath,
        assetType: uploaded.assetType,
        mimeType: uploaded.mimeType,
        role,
        title: mediaForm.title || file.name,
        altText: mediaForm.title || file.name,
        sortOrder: getNextMediaSortOrder(projectMedia, role),
        isVisible: mediaForm.isVisible,
      });
      updateMediaForm(role, createEmptyMediaForm());
      await reloadProjectMedia(currentProjectId);
    } catch (error) {
      setMediaErrorMessage(error instanceof Error ? error.message : "No se pudo subir la media.");
    } finally {
      setUploadingRole(null);
    }
  }

  async function toggleMediaVisibility(media: ProjectMedia) {
    if (!currentProjectId) {
      return;
    }

    await setAdminProjectMediaVisible(currentProjectId, media.id, !media.isVisible);
    await reloadProjectMedia(currentProjectId);
  }

  async function handleMediaDrop(role: EditableMediaRole, targetMediaId: string) {
    if (!currentProjectId || !draggedMediaId || draggedMediaId === targetMediaId || isSavingMediaOrder) {
      setDraggedMediaId("");
      return;
    }

    const roleMedia = sortMediaByOrder(projectMedia.filter((media) => media.role === role));
    const fromIndex = roleMedia.findIndex((media) => media.id === draggedMediaId);
    const toIndex = roleMedia.findIndex((media) => media.id === targetMediaId);

    if (fromIndex < 0 || toIndex < 0) {
      setDraggedMediaId("");
      return;
    }

    const previousMedia = projectMedia;
    const reorderedRoleMedia = moveMedia(roleMedia, fromIndex, toIndex).map((media, index) => ({
      ...media,
      sortOrder: index + 1,
    }));
    const reorderedById = new Map(reorderedRoleMedia.map((media) => [media.id, media]));

    setProjectMedia(projectMedia.map((media) => reorderedById.get(media.id) ?? media));
    setDraggedMediaId("");
    setMediaErrorMessage("");
    setIsSavingMediaOrder(role);

    try {
      await updateAdminProjectMediaSortOrders(
        currentProjectId,
        reorderedRoleMedia.map((media) => ({
          id: media.id,
          sortOrder: media.sortOrder,
        })),
      );
    } catch (error) {
      console.warn("Could not save media order.", error);
      setProjectMedia(previousMedia);
      setMediaErrorMessage("No se pudo guardar el nuevo orden de media.");
    } finally {
      setIsSavingMediaOrder(null);
    }
  }

  function handleMediaDragStart(event: DragEvent<HTMLButtonElement>, mediaId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", mediaId);
    setDraggedMediaId(mediaId);
  }

  function handleMediaDragOver(event: DragEvent<HTMLElement>) {
    if (draggedMediaId) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }
  }

  async function handleDeleteMedia(media: ProjectMedia, role: EditableMediaRole) {
    if (!currentProjectId || deletingMediaId) {
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este archivo? Esta acción no se puede deshacer.",
    );

    if (!confirmed) {
      return;
    }

    setDeletingMediaId(media.id);
    setMediaErrorMessage("");

    try {
      if (media.storagePath) {
        await deleteStorageFile(media.storagePath);
      }

      await deleteAdminProjectMedia(currentProjectId, media.id);

      const remainingRoleMedia = sortMediaByOrder(
        projectMedia.filter((item) => item.role === role && item.id !== media.id),
      ).map((item, index) => ({
        ...item,
        sortOrder: index + 1,
      }));
      const reorderedById = new Map(remainingRoleMedia.map((item) => [item.id, item]));
      const nextMedia = projectMedia
        .filter((item) => item.id !== media.id)
        .map((item) => reorderedById.get(item.id) ?? item);

      setProjectMedia(nextMedia);
      await updateAdminProjectMediaSortOrders(
        currentProjectId,
        remainingRoleMedia.map((item) => ({
          id: item.id,
          sortOrder: item.sortOrder,
        })),
      );
    } catch (error) {
      console.warn("Could not delete project media.", error);
      setMediaErrorMessage(
        error instanceof Error ? error.message : "No se pudo eliminar el archivo.",
      );
    } finally {
      setDeletingMediaId("");
    }
  }

  function handleMediaActionClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: projectId ? current.slug : slugify(value),
    }));
  }

  function updateField<K extends keyof Project>(field: K, value: Project[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateMediaForm(role: EditableMediaRole, nextValue: MediaFormState) {
    setMediaForms((current) => ({ ...current, [role]: nextValue }));
  }

  function patchMediaForm(role: EditableMediaRole, patch: Partial<MediaFormState>) {
    setMediaForms((current) => ({
      ...current,
      [role]: { ...current[role], ...patch },
    }));
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
            className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                <TextField label="Título" value={form.title} onChange={handleTitleChange} />
                <TextField label="Ubicación" value={form.location ?? ""} onChange={(value) => updateField("location", value)} />
                <TextArea label="Resumen" rows={4} value={form.summary} onChange={(value) => updateField("summary", value)} />
                <TextArea label="Descripción" rows={4} value={form.description} onChange={(value) => updateField("description", value)} />
                <NumberField label="Año" value={form.year} onChange={(value) => updateField("year", value)} />
                <NumberField label="Área m²" value={form.areaM2} onChange={(value) => updateField("areaM2", value)} />
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <section className="border border-neutral-200 bg-white p-7">
                <SectionHeading label="Estado del proyecto" title="Publicación" />
                <div className="mt-8 space-y-6">
                  <SelectField
                    label="Etapa"
                    value={form.projectStage ?? "design"}
                    options={projectStageOptions}
                    onChange={(value) => updateField("projectStage", value as ProjectStage)}
                  />
                  <p className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-7 text-neutral-500">
                    El orden se gestiona desde el listado de proyectos.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <StarToggle
                      checked={form.isFeatured}
                      label="Proyecto destacado"
                      onChange={(value) => updateField("isFeatured", value)}
                    />
                    <SwitchField
                      checked={form.isActive}
                      label="Proyecto activo"
                      onChange={(value) => updateField("isActive", value)}
                    />
                  </div>
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
                        alt={form.title}
                        className="h-72 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-72 items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
                      Sin portada
                    </div>
                  )}
                  <label className="mt-5 inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:border-neutral-300">
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
                title="Galería y planos"
                description="Agrega imágenes, planos o documentos que complementen la presentación del proyecto."
              />

              <div className="grid gap-8 lg:grid-cols-2">
                <MediaUploadPanel
                  accept="image/jpeg,image/png,image/webp"
                  deletingMediaId={deletingMediaId}
                  disabled={!currentProjectId || uploadingRole === "gallery"}
                  draggedMediaId={draggedMediaId}
                  form={mediaForms.gallery}
                  isSavingOrder={isSavingMediaOrder === "gallery"}
                  isUploading={uploadingRole === "gallery"}
                  media={galleryMedia}
                  onDeleteMedia={(media) => handleDeleteMedia(media, "gallery")}
                  onFileChange={(event) => handleMediaUpload(event, "gallery")}
                  onFormChange={(patch) => patchMediaForm("gallery", patch)}
                  onMediaActionClick={handleMediaActionClick}
                  onMediaDragEnd={() => setDraggedMediaId("")}
                  onMediaDragOver={handleMediaDragOver}
                  onMediaDragStart={handleMediaDragStart}
                  onMediaDrop={(mediaId) => handleMediaDrop("gallery", mediaId)}
                  onToggleVisibility={toggleMediaVisibility}
                  title="Galería"
                  uploadLabel="Subir imagen"
                />
                <MediaUploadPanel
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  deletingMediaId={deletingMediaId}
                  disabled={!currentProjectId || uploadingRole === "plan"}
                  draggedMediaId={draggedMediaId}
                  form={mediaForms.plan}
                  isSavingOrder={isSavingMediaOrder === "plan"}
                  isUploading={uploadingRole === "plan"}
                  media={planMedia}
                  onDeleteMedia={(media) => handleDeleteMedia(media, "plan")}
                  onFileChange={(event) => handleMediaUpload(event, "plan")}
                  onFormChange={(patch) => patchMediaForm("plan", patch)}
                  onMediaActionClick={handleMediaActionClick}
                  onMediaDragEnd={() => setDraggedMediaId("")}
                  onMediaDragOver={handleMediaDragOver}
                  onMediaDragStart={handleMediaDragStart}
                  onMediaDrop={(mediaId) => handleMediaDrop("plan", mediaId)}
                  onToggleVisibility={toggleMediaVisibility}
                  title="Planos"
                  uploadLabel="Subir archivo"
                />
              </div>

              {!currentProjectId ? (
                <p className="text-sm text-neutral-500">Guarda el proyecto antes de subir media adicional.</p>
              ) : null}
              {mediaErrorMessage ? <p className="text-sm text-red-600">{mediaErrorMessage}</p> : null}
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
    sortOrder: 1,
    projectStage: "design",
  };
}

function getNextProjectSortOrder(projects: Project[]) {
  const maxSortOrder = projects.reduce(
    (maxOrder, project) => Math.max(maxOrder, project.sortOrder ?? 0),
    0,
  );

  return maxSortOrder > 0 ? maxSortOrder + 1 : 1;
}

function createEmptyMediaForm(): MediaFormState {
  return {
    isVisible: true,
    title: "",
  };
}

function getNextMediaSortOrder(mediaItems: ProjectMedia[], role: EditableMediaRole) {
  const maxSortOrder = mediaItems
    .filter((media) => media.role === role)
    .reduce((maxOrder, media) => Math.max(maxOrder, media.sortOrder ?? 0), 0);

  return maxSortOrder > 0 ? maxSortOrder + 1 : 1;
}

function sortMediaByOrder(mediaItems: ProjectMedia[]) {
  return [...mediaItems].sort((a, b) => {
    if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) {
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    }

    return (a.title ?? a.id).localeCompare(b.title ?? b.id);
  });
}

function moveMedia(mediaItems: ProjectMedia[], fromIndex: number, toIndex: number) {
  const nextMediaItems = [...mediaItems];
  const [movedMedia] = nextMediaItems.splice(fromIndex, 1);
  nextMediaItems.splice(toIndex, 0, movedMedia);

  return nextMediaItems;
}

function normalizeProject(project: Project, keepExistingSlug: boolean): Project {
  const slug = keepExistingSlug && project.slug ? project.slug : slugify(project.title);

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

function getMediaRoleLabel(role: ProjectMediaRole) {
  return mediaRoleLabels[role] ?? role;
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
        className="mt-3 flex w-full cursor-pointer items-center justify-between border border-neutral-300 bg-white px-4 py-3 text-left text-sm transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
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
                className="accent-neutral-950"
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

function MediaUploadPanel({
  accept,
  deletingMediaId,
  disabled,
  draggedMediaId,
  form,
  isSavingOrder,
  isUploading,
  media,
  onDeleteMedia,
  onFileChange,
  onFormChange,
  onMediaActionClick,
  onMediaDragEnd,
  onMediaDragOver,
  onMediaDragStart,
  onMediaDrop,
  onToggleVisibility,
  title,
  uploadLabel,
}: {
  accept: string;
  deletingMediaId: string;
  disabled: boolean;
  draggedMediaId: string;
  form: MediaFormState;
  isSavingOrder: boolean;
  isUploading: boolean;
  media: ProjectMedia[];
  onDeleteMedia: (media: ProjectMedia) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFormChange: (patch: Partial<MediaFormState>) => void;
  onMediaActionClick: (event: MouseEvent<HTMLElement>) => void;
  onMediaDragEnd: () => void;
  onMediaDragOver: (event: DragEvent<HTMLElement>) => void;
  onMediaDragStart: (event: DragEvent<HTMLButtonElement>, mediaId: string) => void;
  onMediaDrop: (mediaId: string) => void;
  onToggleVisibility: (media: ProjectMedia) => void;
  title: string;
  uploadLabel: string;
}) {
  return (
    <div className="border border-neutral-200 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-title text-2xl font-medium">{title}</h3>
        {isSavingOrder ? <p className="text-sm text-neutral-500">Guardando orden...</p> : null}
      </div>
      <div className="mt-6">
        <TextField label="Título opcional" value={form.title} onChange={(value) => onFormChange({ title: value })} />
      </div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <SwitchField label="Visible" checked={form.isVisible} onChange={(value) => onFormChange({ isVisible: value })} />
        <label className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:bg-neutral-950">
          {isUploading ? "Subiendo..." : uploadLabel}
          <input
            className="sr-only"
            type="file"
            accept={accept}
            disabled={disabled}
            onChange={onFileChange}
          />
        </label>
      </div>
      <div className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {media.length === 0 ? (
          <p className="py-5 text-sm text-neutral-500">Todavía no hay archivos.</p>
        ) : (
          media.map((item) => (
            <article
              key={item.id}
              className={`grid gap-4 py-5 transition sm:grid-cols-[2.5rem_6rem_1fr_auto] sm:items-center ${
                draggedMediaId === item.id ? "bg-neutral-50" : ""
              }`}
              onDragOver={onMediaDragOver}
              onDrop={() => onMediaDrop(item.id)}
            >
              <button
                type="button"
                className="flex h-10 w-10 cursor-grab items-center justify-center text-neutral-400 transition hover:text-neutral-950 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Reordenar ${item.title ?? item.id}`}
                draggable={!isSavingOrder}
                disabled={isSavingOrder}
                onClick={onMediaActionClick}
                onDragStart={(event) => onMediaDragStart(event, item.id)}
                onDragEnd={onMediaDragEnd}
              >
                <DragHandleIcon />
              </button>
              <MediaPreview media={item} />
              <div>
                <h4 className="font-title text-lg font-medium">{item.title ?? item.id}</h4>
                <p className="mt-1 text-sm text-neutral-500">
                  {getMediaRoleLabel(item.role)} · {item.mimeType ?? item.assetType} · Orden {item.sortOrder}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2" onClick={onMediaActionClick}>
                <button
                  type="button"
                  className="cursor-pointer border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={deletingMediaId === item.id}
                  onClick={() => onToggleVisibility(item)}
                >
                  {item.isVisible ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  type="button"
                  className="cursor-pointer border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Eliminar"
                  disabled={deletingMediaId === item.id}
                  onClick={() => onDeleteMedia(item)}
                >
                  {deletingMediaId === item.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
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
      <img src={media.url} alt={media.title ?? media.id} className="h-24 w-full object-cover" />
    </div>
  );
}

function DragHandleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function StarToggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      className="flex min-h-14 cursor-pointer items-center justify-between border border-neutral-300 px-4 py-3 text-left text-sm transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span>
        <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">Destacado</span>
        <span className="mt-1 block font-medium text-neutral-800">{label}</span>
      </span>
      <span className={`text-2xl leading-none ${checked ? "text-neutral-950" : "text-neutral-300"}`} aria-hidden="true">
        {checked ? "★" : "☆"}
      </span>
    </button>
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

function TextField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NumberField({ label, onChange, value }: { label: string; onChange: (value?: number) => void; value?: number }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950" type="number" value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)} />
    </label>
  );
}

function TextArea({ label, onChange, rows, value }: { label: string; onChange: (value: string) => void; rows: number; value: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea className="mt-3 w-full resize-y border border-neutral-300 px-4 py-3 text-sm leading-7 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
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
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <FieldLabel>{label}</FieldLabel>
      <button
        type="button"
        className="mt-3 flex min-h-12 w-full cursor-pointer items-center justify-between border border-neutral-300 bg-white px-4 py-3 text-left text-sm transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={selectedOption ? "text-neutral-950" : "text-neutral-400"}>
          {selectedOption?.label ?? "Seleccionar"}
        </span>
        <span className={`text-neutral-400 transition ${isOpen ? "rotate-180" : ""}`}>↓</span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 border border-neutral-200 bg-white p-1 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            className={`flex w-full cursor-pointer items-center justify-between px-3 py-3 text-left text-sm transition ${
              value === "" ? "bg-neutral-950 text-white" : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
            }`}
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
          >
            Seleccionar
            {value === "" ? <span aria-hidden="true">•</span> : null}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex w-full cursor-pointer items-center justify-between px-3 py-3 text-left text-sm transition ${
                option.value === value
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
              {option.value === value ? <span aria-hidden="true">•</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">{children}</span>;
}
