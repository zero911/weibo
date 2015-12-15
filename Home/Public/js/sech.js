/**
 * sech界面js
 */

$(function(){
    
    //点击微博处理
    $('.sech-type').click(function(){
        $(this).addClass('cur').parent().siblings().find('.cur').removeClass('cur');
        var url = $(this).attr('url');
        $("form[name='search']").attr('action',url);
    });
    //空提交不处理
    $('#sech-sub').click(function(){
        var cons = $('#sech-cons').val();
        if(cons == '' || cons == '搜索微博、找人'){
            $("input[name='keyword']").css({
                borderColor:'red'
            });
            return false;
        }
    });
    
    
});

