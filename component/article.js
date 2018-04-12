Vue.component('my-article',{
    props:['html'],
    template:'<article id="my-article">' +
                '<div class="markdown-body" v-html="html" id="my-article-body"></div>'+
            '</article>'
});

Vue.component('my-article-icon',{
    props:['icons'],
    template:'<div id="my-article-icon"><div>' +
                '<a data-am-smooth-scroll class="am-icon-arrow-circle-up am-icon-btn"></a>' +
                '<my-footer-icon v-for="iconInfo in icons" v-bind:iconInfo="iconInfo"></my-footer-icon>'+
             '</div></div>'
});

Vue.component('my-section',{
    props:['url','icons'],
    data: function(){
        return {
            html: "<h4>文章加载中，请稍候...</h4>"
        }
    },
    template:   '<section class="am-g">' +
                    '<aside id="my-aside" class="am-u-lg-3 am-u-md-4 am-hide-sm-only"></aside>'+
                    '<my-article :html="html" class="my-article am-u-lg-7 am-u-md-8"></my-article>'+
                    '<my-article-icon :icons="icons" class="am-u-lg-2 am-hide-sm-only"></my-article-icon>'+
                '</section>',
    mounted:function () {
        var self = this;
        var progress = $.AMUI.progress;
        progress.start();
        $.get( this.url,function(data) {
            var converter = new showdown.Converter({extensions: ['table']});
            var html = converter.makeHtml(data);
            self.html = html;
            progress.done();
        }).fail(function(){
            self.html = "<h4>暂无文章。。。。。。</h4>";
            progress.done();
        })
    },
    updated:function () {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
        new Toc("my-article-body",{
            'level':2,
            'class':'my-aside',
            'targetId':'my-aside'
        });
    }
});

Vue.component('my-reward',{
    props:['url'],
    template:'<div class="am-g am-g-fixed">' +
    '           <div  class="am-u-sm-6 am-u-md-4 am-u-md-3 am-u-sm-centered">\n' +
    '               <img :src="url">\n' +
    '           </div>\n' +
    '        </div>'
});

Vue.component('my-comment-header',{
    props:['name'],
    computed:{
        header:function () {
            return this.name.substring(0,1);
        },
        style:function () {
            var colors = ["#F06292", "#BA68C8", "#7986CB", "#64B5F6", "#4DD0E1", "#4DB6AC",
                "#81C784", "#9CCC65", "#DCE775", "#FFF176", "#FFD54F", "#FFB74D", "#FF8A65"];
            var temp = this.name.hashCode();
            // return colors[temp % colors.length];
            return "background-color:" + colors[temp % colors.length];
        }
    },
    template:'<div class="am-comment-avatar my-comment-header" :style="style" >{{header}}</div>'
});

Vue.component('my-comment-hd',{
    props:['name','time','reply'],
    template:'<header class="am-comment-hd">' +
    '           <div class="am-comment-meta">' +
    '               <span class="am-comment-author">{{name}}</span>' +
    '               <span v-if="reply.length > 0">回复<b>{{reply}}</b></span>' +
    '               <time datetime="">{{time}}</time>' +
    '           </div>' +
    '         </header>'
});

Vue.component('my-comment-bd',{
    props:['message'],
    template:'<div class="am-comment-bd">{{message}}</div>'
});

Vue.component('my-comment-footer',{
    props:['id','thumbsUp','thumbsDown'],
    computed:{
        thumbsUpFun:function () {
            return "javascript:thumbsUp("+this.id+")";
        },
        thumbsDownFun:function () {
            return "javascript:thumbsDown("+this.id+")";
        },
        replyFun:function () {
            return "javascript:reply("+this.id+")";
        }
    },
    template:'<footer class="am-comment-footer">' +
    '           <div class="am-comment-actions">' +
    '               <a :href="thumbsUpFun"><i class="am-icon-thumbs-up">({{thumbsUp}})</i></a>' +
    '               <a :href="thumbsDownFun"><i class="am-icon-thumbs-down">({{thumbsDown}})</i></a>' +
    '               <a :href="replyFun"><i class="am-icon-reply"></i></a>' +
    '           </div>' +
    '         </footer>'
});

Vue.component('my-comment',{
    props:["comment"],
    computed:{
        isReply:function () {
            if(this.comment.reply.length > 0) return "am-comment-flip";
            else return "";
        }
    },
    template:'<li class="am-comment" :class="isReply">' +
    '           <my-comment-header :name="comment.name"></my-comment-header>' +
    '           <div class="am-comment-main">' +
    '               <my-comment-hd :name="comment.name" :time="comment.time" :reply="comment.reply"></my-comment-hd>' +
    '               <my-comment-bd :message="comment.message"></my-comment-bd>' +
    '               <my-comment-footer :id="comment.id" :thumbsUp="comment.thumbsUp" :thumbsDown="comment.thumbsDown"></my-comment-footer>' +
    '           </div>' +
    '        </li>'
});

Vue.component('my-comment-list',{
    props:["comments"],
    template:'<section class="am-g">' +
    '           <div class="am-u-lg-7 am-u-md-8 am-u-sm-centered">' +
    '           <h2>精彩评论</h2>' +
    '           <ul class="am-comments-list am-comments-list-flip">' +
    '               <my-comment v-for="comment in comments" :comment="comment"></my-comment>' +
    '           </ul>' +
    '           </div>' +
    '         </section>'
});