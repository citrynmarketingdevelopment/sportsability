import { afterEach, describe, expect, it, vi } from "vitest";
import { processSubmission, verifyTurnstile, type DeliveryDependencies } from "../src/lib/forms/delivery";
import { getFormConfiguration, type DeliveryConfiguration } from "../src/lib/forms/config";

const configuration: DeliveryConfiguration = {
  apiKey: "test-key-do-not-use",
  from: "website@sportability.example",
  to: "sportabilityathletics@gmail.com",
  siteKey: "test-site-key",
  secretKey: "test-secret-key",
  allowedHostnames: ["sportability.example"],
};

function dependencies() {
  return {
    configuration: () => configuration,
    verify: vi.fn().mockResolvedValue(true),
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
    "cf-turnstile-response": "synthetic-test-token",
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
    expect(result.message).toBe("Your application has been sent. The team will contact you about next steps.");
    expect(deps.verify).toHaveBeenCalledWith("synthetic-test-token", "registration", configuration);
    const [mail] = deps.send.mock.calls[0];
    expect(mail).toMatchObject({ to: configuration.to, from: configuration.from, replyTo: "parent@example.com" });
    expect(mail.text).toContain("6-Week Adaptive Soccer");
    expect(mail.text).toContain("Age in years: 8");
    expect(mail).not.toHaveProperty("html");
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
    expect(deps.verify).not.toHaveBeenCalled();
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
    ["website", "spam.example"], ["cf-turnstile-response", ""], ["cf-turnstile-response", "x".repeat(2049)], ["submissionId", "bad-id"],
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

  it("requires a fresh security check after an expired or reused token", async () => {
    const deps = dependencies();
    deps.verify.mockResolvedValue(false);
    const result = await processSubmission("registration", form(), 3, deps);
    expect(result.status).toBe("error");
    expect(result.message).toContain("expired");
    expect(result.attempt).toBe(4);
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("deduplicates unchanged retries with fresh verification tokens, but permits changed submissions", async () => {
    const deps = dependencies();
    deps.send.mockResolvedValueOnce(false).mockResolvedValue(true);
    const failed = await processSubmission("registration", form(), 0, deps);
    expect(failed.status).toBe("error");
    const retried = await processSubmission("registration", form("registration", { "cf-turnstile-response": "refreshed-token" }), failed.attempt, deps);
    expect(retried.status).toBe("success");
    expect(deps.send.mock.calls[0][1]).toBe(deps.send.mock.calls[1][1]);
    expect(deps.send.mock.calls[0][0]).toEqual(deps.send.mock.calls[1][0]);
    expect(deps.send.mock.calls[0][1]).not.toContain("parent@example.com");
    await processSubmission("registration", form("registration", { aboutAthlete: "Updated goals" }), 2, deps);
    expect(deps.send.mock.calls[2][1]).not.toBe(deps.send.mock.calls[1][1]);
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

describe("Turnstile verification", () => {
  it.each([
    [{ success: true, hostname: "sportability.example", action: "registration" }, true],
    [{ success: false, "error-codes": ["timeout-or-duplicate"] }, false],
    [{ success: true, hostname: "other.example", action: "registration" }, false],
    [{ success: true, hostname: "sportability.example", action: "contact" }, false],
    [{ success: true }, false],
  ])("checks success, exact allowed hostname, and action", async (response, expected) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(response), { status: 200 })));
    expect(await verifyTurnstile("synthetic-test-token", "registration", configuration)).toBe(expected);
  });

  it("fails closed on network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Connection lost")));
    expect(await verifyTurnstile("synthetic-test-token", "contact", configuration)).toBe(false);
  });
});

describe("public form configuration", () => {
  it("requires all delivery settings and exposes only availability and the site key", () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("FORM_FROM_EMAIL", "website@sportability.example");
    vi.stubEnv("FORM_TO_EMAIL", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "sportability.example,www.sportability.example");
    expect(getFormConfiguration()).toEqual({ available: true, siteKey: "site-key" });
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect(getFormConfiguration()).toEqual({ available: false, siteKey: "" });
  });
});
