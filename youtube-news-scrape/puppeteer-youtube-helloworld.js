const express = require('express');
const puppeteer = require('puppeteer-extra');
const fs = require('fs');

(async () => {
  var browser;
  var output = {
    state: 'init',
    debug: {},
    error: {},
    scrape_result: [],
    news_link: [],
    feed_discord: { last_update: new Date().toISOString(), links: [] },
  };

  async function scrapeYoutubeVideoLink(page) {
    return await page.evaluate(() => {
      var video_list = [];
      document.querySelectorAll('#dismissible').forEach(e => {
        // 	console.log(e.textContent.search('days ago') > -1)
        var text_content = e.textContent;
        var time_length = e.querySelectorAll('yt-formatted-string')[0].textContent;
        var name = e.querySelectorAll('yt-formatted-string')[1].textContent;
        var link = e.querySelector('a').href;

        var wanted_list = ['second ago', 'seconds ago', 'minute ago', 'minutes ago', 'hour ago', 'hours ago'];

        for (var i = 0; i < wanted_list.length; i++) {
          var found = text_content.search(wanted_list[i]) > -1;

          if (found) {
            video_list.push({ name, link, time_length });
            break;
          }
        }
      });
      return JSON.stringify(video_list);
    });
  }

  try {
    browser = await puppeteer.connect({ browserWSEndpoint: `ws://localhost:3000` });
    const page = await browser.newPage();

    // Full puppeteer API is available
    // https://www.youtube.com/@SingTaoHeadline/videos
    await page.goto('https://www.youtube.com/@01official/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-hk01-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.scrape_result.push(v));

    await page.goto('https://www.youtube.com/@ChannelCHK/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-channel_c-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.scrape_result.push(v));

    await page.goto('https://www.youtube.com/@SingTaoHeadline/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-sing-tao-headline-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.scrape_result.push(v));

    await page.goto('https://www.youtube.com/@HOYTVHK/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-HOYTVHK-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.scrape_result.push(v));

    await page.goto('https://www.youtube.com/@mm.millmilk/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-mm-millmilk-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.scrape_result.push(v));

    await page.goto('https://www.youtube.com/@GadgetGangHK/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-GadgetGangHK-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.scrape_result.push(v));

    await page.goto('https://www.youtube.com/@ricezi2hk/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-ricezi2hk-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.scrape_result.push(v));

    await page.goto('https://www.youtube.com/@setn/videos', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 * 5 });
    await page.screenshot({ path: './screens/01-setn-helloworld.png' });
    var video_result = await scrapeYoutubeVideoLink(page);
    video_list = JSON.parse(video_result);
    video_list.forEach(v => output.scrape_result.push(v));

    output = { ...output, state: 'done' };
  } catch (error) {
    console.log(error);
    output = { ...output, state: 'error puppeteer-youtube-helloworld.js', error };
  }

  var wanted_list = [
    '今日新聞',
    'Channel C',
    '01新聞',
    '港聞',
    '星島頭條',
    '有線新聞',
    '01開罐',
    '01教煮',
    '一線搜查',
    '宅推介',
    '米紙',
    '美味道來',
    '700萬種生活',
    '牌子嘢',
    'Weekly_pedia',
    '試一次',
    // '三立新聞網',
  ];
  for (var i = 0; i < wanted_list.length; i++) {
    output.scrape_result.filter(t => t.name.search(wanted_list[i]) > -1).forEach(r => output.news_link.push(r));
  }

  output.news_link.forEach(l => {
    if (output.feed_discord.links.indexOf(l.link) < 0) {
      output.feed_discord.links.push(l.link);
    }
  });

  fs.writeFileSync('./results/youtube_scrape_result.json', JSON.stringify(output, null, 2), { encoding: 'utf-8' });

  browser && browser.close();
})();
