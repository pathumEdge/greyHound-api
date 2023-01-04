const puppeteer = require('puppeteer');

module.exports = function (app) {


    app.post('/scrape/getRaces', (req, res) => {

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            try {
                await page.setViewport({ width: 1024, height: 2400 });

                //intialize web page
                // await page.goto('https://www.gbgb.org.uk/racing/results/?raceDate=2022-12-01');
                await page.goto(req.body.url, { timeout: 20000 })


                const allRaceButtn = "#app > main > section > div > div.LiveResultsPagination > div.LiveResultsPagination__pageSizes > div:nth-child(3)"
                await page.waitForSelector(allRaceButtn);
                await page.click(allRaceButtn);

                //wait for loading data
                const paginationSelctor = '#app > main > section > div > div.LiveResultsTable.LiveResultsTable--sorting > div:nth-child(50)';
                await page.waitForSelector(paginationSelctor);

                delay(1000);

                //wait for loading data
                const resultsSelector = '.LiveResultsRow__winner';
                await page.waitForSelector(resultsSelector);


                const mainDiv = '.LiveResultsRow';
                const returnArray = await page.evaluate(mainDiv => {
                    return [...document.querySelectorAll(mainDiv)].map(item => {
                        var obj = {}
                        obj.LiveResultsRow__track = item.querySelector('.LiveResultsRow__track').textContent
                        obj.LiveResultsRow__race_class = item.querySelector('.LiveResultsRow__race_class').textContent
                        obj.LiveResultsRow__distance = item.querySelector('.LiveResultsRow__distance').textContent
                        obj.LiveResultsRow__date = item.querySelector('.LiveResultsRow__date').textContent
                        obj.LiveResultsRow__time = item.querySelector('.LiveResultsRow__time').textContent
                        obj.LiveResultsRow__winner = item.querySelector('.LiveResultsRow__winner a').textContent
                        obj.LiveResultsRow__winner_img = item.querySelector('.LiveResultsRow__winner img').getAttribute('src')
                        obj.goToUrl = item.querySelector('.LiveResultsRow__details a').getAttribute('href')


                        return obj
                    });
                }, mainDiv);


                await browser.close();

                res.send({
                    "status": 1,
                    "message": "success",
                    "Result": returnArray,
                })

            } catch (error) {
                res.send({
                    "status": 0,
                    "message": "Scraping Failed.. Please check date and try again",
                })
            }

        })();


    });


    app.post('/scrape/getData', (req, res) => {

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            try {
                //intialize web page
                // await page.goto('https://www.gbgb.org.uk/meeting/?meetingId=391477&raceId=892748&fbclid=IwAR2_U9nxBRunMRbBIZRSKsx0SiTyed6KZkQDIcOmWRcbxu1Z5xbSInPPHQU#search');
                await page.goto(req.body.url, { timeout: 20000 });


                const fullMeetingButtonSelector = "#app > main > section > div.Meeting__inner > div.MeetingFilter > div > div:nth-child(1)"
                await page.waitForSelector(fullMeetingButtonSelector);
                await page.click(fullMeetingButtonSelector);

                //wait for loading data
                const resultsSelector = '.MeetingRaceTrap__greyhound';
                await page.waitForSelector(resultsSelector);


                const mainDiv = '.MeetingRace';
                const returnArray = await page.evaluate(mainDiv => {
                    return [...document.querySelectorAll(mainDiv)].map(item => {
                        var obj = {}
                        obj.raceTime = item.querySelector('.MeetingRace__header .MeetingRace__time').textContent
                        obj.raceTrack = item.querySelector('.MeetingRace__header .MeetingRace__track').textContent
                        obj.raceClass = item.querySelector('.MeetingRace__header .MeetingRace__class').textContent
                        obj.raceDistance = item.querySelector('.MeetingRace__header .MeetingRace__distance').textContent
                        obj.racePrizes = item.querySelector('.MeetingRace__header .MeetingRace__prizes').textContent
                        obj.raceAllownce = item.querySelector('.MeetingRace__footer .MeetingRace__allowance').textContent
                        obj.raceForcast = item.querySelector('.MeetingRace__footer .MeetingRace__forecast').textContent
                        obj.raceTricast = item.querySelector('.MeetingRace__footer .MeetingRace__tricast').textContent


                        // const tds = Array.from(item.querySelectorAll('.MeetingRace__wrapper .MeetingRace__table .MeetingRaceTrap'))
                        const innerTableData = [...item.querySelectorAll('.MeetingRace__wrapper .MeetingRace__table .MeetingRaceTrap')]
                        const table = innerTableData.map(item1 => {

                            var tblObj = {}
                            tblObj.MeetingRaceTrap__pos = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__upper .MeetingRaceTrap__pos').textContent
                            tblObj.MeetingRaceTrap__greyhound = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__upper .MeetingRaceTrap__greyhound').textContent
                            tblObj.MeetingRaceTrap__trainer = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__upper .MeetingRaceTrap__trainer').textContent
                            tblObj.MeetingRaceTrap__comment = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__upper .MeetingRaceTrap__comment').textContent
                            tblObj.MeetingRaceTrap__sp = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__upper .MeetingRaceTrap__sp').textContent
                            tblObj.MeetingRaceTrap__timeS = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__upper .MeetingRaceTrap__timeS').textContent
                            tblObj.MeetingRaceTrap__timeDistance = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__upper .MeetingRaceTrap__timeDistance').textContent

                            tblObj.MeetingRaceTrap__houndProfile = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__lower .MeetingRaceTrap__houndProfile').textContent
                            tblObj.MeetingRaceTrap__trap = item1.querySelector('.MeetingRaceTrap__data--desktop .MeetingRaceTrap__lower .MeetingRaceTrap__trap img').getAttribute('src')


                            return tblObj;
                        });


                        obj.tableData = table;


                        return obj
                    });
                }, mainDiv);

                await browser.close();

                res.send({
                    "status": 1,
                    "message": "success",
                    "Result": returnArray
                })
            } catch (error) {
                res.send({
                    "status": 0,
                    "message": "Scraping Failed.. Please try again",
                })
            }

        })();
    });

    function delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }


    app.get('/scrape/stadiums', (req, res) => {

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            try {
                await page.setViewport({ width: 1024, height: 2400 });

                //intialize web page
                await page.goto('https://greyhound-data.com/stadia.htm?land=uk&z=IIaV3O', { timeout: 20000 })

                //wait for loading data
                const resultsSelector = 'body';
                await page.waitForSelector(resultsSelector);


                const mainDiv = '#green > tbody > tr > td';
                const returnArray = await page.evaluate(mainDiv => {
                    return [...document.querySelectorAll(mainDiv)].map(item => {
                        var obj = {}
                        const url = item.querySelector('a').getAttribute("href");
                        const array = url.split("=")
                        

                        obj.id = array[2].slice(0, -2); 
                        obj.url = url
                        obj.stadium = item.querySelector('a').textContent
                        return obj
                    });
                }, mainDiv);


                await browser.close();

                res.send({
                    "status": 1,
                    "message": "success",
                    "Result": returnArray,
                })

            } catch (error) {
                console.log(error);
                res.send({
                    "status": 0,
                    "message": "Scraping Failed.. Please check date and try again",
                })
            }

        })();


    });

}