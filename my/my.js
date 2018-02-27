var edit_id = $('#edit-my-ID');
var id = $('#personal-ID');
var edit_nickname = $('#edit-my-nickname');
var nickname = $('#personal-edit-nickname');
var score_explain = $('#my-score');
edit_id.bind('click',function(){
    id.hide();
    nickname.show();
});
var my_id_value_wrap = $('#my-id-value');
var my_id_edit_value_wrap = $('#my-id-edit-value');
edit_nickname.bind('click',function () {
    var new_nickname_value = my_id_edit_value_wrap.val();
    if(new_nickname_value){
        $.post(EDIT_NICKNAME,{nickname:new_nickname_value},function(res){
            if(typeof res.state != 'undefined' && res.state == 200){
                $.alert('修改成功');
                my_id_value_wrap.text(new_nickname_value);
                my_id_edit_value_wrap.val(new_nickname_value);
            }else{
                $.alert('修改失败');
            }
        },'json')
    }else{
        $.alert('昵称不能为空');
    }
    id.show();
    nickname.hide();
});

score_explain.bind('click',function(){
    $.alert({
        title: '说明',
        text: '内容文案',
        onOK: function () {
            //点击确认
        }
    });
});
var deals_num = $('.my-deal-item-num');
deals_num.each(function(){
    var num = $(this).text();
    if(num <= 0){
        $(this).hide();
    }
});
$('.deal-kind').click(function(){
    var index = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    $('.my-deal-content').eq(index).show().siblings('.my-deal-content').hide();
    $('.my-achievement-content').eq(index).show().siblings('.my-achievement-content').hide();
});
