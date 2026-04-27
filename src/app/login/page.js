"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TOAST_OPTIONS } from "@/lib/toastOptions";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        document.title = "Spliterr - Login";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Login failed", TOAST_OPTIONS);
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("auth:changed"));

            setLoading(false);

            toast.success("Login successful!", TOAST_OPTIONS);
            const storedRedirect = localStorage.getItem("redirectUrl");
            console.log("storedRedirect", storedRedirect);
            if (storedRedirect) {
                router.push(`rooms/join?${storedRedirect.split("?")[1]}`);
            } else {
                router.push("/rooms");
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong. Please try again.", TOAST_OPTIONS);
            setLoading(false);
        }
    };
    const sessionSignIn = () => {
        // OAuth must land on a client page that copies NextAuth session → localStorage.
        // /rooms only trusts localStorage JWT, so going there first always looks "logged out".
        signIn("google", { callbackUrl: "/auth/callback" });
    };

    return (
        <main className={styles.loginContainer}>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h1 className={styles.loginTitle}>Welcome Back!</h1>
                <div className={styles.loginFormContent}>
                    <h2 className={styles.loginSubtitle}>Login to your account</h2>

                    <label className={styles.label}>
                        <span>Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </label>

                    <label className={styles.label}>
                        <span>Password</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <div className={styles.showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</div>
                    </label>
                    <p className={styles.forgotPasswordLink}><Link href="/forgot-password">Forgot Password?</Link></p>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className={styles.signupLink}>
                        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                    </p>

                    <div className={styles.googleButtonSeparator}> <div className={styles.line}></div> or <div className={styles.line}></div></div>
                    <button
                        type="button"
                        onClick={sessionSignIn}
                        className={styles.googleButton}
                    >
                        <span className={styles.googleButtonIcon} aria-hidden>
                            <FcGoogle size={22} />
                        </span>
                        <span className={styles.googleButtonLabel}>Sign in with Google</span>
                    </button>
                </div>
            </form>
        </main >
    );
}