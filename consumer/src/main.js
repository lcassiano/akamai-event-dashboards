#!/usr/bin/env node
//const { Client } = require("@elastic/elasticsearch");
require('dotenv').config()
const { Client } = require("@opensearch-project/opensearch");
const akamaiReports = require("./akamai-reports.js");

const FieldsData = [
  "bytesOffload",
  "edgeBitsPerSecond",
  "edgeHitsPerSecond",
  "hitsOffload",
  "midgressBitsPerSecond",
  "midgressHitsPerSecond",
  "originBitsPerSecond",
  "originHitsPerSecond"
]

const FieldsSummaryStatistics = [
  "bytesOffloadAvg",
  "bytesOffloadMax",
  "bytesOffloadMin",
  "bytesOffloadTotal",
  "edgeBitsPerSecondMax",
  "edgeBitsPerSecondMin",
  "edgeBytesTotal",
  "edgeHitsPerSecondMax",
  "edgeHitsPerSecondMin",
  "edgeHitsTotal",
  "hitsOffloadAvg",
  "hitsOffloadMax",
  "hitsOffloadMin",
  "hitsOffloadTotal",
  "midgressBitsPerSecondMax",
  "midgressBitsPerSecondMin",
  "midgressBytesTotal",
  "midgressHitsPerSecondMax",
  "midgressHitsPerSecondMin",
  "midgressHitsTotal",
  "originBitsPerSecondMax",
  "originBitsPerSecondMin",
  "originBytesTotal",
  "originHitsPerSecondMax",
  "originHitsPerSecondMin",
  "originHitsTotal"
]

function main() {

  const indexPrefix = process.env.ELK_INDEX_PREFIX;

  const osConfig = {
    node: process.env.ELK_URL,
    auth: {
      username: process.env.ELK_USER,
      password: process.env.ELK_PASS
    }
  };

  const client = new Client(osConfig)


  const result = akamaiReports.fetchTraffic();

  result.then((trafficObject) => {

    var docjson = JSON.parse(trafficObject);

    const now = new Date(Date.now())

    console.log(`Starting to save ${indexPrefix}-${now.toISOString().split("T")[0]}!!!`)

    docjson.data.forEach((doc) => {

      var trafficReport = {
        cpcode: 999999,
        "@timestamp": doc.startdatetime,
        originalData: {
        },
      }

      FieldsData.forEach((dItem) => {
        if (dItem.includes("PerSecond"))
          trafficReport[`${dItem}`] = parseFloat(doc[`${dItem}`]);
        else
          trafficReport[`${dItem}`] = parseInt(doc[`${dItem}`]);
      });

      trafficReport.originalData = doc;
      try {
        client.index({
          index: `${indexPrefix}-${now.toISOString().split("T")[0]}`,
          id: `${doc.startdatetime}`,
          body: trafficReport
        });
      } catch (error) {
        console.log(error);
        console.dir(trafficReport);
      }
    });

    console.log(`Index was saved (${docjson.data.length} docs) ${indexPrefix}-${now.toISOString().split("T")[0]}!!!`)

    if (docjson.summaryStatistics.edgeBytesTotal != undefined) {

      console.log(`Starting to save total-${indexPrefix}-${now.toISOString().split("T")[0]}!!!`)

      var trafficReportTotal = {
        cpcode: 999999,
        "Updatedate": now.toISOString().split("T")[0],
        "@timestamp": now.toISOString(),
        summaryStatistics: {

        },
        originalsummaryStatistics: {

        },
      }

      FieldsSummaryStatistics.forEach((sItem) => {
        if (sItem.includes("PerSecond") || sItem.includes("BytesTotal") || sItem.includes("BytesTotal"))
          trafficReportTotal.summaryStatistics[`${sItem}`] = parseFloat(docjson.summaryStatistics[`${sItem}`].value);
        else
          trafficReportTotal.summaryStatistics[`${sItem}`] = parseInt(docjson.summaryStatistics[`${sItem}`].value);
      });

      trafficReportTotal.originalsummaryStatistics = docjson.summaryStatistics;

      try {
        client.index({
          index: `total-${indexPrefix}-${now.toISOString().split("T")[0]}`,
          id: `${now.toISOString().split("T")[0]}`,
          body: trafficReportTotal
        });

      } catch (error) {
        console.log(trafficReportTotal);
      }

      console.log(`Index was saved total-${indexPrefix}-${now.toISOString().split("T")[0]}!!!`)
    }

  }).catch((error) => console.log(error));

}

main();
