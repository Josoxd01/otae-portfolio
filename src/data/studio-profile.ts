import type { StudioProfile } from "@/types/portfolio";
import { contactChannels } from "./contact-channels";

export const studioProfile: StudioProfile = {
  name: "OTAE",
  legalName: "OTAE Studio",
  tagline: "Oficina técnica de arquitectura y edificación",
  description:
    "OTAE es una oficina técnica de arquitectura y edificación enfocada en diseño arquitectónico, construcción e interiores para proyectos residenciales, comerciales y urbanos.",
  email: "hola@otae.studio",
  phone: "+593 7 000 0000",
  whatsappNumber: "+593 99 000 0000",
  whatsappUrl: "https://wa.me/593990000000",
  instagramHandle: "@otae_ecuador",
  instagramUrl: "https://www.instagram.com/otae_ecuador",
  linkedinUrl: "https://www.linkedin.com/company/otae-studio",
  address: "Centro de Loja",
  city: "Loja",
  country: "Ecuador",
  location: "Loja, Ecuador",
  locationLabel: "Oficina OTAE, Loja",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Loja%2C%20Ecuador",
  openingHours: [
    { label: "Lunes a viernes", value: "09:00 - 18:00" },
    { label: "Sábado", value: "10:00 - 14:00" },
    { label: "Domingo", value: "Cerrado" },
  ],
  mission:
    "Desarrollamos soluciones funcionales, habitables y sensibles al contexto, cuidando cada etapa del proyecto desde la idea inicial hasta su materialización.",
  vision:
    "Consolidar una práctica arquitectónica cercana, rigurosa y contemporánea desde el sur del Ecuador.",
  history:
    "El estudio nace como una plataforma para desarrollar proyectos arquitectónicos, investigación urbana y colaboraciones docentes, integrando visión técnica, sensibilidad espacial y procesos de obra claros.",
  logoMedia: {
    id: "otae-logo",
    url: "/brand/otae-logo.png",
    assetType: "image",
    altText: "Logotipo de OTAE",
    title: "Logotipo de OTAE",
  },
  heroMedia: {
    id: "otae-hero",
    url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85",
    assetType: "image",
    altText: "Espacio de trabajo de un estudio de arquitectura con mesa, planos y luz natural.",
    title: "Estudio OTAE",
  },
  heroImage: {
    id: "otae-studio-hero",
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2200&q=85",
    assetType: "image",
    altText: "Oficina contemporánea de arquitectura con estaciones de trabajo y luz natural.",
    title: "Oficina OTAE",
  },
  heroLabel: "Estudio",
  heroTitle: "Oficina técnica de arquitectura y edificación",
  heroTagline: "Tres miradas que convergen en una forma honesta de diseñar.",
  aboutImage: {
    id: "otae-about-team",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85",
    assetType: "image",
    altText: "Equipo profesional colaborando alrededor de una mesa de trabajo.",
    title: "Equipo OTAE",
  },
  aboutTitle: "Tres visiones, una misma forma de entender el diseño",
  aboutParagraphs: [
    "Somos OTAE, un estudio de arquitectura conformado por tres visiones que convergen en una misma forma de entender el diseño.",
    "Creemos en una arquitectura que trasciende lo funcional: espacios que dialogan con la materia, que se sostienen en lo técnico sin perder lo humano. Cada proyecto es una búsqueda de equilibrio entre lo esencial y lo habitable, una exploración honesta que convierte el diseño en una experiencia atemporal.",
  ],
  socialLinks: contactChannels,
  updatedAt: "2026-04-27",
};
