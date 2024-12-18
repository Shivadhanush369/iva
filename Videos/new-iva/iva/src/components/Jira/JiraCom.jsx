import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import toast from 'react-hot-toast';




import UserInput from '../Input/UserInput';
import styles from './JiraCom.module.css';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

const JiraCom = () => {
    const [loading, setLoading] = React.useState(false);
    const [cclocading,setCcloading] = React.useState(false);
    const [jirausername,setJirausername]= React.useState("");
    const [jiratoken,setJiraToken]= React.useState("");
    const [jiraurl,setJiraUrl]= React.useState("");
    const [jiraProjectKey,setJiraProjectKey]=React.useState("");
    const [jiraOrganization,setJiraOrganization]=React.useState("");
    
    function handelJirausername(value){
       
        setJirausername(value);
        
    }

    function handelJiratoken(value){
       
        setJiraToken(value);
        
    }
    function handelJiraurl(value){
       
        setJiraUrl(value);
        
    }
    function handelJiraproject(value){
       
        setJiraProjectKey(value);
        
    }
  
    function handelJiraOrgname(value){
        setJiraOrganization(value);
    }
    
    async function  handleClickCheckConnection(){
        setCcloading(true);
        console.log("jirausername "+jirausername);
        console.log("jiraurl "+jiraurl);
        console.log("jiraProjectKey "+jiraProjectKey);
        console.log("jiraOrganization "+jiraOrganization);
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch('http://localhost:5004/test-jira-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: jirausername,
                    jiraUsername: jirausername,
                    jiraToken: jiratoken,
                    jiraUrl: jiraurl,
                    projectKey: jiraProjectKey,
                    organizationName: jiraOrganization,
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
      if ( jirausername === "" && jiratoken === "" && jiraurl === "" && jiraProjectKey === "" && jiraOrganization === ""){
        toast.error("Failed , Check the credential");
        setLoading(false);
      }
      else{
      const token = localStorage.getItem('jwtToken');
if(jirausername =="")

      try {
        const response = await fetch('http://localhost:5004/submit-jira-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use the token from localStorage
            },
            body: JSON.stringify({
                username: jirausername,
                jiraUsername: jirausername,
                jiraToken: jiratoken,
                jiraUrl: jiraurl,
                projectKey: jiraProjectKey,
                organizationName: jiraOrganization,
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
      Jira Integration
      
      </div>
      <div className={styles.jira_body}>
<div className={styles.firstrow}>
    <UserInput onInuptValue={handelJirausername} placeholder="Enter Jira Username" width="250px"/>
    <UserInput onInuptValue={handelJiratoken}placeholder="Enter Jira Token" width="250px"/>
</div>
<div className={styles.secondrow}>
<UserInput onInuptValue={handelJiraurl}placeholder="Enter Jira Url" width="250px"/>
    <UserInput onInuptValue={handelJiraproject}  placeholder="Enter ProjectKey" width="250px"/>
</div>
<div className={styles.thirdrow}>
<UserInput onInuptValue={handelJiraOrgname}  placeholder="Enter Organization Name" width="57%"/>
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

export default JiraCom
