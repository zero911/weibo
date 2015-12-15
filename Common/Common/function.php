<?php

/*
 * 自调用函数
 */

//格式输出，调试用途
function format_print($obj){
    
    echo '<pre>';
    print_r($obj);
    echo '<pre>';
}

//分页
function format_fenye($count,$pageSize){
    $page = new \Think\Page($count, $pageSize);
    //分页配置部分
    $page->setConfig('header', "<span>共 $count 条记录</span>&nbsp;&nbsp;");
    $page->setConfig('prev', '上一页');
    $page->setConfig('next', '下一页');
    $page->setConfig('last', '末页');
    $page->setConfig('first', '首页');
    $page->setConfig('theme', '%HEADER%%FIRST%%UP_PAGE%&nbsp;%LINK_PAGE%%DOWN_PAGE%%END%');

    return $page;
}