import * as Highcharts from 'highcharts';  // Load the Highcharts core
import 'highcharts/highcharts-more';  // Import the highcharts-more module (no need to call it as a function)
import HighchartsReact from 'highcharts-react-official';
const LineChart = ({ data }) => {
    const dates = data.dates; // Ensure this matches the response structure
    const totalAlerts = data.totalAlerts; 
  
    const options = {
      chart: {
        type: 'line',
        zoomType: 'x',
      },
      title: {
        text: 'Vulnerabilities Overview',
      },
      credits: {
        enabled: false // Disable the Highcharts credits (logo)
      },
      xAxis: {
        categories: dates,
        title: {
          text: 'Date',
        },
      },
      yAxis: {
        title: {
          text: 'Total Vulnerabilities',
        },
      },
      series: [
        {
          name: 'Total Vulnerabilities',
          data: totalAlerts,
          marker: {
            enabled: true,
          },
        },
      ],
      tooltip: {
        shared: true,
        pointFormat: '<b>{point.y}</b>',
      },
    };
  
    return (
      <div style={{ width: '100%', maxWidth: '1000px' }}>  {/* Set the width here */}
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };
  
  export default LineChart;
  