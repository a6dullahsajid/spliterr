"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import styles from './room.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from '@/app/components/LoadingOverlay';
import { FaCopy, FaEdit, FaLink, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import AddExpense from '@/app/components/add-expense';
import DeleteOverlay from '@/app/components/DeleteOverlay';
import EditExpense from '@/app/components/edit-expense';
// import SettleOverlay from '@/app/components/SettleOverlay';
import { useRouter } from 'next/navigation';
import { TOAST_OPTIONS } from "@/lib/toastOptions";

export default function RoomPage() {
    const { roomId } = useParams();
    const router = useRouter();
    const [user, setUser] = useState({});
    const [refreshKey, setRefreshKey] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [summary, setSummary] = useState({
        totalRoomExpense: 0,
        youPaid: 0,
        youOwe: 0,
        netBalance: 0,
    });
    const [simplifiedDebts, setSimplifiedDebts] = useState([]);
    const [room, setRoom] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [expandedParticipants, setExpandedParticipants] = useState({});
    const [deleting, setDeleting] = useState(false);
    const [showDetailedReport, setShowDetailedReport] = useState(false);
    const [showAllCards, setShowAllCards] = useState(false);
    // const [showSettleModal, setShowSettleModal] = useState(false);
    // const [expenseToSettle, setExpenseToSettle] = useState(null);
    const formatExpenseTimestamp = (isoDate) => {
        const d = new Date(isoDate);
        if (Number.isNaN(d.getTime())) return "";

        const dd = String(d.getDate()).padStart(2, "0");
        const month = d.toLocaleString("en-US", { month: "long" });
        const yyyy = d.getFullYear().toString().slice(-2);
        const time = d
            .toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })

        return `${dd} ${month}, ${yyyy}`;
    };
    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        let parsedUser = null;
        if (storedUser) {
            try {
                parsedUser = JSON.parse(storedUser);
            } catch {
                parsedUser = null;
            }
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(parsedUser);

        if (!token) {
            toast.error("Please login first", TOAST_OPTIONS);
            setLoading(false);
            router.push("/login");
            return;
        }

        const getExpenses = async () => {
            const res = await fetch(`/api/rooms/${roomId}/expenses`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                if (res.status === 403) {
                    router.push("/rooms");
                }
                return;
            }
            console.log("expenses", data);
            setExpenses(data.expenses);
        }

        const getBalances = async () => {
            const res = await fetch(`/api/rooms/${roomId}/balance`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                return;
            }
            setBalances(data.balances);
        }
        const getSummary = async () => {
            const res = await fetch(`/api/rooms/${roomId}/summary`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                return;
            }
            setSummary(data);
        }
        const getSimplifiedDebts = async () => {
            const res = await fetch(`/api/rooms/${roomId}/simplified-debts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                return;
            }
            setSimplifiedDebts(data.simplifiedDebts);
        }
        const getRoom = async () => {
            const res = await fetch(`/api/rooms/${roomId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                router.push("/rooms");
                return;
            }
            setRoom(data.room);
        }
        getRoom();
        getExpenses().then(() => {
            setLoading(false);
        })
        getBalances()
        getSummary()
        getSimplifiedDebts()
        // Promise.all([
        // ]).finally(() => {
        //     setLoading(false);
        // })
    }, [roomId, refreshKey]);

    useEffect(() => {
        document.title = `Spliterr - ${room?.name} Expenses`;
    }, [room]);

    const deleteExpense = async () => {
        if (!expenseToDelete) return;
        setDeleting(true);
        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem('token')
                    : null;

            if (!token) {
                toast.error('Please login again.', TOAST_OPTIONS);
                setDeleting(false);
                return;
            }

            const res = await fetch(`/api/rooms/${roomId}/expenses/${expenseToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                setDeleting(false);
                return;
            }
            toast.success('Expense deleted successfully', TOAST_OPTIONS);
            setExpenseToDelete(null);
            setDeleting(false);
            setRefreshKey((k) => k + 1);
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete expense', TOAST_OPTIONS);
            setDeleting(false);
        }
    }

    // const toggleSettle = async (expense) => {
    //     setShowSettleModal(true);
    //     setExpenseToSettle(expense);
    // }

    const toggleParticipants = (expenseId) => {
        setExpandedParticipants((prev) => ({
            ...prev,
            [expenseId]: !prev[expenseId],
        }));
    };
    return (
        <>
            {loading && <LoadingOverlay />}
            <DeleteOverlay
                open={!!expenseToDelete}
                title="Delete expense"
                description={expenseToDelete ? `Are you sure you want to delete "${expenseToDelete.description}" expense? This cannot be undone.` : ""}
                confirmLabel="Yes, delete"
                cancelLabel="Cancel"
                loading={deleting}
                onConfirm={deleteExpense}
                onCancel={() => !deleting && setExpenseToDelete(null)}
            />
            {/* <SettleOverlay
                open={showSettleModal}
                expense={expenseToSettle}
                onCancel={() => setShowSettleModal(false)}
                loading={settling}
                onConfirm={() => {
                    setShowSettleModal(false);
                    setExpenseToSettle(null);
                    setRefreshKey((k) => k + 1);
                }}
            /> */}
            {showAddExpenseModal && (
                <AddExpense
                    show={showAddExpenseModal}
                    onClose={() => setShowAddExpenseModal(false)}
                    room={room}
                    onAdded={() => {
                        setLoading(true);
                        setRefreshKey((k) => k + 1);
                    }}
                />
            )}
            {showEditExpenseModal && (
                <EditExpense
                    show={showEditExpenseModal}
                    onClose={() => setShowEditExpenseModal(false)}
                    onUpdated={() => {
                        setLoading(true);
                        setRefreshKey((k) => k + 1);
                    }}
                    expense={expenseToEdit}
                />
            )}
            <ToastContainer />
            <main className={styles.roomPage}>
                <div className={styles.roomPageContent}>
                    {/* HEADER */}
                    <section className={styles.header}>
                        <div>
                            <h1>{room?.name}</h1>
                            <p>Invite Code: {room?.inviteCode} <span onClick={() => {
                                navigator.clipboard.writeText(room?.inviteCode);
                                toast.success('Invite code copied to clipboard', TOAST_OPTIONS);
                            }}><FaCopy /></span></p>
                        </div>

                        <div className={styles.headerActions}>
                            <button onClick={() => setShowAddExpenseModal(true)}>Add Expense</button>
                            <button onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/rooms/join?inviteCode=${room?.inviteCode}`);
                                toast.success('Invite link copied to clipboard', TOAST_OPTIONS);
                            }}>Invite <FaLink /></button>
                        </div>
                    </section>

                    {/* SUMMARY CARDS */}
                    <section className={styles.summaryCards}>
                        <div className={styles.card}>
                            <p>Total Expense</p>
                            <h3>₹{summary.totalRoomExpense}</h3>
                        </div>
                        <div className={styles.card}>
                            <p>{summary.netBalance >= 0 ? "You get" : "You pay"}</p>
                            <h3 style={{ color: summary.netBalance >= 0 ? '#0adc2a' : '#ff0000' }}>₹{(summary.netBalance >= 0 ? Math.round(summary.youGet) : Math.round(summary.youPay))}</h3>
                        </div>
                        <div className={styles.card}>
                            <p>You paid</p>
                            <h3>₹{Math.round(summary.youPaid)}</h3>
                        </div>
                        {!showAllCards && <button className={styles.detailedSummaryButton} onClick={() => setShowAllCards(true)}>Show detailed summary <FaChevronDown /></button>}
                    </section>

                    {/* YOUR BALANCES */}
                    {showAllCards && (
                        <>
                            <section className={styles.yourBalances}>
                                <div className={styles.card}>
                                    <p>Total Expenses</p>
                                    <h3>{expenses?.length}</h3>
                                </div>

                                <div className={styles.card}>
                                    <p>Members</p>
                                    <h3>{room?.members?.length}</h3>
                                </div>
                                <div className={styles.card}>
                                    <p>Your share</p>
                                    <h3>₹{Math.round(summary.youOwe)}</h3>
                                </div>
                            </section>

                            {/* MEMBERS + DEBTS */}
                            <section className={styles.middleSection}>

                                {/* MEMBERS */}
                                <div className={styles.membersBox}>
                                    <h3>Members</h3>
                                    {room?.members?.map((m) => (
                                        <div key={m._id} className={styles.member}>
                                            {m.name}
                                        </div>
                                    ))}
                                </div>

                                {/* DEBTS */}
                                <div className={styles.debtBox}>
                                    {showDetailedReport && (
                                        <>
                                            <h3>Detailed Report</h3>
                                            {balances?.length === 0 && <p>No debts 🎉</p>}
                                            {balances?.map((d, i) => (
                                                <p key={i}>
                                                    {d.from.name} <b>should pay</b> {d.to.name} <b>₹{Math.round(d.amount)}</b>
                                                </p>
                                            ))}
                                            <button onClick={() => setShowDetailedReport(false)}>Get simplified report <FaChevronUp /></button>
                                        </>
                                    )}
                                    {!showDetailedReport && (
                                        <>
                                            <h3>Settle up</h3>
                                            {simplifiedDebts?.length === 0 && <p>No debts 🎉</p>}

                                            {simplifiedDebts?.map((d, i) => (
                                                <p key={i}>
                                                    {d.from} <b>should pay</b> {d.to} <b>₹{Math.round(d.amount)}</b>
                                                </p>
                                            ))}
                                            <button onClick={() => setShowDetailedReport(true)}>Get detailed report <FaChevronDown /></button>
                                        </>
                                    )}
                                </div>
                                <button className={styles.detailedSummaryButton} onClick={() => { setShowAllCards(false); setShowDetailedReport(false) }}>Hide detailed summary <FaChevronUp /></button>
                            </section>
                        </>
                    )}

                    {/* EXPENSE TABLE */}
                    <section className={styles.tableSection}>
                        <h3>Expenses</h3>

                        <table className={styles.expensesContainer}>
                            <thead>
                                <tr>
                                    <th>Expense</th>
                                    <th>Paid By</th>
                                    <th>Participants</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    {/* <th>Status</th> */}
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {expenses?.map((expense) => (
                                    <tr key={expense._id} className={expandedParticipants[expense._id] ? styles.mobileExpandedRow : ""}>
                                        <td>{expense.description}</td>
                                        <td style={{ color: user?.name === expense?.paidBy?.name ? '#0adc2a' : '#white' }}>{expense?.paidBy?.name}</td>
                                        <td>{expense.participants.map(p => p.name).join(", ")}</td>
                                        <td>{formatExpenseTimestamp(expense.createdAt)}</td>
                                        <td>₹{expense.amount}</td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                {(() => {
                                                    const userId = user?.id ?? user?._id;
                                                    const paidById = expense?.paidBy?._id ?? expense?.paidBy?.id;
                                                    const isLeader = room?.leader?.name === user?.name;
                                                    const isExpenseCreator =
                                                        (userId && paidById && String(userId) === String(paidById)) ||
                                                        expense?.paidBy?.name === user?.name;
                                                    const canEdit = isLeader || isExpenseCreator;
                                                    const canDelete = isLeader || isExpenseCreator;
                                                    console.log(canEdit, canDelete, expense.description);

                                                    return (
                                                        <>
                                                            {canEdit && (
                                                                <button type="button" onClick={() => {
                                                                    setExpenseToEdit(expense);
                                                                    setShowEditExpenseModal(true);
                                                                }}>
                                                                    <FaEdit />
                                                                </button>
                                                            )}
                                                            {canDelete && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setExpenseToDelete(expense)}
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className={styles.mobileParticipantsToggle}
                                                onClick={() => toggleParticipants(expense._id)}
                                            >
                                                {expandedParticipants[expense._id] ? <FaChevronUp/> : <FaChevronDown />}
                                                {/* {expandedParticipants[expense._id] ? <FaChevronUp/> : <FaChevronDown />} */}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </section>
                </div>
            </main>
        </>
    )
}
