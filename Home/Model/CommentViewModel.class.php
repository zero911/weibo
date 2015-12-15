<?php

/**
 * 评论图形模型
 *
 * @author user
 */

namespace Home\Model;
use Think\Model\ViewModel;
class CommentViewModel extends ViewModel{
    //put your code here
    protected $viewFields = array(
        'comment'=>array(
            'content','uid','time','wid','id'=>'cid',
            '_type'=>'LEFT'
        ),
        'userinfo'=>array(
            'username','face50'=>'face',
            '_on'=>'comment.uid = userinfo.uid'
        ),
    );
}
