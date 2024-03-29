const request = require(`request`);

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/4c00bea58962c9858fd8279218b3864f/` + encodeURIComponent(latitude) + `,` + encodeURIComponent(longitude);
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback(`Unable to connect to weather service`, undefined);
        } else if (body.error) {
            callback(`Unable to find location.`, undefined)
        } else {
            const summary = body.daily.data[0].summary;
            const temperature = body.currently.temperature;
            const tempHigh = body.daily.data[0].temperatureHigh;
            const tempLow = body.daily.data[0].temperatureLow;
            const precipProbability = parseInt(100 * parseFloat(body.currently.precipProbability), 10);
            callback(undefined, summary + 'It is currently ' + temperature + 'degrees out. There is a ' + precipProbability +'% chance of rain. Today\'s high is ' + tempHigh + ' and today\'s low is ' + tempLow);
        }
    });

}
module.exports = forecast;
