/**
 * 评论js
 */

$(function(){
    //删除评论处理
    $('.del-comment').click(function(){
       var isDel = confirm('确认删除这条评论吗?');
       if(!isDel){
           return false;
       }
       var delObj = $(this);
       var wid = delObj.attr('wid');
       var cid = delObj.attr('cid');
       
       $.post(delComment,{wid:wid,cid:cid},function(msg){
//           var msg = eval("(" + msg + ")");
           if(msg.status){
               delObj.parents('dl').slideUp(200);
               $('.title').html('收到的评论（共' + msg.count + '条）');//评论统计-1
           }else{
               alert('删除评论失败,请重试...');
           }
       },'json');
    });
    //回复评论显示
    $('.c-reply').toggle(function(){
        
        var commentList = $(this).parent().siblings('.comment_list');
        var replyName = $(this).parent().prev('dd').find('a').html();
        
        commentList.find('textarea').val('');//清空文本域
        commentList.find('textarea').val('回复@'+ replyName+' : ');//组件文本
        $(this).parent().siblings('.comment_list').show();//show
        
    },function(){
        //hide
        $(this).parent().next('.comment_list').hide();
    });
    //回复评论
    $('.comment_btn').bind('click',function(){
        $('#phiz').hide();
        var wid = $(this).attr('wid');
        var replyObj = $(this);
        var replyCons = replyObj.parent().siblings("textarea").val();
        $.post(replyUrl,{wid:wid,content:replyCons},function(msg){     
//            var msg = eval("(" + msg + ")");
            if(msg.status){
                var dom ="<dl><dt><a href=" + path_this + "/Home/show/" + msg.myReply.uid;
                dom += "><img src='"+path_root+"/Uploads/Face/" + msg.myReply.face + "' width='50' height='50'></a>";
                dom += "</dt><dd><a href=" + path_this + "/Home/show/" + msg.myReply.uid + ">" + msg.myReply.username + "</a>：";
                dom += "<span>" + msg.myReply.content + "（" + msg.myReply.time + "）</span>";
                dom += "</dd><dd class='tright'><span class='del-comment' cid='"+ msg.myReply.cid +"' wid='"+ msg.myReply.wid;
                dom += "'>删除</span> &nbsp;|&nbsp;<span class='c-reply'>回复</span>";
                dom += "</dd><dd class='comment_list hidden'><textarea name='' sign='comment0'></textarea>";
                dom += "<ul><li class='phiz fleft' sign='comment0'></li>";
                dom +=  "<li class='comment_btn fright' wid='"+ msg.myReply.wid +"'>回复</li></ul></dd></dl>";
                
                replyObj.parent().siblings("textarea").val('');//文本域指控
                replyObj.parents('.comment_list').hide();//父节点隐藏
                replyObj.parents('dl').prepend(dom);//插入新增的评论
                replyObj.parents('dl').siblings('.title').html('收到的评论（共' + msg.count + '条）');//更新评论总数
            }else{
                alert('很遗憾评论失败...');
            }
        },'json');
    });
});

