const express = require('express');
const puppeteer = require('puppeteer-extra');
const fs = require('fs');

(async () => {
  var browser;
  var output = { state: 'init', debug: {}, error: {}, result: [] };

  async function scrapeYoutubeVideoLink(page) {
    return await page.evaluate(() => {
      var video_list = [];
      document.querySelectorAll('#dismissible').forEach(e => {
        // 	console.log(e.textContent.search('days ago') > -1)
        var text_content = e.textContent;
        var time_length = e.querySelectorAll('yt-formatted-string')[0].textContent;
        var name = e.querySelectorAll('yt-formatted-string')[1].textContent;
        var link = e.querySelector('a').href;

        var wanted_list = ['minute ago', 'minutes ago', 'hour ago', 'hours ago'];

        for (var i = 0; i < wanted_list.length; i++) {
          var found = text_content.search(wanted_list[i]) > -1;

          if (true) {
            video_list.push({ name, link, time_length });
            break;
          }
        }
      });
      return JSON.stringify(video_list);
    });
  }

  try {
    browser = await puppeteer.connect({ browserWSEndpoint: `ws://localhost:3000?--window-size=1920,1080` });
    const page = await browser.newPage();

    // Full puppeteer API is available
    // https://www.youtube.com/@SingTaoHeadline/videos
    await page.goto('https://www.youtube.com/@01official/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-hk01-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.result.push(v));

    await page.goto('https://www.youtube.com/@ChannelCHK/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-channel_c-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.result.push(v));

    await page.goto('https://www.youtube.com/@SingTaoHeadline/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-sing-tao-headline-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.result.push(v));

    output = { ...output, state: 'done' };
  } catch (error) {
    console.log(error);
    output = { ...output, state: 'error', error };
  }

  console.log({ output });

  fs.writeFileSync('./results/youtube_scrape_result.json', JSON.stringify(output, null, 2), { encoding: 'utf-8' });

  browser && browser.close();
})();
