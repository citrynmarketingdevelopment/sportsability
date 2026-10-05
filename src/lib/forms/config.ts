import { z } from "zod";
import type { FormConfiguration } from "./types";

export type DeliveryConfiguration = {
  apiKey: string;
  from: string;
  to: string;
  siteKey: string;
  secretKey: string;
  allowedHostnames: string[];
};

export function getDeliveryConfiguration(): DeliveryConfiguration | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.FORM_FROM_EMAIL?.trim();
  const to = process.env.FORM_TO_EMAIL?.trim() || "sportabilityathletics@gmail.com";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();
  const allowedHostnames = (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
    .split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  const validHostname = /^(?:localhost|[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?)$/;

  if (!apiKey || !from || !siteKey || !secretKey || !allowedHostnames.length ||
    !allowedHostnames.every((hostname) => validHostname.test(hostname)) ||
    !z.email().safeParse(from).success || !z.email().safeParse(to).success) return null;

  return { apiKey, from, to, siteKey, secretKey, allowedHostnames };
}

export function getFormConfiguration(): FormConfiguration {
  const configuration = getDeliveryConfiguration();
  return { available: Boolean(configuration), siteKey: configuration?.siteKey ?? "" };
}
