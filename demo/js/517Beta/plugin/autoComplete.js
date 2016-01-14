/**
 * @authors  guojia 2014-09-19
 * 说明 : 正对某一dom元素，移动上去有框来解释说明
 */
define(function(require, exports, module) {
    function AutoComplete(op) {
        var that = this;
        this.initComplete = function() {
            that.init(op);
        }
    }

    AutoComplete.prototype.init = function(op) {
        var ajaxOp = op.ajaxOp,
            filterOp = op.filterOp;
        var $self = op.$dom,
            isSearch = true,
            cityArr = "",
            cityCacheArr = [{
                cIndex: "",
                cList: []
            }],
            globalCarrier = {},
            x,
            y;

        globalCarrier.filterDe = {
            searchKeys: "", // 检索属性
            displayWords: "", // 层显示内容
            displayFormat: "", // 下拉层显示格式
            showNotFound: true, // 未找到时是否显示提示
            checkValue: "", // 选中显示内容
            passValue: "", // 传值
            useCache: true, // 是否使用前端缓存
            ruquires: true, // 是否必须:离开后会不会默认选中
            callBack: function() {
                // 是否有选中后的回调函数
            }
        };
        globalCarrier.citysFlightNew = [];

        $.extend(globalCarrier.filterDe, filterOp);
        Init(globalCarrier);

        $self.click(function() {
            x = $self.offset().left;
            y = $self.offset().top + $self.outerHeight();
            globalCarrier.cityChoose = $self;
            globalCarrier.inputvalue = $self.val();
            return false;
        });

        $self.blur(function() {
            var $resultCarrier = $("#resultCarrier:visible");
            // 点击层上对应值时
            if ($resultCarrier && $resultCarrier.find("li:hover").html() !== null) {
                $resultCarrier.find("li.selected").removeClass();
                $resultCarrier.find("li:hover").addClass("selected");
                globalCarrier.assignment(this);
            }
        });

        $self.focus(function() {
            $self.click();
        });

        //按键操作
        $self.off("keyup").on("keyup", function(evt) {
            switch (evt.which) {
                case 38: //上
                    globalCarrier.keydownUp();
                    break;
                case 40: //下
                    globalCarrier.keydownDown();
                    break;
                case 13: //enter键选中
                    globalCarrier.assignment(this);
                    break;
                case 9: //tab键
                    globalCarrier.assignment(this);
                    break;
                default:
                    if (isSearch) {
                        isSearch = false;
                        // 延时输入 节约资源
                        setTimeout(function() {
                            isSearch = true;
                            var kw = $.trim($self.val()).toLowerCase().replace(/\'/, ''),
                                isCache = false;

                            if (globalCarrier.filterDe.useCache) { // 是否用缓存
                                for (var i = 0, l = cityCacheArr.length; i < l; i++) {
                                    if (cityCacheArr[i].cIndex === kw) {
                                        globalCarrier.InitCity(cityCacheArr[i].cList);
                                        isCache = true;
                                        break;
                                    }
                                }
                            }
                            if (!isCache) {
                                // has no cache use default option
                                ajaxDe = {
                                    url: "",
                                    type: "get",
                                    cache: false,
                                    data: {
                                        searchKey: kw
                                    },
                                    dataType: "text",
                                    success: function(data) {
                                        var cObj = {};
                                        if (data) {
                                            cObj.cIndex = kw;
                                            cObj.cList = JSON.parse(data);
                                            if (globalCarrier.filterDe.useCache) {
                                                cityCacheArr.push(cObj);
                                            }
                                            globalCarrier.InitCity(cObj.cList);
                                            $("#resultCarrier").remove();
                                            globalCarrier.SpellSearch($self, x, y);
                                        } else {
                                            globalCarrier.citysFlightNew.length = 0;
                                            globalCarrier.SpellSearch($self, x, y);
                                        }
                                    },
                                    error: function(err) {
                                        alert(err.responseText);
                                    }
                                };
                                if (ajaxOp) {
                                    $.extend(ajaxDe, ajaxOp);
                                    var aDataObj = {};
                                    for (var i in ajaxDe.dataKey) {
                                        if (ajaxDe.dataKey[i] === "") {
                                            aDataObj[i] = kw;
                                        } else {
                                            aDataObj[i] = $(ajaxDe.dataKey[i]).val();
                                        }
                                    }
                                    ajaxDe.data = aDataObj;
                                };
                                $.ajax(ajaxDe);
                            } else {
                                // use cache
                                $("#resultCarrier").remove();
                                globalCarrier.SpellSearch($self, x, y);
                            }
                        }, 500);
                    }
                    break;
            }
            return;
        });
        return false;
    };

    //初始化
    var Init = function(globalCarrier) {
        var popStyle = '\
<style type=\"text/css\">.resultCarrier{width:360px;border:2px solid #93dcff;padding:2px;background:#fff}\
.resultCarrier ul{list-style:none;padding:0;margin:2px;width:356px}\
.resultCarrier ul li{height:25px;line-height:25px;font-size:12px;cursor:pointer;overflow:hidden}\
.resultCarrier ul li:hover{background:#dbd8d8}\
.resultCarrier ul li.selected{background:#dbd8d8}\
.resultCarrier ul.warn{color:red}\
.popCity_Content_Content .clear{clear:both;min-height:0;line-height:0;height:0;_height:0}</style>\
        ';
        //点击body的其他地方
        globalCarrier.cancelBody = function() {
            var target;
            $(document).on("click", function(e) {
                target = $(e.target);
                //判断是否点击在input或者弹出层上，若不是，则隐藏弹出层
                if (target.closest(self).length === 0 && target.closest("#resultCarrier").length === 0) {
                    if ($("#resultCarrier").is(":visible")) {
                        globalCarrier.assignment(globalCarrier.cityChoose);
                    }
                }
            });
        };

        globalCarrier.cancelBody();
        $("head").append(popStyle);
        //查询结果选中
        globalCarrier.searchLiClick = function(obj) {
            globalCarrier.assignment(obj);
        };

        //根据输入框的内容显示列表
        globalCarrier.SpellSearch = function(obj, x, y) {
            var $resultCarrier = $("#resultCarrier");
            if ($(obj).val() === "") {
                return;
            }
            if ($resultCarrier.length <= 0) {
                var divSearch = '<div id="resultCarrier" class="resultCarrier"></div>';
                $("body").append(divSearch);
                $resultCarrier = $("#resultCarrier");
            }
            $resultCarrier.html("");
            var citysLigth = globalCarrier.citysFlightNew ? globalCarrier.citysFlightNew.length : 0,
                cityName = $.trim($(obj).val()).toLowerCase(),
                bl = false,
                kwdArr = globalCarrier.filterDe.searchKeys.split('|'),
                showContentArr = globalCarrier.filterDe.displayWords.split('|'),
                number = 0, //限制显示的个数
                searchString = '<ul>',
                liContent,
                cityFlightObj;

            for (var i = 0; i < citysLigth; i++) {
                for (var j = 0, l = kwdArr.length; j < l; j++) {
                    cityFlightObj = globalCarrier.citysFlightNew[i];
                    // if (cityFlightObj[kwdArr[j]].toUpperCase().indexOf(cityName.toUpperCase()) !== -1) {
                    liContent = globalCarrier.filterDe.displayFormat;
                    for (var k in showContentArr) {
                        if (liContent) {
                            liContent = liContent.replace(showContentArr[k], cityFlightObj[showContentArr[k]].toUpperCase());
                        } else {
                            liContent += cityFlightObj[showContentArr[k]].toUpperCase();
                        }
                    }
                    if (!globalCarrier.filterDe.passValue) {
                        // 非单个值，传递整个对象
                        searchString += "<li nextObj='" + JSON.stringify(cityFlightObj) + "' cityObj = '" + cityFlightObj[globalCarrier.filterDe.checkValue].toUpperCase() + "'>" + liContent + "</li>";
                    } else {
                        // 单个值，传递对应字符串
                        searchString += "<li nextObj='" + cityFlightObj[globalCarrier.filterDe.passValue].toUpperCase() + "' cityObj = '" + cityFlightObj[globalCarrier.filterDe.checkValue].toUpperCase() + "'>" + liContent + "</li>";
                    }

                    bl = true;
                    number = number + 1;
                    break;
                    // }
                }
                if (number >= 10) {
                    break;
                }
            }
            searchString += '</ul>';
            if (bl === false && globalCarrier.filterDe.showNotFound) {
                $resultCarrier.append("<ul class=\"warn\"><li>找不到：" + cityName + "</li></ul>");
            }
            $resultCarrier.append(searchString);
            if (globalCarrier.filterDe.ruquires) {
                $resultCarrier.find("li:first").addClass("selected");
            }

            $resultCarrier.css("position", "absolute");
            $resultCarrier.css({
                "left": x,
                "top": y + 5
            });

            //显示div
            if (bl === false && !globalCarrier.filterDe.showNotFound) {
                $resultCarrier.hide();
            } else {
                $resultCarrier.show();
            }

            $resultCarrier.find("li").each(function() {
                $(this).click(function() {
                    globalCarrier.searchLiClick(this);
                });
            });
        };

        //按键下键的移动选择被选中的项
        globalCarrier.keydownDown = function() {
            var $resultCarrier = $("#resultCarrier"),
                $select = $resultCarrier.find("li.selected");
            $resultCarrier.find("li.selected").removeClass();
            if ($select.next().length !== 0) {
                $select.next().addClass("selected");
            } else {
                $resultCarrier.find("li:eq(0)").addClass("selected");
            }
            return;
        };

        //按键上键的移动选择被选中的项
        globalCarrier.keydownUp = function() {
            var $resultCarrier = $("#resultCarrier"),
                $select = $resultCarrier.find("li.selected");
            $select.removeClass();
            if ($select.prev().length !== 0) {
                $select.prev().addClass("selected");
            } else {
                $resultCarrier.find("li:last").addClass("selected");
            }
            return;
        }

        // 城市数据对象数组转换
        globalCarrier.InitCity = function(cityFlightInter) {
            globalCarrier.citysFlightNew = cityFlightInter;
        }

        // 赋值操作
        globalCarrier.assignment = function(e) {
            var $resultCarrier = $("#resultCarrier"),
                $select = $resultCarrier.find("li.selected"),
                selectVal = $select.attr("cityObj"),
                nextVal = $select.attr("nextObj");

            if (selectVal) {
                globalCarrier.cityChoose.val($.trim(selectVal));
                if (!globalCarrier.filterDe.callBack) {
                    globalCarrier.cityChoose.next("input,select").val(nextVal);
                } else {
                    globalCarrier.filterDe.callBack(nextVal, e);
                }
            }

            if ($("#resultCarrier li.selected").html() === "无条件符合" || $.trim($(e).val()) === "") {
                globalCarrier.cityChoose.val("");
                if (!globalCarrier.filterDe.callBack) {
                    globalCarrier.cityChoose.next("input,select").val("");
                } else {
                    globalCarrier.filterDe.callBack("", e);
                }
            }

            $resultCarrier.remove();
        }
    }
    return AutoComplete;
})