import Image from "next/image";
import Link from "next/link";
import { contact } from "@/lib/content";
import styles from "./footer.module.css";

export function Footer() {
  return <footer className={styles.footer}><div className="container"><div className={styles.main}>
    <div className={styles.brand}><Link href="/" aria-label="SportAbility home"><Image src="/brand/sportability.svg" alt="SportAbility" width={144} height={94}/></Link><p>Every Athlete, Every Ability,<br/>Empowered Through Sports.</p></div>
    <div><h2>Come play with us.</h2><nav aria-label="Footer navigation"><Link href="/programs">Programs</Link><Link href="/about">About Us</Link><Link href="/register">Registration</Link><Link href="/contact">Contact Us</Link></nav></div>
    <div className={styles.contact}><h2>Let’s connect.</h2><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={contact.phoneHref}>{contact.phone}</a><p>{contact.location}</p></div>
  </div><div className={styles.bottom}><p>© {new Date().getFullYear()} SportAbility. All rights reserved.</p><Link href="/privacy">Privacy</Link><p className={styles.imageNote}>Photography is AI-generated illustrative imagery.</p></div></div></footer>;
}
