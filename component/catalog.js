Vue.component('my-catalog',{
    props:['catalog','message'],
    template:'<ul class="am-list am-list-striped">' +
                '<li v-for="item in catalog"><a :href="item.url">' +
                    '<h1 class="am-article-title">{{item.title}}</h1>'+
                    '<span class="am-article-meta">{{item.author}} {{item.created_at}} 最后更新：{{item.updated_at}}</span>'+
                '</a></li>'+
                '<h1>{{message}}</h1>'+
            '</ul>'
});

Vue.component('my-catalog-section',{
    props:['listUrl','icons','url'],
    data:function () {
        return {
            catalog:[],
            message:"列表加载中，请稍候..."
        }
    },
    template:'<section class="am-g">' +
                '<aside id="my-aside" class="am-u-lg-3 am-u-md-4 am-hide-sm-only"></aside>'+
                '<my-catalog id="my-catalog" :catalog="catalog" class="am-u-lg-7 am-u-md-8"></my-catalog>'+
                '<my-article-icon :icons="icons" class="am-u-lg-2 am-hide-sm-only"></my-article-icon>'+
            '</section>',
    created:function () {
        var self = this;
        var progress = $.AMUI.progress;
        progress.start();
        console.log(self);
        console.log(this.$props.dealData);
        $.get(this.listUrl,function (data) {
            var result = [];
            for(var i in data){
                var item = {
                    title:data[i].name,
                    author:data[i].owner.login,
                    created_at:new Date(data[i].created_at).toLocaleDateString(),
                    updated_at:new Date(data[i].updated_at).toLocaleDateString(),
                    url:self.url+data[i].name
                };
                result.push(item);
            }
            self.catalog = result;
            self.message = "";
            progress.done();
        }).fail(function () {
            self.message = "列表加载失败";
            progress.done();
        });
    }
});
