import Selects from "../components/select/Selects";
import { useEffect, useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import styles from "./Analytics.module.css"
import Splinechart from "../components/Highcharts/Splinechart";
const Analytics = () => {
    const [toolselected, setToolselected] = useState("0");
        const [options, setOptions] = useState(0);
        const [splinedata, setSplinedata] = useState(0);
    const [selectedoption , setSelectedoption] = useState("");
    const [loading, setLoading] = useState(false);

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
    };
  
 

const handleChange= (selected)=>{
  setSelectedoption(selected.value);

}
const  handleClick = async() => {

  const token = localStorage.getItem("jwtToken");

  try{
  const splineResponse = await fetch("http://localhost:5004/analytics", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: selectedoption, tool:toolselected }),
  });

  if (splineResponse.ok) {
    const quadrantData = await splineResponse.json();
    setSplinedata(quadrantData);
  }
  }
  catch (error) {
    console.error("Error fetching data:", error);
  }

}



useEffect(()=>{

    

    const token = localStorage.getItem('jwtToken');
    const fetchData = async () => {

    const body={
      tool:toolselected
    }

      try {
        const response = await fetch('http://localhost:5004/scopes', {
          method: 'POST', // Specify the HTTP method
          headers: {
              'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
              'Content-Type': 'application/json' // Adjust content type if necessary
          },
          body: JSON.stringify(body)
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
},[toolselected])
    
  return (
    <div className={styles.manualscan_wrapper}>
     
    <div className={styles.rowone}>
    <Selects placeholder="Select Tool" onChange={handeltoolonchange} option={toolSelection} styles={coustomStyles} />

    <Selects onChange={handleChange} option={options} styles={coustomStyles} />
    <LoadingButton
     onClick={handleClick}
         loading={loading}
         loadingPosition="end"
         variant="contained">
         Analytics
       </LoadingButton>
    </div>
    <div className={styles.rowtwo}>
<Splinechart data={splinedata}/>
      </div>
      </div>
  )
}

export default Analytics
