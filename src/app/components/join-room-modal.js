"use client";
import React, { useCallback, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import styles from './join-room-modal.module.css';
import { useSearchParams } from 'next/navigation';
import { TOAST_OPTIONS } from "@/lib/toastOptions";

export default function JoinRoomModal({ show, onClose }) {
    const searchParams = useSearchParams();
    const inviteCodeParam = searchParams.get('inviteCode');
    const [inviteCode, setInviteCode] = useState(inviteCodeParam || "");
    const router = useRouter();

    const joinRoom = useCallback(async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;

        if (!token) {
            toast.error('Please login to join a room', TOAST_OPTIONS);

            if (typeof window !== "undefined") {
                console.log('redirecting to', window.location.href);
                localStorage.setItem('redirectUrl', window.location.href);
            }

            setTimeout(() => {
                router.push('/login');
            }, 1000);
            return;
        }
        try {
            const res = await fetch('/api/rooms/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ inviteCode }),
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                return;
            }
            toast.success(data.message, TOAST_OPTIONS);
            if (typeof window !== "undefined") {
                localStorage.removeItem('redirectUrl');
            }
            setTimeout(() => {
                router.push(`/rooms/${data.room._id}`);
            }, 800);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message, TOAST_OPTIONS);
        }
    }, [inviteCode, router, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        joinRoom();
    }

    useEffect(() => {
        if (inviteCodeParam) {
            joinRoom();
        }
    }, [inviteCodeParam, joinRoom]);

    const handleCancel = () => {
        router.push('/rooms');
        onClose();
    }

    return (
        <div className={styles.joinRoomModal} style={{ display: show ? 'flex' : 'none' }}>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <h1>Join a Room</h1>
                <div className={styles.joinRoomModalFormContent}>
                    <label htmlFor="inviteCode">
                        <span>Invite Code</span>
                        <input type="text" id="inviteCode" name="inviteCode" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
                    </label>
                </div>
                <div className={styles.joinRoomModalButtons}>
                    <button type="submit">Join</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
