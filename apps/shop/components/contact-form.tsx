"use client";

import { useState, useTransition } from "react";

type FormState = {
  name: string;
  businessName: string;
  businessType: string;
  projectGoal: string;
  preferredContact: "Telegram" | "Email";
  contactValue: string;
};

type ApiResponse = {
  message?: string;
  error?: string;
};

const initialState: FormState = {
  name: "",
  businessName: "",
  businessType: "",
  projectGoal: "",
  preferredContact: "Telegram",
  contactValue: "",
};

const fieldWrapperClass = "space-y-2";
const fieldControlClass = "field-control";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Tell me the business, the pages, and the feeling you want.",
  );
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage("Sending your inquiry...");

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        });

        const payload = (await response.json().catch(() => null)) as
          | ApiResponse
          | null;

        if (!response.ok) {
          setStatus("error");
          setMessage(
            payload?.error ??
              "The inquiry could not be sent right now. Telegram or email still work directly.",
          );
          return;
        }

        setStatus("success");
        setMessage(
          payload?.message ??
            "Your inquiry is in. I will follow up through your preferred contact method.",
        );
        setFormState(initialState);
      } catch {
        setStatus("error");
        setMessage(
          "The inquiry could not be sent right now. Use Telegram or email while the form is unavailable.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="surface-panel rounded-[2rem] p-6 sm:p-8 lg:p-10">
      <div className="max-w-2xl space-y-4">
        <p className="eyebrow">Project brief</p>
        <h2 className="font-display text-[3rem] leading-[0.92] text-[var(--color-ink)] sm:text-[4rem]">
          Tell me the basics.
        </h2>
        <p className="body-copy text-sm leading-7 sm:text-base">
          Short is fine. The first message only needs enough to set the direction.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className={fieldWrapperClass}>
          <span className="field-label">Your name</span>
          <input
            required
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={fieldControlClass}
            placeholder="Jane Doe"
          />
        </label>

        <label className={fieldWrapperClass}>
          <span className="field-label">Business name</span>
          <input
            required
            value={formState.businessName}
            onChange={(event) => updateField("businessName", event.target.value)}
            className={fieldControlClass}
            placeholder="Riverfront"
          />
        </label>

        <label className={fieldWrapperClass}>
          <span className="field-label">Business type</span>
          <input
            required
            value={formState.businessType}
            onChange={(event) => updateField("businessType", event.target.value)}
            className={fieldControlClass}
            placeholder="Cafe, hotel, studio..."
          />
        </label>

        <label className={fieldWrapperClass}>
          <span className="field-label">Preferred contact</span>
          <select
            value={formState.preferredContact}
            onChange={(event) =>
              updateField(
                "preferredContact",
                event.target.value as FormState["preferredContact"],
              )
            }
            className={fieldControlClass}
          >
            <option value="Telegram">Telegram</option>
            <option value="Email">Email</option>
          </select>
        </label>
      </div>

      <label className="mt-5 block space-y-2">
        <span className="field-label">Telegram handle or email</span>
        <input
          required
          value={formState.contactValue}
          onChange={(event) => updateField("contactValue", event.target.value)}
          className={fieldControlClass}
          placeholder="@yourhandle or you@example.com"
        />
      </label>

      <label className="mt-5 block space-y-2">
        <span className="field-label">Project goal</span>
        <textarea
          required
          rows={7}
          value={formState.projectGoal}
          onChange={(event) => updateField("projectGoal", event.target.value)}
          className={`${fieldControlClass} min-h-44 resize-none`}
          placeholder="What kind of business is it, what pages do you need, and what feeling should the site create?"
        />
      </label>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="cta-button disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Sending..." : "Send inquiry"}
        </button>

        <p
          aria-live="polite"
          className={`max-w-md text-sm leading-6 ${
            status === "error"
              ? "text-[var(--color-accent-strong)]"
              : "text-[rgba(22,45,36,0.62)]"
          }`}
        >
          {message}
        </p>
      </div>
    </form>
  );
}
