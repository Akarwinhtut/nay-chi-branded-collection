"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delayMs?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
  soft?: boolean;
  editorial?: boolean;
};

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delayMs = 0,
  distance = 28,
  once = true,
  threshold = 0.25,
  soft = false,
  editorial = false,
}: ScrollRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorial) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCompactViewport = window.matchMedia("(max-width: 767px)").matches;

    if (prefersReducedMotion || isCompactViewport || typeof IntersectionObserver === "undefined") {
      return;
    }

    node.dataset.ready = "true";
    let frameId = 0;
    const rect = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibilityBoundary = viewportHeight * (1 - Math.min(threshold, 0.4));

    if (rect.top <= visibilityBoundary && rect.bottom >= 0) {
      frameId = window.requestAnimationFrame(() => {
        setVisible(true);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.unobserve(node);
          }

          return;
        }

        if (!once) {
          setVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      delete node.dataset.ready;
      observer.disconnect();
    };
  }, [editorial, once, threshold]);

  const style = {
    "--reveal-delay": `${delayMs}ms`,
    "--reveal-distance": `${distance}px`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      data-direction={direction}
      style={style}
      className={[
        editorial ? "scroll-reveal" : "",
        editorial && soft ? "scroll-reveal--soft" : "",
        editorial && visible ? "scroll-reveal--visible" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
