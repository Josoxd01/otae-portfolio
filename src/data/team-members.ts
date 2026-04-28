import type { TeamMember } from "@/types/portfolio";

export const teamMembers: TeamMember[] = [
  {
    id: "otae-studio",
    name: "OTAE Studio",
    role: "Estudio de arquitectura",
    bio: "Equipo dedicado al diseño arquitectónico, interiorismo y pensamiento urbano desde una mirada sensible al contexto.",
    photoMedia: {
      id: "otae-studio-photo",
      url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
      assetType: "image",
      altText: "Equipo OTAE Studio en espacio de trabajo.",
      title: "OTAE Studio",
    },
    instagramUrl: "https://www.instagram.com/otae.studio",
    sortOrder: 10,
    isActive: true,
  },
];
