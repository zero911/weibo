/**
 * 公共库
 */

/**
 * 创建全屏透明背景层
 * @param   id
 */
function createBg(id) {
    $('<div id = "' + id + '"></div>').appendTo('body').css({
        'width': $(document).width(),
        'height': $(document).height(),
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'z-index': 2,
        'opacity': 0.3,
        'filter': 'Alpha(Opacity = 30)',
        'backgroundColor': '#000'
    });
}

/**
 * 元素拖拽
 * @param  obj		拖拽的对象
 * @param  element 	触发拖拽的对象
 */
function drag(obj, element) {
    var DX, DY, moving;
    element.mousedown(function (event) {
        DX = event.pageX - parseInt(obj.css('left'));	//鼠标距离事件源宽度
        DY = event.pageY - parseInt(obj.css('top'));	//鼠标距离事件源高度
        moving = true;	//记录拖拽状态
    });
    $(document).mousemove(function (event) {
        if (!moving)
            return;
        var OX = event.pageX, OY = event.pageY;	//移动时鼠标当前 X、Y 位置
        var OW = obj.outerWidth(), OH = obj.outerHeight();	//拖拽对象宽、高
        var DW = $(window).width(), DH = $('body').height();  //页面宽、高
        var left, top;	//计算定位宽、高
        left = OX - DX < 0 ? 0 : OX - DX > DW - OW ? DW - OW : OX - DX;
        top = OY - DY < 0 ? 0 : OY - DY > DH - OH ? DH - OH : OY - DY;
        obj.css({
            'left': left + 'px',
            'top': top + 'px'
        });
    }).mouseup(function () {
        moving = false;	//鼠标抬起消取拖拽状态
    });
}

/**
 * 字符数统计函数
 * @param  str       需要统计字数的dom对象
 * @return num      数组[当前字数, 最大字数]
 */
function num_total(str){
    var num = [0, 140];
    for (var i = 0; i < str.length; i++) {
        //字符串不是中文时
        if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255) {
            num[0] = num[0] + 0.5;//当前字数增加0.5个
            num[1] = num[1] + 0.5;//最大输入字数增加0.5个
        } else {//字符串是中文时
            num[0]++;//当前字数增加1个
        }
    }
    return num;
}

/**
 * 替换微博内容，去除 <a> 链接与表情图片
 * @param  content       需要处理的内容
 */
function replace_weibo(content) {
    content = content.replace(/<img.*?title=['"](.*?)['"].*?\/?>/ig, '[$1] ');
    content = content.replace(/<a.*?>(.*?)<\/a>/ig, '$1 ');
    return content.replace(/<span.*?>\&nbsp;(\/\/)\&nbsp;<\/span>/ig, '$1 ');
}

/**
 * 文本域或者文本框内容为空白时提示样式
 * @param {obj} domobj 需要操作对象
 */
function none_style(domobj){
    var time_out = 0;
    var timer = setInterval(function () {
        if (time_out % 2 == 0) {
            domobj.css('background', '#fff');
        } else {
            domobj.css('background', '#FFA0C2');
        }
        time_out++;
        if (time_out == 7) {
            clearInterval(timer);
            domobj.focus();
        }
    }, '100');
}
