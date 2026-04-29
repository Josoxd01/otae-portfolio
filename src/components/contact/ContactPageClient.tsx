"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { StudioProfile } from "@/types/portfolio";

interface ContactPageClientProps {
  studioProfile: StudioProfile;
}

const projectTypeOptions = ["Residencial", "Comercial", "Interiores", "Urbano", "Consultorios", "Otro"];

export function ContactPageClient({ studioProfile }: ContactPageClientProps) {
  const [projectType, setProjectType] = useState("");
  const [isProjectTypeOpen, setIsProjectTypeOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const message = buildContactMessage(formData, projectType);
    const whatsappUrl = buildWhatsAppUrl(studioProfile, message);

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="section-label">Contacto</p>
          <div className="mt-7 max-w-3xl">
            <h1 className="font-title text-4xl font-medium leading-tight sm:text-5xl">
              Conversemos sobre tu proyecto
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
              Cuéntanos qué tienes en mente. Podemos empezar por una conversación directa
              y revisar juntos el alcance, la intención y las posibilidades del proyecto.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <aside className="bg-neutral-50 p-7 sm:p-9 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Información de contacto
            </p>
            <h2 className="mt-5 font-title text-3xl font-medium leading-tight">
              {studioProfile.locationLabel ?? studioProfile.name}
            </h2>
            <p className="mt-5 text-sm leading-7 text-neutral-600">
              A continuación, encontrarás nuestros canales directos de contacto.
            </p>

            <div className="mt-10 space-y-10">
              {studioProfile.openingHours?.length ? (
                <ContactGroup title="Horarios">
                  <dl className="space-y-3">
                    {studioProfile.openingHours.map((item) => (
                      <div key={item.label} className="flex justify-between gap-6 text-sm">
                        <dt className="text-neutral-500">{item.label}</dt>
                        <dd className="text-right font-medium text-neutral-950">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </ContactGroup>
              ) : null}

              <dl className="divide-y divide-neutral-200 border-y border-neutral-200">
                <ContactRow
                  icon="whatsapp"
                  label="WhatsApp"
                  value={studioProfile.whatsappNumber}
                  href={studioProfile.whatsappUrl}
                />
                <ContactRow
                  icon="instagram"
                  label="Instagram"
                  value={studioProfile.instagramHandle}
                  href={studioProfile.instagramUrl}
                />
                <ContactRow
                  icon="linkedin"
                  label="LinkedIn"
                  value={studioProfile.linkedinUrl ? studioProfile.legalName ?? studioProfile.name : undefined}
                  href={studioProfile.linkedinUrl}
                />
                <ContactRow
                  icon="mail"
                  label="Email"
                  value={studioProfile.email}
                  href={studioProfile.email ? `mailto:${studioProfile.email}` : undefined}
                />
                <ContactRow
                  icon="phone"
                  label="Teléfono"
                  value={studioProfile.phone}
                  href={studioProfile.phone ? `tel:${studioProfile.phone.replace(/\s/g, "")}` : undefined}
                />
                <ContactRow
                  icon="pin"
                  label="Ubicación"
                  value={studioProfile.address ?? studioProfile.location}
                />
              </dl>

              {studioProfile.mapUrl ? (
                <a
                  href={studioProfile.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center border border-neutral-300 px-5 py-4 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 hover:bg-white"
                >
                  Ver ubicación en mapa →
                </a>
              ) : null}
            </div>
          </aside>

          <form className="border border-neutral-200 p-7 sm:p-9 lg:p-10" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field icon="user" label="Nombre" name="name" />
              <Field icon="user" label="Apellido" name="lastName" />
              <Field icon="mail" label="Email" name="email" type="email" />
              <Field icon="phone" label="Teléfono" name="phone" type="tel" />
              <div className="relative sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  Tipo de proyecto
                </span>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-between border border-neutral-300 bg-white px-4 py-4 text-left text-sm text-neutral-950 transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none"
                  aria-haspopup="listbox"
                  aria-expanded={isProjectTypeOpen}
                  onClick={() => setIsProjectTypeOpen((current) => !current)}
                >
                  <span className="flex items-center gap-3">
                    <Icon name="layers" />
                    {projectType || "Selecciona una opción"}
                  </span>
                  <span className={`text-neutral-400 transition ${isProjectTypeOpen ? "rotate-180" : ""}`}>
                    ↓
                  </span>
                </button>
                <input type="hidden" name="projectType" value={projectType} />
                {isProjectTypeOpen ? (
                  <div
                    className="absolute z-20 mt-2 w-full border border-neutral-200 bg-white p-1 shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                    role="listbox"
                  >
                    {projectTypeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-neutral-950 hover:text-white focus:bg-neutral-950 focus:text-white focus:outline-none ${
                          projectType === option ? "bg-neutral-950 text-white" : "text-neutral-700"
                        }`}
                        role="option"
                        aria-selected={projectType === option}
                        onClick={() => {
                          setProjectType(option);
                          setIsProjectTypeOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <label className="sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  Mensaje
                </span>
                <span className="mt-3 grid grid-cols-[auto_1fr] items-start gap-3 border border-neutral-300 px-4 py-4 transition focus-within:border-neutral-950">
                  <span className="pt-1">
                    <Icon name="message" />
                  </span>
                  <textarea
                    name="message"
                    rows={7}
                    className="w-full resize-none bg-transparent text-sm leading-7 text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
                    placeholder="Cuéntanos brevemente sobre el proyecto, ubicación, etapa o idea inicial."
                  />
                </span>
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Enviar mensaje por WhatsApp
              </button>
              <p className="text-sm leading-6 text-neutral-500">
                Se abrirá WhatsApp con tu mensaje prellenado.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function ContactGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ContactRow({
  href,
  icon,
  label,
  value,
}: {
  href?: string;
  icon: IconName;
  label: string;
  value?: string;
}) {
  if (!value) {
    return null;
  }

  const content = (
    <>
      <dt className="flex items-center gap-3 text-neutral-400">
        <Icon name={icon} />
        {label}
      </dt>
      <dd className="font-medium text-neutral-950">{value}</dd>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="grid grid-cols-[0.45fr_1fr] gap-6 py-4 text-sm transition hover:text-neutral-950"
      >
        {content}
      </a>
    );
  }

  return <div className="grid grid-cols-[0.45fr_1fr] gap-6 py-4 text-sm">{content}</div>;
}

function Field({
  icon,
  label,
  name,
  type = "text",
}: {
  icon: IconName;
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
        {label}
      </span>
      <span className="mt-3 grid grid-cols-[auto_1fr] items-center gap-3 border border-neutral-300 px-4 py-4 transition focus-within:border-neutral-950">
        <Icon name={icon} />
        <input
          name={name}
          type={type}
          className="w-full bg-transparent text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
        />
      </span>
    </label>
  );
}

type IconName =
  | "user"
  | "mail"
  | "phone"
  | "layers"
  | "message"
  | "whatsapp"
  | "instagram"
  | "linkedin"
  | "pin";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    user: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    mail: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    phone: <path d="M7 5 5 7c0 6.5 5.5 12 12 12l2-2-4-3-2 2c-2.5-1-4-2.5-5-5l2-2-3-4Z" />,
    layers: (
      <>
        <path d="m12 4 8 4-8 4-8-4 8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 16 8 4 8-4" />
      </>
    ),
    message: (
      <>
        <path d="M5 5h14v10H8l-3 3V5Z" />
        <path d="M8 9h8" />
        <path d="M8 12h5" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M5.5 19.5 7 16.2A8 8 0 1 1 10.8 18l-5.3 1.5Z" />
        <path d="M9.6 8.7c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.4.5c.6 1 1.4 1.8 2.5 2.3l.5-.5c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.6v.4c0 .4-.2.6-.5.8-.5.3-1.2.4-1.8.2-3-.9-5.1-3-6-6-.2-.6-.1-1.3.2-1.8Z" />
      </>
    ),
    instagram: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M16.3 7.8h.01" />
      </>
    ),
    linkedin: (
      <>
        <path d="M6.5 10v8" />
        <path d="M10.5 18v-8" />
        <path d="M10.5 13.5c0-2.2 1.2-3.7 3.2-3.7 1.9 0 3 1.3 3 3.5V18" />
        <path d="M6.5 6.5h.01" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s6-5.4 6-11a6 6 0 0 0-12 0c0 5.6 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-neutral-400"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

function buildContactMessage(formData: FormData, projectType: string) {
  const fields = [
    ["Nombre", formData.get("name")],
    ["Apellido", formData.get("lastName")],
    ["Email", formData.get("email")],
    ["Teléfono", formData.get("phone")],
    ["Tipo de proyecto", projectType || formData.get("projectType")],
    ["Mensaje", formData.get("message")],
  ]
    .map(([label, value]) => [label, typeof value === "string" ? value.trim() : ""] as const)
    .filter(([, value]) => value.length > 0);

  if (fields.length === 0) {
    return "Hola OTAE, quisiera conversar sobre un proyecto.";
  }

  return [
    "Hola OTAE, quisiera conversar sobre un proyecto.",
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");
}

function buildWhatsAppUrl(studioProfile: StudioProfile, message: string) {
  const encodedMessage = encodeURIComponent(message);
  const digits = studioProfile.whatsappNumber?.replace(/\D/g, "");

  if (studioProfile.whatsappUrl) {
    const separator = studioProfile.whatsappUrl.includes("?") ? "&" : "?";
    return `${studioProfile.whatsappUrl}${separator}text=${encodedMessage}`;
  }

  return `https://wa.me/${digits ?? ""}?text=${encodedMessage}`;
}
