import type { ContactChannel } from "@/types/portfolio";

export const contactChannels: ContactChannel[] = [
  {
    id: "instagram",
    type: "instagram",
    label: "Instagram",
    value: "@otae.studio",
    url: "https://www.instagram.com/otae.studio",
    isPrimary: true,
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "whatsapp",
    type: "whatsapp",
    label: "WhatsApp",
    value: "+593 99 000 0000",
    url: "https://wa.me/593990000000",
    isPrimary: true,
    sortOrder: 20,
    isActive: true,
  },
  {
    id: "email",
    type: "email",
    label: "Email",
    value: "hola@otae.studio",
    url: "mailto:hola@otae.studio",
    isPrimary: false,
    sortOrder: 30,
    isActive: true,
  },
];
