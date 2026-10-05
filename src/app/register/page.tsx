import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import { programs, contact } from "@/lib/content";
import { getFormConfiguration } from "@/lib/forms/config";
import { RegistrationForm } from "@/components/forms/RegistrationForm";
import styles from "@/components/forms/forms.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Apply for a Program",
  alternates: { canonical: "/register" },
  description: "Take the first step toward adaptive soccer in Bakersfield. Send SportAbility a short parent and athlete application.",
  robots: { index: false, follow: true },
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ program?: string | string[] }> }) {
  const query = await searchParams;
  const initialProgram = typeof query.program === "string" && programs.some((program) => program.id === query.program) ? query.program : "";

  return <>
    <header className={styles.pageHeader}>
      <div className="container">
        <p className="eyebrow">A place on the team starts here</p>
        <h1>Let’s meet your athlete.</h1>
        <p>A few details help us start a conversation about the right support, the right program, and a whole lot of possibility.</p>
      </div>
    </header>
    <div className={`container ${styles.layout}`}>
      <RegistrationForm configuration={getFormConfiguration()} initialProgram={initialProgram} submissionId={randomUUID()} />
      <aside className={styles.sidebar}>
        <h2>What happens next?</h2>
        <ol className={styles.nextSteps}>
          <li><strong>Tell us a little about your athlete.</strong>Choose a program and share what you’d like us to know.</li>
          <li><strong>We’ll connect with you.</strong>We’ll talk about your athlete’s goals, support needs, and program availability.</li>
          <li><strong>Find their next step.</strong>We’ll confirm the details together before enrollment. There’s no payment today.</li>
        </ol>
        <div className={styles.sidebarContact}>
          <p>Prefer to talk it through?</p>
          <a href={contact.phoneHref}>{contact.phone}</a>
          <p><a href={`mailto:${contact.email}`}>Email the SportAbility team →</a></p>
        </div>
      </aside>
    </div>
  </>;
}
