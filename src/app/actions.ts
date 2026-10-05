"use server";

import { processSubmission } from "@/lib/forms/delivery";
import type { FormState } from "@/lib/forms/types";

export async function submitRegistration(previousState: FormState, formData: FormData): Promise<FormState> {
  return processSubmission("registration", formData, previousState?.attempt);
}

export async function submitContact(previousState: FormState, formData: FormData): Promise<FormState> {
  return processSubmission("contact", formData, previousState?.attempt);
}
