/**
 * 点赞评论模式
 *  <div id="like_cmt_test"></div>
 *  $("#like_cmt_test").kendoAILikeCMT({
        itemCount: 2,
        itemId:['100007','100008'],
        clazz: {'100007':'cmt-like-span grayLike fl mt_4','100008':'cmt-like-span grayUnlike fl ml20 mt4'},
        selectClazz:{'100007':'cmt-like-span redLike fl mt_4','100008':'cmt-like-span redUnlike fl ml20 mt4'},
        selectCount:{'100007':21,"100008":2},
        selected: -1,
        submitData:true,
        subCMT :false ,
 *      submitUrl:''
    });
 * options{
 *      itemCount : number,评论的数量
 *      itemId : [arr],评论项的id
 *      selectClazz:[arr],选中时样式集合：itemId:className
 *      clazz:[arr],未选中时的样式集合 : itemId:className
 *      selected : 当前选择的itemId
 *      submitData:true/false 是否做后台的提交操作,若为空则默认为提交的
 *      subCMT :true/false 是否对父评论的评论
 *      subCMTData:{cmtInstId:,createId:,createName:,parentSubInstId:} 父评论相关的字段
 *      submitUrl:提交的URL
 * }
 */
(function($) {

    var kendo = window.kendo,
        ui = kendo.ui,
        proxy = $.proxy,
        Widget = ui.Widget;

    var AILikeCMT = Widget.extend({

        init: function(element, options) {
            var that = this;
            Widget.fn.init.call(this, element, options);

            element = that.element;
            options = that.options;
            this.container = $(element);

            //默认值为2
            that.options.itemCount = that.options.itemCount ? that.options.itemCount:2;
            //默认值两个Id
            that.options.itemId = that.options.itemId ? that.options.itemId:['100007','100008'];
            that.options.itemType = that.options.itemType ? that.options.itemType:{'100007':'like','100008':'unLike'};
            that.options.selectClazz = that.options.selectClazz ? that.options.selectClazz:{'100007':'cmt-like-span grayLike fl mt_4','100008':'cmt-like-span grayUnlike fl ml20 mt4'};
            that.options.clazz = that.options.clazz ? that.options.clazz : {'100007':'cmt-like-span redLike fl mt_4','100008':'cmt-like-span redUnlike fl ml20 mt4'};
            //默认是父评论
            that.options.subCMT = that.options.subCMT !== "" && that.options.subCMT !== undefined ? that.options.subCMT : false;
            that.options.out_nbr_id = that.options.out_nbr_id ? that.options.out_nbr_id:-1;
            that.options.id = that.options.id ? that.options.id : new Date().getTime()+"";

            that.itemArr = [];

            var selectCount = that.options.selectCount;
            if(!selectCount){
                selectCount = {};
                for(var i = 0; i < that.options.itemId.length; i++){
                    selectCount[that.options.itemId[i]] = 0;
                }
                that.options.selectCount = selectCount;
            }
            //默认提交数据
            that.options.submitData = that.options.submitData !== "" && that.options.submitData !== undefined ? that.options.submitData : true;

            var selectItem = that.options.selected;
            var likeCmtObj = $("<div id='like_cmt'></div>").appendTo(element);

            var likeCmtHtml = "";
            for(var i = 0; i<that.options.itemCount; i++){
                var itemTmp = that.options.itemId[i];
                var tempId = that.options.id+"_"+itemTmp;
                that.itemArr.push(tempId);
                var temClazz = that.options.clazz[itemTmp];
                var temType = that.options.itemType[itemTmp];
                var checkFlag = false;
                if(selectItem === that.options.itemId[i]){
                    temClazz = that.options.selectClazz[itemTmp];
                    checkFlag = true;
                }
                var initCount = that.options.selectCount[itemTmp];
                initCount = !initCount || initCount == 0 ? '' : initCount;
                if(temType==="like"){
                    if(checkFlag === true){
                        likeCmtHtml += "<span id = '"+tempId+"' check = 'true' class='icon iconfont icon-dianzan redLike "+temClazz+"'></span>"+
                            "<span class='fl cmt-like-cxt mt4' id='"+tempId+"_value'>"+initCount+"</span>";
                    }else{
                        likeCmtHtml += "<span id = '"+tempId+"' class='icon iconfont icon-dianzan "+temClazz+"'></span>"+
                            "<span class='fl cmt-like-cxt mt4' id='"+tempId+"_value'>"+initCount+"</span>";
                    }
                }else if(temType==="unLike"){
                    if(checkFlag === true){
                        likeCmtHtml += "<span id = '"+tempId+"' check = 'true' class='icon iconfont icon-caibishi redLike "+temClazz+"'></span>"+
                            "<span class='fl cmt-like-cxt mt4' id='"+tempId+"_value'>"+initCount+"</span>";
                    }else{
                        likeCmtHtml += "<span id = '"+tempId+"' class='icon iconfont icon-caibishi "+temClazz+"'></span>"+
                            "<span class='fl cmt-like-cxt mt4' id='"+tempId+"_value'>"+initCount+"</span>";
                    }
                }
            }
            likeCmtObj.append(likeCmtHtml);
            that._initEvent();

        },

        /**
         * 初始化事件
         * @private
         */
        _initEvent:function(){
            var idArr = this.itemArr;
            var itemIdArr = this.options.itemId;
            for(var j = 0; idArr && j < idArr.length; j++){
                this.element.find("#"+idArr[j]).on('click', {indexId:idArr[j],itemId:itemIdArr[j]}, proxy(this.onOptIn, this));
            }
        },

        /**
         * 点击事件
         * @param event
         */
        onOptIn:function(event){
            var that = this;
            //当前操作的ID
            var indexId = event.data.indexId;
            var relatItemId = event.data.itemId;
            var tempDzId = this.itemArr;
            //所有的选中样式
            var selectClazz = this.options.selectClazz;
            //所有的未选中样式
            var clazz = this.options.clazz;
            //所有的元素Id
            var allItem = this.options.itemId;
            var selected = $("#"+indexId).attr("check");
            //待提交的数据
            var paramData = {};
            var submitArr = [];
            var submitData = {};
            //回滚操作数据集
            var rollBackData = {};
            rollBackData.curChecked = indexId;
            if(selected==="true" || selected===true){
                //选中则做取消选中处理
                $("#"+indexId).attr("check","false");
                $("#"+indexId).removeClass("redLike");
                $("#"+indexId).removeClass(selectClazz[indexId]).addClass(clazz[indexId]);
                var seleScore = $("#"+indexId+"_value").text();
                var temp = Number(seleScore)-1==0?"":Number(seleScore)-1;
                $("#"+indexId+"_value").text(temp);
                if(this.options.subCMT === true || this.options.subCMT === "true" ){
                    submitData.relatItemId = relatItemId;
                    submitData.itemVal = false;
                    submitData.operType = "update";
                }else{
                    submitData.itemId = relatItemId;
                    submitData.value = false;
                    submitData.operType = "update";
                }
            }else{
                //未选中
                for(var i = 0; tempDzId && i < tempDzId.length; i++){
                    if(indexId === tempDzId[i]){
                        //选中处理
                        $("#"+indexId).attr("check","true");
                        $("#"+indexId).addClass("redLike");
                        $("#"+indexId).removeClass(clazz[indexId]).addClass(selectClazz[indexId]);
                        var seleScore = $("#"+indexId+"_value").text();
                        $("#"+indexId+"_value").text(Number(seleScore)+1);
                        if(this.options.subCMT === true || this.options.subCMT === "true"){
                            submitData.relatItemId = relatItemId;
                            submitData.itemVal = true;
                            submitData.operType = "update";
                        }else{
                            submitData.itemId = relatItemId;
                            submitData.value = true;
                            submitData.operType = "update";
                        }
                    }else{
                        var currItem = $("#"+tempDzId[i]);
                        var tmpSele = currItem.attr("check");
                        if(tmpSele === "true" || tmpSele === true){
                            currItem.attr("check","false");
                            currItem.removeClass("redLike");
                            currItem.removeClass(selectClazz[allItem[i]]).addClass(clazz[allItem[i]]);
                            var seleScore = $("#"+tempDzId[i]+"_value").text();
                            var temp = Number(seleScore)-1==0?"":Number(seleScore)-1;
                            $("#"+tempDzId[i]+"_value").text(temp);
                            rollBackData.exChecked = tempDzId[i];
                        }
                    }
                }
            }
            if(this.options.subCMT === true || this.options.subCMT === "true"){
                submitData.cmtInstId = that.options.subCMTData.cmtInstId;
                submitData.createId = that.options.subCMTData.createId;
                submitData.createName = that.options.subCMTData.createName;
                submitData.parentSubInstId = that.options.subCMTData.parentSubInstId;
                submitArr.push(submitData);
                paramData.moduleId = "1";
                paramData.CMT_INFO = submitArr;
                paramData.cmtTargetId = this.options.cmtTargetId;
            }else{
                submitData.groupId = 1;
                submitArr.push(submitData);
                paramData.moduleId = "1";
                paramData.CMT_INFO = submitArr;
                paramData.cmtTargetId = this.options.cmtTargetId;
            }
            paramData.out_nbr_id = this.options.out_nbr_id;
            var commitUrl = this.options.submitUrl;
            if(this.options.submitData === "true" || this.options.submitData === true){
                //若需要提交，则
                var commitData = {
                    "busiParams": paramData,
                    "busiCode": commitUrl
                };
                commonModel.ajaxEntry(commitData,function(data){
                    if(data.errorInfo){
                        if(data.errorInfo.code !== "0000"){
                            var msg = data.errorInfo.message;
                            kendo.ui.notification("提示",msg,"error", function(){
                                //回滚当前的点赞操作
                                that._rollBackZan(rollBackData);
                            });
                        }
                    }else{
                        kendo.ui.notification('提示', "点赞失败", "error", function(){
                            //回滚当前的点赞操作
                            that._rollBackZan(rollBackData);
                        });
                    }

                });
            }

        },

        /**
         * 点赞提交出错后回滚操作
         * @param data
         * @private
         */
        _rollBackZan : function(data){
            //所有的选中样式
            var selectClazz = this.options.selectClazz;
            //所有的未选中样式
            var clazz = this.options.clazz;
            var currCheck = data.curChecked;
            var exCheck = data.exChecked;
            if(!currCheck){
                return;
            }
            if(exCheck && currCheck === exCheck){
                $("#"+currCheck).attr("check","true");
                $("#"+currCheck).addClass("redLike");
                $("#"+currCheck).removeClass(clazz[currCheck]).addClass(selectClazz[currCheck]);
                var seleScore = $("#"+currCheck+"_value").text();
                var temp = Number(seleScore)+1==0?"":Number(seleScore)+1;
                $("#"+currCheck+"_value").text(temp);
            }else{
                //1、先将当前的选择变为不选中
                $("#"+currCheck).attr("check","false");
                $("#"+currCheck).removeClass("redLike");
                $("#"+currCheck).removeClass(selectClazz[currCheck]).addClass(clazz[currCheck]);
                var seleScore = $("#"+currCheck+"_value").text();
                var temp = Number(seleScore)-1==0?"":Number(seleScore)-1;
                $("#"+currCheck+"_value").text(temp);
                //2、再将之前的选中选中
                if(exCheck){
                    $("#"+exCheck).attr("check","true");
                    $("#"+exCheck).addClass("redLike");
                    $("#"+exCheck).removeClass(clazz[exCheck]).addClass(selectClazz[exCheck]);
                    var seleScore = $("#"+exCheck+"_value").text();
                    var temp = Number(seleScore)+1==0?"":Number(seleScore)+1;
                    $("#"+exCheck+"_value").text(temp);
                }
            }

        },
        options: {
            name: "AILikeCMT",
        }
    });

    ui.plugin(AILikeCMT);

})(jQuery);

