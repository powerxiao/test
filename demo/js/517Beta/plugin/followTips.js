/**
 * @authors  three 15-12-22
 * 说明 : 正对某一dom元素，移动上去有框来解释说明
 */
define(function(require, exports, module) {
	function followTips(op) {
		this.op = {
			tipsText: "Please insert text here!", //用于显示的文字
			tipsBorderColor: "#FFCC99",
			tipsBackgroundColor: "#FFFFEB",
			tipsFontColor: "#000000",
			tipsWidth: -1,
			tipsPosition: "bottom", //tooltips整体浮动方向
			tipsLeftDistance: 0, //tooltips整体浮动距离
			tipsArrowDistance: 0, //箭头离tooltips中心的距离,左边为正数，右边为负数
			tipsTopDistance: 0,
			$dom: null,
			isShow: false,
			name: ""
		};

		$.extend(this.op, op);
		var that = this;
		this.initTips = function() {
			that.tips(this.op.$dom, this.op);
		}
	}

	// 创建加载层
	followTips.prototype.tips = function($this, tipsInfo) {
		var name = !tipsInfo.isShow ? tipsInfo.name + "downwardtooltipsdiv" : tipsInfo.name + "downwardtooltipsdivTrue";
		if ($("body").find("." + name).length === 0) {
			$("body").append("<div class='" + name + "' style='display:none;position:absolute;width:1000px;z-index:9999'><span></span><strong></strong><em></em></div>");
		} //加一个div 让下面的span 宽度自适应
		$("body").find("." + name + " span").css({
			"height": "auto",
			"color": "#000000",
			"position": "absolute",
			"padding": "10px",
			"display": "block",
			"visibility": "visible",
			"background-color": "#FFFFEB",
			"border": "1px solid #FFCC99",
			"font-family": 'Arial Normal',
			"font-weight": "400",
			"font-style": "normal",
			"font-size": "13px",
			"text-align": "left",
			"line-height": "normal"
		});
		$("body").find("." + name + " strong").css({
			"position": "absolute",
			"bottom": "100%",
			"width": "0",
			"height": "0",
			"border-bottom": "8px solid #FFCC99",
			"border-right": "8px solid transparent",
			"border-left": "8px solid transparent"
		});
		$("body").find("." + name + " em").css({
			"position": "absolute",
			"bottom": "100%",
			"width": "0",
			"height": "0",
			"border-bottom": "8px solid #FFFFEB",
			"border-right": "8px solid transparent",
			"border-left": "8px solid transparent",
			"top": "-7px",
			"z-index": "1000"
		});
		var self = $("body").find("." + name); //整个浮动框
		if (tipsInfo.isShow === true) {
			self.show();
			calcPosition($this, self, tipsInfo);
			return false;
		}

		$this.hover(function() {
			self.show();
			calcPosition($this, self, tipsInfo);
			self.hover(function() {
				self.show();
			}, function() {
				self.hide();
			});
		}, function() {
			self.hide();
		});
	}

	function calcPosition($this, self, tipsInfo) {
		self.find("span").html(tipsInfo.tipsText);
		self.find("span").css("border", "1px solid " + tipsInfo.tipsBorderColor); //#FFCC99
		self.find("strong").css("border-bottom", "8px solid " + tipsInfo.tipsBorderColor);
		self.find("span").css("background-color", tipsInfo.tipsBackgroundColor); //#FFCC99
		self.find("em").css("border-bottom", "8px solid " + tipsInfo.tipsBackgroundColor);
		self.find("span").css("color", tipsInfo.tipsFontColor); //#FFCC99
		if (tipsInfo.tipsWidth !== -1) {
			if (tipsInfo.tipsWidth < 100) {
				tipsInfo.tipsWidth = "100";
			}
			self.find("span").css("width", tipsInfo.tipsWidth);
		} else {
			tipsInfo.tipsWidth = self.find("span").width();
		}

		var middleDivPosition = self.find("span").width() / 2;
		var selfWidth = self.find("span").width();
		var $span = self.find("span");
		if (tipsInfo.tipsPosition === "left") {
			self.css({
				"top": $this.offset().top - $this.height() / 2 + tipsInfo.tipsTopDistance,
				"left": $this.offset().left - tipsInfo.tipsWidth - 30 + tipsInfo.tipsLeftDistance
			});
			self.find("strong").css({
				"left": tipsInfo.tipsWidth + 21,
				"top": tipsInfo.tipsArrowDistance,
				"border-left": "8px solid #FFCC99",
				"border-top": "8px solid transparent",
				"border-bottom": "8px solid transparent"
			});
			self.find("em").css({
				"left": tipsInfo.tipsWidth + 19,
				"top": tipsInfo.tipsArrowDistance,
				"border-left": "8px solid #FFFFEB",
				"border-top": "8px solid transparent",
				"border-bottom": "8px solid transparent",
			});
		} else if (tipsInfo.tipsPosition === "right") {
			self.css({
				"top": $this.offset().top - $this.height() / 2 + tipsInfo.tipsTopDistance,
				"left": $this.offset().left + $this.width() + tipsInfo.tipsLeftDistance
			});
			self.find("strong").css({
				"left": -16,
				"top": tipsInfo.tipsArrowDistance,
				"border-right": "8px solid #FFCC99",
				"border-top": "8px solid transparent",
				"border-bottom": "8px solid transparent"
			});
			self.find("em").css({
				"left": -14,
				"top": tipsInfo.tipsArrowDistance,
				"border-right": "8px solid #FFFFEB",
				"border-top": "8px solid transparent",
				"border-bottom": "8px solid transparent",
			});
		} else if (tipsInfo.tipsPosition === "top") {
			self.css({
				"top": $this.offset().top - $span.height() - 30 + tipsInfo.tipsTopDistance,
				"left": $this.offset().left + tipsInfo.tipsLeftDistance
			});
			self.find("strong").css({
				"top": 36,
				"left": tipsInfo.tipsArrowDistance,
				"border-top": "8px solid #FFCC99",
				"border-left": "8px solid transparent",
				"border-right": "8px solid transparent",
				"border-bottom": "none"
			});
			self.find("em").css({
				"top": 35,
				"left": tipsInfo.tipsArrowDistance,
				"border-top": "8px solid #FFFFEB",
				"border-left": "8px solid transparent",
				"border-right": "8px solid transparent",
				"border-bottom": "none"
			});
		} else if (tipsInfo.tipsPosition === "bottom") {
			self.css({
				"top": $this.offset().top + $this.height() + 8 + tipsInfo.tipsTopDistance,
				"left": $this.offset().left + tipsInfo.tipsLeftDistance
			});
			self.find("strong").css({
				"left": middleDivPosition - tipsInfo.tipsArrowDistance
			});
			self.find("em").css({
				"left": middleDivPosition - tipsInfo.tipsArrowDistance
			});
		}
	}

	return followTips;

});