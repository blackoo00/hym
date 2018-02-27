$('.spec-item').click(function(){
    var type = $(this).data('type');
    var checked = $(this).find(":input[type='checkbox']").is(":checked");
    $('.spec-con-item').each(function(){
        if($(this).data('type') == type){
            if(checked){
                $(this).show();
            }else{
                $(this).hide();
            }
        }
    });
});
$('#sepc-submit').click(function(){
    var post_data = getPostData();
    $.post(SPEC_POST,JSON.stringify(post_data),function(){

    },'json')
});
function getPostData(){
    var data = [];
    $('.spec-item').each(function(){
        var checked = $(this).find(":input[type='checkbox']").is(":checked");
        if(checked){
            var temp_data = {};
            temp_data['choose'] = $(this).find(":input[type='checkbox']").attr('name');
            // temp_data['comp'] = $(this).data('com');
            var has_area = $(this).find('.spec-area').length;
            if(has_area == 1){
                temp_data['area'] = $(this).find('.spec-area').val();
            }
            var has_value = $(this).find('.spec-value').length;
            if(has_value == 1){
                temp_data['value'] = $(this).find('.spec-value').val();
            }
            data.push(temp_data);
        }
    });
    return data;
}
