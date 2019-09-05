// ==UserScript==
// @name         PushFormatter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.ptt.cc/bbs/*
// @grant        none
// ==/UserScript==

//讀取結束後開始函數

var t=document.querySelector('#topbar')
//整理推文
function pushFormatter(){
    var push = document.querySelectorAll('div[class=push]');
    var author = document.querySelector('#main-content > div:nth-child(1) > span.article-meta-value').innerHTML.split(" ")[0];
    console.log(author)
    //console.log(push.length)
    var peoplecount = 0;
    for (var i in push){
        push[i].style='line-height:100%'
        //ID
        var pname = push[i].childNodes[1].innerHTML;
        //推文
        var pcontent = push[i].childNodes[2].innerHTML;

        if(i != 0){
            var prename = push[i-1].childNodes[1].innerHTML;
            var precontent = push[i-1].childNodes[2].innerHTML;
            /*
                if (pcontent.substr(2).indexOf("推") == 0){
                    push[i].remove()
                    console.log(i+"  "+pcontent)
                    continue
                }
            if (pcontent.match(/(\: 推$|\: 好文$)/g)){
                push[i].remove()
                //console.log(i+"  "+pcontent)
                continue
            }*/
        } else {
            peoplecount += 1;
        }


        //如果名字一樣
        if (pname == prename || pname+" 🎤" == prename){
            //隱藏推文狀態&推文ID
            push[i].childNodes[0].style='color:red;visibility:hidden';
            push[i].childNodes[1].style='color:red;visibility:hidden';
        } else {
            //分行符號
            peoplecount += 1;
            var iDiv = document.createElement('div');
            iDiv.innerHTML = ' '
            iDiv.style='line-height:60%'
            push[i].parentNode.insertBefore(iDiv,push[i]);
        }
        //如果原PO推文，標記麥克風
        if(pname == author){
            push[i].childNodes[1].innerHTML += " 🎤";
        }
        //置換相間底色
        if (peoplecount%2 == 0){
            push[i].style += ';background-color:#1c1c1c'
        }

    }
}

pushFormatter();


var getYoutubeIdByUrl = function( url ){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if(match&&match[7].length==11){
        return match[7];
    }
    return false;
};

var getImgurByUrl = function( url ){
    var regExp = /^.*(imgur.com\/)([^#\&\?/]*).*/;
    var match = url.match(regExp);
    console.log(match);
    console.log(match[2]);
    if(match&&match[2].length==7){
        return match[2];
    }
    return false;
};

function createButton(context, func, name){
    var button = document.createElement("input");
    button.type = "button";
    button.value = name;
    button.onclick = func;
    context.insertBefore(button,context.childNodes[0]);
}


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
