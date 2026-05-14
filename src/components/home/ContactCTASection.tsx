import type { ContactChannel } from "@/types/portfolio";

interface ContactCTASectionProps {
  contactChannels: ContactChannel[];
}

export function ContactCTASection({ contactChannels }: ContactCTASectionProps) {
  const primaryChannel =
    contactChannels.find((channel) => channel.type === "whatsapp" && channel.isPrimary) ??
    contactChannels.find((channel) => channel.type === "email") ??
    contactChannels.find((channel) => channel.isPrimary) ??
    contactChannels[0];

  return (
    <section id="contacto" className="bg-white px-0 py-14 sm:px-6 lg:px-0">
      <div className="bg-neutral-800 px-6 py-16 text-center text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-title text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-white/78">
            Conversemos sobre tu visión y exploremos cómo OTAE puede ayudarte a convertirla en un proyecto claro, viable y bien construido.
          </p>
          {primaryChannel ? (
            <a
              href={primaryChannel.url ?? "#"}
              className="mt-9 inline-flex items-center gap-4 bg-white px-8 py-4 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
              target={primaryChannel.type === "email" ? undefined : "_blank"}
              rel={primaryChannel.type === "email" ? undefined : "noreferrer"}
            >
              Iniciar conversación <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
