/**
 * 网站个人信息配置
 * @author zhuangqf@mail2.sysu.edu.cn
 * */

/**
 * 页眉信息
 * */
var header = {
    title: "zhuangqf",
    menu:[{
        url:"index.html",
        name:"home"
    },{
        url:"catalog.html?type=java",
        name:"java"
    },{
        url:"catalog.html?type=spring",
        name:"spring"
    },{
        url:"catalog.html?type=netty",
        name:"netty"
    },{
        url:"catalog.html?type=project",
        name:"project"
    }]
};

/**
 * 页脚信息
 * */
var footer = {
    icons:[{
        call:"star",
        action: "点赞",
        url:"https://github.com/zhuangqf-sysu/MyWebsite",
        icon:"am-icon-star"
    },{
        call:"wechat",
        action: "打赏",
        url:"#",
        icon:"am-icon-wechat"
    },{
        action: "评论",
        url:"#",
        icon:"am-icon-comment"
    },{
        action: "报bug",
        url:"#",
        icon:"am-icon-bug"
    }],
    developer:{
        name: "zhuangqf",
        github:"https://github.com/zhuangqf-sysu"
    }
};

var record = {
    "record": "备案号"
};


/**
 * 文章页信息
 * */
var section = {
    url:"",
    html: "<h4>文章加载中......</h4>",
    icons:[{
        url:"#",
        icon:"am-icon-star am-icon-btn"
    },{
        url:"#",
        icon:"am-icon-wechat am-icon-btn"
    },{
        url:"#",
        icon:"am-icon-comment am-icon-btn"
    }]
};

/**
 * 目录页信息
 * */
var project =  {
    listUrl: "https://api.github.com/users/zhuangqf-sysu/repos?sort=created&direction=desc",
    url: "content.html?projectId=",
    icons: []
};

var java = {
    listUrl: "https://raw.githubusercontent.com/zhuangqf-sysu/MyWebsite/master/blog/java/config.json",
    url: "content.html?javaId=",
    icons:[]
};

var spring = {
    listUrl: "https://raw.githubusercontent.com/zhuangqf-sysu/MyWebsite/master/blog/spring/config.json",
    url: "content.html?springId=",
    icons:[]
};

var netty = {
    listUrl: "https://raw.githubusercontent.com/zhuangqf-sysu/MyWebsite/master/blog/netty/config.json",
    url: "content.html?nettyId=",
    icons:[]
};