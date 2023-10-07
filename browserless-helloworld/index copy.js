const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/image', async (req, res) => {
  // puppeteer.launch() => Chrome running locally (on the same hardware)
  let browser = null;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://www.example.com/');
    const screenshot = await page.screenshot();

    res.end(screenshot, 'binary');
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).send(error.message);
    }
  } finally {
    if (browser) {
      browser.close();
    }
  }
});

app.listen(8080, () => console.log('Listening on PORT: 8080'));
