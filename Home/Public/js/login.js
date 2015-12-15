
/**
 * 登录页js处理
 * 账号限制为5~17位
 * 密码限制5~32位
 */

$(function(){
    flag = true;
    //account失去焦点处理
    $('form input:eq(0)').blur(function(){
        var account = $(this).val();
        if(account.length < 5 || account.length > 17){
            $(this).css('border','1px solid red');
            flag = false;
        }else{
            $(this).removeAttr('style');
            flag =true;
        }
    });
    //pwd失去焦点处理
    $('form input:eq(1)').blur(function(){
        
        var pwd = $(this).val();
        if(pwd.length < 5 || pwd.length > 32){
            $(this).css('border','1px solid red');
            flag =false;
        }else{
            $(this).removeAttr('style');
            flag = true;
        }
    });
    
    //表单数据提交
    $('#login').click(function(){
//        var account = $('form input:eq(0)').val();
//        var pwd = $('form input:eq(1)').val();
//        if(!flag){
//            return flag;
//        }
//        $.post(login,{account:account,pwd:pwd},function(msg){
//            if(msg ==0){
//                $('fieldset p:eq(1)').after("<span id='login-error'>用户名或密码错误</span>");
//            }
//        },'json');
        return flag;
    });
});