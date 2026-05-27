import type { Blog, Project, ProjectCategory, ProjectMedia, StudioProfile, TeamMember } from "@/types/portfolio";

export const projectActivationMessage =
  "Para activar este proyecto, completa portada, descripción y al menos una categoría.";
export const blogPublishMessage =
  "Para publicar este blog, completa contenido, imagen principal y al menos una categoría.";
export const categoryPublicMessage =
  "Para mostrar esta categoría públicamente, agrega una imagen principal.";
export const teamMemberPublicMessage =
  "Para mostrar este miembro en la web, completa cargo y fotografía.";

export function normalizeProjectCategories(project: Project): Project {
  const categoryIds = Array.from(new Set(project.categoryIds.filter(Boolean)));
  const primaryCategoryId = categoryIds.includes(project.primaryCategoryId ?? "")
    ? project.primaryCategoryId
    : categoryIds[0];

  return {
    ...project,
    categoryIds,
    primaryCategoryId,
  };
}

export function validateAdminProject(project: Project) {
  const requiredFields = [
    [project.title, "El título es requerido."],
    [project.slug, "El slug es requerido."],
    [project.summary, "El resumen es requerido."],
  ] as const;

  requiredFields.forEach(([value, message]) => {
    if (!value.trim()) {
      throw new Error(message);
    }
  });

  if (typeof project.isFeatured !== "boolean" || typeof project.isActive !== "boolean") {
    throw new Error("El estado del proyecto es requerido.");
  }

  if (!Number.isFinite(project.sortOrder)) {
    throw new Error("El orden del proyecto es requerido.");
  }

  if (!project.isActive) {
    return;
  }

  const hasValidPrimaryCategory =
    project.primaryCategoryId && project.categoryIds.includes(project.primaryCategoryId);

  if (
    !project.description.trim() ||
    !project.coverMedia?.url ||
    project.categoryIds.length === 0 ||
    !hasValidPrimaryCategory
  ) {
    throw new Error(projectActivationMessage);
  }
}

export function validateAdminCategory(category: ProjectCategory) {
  if (!category.name.trim()) {
    throw new Error("El nombre es requerido.");
  }

  if (!category.slug.trim()) {
    throw new Error("El slug es requerido.");
  }

  if (!Number.isFinite(category.sortOrder)) {
    throw new Error("El orden de la categoría es requerido.");
  }

  if (typeof category.isActive !== "boolean") {
    throw new Error("El estado de la categoría es requerido.");
  }

  if (category.isActive && category.categoryGroup === "portfolio_area" && !category.coverMedia?.url) {
    throw new Error(categoryPublicMessage);
  }
}

export function validateAdminProjectMedia(media: Omit<ProjectMedia, "id"> | ProjectMedia) {
  if (!media.url.trim()) {
    throw new Error("La URL del archivo es requerida.");
  }

  if (!media.assetType) {
    throw new Error("El tipo de archivo es requerido.");
  }

  if (!media.role) {
    throw new Error("El rol de la media es requerido.");
  }

  if (!Number.isFinite(media.sortOrder)) {
    throw new Error("El orden de la media es requerido.");
  }

  if (typeof media.isVisible !== "boolean") {
    throw new Error("La visibilidad de la media es requerida.");
  }
}

export function validateAdminBlog(blog: Blog) {
  if (!blog.title.trim()) {
    throw new Error("El título es requerido.");
  }

  if (!blog.slug.trim()) {
    throw new Error("El slug es requerido.");
  }

  if (!blog.status) {
    throw new Error("El estado del blog es requerido.");
  }

  if (blog.status !== "published") {
    return;
  }

  if (
    !blog.content.trim() ||
    !blog.coverMedia?.url ||
    blog.categoryIds.length === 0 ||
    !blog.publishedAt
  ) {
    throw new Error(blogPublishMessage);
  }
}

export function validateAdminTeamMember(member: TeamMember) {
  if (!member.name.trim()) {
    throw new Error("El nombre es requerido.");
  }

  if (!Number.isFinite(member.sortOrder)) {
    throw new Error("El orden del miembro es requerido.");
  }

  if (typeof member.isActive !== "boolean") {
    throw new Error("El estado del miembro es requerido.");
  }

  if (member.isActive && (!member.role?.trim() || !member.photoMedia?.url)) {
    throw new Error(teamMemberPublicMessage);
  }
}

export function normalizeStudioProfileForAdmin(studioProfile: StudioProfile): StudioProfile {
  const whatsappUrl =
    studioProfile.whatsappUrl?.trim() ||
    buildWhatsappUrl(studioProfile.whatsappNumber);

  return {
    ...studioProfile,
    name: studioProfile.name.trim(),
    description: studioProfile.description?.trim() || undefined,
    email: studioProfile.email?.trim() || undefined,
    phone: studioProfile.phone?.trim() || undefined,
    whatsappNumber: studioProfile.whatsappNumber?.trim() || undefined,
    whatsappUrl,
    instagramHandle: studioProfile.instagramHandle?.trim() || undefined,
    instagramUrl: studioProfile.instagramUrl?.trim() || undefined,
    linkedinUrl: studioProfile.linkedinUrl?.trim() || undefined,
    address: studioProfile.address?.trim() || undefined,
    city: studioProfile.city?.trim() || undefined,
    country: studioProfile.country?.trim() || undefined,
    location: studioProfile.location?.trim() || undefined,
    locationLabel: studioProfile.locationLabel?.trim() || undefined,
    mapUrl: studioProfile.mapUrl?.trim() || undefined,
  };
}

export function validateAdminStudioProfile(studioProfile: StudioProfile) {
  if (!studioProfile.name.trim()) {
    throw new Error("El nombre del estudio es requerido.");
  }
}

function buildWhatsappUrl(whatsappNumber?: string) {
  const digits = whatsappNumber?.replace(/\D/g, "");

  return digits ? `https://wa.me/${digits}` : undefined;
}
