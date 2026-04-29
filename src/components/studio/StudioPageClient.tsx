"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { StudioProfile, TeamMember } from "@/types/portfolio";

interface StudioPageClientProps {
  studioProfile: StudioProfile;
  teamMembers: TeamMember[];
}

export function StudioPageClient({ studioProfile, teamMembers }: StudioPageClientProps) {
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const heroImage = studioProfile.heroImage;
  const aboutImage = studioProfile.aboutImage;
  const aboutParagraphs =
    studioProfile.aboutParagraphs ??
    [studioProfile.aboutText, studioProfile.description].filter(Boolean);

  useEffect(() => {
    if (!activeMember) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveMember(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMember]);

  return (
    <>
      <section className="bg-white pb-16 text-neutral-950 lg:pb-24">
        <div className="relative min-h-[560px] overflow-hidden bg-neutral-200 sm:min-h-[640px] lg:min-h-[720px]">
          <div className="absolute inset-x-6 inset-y-8 sm:inset-x-8 lg:inset-x-12">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
            {heroImage ? (
              <Image
                src={heroImage.url}
                alt={heroImage.altText ?? "Imagen principal del estudio OTAE."}
                fill
                priority
                quality={92}
                sizes="100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-black/8 to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-3xl px-7 pb-8 text-white sm:px-10 sm:pb-12 lg:px-14 lg:pb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/72">
                {studioProfile.heroLabel ?? "Estudio"}
              </p>
              {/* <h1 className="mt-5 font-title text-4xl font-medium leading-tight sm:text-5xl">
                {studioProfile.heroTitle ?? studioProfile.tagline}
              </h1> */}

            </div>
          </div>
        </div>
      </section>

      <section id="estudio" className="bg-neutral-50 px-6 py-20 text-neutral-950 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="relative min-h-[420px] overflow-hidden bg-neutral-200 sm:min-h-[520px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
            {aboutImage ? (
              <Image
                src={aboutImage.url}
                alt={aboutImage.altText ?? "Equipo OTAE en sesión de trabajo."}
                fill
                quality={90}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="max-w-2xl">
            <p className="section-label">Acerca del estudio</p>
            <h2 className="mt-7 font-title text-4xl font-medium leading-tight text-neutral-950 sm:text-5xl">
              {studioProfile.tagline ?? "Una práctica técnica con mirada humana"}
            </h2>
            <div className="mt-8 space-y-6 text-base leading-8 text-neutral-600 sm:text-lg">
              {aboutParagraphs.map((paragraph) =>
                paragraph ? <p key={paragraph}>{paragraph}</p> : null,
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-neutral-950 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="section-label">Equipo</p>
            <h2 className="mt-7 font-title text-4xl font-medium leading-tight sm:text-5xl">
              Nuestro equipo
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                className="group cursor-pointer text-left focus:outline-none"
                aria-label={`Abrir perfil de ${member.name}`}
                onClick={() => setActiveMember(member)}
              >
                <span className="relative block aspect-[4/5] overflow-hidden bg-neutral-200">
                  <span className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
                  {member.photoMedia ? (
                    <Image
                      src={member.photoMedia.url}
                      alt={member.photoMedia.altText ?? member.name}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0 group-focus-visible:scale-[1.025] group-focus-visible:grayscale-0"
                    />
                  ) : null}
                </span>
                <span className="mt-5 block font-title text-2xl font-medium text-neutral-950">
                  {member.name}
                </span>
                {member.role ? (
                  <span className="mt-2 block text-sm leading-6 text-neutral-500">{member.role}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeMember ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/82 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Perfil de ${activeMember.name}`}
          onClick={() => setActiveMember(null)}
        >
          <div
            className="relative grid max-h-[90vh] w-full max-w-5xl overflow-y-auto bg-white text-neutral-950 md:grid-cols-[0.9fr_1.1fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-neutral-300 bg-white/90 text-2xl text-neutral-700 transition hover:bg-neutral-950 hover:text-white"
              aria-label="Cerrar perfil"
              onClick={() => setActiveMember(null)}
            >
              ×
            </button>

            <div className="relative min-h-[360px] bg-neutral-200 md:min-h-[620px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
              {activeMember.photoMedia ? (
                <Image
                  src={activeMember.photoMedia.url}
                  alt={activeMember.photoMedia.altText ?? activeMember.name}
                  fill
                  quality={92}
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="px-7 py-10 sm:px-10 lg:px-12 lg:py-14">
              <p className="section-label">Perfil</p>
              <h3 className="mt-6 font-title text-4xl font-medium leading-tight">
                {activeMember.name}
              </h3>
              {activeMember.role ? (
                <p className="mt-4 text-base font-medium text-neutral-500">{activeMember.role}</p>
              ) : null}
              {activeMember.bio ? (
                <p className="mt-8 text-base leading-8 text-neutral-600">{activeMember.bio}</p>
              ) : null}

              {activeMember.linkedinUrl ? (
                <a
                  href={activeMember.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-9 inline-flex items-center gap-3 text-sm font-semibold text-neutral-950 transition hover:gap-4"
                >
                  Ver perfil profesional <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
