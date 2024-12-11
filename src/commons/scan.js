const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const { URL } = require('url');
const ZAP_HOST = 'http://localhost:8080'; // Change this to your ZAP host
const API_KEY = 'sf1l9d7pvavoh4qfbkkvrh14h3';
const History = require('../models/History');
const Report = require('../models/Report');
const asidealerts = require('../models/asidealert');
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
async function generateReportforManualScan(url, sockets,scanid,username) {
    try {
        const parsedUrl = new URL(url);
    // Extract the hostname
    const domain = parsedUrl.hostname;
        const response = await axios.get(`${ZAP_HOST}/OTHER/core/other/jsonreport/`, {
            params: {
                apikey: API_KEY
            }
        });
           //in zap you if you are scanning multiple sites at single time, when requested for report sends combined report of all so
           let combinedReport = response.data;
           let site =[];
           console.log("length "+combinedReport.site.length);
         for (let i = 0; i < combinedReport.site.length; i++) {
            console.log(domain);
            const sites = combinedReport.site[i];
            console.log(JSON.stringify("normal sites host "+sites["@host"]));
            if (sites["@host"] === domain)
            {
                console.log("yes");
              site.push(sites);
            }
            else{
                console.log("no");
            }
        }
        let filteredreports = {
            "site": site
            };
        const report1 = JSON.stringify(filteredreports);
        // Write the report to a file
        fs.writeFileSync(`${domain}.json`, report1);
        const detailurl = {
            "url": url,
            "username":username
        };
        const report = filteredreports;
        report.scanId = scanid;
        report.url  = detailurl;
        console.log("Report generated");
       // save report in mongodb
      const reportDB = new Report({report});
      await reportDB.save();
      const vulnerabilities= await getAlertSummary(parsedUrl,API_KEY);
        // Save history of report to MongoDB
        const vulnerability = vulnerabilities.alertsSummary;
        const detailes = await getAlertsByRisk(3,url);
        const filteredAlerts = await categorizeAlertsByRisk(detailes);
     const history = new History({ username,url, date: new Date() ,vulnerability,filteredAlerts});
        await history.save();
   const medium = filteredAlerts.medium.length;
   const high = filteredAlerts.high.length;
   const low = filteredAlerts.low.length;
   console.log("into diff table");
     const alerts = new asidealerts({username,url,scanid,medium,high,low});
        await alerts.save();
        sockets.forEach(socket => socket.emit('generatedjson', { url: url }));
        console.log('JSON Report generated and saved to MongoDB');
    } catch (error) {
        throw new Error(`Failed to generate JSON report: ${error}`);
    }
}
async function generateReport(Url,scanid) {
    try {
        console.log("inside generate report url "+ JSON.stringify(Url));
        const parsedUrl = new URL(Url.url);
        console.log(JSON.stringify("inside generate report parsed url"+parsedUrl));
        const domain = parsedUrl.hostname;
        console.log("inside generate report domain"+ domain);
        const response = await axios.get(`${ZAP_HOST}/OTHER/core/other/jsonreport/`, {
            params: {
                apikey: API_KEY,
                scanId: scanid
            }
        });
        //in zap you if you are scanning multiple sites at single time, when requested for report sends combined report of all so
         let combinedReport = response.data;
           let site =[];
           console.log("length "+combinedReport.site.length);
         for (let i = 0; i < combinedReport.site.length; i++) {
            console.log(domain);
            const sites = combinedReport.site[i];
            console.log(JSON.stringify("normal sites host "+sites["@host"]));
            if (sites["@host"] === domain)
            {
                console.log("yes");
              site.push(sites);
            }
            else{
                console.log("no");
            }
        }
        let filteredreports = {
            "site": site
            };
        const report1 = JSON.stringify(filteredreports);
        // Write the report to a file
        fs.writeFileSync(`${domain}.json`, report1);
        const report = filteredreports;
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

     let filteredalerts = await categorizeAlertsByRisk(detailes);
     const filteredAlerts = await predictFalsePositive(filteredalerts);
     console.log(JSON.stringify(filteredAlerts))
     console.log("super done")

     const history = new History({ username,url, date: new Date() ,vulnerability,filteredAlerts});
        await history.save();
   const medium = filteredAlerts.medium.length;
   const high = filteredAlerts.high.length;
   const low = filteredAlerts.low.length;
   console.log("into diff table");
     const alerts = new asidealerts({username,url,scanid,medium,high,low});
        await alerts.save();
        console.log('JSON Report generated and saved to MongoDB');
    } catch (error) {
        throw new Error(`Failed to generate JSON report: ${error}`);
    }
}


async function predictFalsePositive(alerts){

    const selectedData = { data: [] };
    Object.keys(alerts).forEach(key => {
        
        const keysdata =  alerts[key];
        keysdata.forEach(vuln => {
            

            
                const rowData = {
                   
                    Alert: vuln.name || "",
Description: vuln.description || "",
URL: vuln.url || "",
Parameter: vuln.param || "",
Attack: vuln.attack || "",
Evidence: vuln.evidence || "",
sourceid: parseInt(vuln.sourceid, 10) || -1,
  cweid: parseInt(vuln.cweid, 10) || -1,
  wascid: parseInt(vuln.wascid, 10) || -1,
  alertRef: parseInt(vuln.alertRef, 10) || -1

                };
                selectedData.data.push(rowData);
                           
        });
    });


    try {
        // Make an API call using fetch
        const response = await fetch('http://127.0.0.1:5001/predict', {
            method: 'POST',                       // HTTP method
            headers: {
                'Content-Type': 'application/json' // Specify JSON content
            },
            body: JSON.stringify(selectedData)         // Convert payload to JSON string
        });

        // Check if the response is successful
        if (response.ok) {
            
            const responseData = await response.json();
           const result = await predictionDataIntoDb(responseData,alerts)
            console.log("Response from server:", responseData);
            console.log("False positive data successfully submitted!");
            console.log(JSON.stringify(result))
            console.log("now done ")
            return result;
        } else {
            console.log("Failed to submit false positive data:", response.statusText);
            console.log("Error submitting false positive data.");
        }
    } catch (error) {
        console.error("Error during API call:", error);
        alert("An error occurred while submitting false positive data.");
    }


}



async function predictionDataIntoDb(responseData, alerts) {
    // Create a new object to store the modified alerts
    let modifiedAlerts = JSON.parse(JSON.stringify(alerts)); // Deep copy of the alerts

    Object.keys(modifiedAlerts).forEach((key, index) => {
        const keysdata = modifiedAlerts[key];
        keysdata.forEach((vuln, vulnIndex) => {
            // Modify the prediction value based on responseData
            if (responseData[vulnIndex]) {
                vuln.prediction = "true";
            } else {
                vuln.prediction = "false";
            }
            console.log(vuln); // Log the modified vuln object for debugging
        });
    });

    // Return the modified alerts
    return modifiedAlerts;
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
    console.log("getsalerts",JSON.stringify(url));
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
module.exports = {
    spiderUrl,
    checkSpiderStatus,
    generateReportforManualScan,
    startScan,
    checkScanStatus,
    generateReport,
    start,
    getAlertSummary,
    getAlertsByRisk,
    categorizeAlertsByRisk
};