/**
 * 点赞模式
 * <div id="like_cmt_test" class="aiui-likecmt"
 *  data-options="itemCount:1,itemId:'100007',
 *               clazz: '{\'100007\':\'cmt-like-span grayLike fl mt_4\'}',
 *               selectClazz: '{\'100007\':\'cmt-like-span redLike fl mt_4\'}'
 * "></div>
 * @returns {*}
 */
$.fn.likecmt = function () {
    var that = this;
    var target = that[0];
    if ($(target).is("div") == false) {
        return;
    }
    if ($.data(target, 'ailikecmt')) {
        return $(target).data("kendoAILikeCMT");
    }
    return $.fn.likecmt.create(target);
};

$.fn.likecmt.create = function (target) {
    var options = $.fn.likecmt.parseOptions(target, {
        itemCount: 2,
        itemId: '100007|100008',
        clazz: "{'100007':'cmt-like-span grayLike fl mt_4','100008':'cmt-like-span grayUnlike fl ml20 mt4'}",
        selectClazz: "{'100007':'cmt-like-span redLike fl mt_4','100008':'cmt-like-span redUnlike fl ml20 mt4'}",
        submitData: false,
        itemType : "{'100007':'like','100008':'unLike'}"
    }, {
        itemCount: "number",
        itemId: "string",
        clazz: "number",
        selectClazz: "string",
        submitData: "boolean",
        itemType:"string",
        id:"string"
    });

    var arrItem = [];
    var arrItems = options.itemId.split("|");
    for(var i=0; arrItems && i<arrItems.length;i++){
        arrItem.push(arrItems[i]);
    }

    $(target).kendoAILikeCMT({
        id:options.id,
        itemCount: options.readonly,
        itemId: arrItem,
        clazz: eval("("+options.clazz+")"),
        selectClazz: eval("("+options.selectClazz+")"),
        itemType: eval("("+options.itemType+")"),
        submitData:options.submitData
    });

    var id = $(target).attr("id") ? $(target).attr("id") : new Date().getTime();
    $.data(target, 'ailikecmt', id);

    return $(target).data("kendoAILikeCMT");
};

$.fn.likecmt.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};
