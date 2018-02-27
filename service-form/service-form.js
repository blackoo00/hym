$(function () {
    // initSpec($('#goods_id').val());
    init();
    /*选择状态*/
    $(document).on('click', '.choose-type-item', function () {
        var type = $(this).find('.choose-type-icon').data('value');
        if(type == 1){
            $('#upload-pic').show();
        }else{
            $('#upload-pic').hide();
        }
        $(this).find('.choose-type-icon')
            .addClass('choose')
            .removeClass('unchoose')
            .end()
            .siblings()
            .find('.choose-type-icon')
            .addClass('unchoose')
            .removeClass('choose')
    });
    $(document).on('click', '#slide-down', function () {
        if ($('#slide-con').is(':visible')) {
            $('#slide-con').slideUp();
        } else {
            $('#slide-con').slideDown();
        }
    });
    $(document).on('click', '#disput', function () {
        $('#slide-wrap').show();
    });
    $(document).on('click', '#finish', function () {
        $('#slide-wrap').hide();
    });
    /*选择商品*/
    $(document).on('click', '#goods_id', function () {
        var value = $(this).val();
        initSpec(value);
    });
    /*选择商品属性*/
    $(document).on('click', '#spec_key', function () {
        getFormData($(this).val());
        ProdTotalFee();
    });
    /*输入产品数量*/
    $(document).on('change', '#number', function () {
        ProdTotalFee();
    });
    /*选择支付方式*/
    $(document).on('click', '#pay-type', function () {
        ProdTotalFee();
    });
    /*上传图片*/
    $(document).on('change','#uploaderInput',function(){
        var files = event.target.files;
        // 如果没有选中文件，直接返回
        if (files.length === 0) {
            return;
        }
        for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i];
            if(!checkPic(file,files)){
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var options = {
                    file:file,
                    url:UPLOAD_PIC,
                    temp_name:'pic',
                    data64:e.target.result,
                    callBack:function(data){createPicCom(data.path)},
                    eCallBack:function(){createPicErrorCom(e.target.result)}
                };
                postPic(options);
            };
            reader.readAsDataURL(file);
        }
    });
    /*删除图片*/
    $(document).on('click','.popup-close',function(){
        $(this).parents('.weui-uploader__file').remove();
    });
    /*提交*/
    $(document).on('click', '#service-form-submit', function () {
        var type = $('.choose-type-item').find('.choose').data('value');
        if (!validate(type)) {
            return;
        }
        var post_data = getFormData(type);
        $.post(SERVICE_FORM, post_data, function (res) {
            if (typeof res.state != 'undefined' && res.state == 200) {
                $.alert('提交成功', function () {
                    window.history.go(-1);
                    // location.reload();
                });
            } else {
                $.alert('提交失败');
            }
        }, 'json');
    });
});
/*创建图片控件(成功)*/
function createPicCom(src){
    var str = $('<li class="weui-uploader__file form-pic" data-src="'+src+'" style="background-image:url('+src+')">' +
        '<div class="popup-close"></div></li>');
    $('#uploaderFiles').append(str);
}
/*创建图片控件(失败)*/
function createPicErrorCom(data64){
    var str = $('<li class="weui-uploader__file weui-uploader__file_status"\n' +
        '    style="background-image:url('+data64+');">\n' +
        '        <div class="weui-uploader__file-content">\n' +
        '        <i class="weui-icon-warn"></i>\n' +
        '        </div>\n' +
        '<div class="popup-close"></div>\n'+
        '        </li>');
    $('#uploaderFiles').append(str);
}
/*初始化*/
function init() {
    //获取来源
    getFrom($('#goods_id').val());
    var type = $('.choose-type-item').find('.choose').data('value');
    if (type == 3) {
        $('#upload-pic').hide();
        $('#slide-wrap').show();
    }else{
        $('#upload-pic').show();
    }
}
/*初始化商品属性列表*/
function initSpec(value) {
    var sltCity = document.getElementById("spec_key");
    var country = city[value];
    sltCity.length = 1;
    for (var i in country) {
        if (country.hasOwnProperty(i)) {
            sltCity.options.add(new Option(country[i], i));
        };
    }
    getFrom(value);
    if (sltCity.length == 1) {
        $('#spec_key').hide();
        ProdTotalFee();
    } else {
        $("#amount").text(0);
        $('#spec_key').show();
    }
}
/*获取来源*/
function getFrom(pid){
    $.ajax({
        url:FROM_URL,
        data:{goods_id:pid},
        dataType:'json',
        type:'post',
        success:function(data){
            var list = '';
            for(index in data){
                list +='<option value="'+index+'">'+data[index]+'</option>';
            }
            $('#from').html(list);
        }
    })
}

/*计算商品总价*/
function ProdTotalFee() {
    var goods_id = document.getElementById("goods_id").value;
    var spec_key = document.getElementById("spec_key").value;
    var number = document.getElementById("number").value;
    var paytype = document.getElementById("pay-type").value;
    if (goods_id != 0) {
        if (spec_key == 0 && document.getElementById("spec_key").length > 1) {
            $("#amount").val(0);
        }
        else {
            htmlobj = $.ajax({
                url: GET_PROD_PRICE, dataType: "text",
                data: "goods_id=" + goods_id + "&spec_key=" +
                spec_key + "&paytype=" + paytype, async: false
            });
            var total_fee = htmlobj.responseText * number;
            $("#amount").val(total_fee);
        }
    } else {
        $("#amount").val(0);
    }
}

function validate(type) {
    let validate = true;
    if (typeof type == 'undefined') {
        $.alert('请选择状态');
        validate = false;
    }
    $('.validate').each(function () {
        if ($(this).val() == '') {
            $.alert($(this).data('warn'));
            validate = false;
        }
    });
    return validate
}

/*提交数据*/
function getFormData(type) {
    var id = $('#id').val();
    var data = {};
    var upsit_data = {};
    $('.form-data').each(function () {
        var key = $(this).attr('name');
        var value = $(this).val();
        data[key] = value
    });
    data['type'] = type;
    if (type == 3) {
        upsit_data = $('#form').serialize();
        upsit_data += '&type=' + type;
    }
    if(type == 1){
        data['pics'] = '';
        $('.form-pic').each(function(){
            var src = $(this).data('src');
            if(src){
                data['pics'] += src + ',';
            }
        });
        data['pics']=data['pics'].substring(0,data['pics'].length-1);
    }
    var post_data = type == 3 ? upsit_data : data;
    return post_data;
}

function callBack(res) {
    if (typeof res.state != 'undefined' && res.state == 200) {
        $.alert('提交成功')
    } else {
        $.alert('提交失败')
    }
}
