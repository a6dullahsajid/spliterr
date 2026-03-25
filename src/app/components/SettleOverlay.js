"use client";

import React from "react";
import styles from "./delete-overlay.module.css";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { TOAST_OPTIONS } from "@/lib/toastOptions";

export default function SettleOverlay({
    open,
    expense,
    cancelLabel = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}) {
    const { roomId } = useParams();
    if (!open) return null;
    const handleConfirm = async () => {
        try {
            const res = await fetch(`/api/rooms/${roomId}/expenses/${expense._id}/settle`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                return;
            }
            toast.success(data.message, TOAST_OPTIONS);
            onConfirm();
        } catch (error) {
            console.error(error);
            toast.error("Failed to settle expense", TOAST_OPTIONS);
        }
    }

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <h2 className={styles.title}>{expense.settled ? "Unsettle" : "Settle"} expense</h2>
                <p className={styles.description}>Are you sure you want to {expense.settled ? "unsettle" : "settle"} the expense &quot;{expense.description}&quot; for ₹{expense.amount}?</p>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {expense.settled ? "Unsettle" : "Settle"}
                    </button>
                </div>
            </div>
        </div>
    );
}

