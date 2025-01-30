import { useEffect, useState } from "react";
import styles from "./Makechecker.module.css";
import Selects from "../components/select/Selects";
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';

import DataTable from "react-data-table-component";
import VulnerabilitiesToggle from "../components/Tabletoggle/VulnerabilitiesToggle";

const Makechecker = () => {
  const [options, setOptions] = useState([]); // Initialize options
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

      const [toolselected, setToolselected] = useState("0");
  
  const handeltoolonchange =(selected)=>{
    
    setToolselected(selected.value);
    

  }
 
    const [toolSelection, setToolSelection] = useState([{
        value: "Nessus",
        label: "Nessus",
      },
    {
      value: "Zap",
        label: "Zap",
    }
    ]);


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
}


 const tableStyle = {
  control: (provided) => ({
    ...provided,
    width: "100%", // Make it fully responsive
    maxWidth: "200px", // Limit the control's max width
    borderRadius: "6px", // Slightly reduced for subtle styling
    boxShadow: "none", // Maintain no shadow for a clean look
    textAlign: "left",
    border: "1px solid #ccc", // Added a border for better visibility
    fontSize: "14px", // Ensure text is readable
    padding: "4px", // Add some inner spacing for better usability
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "black" : "#666", // Make unselected text darker for readability
    backgroundColor: state.isSelected ? "#f0f0f0" : "white", // Use softer colors for better contrast
    padding: "8px 12px", // Add spacing for options
    fontSize: "14px", // Consistent font size
    cursor: "pointer", // Indicate clickable options
    ':hover': { 
      backgroundColor: "#f9f9f9", // Light hover effect
    },
  }),
};

const tableStyles={
  headCells:{
    style:{
      backgroundColor:"black",
      color:"white",
      fontSize : "12px",
      fontweight:"bolder",
      BsBorder:"1px solid black"
    }
  }
}


const handleCheckboxChange = (e, rowIndex) => {
  const updatedTableData = tableData.map((item, index) =>
    index === rowIndex ? { ...item, isChecked: e.target.checked } : item
  );
  setTableData(updatedTableData);
};


  const handleChange = async (selected) => {
    try {
      setTableData([]);
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:5004/history", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: selected.value, tool: toolselected }),
      });
  
      if (response.ok) {
        const scan = await response.json();
        let data = [];
        
        scan.forEach((scan) => {
          if (scan.filteredAlerts) {
            // Loop through the keys of the filteredAlerts object (high, medium, low)
            Object.keys(scan.filteredAlerts).forEach((key) => {
              let alerts = scan.filteredAlerts[key]; // Get the alerts for the current key
              if (Array.isArray(alerts)) {
                alerts.forEach((vuln) => {

                  console.log("ddata "+JSON.stringify(vuln))
                  data.push({
                    scanid: scan.scanid,
                    target: vuln.url || vuln.host,
                    risk: vuln.risk,
                    vulnerability: vuln.name,
                    ticket: vuln.ticketstatus,
                    desc: vuln.description,
                    attack:vuln.attack,
                    evidence:vuln.evidence,
                    parameter:vuln.parameter,
                    cweid:vuln.cweid,
                    wascid:vuln.wascid,
                    alertref:vuln.alertRef

                  });
                });
              }
            });
          }
        });
  
        console.log("Final scan data:", JSON.stringify(data)); // Log after data is populated
        setTableData(data);
      }
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  };
  


 

  const columns = [
    {
      name: "Check",
      cell: (row, index) => (
        <input
          type="checkbox"
          checked={row.isChecked || false}
          onChange={(e) => handleCheckboxChange(e, index)}
        />
      ),
      width: "70px",
    }
    ,
    {
      name: "ScanId",
      selector: (row) => row.scanid,
    },
    {
      name: "Target",
      selector: (row) => row.target, // Corrected from row.url to row.target
    },
    {
      name: "Risk",
      selector: (row) => row.risk, // Corrected from row.username to row.risk
    },
    {
      name: "Vulnerability",
      selector: (row) => row.vulnerability, // Corrected from row.scan_profile to row.vulnerability
    },
   
    {
      name: "Ticket",
      cell: (row) => <VulnerabilitiesToggle row={row} />,
    },
  ];
  
  useEffect(() => {
    const fetchOptions = async () => {
      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch("http://localhost:5004/scopes", {
          method: "Post",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          const formattedOptions = data.map((item) => ({
            value: item.url,
            label: item.name,
          }));
          setOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleClick = async () => {
    const checkedRows = tableData.filter(row => row.isChecked); // Get checked rows
    console.log("data "+ JSON.stringify(checkedRows));
    const selectedData = { data: [] };


    checkedRows.forEach(checkbox => {
      const rowData = {
         
          Alert: checkbox.vulnerability || "",
Description: checkbox.desc || "",
URL: checkbox.url || "",
Parameter: checkbox.parameter || "",
Attack: checkbox.attack || "",
Evidence: checkbox.evidence || "",
sourceid: parseInt(checkbox.sourceid, 10) || 0,
cweid: parseInt(checkbox.cweid, 10) || 0,
wascid: parseInt(checkbox.wascid, 10) || 0,
alertRef: parseInt(checkbox.alertref, 10) || 0,
label: parseInt(checkbox.label, 10) || 0

      };
      selectedData.data.push(rowData);
                  });

                  submitFalsePositive(selectedData);


  };
  

  async function submitFalsePositive(result)
  {
  
      try {
          // Make an API call using fetch
          const response = await fetch('http://127.0.0.1:5001/training', {
              method: 'POST',                       // HTTP method
              headers: {
                  'Content-Type': 'application/json' // Specify JSON content
              },
              body: JSON.stringify(result)         // Convert payload to JSON string
          });
  
          // Check if the response is successful
          if (response.ok) {
            toast.success("submitted falsepositive")
          } else {
            toast.error("falsepositive submission failed, please check the credential")

          }
      } catch (error) {
          console.error("Error during API call:", error);
           }
  
  }
  return (
    <div className={styles.maker_checker_wrapper}>
      <div className={styles.select}>
      <Selects placeholder="Select Tool" onChange={handeltoolonchange} option={toolSelection} styles={coustomStyles} />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Selects onChange={handleChange} option={options} styles={coustomStyles} />
        )}
      </div>
      <div className={styles.graph}>
        <DataTable columns={columns} pagination data={tableData} customStyles={tableStyles} />
      </div>
      <LoadingButton
     onClick={handleClick}
         loading={loading}
         loadingPosition="end"
         variant="contained">
         Submit FalsePositive
       </LoadingButton>
      <div>
        
      </div>
    </div>
  );
};

export default Makechecker;