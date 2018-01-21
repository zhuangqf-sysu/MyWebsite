Vue.component("my-menu-item",{
    props: ['item'],
    template: '<li><a :href="item.url" class="scroll">{{item.name}}</a></li>'
});

Vue.component("my-menu",{
   props: ['menu'],
   template:'<div class="h_menu"><ul class="flexy-menu thick orange">' +
                '<my-menu-item v-for="item in menu" v-bind:item="item" v-bind:key="item.url"></my-menu-item>' +
                '</ul>'+
            '</div>',
    mounted:function () {
        $(this.$el).find(".flexy-menu").flexymenu({speed: 400,type: "horizontal",align: "right"});
    }
});

Vue.component("my-title",{
    props:['title'],
    template:' <div class="logo"><h1><a href="#">{{title}}</a></h1></div>'
});

Vue.component("my-header",{
    props:['title','menu'],
    template:'<div class="wrap"><div class="header_style1">' +
                '<my-title v-bind:title="title"></my-title>'+
                '<my-menu v-bind:menu="menu"></my-menu>'+
                '<div class="clear"> </div>'+
             '</div></div>'
});