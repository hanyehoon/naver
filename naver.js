const cheerio = require('cheerio');
const request = require('request');

const url = 'https://www.naver.com';
const url2 = 'https://search.naver.com/search.naver?where=nexearch&query=';
const url3 = '&sm=top_lve&ie=utf8';
let pop_list = [];        //인기검색어 담는 배열
let final_list = [];      //최종으로 인기검색어의 연관검색어를 담는 배열
let num_rlv = [];         //각 인기검색어마다의 연관검색어 수를 담는 배열

var get_popWord = function () {  //인기검색어를 뽑아내는 함수(popWord = popular word)
  return new Promise(function (resolve, reject) {     //get_popWord() 함수는 Promise를 요청
    request(url, function (error, response, html) {   //html request
      
      if(error){  //에러 체크
        reject(0);
      }

      const $ = cheerio.load(html);
      const htmlString = $('#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_roll.PM_CL_realtimeKeyword_rolling_base > div > ul > li');  //DOM 객체를 가져옴

      htmlString.each(  //가져온 DOM 객체에서 각각의 데이터 추출
        function() {
          let htmlData = new Object();  //DOM 객체에서 추출한 데이터를 저장할 새로운 객체
          //htmlData.link = $(this).find('a').attr('href');   //링크
          htmlData.rank = $(this).find($('.ah_r')).text();    //인기 순위
          htmlData.word = $(this).find($('.ah_k')).text();    //인기 검색어

          if(htmlData.rank < 11)  //10위까지만 추출
          {
            pop_list[htmlData.rank - 1] = htmlData;  //객체를 pop_list(인기 검색어 리스트)에 push
            //pop_list.push(htmlData);
          }
        }
      )
      resolve(pop_list);    //pop_list를 promise의 결과 인자로 전달
    });
  })
}

//var map2 = function() {
  //let map3 = pop_list.map(function(word_array) {
var map2 = function(word_array) {
  return new Promise(function (resolve, reject) {

    console.log("Word_array : ", word_array);
    let final_url = encodeURI(url2 + word_array.word + url3);   //최종 url 생성

    request(final_url, function (error, response, html) {       //최종 url로 request

      let $2 = cheerio.load(html);
      let relative_word = $2('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li');
      let temp_list = [];

      relative_word.each( 
        function () {
          let temp_word = $2(this).find('a').text();
          temp_list.push(temp_word);
          num_rlv[word_array.rank - 1] = $2(this).find('a').attr('data-idx');
          final_list[word_array.rank - 1] = temp_list;
        }
      )
      resolve(final_list[word_array.rank - 1]);
    })
  })
}

async function ABC() {
  console.log("시작");
  let abc = await get_popWord();
  //let def = await DEF(abc);
  console.log("pop_list? : ", abc);
  let map3 = await pop_list.map(map2());
  for await (promise of map3) {
    for(j=0; j<10; j++)
    {
      console.log((j+1) + '위 검색어 : ', pop_list[j].word);
      for(i=0; i<num_rlv[j]; i++)
      console.log(every_rlv[j][i]);
    }
  }
  //console.log(map2);
};

ABC();

/*
get_popWord().then((pop_list2) => {     //인기 검색어 추출 후, pop_list를 인자로 받아옴
  console.log("팝 리스트 :", pop_list2);

  //pop_list 각각의 데이터에 대하여 function을 실행해서 새로운 배열 map1을 만듬
  let map1 = pop_list2.map(function(word_array) {
    return new Promise(function (resolve, reject) {

      console.log("Word_array : ", word_array);
      let final_url = encodeURI(url2 + word_array.word + url3);   //최종 url 생성

      request(final_url, function (error, response, html) {       //최종 url로 request

        let $2 = cheerio.load(html);
        let relative_word = $2('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li');
        let temp_list = [];

        relative_word.each( 
          function () {
            //let final_data = new Object();
            //let temp_list = [];
            //final_data.num = word_array.rank;
            let temp_word = $2(this).find('a').text();
            //console.log(word_array.rank, "꾺", temp_word);
            //final_data.finalWord = $2(this).find('a').text();
            temp_list.push(temp_word);
            num_rlv[word_array.rank - 1] = $2(this).find('a').attr('data-idx');
            //console.log("제발", num_rlv);
            //console.log("템프쓰", temp_list);
            //final_list[word_array.rank - 1] = final_data;
            //final_list.push(final_data);
            //temp_list.push(final_data);
            final_list[word_array.rank - 1] = temp_list;
          }
        )
        //console.log("끄아아아아아앙!!", final_list);
        resolve(final_list[word_array.rank - 1]);
      })
    })
  });

  Promise.all(map1).then((every_rlv) => {
    for(j=0; j<10; j++)
    {
      console.log((j+1) + '위 검색어 : ', pop_list2[j].word);
      for(i=0; i<num_rlv[j]; i++)
      console.log(every_rlv[j][i]);
    }
  });
}).catch((error) => {
  console.error(error);
});
*/