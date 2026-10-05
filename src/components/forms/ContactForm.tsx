"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { submitContact } from "@/app/actions";
import { initialFormState, type FormConfiguration, type FormState } from "@/lib/forms/types";
import { Field, fieldA11y, FormStatus, Honeypot, PrivacyNote, UnavailableNotice } from "./shared";
import { Turnstile } from "./Turnstile";
import styles from "./forms.module.css";

export function ContactForm({ configuration, submissionId }: { configuration: FormConfiguration; submissionId: string }) {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [state, action, pending] = useActionState(async (previous: FormState, data: FormData): Promise<FormState> => {
    try { return await submitContact(previous, data); }
    catch { return { status: "error", message: "We couldn’t confirm delivery. Please check your connection and try again. Your details are still here.", errors: {}, attempt: previous.attempt + 1 }; }
  }, initialFormState);
  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  return <form className={styles.form} action={action} aria-busy={pending}>
    <FormStatus state={state} />
    {!configuration.available && <UnavailableNotice />}
    {state.status !== "success" && <>
      <h2 className={styles.formTitle}>Send a little hello.</h2>
      <p className={styles.requiredNote}>All fields are required unless marked optional.</p>
      <input type="hidden" name="submissionId" value={submissionId} />
      <Honeypot />
      <fieldset className={styles.contactFields} disabled={pending || !configuration.available}>
        <legend className={styles.srOnly}>Your contact details and message</legend>
        <Field name="name" label="Your full name" error={state.errors.name}><input id="name" name="name" autoComplete="name" maxLength={100} value={values.name} onChange={update} required {...fieldA11y("name", state)} /></Field>
        <div className={styles.row}>
          <Field name="email" label="Email address" error={state.errors.email}><input id="email" name="email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={update} required {...fieldA11y("email", state)} /></Field>
          <Field name="phone" label="Phone number" optional error={state.errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} value={values.phone} onChange={update} {...fieldA11y("phone", state)} /></Field>
        </div>
        <Field name="message" label="How can we help?" error={state.errors.message}><textarea id="message" name="message" rows={5} maxLength={3000} value={values.message} onChange={update} required {...fieldA11y("message", state)} /></Field>
      </fieldset>
      <PrivacyNote />
      {configuration.available && <Turnstile key={state.attempt} siteKey={configuration.siteKey} action="contact" />}
      <button type="submit" className={`button ${styles.submit}`} disabled={pending || !configuration.available}>{pending ? "Sending your message…" : "Send Message"}<span aria-hidden="true">↗</span></button>
    </>}
  </form>;
}
