$('#submit').click(function(){
    var alipay = $('#alipay').val();
    var alipay_name = $('#alipay_name').val();
    if(!alipay){
        $.alert('请输入账号');
        return;
    }
    if(!alipay_name){
        $.alert('请输入姓名');
        return;
    }
    $.post(WALLET_EDIT,{alipay:alipay,alipay_name:alipay_name},function(res){
        if(typeof res.state!= 'undefined' && res.state == 200){
            $.alert('提交成功',function(){
                window.location = WALLET_EDIT_SUCCESS;
            })
        }else{
            $.alert('提交失败')
        }
    },'json')
})
