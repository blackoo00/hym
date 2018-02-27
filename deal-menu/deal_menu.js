$(function () {
    // var mySwiper = new Swiper('.swiper-container', {
    //     speed: 400,
    //     // spaceBetween: 100,
    //     autoplay: {
    //         delay: 4000,
    //     },
    //     loop:true
    // });
    var location = window.location.href;
    var menu = getUrlParam('menu');
    console.log(menu);
    if(menu == 1){
        console.log(menu);
        var menu1 = $('#first-menu');
        var menu2 = $('#seconde-menu');
        menu1.hide();
        menu2.show();
    }
    pushHistory();
    window.addEventListener("popstate", function(e) {
        // window.location.reload();
        toggle();
    }, false);
    $(document).on('click','#offline',function () {
        pushHistory2();
        toggle();
    });
    // $(document).on('click','#offline',function () {
    //     test();
    // });
});

function test() {
    var str = '<a href="http://www.baidu.com" class="menu-item menu-item_wine">茅台</a>\n' +
        '<a href="javascript:;" class="menu-item menu-item_iphone">苹果</a>';
    $('#first-menu').html(str);
}

function toggle(){
    var menu1 = $('#first-menu');
    var menu2 = $('#seconde-menu');
    if(menu2.is(':visible')){
        menu1.show();
        menu2.hide();
    }else{
        menu1.hide();
        menu2.show();
    }
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function pushHistory() {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
}
function pushHistory2() {
    var state = {
        title: "title",
        url: "?menu=1"
    };
    window.history.pushState(state, "title", "?menu=1");
}
