var cheerio = require('cheerio');
var request = require('request');

var url = 'https://www.naver.com';
var url2 = 'https://search.naver.com/search.naver?where=nexearch&query=';
var url3 = '&sm=top_lve&ie=utf8';
var pop_list = [];

function get_headline() {
  return new Promise(function (resolve, reject) {
    request(url, function (error, response, html) {
      var $ = cheerio.load(html);

      for (i = 1; i < 11; i++) {
        var text = $('#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_roll.PM_CL_realtimeKeyword_rolling_base > div > ul > li:nth-child(' + i + ') > a > span.ah_k').text();
        pop_list[i - 1] = text;
      }

      resolve(pop_list);
    });
  })
}

get_headline().then((pop_list2) => {
  //console.log('정상 종료');
  //console.log(pop_list2);

  const map1 = pop_list2.map(function(word) {
    return new Promise(function (resolve, reject) {
      let final_url = encodeURI(url2 + word + url3);

      request(final_url, function (error, response, html) {

        var $2 = cheerio.load(html);

        var text1 = $2('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li').text();
        //console.log(text1);
        resolve(text1);
      })
    })
  });

    Promise.all(map1).then(function(every_rlv) {
    for(j=0; j<10; j++)
    {
      console.log((j+1) + '위 검색어 : ', pop_list2[j]);
      console.log(every_rlv[j]);
    }
  });
}).catch((error) => {
  console.error(error);
})

 






