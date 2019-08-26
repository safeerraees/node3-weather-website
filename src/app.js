const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geoCode = require(`./utils/geocode`);
const forecast = require(`./utils/forecast`);

//express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const app = express();
const port = process.env.PORT || 3000;
//Setup handlebars
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Safeer',
        message: 'This is index page.'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Safeer',
        message: 'This is about page.'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpMessage: 'This is help page.',
        title: 'Help',
        name: 'Safeer'
    });
});


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided!'
        });
    }
    geoCode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            res.send({ error });
            return;
        }
        forecast(latitude, longitude, (error, { summary, temperature, precipProbability }) => {
            if (error) {
                res.send({ error });
                return;
            }
            const forecast = summary + ` It is currently ` + temperature + ` degrees out. There is a ` + precipProbability + `% chance of rain.`;

            res.send({
                forecast,
                location,
                address: req.query.address
            });
        });

    });

});

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.',
        title: '404',
        name: 'Safeer'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found.',
        title: '404',
        name: 'Safeer'
    })
});
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});