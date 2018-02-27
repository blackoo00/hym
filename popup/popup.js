$(function () {
    applyPopup();
    var popup_item = $('#popup-item');
    $(document).on('click','#popup-btn',function(){
      if(popup_item.is(':visible')){
          popup_item.fadeOut(100);
      }else{
          popup_item.fadeIn(100);
      }
   });
    $(document).on('click','#popup-mask,#popup-close',function(){
        popup_item.fadeOut(100);
    })
});
function applyPopup(){
    var str = $('<div id="popup-wrap">\n' +
        '    <div class="popup-btn" id="popup-btn">\n' +
        '\n' +
        '    </div>\n' +
        '    <div class="popup-item" id="popup-item">\n' +
        '        <div class="popup-close" id="popup-close"></div>\n' +
        '        <div class="popup-mask" id="popup-mask"></div>\n' +
        '        <div class="popup-con" id="popup-con">\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>');
    str.find('.popup-con').html(POPUP_CON);
    $(document.body).append(str);
}
