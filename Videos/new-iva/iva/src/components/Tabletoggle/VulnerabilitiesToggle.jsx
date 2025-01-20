import styles from "../../pages/Makechecker.module.css";
import { useEffect, useState } from "react";
import BasicModal from "../model/BasicModal";

const VulnerabilitiesToggle = ({ row }) => {
  console.log("toggle "+ JSON.stringify(row))
  const [toggleState, setToggleState] = useState(row.ticket); // Sync initial state with `row.value`
  const handleToggle = () => {
    setToggleState(!toggleState); // Toggle the state
    
  };
  console.log("data "+ JSON.stringify(toggleState))
  return (<BasicModal togfunc={handleToggle}row={row}>
    <div className={styles.tablebuttons}>
     
      {/* Toggle button */}
      <div className={toggleState? styles.toggleContainer : styles.toggleContaineruntrue} >
        <div
          className={`${styles.toggleButton} ${
            toggleState ? styles.toggleRight : styles.toggleLeft}`}>
          
        </div>
        {toggleState ? "Ticket created" : "Create ticket"}
      </div>

      {/* Show vulnerability details only if the toggle is on */}
     
    </div>
    </BasicModal>
  );
};

export default VulnerabilitiesToggle;
