"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TOAST_OPTIONS } from "@/lib/toastOptions";

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
            console.log(data);

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
            if (storedRedirect) {
                router.push(storedRedirect);
            } else {
                router.push("/rooms");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.", TOAST_OPTIONS);
            setLoading(false);
        }
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
                </div>
            </form>
        </main>
    );
}