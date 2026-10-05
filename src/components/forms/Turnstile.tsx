"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { FormKind } from "@/lib/forms/types";
import styles from "./forms.module.css";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

export function Turnstile({ siteKey, action }: { siteKey: string; action: FormKind }) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    widget.current = api.render(container.current, {
      sitekey: siteKey,
      action,
      theme: "light",
      size: "flexible",
      "response-field": false,
      "refresh-expired": "auto",
      callback: (value: string) => { setToken(value); setError(""); },
      "expired-callback": () => { setToken(""); setError("Your security check expired. A new check will appear automatically."); },
      "error-callback": () => { setToken(""); setError("The security check couldn’t load. Please retry, or contact us by phone or email."); },
      "timeout-callback": () => { setToken(""); setError("The security check timed out. Please retry the check."); },
    });
    return () => {
      if (widget.current !== null) api.remove(widget.current);
      widget.current = null;
    };
  }, [ready, siteKey, action]);

  return (
    <div className={styles.verification}>
      <Script
        id="sportability-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => setError("The security check couldn’t load. Please check your connection or contact us directly.")}
      />
      <div ref={container} />
      <input type="hidden" name="cf-turnstile-response" value={token} />
      {error && <p className={styles.fieldError} role="status">{error}</p>}
      {error && ready && <button type="button" className={styles.retry} onClick={() => {
        setToken("");
        setError("");
        if (widget.current !== null) window.turnstile?.reset(widget.current);
      }}>Retry security check</button>}
      <noscript><p>Please enable JavaScript to use the online form, or contact us by email or phone.</p></noscript>
    </div>
  );
}
