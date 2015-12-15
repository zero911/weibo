/**
 * 用户设置界面js处理
 */

$(function(){
    
    //修改切换
    //修改资料选项卡
    $('#sel-edit li').bind('click',function(){
        var index = $(this).index();
        //当前li添加样式，同时取出同辈li的样式
        $(this).addClass('edit-cur').siblings().removeClass('edit-cur');
        //索引一直的显示，非一直的隐藏
        $('.form').hide().eq(index).show();
    });
    //异步修改用户信息
    $('#but1').bind('click',function(){
        var data = {
            nickname:$("input[name='nickname'").val(),
            truename:$("input[name='truename'").val(),
            sex:$("input[name='sex'").val(),
            province:$("select[name='province']").val(),
            city:$("select[name='city']").val(),
            night:$("select[name='night']").val(),
            intro:$("textarea[name='intro']").html()
        };
        $.post(editBasic,data,function(msg){
            if(msg=='1'){
                alert('恭喜你,修改用户信息成功...');
            }else{
                alert('很遗憾,修改用户信息失败，请重试...');
            }
        },'json');
    });
    //异步修改用户图片
    $('#but2').click(function(){
        var data = {
            face180:$('input[name=face180]').val(),
            face80:$('input[name=face80]').val(),
            face50:$('input[name=face50]').val()
        };
        $.post(editFace,data,function(msg){
            if(msg=='1'){
                alert('恭喜你,修改图片成功...');
            }else{
                alert('很遗憾,修改图片失败，请重试...');
            }
        },'json');
    });
    //异步修改密码
    $('#but3').click(function(){
        var data={
            new:$("input[name=new]").val()
        };
        $.post(editPwd,data,function(msg){
            if(msg=='1'){
                alert('恭喜你,修改密码成功...');
            }else{
                alert('很遗憾,修改密码失败，请重试...');
            }
            //清空input框
            $("input[name='old']").val('');
            $("input[name='new']").val('');
            $("input[name='newed']").val('');
            //去除validate的样式
            $("span:not('#sp-account')").remove();
        },'json');
    });
    
    //城市联动
    var province = '';
    $.each(city,function(i,item){
        province += "<option index="+i+" value='"+item.name+"'>"+item.name+"</option>";
    });
    $('select[name=province]').append(province).change(function(){
        var option='';
        if($(this).val() == ''){
            option += '<option value="" >-请选择-</option>';
        }else{
            var index=$(':selected',this).attr('index');
            var data = city[index]['child'];
            for(var i in data){
                option += "<option value=" + data[i] + ">" + data[i] + "</option>";
            }
        }
        $('select[name=city]').html(option);
    });
    
    //读取当前的归属地信息
    address = address.split(' ');
    //设置省份
    $('select[name=province').val(address[0]);
    //设置城市
    $.each(city,function(i,item){
        if(item.name == address[0]){
            str = '';
            for(var j in item.child){
                str += "<option value='" + item.child[j] + "'";
                if(item.child[j] == address[1]){
                    str += "selected='selected'";
                }
                str += ">"+item.child[j]+"</option>";
            }
             $('select[name=city]').html(str);
        }
    });
    //读取当前的星座并设置显示到模板
    $('select[name=night]').val(constellation);
    
    //头像上传 Uploadify 插件
    $('#face').uploadify({
        swf: path + '/Uploadify/uploadify.swf', //引入Uploadify核心Flash文件
        uploader: uploadUrl, //PHP处理脚本地址
        width: 120, //上传按钮宽度
        height: 30, //上传按钮高度
        buttonImage: path + '/Uploadify/browse-btn.png', //上传按钮背景图地址
        fileTypeDesc: 'Image File', //选择文件提示文字
        fileTypeExts: '*.jpeg; *.jpg; *.png; *.gif', //允许选择的文件类型
        formData: {'session_id': sid},
        //上传成功后的回调函数
        onUploadSuccess: function (file, data, response) {
            eval('var data = ' + data);
            if (data.status) {
                $('#face-img').attr('src', path1 + '/Uploads/Face/' + data.path.max);
                $('input[name=face180]').val(data.path.max);
                $('input[name=face80]').val(data.path.medium);
                $('input[name=face50]').val(data.path.mini);
            } else {
                alert(data.msg);
            }
        }
    });

    
    //jQuery Validate 表单验证

    /**
     * 添加验证方法
     * 以字母开头，5-17 字母、数字、下划线"_"
     */
    jQuery.validator.addMethod("user", function (value, element) {
        var tel = /[\w]{5,32}$/;
        return this.optional(element) || (tel.test(value));
    }, "5-32位,必须是字母、数字和_组成");

    $('form[name=editPwd]').validate({
        errorElement: 'span',
        success: function (label) {
            label.addClass('success');
        },
        rules: {
            old: {
                required: true,
                user: true
            },
            new : {
                required: true,
                user: true
            },
            newed: {
                required: true,
                equalTo: "#new"
            }
        },
        messages: {
            old: {
                required: '请填写旧密码',
            },
            new : {
                required: '请设置新密码'
            },
            newed: {
                required: '请确认密码',
                equalTo: '两次密码不一致'
            }
        }
    });
});