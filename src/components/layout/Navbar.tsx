"use client";

import Link from "next/link";
import { useState } from "react";

import { BrandMark } from "@/components/layout/BrandMark";
import { otaeLogoMedia } from "@/components/layout/brand";

const navItems = [
  { label: "Proyectos", href: "/proyectos" },
  { label: "Estudio", href: "/estudio" },
  { label: "Blogs", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex h-10 items-center"
          aria-label="Ir al inicio de OTAE"
        >
          <BrandMark logoMedia={otaeLogoMedia} />
        </Link>

        <div className="hidden items-center gap-12 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-900 md:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="relative h-3.5 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-current transition ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-px w-5 bg-current transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-px w-5 bg-current transition ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-neutral-200 bg-white px-6 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-neutral-100 py-4 text-sm font-medium text-neutral-700 last:border-b-0"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
