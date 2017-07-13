/**
 * @author hyf
 * Created on 2017/3/8 15:23
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */

var secModule = {};

function initUI(){
    $("#msgContent").kendoEditor({
        tools: ['bold','italic','underline','strikethrough',"foreColor", "backColor",'justifyLeft','justifyCenter','justifyRight','justifyFull',"createLink", "unlink", "insertImage"]
    });
};


function keyLogin(){
    if (event.keyCode==13)  //回车键的键值为13
        document.getElementById("sendButton").click(); //调用登录按钮的登录事件
}



(function ($) {

    var receiveSessionId = comm.browser.getParameter("receiveSessionId","");
    $("#receiveSessionId").val(receiveSessionId);


    $("#sendButton").click(function(){
        var msgData = $("#msgForm").form().getData();
        var content = encodeURIComponent(encodeURIComponent($("#msgContent").data("kendoEditor").value()));
        msgData.msgContent = content;
        if(comm.lang.isEmpty(msgData.msgTitle)){
            comm.validate.validateError($("#msgTitle"));
            comm.dialog.notice({
                type:comm.dialog.type.error,
                position:"center",
                content:"消息标题不能为空！"
            });
            return;
        }else if(comm.lang.isEmpty(content)){
            comm.validate.validateError($("#msgContent"));
            comm.dialog.notice({
                type:comm.dialog.type.error,
                position:"center",
                content:"消息内容不能为空！"
            });
            return;
        }else if(comm.lang.isEmpty(msgData.msgShowTime)){
            comm.validate.validateError($("#msgShowTime"));
            comm.dialog.notice({
                type:comm.dialog.type.error,
                position:"center",
                content:"显示时间不能为空！"
            });
            return;
        }

        var options = {
            "param": msgData,
            "busiCode": "IMESSAGESERVICEFSV_SENDMSG",
            "moduleName": "blog",
            "sync": false,
            "callback": function (data, isSucc, msg) {
                if (isSucc) {
                    comm.dialog.notice({
                        type:comm.dialog.type.success,
                        position:"center",
                        content:msg
                    });
                    // comm.dialog.unWindow({
                    //     "confirm":true
                    // });
                } else {
                    comm.dialog.notice({
                        type:comm.dialog.type.error,
                        position:"center",
                        content:msg
                    });
                    // comm.dialog.notification({
                    //     content: "告警类型修改失败！"+msg
                    // });
                }
            }
        }
        comm.ajax.ajaxEntity(options);
    });
    initUI();
})(jQuery);