/**
 * 文字评论模式
 *
 * $("#cxt_cmt_test").kendoAICxtCMT({
 *      showTitle:true,
 *      titleId:100005,
 *      cxtId:100006,
 *      cmtTargetId:'SCB00001',
 *      cmtAbled:true,
 *      cmtSrvId:'ICFGCMTBASICFSV_SAVECMTCXTINST',
 *      cmtQueSrvId:'ICFGCMTINSTFSV_QUERYCMTCXTINST4CXT',
 *      cmtSubQueSrvId:'ICFGCMTINSTSUBFSV_QUERYCMTCXTINSTSUB',
 *      cmtSubSaveSrvId:'ICFGCMTINSTSUBFSV_SAVECMTCXTINSTSUB',
 *  });
 */
(function($) {

    var kendo = window.kendo,
        ui = kendo.ui,
        proxy = $.proxy,
        Widget = ui.Widget;

    var AICxtCMT = Widget.extend({

        init: function(element, options) {
            var that = this;
            Widget.fn.init.call(this, element, options);

            element = that.element;
            options = that.options;
            this.container = $(element);

            that.submitDataIds = [];

            //默认不显示标题
            options.showTitle = options.showTitle !== "" && options.showTitle !== undefined ? options.showTitle : false;
            //默认可以评论
            options.cmtAbled = options.cmtAbled !== "" && options.cmtAbled !== undefined ? options.cmtAbled : true;
            //可评论的类型编号
            options.cmtedItemId = options.cmtedItemId ? options.cmtedItemId : "100010";
            //评论点赞
            options.optAbled = options.optAbled !== "" && options.optAbled !== undefined ? options.optAbled : true;
            //点赞关联的类型编号
            options.optedItemId = options.optedItemId ? options.optedItemId : "100009";
            //默认的宽度
            options.width = options.width ? options.width :500;
            //是否能单独提交 默认可以单独提交
            options.submitData = options.submitData !== "" && options.submitData !== undefined ? options.submitData :true;
            //内容是否可空 默认不为空
            options.nullAble = options.nullAble !=="" && options.nullAble !== undefined ? options.nullAble :true;
            //填写标题的长度 默认200长度
            options.titleLength = options.titleLength ? options.titleLength :200;
            //填写内容的长度 默认2000长度
            options.cxtLength = options.cxtLength ? options.cxtLength :2000;
            //标题主键
            options.titleId = options.titleId ? options.titleId+"_"+new Date().getTime() : "titleId_"+new Date().getTime();
            //内容主键
            options.cxtId = options.cxtId ? options.cxtId+"_"+new Date().getTime() : "cxt_"+new Date().getTime();
            //查询历史评论数据url
            options.querySrvId = options.querySrvId ? options.querySrvId :"";
            //提交评论数据url
            options.cmtSrvId = options.cmtSrvId ? options.cmtSrvId :"";
            options.cmtSubQueSrvId = options.cmtSubQueSrvId ? options.cmtSubQueSrvId : "";
            options.cmtSubSaveSrvId = options.cmtSubSaveSrvId ? options.cmtSubSaveSrvId : "";
            //是否可星级评论
            options.rateAbled = options.optAbled !== "" && options.optAbled !== undefined ? options.optAbled : false;
            options.out_nbr_id = options.out_nbr_id ? options.out_nbr_id : -1;

            //第几页
            var initPage = 1;
            //一页的大小
            var pageSize = 5;

            $.extend(this.options,options);

            //生成评论区页面
            var wrapDiv = $("<div class='cmt-cxt-wrap'></div>").appendTo($(element));
            var divObj = $("<div class='cmt-cxt-box'></div>").appendTo(wrapDiv);
            //若需要显示标题
            var cmtDetail = "<div class='cmt-cxt-comment'><h1>请评论</h1></div>";
            divObj.append(cmtDetail);
            //若需要有星级评论
            if(options.rateAbled === true){
                that._rateFiveStarCMT(options.rateData,divObj);
            }
            if(options.showTitle === true || options.showTitle === "true"){
                var titleDivHtml = "<div id = '"+options.titleId+"' class='cmt-cxt-boxside'><div class='cmt-cxt-comment-con'>" +
                    "<input type='text' id = '"+options.titleId+"_value' nullAble = 'true' valLength='"+options.titleLength+"'"+
                    "class='k-textbox cmt-cxt-inside-con'/></div></div>";
                divObj.append(titleDivHtml);
            }

            //显示内容信息
            var cxtDivHtml = "<div class='cmt-cxt-boxside'><div class='cmt-cxt-comment-con'>" +
                "<textarea id='"+options.cxtId+"_value' nullAble = "+options.nullAble+
                " valLength='"+options.cxtLength+"' class='k-textbox cmt-cxt-inside-con' " +
                "placeholder='请输入自己想说的话~' style='height:90px;'></textarea></div></div>";

            divObj.append(cxtDivHtml);

            //提交按钮
            var submitButton = $("<div class='cmt-cxt-report'><button class='icon iconfont icon-fasong k-button cmt-cxt-report-button'>发表</button></div>").appendTo(divObj);
            //添加提交事件
            submitButton.find("button").on('click', proxy(that._submit, that));
            //历史评论区
            var historyList = $("<div id = '"+options.cxtId+"'_historyList' page = '"+initPage+"' pageSize = '"+pageSize+"' url = '"+options.querySrvId+"'></div>").appendTo(divObj);

            that._queryHistoryRecord(historyList);

        },

        /**
         *显示星级评论的内容
         * @param data
         * @param eleObj
         * @param valData 默认值
         * @private
         */
        _rateFiveStarCMT:function(data,eleObj,valData){
            var that = this;
            var rateCmtO = $("<div id='"+that.options.cxtId+(new Date()).getTime()+"_rateCmt'></div>").appendTo(eleObj);
            if(!valData){
                rateCmtO.addClass("cmt-cxt-boxside");
            }
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
                    var vall = _itemVall/itemSize*(j+1);
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
                    var tempIte = submitArr[k].split("_");
                    var valItemId = tempIte[tempIte.length-1];
                    var defaultSelect = -1;
                    if(valData && valData[valItemId]){
                        defaultSelect = valData[valItemId]%_itemVall;
                        if(valData[valItemId]!=0 && defaultSelect === 0){
                            //若是最大值的时候则需要重新设置下
                            defaultSelect = Number(itemSize);
                        }
                        defaultSelect = defaultSelect - 1;
                    }
                    $(that.element).find("#"+submitArr[k]).kendoAIRateCMT({
                        starWidth: 16,
                        split: 1,
                        defaultSelected: defaultSelect,
                        selected: valData && valData[valItemId] ? valData[valItemId]:-1,
                        showTitles: true,
                        disabled:valData ? true : false
                    });
                    //将要取值的元素ID放在数组中
                    var _itemObj = {};
                    _itemObj.valueId = submitArr[k]+"_VALUE";
                    _itemObj.itemId = tempIte[tempIte.length-1];
                    if(!valData){
                        that.submitDataIds.push(_itemObj);
                    }

                }
            }
        },

        /**
         * 发表评论提交操作
         * @private
         */
        _submit:function(){
            //options.cmtSrvId
            var that = this;
            var submitData = {};
            var submitArr = [];
            var paramData = {};
            var cmtTargetId = that.options.cmtTargetId;
            var itemTitleVal = "";
            if(that.options.showTitle === true || that.options.showTitle === "true"){
                var titleData = {};
                var itemTitleId = that.options.titleId;
                var titleNullAble = $("#"+itemTitleId+"_value").attr("nullAble");
                var titleLength = $("#"+itemTitleId+"_value").attr("valLength");
                itemTitleVal = $("#"+itemTitleId+"_value").val();
                if(titleNullAble==='true' || titleNullAble===true){
                    //若不为空，则需要判断是否为空
                    if(!itemTitleVal || itemTitleVal.length < 1){
                        kendo.ui.notification('提示', '标题不能为空！', "error", function(){
                            $("#"+itemTitleId+"_value").focus();
                        });
                        return;
                    }
                }
                if(titleLength && Number(titleLength)>0){
                    if(itemTitleVal.length > Number(titleLength)){
                        kendo.ui.notification('提示', '标题字数过多，字数不能大于'+titleLength, "error", function(){
                            $("#"+itemTitleId+"_value").focus();
                        });
                        return;
                    }
                }
                titleData.groupId = 3;
                titleData.itemId = itemTitleId.split("_")[0];
                titleData.value = itemTitleVal;
                titleData.operType = "add";
                submitArr.push(titleData);
            }
            var itemVal = $("#"+that.options.cxtId+"_value").val();
            var nullAble = $("#"+that.options.cxtId+"_value").attr("nullAble");
            var length = $("#"+that.options.cxtId+"_value").attr("valLength");
            if(nullAble==="true" || nullAble===true){
                //若不为空，则需要判断是否为空
                if(!itemVal || itemVal.length < 1){
                    kendo.ui.notification('提示', '发表内容不能为空！', "error", function(){
                        $("#"+that.options.cxtId+"_value").focus();
                    });
                    return;
                }

            }
            if(itemVal && length && Number(length)>0){
                if(itemVal.length > Number(length)){
                    kendo.ui.notification('提示', '所填内容字数过多，字数不能大于'+length, "error", function(){
                        $("#"+that.options.cxtId+"_value").focus();
                    });
                    return;
                }
            }

            submitData.groupId = 3;
            submitData.itemId = that.options.cxtId.split("_")[0];
            submitData.value = itemVal;
            submitData.operType = "add";
            submitArr.push(submitData);

            if(that.options.rateAbled === true){
                for(var r=0; that.submitDataIds && r < that.submitDataIds.length; r++){
                    var _idObj = that.submitDataIds[r];
                    var _rateVal = $("#"+_idObj.valueId).text();
                    var _rateNullAble = $("#"+_idObj.valueId).attr("nullable");
                    var _rateLength = $("#"+_idObj.valueId).attr("length");
                    if(_rateNullAble === "true" || _rateNullAble === true ){
                        if(!_rateVal){
                            kendo.ui.notification('提示', '评论值不能为空！', "error");
                            $("#"+_idObj.valueId).focus();
                            return;
                        }
                    }
                    if(_rateVal && _rateLength){
                        if(_rateVal.length>Number(_rateLength)){
                            kendo.ui.notification('提示', '评论值过长！', "error");
                            $("#"+_idObj.valueId).focus();
                            return;
                        }
                    }
                    var gourpId2Data = {};
                    gourpId2Data.groupId = 2;
                    gourpId2Data.itemId = _idObj.itemId;
                    gourpId2Data.value = _rateVal;
                    gourpId2Data.operType = "add";
                    submitArr.push(gourpId2Data);
                }
            }

            paramData.moduleId = "1";
            paramData.CMT_INFO = submitArr;
            paramData.cmtTargetId = cmtTargetId;
            paramData.out_nbr_id = this.options.out_nbr_id;
            if(this.options.submitData === true || this.options.submitData === "true"){
                //若需要提交，则
                var options = {
                    "param": paramData,
                    "busiCode": "ICFGCMTBASICFSV_SAVECMTCXTINST",
                    "moduleName": "common",
                    "sync": false,
                    "callback": function (data, isSucc, msg) {
                        if(data.errorInfo.code !== "0000"){
                            var msg = data.errorInfo.message;
                            kendo.ui.notification('提示', msg, "error");
                        }else{
                            kendo.ui.notification('提示','提交成功',"success",function(){
                                //先清除输入的内容
                                if(that.options.showTitle === true || that.options.showTitle === "true"){
                                    $("#"+that.options.titleId+"_value").val("");
                                }
                                $("#"+that.options.cxtId+"_value").val("");
                                //提交成功后重新加载评论
                            });
                        }
                    }
                }
                comm.ajax.ajaxEntity(options);
            }

        },

        /**
         * 查询历史评论列表
         * @private
         */
        _queryHistoryRecord:function(appendObj){
            var that = this;
            var cmtedItemId = that.options.cmtedItemId;
            var optedItemId = that.options.optedItemId;
            var page = appendObj.attr("page");
            var pageSize = appendObj.attr("pageSize");
            var queryData = {};
            queryData.page = page;
            queryData.pageSize = pageSize;
            var itemValM = {};
            var itemIds = [];
            var rateItemId = "";
            if(that.options.showTitle === true||that.options.showTitle === "true"){
                itemIds.push(that.options.titleId.split("_")[0]);
                itemValM[that.options.titleId.split("_")[0]] = that.options.titleId;
            }
            itemIds.push(that.options.cxtId.split("_")[0]);
            //若是有星级评论，则查询的时候需要把星级的评论编号加上
            if(that.options.rateAbled === true || that.options.rateAbled === "true" ){
                for(var _i = 0; that.options.rateData && _i<that.options.rateData.length; _i++){
                    var _item_id = that.options.rateData[_i].itemId;
                    itemIds.push(_item_id);
                    rateItemId += _item_id+",";
                }
            }
            itemValM[that.options.cxtId.split("_")[0]] = that.options.cxtId;
            queryData.itemIds = itemIds.join("_");
            queryData.cmtTargetId = that.options.cmtTargetId;
            queryData.out_nbr_id = that.options.out_nbr_id;

            var options = {
                "param": queryData,
                "busiCode": that.options.cmtQueSrvId,
                "moduleName": "common",
                "sync": false,
                "callback": function (data, isSucc, msg) {
                    if(data.errorInfo.code !== "0000"){
                        var showMoreDetail = $("<div class='cmt-cxt-more'><span>没有更多，请重新尝试~</span></div>").appendTo(appendObj);
                        showMoreDetail.on('click', {obj:appendObj,removeObj:showMoreDetail}, proxy(that._appendQueryHistoryList, that));
                    }else{
                        var historyList = data.retInfo.data;
                        if(historyList && historyList.length>0){
                            for(var i = 0; i<historyList.length; i++){
                                var itemUnit = historyList[i];
                                var id = itemUnit.id+"_"+new Date().getTime();
                                var selectCountObj={};
                                var checkObj = appendObj.find("div[id='"+itemUnit.id+"_replay']");
                                if(checkObj && checkObj.length>0){
                                    continue;
                                }
                                var replyDiv = $("<div id='"+itemUnit.id+"_replay' class='cmt-cxt-reply'></div>").appendTo(appendObj);
                                var replyConDiv = $("<div class='cmt-cxt-reply-con'></div>").appendTo(replyDiv);
                                var cxtCommentDiv = $("<div class='cmt-cxt-comment'></div>").appendTo(replyConDiv);
                                var creatorNameHtml = "<h1>"+itemUnit.creatorName+"</h1><p>"+itemUnit.createDate+"</p>";
                                cxtCommentDiv.append(creatorNameHtml);
                                var cxtCmtDiv = $("<div class='cmt-cxt-talk'></div>").appendTo(cxtCommentDiv);
                                //可评论
                                if(that.options.cmtAbled === true || that.options.cmtAbled === "true"){
                                    var options = {
                                        "param": {"cmtInstId":itemUnit.id,"subCmtTargetId":"SUBCMT_"+that.options.cmtTargetId},
                                        "busiCode": "ICFGCMTINSTSUBFSV_GETCMTSUBITEMCOUNT",
                                        "moduleName": "common",
                                        "sync": false,
                                        "callback": function (data, isSucc, msg) {
                                            var itemCxtCount = 0;
                                            if(countData && countData["errorInfo"].code=='0000') {
                                                var countObj = countData["retInfo"].data;
                                                if(countObj.hasOwnProperty(cmtedItemId)){
                                                    itemCxtCount = countObj[cmtedItemId];
                                                }
                                                if(countObj.hasOwnProperty(optedItemId)){
                                                    selectCountObj[optedItemId] = countObj[optedItemId];
                                                }
                                            }
                                            var cxtCmtedDiv = $("<div class='icon iconfont icon-pinglun cmt-cxt-talk-say-img fl mt4'></div>").appendTo(cxtCmtDiv);
                                            if(itemCxtCount>0){
                                                cxtCmtDiv.append("<span id = count_"+itemUnit.id+" class ='fl mt4'>"+itemCxtCount+"</span>");
                                            }
                                            cxtCmtedDiv.on('click', {cmtInstId:itemUnit.id,relatItemId:cmtedItemId,createId:itemUnit.creator,createName:itemUnit.creatorName,parentSubInstId:'-1'}, proxy(that._showEditCMTDiv, that));
                                        }
                                    }
                                    comm.ajax.ajaxEntity(options);
                                }
                                //可点赞
                                if(that.options.optAbled === true || that.options.optAbled === "true"){
                                    var optCmtedDiv = $("<div id='"+id+"'></div>").appendTo(cxtCmtDiv);
                                    var clazzObj = {};
                                    clazzObj[optedItemId] = 'cmt-like-span grayLike ml5 fl mt4';
                                    var selectClazzObj = {};
                                    selectClazzObj[optedItemId] = 'cmt-like-span redLike ml5 fl mt4';
                                    var itemType = {};
                                    itemType[optedItemId] = 'like';
                                    var subCMTData = {};
                                    subCMTData.cmtInstId = itemUnit.id;
                                    subCMTData.createId = itemUnit.creator;
                                    subCMTData.createName = itemUnit.creatorName;
                                    subCMTData.parentSubInstId = "-1";

                                    var checkData = {};
                                    checkData["CMT_INST_ID"] = itemUnit.id;
                                    checkData["ITEM_ID"] = optedItemId;
                                    checkData["CMT_TARGET_ID"] = "SUBCMT_"+that.options.cmtTargetId;
                                    checkData["PAREENT_CMT_INST_ID"] = '-1';
                                    var options = {
                                        "param": checkData,
                                        "busiCode": "ICFGCMTINSTSUBFSV_CHECKOPERATORHASSUBCMT",
                                        "moduleName": "common",
                                        "sync": false,
                                        "callback": function (data, isSucc, msg) {
                                            var selectItemId = -1;
                                            if(retData && retData.errorInfo && retData.errorInfo.code == "0000"){
                                                if(retData.retInfo && (retData.retInfo.data==true||retData.retInfo.data=='true')){
                                                    selectItemId = optedItemId;
                                                }
                                            }
                                            optCmtedDiv.kendoAILikeCMT({
                                                id:id,
                                                itemCount: 1,
                                                itemId:[optedItemId],
                                                clazz: clazzObj,
                                                selectClazz:selectClazzObj,
                                                selectCount:selectCountObj,
                                                selected:selectItemId,
                                                itemType:itemType,
                                                submitData:true,
                                                subCMT:true,
                                                subCMTData:subCMTData,
                                                cmtTargetId : "SUBCMT_"+that.options.cmtTargetId,
                                                submitUrl:that.options.cmtSubSaveSrvId
                                            });
                                        }
                                    }
                                    comm.ajax.ajaxEntity(options);
                                }
                                //星级评论的历史评论内容
                                if(that.options.rateAbled === true || that.options.rateAbled === 'true' ){
                                    var valData = {};
                                    for(var _i = 0; that.options.rateData && _i<that.options.rateData.length; _i++){
                                        var _item_id = that.options.rateData[_i].itemId;
                                        valData[_item_id] = itemUnit[_item_id];
                                    }
                                    that._rateFiveStarCMT(that.options.rateData,cxtCommentDiv,valData);
                                }
                                for(var v=0; v<itemIds.length; v++){
                                    var appendVal = itemIds[v];
                                    if(rateItemId.indexOf(appendVal) > -1){
                                        continue;
                                    }
                                    if(itemUnit[appendVal]){
                                        var appendValHtml = "<p>"+itemUnit[appendVal]+"</p>";
                                        cxtCommentDiv.append(appendValHtml);
                                    }
                                }
                                //是否可评论
                                if(that.options.cmtAbled === true || that.options.cmtAbled === "true"){
                                    var subCmtDiv = $("<div id = '"+itemUnit.id+"_subCmtDiv' pageNo='"+page+"' pageSize='"+pageSize+"' class='cmt-cxt-reply-other'></div>").appendTo(cxtCommentDiv);
                                    var subShowMore = $("<div id='"+itemUnit.id+"_showMore' class='cmt-cxt-more'><span>查看详情...</span></div>").appendTo(subCmtDiv);
                                    subShowMore.on('click', {obj:subCmtDiv,removeObj:subShowMore,commitData:{cmtInstId:itemUnit.id,relatItemId:cmtedItemId}}, proxy(that._appendQuerySubHistoryList, that));
                                }

                            }
                            //若有pageSize条记录
                            if(historyList && historyList.length === Number(pageSize)){
                                //把pageNo和pageSize更新下
                                page++;
                                appendObj.attr("page",page);
                                //显示加载更多的按钮
                                var showMoreDetail = $("<div class='cmt-cxt-more'><span>加载更多...</span></div>").appendTo(appendObj);
                                showMoreDetail.on('click', {obj:appendObj,removeObj:showMoreDetail}, proxy(that._appendQueryHistoryList, that));
                            }else{
                                var showMoreDetail = $("<div class='cmt-cxt-more'><span>没有更多，请重新尝试~</span></div>").appendTo(appendObj);
                                showMoreDetail.on('click', {obj:appendObj,removeObj:showMoreDetail}, proxy(that._appendQueryHistoryList, that));
                            }
                        }else{
                            var showMoreDetail = $("<div class='cmt-cxt-more'><span>没有更多，请重新尝试~</span></div>").appendTo(appendObj);
                            showMoreDetail.on('click', {obj:appendObj,removeObj:showMoreDetail}, proxy(that._appendQueryHistoryList, that));
                        }
                    }
                }
            }
            comm.ajax.ajaxEntity(options);
        },

        /**
         * 查询子评论的记录
         * @param event
         * @private
         */
        _appendQuerySubHistoryList:function(event){
            var that = this;
            //添加的数据
            var subCmtDiv = event.data.obj;
            //需要remove调的加载更多项
            var removeObj = event.data.removeObj;
            var commitData = event.data.commitData;
            //关联的评论类型编号
            var relatItemId = commitData.relatItemId;
            //关联的评论实例编号
            var cmtInstId = commitData.cmtInstId;
            var pageNo = subCmtDiv.attr("pageNo");
            var pageSize = subCmtDiv.attr("pageSize");
            var queryData = {};
            queryData.relatItemId = relatItemId;
            queryData.cmtInstId = cmtInstId;
            queryData.pageNo = pageNo;
            queryData.pageSize = pageSize;
            queryData.cmtTargetId = "SUBCMT_"+that.options.cmtTargetId;

            var options = {
                "param": queryData,
                "busiCode": that.options.cmtSubQueSrvId,
                "moduleName": "common",
                "sync": false,
                "callback": function (data, isSucc, msg) {
                    if(data.errorInfo.code !== "0000"){
                        removeObj.remove();
                        var showMoreDetail = $("<div class='cmt-cxt-more'><span>没有更多，请重新尝试~</span></div>").appendTo(subCmtDiv);
                        showMoreDetail.on('click', {obj:subCmtDiv,removeObj:showMoreDetail,commitData:{cmtInstId:cmtInstId,relatItemId:relatItemId}}, proxy(that._appendQuerySubHistoryList, that));
                    }else{
                        var historyList = data.retInfo.data;
                        if(historyList && historyList.length>0){
                            for(var i = 0; i<historyList.length; i++){
                                var _creator = historyList[i].creator;
                                var _createName = historyList[i].createName;
                                var _cmtName = historyList[i].cmtName;
                                var _cmtor = historyList[i].cmtor;
                                var _itemVal = historyList[i].itemVal;
                                var _itemId = historyList[i].itemId;
                                var _cmtInstId = historyList[i].cmtInstId;
                                var _parentSubInstId = historyList[i].subInstId;
                                var checkResult = subCmtDiv.find("span[id='"+_parentSubInstId+"']");
                                if(checkResult && checkResult.length>0){
                                    continue;
                                }
                                var divItem = $("<div></div>").appendTo(subCmtDiv);
                                var replayHtml = "<p><span>"+_createName+"</span>回复<span>"+_cmtName+"</span></p>";
                                divItem.append(replayHtml);
                                var buttonDiv = $("<span id = '"+_parentSubInstId+"' class='cmt-cxt-small-reply-cxt'>"+_itemVal+"</span>").appendTo(divItem);
                                buttonDiv.on('click', {cmtInstId:_cmtInstId,relatItemId:_itemId,createId:_creator,createName:_createName,parentSubInstId:_parentSubInstId}, proxy(that._showEditCMTDiv, that));
                            }
                            if(historyList && historyList.length === Number(pageSize)){
                                //把pageNo和pageSize更新下
                                pageNo++;
                                subCmtDiv.attr("pageNo",pageNo);
                                removeObj.remove();
                                //显示加载更多的按钮
                                var showMoreDetail = $("<div class='cmt-cxt-more'><span>加载更多...</span></div>").appendTo(subCmtDiv);
                                showMoreDetail.on('click', {obj:subCmtDiv,removeObj:showMoreDetail,commitData:{cmtInstId:cmtInstId,relatItemId:relatItemId}}, proxy(that._appendQuerySubHistoryList, that));
                            }else{
                                removeObj.remove();
                                var showMoreDetail = $("<div class='cmt-cxt-more'><span>没有更多，请重新尝试~</span></div>").appendTo(subCmtDiv);
                                showMoreDetail.on('click', {obj:subCmtDiv,removeObj:showMoreDetail,commitData:{cmtInstId:cmtInstId,relatItemId:relatItemId}}, proxy(that._appendQuerySubHistoryList, that));
                            }

                        }else{
                            removeObj.remove();
                            var showMoreDetail = $("<div class='cmt-cxt-more'><span>没有更多，请重新尝试~</span></div>").appendTo(subCmtDiv);
                            showMoreDetail.on('click', {obj:subCmtDiv,removeObj:showMoreDetail,commitData:{cmtInstId:cmtInstId,relatItemId:relatItemId}}, proxy(that._appendQuerySubHistoryList, that));
                        }
                    }
                }
            }
            comm.ajax.ajaxEntity(options);
        },

        /**
         * 加载更多或者没有更多的重新查询方法
         * @param event {data:<map>}  map <obj:appendObj>
         * @private
         */
        _appendQueryHistoryList:function(event){
            var that = this;
            var appendObjEd = event.data.obj;
            var removedObj = event.data.removeObj;
            //先把加载更多去掉
            removedObj.remove();
            that._queryHistoryRecord(appendObjEd);
        },

        /**
         * 子评论界面展示
         * @param event
         *          <cmtInstId:'',relatItemId:''>
         * @private
         */
        _showEditCMTDiv:function(event){
            var that = this;
            //关联的评论实例记录
            var cmtInstId = event.data.cmtInstId;
            //关联的评论类型编号
            var relatItemId = event.data.relatItemId;
            //创建者编号
            var createId = event.data.createId;
            //创建者名字
            var createName = event.data.createName;
            var parentSubInstId = event.data.parentSubInstId;
            var elementObj = that.element;
            var commitData = {};
            commitData.cmtInstId = cmtInstId;
            commitData.relatItemId = relatItemId;
            commitData.createId = createId;
            commitData.createName = createName;
            commitData.cmtTargetId = "SUBCMT_"+that.options.cmtTargetId;
            commitData.parentSubInstId = parentSubInstId;

            //判断该界面是否已经展示
            var replyShow = $(elementObj).find(".cmt-cxt-alert-reply").first();
            if(replyShow && replyShow.length>0){
                var checkId = replyShow.attr("id");
                if(checkId === cmtInstId){
                    replyShow[0].remove();
                    return;
                }else{
                    replyShow.attr("id",cmtInstId+"");
                    $("#"+checkId+"_value").attr("id",cmtInstId+"_value");
                }
            }else{
                var alertReplyDiv = $("<div id ='"+cmtInstId+"' class='cmt-cxt-alert-reply'></div>").appendTo($(elementObj));
                var formObj = $("<form></form>").appendTo(alertReplyDiv);
                formObj.append("<textarea id= '"+cmtInstId+"_VALUE' nullAble = false valLength='2000' class='k-textbox' placeholder='请输入自己想说的话~' style='height:90px;'></textarea>");
                var comitButton = $("<button type='button' class='icon iconfont icon-fasong k-button cmt-cxt-small-reply'>发表</button>").appendTo(formObj);
                comitButton.on('click', {commitData:commitData}, proxy(that._commitSubCmt, that));
            }
        },

        /**
         * 发表子评论
         * @param event
         * @private
         */
        _commitSubCmt: function(event){
            var that = this;
            //所有提交的信息
            var commitData = event.data.commitData;

            var cmtInstId = commitData.cmtInstId;
            var relatItemId = commitData.relatItemId;
            var createId = commitData.createId;
            var createName = commitData.createName;
            var cmtTargetId = commitData.cmtTargetId;
            var parentSubInstId = commitData.parentSubInstId;
            var commitArr = [];
            var commitItem = {};
            commitItem.cmtInstId = cmtInstId;
            commitItem.relatItemId = relatItemId;
            commitItem.createId = createId;
            commitItem.createName = createName;
            commitItem.parentSubInstId = parentSubInstId;
            var itemVal = $("#"+cmtInstId+"_VALUE").val();
            var valLength = $("#"+cmtInstId+"_VALUE").attr("valLength");
            if(!itemVal){
                kendo.ui.notification('提示', '发表内容不能为空！', "warning", function(){
                    $("#"+cmtInstId+"_VALUE").focus();
                });
                return;
            }
            if(itemVal.length>Number(valLength)){
                kendo.ui.notification('提示', '标题字数过多，字数不能大于'+valLength, "warning", function(){
                    $("#"+cmtInstId+"_VALUE").focus();
                });
                return;
            }
            commitItem.itemVal = itemVal+"";
            commitArr.push(commitItem);
            //1、PC
            commitData.moduleId = "1";
            commitData.cmtTargetId = cmtTargetId;
            commitData.CMT_INFO = commitArr;
            var options = {
                "param": commitData,
                "busiCode": this.options.cmtSubSaveSrvId,
                "moduleName": "common",
                "sync": false,
                "callback": function (data, isSucc, msg) {
                    if(data.errorInfo.code !== "0000"){
                        var msg = data.errorInfo.message;
                        kendo.ui.notification('提示', msg, "error", function(){
                            $("#"+cmtInstId+"_VALUE").focus();
                        });
                    }else{
                        kendo.ui.notification('提示', '保存成功！', "success", function(){
                            var replyShow = $(that.element).find(".cmt-cxt-alert-reply").first();
                            replyShow.remove();
                            var __countObj = $(that.element).find("#count_"+cmtInstId).first()
                            var tempCount = __countObj.text();
                            __countObj.text(Number(tempCount)+1);

                        });
                    }
                }
            }
            comm.ajax.ajaxEntity(options);

        },

        options: {
            name: "AICxtCMT",
        }
    });

    ui.plugin(AICxtCMT);

})(jQuery);