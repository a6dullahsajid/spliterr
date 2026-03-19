"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
// import Modal from "./components/Modal";
import CreateGroupModal from "./components/create-room-modal.js";
import { toast, ToastContainer } from "react-toastify";
import JoinRoomModal from "./components/join-room-modal";

export default function HomePage() {
  useEffect(() => {
    document.title = "Spliterr - split your expenses easily";
  }, []);

  const router = useRouter();
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);

  const loggedIn = typeof window !== "undefined" ? !!localStorage.getItem('token') : false;
  const createGroup = () => {
    if (loggedIn) {
      setShowCreateGroupModal(true);
    } else {
      toast.error("Please login to create a group");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }
  }
  const joinRoom = () => {
    if (loggedIn) {
      setShowJoinRoomModal(true);
    } else {
      toast.error("Please login to join a group");
      setTimeout(() => {
        router.push("/login");
      }, 500);
      return;
    }
  }
  return (
    <>
      <CreateGroupModal show={showCreateGroupModal} onClose={() => setShowCreateGroupModal(false)} />
      <JoinRoomModal show={showJoinRoomModal} onClose={() => setShowJoinRoomModal(false)} />
      <ToastContainer />
      <main className={styles.homeContainer}>
        <section className={styles.homeContent}>
          <h2 className={styles.homeTitle}>Split expenses with friends — effortlessly.</h2>
          <p className={styles.homeSubtitle}>Track shared expenses during trips, outings,
            or events and see who owes whom instantly.</p>
          <div className={styles.homeButtons}>
            <button onClick={createGroup}>Create a Group</button>
            <button onClick={joinRoom}>Join a Group</button>
          </div>
        </section>
        <section className={styles.homeFeatures}>
          <h2 className={styles.homeFeaturesTitle}>How Spliterr Works</h2>
          <div className={styles.featuresContainer}>
            <div className={styles.featureCard}>
              <h3 className={styles.featureCardTitle}>Create a Group</h3>
              <p className={styles.featureCardDescription}>
                Start a group for your trip or outing
                and invite your friends using an invite code.
              </p>
            </div>
            <div className={styles.rightArrow}>→</div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureCardTitle}>Add Expenses</h3>
              <p className={styles.featureCardDescription}>
                Track shared expenses during trips, outings,
                or events and see who owes whom instantly.
              </p>
            </div>
            <div className={styles.rightArrow}>→</div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureCardTitle}>Settle Bills</h3>
              <p className={styles.featureCardDescription}>
                See exactly who owes whom with automatic
                balance calculations.
              </p>
            </div>
          </div>
        </section>
        {/* <section className={styles.homeFeatures}>
        <h2 className={styles.homeFeaturesTitle}>How Spliterr Works</h2>
        <h3 className={styles.homeFeaturesSubtitle}>Create a Room</h3>
        <p className={styles.homeFeaturesDescription}>
          Start a room for your trip or outing and invite friends.
        </p>
      </section> */}
      </main>
    </>
  );
}