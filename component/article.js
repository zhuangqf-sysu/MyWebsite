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
            var converter = new showdown.Converter();
            var html = converter.makeHtml(data);
            self.html = html;
            progress.done();
        }).fail(function(){
            self.html = "<h4>文章加载失败</h4>";
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