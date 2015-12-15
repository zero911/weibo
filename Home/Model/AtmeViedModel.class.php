<?php
/**
 * Atme图形模型控制器
 *
 * @author LittleSure
 */

namespace Home\Model;
use Think\Model\ViewModel;
class AtmeViedModel extends ViewModel{
    
    protected $viewFields = array(
        'atme'      =>  array(
            'uid' ,'wid',
            'id'    =>  'aid',
            '_type' =>  'LEFT'
        ),
        'userinfo'  =>  array(
            'username',
            'face50'    =>  'face',
            '_type'     =>  'LEFT',
            '_on'       =>  'atme.uid = userinfo.uid'
        ),
        'weibo'     =>  array(
            'content','time',
            '_on'   =>  'atme.wid = weibo.id'
        )
    );
}
