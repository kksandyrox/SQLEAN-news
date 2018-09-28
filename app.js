var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var cron = require('node-cron');
var request = require('request');
var configuration = require('./config/config');
var News = require('./server/News');

app.use(cors());

var NewsController = require('./server/NewsController');
app.use('/news', NewsController);


cron.schedule('0 */15 * * * *', () => {
    // get top headlines
    request(configuration.headlinesApi + '?country=us&apiKey=' + configuration.apiKey + '&pageSize=' + configuration.totalResults, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        else {
            if (body.articles != null) {
                body.articles.forEach(function(news){
                    News.createNews(news, 'headlines');
                });
            }
        }
    });

    // get popular news for slider
    News.getRandomSource(function (err, rows) {
        if (err) { return console.log(err); }
        
        request(configuration.popularApi + '&apiKey=' + configuration.apiKey + '&pageSize=' + configuration.popularTotalResults + '&sources=' + rows[0].shortcode, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
    
            else {
                if (body.articles != null) {
                    body.articles.forEach(function(news){
                        News.createPopularNews(news);
                    });
                }
            }
        });
    });
});

app.use(express.static(path.join(__dirname, 'dist/node-news')));
app.use('/', express.static(path.join(__dirname, 'dist/node-news')));

module.exports = app;

