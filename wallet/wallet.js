var aliNum = $('#ali-num').val();
var noAliAccount = $('#no-ali-account');
var AliAccount = $('#ali-account');
if(aliNum){
    AliAccount.show();
    noAliAccount.hide();
}else{
    AliAccount.hide();
    noAliAccount.show();
}
$('.check-ali').click(function () {
   if(!aliNum){
       $.alert('请先绑定支付宝');
       return false;
   }
});

