import React, { useState } from "react";

// Popup Component
export const Popup = ({ data, onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
        <h3>Low Vulnerabilities</h3>
        <ul>
          {data && data.length > 0 ? (
            data.map((item, index) => <li key={index}>{item.name}</li>)
          ) : (
            <p>No low vulnerabilities found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Popup;