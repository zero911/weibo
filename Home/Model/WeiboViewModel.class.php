<?php


/**
 * 微博视图模型
 *
 * @author user
 */
namespace Home\Model;
use Think\Model\ViewModel;
class WeiboViewModel extends ViewModel{
    //put your code here
    protected $viewFields = array(
        'weibo'     =>  array(
            'id','time','content','isturn','comment','keep','turn',
            '_type' =>  'LEFT'
        ),
        'userinfo'  =>  array(
            'uid','username',
            'face50'=>'face',
            '_type' => 'LEFT',
            '_on'   =>'weibo.uid = userinfo.uid'
        ),
        'picture'   =>  array(
            'max','medium','mini',
            '_on'   =>  'weibo.id = picture.wid' 
        )
    );
}
