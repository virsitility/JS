// ==UserScript==
// @name         OrangeHR_quick_sheets
// @namespace    http://tampermonkey.net/
// @version      0.2
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
    document.querySelector('#applyleave_duration_time_from').options[53].selected = true
    document.querySelector('#applyleave_duration_time_to').options[73].selected = true
    document.querySelector('#applyleave_duration_specify_time_content > input').value = "5.00"
}, '請下午(13-18)');

createButton(block, function(){
    doDirtyJob()
    document.querySelector('#applyleave_duration_time_from').options[37].selected = true
    document.querySelector('#applyleave_duration_time_to').options[49].selected = true
    document.querySelector('#applyleave_duration_specify_time_content > input').value = "3.00"
}, '請早上(09-12)');

createButton(block, function(){
    doDirtyJob()
    document.querySelector('#applyleave_duration_time_from').options[41].selected = true
    document.querySelector('#applyleave_duration_time_to').options[45].selected = true
    document.querySelector('#applyleave_duration_specify_time_content > input').value = "1.00"
}, '請一小時(10-11)');

//預設選項調整
function doDirtyJob(){
    var type = document.querySelector('#applyleave_txtLeaveType');
    //type.value="8";
    //type.selectedIndex=8;
    type.options[9].selected = true

    var dateFrom = document.querySelector('#applyleave_txtFromDate');
    var dateTo = document.querySelector('#applyleave_txtToDate');
    var dateTime = new Date();
    dateFrom.value=dateTime.yyyymmdd();
    dateTo.value=dateTime.yyyymmdd();


    document.querySelector('#frmLeaveApply > fieldset > ol > li:nth-child(5)').style="display: list-item;";
    var dura = document.querySelector('#applyleave_duration_duration');
    dura.options[2].selected = true;
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
