const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const router = require('express').Router();

// const puppeteer = require('puppeteer');


router.post('/connect', async(req, res, next) => {
  try {
    const { url } = req.body
    // const  url = 'https://juejin.cn/post/6903322902431531015';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.content();
    const $ = cheerio.load(html, {
      normalizeWhitespace: true,
      decodeEntities: false
    });

    const webInfo = {};

    webInfo.title = $('title').first().text();
    webInfo.url =  url;
    webInfo.thumb = $('img').first().attr('src');
    webInfo.desc = $('meta[name="description"]').first().attr('content');
    await browser.close();
    // console.log(html);
    // await page.evaluate(v => console.log(document.body, 222))
    res.json({
      data: webInfo,
    })
  } catch (e) {
    next(e)
  }
})

module.exports = router;