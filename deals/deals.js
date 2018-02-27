var deals_header_item = $('.deals-header-item');
var deals_status = $('.deals-header-active').data('status');
var deals_list_wrap = $('#deals-list');
$(function(){
    init();
    //顶部切换
    deals_header_item.bind('click', function () {
        $(this).addClass('deals-header-active').siblings().removeClass('deals-header-active');
        deals_status = $(this).data('status');
        init();
    });
    //填写物流
    $(document).on('click','.express_input',function(e){
        e.preventDefault();
        //判断是编辑还是修改
        var id = $(this).parents('.deals-item').data('id'),
            _this = $(this),
            input_default = '';
        if($(this).hasClass('express_number')){
            input_default = $(this).text();
        }
        $.prompt({
            title: '物流单号',
            text: '',
            input: input_default,
            empty: false, // 是否允许为空
            onOK: function (input) {
                // expressCallback({state:200},input,_this);
                $.post(DEALS_EXPRESS,{id:id,num:input},function(res){
                    expressCallback(res,input,_this);
                },'json');
            },
            onCancel: function () {
                //点击取消
            }
        });
    });
});
//物流回调
function expressCallback(res,input,wrap){
    var edit = wrap.hasClass('express_btn');
    if(typeof res.state != 'undefined' && res.state == 200){
        if(edit){
            var con_str ="<div class='has_express'>物流编号:" +
                "<span class='express_number express_input'>"+input+"</span>" +
                "</div>";
            wrap.after(con_str);
            wrap.hide();
        }else{
            wrap.text(input);
        }
    }else{
        $.toast('提交失败','cancel');
    }
}
function init() {
    var options = {
        url:DEALS_LIST,
        data:{type: deals_status, start: 0},
        wrap:deals_list_wrap
    };
    listInit(options);
}
$(window).scroll(function () {
    var item_num = $('.deals-item').length;
    var options = {
        url:DEALS_LIST,
        data:{type: deals_status, start: item_num},
        wrap: deals_list_wrap
    };
    scroll(options);
});
