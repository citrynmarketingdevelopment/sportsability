"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { contact } from "@/lib/content";
import type { FormState } from "@/lib/forms/types";
import styles from "./forms.module.css";

export function Field({ name, label, optional, hint, error, children }: {
  name: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string[];
  children: ReactNode;
}) {
  return <div className={styles.field}>
    <label htmlFor={name}>{label}{optional && <span className={styles.optional}> (optional)</span>}</label>
    {hint && <p id={`${name}-hint`} className={styles.hint}>{hint}</p>}
    {children}
    {error?.[0] && <p className={styles.fieldError} id={`${name}-error`}>{error[0]}</p>}
  </div>;
}

export function fieldA11y(name: string, state: FormState, hint = false) {
  const invalid = Boolean(state.errors[name]?.length);
  return {
    "aria-invalid": invalid || undefined,
    "aria-describedby": [hint ? `${name}-hint` : "", invalid ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined,
  } as const;
}

export function FormStatus({ state }: { state: FormState }) {
  const message = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.status !== "idle") message.current?.focus(); }, [state]);
  if (state.status === "idle") return null;
  return <div ref={message} tabIndex={-1} role={state.status === "error" ? "alert" : "status"} className={state.status === "success" ? styles.success : styles.errorSummary}>
    <strong>{state.status === "success" ? "Thank you for reaching out." : "Let’s try that again."}</strong>
    <p>{state.message}</p>
    {Object.keys(state.errors).length > 0 && <ul>{Object.entries(state.errors).map(([name, errors]) => <li key={name}><a href={`#${name}`}>{errors[0]}</a></li>)}</ul>}
    {state.status === "success" && <Link href="/programs" className="text-link">Back to programs →</Link>}
  </div>;
}

export function UnavailableNotice() {
  return <div className={styles.unavailable} role="status">
    <strong>Let’s connect directly.</strong>
    <p>Our online forms are temporarily unavailable. We’d love to help you get started by email or phone.</p>
    <a href={`mailto:${contact.email}`}>{contact.email}</a>
    <a href={contact.phoneHref}>{contact.phone}</a>
  </div>;
}

export function Honeypot() {
  return <div className={styles.honeypot} aria-hidden="true">
    <label htmlFor="website">Leave this field empty</label>
    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
  </div>;
}

export function PrivacyNote() {
  return <p className={styles.privacy}>Your information is sent privately to the SportAbility team so we can respond. Please leave medical records and sensitive details out of this form. <Link href="/privacy">How we use your information</Link>.</p>;
}
