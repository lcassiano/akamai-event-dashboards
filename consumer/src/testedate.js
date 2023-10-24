const now = new Date(Date.now());
const minutefrom = (now.getUTCMinutes() - (now.getUTCMinutes() % 5)) - 5
const minuteto = (now.getUTCMinutes() - (now.getUTCMinutes() % 5))

const dtfrom = `${now.toISOString().split('T')[0]}T${now.getUTCHours()}:${minutefrom.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:00Z`;
const dtto = `${now.toISOString().split('T')[0]}T${now.getUTCHours()}:${minuteto.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:00Z`;


console.log(dtfrom, dtto);
//console.log((now.getUTCMinutes()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));