import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { ArrowIcon, CtaBand, Doodle } from "@/components/ui";
import { audience, programs } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <>
    <section className={styles.hero}>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Adaptive sports in Bakersfield</p>
          <h1>Every athlete.<span className={styles.heroAccent}>Every ability.<svg viewBox="0 0 420 20" fill="none" aria-hidden="true"><path d="M4 10C111 1 238 2 414 8M22 16C154 10 284 9 388 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></span></h1>
          <p className={styles.heroDescription}>Adaptive soccer in Bakersfield, helping children build skills, confidence, and friendships.</p>
          <div className={styles.heroActions}><Link href="/programs" className="button">Explore Programs <ArrowIcon/></Link><Link href="/about" className={styles.heroAbout}>Meet SportAbility <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroPhoto}><Image src="/images/hero-soccer.webp" alt="Illustrative scene of a child practicing a soccer pass with a coach and parent nearby" fill loading="eager" fetchPriority="high" sizes="(max-width: 600px) calc(100vw - 52px), (max-width: 767px) calc(100vw - 60px), (max-width: 1296px) calc(52vw - 76px), 598px" quality={75}/></div>
          <Doodle kind="spark" className={styles.heroSpark}/><Doodle kind="ball" className={styles.heroBall}/><Doodle kind="star" className={styles.heroStar}/>
        </div>
      </div>
    </section>

    <section className={styles.welcome}>
      <div className={`container ${styles.welcomeInner}`}><Doodle kind="heart" className={styles.welcomeHeart}/><h2>A little play.<br/>A lot of possibility.</h2><div><p>Learning a new skill. Passing to a teammate. Finding the confidence to try again.</p><p>At SportAbility, those moments matter. We meet your child where they are and make room for their own way to grow.</p></div></div>
    </section>

    <section className={`section ${styles.programSection}`}>
      <div className="container">
        <div className={styles.sectionTitle}><p className="eyebrow">Let’s start with soccer</p><h2>Small steps.<br/>Big reasons to smile.</h2><p>Two ways to play. The same belief in every athlete.</p><Doodle kind="arrow" className={styles.programArrow}/></div>
        <div className={styles.programGrid}>
          {programs.map((program, index) => <article className={styles.program} key={program.id}>
            <Link href={`/programs#${program.id}`} className={styles.programPhoto} aria-label={`Explore ${program.name}`}><Image src={program.homeImage.src} alt={program.homeImage.alt} fill sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 48px), (max-width: 900px) calc(50vw - 39px), (max-width: 1100px) calc(50vw - 63px), (max-width: 1296px) calc(50vw - 70px), 578px"/><span className={styles.photoArrow}><ArrowUpRight size={24} weight="bold" aria-hidden="true"/></span></Link>
            <div className={styles.programHeading}><h3>{program.name}</h3><span className={styles.price}>${program.price}</span></div>
            <p>{program.description}</p>
            <p className={styles.fee}>Enrollment fee: $25. Contact us to confirm the total.</p>
            <Link href={`/register?program=${program.id}`} className="text-link">{index === 0 ? "Apply for Group Soccer" : "Apply for 1-on-1 Soccer"}<ArrowIcon/></Link>
          </article>)}
        </div>
        <p className={styles.moreSports}>Starting with soccer. Growing toward more ways to play.</p>
      </div>
    </section>

    <section className={styles.belong}>
      <div className={`container ${styles.belongGrid}`}>
        <div className={styles.familyPhoto}><Image src="/images/family-connection.webp" alt="Illustrative scene of a parent and child sharing a happy moment beside a soccer field" fill sizes="(max-width: 767px) 100vw, 45vw"/><Doodle kind="heart" className={styles.familyHeart}/></div>
        <div className={styles.belongCopy}><h2>Your child’s own pace.<br/>A team in their corner.</h2><p>Every child brings their own strengths. We welcome athletes with a wide range of developmental, learning, and social differences, including:</p><ul className={styles.audience}>{audience.map(item => <li key={item}><Check size={17} weight="bold" aria-hidden="true"/>{item}</li>)}</ul><p className={styles.fitNote}>Not sure where to start? Tell us a little about your athlete. We’ll talk through the possibilities together.</p><Link href="/contact" className="text-link">Contact Us <ArrowIcon/></Link></div>
      </div>
    </section>

    <section className={`section ${styles.approach}`}>
      <div className={`container ${styles.approachInner}`}>
        <div className={styles.approachTitle}><Doodle kind="star"/><h2>Built by professionals.<br/>Designed around your athlete.</h2><p>Sports and fitness experience, guided by the expertise of a licensed educational psychologist. Thoughtful support that makes space for play.</p><Link href="/about" className="text-link">About Us <ArrowIcon/></Link></div>
        <div className={styles.growthList}>
          <div><span className={styles.growthMark} aria-hidden="true">↗</span><div><h3>Confidence to try</h3><p>Participation and personal progress are worth celebrating.</p></div></div>
          <div><Doodle kind="heart"/><div><h3>Connections that matter</h3><p>Practice communication, share a moment, and find a teammate.</p></div></div>
          <div><Doodle kind="ball"/><div><h3>A positive start with sport</h3><p>Build skills and independence through play that fits.</p></div></div>
        </div>
      </div>
    </section>
    <CtaBand/>
  </>;
}
