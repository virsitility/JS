// ==UserScript==
// @name         雲端書庫提存
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  提一波
// @author       J
// @match        http://voler.ebookservice.tw/readPdf*
// @grant        none
//
// ---
// 
// * Feature
// 批次下載電子書PDF
// =====================================
// * README
//  * 點擊 Fetch 後下載 AHK 檔後置於資料夾執行，會自動建立資料夾。
//  * 若無反應則重新整理頁面
// =====================================
// * 0.4
//  * 將網址打包成文字檔下載為AHK格式並透過其下載圖片。
// * 0.3
//  * 將網址以陣列打包成文字檔下載為AHK格式並透過其下載圖片，但array有最大字數限制，故改為輸出 pattern。
// * 0.2
//  * 改為插入 textarea 並將所有圖片網址示於其中。
// * 0.1 
//  * 隱藏主頁框，fetch 所有圖片網址並縮小插入進畫面，需用下載全畫面圖片插件。
// * known issue
//  [v] js無法一鍵下載所有URL圖片，可能要用archive打包成zip的方法
//  [v] 插件下載圖片的時候會用各別獨立前景下載事件，會大LAG
//
// ==/UserScript==

// global var，給AHK下載檔名用
var title = ''

window.onload=function(){
    var slidesli = document.querySelectorAll(".slides > li")
    // 紀錄當前頁面用，因為HTML中的頁數排序相反，太後面的頁數是空白頁，在翻頁到前半部時HTML才會真的變動
    // 故若從後半部翻回來會先抓到空白頁，需先重新整理。
    var pageNow = ''
    // 取標題並去掉 試讀
    title = document.querySelector(".top_bookname").innerHTML
    title = title.match(/(.+)（試讀）/)[1];
    var button = document.createElement("input");
    button.style.cssText = 'z-index: 999999999; position: fixed;right: 0;top: 0;padding: 15px;border: none;background: #8BC34A;color: darkgreen;font-size: 20px;box-shadow: 0px 0px 32px 0;';
    button.type = "button";
    button.value = 'Fetch to AHK';
    // 按鈕
    button.onclick = function(){
        var maindiv = document.createElement('div');
        document.body.insertBefore(maindiv,document.body.childNodes[0]);
        maindiv.setAttribute("style","display:flex;flex-wrap:wrap");
        for (var i = 0; i < slidesli.length; ++i){
            // 如果此節點有 img 標則抓取 url
            if (slidesli[i].querySelector('img')) {
                pageNow = slidesli[i].querySelector('img').src
                // Regexp
                // (\/book\/img\?p=)(\d*)([^"']*)
                // (\/book\/img\?p=) 1 - 截掉前面domain
                // (\d*) 2 - 獲取頁數
                // ([^"']*) 3 - 獲取後段id資訊
                var urlset = pageNow.match(/(\/book\/img\?p=)(\d*)([^"']*)/);
                var url = []
                //for (var j = 0; j < slidesli.length*2; ++j){
                //showimg('http://voler.ebookservice.tw/'+urlset[1]+j+urlset[3],maindiv)
                //url.push('"http://voler.ebookservice.tw'+urlset[1]+j+urlset[3]+'"')
                //}
                url = urlToAHK(title, urlset[3], slidesli.length*2)
                urlText(url,maindiv)
                break
            }
        }
        document.querySelector("#container").remove()
    };
    document.body.insertBefore(button,document.body.childNodes[0]);
}

function urlToAHK(title,url, length){
    url = 'url := "'+url+'" \n'+
        'title := "' + title + '"\n'+
        //         'for index, element in url{\n'+
        //         '\t oHttp := ComObjCreate("WinHttp.WinHttpRequest.5.1") \n'+
        //         '\t oHttp.open("GET", element, false) \n'+
        //         '\t oHttp.send() \n'+
        //         '\t size := oHttp.ResponseBody.MaxIndex()+1 \n'+
        //         '\t if size < 1024 \n' +
        //         '\t\t url.remove(index) \n' +
        //         '} \n'+
        'length := ' + length +'\n' +
        'folder = %A_ScriptDir%\\%title% \n' +
        'if !FileExist(folder){ \n' +
        '\t FileCreateDir, % folder \n' +
        '} \n' +
        'FileMove, %A_ScriptFullPath%, %folder%\\%A_ScriptName% \n' +
        'Loop, %length%{ \n'+
        '\t page_url = http://voler.ebookservice.tw/book/img?p=%A_index%%url% \n' +
        '\t num := SubStr("0000" . A_index , -3) \n' +
        '\t UrlDownloadToFile, %page_url%, %folder%\\%num%.jpg \n'+
        '}' +
        'MsgBox, "%title%" complete!'
    return url
}

function urlText (url,maindiv) {
    var input = document.createElement('textarea');
    maindiv.appendChild(input)
    //input.setAttribute('onclick','this.select();document.execCommand("copy");');
    input.value = url

    var link = document.createElement('a');
    link.setAttribute('download', title+'.ahk');
    link.href = saveahk(url);

    document.body.appendChild(link);
    var event = new MouseEvent('click');
    link.dispatchEvent(event);
    document.body.removeChild(link);
}



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