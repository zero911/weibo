<?php

/**
 * 替换微博内容的URL地址、@用户与表情
 * @param  [String] $content [需要处理的微博字符串]
 * @return [String]          [处理完成后的字符串]
 */
function replace_weibo($content){
    
    //匹配网址存入后变成<a> 
    $preg = '/(?:[a-z][3,5]:\/\/)?([\w\.]+[\w\/]*\.[\w.]+[\w\/]*\??[\w=\&\+\%]*)/is';
    $content = preg_replace($preg, '<a href="\\1" target="_blank">\\1</a>', $content);

    //匹配@我变成<a>
    $preg = '/@(\S+)\s/is';
    $content = preg_replace($preg, '<a href="' . __APP__ . '/User/\\1">@\\1</a>', $content);
    
    //提取微博内容中所有表情文件
    $preg = '/\[(\S+?)\]/is';
    preg_match_all($preg, $content, $arr);
    //载入表情包数组文件
    $phiz = C('PHIZ');
    if (!empty($arr[1])) {
        foreach ($arr[1] as $k => $v) {
            $name = array_search($v, $phiz);
            if ($name) {
                $content = str_replace($arr[0][$k], '<img src="' . __ROOT__ . '/Home/Public/Images/phiz/' . $name . '.gif" title="' . $v . '"/>', $content);
            }
        }
    }
    return str_replace(C('FILTER'), '***', $content);
}

/**
 * 时间格式化函数
 * @param [string] $time [需要格式化的字符串]
 * 
 * ps:
 *      获取当前时间戳：time();
 *      时间戳转换成时间：date('Y-m-d H:i:s',time());
 *      时间转换成时间戳：strtotime()
 */
function time_format($time){
    $now = time();
    $today =  strtotime(date('Y-m-d')) ;
    $diff = $now - $time;
    $str = '';
    switch($diff){
        case $diff < 60 : 
            $str = $diff.'秒前';
            break;
        case $diff < 60 * 60 :
            $str = ceil($diff / 60) . '分前';
            break;
        case $diff < 60*60*8 :
            $str = ceil($diff /3600) . '小时前';
            break;
        case $time - $today > 0 :
            $str = '今天&nbsp;'.date('Y-m-d H:i',$time);
            break;
        default :
            $str = date('Y-m-d H:i',$time);
            break;
    }
    return $str;
}
