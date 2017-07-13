/**
 * $Id: SecCheckServer.java,v 1.0 2016/8/26 13:11 zhangrp Exp $
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */
package com.tommonkey.web.server;

import com.alibaba.dubbo.rpc.RpcContext;
import com.tommonkey.utils.http.entity.SerParameter;
import com.tommonkey.utils.response.Response;
import com.tommonkey.utils.sec.SessionManager;
import com.tommonkey.utils.sec.entity.UserInfoInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

/**
 * @author zhangrp
 * @version $Id: SecCheckServer.java,v 1.1 2016/8/26 13:11 zhangrp Exp $
 *          Created on 2016/8/26 13:11
 */
public class SecCheckServer {

    private static final Logger logger = LoggerFactory.getLogger(ParaCheckServer.class);

    public void callServer(SerParameter serParameter) {
        if (serParameter.isEnd() == true) {
            return;
        }
        try {
            String sessionId = serParameter.getHttpServletRequest().getRequestedSessionId();
            UserInfoInterface userInfoInterface = SessionManager.getUser(sessionId);
            if (userInfoInterface == null) {
                //todo 暂时关闭校验用户是否登陆
//                throw new Exception("用户未登陆！");
            } else {
                RpcContext.getContext().setAttachment(SessionManager.SESSION_KEY, sessionId);
                //更新最后操作时间
                userInfoInterface.setLastBusiDate(new Date());
                SessionManager.setUser(userInfoInterface);
            }
        } catch (Exception e) {
            logger.error("用户未登陆", e);
            serParameter.setEnd(true);
            serParameter.getResponse().getErrorInfo().setCode(Response.NO_FOUND_USER);
            serParameter.getResponse().getErrorInfo().setMessage("用户未登陆，请登录！");
        }

    }
}
