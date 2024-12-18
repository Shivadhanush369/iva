import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import toast from 'react-hot-toast';
import styles from "./Schedulersui.module.css";



import UserInput from '../Input/UserInput';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

const Schedulersui = () => {
  return (
    <div className={styles.jira_wrapper}>
    <div className={styles.jira_header}>
    Schedulers 
    
    </div>
    <div className={styles.jira_body}>
<div className={styles.firstrow}>
  <UserInput  placeholder="Enter Jira Username" width="250px"/>
  <UserInput placeholder="Enter Jira Token" width="250px"/>
</div>
<div className={styles.secondrow}>
<UserInput placeholder="Enter Jira Url" width="250px"/>
  <UserInput   placeholder="Enter ProjectKey" width="250px"/>
</div>
<div className={styles.thirdrow}>
<UserInput  placeholder="Enter Organization Name" width="57%"/>
</div>
<div className={styles.fourthrow}>
<LoadingButton
        
        endIcon={<SendIcon />}
       
        loadingPosition="end"
        variant="contained"
      >
      Check Connection
      </LoadingButton>
    <LoadingButton
       
        endIcon={<SendIcon />}
       
        loadingPosition="end"
        variant="contained"
      >
        Submit
      </LoadingButton>
</div>
    </div>
  </div>
  )
}

export default Schedulersui
