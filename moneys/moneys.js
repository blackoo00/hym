$(function () {
    init();
    $(window).scroll(function () {
        var options  = {
            url:MONEY_LIST,
            data:{start:$('.weui-cell').length},
            wrap:wrap
        };
        scroll(options,function(res){
            apply(res);
        });
    });
});
var wrap = $('#list');
function init() {
    var options  = {
        url:MONEY_LIST,
        data:{start:0},
        wrap:wrap,
    };
    listInit(options,function(res){
        apply(res);
    });
}
function apply(res){
    var list_str = '';
    var item_str = '<a href="javascript:;" class="weui-cell">\n' +
        '            <div class="weui-cell__hd">\n' +
        '                <span class="money"></span>\n' +
        '            </div>\n' +
        '            <div class="weui-cell__bd">\n' +
        '                <p>%s</p>\n' +
        '                <p class="status-time">%s</p>\n' +
        '            </div>\n' +
        '            <div class="weui-cell__ft">%s</div>\n' +
        '        </a>';
    for(index in res){
        list_str += sprintf(item_str,
            res[index]['desc'],res[index]['change_time'],res[index]['user_money'] > 0 ? '+'+res[index]['user_money'] : res[index]['user_money'])
    }
    if(wrap.html().length == 0){
        wrap.html(list_str);
    }else{
        wrap.append(list_str);
    }
}

