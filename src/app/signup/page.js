"use client";

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from './signup.module.css'
import Link from 'next/link'

export default function SignupPage() {

    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.title = "Spliterr - Signup";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Signup failed", {
                    position: "top-right"
                });
            }else{
                toast.success("Account created successfully", {
                    position: "top-right"
                });
                setTimeout(() => {
                    router.push("/login");
                }, 800);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.", {
                position: "top-right"
            });
            setLoading(false);
        } finally {
            setLoading(false);
        }

    }
    return (
        <main className={styles.signupContainer}>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.signupForm}>
                <h1 className={styles.signupTitle}>Signup to spliterr</h1>
                <div className={styles.signupFormContent}>
                    <h2 className={styles.signupSubtitle}>Create an account</h2>
                    <label className={styles.label}>
                        <span>Name</span>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={styles.input} />
                    </label>
                    <label className={styles.label}>
                        <span>Email</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
                    </label>
                    <label className={styles.label}>
                        <span>Password</span>
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
                        <div className={styles.showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</div>
                    </label>
                    <button type="submit" disabled={loading} className={styles.submitButton}>
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                    <p className={styles.loginLink}>
                        Already have an account? <Link href="/login">Login</Link>
                    </p>
                </div>
            </form>
        </main>
    )
}
