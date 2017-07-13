package com.tommonkey.web.controller;

import com.tommonkey.blog.api.sec.ISecUserFSV;
import com.tommonkey.utils.common.JsonUtil;
import com.tommonkey.utils.http.entity.CfgSrvBase;
import com.tommonkey.utils.response.Response;
import com.tommonkey.utils.sec.SecManage;
import com.tommonkey.utils.sec.SessionManager;
import com.tommonkey.utils.sec.entity.UserInfoInterface;
import com.tommonkey.utils.security.K;
import com.tommonkey.web.dubbo.DubboManage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Date;
import java.util.Map;


@Controller
@RequestMapping(value = "sec")
public class SecController {

    private static final Logger logger = LoggerFactory.getLogger(SecController.class);

    @RequestMapping("login")
    @ResponseBody
    public String login(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        Response response = new Response();
        try {
            String data = httpServletRequest.getParameter("data");
            Map map = JsonUtil.json2Map(data);
            String userName = String.valueOf(map.get("username"));
            String password = String.valueOf(map.get("password"));
            CfgSrvBase cfgSrvBase = new CfgSrvBase();
            cfgSrvBase.setSrvId("ILOGINTESTFSV_LOGIN");
            cfgSrvBase.setSrvPackage("com.tommonkey.blog.api.sec.ISecUserFSV");
            ISecUserFSV secUserFSV = (ISecUserFSV) DubboManage.getServer(cfgSrvBase);
            String result = secUserFSV.login(map);
            if(result != null && result.length()>5){
                result = result.substring(1,result.length()-1);
            }
//            Map resultMap = JsonUtil.json2Map(result);

            UserInfoInterface userInfoInterface = JsonUtil.json2Object(result,UserInfoInterface.class);

            //将用户信息放入redis
//            JedisUtils.set(SecManage.SEC_USER_INFO+userInfoInterface.getUserId(),JsonUtil.object2Json(userInfoInterface));

            if(!K.j(password).equals(userInfoInterface.getPassword())){
                throw new Exception("用户名或密码不正确！");
            }
            if("0".equals(userInfoInterface.getState())){
                throw new Exception("账号被锁定，请联系管理员！");
            }
            httpServletRequest.getSession().invalidate();
            HttpSession httpSession = httpServletRequest.getSession(true);
            userInfoInterface.setSessionId(httpSession.getId());
            userInfoInterface.setLoginDate(new Date());
            SessionManager.setUser(userInfoInterface);
            SessionManager.addInLine(httpSession.getId());
            response.setData(userInfoInterface);
        } catch (Exception e) {
            response.getErrorInfo().setCode(Response.ERROR);//登录失败
            response.getErrorInfo().setMessage(e.getMessage());//登录失败
        }

       return response.toString();
    }

    @RequestMapping("getCurrUserInfo")
    @ResponseBody
    public String getCurrUserInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {

        Response response = new Response();
        try {
            String sessionId = httpServletRequest.getRequestedSessionId();
            UserInfoInterface userInfoInterface = SessionManager.getUser(sessionId);
            if (userInfoInterface == null) {
                response.getErrorInfo().setCode(Response.NO_FOUND_USER);
                response.getErrorInfo().setMessage("未登陆，请登录！");
            } else {
                response.setData(userInfoInterface);
            }
        } catch (Exception e) {
            response.getErrorInfo().setCode(Response.NO_FOUND_USER);//登录失败
            response.getErrorInfo().setMessage("未登陆，请登录！");//登录失败
        }
        return response.toString();
    }

    @RequestMapping("getUserInfo")
    @ResponseBody
    public String getUserInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {

        Response response = new Response();
        try {
            String data = httpServletRequest.getParameter("data");
            Map map = JsonUtil.json2Map(data);

            String operatorCode = String.valueOf(map.get("operatorCode"));
            UserInfoInterface userInfoInterface = SecManage.getUser(operatorCode);
            if (userInfoInterface == null) {
                response.getErrorInfo().setCode(Response.NO_FOUND_USER);
            } else {
                response.setData(userInfoInterface);
            }
        } catch (Exception e) {
            response.getErrorInfo().setCode(Response.NO_FOUND_USER);
            response.getErrorInfo().setMessage("未找到相应用户！");
        }
        return response.toString();
    }
}
