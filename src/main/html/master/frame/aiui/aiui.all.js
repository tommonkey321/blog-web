/**
 * @author zhangrp
 * Created on 2016/3/10 14:06
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */


(function ($) {
    var i = "";
    var kendo = window.kendo,
        ui = kendo.ui,
        proxy = $.proxy,
        Widget = ui.Widget;

    var AIAddress = Widget.extend({
        init: function (element, options) {
            var that = this;
            Widget.fn.init.call(that, element, options);

            element = that.element;
            options = that.options;
            that.wrapper = $(element);

            var invokeType = options.invokeType || "in";
            var targetWidth = $(element).width();
            if (options.width) {
                targetWidth = options.width;
            }
            var width = targetWidth;
            if (width < 470) {
                width = 470;
            }
            width = width - 5;
            var _id = $(element).attr("id");
            if(_id==undefined || _id==null || _id==""){
                _id = new Date().getTime();
            }
            var provinceId = "province_" + _id;
            var cityId = "city_" + _id;
            var countyId = "county_" + _id;
            //var spanId = "span_" + _id;
            var detailId = "detail_" + _id;
            options.provinceId = provinceId;
            options.cityId = cityId;
            options.countyId = countyId;
            //options.spanId = spanId;
            options.detailId = detailId;
            options.invokeType = invokeType;

            var required = $(element).attr("required");
            // var addressName = $(element).attr("name");
            var title = $(element).attr("title");
            if(comm.lang.isEmpty(title)){
                title = "";
            }
            i = i + " ";
            //if(addressName === undefined){
                var addressName = i;
            //}else {
                //addressName = " " + addressName + " ";
            //}
            var html = "<div>" +
                "	<select class='aiui-combobox' id='" + provinceId + "'" + (required ? "required" : "") +
                "           validationType="+(required?"'notempty'":"''")+" validationMessage='"+title+"省份不能为空'"+
                "	        name='" + addressName + "'" +
                "	        type='static'" +
                "	        codeType='PROVINCE'" +
                "	        dataTextField='codeName'" +
                "	        dataValueField='codeValue'" +
                "	        placeholder='--省/直辖市--'" +
                "	        defaultValue='上海市'" +
                "	        invokeType='" + invokeType + "'" +
                "	        style='width: 100px;'>" +
                "	</select>" +
                "	<select class='aiui-combobox' id='" + cityId + "'" + (required ? "required" : "") +
                "           validationType="+(required?"'notempty'":"''")+" validationMessage='"+title+"地市不能为空'"+
                "	        name='" + addressName + "'" +
                "	        type='static'" +
                "	        codeType='CITY'" +
                "	        dataTextField='codeName'" +
                "	        dataValueField='codeValue'" +
                "	        placeholder='--市--'" +
                "	        parentCodeField='" + provinceId + "'" +
                "	        defaultValue='上海'" +
                "	        invokeType='" + invokeType + "'" +
                "	        style='width: 100px;'>" +
                "	</select>" +
                "	<select class='aiui-combobox' id='" + countyId + "'" + (required ? "required" : "") +
                "           validationType="+(required?"'notempty'":"''")+" validationMessage='"+title+"区县不能为空'"+
                // "	<select class='aiui-combobox' id='" + countyId + "'" +
                "	        name='" + addressName + "'" +
                "	        type='static'" +
                "	        codeType='COUNTY'" +
                "	        dataTextField='codeName'" +
                "	        dataValueField='codeValue'" +
                "	        placeholder='--区/县--'" +
                "	        parentCodeField='" + cityId + "'" +
                "	        invokeType='" + invokeType + "'" +
                "	        style='width: 120px'>" +
                "	</select>" +
                //"</div>" +
                //"<div style='padding-top: 2px;'>" +
                //"	<span id='" + spanId + "'>上海市</span>" +
                "	<input id='" + detailId + "' name='" + addressName + "'  data-custcheck-msg='不能为空.'  validationType="+(required?"'notempty'":"''")+ " validationMessage='"+title+"地址不能为空' class='k-textbox' value='' " + (required ? "required" : "") + " style='width:" + (width-330) + "px;'>" +
                "</div>";
            $(element).html(html);
            $("#" + provinceId).combobox();
            $("#" + cityId).combobox();
            $("#" + countyId).combobox();


            $("#" + provinceId).combobox().bind('change', function () {
                $("#" + countyId).combobox().load();
            });
            $("#" + provinceId).on('change', proxy(that._change, that));
            $("#" + cityId).on('change', proxy(that._change, that));
            $("#" + countyId).on('change', proxy(that._change, that));
            $("#" + detailId).on('change', proxy(that._change, that));


            //$("#" + provinceId).on('blur', proxy(that._blur, that));
            //$("#" + cityId).on('blur', proxy(that._blur, that));
            //$("#" + countyId).on('blur', proxy(that._blur, that));
            //$("#" + detailId).on('blur', proxy(that._blur, that));
            //$(element).on('blur', proxy(that._blur, that));


            that.readonly(options.readonly);
            that.enable(options.enabled);

            $(element).width("auto");

        },
        options: {
            name: "AIAddress"
        },
        _change: function () {
            var that = this;
            that.trigger("change");
        },
        _blur: function () {
            var that = this;
            that.trigger("blur");
        },
        readonly: function (flag) {
            var that = this;
            var options = that.options;
            if (flag !== undefined) {
                that.options.readonly = flag;
                $("#" + options.provinceId).combobox().readonly(flag);
                $("#" + options.cityId).combobox().readonly(flag);
                $("#" + options.countyId).combobox().readonly(flag);
                if (flag == false) {
                    $("#" + options.detailId).removeAttr("readonly");
                } else {
                    $("#" + options.detailId).attr("readonly", "readonly");
                }
            }
            return that.options.readonly;
        },
        enable: function (flag) {
            var that = this;
            var options = that.options;
            if (flag !== undefined) {
                that.options.enabled = flag;
                $("#" + options.provinceId).combobox().enable(flag);
                $("#" + options.cityId).combobox().enable(flag);
                $("#" + options.countyId).combobox().enable(flag);
                if (flag == true) {
                    $("#" + options.detailId).removeAttr("disabled");
                } else {
                    $("#" + options.detailId).attr("disabled", "disabled");
                }
            }
            return that.options.enabled;
        },
        value: function (value) {
            var that = this;
            var options = that.options;
            if (value === undefined) {
                if ($("#" + options.provinceId).combobox().text() == "" || $("#" + options.cityId).combobox().text() == "" ||
                    //$("#" + options.countyId).combobox().text() == "" ||
                    $("#" + options.detailId).val() == "") {
                    return "";
                }
                return $("#" + options.provinceId).combobox().text() + " " +
                    $("#" + options.cityId).combobox().text() + " " +
                    $("#" + options.countyId).combobox().text() + " " +
                    $("#" + options.detailId).val();
            }
            if(value == null){
                return ;
            }
            var vlaues = value.split(" ");
            if (vlaues.length > 3) {
                //$("#" + options.spanId).text(vlaues[0] + " " + vlaues[1] + " " + vlaues[2]);
                $("#" + options.provinceId).combobox().text(vlaues.shift());
                $("#" + options.cityId).combobox().load();
                $("#" + options.cityId).combobox().text(vlaues.shift());

                $("#" + options.countyId).combobox().load();
                $("#" + options.countyId).combobox().text(vlaues.shift());

                $("#" + options.detailId).val(vlaues.join(""));
            } else {
                $("#" + options.detailId).val(value);
            }
        },
        provinceText: function (text) {
            var that = this;
            var options = that.options;
            return $("#" + options.provinceId).combobox().text(text);
        },
        province: function (value) {
            var that = this;
            var options = that.options;
            return $("#" + options.provinceId).combobox().value(value);
        },
        cityText: function (text) {
            var that = this;
            var options = that.options;
            return $("#" + options.cityId).combobox().text(text);
        },
        city: function (value) {
            var that = this;
            var options = that.options;
            return $("#" + options.cityId).combobox().value(value);
        },
        countyText: function (text) {
            var that = this;
            var options = that.options;
            return $("#" + options.countyId).combobox().text(text);
        },
        county: function (value) {
            var that = this;
            var options = that.options;
            return $("#" + options.countyId).combobox().value(value);
        },
        detail: function (value) {
            var that = this;
            var options = that.options;
            if(value){
                $("#" + options.detailId).val(value);
            }
            return $("#" + options.detailId).val();
        }
    });
    ui.plugin(AIAddress);


})(jQuery);


$.fn.address = function () {
    var that = this;
    var target = that[0];
    if ($(target).is("div") == false) {
        return;
    }
    if ($.data(target, 'aiaddress')) {
        return $(target).data("kendoAIAddress");
    }
    return $.fn.address.create(target);
};

$.fn.address.create = function (target) {
    var options = $.fn.address.parseOptions(target, {
        readonly: false,
        enabled: true,
        invokeType: 'in'
    }, {
        readonly: "boolean",
        enabled: "boolean",
        width: "number",
        invokeType: "string"
    });

    $(target).kendoAIAddress({
        readonly: options.readonly,
        enabled: options.enabled,
        width: options.width,
        invokeType: options.invokeType
    });

    var id = $(target).attr("id") ? $(target).attr("id") : new Date().getTime();
    $.data(target, 'aiaddress', id);

    return $(target).data("kendoAIAddress");
};

$.fn.address.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};



/**
 * @author zhangrp
 * Created on 2015/10/26 14:20
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */

(function ($) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget;

    var AIDYNCInput = Widget.extend({
        init: function (element, options) {
            var that = this;
            Widget.fn.init.call(that, element, options);

            element = that.element;
            options = that.options;
            var busicode = element.attr("data-busicode");
            if (busicode && dataRet != "" && dataRet != "null") {
                options.busicode = busicode;
            }
            var dataRet = element.attr("data-return");
            if (dataRet && dataRet != "" && dataRet != "null") {
                options.dataRet = dataRet;
            } else if (options.dataRet == undefined) {
                options.dataRet = "returnValue";
            }

            if (options.busicode) {

                comm.ajax.ajaxEntity({
                    "param": {
                        "PRODUCT_ID": parent.busiFrameModel.protocalData.submitData[0].paramMap.specId + "",
                        "CUSTOMER_ID": parent.busiFrameModel.groupInfo.partyRoleId,
                        "OFFER_ID": parent.busiFrameModel.param.offerId + ""
                    },
                    "busiCode": options.busicode,
                    callback: function (data,isSucc,msg) {
                        if (data != null) {
                            that.element.val(data[options.dataRet]);
                        }
                    }
                });
            }
            try {
                element[0].setAttribute("type", "text");
            } catch (e) {
                element[0].type = "text";
            }
            element.addClass("k-textbox");
            element.attr("readonly", "readonly");
        },
        options: {
            name: "AIDYNCInput"
        },
        value: function (value) {
            var that = this;
            if (value === undefined) {
                return that.element.val();
            }
            that.element.val(value);
        }
    });
    ui.plugin(AIDYNCInput);


})(jQuery);

/**
 * @author zhangrp
 * Created on 2015/9/18 10:14
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * 扩展组件 AIAutoComplete
 * 支持动态从后台拉去数据
 */
(function ($) {
    var AIAutoComplete = kendo.ui.AutoComplete.extend({
        init: function (element, options) {
            var that = this;
            kendo.ui.AutoComplete.fn.init.call(that, element, options);
            if (options.realTime) {
                that._realTimeInit(element, options);
            }
        },
        options: {
            name: "AIAutoComplete",
            realTime: false
        },
        _realTimeInit: function () {
            var that = this;
            if (that.dataSource) {
                $(that.element).keydown(function (e) {
                    if (e.keyCode != kendo.keys.DOWN && e.keyCode != kendo.keys.UP && e.keyCode != kendo.keys.ENTER && e.keyCode != kendo.keys.TAB
                        && e.keyCode != kendo.keys.ESC) {
                        var key = $(that.element).val();
                        if (key != "" && key.length >= that.options.minLength) {
                            //var data = that.dataSource.transport.options.read.data || {};
                            //data.key = key;
                            //that.dataSource.transport.options.read.data = data;
                            that.dataSource._data = [];
                            that.dataSource._destroyed = [];
                        }
                    }
                });
            }
        }
    });
    kendo.ui.plugin(AIAutoComplete);
})(jQuery);

/**
 * @author zhangrp
 * Created on 2015/10/26 14:20
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */

(function ($) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget;

    var AIBCERInput = Widget.extend({
        init: function (element, options) {
            var that = this;
            Widget.fn.init.call(that, element, options);

            element = that.element;
            options = that.options;
            var busicode = element.attr("data-busicode");
            if (busicode && dataRet != "" && dataRet != "null") {
                options.busicode = busicode;
            }
            var dataRet = element.attr("data-return");
            if (dataRet && dataRet != "" && dataRet != "null") {
                options.dataRet = dataRet;
            } else if (options.dataRet == undefined) {
                options.dataRet = "returnValue";
            }

            if (options.busicode) {
                comm.ajax.ajaxEntity({
                    param: {
                        "PRODUCT_ID": parent.soMainModel.param.specId + "",
                        "CUSTOMER_ID": parent.soMainModel.groupInfo.partyRoleId,
                        "OFFER_ID": parent.soMainModel.param.offerId + ""
                    },
                    busiCode: options.busicode,
                    callback: function (data,isSucc,msg) {
                        if (data != null) {
                            that.element.val(data[options.dataRet]);
                        }
                    }
                });
            }
            try {
                element[0].setAttribute("type", "text");
            } catch (e) {
                element[0].type = "text";
            }
            element.addClass("k-textbox");
            element.attr("readonly", "readonly");
        },
        options: {
            name: "AIBCERInput"
        },
        value: function (value) {
            var that = this;
            if (value === undefined) {
                return that.element.val();
            }
            that.element.val(value);
        }
    });
    ui.plugin(AIBCERInput);


})(jQuery);
/**
 * @author haomeng
 * Created on 2016/1/21 15:17
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * button 按钮
 *  <input class="aiui-button" id="queryButton" onclick="clickButton()" disabled="true" visiable="true" data-options="privId:privGroup.button.privId.testBtn" value="查询"/>
 *  <button class="aiui-button k-button k-primary" id="testPriv" data-options="privId:privGroup.button.privId.testBtn"/>&nbsp;&nbsp;有权限看我哦&nbsp;&nbsp;</button>
 * 属性
 * disabled: 是否可编辑
 * visible: 是否可见
 * privId:privGroup.button.privId.testBtn,groupId:privGroup.button.groupId  操作员如果有该权限可见
 * ctype: 按钮的显示样式，暂时支持： default,query和confirm三中类型
 *
 * 方法
 *
 *
 * 事件
 *
 *
 */

