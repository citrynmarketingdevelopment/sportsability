"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { submitRegistration } from "@/app/actions";
import { programs } from "@/lib/content";
import { initialFormState, type FormConfiguration, type FormState } from "@/lib/forms/types";
import { Field, fieldA11y, FormStatus, Honeypot, PrivacyNote, UnavailableNotice } from "./shared";
import { Turnstile } from "./Turnstile";
import styles from "./forms.module.css";

export function RegistrationForm({ configuration, initialProgram, submissionId }: {
  configuration: FormConfiguration;
  initialProgram: string;
  submissionId: string;
}) {
  const [values, setValues] = useState({
    program: initialProgram, parentName: "", email: "", phone: "", athleteName: "", athleteAge: "", gender: "", aboutAthlete: "",
  });
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [contactConsent, setContactConsent] = useState(false);
  const [state, action, pending] = useActionState(async (previous: FormState, data: FormData): Promise<FormState> => {
    try { return await submitRegistration(previous, data); }
    catch { return { status: "error", message: "We couldn’t confirm delivery. Please check your connection and try again. Your details are still here.", errors: {}, attempt: previous.attempt + 1 }; }
  }, initialFormState);
  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  return <form className={styles.form} action={action} aria-busy={pending}>
    <FormStatus state={state} />
    {!configuration.available && <UnavailableNotice />}
    {state.status !== "success" && <>
      <p className={styles.requiredNote}>One application per athlete. All fields are required unless marked optional.</p>
      <input type="hidden" name="submissionId" value={submissionId} />
      <Honeypot />
      <fieldset className={styles.fieldset} disabled={pending || !configuration.available}>
        <legend><span>01</span> Choose your program</legend>
        <div className={styles.programOptions}>
          {programs.map((program) => <label key={program.id} className={`${styles.programOption} ${values.program === program.id ? styles.selected : ""}`}>
            <input id={program.id === programs[0].id ? "program" : `program-${program.id}`} type="radio" name="program" value={program.id} checked={values.program === program.id} onChange={update} required {...fieldA11y("program", state)} />
            <span><strong>{program.name}</strong><small>${program.price} · Soccer</small></span>
          </label>)}
        </div>
        {state.errors.program && <p id="program-error" className={styles.fieldError}>{state.errors.program[0]}</p>}
        <p className={styles.hint}>Enrollment fee: $25. Contact us to confirm the total.</p>
      </fieldset>
      <fieldset className={styles.fieldset} disabled={pending || !configuration.available}>
        <legend><span>02</span> Parent or guardian</legend>
        <Field name="parentName" label="Your full name" error={state.errors.parentName}>
          <input id="parentName" name="parentName" autoComplete="name" maxLength={100} value={values.parentName} onChange={update} required {...fieldA11y("parentName", state)} />
        </Field>
        <div className={styles.row}>
          <Field name="email" label="Email address" error={state.errors.email}><input id="email" name="email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={update} required {...fieldA11y("email", state)} /></Field>
          <Field name="phone" label="Phone number" error={state.errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} value={values.phone} onChange={update} required {...fieldA11y("phone", state)} /></Field>
        </div>
      </fieldset>
      <fieldset className={styles.fieldset} disabled={pending || !configuration.available}>
        <legend><span>03</span> Meet your athlete</legend>
        <Field name="athleteName" label="Athlete’s full name" error={state.errors.athleteName}><input id="athleteName" name="athleteName" autoComplete="section-athlete name" maxLength={100} value={values.athleteName} onChange={update} required {...fieldA11y("athleteName", state)} /></Field>
        <div className={styles.row}>
          <Field name="athleteAge" label="Age (in years)" error={state.errors.athleteAge}><input id="athleteAge" name="athleteAge" type="number" min={0} max={99} step={1} inputMode="numeric" value={values.athleteAge} onChange={update} required {...fieldA11y("athleteAge", state)} /></Field>
          <Field name="gender" label="Gender" optional error={state.errors.gender}><input id="gender" name="gender" maxLength={60} value={values.gender} onChange={update} {...fieldA11y("gender", state)} /></Field>
        </div>
        <Field name="aboutAthlete" label="Tell us about your athlete" optional hint="Share their interests, goals, or what helps them feel comfortable. Please avoid medical or diagnostic details." error={state.errors.aboutAthlete}>
          <textarea id="aboutAthlete" name="aboutAthlete" rows={4} maxLength={2000} value={values.aboutAthlete} onChange={update} {...fieldA11y("aboutAthlete", state, true)} />
        </Field>
      </fieldset>
      <fieldset className={styles.consents} disabled={pending || !configuration.available}>
        <legend className={styles.srOnly}>Your permission</legend>
        <label className={styles.checkbox}><input type="checkbox" id="guardianConsent" name="guardianConsent" checked={guardianConsent} onChange={(event) => setGuardianConsent(event.target.checked)} required {...fieldA11y("guardianConsent", state)} /><span>I am this athlete’s parent or legal guardian.</span></label>
        {state.errors.guardianConsent && <p id="guardianConsent-error" className={styles.fieldError}>{state.errors.guardianConsent[0]}</p>}
        <label className={styles.checkbox}><input type="checkbox" id="contactConsent" name="contactConsent" checked={contactConsent} onChange={(event) => setContactConsent(event.target.checked)} required {...fieldA11y("contactConsent", state)} /><span>I give SportAbility permission to contact me about this application.</span></label>
        {state.errors.contactConsent && <p id="contactConsent-error" className={styles.fieldError}>{state.errors.contactConsent[0]}</p>}
      </fieldset>
      <PrivacyNote />
      {configuration.available && <Turnstile key={state.attempt} siteKey={configuration.siteKey} action="registration" />}
      <button type="submit" className={`button ${styles.submit}`} disabled={pending || !configuration.available}>{pending ? "Sending your application…" : "Send Application"}<span aria-hidden="true">↗</span></button>
      <p className={styles.afterSubmit}>No payment is collected here. We’ll get in touch to discuss fit, availability, and next steps.</p>
    </>}
  </form>;
}
