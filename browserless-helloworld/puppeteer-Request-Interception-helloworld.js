const express = require('express');
const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  var browser;
  var output = { state: 'init', debug: {}, error: {} };
  try {
    browser = await puppeteer.connect({ browserWSEndpoint: `ws://localhost:3000` });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      if (interceptedRequest.isInterceptResolutionHandled()) return;
      if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
        interceptedRequest.abort();
      else interceptedRequest.continue();
    });

    // Full puppeteer API is available
    await page.goto('https://www.youtube.com/@01official/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-Request-Interception-helloworld.png' });

    output = { ...output, state: 'done' };
  } catch (error) {
    console.log(error);
    output = { ...output, state: 'error', error };
  }

  console.log({ output });
  browser && browser.close();
})();
