$('.deal-value').each(function () {
    var value = $(this).text();
    var next = $(this).next();
    var next_value = next.text();
    if (value != next_value) {
        $(this).addClass('delete');
    }else{
        next.hide();
    }
});
$('.deal-btn').click(function(){
    $.confirm({
        title: '提示',
        text: '确认修改信息？',
        onOK: function () {
            $.post(DEAL_SURE,{id:NEXT_DEAL_ID,state:STATE},function(res){
                if(typeof res.state != 'undefined' && res.state == 200){
                    $.alert('修改成功',function () {
                        location.reload();
                    });
                }else{
                    $.alert('修改失败');
                }
            },'json')
        },
        onCancel: function () {
        }
    });
});
$('#cancel-deal').click(function(){
    $.confirm({
        title: '提示',
        text: '确认取消报单？',
        onOK: function () {
            $.post(CANCEL_DEAL,{id:DEAL_ID,state:STATE},function(res){
                if(typeof res.state != 'undefined' && res.state == 200){
                    $.alert('取消成功',function () {
                        location.reload();
                    });
                }else{
                    $.alert('取消失败');
                }
            },'json')
        },
        onCancel: function () {
        }
    });
});
