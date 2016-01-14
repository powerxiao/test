/**
 * Created by wansan on 15-12-31.
 */
;
(function($) {
    $.fn.creatSelect = function() {
        var that = this,
            width = $(this).css("width");
        //注册前处理
        $(that).hide();
        var yselector = "";
        //生成html代码，构造dom结构
        var creatHtml = function() {
            var optionArr = $(that).find("option");
            var initHtml = function() {
                var html = "<div class='yselector' tabindex='0'>";
                html += "<div class='yselector_box'>",
                    html += "<span class='yselector_input'></span>",
                    html += "<span class='ttsicon'>∨</span></div>",
                    html += "<div style='display: none;' class='yselector_suggest'>",
                    html += "<ul>",
                    html += "</ul></div ></div>";
                return html;
            }
            var html = initHtml();
            $(that).after(html);
            yselector = $(that).next(".yselector");
            var optionHtml = "";
            for (var i = 0; i < optionArr.length; i++) {

                var item = $(optionArr[i]);
                if (i === 0) {
                    yselector.find(".yselector_input").html(item.html());
                }
                optionHtml += "<li data-value='" + item.attr("value") + "'data-index ='" + i + "'>" + item.html() + "</li>";
            }
            yselector.find("ul").html(optionHtml);
            width = parseInt(width, 10) < 100 ? 100 : parseInt(width, 10);
            yselector.find(".yselector_input").css("width", parseInt(width - 40, 10) + "px");
            yselector.css("width", width + "px");
        }
        var hideSelect = function() {
            yselector.find(".yselector_suggest").hide();
            yselector.removeClass("yselector_open");
        }
        var showSelect = function() {
                yselector.find(".yselector_suggest").show().css("width", "100%");
                yselector.addClass("yselector_open");
                //寻找相应li并select
                var optionValue = $(that).val();
                yselector.find("ul li").removeClass("selected");
                yselector.find("ul li").each(function() {
                    var value = $(this).attr("data-value");
                    if (value === optionValue) {
                        $(this).addClass("selected");
                    }
                });

                event.stopPropagation();
            }
            //选中事件方法
        var choseOption = function() {
            var value = yselector.find("li.selected").attr("data-value"),
                index = yselector.find("li.selected").attr("data-index"),
                oldOption = $(that).val();
            yselector.find(".yselector_input").html(value);

            //并且给隐藏的select赋值
            $(that).find("option").each(function() {
                var option = $(this).attr("value");
                if (option === value) {
                    $(this).attr("selected", "selected");
                    return false;
                } else {
                    $(this).removeAttr("selected");
                }
            });

            if (oldOption !== $(that).val()) {
                $(that).change();
            }
        }
        var keydownDown = function() {
            var index = yselector.find("li.selected").index() + 1;
            yselector.find("li").removeClass("selected");
            var count = yselector.find("li").length;
            if (index + 1 > count) {
                yselector.find("li:first").addClass("selected");
            } else {
                yselector.find("li").eq(index).addClass("selected");
            }
            choseOption();
        }
        var keydownUp = function() {
            var index = yselector.find("li.selected").index() - 1;
            yselector.find("li").removeClass("selected");
            var count = yselector.find("li").length;
            if (index === -1) {
                yselector.find("li:last").addClass("selected");
            } else {
                yselector.find("li").eq(index).addClass("selected");
            }
            choseOption();
        }
        var enterTab = function() {
            choseOption();
            hideSelect();
            // return false;
        };


        creatHtml();

        //注册相关事件
        //点击事件，弹出下拉框
        yselector.off("click").on("click", function(event) {
            $(".yselector_suggest").hide();
            if ($(this).attr("class").indexOf("yselector_open") > -1) {
                hideSelect();
                $(".yselector").removeClass("yselector_open");
            } else {
                $(".yselector").removeClass("yselector_open");
                showSelect();
            }
        });
        //注册点击li事件
        yselector.find("li").off("click").on("click", function(event) {
            choseOption();
            hideSelect();
            return false;
        });
        //注册点击li hover
        yselector.find("li").hover(function() {
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");
        }, function() {
            $(this).removeClass("selected");
        });

        //注册上下enter事件
        yselector.off("keydown").on("keydown", function(evt) {
            switch (evt.which) {
                case 38: //上
                    keydownUp();
                    return false;
                    break;
                case 40: //下
                    keydownDown();
                    return false;
                    break;
                case 13: //enter键选中
                    enterTab();
                    break;
                    /*  case 9: //tab键
                          enterTab();
                          break;*/
                default:
            }
        });
        //点击下拉框外，直接隐藏
        $(document).on("click", function(e) {
            var target = $(e.target);
            //判断是否点击在input或者弹出层上，若不是，则隐藏弹出层
            if (target.closest(self).length === 0 && target.closest(".yselector").length === 0) {
                hideSelect();
            }
        });

    };
})(jQuery);