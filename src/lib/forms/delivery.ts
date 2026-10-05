import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { programs } from "@/lib/content";
import { getDeliveryConfiguration, type DeliveryConfiguration } from "./config";
import { contactSchema, registrationSchema, securitySchema, readFields, type ContactInput, type RegistrationInput } from "./schemas";
import type { FormKind, FormState } from "./types";

type Mail = { from: string; to: string; replyTo: string; subject: string; text: string };
export type DeliveryDependencies = {
  configuration: () => DeliveryConfiguration | null;
  verify: (token: string, kind: FormKind, configuration: DeliveryConfiguration) => Promise<boolean>;
  send: (mail: Mail, key: string, configuration: DeliveryConfiguration) => Promise<boolean>;
};

export async function verifyTurnstile(token: string, kind: FormKind, configuration: DeliveryConfiguration) {
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: configuration.secretKey, response: token }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") return false;
    const checked = result as Record<string, unknown>;
    return checked.success === true && checked.action === kind &&
      typeof checked.hostname === "string" && configuration.allowedHostnames.includes(checked.hostname.toLowerCase());
  } catch {
    return false;
  }
}

const defaultDependencies: DeliveryDependencies = {
  configuration: getDeliveryConfiguration,
  verify: verifyTurnstile,
  send: async (mail, idempotencyKey, configuration) => {
    const resend = new Resend(configuration.apiKey);
    const result = await resend.emails.send(mail, { idempotencyKey });
    return !result.error && Boolean(result.data?.id);
  },
};

function registrationText(data: RegistrationInput) {
  const selected = programs.find((program) => program.id === data.program);
  return [
    "SportAbility — parent and athlete application",
    "",
    `Program: ${selected?.name ?? data.program}`,
    `Parent / guardian: ${data.parentName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    "",
    `Athlete name: ${data.athleteName}`,
    `Age in years: ${data.athleteAge}`,
    `Gender (optional): ${data.gender || "Not provided"}`,
    "",
    "Interests, goals, and what helps the athlete feel comfortable:",
    data.aboutAthlete || "Not provided",
    "",
    "Applicant confirmed they are the parent or legal guardian and gave permission to be contacted.",
    "This is an application, not a confirmed enrollment or payment.",
  ].join("\n");
}

function contactText(data: ContactInput) {
  return [
    "SportAbility — website contact",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
}

export async function processSubmission(kind: FormKind, formData: FormData, attempt = 0, dependencies = defaultDependencies): Promise<FormState> {
  const nextAttempt = Number.isSafeInteger(attempt) && attempt >= 0 && attempt < 1_000_000 ? attempt + 1 : 1;
  const error = (message: string, errors: Record<string, string[]> = {}): FormState => ({ status: "error", message, errors, attempt: nextAttempt });
  const configuration = dependencies.configuration();
  if (!configuration) return error("Online forms are temporarily unavailable. Please email sportabilityathletics@gmail.com or call 661-427-3747.");

  const schema = kind === "registration" ? registrationSchema : contactSchema;
  const parsed = schema.safeParse(readFields(formData, Object.keys(schema.shape)));
  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fields[key] ??= []).push(issue.message);
    }
    return error("Please check the highlighted fields and try again.", fields);
  }

  const security = securitySchema.safeParse({
    ...readFields(formData, ["submissionId", "website"]),
    token: readFields(formData, ["cf-turnstile-response"])["cf-turnstile-response"],
  });
  if (!security.success) return error("We couldn’t verify this submission. Please complete the security check and try again.");

  try {
    if (!(await dependencies.verify(security.data.token, kind, configuration))) {
      return error("The security check expired or could not be verified. Please complete the new check and try again.");
    }
    const mail: Mail = {
      from: configuration.from,
      to: configuration.to,
      replyTo: parsed.data.email,
      subject: kind === "registration" ? "New SportAbility program application" : "New SportAbility website message",
      text: kind === "registration" ? registrationText(parsed.data as RegistrationInput) : contactText(parsed.data as ContactInput),
    };
    // Provider deduplication lasts 24 hours. The token is deliberately excluded:
    // a retry uses a fresh Turnstile token but the same delivery key and payload.
    // HMAC prevents the key from disclosing or permitting guesses of submitted PII.
    const key = createHmac("sha256", configuration.apiKey)
      .update(JSON.stringify([kind, security.data.submissionId, mail])).digest("hex");
    const accepted = await dependencies.send(mail, `sportability/${kind}/${key}`, configuration);
    if (!accepted) return error("We couldn’t send your message. Your details are still here; please try again, or contact us by phone or email.");
    return {
      status: "success",
      message: kind === "registration"
        ? "Your application has been sent. The team will contact you about next steps."
        : "Your message has been sent. The team will be in touch.",
      errors: {},
      attempt: nextAttempt,
    };
  } catch {
    // Never log form payloads, provider errors, or tokens; providers can echo PII.
    return error("We couldn’t confirm delivery. Your details are still here; please try again, or contact us by phone or email.");
  }
}
