import React from 'react';
import styles from "./ShimmerScan.module.css";

const ShimmerScan = () => {
  return (
    <div className={styles.shimmer}>
      <div className={styles.shimmerHeader}></div>
      <div className={styles.shimmerBody}>
        <div className={styles.shimmerLine}></div>
        <div className={styles.shimmerLine}></div>
      </div>
    </div>
  );
};

export default ShimmerScan;
