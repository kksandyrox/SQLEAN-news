var db = require('../config/db');
var dateFormat = require('dateformat');

var News = {
    getHeadlines: function (params, callback) {
        return db.query('SELECT h.id, h.author, h.title, h.description, h.url, h.image, h.published, s.name as source, s.shortcode from headlines as h JOIN sources as S ON s.id = h.source_id order by h.published desc limit ' + params.start + ',' + params.end, callback);
    },

    getRandomSource: function (callback) {
        return db.query('SELECT * FROM sources WHERE shortcode IS NOT NULL order by RAND() limit 1', callback);
    },

    getSources: function (callback) {
        return db.query('SELECT * FROM sources WHERE shortcode IS NOT NULL limit 20', callback);
    },

    getPopularNews: function (callback) {
        return db.query('SELECT p.id, p.author, p.title, p.description, p.url, p.image, p.published, s.name as source, s.shortcode from popular as p JOIN sources as S ON s.id = p.source_id order by p.created desc limit 5', callback);
    },

    getSourceDetail: function (params, callback) {
        return db.query('SELECT * FROM headlines WHERE source_id = ' + params.id, callback);
    },

    createNews: function (NewsData, table, callback) {

        if (NewsData.urlToImage != null && (NewsData.urlToImage.indexOf("http://") == 0 || NewsData.urlToImage.indexOf("https://") == 0)) {
            
            db.query('Select id from headlines where title = ? limit 1', [NewsData.title], function (error, results, fields) {
                if (error) throw error;

                if (results.length == 0) {
                    return News.checkSource(NewsData, table, callback);
                }
            });
        }
    },

    createPopularNews: function (NewsData, callback) {
        db.query('Select id from popular where title = ? limit 1', [NewsData.title], function (error, results, fields) {
            if (error) throw error;

            if (results.length == 0) {
                return News.createNews(NewsData, 'popular', callback);
            }
        });
    },

    checkSource: function(NewsData, table, callback) {
        db.query('Select id from sources where name = ? limit 1', [NewsData.source.name], function (error, results, fields) {
            if (error) throw error;

            if (results.length == 0) {
                return News.insertSource(NewsData, table, callback);
            }
            else {
                return News.insertNews(results[0].id, NewsData, table, callback);
            }
        });
    },

    insertSource: function(NewsData, table, callback) {
        db.query('Insert into sources (name, shortcode) Values (?, ?)', [NewsData.source.name, NewsData.source.id], function(error, result) {

            if (error) throw error;

            return News.insertNews(result.insertId, NewsData, table, callback);
        });
    },

    insertNews: function(sourceId, NewsData, table, callback) {
        db.query(
            'Insert into ' + table + ' (source_id, author, title, description, content, url, image, published) Values (?, ?, ?, ?, ?, ?, ?, ?)', 
            [sourceId, NewsData.author, NewsData.title, NewsData.description, NewsData.content, NewsData.url, NewsData.urlToImage, dateFormat(NewsData.publishedAt, "yyyy-mm-dd hh:MM:ss")],
            function(error) {
                if (error) throw error;
            }
        );
    }
}

module.exports = News;