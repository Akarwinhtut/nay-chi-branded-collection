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
};

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delayMs = 0,
  distance = 44,
  once = true,
  threshold = 0.25,
  soft = false,
}: ScrollRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
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
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

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
        "scroll-reveal",
        soft ? "scroll-reveal--soft" : "",
        visible ? "scroll-reveal--visible" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
