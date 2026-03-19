"use client";

import { Suspense, useEffect, useState } from "react";
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

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Prevent SSR/localStorage crash: only read in browser.
    const token = localStorage.getItem("token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(!!token);
  }, []);
  const createGroup = () => {
    if (loggedIn) {
      setShowCreateGroupModal(true);
    } else {
      toast.error("Please login to create a group", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
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
      toast.error("Please login to join a group", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setTimeout(() => {
        router.push("/login");
      }, 500);
      return;
    }
  }
  return (
    <>
      <CreateGroupModal show={showCreateGroupModal} onClose={() => setShowCreateGroupModal(false)} />
      {showJoinRoomModal && (
        <Suspense fallback={null}>
          <JoinRoomModal show={showJoinRoomModal} onClose={() => setShowJoinRoomModal(false)} />
        </Suspense>
      )}
      <ToastContainer />
      {/* <main className={styles.homeContainer}>
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
      </main> */}
      <main className={styles.homeContainer}>

        {/* HERO */}
        <section className={styles.hero}>
          <h1 className={styles.homeTitle}>
            Split expenses with friends — effortlessly.
          </h1>

          <p className={styles.homeSubtitle}>
            Track shared expenses during trips, outings,
            or events and see who owes whom instantly.
          </p>

          <div className={styles.homeButtons}>
            <button className={styles.primaryBtn} onClick={createGroup}>
              Create a Group
            </button>
            <button className={styles.secondaryBtn} onClick={joinRoom}>
              Join a Group
            </button>
          </div>
        </section>

        {/* DEMO */}
        <section className={styles.demoSection}>
          <h2 className={styles.sectionTitle}>See it in action</h2>

          <div className={styles.demoCard}>
            <h3>Goa Trip</h3>
            <div className={styles.demoRow}>
              <span>Abdullah paid</span>
              <span className={styles.green}>₹1200</span>
            </div>
            <div className={styles.demoRow}>
              <span>Ali owes</span>
              <span className={styles.red}>₹400</span>
            </div>
            <div className={styles.demoRow}>
              <span>Ahmed owes</span>
              <span className={styles.red}>₹400</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className={styles.homeFeatures}>
          <h2 className={styles.sectionTitle}>How Spliterr Works</h2>

          <div className={styles.featuresContainer}>

            <div className={styles.featureCard}>
              <h3>🧑‍🤝‍🧑 Create Group</h3>
              <p>Start a group and invite friends using code</p>
            </div>

            <div className={styles.featureCard}>
              <h3>💸 Add Expenses</h3>
              <p>Log shared payments instantly</p>
            </div>

            <div className={styles.featureCard}>
              <h3>📊 Track Debts</h3>
              <p>Automatically calculate who owes whom</p>
            </div>

          </div>
        </section>

        {/* WHY SECTION */}
        <section className={styles.whySection}>
          <h2 className={styles.sectionTitle}>Why Spliterr?</h2>

          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>⚡ Fast & simple UI</div>
            <div className={styles.whyCard}>🔐 Secure authentication</div>
            <div className={styles.whyCard}>📱 Works on all devices</div>
            <div className={styles.whyCard}>🤝 Perfect for trips & outings</div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2>Start splitting smarter today</h2>
          <button className={styles.primaryBtn} onClick={createGroup}>
            Get Started
          </button>
        </section>

      </main>
    </>
  );
}