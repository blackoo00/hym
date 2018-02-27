$(function(){
    console.log(getDateByType('today'));
});
/*
* type:today(今天),yesterday(昨天),thisweek(本周),lastweek(上周),thismonth(本月),lastmonth(上月),thisyear(今年)
* */
function getDateByType(type){
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var year=new Date().getFullYear(),
        month=new Date().getMonth()+1,
        day=new Date().getDate(),
        thisWeekStart; //本周周一的时间
    if(new Date().getDay()==0){  //周天的情况；
        thisWeekStart = (new Date(year+'/'+month+'/'+day)).getTime()-((new Date().getDay())+6) * 86400000;
    }else{
        thisWeekStart = (new Date(year+'/'+month+'/'+day)).getTime()-((new Date().getDay())-1) * 86400000;
    }
    var starttime,endtime;
    switch(type){
        case 'today':
            starttime = getMyDate(Date.parse(today));
            endtime = getMyDate(Date.parse(today));
            break;
        case 'yesterday':
            starttime = getMyDate(Date.parse(today) - 86400000);
            endtime = getMyDate(Date.parse(today) - 86400000);
            break;
        case 'thisweek':
            starttime = getMyDate(thisWeekStart);
            endtime = getMyDate(Date.parse(today));
            break;
        case 'lastweek':
            var prevWeekStart = thisWeekStart - 7 * 86400000;//上周周一的时间
            var prevWeekEnd = thisWeekStart - 1 * 86400000;//上周周日的时间
            starttime=getMyDate(new Date(prevWeekStart));
            endtime=getMyDate(new Date(prevWeekEnd));
            break;
        case 'thismonth':
            var currentYear=new Date().getFullYear();
            var currentMonth=new Date().getMonth();
            var monthStartDate= getMyDate(new Date(currentYear,currentMonth,1));
            starttime = monthStartDate;
            endtime = getMyDate(Date.parse(today));
            break;
        case 'lastmonth':
            var currentYear=new Date().getFullYear();
            var currentMonth=new Date().getMonth();
            var prevCurrentYear=0,prevCurrentMonth=0;
            if(currentMonth==0){
                prevCurrentYear=currentYear-1;
                prevCurrentMonth=12;
            }else{
                prevCurrentYear=currentYear;
                prevCurrentMonth=currentMonth-1;
            }
            var prevmonthLastday=(new Date(currentYear,currentMonth,1)).getTime()-86400000;
            starttime= getMyDate(new Date(prevCurrentYear,prevCurrentMonth,1));
            endtime=getMyDate(new Date(prevmonthLastday));
            break;
        case 'thisyear':
            starttime = year + '-01-01';
            endtime = getMyDate(Date.parse(today));
            break;
    }
    return {'starttime':starttime,'endtime':endtime};
}
function getMyDate(str){
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        // oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
        oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay);
    return oTime;
};
function getzf(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
