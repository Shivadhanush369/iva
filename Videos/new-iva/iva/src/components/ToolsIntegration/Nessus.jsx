import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import toast from 'react-hot-toast';
import UserInput from '../Input/UserInput';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import styles from './Nessus.module.css';

const Nessus = () => {
    const [loading, setLoading] = React.useState(false);
    const [cclocading,setCcloading] = React.useState(false);
    const [NessusAccessToken,setNessusAccessToken]= React.useState("");
    const [NessusSecretKey,setNessusSecretKey]= React.useState("");
    const [NessusApiToken,setNessusApiToken]=React.useState("");
    
    function handelNessusAccessToken(value){
       
        setNessusAccessToken(value);
        
    }

    function handelNessusSecretKey(value){
       
        setNessusSecretKey(value);
        
    }

  
    function handelNessusApiToken(value){
        setNessusApiToken(value);
    }
    
    async function  handleClickCheckConnection(){
        setCcloading(true);
       
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch('http://localhost:5004/test-nessus-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    AccessToken: NessusAccessToken,
                    SecretKey: NessusSecretKey,
                    ApiToken: NessusApiToken
                    
                }),
            });

            if (response.ok) {
                toast.success("connection successfull");
                setCcloading(false);
                 console.log("successfull");
               
            } else {
                setCcloading(false);
            toast.error("Connection Failed , Please check the credential");
     console.log("not ok")
            }
        } catch (error) {
            console.log(error)
        }






    }
    async function handleClick() {
      setLoading(true);
      if ( NessusAccessToken === "" && NessusSecretKey === "" && NessusApiToken === ""      ){
        toast.error("Failed , Check the credential");
        alert("hi")
        setLoading(false);
      }
      else{
      const token = localStorage.getItem('jwtToken');
      const orgname = localStorage.getItem('username');


      try {
        const response = await fetch('http://localhost:5004/submit-nessus-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use the token from localStorage
            },
            body: JSON.stringify({
              accessToken: NessusAccessToken,
              secretKey: NessusSecretKey,
              apiToken: NessusApiToken,
                orgname:orgname
            }),
        });

        if (response.ok) {
            setLoading(false);
     toast.success("Submitted Successfully");
        } else {
            setLoading(false);
               toast.error("Failed , Chech the credential")
    }
 }
  catch (error) {
      
     console.log(error);
    }
      }

    


       

    }
  return (
    <div className={styles.jira_wrapper}>
      <div className={styles.jira_header}>
      Nessus Integration
      
      </div>
      <div className={styles.jira_body}>
<div className={styles.firstrow}>
    <UserInput onInuptValue={handelNessusAccessToken} placeholder="Enter Nessus Access Token" width="250px"/>
    <UserInput onInuptValue={handelNessusSecretKey}placeholder="Enter Nessus Secret Key" width="250px"/>
</div>

<div className={styles.thirdrow}>
<UserInput onInuptValue={handelNessusApiToken}  placeholder="Enter Nessus Api Token" width="57%"/>
</div>
<div className={styles.fourthrow}>
<LoadingButton
          onClick={handleClickCheckConnection}
          endIcon={<SendIcon />}
          loading={cclocading}
          loadingPosition="end"
          variant="contained"
        >
        Check Connection
        </LoadingButton>
      <LoadingButton
          onClick={handleClick}
          endIcon={<SendIcon />}
          loading={loading}
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

export default Nessus
