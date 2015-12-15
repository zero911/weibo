<?php

/**
 * 微博登录和注册页控制器
 *
 * @author LittleSure
 */

namespace Home\Controller;
use Think\Controller;
class LoginController extends Controller {
    
    //登录页显示
    public function showLogin(){
        
        $this->display('login');
    }
    //注册页显示
    public function showRegister(){
        $this->display('register');
    }
    //登出
    public function logout(){
        session_unset();
        session_destroy();
        $this->redirect('showLogin');
    }
    //登录验证
    public function login(){
        if(!IS_POST){
            E('页面不存在');
        }
        $account = $_POST['account'];
        $pwd = md5($_POST['pwd']);
        $user = M('user')->where(array('account'=>$account))->find();
        if(empty($user) || $user['password'] != $pwd){
            $this->error('用户名或者密码输入错误');
        }
        //写入session
        session('uid',$user[id]);
        session('account',$user['account']);
        $this->redirect('Index/index');
        
    }
    
    //注册处理
    public function register(){
        if(!IS_POST){
            E('页面不存在');
        }
        $account = $_POST['account'];
        $pwd = $_POST['pwd'];
        $pwded = $_POST['pwded'];
        $uname = $_POST['uname'];
        $code = $_POST['verify'];
        
        if(session('code') != $code){
            $this->error('验证码输入错误');
        }
        if($pwd != $pwded){
            $this->error('两次输入密码不一致');
        }
        $data=array(
            'account'=>$account,
            'password'=>  md5($pwd),
            'userinfo'=>array(
                'username'=>$uname
            ),
            'registime'=>time()  
        );
        if($id = D('User')->insert($data)){
            session('uid',$id);
            session('account',$data['account']);
            $this->redirect('Index/index');
            
        }
        $this->error('注册用户失败，请重试');
    }
    /***********异步部分*********/
    public function checkAccount(){
        if(!IS_POST){
            E('页面不存在');
        }
        $account = $_POST['account'];
        if(M('user')->where(array('account'=>$account))->getField('account')){
            echo 0;
        }else{
            echo 1;
        }
    }
    public function checkUname(){
        if(!IS_POST){
            E('页面不存在');
        }
        $uname = $_POST['uname'];
        if(M('userinfo')->where(array('username'=>$uname))->getField('username')){
            echo 0;
        }else{
            echo 1;
        }
    }
    public function checkVerify(){
        if(!IS_POST){
            E('页面不存在');
        }
        $code = $_POST['code'];
        $verify = new \Think\Verify();
        if($verify->check($code)){
            //加入session
            session('code',$code);
            echo 1;
        }
    }
    //生成验证码
    public function verifyImg(){
        
        $cfg = array(
            'codeSet'  =>  '1234567890',      //使用纯数字作为验证码
            'imageH'    =>  25,               // 验证码图片高度
            'imageW'    =>  100,               // 验证码图片宽度
            'length'    =>  4,               // 验证码位数
            'fontttf'   =>  '1.ttf',              // 验证码字体，不设置随机获取
            'fontSize'  =>  13,              // 验证码字体大小(px)
        );
        $verify = new \Think\Verify($cfg);
        $verify->entry();
    }
}