$.fn.button = function () {
    var that = this;
    var target = that[0];

    if ($.data(target, 'button')) {
        return $.data(target, 'button');
    }
    return $.fn.button.create(target);
};

$.fn.button.create = function (target) {
    var options = $.fn.button.parseOptions(target, {
        disabled: false,
        visible: true,
        type: "default"
    }, {
        ctype: "string",
        privId: "string",
        groupId: "string",
        disabled: "boolean",
        visible: "boolean"
    });

    if (options.disabled && options.disabled == true) {//不可编辑
        $(target).attr("disabled", "true");
    }

    if (options.visible && options.visible == false) {
        //不可见
        $(target).css("display", "none");
    } else if (options.visible && options.visible == true) {
        //如果按钮可见，根据配置的实体编号和操作编号，判断操作员是否查看该按钮的权限

        //判断操作员是否有权限，如果有权限则展示按钮，没有权限则影藏按钮
        if (options.privId) {
            comm.tools.getPrivs({
                privId: options.privId,
                callback: function(privs){
                    if (!privs || privs.length==0) {//没有权限
                        $(target).css("display", "none");
                        $(target).attr("disabled", "true");
                    }
                }
            });
        }
    }
    if (options.ctype) {
        switch (options.ctype.toUpperCase()) {
            case "DEFAULT":
                $(target).addClass("btn btn-default");
                break;
            case "CONFIRM":
                $(target).addClass("btn btn-confirm");
                break;
            default:
                $(target).addClass("btn btn-default");
        }
    } else {
        $(target).addClass("btn btn-default");
    }
    //$(target).text(options.value ? options.value : "");


    var button = {};
    button.options = options;
    button.target = target;
    $.data(target, 'button', button);

    return button;
};

$.fn.button.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};
/**
 * @author zhangrp
 * Created on 2016/1/12 10:37
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * 日历
 * * example: <input  class="aiui-calendar"  id="testDate"  default="now"  min="-5" max="5" minid="startDate" maxid="endDate"/>
 * 属性
 *defaultValue: 默认值（now:当天；数字N：后N天；数字-N：前N天；日期：指定日期，如"2016-01-16"）
 *min：最小值，取值范围同default
 *max: 最大值，取值范围同default
 *minid：最小日期限制为其它日历框的id
 *maxid：最大日期限制为其它日历框的id
 *
 * 方法
 *
 *
 *
 *
 *
 * 事件
 *
 *
 *
 */

$.fn.calendar = function () {
    var that = this;
    var target = that[0];
    //kendo.culture("zh-CN");
    $.fn.calendar.create(target);

};

$.fn.calendar.create = function (target) {
    var calendarOptions = $.fn.calendar.parseOptions(target, {
        culture:"zh-CN", //en-US,zh-CN
        format: "yyyy-MM-dd",
        defaultValue:"",
        min: "",
        max: "",
        maxid:"",
        minid:""
    }, {
        culture: "string",
        format: "string",
        defaultValue: "string",
        min: "string",
        max: "string",
        maxid: "string",
        minid: "string"
    });
    var now = new Date(), curDate, minDate, maxDate;
    if (calendarOptions.defaultValue){
        if (calendarOptions.defaultValue=="now"){
            curDate = new Date();
        }else if (calendarOptions.defaultValue.length==10){
            curDate = new Date(calendarOptions.defaultValue.substr(0,4),calendarOptions.defaultValue.substr(5,2),calendarOptions.defaultValue.substr(7,2));
        }else if (calendarOptions.defaultValue.isNumber() || calendarOptions.defaultValue.substr(0,1)=="-" || calendarOptions.defaultValue.substr(0,1)=="+"){
            curDate = new Date();
            curDate.setDate(new Date().getDate() + parseInt(calendarOptions.defaultValue));
        }
    }
    if (calendarOptions.min){
        if (calendarOptions.min=="now"){
            minDate = new Date();
        }else if (calendarOptions.min.length==10){
            minDate = new Date(calendarOptions.min.substr(0,4),calendarOptions.min.substr(5,2),calendarOptions.min.substr(7,2));
        }else if (calendarOptions.min.isNumber() || calendarOptions.min.substr(0,1)=="-" || calendarOptions.min.substr(0,1)=="+"){
            minDate = new Date();
            minDate.setDate(new Date().getDate() + parseInt(calendarOptions.min));
        }
    }
    if (calendarOptions.max){
        if (calendarOptions.max=="now"){
            maxDate = new Date();
        }else if (calendarOptions.max.length==10){
            maxDate = new Date(calendarOptions.max.substr(0,4),calendarOptions.max.substr(5,2),calendarOptions.max.substr(7,2));
        }else if (calendarOptions.max.isNumber() || calendarOptions.max.substr(0,1)=="-" || calendarOptions.max.substr(0,1)=="+"){
            maxDate = new Date();
            maxDate.setDate(new Date().getDate() + parseInt(calendarOptions.max));
        }
    }
    $(target).kendoDatePicker({
        animation: false,
        culture: calendarOptions.culture,
        format: calendarOptions.format,
        value: curDate,
        min: minDate,
        max: maxDate,
        change: function (e) {
            if (calendarOptions.maxid) {
                $("#"+calendarOptions.maxid).data("kendoDatePicker").min(this.value());
            }
            if (calendarOptions.minid) {
                $("#"+calendarOptions.minid).data("kendoDatePicker").max(this.value());
            }
        }
    });

};



$.fn.calendar.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};

/**
 * @author zhangrp
 * Created on 2015/9/28 15:32
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */


/**
 * combobox
 *
 *
 * 【属性】
 *
 * srvId: 服务ID
 * beforeLoad: 加载参数
 * dataTextField:
 * dataValueField:
 * defaultValue:默认值
 * hasAll: 是否有 ”全选“ 选项
 *
 * type: static 默认， 从cfg_static_data中取, 配合param使用。如果涉及级联通过parentCode使用
 *       dynamic 通过srvId取数据
 * param: 参数
 * parentCode: 级联父元素
 *
 *
 *
 *
 *
 *
 * 【方法】
 * getSelect: 获取选中值，返回的是对象， 注意区别直接获取值
 * value: Gets or sets the value of the ComboBox
 * text: Gets or sets the text of the ComboBox. Widget will select the item with same text.
 *             If there are no matches then the text will be considered as a custom value of the widget.
 * readonly: true/false
 * enable: true/false
 * load: 加载数据
 *
 * 【事件】
 * select: 选择时触发,通过$("#id").combobox().bind('select', function(e){todo})使用
 * change: 改变时触发
 *
 */
$.fn.combobox = function () {
    var that = this;
    var target = that[0];
    if ($(target).is("select") === false && ($(target).is("input") === false || $(target).attr("tabindex") !== undefined )) {
        return;
    }

    var multFlag = $(target).attr("multFlag");
    if(!comm.lang.isEmpty(multFlag) && (multFlag==true || multFlag=="true")){
        if ($.data(target, 'combobox')) {
            return $(target).data("kendoMultiSelect");
        }
    }else{
        if ($.data(target, 'combobox')) {
            return $(target).data("kendoComboBox");
        }
    }
    return $.fn.combobox.create(target);
};

$.fn.combobox.create = function (target) {
    var options = $.fn.combobox.parseOptions(target, {
        schemaData: 'data',
        autoBind: true,
        hasAll: false,
        multFlag:false,
        filter: 'contains',
        invokeType: 'in'
    }, {
        srvId: "string",
        dataTextField: "string",
        dataValueField: "string",
        defaultValue: "string",
        schemaData: 'string',
        autoBind: 'boolean',
        type: 'string',
        codeType:'string',
        codeValue:'string',
        parentCode:'string',
        parentCodeField:'string',
        param: 'string',
        hasAll: 'boolean',
        index: 'string',
        filter: 'string',
        invokeType: 'string',
        multFlag:'boolean'
    });
    var dataSource = undefined;
    if (options.srvId) {
        dataSource = $.extend({}, {
            transport: {
                read: {
                    url: options.invokeType === "out" ? SERVER_URL_OUT : SERVER_URL,
                    type: "POST"
                },
                parameterMap: function (data, operation) {
                    if (operation == "read") {
                        if (options.beforeLoad) {
                            data = options.beforeLoad(data);
                        }
                        var jsonRequstParam = {
                            "param": data,
                            "busiCode": options.srvId
                        };
                        return comm.ajax.paramWrap(jsonRequstParam);
                    } else if (data.models) {
                        return JSON.stringify(data.models);
                    }
                }
            },
            batch: true
        });
        dataSource = $.extend(dataSource, {
            batch: true,
            schema: {
                data: options.schemaData
            }
        });
    } else if (options.type == 'static') {
        var codeType = options.codeType;
        var codeValue = options.codeValue;
        var parentCode = options.parentCode;
        var param;
        if (options.beforeLoad) {
            param = options.beforeLoad({});
        }else if(!comm.lang.isEmpty(options.param)){
            param = JSON.parse(options.param);
        }
        if(param && !comm.lang.isEmpty(param.codeType)){
            codeType = param.codeType;
            codeValue = param.codeValue;
            parentCode = param.parentCode;
        }

        if(!comm.lang.isEmpty(options.parentCodeField)){
            parentCode = $("#"+options.parentCodeField).val();
        }

        options.codeType = codeType;
        if (options.dataTextField === undefined) {
            options.dataTextField = "codeName";
        }
        if (options.dataValueField === undefined) {
            options.dataValueField = "codeValue";
        }
        if (!comm.lang.isEmpty(options.parentCodeField)) {
            //事件
            $("#" + options.parentCodeField).combobox().bind('change', function (e) {
                $(target).combobox().load();
            });
        }
        var retData = comm.tools.getStaticData({
            codeType:codeType,
            codeValue:codeValue,
            parentCode:parentCode,
            sync:false
        });
        if (options.hasAll == true) {
            var obj = {};
            obj[options.dataTextField] = "全部";
            obj[options.dataValueField] = "";
            var temp = [];
            temp.push(obj);
            for (var p = 0; p < retData.length; p++) {
                temp.push(retData[p]);
            }
            retData = temp;
        }
        dataSource = retData;
    }
    var id = $(target).attr("id") ? $(target).attr("id") : new Date().getTime();
    $.data(target, 'combobox', id);


    var index = 0;
    if (options.index) {
        options.index = parseInt(options.index);
        if (options.index < 0) {
            index = undefined;
        } else {
            index = options.index;
        }
    }
    var filter = "contains";
    if (options.filter) {
        options.filter = options.filter;
        if (options.filter != "startswith" && options.filter != "contains" && options.filter != "eq") {
            filter = "contains";
        } else {
            filter = options.filter;
        }
    }
    if(options.multFlag==true || options.multFlag=="true"){
        $(target).kendoMultiSelect({
            autoBind: options.autoBind,
            dataSource: dataSource,
            dataTextField: options.dataTextField,
            dataValueField: options.dataValueField,
            value: options.defaultValue,
            index: index,
            filter: filter
        });
        $(target).data("kendoMultiSelect")._aiui_options = options;
        return $(target).data("kendoMultiSelect");
    }else{
        $(target).kendoComboBox({
            autoBind: options.autoBind,
            dataSource: dataSource,
            dataTextField: options.dataTextField,
            dataValueField: options.dataValueField,
            value: options.defaultValue,
            index: index,
            filter: filter
        });
        $(target).data("kendoComboBox")._aiui_options = options;
        return $(target).data("kendoComboBox");
    }
};

$.fn.combobox.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};

$.fn.combobox.load = function () {
    var that = this;
    var options = that._aiui_options;
    var target = that.element;
    if (options.srvId) {
        that.dataSource.read();
    } else if (options.parentCodeField && $("#" + options.parentCodeField).length > 0) {
        var parentCodeValue = $("#" + options.parentCodeField).val();
        var data_ = comm.tools.getStaticData({
            codeType:options.codeType,
            codeValue:options.codeValue,
            parentCode:parentCodeValue,
            sync:false
        });

        if (options.hasAll == true) {
            var obj = {};
            obj[options.dataTextField] = "全部";
            obj[options.dataValueField] = "";
            var temp = [];
            temp.push(obj);
            for (var p = 0; p < data_.length; p++) {
                temp.push(data_[p]);
            }
            data_ = temp;
        }
        $(target).combobox().dataSource.data(data_);
        $(target).combobox().value("");
    }
};
/**
 * 获取选中值，返回的是对象， 注意区别直接获取值
 * @returns {{}}
 */
$.fn.combobox.getSelect = function () {
    var that = this;
    var _select_value = that.value();
    var _select_text = that.text();
    var _data = that.dataSource._data;
    var _target = {};
    for (var i = 0; i < _data.length; i++) {
        if (_data[i][that.options.dataTextField] == _select_text && _data[i][that.options.dataValueField] == _select_value) {
            _target = _data[i];
            break;
        }
    }
    return _target;
};

kendo.ui.ComboBox.prototype["getSelect"] = $.fn.combobox.getSelect;
kendo.ui.ComboBox.prototype["load"] = $.fn.combobox.load;
kendo.ui.MultiSelect.prototype["load"] = $.fn.combobox.load;

