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
//顶部切换
$('.sales-header-item').click(function () {
    var index = $(this).index();
    $(this).addClass('active').siblings('.sales-header-item').removeClass('active');
    if (index == 0) {
        $('#searchBar').show();
        $('.sales-wrap').eq(index).show().siblings('.sales-wrap').hide();
    }
    if (index == 1) {
        $('#searchBar').hide();
        $('.sales-wrap').eq(index).show().siblings('.sales-wrap').hide();
    }
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
/*搜索*/
$('#searchInput').on('input', function () {
    var key = $(this).val();
    showProd(key);
});
/*取消搜索*/
$(document).on('click', '#searchCancel,#searchClear', function () {
    showProd('');
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

//收藏项目(本地处理)
function colProdLocal(_this,pid,has_col){
    var type = _this.parents('.sales-item').data('type'),
        col_wrap = $('#sales-col-list'),
        cid = type == 'newest' ? $('#sales-all')
            .find('.sale-item[data-id='+pid+']')
            .parents('.sales-item').data('id') :
            _this.parents('.sales-item').data('id'),
        col_sales_wrap = $('#sales-col-list .sales-item[data-id='+cid+']');
    if (!has_col) {
        _this.addClass('on');
        $('.sale-item[data-id = '+pid+']').find('.sale-collection').addClass('on');
        var has_col_sales = col_sales_wrap.length;
        //判断收藏中有无此分类
        if(has_col_sales == 0){
            //判断克隆对象
            if(type == 'newest'){
                var sales_clone = $('#sales-all')
                    .find('.sales-item[data-id='+cid+']').clone();
            }else{
                var sales_clone = _this.parents('.sales-item').clone();
            }
            sales_clone.find('.sale-item[data-id != '+pid+']').remove();
            col_wrap.append(sales_clone);
        }else{
            if(type == 'newest'){
                var sale_clone = $('#sales-all')
                    .find('.sales-item[data-id='+cid+']')
                    .find('.sale-item[data-id = '+pid+']').clone();
            }else{
                var sale_clone = _this.parents('.sale-item').clone();
            }
            col_sales_wrap.find('.sale-list').append(sale_clone);
        }
    } else {
        $('.sale-item[data-id = '+pid+']').find('.sale-collection').removeClass('on');
        col_wrap.find('.sale-item[data-id = '+pid+']').remove();
        var has_col_sale = col_sales_wrap.find('.sale-item').length;
        if(has_col_sale == 0){
            col_sales_wrap.remove();
        }
    }
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
