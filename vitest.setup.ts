import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: (imageProps: {
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    src: string | { src: string };
    [key: string]: unknown;
  }) => {
    const { alt, src, ...props } = imageProps;
    delete props.fill;
    delete props.priority;
    delete props.sizes;

    return React.createElement("img", {
      alt,
      src: typeof src === "string" ? src : src.src,
      ...props,
    });
  },
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => React.createElement("a", { href, ...props }, children),
}));
