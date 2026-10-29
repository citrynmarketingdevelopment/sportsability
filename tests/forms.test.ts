import { afterEach, describe, expect, it, vi } from "vitest";
import { processSubmission, sendSmtp, type DeliveryDependencies } from "../src/lib/forms/delivery";
import { getFormConfiguration, type DeliveryConfiguration } from "../src/lib/forms/config";

const configuration: DeliveryConfiguration = {
  apiKey: "test-key-do-not-use",
  from: "website@sportability.example",
  to: ["citryn.contactforms@gmail.com", "sportabilityathletics@gmail.com"],
  channel: "test-channel",
};

function dependencies() {
  return {
    configuration: () => configuration,
    send: vi.fn().mockResolvedValue(true),
  } satisfies DeliveryDependencies;
}

function form(kind = "registration", changes: Record<string, string> = {}) {
  const data = new FormData();
  const values = {
    ...(kind === "registration" ? {
      program: "group-soccer",
      parentName: "Test Parent",
      athleteName: "Test Athlete",
      athleteAge: "8",
      gender: "",
      aboutAthlete: "Enjoys soccer and meeting teammates.",
      guardianConsent: "on",
      contactConsent: "on",
    } : { name: "Test Parent", message: "Please share the upcoming schedule." }),
    email: "parent@example.com",
    phone: "661-555-0123",
    submissionId: "213839f0-d9b8-4c69-ae40-71959b6b137e",
    website: "",
    ...changes,
  };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("form validation and delivery", () => {
  it("delivers an application to the configured inbox, with a validated reply-to and plain text", async () => {
    const deps = dependencies();
    const result = await processSubmission("registration", form(), 0, deps);
    expect(result.status).toBe("success");
    expect(result.message).toContain("Your application has been sent.");
    const [mail] = deps.send.mock.calls[0];
    expect(mail).toMatchObject({ to: configuration.to, from: configuration.from, replyTo: "parent@example.com" });
    expect(mail.text).toContain("6-Week Adaptive Soccer");
    expect(mail.text).toContain("Age in years: 8");
    expect(mail.html).toContain("email-logo.png");
    expect(result).not.toHaveProperty("values");
  });

  it("accepts the individual program and optional fields left blank", async () => {
    const deps = dependencies();
    const result = await processSubmission("registration", form("registration", { program: "individual-soccer", aboutAthlete: "" }), 0, deps);
    expect(result.status).toBe("success");
    expect(deps.send.mock.calls[0][0].text).toContain("1-on-1 Adaptive Soccer");
  });

  it("accepts contact without a phone, and never takes a recipient from the browser", async () => {
    const deps = dependencies();
    const result = await processSubmission("contact", form("contact", { phone: "", to: "untrusted@example.com" }), 0, deps);
    expect(result.status).toBe("success");
    expect(deps.send.mock.calls[0][0].to).toBe(configuration.to);
  });

  it.each([
    ["program", "basketball"], ["parentName", ""], ["email", "not-an-email"], ["phone", "123"],
    ["athleteName", ""], ["athleteAge", "8.5"], ["athleteAge", "-1"], ["guardianConsent", ""],
    ["contactConsent", ""], ["aboutAthlete", "x".repeat(2001)],
  ])("rejects invalid registration %s before any provider request", async (field, value) => {
    const deps = dependencies();
    const result = await processSubmission("registration", form("registration", { [field]: value }), 0, deps);
    expect(result.status).toBe("error");
    expect(result.errors[field]).toBeDefined();
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("rejects duplicate scalar fields and uploaded files", async () => {
    const deps = dependencies();
    const duplicated = form();
    duplicated.append("program", "individual-soccer");
    expect((await processSubmission("registration", duplicated, 0, deps)).status).toBe("error");
    const uploaded = form();
    uploaded.set("athleteName", new Blob(["test"]), "test.txt");
    expect((await processSubmission("registration", uploaded, 0, deps)).status).toBe("error");
    expect(deps.send).not.toHaveBeenCalled();
  });

  it.each([
    ["website", "spam.example"], ["submissionId", "bad-id"],
  ])("rejects invalid security field %s without delivery", async (field, value) => {
    const deps = dependencies();
    expect((await processSubmission("registration", form("registration", { [field]: value }), 0, deps)).status).toBe("error");
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("returns a truthful unavailable state when configuration is missing", async () => {
    const deps = { ...dependencies(), configuration: () => null };
    const result = await processSubmission("registration", form(), 0, deps);
    expect(result.status).toBe("error");
    expect(result.message).toContain("temporarily unavailable");
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("never reports success for provider failures or thrown network errors", async () => {
    const deps = dependencies();
    deps.send.mockRejectedValue(new Error("Provider error with sensitive information"));
    const result = await processSubmission("contact", form("contact"), 0, deps);
    expect(result.status).toBe("error");
    expect(result.message).not.toContain("sensitive information");
    expect(result.attempt).toBe(1);
  });
});

describe("SMTP delivery", () => {
 it.each([{status: "success", data: {msg_id: "123"}}, {status: "success", data: {message: "Accepted, msg_id: abc-123"}}])("accepts supported provider responses", async response => {
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(response)));
  vi.stubGlobal("fetch", fetcher);
  expect(await sendSmtp({from: configuration.from, to: configuration.to, replyTo: "parent@example.com", subject: "Test", text: "Hello", html: "<p>Hello</p>"}, "key", configuration)).toBe(true);
  const payload = JSON.parse(fetcher.mock.calls[0][1].body);
  expect(payload.recipients.to).toHaveLength(2);
  expect(payload.channel).toBe("test-channel");
 });
 it("rejects unaccepted responses", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({status: "success", data: {}}))));
  expect(await sendSmtp({from: configuration.from, to: configuration.to, replyTo: "parent@example.com", subject: "Test", text: "Hello", html: "Hello"}, "key", configuration)).toBe(false);
 });
 it("exposes availability without credentials", () => {
  vi.stubEnv("SMTP_API", "key"); vi.stubEnv("SMTP_CHANNEL", "channel");
  expect(getFormConfiguration()).toEqual({available:true});
  vi.stubEnv("SMTP_API", ""); expect(getFormConfiguration()).toEqual({available:false});
 });
 it("sends a separate thank-you without athlete details", async () => {
  const deps = dependencies();
  await processSubmission("registration", form(), 0, deps);
  expect(deps.send).toHaveBeenCalledTimes(2);
  expect(deps.send.mock.calls[1][0].to).toEqual(["parent@example.com"]);
  expect(deps.send.mock.calls[1][0].html).not.toContain("Test Athlete");
 });
 it("does not ask for resubmission when only acknowledgment fails", async () => {
  const deps = dependencies(); deps.send.mockResolvedValueOnce(true).mockRejectedValueOnce(new Error("failure"));
  const result = await processSubmission("contact", form("contact"), 0, deps);
  expect(result.status).toBe("success"); expect(result.message).toContain("couldn’t send your confirmation");
 });
 it("escapes submitted markup in team HTML", async () => {
  const deps = dependencies(); await processSubmission("contact", form("contact", {message:'<script>alert(1)</script>'}), 0, deps);
  expect(deps.send.mock.calls[0][0].html).toContain('&lt;script&gt;');
 });
});
