"use client";

import React, { useState, useEffect } from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Navbar() {
    const router = useRouter();
    const [showDropDown, setShowDropDown] = useState(false);
    const [auth, setAuth] = useState({ loggedIn: false, user: null });

    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        let user = null;
        if (storedUser) {
            try {
                user = JSON.parse(storedUser);
            } catch {
                user = null;
            }
        }
        // Sync localStorage → state after mount (SSR-safe); no localStorage on server.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuth({ loggedIn: !!token, user });
        const onAuthChanged = () => {
            const t = localStorage.getItem("token");
            const u = localStorage.getItem("user");
            let parsed = null;
            if (u) try { parsed = JSON.parse(u); } catch { parsed = null; }
            setAuth({ loggedIn: !!t, user: parsed });
        };
        window.addEventListener("auth:changed", onAuthChanged);
        window.addEventListener("storage", onAuthChanged);
        return () => {
            window.removeEventListener("auth:changed", onAuthChanged);
            window.removeEventListener("storage", onAuthChanged);
        };
    }, []);

    const displayName = auth.user?.name ? auth.user.name.split(" ")[0] : "User";

    const toggleDropDownMenu = () => {
        setShowDropDown(!showDropDown);
    }

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        setAuth({ loggedIn: false, user: null });
        router.push('/');
        toast.success("Logged out successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <h1 className={styles.logoText}>
                    <Link href="/">Spliterr</Link></h1>
            </div>
            <div className={styles.menuContainer}>
                {auth.loggedIn ? (
                    <div className={styles.dropdownMenu}>
                        <button onClick={() => toggleDropDownMenu()}>{displayName} <span className={styles.dropdownMenuIcon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg></span></button>
                        {showDropDown && (
                            <div className={styles.dropdownMenuContent}>
                                <Link href="/rooms">Groups</Link>
                                <Link href="/rooms/join">Join a Group</Link>
                                <Link href="/rooms/create">Create a Group</Link>
                                <Link href="/" onClick={logout}>Logout</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className={styles.loginButton} onClick={() => router.push('/login')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        Login
                    </button>
                )}
            </div>
        </nav>
    )
}
