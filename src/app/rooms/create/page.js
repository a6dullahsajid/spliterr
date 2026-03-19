"use client";
import React, { useState } from 'react'
import CreateRoomModal from '@/app/components/create-room-modal';
import { ToastContainer } from 'react-toastify';

export default function CreateRoomPage() {
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(true);
    return (
        <>
            <CreateRoomModal show={showCreateRoomModal} onClose={() => setShowCreateRoomModal(false)} />
            <ToastContainer />
        </>
    )
}

