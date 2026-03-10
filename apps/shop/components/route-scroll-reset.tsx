"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function RouteScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.slice(1);

      if (!targetId) {
        return;
      }

      const scrollToHashTarget = () => {
        const target = document.getElementById(targetId);
        target?.scrollIntoView({ block: "start", inline: "nearest" });
      };

      const frameId = window.requestAnimationFrame(scrollToHashTarget);
      const timeoutId = window.setTimeout(scrollToHashTarget, 360);

      return () => {
        window.cancelAnimationFrame(frameId);
        window.clearTimeout(timeoutId);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, searchParams]);

  useEffect(() => {
    const scrollToHashTarget = () => {
      const targetId = window.location.hash.slice(1);

      if (!targetId) {
        return;
      }

      const target = document.getElementById(targetId);
      target?.scrollIntoView({ block: "start", inline: "nearest" });
    };

    const handleHashChange = () => {
      scrollToHashTarget();
      window.setTimeout(scrollToHashTarget, 360);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
