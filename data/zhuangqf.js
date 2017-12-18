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
        url:"java.html",
        name:"java"
    },{
        url:"spring.html",
        name:"spring"
    },{
        url:"netty.html",
        name:"netty"
    },{
        url:"project.html",
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
