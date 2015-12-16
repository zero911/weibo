/**
 * 关注列表js
 */

$(function(){
   
    $('.del-follow').click(function(){
        var isDel = confirm('确认移除吗?');
        if(!isDel){
            return false;
        }
        var delObj = $(this);
        var type = $(this).attr('type');
        var uid = $(this).attr('uid');
        $.post(delFollow,{uid:uid},function(msg){
            if(msg.status=='1'){
                delObj.siblings('dt').remove();
                delObj.before(dom);//替换为关注
                delObj.remove();//去除移除按钮
            }else{
                alert('很遗憾，移除关注失败,请重试...');
            }
        },'json');
    });
});
