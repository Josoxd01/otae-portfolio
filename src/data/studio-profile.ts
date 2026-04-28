import { contactChannels } from "@/data/contact-channels";
import type { StudioProfile } from "@/types/portfolio";

export const studioProfile: StudioProfile = {
  name: "OTAE",
  legalName: "OTAE Studio",
  tagline: "Arquitectura, ciudad e interiores desde el contexto.",
  description:
    "OTAE es una oficina técnica de arquitectura y edificación enfocada en diseño arquitectónico, construcción e interiores para proyectos residenciales, comerciales y urbanos.",
  mission:
    "Desarrollamos soluciones funcionales, habitables y sensibles al contexto, cuidando cada etapa del proyecto desde la idea inicial hasta su materialización.",
  vision:
    "Consolidar una práctica arquitectónica cercana, rigurosa y contemporánea desde el sur del Ecuador.",
  history:
    "El estudio nace como una plataforma para desarrollar proyectos arquitectónicos, investigación urbana y colaboraciones docentes.",
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
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80",
    assetType: "image",
    altText: "Mesa de trabajo de OTAE Studio con planos y materiales.",
    title: "OTAE Studio",
  },
  socialLinks: contactChannels,
  updatedAt: "2026-04-27",
};
