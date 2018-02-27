$(function(){
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
