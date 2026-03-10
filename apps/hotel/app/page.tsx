import { ScrollReveal } from "@/components/scroll-reveal";
import { buildMetadata } from "@/lib/metadata";

import styles from "./hotel.module.css";

const hotelMetrics = [
  { value: "12", label: "Family-ready suites" },
  { value: "24/7", label: "Concierge and dining" },
  { value: "15 min", label: "Airport pickup window" },
];

const stayChoices = [
  {
    name: "City Night",
    detail: "A polished short stay for late arrivals, quick meetings, and one calm evening in the city.",
    rate: "From $240",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Family Calm",
    detail: "Connected rooms, softer lighting, and enough floor space for both kids and grandparents to settle in easily.",
    rate: "From $320",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Longer Stay",
    detail: "Extra lounge seating, workspace comfort, and slower room service for guests who want more time indoors.",
    rate: "From $420",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
  },
];

const comfortFeatures = [
  {
    title: "Large-text booking path",
    body: "Short labels, clear contrast, and a booking summary that stays readable for older guests and first-time travelers.",
  },
  {
    title: "Family and elder comfort",
    body: "Lift access, calmer corridors, kid-friendly room setups, and staff support that does not depend on apps alone.",
  },
  {
    title: "Premium without friction",
    body: "Valet, airport pickup, and concierge support are offered as simple choices instead of complicated booking extras.",
  },
];

const experiences = [
  {
    eyebrow: "Wellness deck",
    title: "Pool, quiet lounge, and recovery spaces that feel premium without feeling formal.",
    body: "Guests can move between water, steam, and light dining without the usual resort-size confusion. The spaces are compact, elegant, and easy to understand.",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "Lobby dining",
    title: "A dining room for business guests, families, and late arrivals in the same evening.",
    body: "The lobby restaurant is designed to work for coffee meetings, dinner with children, and slower late-night meals with equal ease.",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
  },
];

const arrivalFlow = [
  {
    title: "Choose the stay style",
    body: "Short city stay, family room, or a longer premium suite. The categories stay clear from the start.",
  },
  {
    title: "Confirm only the essentials",
    body: "Dates, guest count, and airport pickup if needed. No overbuilt booking form.",
  },
  {
    title: "Arrive with less friction",
    body: "Staff guide the check-in, room access, and support requests in a way that works for every age group.",
  },
];

export const metadata = buildMetadata({
  title: "Astra Meridian Hotel",
  description:
    "A premium hotel concept with calmer booking, clearer navigation, and more comfortable stays for families, elders, and business travelers.",
  pathname: "/",
});

