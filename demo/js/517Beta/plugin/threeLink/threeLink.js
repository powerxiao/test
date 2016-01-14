/**
 * @authors  three 15-12-22
 * 说明 : 正对某一dom元素，移动上去有框来解释说明
 */
define(function(require, exports, module) {
    function ThreeLink(op) {
        var threeLinkHelper = require("./provinceAndCityData.js");
        op.threeLinkdata = op.threeLinkdata ? op.threeLinkdata : threeLinkHelper.getProvince();
        var that = this;
        this.initLink = function() {
            that.creat(op);
        }
    }
    ThreeLink.prototype.creat = function(op) {
        var provinceAndCityData = op.threeLinkdata;
        //创造select
        var selectHtml = "",
            domName = op.$dom.attr("id");
        for (var i = 0, len = op.linkNum; i < len; i++) {
            selectHtml += " <select name='" + domName + i + "' id='" + domName + i + "'><option value=''> " + op.linkName[i] + " </option></select> "
        }

        op.$dom.html(selectHtml);
        var prvChanged, cityChanged, // 省份，城市切换
            objectDropList = op.$dom.find("select"), // 下拉对象
            cityhtml = $(objectDropList[1]).html(), // 城市下拉列表初始选项
            districthtml = "", // 地区下拉列表初始选项
            selopt = "",
            province = provinceAndCityData.province,
            prvLength = province.length,
            i;

        if (objectDropList.length === 3) { // 三级地区列表
            districthtml = $(objectDropList[2]).html();
        }

        for (i = 0; i < prvLength; i += 1) {
            selopt += "<option value=\"" + province[i].name + "\">" + province[i].name + "</option>";
        }

        $(objectDropList[0]).append(selopt);

        // 省份切换
        $(objectDropList[0]).change(function() {
            prvChanged($(objectDropList[0]).val());
        });

        // 城市切换
        $(objectDropList[1]).change(function() {
            cityChanged($(objectDropList[1]).val());
        });

        prvChanged = function(prv) {
            // 清空原数据
            $(objectDropList[1]).html(cityhtml);

            if ((null === prv) || ("" === prv)) {
                cityChanged($(objectDropList[1]).val());
                return;
            }

            selopt = "";
            var cities,
                cityLength,
                j;

            for (i = 0; i < prvLength; i += 1) {
                if (prv === province[i].name) {
                    cities = province[i].city;
                    cityLength = cities.length;
                    for (j = 0; j < cityLength; j += 1) {
                        selopt += "<option value=\"" + cities[j].name + "\">" + cities[j].name + "</option>";
                    }
                    break;
                }
            }
            $(objectDropList[1]).append(selopt);

            cityChanged($(objectDropList[1]).val());
        }

        cityChanged = function(city) {
            if (objectDropList.length < 3) { // 只是一个2级地区列表
                return;
            }

            // 清空原数据
            $(objectDropList[2]).html(districthtml);

            if ((null === city) || ("" === city)) {
                return;
            }
            selopt = "";
            var prv = $(objectDropList[0]).val(), // 当前选中的省份
                cities,
                cityLength,
                district,
                distLength,
                j,
                k;

            for (i = 0; i < prvLength; i += 1) {
                if (prv === province[i].name) {
                    cities = province[i].city;
                    cityLength = cities.length;

                    for (j = 0; j < cityLength; j += 1) {
                        if (city === cities[j].name) {
                            district = cities[j].area;
                            distLength = district.length;

                            for (k = 0; k < distLength; k += 1) {
                                selopt += "<option value=\"" + district[k].name + "\">" + district[k].name + "</option>";
                            }
                            break;
                        }
                    }
                    break;
                }
            }

            $(objectDropList[2]).append(selopt);
        }
    };

    return ThreeLink;
});