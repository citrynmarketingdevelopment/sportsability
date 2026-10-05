import type { Metadata } from "next";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import { EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react/dist/ssr";
import { contact } from "@/lib/content";
import { getFormConfiguration } from "@/lib/forms/config";
import { ContactForm } from "@/components/forms/ContactForm";
import styles from "@/components/forms/forms.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact Us",
  alternates: { canonical: "/contact" },
  description: "Questions about adaptive soccer for your child? Contact the SportAbility team in Bakersfield, California.",
};

export default function ContactPage() {
  return <>
    <header className={styles.pageHeader}>
      <div className="container">
        <p className="eyebrow">Good things start with a conversation</p>
        <h1>We’re here for your family.</h1>
        <p>Wondering if SportAbility is the right fit? Have a question about soccer? We’d love to hear from you.</p>
      </div>
    </header>
    <div className={`container ${styles.layout} ${styles.contactLayout}`}>
      <aside className={styles.contactDetails}>
        <h2>Let’s connect.</h2>
        <p>Ask us about age eligibility, session schedules, locations, or the support that would help your athlete feel at home.</p>
        <div className={styles.contactLink}><EnvelopeSimple aria-hidden="true" /><div><strong>Email us</strong><a href={`mailto:${contact.email}`}>{contact.email}</a></div></div>
        <div className={styles.contactLink}><Phone aria-hidden="true" /><div><strong>Give us a call</strong><a href={contact.phoneHref}>{contact.phone}</a></div></div>
        <div className={styles.contactLink}><MapPin aria-hidden="true" /><div><strong>Our community</strong><p>{contact.location}</p></div></div>
        <div className={styles.contactNote}>
          <strong>Ready for a first step?</strong>
          <p>Explore group and one-on-one soccer, then send a short application for your athlete.</p>
          <Link href="/programs" className="text-link">Explore Programs →</Link>
        </div>
      </aside>
      <ContactForm configuration={getFormConfiguration()} submissionId={randomUUID()} />
    </div>
  </>;
}
