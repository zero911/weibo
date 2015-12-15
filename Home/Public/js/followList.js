/**
 * 关注列表js
 */

$(function(){
   
    $('.del-follow').click(function(){
        var isDel = confirm('确认移除吗?');
        if(!isDel){
            return false;
        }
        var type = $(this).attr('type');
        var uid = $(this).attr('uid');
        $.post()
    });
});
