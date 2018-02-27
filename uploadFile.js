//验证图片
function checkPic(file,files){
    var success = true;
    // 允许上传的图片类型
    var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    // 1024KB，也就是 1MB
    var maxSize = 1024 * 1024;
    // 一次性最大上传图片数量
    var maxCount = typeof MAX_COUNT == 'undefined' ? 2 : MAX_COUNT;
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
//提交图片
function postPic(options){
    var url = options.url,
        data64 = options.data64,
        temp_name = options.temp_name,
        callBack = options.callBack,
        eCallBack = options.eCallBack,
        file = options.file;

    var formData = new FormData();
    formData.append(temp_name,convertBase64UrlToBlob(data64));
    // formData.append(temp_name, file);
    $.ajax({
        url : url,
        type : "POST",
        data : formData,
        dataType:"text",
        processData : false,         // 告诉jQuery不要去处理发送的数据
        contentType : false,        // 告诉jQuery不要去设置Content-Type请求头
        success:function(data){
            var data = JSON.parse(data);
            if(typeof data.state != 'undefined' && data.state == 200){
                callBack(data);
            }else{
                eCallBack(data);
            }
        },
        error:function(){
            eCallBack();
        },
        xhr:function(){            //在jquery函数中直接使用ajax的XMLHttpRequest对象
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    console.log("正在提交."+percentComplete.toString() + '%');        //在控制台打印上传进度
                }
            }, false);

            return xhr;
        }
    });
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
