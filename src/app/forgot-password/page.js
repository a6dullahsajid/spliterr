"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./forgotpass.module.css";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Spliterr - Forgot Password";
    }, []);

    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Please enter email to send OTP", {
                position: "top-right",
                theme: "dark",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        if (isOtpSent) {
            if (!otp) {
                toast.error("Please enter OTP to verify", {
                    position: "top-right",
                    theme: "dark",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }
            setOtpVerified(await verifyOtp());
            return;
        }
        setLoading(true);

        const res = await fetch("/api/send-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, purpose: "forgot" })
        });
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message || "Failed to send OTP", {
                position: "top-right",
                theme: "dark",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        toast.success(data.message || "OTP sent successfully", {
            position: "top-right",
            theme: "dark",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        setLoading(false);
        setIsOtpSent(true);
    }

    const verifyOtp = async () => {
        setLoading(true);
        const res = await fetch("/api/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, otp, purpose: "forgot" })
        });
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message || "Failed to verify OTP", {
                position: "top-right",
                theme: "dark",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        setLoading(false);
        toast.success("OTP verified successfully", {
            position: "top-right",
            theme: "dark",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!otpVerified) {
            toast.error("Please verify OTP to reset password", {
                position: "top-right",
                theme: "dark",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        if (!password) {
            toast.error("Please enter new password to reset password", {
                position: "top-right",
                theme: "dark",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        if (!email) {
            toast.error("Please enter email to reset password", {
                position: "top-right",
                theme: "dark",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
            toast.error(data.message || "Failed to reset password", {
                position: "top-right",
                theme: "dark",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        toast.success(data.message || "Password reset successfully", {
            position: "top-right",
            theme: "dark",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        setTimeout(() => {
            router.push("/login");
        }, 800);
    }

    return (
        <main className={styles.forgotPasswordContainer}>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
                <h1 className={styles.forgotPasswordTitle}>Reset Password</h1>
                <div className={styles.forgotPasswordFormContent}>
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
                    {!otpVerified && <label className={styles.label}>
                        <span>OTP</span>
                        <div className={styles.otpInputContainer}>
                            <input className={styles.otpInput} type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                            <button type="button" disabled={otpVerified} onClick={handleSendOtp} className={styles.sendOtpButton}>{isOtpSent ? "Verify OTP" : "Send OTP"}</button>
                        </div>
                    </label>}
                    {otpVerified && <label className={styles.label}>
                        <span>New Password</span>
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
                        <div className={styles.showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</div>
                    </label>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        Reset Password
                    </button>
                    <p className={styles.signupLink}>
                        Back to <Link href="/login">Login</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}