"use client";

import { useEffect } from "react";

export function AmbientMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const root = document.documentElement;
    const maxScroll = () =>
      Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.3;
    let currentX = targetX;
    let currentY = targetY;
    let targetScroll = window.scrollY / maxScroll();
    let currentScroll = targetScroll;
    let frameId = 0;

    const setVariables = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      currentScroll += (targetScroll - currentScroll) * 0.08;

      root.style.setProperty("--pointer-x", `${currentX.toFixed(2)}px`);
      root.style.setProperty("--pointer-y", `${currentY.toFixed(2)}px`);
      root.style.setProperty("--scroll-progress", currentScroll.toFixed(4));

      frameId = window.requestAnimationFrame(setVariables);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const handleScroll = () => {
      targetScroll = Math.min(Math.max(window.scrollY / maxScroll(), 0), 1);
    };

    const handleResize = () => {
      targetScroll = Math.min(Math.max(window.scrollY / maxScroll(), 0), 1);
    };

    frameId = window.requestAnimationFrame(setVariables);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      root.style.removeProperty("--pointer-x");
      root.style.removeProperty("--pointer-y");
      root.style.removeProperty("--scroll-progress");
    };
  }, []);

  return null;
}
