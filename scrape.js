const puppeteer = require('puppeteer');
const axios = require('axios')

/**
 * Transform text from MM_DD_YYYY to YYYY_MM_DD
 * @param {String} MM_DD_YYYY
 * @returns {String} YYYY_MM_DD
 */
var reformat = MM_DD_YYYY => `${MM_DD_YYYY.slice(6, 10)}-${MM_DD_YYYY.slice(0, 2)}-${MM_DD_YYYY.slice(3, 5)}`

/**
 * This function returns an array of dates between the given interval 
 * and all the dates included within the funciton are in YYYY_MM_DD 
 * @param {String} from date in YYYY_MM_DD format
 * @param {String} to date in YYYY_MM_DD format
 * @returns {String[]} dates between from and to
 */
var get_dates = (from, to) => {
    var ls = []
    var s_d = new Date(from)
    var e_d = new Date(to)
    var interval = (e_d - s_d) / (1000 * 60 * 60 * 24)
    e_d = new Date(from)
    for (let i = 0; i < (interval + 1); i++) {
        e_d.setDate(s_d.getDate() + i)
        var t = e_d.toISOString()
        ls.push(t.slice(0, t.indexOf("T")))
    }
    return ls
}

/**
 * This function fetches the airport code from google api
 * Example Usage Cairo AI => /m/29ja_3
 * @param {String} airport_name
 * @returns {String} airport_code
 */
var get_airport_code = airport_name => axios.get(`https://clients1.google.com/complete/search?client=flights&hl=en-EG&gl=eg&gs_rn=64&gs_ri=flights&requiredfields=regions_enabled%3Afalse%7Ctrains_enabled%3Atrue%7Cdeduplicate_cities_enabled%3Afalse%7Cairportless_locations_enabled%3Atrue&ds=flights&cp=2&gs_id=1y&q=${airport_name}&callback=google.sbox.p50&gs_gbg=7M1k308Eb6dKbAh6895QFh8uQtZ0b0Io`)
    .then(response => {
        response = response.data.slice(response.data.indexOf('([') + 1)
        return JSON.parse(response.slice(0, response.length - 1))[1][0][3].m
    })

/**
 * This function scarp google flights at some date
 * @param {String} origin_airport_code 
 * @param {String} des_airport_code 
 * @param {String} from YYYY-MM-DD 
 * @returns {Airport[]} Airport => { name, logo, duration, start-end, stops, price, date }
 */
var get_flights = async (origin_airport_code, des_airport_code, from) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
        `https://www.google.com/flights?hl=en#flt=${origin_airport_code}.${des_airport_code}.${from};c:USD;e:1;so:1;sd:1;t:f;tt:o`,
        { waitUntil: 'load' }
    );
    let urls = await page.evaluate(() => {
        let urls = []
        let hrefs = document.querySelectorAll('li.gws-flights-results__result-item.gws-flights__flex-box.gws-flights-results__collapsed');
        hrefs.forEach(function (el) {
            try {
                urls.push({
                    name: el.querySelector('.gws-flights-results__carriers.gws-flights__ellipsize.gws-flights__flex-box.gws-flights__align-center.flt-caption').innerText.trim(),
                    logo: el.querySelector('.gws-flights-results__airline-logo').src.trim(),
                    duration: el.querySelector('.gws-flights-results__duration.flt-subhead1Normal').innerText.trim(),
                    "start-end": el.querySelector('.gws-flights-results__times.flt-subhead1').innerText.trim(),
                    stops: el.querySelector('.gws-flights-results__stops.flt-subhead1Normal').innerText.trim(),
                    price: el.querySelector('.flt-subhead1.gws-flights-results__price').innerText.trim()
                });
            } catch (error) {
                console.log(error)
            }
        });
        return urls
    });
    browser.close();
    return urls.map(e => { e.date = from; return e });
}

module.exports = async function scrape(
    origin_airport,
    des_airport,
    from,
    to
) {
    var origin_airport_code = await get_airport_code(origin_airport)
    var des_airport_code = await get_airport_code(des_airport)
    return get_dates(reformat(from), reformat(to))
        .map(date => get_flights(origin_airport_code, des_airport_code, date))
        // .reduce((agg, c) => agg.concat(c), []).sort((p, c) => c.price.slice(1) - p.price.slice(1))
}