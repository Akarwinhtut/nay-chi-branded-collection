import type { ReactNode } from "react";

type PageIntroStat = {
  label: string;
  value: string;
};

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  detail?: string;
  action?: ReactNode;
  stats?: PageIntroStat[];
  className?: string;
  centered?: boolean;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  detail,
  action,
  stats,
  className,
  centered = false,
}: PageIntroProps) {
  return (
    <section
      className={[
        "grid gap-8 lg:grid-cols-[0.32fr_0.68fr]",
        centered ? "lg:items-center" : "lg:items-start",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-5 lg:pt-4">
        <p className="eyebrow">{eyebrow}</p>
        {detail ? (
          <p className="max-w-xs text-sm leading-7 text-[rgba(29,29,31,0.58)]">{detail}</p>
        ) : null}

        {stats?.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="border-t border-[var(--color-line)] pt-3 first:border-t-0 first:pt-0"
              >
                <p className="signal-label">{stat.label}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{stat.value}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        <h1 className="font-display text-[4rem] font-medium leading-[0.88] tracking-[-0.045em] text-[var(--color-ink)] sm:text-[5.6rem] lg:text-[6.8rem]">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[rgba(29,29,31,0.64)] sm:text-lg">
          {description}
        </p>
        {action ? <div className="flex flex-wrap items-center gap-4">{action}</div> : null}
      </div>
    </section>
  );
}
