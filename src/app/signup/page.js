"use client";

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from './signup.module.css'
import Link from 'next/link'
import { TOAST_OPTIONS } from "@/lib/toastOptions";

export default function SignupPage() {

    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    useEffect(() => {
        document.title = "Spliterr - Signup";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otpVerified) {
            toast.error("Please verify OTP", TOAST_OPTIONS);
            return;
        }
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
                toast.error(data.message || "Signup failed", TOAST_OPTIONS);
            } else {
                toast.success("Account created successfully", TOAST_OPTIONS);
                setTimeout(() => {
                    router.push("/login");
                }, 800);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.", TOAST_OPTIONS);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    // const handleSendOtp = async () => {
    //     if (isOtpSent) {
    //         if(!email) {
    //             toast.error("Please enter email to verify OTP", {
    //                 position: "top-right"
    //             });
    //             return;
    //         }
    //         if(!otp) {
    //             toast.error("Please enter OTP to verify", {
    //                 position: "top-right"
    //             });
    //             return;
    //         }
    //         setOtpVerified(await verifyOtp());
    //         return;
    //     }

    //     if(!email) {
    //         toast.error("Please enter email to send OTP", {
    //             position: "top-right"
    //         });
    //         return;
    //     }
    //     const res = await fetch("/api/send-otp", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ email, purpose: "signup" })
    //     });

    //     const data = await res.json();

    //     if (!res.ok) {
    //         toast.error(data?.message || "Failed to send OTP", {
    //             position: "top-right"
    //         });
    //         return;
    //     }
    //     toast.success(data.message || "OTP sent successfully", {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "dark",
    //     });
    //     setIsOtpSent(true);
    // }

    // const verifyOtp = async () => {

    //     const res = await fetch("/api/verify-otp", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ email, otp, purpose: "signup" })
    //     });

    //     const data = await res.json();
    //     if (!res.ok) {
    //         toast.error(data.message || "Failed to verify OTP", {
    //             position: "top-right"
    //         });
    //     }
    //     toast.success(data.message || "OTP verified successfully", {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "dark",
    //     });


    //     return true;
    // }

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
                    {/* <label className={styles.label}>
                        <span>OTP</span>
                        <div className={styles.otpInputContainer}>
                            <input className={styles.otpInput} type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                            <button type="button" disabled={otpVerified} onClick={handleSendOtp} className={styles.sendOtpButton}>{isOtpSent ? "Verify OTP" : "Send OTP"}</button>
                        </div>
                    </label> */}
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
