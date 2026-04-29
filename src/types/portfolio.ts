export type AssetType = "image" | "video" | "pdf" | "embed";

export type MediaSource = "upload" | "external" | "instagram" | "youtube" | "vimeo";

export type ProjectStage = "conceptual" | "design" | "under_construction" | "built" | "completed";

export type CategoryGroup = "portfolio_area" | "typology" | "content_area";

export type ProjectMediaRole =
  | "cover"
  | "gallery"
  | "plan"
  | "render"
  | "construction"
  | "before"
  | "after"
  | "detail"
  | "context"
  | "video"
  | "walkthrough"
  | "technical_sheet";

export type ContactChannelType =
  | "email"
  | "phone"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "address"
  | "external_link";

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";

export type ContactMessageSource = "web" | "instagram" | "whatsapp" | "referral" | "other";

// Referencia ligera a un archivo multimedia - Se utiliza generalmente para mostrar archivos en la UI
export interface MediaReference {
  id?: string; // Identificador único (opcional)
  url: string; // URL del archivo o imagen
  assetType: AssetType; // Tipo de asset (image, video, pdf, embed)
  altText?: string; // Texto alternativo para accesibilidad
  title?: string; // Título descriptivo (opcional)
}

// Almacenamiento completo de un archivo multimedia con todos sus detalles
export interface MediaAsset {
  id: string; // Identificador único del asset
  fileUrl: string; // URL del archivo o imagen
  assetType: AssetType; // Tipo de archivo (image, video, pdf, embed)
  mimeType?: string; // Tipo MIME del archivo (image/jpeg, video/mp4, etc.)
  title?: string; // Título del archivo
  caption?: string; // Descripción corta
  altText?: string; // Texto alternativo para accesibilidad
  source: MediaSource; // De dónde proviene (upload, external, instagram, youtube, vimeo)
  metadata?: Record<string, unknown>; // Datos adicionales personalizados
  isActive: boolean; // Si está activo/disponible
  createdAt?: string; // Fecha de creación
  updatedAt?: string; // Fecha de última actualización
}

// Clasificación de proyectos (ej: "Casas", "Edificios", "Interiores")
export interface ProjectCategory {
  id: string; // Identificador único
  name: string; // Nombre de la categoría
  slug: string; // URL amigable (ej: "residential-buildings")
  description?: string; // Descripción de la categoría
  categoryGroup: CategoryGroup; // Tipo de agrupación (portfolio_area, typology, content_area)
  coverMedia?: MediaReference; // Imagen portada de la categoría
  sortOrder: number; // Orden de visualización
  isActive: boolean; // Si está activa
  createdAt?: string; // Fecha de creación
  updatedAt?: string; // Fecha de última actualización
}

// Información principal de un proyecto arquitectónico
export interface Project {
  id: string; // Identificador único del proyecto
  title: string; // Nombre del proyecto
  slug: string; // URL amigable
  subtitle?: string; // Subtítulo (opcional)
  summary: string; // Resumen corto del proyecto
  description: string; // Descripción completa
  location?: string; // Ubicación geográfica
  year?: number; // Año del proyecto
  areaM2?: number; // Área en metros cuadrados
  projectStage?: ProjectStage; // Estado del proyecto (conceptual, built, etc.)
  categoryIds: string[]; // Array de IDs de categorías
  primaryCategoryId?: string; // Categoría principal
  coverMedia?: MediaReference; // Imagen portada del proyecto
  isFeatured: boolean; // Si está destacado en portada
  isActive: boolean; // Si está activo
  sortOrder: number; // Orden de visualización
  metadata?: Record<string, unknown>; // Datos adicionales personalizados
  createdAt?: string; // Fecha de creación
  updatedAt?: string; // Fecha de última actualización
}

// Imágenes y videos asociados a un proyecto específico - Incluye roles (planos, renders, fotos de construcción, etc.)
export interface ProjectMedia {
  id: string; // Identificador único
  mediaAssetId?: string; // ID del asset asociado (opcional)
  url: string; // URL directa de la imagen/video
  assetType: AssetType; // Tipo de archivo (image, video, pdf, embed)
  mimeType?: string; // Tipo MIME del archivo
  role: ProjectMediaRole; // Rol en el proyecto (cover, gallery, plan, render, construction, etc.)
  title?: string; // Título de la media
  description?: string; // Descripción de la media
  altText?: string; // Texto alternativo para accesibilidad
  sortOrder: number; // Orden en la galería
  isVisible: boolean; // Si es visible en la galería
}

// Información de miembros del equipo del estudio
export interface TeamMember {
  id: string; // Identificador único
  name: string; // Nombre completo
  role?: string; // Rol en el estudio (Arquitecto, Diseñador, etc.)
  bio?: string; // Biografía corta
  photoMedia?: MediaReference; // Foto de perfil
  email?: string; // Email de contacto
  instagramUrl?: string; // URL de Instagram
  linkedinUrl?: string; // URL de LinkedIn
  sortOrder: number; // Orden en el equipo
  isActive: boolean; // Si está activo en el equipo
}

// Canales de contacto del estudio - Incluye email, teléfono, WhatsApp, redes sociales, dirección, etc.
export interface ContactChannel {
  id: string; // Identificador único
  type: ContactChannelType; // Tipo de canal (email, phone, whatsapp, instagram, etc.)
  label: string; // Etiqueta visible (ej: "Email principal")
  value: string; // Valor del canal (ej: "info@estudio.com")
  url?: string; // URL completa si aplica
  isPrimary: boolean; // Si es el canal principal
  sortOrder: number; // Orden de visualización
  isActive: boolean; // Si está activo
}

// Mensajes de contacto recibidos a través del sitio web u otros canales
export interface ContactMessage {
  id: string; // Identificador único del mensaje
  name: string; // Nombre de quien contacta
  email?: string; // Email del remitente
  phone?: string; // Teléfono del remitente
  subject?: string; // Asunto del mensaje
  message: string; // Contenido del mensaje
  source: ContactMessageSource; // De dónde vino (web, instagram, whatsapp, referral, other)
  status: ContactMessageStatus; // Estado (new, read, replied, archived)
  createdAt: string; // Fecha de creación
}

// Información general del estudio/firma arquitectónica
export interface StudioProfile {
  name: string; // Nombre del estudio
  legalName?: string; // Razón social/nombre legal
  tagline?: string; // Eslogan corto
  description?: string; // Descripción general del estudio
  mission?: string; // Misión del estudio
  vision?: string; // Visión del estudio
  history?: string; // Historial/biografía del estudio
  location?: string; // Ubicación principal
  logoMedia?: MediaReference; // Logo del estudio
  heroMedia?: MediaReference; // Imagen principal/hero del sitio
  heroImage?: MediaReference; // Imagen principal para la página Estudio
  heroLabel?: string; // Label breve para el hero del estudio
  heroTitle?: string; // Título principal del hero del estudio
  heroTagline?: string; // Lema corto para el hero del estudio
  aboutImage?: MediaReference; // Imagen de apoyo para la sección Acerca del estudio
  aboutText?: string; // Texto breve de respaldo para la sección Acerca del estudio
  aboutParagraphs?: string[]; // Párrafos editoriales para la sección Acerca del estudio
  socialLinks?: ContactChannel[]; // Array de redes sociales y otros canales sociales
  updatedAt?: string; // Última actualización del perfil
}
