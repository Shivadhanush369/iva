import styles from "./Quad.module.css"
import * as Highcharts from 'highcharts';  // Load the Highcharts core
import 'highcharts/highcharts-more';  // Import the highcharts-more module (no need to call it as a function)
import HighchartsReact from 'highcharts-react-official';  // React wrapper for Highcharts

// Initialize highcharts-more with Highcharts

const Quadrantchart = ({ data }) => {
   
    
  // Ensure alertsMap and processedData are computed only when data is available
  if (!data || Object.keys(data).length === 0) {
    return <div>Loading or No Data Available</div>;
  }

  const alertsMap = {
    high: {},
    medium: {},
    low: {},
    informational: {}
  };

  data.highVulnerabilities.forEach((desc) => {
    alertsMap.high[desc] = (alertsMap.high[desc] || 0) + 1;
  });

  data.mediumVulnerabilities.forEach((desc) => {
    alertsMap.medium[desc] = (alertsMap.medium[desc] || 0) + 1;
  });

  data.lowVulnerabilities.forEach((desc) => {
    alertsMap.low[desc] = (alertsMap.low[desc] || 0) + 1;
  });

  data.informationalVulnerabilities.forEach((desc) => {
    alertsMap.informational[desc] = (alertsMap.informational[desc] || 0) + 1;
  });

  const processedData = [];

  Object.entries(alertsMap.high).forEach(([name, count]) => {
    processedData.push({
      x: -1 + Math.random() * 0.4,
      y: 1 + Math.random() * 0.4,
      name: name,
      z: count * 10,
      color: 'red',
    });
  });

  Object.entries(alertsMap.medium).forEach(([name, count]) => {
    processedData.push({
      x: 1 + Math.random() * 0.4,
      y: 1 + Math.random() * 0.4,
      name: name,
      z: count * 10,
      color: 'orange',
    });
  });

  Object.entries(alertsMap.low).forEach(([name, count]) => {
    processedData.push({
      x: -1 + Math.random() * 0.4,
      y: -1 + Math.random() * 0.4,
      name: name,
      z: count * 10,
      color: 'yellow',
    });
  });

  Object.entries(alertsMap.informational).forEach(([name, count]) => {
    processedData.push({
      x: 1 + Math.random() * 0.4,
      y: -1 + Math.random() * 0.4,
      name: name,
      z: count * 10,
      color: 'blue',
    });
  });

  const options = {
    chart: {
        type: 'bubble',
        
        plotBorderWidth: 1,
        zooming: {
            type: 'xy'
        }
    },
    title: {
      text: 'Vulnerability Quadrants',
    },
    credits: {
      enabled: false, // Disable the Highcharts credits (logo)
    },
    xAxis: {
      title: {
        text: '',
      },
      gridLineWidth: 1,
      min: -2,
      max: 2,
      tickInterval: 1,
      labels: {
        enabled: false, // Disable labels on the x-axis
      },
      plotLines: [
        {
          color: 'black',
          width: 2,
          value: 0,
        },
      ],
    },
    yAxis: {
      title: {
        text: '',
      },
      gridLineWidth: 1,
      min: -2,
      max: 2,
      tickInterval: 1,
      labels: {
        enabled: false, // Disable labels on the y-axis
      },
      plotLines: [
        {
          color: 'black',
          width: 2,
          value: 0,
        },
      ],
    },
    series: [
      {
        name: 'Vulnerabilities',
        data: processedData,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            color: 'black',
            textOutline: 'none',
          },
        },
        colorByPoint: true, // Automatically apply colors based on the data
      },
      
    ],
    plotOptions: {
      bubble: {
        minSize: 15,
        maxSize: 50,
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}</b>',
        },
      },
      series: {
        events: {
          legendItemClick: function (event) {
            // Toggle the visibility of the clicked series
            this.setVisible(!this.visible);
            return false; // Prevent default action (do not toggle other series)
          },
        },
      },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      floating: false, // Set to false to position it at the bottom
      backgroundColor: 'white',
      borderColor: '#ccc',
      borderWidth: 1,
      shadow: false,
      itemStyle: {
        fontWeight: 'normal',
        fontSize: '12px', // Optional: Adjust the font size
      },
      y: 20, // Adjust as necessary to position the legend
    },
  };

  return (
    <div  style={{
      minWidth: '250px', // Set the minimum width (example)
        maxWidth: '500px',
      width: '100%', // 100% width of parent
      transition: 'all 0.3s ease', // Smooth transition for resizing
    }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Quadrantchart;

