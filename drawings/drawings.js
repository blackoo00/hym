var money = $('#money').text();
if($('#money').text() == 0){
    $('#submit').removeClass('active');
}
$('#s11').click(function(){
    console.log($('#s12').prop('checked'));
    if($('#s12').prop('checked')){
        $('#s12').checked = false;
    }else{
        $('#s12').attr('checked','checked');
    }
    $(this).checked = true;
});
$(document).on('click','#submit',function(){
    if(!$(this).hasClass('active')){
        return;
    }else{
        $.ajax({
            url:DRAWINGS_URL,
            data:{money:money},
            type:'post',
            dataType:'json',
            success:function(res){
                if(typeof res.state != 'undefined' && res.state == 200){
                    $.toast('提交成功',500,function(){
                        window.location = SUCCESS_PAGE;
                    });
                }else{
                    $.toast('提交失败','cancel');
                }
            },
            error:function(res){
                $.toast('提交失败','cancel');
            }
        });
    }
});
