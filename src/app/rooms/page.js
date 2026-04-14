"use client";

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import styles from './rooms.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateGroupModal from '../components/create-room-modal';
import JoinRoomModal from '../components/join-room-modal';
import LoadingOverlay from '../components/LoadingOverlay';
import { TOAST_OPTIONS } from "@/lib/toastOptions";

export default function RoomsPage() {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        document.title = "Spliterr - Groups";

        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first", TOAST_OPTIONS);
            router.push("/login");
        }

        const getRooms = async () => {
            const res = await fetch('/api/rooms', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message, TOAST_OPTIONS);
                return;
            }
            console.log(data.rooms);
            setRooms(data.rooms);
            setLoading(false);
        }
        getRooms();
    }, [router]);
    return (
        <>

            <ToastContainer />
            {loading && <LoadingOverlay />}
            <CreateGroupModal show={showCreateGroupModal} onClose={() => setShowCreateGroupModal(false)} />
            {showJoinRoomModal && (
                <Suspense fallback={null}>
                    <JoinRoomModal show={showJoinRoomModal} onClose={() => setShowJoinRoomModal(false)} />
                </Suspense>
            )}
            <div className={styles.roomsContainer}>
                <div className={styles.roomsHeader}>
                    <h1>Your Groups</h1>
                    <p>Manage your groups and invite your friends to join.

                    </p>
                    <div className={styles.buttons}>
                        <button onClick={() => setShowCreateGroupModal(true)}>Create Group</button>
                        <button onClick={() => setShowJoinRoomModal(true)}>Join Group</button>
                    </div>
                </div>
                <div className={styles.roomsList}>
                    {rooms.length === 0 && (
                        <p>No groups yet</p>
                    )}
                    {rooms.map((room) => {
                        const totalMembers = room.members.length;
                        const previewMembers = room.members.slice(0, 4);
                        const remainingMembers = Math.max(totalMembers - previewMembers.length, 0);

                        return (
                            <article
                                onClick={() => router.push(`/rooms/${room._id}`)}
                                key={room._id}
                                className={styles.roomCard}
                            >
                                <div className={styles.roomCardTop}>
                                    <h3>{room.name}</h3>
                                    <span className={styles.memberCount}>{totalMembers} members</span>
                                </div>

                                <div className={styles.roomMeta}>
                                    <span className={styles.metaLabel}>Leader</span>
                                    <span className={styles.metaValue}>{room.leader.name}</span>
                                </div>

                                <div className={styles.roomMeta}>
                                    <span className={styles.metaLabel}>Members</span>
                                    <div className={styles.membersList}>
                                        {previewMembers.map((member) => (
                                            <span key={member._id || member.name} className={styles.memberChip}>
                                                {member.name}
                                            </span>
                                        ))}
                                        {remainingMembers > 0 && (
                                            <span className={styles.memberChip}>+{remainingMembers} more</span>
                                        )}
                                    </div>
                                </div>

                                <p className={styles.openRoomHint}>Tap to open room</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </>
    )
}
