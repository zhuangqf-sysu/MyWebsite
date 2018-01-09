var Request = GetRequest();
function GetRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function updateHeight(){
    var h1 = $(window).height();
    $('.my-full').css("height",h1);
}
$(window).resize(function() {
    updateHeight();
});

$(document).ready(function () {
    updateHeight();
});