import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { contact } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
  description: "How SportAbility uses information shared through its contact and parent-and-athlete application forms.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="YOUR INFORMATION" title="Privacy, in plain language.">
        Here’s what happens to the information you share with SportAbility through this website.
      </PageIntro>
      <div className={`container section ${styles.layout}`}>
        <aside className={styles.aside}>
          <p className="eyebrow">A NOTE FOR FAMILIES</p>
          <p>Our forms are for parents and guardians. Please share only what we need to start the conversation.</p>
          <Link href="/contact" className="text-link">Contact Us</Link>
        </aside>
        <article className={styles.content}>
          <section aria-labelledby="collect-heading">
            <h2 id="collect-heading">What you share</h2>
            <p>
              The contact form asks for your name, email address, optional phone number, and message. The program application asks for the selected program, a parent or guardian’s name, email and phone number, the athlete’s name and age, optional gender, and any optional information about the athlete’s interests, goals, and comfort with activities.
            </p>
            <p>
              The application also asks you to confirm that you are the athlete’s parent or legal guardian and that SportAbility may contact you. One application is for one athlete.
            </p>
          </section>
          <section aria-labelledby="sensitive-heading">
            <h2 id="sensitive-heading">Keep sensitive details off the form</h2>
            <p>
              Please do not include medical records, diagnoses, treatment information, Social Security numbers, insurance information, or payment details. The optional athlete message can focus on interests, goals, and what helps your child feel comfortable. If you need to discuss sensitive information, contact the team first to arrange an appropriate way to do so.
            </p>
          </section>
          <section aria-labelledby="use-heading">
            <h2 id="use-heading">How we use it</h2>
            <p>
              SportAbility uses submitted information to respond to questions, understand your interest in a program, discuss program fit and availability, and follow up about enrollment. Submitting an application does not confirm enrollment or reserve a place.
            </p>
          </section>
          <section aria-labelledby="delivery-heading">
            <h2 id="delivery-heading">Where form information goes</h2>
            <p>
              Form messages are delivered to SportAbility’s email inbox using Resend. Resend processes and may retain email content and delivery information, and messages are stored in SportAbility’s Gmail inbox. The website does not have an application database or parent accounts. Form content is not intentionally written to website logs, analytics, URLs, or browser storage.
            </p>
            <p>
              Email services have their own privacy and retention practices. You can read the <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend privacy policy</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy policy</a> for more information.
            </p>
          </section>
          <section aria-labelledby="security-heading">
            <h2 id="security-heading">Spam protection and hosting</h2>
            <p>
              The forms use Cloudflare Turnstile to help prevent automated spam. Cloudflare may process technical information about your browser, device, and network to perform this verification. See the <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare privacy policy</a> for its practices.
            </p>
            <p>
              The website is hosted with Vercel. Hosting and security providers may process technical request information, such as IP addresses and browser information, to deliver and protect the website. No advertising trackers or analytics tools have been added to this website.
            </p>
          </section>
          <section aria-labelledby="choices-heading">
            <h2 id="choices-heading">Your questions and choices</h2>
            <p>
              To ask about information you have shared, request a correction or deletion, or withdraw permission for further contact, email <a href={`mailto:${contact.email}`}>{contact.email}</a> or call <a href={contact.phoneHref}>{contact.phone}</a>. The team will respond to your request and explain any limits on what can be removed from email service records.
            </p>
            <p>You may also contact us directly instead of using a website form.</p>
          </section>
          <p className={styles.updated}>Last updated: October 1, 2026</p>
        </article>
      </div>
    </>
  );
}
