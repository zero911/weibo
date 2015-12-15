<?php


/**
 * 用户信息设置控制器
 *
 * @author LittleSure
 */
namespace Home\Controller;
use Home\Controller\CommonController;
class UserSettingController extends CommonController{
    //put your code here
    public function showUserSetting(){
        
        //得到当前用户信息
        $field = ('username,truename,sex,location,constellation,intro,face180');
        $where = array('uid'=>session('uid'));
        $userinfo = M('userinfo')->where($where)->field($field)->find();
        $this->userinfo = $userinfo;
        $this->display();
    }
    
    //基础信息修改处理
    public function editBasic(){
        
        if(!IS_POST){
            E('页面不存在');
        }
        $data =array(
            'username'=>$_POST['nickname'],
            'truename'=>$_POST['truename'],
            'sex' => $_POST['sex'] == '1' ? '男' : '女',
            'location'=>$_POST['province'] . ' ' . $_POST['city'],//组装出生地
            'constellation' => $_POST['night'],
            'intro' => $_POST['intro']
        );
        $flag = M('userinfo')->where(array('uid'=>session('uid')))->save($data);
        if($flag){
            echo 1;
        }else{
            echo 0;
        }
    }
    
    //上传图片
    public function editFace(){
        if(!IS_POST){
            E('页面不存在');
        } 
        $where = array(
            'uid' => session('uid')
        );
        $data = array(
            'face180'=>$_POST['face180'],
            'face80'=>$_POST['face80'],
            'face50'=>$_POST['face50']
        );
        if(M('userinfo')->where($where)->save($data)){
            echo 1;
        }else{
            echo 0;
        }
    }
    //修改密码
    public function editPwd(){
        if(!IS_POST){
            E('页面不存在');
        }
        
        $data = array(
            'password' => md5($_POST['new'])
        );
        if(M('user')->where(array('id'=>session('uid')))->save($data)){
            echo 1;
        }else{
            echo 0;
        }
    }
    
}
