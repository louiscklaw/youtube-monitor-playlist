const express = require('express');
const puppeteer = require('puppeteer-extra');

(async () => {
  var browser;
  var output = { state: 'init', debug: {}, error: {}, result: [] };
  try {
    browser = await puppeteer.connect({ browserWSEndpoint: `ws://localhost:3000?--window-size=1920,1080` });
    const page = await browser.newPage();

    // Full puppeteer API is available
    // https://www.youtube.com/@SingTaoHeadline/videos
    await page.goto('https://www.youtube.com/@01official/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-hk01-helloworld.png' });

    await page.goto('https://www.youtube.com/@ChannelCHK/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-channel_c-helloworld.png' });

    await page.goto('https://www.youtube.com/@SingTaoHeadline/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-sing-tao-headline-helloworld.png' });

    output = { ...output, state: 'done' };
  } catch (error) {
    console.log(error);
    output = { ...output, state: 'error', error };
  }

  console.log({ output });
  browser && browser.close();
})();
