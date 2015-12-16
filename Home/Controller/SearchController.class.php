<?php

/**
 * 微博搜索处理
 *
 * @author user
 */
namespace Home\Controller;
use Home\Controller\CommonController;

class SearchController extends CommonController{
    //put your code here
    //搜索找人处理
    public function sechUser(){
//        if(!IS_POST){
//            E('页面不存在');
//        }
        $keyword = $_POST['keyword']=='' ? null : $_POST['keyword'];
        if(!empty($keyword)){
            $where = array(
                'username'=>array('like',$keyword.'%'),
                );
            $db = M('userinfo');
            $count = $db->where($where)->count();
            $page = format_fenye($count, C('PAGE_SIZE_HOME'));//分页
            $limit = $page->firstRow . ',' . $page->listRows;
            $field = "face80,uid,username,location,follow,fans,weibo";
            $users = $db->where($where)->field($field)->limit($limit)->select();
            //得到关注信息
            $followed = M('follow')->where(array('fans'=>session('uid')))->field('follow')->select();
            if(!empty($followed)){
                //关注不为空遍历
                foreach($users as $k=>$v){
                    foreach ($followed as $i => $m) {
                        if ($m['follow'] == $v['uid']) {
                            $v['followed'] = 1;
                            $users[$k] = $v;
                        }
                        $mutual = M('follow')->where(array('fans' => $m['follow'], 'follow' => session('uid')))->find();
                        if (!empty($mutual) && $v['uid'] == $m['follow']) {
                            $v['mutual'] = 1;
                            $users[$k] = $v;
                        }
                    }
                }
            }
        }
        $this->page = $page;
        $this->result = empty($users) ? false : $users;
        $this->keyword = $keyword;
        $this->display();
    }
    
    //异步搜索处理
    public function sechThink(){
//        if(!IS_POST){
//            E('页面不存在');
//        }
        $keyword = $_POST['keyword'];
        $where = array(
            'username' => array('like', $keyword . '%'),
        );
        $users = M('userinfo')->where($where)->limit(10)->getField('username');
        if(empty($users)){
            echo json_encode(array(status=>0));
        }else{
            $data = array(
                'status'    =>  1,
                'users'     =>  $users
            );
            echo json_encode($data);
        }
    }
    
    //搜索找微博处理
    public function sechWeibo(){
        if(!IS_POST){
            E('页面不存在');
        }
        $keyWord = htmlspecialchars($_POST['keyword']);
        $where = array(
            'content'=>array('LIKE','%'.$keyWord.'%')
            );
        //分页
        $count = M('weibo')->where($where)->count();
        $page = format_fenye($count, C('PAGE_SIZE_HOME'));
        $limit = $page->firstRow . ',' . $page->listRows;
        $weibo = D('WeiboView')->where($where)->limit($limit)->order('time DESC')->select();
        
        $this->weibo = $weibo;
        $this->page = $page->show();
        $this->keyword = $keyWord;
        $this->display();
    }
}
