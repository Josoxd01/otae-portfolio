import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AboutSection } from "@/components/home/AboutSection";
import { ContactCTASection } from "@/components/home/ContactCTASection";
import { HomePageClient } from "@/components/home/HomePageClient";
import { SpecializationAreasSection } from "@/components/home/SpecializationAreasSection";
import { Footer } from "@/components/layout/Footer";
import type { HomeData } from "@/lib/firestore/home";
import {
  categoryFixture,
  contactChannelFixture,
  projectFixture,
  studioProfileFixture,
} from "@/test/portfolio-fixtures";

vi.mock("@/hooks/useHomeData", () => ({
  useHomeData: (initialData: HomeData) => ({
    homeData: initialData,
    isLoading: false,
  }),
}));

const homeData: HomeData = {
  activeProjects: [projectFixture],
  contactChannels: [contactChannelFixture],
  featuredProjects: [projectFixture],
  projectCategories: [categoryFixture],
  studioProfile: studioProfileFixture,
};

describe("home public sections", () => {
  it("renders HomePageClient with mocked initial data", () => {
    render(<HomePageClient initialData={homeData} />);

    expect(screen.getByLabelText("Ir al inicio de OTAE")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Casa Patio" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(studioProfileFixture.description ?? "").length).toBeGreaterThan(0);
  });

  it("renders SpecializationAreasSection with category and project data", () => {
    render(<SpecializationAreasSection categories={[categoryFixture]} projects={[projectFixture]} />);

    expect(screen.getByRole("heading", { name: "Vivienda" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Casa Patio" })).toBeInTheDocument();
  });

  it("returns null when SpecializationAreasSection has no categories", () => {
    const { container } = render(<SpecializationAreasSection categories={[]} projects={[projectFixture]} />);

    expect(container.firstChild).toBeNull();
  });

  it("does not break when category media and project primary category are missing", () => {
    render(
      <SpecializationAreasSection
        categories={[{ ...categoryFixture, coverMedia: undefined }]}
        projects={[{ ...projectFixture, coverMedia: undefined, primaryCategoryId: undefined }]}
      />,
    );

    expect(screen.getAllByRole("heading", { name: "Vivienda" }).length).toBeGreaterThan(0);
  });

  it("renders AboutSection with studio profile", () => {
    render(<AboutSection studioProfile={studioProfileFixture} />);

    expect(screen.getByText(studioProfileFixture.mission ?? "")).toBeInTheDocument();
  });

  it("renders ContactCTASection with a primary channel", () => {
    render(<ContactCTASection contactChannels={[contactChannelFixture]} />);

    expect(screen.getByRole("link", { name: /Iniciar conversaci/i })).toHaveAttribute(
      "href",
      contactChannelFixture.url,
    );
  });

  it("does not render a contact CTA link when there are no channels", () => {
    render(<ContactCTASection contactChannels={[]} />);

    expect(screen.queryByRole("link", { name: /Iniciar conversaci/i })).not.toBeInTheDocument();
  });

  it("renders Footer with navigation and tolerates empty contact channels", () => {
    render(<Footer contactChannels={[]} studioProfile={studioProfileFixture} />);

    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute("href", "/proyectos");
    expect(screen.getByRole("link", { name: "Acceso admin" })).toHaveAttribute("href", "/admin/login");
  });
});
