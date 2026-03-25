"use client";
import React from 'react'
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/rooms/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
            router.push(`/rooms/${data.room._id}`);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message, TOAST_OPTIONS);
        }
    }

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
