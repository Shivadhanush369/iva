
import Cards from "../components/Cards/Cards";
import Selects from "../components/select/Selects";
import styles from "./Dashboard.module.css";
import DataTable from "react-data-table-component"

import { useEffect,useState } from "react";
import Notification from "../components/notification/Notification";
import Quadrantchart from "../components/Highcharts/Quadrantchart";
import LineChart from "../components/Highcharts/LineChart";
const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [cwe, setCwe] = useState(0);
  const [totoalScanned, setTotalScanned] = useState(0);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [options, setOptions] = useState(0);
  const [tabaleData, setTableData] = useState("");
  const [notificationData, setNotificationData] = useState([]);
const[Quadrantchartdata,setQuadrantChartData]=useState([]);
const[LineChartData,setLineChartData]=useState([]);

  const columns =[
    {
      name:"ScanId",
      selector: row=>row.scanid
    },
    {
      name:"Url",
      selector: row=>row.url
    },
    {
      name:"Username",
      selector: row=>row.username
    },
    {
      name:"Profile",
      selector: row=>row.scan_profile
    },
    {
      name:"Date",
      selector: row=>row.date
    },
    {
      name: "Vulnerabilities",
      cell: row => (
          <div className={styles.tablebuttons}>
            <button  onClick={() => tablePopup(row.filteredAlerts.high, 'high')} className={styles.buttondanger}>
            
                  {row.vulnerability.High}
             
              </button>
              <button onClick={() => tablePopup(row.filteredAlerts.medium, 'medium')}className={styles.buttonwarning}>
             
                  {row.vulnerability.Medium}
            
              </button>
              <button onClick={() => tablePopup(row.filteredAlerts.low, 'low')} className={styles.buttonsecondary}>
            
                  {row.vulnerability.Low}
          
              </button>
          </div>
      ),
  },
  ]
 const tablePopup =(data,risk)=>{

  console.log("data "+data)
  console.log("risk "+risk)

 }
 

  const coustomStyles ={
    control:(provided) =>({
      ...provided,
      width:"200px",
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

  const handleChange = async (selected) => {
    setSelectedOption(selected);
    console.log("selected option "+ JSON.stringify(selectedOption))
console.log(selected)
    // Make the API call
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:5004/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url: selected.value })
        });

        if (!response.ok) {
            console.log("error")
        }else{

        const data = await response.json();
        if(data){
         setCwe(data.length);
        }
       
        
      }
    } 
    catch (error) {
        console.error('Error fetching issues:', error);
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('http://localhost:5004/scanned', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ url: selected.value })
      });

      if (!response.ok) {
          console.log("error")
      }else{

      const data = await response.json();
      
      if(data){
      
      setTotalScanned(data.urlCount);
      }
     
      
    }
  } 
  catch (error) {
      console.error('Error fetching issues:', error);
  }


  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:5004/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: selected.value })
    });

    if (!response.ok) {
        console.log("error")
    }else{

    const data = await response.json();
    if(data){
     setCwe(data.length);
    }
   
    
  }
} 
catch (error) {
    console.error('Error fetching issues:', error);
}

try {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch('http://localhost:5004/alertCount', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url: selected.value })
  });

  if (!response.ok) {
      console.log("error")
  }else{

  const data = await response.json();
  
  if(data){
  
  setTotalAlerts(data.alertCount);
  }
 
  
}
} 
catch (error) {
  console.error('Error fetching issues:', error);
}
   

try {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch('http://localhost:5004/history', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url: selected.value })
  });

  if (!response.ok) {
      console.log("error")
  }else{

  const data = await response.json();
  if(data){
  
   setTableData(data)
  }
 
  
}
} 
catch (error) {
  console.error('Error fetching issues:', error);
}


const fetchquadrantdata= async () => {
  try {
    const token = localStorage.getItem('jwtToken');

    const response = await fetch('http://localhost:5004/api/alerts', {
      method: 'POST', // Specify the HTTP method
      headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json' // Adjust content type if necessary
      },
      body: JSON.stringify( {url:selected.value} )
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
}
else{
const data = await response.json();
console.log("content"+ JSON.stringify(data))
setQuadrantChartData(data);

console.log("notifydata "+ JSON.stringify(notificationData))


}

    console.log("1")
  } catch (error) {
    console.log('Error fetching noti  data:'+error);
  } finally {
    // Mark loading as complete
  }
};
fetchquadrantdata()
const fetchlinechartdata= async () => {
  try {
    const token = localStorage.getItem('jwtToken');

    const response = await fetch('http://localhost:5004/total-alerts', {
      method: 'POST', // Specify the HTTP method
      headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json' // Adjust content type if necessary
      },
      body: JSON.stringify( {url:selected.value} )
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
}
else{
const data = await response.json();
console.log("content"+ JSON.stringify(data))
setLineChartData(data);

console.log("notifydata "+ JSON.stringify(notificationData))


}

    console.log("1")
  } catch (error) {
    console.log('Error fetching noti  data:'+error);
  } finally {
    // Mark loading as complete
  }
};
fetchlinechartdata()




  };

  useEffect(() => {
    console.log("10");
    // Define an async function to fetch data
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

    const fetchnotificationdata= async () => {
      try {
        const response = await fetch('http://localhost:5004/alerts', {
          method: 'POST', // Specify the HTTP method
          headers: {
              'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
              'Content-Type': 'application/json' // Adjust content type if necessary
          }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    else{
const data = await response.json();
console.log("content"+ JSON.stringify(data))
setNotificationData(data);

console.log("notifydata "+ JSON.stringify(notificationData))


    }
    
        console.log("1")
      } catch (error) {
        console.log('Error fetching noti  data:'+error);
      } finally {
        // Mark loading as complete
      }
    };

    fetchnotificationdata()
    fetchData(); // Call the async function
  }, []);


const tableStyle={
  headCells:{
    style:{
      backgroundColor:"black",
      color:"white",
      fontSize : "17px",
      fontweight:"bolder",
      BsBorder:"1px solid black"
    }
  }
}

return (
<div>
  <div className={styles.dashboard_main}>
    <div className={styles.middle_container}>
    <div className={styles.dropdown}>
      <Selects onChange={handleChange} option={options} styles={coustomStyles} />
    </div>
    <div className={styles.middlediv}>
      <div className={styles.cards_container}>
        <Cards icon={<img src="../../public/bullish.png" alt="bullish" />} title="CWE" value={cwe} />
        <Cards icon={<img src="../../public/scan.png" alt="scan" />} title="Total Scans" value={totoalScanned} />
        <Cards icon={<img src="../../public/warning.png" alt="warning" />} title="Total Alerts" value={totalAlerts} />
        
      </div>
      <div className={styles.grafs_container}>
      <div className={styles.linechartc} >
        {/* <Quadrantchart data={Quadrantchartdata}/> */}
       <LineChart data={LineChartData}/>
        </div> 
        <div className="quadchart">
        {/* <Quadrantchart data={Quadrantchartdata}/>  */}
        </div>
    {/* <Notification cdata={notificationData}/> */}
     
      </div>
      
    </div>
    
    </div>
    <div className={styles.rightc}>
    <Notification cdata={notificationData}/>

    <Quadrantchart data={Quadrantchartdata}/> 
   
    </div>
   
  </div>
  <div className={styles.datatables}>
  <DataTable columns={columns} data={tabaleData} customStyles={tableStyle} />
</div>
</div>

);

}

export default Dashboard
