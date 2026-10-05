export type FormKind = "contact" | "registration";

export type FormState = {
  status: "idle" | "error" | "success";
  message: string;
  errors: Record<string, string[]>;
  attempt: number;
};

export const initialFormState: FormState = {
  status: "idle",
  message: "",
  errors: {},
  attempt: 0,
};

export type FormConfiguration = { available: boolean; siteKey: string };
