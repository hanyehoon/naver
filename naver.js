const cheerio = require('cheerio');
const request = require('request');

const url = 'https://www.naver.com';
const url2 = 'https://search.naver.com/search.naver?where=nexearch&query=';
const url3 = '&sm=top_lve&ie=utf8';
let pop_list = [];
let final_list = [];

function get_headline() {
  return new Promise(function (resolve, reject) {
    request(url, function (error, response, html) {
      if(error){
        reject(0);
      }

      let $ = cheerio.load(html);

      let htmlString = $('#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_roll.PM_CL_realtimeKeyword_rolling_base > div > ul > li');  //DOM 객체를 가져옴

      //가져온 DOM 객체에서 데이터 추출
      htmlString.each(
        function() {
          let htmlData = new Object();  //DOM 객체에서 추출한 데이터를 저장할 새로운 객체
          //htmlData.link = $(this).find('a').attr('href');
          htmlData.rank = $(this).find($('.ah_r')).text();
          htmlData.word = $(this).find($('.ah_k')).text();

          if(htmlData.rank < 11)
          {
            pop_list[htmlData.rank - 1] = htmlData;  //객체를 pop_list(인기 검색어 리스트)에 push
            //pop_list.push(htmlData);
          }
        }
      )

      resolve(pop_list);
      //resolve(htmlData); //왜 안되지??
    });
  })
}

get_headline().then((pop_list2) => {
  console.log(pop_list2);
  let map1 = pop_list2.map(function(word_array) {
    return new Promise(function (resolve, reject) {

      let final_url = encodeURI(url2 + word_array.word + url3);

      request(final_url, function (error, response, html) {

        let $2 = cheerio.load(html);

        let relative_word = $2('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li');
        
        relative_word.each( function () {
            let final_data = new Object();
            //let temp_list = [];
            final_data.num = word_array.rank;
            final_data.finalWord = $2(this).find('a').text();
            final_list.push(final_data);
            //temp_list.push(final_data);
            //final_list[word_array.rank - 1] = temp_list;
          }
        )
        resolve(final_list);
      })
    })
  });

    Promise.all(map1).then(function(every_rlv) {
     
    for(j=0; j<10; j++)
    {
      console.log((j+1) + '위 검색어 : ', pop_list2[j].word);
      console.log(every_rlv[j]);
    }
    console.log("아아아아아아아", pop_list[0]);
  });
}).catch((error) => {
  console.error(error);
})

 






