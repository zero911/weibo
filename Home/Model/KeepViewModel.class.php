<?php

/**
 * 收藏视图模型
 *
 * @author LittleSure
 */
namespace Home\Controller;
use Think\Model\ViewModel;

class KeepViewModel extends ViewModel {
    //put your code here
    protected $viewFields = array(
        'keep'  =>  array(
            'content','uid','wid','time',
            'id'    =>  'kid',
            '_type' =>  'LEFT'
        ),
        'userinfo'  =>  array(
            'username',
            'face50'=>  'face',
            '_on'   =>  'keep.uid  = userinfo.uid'
        )
    
    );
}
