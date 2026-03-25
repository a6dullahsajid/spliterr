/* eslint-disable react/no-unknown-property */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./add-expense.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import { TOAST_OPTIONS } from "@/lib/toastOptions";

export default function AddExpense({ show, onClose, room, onAdded }) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const { roomId } = useParams();

    const members = useMemo(() => room?.members ?? [], [room]);
    const allMemberIds = useMemo(
        () => members.map((m) => String(m._id)),
        [members]
    );

    useEffect(() => {
        if (!members.length) return;
        // Default participants to all members when room loads.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParticipants(allMemberIds);
    }, [members, allMemberIds]);

    const allSelected =
        allMemberIds.length > 0 && participants.length === allMemberIds.length;

    const toggleParticipant = (memberId) => {
        setParticipants((prev) => {
            const id = String(memberId);
            return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        });
    };

    const toggleSelectAll = () => {
        setParticipants(allSelected ? [] : allMemberIds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!description) {
            toast.error("Description is required.", TOAST_OPTIONS);
            setLoading(false);
            return;
        }
        if (amount <= 0) {
            toast.error("Amount must be greater than 0.", TOAST_OPTIONS);
            setLoading(false);
            return;
        }
        if (participants.length === 0) {
            toast.error("Please select at least one participant.", TOAST_OPTIONS);
            setLoading(false);
            return;
        }

        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("token")
                    : null;
            if (!token) {
                toast.error("Please login again.", TOAST_OPTIONS);
                setLoading(false);
                return;
            }

            const res = await fetch(`/api/rooms/${roomId}/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    description,
                    amount: Number(amount),
                    participants,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                setLoading(false);
                return;
            }

            toast.success(data.message, TOAST_OPTIONS);
            setLoading(false);
            setDescription("");
            setAmount(0);
            setParticipants([]);
            onAdded?.(data);
            onClose?.();
        } catch (error) {
            console.error(error);
            toast.error(error.message, TOAST_OPTIONS);
            setLoading(false);
        }
    };

    return (
        <div
            className={styles.addExpenseModal}
            style={{ display: show ? "flex" : "none" }}
        >
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <h1>Add Expense</h1>
                <div className={styles.addExpenseModalFormContent}>
                    <label>
                        <span>Description</span>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Amount</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </label>

                    <div className={styles.participantsContainer}>
                    <span className={styles.participantsTitle}>Participants</span>
                    <div className={styles.participants}>
                        <div className={styles.participantsHeader}>
                            <label className={styles.selectAll}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                />
                                <span>Select all</span>
                            </label>
                        </div>

                        <div className={styles.participantsList}>
                            {members.map((member) => {
                                const id = String(member._id);
                                const checked = participants.includes(id);
                                return (
                                    <label key={id} className={styles.participantRow}>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleParticipant(id)}
                                        />
                                        <p>{member.name}</p>
                                    </label>
                                );
                            })}

                            {!members.length && (
                                <p className={styles.participantsEmpty}>No members found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.addExpenseModalButtons}>
                    <button type="submit">
                        {loading ? "Adding..." : "Add Expense"}
                    </button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
