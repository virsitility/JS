// ==UserScript==
// @name         Line Sticker URL Cheater
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  貼圖刷一波
// @author       CSC
// @match        https://store.line.me/stickershop/*
// @grant        none
// @require https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

var parentList = document.querySelector('.mdCMN09ImgList > div > ul');
var stickers = document.querySelectorAll('.mdCMN09ImgList > div > ul > li');
//var stickers = parentList.querySelectorAll('li');
var stickersurl =[]
var stickersurlid =[]

var popup =''
var animation = ''
var ios = 1
if(document.querySelector('.MdIcoFlash_b')) popup = '_popup'
else if(document.querySelector('.MdIcoFlashAni_b')) popup = '_popup'
else if(document.querySelector('.MdIcoAni_b')) animation = '_animation'
else if(document.querySelector('.MdIcoPlay_b')) animation = '_animation'
else ios = 0

document.querySelector('.LySub').remove()
parentList.setAttribute("style","width:auto");
document.querySelector('.MdCMN09DetailView').setAttribute("style","width:auto");


for (var i = 0; i < stickers.length; ++i){
    var url = stickers[i].querySelector('div>span').style.backgroundImage;
    var urlid=url.match(/(\d{2,})/)[0];

    stickersurl[i] = url
    stickersurlid[i] = urlid

    var sDivimg = document.createElement('div');
    stickers[i].parentNode.appendChild(sDivimg);
    sDivimg.appendChild(stickers[i]);
    createBtn(stickers[i],url)
}

var iDiv = document.createElement('div');
document.querySelector('.MdCMN09DetailView').appendChild(iDiv);
iDiv.style = "display: flex; flex-flow: wrap; "

function createBtn_Old(node,url){
    var inputDiv = document.createElement('div');
    var urlset = url.match(/url\(["']?([^"']*sticker\/)(\d{2,})(\/ANDROID|\/IOS)([^"'@]*)(@2x)?(.png);compress=true["']?\)/);
    if(ios == 1) urlset[3] = '/IOS'
    inputDiv.innerHTML = '![]('+urlset[1]+urlset[2]+urlset[3]+urlset[4]+popup+animation+urlset[6]+')'
    inputDiv.setAttribute("style","width: 50px;height:30px;overflow:hidden;background: aqua;");
    inputDiv.setAttribute("style","border:1px solid #000");
    inputDiv.setAttribute("onfocus",'this.select()');
    inputDiv.onclick = function(){
        alert(url);
    };
    node.insertBefore(inputDiv, node.firstChild);
    console.log(url)
}

function createBtn(node,url){
    var inputDiv = document.createElement('input');
    var urlset = url.match(/url\(["']?([^"']*sticker\/)(\d{2,})(\/ANDROID|\/IOS)([^"'@]*)(@2x)?(.png);compress=true["']?\)/);
    if(ios == 1) urlset[3] = '/IOS'
    inputDiv.setAttribute("style","border:1px solid #000");
    inputDiv.setAttribute("value",'![]('+urlset[1]+urlset[2]+urlset[3]+urlset[4]+popup+animation+urlset[6]+')');
    inputDiv.setAttribute("onfocus",'this.select()');

    inputDiv.onclick = function(){
        alert(url);
    };
    //node.parentNode.appendChild(elemButton);
    //node.appendChild(inputDiv);
    node.insertBefore(inputDiv, node.firstChild);
    //document.body.appendChild(inputDiv)
    console.log(url)
}
