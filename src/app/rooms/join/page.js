"use client";
import React, { useState } from 'react'
import JoinRoomModal from '@/app/components/join-room-modal';
import { ToastContainer } from 'react-toastify';

export default function JoinRoomPage() {
    const [showJoinRoomModal, setShowJoinRoomModal] = useState(true);
    return (
        <>
            <JoinRoomModal show={showJoinRoomModal} onClose={() => setShowJoinRoomModal(false)} />
            <ToastContainer />
        </>
    )
}

