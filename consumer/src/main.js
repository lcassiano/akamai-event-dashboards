var EdgeGrid = require('akamai-edgegrid');

var eg = new EdgeGrid({
    path: '.edgerc',
    section: 'default'
});

const nowto = new Date(Date.now());
const nowfrom = new Date(nowto - 30000);

const url = `/reporting-api/v1/reports/todaytraffic-by-time/versions/1/report-data?start=${nowfrom.toISOString()}&end=${nowto.toISOString()}&interval=ONE_MINUTE&trace=true`


const fetchEventsParams = {
    path: `${url}`,
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: {
        "objectType": "cpcode",
        "objectIds": ["1463336", "1123096", "1070422", "79448", "1106622"],
        "metrics": ["edgeHitsPerSecond", "originHitsPerSecond", "hitsOffload",
            "midgressHitsPerSecond", "edgeBitsPerSecond", "midgressBitsPerSecond", "originBitsPerSecond",
            "bytesOffload"]
    }
};

eg.auth(fetchEventsParams);

eg.send(function (error, response, bodyreturn) {
    if (error) {
        console.log(error);
    }
    else {

        const json = JSON.parse(bodyreturn);

        client.index({
            index: `akamai-via-reports-${now.toISOString().split("T")[0]}`,
            body: JSON.stringify(json.data[0])
        })
    }
});