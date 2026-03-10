import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { buildMetadata } from "@/lib/metadata";

const policyCards = [
  {
    label: "Ordering",
    value: "Reserve first",
    note: "Choose the bag, then confirm the details by message.",
  },
  {
    label: "Delivery",
    value: "Pickup or arranged drop-off",
    note: "Final handoff is confirmed after the order is approved.",
  },
  {
    label: "Support",
    value: "Telegram and email",
    note: "Questions, stock checks, and visit planning are handled directly.",
  },
];

const policySections = [
  {
    eyebrow: "01 / Ordering",
    title: "How ordering works",
    points: [
      "The website shows the available styles and helps customers send an order request.",
      "Customers choose the item, color, size, and quantity, then send the request through Telegram or email.",
      "An order is confirmed only after the shop checks stock and confirms the final handoff.",
    ],
  },
  {
    eyebrow: "02 / Payment and holds",
    title: "Payment and short holds",
    points: [
      "Short same-day holds may be offered for in-stock items.",
      "Payment method and timing are confirmed directly with the customer.",
      "If payment is not completed within the agreed period, the item may return to stock.",
    ],
  },
  {
    eyebrow: "03 / Pickup and delivery",
    title: "Pickup, local drop-off, and handoff",
    points: [
      "Customers may arrange store pickup, local delivery, or another agreed handoff.",
      "Delivery timing, fees, and destination are confirmed after the reservation is accepted.",
      "The shop may request a reconfirmation before dispatch for limited items.",
    ],
  },
  {
    eyebrow: "04 / Returns and exchanges",
    title: "Returns and exchanges",
    points: [
      "Because some styles are stocked in limited quantities, returns and exchanges should be discussed directly with the shop.",
      "If there is a clear issue with the item received, contact the shop quickly with photos and order details.",
      "Unused items in original condition are the easiest cases to review for exchange support.",
    ],
  },
  {
    eyebrow: "05 / Photos and privacy",
    title: "Photos, color notes, and privacy",
    points: [
      "Colors may look different across screens, so customers may request extra live photos before confirming.",
      "Customer contact details are used only for questions, order confirmation, and handoff.",
      "Direct message conversations are treated as private order support.",
    ],
  },
];

export const metadata = buildMetadata({
  title: "Policies",
  description:
    "Ordering, payment, delivery, returns, and privacy guidance for Nay Chi Branded Collection.",
  pathname: "/policies",
});

export default function PoliciesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-20 lg:gap-24">
      <section className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
        <ScrollReveal className="space-y-6" soft>
          <SectionHeading
            eyebrow="Store policies"
            title="Simple rules, written to stay clear."
            description="The policy page keeps the important details short, readable, and easy to trust."
          />
        </ScrollReveal>

        <ScrollReveal direction="left">
          <div className="surface-panel rounded-[2.2rem] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {policyCards.map((card) => (
                <article key={card.label} className="signal-card rounded-[1.7rem] p-4">
                  <p className="signal-label">{card.label}</p>
                  <h2 className="mt-3 font-display text-[2rem] leading-[0.92] text-[var(--color-ink)]">
                    {card.value}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[rgba(32,24,20,0.64)]">{card.note}</p>
                </article>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="space-y-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {policySections.map((section, index) => (
            <ScrollReveal key={section.title} delayMs={index * 70} direction="scale">
              <article className="surface-panel rounded-[1.9rem] p-6 sm:p-7">
                <p className="eyebrow">{section.eyebrow}</p>
                <h2 className="mt-4 font-display text-[2.6rem] leading-[0.92] text-[var(--color-ink)]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {section.points.map((point) => (
                    <p key={point} className="body-copy text-base leading-8">
                      {point}
                    </p>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
