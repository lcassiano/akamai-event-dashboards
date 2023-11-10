const EdgeGrid = require('akamai-edgegrid');

function subtractMinutesFromDate(date, min) {
    date.setMinutes(date.getMinutes() - min);
    return date;
}

const fetchTraffic = async function () {
    return new Promise(function (resolve, reject) {
        try {


            const tempDate = new Date(Date.now());
            const now = new Date(Date.now());
            const nowFrom = subtractMinutesFromDate(tempDate, 5);

            const minutefrom = (nowFrom.getUTCMinutes() - (nowFrom.getUTCMinutes() % 5))
            const minuteto = (now.getUTCMinutes() - (now.getUTCMinutes() % 5))

            const dtfrom = `${nowFrom.toISOString().split('T')[0]}T00:00:00Z`;
            //const dtfrom = `${nowFrom.toISOString().split('T')[0]}T${nowFrom.getUTCHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${minutefrom.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:00Z`;
            const dtto = `${now.toISOString().split('T')[0]}T${now.getUTCHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${minuteto.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:00Z`;
            
            var eg = new EdgeGrid({
                path: '.edgerc',
                section: 'default'
            });

            let url = `/reporting-api/v1/reports/todaytraffic-by-time/versions/1/report-data?start=${dtfrom}&end=${dtto}&interval=FIVE_MINUTES&trace=true`;
            console.log(url)

            const fetchEventsParams = {
                path: `${url}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "objectType": "cpcode",
                    "objectIds": ["all"],
                    "metrics": [
                        "bytesOffload",
                        "bytesOffloadAvg",
                        "bytesOffloadMax",
                        "bytesOffloadMin",
                        "bytesOffloadSlope",
                        "bytesOffloadTotal",
                        "edgeBitsPerSecond",
                        "edgeBitsPerSecondMax",
                        "edgeBitsPerSecondMin",
                        "edgeBytesSlope",
                        "edgeBytesTotal",
                        "edgeHitsPerSecond",
                        "edgeHitsPerSecondMax",
                        "edgeHitsPerSecondMin",
                        "edgeHitsSlope",
                        "edgeHitsTotal",
                        "hitsOffload",
                        "hitsOffloadAvg",
                        "hitsOffloadMax",
                        "hitsOffloadMin",
                        "hitsOffloadSlope",
                        "hitsOffloadTotal",
                        "midgressBitsPerSecond",
                        "midgressBitsPerSecondMax",
                        "midgressBitsPerSecondMin",
                        "midgressBytesSlope",
                        "midgressBytesTotal",
                        "midgressHitsPerSecond",
                        "midgressHitsPerSecondMax",
                        "midgressHitsPerSecondMin",
                        "midgressHitsSlope",
                        "midgressHitsTotal",
                        "originBitsPerSecond",
                        "originBitsPerSecondMax",
                        "originBitsPerSecondMin",
                        "originBytesSlope",
                        "originBytesTotal",
                        "originHitsPerSecond",
                        "originHitsPerSecondMax",
                        "originHitsPerSecondMin",
                        "originHitsSlope",
                        "originHitsTotal"
                    ]
                }
            };

            eg.auth(fetchEventsParams);
            eg.send(function (error, response, body) {
                try {
                    if (error) {
                        console.dir(error);
                        return reject(body);
                    }
                    return resolve(body);
                }
                catch (error) {
                    return reject(error);
                }
            });
        }
        catch (error) {
            return reject(error);
        }
    });
};

module.exports = { fetchTraffic };