/**
 * @author zhangrp
 * Created on 2015/12/31 9:35
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * table
 * example: <table class="aiui-datagrid" id="taskGrid" height="400" data-options="srvId:'IWORKFLOWFSV_QUERYTASK',pageSize:5, beforeLoad: getParams"></table>
 *
 * 属性
 *  srvId: 后台服务对应的srvId
 *  pageable: 是否支持分页
 *  pageSize: 页面大小
 *  autoBind: defult false, 不自动加载数据
 *  height: 表格高度，default 400
 *  sortable: 列是否支持排序，default true
 *  selectable: 是否可以选择，defult row,  其它值：
 *              "row" - the user can select a single row.
 *              "cell" - the user can select a single cell.
 *              "multiple, row" - the user can select multiple rows.
 *              "multiple, cell" - the user can select multiple cells.
 *  beforeLoad: 数据加载前封装参数，为方法，必须写在data-options中
 *  schemaData: 数据明细对象。default data.list
 *  schemaTotal: 数据总数对象。default data.count
 *  editable: 是否可以编辑。true or false. default false
 *
 *  idField: 如果表格修改时必须要有，否则无法获取到改变的数据
 *
 *  rownumbers: true or false, 是否显示序列，默认不显示
 *  checkbox: true or false,是否有checkbox框，默认没有
 *  detailTemplate: 明细，为script的id
 *
 * clo
 * example: <th field="businessId" data-options="width:80">申请单编号</th>
 * 列属性
 *  field: 列
 *  width: 宽度
 *  hidden: 是否隐藏
 *  template: 数据处理模板，为方法，必须写在data-options中,且方法必须在初始化时可见
 *  pattern: 数据校验，编辑时使用
 *
 *
 *  type: 数据类型，string,number,boolean,date,datetime,email,dynamic,static.        The default is "string".
 *  param : 参数
 *  editable: 是否可编辑，default true
 *  defaultValue: 编辑时默认值
 *  nullable: 可否为null
 *  required: 是否必须
 *  min: 最小值
 *  max: 最大值
 *  locked: (default: false) If set to true the column will be displayed as locked in the grid.
 *  lockable Boolean (default: true) If set to false the column will remain in the side of the grid into which its own locked configuration placed it.
 *
 *
 *
 *
 * 方法
 *  getChanged: 获取改变数据
 *  exportExcel: 导出数据到excel
 *  load: 加载数据
 *  getSelects: 获取选中行 多行
 *  getSelect: 获取选中行 单行
 *  addRow: 添加一行
 *  addData: 添加数据
 *  getData：获取所有数据
 *  unSelect： 取消选中
 *  isRowExpanded: 判断行是否已展开
 *
 *
 *
 * 事件
 *  dbclick           双击行
 */



$.fn.datagrid = function () {
    var that = this;
    var target = that[0];
    if (that.attr("gridId") && $("#" + that.attr("gridId"))) {
        return $("#" + that.attr("gridId")).data("kendoGrid");
    }
    var gridId = new Date().getTime();
    that.css("display", "none");
    that.attr("gridId", gridId);
    return $.fn.datagrid.create(gridId, target);
};

