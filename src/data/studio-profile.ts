import { contactChannels } from "@/data/contact-channels";
import type { StudioProfile } from "@/types/portfolio";

export const studioProfile: StudioProfile = {
  name: "OTAE",
  legalName: "OTAE Studio",
  tagline: "Arquitectura, ciudad e interiores desde el contexto.",
  description:
    "OTAE es un estudio de arquitectura enfocado en proyectos residenciales, comerciales, urbanos e interiores que conectan claridad espacial con sensibilidad material.",
  mission:
    "Disenar espacios precisos, habitables y memorables que respondan al lugar, al programa y a las personas que los usan.",
  vision:
    "Consolidar una practica arquitectonica cercana, rigurosa y contemporanea desde el sur del Ecuador.",
  history:
    "El estudio nace como una plataforma para desarrollar proyectos arquitectonicos, investigacion urbana y colaboraciones docentes.",
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
    url: "/mock/studio/hero.jpg",
    assetType: "image",
    altText: "Mesa de trabajo de OTAE Studio con planos y materiales.",
    title: "OTAE Studio",
  },
  socialLinks: contactChannels,
  updatedAt: "2026-04-27",
};
