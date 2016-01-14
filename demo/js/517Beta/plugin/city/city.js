/**
 * @authors  three 15-12-22
 * 说明 : 正对某一dom元素，移动上去有框来解释说明
 */
define(function(require, exports, module) {
    var citysFlight = require("./cityList.js"),
        oldCitysFlight = citysFlight.getCity();
    var global = {};

    function City(op) {
        op.citysFlightArr = op.citysFlightArr ? op.citysFlightArr : oldCitysFlight;
        var that = this;
        this.InitCity = function() {
            that.creat(op);
        }
    }

    City.prototype.creat = function(op, citysFlightArr) {
        var self = op.$dom,
            popCity = $("#popCity"), //鼠标点击弹出层
            resultCity = $("#resultCity"), //键盘输入弹出层
            cityArr = "", //手动设置热门城市
            hotCityArr = new Array(),
            x, //弹出层的x坐标
            y, //弹出层的y坐标
            cityName = op.cityName,
            citysFlightArr = op.citysFlightArr;

        global.callBack = op.callBack;
        Init();
        if (cityName !== "" && cityName !== null && cityName !== undefined) {
            cityArr = cityName.split(',')
        }
        if (citysFlightArr !== "" && citysFlightArr !== null && citysFlightArr !== undefined) {
            global.citysFlightNew = citysFlightArr;
        } else {
            global.citysFlightNew = citysFlight;
        }
        $(self).click(function() {
            x = $(self).offset().left;
            y = $(self).offset().top + $(self).outerHeight();
            global.cityChoose = $(this),
                global.inputvalue = $(this).val();
            /*global.citysFlightNew.sort(function(x, y){
            return x[0].localeCompare(y[0]);
            });*/

            global.citysFlightNew.sort(function(x, y) {
                return y[4] - x[4];
            });
            if ($("#popCity").length <= 0) {
                var citysLigth = global.citysFlightNew.length, //城市总数
                    inputObj = {
                        A: "",
                        B: "",
                        C: "",
                        D: "",
                        E: "",
                        F: "",
                        G: "",
                        H: "",
                        I: "",
                        J: "",
                        K: "",
                        L: "",
                        M: "",
                        N: "",
                        O: "",
                        P: "",
                        Q: "",
                        R: "",
                        S: "",
                        T: "",
                        U: "",
                        V: "",
                        W: "",
                        X: "",
                        Y: "",
                        Z: ""
                    },
                    hotCity = "", //热门城市
                    AGCity = "", //A-G开始的城市
                    HLCity = "", //H-L开始的城市
                    MTCity = "", //M-T开始的城市
                    WZCity = "", //W-Z开始的城市
                    divInput = $("<div id='popCity' class='popCity-hide'></div> "),
                    divHead = $('<div id="popCity_head"><span style="float: left;">请选择城市</span></div>'),
                    divTitle = $('<div id="popCity_title"></div>'),
                    titleLi = $('<ul><li class="active" >热门城市</li><li>ABCDEFG</li><li>HIJKL</li><li>MNPQRST</li><li>WXYZ</li></ul>'),
                    divContent = $('<div id="popCity_content"> </div>'),
                    divContentContent = $('<div class="popCity_Content_Content"> </div><div class="popCity_Content_Content popCity-hide"> </div><div class="popCity_Content_Content popCity-hide"> </div><div class="popCity_Content_Content popCity-hide"> </div><div class="popCity_Content_Content popCity-hide"> </div>');
                divTitle.append(titleLi);
                divContent.append(divContentContent);
                divInput.append(divHead);
                divInput.append(divTitle);
                divInput.append(divContent);
                $("body").append(divInput);
                //遍历城市数组，并将数据放入拼接字符串中
                for (var i = 0; i < citysLigth; i++) {
                    for (var j in cityArr) {
                        if (cityArr[j].indexOf(global.citysFlightNew[i][1]) > -1) {
                            if (i < 30) {
                                hotCityArr.push(i);
                            }
                            hotCity = hotCity + "<a href='javascript:void(0)' title=' " + global.citysFlightNew[i][1] + "(" + global.citysFlightNew[i][0].toUpperCase() + ")' cityObj = '" + global.citysFlightNew[i][0].toUpperCase() + " | " + global.citysFlightNew[i][1] + " | " + global.citysFlightNew[i][2] + " | " + global.citysFlightNew[i][3] + "'>" + global.citysFlightNew[i][1] + "</a>";
                        }
                    }
                }
                for (var i = 0; i < citysLigth; i++) {
                    if (i < (30 - cityArr.length)) { //热门城市
                        var bool = false;
                        for (var j in hotCityArr) {
                            if (hotCityArr[j] === i) {
                                bool = true;
                            } else {
                                bool = true;
                                hotCity = hotCity + "<a href='javascript:void(0)' title=' " + global.citysFlightNew[i][1] + "(" + global.citysFlightNew[i][0].toUpperCase() + ")' cityObj = '" + global.citysFlightNew[i][0].toUpperCase() + " | " + global.citysFlightNew[i][1] + " | " + global.citysFlightNew[i][2] + " | " + global.citysFlightNew[i][3] + "'>" + global.citysFlightNew[i][1] + "</a>";
                                break;
                            }
                        }
                        if (bool == false) {
                            hotCity = hotCity + "<a href='javascript:void(0)' title=' " + global.citysFlightNew[i][1] + "(" + global.citysFlightNew[i][0].toUpperCase() + ")' cityObj = '" + global.citysFlightNew[i][0].toUpperCase() + " | " + global.citysFlightNew[i][1] + " | " + global.citysFlightNew[i][2] + " | " + global.citysFlightNew[i][3] + "'>" + global.citysFlightNew[i][1] + "</a>";
                        }
                    }

                    var letter = global.citysFlightNew[i][2].substr(0, 1).toUpperCase();
                    // inputObj[letter] +=  "<a href='javascript:void(0)'  title=' " + global.citysFlightNew[i][0] + "," + global.citysFlightNew[i][1] + "," + global.citysFlightNew[i][2] + "," + global.citysFlightNew[i][3] + ",'>" + global.citysFlightNew[i][1] + "</a>";
                    inputObj[letter] += "<a href='javascript:void(0)' title=' " + global.citysFlightNew[i][1] + "(" + global.citysFlightNew[i][0].toUpperCase() + ")' cityObj = '" + global.citysFlightNew[i][0].toUpperCase() + " | " + global.citysFlightNew[i][1] + " | " + global.citysFlightNew[i][2] + " | " + global.citysFlightNew[i][3] + "'>" + global.citysFlightNew[i][1] + "</a>";

                }
                AGCity = "<b>A </b><div>" + inputObj['A'];
                HLCity = "<b>H </b><div>" + inputObj['H'];
                MTCity = "<b>M </b><div>" + inputObj['M'];
                WZCity = "<b>W </b><div>" + inputObj['W'];
                for (var item in inputObj) {
                    if (item.match(/^[B,C,D,E,F,G]+$/)) {
                        AGCity += "</div> <b>" + item + "</b> <div>" + inputObj[item];
                    }
                    if (item.match(/^[J,K,L]+$/)) {
                        HLCity += "</div> <b>" + item + "</b> <div>" + inputObj[item];
                    }
                    if (item.match(/^[N,P,Q,R,S,T]+$/)) {
                        MTCity += "</div> <b>" + item + "</b> <div>" + inputObj[item];
                    }
                    if (item.match(/^[X,Y,Z]+$/)) {
                        WZCity += "</div> <b>" + item + "</b> <div>" + inputObj[item];
                    }
                }
                AGCity += "</div><div class='clear'></div><div class='clear'></div>";
                HLCity += "</div><div class='clear'></div><div class='clear'></div>";
                MTCity += "</div><div class='clear'></div><div class='clear'></div>";
                WZCity += "</div><div class='clear'></div><div class='clear'></div>";
                var content = $("#popCity_content .popCity_Content_Content");
                $(content[0]).append(hotCity);
                $(content[1]).append(AGCity);
                $(content[2]).append(HLCity);
                $(content[3]).append(MTCity);
                $(content[4]).append(WZCity);
            }
            if ($("#resultCity").length > 0) {
                $("#resultCity").hide();
            }

            //显示div
            $("#popCity").show();
            $("#popCity").css({
                "left": x,
                "top": y
            });
            $("#cancelDiv").click(function() {
                global.cancel();
            });
            //设置li的切换事件
            $("#popCity_title ul li").each(function() {
                $(this).click(function() {
                    global.liClick(this);
                });
            });
            //a标签的点击事件
            $("#popCity_content a").each(function() {
                $(this).off("click").on("click", function() {
                    global.chooseClick(this);
                });
            });
            global.ReShow($.trim($(this).val())); //拼音 三字码  汉字  拼音简写 搜索
            return false;
        });
        $(self).blur(function() {
            global.cancelBody();
        });
        /* $(self).focus(function() {
             $(self).click();
         });*/
        //按键操作
        $(self).live("keyup", function(evt) {
            switch (evt.which) {
                case 38: //上
                    global.keydownUp();
                    break;
                case 40: //下
                    global.keydownDown();
                    break;
                case 13: //enter键选中
                    var select = $("#resultCity li.selected").attr("cityObj");
                    global.cityChoose.val($.trim(select.split('|')[1]));
                    global.cityChoose.attr("cityObj", select);
                    $("#resultCity").hide();
                    break;
                case 9: //tab键
                    $("#resultCity").hide();
                    $("#popCity").hide();
                    break;
                default:
                    $("#popCity").hide();
                    $("#resultCity").hide();
                    global.SpellSearch(self, x, y);
                    break;
            }
            return;
        });
        return false;
        //初始化
        function Init() {
            //查询结果选中
            global.inputvalue = '';
            global.cityChoose = '';
            global.citysFlightNew = '';
            global.searchLiClick = function(obj) {
                global.cityChoose.val($.trim($(obj).attr("cityObj").split('|')[1]));
                global.cityChoose.attr("cityObj", $(obj).attr("cityObj"));
                $("#resultCity").hide();
            };
            //选中城市
            global.chooseClick = function(astr) {
                global.cityChoose.val($.trim($(astr).html()));
                global.cityChoose.attr("cityObj", $(astr).attr("cityObj"));
                if (typeof global.callBack !== 'undefined') {
                    global.callBack.call(global.cityChoose, $(astr).attr("cityObj"));
                }

                $("#popCity").hide();
            };
            //点击body的其他地方
            global.cancelBody = function() {
                $(document).on("click", function(e) {
                    var target = $(e.target);
                    //判断是否点击在input或者弹出层上，若不是，则隐藏弹出层
                    if (target.closest("#popCity").length === 0 && target.closest(self).length === 0 && target.closest("#resultCity").length === 0) {
                        $("#popCity").hide()
                        if ($("#resultCity").is(":visible")) {
                            //global.cityChoose.val($.trim($(obj).attr("cityObj").split('|')[1]));
                            var select = $("#resultCity li.selected").attr("cityObj").split('|')[1];
                            global.cityChoose.val($.trim(select));
                        }
                        $("#resultCity").hide();
                    }
                });
            };
            //根据input的内容，显示对应的块
            global.ReShow = function(obj) {
                var citysLigth = global.citysFlightNew.length,
                    spell = "";
                for (var i = 0; i < citysLigth; i++) {
                    if (obj === global.citysFlightNew[i][1] && i >= 26) {
                        spell = global.citysFlightNew[i][2].substr(0, 1).toUpperCase();
                        break;
                    }
                }
                if (spell !== "") {
                    $('#popCity_title li').each(function(index) {
                        var ht = $(this).html();
                        if (ht.indexOf(spell) !== -1) {
                            global.liClick($(this));
                        }
                    });
                }
            };
            //26个英文字母的li切换
            global.liClick = function(obj) {
                var index2 = $(obj).index();
                $(obj).siblings().removeClass("active");
                $(obj).addClass("active");
                var content = $("#popCity_content").find(".popCity_Content_Content");
                $(content[index2]).siblings().hide().end().show();
            };
            //获取鼠标的点击位置
            global.mousePos = function(e) {
                var x,
                    y,
                    e = e || window.event;
                return {
                    x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                    y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
                };
            };
            //取消按钮的点击
            global.cancel = function() {
                global.cityChoose.val(global.inputvalue);
                $("#popCity").hide();
            };
            //根据输入框的内容显示列表
            global.SpellSearch = function(obj, x, y) {
                if ($(obj).val() === "") {
                    return;
                }
                $("#popCity").hide();
                if ($("#resultCity").length <= 0) {
                    var divSearch = '<div id="resultCity" class="popCity-hide"></div>';
                    $("body").append(divSearch);
                }
                $("#resultCity").html("");
                var citysLigth = global.citysFlightNew.length, //城市总数
                    cityName = $(obj).val().toLowerCase(),
                    bl = false,
                    number = 0; //限制显示的个数
                searchString = '<ul>';
                for (var i = 0; i < citysLigth; i++) {
                    if (global.citysFlightNew[i][0].indexOf(cityName) !== -1 || global.citysFlightNew[i][1].indexOf(cityName) !== -1 || global.citysFlightNew[i][2].indexOf(cityName) !== -1 || global.citysFlightNew[i][3].indexOf(cityName) !== -1) {
                        //  searchString += '<li title="' + global.citysFlightNew[i][0] + ','+global.citysFlightNew[i][1] + ',' + global.citysFlightNew[i][2] + '">' +  global.citysFlightNew[i][1] + '(' + global.citysFlightNew[i][2] + ')</li>';
                        searchString += "<li cityObj = '" + global.citysFlightNew[i][0].toUpperCase() + " | " + global.citysFlightNew[i][1] + " | " + global.citysFlightNew[i][2] + " | " + global.citysFlightNew[i][3] + "'>" + global.citysFlightNew[i][1] + "(" + global.citysFlightNew[i][0].toUpperCase() + ")</li>";
                        bl = true;
                        number = number + 1;
                        if (number >= 10) {
                            break;
                        }
                    }
                }
                searchString += '</ul>';
                if (bl === false) {
                    $("#resultCity").append("无条件符合");
                }
                $("#resultCity").append(searchString);
                $("#resultCity li:first").addClass("selected");

                //显示div
                $("#resultCity").show();
                $("#resultCity").css("position", "absolute");
                $("#resultCity").css({
                    "left": x,
                    "top": y + 5
                });
                $("#resultCity li").each(function() {
                    $(this).click(function() {
                        global.searchLiClick(this);
                    });
                });
            };

            //按键下键的移动选择被选中的项
            global.keydownDown = function() {
                var select = $("#resultCity li.selected");
                $("#resultCity li.selected").removeClass();
                if ($(select).next().length !== 0) {
                    $(select).next().addClass("selected");
                } else {
                    $("#resultCity li:eq(0)").addClass("selected");
                }
                return;
            }

            //按键上键的移动选择被选中的项
            global.keydownUp = function() {
                var select = $("#resultCity li.selected");
                $(select).removeClass();
                if ($(select).prev().length !== 0) {
                    $(select).prev().addClass("selected");
                } else {
                    $("#resultCity li:last").addClass("selected");
                }
                return;
            }
        }
    }
    return City;
})