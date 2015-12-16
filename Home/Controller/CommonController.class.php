<?php

/**
 * 公共控制器，用于处理非法操作、自动登录
 *
 * @author LittleSure
 */
namespace Home\Controller;
use Think\Controller;
class CommonController extends Controller{
    //put your code here
    public function __construct() {
        parent::__construct();
        
        //登录session验证
        if(!session('uid')){
            $this->redirect('Login/showLogin');
        }
    }
    //添加分组异步处理
    public function addGroup(){
        if(!IS_POST){
            E('页面不存在');
        }
        $data = array(
            'uid'=>  session('uid'),
            'name'=> htmlspecialchars($_POST['groupName'])
            );
        if($gid = M('group')->add($data)){
            //组装json数据
            $msg = array(
                'status' => 1,
                'gid' => $gid,
                'url' => U('Index/index'),
                'name' => $data['name']
            );
            echo json_encode($msg);
        }else{
            $msg = array('status'=>0);
            echo json_encode($msg);
        }
    }
    
    //添加关注处理
    public function addFollow(){
        if(!IS_POST){
            E('页面不存在');
        }
        $me = session('uid');
        $followId = intval($_POST['followId']);
        $data = array(
            'follow'    => $followId,
            'fans'      => intval($me),
            'gid'       => intval($_POST['gid']) 
        );
        if(M('follow')->add($data)){
            //被关注的用户fans+1
            M('userinfo')->where(array('uid'=>$followId))->setInc('fans');
            //关注的用户关注数+1
            M('userinfo')->where(array('uid'=>$me))->setInc('follow');
            //查询是否为互相关注
            $mutual = M('follow')->where(array('fans'=>$followId,'follow'=>$me))->find();
            $msg = array(
                'status'      =>  1,
                'followId'  =>  $followId,
                'style'      => empty($mutual) ? 'follow' : 'mutual'
            );
            echo json_encode($msg);
        }else{
            $msg = array('status'=>0);
            echo json_encode($msg);
        }
    }
    //移除关注
    public function delFollow(){
        if(!IS_POST){
            E('页面不存在');
        }
        $uid = intval($_POST['uid']);
        $me = session('uid');
        $where = array(
            'follow'    =>  $uid,
            'fans'      =>  $me
        );
        if(M('follow')->where($where)->delete()){
            //关注人的关注数-1
            M('userinfo')->where(array('uid'=>$me))->setDec('follow');
            //被关注者的fans-1
            M('userinfo')->where(array('uid'=>$uid))->setDec('fans');
            
            $data = array(
                'status'    =>  1
            );
            echo json_encode($data);
        }else{
            $data = array('status'=>0);
            echo json_encode($data);
        }
    }
    //设置个人背景样式
    public function setStyle(){
        if(!IS_POST){
            E('页面不存在');
        }
        $theme = htmlspecialchars($_POST['theme']);
        $data = array(
            'style' =>  $theme
        );
        if(M('userinfo')->where(array('uid'   =>  session('uid')))->save($data)){
            echo 1;
        }else{
            echo 0;
        }
    }
    //微博图片上传处理
    public function uploadPic(){
        if(!IS_POST){
            E('页面不存在');
        }
        $upload = $this->_upload('/Pic/','180,80,50', '180,80,50');
        
        echo json_encode($upload);
    }
    
    //个人图像上传处理
    public function uploadFace(){
        if(!IS_POST){
            E('页面不存在');
        }
        $upload = $this->_upload('/Face/','180,80,50', '180,80,50');
        
        echo json_encode($upload);
    }
    
        /**
     *处理图像上传函数
     * @param [String] $path 保存文件路径
     * @param [String] $width 保存的宽度
     * @param [String] $height 保存的高度
     * @return array 图片上传的信息
     */
    private function _upload($path,$width,$height){

        $upload=new \Think\UploadFile;
        $upload->maxSize = C('UPLOAD_MAX_SIZE'); // 设置附件上传大小  C('UPLOAD_SIZE'); 
        $upload->savePath = C('UPLOAD_PATH') . $path . '/'; // 设置附件上传目录
        $upload->allowExts = C('UPLOAD_EXTS'); // 设置附件上传类型
        $upload->saveRule = 'uniqid'; //保存文件名
        $upload->uploadReplace = true; //是否存在同名文件是否覆盖
        //缩略图部分
        $upload->thumb = true; //是否对上传文件进行缩略图处理
        $upload->thumbMaxWidth = $width; //缩略图处理宽度
        $upload->thumbMaxHeight = $height; //缩略图处理高度
        $upload->thumbPrefix = 'max_,medium_,mini_';  //生产2张缩略图
        $upload->thumbPath = $upload->savePath . date('Y_m_d') . '/'; //缩略图保存路径
        $upload->thumbRemoveOrigin = true; //上传图片后删除原图片
        $upload->autoSub = true; //是否使用子目录保存图片
        $upload->subType = 'date'; //子目录保存规则
        $upload->dateFormat = 'Y_m_d'; //子目录保存规则为date时时间格式
        
        if (!$upload->upload()) {
            return array('status' => 0, 'msg' => $upload->getErrorMsg());
        } else {
            $info = $upload->getUploadFileInfo();
            $pic = explode('/', $info[0]['savename']);
            return array(
                'status' => 1,
                'path' => array(
                    'max' => $pic[0] . '/max_' . $pic[1],
                    'medium' => $pic[0] . '/medium_' . $pic[1],
                    'mini' => $pic[0] . '/mini_' . $pic[1]
                )
            );
        }
    }
}
