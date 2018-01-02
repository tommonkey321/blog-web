
/**
 * 用户下线
 * */
function outLine(data){
    comm.dialog.confirm({
        content:"确定强制此用户下线吗？",
        func:function(flag){
            if(flag){
                comm.ajax.ajaxEntity({
                    busiCode:"ISECUSERFSV_OUTLINEUSERBYSESSIONID",
                    param:{"sessionId":data.sessionId},
                    callback:function(data,isSucc,msg){
                        if(isSucc){
                            comm.dialog.notification({
                                type:comm.dialog.type.success,
                                content:"下线成功",
                                func:function(){
                                    //重新加载页面
                                    $("#inLineGrid").datagrid().load();
                                }
                            })
                        }else{
                            comm.dialog.notification({
                                type:comm.dialog.type.error,
                                content:msg
                            });
                        }
                    }
                })
            }
        }
    });
}


/**
 * 用户下线
 * */
function sendMsg(data){
    //打开窗口
    comm.dialog.window({
        title:"消息发送",
        url:"/view/blog/msg/sendMsg.html?receiveSessionId="+data.sessionId,
        width:260,
        height:650,
        isSec:true
    });
}





(function(){
    $("#reFlash").bind("click",function(){//查询按钮添加事件
        $("#inLineGrid").datagrid().load();
    });


    function reflsh(){
        $("#inLineGrid").datagrid().load();
    }
})();