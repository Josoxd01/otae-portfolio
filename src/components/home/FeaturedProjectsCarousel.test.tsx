import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FeaturedProjectsCarousel } from "@/components/home/FeaturedProjectsCarousel";
import { categoryFixture, projectFixture, secondProjectFixture } from "@/test/portfolio-fixtures";

describe("FeaturedProjectsCarousel", () => {
  it("renders the active project title and primary category", () => {
    render(<FeaturedProjectsCarousel categories={[categoryFixture]} projects={[projectFixture]} />);

    expect(screen.getByRole("heading", { name: "Casa Patio" })).toBeInTheDocument();
    expect(screen.getByText("Vivienda")).toBeInTheDocument();
  });

  it("falls back to Proyecto when primary category is missing", () => {
    render(
      <FeaturedProjectsCarousel
        categories={[]}
        projects={[{ ...projectFixture, primaryCategoryId: undefined }]}
      />,
    );

    expect(screen.getByText("Proyecto")).toBeInTheDocument();
  });

  it("moves to next and previous project", async () => {
    const user = userEvent.setup();
    render(
      <FeaturedProjectsCarousel
        categories={[categoryFixture]}
        projects={[projectFixture, secondProjectFixture]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Ver proyecto siguiente" }));
    expect(screen.getByRole("heading", { name: "Casa Ladera" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ver proyecto anterior" }));
    expect(screen.getByRole("heading", { name: "Casa Patio" })).toBeInTheDocument();
  });

  it("returns null when there are no projects", () => {
    const { container } = render(<FeaturedProjectsCarousel categories={[categoryFixture]} projects={[]} />);

    expect(container.firstChild).toBeNull();
  });
});
