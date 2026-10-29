import { z } from "zod";
import type { FormConfiguration } from "./types";

export type DeliveryConfiguration = { apiKey: string; channel: string; from: string; to: string[] };
export function getDeliveryConfiguration(): DeliveryConfiguration | null {
  const apiKey = process.env.SMTP_API?.trim();
  const channel = process.env.SMTP_CHANNEL?.trim();
  const from = process.env.FORM_FROM_EMAIL?.trim() || "contactforms@citryn.com";
  if (!apiKey || !channel || !z.email().safeParse(from).success) return null;
  return { apiKey, channel, from, to: ["citryn.contactforms@gmail.com", "sportabilityathletics@gmail.com"] };
}
export function getFormConfiguration(): FormConfiguration {
  return { available: Boolean(getDeliveryConfiguration()) };
}
