$(function(){
    $(document.body).pullToRefresh().on("pull-to-refresh", function() {
        setTimeout(function() {
            init();
            $(document.body).pullToRefreshDone();
        }, 1000);
    });
    init();
    FastClick.attach(document.body);
    //选择分类
    $(document).on('click','.header-cate-item',function(){
       var status = $(this).data('status');
       $(this).addClass('header-cate-active').siblings().removeClass('header-cate-active');
       getList(0,status);
    });
    //取消
    $(document).on('click','.sd_cancel',function(){
        var item = $(this).parents('.sd-item')
        var name = item.find('.sd-item_name').text();
        var status = item.find('.sd_status');
        var _this = $(this);
        $.confirm('确认取消'+name+'？',function () {
            var id = _this.parents('.sd_item_d_item').data('id');
            $.post(SALE_CANCEL,{id:id,ptype:'cancel'},function(res){
                if(res.state == 200){
                    $.toast('取消成功');
                    status.text('已取消');
                    _this.hide();
                }else{
                    $.toast('取消失败','cancel');
                }
            },'json')
        })

    });
    //留言
    $(document).on('click','.sd_feedback',function(){
        var id = $(this).parents('.sd_item_d_item').data('id');
        $.prompt({
            title: '留言',
            text: '',
            input: '卷码说明',
            empty: false, // 是否允许为空
            onOK: function (input) {
                $.post(SALE_FEEDBACK,{id:id,feedback:input,ptype:'feedback'},function(res){
                    if(res.state == 200){
                        $.toast('留言成功');
                    }else{
                        $.toast('留言失败','cancel');
                    }
                },'json')
            },
            onCancel: function () {
                //点击取消
            }
        });
    });
    //滑动加载
    $(window).scroll(function(){
        var options = {
            url:MY_SALES,
            data:{start:$('.sd-item').length},
            wrap:$('#sd-list')
        };
        scroll(options);
    });
    //提示下拉
    $(document).on('click','#slide-hint',function(){
        var has_up = $(this).hasClass('my-cell_slide_up');
        var hint_con = $('#hint-con');
        if(has_up){
            hint_con.slideUp();
            $(this).removeClass('my-cell_slide_up').addClass('my-cell_slide_down');
        }else{
            hint_con.slideDown();
            $(this).removeClass('my-cell_slide_up').addClass('my-cell_slide_up');
        }
    });
});
//初始化
function init(){
    var status = $('.header-cate-active').data('status');
    getList(0,status);
}
//取消订单
function _cancelSale(id){
    $.showLoading('提交中');
    $.post(SALE_CANCEL,{id:id},function(res){
        if(res.state == 200){
            $.toast('取消成功');
        }else{
            $.toast('取消失败','cancel');
        }
        $.hideLoading();
    },'json');
}
//获取列表数据
function getList(count,status){
    var options = {
        url:MY_SALES,
        data:{start:count,type:status},
        wrap:$('#sd-list')
    };
    listInit(options);
}
