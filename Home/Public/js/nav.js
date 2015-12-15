/**
 * 标题js
 * 
 */

$(function(){
    
   /**
    * 顶部下拉选项事件相应
    */
    $('.selector').hover(function () {
        var objClass = $('i', this).attr('class');
        $('i', this).removeClass(objClass).addClass(objClass + '-cur');
        $(this).css({
            //改变背景色
            'width': '36px',
            'backgroundColor': '#FFFFFF',
            'borderLeft': '1px solid #CCCCCC',
            'borderRight': '1px solid #CCCCCC'
        }).find('ul').show();
    }, function () {
        var objClass = $('i', this).attr('class');
        $('i', this).removeClass(objClass).addClass(objClass.replace('-cur', ''));
        $(this).css({
            //还原背景
            'width': '38px',
            'background': 'none',
            'border': 'none'
        }).find('ul').hide();
    });
    $('.selector li').hover(function () {  
        //下拉项添加效果
        $(this).css('background', '#DCDCDC');
    }, function () {
        $(this).css('background', 'none');
    });
    
    //顶部搜索框处理    
    $("input[name='keyword']").hover(function(){
        //鼠标悬停
        $(this).removeAttr('style');
        $(this).css('backgroundPosition','-237px -5px');
        $('#sech_sub').css('backgroundPosition','-443px -5px');
    },function(){
        //鼠标挪开
        $(this).css('backgroundPosition','0 -5px');
        $('#sech_sub').css('backgroundPosition','-206px -5px');
    }).focus(function(){
        //获得焦点清除内容
        if($(this).val() == '搜索微博、找人'){
            //默认字符则清空 
            $(this).val('');
        }
    }).blur(function(){
        //失去焦点
        if($(this).val()==''){
            $(this).val('搜索微博、找人');
        }
    });
    
//    //搜索异步获取数据
//    $('#sech-cons').mouseup(function(){
//        var cons = $(this).val();
//        if(cons == ''){
//            return false;
//        }
//        $.post(sechThink,{keyword:cons},function(msg){
//            
//            var msg = eval("("+ msg +")");
//            if(msg.status){
//                var search_think = "<div id='sech-cons-think'></div>";
//                $('#sech-cons-think').css({
//                    'width': '429px',
//                    'height': '80px',
//                    'border': '1px solid #888888',
////                        position: absolute;
//                });
//                for(var i in msg.users){
//                    var child_think = "<p id='sech-cons-think-child'>"+ msg.users[i] +"</p>";
//                    $('#sech-cons-think').css({
//                        'left': '20px',
//                        'width': '409px',
//                        'height': '10px'
//                    });
//                    $('#sech-cons-think').append(child_think);
//                }
//                $('#sech').append(search_think);
//            }
//        },'json'); 
//    });
//    //选中搜索的内容
//    $('#sech-cons-think-child').mouseover(function(){
//        $(this).css('background','#888888');
//        $('#sech-cons').val($(this).html());
//    }).mouseleave(function(){
//        $(this).removeAttr('style');
//    });
//    
    //左侧点击创建新分组 
    $('#create_group').bind('click',function(){
        $('#group-none').remove();//删除提示
        $('#gp-name').val('');//清空之前分组名
        var groupLeft = ($(window).width() - $('#add-group').width()) / 2;
        var groupTop = $(document).scrollTop() + ($(window).height() - $('#add-group').height()) / 2;
        var gpObj = $('#add-group').show().css({
            'left':groupLeft,
            'top':groupTop
        });
        //创建背景遮罩
        createBg('group-bg');
        //移动
        drag(gpObj, gpObj.find('.group_head'));
        //异步创建分组
        $('.add-group-sub').bind('click', function () {
            var cons = $('#gp-name');
            var groupName = cons.val();
            if (groupName == '') {
                none_style(cons); 
                return false;
            }
            $.post(addGroup, {groupName: groupName}, function (msg) {
                var data = eval("(" + msg + ")");
                if (data.status == 1) {
                    //添加成功，添加分组名称到模板
                    var content = "<li><a href=" + data.url + "/gid" + data.gid
                            + "><i class='icon icon-group'></i>&nbsp;&nbsp;" + data.name + "</a></li>"
                    $('.group ul').append(content);
                    //去除弹窗
                    $('#add-group').hide();
                    $('#group-bg').remove();
                } else {
                    $('.group-name').after("<p id='group-none'>很遗憾,创建分组失败,请重试...</p>");
                }

            },'json');
        });
        //取消创建分组处理
        $('.group-cencle').click(function () {
            $('#add-group').hide();
            $('#group-bg').remove();
        });
    });

    //点击关注show出添加组别的界面
    $('.add-fl').click(function(){
        //show 的#follow
        var index = $(this).index();
        //移除提示语
        $('#group-none').remove();
        var myId = $(this).attr('uid');
        //如果是自己则不能关注
        if(myId == mySelf){
            $('#follow').hide();
            $('#follow-bg').remove();//移除背景遮罩
            alert('很抱歉,您无法关注自己...');
            return false;
        }
        //获取关注人id并赋值给
        $("input[name='follow']").val(myId);
        //计算坐标
        var groupLeft = ($(window).width() - $('#follow').width())/2;
        var groupTop = $(document).scrollTop() + ($(window).height() - $('#follow').height()) / 2;
        var obj = $('#follow').show().css({
           'left': groupLeft + 'px',
           'top' : groupTop + 'px'
        });
        createBg('follow-bg');//创建背景遮罩
        drag(obj,obj.find('.follow_head'));//设置可移动

        //关注好友到指定组别
        $('.add-follow-sub').click(function () {
            var data = {
                'followId': $("input[name='follow']").val(),
                'gid': $("select[name='gid']").val(),
            };
            $.post(addFollow, data, function (msg) {
                //回调函数添加dom操作
                var data = eval("(" + msg + ")");
                if (data.status) {
                    $('#follow').hide();
                    $('#follow-bg').remove();
                    //创建添加的dom
                    var dom = "<input type='hidden' name='list-del-follw' value=" + data.followId + ">";
                    if (data.type == 'follow') {
                        //已关注
                        dom += "<dt>√&nbsp;已关注</dt>";
                    }
                    if (data.type == 'mutual') {
                        //互相关注
                        dom += "<dt>互相关注</dt>";
                    }
                    dom += "&nbsp;<dd id='list-del-follw'>移除</dd>";
                    $('.list-right').eq(index).empty().html(dom);
                } else {
                    $('.sel-group').after("<p id='group-none'>很遗憾,添加关注失败,请重试...</p>");
                }
            },'json');
        });
    });
    //取消关注
    $('.follow-cencle').click(function(){
        $('#follow').hide();
        $('#follow-bg').remove();//移除背景遮罩
    });
    //移除关注
    $('#list-del-follw').click(function(){
        var index = $(this).index();//索引值有问题？？？
        alert(index);
        var uid = $("input[name='list-del-follw']").eq(index).val();
        $.post(delFollow,{uid:uid},function(msg){
            var msg = eval("(" + msg + ")");
            if(msg.status){
                var dom = "<dt class='add-fl' uid='"+ uid +"'>+&nbsp;关注</dt>";
                $('.list-right').eq(index).empty().html(dom);
            }else{
                alert('很遗憾，移除关注失败,请重试...');
            }
        },'json');
    });
    
    //返回顶部功能
        /**
     * 返回顶部
     */
    var toTopElement = '<div class="backToTop" title="返回顶部"><i class="icon icon-totop"></i>返回顶部</div>';
    //创建DIV按钮并定位
    var toTop = $(toTopElement).appendTo($("body")).css({
        'left': ($('body').width() - ($('body').width() - $('.main').width()) / 2) + 'px',
        'top': ($(window).height() - ($(window).height() / 3)) + 80 + 'px'
                //添加点击事件
    }).click(function () {
        $("html, body").animate({scrollTop: 0}, 200); //动画效果，平滑滚动回到顶部
    });
    //添加窗口滚动事件
    $(window).scroll(function () {
        var st = $(document).scrollTop();
        //IE6定位
        if (window.ActiveXObject && !window.XMLHttpRequest) {
            var ieTop = st + ($(window).height() / 2 + 80);
            $('.backToTop').css('top', ieTop + 'px');
        }
        //滚动条高度大于100时显示 返回顶部按钮
        (st > 100) ? $('.backToTop').show() : $('.backToTop').hide();
    });
    //设置背景
    $('.set_model').click(function(){
        var leftObj = ($(window).width() - $('#model').width()) / 2;
        var topObj = $(document).scrollTop() + ($(window).height() - $('#model').height()) / 2;
        $('#model').css({
            left:leftObj + 'px',
            top:topObj + 'px'
        }).slideDown(200);
        createBg('model-bg');
        drag($('#model'),$('#model').find('model_head'));
        return false;
    });
    //选中模版风格
    $('#model ul li').click(function () {
        $(this).addClass('theme-cur').siblings().removeClass('theme-cur');
    });
        //保存模版风格
    $('#model .model_save').click(function (msg) {
        var theme = $('.theme-cur').attr('theme');
        if (!theme) {
            alert('请选择一套模版风格');
        } else {
            $.post(setStyle, {theme: theme}, function (msg) {
                if (msg == '1') {
                    window.location.reload();
                } else {
                    alert('设置模本失败');
                }
            }, 'json');
        }
    })

    //取消背景设置
    $('.model_cancel').click(function(){
        $('#model').hide();
        $('#model-bg').remove();
    });
    
    /**
     * 表情处理
     * 以原生JS添加点击事件，不走jQuery队列事件机制
     */
    var phiz = $('.phiz');
    for (var i = 0; i < phiz.length; i++) {
        phiz[i].onclick = function () {
            //定位表情框到对应位置
            $('#phiz').show().css({
                'left': $(this).offset().left,
                'top': $(this).offset().top + $(this).height() + 5
            });
            //为每个表情图片添加事件
            var phizImg = $("#phiz img");
            var sign = this.getAttribute('sign');
            var content = $('textarea[sign = ' + sign + ']');
            
            for (var i = 0; i < phizImg.length; i++) {
                phizImg[i].onclick = function () {
                    var cons_val = content.val();
                    cons_val +=  '[' + $(this).attr('title') + '] ';
                    content.val(cons_val);
//                    $('#phiz').hide();
                };
            }
            
        };
    }
    //关闭表情框
    $('.close').hover(function () {
        $(this).css('backgroundPosition', '-100px -200px');
    }, function () {
        $(this).css('backgroundPosition', '-75px -200px');
    }).click(function () {
        $(this).parent().parent().hide();
        $('#phiz').hide();
        if ($('#turn').css('display') == 'none') {
            $('#turn-bg').remove();
        }
    });
   
});
