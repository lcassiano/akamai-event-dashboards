#!/usr/bin/env node
//const { Client } = require("@elastic/elasticsearch");
require('dotenv').config()
const { Client } = require("@opensearch-project/opensearch");
const akamaiReports = require("./akamai-reports.js");

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

    if (docjson.data[0].bytesOffload) {

      console.log(`Starting to save ${indexPrefix}-${now.toISOString().split("T")[0]}!!!`)

      var trafficReport = {
        cpcode: 999999,
        "startdatetime": docjson.data[0].startdatetime,
        "bytesOffload": parseInt(docjson.data[0].bytesOffload),
        "edgeBitsPerSecond": parseFloat(docjson.data[0].edgeBitsPerSecond),
        "edgeHitsPerSecond": parseFloat(docjson.data[0].edgeHitsPerSecond),
        "hitsOffload": parseInt(docjson.data[0].hitsOffload),
        "midgressBitsPerSecond": parseFloat(docjson.data[0].midgressBitsPerSecond),
        "midgressHitsPerSecond": parseFloat(docjson.data[0].midgressHitsPerSecond),
        "originBitsPerSecond": parseFloat(docjson.data[0].originBitsPerSecond),
        "originHitsPerSecond": parseFloat(docjson.data[0].originHitsPerSecond)
      }

      client.index({
        index: `${indexPrefix}-${now.toISOString().split("T")[0]}`,
        body: trafficReport
      });

      console.log(`Index was saved ${indexPrefix}-${now.toISOString().split("T")[0]}!!!`)
    }
  }).catch((error) => console.log(error));

}

main();