$.fn.datagrid.create = function (gridId, target) {
    var tableOptions = $.fn.datagrid.parseOptions(target, {
        sortable: true,
        height: 400,
        autoBind: false,
        selectable: 'row',
        editable: false,
        rownumbers: false,
        checkbox: false,
        locked: false,
        filterable:false
    }, {
        srvId: "string",
        pageSize: "number",
        height: "number",
        autoBind: "boolean",
        pageable: "boolean",
        schemaData: 'string',
        schemaTotal: 'string',
        editable: 'boolean',
        sortable: 'boolean',
        selectable: 'string',
        idField: 'string',
        rownumbers: 'boolean',
        checkbox: 'boolean',
        detailTemplate: 'string',
        locked: 'boolean',
        filterable:'boolean'
    });
    var dataSource = {};
    var pageable = false;
    var columns = [];
    var schema = {};

    var model = {};
    model.fields = {};
    if (tableOptions.idField) {
        model.id = tableOptions.idField;
    }


    if (tableOptions.rownumbers != undefined && tableOptions.rownumbers == true) {
        var col = {
            field: "",
            title: "",
            width: 30,
            attributes: {
                //border-right-color: \\#ccc; border-right-style: solid; border-right-width: 1px; background-color: \\#f5f5f5;
                style: "text-align: center; "
            },
            template: function (dataItem) {
                return "" + (dataItem.parent().indexOf(dataItem) + 1);
            },
            locked: tableOptions.locked
        };
        columns.push(col);
    }
    if (tableOptions.checkbox != undefined && tableOptions.checkbox == true && tableOptions.selectable != "false") {
        var col = {
            field: "",
            title: "<input type='checkbox' name='" + gridId + "_header_check'>",
            width: 30,
            template: function (dataItem) {
                return "<input type='checkbox' name='" + gridId + "_check'>";
            },
            locked: tableOptions.locked
        };
        columns.push(col);
    }


    $(target).find("th").each(function () {
        var col = $.fn.datagrid.parseOptions(this, {title: $.trim($(this).text()), editable: true, type: 'string', locked: false, lockable: true }, {
            field: 'string',
            width: 'number',
            hidden: 'boolean',
            pattern: 'string',

            type: 'string',
            param: 'string',
            editable: 'boolean',
            defaultValue: 'string',
            nullable: 'boolean',
            required: 'boolean',
            min: 'number',
            max: 'number',
            srvId: 'string',
            schemaData: 'string',
            dataTextField: 'string',
            dataValueField: 'string',
            valueSplitFlag:"string",
            selectOnly: 'boolean',


            locked: 'boolean',
            lockable: 'boolean',
            filterable:'boolean'
        });
        if (col["type"] && col["field"]) {
            switch (col["type"].toUpperCase()) {
                case 'DATE':
                    col.template = function (dataItem) {
                        if (dataItem[col["field"]]!=undefined && dataItem[col["field"]]!=null) {
                            var param = "yyyy-MM-dd";
                            if (col["param"]) {
                                param = col["param"];
                            }
                            if (dataItem[col["field"]] != '') {
                                if (typeof dataItem[col["field"]] === 'Date') {
                                    return kendo.format("{0:" + param + "}", dataItem[col["field"]]);
                                } else {
                                    return kendo.format("{0:" + param + "}", new Date(dataItem[col["field"]]));
                                }
                            }
                        }
                        if(col["defaultValue"]!=undefined && col["defaultValue"]!=null){
                            return col["defaultValue"];
                        }
                        return "";
                    };
                    if (tableOptions["editable"] == true) {
                        model.fields[col["field"]] = {
                            defaultValue: col["defaultValue"],
                            editable: col["editable"],
                            nullable: col["nullable"],
                            type: 'date',
                            validation: {
                                required: col["required"]
                            }
                        }
                    }else{
                        model.fields[col["field"]] = {
                            type: 'date'
                        }
                    }
                    break;
                case 'DATETIME':
                    col.template = function (dataItem) {
                        if (dataItem[col["field"]]!=undefined && dataItem[col["field"]]!=null) {
                            var param = "yyyy-MM-dd HH:mm:ss";
                            if (col["param"]) {
                                param = col["param"];
                            }
                            if (dataItem[col["field"]] != '') {
                                if (typeof dataItem[col["field"]] === 'Date') {
                                    return kendo.format("{0:" + param + "}", dataItem[col["field"]]);
                                } else {
                                    return kendo.format("{0:" + param + "}", new Date(dataItem[col["field"]]));
                                }
                            }
                        }
                        if(col["defaultValue"]!=undefined && col["defaultValue"]!=null){
                            return col["defaultValue"];
                        }
                        return "";
                    };
                    if (tableOptions["editable"] == true) {
                        model.fields[col["field"]] = {
                            defaultValue: col["defaultValue"],
                            editable: col["editable"],
                            nullable: col["nullable"],
                            type: 'date',
                            validation: {
                                required: col["required"]
                            }
                        };

                        if (col["editable"] == true) {
                            col.editor = function (container, options) {
                                var html = '<input ' + (col["required"] ? 'required="' + col["required"] + '"' : "") + '/>';
                                var input = $(html);
                                input.attr("name", options.field);
                                input.appendTo(container);
                                input.kendoDateTimePicker({
                                    animation: false
                                });
                                var tooltipElement = $('<span class="k-invalid-msg" data-for="' + options.field + '"></span>');
                                tooltipElement.appendTo(container);
                            };
                        }
                    }else{
                        model.fields[col["field"]] = {
                            type: 'date'
                        }
                    }
                    break;
                case 'NUMBER':
                    if (col["template"]!=undefined || col["template"]==null) {
                        col.template = function (dataItem) {
                            if (dataItem[col["field"]]!=undefined && dataItem[col["field"]]!=null) {
                                return dataItem[col["field"]];
                            }else{
                                if(col["defaultValue"]!=undefined && col["defaultValue"]!=null){
                                    return col["defaultValue"];
                                }
                            }
                            return "";
                        }
                    }
                    if (tableOptions["editable"] == true) {
                        model.fields[col["field"]] = {
                            defaultValue: col["defaultValue"],
                            editable: col["editable"],
                            nullable: col["nullable"],
                            type: 'number',
                            validation: {
                                required: col["required"],
                                min: col["min"],
                                max: col["max"],
                                pattern: col["pattern"]
                            }
                        }
                    }else{
                        model.fields[col["field"]] = {
                            type: 'number'
                        }
                    }
                    break;
                case 'BOOLEAN':
                    if (col["template"]!=undefined || col["template"]==null) {
                        col.template = function (dataItem) {
                            if (dataItem[col["field"]]!=undefined && dataItem[col["field"]]!=null) {
                                return dataItem[col["field"]];
                            }else{
                                if(col["defaultValue"]!=undefined && col["defaultValue"]!=null){
                                    return col["defaultValue"];
                                }
                            }
                            return "";
                        }
                    }
                    if (tableOptions["editable"] == true) {
                        model.fields[col["field"]] = {
                            defaultValue: col["defaultValue"],
                            editable: col["editable"],
                            type: 'boolean',
                            validation: {
                                required: col["required"]
                            }
                        }
                    }else{
                        model.fields[col["field"]] = {
                            type: 'boolean'
                        }
                    }
                    break;
                case 'EMAIL':
                    if (col["template"]!=undefined || col["template"]==null) {
                        col.template = function (dataItem) {
                            if (dataItem[col["field"]]!=undefined && dataItem[col["field"]]!=null) {
                                return dataItem[col["field"]];
                            }else{
                                if(col["defaultValue"]!=undefined && col["defaultValue"]!=null){
                                    return col["defaultValue"];
                                }
                            }
                            return "";
                        }
                    }
                    if (tableOptions["editable"] == true) {
                        model.fields[col["field"]] = {
                            defaultValue: col["defaultValue"],
                            editable: col["editable"],
                            type: 'string',
                            validation: {
                                required: col["required"],
                                type: 'email'
                            }
                        }
                    }else{
                        model.fields[col["field"]] = {
                            type: 'string'
                        }
                    }
                    break;
                case 'DYNAMIC':
                    if (col["srvId"]) {
                        var colDataTextField = col["dataTextField"]?col["dataTextField"]:"text";
                        var colDataValueField = col["dataValueField"]?col["dataValueField"]:"value";

                        var comboDataSource = {};
                        var param = {};
                        if(col["param"]!=undefined && col["param"]!=null && col["param"]!="") {
                            try{
                                param = eval(col["param"])(param)
                            }catch(e){
                                param = col["param"] || "";
                            }
                        }
                        comm.ajax.ajaxEntity({
                            sync: false,
                            param: param,
                            busiCode: col["srvId"],
                            callback: function (data) {
                                comboDataSource = data;
                            }
                        });
                        if(col["schemaData"]!=undefined && col["schemaData"]!=null && col["schemaData"]!="") {
                            comboDataSource = eval("comboDataSource." + col["schemaData"]);
                        }

                        col.template = function (dataItem) {
                            if ((dataItem[col["field"]] && dataItem[col["field"]]!=null) || (col["defaultValue"] && col["defaultValue"]!=null)) {
                                var retName = "";
                                var selectedCodes = dataItem[col["field"]];
                                if(selectedCodes==null || selectedCodes==""){
                                    selectedCodes = col["defaultValue"];
                                }
                                if (selectedCodes && selectedCodes != null) {
                                    var valueSplitFlag = col["valueSplitFlag"];
                                    var dataValues = [selectedCodes];
                                    if (valueSplitFlag && valueSplitFlag != null && valueSplitFlag != "") {
                                        dataValues = selectedCodes.split(valueSplitFlag);
                                    } else {
                                        valueSplitFlag = "";
                                    }
                                    if (dataValues != null && dataValues.length > 0 && comboDataSource != null && comboDataSource.length > 0) {
                                        for (var i = 0; i < dataValues.length; i++) {
                                            for (var j = 0; j < comboDataSource.length; j++) {
                                                if (comboDataSource[j][colDataValueField] == dataValues[i]) {
                                                    if (retName != null && retName != "") {
                                                        retName += valueSplitFlag;
                                                    }
                                                    retName += comboDataSource[j][colDataTextField];
                                                }
                                            }
                                        }
                                    }
                                    if (retName == null || retName == "") {
                                        retName = selectedCodes;
                                    }

                                    return retName;
                                }
                            }
                            return "";
                        };

                        if (tableOptions["editable"] == true) {
                            model.fields[col["field"]] = {
                                defaultValue: col["defaultValue"],
                                editable: col["editable"],
                                nullable: col["nullable"],
                                type: 'string',
                                validation: {
                                    required: col["required"],
                                    min: col["min"],
                                    max: col["max"]
                                }
                            };

                            if (col["editable"] == true) {
                                col.editor = function (container, options) {
                                    var input = $("<input/>");
                                    input.attr("name", options["field"]);
                                    if(col["required"] == true){
                                        input.attr("required", "required");
                                    }
                                    input.appendTo(container);
                                    if (col["selectOnly"]) {
                                        input.kendoDropDownList({
                                            dataSource: comboDataSource,
                                            dataTextField: colDataTextField,
                                            dataValueField: colDataValueField
                                        });
                                    } else {
                                        input.kendoComboBox({
                                            dataSource: comboDataSource,
                                            dataTextField: colDataTextField,
                                            dataValueField: colDataValueField
                                        });
                                    }
                                    var tooltipElement = $('<span class="k-invalid-msg" data-for="' + options.field + '"></span>');
                                    tooltipElement.appendTo(container);
                                };
                            }

                        }else{
                            model.fields[col["field"]] = {
                                type: 'string'
                            }
                        }
                    }
                    break;
                case 'STATIC':
                    var param = "";
                    if (col["param"]) {
                        param = col["param"];
                    }
                    col.template = function (dataItem) {
                        var codeValue = dataItem[col["field"]];
                        if(codeValue==undefined || codeValue==null){
                            if(col["defaultValue"]!=undefined && col["defaultValue"]!=null){
                                codeValue = col["defaultValue"];
                            }
                        }
                        if(codeValue!=undefined && codeValue!=null) {
                            var valueSplitFlag = col["valueSplitFlag"];
                            if (valueSplitFlag!=undefined && valueSplitFlag != null && valueSplitFlag != "") {
                                codeValue = codeValue.split(valueSplitFlag);
                            } else {
                                valueSplitFlag = "";
                            }
                            var selectedCodes = comm.tools.getStaticData({
                                sync: false,
                                codeType: param,
                                codeValue: codeValue
                            });
                            if (selectedCodes != null && selectedCodes.length > 0) {
                                var retValue = "";
                                for (var i = 0; i < selectedCodes.length; i++) {
                                    if (i > 0) {
                                        retValue += valueSplitFlag;
                                    }
                                    retValue += selectedCodes[i]["codeName"];
                                }
                                return retValue;
                            } else {
                                if(col["defaultValue"]!=null && col["defaultValue"]!=""){
                                    return col["defaultValue"];
                                }
                                return dataItem[col["field"]];
                            }
                        }
                        return "";
                    };

                    if (tableOptions["editable"] == true) {
                        model.fields[col["field"]] = {
                            defaultValue: col["defaultValue"],
                            editable: col["editable"],
                            nullable: col["nullable"],
                            type: 'string',
                            validation: {
                                required: col["required"],
                                min: col["min"],
                                max: col["max"]
                            }
                        };

                        if (col["editable"] == true) {
                            col.editor = function (container, options) {
                                var input = $("<input/>");
                                input.attr("name", options.field);
                                if(col["required"] == true){
                                    input.attr("required", "required");
                                }
                                input.appendTo(container);
                                if (col["selectOnly"]) {
                                    input.kendoDropDownList({
                                        dataSource: comm.tools.getStaticData({
                                            codeType:param
                                        }),
                                        dataTextField: "codeName",
                                        dataValueField: "codeValue"
                                    });
                                } else {
                                    input.kendoComboBox({
                                        dataSource: comm.tools.getStaticData({
                                            codeType:param
                                        }),
                                        dataTextField: "codeName",
                                        dataValueField: "codeValue"
                                    });
                                }
                                var tooltipElement = $('<span class="k-invalid-msg" data-for="' + options.field + '"></span>');
                                tooltipElement.appendTo(container);
                            };
                        }

                    }else{
                        model.fields[col["field"]] = {
                            type: 'string'
                        }
                    }
                    break;
                case 'STATICDATA':
                    if (col["param"]) {
                        var colDataTextField = col["dataTextField"]?col["dataTextField"]:"text";
                        var colDataValueField = col["dataValueField"]?col["dataValueField"]:"value";
                        var comboDataSource = {};
                        if(col["param"]!=undefined && col["param"]!=null && col["param"]!="") {
                            try{
                                comboDataSource = eval(col["param"])(param)
                            }catch (e) {
                                comboDataSource = eval(col["param"]) || {};
                            }
                        }
                        col.template = function (dataItem) {
                            if ((dataItem[col["field"]]!=undefined && dataItem[col["field"]]!=null) || (col["defaultValue"]!=undefined && col["defaultValue"]!=null)) {
                                var retName = "";
                                var selectedCodes = dataItem[col["field"]];
                                if(selectedCodes==null || selectedCodes==""){
                                    selectedCodes =  col["defaultValue"];
                                }
                                if (selectedCodes!=undefined && selectedCodes != null) {
                                    var valueSplitFlag = col["valueSplitFlag"];
                                    var dataValues = [selectedCodes];
                                    if (valueSplitFlag && valueSplitFlag != null && valueSplitFlag != "") {
                                        dataValues = selectedCodes.split(valueSplitFlag);
                                    } else {
                                        valueSplitFlag = "";
                                    }
                                    if (dataValues != null && dataValues.length > 0 && comboDataSource != null && comboDataSource.length > 0) {
                                        for (var i = 0; i < dataValues.length; i++) {
                                            for (var j = 0; j < comboDataSource.length; j++) {
                                                if (comboDataSource[j][colDataValueField] == dataValues[i]) {
                                                    if (retName != null && retName != "") {
                                                        retName += valueSplitFlag;
                                                    }
                                                    retName += comboDataSource[j][colDataTextField];
                                                }
                                            }
                                        }
                                    }
                                    if (retName == null || retName == "") {
                                        retName = selectedCodes;
                                    }

                                    return retName;
                                }
                            }
                            return "";
                        };

                        if (tableOptions["editable"] == true) {
                            model.fields[col["field"]] = {
                                defaultValue: col["defaultValue"],
                                editable: col["editable"],
                                nullable: col["nullable"],
                                type: 'string',
                                validation: {
                                    required: col["required"],
                                    min: col["min"],
                                    max: col["max"]
                                }
                            };

                            if (col["editable"] == true) {
                                col.editor = function (container, options) {
                                    var input = $("<input/>");
                                    input.attr("name", options["field"]);
                                    if(col["required"] == true){
                                        input.attr("required", "required");
                                    }
                                    input.appendTo(container);
                                    if (col["selectOnly"]) {
                                        input.kendoDropDownList({
                                            dataSource: comboDataSource,
                                            dataTextField: colDataTextField,
                                            dataValueField: colDataValueField
                                        });
                                    } else {
                                        input.kendoComboBox({
                                            dataSource: comboDataSource,
                                            dataTextField: colDataTextField,
                                            dataValueField: colDataValueField
                                        });
                                    }
                                    var tooltipElement = $('<span class="k-invalid-msg" data-for="' + options.field + '"></span>');
                                    tooltipElement.appendTo(container);
                                };
                            }

                        }else{
                            model.fields[col["field"]] = {
                                type: 'string'
                            }
                        }
                    }
                    break;

                case 'STRING':
                    if (col["template"]!=undefined && col["template"]!=null) {
                        col["editable"] = false;
                    }else{
                        col.template = function (dataItem) {
                            if (dataItem[col["field"]]!=undefined && dataItem[col["field"]]!=null) {
                                return dataItem[col["field"]];
                            }else{
                                if(col["defaultValue"]!=undefined && col["defaultValue"]!=null){
                                    return col["defaultValue"];
                                }
                            }
                            return "";
                        }
                    }
                    if (tableOptions["editable"] == true) {
                        model.fields[col["field"]] = {
                            defaultValue: col["defaultValue"],
                            editable: col["editable"],
                            nullable: col["nullable"],
                            type: 'string',
                            validation: {
                                required: col["required"],
                                pattern: col["pattern"]
                            }
                        };
                    }else{
                        model.fields[col["field"]] = {
                            type: 'string'
                        }
                    }
                    break;
            }
        }
        columns.push(col);
    });

    schema = $.extend(schema, {model: model});

    if (tableOptions.srvId) {
        dataSource = $.extend(dataSource, {
            transport: {
                read: {
                    url: SERVER_URL,
                    type: "POST"
                },
                parameterMap: function (data, operation) {
                    if (operation == "read") {
                        if (tableOptions.beforeLoad) {
                            data = tableOptions.beforeLoad(data);
                        }
                        var jsonRequstParam = {
                            "param": data,
                            "busiCode": tableOptions.srvId
                        };
                        return comm.ajax.paramWrap(jsonRequstParam);
                    } else if (data.models) {
                        return JSON.stringify(data.models);
                    }
                }
            },
            batch: true
        });
        if (tableOptions.pageable == undefined || tableOptions.pageable != false) {
            dataSource = $.extend(dataSource, {
                batch: true,
                pageSize: (tableOptions.pageSize ? tableOptions.pageSize : 10),
                serverPaging: true,
                serverSorting: true
            });

            schema = $.extend(schema, {
                data: (tableOptions.schemaData ? tableOptions.schemaData : "data.list"),
                total: (tableOptions.schemaTotal ? tableOptions.schemaTotal : "data.count")
            });

            pageable = {};
            pageable = $.extend(pageable, {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            });
        } else {
            dataSource = $.extend(dataSource, {
                batch: true
            });
            schema = $.extend(schema, {
                data: (tableOptions.schemaData ? tableOptions.schemaData : "data.list"),
            });
        }
    }

    schema.parse = function (data) {//preprocess
        var fields = schema.model.fields || {};
        var path = schema.data.split(".");
        var rowDatas = data;
        for(var j = 0; j < path.length; j++){
            rowDatas = rowDatas[path[j]];
        }

        for(var p in fields){
            if(fields[p].type == 'date'){
                for(var i = 0; i < rowDatas.length; i++){
                    if(rowDatas[i][p] != null && typeof rowDatas[i][p] != 'Date'){
                        rowDatas[i][p] = new Date(rowDatas[i][p]);
                    }
                }
            }
        }
        return data;
    };
    dataSource = $.extend(dataSource, {
        schema: schema
    });

    var editable = undefined;
    if (tableOptions.editable && tableOptions.editable == true) {
        editable = {
            confirmation: false
        };
    }

    var filterable = undefined;
    if (tableOptions.filterable && tableOptions.filterable == true) {
        filterable = {
            extra: false,
            operators: {
                string: {
                    contains: "包含",
                    eq: "等于",
                    neq: "不等于",
                    startwith:"开始于",
                    endwith:"结束于"
                },
                number:{
                    eq:"等于",
                    neq:"不等于",
                    gte:"大于等于",
                    gt:"大于",
                    lte:"小于等于",
                    lt:"小于"
                },
                date:{
                    eq:"等于",
                    neg:"不等于",
                    gte:"大于等于",
                    gt:"大于",
                    lte:"小于等于",
                    lt:"小于"
                },
                enums:{
                    eq:"等于",
                    neq:"不等于"
                }
            }
        };
    }

    var grid = {
        editable: editable,
        filterable:filterable,
        dataSource: dataSource,
        height: tableOptions.height,
        sortable: tableOptions.sortable,
        autoBind: tableOptions.autoBind,
        pageable: pageable,
        columns: columns,
        selectable: tableOptions.selectable === "false" ? false : tableOptions.selectable
    };

    if (tableOptions.detailTemplate) {
        if ($("#" + tableOptions.detailTemplate) && $("#" + tableOptions.detailTemplate).length > 0) {
            grid["detailTemplate"] = kendo.template($("#" + tableOptions.detailTemplate).html());
        } else {
            grid["detailTemplate"] = kendo.template(tableOptions.detailTemplate);
        }
    }


    $("<div id='" + gridId + "' class='stripeTable'></div>").insertAfter($(target)).kendoGrid(grid);


    $("#" + gridId).data("kendoGrid").bind("dataBound", function (e) {
        //添加checkbox支持 checkbox
        if (tableOptions.checkbox != undefined && tableOptions.checkbox == true && tableOptions.selectable != "false") {

            if (tableOptions.selectable.indexOf("multiple") >= 0) {
                $("input[name=" + gridId + "_header_check]").click(function () {
                    if (this.checked == true) {
                        $("input[name=" + gridId + "_check]").each(function () {
                            this.checked = true;
                            $("#" + gridId).data("kendoGrid").select($(this).parent("td").parent("tr"));
                        });
                    } else {
                        $("input[name=" + gridId + "_check]").each(function () {
                            this.checked = false;
                            $("#" + gridId).data("kendoGrid").unSelect($(this).parent("td").parent("tr"));
                        });
                    }
                });

                $("input[name=" + gridId + "_check]").click(function () {
                    if (this.checked == true) {
                        $("#" + gridId).data("kendoGrid").select($(this).parent("td").parent("tr"));
                    } else {
                        $("#" + gridId).data("kendoGrid").unSelect($(this).parent("td").parent("tr"));
                    }
                    var allFlag = true;
                    $("input[name=" + gridId + "_check]").each(function () {
                        if (this.checked == false) {
                            allFlag = false;
                        }
                    });
                    $("input[name=" + gridId + "_header_check]").each(function () {
                        this.checked = allFlag;
                    });
                });
            } else {
                $("input[name=" + gridId + "_header_check]").each(function () {
                    this.disabled = true;
                })
            }


            $("#" + gridId).data("kendoGrid").element.on('click', '.k-grid-content tr', function () {
                $("input[name=" + gridId + "_check]").each(function () {
                    this.checked = false;
                });

                var selects = $("#" + gridId).data("kendoGrid").select();
                for (var i = 0; i < selects.length; i++) {
                    var select = selects[i];

                    $(select).children("td").children("[name=" + gridId + "_check]").each(function () {
                        this.checked = true;
                    });
                }
                var allFlag = true;
                $("input[name=" + gridId + "_check]").each(function () {
                    if (this.checked == false) {
                        allFlag = false;
                    }
                });
                $("input[name=" + gridId + "_header_check]").each(function () {
                    this.checked = allFlag;
                });
            });

        }
    });


    return $("#" + gridId).data("kendoGrid");
};

$.fn.datagrid.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};


/**
 * 导出数据
 * @param fileName
 */
kendo.ui.Grid.prototype["exportExcel"] = function (fileName, formatData) {
    var _this = this;
    var options = _this.options;
    var columns_ = options.columns;

    var columns = [];
    for (var i = 0; i < columns_.length; i++) {
        if (columns_[i].field == "ck" || columns_[i].checkbox == true) {
            continue;
        } else {
            var obj = {};
            if (columns_[i].exportable != undefined && (columns_[i].exportable == 'false' || columns_[i].exportable == false)) {
                continue;
            }
            if (columns_[i].field) {
                obj.field = columns_[i].field;
            } else {
                continue;
            }
            if (columns_[i].title) {
                obj.title = columns_[i].title;
            } else {
                obj.title = columns_[i].field;
            }
            columns.push(obj);
        }
    }

    //take: 10, skip: 0, page: 1, pageSize: 10
    var param = {"pageSize": "-1"};
    param = options.dataSource.transport.parameterMap(param, "read").data;

    if (formatData === undefined) {
        formatData = {};
    }

    kendo.ui.progress($(_this.element), true, "正在导出...");
    //正在导出
    $.post(PROJECT_URL + "/commonWebController/exportToExcel", {
            'columns': encodeURI(encodeURI(JSON.stringify(columns))),
            'formatData': encodeURI(encodeURI(JSON.stringify(formatData))),
            'param': encodeURI(encodeURI(param)),
            'schemaData': options.dataSource ? (options.dataSource.schema ? (options.dataSource.schema.data ? options.dataSource.schema.data : "") : "" ) : "",
            'excelType': "XLS"
        }, function (data) {
            kendo.ui.progress($(_this.element), false);
            if (data.status == "1") {
                comm.dialog.notice({
                    type:comm.dialog.type.error,
                    position:"center",
                    content:"导出excel失败！"+data.message,
                    timeout:2000
                });
            } else {
                comm.dialog.notice({
                    type:comm.dialog.type.success,
                    position:"center",
                    content:"导出成功！",
                    timeout:2000
                });
                window.location.href = PROJECT_URL + "/commonWebController/downloadExcel?"
                + "filePath=" + encodeURI(encodeURI(data.filePath))
                + "&excelType=XLS"
                + "&fileName=" + encodeURI(encodeURI(fileName));
            }
        }
    );
};

