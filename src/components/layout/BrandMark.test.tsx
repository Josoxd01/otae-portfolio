import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandMark } from "@/components/layout/BrandMark";

describe("BrandMark", () => {
  it("renders the logo image when logo media exists", () => {
    render(
      <BrandMark
        logoMedia={{
          assetType: "image",
          altText: "OTAE custom logo",
          url: "/brand/otae-logo.png",
        }}
      />,
    );

    expect(screen.getByAltText("OTAE custom logo")).toBeInTheDocument();
  });

  it("renders text fallback when logo media is missing", () => {
    render(<BrandMark />);

    expect(screen.getByText("OTAE")).toBeInTheDocument();
  });

  it("renders text fallback when the logo image fails to load", () => {
    render(
      <BrandMark
        logoMedia={{
          assetType: "image",
          altText: "Broken OTAE logo",
          url: "/missing-logo.svg",
        }}
      />,
    );

    fireEvent.error(screen.getByAltText("Broken OTAE logo"));

    expect(screen.getByText("OTAE")).toBeInTheDocument();
  });
});
