/*
    :jiujian
    查询筛选(模仿ctrip)
    样式 就写在 js里面了
*/
define(function(require, exports, module) {

    function QueryFilter(op) {
        var queryFilter = {
            config: {
                filterParam: [
                    {
                        filterName: "起飞时间",
                        item: [{
                            name: "",
                            field: "",
                            value: "",
                            index: 0
                        }]
                    }
                ],
                rowLimit: 8, // 行限制 
                columnLimit: 5,//列限制
                imagePath: "",
                dom: null,
                fun: null
            },
            initFun: function (op) {
                $.extend(this.config, op);
			this.config.dom = op.$dom
                // 没有筛选条件 则返回
                if (this.config.filterParam.length == 0) {
                    return false;
                }

                // 加入filter样式
                styleFatory("defalut", "#" + op.$dom[0].id+" ");

                // 保证数据存在唯一标识
                this.dataUniqueFun();

                // 查询区域 初始化
                this.config.dom.append(queryFilterSearch.initFun(this.config.filterParam));

                // 选中区域 初始化
                this.config.dom.append(queryFilterBar.initFun());

                // 注册事件 鼠标事件
                this.config.dom.find("ul.filter_condition").on('mouseover', function (e) {
                    var e = e || window.event,
                        target = e.srcElement || e.target;
                    if (target.nodeName == "A") {
                        // 设置宽度
                        queryFilter.setStyle(target);
                    }
                    if (target.nodeName == "B") {
                        // 设置宽度
                        queryFilter.setStyle(target);
                    }
                });

                this.config.dom.find(".queryFilter").on('mouseover', function (e) {
                    var e = e || window.event,
                      target = e.srcElement || e.target;
                    // 设置宽度
                    queryFilter.setStyle(target);
                });


                // 选中事件
                this.config.dom.find(".input_checkbox").on('click', function () {
                    var $this = $(this);
                    if ($this.is("input")) {
                        if (($this.attr("checked") == "checked" || $this.attr("checked"))) {
                            queryFilterBar.addItemFun($(this));
                        } else {
                            queryFilterBar.delItemFun(null, $(this).attr("uniqueCode"));
                        }
                    }
                });
            },
            queryFun: function (condition, obj) {
                this.config.fun(condition, obj);
            },
            dataUniqueFun: function () {// 加入一个属性index 防止重复
                var index = 0;
                for (var i = 0; i < this.config.filterParam.length; i++) {
                    var per = this.config.filterParam[i];
                    for (var j = 0; j < per.item.length; j++) {
                        var perItem = per.item[j];
                        perItem.uniqueCode = index;
                        index++;
                    }
                }
            },
            setStyle: function (target) {
                var itemContainWidth = 0;
                $(target).parents(".queryFilter:first").find("ul").each(function () {
                    itemContainWidth += $(this).width() + 10;
                });
                $(target).parents(".filter_list:first").find(".queryItem_contain").css("width", itemContainWidth + "px");
            }
        };

        // 筛选区域
        var queryFilterSearch = {
            $itemContain: null,
            initFun: function (filterParam) {
                // 根据参数，构造查询列表
                this.$itemContain = $("<div class='filterItemContain'><ul class='filter_condition clearfix'><li><h4 class='queryFilter_menuTitle'>筛选条件：</h4></li></ul></div>");
                for (var index in filterParam) {
                    if (filterParam.hasOwnProperty(index)) {
                        var per = filterParam[index];
                        this.$itemContain.find("ul.filter_condition").append(this.packageConditionFun(per));
                    }
                }
                return this.$itemContain;
            },
            packageConditionFun: function (filter) { // 组装 查询条件
                if (filter.filterName == undefined || filter.item.length == 0) {
                    return false;
                };
                var $filterHtmlTemplate = $(conditionHtml.filterHtml);
                $filterHtmlTemplate.find(".queryFilter_filterName").html(filter["filterName"] + conditionHtml.icon1);
                $filterHtmlTemplate.find(".arrow_up").html(filter["filterName"] + conditionHtml.icon);

                // condition
                var items = filter.item || [],
                    isOne = items.length <= queryFilter.config.rowLimit;

                filter.map = filter.map || { value: "value", name: "name" };
                for (var index in filter.item) {
                    if (filter.item.hasOwnProperty(index)) {
                        if ((parseInt(index)) % queryFilter.config.rowLimit == 0) {
                            if (isOne) {
                                var $url = $(conditionHtml.urlHtml);
                            } else {
                                var $url = index == '0' ? $(conditionHtml.urlHtmlFirst) : $(conditionHtml.urlHtmlNext);
                            }

                            $filterHtmlTemplate.find(".queryItem_contain").append($url);
                        }

                        var per = filter.item[index];
                        var $item = $(conditionHtml.itemHtml);
                        $item.find("input").attr("value", per[filter.map.value]);
                        $item.find("input").attr("field", filter.field);
                        $item.find("input").attr("name", per[filter.map.name]);
                        $item.find("input").attr("uniqueCode", per.uniqueCode);
                        $item.find("input").after(per[filter.map.name]);

                        $url.append($item);
                    }
                }

                // 填充 
                var needFillDivNum = (queryFilter.config.rowLimit - (items.length % queryFilter.config.rowLimit)) % queryFilter.config.rowLimit;
                if (!isOne) {
                    for (var i = 0; i < needFillDivNum; i++) {
                        var $item = $(conditionHtml.fillBlankDiv);
                        $url.append($item);
                    }
                }


                return $filterHtmlTemplate;
            },
            selControlFun: function (uniqueCode) {
                $(this.$itemContain.find("input[uniqueCode='" + uniqueCode + "']")).attr("checked", false);
            },
            clearAllFun: function () { // 清除选中的 条件
                this.$itemContain.find("input[type='checkbox']").each(function () {
                    $(this).attr("checked", false);
                });
            }
        };

        // 选中区域
        var queryFilterBar = {
            selData: [],
            $itemContain: null,// 筛选区域
            initFun: function () {

                this.$itemContain = $(conditionBarHtml.barHtml);
                // 清除按钮注册
                this.$itemContain.find(".filterClear").on('click', function () {
                    queryFilterBar.delAllFun();
                });

                // 删除按钮注册
                this.$itemContain.on('click', function () {
                    var e = e || window.event,
                       target = e.srcElement || e.target;
                    if (target.nodeName == "B") {
                        queryFilterBar.delItemFun($(target));
                    };
                });

                return this.$itemContain;
            },
            addItemFun: function (obj) { // 添加选中块
                var $input = $(obj),
                    itemData = {};
                itemData.value = $input.attr("value");
                itemData.field = $input.attr("field");
                itemData.name = $input.attr("name");
                itemData.uniqueCode = $input.attr("uniqueCode");

                var $item = $(conditionBarHtml.itemHtml);
                $item.attr("field", itemData.field);
                $item.attr("uniqueCode", itemData.uniqueCode);
                $item.find("b").before(itemData.name);
                this.$itemContain.find(".filterClear").before($item);
                this.selData.push(itemData);
                // 是否显示
                this.isShowFun();

                // 查询
                queryFilter.queryFun(this.selData, this.$itemContain);
            },
            delItemFun: function (obj, uniqueCode) { // 删除选中块
                if (obj == null) {
                    obj = this.$itemContain.find("a[uniqueCode='" + uniqueCode + "'] b");
                }

                var $item = $(obj).parent(),
                uniqueCode = $item.attr("uniqueCode");
                $item.remove();

                // 查询条件不选中
                queryFilterSearch.selControlFun(uniqueCode);

                var newData = [];
                for (var index in this.selData) {
                    if (this.selData.hasOwnProperty(index)) {
                        var per = this.selData[index];
                        if (per.uniqueCode != uniqueCode) {
                            newData.push(per);
                        }
                    }
                }

                this.selData = newData;

                // 是否显示
                this.isShowFun();

                // 查询
                queryFilter.queryFun(this.selData, this.$itemContain);
            },
            delAllFun: function () { // 清除所有选中块 
                this.selData.length = 0;
                this.$itemContain.find("a.filter_clear").remove();
                queryFilterSearch.clearAllFun();

                // 是否显示
                this.isShowFun();

                // 查询
                queryFilter.queryFun(this.selData, this.$itemContain);
            },
            isShowFun: function () { // 是否展示选中区域
                if (this.selData.length == 0) {
                    this.$itemContain.hide();
                } else {
                    this.$itemContain.show();
                }
            }
        };

        // ================================================================样式=============================================================
        var styleFatory = function (type, id) { // 样式工厂
            $("head").append("<style type='text/css'>" +
                ({
                    "defalut": function () {
                        return id + "{font-size:12px;}"
                        + id + "div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, button, textarea, p, blockquote, th, td{margin:0;padding:0;}\n"
                    + id + "img, input, select, button{vertical-align: middle;}\n"
                    + id + "body {font-family: Tahoma;font-size:12px;color:#555;-webkit-text-size-adjust:none;}\n"
                    + id + "ul, li{list-style: none;zoom: 1;}\n"
                    + id + "a:link {color: #0069ca;text-decoration: none;}\n"
                    + id + "h1, h2, h3, h4, h5, h6{font-size: 100%;font-weight: normal;}\n"
                + id + ".filter_condition { margin-bottom: 10px;margin-left:-10px;*zoom:1; }\n"
                        + id + ".filter_condition li { float: left;_dispaly:inline; position: relative; margin-left: 10px; z-index: 300; }\n"
                        + id + ".filter_condition li.filter_transit_item a,.filter_condition li.filter_transit_item h4 { width:80px;  }\n"
                        + id + ".filter_condition li.filter_transit_item a {width: 105px;}\n"
                        + id + ".filter_condition li.filter_transit_item ul { min-width:110px;_width:110px;  }\n "
                        + id + ".filter_condition li.filter_transit_item .arrow_down b { right:0;  }\n "
                        + id + ".filter_condition a { float: left; height: 24px; line-height: 24px; *line-height: 26px; font-family: Arial,simsun; padding: 0 28px 0 8px; border: 1px solid #D1D1D1; border-bottom: 1px solid #B2B2B2; color: #333; border-radius: 2px; overflow: hidden; position: relative; }\n"
                        + id + ".filter_condition a:hover { text-decoration: none; }\n"
                        + id + ".filter_condition a b {  position: absolute; top: 0; width: 20px; height: 24px; padding: 0; margin: 0 0 0 8px; border: none; overflow: hidden; }"
                        + id + ".filter_condition a .desc {  width: 0;height: 0;border-left: 6px solid transparent;  border-right: 6px solid transparent;    border-top: 6px solid rgb(121, 113, 113);position: absolute;top: 8px;left: 2px;}\n"
                        + id + ".filter_condition .arrow_up b { background-position: -25px -636px; }\n"
                        + id + ".filter_condition .arrow_down b { background-position: left -636px; }\n"
                        + id + ".filter_condition h4{font-size: 14px;}\n"
                        + id + ".filter_condition .queryFilter_menuTitle{margin-top:0px;font-size:12px;}"
                        + id + ".filter_choosen { padding-left: 70px; line-height: 22px; margin-top:20px;}\n"
                        + id + ".filter_choosen h4 { float: left;margin-right:10px; _display: inline; margin-left: -70px; font-size: 14px; font-weight: normal; }\n"
                        + id + ".filter_choosen a { float: left; }\n"
                        + id + ".filter_choosen .queryFilter_menuTitle{font-size:12px;}"
                        + id + ".filter_list { display: none; position: absolute; left: 0; top: 0; z-index: 3; zoom: 1; cursor:default}\n"
                        + id + ".filter_list h4 { float: left; clear: both; padding: 0 32px 5px 8px; border-width: 1px 1px 0; border-style: solid solid none; border-color: #D1D1D1 #D1D1D1 transparent; font-weight: normal; font-size: 12px; line-height: 24px; *line-height: 26px; font-family: Arial,simsun; background-color: #FFF; *zoom: 1; z-index: 3; position: relative; }\n"
                        + id + ".filter_list h4 b {  position: absolute; top: 0; right: 0; width: 20px; height: 24px; padding: 0; margin: 0; border: none; overflow: hidden; }\n"
                        + id + ".filter_list h4 .asc {  width: 0;height: 0;border-left: 6px solid transparent;  border-right: 6px solid transparent;    border-bottom: 6px solid rgb(121, 113, 113);position: absolute;top: 8px;left: 2px;}\n"
                       
                        + id + ".filter_list ul { float: left; min-width: 85px; _width: 78px; margin-top: -1px; padding: 5px 3px; border: 1px solid #D1D1D1; background-color: #FFF; *zoom: 1; }\n"
                        + id + ".filter_list li { float: none; position: static; _height: 26px; _overflow: hidden; margin: 0; }\n"
                        + id + ".filter_list label { display: block; padding: 4px;height:20px; white-space: nowrap; cursor: pointer; text-align:left}\n"
                        + id + ".filter_list .fillLi span { display: block;height:28px; white-space: nowrap; text-align:left}\n"
                        + id + ".filter_list label:hover { background-color: #74A2DE; color: #FFF; }\n"
                        + id + ".filter_list .queryFilter_first{border-right:none;}\n"
                        + id + ".filter_list .queryFilter_next{border-left:none;}\n"
                        + id + " .queryFilter:hover .filter_list{display:block}\n"
                        + id + " .queryFilter.filter_list{display:none}\n"
                        + id + ".filter_clear { margin-right: 5px; margin-bottom: 5px; padding: 3px 5px; background-color: #74A2DE; color: #FFF; cursor: pointer; white-space: nowrap; line-height: 16px; }\n"
                        + id + ".filter_clear:hover { text-decoration: none; }\n"
                        + id + ".filter_clear b { display: inline-block; font-size: 14px; font-family: Arial; vertical-align: -1px; }\n"
                        + id + ".filter_origin{background:#ED9C65;}\n"
                        + id + ".clearfix { *zoom: 1; }\n"
                        + id + ".clearfix:after { clear: both; content: '.'; display: block; height: 0; overflow: hidden; }\n"
                        + id + ".input_checkbox, .input_radio { margin: 0 2px; vertical-align:middle;*vertical-align: -3px; }\n"
                        + id + " label { margin-bottom:0px; }\n";

                    },
                    "defalut1": function () {
                        return "";
                    }
                }[type])()

            + "</style>");
        };

        var conditionHtml = { // 查询条件 html
            filterHtml: '<li class="queryFilter">' +
                        '<a class="queryFilter_filterName filter_trigger arrow_down" href="javascript:void(0);"></a>' +
                            '<div class="filter_list" >' +
                                '<h4 class="arrow_up"></h4>' +
                                '<div style="float: left;" class="queryItem_contain"></div>' +
                            '</div>' +
                        '</li>"',

            itemHtml: '<li><label><input class="input_checkbox" type="checkbox" value="" field="" name="" uniqueCode=""></label></li>',
            fillBlankDiv: '<li class="fillLi"><span>&nbsp;</span></li>',
            urlHtmlFirst: '<ul style="min-width: 85px;" class="queryFilter_itemContain queryFilter_first">' +
                                    '</ul>',
            urlHtmlNext: '<ul style="min-width: 85px;" class="queryFilter_itemContain queryFilter_next">' +
                                    '</ul>',
            urlHtml: '<ul style="min-width: 85px;" class="queryFilter_itemContain">' +
                                    '</ul>',
            icon: "<b><div class='asc'></div></b>",
            icon1: "<b><div class='desc'></div></b>"
        };

        var conditionBarHtml = {//  选中条件的区域
            barHtml: '<div style="display: none;" class="filter_choosen clearfix">' +
                '<h4 class="queryFilter_menuTitle">' +
                    '已选条件：</h4>' +
                '<a href="javascript:void(0);" class="filterClear" >清除</a>' +
                '</div>',
            itemHtml: '<a class="filter_clear" filed="" value="" uniqueCode=""><b>×</b></a>'
        };
	 this.render = function(){
		queryFilter.initFun(op);
	};
	return this;
    }
	
	return QueryFilter;
});