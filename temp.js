/* <HTML 불러오기> - 작동
var url = 'https://www.naver.com'
var request = require('request');

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //HTML body
    console.log(body)
  }
})
*/ 

/* <HTML 불러오기> - 실패
console.log("A");
const express = require('express');
const router = express.Router();
const request = require('request');

router.get("/crawlingTest", function(req, res, next){
    let url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn";

    request(url, function(error, response, body){
        console.log(body)
    });
})
*/

/*네이버 뉴스 헤드라인 가져오기
var cheerio = require('cheerio');
var request = require('request');
var text2 = '123';

var url = 'https://www.naver.com';

//setTimeout(function get_headline(num) {
function get_headline(num)
{
  request(url, function(error, response, html)
  {
    var $ = cheerio.load(html);

    text = $('#news_cast > div.area_newstop > div > div > ol > li:nth-child('+num+')').text();
    console.log(text);
  });
}
//}, 1000);

for(i=1 ; i<8 ; i++) {
   get_headline(i);
   console.log(text2);
}
*/

/*
var cheerio = require('cheerio');
var request = require('request');
var text = '123';

var url = 'https://www.naver.com';

function get_headline(num) 
{
  request(url, function(error, response, html)
  {
    var $ = cheerio.load(html);
    //text = $('#news_cast > div.area_newstop > div > div > ol > li:nth-child('+num+')').text();

    $(function() 
    {
      var count = $('#rank-list li').length;
      var height = $('#rank-list li').height();
    
      function step(index) {
          $('#rank-list ol').delay(2000).animate({
              top: -height * index,
          }, 500, function() {
              step((index + 1) % count);
          });
      }
      step(1);
    });
  });
} 

for(i=1 ; i<8 ; i++){
  get_headline(i);
  console.log(text);
}
*/

var _promise = function(param) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      if(param) {
        resolve("해결 완료");
      }
      else {
        reject(Error("실패!!"));
      }
    }, 3000);
  });
};

_promise(true).then((text) => {
  console.log(text);
}, function (error) {
  console.error(error);
});
