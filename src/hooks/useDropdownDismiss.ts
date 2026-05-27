"use client";

import { useEffect, useRef } from "react";

export function useDropdownDismiss<T extends HTMLElement>(
  isOpen: boolean,
  onDismiss: () => void,
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current || containerRef.current.contains(event.target as Node)) {
        return;
      }

      onDismiss();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onDismiss();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onDismiss]);

  return containerRef;
}
