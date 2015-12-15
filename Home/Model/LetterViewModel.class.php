<?php


/**
 * Letter图形模型类
 *
 * @author LittleSure
 */
namespace Home\Model;
use Think\Model\ViewModel;

class LetterViewModel extends ViewModel{
    //put your code here
    protected $viewField = array(
        'letter'    =>  array(
            'content','time','from','id','uid',
            '_type' =>  'LEFT'
        ),
        'userinfo'  =>  array(
            'face50'    =>  'face',
            '_on'       =>  'letter.from = userinfo.uid'
        )
    );
}
