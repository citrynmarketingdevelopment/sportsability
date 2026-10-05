import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import styles from "./ui.module.css";

export function ArrowIcon() { return <ArrowRight size={20} weight="bold" aria-hidden="true" />; }

export function Doodle({ kind, className = "" }: { kind: "star" | "heart" | "ball" | "arrow" | "spark"; className?: string }) {
  const paths = {
    star: <><path d="m49 9 11 28 30 1-24 19 9 30-26-17-26 17 8-30L8 38l30-1Z"/><path d="m51 16 7 25 24-1-20 15 8 22-22-13-20 15 8-26-20-12 24 2Z" opacity=".3"/></>,
    heart: <><path d="M50 85C39 76 9 55 10 34 11 11 36 9 50 30 64 7 89 14 89 35 89 55 65 76 50 85Z"/><path d="M47 77C28 62 13 48 16 33" opacity=".35"/></>,
    ball: <><path d="M90 49c1 24-17 41-41 41S8 72 9 49 27 8 50 9s39 17 40 40Z"/><path d="m50 30 18 13-7 21H39l-7-21Z M50 10v20 M68 43l20-6 M61 64l13 18 M39 64 26 81 M32 43l-19-7 M27 17l-5 20-12 12 M72 17l5 19 13 12 M11 61l14 3 5 21 M89 62l-14 2-6 21 M40 89l10-10 12 9"/></>,
    arrow: <><path d="M8 19c18 38 37 53 78 48 M67 49l21 17-20 15"/><path d="M17 26c14 23 26 35 51 37" opacity=".3"/></>,
    spark: <><path d="m50 10-3 27 M19 26l18 15 M8 57l27-5 M23 84l17-20 M54 91l-3-26 M82 77 65 61 M92 43l-26 5 M76 15 61 34"/></>,
  };
  return <svg className={`${styles.doodle} ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

export function PageIntro({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <section className={styles.pageIntro}><div className="container">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{children && <div className={styles.introCopy}>{children}</div>}</div><Doodle kind="star" className={styles.introStar}/></section>;
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <div className={styles.sectionHeading}>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{children && <div>{children}</div>}</div>;
}

export function CtaBand() {
  return <section className={styles.cta}><div className={`container ${styles.ctaInner}`}><Doodle kind="heart" className={styles.ctaHeart}/><div><h2>There’s a place for your athlete.</h2><p>Let’s find their next step, together.</p></div><Link href="/register" className="button">Start an Application <ArrowIcon/></Link><Doodle kind="star" className={styles.ctaStar}/></div></section>;
}
