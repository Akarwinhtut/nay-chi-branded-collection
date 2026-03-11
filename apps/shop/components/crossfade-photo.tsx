"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type CrossfadePhotoProps = {
  src?: string;
  alt?: string;
  position?: string;
  className?: string;
  children?: ReactNode;
  durationMs?: number;
};

export function CrossfadePhoto({
  src,
  alt,
  position = "center center",
  className = "",
  children,
  durationMs = 240,
}: CrossfadePhotoProps) {
  const currentRef = useRef<HTMLDivElement | null>(null);
  const previousRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const lastPhotoRef = useRef({ src, position });

  useEffect(() => {
    const currentNode = currentRef.current;
    const previousNode = previousRef.current;

    if (!currentNode || !previousNode) {
      return;
    }

    const previousPhoto = lastPhotoRef.current;
    const nextPhoto = { src, position };

    currentNode.style.backgroundImage = src ? `url(${src})` : "";
    currentNode.style.backgroundPosition = position;

    if (
      previousPhoto.src === nextPhoto.src &&
      previousPhoto.position === nextPhoto.position
    ) {
      currentNode.dataset.visible = "true";
      previousNode.dataset.visible = "false";
      lastPhotoRef.current = nextPhoto;
      return;
    }

    previousNode.style.backgroundImage = previousPhoto.src
      ? `url(${previousPhoto.src})`
      : "";
    previousNode.style.backgroundPosition = previousPhoto.position;
    previousNode.dataset.visible = "true";
    currentNode.dataset.visible = "false";

    const frameId = window.requestAnimationFrame(() => {
      currentNode.dataset.visible = "true";
      previousNode.dataset.visible = "false";
    });

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      previousNode.style.backgroundImage = "";
      timeoutRef.current = null;
    }, durationMs);

    lastPhotoRef.current = nextPhoto;

    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, position, src]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`crossfade-photo ${className}`}
      role={alt ? "img" : undefined}
      aria-label={alt}
    >
      <div
        ref={previousRef}
        data-visible="false"
        aria-hidden="true"
        className="crossfade-photo__layer crossfade-photo__layer--previous"
        style={{ transitionDuration: `${durationMs}ms` }}
      />
      <div
        ref={currentRef}
        data-visible="true"
        className="crossfade-photo__layer"
        style={{
          backgroundImage: src ? `url(${src})` : undefined,
          backgroundPosition: position,
          transitionDuration: `${durationMs}ms`,
        }}
      />
      {children ? <div className="crossfade-photo__content">{children}</div> : null}
    </div>
  );
}
