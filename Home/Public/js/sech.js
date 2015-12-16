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
    
    
    //转发点击弹框显示处理
    $('.turn').bind('click',function(){
        //展现要转发的用户的微博内容
        var parObj = $(this).parents('.wb_tool').prev();
        var author = $.trim(parObj.find('.author').html());//得到用户名
        var content_p = parObj.find('.content p').html();
        var conts = '';
        var turn_cons = $("textarea[sign='turn']");
        turn_cons.val('');//清空内容文字
        $("input[name='becomment']").attr('checked',false);//清空checkbox
        //判断是否多重转发微博
        var tid = $(this).attr('tid') ? $(this).attr('tid') : 0;
        if(tid){
            //多重转发格式化文本内容
            author = parObj.find('.author a').html();//去除超链接的用户名
            conts = replace_weibo(" // @" + author +':'+content_p);
            turn_cons.val(conts);//多重转发的内容展示
            author = $.trim(parObj.find('.turn_name').html());
        }
        $("form[name='turn'] p:first").html(author + ':' + content_p);//展现要转发的用户的微博内容
        $('.turn-cname').html(author);//同时评论处理
        //处理隐藏域用于数据提交
        $("input[name='id']").val($(this).attr('id'));
        $("input[name='tid']").val(tid);
        //计算坐标部分
        var turnLeft = ($(window).width() - $('#turn').width()) / 2;
        var turnTop = $(document).scrollTop() + ($(window).height() - $('#turn').height()) / 2;
        var turnObj = $('#turn').slideDown(200).css({
            'left':turnLeft + 'px',
            'top':turnTop + 'px'
        });//显示转发框
        createBg('turn-bg');//创建遮罩
        drag(turnObj,turnObj.find('.turn_head'));//设置可移动
        turn_cons.keyup(function(){
            //键盘抬起事件统计
            var cons = turn_cons.val();
            var lengths = num_total(cons);
            //最大允许输入140字个 
            if (lengths[0] >= 140) {
                turn_cons.val(cons.substring(0, Math.ceil(lengths[1])));
            }
            var num = 140 - Math.ceil(lengths[0]);
            var msg = num < 0 ? 0 : num;
            //当前字数同步到显示提示
            $('#turn_num').html(msg);
        });
        
    });
    //转发微博异步处理   
    $('.turn_btn').click(function(){
        var turn_cons = $("textarea[sign='turn']");
        if(turn_cons.val() == ''){//内容为空处理
            none_style(turn_cons);
            return false;
        }
//        $data = {
//          'id'      :   $("input[name='id']").val(),
//          'tid'     :   $("input[name='tid']").val(),
//          'content' :   turn_cons.val()
//        };
        
    });
    //评论微博点击事件
    $('.comment').toggle(function(){
        $(this).parents('.wb_tool').siblings('.comment_list ').show();//显示评论框
        //获得评论列表数据采用原生ajax
        var commentLoad = $(this).parents('.wb_tool').next();
        var wid = $(this).attr('wid');
        var commentList = commentLoad.next();
        $.ajax({
            url:getComment,
            data:{wid:wid},
            dataType: 'json',
            type:'POST',
            beforeSend: function () {
               commentLoad.show();
            },
            success: function (data) {
//                var data = eval("(" + data + ")");
                if(data.status){
                    //添加
                    for(var i in data.commentList){
                        var dom="<dl class = 'comment_content'>";;
                        dom += "<dt><a href=" + path_this + "/Home/show/" + data.commentList[i].uid;
                        dom += "><img src=" + path_root + "/Uploads/Face/" + data.commentList[i].face;
                        dom += " alt=" + data.commentList[i].username + " width='30' height='30' ></a></dt>"
                        dom += "<dd><a href=" + path_this + "/Home/show/" + data.commentList[i].uid;
                        dom += " class= 'comment_name' >" + data.commentList[i].username + "</a> : ";
                        dom += data.commentList[i].content + "&nbsp;&nbsp;";
                        dom += "(" + data.commentList[i].time + ")<div class='reply'><a href=''>回复</a></div></dd></dl>";
                        
                        commentList.append(dom);
                    }
                }
            },
            complete: function () {
                commentLoad.hide();
                commentList.show().find('textarea').val('').focus();
            }
        });    

    },function(){
        $(this).parents('.wb_tool').siblings('.comment_list ').hide();
        $('#phiz').hide();
    });
    //评论输入框获取焦点时改变边框颜色
    $('.comment_list textarea').focus(function () {
        $(this).css('borderColor', '#FF9B00');
    }).blur(function () {
        $(this).css('borderColor', '#CCCCCC');
    }).keyup(function () {
        var content = $(this).val();
        var lengths = num_total(content);  //调用check函数取得当前字数
        //最大允许输入140个字
        if (lengths[0] >= 140) {
            $(this).val(content.substring(0, Math.ceil(lengths[1])));
        }
    });
    //回复评论处理
    $('.reply > a').live('click',function () {
        var reply = $(this).parent().siblings('a').html();
        $(this).parents('.comment_list').children('textarea').val('回复@' + reply + ' ：').focus();
        return false;
    });
    //发飙评论处理
    $('.comment_btn').click(function () {
        $('#phiz').hide();
        var cons = $(this).parents('.comment_list').children('textarea');
        var cons_val = cons.val();
        var commentObj = $(this);
        if (cons_val == '') {//评论内容空不提交
            cons.focus();
            return false;
        }
        var data = {
            'wid': $(this).attr('wid'),
            'uid': $(this).attr('uid'),
            'content': cons_val,
            'turnMe': $(this).prev('.comment_turn').find('input').attr('checked') == 'checked' ? 1 : 0
        };
        cons.blur().val('');
        $.post(commentUrl, data, function (msg) {//待测试
//            var msg = eval("(" + msg + ")");
            
            if (msg.status) {
                //发布评论成功，更新页面评论数据
                commentObj.parents('.comment_list').siblings('.wb_tool').find('.comment').html('评论('+msg.comment+')');
                //更新评论列表
                var dom = "<dl class = 'comment_content'>";
                dom += "<dt><a href=" + path_this + "/Home/show/" + msg.sendUser.uid;
                dom += "><img src=" + path_root + "/Uploads/Face/" + msg.sendUser.face;
                dom += " alt=" + msg.sendUser.username + " width='30' height='30' ></a></dt>";
                dom += "<dd><a href=" + path_this + "/Home/show/" + msg.sendUser.uid;
                dom += " class= 'comment_name' >" + msg.sendUser.username + "</a> : ";
                dom += replace_weibo(msg.sendUser.content) + "&nbsp;&nbsp;";
                dom += "(" + msg.sendUser.time + ")<div class='reply'><a href=''>回复</a></div></dd></dl>";
                
                commentObj.parents('.comment_list').children('ul').after(dom);//插入dom
                
                if (msg.type == 2) {//评论失败
                    alert(msg.info);
                }
            } else {
                alert(msg.info);
            }
        }, 'json');
    });
    //收藏微博
    $('.keep').bind('click',function(){
        var thisObj = $(this);
        var wid = thisObj.attr('wid');
        var keepDom = thisObj.next('.keep-up');
        var msg = '';
        $.post(keepUrl,{wid:wid},function(msg){
            
//            var msg = eval("(" + msg + ")");
            if(msg.status ==1 ){//成功
                thisObj.html('收藏(' + msg.keep + ')');
                msg = '收藏成功';
            }
            if(msg.status ==2 ){//失败
                msg = '收藏失败';
            }
            if(msg.status ==3){//已收藏
                msg = '已收藏';
            }
            keepDom.html(msg).slideDown(200);
            setTimeout(function(){
                keepDom.slideUp(200);
            },2000);
        },'json');
    });
    //删除显示效果
    $('.weibo').hover(function(){
        $(this).find('.del-li').fadeIn();
    },function(){
        $(this).find('.del-li').fadeOut();
    });
    //删除微博
    $('.del-weibo').click(function(){
        var isDel = confirm('确认删除这条微博吗?');
        if(!isDel){
            return false;
        }
        var wid = $(this).attr('wid');
        var delObj = $(this);
        $.post(delWeibo,{wid:wid},function(msg){
            if(msg ==1){
                delObj.parents('.weibo').slideUp(500);
            }else if(msg == -1){
                alert('无法删除关注用户微博');
            }else{
                alert('删除微博失败');
            }
        });
    });
    
});

