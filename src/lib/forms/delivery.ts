import { createHmac } from "node:crypto";
import { programs } from "@/lib/content";
import { getDeliveryConfiguration, type DeliveryConfiguration } from "./config";
import { contactSchema, registrationSchema, securitySchema, readFields, type ContactInput, type RegistrationInput } from "./schemas";
import type { FormKind, FormState } from "./types";
import { emailHtml } from "./templates";

type Mail = { from: string; to: string[]; replyTo: string; subject: string; text: string; html: string };
export type DeliveryDependencies = {
  configuration: () => DeliveryConfiguration | null;
  send: (mail: Mail, key: string, configuration: DeliveryConfiguration) => Promise<boolean>;
};
export async function sendSmtp(mail: Mail, _key: string, configuration: DeliveryConfiguration) {
  const response = await fetch("https://api.smtp.com/v4/messages", {
    method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", "X-SMTPCOM-API": configuration.apiKey },
    body: JSON.stringify({ channel: configuration.channel,
      recipients: { to: mail.to.map(address => ({ address })) },
      originator: { from: { name: "SportAbility Athletics", address: mail.from }, reply_to: { address: mail.replyTo } },
      subject: mail.subject, body: { parts: [
        { type: "text/plain", charset: "UTF-8", content: mail.text },
        { type: "text/html", charset: "UTF-8", content: mail.html },
      ] },
    }), signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result?.status === "success" && (typeof result.data?.msg_id === "string" && result.data.msg_id.trim().length > 0 ||
    typeof result.data?.message === "string" && /^accepted,\s*msg_id:\s*[a-zA-Z0-9][a-zA-Z0-9._-]*\s*$/i.test(result.data.message));
}
const defaultDependencies: DeliveryDependencies = { configuration: getDeliveryConfiguration, send: sendSmtp };

// Coalesce retries within a warm server instance; SMTP.com has no provider idempotency guarantee.
const deliveries = new Map<string, Promise<boolean>>();
async function sendOnce(mail: Mail, key: string, configuration: DeliveryConfiguration, dependencies: DeliveryDependencies) {
  if (dependencies !== defaultDependencies) return dependencies.send(mail, key, configuration);
  const existing = deliveries.get(key);
  if (existing) return existing;
  const delivery = dependencies.send(mail, key, configuration);
  deliveries.set(key, delivery);
  try { if (!(await delivery)) deliveries.delete(key); } catch { deliveries.delete(key); throw new Error("Delivery failed"); }
  setTimeout(() => deliveries.delete(key), 600_000).unref();
  return delivery;
}

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
  });
  if (!security.success) return error("We couldn’t verify this submission. Please refresh the page and try again.");

  try {
    const text = kind === "registration" ? registrationText(parsed.data as RegistrationInput) : contactText(parsed.data as ContactInput);
    const mail: Mail = {
      from: configuration.from,
      to: configuration.to,
      replyTo: parsed.data.email,
      subject: kind === "registration" ? "New SportAbility program application" : "New SportAbility website message",
      text,
      html: emailHtml(kind === "registration" ? "A new athlete application" : "A new hello", text, false),
    };
    const key = createHmac("sha256", configuration.apiKey)
      .update(JSON.stringify([kind, security.data.submissionId, mail])).digest("hex");
    const accepted = await sendOnce(mail, `sportability/${kind}/${key}`, configuration, dependencies);
    if (!accepted) return error("We couldn’t send your message. Your details are still here; please try again, or contact us by phone or email.");
    const thanks = kind === "registration"
      ? "Thank you for your application! We’re excited to learn more about your athlete. Our team will contact you to discuss goals, program availability, and next steps. Your application is not a confirmed enrollment, and no payment has been collected."
      : "Thank you for reaching out! Your message is with the SportAbility team. We’ll be in touch soon and look forward to helping your family find their next step.";
    let confirmationSent = false;
    try {
      confirmationSent = await sendOnce({ from: configuration.from, to: [parsed.data.email], replyTo: "sportabilityathletics@gmail.com",
        subject: "Thank you for connecting with SportAbility!", text: thanks + "\n\nSportAbility Athletics\n661-427-3747\nsportabilityathletics@gmail.com",
        html: emailHtml("A little hello. A big thank you.", thanks, true),
      }, `sportability/thanks/${key}`, configuration, dependencies);
    } catch { /* The team already has the submission. Never ask the visitor to resend it. */ }
    const confirmationNote = confirmationSent ? " A confirmation email is on its way." : " Your submission was received, but we couldn’t send your confirmation email.";
    return {
      status: "success",
      message: (kind === "registration"
        ? "Your application has been sent. The team will contact you about next steps."
        : "Your message has been sent. The team will be in touch.") + confirmationNote,
      errors: {},
      attempt: nextAttempt,
    };
  } catch {
    // Never log form payloads, provider errors, or tokens; providers can echo PII.
    return error("We couldn’t confirm delivery. Your details are still here; please try again, or contact us by phone or email.");
  }
}
