//The Current Status of the Website
//Available application status's for the website are listed and described below
//Live: Website is live. All Api keys must be live keys
//TestLive: Website is being hosted on firebase servers but is being run on test keys
//Test: Website is being run locally using test keys

process.env.TZ = 'America/Los_Angeles'

exports.applicationStatus = 'Test';

var d = new Date();
var n = d.getTimezoneOffset();
const offset = 7 - (n / 60); //Time Zone Offset



