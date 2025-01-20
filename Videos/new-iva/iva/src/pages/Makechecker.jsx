import { useEffect, useState } from "react";
import styles from "./Makechecker.module.css";
import Selects from "../components/select/Selects";
import DataTable from "react-data-table-component";
import VulnerabilitiesToggle from "../components/Tabletoggle/VulnerabilitiesToggle";

const Makechecker = () => {
  const [options, setOptions] = useState([]); // Initialize options
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [tableData, setTableData] = useState([]);

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


  const handleCheckboxChange = (e, row) => {
    const isChecked = e.target.checked;
    const updatedTableData = tableData.map((item) =>
      item.scanid === row.scanid ? { ...item, isChecked } : item
    );
    setTableData(updatedTableData);
    console.log("Updated row:", { ...row, isChecked });
  };

  const handleChange = async (selected) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:5004/history", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: selected.value }),
      });
      if (response.ok) {
        const scan = await response.json();
        

        let data=[];


        scan.forEach(scan => {
        console.log("scan data"+ JSON.stringify(data))
          // Check if filteredAlerts exists and contains high, medium, and low
          if (scan.filteredAlerts) {
              // Loop through the keys of the filteredAlerts object (high, medium, low)
              Object.keys(scan.filteredAlerts).forEach(key => {
                let alerts =[];
               
                  alerts = scan.filteredAlerts[key]; // Get the alerts for the current key
                  if(Array.isArray(alerts)){
                  alerts.forEach(vuln => {
                    data.push({
                      scanid: scan.scanid,
                      target: vuln.url,
                      risk: vuln.risk,
                      vulnerability: vuln.name,
                      ticket: vuln.ticketstatus
                  });  
      
    
                  });
                }
              });
          }
      });
      setTableData(data);
      }
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  };


 

  const columns = [
    {
      name: "Check",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.isChecked || false}
          onChange={(e) => handleCheckboxChange(e, row)}
        />
      ),
      width: "70px",
    },
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
          method: "GET",
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

  return (
    <div className={styles.maker_checker_wrapper}>
      <div className={styles.select}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Selects onChange={handleChange} option={options} styles={tableStyle} />
        )}
      </div>
      <div className={styles.graph}>
        <DataTable columns={columns} pagination data={tableData} customStyles={tableStyles} />
      </div>
    </div>
  );
};

export default Makechecker;