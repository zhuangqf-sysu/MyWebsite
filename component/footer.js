Vue.component('my-footer-icon',{
    props:['iconInfo'],
    template: '<a :href="iconInfo.url" :class="iconInfo.icon">{{iconInfo.action}}</a>'
});

Vue.component('my-footer-icons',{
    props:['icons'],
    template:'<h4><my-footer-icon v-for="iconInfo in icons" v-bind:iconInfo="iconInfo"></my-footer-icon></h4>'
});

Vue.component('my-footer-developer',{
    props:['developer'],
    template:'<h1>Developed By {{developer.name}} <a :href="developer.github" class="am-icon-github"></a></h1>'
});

Vue.component('my-footer',{
    props:['icons','developer'],
    template:'<footer class="footer my-footer">' +
                '<my-footer-icons v-bind:icons="icons"></my-footer-icons>' +
                '<my-footer-developer v-bind:developer="developer"></my-footer-developer>'+
                '<a>zhuangqf &nbsp;<span class="am-icon-heart"></span>&nbsp; chuyj</a>'+
             '</footer>'
});

Vue.component('my-record',{
    props:['record'],
    template:'<div class="copy"><p>© {{record}}</p></div>'
});