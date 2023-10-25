const EdgeGrid = require('akamai-edgegrid');

const fetchTraffic = async function () {
    return new Promise(function (resolve, reject) {
        try {

            const now = new Date(Date.now());
            const minutefrom = (now.getUTCMinutes() - (now.getUTCMinutes() % 5)) - 5
            const minuteto = (now.getUTCMinutes() - (now.getUTCMinutes() % 5))
            
            const dtfrom = `${now.toISOString().split('T')[0]}T${now.getUTCHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${minutefrom.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:00Z`;
            const dtto = `${now.toISOString().split('T')[0]}T${now.getUTCHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${minuteto.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:00Z`;
            
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
                    "metrics": ["edgeBitsPerSecond", "edgeHitsPerSecond", "midgressBitsPerSecond", "midgressHitsPerSecond", "originBitsPerSecond", "originHitsPerSecond",
                        "bytesOffload", "hitsOffload"]
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
