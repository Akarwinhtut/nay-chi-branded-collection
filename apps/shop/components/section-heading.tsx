import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl space-y-4">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display text-[3rem] font-medium leading-[0.94] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[4.3rem]">
          {title}
        </h2>
        {description ? (
          <p className="body-copy body-copy--refined max-w-2xl text-base leading-8">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
