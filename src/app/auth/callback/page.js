"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./callback.module.css";

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const redirected = useRef(false);

  const getStoredRedirectPath = () => {
    if (typeof window === "undefined") return null;

    const storedRedirect = localStorage.getItem("redirectUrl");
    if (!storedRedirect) return null;

    try {
      const redirectUrl = new URL(storedRedirect);
      if (redirectUrl.origin !== window.location.origin) return null;

      return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (redirected.current) return;
    if (status === "loading") return;

    if (status === "authenticated" && session?.customJwt) {
      redirected.current = true;
      localStorage.setItem("token", session.customJwt);
      localStorage.setItem("user", JSON.stringify(session.user));
      window.dispatchEvent(new Event("auth:changed"));
      const redirectPath = getStoredRedirectPath();
      localStorage.removeItem("redirectUrl");
      router.replace(redirectPath || "/rooms");
      return;
    }

    if (status === "unauthenticated") {
      redirected.current = true;
      router.replace("/login");
    }
  }, [session, status, router]);

  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.spinner} aria-hidden />
        <h1 className={styles.title}>Signing you in</h1>
        <p className={styles.subtitle}>Hang tight — finishing your Google sign-in.</p>
      </div>
    </main>
  );
}
