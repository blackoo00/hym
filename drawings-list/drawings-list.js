$(function () {
// init();
    $(window).scroll(function () {
        var options  = {
            url:DRAWINGS_LIST,
            data:{start:$('.weui-cell').length},
            wrap:$('#list')
        };
        scroll(options);
    });
});
function init() {
    var options  = {
        url:DRAWINGS_LIST,
        data:{start:0},
        wrap:$('#list')
    };
    listInit(options);
    // $.post(DRAWINGS_LIST,{start:0}, function (res) {
    //     $('#list').html(res);
    // })
}
