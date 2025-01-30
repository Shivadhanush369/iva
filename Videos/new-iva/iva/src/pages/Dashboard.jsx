import Cards from "../components/Cards/Cards";
import Selects from "../components/select/Selects";
import styles from "./Dashboard.module.css";
import DataTable from "react-data-table-component";

import { useEffect, useState } from "react";
import Notification from "../components/notification/Notification";
import Quadrantchart from "../components/Highcharts/Quadrantchart";
import LineChart from "../components/Highcharts/LineChart";
import ExampleDBPedia from "../components/chatbot/ExampleDBPedia";
import VulnerabilitiesToggle from "../components/Tabletoggle/VulnerabilitiesToggle";
import { Popup } from "../components/Popup/Popup";

const Dashboard = () => {
  const [toolselected, setToolselected] = useState("0");
  const [toolSelection, setToolSelection] = useState([
    { value: "Nessus", label: "Nessus" },
    { value: "Zap", label: "Zap" },
  ]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [cwe, setCwe] = useState(0);
  const [totoalScanned, setTotalScanned] = useState(0);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [options, setOptions] = useState(0);
  const [tabaleData, setTableData] = useState("");
  const [notificationData, setNotificationData] = useState([]);
  const [Quadrantchartdata, setQuadrantChartData] = useState([]);
  const [LineChartData, setLineChartData] = useState([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null); // To store the selected vulnerability
  const [showPopup, setShowPopup] = useState(false); // To manage popup visibility
  const [popupData, setPopupData] = useState(null); 

  const handlePopupClose = () => setShowPopup(false);

  const handleLowVulnerabilityClick = (data) => {
    setPopupData(data); // Set the low vulnerability data
    setShowPopup(true);  // Show the popup
    setSelectedVulnerability(data[0]); // Default selection for the first vulnerability
  };



  const columns = [
    {
      name: "ScanId",
      selector: (row) => row.scanid,
    },
    {
      name: "Url",
      selector: (row) => row.url,
    },
    {
      name: "Username",
      selector: (row) => row.username,
    },
    {
      name: "Profile",
      selector: (row) => row.scan_profile,
    },
    {
      name: "Date",
      selector: (row) => row.date,
    },
    {
      name: "Vulnerabilities",
      cell: (row) => (
        <div className={styles.tablebuttons}>
          <button
            onClick={() => tablePopup(row.filteredAlerts.high, "high",toolselected)}
            className={styles.buttondanger}
          >
            {row.vulnerability.High}
          </button>
          <button
            onClick={() => tablePopup(row.filteredAlerts.medium, "medium",toolselected)}
            className={styles.buttonwarning}
          >
            {row.vulnerability.Medium}
          </button>
          <button
            onClick={() => handleLowVulnerabilityClick(row.filteredAlerts.low)}
            className={styles.buttonsecondary}
          >
            {row.vulnerability.Low}
          </button>
        </div>
      ),
    },
  ];

  const tablePopup = (data, risk,tool) => {
    console.log("data " + JSON.stringify(data));
    console.log("risk " + risk);
  };

  const coustomStyles = {
    control: (provided) => ({
      ...provided,
      width: "200px",
      borderRadius: "8px",
      boxShadow: "none",
      textAlign: "left",
    }),
    option: (provided, state) => ({
      ...provided,
      width: "200px",
      color: state.isSelected ? "black" : "grey",
      backgroundColor: state.isSelected ? "lightgrey" : "white",
    }),
  };

  const handleChange = async (selected) => {
    setSelectedOption(selected);
    try {
      const token = localStorage.getItem("jwtToken");

      // Fetch Reports
      const reportResponse = await fetch("http://localhost:5004/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: selected.value ,  tool:toolselected}),
      });

      if (reportResponse.ok) {
        const data = await reportResponse.json();
        setCwe(data.length);
      }

      // Fetch Scanned Data
      const scannedResponse = await fetch("http://localhost:5004/scanned", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: selected.value , tool:toolselected}),
      });

      if (scannedResponse.ok) {
        const scannedData = await scannedResponse.json();
        setTotalScanned(scannedData.urlCount);
      }

      // Fetch Alert Count
      const alertResponse = await fetch("http://localhost:5004/alertCount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: selected.value , tool:toolselected }),
      });

      if (alertResponse.ok) {
        const alertData = await alertResponse.json();
        console.log("alertData "+ JSON.stringify(alertData));
        setTotalAlerts(alertData.alertCount);
      }

      // Fetch Table Data
      const historyResponse = await fetch("http://localhost:5004/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: selected.value, tool:toolselected  }),
      });

      if (historyResponse.ok) {
        const tableData = await historyResponse.json();
        setTableData(tableData);
      }

      // Fetch Quadrant Chart Data
      const quadrantResponse = await fetch("http://localhost:5004/api/alerts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: selected.value, tool:toolselected }),
      });

      if (quadrantResponse.ok) {
        const quadrantData = await quadrantResponse.json();
        setQuadrantChartData(quadrantData);
      }

      // Fetch Line Chart Data
      const lineChartResponse = await fetch(
        "http://localhost:5004/total-alerts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: selected.value, tool:toolselected }),
        }
      );

      if (lineChartResponse.ok) {
        const lineChartData = await lineChartResponse.json();
        setLineChartData(lineChartData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {

      const body={
        tool:toolselected
      }
      const token = localStorage.getItem("jwtToken");
      try {
        // Fetch Select Options
        const response = await fetch("http://localhost:5004/scopes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        });
        const result = await response.json();
        const selectOptions = result.map((item) => ({
          value: item.url,
          label: item.name,
        }));
        setOptions(selectOptions);

        // Fetch Notification Data
        const notificationResponse = await fetch("http://localhost:5004/alerts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (notificationResponse.ok) {
          const notificationData = await notificationResponse.json();
          setNotificationData(notificationData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [toolselected]); // Empty dependency array ensures this runs only once

  const tableStyle = {
    headCells: {
      style: {
        backgroundColor: "black",
        color: "white",
        fontSize: "17px",
        fontWeight: "bolder",
        border: "1px solid black",
      },
    },
  };

  const handeltoolonchange = (selected) => {
    setToolselected(selected.value);
  };

  return (
    <div>
      <div className={styles.dashboard_main}>
        <div className={styles.middle_container}>
          <div className={styles.dropdown}>
            <Selects
              placeholder="Select Tool"
              onChange={handeltoolonchange}
              option={toolSelection}
              styles={coustomStyles}
            />
            <Selects
              onChange={handleChange}
              option={options}
              styles={coustomStyles}
            />
          </div>
          <div className={styles.middlediv}>
            <div className={styles.cards_container}>
              <Cards
                icon={<img src="/public/bullish.png" alt="bullish" />}
                title="CWE"
                value={cwe}
              />
              <Cards
                icon={<img src="../../public/scan.png" alt="scan" />}
                title="Total Scans"
                value={totoalScanned}
              />
              <Cards
                icon={<img src="../../public/warning.png" alt="warning" />}
                title="Total Alerts"
                value={totalAlerts}
              />
            </div>
            <div className={styles.grafs_container}>
              <div className={styles.linechartc}>
                <LineChart data={LineChartData} />
              </div>
              <div className="quadchart">
                {/* <Quadrantchart data={Quadrantchartdata}/> */}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightc}>
          <Notification cdata={notificationData} />
          <Quadrantchart data={Quadrantchartdata} />
        </div>
      </div>
      <div className={styles.datatables}>
        <DataTable
          columns={columns}
          data={tabaleData}
          customStyles={tableStyle}
        />
      </div>
      {showPopup && popupData && (
  <div className={styles.popupContainer}>
    <div className={styles.popupContent}>
      {/* Left side - List of vulnerability names */}
      <div className={styles.vulnList}>
        <h3>Low Vulnerabilities</h3>
        <ul>
          {popupData.map((alert, index) => (
            <li
              key={index}
              onClick={() => setSelectedVulnerability(alert)} // Set the selected vulnerability
              className={styles.vulnName}
            >
              {alert.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Display details of the selected vulnerability */}
      <div className={styles.vulnDetails}>
  {selectedVulnerability && (
    <div>
      {/* Display general details if selectedVulnerability is available */}
      <h4>{selectedVulnerability.name || 'No name available'}</h4>
{console.log("actuall data "+ toolselected)}
      {console.log(selectedVulnerability)}
      {toolselected == "Zap" && (
        <>
          <p><strong>Url:</strong> {selectedVulnerability?.url || 'No name available'}</p>
          <p><strong>cweid:</strong> {selectedVulnerability?.cweid || 'No host available'}</p>
          <p><strong>Description:</strong> {selectedVulnerability?.description || 'No description available'}</p>
          <p><strong>Solution:</strong> {selectedVulnerability?.solution || 'No solution available'}</p>
          <p><strong>Prediction:</strong> {selectedVulnerability?.prediction || 'No synopsis available'}</p>

        </>
      )}

      {toolselected == "Nessus" && (
        <>
           <p><strong>Name:</strong> {selectedVulnerability?.name || 'No name available'}</p>
          <p><strong>Host:</strong> {selectedVulnerability?.host || 'No host available'}</p>
          <p><strong>Synopsis:</strong> {selectedVulnerability?.synopsis || 'No synopsis available'}</p>
          <p><strong>Description:</strong> {selectedVulnerability?.description || 'No description available'}</p>
          <p><strong>Solution:</strong> {selectedVulnerability?.solution || 'No solution available'}</p>
        </>
      )}

      {/* You can add additional tool-specific logic here (e.g., Tool3, ToolX) */}
    </div>
  )}
</div>


      {/* Close Button */}
      <button onClick={() => setShowPopup(false)} className={styles.closeButton}>Close</button>
    </div>
  </div>
)}

      <ExampleDBPedia />
    </div>
  );
};

export default Dashboard;
