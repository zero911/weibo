<?php
namespace Home\Controller;
use Home\Controller\CommonController;
class IndexController extends CommonController {
    
    /**
     * 首页数据展现：用户和用户关注的人发送微博；以及分组的微博
     */
    public function index(){
        //得到用户所有的关注列表
        $gid = $_GET['gid'];
        $me = session('uid');
        $where = isset($gid) ? array('gid'=>intval($gid),'fans'=>$me) : array('fans'=>$me);//区分是全部还是分组信息
        $follows = M('follow')->where($where)->select();
        $my_follow_str = $me;
        //遍历用户的关注数组
        foreach($follows as $k=>$v){
            $my_follow_str .= ','.$v['follow'];
        }
        $where = array('uid'=>array('in',$my_follow_str));
        //得到分页信息
        $count = M('weibo')->where($where)->count();
        $page = format_fenye($count, C('PAGE_SIZE_HOME'));
        $limit = $page->firstRow. ',' . $page->listRows;
        $db  = D('WeiboView');
        //得到微博列表
        $weibo = $db->where($where)->limit($limit)->order('time DESC')->select();
        //区分是否转发微博
        foreach ($weibo as $k => $v){
            $turnId = $v['isturn'];
            if($turnId){
                $turnWeibo = $db->where(array('id'=>$turnId))->find();
                //isturn 的id替换成转发的微博数据
                $v['isturn'] = $turnWeibo;
                $weibo[$k] = $v;
            }
        }        
        //分配数据
        $this->weibo = empty($weibo) ? fasle : $weibo;
        $this->page = $page->show();
        $this->display();
    }
    
    //发送微博功能
    //待完善异步发送微博功能
    public function sendWeibo(){
        
        if(!IS_POST){
            E('页面不存在');
        }
        $max = isset($_POST['max']) ? $_POST['max'] : false;
        $medium = $_POST['medium'];
        $mini = $_POST['mini'];
        $info = '微博';
        $content = htmlspecialchars($_POST['content']);
        $data = array(
            'content'   =>  $content,
            'time'      =>  time(),
            'uid'       =>  session('uid')
        );
        if($wid = M('weibo')->add($data)){
            //用户微博+1
            M('userinfo')->where(array('uid'=>$data['uid']))->setInc('weibo');
            if($max){//存在图片写入图片数据
                $info = '图片微博';
                $dataPic = array(
                    'max'       =>  $max,
                    'medium'    =>  $medium,
                    'mini'      =>  $mini,
                    'wid'       =>  $wid
                );
                if(!M('picture')->data($dataPic)->add()){
                    $this->error('发送' . $info . '失败');
                }
            }
            $this->success('发送' . $info . '成功');
        }else{
            $this->error('发送' . $info . '失败');
        }
    }
    
