import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, CtaBand, Doodle, PageIntro } from "@/components/ui";
import { programs } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Adaptive Soccer Programs",
  alternates: { canonical: "/programs" },
  description:
    "Explore SportAbility’s six-week group and one-on-one adaptive soccer programs in Bakersfield. Build skills, confidence, and connections at your athlete’s pace.",
};

const questions = [
  {
    question: "Who are these programs for?",
    answer:
      "SportAbility welcomes children with a wide range of developmental, learning, and social differences. A diagnosis is not a requirement to reach out. Contact us to talk about your athlete, age eligibility, and which program may be a good fit.",
  },
  {
    question: "Does my athlete need soccer experience?",
    answer:
      "Every athlete has a different starting point. Our approach uses individualized adaptations, so tell us about your child’s experience, interests, and goals when you apply. We’ll talk through how the program can support them.",
  },
  {
    question: "When and where do sessions take place?",
    answer:
      "Our programs are based in Bakersfield, California. Contact us to confirm the next available dates, venue, session duration, and age eligibility. For one-on-one soccer, we’ll also confirm how many sessions are included.",
  },
  {
    question: "How are parents involved?",
    answer:
      "Parents and athletes are part of the experience together. Your insight helps us understand your athlete’s interests and what helps them feel comfortable. We’ll discuss parent participation and session expectations with you before you begin.",
  },
  {
    question: "Does submitting an application reserve a place?",
    answer:
      "An application starts the conversation. The team will contact you about program fit, availability, and next steps. Enrollment is confirmed with the team, and no payment is taken through this website.",
  },
  {
    question: "How does the enrollment fee work?",
    answer:
      "The group program is listed at $210 and the one-on-one program at $300, with a $25 enrollment fee. Contact us to confirm the full total and payment details before enrolling.",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageIntro eyebrow="OUR PROGRAMS" title="A little play. A lot of possibility.">
        Adaptive soccer that meets your athlete where they are, with space to learn, connect, and grow.
      </PageIntro>

      <section className={`container ${styles.programSection}`} aria-labelledby="soccer-heading">
        <div className={styles.sectionTop}>
          <div>
            <h2 id="soccer-heading">Two ways to find their stride.</h2>
          </div>
          <p>
            A shared team experience or focused individual support. Find the format that feels right for your family.
          </p>
        </div>

        <div className={styles.programs}>
          {programs.map((program, index) => (
            <article id={program.id} key={program.id} className={styles.program}>
              <div className={styles.programPhoto}>
                <Image
                  src={program.image}
                  alt={index === 0
                    ? "Illustrative scene of children, parents, and a coach practicing soccer together on a grassy field"
                    : "Illustrative scene of a coach supporting a child during an individual soccer activity"}
                  fill
                  sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 48px), (max-width: 1296px) calc(50vw - 64px), 586px"
                  className={styles.image}
                />
              </div>
              <div className={styles.programBody}>
                <div className={styles.programHeading}>
                  <div>
                    <p className={styles.formatLabel}>{index === 0 ? "Small group · 6 weeks" : "Individual support"}</p>
                    <h3>{program.name}</h3>
                  </div>
                  <Doodle kind={index === 0 ? "ball" : "star"} className={styles.programDoodle} />
                </div>
                <p className={styles.description}>{program.description}</p>
                <ul className={styles.features}>
                  {program.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <div className={styles.enrollment}>
                  <p className={styles.price}>${program.price}<span> / program</span></p>
                  <p className={styles.fee}>Enrollment fee: $25. Contact us to confirm the total.</p>
                  <Link className="button" href={`/register?program=${program.id}`}>
                    {index === 0 ? "Apply for Group Soccer" : "Apply for 1-on-1 Soccer"}
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.applicationNote}>
          An application starts a conversation. We’ll confirm availability and program fit with you before enrollment.
        </p>
      </section>

      <section className={styles.playSection} aria-labelledby="play-heading">
        <div className={`container ${styles.playInner}`}>
          <div className={styles.playIntro}>
            <Doodle kind="heart" className={styles.heart} />
            <h2 id="play-heading">Good things grow<br />through play.</h2>
            <p>
              Every pass, shared activity, and small step forward is a chance to build something beyond soccer skills.
            </p>
          </div>
          <div className={styles.values}>
            <div><h3>Skills for the field</h3><p>Practice movement and soccer fundamentals with adaptations around the athlete.</p></div>
            <div><h3>Connections that matter</h3><p>Make room for communication, taking turns, teamwork, and shared moments of joy.</p></div>
            <div><h3>Confidence to keep trying</h3><p>Celebrate participation, independence, and progress that looks different for every child.</p></div>
          </div>
        </div>
      </section>

      <section className={`container section ${styles.faqSection}`} aria-labelledby="questions-heading">
        <div className={styles.faqIntro}>
          <h2 id="questions-heading">Before the<br />first kick.</h2>
          <p>Your family is welcome to ask questions. We’re here to help you find a good starting point.</p>
          <Link className="text-link" href="/contact">Contact Us <ArrowIcon /></Link>
        </div>
        <div className={styles.questions}>
          {questions.map(({ question, answer }) => (
            <details key={question} className={styles.question}>
              <summary>{question}<span aria-hidden="true" className={styles.plus} /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className={`container ${styles.moreSports}`}>
        <Doodle kind="spark" className={styles.spark} />
        <p><strong>Soccer is just the beginning.</strong> As SportAbility grows, we look forward to making room for more sports and more possibilities.</p>
      </div>
      <CtaBand />
    </>
  );
}
