import styles from "./Quad.module.css"
import * as Highcharts from 'highcharts';  // Load the Highcharts core
import 'highcharts/highcharts-more';  // Import the highcharts-more module (no need to call it as a function)
import HighchartsReact from 'highcharts-react-official';  // React wrapper for Highcharts
import {  useRef } from 'react';
// Initialize highcharts-more with Highcharts

const Splinechart = ({ data }) => {
   
  console.log("QuadchartData "+ JSON.stringify(data));

  const dates = data.dates;
  const highVulnerabilities = data.highVulnerabilities;
  const mediumVulnerabilities = data.mediumVulnerabilities;
  const lowVulnerabilities = data.lowVulnerabilities;

    
  // Ensure alertsMap and processedData are computed only when data is available
  if (!data || Object.keys(data).length === 0) {
    return <div className={styles.nodata}>No Data Available</div>;
  }

 

  const chartRef = useRef(null); // Create a ref for the chart container

  // Configure chart options
  const options = {
      chart: {
          type: 'spline',
          width: 1000,
          height: 400,
          events: {
              load: function () {
                  // Use ref to style the container if available
                  if (chartRef.current) {
                      chartRef.current.style.border = '2px solid grey';
                  }
              }
          }
      },
      title: {
          text: 'Risk Level Counts Over Time',
          align: 'left'
      },
      xAxis: {
          categories: dates,
          title: {
              text: 'Time'
          }
      },
      yAxis: {
          title: {
              text: 'Count'
          }
      },
      tooltip: {
          shared: true,
          formatter: function () {
              const points = this.points;
              let tooltipText = `<b>${this.x}</b><br/>`;

              let highRiskValue = 0;
              let mediumRiskValue = 0;
              let lowRiskValue = 0;

              points.forEach(point => {
                  if (point.series.name === 'High Risk') {
                      highRiskValue = point.y;
                  } else if (point.series.name === 'Medium Risk') {
                      mediumRiskValue = point.y;
                  } else if (point.series.name === 'Low Risk') {
                      lowRiskValue = point.y;
                  }
              });

              tooltipText += `<span style="color:#FF7F7F">High Risk: ${highRiskValue}</span><br/>`;
              tooltipText += `<span style="color:#E1AD01">Medium Risk: ${mediumRiskValue}</span><br/>`;
              tooltipText += `<span style="color:green">Low Risk: ${lowRiskValue}</span><br/>`;

              return tooltipText;
          }
      },
      plotOptions: {
          spline: {
              marker: {
                  enabled: true,
                  radius: 5,
                  symbol: 'circle'
              }
          }
      },
      series: [{
          name: 'High Risk',
          data: highVulnerabilities,
          color: '#FF7F7F'
      }, {
          name: 'Medium Risk',
          data: mediumVulnerabilities,
          color: '#E1AD01'
      }, {
          name: 'Low Risk',
          data: lowVulnerabilities,
          color: 'green'
      }],
      credits: {
          enabled: false
      }
  };

  return (
    <div  style={{
      minWidth: '250px', // Set the minimum width (example)
        maxWidth: '1000px',
        border:'3px solid rgb(202, 200, 200)',
      width: '100%', // 100% width of parent
      transition: 'all 0.3s ease', // Smooth transition for resizing
    }}>
      <HighchartsReact highcharts={Highcharts} options={options}/>
    </div>
  );
};

export default Splinechart;