    //转发微博功能
    //待完善异步转发微博功能
    public function turn(){
        if(!IS_POST){
            E('页面不存在');
        }

        $tid = intval($_POST['tid']);
        $turnWid = intval($_POST['id']);
        $content = htmlspecialchars($_POST['content']);
        $uid = session('uid');
        $is_comment = isset($_POST['becomment']) ? $_POST['becomment'] : false;
        $db = M('weibo');
        $info = '转发';
        $data = array(
            'content'   =>  $content,
            'uid'       =>  $uid,
            'time'      =>  time(),
            'isturn'    =>  $turnWid
        );
        if($db->data($data)->add()){//转发成功
            //自身微博+1
            M('userinfo')->where(array('uid'=>$uid))->setInc('weibo');
            //被转发的weibo转发数+1
            $db->where(array('id'=>$turnWid))->setInc('turn');
            if($tid){//多重转发，原始转发+1
                $db->where(array('id'=>$tid))->setInc('turn');
            }
            if($is_comment){//将转发内容同时评论给被转发的用户
                
                $commentData = array(
                    'content'   =>  $content,
                    'time'     =>  time(),
                    'uid'       =>  $uid,
                    'wid'       => $turnWid
                );
                if(M('comment')->data($commentData)->add()){//评论成功
                    //被评论的微博评论数+1
                    $db->where(array('id'=>$turnWid))->setInc('comment');
                    $info .= '和评论';
                }  else {
                    $this->error('转发微博成功，但评论失败...');
                }
            }
            $this->success('恭喜你'.$info.'微博成功');
        }else{
            $this->error('很遗憾'.$info.'微博失败');
        }
    }
    //评论处理
    public function comment(){
        if(!IS_POST){
            E('页面不存在');
        }
        $content = htmlspecialchars($_POST['content']);
        $wid = $_POST['wid'];
        $wuid = $_POST['uid'];
        $me = session('uid');
        $turnMe = $_POST['turnMe'];
        $db = M('weibo');
        $data = array(
            'content'   =>  $content,
            'time'      =>  time(),
            'uid'       =>  $me,
            'wid'       =>  $wid
        );
        if($cid = M('comment')->data($data)->add()){//评论成功
            
            $db->where(array('id'=>$wid))->setInc('comment');//weibo评论+1
            //得到评论条数
            $comment = $db->where(array('id'=>$wid))->getField('comment');
            //得到当前用户评论
            $sendUser = D('CommentView')->where(array('cid'=>$cid))->find();
            $sendUser['time'] = time_format($sendUser['time']);
            $sendUser['content'] = replace_weibo($sendUser['content']);
            //成功返回格式json
            $json = array(
                'status' => 1,
                'type' => 1, // 1评论微博成功;2:评论微博成功，转发失败 3评论失败
                'sendUser' => $sendUser,
                'info' => '评论微博成功',
                'comment'=>$comment
            );
            if($turnMe){//转发到我的微博
                
                $dataTurn = array(
                    'content'   =>  $content,
                    'time'      =>  time(),
                    'isturn'    =>  $wuid,
                    'uid'       =>  $me,
                );
                if(M('weibo')->data($dataTurn)->add()){
                    M('userinfo')->where(array('uid'=>$me))->setInc('weibo');//微博数+1 ？
                    $db->where(array('id'=>$wid))->setInc('turn');//weibo转发数+1
                }else{
                    $json['type'] = 2;
                    $json['info'] = '评论成功,转发微博失败';
                }
            }
        }else{
            $json = array(
                'status'    =>  0,
                'type'    => 3,
                'info'      =>  '评论微博失败'
            );
        }
        echo json_encode($json);
    }
    //获取评论列表
    public function getComment(){
        if(!IS_POST){
            E('页面不存在');
        }
        $wid = intval($_POST['wid']);
        $comments = D('CommentView')->where(array('wid'=>$wid))->order('time DESC')->select();
        $json=array(
            'status' => 0,
            'commentList'=>''
        );
        if(!empty($comments)){
            $json['status']=1;
            foreach ($comments as $k => $v){
                $v['content'] = replace_weibo($v['content']);
                $v['time'] = time_format($v['time']);
                $comments[$k] = $v;
            }
            $json['commentList'] = $comments;
        }
        echo json_encode($json);
    }
    //收藏微博
    public function keep(){
        if(!IS_POST){
            E('页面不存在');
        }
        $wid = intval($_POST['wid']);
        $me = session('uid');
        $data = array(
            'time'  =>  time(),
            'wid'   =>  $wid,
            'uid'   =>  $me
        );
        $keep = M('weibo')->where(array('id'=>$wid))->getField('keep');//获取当前微博收藏数
        //指定json返回数组格式
        $json = array(
            'status'    => 1,//1收藏成功 2收藏失败 3已收藏
            'keep'      => $keep
        );
        if(M('keep')->where(array('wid'=>$wid,'uid'=>$me))->count()){
            $json['status'] = 3;//当前用户已经收藏
        }else{
            if (M('keep')->data($data)->add()) {//收藏成功
                C('LAST_KEEP', $me);
                //所属微博数+1
                M('weibo')->where(array('id' => $wid))->setInc('keep');
                $json['keep'] = $keep + 1;
            } else {//收藏失败
                $json['status'] = 2;
            }
        }
        echo json_encode($json);
    }   
    //删除微博
   public function delWeibo(){
       if(!IS_POST){
           E('页面不存在');
        }
        $wid = intval($_POST['wid']);
        $me = sessino('uid');
        $db = M('weibo');
        //查询非当前用户微博不允许删除
        $userid = $db->where(array('id'=>$wid))->getField('uid');
        if($me != $userid){
            echo -1;
            die;
        }
        if($db->where(array('id'=>$wid,'uid'=>$me))->delete()){
                M('userinfo')->where(array('uid'=>$me))->setDec('weibo');//微博数-1
                if($img = M('picture')->where(array('wid'=>$wid))->find()){
                    //如果是图片微博删除图片和数据库资源
                    M('picture')->delete($img['id']);
                    @unlink('.Upload/Pic/'.$img['max']);
                    @unlink('.Upload/Pic/'.$img['medium']);
                    @unlink('.Upload/Pic/'.$img['mini']);
                }
            echo 1;
        }else{
            echo 0;
        }
   }
}