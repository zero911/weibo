/**
 * 注册界面处理
 * account：5~17
 * pwd:5~32
 * uname 2~10
 * 
 */

$(function(){
    
    flag = true;
    
    //验证码点击随机生成处理
    $('#verify-img').click(function(){

        $(this).attr('src' , path +'/verifyImg/' + Math.random());
    });
    //account失去焦点
    $('#account').blur(function(){
        var account = $(this).val();
        //清除checked元素
        $('#checked1').remove();
        if(account.length < 5 || account.length > 17 || account.charCodeAt() > 255){

            //设置边框为红色
            $(this).css('border','1px solid red');
            var append = "<span id='checked1'><span id='span-error'></span>"+
                    "&nbsp;<span id='error-color'>账户必须是5~17位字符数字下划线组成</span></span>";
            $('fieldset p:first').append(append);
            flag = false;
            return;
        }
        //异步获得account是否可用
        $.post(checkAccount,{account:account},function(msg){
            if(msg == 0){ 
                //设置边框为红色
                $(this).css('border', '1px solid red');
                var append = "<span id='checked1'><span id='span-error'></span>" +
                        "&nbsp;<span id='error-color'>账户名被占用</span></span>";
                $('fieldset p:first').append(append);
                flag = false;
            }else{
                var append = "<span id='checked1'><span id='span-success'></span>";
                $('fieldset p:first').append(append);
                flag = true;
            }
        },'json');

    });
    //密码失去焦点
    $('#pwd').blur(function(){
        var pwd = $(this).val();
        $('#checked2').remove();
        if(pwd.length < 5 || pwd.length >32 || pwd.charCodeAt() > 255){            
            //设置边框为红色
            $(this).css('border','1px solid red');
            var append = "<span id='checked2'><span id='span-error'></span>"+
                    "&nbsp;<span id='error-color'>密码必须是5~17位字符数字下划线组成</span></span>";
            $('fieldset p:eq(1)').append(append);
            flag = false;
        }else{
            //清除边框颜色
            $(this).removeAttr('style');
            var append = "<span id='checked2'><span id='span-success'></span>";
            $('fieldset p:eq(1)').append(append);
            flag = true;
        }
    });
    //确认密码
    $('#pwded').blur(function(){
        var pwd = $('#pwd').val();
        var pwded = $(this).val();
        $('#checked3').remove();
        if(pwd != pwded){
            //设置边框为红色
            $(this).css('border','1px solid red');
            var append = "<span id='checked3'><span id='span-error'></span>"+
                    "&nbsp;<span id='error-color'>两次输入的密码不一致</span></span>";
            $('fieldset p:eq(2)').append(append);
            flag = false;
        }else{
            //清除边框颜色
            $(this).removeAttr('style');
            var append = "<span id='checked3'><span id='span-success'></span>";
            $('fieldset p:eq(2)').append(append);
            flag = true;
        }
    });
    //用户昵称
    $('#uname').blur(function(){
        var uname = $(this).val();
        if(uname.length <2 || uname.length > 10 ){   
            $('#checked4').remove();
            //设置边框为红色
            $(this).css('border','1px solid red');
            var append = "<span id='checked4'><span id='span-error'></span>"+
                    "&nbsp;<span id='error-color'>昵称必须为2~10位</span></span>";
            $('fieldset p:eq(3)').append(append);
            flag = false;
            return;
        }
        
        $.post(checkUname, {uname: uname}, function (msg) {
            if (msg==0) {
                $('#checked4').remove();
                //设置边框为红色
                $(this).css('border', '1px solid red');
                var append = "<span id='checked4'><span id='span-error'></span>" +
                        "&nbsp;<span id='error-color'>昵称被占用</span></span>";
                $('fieldset p:eq(3)').append(append);
                flag = false;
            }else{
                $('#checked4').remove();
                //清除边框颜色
                $(this).removeAttr('style');
                var append = "<span id='checked4'><span id='span-success'></span>";
                $('fieldset p:eq(3)').append(append);
                flag = true;
            }
        });

    });
    //验证码
    $('#verify').blur(function(){
        var code = $(this).val();
        //清除checked元素
        
        $.post(checkVerify,{code:code},function(msg){
           if(msg==1){
               $('#checked5').remove();
                //清除边框颜色
                $(this).removeAttr('style');
                var append = "<span id='checked5'><span id='span-success'></span>";
                $('fieldset p:eq(4)').append(append);
                flag = true;
           }else{
               $('#checked5').remove();
                $(this).css('border', '1px solid red');
                var append = "<span id='checked5'><span id='span-error'></span>";
                $('fieldset p:eq(4)').append(append);
                flag = false;
           }
        });
    });
    
    $('#regis').click(function(){
        var account = $('#account').val();
        var pwd = $('#pwd').val();
        var pwded = $('#pwded').val();
        var uname = $('#uname').val();
        var code = $('#verify').val();
        if(account.length<1){
            $('#account').css('border','1px solid red');
            flag = false;
        }
        if(pwd.length<1){
            $('#pwd').css('border','1px solid red');
            flag = false;
        }
        if(pwded.length<1){
            $('#pwded').css('border','1px solid red');
            flag = false;
        } 
        if(uname.length<1){
            $('#uname').css('border','1px solid red');
            flag = false;
        }
        if(code.length<1){
            $('#verify').css('border','1px solid red');
            flag = false;
        }
        
        return flag;
    });
});

