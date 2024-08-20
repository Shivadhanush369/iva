const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const { URL } = require('url');
const ZAP_HOST = 'http://localhost:8080'; // Change this to your ZAP host
const API_KEY = 'sf1l9d7pvavoh4qfbkkvrh14h3';
const History = require('../models/History');
const Report = require('../models/Report');
// Define the History model (adjust the schema according to your needs)


async function spiderUrl(url) {
   
   
   
    
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/spider/action/scan/`, {
            params: {
                url: url,
                apikey: API_KEY
            }
        });
        return response.data.scan;
    } catch (error) {
        throw new Error(`Failed to start spider: ${error.message}`);
    }
}

async function checkSpiderStatus(scanId) {
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/spider/view/status/`, {
            params: {
                scanId: scanId,
                apikey: API_KEY
            }
        });
        return response.data.status;
    } catch (error) {
        throw new Error(`Failed to check spider status: ${error.message}`);
    }
}

async function startScan(url,cvssScore) {
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/ascan/action/scan/`, {
            params: {
                url: url,
                apikey: API_KEY,
                scanPolicyName : cvssScore
            }
        });
        return response.data.scan;
    } catch (error) {
        throw new Error(`Failed to start scan: ${error.message}`);
    }
}

async function checkScanStatus(scanId) {
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/ascan/view/status/`, {
            params: {
                scanId: scanId,
                apikey: API_KEY
            }
        });
        return response.data.status;
    } catch (error) {
        throw new Error(`Failed to check scan status: ${error.message}`);
    }
}

async function generateReport(Url,scanid) {
    try {
        console.log(Url);
        const parsedUrl = new URL(Url.url);
        const domain = parsedUrl.hostname;

        const response = await axios.get(`${ZAP_HOST}/OTHER/core/other/jsonreport/`, {
            params: {
                apikey: API_KEY,
                scanId: scanid
            }
        });
        const report1 = JSON.stringify(response.data);

        // Write the report to a file
        fs.writeFileSync(`${domain}.json`, report1);

        const report = response.data;
        report.scanId = scanid;
        report.url  = Url;
        console.log("Report generated");
       // save report in mongodb
      const reportDB = new Report({report});
      await reportDB.save();
     const vulnerabilities= await getAlertSummary(parsedUrl,API_KEY);

    
        // Save history of report to MongoDB
        const url = Url.url;
        const username = Url.username;
      const vulnerability = vulnerabilities.alertsSummary;
      const detailes = await getAlertsByRisk(3,url);
    
      const filteredAlerts = await categorizeAlertsByRisk(detailes);


     const history = new History({ username,url, date: new Date() ,vulnerability,filteredAlerts,scanid});
        await history.save();
        

        console.log('JSON Report generated and saved to MongoDB');
    } catch (error) {
        throw new Error(`Failed to generate JSON report: ${error}`);
    }
}

async function start(targetUrl) {
    try {
        console.log(`Starting spider for URL: ${targetUrl.url}`);
        const spiderScanId = await spiderUrl(targetUrl.url);
        console.log(`Spider started with ID: ${spiderScanId}`);

        let spiderStatus = '0';
        while (spiderStatus !== '100') {
            console.log("s");
            spiderStatus = await checkSpiderStatus(spiderScanId);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
        }

        console.log('Spider completed. Starting active scan...');
        const scanId = await startScan(targetUrl.url,targetUrl.cvssScore);
        console.log(`Scan started with ID: ${scanId}`);

        let scanStatus = '0';
        while (scanStatus !== '100') {
            scanStatus = await checkScanStatus(scanId);
            console.log("ss");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
        }

        console.log('Scan completed. Generating report...');
        await generateReport(targetUrl,scanId);

    } catch (error) {
        console.error(error.message);
    }
}






async function getAlertSummary(baseUrl, apiKey) {

    
   
    try {
      const response = await axios.get(`http://localhost:8080/JSON/alert/view/alertsSummary/`, {
        headers: {
          'Accept': 'application/json'
        },
        params: {
          apikey: apiKey,
          baseurl: baseUrl // Optionally filter by base URL
        }
      });
  
      const alertSummary = response.data;
      console.log("down "+JSON.stringify(alertSummary));
      return alertSummary;
    } catch (error) {
      console.error('Error fetching alert summary:', error);
    }
  }
  const getAlertsByRisk = async (risk,url) => {
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/core/view/alerts`, {
            params: {
                apikey: API_KEY,
                baseurl: url, // Leave empty to get all alerts
                start: 0,
                count: 1000,
                risk
            }
        });
        return response.data.alerts;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        throw error;
    }
};

const categorizeAlertsByRisk = (alerts) => {



    const categorizedAlerts = {
        high: [],
        medium: [],
        low: [],
        informational: []
    };


    alerts.forEach(alert => {
        switch (alert.risk) {
            case 'High': // High
                categorizedAlerts.high.push(alert);
                break;
            case 'Medium': // Medium
                categorizedAlerts.medium.push(alert);
                break;
            case 'Low': // Low
                categorizedAlerts.low.push(alert);
                break;
            case 'Informational': // Informational
                categorizedAlerts.informational.push(alert);
                break;
            default:
                console.warn(`Unknown risk level: ${alert.risk}`);
        }
    });

    return categorizedAlerts;
};
module.exports = { start };
