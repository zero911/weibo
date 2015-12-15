<?php
return array(
    
        /* 数据库设置 */
    'DB_TYPE'               =>  'mysql',     // 数据库类型
    'DB_HOST'               =>  'localhost', // 服务器地址
    'DB_NAME'               =>  'weibo',          // 数据库名
    'DB_USER'               =>  'root',      // 用户名
    'DB_PWD'                =>  'root',          // 密码
    'DB_PORT'               =>  '3306',        // 端口
    'DB_PREFIX'             =>  'hd_',    // 数据库表前缀  
    'DB_DEBUG'              =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志
    'DB_CHARSET'            =>  'utf8',      // 数据库编码默认采用utf8
    
    //分页配置
    'PAGE_SIZE_HOME'        =>   10,//前台分页
    'PAGE_SIZE_ADMIN'       =>   20,//后台分页
    
    //前台敏感字符过滤
    'FILTER'                =>  'php',
    
    //路由配置
    'URL_ROUTER_ON' => true, //开启路由
    'URL_ROUTE_RULES' => array(//路由配置部分
        'show/:id\d' => 'User/showHome', //用户个人主页  /^blog\/(\d+)$/
        'show' => 'Index/index', //首页配置
        'follow/:id\d' => array('User/followList','type=1'),  //粉丝界面
        'fans/:id\d' => array('User/followList','type=0')  //粉丝界面
    ),
    
    //缓存配置
    'DATA_CACHE_SUBDIR' => true,  //开启以哈希形式生成缓存目录
    'DATA_PATH_LEVEL' => 2, //目录层次
);