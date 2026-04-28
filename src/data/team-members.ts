import type { TeamMember } from "@/types/portfolio";

export const teamMembers: TeamMember[] = [
  {
    id: "otae-studio",
    name: "OTAE Studio",
    role: "Estudio de arquitectura",
    bio: "Equipo dedicado al diseno arquitectonico, interiorismo y pensamiento urbano desde una mirada sensible al contexto.",
    photoMedia: {
      id: "otae-studio-photo",
      url: "/mock/team/otae-studio.jpg",
      assetType: "image",
      altText: "Equipo OTAE Studio en espacio de trabajo.",
      title: "OTAE Studio",
    },
    instagramUrl: "https://www.instagram.com/otae.studio",
    sortOrder: 10,
    isActive: true,
  },
];
