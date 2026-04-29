import type { TeamMember } from "@/types/portfolio";

export const teamMembers: TeamMember[] = [
  {
    id: "daniela-ordonez",
    name: "Daniela Ordóñez",
    role: "Dirección arquitectónica",
    bio: "Arquitecta enfocada en el desarrollo integral de proyectos residenciales y comerciales, con especial atención a la relación entre contexto, materialidad y calidad espacial.",
    photoMedia: {
      id: "daniela-ordonez-photo",
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      assetType: "image",
      altText: "Retrato de Daniela Ordóñez en estudio de arquitectura.",
      title: "Daniela Ordóñez",
    },
    linkedinUrl: "https://www.linkedin.com",
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "mateo-carrion",
    name: "Mateo Carrión",
    role: "Coordinación técnica y edificación",
    bio: "Profesional orientado a la coordinación técnica, documentación constructiva y seguimiento de obra, integrando precisión técnica con soluciones habitables y eficientes.",
    photoMedia: {
      id: "mateo-carrion-photo",
      url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
      assetType: "image",
      altText: "Retrato de Mateo Carrión en entorno profesional.",
      title: "Mateo Carrión",
    },
    linkedinUrl: "https://www.linkedin.com",
    sortOrder: 20,
    isActive: true,
  },
  {
    id: "camila-rivera",
    name: "Camila Rivera",
    role: "Diseño interior y visualización",
    bio: "Diseñadora enfocada en interiores, atmósferas y representación visual, desarrollando propuestas sensibles al uso cotidiano, la luz y la escala humana.",
    photoMedia: {
      id: "camila-rivera-photo",
      url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&q=80",
      assetType: "image",
      altText: "Retrato de Camila Rivera en espacio de trabajo.",
      title: "Camila Rivera",
    },
    linkedinUrl: "https://www.linkedin.com",
    sortOrder: 30,
    isActive: true,
  },
];
