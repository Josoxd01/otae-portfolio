"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/AdminToastProvider";
import {
  getAdminBlog,
  getAdminCategories,
  saveAdminBlog,
} from "@/lib/admin/portfolio-admin";
import { slugify } from "@/lib/portfolio-helpers";
import { uploadBlogCoverMedia } from "@/lib/storage";
import { useDropdownDismiss } from "@/hooks/useDropdownDismiss";
import type { Blog, BlogStatus, ProjectCategory } from "@/types/portfolio";

const statusOptions: Array<{ label: string; value: BlogStatus }> = [
  { label: "Borrador", value: "draft" },
  { label: "Publicado", value: "published" },
  { label: "Oculto", value: "hidden" },
];

interface AdminBlogFormClientProps {
  blogId?: string;
}

export function AdminBlogFormClient({ blogId }: AdminBlogFormClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [blog, setBlog] = useState<Blog>(() => createEmptyBlog());
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(blogId));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const title = blogId ? "Editar blog" : "Nuevo blog";
  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories],
  );
  const selectedCategoryLabels = blog.categoryIds
    .map((categoryId) => categories.find((category) => category.id === categoryId)?.name)
    .filter(Boolean)
    .join(", ");
  const currentBlogId = blog.id || slugify(blog.title);
  const closeCategorySelect = useCallback(() => setIsCategorySelectOpen(false), []);

  useEffect(() => {
    let isMounted = true;

    async function loadFormData() {
      try {
        const [categoryData, blogData] = await Promise.all([
          getAdminCategories(),
          blogId ? getAdminBlog(blogId) : Promise.resolve(null),
        ]);

        if (!isMounted) {
          return;
        }

        setCategories(categoryData);
        if (blogData) {
          setBlog(blogData);
        }
      } catch (error) {
        console.warn("Could not load blog form data.", error);
        setErrorMessage("No se pudo cargar la informacion del blog.");
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
  }, [blogId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSaving(true);

    try {
      const normalizedBlog = normalizeBlog(blog, Boolean(blogId));
      validateBlog(normalizedBlog);
      await saveAdminBlog(normalizedBlog);
      toast.success(blogId ? "Blog actualizado." : "Blog creado.");
      router.push("/admin/blogs");
    } catch (error) {
      console.warn("Could not save blog.", error);
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar el blog.");
      toast.error("No se pudo guardar. Intentalo nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !currentBlogId) {
      setErrorMessage("Escribe el titulo del blog antes de subir la portada.");
      return;
    }

    setErrorMessage("");
    setUploadMessage("");
    setIsUploadingCover(true);

    try {
      const uploaded = await uploadBlogCoverMedia(currentBlogId, file);
      const updatedBlog = normalizeBlog(
        {
          ...blog,
          id: currentBlogId,
          coverMedia: {
            assetType: "image",
            altText: blog.coverMedia?.altText || blog.title,
            storagePath: uploaded.storagePath,
            title: blog.coverMedia?.title || blog.title,
            url: uploaded.url,
          },
        },
        Boolean(blogId),
      );

      await saveAdminBlog(updatedBlog);
      setBlog(updatedBlog);
      setUploadMessage("Portada actualizada.");
      toast.success("Portada actualizada.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la portada.");
      toast.error("No se pudo subir la portada.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  function handleTitleChange(value: string) {
    setBlog((current) => ({
      ...current,
      title: value,
      id: blogId ? current.id : slugify(value),
      slug: slugify(value),
    }));
  }

  function updateField<K extends keyof Blog>(field: K, value: Blog[K]) {
    setBlog((current) => ({ ...current, [field]: value }));
  }

  function updateStatus(status: BlogStatus) {
    setBlog((current) => ({
      ...current,
      status,
      publishedAt: status === "published" ? current.publishedAt || new Date().toISOString() : current.publishedAt,
    }));
  }

  function toggleCategory(categoryId: string) {
    setBlog((current) => {
      const exists = current.categoryIds.includes(categoryId);

      return {
        ...current,
        categoryIds: exists
          ? current.categoryIds.filter((id) => id !== categoryId)
          : [...current.categoryIds, categoryId],
      };
    });
  }

  return (
    <AdminShell>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label">Admin / Blogs</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">{title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
              Edita la publicacion editorial, su portada, estado y categorias relacionadas.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Guardando..." : "Guardar blog"}
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {uploadMessage ? (
          <p className="mt-8 border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
            {uploadMessage}
          </p>
        ) : null}

        {isLoading ? (
          <p className="mt-10 text-sm text-neutral-500">Cargando formulario...</p>
        ) : (
          <div className="mt-10 space-y-8">
            <section className="border border-neutral-200 bg-white p-7">
              <SectionHeading
                label="Informacion general"
                title="Datos principales"
                description="Define el titulo, subtitulo y contenido que se mostraran en la pagina publica del blog."
              />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <TextField label="Titulo" value={blog.title} onChange={handleTitleChange} required />
                <TextField
                  label="Fecha de publicacion"
                  type="date"
                  value={toDateInputValue(blog.publishedAt)}
                  onChange={(value) => updateField("publishedAt", fromDateInputValue(value))}
                />
                <TextField
                  label="Subtitulo"
                  value={blog.subtitle ?? ""}
                  onChange={(value) => updateField("subtitle", value)}
                  className="lg:col-span-2"
                />

                <label className="block lg:col-span-2">
                  <FieldLabel>Contenido</FieldLabel>
                  <textarea
                    className="mt-3 w-full resize-y border border-neutral-300 px-4 py-3 text-sm leading-7 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                    required
                    rows={12}
                    value={blog.content}
                    onChange={(event) => updateField("content", event.target.value)}
                  />
                </label>
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <section className="border border-neutral-200 bg-white p-7">
                <SectionHeading label="Portada" title="Imagen principal" />
                {blog.coverMedia?.url ? (
                  <div className="mt-6 overflow-hidden border border-neutral-200 bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.coverMedia.url}
                      alt={blog.coverMedia.altText ?? blog.title}
                      className="h-80 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-6 flex h-80 items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
                    Sin portada
                  </div>
                )}
                <label className="mt-5 inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:border-neutral-300">
                  {isUploadingCover ? "Subiendo..." : "Subir/reemplazar portada"}
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isUploadingCover || !currentBlogId}
                    onChange={handleCoverUpload}
                  />
                </label>
                <p className="mt-3 text-sm leading-7 text-neutral-500">
                  JPG, PNG o WebP. Para blogs nuevos, escribe primero el titulo.
                </p>
              </section>

              <section className="border border-neutral-200 bg-white p-7">
                <SectionHeading label="Publicacion" title="Estado y categorias" />
                <div className="mt-8 grid gap-6">
                  <SelectField
                    label="Estado"
                    options={statusOptions}
                    value={blog.status}
                    onChange={(value) => updateStatus(value as BlogStatus)}
                  />
                  <MultiCategorySelect
                    categories={activeCategories}
                    isOpen={isCategorySelectOpen}
                    onClose={closeCategorySelect}
                    onOpenChange={() => setIsCategorySelectOpen((current) => !current)}
                    onToggle={toggleCategory}
                    selectedIds={blog.categoryIds}
                    selectedLabel={selectedCategoryLabels || "Seleccionar categorias"}
                  />
                  <p className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-7 text-neutral-500">
                    Las categorias del blog reutilizan las mismas areas del portafolio. No se crean categorias nuevas desde este formulario.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}
      </form>
    </AdminShell>
  );
}

function createEmptyBlog(): Blog {
  return {
    id: "",
    title: "",
    slug: "",
    content: "",
    categoryIds: [],
    status: "draft",
  };
}

function normalizeBlog(blog: Blog, keepExistingId: boolean): Blog {
  const slug = blog.slug || slugify(blog.title);
  const id = keepExistingId && blog.id ? blog.id : blog.id || slug;
  const now = new Date().toISOString();

  return {
    ...blog,
    id,
    slug,
    subtitle: blog.subtitle || undefined,
    publishedAt: blog.status === "published" ? blog.publishedAt || now : blog.publishedAt || undefined,
    coverMedia: blog.coverMedia?.url
      ? {
        assetType: "image",
        altText: blog.coverMedia.altText || blog.title,
        storagePath: blog.coverMedia.storagePath,
        title: blog.coverMedia.title || blog.title,
        url: blog.coverMedia.url,
      }
      : undefined,
  };
}

function validateBlog(blog: Blog) {
  if (!blog.title.trim()) {
    throw new Error("El titulo es requerido.");
  }

  if (!blog.slug.trim()) {
    throw new Error("El slug es requerido.");
  }

  if (!blog.content.trim()) {
    throw new Error("El contenido es requerido.");
  }

  if (blog.categoryIds.length === 0) {
    throw new Error("Selecciona al menos una categoria.");
  }
}

function toDateInputValue(value?: string) {
  return value ? value.slice(0, 10) : "";
}

function fromDateInputValue(value: string) {
  return value ? new Date(`${value}T12:00:00.000Z`).toISOString() : undefined;
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

function TextField({
  className = "",
  label,
  onChange,
  required,
  type = "text",
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className={`block ${className}`}>
      <FieldLabel>{label}</FieldLabel>
      <input
        className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
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
  const closeSelect = useCallback(() => setIsOpen(false), []);
  const selectRef = useDropdownDismiss<HTMLDivElement>(isOpen, closeSelect);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={selectRef} className="relative">
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
        <span className={`text-neutral-400 transition ${isOpen ? "rotate-180" : ""}`}>v</span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 border border-neutral-200 bg-white p-1 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex w-full cursor-pointer items-center justify-between px-3 py-3 text-left text-sm transition ${option.value === value
                ? "bg-neutral-950 text-white"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              onClick={() => {
                onChange(option.value);
                closeSelect();
              }}
            >
              {option.label}
              {option.value === value ? <span aria-hidden="true">.</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MultiCategorySelect({
  categories,
  isOpen,
  onClose,
  onOpenChange,
  onToggle,
  selectedIds,
  selectedLabel,
}: {
  categories: ProjectCategory[];
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  onToggle: (categoryId: string) => void;
  selectedIds: string[];
  selectedLabel: string;
}) {
  const dropdownRef = useDropdownDismiss<HTMLDivElement>(isOpen, onClose);

  return (
    <div ref={dropdownRef} className="relative">
      <FieldLabel>Categorias</FieldLabel>
      <button
        type="button"
        className="mt-3 flex w-full cursor-pointer items-center justify-between border border-neutral-300 bg-white px-4 py-3 text-left text-sm transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
        onClick={onOpenChange}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className={`text-neutral-400 transition ${isOpen ? "rotate-180" : ""}`}>v</span>
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
                onChange={() => {
                  onToggle(category.id);
                  onClose();
                }}
              />
              {category.name}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">{children}</span>;
}
