import { describe, expect, it } from "vitest";

import { removeUndefinedValues, slugify, sortBySortOrder, sortProjects } from "@/lib/portfolio-helpers";
import { projectFixture, secondProjectFixture } from "@/test/portfolio-fixtures";

describe("portfolio helpers", () => {
  it("slugify normalizes accents, spaces and punctuation", () => {
    expect(slugify("Casa Ágora / Diseño 2026!")).toBe("casa-agora-diseno-2026");
    expect(slugify("  --- ")).toBe("");
  });

  it("sortBySortOrder returns a sorted copy", () => {
    const items = [
      { id: "b", sortOrder: 20 },
      { id: "a", sortOrder: 10 },
    ];

    expect(sortBySortOrder(items).map((item) => item.id)).toEqual(["a", "b"]);
    expect(items.map((item) => item.id)).toEqual(["b", "a"]);
  });

  it("sortProjects sorts by order and uses title as tie breaker", () => {
    const projects = [
      { ...projectFixture, id: "b", title: "Zeta", sortOrder: 1 },
      { ...secondProjectFixture, id: "a", title: "Alfa", sortOrder: 1 },
    ];

    expect(sortProjects(projects).map((project) => project.title)).toEqual(["Alfa", "Zeta"]);
  });

  it("removeUndefinedValues removes undefined deeply and keeps other falsy values", () => {
    expect(
      removeUndefinedValues({
        description: undefined,
        isActive: false,
        count: 0,
        nested: {
          kept: "",
          removed: undefined,
        },
        items: [{ value: undefined }, { value: "ok" }],
      }),
    ).toEqual({
      isActive: false,
      count: 0,
      nested: {
        kept: "",
      },
      items: [{}, { value: "ok" }],
    });
  });
});
