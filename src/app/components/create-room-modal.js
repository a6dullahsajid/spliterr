import React, { useState } from 'react'
import styles from './create-room-modal.module.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateGroupModal({ show, onClose }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!name) {
            toast.error('Group name is required',
                {
                    position: 'top-right',
                }
            );
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('/api/rooms/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name, description }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message);
                setLoading(false);
                return;
            }
            toast.success(data.message);
            setLoading(false);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
            setLoading(false);
        }
    }
    return (
        <div className={styles.createRoomModal} style={{ display: show ? 'flex' : 'none' }}>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <h1>Create a Group</h1>
                <div className={styles.createRoomModalFormContent}>
                    <label htmlFor="name">
                        <span>Group Name</span>
                        <input type="text" name="name" id="name" placeholder="E.g. Goa Trip" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label htmlFor="description">
                        <span>Description</span>
                        <input type="text" name="description" id="description" placeholder="Describe the group" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                </div>
                <div className={styles.createRoomModalButtons}>
                    <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
