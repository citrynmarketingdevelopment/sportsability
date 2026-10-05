import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, CtaBand, Doodle, PageIntro } from "@/components/ui";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us",
  alternates: { canonical: "/about" },
  description:
    "Meet the approach behind SportAbility: adaptive sports, developmental principles, and community, helping children of all abilities thrive in Bakersfield.",
};

const welcomes = ["Autism", "Down syndrome", "ADHD", "Intellectual disabilities", "Developmental delays", "Social-communication differences"];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="ABOUT SPORTABILITY" title="A place to play. A place to belong.">
        Every Athlete, Every Ability, Empowered Through Sports.
      </PageIntro>

      <section className={`container section ${styles.mission}`} aria-labelledby="mission-heading">
        <div className={styles.photoWrap}>
          <div className={styles.photo}>
            <Image
              src="/images/family-connection.webp"
              alt="Illustrative scene of a parent and child sharing a happy moment beside a soccer field"
              fill
              loading="eager"
              sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 48px), (max-width: 1296px) calc(50vw - 90px), 556px"
              className={styles.image}
            />
          </div>
          <Doodle kind="heart" className={styles.photoHeart} />
        </div>
        <div className={styles.missionCopy}>
          <h2 id="mission-heading">Because every child deserves a team.</h2>
          <p>
            SportAbility is an adaptive sports program designed to help children of all abilities develop athletic skills while building confidence, friendships, and meaningful connections.
          </p>
          <p>
            We bring sports and fitness together with developmental principles and a strong sense of community. That means seeing the whole athlete: their strengths, their interests, and their own way of learning.
          </p>
          <p>We’re starting with adaptive soccer in Bakersfield, with a vision to bring that same welcome to more sports as we grow.</p>
        </div>
      </section>

      <section className={styles.successSection} aria-labelledby="success-heading">
        <div className={`container ${styles.successInner}`}>
          <div>
            <h2 id="success-heading">There’s more than<br />one way to win.</h2>
            <Doodle kind="star" className={styles.successStar} />
          </div>
          <div>
            <p className={styles.successLead}>A first try. A new friend. The confidence to join in.</p>
            <p className={styles.successCopy}>
              Goals scored and games won are only part of the story. We also value participation, communication, teamwork, independence, and a positive relationship with physical activity.
            </p>
            <div className={styles.successWords} aria-label="What we celebrate">
              <span>Participation</span><span>Confidence</span><span>Connection</span><span>Independence</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`container section ${styles.expertise}`} aria-labelledby="expertise-heading">
        <div className={styles.expertiseIntro}>
          <p className="eyebrow">THE THINKING BEHIND THE PLAY</p>
          <h2 id="expertise-heading">Built by professionals.<br />Designed around the athlete.</h2>
          <p>
            Created by professionals in sports and fitness and guided by the expertise of a licensed educational psychologist.
          </p>
        </div>
        <div className={styles.roles}>
          <article className={styles.role}>
            <Doodle kind="ball" className={styles.roleDoodle} />
            <h3>Sports & fitness expertise</h3>
            <p>
              Athletic skill development is at the heart of each program. Activities use individualized adaptations to make room for different ways of moving, learning, and participating.
            </p>
          </article>
          <article className={styles.role}>
            <Doodle kind="spark" className={styles.roleDoodle} />
            <h3>Educational psychology guidance</h3>
            <p>
              Developmental principles help shape the program’s approach to communication, confidence, and teamwork, supporting opportunities for growth through shared play.
            </p>
          </article>
        </div>
      </section>

      <section className={`container ${styles.welcome}`} aria-labelledby="welcome-heading">
        <div>
          <h2 id="welcome-heading">Different strengths.<br />A shared love of play.</h2>
          <p>
            SportAbility welcomes children with a wide range of developmental, learning, and social differences, including:
          </p>
        </div>
        <div>
          <ul className={styles.welcomeList}>{welcomes.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className={styles.welcomeNote}>
            Every athlete is more than a label. A diagnosis isn’t required to start a conversation about your child.
          </p>
          <Link href="/contact" className="text-link">Contact Us <ArrowIcon /></Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
