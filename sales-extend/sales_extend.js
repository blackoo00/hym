//初始化
$(document).ready(function () {
    initCateNum();
    $('.sale-con').click(function(){
        $.toast.prototype.defaults.duration = 100000000;
        if($(this).parent('.sale-item').hasClass('sale-off')){
            $.alert("商品库存已达上限，待库存释放后再上传.");
            return false;
        }
    })
});
//显示细则
$('#sales-hint').click(function(){
    var hint_on = $(this).hasClass('on');
    var hint_con = $('#sales-hint-con');
    if(hint_on){
        $(this).removeClass('on');
        hint_con.slideUp();
    }else{
        $(this).addClass('on');
        hint_con.slideDown();
    }
})
//点击分类
$(document).on('click','.cate-name',function () {
    var parent = $(this).parent('.sale-category');
    var list_wrap = parent.next('.sale-list');
    var list_show = list_wrap.is(':visible');
    var col_btn = parent.find('.cate-collection');
    var count = parent.find('.cate-count-wrap');
    if (list_show) {
        //收起状态下1：隐藏收藏按钮，2：显示数字
        col_btn.hide();
        count.show();
        list_wrap.slideUp();
        $(this).addClass('off').removeClass('on');
    } else {
        col_btn.show();
        count.hide();
        list_wrap.slideDown();
        $(this).removeClass('off').addClass('on');
    }
});
//分类收藏按钮
$(document).on('click', '.cate-collection', function (e) {
    var has_col = $(this).hasClass('col');
    //1：图标改为钩；2：下拉列表显示收藏按钮
    var parent = $(this).parents('.sale-category');
    var prod_col = parent.next('.sale-list').find('.sale-collection');
    if (!has_col) {
        $(this).addClass('col');
        prod_col.show();
    } else {
        $(this).removeClass('col');
        prod_col.hide();
    }
});
//项目收藏按钮
$(document).on('click', '.sale-collection', function () {
    var id = $(this).parents('.sale-item').data('id');
    var _this = $(this);
    var has_col = $(this).hasClass('on');
    colProd(id,has_col,function(){colProdLocal(_this,id,has_col)});
});
//显示项目
function showProd(key) {
    $('#sales-all .sale-name').each(function () {
        var context = $(this).text();
        if (context.indexOf(key) > -1) {
            $(this).parents('.sale-item').show();
            $(this).parents('.sales-item').show();
        } else {
            $(this).parents('.sale-item').hide();
        }
    });
    $('#sales-all .sales-item').each(function(){
        var show_length = $(this).find('.sale-item:visible').length;
        if(show_length == 0){
            $(this).hide();
        }else{
            $(this).show();
        }
    })
}
//统计分类子类数目
function initCateNum() {
    $('.sale-list').each(function () {
        var num = $(this).find('.sale-item').length;
        $(this).prev('.sale-category').find('.cate-count').text(num);
    })
}
//收藏项目(服务端处理)
function colProd(pid,has_col,callback) {
    $.showLoading('收藏中');
    var type = has_col ? 'cancel' : 'add';
    $.post(PROD_COLLECTION, {form_id: pid,type:type}, function (res) {
        $.hideLoading();
        if (typeof res.state != 'undefined' && res.state == 200) {
            $.toast('收藏成功');
            callback();
        } else {
            $.alert('修改失败');
        }
    }, 'json');
}
