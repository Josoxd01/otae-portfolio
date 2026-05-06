import type { ContactChannel, Project, ProjectCategory, StudioProfile } from "@/types/portfolio";

export const studioProfileFixture: StudioProfile = {
  name: "OTAE",
  description: "Estudio de arquitectura con enfoque integral.",
  mission: "Diseñar espacios claros, habitables y bien construidos.",
};

export const contactChannelFixture: ContactChannel = {
  id: "whatsapp",
  type: "whatsapp",
  label: "WhatsApp",
  value: "+593 999 000 000",
  url: "https://wa.me/593999000000",
  isPrimary: true,
  sortOrder: 1,
  isActive: true,
};

export const categoryFixture: ProjectCategory = {
  id: "vivienda",
  name: "Vivienda",
  slug: "vivienda",
  description: "Arquitectura residencial y vivienda.",
  categoryGroup: "portfolio_area",
  coverMedia: {
    assetType: "image",
    url: "/category.jpg",
    altText: "Categoria vivienda",
  },
  sortOrder: 1,
  isActive: true,
};

export const projectFixture: Project = {
  id: "casa-patio",
  title: "Casa Patio",
  slug: "casa-patio",
  summary: "Una casa organizada alrededor de patios interiores.",
  description: "Proyecto residencial de prueba.",
  location: "Loja",
  year: 2026,
  categoryIds: ["vivienda"],
  primaryCategoryId: "vivienda",
  coverMedia: {
    assetType: "image",
    url: "/casa-patio.jpg",
    altText: "Casa Patio",
  },
  isFeatured: true,
  isActive: true,
  sortOrder: 1,
};

export const secondProjectFixture: Project = {
  ...projectFixture,
  id: "casa-ladera",
  title: "Casa Ladera",
  slug: "casa-ladera",
  summary: "Una vivienda compacta sobre pendiente.",
  sortOrder: 2,
};
