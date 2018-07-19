// ==UserScript==
// @name         雲端書庫提存
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  提一波
// @author       J
// @match        http://voler.ebookservice.tw/readPdf*
// @grant        none
// ==/UserScript==
// * known issue
//  * js無法一鍵下載所有URL圖片，可能要用archive打包成zip的方法
//  * 插件下載圖片的時候會用各別獨立前景下載事件，會大LAG
window.onload=function(){
    var slidesli = document.querySelectorAll(".slides > li")
    console.log(slidesli)
    var pageNow = ''
    var title = document.querySelector(".top_bookname")

    //title = title.match(/(\/book\/img\?p=)(\d*)([^"']*)/);
    var button = document.createElement("input");
    button.style.cssText = 'z-index: 999999999; position: fixed;right: 0;top: 0;padding: 15px;border: none;background: #8BC34A;color: darkgreen;font-size: 20px;box-shadow: 0px 0px 32px 0;';
    button.type = "button";
    button.value = 'Download';
    button.onclick = function(){
        var maindiv = document.createElement('div');
        document.body.insertBefore(maindiv,document.body.childNodes[0]);
        maindiv.setAttribute("style","display:flex;flex-wrap:wrap");
        for (var i = 0; i < slidesli.length; ++i){
            console.log(i)
            if (slidesli[i].querySelector('img')) {
                pageNow = slidesli[i].querySelector('img').src
                var urlset = pageNow.match(/(\/book\/img\?p=)(\d*)([^"']*)/);
                //                 alert(urlset[0]+'\n'+urlset[1]+'\n'+urlset[2])
                var url = []
//                 for (var j = 0; j < slidesli.length*2; ++j){
//                     //                     showimg('http://voler.ebookservice.tw/'+urlset[1]+j+urlset[3],maindiv)
//                     url.push('"http://voler.ebookservice.tw'+urlset[1]+j+urlset[3]+'"')
//                 }
                url = urlToAHK(urlset[3], slidesli.length*2)
                urlText(url,maindiv)
                //saveahk(url)


                break
            }
        }
        document.querySelector("#container").remove()
    };
    document.body.insertBefore(button,document.body.childNodes[0]);
}

function urlToAHK(url, length){
    url = 'url := "'+url+'" \n'+
//         'for index, element in url{\n'+
//         '\t oHttp := ComObjCreate("WinHttp.WinHttpRequest.5.1") \n'+
//         '\t oHttp.open("GET", element, false) \n'+
//         '\t oHttp.send() \n'+
//         '\t size := oHttp.ResponseBody.MaxIndex()+1 \n'+
//         '\t if size < 1024 \n' +
//         '\t\t url.remove(index) \n' +
//         '} \n'+
        'length := ' + length +'\n' +
        'Loop, %length%{ \n'+
        '\t page_url = http://voler.ebookservice.tw/book/img?p=%A_index%%url% \n' +
        '\t num := SubStr("0000" . A_index , -3) \n' +
        '\t UrlDownloadToFile, %page_url%, %A_ScriptDir%\\%num%.jpg \n'+
        '}'
    return url
}

function urlText (url,maindiv) {
    var input = document.createElement('textarea');
    maindiv.appendChild(input)
    //input.setAttribute('onclick','this.select();document.execCommand("copy");');

    input.onclick = function() {

        var link = document.createElement('a');
        link.setAttribute('download', 'info.ahk');
        link.href = saveahk(url);
        document.body.appendChild(link);

        // wait for the link to be added to the document
        window.requestAnimationFrame(function () {
            var event = new MouseEvent('click');
            link.dispatchEvent(event);
            document.body.removeChild(link);
        })
    }
    input.value = url
}

function DownloadPage (url) {
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Filename.jpg');
    link.setAttribute('target', '_blank');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function showimg(url,maindiv){
    var div = document.createElement('div');
    //     document.body.insertBefore(div,document.body.childNodes[0]);
    maindiv.appendChild(div)
    var img = document.createElement('img');
    img.style.height = '50px'
    img.src = url
    div.appendChild(img)

}


// function saveahk(text) {
//     var textFile = null
//     var data = new Blob([text], {type: 'text/plain'});

//     // If we are replacing a previously generated file we need to
//     // manually revoke the object URL to avoid memory leaks.
//     if (textFile !== null) {
//         window.URL.revokeObjectURL(textFile);
//     }

//     textFile = window.URL.createObjectURL(data);

//     // returns a URL you can use as a href
//     return textFile;

// }

function saveahk (text) {
    var textFile = null
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
}



function download(img) {
    var link = document.createElement("a");
    link.href = img;
    link.download = true;
    link.style.display = "none";
    var evt = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": true
    });

    document.body.appendChild(link);
    link.dispatchEvent(evt);
    document.body.removeChild(link);
    console.log("Downloading...");
}

