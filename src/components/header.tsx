"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

const links = [{ href: "/", label: "Home" }, { href: "/programs", label: "Programs" }, { href: "/about", label: "About Us" }, { href: "/contact", label: "Contact Us" }];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className={styles.header} onKeyDown={event => { if (event.key === "Escape") { setOpen(false); document.getElementById("menu-button")?.focus(); } }}>
    <div className={`container ${styles.inner}`}>
      <Link href="/" aria-label="SportAbility home" className={styles.logo} onClick={() => setOpen(false)}><Image src="/brand/sportability.svg" width={123} height={80} alt="SportAbility" loading="eager"/></Link>
      <button id="menu-button" type="button" className={styles.menu} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span><span className={`${styles.menuLines} ${open ? styles.close : ""}`} aria-hidden="true"><i/><i/></span></button>
      <nav id="main-navigation" aria-label="Main navigation" className={`${styles.nav} ${open ? styles.open : ""}`}>
        {links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className={link.href === "/contact" ? styles.contact : ""} onClick={() => setOpen(false)}>{link.label}{link.href === "/contact" && <span aria-hidden="true">↗</span>}</Link>)}
      </nav>
    </div>
  </header>;
}
