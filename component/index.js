Vue.component("my-da-slider",{
    props:['topic','title','summary','url'],
    template:'<div class="da-slide">' +
        '<h2>{{topic}}</h2>' +
        '<p>{{title}}:{{summary}}</p>' +
        '<a :href="url" class="da-link"><span>Read Me</span></a>' +
    '</div>'
});

Vue.component("my-slider",{
    props:['recommends'],
    template:'<div id="da-slider" class="da-slider">' +
        '<my-da-slider v-for="item in recommends" :topic="item.topic" :title="item.title" :summary="item.summary" :url="item.url"></my-da-slider>' +
        '<nav class="da-arrows"> <span class="da-arrows-prev"></span> <span class="da-arrows-next"></span> </nav>' +
    '</div>',
    mounted:function () {
        $(this.$el).cslider({
            autoplay	: true,
            bgincrement	: 450
        });
    }
});
