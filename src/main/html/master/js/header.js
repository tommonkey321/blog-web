var PROJECT_URL="";
var SERVER_URL = "/server";
var MODULE_NAME = "core";
var isIE8 = false;
var isIE9 = false;
var IS_CIPHER = false;//数据传输是否加密

(function(){
    function init() {
        //页面js加载
        document.write("<style>" +
            "@-webkit-keyframes window-load-bar {from {width: 0%;background-color:#3464f7;} to {width: 100%;background-color:#3464f7;}}" +
            "@-moz-keyframes window-load-bar {from {width: 0%;background-color:#3464f7;} to {width: 100%;background-color:#3464f7;}}" +
            "@keyframes window-load-bar {from {width: 0%;background-color:#3464f7;} to {width: 100%;background-color:#3464f7;}}" +
            "</style>");
        document.write("<div id='__window_load_tip__' style='width:100%;margin-bottom:0;height:3px;position:absolute;animation:window-load-bar 2s infinite ease-out;-webkit-animation:window-load-bar 2s infinite ease-out;'></div>");

        document.write("<link rel='stylesheet' href='" + PROJECT_URL + "/frame/planeui/css/planeui.css'>");
        document.write("<link rel='stylesheet' href='" + PROJECT_URL + "/frame/kendo/styles/kendo.common-material.min.css'>");
        document.write("<link rel='stylesheet' href='" + PROJECT_URL + "/frame/kendo/styles/kendo.metro.min.css'>");
        document.write("<link rel='stylesheet' href='" + PROJECT_URL + "/frame/planeui/plugins/fullpager/fullpager.css'>");
        document.write("<link rel='stylesheet' href='" + PROJECT_URL + "/frame/planeui/plugins/scrollbar/scrollbar.css'>");
        document.write("<link rel='stylesheet' href='" + PROJECT_URL + "/css/ui/common.css'>");
        document.write("<script type='text/javascript' src='" + PROJECT_URL + "/frame/jquery/jquery.min.js'></script>");
        document.write("<script type='text/javascript' src='" + PROJECT_URL + "/frame/planeui/planeui.js'></script>");
        document.write("<script type='text/javascript' src='" + PROJECT_URL + "/frame/planeui/plugins/fullpager/fullpager.js'></script>");
        document.write("<script type='text/javascript' src='" + PROJECT_URL + "/frame/planeui/plugins/scrollbar/scrollbar.js'></script>");
        document.write("<script type='text/javascript' src='" + PROJECT_URL + "/frame/kendo/kendo.all.min.js'></script>");
        document.write("<script type='text/javascript' src='" + PROJECT_URL + "/frame/kendo/cultures/kendo.culture.zh-CN.min.js'></script>");
        document.write("<script type='text/javascript' src='" + PROJECT_URL + "/frame/kendo/messages/kendo.messages.zh-CN.min.js'></script>");
        document.write("<script type='text/javascript' src='" + PROJECT_URL + "/frame/aiui/aiui.all.js'></script>");
        document.write("<script type='text/javascript' src=" + PROJECT_URL + "'/common/json2.js'></script>");
        document.write("<script type='text/javascript' src=" + PROJECT_URL + "'/common/tripledes.js'></script>");
        document.write("<script type='text/javascript' src=" + PROJECT_URL + "'/common/mode-ecb.js'></script>");
        document.write("<script type='text/javascript' src=" + PROJECT_URL + "'/common/jsencrypt.js'></script>");
        document.write("<script type='text/javascript' src=" + PROJECT_URL + "'/common/common.js'></script>");
        document.write("<script type='text/javascript' src=" + PROJECT_URL + "'/common/common.class.js'></script>");
        // document.write("<script type='text/javascript' src=" + PROJECT_URL + "'/js/common/constants.js'></script>");
        document.write("<script type='text/javascript' src=" + PROJECT_URL + "'/common/common.pubsub.js'></script>");

        window.onload = function(){
            window.setTimeout(function(){
                $("#__window_load_tip__").remove();
            }, 500);
            kendo.culture("zh-CN");
        };
    }
    init();

})();

function openLoginPage(){
    window.location.href = PROJECT_URL+"/login.html";
}