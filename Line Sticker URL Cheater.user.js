// ==UserScript==
// @name         Line Sticker URL Cheater
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @description  貼圖刷一波
// @author       CSC
// @match        https://store.line.me/stickershop/*
// @grant        none
// =======================================================
// 將 Line 商店的貼圖 URL 顯示並轉為 markdown 格式。一鍵複製。
// -------------------------------------------------------
// 2019 Feb 14 v0.9.2
//     Tuning the match function to recognize source site code changing. (from ANDROID, IOS to android, ios)
// 2018 Jul 27 v0.9.1
//     Colton contributed add pointer cursor style while hover to improve experience.
// 2018 Jul 11 v0.9
//     Colton contributed the method prevent input area wiped out while page loading.
// 2018 Jul 6 v0.3
//     Script created.  
// Unknown issue
//     ele.onclick=function(){} 無法對動態增加的 input 或 button 作用
//     ele.addEventListener("click",function(){}) 不論 call 內部/外部都沒作用
//     動態新增的按鈕無法 call 內部或外部的 function
//     button 沒有預設style，外觀已被平面化
// ==/UserScript==

// init
var parentList = document.querySelector('.mdCMN09ImgList > div > ul');
var stickers = document.querySelectorAll('.mdCMN09ImgList > div > ul > li');
var popup ='';
var animation = '';
var ios = 1;

// 從標題圖示判斷後綴(貼圖大小)。無動畫貼圖的url是ANDROID，所以若無動畫ios=0
if(document.querySelector('.MdIcoFlash_b')) popup = '_popup';
else if(document.querySelector('.MdIcoFlashAni_b')) popup = '_popup';
else if(document.querySelector('.MdIcoAni_b')) animation = '_animation@2x';
else if(document.querySelector('.MdIcoPlay_b')) animation = '_animation@2x';
else ios = 0;
// 版面調整
document.querySelector('.LySub').remove();
parentList.setAttribute("style","width:auto");
document.querySelector('.MdCMN09DetailView').setAttribute("style","width:auto");

// main loop
for (var i = 0; i < stickers.length; ++i){
    var url = stickers[i].querySelector('div>span').style.backgroundImage;
    var sDivimg = document.createElement('div');
    stickers[i].parentNode.appendChild(sDivimg);
    sDivimg.appendChild(stickers[i]);
    createBtn(stickers[i],url);
}

function createBtn(node,url){
    var inputDiv = document.createElement('input');
    // https://regexr.com/
    // url("https://stickershop.line-scdn.net/stickershop/v1/sticker/20111/ANDROID/sticker.png;compress=true")
    // url\(["']? - 除去bg image前綴 : url(" 
    // ([^"']*sticker\/) - gropu 1 抓取 id 前的部分 : https://stickershop.line-scdn.net/stickershop/v1/sticker/
    // (\d{2,}) - group 2 抓取 id 部分 : 20111
    // (\/ANDROID|\/IOS) - group 3抓取 android 或 ios : /ANDROID
    // ([^"'@]*) - group 4 抓取檔名，排除@是因為有時檔名會標註兩倍大小的@2x要留給下一個: sticker
    // (@2x)? - group 5 過濾是否有 2 倍詞綴，基本不使用: @2x
    // (.png) - group 6 副檔名
    // ;compress=true["']?\) - bg image 中不需使用的字，過濾掉
    var urlset = url.match(/url\(["']?([^"']*sticker\/)(\d{2,})(\/ANDROID|\/IOS|\/android|\/ios)([^"'@]*)(.png);compress=true["']?\)/);
    if(ios == 1) urlset[3] = '/IOS';
    // width 37px 讓前面顯示 copy，後面 setSelectionRange 跳過前面 6 char
    inputDiv.setAttribute("style","border:1px solid #000;width:58px; cursor:pointer;");
    inputDiv.setAttribute("value",' 點擊複製 ![]('+urlset[1]+urlset[2]+urlset[3]+urlset[4]+popup+animation+urlset[5]+')');
    inputDiv.setAttribute('onclick','this.setSelectionRange(6,-1);document.execCommand("copy");');
    node.insertBefore(inputDiv, node.firstChild);
    console.log(url);
}
