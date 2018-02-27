/*列表页初始化*/
function listInit(options, callback) {
    var url = options.url,
        post_data = options.data,
        wrap = options.wrap;
    appendScrollCom(wrap);
    var scroll_loading = $('#scroll-loading');
    var scroll_no_more = $('#no-more');
    scroll_loading.show();
    scroll_no_more.hide();
    wrap.html('');
    // callback([{pic:'test.jpg',nickname:'H',number:10,join_time:10}]);
    // return;
    // setInterval(function(){
    //     scroll_no_more.show();
    //     scroll_loading.hide();
    // },3000);
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        data: post_data,
        success: function (res) {
            if (typeof res.state != 'undefined' && res.state == 200) {
                if (res.list) {
                    callback(res.list);
                } else {
                    scroll_no_more.show();
                }
            }
            scroll_loading.hide();
        },
        error: function () {
            scroll_no_more.show();
        }
    });
}
/*滚动加载*/
function scroll(options, callback) {
    var url = options.url,
        post_data = options.data,
        wrap = options.wrap;
    var scroll_loading = $('#scroll-loading');
    var scroll_no_more = $('#no-more');
    var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    var clientHeight = window.innerHeight;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var loading = true;
    if (scrollTop + clientHeight >= htmlHeight && loading == true) {
        appendScrollCom(wrap);
        // callback([{head:'test.jpg',nickname:'H',count:10,join:10}]);
        // return;
        loading = false;
        scroll_loading.show();
        $.ajax({
            url: url,
            type: "POST",
            data: post_data,
            dataType: 'json',
            async: false,
            success: function (res) {
                if (!loading) {
                    if (typeof res.state != 'undefined' && res.state == 200) {
                        if (res.list) {
                            callback(res.list);
                        } else {
                            scroll_no_more.show();
                        }
                    }
                }
                scroll_loading.hide();
                loading = true;
            },
            error: function (res) {
                scroll_loading.hide();
                scroll_no_more.show();
            }
        })
    }
}
/*注入加载和再无更多控件*/
function appendScrollCom(wrap) {
    var has_loading = $('#scroll-loading').length;
    if (has_loading != 1) {
        var loading = '<div class="weui-loadmore" id="scroll-loading" style="display: none;">\n' +
            '        <i class="weui-loading"></i>\n' +
            '        <span class="weui-loadmore__tips">正在加载</span>\n' +
            '    </div>';
        var no_more = '<div class="weui-loadmore weui-loadmore_line" id="no-more" style="display: none;">\n' +
            '        <span class="weui-loadmore__tips">没有更多</span>\n' +
            '    </div>';
        wrap.after(no_more);
        wrap.after(loading);
    }
}
/*导航栏*/
function navBindClick(callback) {
    $(document).on('click', '.nav-item', function () {
        $(this).addClass('active').siblings().removeClass('active');
        callback();
    });
}
/*去除字符串最后的逗号*/
function stringDelVal(string,symbol){
    string = (string.substring(string.length-1) == symbol)?string.substring(0,string.length-1):string;
    return string;
}
