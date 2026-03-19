import React, { useEffect, useState } from "react";
import styles from "./add-expense.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";

export default function EditExpense({ show, onClose, onUpdated, expense }) {
    const [description, setDescription] = useState(expense?.description ?? "");
    const [amount, setAmount] = useState(expense?.amount ?? 0);
    const [loading, setLoading] = useState(false);
    const { roomId } = useParams();
    const expenseId = expense?._id ?? expense?.id;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDescription(expense?.description ?? "");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAmount(expense?.amount ?? 0);
    }, [expense]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!description) {
            toast.error("Description is required.");
            setLoading(false);
            return;
        }
        if (amount <= 0) {
            toast.error("Amount must be greater than 0.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again.");
                setLoading(false);
                return;
            }

            if (!roomId || !expenseId) {
                toast.error("Invalid expense or room. Please try again.");
                setLoading(false);
                return;
            }

            const res = await fetch(`/api/rooms/${roomId}/expenses/${expenseId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    description,
                    amount: Number(amount),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message);
                setLoading(false);
                return;
            }

            toast.success(data.message);
            setLoading(false);
            setDescription("");
            setAmount(0);
            onUpdated?.(data);
            onClose?.();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
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
                <h1>Update Expense</h1>
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
                </div>
                <div className={styles.addExpenseModalButtons}>
                    <button type="submit">
                        {loading ? "Updating..." : "Update Expense"}
                    </button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
