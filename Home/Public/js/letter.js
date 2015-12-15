/**
 * 私信js
 */

$(function(){
    //发送私信按钮处理
    $('.send').click(function(){
        var letter = $('#letter');
        var leftObj = ($(window).width()-letter.width()) / 2;
        var topObjc = $(document).scrollTop() + ($(window).height()-letter.height()) / 2;
        letter.css({
            left:leftObj + 'px',
            top:topObjc + 'px'
        }).slideDown(200);
        $('.send-user').find('img').remove();
        createBg('letter-bg');
        drag($('#letter'),$('#letter').find('.letter_head'));
        //letter.find("input[name='myname']").live('focus',function(){});//文本无法使用获得焦点事件？
    });
    //默认颜色
//    ;css('borderColor', '#CCCCCC');
    //check私信发送人
    $("input[name='myname']").focus(function(){
        $(this).css('borderColor', '#FF9B00');
    }).blur(function(){
        var consVal = $(this).val();
        $('.send-user').find('img').remove();
        if(consVal.length <2 || consVal.length > 10 ){
            $(this).css('borderColor', '#FF9B00');
            $('.send-user').append("<img src='" + path_root +"/Home/Public/Images/unchecked.gif'>");
            return false;
        }
        $.post(checkName,{username:consVal},function(msg){
            $('.send-user').find('img').remove();
            if(msg =='1'){
                $("input[name='myname']").css('borderColor', '#CCCCCC');
                $('.send-user').append("<img src='" + path_root +"/Home/Public/Images/checked.gif'>");
            }else{
                $("input[name='myname']").css('borderColor', '#FF9B00');
                $('.send-user').append("<img src='" + path_root +"/Home/Public/Images/unchecked.gif'>");
            }
        });    
    });
    //发送私信处理
    $('.send-lt-sub').click(function(){
        var unameObj = $("input[name='myname']");
        var consObj = $('.send-cons');
        var cons = consObj.val();
        var uname = unameObj.val();
        var flag=true;
        if(uname == ''){
            unameObj.css('borderColor', '#FF9B00');
            flag=false;
        }
        if(cons == ''){
            consObj.css('borderColor', '#FF9B00');
            flag=false;
        }        
        if(flag){
            $.post(letterSend,{uname:uname,content:cons},function(msg){
                if(msg == '1'){
                    $('#letter').slideUp(200);
                    $('#letter-bg').remove();
                }else{
                    alert('很遗憾发送私信失败');
                }
            });
        }
        return flag;
    });
    
    //关闭私信弹窗
    $('.letter-cencle').click(function(){
        $('#letter').slideUp(200);
        $('#letter-bg').remove();
    });
    //发送私信内容字数控制
    $('.send-cons > textarea').keyup(function(){
        var cons = $(this).val();
        var lengths = num_total(cons);
        if(lengths[0] >= 140){
            $(this).val(cons.substring(0,Math.ceil(lengths[1])));
        }
    });
    
});