export default function HotelPage() {
  return (
    <div className={styles.shell}>
      <div className={`${styles.orb} ${styles.orbOne}`} />
      <div className={`${styles.orb} ${styles.orbTwo}`} />
      <div className={`${styles.orb} ${styles.orbThree}`} />

      <div className={styles.page}>
        <header className={styles.topbar}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
            <a href="#top" className={styles.brand}>
              <span className={styles.brandMark}>Luxury hotel concept</span>
              <span className={styles.brandName}>Astra Meridian</span>
            </a>

            <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.16em] md:flex">
              <a href="#stay" className={styles.navLink}>
                Stay types
              </a>
              <a href="#comfort" className={styles.navLink}>
                Comfort
              </a>
              <a href="#experience" className={styles.navLink}>
                Experience
              </a>
            </nav>

            <div className="hidden sm:block">
              <a href="#booking" className={styles.primaryButton}>
                Reserve now
              </a>
            </div>
          </div>
        </header>

        <main
          id="top"
          className="mx-auto flex max-w-7xl flex-col gap-24 px-5 pb-16 pt-8 sm:px-8 lg:gap-32 lg:pt-10"
        >
          <section className="grid gap-12 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <ScrollReveal className="space-y-9" soft>
              <div className="space-y-6">
                <p className={styles.eyebrow}>Luxury hotel landing page</p>
                <h1 className={styles.headline}>A premium stay that feels easy from the first click.</h1>
                <p className={`${styles.lead} text-base leading-8 sm:text-lg`}>
                  Designed for business travelers, families, kids, and elders who want a luxury
                  hotel without a confusing booking experience.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#booking" className={styles.primaryButton}>
                  Book a stay
                </a>
                <a href="#stay" className={styles.ghostButton}>
                  Explore stay types
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {hotelMetrics.map((metric) => (
                  <div key={metric.label} className={styles.metricCard}>
                    <p className={styles.metricValue}>{metric.value}</p>
                    <p className={styles.metricLabel}>{metric.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div className={styles.heroVisual}>
                <div className={styles.heroFrame}>
                  <div className={`${styles.floatingTag} ${styles.floatOne}`}>Airport pickup</div>
                  <div className={`${styles.floatingTag} ${styles.floatTwo}`}>
                    Family and elder comfort
                  </div>

                  <div className={styles.heroCaption}>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,248,240,0.74)]">
                      Signature mood
                    </p>
                    <h2 className="mt-4 max-w-[12ch] font-display text-[2.8rem] leading-[0.9] text-white sm:text-[3.8rem]">
                      Luxury should feel calm before check-in.
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[rgba(255,248,240,0.76)]">
                      Quiet rooms, warmer lighting, intuitive service, and a website that does not
                      force guests through unnecessary steps.
                    </p>
                  </div>
                </div>

                <div
                  id="booking"
                  className={`${styles.glassPanel} ${styles.bookingCard} rounded-[1.85rem] p-6 sm:p-7`}
                >
                  <p className={styles.eyebrow}>Booking preview</p>
                  <h2 className="mt-4 font-display text-[2.3rem] leading-[0.94] text-[var(--color-foreground)]">
                    Short, readable, and ready for every guest.
                  </h2>
                  <div className="mt-6 space-y-1">
                    <div className={styles.bookingLine}>
                      <span className={styles.bookingLabel}>Arrival</span>
                      <span className={styles.bookingValue}>Friday, 17 October</span>
                    </div>
                    <div className={styles.bookingLine}>
                      <span className={styles.bookingLabel}>Departure</span>
                      <span className={styles.bookingValue}>Sunday, 19 October</span>
                    </div>
                    <div className={styles.bookingLine}>
                      <span className={styles.bookingLabel}>Stay style</span>
                      <span className={styles.bookingValue}>Family Calm</span>
                    </div>
                    <div className={styles.bookingLine}>
                      <span className={styles.bookingLabel}>Support</span>
                      <span className={styles.bookingValue}>Airport pickup + late dining</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a href="mailto:stay@astrameridian.com" className={styles.primaryButton}>
                      Confirm inquiry
                    </a>
                    <a href="#comfort" className={styles.ghostButton}>
                      Why it feels easier
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </section>

          <section id="stay" className="space-y-10">
            <ScrollReveal soft>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Stay types</p>
                <h2 className={styles.sectionTitle}>Choose the stay that matches the guest, not just the room.</h2>
                <p className={`${styles.sectionBody} text-base leading-8`}>
                  The room categories are written in plain language so guests can understand them
                  quickly on desktop or mobile.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid gap-5 lg:grid-cols-3">
              {stayChoices.map((suite, index) => (
                <ScrollReveal key={suite.name} delayMs={index * 90} direction="scale">
                  <article className={styles.roomCard}>
                    <div
                      className={styles.roomImage}
                      style={{ backgroundImage: `url(${suite.image})` }}
                    />
                    <div className="space-y-4 p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-display text-[2rem] leading-[0.94] text-[var(--color-foreground)]">
                          {suite.name}
                        </h3>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(101,64,34,0.72)]">
                          {suite.rate}
                        </p>
                      </div>
                      <p className="text-sm leading-7 text-[rgba(27,22,19,0.72)]">
                        {suite.detail}
                      </p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <section id="comfort" className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
            <ScrollReveal className="space-y-5" soft>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Comfort and clarity</p>
                <h2 className={styles.sectionTitle}>Luxury for kids, parents, and older guests too.</h2>
                <p className={`${styles.sectionBody} text-base leading-8`}>
                  The design language stays elegant, but the booking flow and stay features stay
                  easy to understand for every age group.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid gap-4">
              {comfortFeatures.map((feature, index) => (
                <ScrollReveal key={feature.title} delayMs={index * 90} direction="scale">
                  <article className={styles.comfortCard}>
                    <p className={styles.processIndex}>Comfort 0{index + 1}</p>
                    <h3 className="mt-4 font-display text-[2rem] leading-[0.94] text-[var(--color-foreground)]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[rgba(27,22,19,0.72)] sm:text-base">
                      {feature.body}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <section id="arrival" className="space-y-10">
            <ScrollReveal soft>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Arrival flow</p>
                <h2 className={styles.sectionTitle}>From booking to room access in three steps.</h2>
                <p className={`${styles.sectionBody} text-base leading-8`}>
                  The hotel experience is framed like a high-end product flow: clear categories,
                  fewer decisions, and less uncertainty.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid gap-4 lg:grid-cols-3">
              {arrivalFlow.map((step, index) => (
                <ScrollReveal key={step.title} delayMs={index * 90} direction="scale">
                  <article className={styles.processCard}>
                    <p className={styles.processIndex}>0{index + 1}</p>
                    <h3 className="mt-4 font-display text-[2rem] leading-[0.94] text-[var(--color-foreground)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[rgba(27,22,19,0.72)] sm:text-base">
                      {step.body}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <section id="experience" className="space-y-10">
            <ScrollReveal soft>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Experience</p>
                <h2 className={styles.sectionTitle}>A few spaces that earn their place in the stay.</h2>
                <p className={`${styles.sectionBody} text-base leading-8`}>
                  Premium hospitality should feel intentional, not overloaded. These spaces keep the
                  hotel memorable without becoming hard to navigate.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid gap-5 lg:grid-cols-2">
              {experiences.map((experience, index) => (
                <ScrollReveal
                  key={experience.title}
                  delayMs={index * 100}
                  direction={index % 2 === 0 ? "right" : "left"}
                >
                  <article
                    className={styles.experienceCard}
                    style={{
                      background: `url(${experience.image}) center center / cover`,
                    }}
                  >
                    <div className={styles.experienceOverlay} />
                    <div className="relative z-[1] flex h-full items-end p-6 sm:p-8">
                      <div className="max-w-xl">
                        <p className={styles.eyebrow}>{experience.eyebrow}</p>
                        <h3 className="mt-4 max-w-[14ch] font-display text-[2.7rem] leading-[0.9] text-white sm:text-[3.7rem]">
                          {experience.title}
                        </h3>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-[rgba(255,248,240,0.78)] sm:text-base">
                          {experience.body}
                        </p>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <ScrollReveal direction="scale">
            <section className={`${styles.ctaPanel} p-8 sm:p-10 lg:p-12`}>
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-3xl">
                  <p className={styles.eyebrow}>Final call</p>
                  <h2 className="mt-4 font-display text-[3rem] leading-[0.9] text-white sm:text-[4.8rem]">
                    Book the stay that feels luxurious and easy at the same time.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-8 text-[rgba(255,248,240,0.78)]">
                    This redesign sells premium hospitality with calmer language, larger targets,
                    and a booking flow that works better for families and older travelers.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a href="mailto:stay@astrameridian.com" className={styles.primaryButton}>
                    Start reservation
                  </a>
                  <a href="#top" className={styles.ghostButton}>
                    Back to top
                  </a>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </main>
      </div>
    </div>
  );
}
