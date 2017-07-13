/**
 * @author RaoXb
 * Created on 2016/9/08 20:07
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */
(function($) {

    var kendo = window.kendo,
        ui = kendo.ui,
        proxy = $.proxy,
        Widget = ui.Widget;

    var AIComment = Widget.extend({

        init: function(element, options) {
            var that = this;
            Widget.fn.init.call(this, element, options);

            element = that.element;
            options = that.options;
            that.wrapper = $(element);

            var _cmtWidth = options.cmtWidth;
            var _cmtHeight = options.cmtHeight;
            var outNbrId = options.out_nbr_id ? options.out_nbr_id:-1;
            var _id = options.cmtTargetId +"_"+outNbrId+ "_" +new Date().getTime();

            //待提交的所有元素的ID
            that.submitDataIds = [];

            $.extend(options,{
                cmtWidth:_cmtWidth ? _cmtWidth : 500,
                cmtHeight:_cmtHeight ? _cmtHeight : 600,
                id:_id,
                out_nbr_id:outNbrId
            });

            //请求评论界面


            //点赞
            var cmt_1 = [];
            //五星
            var cmt_2 = [];
            //文字评论
            var cmt_3 = [];


            var options = {
                "param": {"MODULE_ID": "1","CMT_TARGET_ID": options.cmtTargetId},
                "busiCode": "ICFGCMTBASICFSV_GETCMTITEMINFO",
                "moduleName": "common",
                "sync": false,
                "callback": function (data, isSucc, msg) {
                    var retCode = data.errorInfo.code;
                    if (retCode === "0000") {
                        var _cmt_info = data.retInfo.data;
                        if(_cmt_info){
                            //需要处理评论界面 设置相关参数
                            if(_cmt_info["1"]){
                                //点赞
                                $.extend(cmt_1,_cmt_info[1]);
                            }
                            if(_cmt_info["2"]){
                                //五星
                                $.extend(cmt_2,_cmt_info[2]);
                            }
                            if(_cmt_info["3"]){
                                //文字评论
                                $.extend(cmt_3,_cmt_info[3]);
                            }
                        }else{
                            that._showError("没有请求的内容！");
                        }
                    }else{
                        //不需要处理评论
                        var retMsg = data.data.errorInfo.message;
                        that._showError(retMsg);
                    }
                    var htmlId = options.id?options.id:""+(new Date()).getTime();
                    var containCMT = $("<div class='cmt_home'></div>").appendTo(element);
                    var clickHtml = "<div class = 'fl cmt-pl' id = '"+htmlId+"'>评论</div>";
                    var _clickObj = $(clickHtml).appendTo(containCMT);
                    var showCmtHtml = "<div class = 'clearfix cmt-pl-box'></div>";
                    var cmtCxtObj = $(showCmtHtml).appendTo(containCMT);
                    //给评论按钮附上点击事件
                    _clickObj.on('click', {changeObj:cmtCxtObj}, proxy(that.changeCmtOpt, that));





                    var options = {
                        "param": {"outNbrId": options.out_nbr_id,"cmtTargetId": options.cmtTargetId},
                        "busiCode": "ICFGCMTINSTFSV_GETCMTITEMCOUNT",
                        "moduleName": "common",
                        "sync": false,
                        "callback": function (data, isSucc, msg) {
                            var listCount = null;
                            if(retData && retData["errorInfo"] && retData["errorInfo"].code == "0000"){
                                listCount = retData["retInfo"].data;
                            }
                            if(cmt_1 && cmt_1.length > 0){
                                //添加点赞模块
                                that._LikeCMT(cmt_1,cmtCxtObj,listCount);
                            }
                            if(cmt_3 && cmt_3.length > 0){
                                //添加评论模块
                                var itemCxtId = "";
                                var itemCxtCount = 0;
                                if(cmt_3.length>1){
                                    itemCxtId = cmt_3[1].itemId;
                                }else{
                                    itemCxtId = cmt_3[0].itemId;
                                }
                                if(listCount && listCount.hasOwnProperty(itemCxtId)){
                                    itemCxtCount = listCount[itemCxtId];
                                }
                                var cmtAction = $("<div class='icon iconfont icon-pinglun1 cmt-cxt-talk-say-img fl ml20 mt6'></div>").appendTo(cmtCxtObj);
                                cmtCxtObj.append("<span id = count_"+itemCxtId+" class ='fl mt6' style='color:white;' >"+itemCxtCount+"</span>");
                                var winObj = $("<div id = 'win_"+htmlId+"'></div>").appendTo(cmtCxtObj);
                                that._cxtCMT(cmt_3,cmt_2,winObj);
                                cmtAction.on('click', {winId:winObj.attr("id")}, proxy(that._showCmtWin, that));
                                winObj.kendoWindow({
                                    width: _cmtWidth,
                                    height: _cmtHeight,
                                    title: "评论区",
                                    actions: ["Refresh", "Maximize", "Close"],
                                    visible: false
                                });
                            }
                        }
                    }
                    comm.ajax.ajaxEntity(options);



                }
            }
            comm.ajax.ajaxEntity(options);

        },

        /**
         *
         * @param event
         */
        changeCmtOpt:function(event){
            var that = this;
            var changeObj = event.data.changeObj;
            var showType = changeObj.attr("show_type");
            if(showType === "true" || showType === true){
                changeObj.hide();
                changeObj.attr("show_type","false");
            }else{
                changeObj.show();
                changeObj.attr("show_type","true");
            }
        },
        /**
         * 展示文字评论的界面
         * @private
         */
        _showCmtWin:function(event){
            var that = this;
            var winId = event.data.winId;
            var winObj = $("#"+winId);
            winObj.data("kendoWindow").open();
        },
        /**
         * 展示异常信息界面
         * @private
         */
        _showError:function(msg){
            var _that = this;
            var _currObj = _that.wrapper;
            var errorHtml = "<div class='box-inside text-center'>"+
                "   <span style='color: red;font-weight: bold'>"+msg+"</span>"+
                "</div>";

            $(_currObj).html(errorHtml);
        },

        /**
         * 文字评论
         * @param data 待生成的界面信息--文字配置信息
         * @param rateData 待生成的界面信息--星级评论信息
         * @param eleObj 往eleObj元素追内容
         * @private
         */
        _cxtCMT : function(data,rateData,eleObj) {
            var that = this;
            var _num = that.options.id;
            eleObj.append("<div id='"+_num+"_cxt_cmt_aicommom'></div>");
            var showTitle = false;
            var titleId = "";
            var cxtId = "";
            //是否可文字评论
            var cmtAbled = false;
            var cmtedItemId = "";
            //是否可点赞评论
            var optAbled = false;
            var optedItemId = "";
            var nullAble = "";
            var titleLength = ""
            var cxtLength = "";
            //星级评论
            var rateAble = false;
            for(var i = 0; i<data.length; i++){
                //子评论
                var subCmtUnit = data[i].children;
                //若有子评论则选处理好子评论
                if(subCmtUnit && subCmtUnit.length > 0){
                    for(var j = 0; j<subCmtUnit.length; j++){
                        var groupId = subCmtUnit[j].groupId;
                        if(groupId == "1"){
                            //表示是点赞
                            optAbled = true;
                            optedItemId = subCmtUnit[j].itemId;
                        }else if(groupId == "3"){
                            //表示为文字
                            cmtAbled = true;
                            cmtedItemId = subCmtUnit[j].itemId;
                        }
                    }

                }
            }
            if(rateData){
                rateAble = true;
            }
            //若单元的个数大于2则表示需要有标题
            if(data.length > 1){
                titleLength = data[0].itemValueLenth;
                cxtLength = data[1].itemValueLenth;
                titleId = data[0].itemId;
                cxtId = data[1].itemId;
                showTitle = true;
                if(data[1].nullAble == "0"){
                    nullAble = true;
                }else{
                    nullAble = false;
                }

            }else if(data.length == 1) {
                cxtLength = data[0].itemValueLenth;
                cxtId = data[0].itemId;
                showTitle = false;
                if (data[0].nullAble == "0") {
                    nullAble = true;
                } else {
                    nullAble = false;
                }
            }
            $("#"+_num+"_cxt_cmt_aicommom").kendoAICxtCMT({
                showTitle : showTitle,
                titleId : titleId,
                cxtId : cxtId,
                cmtTargetId : that.options.cmtTargetId,
                out_nbr_id : that.options.out_nbr_id,
                submitData : true,
                nullAble : nullAble,
                cmtAbled : cmtAbled,
                cmtedItemId : cmtedItemId,
                optAbled : optAbled,
                optedItemId : optedItemId,
                titleLength: titleLength,
                cxtLength : cxtLength,
                rateAble : rateAble,
                rateData : rateData,
                cmtSrvId : 'ICFGCMTBASICFSV_SAVECMTCXTINST',
                cmtQueSrvId : 'ICFGCMTINSTFSV_QUERYCMTCXTINST4CXT',
                cmtSubQueSrvId : 'ICFGCMTINSTSUBFSV_QUERYCMTCXTINSTSUB',
                cmtSubSaveSrvId : 'ICFGCMTINSTSUBFSV_SAVECMTCXTINSTSUB'
            });
        },
        /**
         * 五星评论
         * @param data 待生成的界面信息
         * @param eleObj 往eleObj元素追内容
         * @private
         */
        _rateFiveStarCMT:function(data,eleObj){
            var that = this;
            var rateCmtO = $("<div id='"+that.options.id+"_rateCmt'></div>").appendTo(eleObj);
            var basicId = rateCmtO.attr("id");
            var showFlag = true;
            var submitArr = [];
            for(var i = 0; data && i < data.length; i++){
                var _titles = data[i].ext3?data[i].ext3:"";
                var _itemVall = data[i].ext1?data[i].ext1:5;
                var itemName = data[i].itemName;
                var itemId = data[i].itemId;
                var itemSize = data[i].itemValueLenth;
                var nullable = data[i].nullAble==="0"?false:true;
                var titleHtml = "";
                var _title = _titles.split("@@");
                if(!_title || _title.length!=Number(itemSize)){
                    showFlag = false;
                    break;
                }
                for(var j = 0; j < Number(itemSize); j++){
                    //js处计算有可能出现结果异常
                    var vall = _itemVall/itemSize*(1+j);
                    titleHtml += "<input type='radio' name='"+basicId+"_"+i+"' value='"+vall+"' title='"+_title[j]+"' />";
                }
                var rateCxtHtml = "<div class='clearfix'>"+
                    "    <span class='fl'>"+itemName+"：</span>"+
                    "    <span  class='fl' id='"+basicId+"_"+itemId+"'>"+
                    titleHtml +
                    "    </span>"+
                    "    <span class='fl submitItem' nullable='"+nullable+"' id='"+basicId+"_"+itemId+"_VALUE'>0</span>"+
                    "    <span class='fl'>分</span>"+
                    "    <span class='fl' id='"+basicId+"_"+itemId+"_title' style='display:none; color: red'></span>"+
                    "</div>";
                //存放待提交的数据ID
                submitArr.push(basicId+"_"+itemId);
                rateCmtO.append(rateCxtHtml);
            }
            if(!showFlag){
                that._showError("评论内容异常，请联系管理员！");
            }else{
                //初始化五星评论的控件
                for(var k = 0; submitArr && k < submitArr.length; k++){
                    $(that.element).find("#"+submitArr[k]).kendoAIRateCMT({
                        starWidth: 16,
                        split: 1,
                        defaultSelected: -1,
                        selected: -1,
                        showTitles: true
                    });
                    //将要取值的元素ID放在数组中
                    that.submitDataIds.push(submitArr[k]+"_VALUE");
                }
            }
        },

        /**
         * 点赞评论模式
         * @param data 点赞相关配置信息
         * @param eleObj 目标元素
         * @param countObj 评论数量
         * @private
         */
        _LikeCMT:function(data,eleObj,countObj){
            var that = this;
            var _num = that.options.id;
            eleObj.append("<div id='"+_num+"_like_cmt_aicommom'></div>");
            //评论类型编号
            var likeAttrItmes = [];
            //未选中的时候的样式
            var gredClazz = {};
            //已选中时的样式
            var redClazz = {};
            //点赞评论类型
            var itemType = {};
            //已经有几个人点赞过
            var count = {};
            var selectItemId = -1;
            for(var i = 0; i<data.length; i++){
                var itemId = data[i].itemId+"";
                var clazz = data[i].ext3;
                var clazzArr = [];
                if(clazz){
                    clazzArr = clazz.split("@@");
                }
                likeAttrItmes.push(itemId);
                if(clazzArr && clazzArr.length>0){
                    itemType[itemId] = clazzArr[0];
                }
                if(clazzArr && clazzArr.length>1){
                    gredClazz[itemId] = clazzArr[1];
                }
                if(clazzArr && clazzArr.length>2){
                    redClazz[itemId] = clazzArr[2];
                }
                if(countObj && countObj.hasOwnProperty(itemId)){
                    count[itemId] = countObj[itemId];
                }
                var checkData = {};
                checkData["itemId"] = itemId;
                checkData["cmtTargetId"] = that.options.cmtTargetId;
                checkData["out_nbr_id"] = that.options.out_nbr_id;

                var options = {
                    "param": checkData,
                    "busiCode": "ICFGCMTINSTFSV_CHECKOPERATORHASCMT",
                    "moduleName": "common",
                    "sync": false,
                    "callback": function (data, isSucc, msg) {
                        if(retData && retData["errorInfo"] && retData["errorInfo"].code == "0000"){
                            if(retData["retInfo"] && (retData["retInfo"].data==true||retData["retInfo"].data=='true')){
                                selectItemId = itemId;
                            }
                        }
                    }
                }
                comm.ajax.ajaxEntity(options);

            }
            $("#"+_num+"_like_cmt_aicommom").kendoAILikeCMT({
                id:_num,
                cmtTargetId : that.options.cmtTargetId,
                out_nbr_id:that.options.out_nbr_id,
                itemCount: data.length,
                itemId:likeAttrItmes,
                clazz: gredClazz,
                selectClazz:redClazz,
                itemType:itemType,
                selectCount:count,
                selected: selectItemId,
                submitData:true,
                subCMT :false ,
                submitUrl:'ICFGCMTBASICFSV_SAVECMTCXTINST'
            });
        },
        options: {
            name: "AIComment",
        }

    });
    ui.plugin(AIComment);

})(jQuery);
$.fn.comment = function () {
    var that = this;
    var target = that[0];
    if ($(target).is("div") == false) {
        return;
    }
    if ($.data(target, 'aicomment')) {
        return $(target).data("kendoAIComment");
    }
    return $.fn.comment.create(target);
};

$.fn.comment.create = function (target) {
    var options = $.fn.comment.parseOptions(target, {
        cmtWidth: 500,
        cmtHeight: 500,
        out_nbr_id : -1
    }, {
        cmtTargetId: "string"
    });

    $(target).kendoAIComment({
        cmtTargetId: options.cmtTargetId,
        cmtWidth: options.cmtWidth,
        cmtHeight: options.cmtHeight,
        out_nbr_id : options.out_nbr_id
    });

    var id = $(target).attr("id") ? $(target).attr("id") : cmtTargetId+"_"+new Date().getTime();
    $.data(target, 'aicomment', id);

    return $(target).data("kendoAIComment");
};

$.fn.comment.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};
