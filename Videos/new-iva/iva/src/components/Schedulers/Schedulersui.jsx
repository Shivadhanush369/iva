import React, { useEffect } from 'react'
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
import Selects from '../select/Selects';

const Schedulersui = () => {
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState(0);
  const [schedulescope, setScheduleScope] = React.useState("0");
  const [customScopeInput, setCustomScopeInput] = React.useState("0");
  const [cvssState, setCvssState] = React.useState("0");
  const [scheduledtimeHandle, setScheduledTimeHandle] = React.useState("0");
  const username = localStorage.getItem("username");
  let scope = "";
  const submitHandle =()=>{
    setLoading(true);




   console.log("schedulescope"+schedulescope);
   console.log("customScopeInput"+customScopeInput);
   console.log("cvssState"+cvssState);
   console.log("scheduledtimeHandle"+scheduledtimeHandle);
   const token = localStorage.getItem("jwtToken")
   if(schedulescope === '*'){
    
    scope = customScopeInput;
   if (!scope.startsWith('https://')) {
            
    scope = 'https://' + scope;
}
if (!scope.endsWith('/')) {

 
    scope += '/';
}

   }
   else{
    scope = schedulescope;
   }
   const data = {
    username : username,
    scope: scope,
    cvssScore: cvssState,
    scheduleTime: scheduledtimeHandle
};

if (!username || scope == "" || cvssState=="0" || scheduledtimeHandle =="0") {
 toast.error("Please check the credentials")
 setLoading(false);
}else{
fetch('http://localhost:5004/settingsb', {
  method: 'POST',
  headers: {
      'Authorization': `Bearer ${token}`, // include the retrieved token in the Authorization header
      'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
toast.success("Data submitted successfully")
setLoading(false);
})
.catch(error => {
  
  toast.error("Data submittion failed");
  console.error('Error:', error);
  setLoading(false);

});
}


   
  };



  const cvssScore = [
    {
      value: "low",
      label: "Low", // Changed "Label" to "label"
    },
    {
      value: "medium",
      label: "Medium", // Changed "Label" to "label"
    },
    {
      value: "high",
      label: "High", // Changed "Label" to "label"
    },
  ];
  const scheduledTime = [
    {
      value: 1,
      label: "Every Day", // Changed "Label" to "label"
    },
    {
      value: 7,
      label: "Every Week", // Changed "Label" to "label"
    },
    {
      value: 28,
      label: "Every Month", // Changed "Label" to "label"
    },
  ];
  
  const cvssHandle = (selected)=>{
    setCvssState(selected.value)
  }

  const handelfirstonchange =(selected)=>{
   
    setScheduleScope(selected.value);
  
  }

  const coustomStyles ={
    control:(provided) =>({
      ...provided,
      hight:"fit-content",
      width:"250px",
      borderRadius:"8px",
      boxShadow:"none",
      textAlign:"left"
      
    }),

    option:(provided,state )=>({
    ...provided,
    width:"200px",
    color:state.isSelected?"black":"grey",
    backgroundColor:state.isSelected?"lightgrey":"white",
    })
  };


  
 const scheduledHandle=(selected)=>{
  setScheduledTimeHandle(selected.value)
 }


useEffect(()=>{

  const token = localStorage.getItem('jwtToken');
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5004/scopes', {
          method: 'GET', // Specify the HTTP method
          headers: {
              'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
              'Content-Type': 'application/json' // Adjust content type if necessary
          }
      });
        const result = await response.json();
        let selectOptions = result.map((item) => ({
          value: item.url,
          label: item.name,
        }));
       
        selectOptions.push({value:"*",label:"*"});
        setOptions(selectOptions);
        console.log("options "+JSON.stringify(options))
        console.log("1")
      } catch (error) {
        console.log('Error fetching select option data:'+error);
      } finally {
        // Mark loading as complete
      }
    };
    fetchData();

},[]);

const customScopeInputhandle = (e)=>
{
  setCustomScopeInput(e.target.value);
  
}
  

  return (
    <div className={styles.jira_wrapper}>
    <div className={styles.jira_header}>
    Schedulers 
    
    </div>
    <div className={styles.jira_body}>
<div className={styles.firstrow}>

    <Selects  placeholder="Select your scope" onChange={handelfirstonchange} styles={coustomStyles} option={options}/>
    {schedulescope == "*" ? (<>
       <input onChange={(e)=> customScopeInputhandle(e)} placeholder="www.example.com"/>
       <Selects placeholder="Select your cvss" onChange={cvssHandle}  styles={coustomStyles} option={cvssScore}/>
       </>
) : (
  <Selects placeholder="Select your cvss" onChange={cvssHandle} styles={coustomStyles} option={cvssScore}/>
)}

</div>
<div className={styles.secondrow}>
<Selects placeholder="Scheduled Time" onChange={scheduledHandle}  styles={coustomStyles} option={scheduledTime}/>
</div>

<div className={styles.fourthrow}>

    <LoadingButton
       onClick={submitHandle}
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

export default Schedulersui
