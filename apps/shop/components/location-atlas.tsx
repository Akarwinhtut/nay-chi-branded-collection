import Link from "next/link";

import { contactMethods, locationSignals, profile } from "@/lib/site-data";

type LocationAtlasAction = {
  label: string;
  href: string;
  style?: "cta" | "ghost";
  external?: boolean;
};

type LocationAtlasProps = {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  primaryAction?: LocationAtlasAction;
  secondaryAction?: LocationAtlasAction;
  compact?: boolean;
};

const primaryContact = contactMethods.find((contact) => contact.primary) ?? contactMethods[0];

function renderAction(action: LocationAtlasAction) {
  const className = action.style === "ghost" ? "ghost-button" : "cta-button";

  if (action.external) {
    return (
      <a href={action.href} className={className}>
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export function LocationAtlas({
  eyebrow,
  title,
  description,
  note,
  primaryAction,
  secondaryAction,
  compact = false,
}: LocationAtlasProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-display text-[3rem] leading-[0.92] text-[var(--color-ink)] sm:text-6xl">
            {title}
          </h2>
          <p className="body-copy max-w-2xl text-base leading-8 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {locationSignals.map((signal) => (
            <article key={signal.label} className="signal-card">
              <p className="signal-label">{signal.label}</p>
              <h3 className="mt-3 font-display text-[2rem] leading-[0.94] text-[var(--color-ink)] sm:text-[2.3rem]">
                {signal.value}
              </h3>
              <p className="field-note mt-3">{signal.note}</p>
            </article>
          ))}
        </div>

        {note ? <p className="field-note max-w-2xl">{note}</p> : null}

        {primaryAction || secondaryAction ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            {primaryAction ? renderAction(primaryAction) : null}
            {secondaryAction ? renderAction(secondaryAction) : null}
          </div>
        ) : null}
      </div>

      <div
        className={`atlas-panel ${compact ? "min-h-[29rem] sm:min-h-[32rem]" : "min-h-[34rem] sm:min-h-[39rem]"}`}
      >
        <div className="atlas-grid" />
        <div className="atlas-orb atlas-orb--left" />
        <div className="atlas-orb atlas-orb--right" />
        <div className="atlas-route atlas-route--one" />
        <div className="atlas-route atlas-route--two" />

        <div className="atlas-marker atlas-marker--base">
          <span className="atlas-marker__dot" />
          <span className="atlas-marker__label">Myanmar base</span>
        </div>

        <div className="atlas-marker atlas-marker--remote">
          <span className="atlas-marker__dot" />
          <span className="atlas-marker__label">Remote delivery</span>
        </div>

        <div className="atlas-card atlas-card--primary">
          <p className="eyebrow">Studio coordinates</p>
          <h3 className="mt-4 font-display text-[3.2rem] leading-[0.88] text-[var(--color-ink)] sm:text-[4.2rem]">
            {profile.location}
          </h3>
          <p className="field-note mt-4 max-w-sm">
            Direct feedback, cleaner handoff, and a workflow built for calm remote collaboration.
          </p>
        </div>

        <div className="atlas-card atlas-card--secondary">
          <p className="signal-label">Best first step</p>
          <h3 className="mt-3 text-lg text-[var(--color-ink)]">
            {primaryContact?.label}
          </h3>
          <p className="field-note mt-2">{primaryContact?.displayValue}</p>
        </div>

        <div className="atlas-card atlas-card--tertiary">
          <p className="signal-label">Working style</p>
          <p className="mt-3 text-sm leading-7 text-[rgba(239,232,218,0.82)] sm:text-base">
            Mood, structure, launch, and ongoing refinement in one direction instead of separate handoffs.
          </p>
        </div>

        <div className="atlas-card atlas-card--footer">
          {contactMethods.map((contact) => (
            <div key={contact.label} className="rounded-[1.1rem] border border-[rgba(255,246,230,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-3">
              <p className="signal-label">{contact.label}</p>
              <p className="mt-2 text-sm text-[var(--color-ink)]">{contact.displayValue}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
