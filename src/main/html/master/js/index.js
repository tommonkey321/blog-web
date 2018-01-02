
$(function (){


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
                    // init();
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
        
        if (top > 180) {0
            goToTop.fadeIn();
        } else {
            goToTop.fadeOut();
        }
    });

    //todo 暂不实现关闭此页面的退出，场景不适用
    window.onbeforeunload = function(event) {

    }




});