/**
 * getChanged 获取改变数据
 * @returns {{}}
 */
kendo.ui.Grid.prototype.getChanged = function () {
    var that = this,
        idx,
        length,
        reObj = {},
        created = [],
        updated = [],
        destroyed = [],
        data = that._data;
    for (idx = 0, length = data.length; idx < length; idx++) {
        if (data[idx].isNew()) {
            created.push(data[idx]);
        } else if (data[idx].dirty) {
            updated.push(data[idx]);
        }
    }
    for (idx = 0, length = that.dataSource._destroyed.length; idx < length; idx++) {
        destroyed.push(that.dataSource._destroyed[idx]);
    }

    reObj.created = created;
    reObj.updated = updated;
    reObj.destroyed = destroyed;
    return reObj;
};


/**
 * 加载数据
 * @param parm
 */
kendo.ui.Grid.prototype["load"] = function () {
    var that = this;
    if (that.options.pageable) {
        that.dataSource.page(1);
    } else {
        that.dataSource.read();
    }
    //that.dataSource.read()
};

/**
 * 获取选中行 多行
 * @returns {Array}
 */
kendo.ui.Grid.prototype["getSelects"] = function () {
    var that = this;
    var data = [];
    var selects = that.select();
    for (var i = 0; i < selects.length; i++) {
        data.push(that.dataItem(selects[i]));
    }
    return data;
};

/**
 * 获取选中行 单行
 * @returns {{}}
 */
kendo.ui.Grid.prototype["getSelect"] = function () {
    var that = this;
    var data = {};
    var selects = that.select();
    if (selects.length > 0) {
        data = that.dataItem(selects[0]);
    }
    return data;
};


/**
 * 设置指定行的背景颜色
 * @param rowIndex 行号，从0开始
 * @param color
 */
kendo.ui.Grid.prototype["setRowBgColor"] = function (rowIndex, color) {
    //grid.select("tr:eq(1), tr:eq(2)");
};


/**
 * 双击事件
 * @param callback
 */
kendo.ui.Grid.prototype["dbclick"] = function (callback) {
    var that = this;
    that.element.on('dblclick', '.k-grid-content tr', function () {
        if (callback && typeof callback === 'function') {
            callback(that.getSelect(), this);
        }
    });
};

/**
 * 单击事件 xiaoke
 * @param callback
 */
kendo.ui.Grid.prototype["click"] = function (callback) {
    var that = this;
    that.element.on('click', '.k-grid-content tr', function () {
        if (callback && typeof callback === 'function') {
            callback(that.getSelect(), this);
        }
    });
};

/**
 * 删除选中行或按照rowNumber删除
 * @param rowNumber
 */
kendo.ui.Grid.prototype["removeRow"] = function (rowNumber) {
    var that = this;
    var row = undefined;
    if (rowNumber && typeof rowNumber === "number") {
        row = "tr:eq(" + (rowNumber + 1) + ")";
    } else {
        if (rowNumber === undefined) {
            if (that.select().length > 0) {
                row = that.select()[0];
            }
        } else {
            row = rowNumber;
        }
    }
    if (row !== undefined) {
        if (!this._confirmation(row)) {
            return;
        }
        this._removeRow(row);
    }
};


/**
 * 添加数据
 * @param data
 */
kendo.ui.Grid.prototype["addData"] = function (data) {
    var that = this;
    that.dataSource.add(data);
};

/**
 * 设置数据
 * @param data
 */
kendo.ui.Grid.prototype["data"] = function (data) {
    var that = this;
    that.dataSource.data(data);
};


/**
 * 获取表格中的全部数据
 * @returns {*}
 */
kendo.ui.Grid.prototype["getData"] = function () {
    var that = this;
    return that.dataSource.data();
};


/**
 * 取消选中
 * @param items
 */
kendo.ui.Grid.prototype["unSelect"] = function (items) {
    var that = this,
        selectable = that.selectable;
    items = $(items);
    if (items.length) {
        selectable._unselect(items)
    }
};

/**
 * 行是否已展开
 * @param tr
 */
kendo.ui.Grid.prototype["isRowExpanded"] = function (tr) {
    if ($(tr).find('> td .k-plus, > td .k-i-expand').length > 0) {
        return false;
    }
    return true;
};

/**
 * @author zhangrp
 * Created on 2016/1/12 10:36
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * 【示例】
 *  <input class="aiui-datebox" id="startDate" type="date或者datetime" data-options="format:'yyyy-MM-dd HH:mm:ss'" />
 *
 *
 * 【属性】
 *  type: date、datetime
 *  format：日期格式化，yyyy-MM-dd HH:mm:ss
 *         yyyy：年
 *         MM：月
 *         dd：日
 *         HH：小时
 *         mm：分
 *         ss：秒
 *         default；yyyy-MM-dd or yyyy-MM-dd HH:mm:ss
 *
 *
 * 【方法】
 *  max: set/get max value
 *  min: set/get min value
 *  value: set/get Value
 *
 *
 * 【事件】
 *  change: 值改变事件，$("#id").datebox().bind('change', functione(){todo;});
 *
 */

$.fn.datebox = function () {
    var that = this;
    var target = that[0];
    if ($(target).is("input") == false) {
        return;
    }
    if ($.data(target, 'datebox')) {
        var kendoType = $.data(target, 'datebox');
        return $(target).data(kendoType);
    }
    return $.fn.datebox.create(target);
};

$.fn.datebox.create = function (target) {
    var options = $.fn.datebox.parseOptions(target, {
        type: 'date'
    }, {
        format: "string",
        type: "string"
    });

    var kendoType = "";
    if (options.type == "date") {
        $(target).kendoDatePicker({
            animation: false,
            format: options.format ? options.format : "yyyy-MM-dd"
        });
        kendoType = "kendoDatePicker";
    } else if (options.type == "datetime") {
        $(target).kendoDateTimePicker({
            format: options.format ? options.format : "yyyy-MM-dd HH:mm:ss"
        });
        kendoType = "kendoDateTimePicker";
    }
    $.data(target, 'datebox', kendoType);
    return $(target).data(kendoType);
};

$.fn.datebox.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};
/**
 * @author zhangrp
 * Created on 2016/1/12 10:37
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * form表单
 * 属性
 *editable: 是否可编辑
 *initial: 是否需要初始化数据,如果为true，调用beforeQuery获取参数，调用querySrvId获取数据，调用AfterQuery方法设置返回的数据到form中
 *
 *
 * 方法
 * setData: 设置form中各个元素的数据
 * getData: 获取form中各个元素的数据
 *
 *
 *
 * 事件
 *
 *
 *
 */

$.fn.form = function () {
    var that = this;
    var target = that[0];
    if ($.data(target, 'form')) {
        return $.data(target, 'form');
    }
    return $.fn.form.create(target);
};

$.fn.form.create = function (target) {
    var options = $.fn.form.parseOptions(target, {
        editable: true,
        initial: false,
        schemaData: "data",
        autoBind: true
    }, {
        editable: "boolean",
        initial: "boolean",
        srvId: "string",
        schemaData: "string",
        autoBind: "boolean"
    });

    //如果from设置的不可编辑，需要将form中所有包含的元素改为不可编辑
    if (!options.editable) {
        $(target).find(":input").attr("disabled", "true");
    }

    var from = {};
    from.id = $(target).attr("id") ? $(target).attr("id") : new Date().getTime();
    from.options = options;
    from.target = target;
    $.extend(from, $.fn.form.methods);
    $.data(target, 'form', from);


    if (options.srvId) {
        if (options.autoBind == true) {
            from.load();
        }
    }
    return from;
};

$.fn.form.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};

