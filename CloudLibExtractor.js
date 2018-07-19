// ==UserScript==
// @name         雲端書庫提存
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  提一波
// @author       csc
// @match        http://voler.ebookservice.tw/readPdf
// @grant        none
// ==/UserScript==
// * known issue
//  * js無法一鍵下載所有URL圖片，可能要用archive打包成zip的方法
//  * 插件下載圖片的時候會用各別獨立前景下載事件，會大LAG
window.onload=function(){
    var slidesli = document.querySelectorAll(".slides > li")
    console.log(slidesli)
    var pageNow = ''

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

                //alert(urlset.length)
                //                 alert(urlset[0]+'\n'+urlset[1]+'\n'+urlset[2])
                var url = 'http://voler.ebookservice.tw/'+urlset[0]
                for (var j = 0; j < slidesli.length*2; ++j){
                    showimg('http://voler.ebookservice.tw/'+urlset[1]+j+urlset[3],maindiv)
                }
                break
            }
        }
        document.querySelector("#container").remove()

    };
    document.body.insertBefore(button,document.body.childNodes[0]);
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

// function download(img) {
//     var link = document.createElement("a");
//     link.href = img;
//     link.download = true;
//     link.style.display = "none";
//     var evt = new MouseEvent("click", {
//         "view": window,
//         "bubbles": true,
//         "cancelable": true
//     });

//     document.body.appendChild(link);
//     link.dispatchEvent(evt);
//     document.body.removeChild(link);
//     console.log("Downloading...");
// }

// //jquery
function downloadJ(...urls) {
    urls.forEach(url => {
        let iframe = document.createElement('iframe');
        iframe.style.visibility = 'collapse';
        document.body.append(iframe);

        iframe.contentDocument.write(
            `<form action="${url.replace(/\"/g, '"')}" method="GET"></form>`
        );
        iframe.contentDocument.forms[0].submit();

        setTimeout(() => iframe.remove(), 2000);
    });
}
