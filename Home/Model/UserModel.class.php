<?php

/**
 * Description of UserModel
 *
 * @author LittleSure
 */
namespace Home\Model;
class UserModel extends \Think\Model\RelationModel {
    //put your code here
    protected $tableName ='user';
    protected $_link=array(
        'userinfo'=>array(
            'mapping_type'=>self::HAS_ONE,
            'foreign_key'=>'uid'
        )
    );
    public function insert($data){
        $data=  is_null($data) ? $_POST : $data;
        return $this->relation(true)->data($data)->add();
    }
    /*
     * 登录验证
     */
    public function checkLogin($data){
        $data=  isset($data)?$data:$_POST;
        
        $where=array(
            'account'=>$data['account']
        );
        $user=$this->where($where)->find();
        return $user;
    }
}
