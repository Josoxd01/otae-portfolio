import { contactChannels } from "@/data/contact-channels";
import type { StudioProfile } from "@/types/portfolio";

export const studioProfile: StudioProfile = {
  name: "OTAE",
  legalName: "OTAE Studio",
  tagline: "Oficina tenica de arquitectura y edificación",
  description:
    "OTAE es una oficina técnica de arquitectura y edificación enfocada en diseño arquitectónico, construcción e interiores para proyectos residenciales, comerciales y urbanos.",
  mission:
    "Desarrollamos soluciones funcionales, habitables y sensibles al contexto, cuidando cada etapa del proyecto desde la idea inicial hasta su materialización.",
  vision:
    "Consolidar una práctica arquitectónica cercana, rigurosa y contemporánea desde el sur del Ecuador.",
  history:
    "El estudio nace como una plataforma para desarrollar proyectos arquitectónicos, investigación urbana y colaboraciones docentes, integrando visión técnica, sensibilidad espacial y procesos de obra claros.",
  location: "Loja, Ecuador",
  logoMedia: {
    id: "otae-logo",
    url: "/mock/brand/otae-logo.svg",
    assetType: "image",
    altText: "Logotipo de OTAE Studio.",
    title: "OTAE Studio logo",
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
  heroTitle: "Oficina tenica de arquitectura y edificación",
  heroTagline: "Tres miradas que convergen en una forma honesta de diseñar.",
  aboutImage: {
    id: "otae-about-team",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85",
    assetType: "image",
    altText: "Equipo profesional colaborando alrededor de una mesa de trabajo.",
    title: "Equipo OTAE",
  },
  aboutParagraphs: [
    "Somos OTAE, un estudio de arquitectura conformado por tres visiones que convergen en una misma forma de entender el diseño.",
    "Creemos en una arquitectura que trasciende lo funcional: espacios que dialogan con la materia, que se sostienen en lo técnico sin perder lo humano. Cada proyecto es una búsqueda de equilibrio entre lo esencial y lo habitable, una exploración honesta que convierte el diseño en una experiencia atemporal.",
  ],
  socialLinks: contactChannels,
  updatedAt: "2026-04-27",
};
