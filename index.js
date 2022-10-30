const axios = require("axios")
const cheerio = require("cheerio")
const express = require("express")

const log = console.log
const app = express()

const getHtml = async () => {
  try {
    return await axios.get("https://search.naver.com/search.naver?where=view&query=%EB%8F%84%EC%BF%84%20%EC%97%AC%ED%96%89&sm=tab_opt&nso=so%3Add%2Cp%3A&mode=normal&main_q=&st_coll=&topic_r_cat=");
  } catch (error) {
    console.error(error);
  }
};

app.get('/home', function(request, response) {
    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $(".lst_total li");
    
        $bodyList.each(function(i, elem) {
            ulList[i] = {
                title: $(this).find('.api_txt_lines').text(),
                url: $(this).find('.api_txt_lines').attr('href'),
                //   image_url: $(this).find('p.poto a img').attr('src'),
                //   image_alt: $(this).find('p.poto a img').attr('alt'),
                //   summary: $(this).find('p.lead').text().slice(0, -11),
                date: $(this).find('.sub_time').text()
            };
        });
    
        const data = ulList.filter(n => n.title);
        return data;
    })
    .then(res => {
        log(res)
        response.send(res)
    })
})

app.listen(8080, () => log('connected'))