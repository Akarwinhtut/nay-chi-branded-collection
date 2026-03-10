"use client";

import { useEffect, useState } from "react";

import type { EditorialScene } from "@/lib/site-data";

type EditorialSequenceProps = {
  scenes: EditorialScene[];
};

export function EditorialSequence({ scenes }: EditorialSequenceProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-editorial-scene-index]"),
    );

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sceneIndex = Number(entry.target.getAttribute("data-editorial-scene-index"));

          if (!Number.isNaN(sceneIndex)) {
            setActiveIndex(sceneIndex);
          }
        });
      },
      {
        rootMargin: "-20% 0px -35% 0px",
        threshold: [0.35, 0.5, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2 lg:hidden">
        {scenes.map((scene, index) => {
          const active = index === activeIndex;

          return (
            <div
              key={scene.title}
              className={`story-chip rounded-full border px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.25,0.74,0.22,0.99)] ${
                active
                  ? "story-chip--active border-[rgba(22,45,36,0.16)] bg-[rgba(255,255,255,0.34)] text-[var(--color-ink)] shadow-[0_14px_34px_rgba(22,45,36,0.08)]"
                  : "border-[rgba(22,45,36,0.08)] bg-[rgba(255,255,255,0.18)] text-[rgba(22,45,36,0.62)]"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">0{index + 1}</p>
              <p className="mt-1 font-display text-[1.25rem] leading-none">{scene.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative hidden lg:block">
          <div className="sticky top-28 h-[72vh] overflow-hidden rounded-[2.4rem] border border-[rgba(22,45,36,0.12)] bg-[linear-gradient(180deg,#1b4732_0%,#162d24_100%)] shadow-[0_28px_80px_rgba(22,45,36,0.16)]">
            {scenes.map((scene, index) => (
              <div
                key={scene.title}
                className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.25,0.74,0.22,0.99)] ${
                  index === activeIndex ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${scene.image.src})`,
                    backgroundPosition: scene.image.position ?? "center center",
                  }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,45,36,0.08),rgba(22,45,36,0.48)_60%,rgba(22,45,36,0.82))]" />
              </div>
            ))}

            <div className="absolute left-6 top-6 z-10 grid gap-2 xl:left-8 xl:top-8">
              {scenes.map((scene, index) => {
                const active = index === activeIndex;

                return (
                  <div
                    key={scene.title}
                    className={`story-chip rounded-full border px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.25,0.74,0.22,0.99)] ${
                      active
                        ? "story-chip--active border-[rgba(224,209,182,0.28)] bg-[rgba(245,232,209,0.14)] shadow-[0_18px_40px_rgba(22,45,36,0.18)]"
                        : "border-[rgba(224,209,182,0.1)] bg-[rgba(245,232,209,0.06)]"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgba(224,209,182,0.62)]">
                      0{index + 1}
                    </p>
                    <p
                      className={`mt-1 font-display text-[1.2rem] leading-none transition-colors duration-500 ${
                        active ? "text-[var(--color-surface)]" : "text-[rgba(245,232,209,0.48)]"
                      }`}
                    >
                      {scene.title}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8">
              <div
                key={scenes[activeIndex]?.title}
                className="scene-caption max-w-[30rem] space-y-3"
              >
                <p className="eyebrow !text-[rgba(224,209,182,0.7)]">{scenes[activeIndex]?.eyebrow}</p>
                <h2 className="font-display text-[4.2rem] leading-[0.88] text-[var(--color-surface)]">
                  {scenes[activeIndex]?.title}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {scenes.map((scene, index) => (
            <article
              key={scene.title}
              data-editorial-scene-index={index}
              className={`flex min-h-[56vh] items-center py-8 first:pt-0 last:pb-0 transition-opacity duration-700 sm:min-h-[62vh] lg:min-h-[72vh] ${
                index === activeIndex ? "opacity-100" : "opacity-55"
              }`}
            >
              <div
                className={`story-scene w-full space-y-6 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.25,0.74,0.22,0.99)] ${
                  index === activeIndex
                    ? "story-scene--active translate-y-0 opacity-100"
                    : "translate-y-8 opacity-70"
                }`}
              >
                <div
                  className={`editorial-photo h-[20rem] lg:hidden ${
                    index === activeIndex ? "scale-100" : "scale-[0.98]"
                  }`}
                  style={{
                    backgroundImage: `url(${scene.image.src})`,
                    backgroundPosition: scene.image.position ?? "center center",
                  }}
                />

                <div className="space-y-4">
                  <p className="eyebrow">{scene.eyebrow}</p>
                  <h2 className="font-display text-[3.2rem] leading-[0.9] text-[var(--color-ink)] sm:text-[4.4rem] lg:text-[5rem]">
                    {scene.title}
                  </h2>
                  <p className="body-copy max-w-xl text-base leading-8 sm:text-lg">{scene.body}</p>
                </div>

                {scene.cta ? (
                  <a href={scene.cta.href} className="ghost-button">
                    {scene.cta.label}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
