import Selects from "../components/select/Selects"
import styles from "./manualscan.module.css"
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import React, { useEffect } from "react";
import ScanComponent from "../components/scancomponent/ScanComponent";

const Manualscan = () => {
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState(0);
    const [socket, setSocket] = React.useState(null);
    const [selectedoption , setSelectedoption] = React.useState("");
    const [scanIds, setScanIds] = React.useState([]);  // Array to hold scanIds
    const [scanProgress, setScanProgress] = React.useState({});
const handleChange= (selected)=>{
    setSelectedoption(selected.value);
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
        setOptions(selectOptions);
        console.log("1")
      } catch (error) {
        console.log('Error fetching select option data:'+error);
      } finally {
        // Mark loading as complete
      }
    };


    fetchData();
},[])

const  handleClick = async() => {
  
  const componentId = Date.now();
    const socketInstance = io('http://localhost:5004'); // Adjust this URL as necessary
        setSocket(socketInstance);
    

    let targetUrl = selectedoption;
    if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'http://' + targetUrl;
    }
    console.log("oops " + targetUrl);

    // const newScanId = Date.now();  // Generate a unique scan ID (timestamp)
 
    // Use functional setState to ensure state update happens correctly
    // setScanIds(prevScanIds => {
    //     const updatedScanIds = [...prevScanIds, newScanId];  // Append new scanId
    //     console.log(updatedScanIds);  // Log updated scanIds
    //     return updatedScanIds;  // Return the updated array to set the new state
    // });

    const token = localStorage.getItem('jwtToken');
    try {
        // Send the target URL to the server
        socketInstance.emit('startScan', targetUrl, token,componentId);
        // Handle response or update the UI

        console.log("componentid "+targetUrl)
        
    } catch (error) {
        console.error('Error starting scan:', error);
    }

     socketInstance.on('startScan', (targetUrl) => {
       console.log("scan started")
     });

    socketInstance.on('spiderStatus', (data) => {
      const { url, status,cid } = data;

      updateStatusComponent(url , cid , status, 0);
    });

    socketInstance.on('scanStatus', (data) => {
      const { url, status,cid } = data;

      updateStatusComponent(url , cid , 100, status);
    });

}

const updateStatusComponent = async (url,cid,spiderstatus,scanprogress) => {
console.log("inside data"+ url , scanprogress,cid,spiderstatus)
  setScanProgress(prevProgress => {
    // Initialize the progress and status for a new scan
    const updatedProgress = {
        ...prevProgress,
        [cid]: {
            url:url,       // The URL of the scan
            spider:spiderstatus,  // The type of scan (e.g., 'spider', 'scan')
            scan:scanprogress   // The current status (e.g., 'started', 'in-progress', 'complete')        
        }
    };
    return updatedProgress;
  });
console.log( "data "+ JSON.stringify(scanProgress))
}


// socket.on('startScan', (targetUrl) => {
//     addStatusComponent(targetUrl + componentId);
//   });


//   socket.on('spiderStatus', (data) => {
//     const { url, status } = data;
//     updateStatusComponent(url + componentId, 'spider', status);
//   });
//   socket.on('scanStatus', (data) => {
//     const { url, status } = data;
//     updateStatusComponent(url + componentId, 'scan', status);
//   });
//   socket.on('scanComplete', (data) => {
//     const { url } = data;
//     showSpinner(url + componentId);
//   });
//   socket.on('generatedjson', (data) => {
//     const { url } = data;
//     hideSpinner(url + componentId);
//     const reportStatus = document.getElementById(`reportStatus-${encodeURIComponent(url + componentId)}`);
//     reportStatus.innerHTML = "Report Generated";
//     componentId = componentId + 1;
//   });
//   socket.on('error', (data) => {
//     const { url, message } = data;
//     updateStatusComponent(url + componentId, 'error', message);
//     hideSpinner(url + componentId);
//   });

const coustomStyles ={
    control:(provided) =>({
      ...provided,
      width:"200px",
      borderRadius:"8px",
      height:"40px",
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
       
 console.log("scan data "+JSON.stringify(scanProgress))
  return (
    <div className={styles.manualscan_wrapper}>
     
     <div className={styles.rowone}>
     <Selects onChange={handleChange} option={options} styles={coustomStyles} />
     <LoadingButton
      onClick={handleClick}
          loading={loading}
          loadingPosition="end"
          variant="contained">
          Start Scan
        </LoadingButton>
     </div>
     <div className={styles.rowtwo}>
      
     {
     Object.keys(scanProgress).map(scanId => (
      
       <ScanComponent key={scanProgress[scanId]} url={scanProgress[scanId].url} scanId={scanId} spiderprogress={scanProgress[scanId].spider} scanprogress={scanProgress[scanId].scan} />
   ))}
     </div>
    </div>
  )
}

export default Manualscan