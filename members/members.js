$(function(){
    init();
    navBindClick(function(){init()});
    $(window).scroll(function(){
        options = {
            url:'MEMBERS',
            data:{start:$('.member').length,level:$('.nav-item.active').data('level')},
            wrap:$('#members-list')
        };
        scroll(options,function(res){
            apply(res);
        });
    })
});
var wrap = $('#members-list');
function init(){
    options = {
        url:'MEMBERS',
        data:{start:0,level:$('.nav-item.active').data('level')},
        wrap:wrap
    };
    listInit(options,function(res){
        apply(res);
    });
}
function apply(res){
    var list_str = '';
    for(index in res){
        var data = res[index];
        var item_str = '<div class="member my-cell_access my-cell_line">\n' +
            '            <div class="member_head">\n' +
            '                <img src="%s"/>\n' +
            '            </div>\n' +
            '            <div class="member_detail">\n' +
            '                <div class="member_nickname" data-count="%s">%s</div>\n' +
            '                <div class="member_jointime">已加入团队%s天</div>\n' +
            '            </div>\n' +
            '        </div>'
        list_str += sprintf(item_str,data.head_pic,data.nickname,data.sub_count,data.reg_time);
    }
    if(wrap.html().length == 0){
        wrap.html(list_str);
    }else{
        wrap.append(list_str);
    }
}
