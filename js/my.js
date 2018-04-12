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

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var root =  location.origin + "/data/";

function simplePost(url,data,callback) {

    $.ajax({
        type: "GET",
        url: root+url,
        data: data,
        success: callback,
        contentType:"application/json; charset=UTF-8",
        dataType: "json"
    });
}