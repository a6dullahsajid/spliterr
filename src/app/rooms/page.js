"use client";

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import styles from './rooms.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateGroupModal from '../components/create-room-modal';
import JoinRoomModal from '../components/join-room-modal';
import LoadingOverlay from '../components/LoadingOverlay';

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
            toast.error("Please login first");
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
                toast.error(data.message);
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
                    {rooms.map(room => (
                        <div onClick={() => router.push(`/rooms/${room._id}`)} key={room._id} className={styles.roomCard}>
                            <h3>{room.name}</h3>
                            <p><div>Leader:</div> {room.leader.name}</p>
                            <p><div>Members:</div>
                                <div className={styles.membersList}>
                                    {room.members.map((member, index) => {
                                        return (

                                            <span key={index}>{member.name}{index < room.members.length - 1 ? ', ' : ''}</span>
                                        )
                                    })}
                                </div>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
