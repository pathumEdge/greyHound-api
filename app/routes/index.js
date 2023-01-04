const scrape = require('./scrape')

module.exports = function (app, db) {
    scrape(app, db);
}
