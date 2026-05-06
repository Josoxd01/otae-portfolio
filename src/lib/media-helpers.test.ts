import { describe, expect, it } from "vitest";

import {
  getAssetTypeFromMimeType,
  safeFileName,
  validateProjectCoverFile,
  validateProjectMediaFile,
} from "@/lib/media-helpers";

describe("media helpers", () => {
  it("safeFileName normalizes uploaded names", () => {
    expect(safeFileName("Fachada Principal ÁREA.PNG")).toBe("fachada-principal-area.png");
    expect(safeFileName("###.JPG")).toBe("media.jpg");
  });

  it("validates cover file types", () => {
    expect(() => validateProjectCoverFile(new File(["x"], "cover.webp", { type: "image/webp" }))).not.toThrow();
    expect(() => validateProjectCoverFile(new File(["x"], "cover.gif", { type: "image/gif" }))).toThrow(
      "La portada debe ser JPG, PNG o WebP.",
    );
  });

  it("validates project media files and allows PDFs", () => {
    expect(() => validateProjectMediaFile(new File(["x"], "plan.pdf", { type: "application/pdf" }))).not.toThrow();
  });

  it("rejects files over 5 MB", () => {
    const oversizedFile = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.jpg", {
      type: "image/jpeg",
    });

    expect(() => validateProjectCoverFile(oversizedFile)).toThrow("El archivo no puede superar 5 MB.");
  });

  it("maps MIME type to asset type", () => {
    expect(getAssetTypeFromMimeType("application/pdf")).toBe("pdf");
    expect(getAssetTypeFromMimeType("image/jpeg")).toBe("image");
  });
});
