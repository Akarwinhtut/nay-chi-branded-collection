import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  adminSessionCookieName,
  hasAdminAuthConfig,
  isAdminSessionValid,
  sanitizeNextPath,
} from "@/lib/admin-auth";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Admin Login",
    description: "Owner login for Nay Chi Branded Collection catalog management.",
    pathname: "/admin/login",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    logout?: string;
    next?: string;
  }>;
};

function getLoginMessage(params: {
  error?: string;
  logout?: string;
}) {
  if (params.error === "invalid") {
    return {
      tone: "error" as const,
      text: "The password was incorrect. Try again.",
    };
  }

  if (params.error === "config") {
    return {
      tone: "error" as const,
      text: "Admin login is not configured yet. Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET first.",
    };
  }

  if (params.logout === "1") {
    return {
      tone: "idle" as const,
      text: "You have been signed out.",
    };
  }

  return {
    tone: "idle" as const,
    text: "Enter the owner password to manage the live catalog.",
  };
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const cookieStore = await cookies();

  if (isAdminSessionValid(cookieStore.get(adminSessionCookieName)?.value)) {
    redirect(nextPath);
  }

  const loginReady = hasAdminAuthConfig();
  const message = getLoginMessage(params);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 lg:gap-16">
      <section className="space-y-6">
        <ScrollReveal soft>
          <SectionHeading
            eyebrow="Owner login"
            title="Protected catalog access for launch."
            description="Customers should never see the catalog editor. Use this page to sign in and manage the live bag inventory."
          />
        </ScrollReveal>
      </section>

      <ScrollReveal direction="scale">
        <div className="surface-panel rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="space-y-5">
              <p className="eyebrow">Access rules</p>
              <h2 className="font-display text-[3rem] leading-[0.92] text-[var(--color-ink)] sm:text-[4rem]">
                One login for the owner side of the shop.
              </h2>
              <p className="body-copy text-sm leading-7 sm:text-base">
                After you sign in, you can add bags, update MMK prices, edit stock, and publish or
                hide products from the storefront.
              </p>
              <div
                className={`rounded-[1.7rem] border px-5 py-4 text-sm leading-7 ${
                  message.tone === "error"
                    ? "border-[rgba(165,124,89,0.26)] bg-[rgba(165,124,89,0.08)] text-[rgba(36,24,18,0.84)]"
                    : "border-[rgba(36,24,18,0.08)] bg-[rgba(255,255,255,0.28)] text-[rgba(36,24,18,0.72)]"
                }`}
              >
                {message.text}
              </div>
            </div>

            <form action="/api/admin/login" method="post" className="space-y-5">
              <input type="hidden" name="next" value={nextPath} />

              <label className="space-y-2">
                <span className="field-label">Owner password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="field-control"
                  placeholder="Enter the admin password"
                  disabled={!loginReady}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={!loginReady}
                className="cta-button disabled:cursor-not-allowed disabled:opacity-70"
              >
                Sign in
              </button>

              <Link href="/" className="ghost-button inline-flex">
                Back to storefront
              </Link>
            </form>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
