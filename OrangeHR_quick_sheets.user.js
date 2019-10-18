// ==UserScript==
// @name         OrangeHR_quick_sheets
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Do dirty job on OrangeHR for you
// @author       csc
// @match        http://*/symfony/web/index.php/leave/applyLeave
// @grant        none
// ==/UserScript==

var block = document.querySelector('#apply-leave > div.inner');

createButton(block, function(){

    doDirtyJob()

    var dura = document.querySelector('#applyleave_duration_duration');
    dura.options[0].selected = true;
    document.querySelector('#applyleave_duration_specify_time_content').style="display: none;";
}, '請一天(09-18)');

createButton(block, function(){
    doDirtyJob()
    document.querySelector('#applyleave_duration_time_from').options[4].selected = true
    document.querySelector('#applyleave_duration_time_to').options[8].selected = true
    document.querySelector('#applyleave_duration_specify_time_content > input').value = "5.00"
}, '請下午(13-18)');

createButton(block, function(){
    doDirtyJob()
    document.querySelector('#applyleave_duration_time_from').options[1].selected = true
    document.querySelector('#applyleave_duration_time_to').options[3].selected = true
    document.querySelector('#applyleave_duration_specify_time_content > input').value = "3.00"
}, '請早上(09-12)');

createButton(block, function(){
    doDirtyJob()
    document.querySelector('#applyleave_duration_time_from').options[2].selected = true
    document.querySelector('#applyleave_duration_time_to').options[2].selected = true
    document.querySelector('#applyleave_duration_specify_time_content > input').value = "1.00"
}, '請一小時(10-11)');


//預設選項調整
function doDirtyJob(){
    //選特休
    var type = document.querySelector('#applyleave_txtLeaveType');
    //type.value="8";
    //type.selectedIndex=8;
    type.options[9].selected = true
    //日期設為今天
    var dateFrom = document.querySelector('#applyleave_txtFromDate');
    var dateTo = document.querySelector('#applyleave_txtToDate');
    var dateTime = new Date();
    dateFrom.value=dateTime.yyyymmdd();
    dateTo.value=dateTime.yyyymmdd();

    //啟動期間
    document.querySelector('#frmLeaveApply > fieldset > ol > li:nth-child(5)').style="display: list-item;";
    var dura = document.querySelector('#applyleave_duration_duration');
    dura.options[1].selected = true;
    document.querySelector('#applyleave_duration_specify_time_content').style="display: inline;";

}

//日期系統
Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
            "-" + (mm>9 ? '' : '0') + mm,
            "-" + (dd>9 ? '' : '0') + dd
           ].join('');
};

//建立按鈕
function createButton(context, func, name){
    var button = document.createElement("input");
    button.type = "button";
    button.value = name;
    button.onclick = func;
    context.insertBefore(button,context.childNodes[0]);
}
