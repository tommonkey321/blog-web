var connid;
$(function (){
    function init(){
        var kbDom = document.getElementById('kb');
        JS.Engine.on({
            msg : function(kb){//侦听一个channel
                if(kb==connid+"_"+"/SYS_FUU_EXIT/"){
                    comm.dialog.notification({
                        content:"被强制退出，5秒后窗口关闭",
                        maskClickClosed:true,
                        type:comm.dialog.type.error,
                        title:'强制退出提醒'
                    });
                    setTimeout(function () {
                        window.open("about:blank","_self").close();
                        window.close();
                    },5000);
                }else{
                    var obj = JSON.parse(kb);
                    var msgType= obj.msgType == 1?"[系统消息]":"[普通消息]";
                    comm.dialog.sysNotice({
                        type:obj.msgShowType,
                        position:obj.showPosition,
                        content:decodeURIComponent(obj.msgContent),
                        title:obj.msgTitle,
                        msgType:msgType,
                        timeout:1000*obj.msgShowTime
                    });



                    // var template = kendo.template($("#showMsgPortlet").html());
                    // var portlet = $(template({
                    //     data:obj,
                    //     msgType:obj.msgType,
                    //     msgTitle:obj.msgTitle,
                    //     msgContent:obj.msgContent,
                    //     msgShowType:obj.msgShowType
                    // }));
                    // $("#showMsgDiv").html(portlet);
                }
            }
        });
        JS.Engine.start('conn');
        JS.Engine.on(
            'start',function(cId,channelList,engine){
                connid=cId;
                comm.dialog.notice({
                    type:comm.dialog.type.success,
                    // position:"center",
                    content:"连接成功!！"
                });
                 // alert('连接已建立，连接ID为：' + cId);
            });
    }

    //首页数据初始化
    var options = {
        "param": {"remark":"首页数据初始化"},
        "busiCode": "ISECUSERFSV_INITINDEXDATA",
        "moduleName": "blog",
        "sync": false,
        "callback": function (data, isSucc, msg) {
            if (isSucc) {
                if(data.sessionId == null){
                    $("#loginInfo").html("<a href='login.html'>登陆我的博客</a>");
                }else{//创建链接
                    init();
                }
                $("#titleName").html(data.nikeName);
                $("#nikeName").html(data.nikeName);
            } else {
                comm.dialog.notice({
                    type:comm.dialog.type.error,
                    position:"center",
                    content:"首页数据初始化失败!！"
                });
            }
        }
    };
    comm.ajax.ajaxEntity(options);


    // window.setInterval(reflsh, 10000);
    // function reflsh()
    // {
    //     var options = {
    //         "param": {"sessionId":null},
    //         "busiCode": "ISECUSERFSV_CHECKSTATUS",
    //         "moduleName": "blog",
    //         "sync": false,
    //         "callback": function (data, isSucc, msg) {
    //             if (isSucc) {
    //                 if(data.state==0){
    //                     clearInterval();
    //                     alert("页面将在5秒钟后关闭");
    //                     setTimeout(function () {
    //                         window.open("about:blank","_self").close()
    //                     },5000);
    //                 }
    //             } else {
    //                 comm.dialog.notice({
    //                     type:comm.dialog.type.error,
    //                     position:"center",
    //                     content:"首页数据初始化失败!！"
    //                 });
    //             }
    //         }
    //     };
    //     comm.ajax.ajaxEntity(options);
    // }


    
    $("#open-menu").bind($.clickOrTouch(), function() {
        $(".blog-menu > .pui-menu, .blog-search").toggleClass("pui-xs-hide");
    });
    
    $(".pui-search-keywords").bind("click touchend keyup", function(){
        $(".pui-search-auto-complete").removeClass("pui-hide");
    });
    
    $(".pui-search-auto-complete").mouseleave(function(){
        $(this).addClass("pui-hide");
    });
    
    var goToTop = $("#go-to-top");

    goToTop.scrollTo(function(target) {
        console.log(this, target);
    });
    
    $("a[href*=\"#\"]").scrollTo();
    
    var headerCon = $('.blog-header-con');
    var blogMain  = $(".blog-main").children(".pui-row").eq(0);
    var blogSide  = $(".blog-side");
    
    $(window).scroll(function(){
        var top = $(window).scrollTop();
        
        if ($(window).height() <= 360) {
            return ;
        }
        
        if(top > 160) {
            headerCon.css({
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1000,
                boxShadow : "0 1px 3px rgba(0,0,0,0.3)"
            });
        } else {
            headerCon.css({
                position  : "static",
                boxShadow : "none"
            });            
        }
        
        if (top > 180) {
            goToTop.fadeIn();
        } else {
            goToTop.fadeOut();
        }
    });

    //todo 暂不实现关闭此页面的退出，场景不适用
    window.onbeforeunload = function(event) {

    }




});