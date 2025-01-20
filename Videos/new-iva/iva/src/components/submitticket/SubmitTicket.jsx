import UserInput from "../Input/UserInput";
import styles from "./submitticket.module.css";
import Selects from '../select/Selects';
import React, { useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import zIndex from "@mui/material/styles/zIndex";
import { useState } from "react";
import {toast} from "react-hot-toast"
const SubmitTicket = ({ row ,togfunc}) => {
  const [scanId, setScanId] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [vuln, setVuln] = React.useState("");
  const [assigne, setAssigne] = React.useState("");
 

  const type = [{
label:"Bug",
value:"10015"
  },
  {
    label:"Story",
    value:"10016"
  },
  {
    label:"Task",
    value:"10014"
  },
  {
      label:"Epic",
    value:"10017"
  }

];
  const [scanidd, setScanidd] = useState('');
  const [urll, setUrll] = useState('');
  const [vulnn, setVulnn] = useState('');
  const [summaryy, setSummaryy] = useState('');
  const [descriptionn, setDescriptionn] = useState('');
  const [typee, setTypee] = useState('');
  const [assignee, setAssignee] = React.useState("");


  // Initialize state values from `row` on component mount or when `row` changes
  useEffect(() => {
    if (row) {
      setScanId(row.scanid ? [{ value: row.scanid, label: row.scanid } ]: "");
      setUrl(row.target ? [{ value: row.target, label: row.target }] : "");
      setVuln(row.vulnerability ? [{ value: row.vulnerability, label: row.vulnerability }] : "");
      // Add other fields like `assignee` if needed
    }

let data =[];

  const asigneee = async ()=>{
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('http://localhost:5004/getAsignee', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });
    

   

      const res =  await response.json(); // Parse response as JSON
    console.log("asignee "+JSON.stringify(res))
    res.data.forEach((user) => {
           
      // Use displayName as the text
        data.push({label:user.displayName,value:user.accountId})
        console.log("asa "+JSON.stringify(data))
    });
    setAssigne(data)

  } catch (error) {
      console.error('Error fetching assignees:', error);
  }

 
  }

  asigneee();

   
  }, []);
 
  const SubmitTicket= async ()=>{
    const projectKey = 'SCRUM';
  
    const body = {
      projectKey: projectKey,
      assignee:assignee,
      summary:summaryy,
      description:descriptionn,
      issuetype:typee,
      scanid:scanidd,
      vulurl:urll,
      vulname:vulnn
  };
  console.log("here "+ JSON.stringify(body))
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5004/raiseticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    if (response.status === 201) {
     toast.success("Ticket Created Succefully")
     togfunc()
    } else {
    toast.error("Ticket Submission Failed")
    }
} catch (error) {
    console.error('Error creating ticket:', error);
}
  
  }
  

  const customStyles = {

    control: (provided) => ({
      ...provided,
      height: "fit-content",
      width: "250px",
      borderRadius: "8px",
      boxShadow: "none",
      textAlign: "left",
    }),
    option: (provided, state) => ({
      ...provided,
      width: "200px",
      color: state.isSelected ? "black" : "grey",
      backgroundColor: state.isSelected ? "lightgrey" : "white",
      zIndex:10000
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 2000, // Ensures the dropdown menu renders above everything else
    }),
  };
const scanidhandle = (selected)=>
  {
setScanidd(selected.value)
  }
  const urlhandle = (selected)=>
    {
  setUrll(selected.value)
    }
    const vulnhandle = (selected)=>
      {
    setVulnn(selected.value)
      }
      const sumhandle = (value)=>
        {
      setSummaryy(value)
        }
        const asigneehandle = (selected)=>
          {
        setAssignee(selected.value)
          }
          const deschandle = (value)=>
            {
          setDescriptionn(value)
            }
            const typehandel = (selected)=>
              {
            setTypee(selected.value)
              }
  return (
    <div className={styles.wrapper}>
      <div className={styles.firstrow}>
        <Selects onChange={scanidhandle} placeholder="Select your scanId" styles={customStyles} option={scanId} />
        <Selects onChange={urlhandle} placeholder="Select your URL" styles={customStyles} option={url} />
        <Selects onChange={vulnhandle} placeholder="Select Vulnerability" styles={customStyles} option={vuln} />
      </div>
      <div className={styles.secondrow}>
        <UserInput onInuptValue={sumhandle} placeholder="Summary" width="250px" />
        <Selects onChange={asigneehandle} placeholder="Select Assignee" styles={customStyles} option={assigne} />
        <UserInput onInuptValue={deschandle} placeholder="Description" width="250px" paddingbottom="0px" />
      </div>
      <div className={styles.thirdrow}>
        <Selects onChange={typehandel} placeholder="Type" styles={customStyles} option={type} />
      </div>
      <div className={styles.submit}>
        <LoadingButton
          endIcon={<SendIcon />}
          loadingPosition="end"
          variant="contained"
          onClick={SubmitTicket}
        >
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default SubmitTicket;
