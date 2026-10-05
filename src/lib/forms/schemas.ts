import { z } from "zod";
import { programs } from "@/lib/content";

const name = z.string().trim().min(1, "Please enter a name.").max(100, "Please use 100 characters or fewer.");
const email = z.string().trim().max(254).email("Please enter a valid email address.");
const phone = z.string().trim().max(30, "Please check your phone number.").refine(
  (value) => /^[+()\d\s.-]+$/.test(value) && value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15,
  "Please enter a valid phone number.",
);
const optionalPhone = z.union([z.literal(""), phone]);

export const contactSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  message: z.string().trim().min(1, "Please add a message.").max(3000, "Please use 3,000 characters or fewer."),
});

export const registrationSchema = z.object({
  program: z.string().refine((value) => programs.some((program) => program.id === value), "Please choose an available program."),
  parentName: name,
  email,
  phone,
  athleteName: name,
  athleteAge: z.string().trim().regex(/^\d{1,2}$/, "Please enter an age in whole years."),
  gender: z.string().trim().max(60, "Please use 60 characters or fewer."),
  aboutAthlete: z.string().trim().max(2000, "Please use 2,000 characters or fewer."),
  guardianConsent: z.literal("on", { error: "Please confirm that you are the athlete’s parent or legal guardian." }),
  contactConsent: z.literal("on", { error: "Please give permission for the team to contact you." }),
});

export const securitySchema = z.object({
  submissionId: z.uuid(),
  token: z.string().min(1).max(2048),
  website: z.literal(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;

export function readFields(formData: FormData, fields: readonly string[]) {
  return Object.fromEntries(fields.map((field) => {
    const value = formData.get(field);
    // Files and duplicated fields are never accepted as scalar form inputs.
    return [field, formData.getAll(field).length > 1 || (value !== null && typeof value !== "string") ? null : value ?? ""];
  }));
}
