import React from 'react'
import styles from "./ScanComponent.module.css"
import LinearWithValueLabel from '../progressbar/LinearWithValueLabel'

const ScanComponent = (props) => {
    
    console.log("scan "+JSON.stringify(props.url))
  return (
    <div className={styles.scan}>
        <div className={styles.scanheader}>
        <h2>{props.url}</h2>
        </div>
<div className={styles.scanbody}>
<p>Spider Status</p>
<LinearWithValueLabel id={"spider"+encodeURIComponent(props.url)} progress={props.spiderprogress}/>
<p>Scan Status</p>
<LinearWithValueLabel id={"scan"+encodeURIComponent(props.url)} progress={props.scanprogress}/>
</div>
     
    </div>
  )
}

export default ScanComponent
