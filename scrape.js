const puppeteer = require('puppeteer');

module.exports = async function scrape(
    origin_airport_code,
    des_airport_code,
    from,
    to
) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: 'example.png' });

    await browser.close();
    return [
        origin_airport_code,
        des_airport_code,
        from,
        to
    ]
}