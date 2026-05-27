"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminShell } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/AdminToastProvider";
import { validateAdminBlog } from "@/lib/admin/admin-validations";
import {
  deleteAdminBlog,
  getAdminBlogs,
  getAdminCategories,
  hideAdminBlog,
  publishAdminBlog,
} from "@/lib/admin/portfolio-admin";
import type { Blog, BlogStatus, ProjectCategory } from "@/types/portfolio";

const statusLabels: Record<BlogStatus, string> = {
  draft: "Borrador",
  hidden: "Oculto",
  published: "Publicado",
};

export function AdminBlogsPageClient() {
  const router = useRouter();
  const toast = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBlogId, setUpdatingBlogId] = useState("");

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  async function loadBlogs() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const [blogData, categoryData] = await Promise.all([
        getAdminBlogs(),
        getAdminCategories(),
      ]);
      setBlogs(sortBlogs(blogData));
      setCategories(categoryData);
    } catch (error) {
      console.warn("Could not load admin blogs.", error);
      setErrorMessage("No se pudieron cargar los blogs.");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(blog: Blog, status: Extract<BlogStatus, "hidden" | "published">) {
    setUpdatingBlogId(blog.id);
    setErrorMessage("");

    try {
      if (status === "published") {
        validateAdminBlog({
          ...blog,
          status: "published",
          publishedAt: blog.publishedAt || new Date().toISOString(),
        });
        await publishAdminBlog(blog.id);
      } else {
        await hideAdminBlog(blog.id);
      }

      await loadBlogs();
      toast.success(status === "published" ? "Blog publicado." : "Blog ocultado.");
    } catch (error) {
      console.warn("Could not update blog status.", error);
      setErrorMessage(error instanceof Error ? error.message : "No se pudo actualizar el estado del blog.");
      toast.error("No se pudo actualizar. Intentalo nuevamente.");
    } finally {
      setUpdatingBlogId("");
    }
  }

  async function deleteBlog() {
    if (!deleteTarget || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteAdminBlog(deleteTarget.id);
      setBlogs((current) => current.filter((blog) => blog.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Blog eliminado.");
    } catch (error) {
      console.warn("Could not delete blog.", error);
      setErrorMessage("No se pudo eliminar el blog.");
      toast.error("No se pudo eliminar. Intentalo nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleActionClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <AdminShell>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar blog"
        description="Esta accion eliminara permanentemente el blog y su imagen principal. No se podra recuperar. ¿Quieres continuar?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        variant="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteBlog}
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-label">Admin / Blogs</p>
          <h1 className="mt-7 font-title text-4xl font-medium leading-tight">Blogs</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
            Administra publicaciones editoriales, estado, categorias y portada principal.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Nuevo blog
        </Link>
      </div>

      <section className="mt-10 overflow-hidden border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-4">
          <p className="text-sm text-neutral-500">
            {isLoading ? "Cargando blogs..." : `${blogs.length} blogs`}
          </p>
          {errorMessage ? <p className="mt-1 text-sm text-red-600">{errorMessage}</p> : null}
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-neutral-500">Cargando blogs...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="bg-neutral-950 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white">
                  <th className="w-28 px-5 py-4">Portada</th>
                  <th className="px-5 py-4">Blog</th>
                  <th className="w-36 px-5 py-4">Estado</th>
                  <th className="w-44 px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Categorias</th>
                  <th className="w-48 px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {blogs.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-sm text-neutral-500" colSpan={6}>
                      Todavia no hay blogs.
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="cursor-pointer align-middle transition hover:bg-neutral-50"
                      onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}
                    >
                      <td className="px-5 py-5">
                        {blog.coverMedia?.url ? (
                          <div className="overflow-hidden border border-neutral-200 bg-neutral-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={blog.coverMedia.url}
                              alt={blog.coverMedia.altText ?? blog.title}
                              className="h-16 w-24 object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-24 items-center justify-center border border-neutral-200 bg-neutral-100 text-xs text-neutral-400">
                            Sin imagen
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-5">
                        <h2 className="font-title text-xl font-medium text-neutral-950">
                          {blog.title}
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500">{blog.slug}</p>
                      </td>
                      <td className="px-5 py-5">
                        <StatusBadge status={blog.status} />
                      </td>
                      <td className="px-5 py-5 text-sm text-neutral-500">
                        {formatDate(blog.publishedAt ?? blog.createdAt)}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-wrap gap-2">
                          {blog.categoryIds.map((categoryId) => {
                            const category = categoryById.get(categoryId);

                            return category ? (
                              <span
                                key={categoryId}
                                className="border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500"
                              >
                                {category.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-5" onClick={handleActionClick}>
                        <div className="flex justify-end gap-2">
                          <IconLink href={`/admin/blogs/${blog.id}/edit`} label="Editar">
                            <EditIcon />
                          </IconLink>
                          {blog.status === "published" ? (
                            <IconLink href={`/blog/${blog.slug}`} label="Ver blog" target="_blank">
                              <ExternalIcon />
                            </IconLink>
                          ) : null}
                          <IconButton
                            label={blog.status === "published" ? "Ocultar" : "Publicar"}
                            disabled={updatingBlogId === blog.id}
                            onClick={() => updateStatus(blog, blog.status === "published" ? "hidden" : "published")}
                          >
                            {blog.status === "published" ? <EyeOffIcon /> : <EyeIcon />}
                          </IconButton>
                          <IconButton
                            danger
                            label="Eliminar"
                            disabled={isDeleting && deleteTarget?.id === blog.id}
                            onClick={() => setDeleteTarget(blog)}
                          >
                            <TrashIcon />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function sortBlogs(items: Blog[]) {
  return [...items].sort((firstBlog, secondBlog) => {
    const firstDate = firstBlog.publishedAt ?? firstBlog.createdAt ?? "";
    const secondDate = secondBlog.publishedAt ?? secondBlog.createdAt ?? "";

    return secondDate.localeCompare(firstDate);
  });
}

function formatDate(value?: string) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: BlogStatus }) {
  const isPublished = status === "published";

  return (
    <span
      className={`inline-flex border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        isPublished
          ? "border-neutral-950 bg-neutral-950 text-white"
          : "border-neutral-200 text-neutral-400"
      }`}
    >
      {statusLabels[status]}
    </span>
  );
}

function IconButton({
  children,
  danger,
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <span className="group relative">
      <button
        type="button"
        className={`flex h-10 w-10 cursor-pointer items-center justify-center border transition disabled:cursor-not-allowed disabled:opacity-50 ${
          danger
            ? "border-red-200 text-red-700 hover:border-red-700"
            : "border-neutral-200 text-neutral-500 hover:border-neutral-950 hover:text-neutral-950"
        }`}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
      <Tooltip label={label} />
    </span>
  );
}

function IconLink({
  children,
  href,
  label,
  target,
}: {
  children: React.ReactNode;
  href: string;
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
        {children}
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

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M5 7h14M10 11v6M14 11v6M8 7l.5-2h7L16 7M7 7l1 13h8l1-13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}
