const express = require('express');
const puppeteer = require('puppeteer');

(async () => {
  var browser;
  var output = { state: 'init', debug: {}, error: {} };
  try {
    // If your script executes too quickly, you can add a ?pause query parameter
    // to the connect call to pause the script from running until you're watching it
    browser = await puppeteer.connect({ browserWSEndpoint: `ws://localhost:3000` });
    const page = await browser.newPage();

    // Full puppeteer API is available
    await page.goto('https://louiscklaw.github.io/');
    await page.screenshot({ path: './screens/01-main-screen.png' });
  } catch (error) {
    console.log(error);
  }

  browser && browser.close();
})();
