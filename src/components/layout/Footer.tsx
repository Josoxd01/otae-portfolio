import Link from "next/link";

import type { ContactChannel, StudioProfile } from "@/types/portfolio";

const footerLinks = [
  { label: "Proyectos", href: "/proyectos" },
  { label: "Estudio", href: "/estudio" },
  { label: "Blogs", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

interface FooterProps {
  contactChannels: ContactChannel[];
  studioProfile: StudioProfile;
  variant?: "dark" | "light";
}

export function Footer({ contactChannels, studioProfile, variant = "light" }: FooterProps) {
  const isDark = variant === "dark";
  const classes = {
    border: isDark ? "border-neutral-800" : "border-neutral-200",
    footer: isDark
      ? "border-t border-neutral-700 bg-neutral-800 px-6 py-16 text-neutral-400 sm:px-8 lg:px-12"
      : "border-t border-neutral-200 bg-white px-6 py-16 text-neutral-700 sm:px-8 lg:px-12",
    heading: isDark ? "text-white" : "text-neutral-950",
    hover: isDark ? "hover:text-white" : "hover:text-neutral-950",
    muted: isDark ? "text-neutral-400" : "text-neutral-600",
    subtle: isDark ? "text-neutral-500" : "text-neutral-400",
  };

  return (
    <footer id="contacto" className={classes.footer}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.7fr_1fr]">
          <div className="max-w-sm">
            <p className={`font-title text-base font-medium tracking-[0.42em] ${classes.heading}`}>
              OTAE
            </p>
            <p className={`mt-6 text-sm leading-7 ${classes.muted}`}>
              {studioProfile.description}
            </p>
          </div>

          <div>
            <h2 className={`text-sm font-semibold ${classes.heading}`}>Navegación</h2>
            <nav className="mt-5 flex flex-col gap-3 text-sm">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`transition ${classes.hover}`}>
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className={`pt-3 text-xs uppercase tracking-[0.22em] transition ${classes.subtle} ${classes.hover}`}
              >
                Acceso admin
              </Link>
            </nav>
          </div>

          <div>
            <h2 className={`text-sm font-semibold ${classes.heading}`}>Contacto</h2>
            <div className="mt-5 flex flex-col gap-3 text-sm">
              {contactChannels.map((channel) =>
                channel.url ? (
                  <a
                    key={channel.id}
                    href={channel.url}
                    className={`transition ${classes.hover}`}
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

        <p className={`mt-14 border-t ${classes.border} pt-8 text-center text-xs ${classes.subtle}`}>
          © 2026 OTAE. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