$.fn.form.methods = {

    load: function () {
        var that = this;
        var options = that.options;

        var data;
        if (options.beforeQuery) {
            data = options.beforeQuery(data);
        }
        comm.ajax.ajaxEntity({
            param: data,
            busiCode: options.srvId,
            sync: true,
            callback:function (data) {
                var schema_data = options.schemaData.split(".");
                for (var i = 0; i < schema_data.length; i++) {
                    data = data[schema_data[i]];
                }
                if (options.afterQuery) {
                    data = options.afterQuery(data);
                }
                that.setData(data);
            }
        });
    },

    /**
     * 从form中获取值，如果传了ID通过ID取值；如果没有传值则返回form所有的值
     * @param id
     * @returns {*}
     */
    getData: function (id) {
        if (id && $("#" + id)) {
            var target = $("#" + id);
            var value = "";
            if(target!=undefined && target!=null) {
                if (target.hasClass("aiui-combobox")) {
                    value = target.combobox().value();
                    if(comm.lang.isArray(value)) {
                        //判断是否有分割符
                        var valueSplitFlag = target.attr("valueSplitFlag");
                        if (valueSplitFlag && valueSplitFlag != null && valueSplitFlag != "") {
                            value = value.join(valueSplitFlag);
                        }
                    }
                } else if (target.hasClass("aiui-address")) {
                    value = target.address().value();
                } else {
                    value = target.val();
                }
            }
            return value;
        } else {
            var obj = {};
            var that = this;
            var inputs = $(this.target).find(":input[role!='listbox']");
            if(inputs!=null && inputs.length>0){
                for(var i=0;i<inputs.length;i++){
                    if(!$(inputs[i]).hasClass("aiui-combobox")) {
                        var id = $(inputs[i]).attr("id");
                        if (comm.lang.isEmpty(id)) {
                            id = $(inputs[i]).attr("name");
                        }
                        obj[id] = $(inputs[i]).val();
                    }
                }
            }
            var selects = $(this.target).find("select");
            if(selects!=null && selects.length>0){
                for(var i=0;i<selects.length;i++){
                    var id = $(selects[i]).attr("id");
                    if(comm.lang.isEmpty(id)){
                        id = $(selects[i]).attr("name");
                    }
                    var value = $(selects[i]).combobox().value();
                    if(comm.lang.isArray(value)) {
                        //判断是否有分割符
                        var valueSplitFlag = $(selects[i]).attr("valueSplitFlag");
                        if (valueSplitFlag && valueSplitFlag != null && valueSplitFlag != "") {
                            value = value.join(valueSplitFlag);
                        }
                    }
                    obj[id] = value;
                }
            }
            var address = $(this.target).find(".aiui-address");
            if(address!=null && address.length>0){
                for(var i=0;i<address.length;i++){
                    var id = $(address[i]).attr("id");
                    if(comm.lang.isEmpty(id)){
                        id = $(address[i]).attr("name");
                    }
                    obj[id] = $(address[i]).address().value();
                }
            }
            return obj;
        }
    },

    /**
     * 设置form的值
     * @param id
     * @param value
     * @returns {boolean}
     */
    setData: function (id, value) {
        if (typeof id == 'string' && value != undefined && $("#" + id)) {
            var target = $("#" + id);
            if(target.hasClass("aiui-combobox")){
                //判断是否有分割符
                var valueSplitFlag = target.attr("valueSplitFlag");
                if (valueSplitFlag && valueSplitFlag != null && valueSplitFlag != "") {
                    value = value.split(valueSplitFlag);
                }else{
                    value = eval(value);
                }
                target.combobox().value(value);
            }else if(target.hasClass("aiui-address")){
                target.address().value(value);
            }else{
                target.val(value);
            }
        } else if (typeof id == 'string' && value == undefined) {
            try {
                var id = $.parseJSON(id);
                $.each(id, function (key, value) {
                    var target = $("#" + key);
                    if(target.hasClass("aiui-combobox")){
                        //判断是否有分割符
                        var valueSplitFlag = target.attr("valueSplitFlag");
                        if (valueSplitFlag && valueSplitFlag != null && valueSplitFlag != "") {
                            value = value.split(valueSplitFlag);
                        }
                        target.combobox().value(value);
                    }else if(target.hasClass("aiui-address")){
                        target.address().value(value);
                    }else{
                        target.val(value);
                    }
                });
            } catch (e) {

            }
        } else if (typeof id == 'object') {
            $.each(id, function (key, value) {
                var target = $("#" + key);
                if(target.hasClass("aiui-combobox")){
                    //判断是否有分割符
                    var valueSplitFlag = target.attr("valueSplitFlag");
                    if (valueSplitFlag && valueSplitFlag != null && valueSplitFlag != "") {
                        value = value.split(valueSplitFlag);
                    }else{
                        value = eval(value);
                    }
                    target.combobox().value(value);
                }else if(target.hasClass("aiui-address")){
                    target.address().value(value);
                }else{
                    target.val(value);
                }

            });
        }
    },

    /**
     * 设置form是否可编辑
     * @param disabled：true--整个form里的内容不可编辑，false-整个form里的内容可编辑
     */
    setFormDisabled: function(disabled) {
        var that = this;
        if (disabled) {
            $(that.target).find(":input").attr("disabled", "true");
            $(that.target).find("select").each(function(){
                $(this).combobox().enable(false);
            });
            $(that.target).find(":input.aiui-datebox").each(function(){
                $(this).datebox().enable(false);
            });
        } else {
            $(that.target).find(":input").removeAttr("disabled");
            $(that.target).find("select").each(function(){
                $(this).combobox().enable(true);
            });
            $(that.target).find(":input.aiui-datebox").each(function(){
                $(this).datebox().enable(true);
            });
        }
    },

    /**
     * 设置某个元素是否可编辑
     * @param id：元素Id
     * @param disabled:true--该元素内容不可编辑，false-该元素内容可编辑
     */
    setDisabled: function (id, disabled) {
        var that = this;
        if (disabled) {
            $(that.target).find("[id=" + id + "]").attr("disabled", "true");
        } else {
            $(that.target).find("[id=" + id + "]").attr("disabled", "false");
        }
    },
    /**
     * 为所有录入要素添加事件，校验输入值是否正确
     * */
    blurValidate:function(){
        $(this.target).find(":input").each(function(){
            var validationType = $(this).attr("validationType");
            var validationMessage = $(this).attr("validationMessage");
            if(!comm.lang.isEmpty(validationType)){
                $(this).bind("blur",function(){
                    var validationTypes = validationType.split(",");
                    if(validationTypes!=null && validationTypes.length>0) {
                        for (var i = 0; i < validationTypes.length; i++) {
                            if(!comm.lang.isEmpty(validationTypes[i])) {
                                if (!comm.validate.validate($(this), comm.validate.regexp[validationTypes[i]])) {
                                    if (!comm.lang.isEmpty(validationMessage)) {
                                        comm.dialog.notice({
                                            type: comm.dialog.type.error,
                                            content: validationMessage,
                                            position: "center",
                                            timeout: 800
                                        })
                                    }
                                    return false;
                                }
                            }
                        }
                    }
                });
            }
        });

        $(this.target).find("select").each(function(){
            var validationType = $(this).attr("validationType");
            var validationMessage = $(this).attr("validationMessage");
            if(!comm.lang.isEmpty(validationType)){
                $(this).bind("blur",function(){
                    var value = $(this).combobox().value();
                    var validationTypes = validationType.split(",");
                    if(validationTypes!=null && validationTypes.length>0){
                        for(var i=0;i<validationTypes.length;i++){
                            if(!comm.lang.isEmpty(validationTypes[i])) {
                                if (!comm.validate.checkReg(comm.validate.regexp[validationTypes[i]], value)) {
                                    if (!comm.lang.isEmpty(validationMessage)) {
                                        comm.dialog.notice({
                                            type: comm.dialog.type.error,
                                            content: validationMessage,
                                            position: "center",
                                            timeout: 800
                                        })
                                    } else {
                                        comm.validate.validateError($(this));
                                    }
                                    return false;
                                }
                            }
                        }
                    }
                });
            }
        });
    },
    validate:function(){
        var inputVals = $(this.target).find(":input");
        if(inputVals!=null && inputVals.length>0){
            for(var i=0;i<inputVals.length;i++){
                var validationType = $(inputVals[i]).attr("validationType");
                var validationMessage = $(inputVals[i]).attr("validationMessage");
                if(!comm.lang.isEmpty(validationType)){
                    var validationTypes = validationType.split(",");
                    if(validationTypes!=null && validationTypes.length>0) {
                        for (var j = 0; j < validationTypes.length; j++) {
                            if(!comm.lang.isEmpty(validationTypes[j])) {
                                if (!comm.validate.validate($(inputVals[i]), comm.validate.regexp[validationTypes[j]])) {
                                    comm.dialog.notice({
                                        type: comm.dialog.type.error,
                                        content: validationMessage,
                                        position: "center",
                                        timeout: 800
                                    })
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }

        var selectVals = $(this.target).find("select");
        if(selectVals!=null && selectVals.length>0){
            for(var i=0;i<selectVals.length;i++){
                var validationType = $(selectVals[i]).attr("validationType");
                var validationMessage = $(selectVals[i]).attr("validationMessage");
                if(!comm.lang.isEmpty(validationType)){
                    var value = $(selectVals[i]).combobox().value();
                    var validationTypes = validationType.split(",");
                    if(validationTypes!=null && validationTypes.length>0){
                        for(var j=0;j<validationTypes.length;j++){
                            if(!comm.lang.isEmpty(validationTypes[j])) {
                                if (!comm.validate.checkReg(comm.validate.regexp[validationTypes[j]], value)) {
                                    if (!comm.lang.isEmpty(validationMessage)) {
                                        comm.dialog.notice({
                                            type: comm.dialog.type.error,
                                            content: validationMessage,
                                            position: "center",
                                            timeout: 800
                                        })
                                    } else {
                                        comm.validate.validateError($(selectVals[i]));
                                    }
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
};



/////////////////////////////////////////////////////////////////////



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


            var Ajaxoptions = {
                "param": {"MODULE_ID": "1","CMT_TARGET_ID": options.cmtTargetId},
                "busiCode": "ICFGCMTBASICFSV_GETCMTITEMINFO",
                "moduleName": "common",
                "sync": false,
                "callback": function (data, isSucc, msg) {
                    // var retCode = data.errorInfo.code;
                    if (data.data != null ) {
                        var _cmt_info = data.data;
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
                        var htmlId = options.id?options.id:""+(new Date()).getTime();
                        var containCMT = $("<div class='cmt_home'></div>").appendTo(element);
                        var clickHtml = "<div class = 'fl cmt-pl' id = '"+htmlId+"'>评论</div>";
                        var _clickObj = $(clickHtml).appendTo(containCMT);
                        var showCmtHtml = "<div class = 'clearfix cmt-pl-box'></div>";
                        var cmtCxtObj = $(showCmtHtml).appendTo(containCMT);
                        //给评论按钮附上点击事件
                        _clickObj.on('click', {changeObj:cmtCxtObj}, proxy(that.changeCmtOpt, that));
                    }else{
                        //不需要处理评论
                        var retMsg = data.data.errorInfo.message;
                        that._showError(retMsg);
                    }



                    var Ajaxoptions = {
                        "param": {"outNbrId": options.out_nbr_id,"cmtTargetId": options.cmtTargetId},
                        "busiCode": "ICFGCMTINSTFSV_GETCMTITEMCOUNT",
                        "moduleName": "common",
                        "sync": false,
                        "callback": function (data, isSucc, msg) {
                            var listCount = null;
                            if(data["data"]){
                                listCount = data.data;
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
                    comm.ajax.ajaxEntity(Ajaxoptions);
                }
            }
            comm.ajax.ajaxEntity(Ajaxoptions);

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

                var Ajaxoptions = {
                    "param": checkData,
                    "busiCode": "ICFGCMTINSTFSV_CHECKOPERATORHASCMT",
                    "moduleName": "common",
                    "sync": false,
                    "callback": function (data, isSucc, msg) {
                        if(data && data["data"]){
                            if(data["data"] && (data["data"]==true||data["data"]=='true')){
                                selectItemId = itemId;
                            }
                        }
                    }
                }
                comm.ajax.ajaxEntity(Ajaxoptions);

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
                var Ajaxoptions = {
                    "param": paramData,
                    "busiCode": "ICFGCMTBASICFSV_SAVECMTCXTINST",
                    "moduleName": "common",
                    "sync": false,
                    "callback": function (data, isSucc, msg) {
                        if(!isSucc){
                            var msg = data.errorInfo.message;

                            comm.dialog.notice({
                                type:comm.dialog.type.error,
                                position:"center",
                                content:msg,
                                timeout:2000
                            });
                        }else{
                            comm.dialog.notice({
                                type:comm.dialog.type.success,
                                position:"center",
                                content:msg,
                                timeout:2000
                            });
                            //先清除输入的内容
                            if(that.options.showTitle === true || that.options.showTitle === "true"){
                                $("#"+that.options.titleId+"_value").val("");
                            }
                            $("#"+that.options.cxtId+"_value").val("");
                            //提交成功后重新加载评论
                            comm.dialog.notice({
                                type:comm.dialog.type.success,
                                position:"center",
                                content:"提交成功",
                                timeout:2000
                            });
                        }
                    }
                }
                comm.ajax.ajaxEntity(Ajaxoptions);
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

            var Ajaxoptions = {
                "param": queryData,
                "busiCode": that.options.cmtQueSrvId,
                "moduleName": "common",
                "sync": false,
                "callback": function (data, isSucc, msg) {
                    if(data==null || data.length==0){
                        var showMoreDetail = $("<div class='cmt-cxt-more'><span>没有更多，请重新尝试~</span></div>").appendTo(appendObj);
                        showMoreDetail.on('click', {obj:appendObj,removeObj:showMoreDetail}, proxy(that._appendQueryHistoryList, that));
                    }else{
                        var historyList = data.data;
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
                                    var Ajaxoptions = {
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
                                    comm.ajax.ajaxEntity(Ajaxoptions);
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
                                    var Ajaxoptions = {
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
                                    comm.ajax.ajaxEntity(Ajaxoptions);
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
            comm.ajax.ajaxEntity(Ajaxoptions);
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

            var Ajaxoptions = {
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
            comm.ajax.ajaxEntity(Ajaxoptions);
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
            var Ajaxoptions = {
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
            comm.ajax.ajaxEntity(Ajaxoptions);

        },

        options: {
            name: "AICxtCMT",
        }
    });

    ui.plugin(AICxtCMT);

})(jQuery);







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
         *\ 点击事件
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




////////////////////////////////////////////////////////////////////////////////////////////



/**
 * @author zhangrp
 * Created on 2015/9/17 14:40
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * tab组件
 *
 * 属性
 *
 *
 *
 *
 * 方法
 *  isExist: 根据title判断某个tab是否存在
 *  selectByTitle: 根据title选中某个tab
 *
 *
 * 事件
 *
 *
 *
 */


$.fn.tabstrip = function () {
    var that = this;
    var target = that[0];


};

$.fn.tabstrip.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};


/**
 * 根据title判断某个tab是否存在
 * @param title
 * @returns {boolean}
 */
kendo.ui.TabStrip.prototype.isExist = function(title){
    var that = this;
    var isExist = false;
    $(that.items()).each(function () {
        var title_ = $(this).find(".k-link").text();
        if (title.indexOf(">" + title_ + "<") >= 0 || title.indexOf(">" + title_) >= 0 || title.indexOf(title_ + "<") >= 0 || title == title_) {
            isExist = true;
        }
    });
    return isExist;
};

/**
 * 根据标题选中某个tab
 * @param title
 */
kendo.ui.TabStrip.prototype.selectByTitle = function(title){
    var that = this;
    $(that.items()).each(function () {
        var title_ = $(this).find(".k-link").text();
        if (title.indexOf(">" + title_ + "<") >= 0 || title.indexOf(">" + title_) >= 0 || title.indexOf(title_ + "<") >= 0 || title == title_) {
            that.select($(this));
        }
    });
};
/**
 * @author zhangrp
 * Created on 2016/1/25 14:00
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * textbox
 * 属性
 *  editable 是否可编辑
 *  multiline 是否多行，默认false
 *
 *  type：string,number,boolean,email
 *  required
 *  min
 *  max
 *  pattern
 *
 * 方法
 *
 *
 *
 * 事件
 *
 *
 *
 */

$.fn.textbox = function () {
    var that = this;
    var target = that[0];
    if ($(target).is("input") == false) {
        return;
    }
    if ($.data(target, 'textbox')) {
        var kendoType = $.data(target, 'textbox');
        return $(target).data(kendoType);
    }
    return $.fn.datebox.create(target);
};

$.fn.textbox.create = function (target) {
    var options = $.fn.datebox.parseOptions(target, {
        type: 'string',
        required: 'false'
    }, {
        type: "string",
        required: "boolean",
        min: "number",
        max: "number",
        pattern: "string"
    });

    //TODO

};

$.fn.textbox.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};
/**
 * @author zhangrp
 * Created on 2015/9/25 15:17
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */

/**
 * tree 树
 *  <div class="aiui-tree" id="xxxx" data-options="srvId:'IEXAMPLEFSV_GETSUBORGANIZATIONTREE',dataTextField:'functionName',dataHasChildrenField:'hasChildrenField',dataIdField:'funcId',checked:'checked'" >
 * 属性
 *  animation: Boolean (defualt false)
 *  autoBind: Boolean (default: true)
 *  loadOnDemand: Boolean (default: false)
 *  template: String| Function
 *
 *
 *  checkboxes: Boolean (defualt false)
 *  checkChildren: Boolean(default: false)
 *  checkboxesName: String, Sets the name attribute of the checkbox inputs. That name will be posted to the server.
 *  checkboxesTemplate: String |Function
 *
 *
 *  dataImageUrlField: String (default: null)
 *  dataSpriteCssClassField: String (default: null)
 *  dataTextField: String |Array (default: null), 有多个时用array
 *  dataUrlField: String (default: null)
 *  dataIdField: String
 *  dataHasChildrenField: string
 *
 *  srvId:
 *
 * 方法
 *  getSelect: 获取选择的树节点
 *
 *
 * 事件
 *  select
 *  change
 *
 */

$.fn.tree = function () {
    var that = this;
    var target = that[0];

    if ($.data(target, 'tree')) {
        return $(target).data("kendoTreeView");
    }
    return $.fn.tree.create(target);
};

$.fn.tree.create = function ( target) {
    var options = $.fn.tree.parseOptions(target, {
        animation: false,
        autoBind: true,
        loadOnDemand: true,
        checkboxes: false,
        checkChildren: false
    }, {
        animation: 'boolean',
        autoBind: 'boolean',
        loadOnDemand: 'boolean',
        template: 'string',
        checkboxes: 'boolean',
        checkChildren: 'boolean',
        checkboxesName: 'string',
        checkboxesTemplate: 'string',

        dataImageUrlField: 'string',
        dataSpriteCssClassField: 'string',
        dataTextField: 'string',
        dataUrlField: 'string',
        dataIdField: 'string',
        dataHasChildrenField: 'string',

        srvId: "string",
        schemaData: 'string'
    });

    var dataSource = {};
    if (options.srvId) {
        dataSource = $.extend(dataSource, {
            transport: {
                read: {
                    url: SERVER_URL,
                    type: "POST"
                },
                parameterMap: function (data) {
                    if (options.beforeLoad) {
                        data = options.beforeLoad(data);
                    }
                    var jsonRequstParam = {
                        "param":data,
                        "busiCode": options.srvId
                    };
                    return comm.ajax.paramWrap(jsonRequstParam);
                }
            },
            batch: true
        });
        dataSource = $.extend(dataSource, {
            batch: true,
            schema: {
                data: (options.schemaData ? options.schemaData : "data"),
                model: {
                    id: options.dataIdField,
                    hasChildren: options.dataHasChildrenField
                }
            }
        });
    }

    var id = $(target).attr("id") ? $(target).attr("id") : new Date().getTime();
    $.data(target, 'tree', id);

    if(options.checkChildren == true || options.checkboxesName || options.checkboxesTemplate){
        options.checkboxes = true;
    }
    var tree = {
        animation: options.animation,
        autoBind: options.autoBind,
        loadOnDemand: options.loadOnDemand,
        dataImageUrlField: options.dataImageUrlField,
        dataSpriteCssClassField: options.dataSpriteCssClassField,
        dataTextField: options.dataTextField,
        dataUrlField: options.dataUrlField,
        dataSource: dataSource,
        checkboxes: (options.checkboxes == true ? {
            checkChildren: options.checkChildren,
            name: options.checkboxesName,
            template: options.checkboxesTemplate
        } : false)
    };
    $(target).kendoTreeView(tree);
    return $(target).data("kendoTreeView");
};


$.fn.tree.parseOptions = function (target, options, properties) {
    options = options || {};
    properties = properties || {};
    return $.extend(options, $.parser.parseOptions(target, [properties]));
};

/**
 * 获取选择的树节点
 * @returns {{}}
 */
kendo.ui.TreeView.prototype["getSelect"] = function () {
    var that = this;
    var uid = that.select().attr("data-uid");
    var _target = {};
    if (uid) {
        var _data = that.dataSource._data;
        var _flag = true;
        while (_flag && _data.length > 0) {
            var _p_data = [];
            for (var i = 0; i < _data.length; i++) {
                if (_data[i].uid === uid) {
                    _target = _data[i];
                    _flag = false;
                } else if (_data[i].children && _data[i].children._data && _data[i].children._data.length > 0) {
                    for (var k = 0; k < _data[i].children._data.length; k++) {
                        _p_data.push(_data[i].children._data[k]);
                    }
                }
            }
            _data = _p_data;
        }
    }
    return _target;
};

function checkedNodeIds(nodes, checkedNodes) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            //add by zhangch6
            var obj = nodes[i];
            var result = {};
            for(var p in obj){
                if ( typeof (obj[p]) == "function" || typeof (obj[p]) == "object"){
                    continue;
                }
                result[p] = obj[p];
            }
            //end add by zhangch6
           //var result = { parentId: nodes[i].parentId, funcId: nodes[i].funcId, functionName: nodes[i].functionName};
            checkedNodes.push(result);
        }
        if (nodes[i].hasChildren) {
            checkedNodeIds(nodes[i].children.view(), checkedNodes);
        }
    }
}

/**
 * 多选的情况下使用
 */
kendo.ui.TreeView.prototype["getSelects"] = function () {
    var that = this;
    var checkedNodes = [];
    checkedNodeIds(that.dataSource.view(), checkedNodes);
    return checkedNodes;
};

/**
 * @author zhangrp
 * Created on 2015/9/17 10:01
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */


/**
 * ui 基础控件
 *
 * aiui.progress
 *     进度条
 *
 * aiui.notification
 *     提示框
 *
 * aiui.prompt
 *     确认框
 *
 * aiui.window
 *     弹出指定url的页面
 *
 */

$.extend(
    kendo.ui, {
        progress____: function (container, toggle, title) {
            if (!title) {
                title = "数据加载中..."
            }
            var mask = container.find(".k-loading-mask"),
                support = kendo.support,
                browser = support.browser,
                isRtl, leftRight, webkitCorrection, containerScrollLeft;
            if (toggle) {
                if (!mask.length) {
                    isRtl = support.isRtl(container);
                    leftRight = isRtl ? "right" : "left";
                    containerScrollLeft = container.scrollLeft();
                    webkitCorrection = browser.webkit ? (!isRtl ? 0 : container[0].scrollWidth - container.width() - 2 * containerScrollLeft) : 0;
                    container.css("position", "relative");
                    mask = $("<div class='k-loading-mask'><div class='k-loading-image'><div class='k-loading-text'>" + title + "</div></div><div class='k-loading-color'/></div>")
                        .width("100%").height("100%")
                        .css("top", container.scrollTop())
                        .css(leftRight, Math.abs(containerScrollLeft) + webkitCorrection)
                        .prependTo(container);
                }
            } else if (mask) {
                mask.remove();
            }
        },
        notification: function (showType, title, message, type, callback, options) {
            if (showType != "0" && showType != 0) {
                showType = "alert";
            } else {
                showType = "notice"
            }

            if (type) {
                if (type != "info" && type != "error" && type != "success" && type != "warning" && type != "confirm") {
                    type = "info";
                }
            } else {
                type = "info";
            }
            if (type == "warning") {
                type = "warn";
            }
            if (type == "confirm") {
                options = options || {cancel: true};
            } else {
                options = options || {cancel: false};
            }
            if (showType === "alert") {
                var container = $(window.document.body);
                var mask = container.find(".k-notification-mask");
                if (mask) {
                    mask.remove();
                }
                var box = "<div class='box " + type + "'>" +
                    "    <div class='box-title'>" + title + "</div>" +
                    "    <p>" + message + "</p>" +
                    "    <input type='button' value='确定' name='confirm' >" +
                    (options.cancel == true ? " <input type='button' value='取消' name='cancel'>" : "") +
                    "</div>";
                mask = $('<div class="k-notification-mask"><div class="mask" style="height: ' + $(window.document).height() + 'px"></div>' + box + '</div>')
                    .width("99%")
                    .height($(window.document).height())
                    .prependTo(container);
                container.find(".k-notification-mask input[type=button]").click(function () {
                    container.find(".k-notification-mask").remove();
                    if (callback) {
                        if ($(this).val() == "确定") {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    }
                });
            } else if (showType === "notice") {
                if (type == "warn") {
                    type = "warning";
                }
                var container = $(window.document.body);
                var mask = container.find(".k-notification-no-mask-span");
                if (mask && mask.length > 0) {
                    var notification = $(mask[0]).data("notification");
                    notification.show({
                        title: title,
                        message: message,
                        options: options
                    }, type);
                } else {
                    mask = $('<span class="k-notification-no-mask-span"></span>').prependTo(container);
                    var box = "<div class='box-title'>#=title#</div>" +
                        "<p>#=message#</p>";
                    /*"<div style='text-align: center;'>#if(options.confirm == true){ # <input type='button' value='确定' name='confirm' >" +" #}#" +
                     "#if(options.cancel == true){  # <input type='button' value='取消' name='cancel' >" +" #}#</div>" ;*/

                    var notification = $(mask).kendoNotification({
                        position: {
                            pinned: true,
                            top: 155,
                            right: 30
                        },
                        autoHideAfter: 5000,
                        stacking: "down",
                        button: true,
                        hideOnClick: true,
                        templates: [{
                            type: "info",
                            template: "<div class='k-notification-no-mask' style='height: 107px'><div class='box info'>" + box + "</div></div>"
                            //template: "#var notificationHeight = 107 + (options.confirm || options.cancel ? 42 : 0);#<div class='k-notification-no-mask' style='height: #=notificationHeight#px'><div class='box info'>" + box + "</div></div>"
                        }, {
                            type: "error",
                            template: "<div class='k-notification-no-mask' style='height: 107px'><div class='box error'>" + box + "</div></div>"
                            //template: "#var notificationHeight = 107 + (options.confirm || options.cancel ? 42 : 0);#<div class='k-notification-no-mask' style='height: #=notificationHeight#px'><div class='box error'>" + box + "</div></div>"
                        }, {
                            type: "success",
                            template: "<div class='k-notification-no-mask' style='height: 107px'><div class='box success'>" + box + "</div></div>"
                            //template: "#var notificationHeight = 107 + (options.confirm || options.cancel ? 42 : 0);#<div class='k-notification-no-mask' style='height: #=notificationHeight#px'><div class='box success'>" + box + "</div></div>"
                        }, {
                            type: "warning",
                            template: "<div class='k-notification-no-mask' style='height: 107px'><div class='box warn'>" + box + "</div></div>"
                            //template: "#var notificationHeight = 107 + (options.confirm || options.cancel ? 42 : 0);#<div class='k-notification-no-mask' style='height: #=notificationHeight#px'><div class='box warning'>" + box + "</div></div>"
                        }]
                    }).data("kendoNotification");
                    $(mask).data("notification", notification);
                    notification.show({
                        title: title,
                        message: message,
                        options: options
                    }, type);
                }
            }

        },
        prompt: function (title, message, callback, defaultText) {
            var container = $(window.document.body);
            var mask = container.find(".k-notification-mask");
            if (mask) {
                mask.remove();
            }
            if (!defaultText) {
                defaultText = "";
            }
            var box = "<div class='box confirm'>" +
                "    <div class='box-title'>" + title + "</div>" +
                "    <p>" + message + "<input class='k-textbox' type='text' value='" + defaultText + "'></p>" +
                "    <input type='button' value='确定' name='confirm'>" +
                "    <input type='button' value='取消' name='cancel'>" +
                "</div>";
            mask = $('<div class="k-notification-mask">' + '<div class="mask" style="height: ' + $(window.document).height() + 'px"></div>' + box + '</div>')
                .height($(window.document).height())
                .width("99%")
                .prependTo(container);
            container.find(".k-notification-mask input[type=button]").click(function () {
                var input = container.find(".k-notification-mask input[type=text]").val();
                container.find(".k-notification-mask").remove();
                if (callback) {
                    if ($(this).val() == "确定" && input) {
                        callback(input);
                    } else {

                    }
                }
            });
        }
    });
var aiui = kendo.ui;
/**
 * @author zhangrp
 * Created on 2016/3/27 15:07
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 */

var aiwindow;
(function ($) {
    $.extend(
        kendo.ui, {
            window: function (options) {
                var current = window;
                var container = $(current.document.body);

                var _id = new Date().getTime();
                var aiwin_id = "aiwin_" + _id;
                var aiwin_iframe_id = "aiwin_iframe_" + _id;
                var allAction = ["Minimize", "Maximize", "Close"];
                //mod by zhangch6
                if(options.isHasClose==false){
                    allAction.pop();
                }
                //mod by zhangch6
                $('<div id="' + aiwin_id + '"></div>')
                    .insertAfter(container).kendoWindow({
                        actions: allAction,
                        animation: false,
                        modal: true,
                        pinned: true,
                        content: options.url,
                        iframe: true,
                        visible: false,
                        position: {
                            left: ($(window).width() - options.width) / 2 + $(document).scrollLeft(),
                            top: ($(window).height() - options.height) / 2 + $(document).scrollTop()
                        },
                        width: options.width,
                        height: options.height,
                        close: function () {
                            if (options.dataReturn &&
                                options.dataReturn != "" &&
                                options.dataReturn != null &&
                                options.dataReturn != "null" &&
                                options.close &&
                                typeof options.close === "function") {

                                var returnValue = $("#" + aiwin_iframe_id).contents().find("#" + options.dataReturn).val();
                                $("div[id=" + aiwin_id + "]").parent("div").remove();
                                options.close(returnValue);
                            } else {
                                $("div[id=" + aiwin_id + "]").parent("div").remove();
                            }
                        }
                    });
                $("#" + aiwin_id).data("kendoWindow").open();
                $(document.body).find(".k-overlay").css({"background-color": "#FFFFFF", "opacity": "0.1"});
                $($("#" + aiwin_id).find("iframe[class=k-content-frame]")[0]).attr("id", aiwin_iframe_id);

                if (options.close &&
                    typeof options.close === "function") {
                    $("div[id=" + aiwin_id + "]").data("kendoWindow").closeFuction = options.close;
                }
                return $("div[id=" + aiwin_id + "]").data("kendoWindow");
            }
        });
    aiwindow = {
        /**
         * 关闭窗口
         * @param that 窗口
         * @param value 返回值
         */
        close: function (that, value) {
            var AIWIN_IFRAME ="aiwin_iframe_";
            var frameId = that.frameElement.id;
            if (frameId.indexOf(AIWIN_IFRAME) == 0) {
                frameId = frameId.substr(AIWIN_IFRAME.length);
            }
            var winid = "aiwin_" + frameId;

            var window = $("#" + winid).data("kendoWindow");
            var closeFuction = window.closeFuction;
            window.close();
            if(value && closeFuction && typeof closeFuction === "function"){
                closeFuction(value);
            }

        }
    };
})(jQuery);
/**
 * @author zhangrp
 * Created on 2015/12/31 9:36
 * Copyright 2015 Asiainfo Technologies(China),Inc. All rights reserved.
 */

(function ($) {
    $.parser = {
        plugins: ['datebox', 'combobox','tilecombobox', 'form', 'calendar', 'tree', 'button', 'address', 'datagrid','likecmt','comment'],
        parse: function () {
            var aa = [];
            for (var i = 0; i < $.parser.plugins.length; i++) {
                var name = $.parser.plugins[i];
                var r = $('.aiui-' + name);
                if (r.length > 0) {
                    $('.aiui-' + name).each(function () {
                        var that = {};
                        that.html = this;
                        that.name = name;
                        window.setTimeout(function () {
                            if ($(this.html)[this.name]) {
                                $(this.html)[this.name]();
                            }
                        }.bind(that), 1);
                    });
                }
            }
        },
        parseOptions: function (target, properties) {
            var t = $(target);
            var options = {};

            var s = $.trim(t.attr('data-options'));
            if (s) {
                if (s.substring(0, 1) != '{') {
                    s = '{' + s + '}';
                }
                options = (new Function('return ' + s))();
            }
            $.map(['width', 'height', 'left', 'top', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'], function (p) {
                var pv = $.trim(target.style[p] || '');
                if (pv) {
                    if (pv.indexOf('%') == -1) {
                        pv = parseInt(pv) || undefined;
                    }
                    options[p] = pv;
                }
            });

            if (properties) {
                var opts = {};
                for (var i = 0; i < properties.length; i++) {
                    var pp = properties[i];
                    if (typeof pp == 'string') {
                        opts[pp] = t.attr(pp);
                    } else {
                        for (var name in pp) {
                            var type = pp[name];
                            if (type == 'boolean') {
                                opts[name] = t.attr(name) ? (t.attr(name) == 'true' || t.attr(name) == name) : undefined;
                            } else if (type == 'number') {
                                opts[name] = t.attr(name) == '0' ? 0 : parseFloat(t.attr(name)) || undefined;
                            } else if (type == 'string') {
                                opts[name] = t.attr(name) ? t.attr(name) : undefined;
                            }
                        }
                    }
                }
                $.extend(options, opts);
            }
            return options;
        }
    };
    $(function () {
        $.parser.parse();
    });
})(jQuery);

/**
 * Created by dizl on 2017/2/16.
 * 平铺的下拉框
 */
$.fn.tilecombobox = function () {
    var that = this;
    var target = that[0];
    if ($.data(target, 'tilecombobox')) {
        return $(target).data("tilecombobox");
    }
    return $.fn.tilecombobox.create(target);
};

$.fn.tilecombobox.create = function(target){
    var options = $.fn.form.parseOptions(target, {
        schemaData: 'data',
        hasAll: false,
        multFlag:false,
        hasMore:true,
        dataTextField:"text",
        dataValueField:"value"
    }, {
        srvId: "string",
        param: 'string',
        dataTextField: "string",
        dataValueField: "string",
        defaultValue: "string",
        schemaData: 'string',
        type: 'string',
        codeType:'string',
        codeValue:'string',
        parentCode:'string',
        parentCodeField:'string',
        hasAll: 'boolean',
        hasMore:'boolean',
        moduleName:'string',
        multFlag:'string',
        id:'string'
    });
    var filedData = [];
    var defaultValues = [];
    if(!comm.lang.isEmpty(options.defaultValue)){
        defaultValues = options.defaultValue.split(",")
    }
    if (options.srvId) {
        var param;
        if (options.beforeLoad) {
            param = options.beforeLoad({});
        }else if(!comm.lang.isEmpty(options.param)){
            param = JSON.parse(options.param);
        }
        comm.ajax.ajaxEntity({
            busiCode:options.srvId,
            moduleName:options.moduleName,
            param:param,
            callback:function(data,isSucc,msg){
                if(isSucc) {
                    var data = data[options.schemaData];
                    if (data != null && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var selected = false;
                            var value = data[i][options.dataValueField];
                            var text = data[i][options.dataTextField];
                            if (defaultValues != null && defaultValues.length > 0) {
                                for (var j = 0; j < defaultValues.length; j++) {
                                    if (defaultValues[j] == value) {
                                        selected = true;
                                        break;
                                    }
                                }
                            }
                            filedData.push({
                                text: text,
                                value: value,
                                selected: selected
                            })
                        }
                    }
                    var obj = $.fn.tilecombobox.initUI(filedData,options,target);
                    $.fn.tilecombobox.initEvent(options);
                    return obj;
                }
            }
        });
    } else if (options.type == 'static') {
        var codeType = options.codeType;
        var codeValue = options.codeValue;
        var parentCode = options.parentCode;
        var param;
        if (options.beforeLoad) {
            param = options.beforeLoad({});
        }else if(!comm.lang.isEmpty(options.param)){
            param = JSON.parse(options.param);
        }
        if(param && !comm.lang.isEmpty(param.codeType)){
            codeType = param.codeType;
            codeValue = param.codeValue;
            parentCode = param.parentCode;
        }
        if(!comm.lang.isEmpty(options.parentCodeField)){
            var parentValue = $("#"+options.parentCodeField).tilecombobox().value();
            if(parentValue!=null){
                parentCode = parentValue;
            }
        }
        options.codeType= codeType;
        comm.tools.getStaticData({
            codeType:codeType,
            codeValue:codeValue,
            parentCode:parentCode,
            callback:function(data){
                if(data!=null && data.length>0){
                    for(var i=0;i<data.length;i++){
                        var selected = false;
                        var codeValue = data[i]["codeValue"];
                        var codeName = data[i]["codeName"];
                        var codeType = data[i]["codeType"];
                        var parentCode = data[i]["parentCode"];
                        var extendCode = data[i]["extendCode"];
                        var extendCode2 = data[i]["extendCode2"];
                        if(defaultValues!=null && defaultValues.length>0){
                            for(var j=0;j<defaultValues.length;j++){
                                if(defaultValues[j]==codeValue){
                                    selected = true;
                                    break;
                                }
                            }
                        }
                        filedData.push({
                            text:codeName,
                            value:codeValue,
                            codeType:codeType,
                            parentCode:parentCode,
                            extendCode:extendCode,
                            extendCode2:extendCode2,
                            selected:selected
                        })
                    }
                }
                var obj = $.fn.tilecombobox.initUI(filedData,options,target);
                $.fn.tilecombobox.initEvent(options);
                return obj;
            }
        });
    }else{
        var childOptions = $(target).children("option");
        if(childOptions!=null && childOptions.length>0){
            for(var i=0;i<childOptions.length;i++){
                var selected = false;
                var text = $(childOptions[i]).text();
                var value = $(childOptions[i]).attr("value");
                if(defaultValues!=null && defaultValues.length>0){
                    for(var j=0;j<defaultValues.length;j++){
                        if(defaultValues[j]==value){
                            selected = true;
                            break;
                        }
                    }
                }
                filedData.push({
                    text:text,
                    value:value,
                    selected:selected
                });
            }
        }
        var obj = $.fn.tilecombobox.initUI(filedData,options,target);
        $.fn.tilecombobox.initEvent(options);
        return obj;
    }
    var o = {};
    o.value = function(){
        return defaultValues;
    };
    return o;
};

$.fn.tilecombobox.initUI = function(data,options,target){
    var innerHtml = "";
    if (data != null && data.length > 0) {
        var moreHtml = "";
        var textCount = 0;
        var targetWidth = $(target.parentElement).width();
        var hasSelected = false;
        if (options.hasAll) {
            moreHtml = "<a id='aiui-all" + options.id + "' value='' text='全部'";
            textCount = 2 * 12 + 25;
        }
        var isFirstSpan = true;
        for (var i = 0; i < data.length; i++) {
            innerHtml += "<a value='" + data[i].value + "' text='" + data[i].text + "' isSelected='" + data[i].selected + "'"
            if (options.type == "static") {
                innerHtml += " codeType='" + data[i].codeType + "' parentCode='" + data[i].parentCode + "' extendCode='" + data[i].extendCode + "' extendCode2='" + data[i].extendCode2 + "'"
            }
            if (data[i].selected) {
                hasSelected = true;
                innerHtml += " class='font-blue font-bold'"
            }
            innerHtml += ">" + data[i].text + "</a>";
            textCount += data[i].text.length * 12 + 25;
            if (options.hasMore == true || options.hasMore == "true") {
                if (textCount > targetWidth - 180) {
                    if (isFirstSpan) {
                        innerHtml += "<a class='float-right padding-right-20' id='aiui-more" + options.id + "' isSelected='false'>更多<i class='fa fa-chevron-down font-greye3 font10'></i></a>"
                    }
                    innerHtml += "</span><span style='display:none' aiuiSpanFlag='true'><br/>"
                    textCount = 0;
                    isFirstSpan = false;
                }
            } else {
                if (textCount > targetWidth - 30) {
                    innerHtml += "</span><span><br/>";
                    textCount = 0;
                }
            }
        }
        if (options.hasAll) {
            if (hasSelected == false) {
                moreHtml += " class='font-blue font-bold'"
            }
            moreHtml += ">全部</a>";
        }
        innerHtml = "<span>" + moreHtml + innerHtml + "</span>";
    } else {
        if (options.hasAll) {
            innerHtml = "<span><a>全部</a></span>";
        } else {
            innerHtml = "<span><a></a></span>"
        }
    }
    var childElement = document.createElement("span");
    childElement.id=options.id;
    childElement.innerHTML = innerHtml;
    var parentElement = target.parentElement;
    parentElement.removeChild(target);
    parentElement.appendChild(childElement);

    $("#" + options.id + " >span > a").bind("click", function () {
        var id = $(this).attr("id");
        var value = $(this).attr("value");
        var isSelected = $(this).attr("isSelected");
        if (id == "aiui-more" + options.id) {//显示影藏所有项
            var spans = $("#" + options.id + " > span[aiuiSpanFlag='true']");
            if (spans != null && spans.length > 0) {
                for (var i = 0; i < spans.length; i++) {
                    $(spans[i]).toggle();
                }
            }
            if (isSelected == false || isSelected == "false") {
                $(this).attr("isSelected", "true");
                $(this).html("收起<i class='fa fa-chevron-up font-greye3 font10'></i>");
            } else {
                $(this).attr("isSelected", "false");
                $(this).html("更多<i class='fa fa-chevron-down font-greye3 font10'></i>");
            }
        } else if (id == "aiui-all" + options.id) {//选择全部
            var spans = $("#" + options.id + " > span > a[isSelected='true'][id!='aiui-more-" + options.id + "']");//找到所有已经选择的项
            if (spans != null && spans.length > 0) {
                for (var i = 0; i < spans.length; i++) {
                    $(spans[i]).removeClass("font-blue").removeClass("font-bold").attr("isSelected", "false");
                }
            }
            $(this).addClass("font-blue").addClass("font-bold").attr("isSelected", "true");
        } else {
            var isSelected = $(this).attr("isSelected");
            if (isSelected == "true") {//如果已选择，则取消选择
                $(this).removeClass("font-blue").removeClass("font-bold").attr("isSelected", "false");
                if (options.hasAll) {
                    //判断当前是否所有都取消
                    var spans = $("#" + options.id + " > span > a[isSelected='true'][id!='aiui-more" + options.id + "']");//找到所有已经选择的项
                    var hasSelected = false;
                    if (spans == null || spans.length <= 0) {
                        $("#aiui-all" + options.id).addClass("font-blue").addClass("font-bold").attr("isSelected", "true");//设置不全选
                    }
                }
            } else {
                //判断是否多选
                if (options.multFlag == false || options.multFlag == "false") {
                    var spans = $("#" + options.id + " > span > a[isSelected='true'][id!='aiui-more" + options.id + "']");//找到所有已经选择的项
                    if (spans != null && spans.length > 0) {
                        for (var i = 0; i < spans.length; i++) {
                            $(spans[i]).removeClass("font-blue").removeClass("font-bold").attr("isSelected", "false");
                        }
                    }
                }

                $(this).addClass("font-blue").addClass("font-bold").attr("isSelected", "true");
                if (options.hasAll) {
                    $("#aiui-all" + options.id).removeClass("font-blue").removeClass("font-bold").attr("isSelected", "false");//设置不全选
                }
            }
            if (options.afterclick)
                options.afterclick(value);
        }
    });
    var retObj = $("#" + options.id);
    retObj.value = function () {
        var retVal = [];
        var spans = $("#" + this.attr("id") + " > span > a[isSelected='true'][id!='aiui-more" + this.attr("id") + "'][id!='aiui-all"+ this.attr("id") + "']");//找到所有已经选择的项
        if (spans != null && spans.length > 0) {
            for (var i = 0; i < spans.length; i++) {
                retVal.push($(spans[i]).attr("value"));
            }
        }
        return retVal;
    };
    $.data($("#" + options.id)[0], 'tilecombobox', retObj);
    return retObj;
};

$.fn.tilecombobox.initEvent=function(options){
    if(!comm.lang.isEmpty(options.parentCodeField)){//如果有父元素
        $("#" + options.parentCodeField + " > span > a[id!='aiui-more" + options.parentCodeField + "']").bind('click', function (e) {
            var parentCode = $("#"+options.parentCodeField).tilecombobox().value();
            comm.tools.getStaticData({
                codeType: options.codeType,
                parentCode: parentCode,
                callback: function (data) {
                    var filedData = [];
                    if (data != null && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var selected = false;
                            var codeValue = data[i]["codeValue"];
                            var codeName = data[i]["codeName"];
                            var codeType = data[i]["codeType"];
                            var parentCode = data[i]["parentCode"];
                            var extendCode = data[i]["extendCode"];
                            var extendCode2 = data[i]["extendCode2"];
                            filedData.push({
                                text: codeName,
                                value: codeValue,
                                codeType: codeType,
                                parentCode: parentCode,
                                extendCode: extendCode,
                                extendCode2: extendCode2,
                                selected: selected
                            })
                        }
                    }
                    $.fn.tilecombobox.initUI(filedData, options, $("#"+options.id)[0]);
                }
            });
        });
    }
};


/**
 * @author zhangruiping
 * Created on 2017/4/18 上午9:22
 * Copyright 2017 Asiainfo Technologies(China),Inc. All rights reserved.
 */
(function ($) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget;

    var AIFileView = Widget.extend({
        init: function (element, options) {
            var that = this;
            Widget.fn.init.call(that, element, options);

            element = that.element;
            options = that.options;
            var fileInputId = element.attr("fileInputId");
            if (fileInputId) {
                options.fileInputId = fileInputId;
            }
            if (options.fileInputId) {
                comm.ajax.ajaxEntity({
                    busiCode: busiCode.common.IELECFSV_QUERYELECINS,
                    param:{
                        fileInputId: options.fileInputId
                    },
                    callback: function (data, isSucc, msg) {
                        if (isSucc && data) {
                            for (var i = 0; i < data.length; i++) {
                                var html = "<p><a style='text-decoration: underline'>" + data[i].fileName + "</a></p>";
                                $(html).appendTo(element).click(function () {
                                    comm.browser.reload(PROJECT_URL + "/elec/download?fileTypeId=" + this.fileTypeId + "&fileSaveName=" + this.fileSaveName + "&fileName=" + encodeURI(encodeURI(this.fileName)));
                                }.bind(data[i]))
                            }
                            if (data.length == 0) {
                                element.html("无文件");
                            }
                        } else {
                            comm.dialog.notification({
                                title: "错误",
                                type: comm.dialog.type.error,
                                content: "获取数据异常"
                            });
                        }
                    }
                });
            }
        },
        options: {
            name: "AIFileView"
        },
        value: function (value) {
            var that = this;
            if (value === undefined) {
                return that.element.val();
            }
            that.element.val(value);
        }
    });
    ui.plugin(AIFileView);


})(jQuery);