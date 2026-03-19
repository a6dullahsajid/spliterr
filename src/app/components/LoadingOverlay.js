import React from 'react'
import styles from './loading-overlay.module.css'
export default function LoadingOverlay() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingOverlayContent}>
        <div className={styles.loadingOverlayContentSpinner}>
          <div className={styles.loadingOverlayContentSpinnerDot}></div>
        </div>
        <div className={styles.loadingOverlayContentText}>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  )
}
