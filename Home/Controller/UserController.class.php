<?php

/**
 * 用户中心控制器
 *
 * @author LittleSure
 */

namespace Home\Controller;
use Home\Controller\CommonController;

class UserController extends CommonController {
    //主页显示处理
    public function showHome(){
        
        $me = intval($_GET['id']);
        //获取当前用户信息
        $userinfo = M('userinfo')->where(array('uid'=>$me))->field('true,face50,face80,style',true)->find();
        //分页
        $where = array('uid'=>$me);
        $count = M('weibo')->where($where)->count();
        $page = format_fenye($count, C('PAGE_SIZE_HOME'));
        $limit = $page->firstRow . ','. $page->listRows;
        $weibo = D('WeiboView')->where($where)->limit($limit)->order('time DESC')->select();
        //右侧我的关注放入缓存中
        if(S('follow_'.$me)){
            //记录存在则取缓存数据
            $follow=S('follow_'.$me);
        }else{
            $followID=M('follow')->where(array('fans'=>$me))->field('follow')->select();
            //判断fans是否为空
            if(empty($followID)){
                $follow=null;
            }else{
                //遍历结果集
                foreach($followID as $k=>$v){
                    $followID[$k] = $v['follow'];
                }
                //获取用户信息表中的用户信息
                $where=array('uid'=>array('IN',$followID));
                $field=array('username','face50'=>'face','uid');
                $follow=M('userinfo')->where($where)->field($field)->limit(8)->select();
                //设置缓存
                S('follow_'.$me,$follow,3600);
            }
        }
        //右侧我的粉丝放入缓存中
        if(S('fans_'.$me)){
            //记录存在则取缓存数据
            $fans=S('fans_'.$me);
        }else{
            $fansId=M('follow')->where(array('follow'=>$me))->field('fans')->select();
            //判断fans是否为空
            if(empty($fansId)){
                $fans=null;
            }else{
                //遍历结果集
                foreach($fansId as $k=>$v){
                    $fansId[$k] = $v['fans'];
                }
                //获取用户信息表中的用户信息
                $where=array('uid'=>array('IN',$fansId));
                $field=array('username','face50'=>'face','uid');
                $fans=M('userinfo')->where($where)->field($field)->limit(8)->select();
                //设置缓存
                S('fans_'.$me,$fans,3600);
            }
        }
        
        //分配数据
        $this->weibo = empty($weibo) ? fasle : $weibo;
        $this->page = $page->show();
        $this->userinfo = $userinfo;
        $this->follow = $follow;
        $this->fans = $fans;
        $this->count = $count;
        $this->display();
    }
    //评论页显示处理
    public function showComment(){
        
        $me = session('uid');
        $where = array('uid'=>$me);
        $count = M('comment')->where($where)->count();
        $page = format_fenye($count, C('PAGE_SIZE_HOME'));
        $limit = $page->firstRow . ',' . $page->listRows;
        $comment = D('CommentView')->where($where)->limit($limit)->order('time DESC')->select();
        
        $this->comment = $comment;
        $this->page = $page->show();
        $this->count = $count;
        $this->display('comment');
    }
    //删除评论处理
    public function delComment(){
        if(!IS_POST){
            E('页面不存在');
        }
        $wid = intval($_POST['wid']);
        $cid = intval($_POST['cid']);
        $me = session('uid');
        $count = M('comment')->where(array('uid'=>$me))->count();
        if(M('comment')->where(array('id'=>$cid))->delete()){
            M('weibo')->where(array('id'=>$wid))->setDec('comment');//评论-1
            $json = array(
                'status'    => 1,
                'count'     => intval($count) - 1
            );
            echo json_encode($json);
        }else{
            echo 0;
        }
        
    }
    //回复评论处理
    public function replyComment(){
        if(!IS_POST){
            E('页面不存在');
        }
        $wid = intval($_POST['wid']);
        $content = htmlspecialchars($_POST['content']);
        $me = session('uid');
        $db = M('comment');
        $data = array(
            'time'      => time(),
            'content'   => $content,
            'wid'       => $wid,
            'uid'       => $me
        );
        $count = $db->where(array('uid'=>$me))->count();
        if($cid = $db->data($data)->add()){//评论成功
            M('weibo')->where(array('id'=>$wid))->setInc('comment');//weibo评论+1
            $myComment = D('CommentView')->where(array('cid'=>$cid))->find();
            //格式化内容和时间
            $myComment['time'] = time_format($myComment['time']);
            $myComment['content'] = replace_weibo($myComment['content']); 
            $json = array(
                'status'    =>  1,
                'count'     =>  $count +1,
                'myReply'   =>  $myComment
            );
            echo json_encode($json);
        }else{
            echo 0;
        }
    }
    //关注列表
    public function followList(){

        $me = session('uid');
        $type = intval($_GET['type']);
        $where = $type==1  ? array('fans'=>$me) : array('follow'=>$me);
        $count = M('follow')->where($where)->count();
        $field = $type ==1 ? 'follow' : 'fans';
        $follow = M('follow')->where(array('fans'=>$me))->field('follow')->select();
        $fans = M('follow')->where(array('follow'=>$me))->field('fans')->select();
        $obj = M('follow')->where($where)->field($field)->select();
        if(empty($obj)){
            $users = null;
        }else{
            foreach ($obj as $k=>$v){
                $myObj[$k] =  $type == 1 ? $v['follow'] : $v['fans'];
            }
        }
        //分页
        $whereUser = array('uid'=>array('IN',  implode(',',$myObj)));
        $page = format_fenye($count, C('PAGE_SIZE_HOME'));
        $limit = $page->firstRow . ',' . $page->listRows;
        $users = M('userinfo')->where($whereUser)->limit($limit)->field('uid,username,face50,sex,fans,follow,weibo')->select();
        foreach($follow as $k=>$v){
            $follow[$k] = $v['follow'];
        }
        foreach($fans as $k=>$v){
            $fans[$k] = $v['fans'];
        }
        $this->follow = $follow;
        $this->fans = $fans;
        $this->page = $page->show();
        $this->count = $count;
        $this->users = $users;
        $this->type = $type;
        $this->display();
    }
    //删除关注
    public function delFollowss(){
        
        if(!IS_POST){
            E('页面不存在');
        }
        $type = intval($_POST['type']);
        $uid = intval($_POST['uid']);
        $me = session('uid');
        //统计follow/fans总数
        $whereCount = $type==1 ? array('fans'=>$me) : array('follow'=>$uid); 
        $count = M('follow')->where($whereCount)->count();
        $where = array(
            'follow'    =>  $type ==1 ? $uid : $me,
            'fans'      =>  $type ==1 ? $me : $uid
        );
        if(M('follow')->where($where)->delete()){
            
            if(type){
                M('userinfo')->where(array('uid'=>$me))->setDec('follow');//关注人的关注数-1
                M('userinfo')->where(array('uid'=>$uid))->setDec('fans');//被关注者的fans-1
            }else{
                M('userinfo')->where(array('uid'=>$me))->setDec('fans');//被关注者的fans-1
            }
            $data = array(
                'status'    =>  1,
                'count'     =>  $count - 1
            );
            echo json_encode($data);
        }else{
            $data = array('status'=>0);
            echo json_encode($data);
        }
    }
    //私信页处理
    public function showLetter(){
        
        $me = session('uid');
        $where = array('uid'=>$me);
        $count = M('letter')->where($where)->count();
        $page = format_fenye($count, C('PAGE_SIZE_HOME'));
        $limit = $page->firstRow . ',' . $page->listRows; 
//        $letter = D('LetterView')->where($where)->limit($limit)->order('time DESC')->select();
        
        $this->letter = empty($letter) ? false : $letter;
        $this->count = $count ;
        $this->page = $page->show();
        $this->display('letter');
    }
    //收藏页处理
    public function showKeep(){
        
        $me = session('uid');
        //分页
        $where = array('uid'=>$me);
        $count = M('keep')->where($where)->count();
        $page = format_fenye($count, C('PAGE_SIZE_HOME'));
        $limit = $page->firstRow . ',' . $page->listRows;
//        $sql = "SELECT hd_keep.id AS kid,hd_keep.uid AS uid,hd_keep.time AS `time`,hd_keep.wid AS wid,hd_userinfo.username AS username,hd_userinfo.face50 AS";
//        $sql .= "  face FROM hd_keep LEFT JOIN hd_userinfo ON hd_keep.uid = hd_userinfo.uid where hd_keep.uid = " + $me + " order by hd_keep.time DESC limit " + $limit + ")";
//        $weibo = D('KeepView')->where($where)->order('time DESC')->limit($limit)->select();
//        echo $model->getLastSql();
        
        $this->page = $page->show();
        $this->weibo = empty($weibo) ? false : $weibo;
        $this->display('weiboList');
    }
    //私信用户名检查
    public function checkLetterName(){
        if(!IS_POST){
            E('页面不存在');
        }
        $username = htmlspecialchars($_POST['username']);
        $resultName = M('userinfo')->where(array('username'=>$username))->getField('username');
        if(!empty($resultName)){
            echo 1;
        }else{
            echo 0;
        }
    }
    //私信发送处理
    public function letterSend(){
        if(!IS_POST){
            E('页面不存在');
        }
        $content = htmlspecialchars($_POST['content']);
        $uname = $_POST['uname'];
        $me = session('uid');
        $uid = M('userinfo')->where(array('username'=>$uname))->getField('uid');
        $data = array(
            'from'      =>  $me,
            'content'   =>  $content,
            'time'      =>  time(),
            'uid'       =>  $uid    
        );
        if(M('letter')->data($data)->add()){
            echo 1;
        }else{
            echo 0;
        }
    }
    //atme页处理
    public function showAtMe(){
        $me = session('uid');
        //分页
        $where = array('uid'=>$me);
        $count = M('atme')->where($where)->count();
        $page = format_fenye($count, C('PAGE_SIZE_HOME'));
        $limit = $page->firstRow . ',' . $page->listRows;
        $weibo = D('AtmeView')->where($where)->order('time')->limit($limit)->select();
        
        $this->atme = true;
        $this->weibo = empty($weibo) ? false : $weibo;
        $this->page = $page->show();
        
        $this->display('weiboList');
    }
}
