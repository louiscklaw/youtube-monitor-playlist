const express = require('express');
const puppeteer = require('puppeteer');

(async () => {
  var browser;
  var output = { state: 'init', debug: {}, error: {} };
  try {
    browser = await puppeteer.connect({ browserWSEndpoint: `ws://localhost:3000` });
    const page = await browser.newPage();

    // Full puppeteer API is available
    await page.goto('https://louiscklaw.github.io/');
    await page.screenshot({ path: './screens/01-main-screen.png' });

    output = { ...output, state: 'done' };
  } catch (error) {
    console.log(error);
    output = { ...output, state: 'error', error };
  }

  console.log({ output });
  browser && browser.close();
})();
