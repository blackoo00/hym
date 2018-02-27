$(function(){
    // FastClick.attach(document.body);
    var qrcode_name = $('#qrcode-wrap').find('.sale-name');
    qrcode_name.attr('style','flex:1');
    $(document).on('click','#qrcode-wrap .sale-name',function () {
       document.getElementById('qrcode').click();
    });
    //点击事件
    $('.sale-show').click(function () {
        var click = $(this).hasClass('click-off');
        if(click){
            return false;
        }
        var has_extend = $(this).siblings('.sale-extend');
        $(this).addClass('active')
            .parent('.sale-item')
            .siblings()
            .find('.sale-show')
            .removeClass('active');
        $('.sale-extend').hide();
        if(has_extend.length == 1){
            has_extend.show();
        }
    });
    //下拉选择
    $(document).on('click','.sale-extend p',function(){
        var value = $(this).data('value');
        var text = $(this).text();
        $(this).parents('.sale-extend').hide();
        var show_item = $(this).parents('.sale-item').find('.sale-value');
        var input_item = $(this).parents('.sale-item').find('.sale-value-input');
        show_item.text(text);
        input_item.val(value);
    });
    //发布
    $('#submit').click(function () {
        if(_validate()){
        // if(true){
            var post_data = _getPostData();
            $.post(SALE_SUBMIT_URL,post_data,function(res){
               if(res.state == 200){
                   $.toast('发布成功',function(){
                       window.location = SUCCESS_URL;
                   });
               }else{
                   $.toast('发布失败','cancel');
               }
            });
        }
    });
    //帮助提示
    $('.sale-help').click(function (e) {
        e.stopPropagation();
        var warn = $(this).data('warn');
        if(warn){
            $.alert($(this).data('warn'));
        }
    });
    //二维码
    $(document).on('change','#qrcode',function(event){
        var success_icon = $(this).parents('.sale-value').find('.sale-success');
            var files = event.target.files;
            // 如果没有选中文件，直接返回
            if (files.length === 0) {
                return;
            }
            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                $("#test").attr("src",URL.createObjectURL(file));
                if(!checkPic(file,files)){
                    return;
                }
                var reader = new FileReader();
                reader.onload = function(e) {
                    // console.log(file);
                    // canvasPic(e);
                    postPic(e.target.result,success_icon,file);
                };
                reader.readAsDataURL(file);
            }
    });
    //兑换码(添加)
    $(document).on('click','.sale-item_actions',function(){
        if($(this).find('.sale-item_add').length != 0){
            var item =  $(this).parents('.sale-item').clone();
            item.find('.sale-input').val('');
            item.find('.sale-show').removeClass('active');
            item.find('.sale-item_add').removeClass('sale-item_add').addClass('sale-item_del');
            var original_code_wrap = $('#original-code-list');
            original_code_wrap.append(item);
        }else{
            $(this).parents('.sale-item').remove();
        }
    });
    //兑换码(删除)
    $(document).on('click','.sale-item_del',function(){
    });
});
$('#showDatePicker').on('click', function () {
    weui.datePicker({
        start: new Date().getFullYear(),
        end: new Date().getFullYear() +1,
        defaultValue: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()],
        onChange: function (result) {
            console.log(result);
        },
        onConfirm: function (result) {
            var date = result[0] + '/' + result[1] +  '/' + result[2];
            $('#data-time-show').text(date);
            $('#datetime').val(date);
            console.log(result);
        }
    });
});
//绘制预览图片
function canvasPic(e){
    // 图片最大宽度
    var maxWidth = 300;
    var img = new Image();
    img.onload = function() {
        // 不要超出最大宽度
        var w = Math.min(maxWidth, img.width);
        // 高度按比例计算
        var h = img.height * (w / img.width);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 设置 canvas 的宽度和高度
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        var base64 = canvas.toDataURL('image/png');
    };
    img.src = e.target.result;
}
//显示预图片
function showQrcode(base64){
    var item = createCodeCom(base64);
    item.find('.sale-name').text(123);
    $('#code-list').append(createCodeCom(base64));
    return item;
}
//创建兑换码控件
function createCodeCom(base64,qrcode,code){
    var code_com_str = $('<div class="sale-item redeen-code">\n' +
        '                    <div class="qrcode-show weui_uploader_files">\n' +
        '                        <img class="qrcode_icon" src="'+base64+'"/>\n' +
        '                    </div>\n' +
        '                    <div class="sale-show">\n' +
        '                        <div class="sale-name">兑换码:</div>\n' +
        '                        <div class="sale-value">\n' +
            '                            <input readonly class="sale-input validate form-code" data-qrcode="" type="text" value="" placeholder="请输入兑换码">\n' +
        '                            <div class="sale-icon sale-help"></div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="sale-item_actions">\n' +
        '                        <div class="sale-item_del"></div>\n' +
        '                    </div>'+
        '                </div>');
    var show_wrap = code_com_str.find('.qrcode-show');
    if(code&&qrcode){
        // var qrcode_src = '<input type="hidden" class="form-qrcode" value="'+qrcode+'"/>';
        // show_wrap.append(qrcode_src);
        code_com_str.find('.sale-input').val(code);
        code_com_str.find('.sale-input').attr('data-qrcode',qrcode);
    }else{
        show_wrap.addClass('weui-uploader__file_status');
        show_wrap.append('<div class="weui-icon-warn"></div>');
    }
    //预览图片
    code_com_str.on('click','.qrcode-show',function(){
        var urls = [];
        var index = 0;
        $('.qrcode_icon').each(function(){
            urls[index ++] = $(this).attr('src');
        });
        var current = $(this).find('.qrcode_icon').attr('src');
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        });
    });
    // code_com_str.on('click','.qrcode-show',function(){
    //     createGallery();
    //     var gallery = $('#gallery');
    //     var galleryImg = gallery.find('.weui-gallery__img');
    //     galleryImg.attr('style','background-image: url('+base64+');');
    //     gallery.fadeIn(100);
    //     gallery.find('.weui-gallery__img').click(function(){
    //         gallery.fadeOut(100);
    //     });
    //     gallery.find('.weui-icon-delete').click(function(){
    //         $.confirm('确认删除?',function(){
    //             code_com_str.remove();
    //         });
    //         gallery.fadeOut(100);
    //     })
    // });
    $('#code-list').append(code_com_str);
}
//创建gallery
function createGallery(){
    if($('#gallery').length == 0){
        var str = '<div class="weui-gallery" style="display: none" id="gallery">\n' +
            '        <span class="weui-gallery__img">\n' +
            '        </span>\n' +
            '        <span class="weui-gallery__img">\n' +
            '        </span>\n' +
            '        <div class="weui-gallery__opr">\n' +
            '            <a href="javascript:" class="weui-gallery__del">\n' +
            '                <i class="weui-icon-delete weui-icon_gallery-delete"></i>\n' +
            '            </a>\n' +
            '        </div>\n' +
            '    </div>';
        $(document.body).append(str);
    }
}
//提交图片
function postPic(result,success_icon,file){
    // return;
    // var code_item = showQrcode(result);
    var formData = new FormData();
    // formData.append("qrcode",convertBase64UrlToBlob(result));
    formData.append("qrcode", file);
    // createCodeCom(result);
    // return;
    $.ajax({
        url : QRCODE_URL,
        type : "POST",
        data : formData,
        dataType:"json",
        processData : false,         // 告诉jQuery不要去处理发送的数据
        contentType : false,        // 告诉jQuery不要去设置Content-Type请求头
        success:function(data){
            var data = JSON.parse(data);
            if(typeof data.state != 'undefined' && data.state == 200){
                createCodeCom(result,data.path,data.code);
                success_icon.show();
            }else{
                createCodeCom(result);
                // $.alert('二维码识别失败，请重新上传');
            }
            // window.location.href="${ctx}"+data;
        },
        error:function(){
            createCodeCom(result);
        },
        xhr:function(){            //在jquery函数中直接使用ajax的XMLHttpRequest对象
            var xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    console.log("正在提交."+percentComplete.toString() + '%');        //在控制台打印上传进度
                    // var process = code_item.find('.weui-uploader__file-content');
                    // process.html(percentComplete.toString() + '%');
                    // if(percentComplete.toString() == 100){
                    //     process.remove();
                    //     code_item.find('.qrcode-show').removeClass('weui-uploader__file_status');
                    // }
                }
            }, false);

            return xhr;
        }
    });
}
//验证图片
function checkPic(file,files){
    var success = true;
    // 允许上传的图片类型
    var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    // 1024KB，也就是 1MB
    var maxSize = 1024 * 1024;
    // 最大上传图片数量
    var maxCount = MAX_COUNT;
    // 如果类型不在允许的类型范围内
    if (allowTypes.indexOf(file.type) === -1) {
        $.alert('该类型不允许上传');
        success = false;
        return false;
    }

    if (files.size > maxSize) {
        $.alert('图片太大，不允许上传');
        success = false;
        return false;
    }

    if (files.length > maxCount) {
        $.alert('最多只能上传' + maxCount + '张图片');
        success = false;
        return false;
    }
    return success;
}
//图片转码
function convertBase64UrlToBlob(urlData){

    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob( [ab] , {type : 'image/png'});
}
function _validate(){
    var warn = '';
    var success = true;
    //单独验证时间
    if($('#datetime').length == 1){
        var datetime = $('#datetime').val();
        datetime = new Date(datetime);
        datetime = Date.parse(datetime);
        var sysDate = new Date();
        sysDate = Date.parse(sysDate);
        datetime += 86400 * 1000;
        if(datetime < sysDate){
            $.alert('输入时间小于当前时间');
            success = false;
            return false;
        }
    }
    $('.validate').each(function(){
        if(!$(this).val()){
            warn = typeof $(this).data('warn') == 'undefined' ?
                $(this).attr('placeholder') : $(this).data('warn');
            $.alert(warn);
            success = false;
            return false;
        }
    });
    return success;
}
function _getPostData(){
    var data = $('#sale-form').serialize();
    data = _getCardData(data);
    return data;
};
/*获取卡卷数据*/
function _getCardData(form_data){
    var type = _fetCardType();
    console.log(type);
    switch(type){
        case 1:
            form_data += _getCodeData();
            break;
        case 2:
            form_data += _getQrcodeData();
            break;
        case 3:
            form_data += _getCodeAndPwd();
            break;
    }
    return form_data;
}
/*判断卡卷类型*/
function _fetCardType(){
    var type = 1;//单独卡卷
    if($('.redeen-code').length != 0){
        type = 2;//通过二维码读取卡卷
    }
    if($('.sale_card').length != 0){
        type = 3;//卡卷和卡密
    }
    return type;
}
/*单独获取卡卷*/
function _getCodeData(){
    var code_data = '';
    $('.form-code').each(function(){
        code_data += $(this).val() + ',';
    });
    if(code_data){
        code_data = stringDelVal(code_data,',');
    }
    return '&codes='+code_data
}
/*通过二维码获取卡卷*/
function _getQrcodeData(){
    var code_data = '';
    var qrcode_data = '';
    $('.form-code').each(function(){
        if(typeof $(this).data('qrcode') != 'undefined'){//判断是否有二维码
            qrcode_data += $(this).data('qrcode') + ',';
        }
        code_data += $(this).val() + ',';
    });
    if(code_data){
        code_data = stringDelVal(code_data,',');
    }
    if(qrcode_data){
        qrcode_data = stringDelVal(qrcode_data,',');
    }
    return '&codes='+code_data+'&qrcodes='+qrcode_data;
}
/*获取卡卷账号密码*/
function _getCodeAndPwd() {
    var code_data = '';
    var pwd_data = '';
    $('.form-code').each(function(){
        code_data += $(this).val() + ',';
    });
    $('.form-pwd').each(function(){
        pwd_data += $(this).val() + ',';
    });
    if(code_data){
        code_data = stringDelVal(code_data,',');
    }
    if(pwd_data){
        pwd_data = stringDelVal(pwd_data,',');
    }
    return '&codes='+code_data+'&pwds='+pwd_data;
}

