import Link from "next/link";

import type { ContactChannel, StudioProfile } from "@/types/portfolio";

const footerLinks = [
  { label: "Proyectos", href: "/proyectos" },
  { label: "Estudio", href: "#estudio" },
  { label: "Contacto", href: "#contacto" },
];

interface FooterProps {
  contactChannels: ContactChannel[];
  studioProfile: StudioProfile;
}

export function Footer({ contactChannels, studioProfile }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-16 text-neutral-700 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.7fr_1fr]">
          <div className="max-w-sm">
            <p className="font-title text-base font-medium tracking-[0.42em] text-neutral-950">
              OTAE
            </p>
            <p className="mt-6 text-sm leading-7 text-neutral-600">
              {studioProfile.description}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-950">Navegación</h2>
            <nav className="mt-5 flex flex-col gap-3 text-sm">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-neutral-950">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-950">Contacto</h2>
            <div className="mt-5 flex flex-col gap-3 text-sm">
              {contactChannels.map((channel) =>
                channel.url ? (
                  <a
                    key={channel.id}
                    href={channel.url}
                    className="transition hover:text-neutral-950"
                    target={channel.type === "email" ? undefined : "_blank"}
                    rel={channel.type === "email" ? undefined : "noreferrer"}
                  >
                    {channel.value}
                  </a>
                ) : (
                  <span key={channel.id}>{channel.value}</span>
                ),
              )}
            </div>
          </div>
        </div>

        <p className="mt-14 border-t border-neutral-200 pt-8 text-center text-xs text-neutral-400">
          © 2026 OTAE. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
