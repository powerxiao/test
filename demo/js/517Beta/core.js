define(function(require, exports) {
	///////////////////////////////////////////     
	// 功能：ajax接口 
	// 参数：url－－方法路径
	// 参数：data－－传递的参数json  
	// 参数：fun－－回调函数 
	// 参数：type－－默认没有type。有type=0就有等待框
	// ///////////////////////////////////////  
	exports.simAjax = function(url, data, fun, type) {
		//调用后台方法，获取优先级list
		$.ajax({
			url: url,
			data: data,
			type: "post",
			dataType: "json",
			beforeSend: function() {
				if (type === 0) {
					layer.load(0, 2, true, "系统正在努力处理中...");
				}
			},
			success: function(data) {
				if (type === 0) {
					layer.loadClose();
				}
				if (data.Code === 0) {
					fun(data.Message);
				}
				if (data.Code === 1 || data.Code === -1) {
					layer.alert(data.Message, true, "信息", function() {
						layer.closeAll();
					});
				}
			},
			error: function(data) {
				if (type === 0) {
					layer.loadClose();
				}
				if (data) {
					try {
						var respText = res.responseText;
						if (respText.match("^\{(.+:.+,*){1,}\}$")) {
							// json格式
							var mesJson = $.parseJSON(respText);
							if (typeof mesJson.message !== "undefined") {
								layer.alert(mesJson.message);
							}
						}
					} catch (e) {}
				}
			}
		});
	};

	///////////////////////////////////////////     
	// 功能：layer弹出dom
	// 参数：title－－标题
	// 参数：id－－需要弹出dom的id  
	// ///////////////////////////////////////  
	exports.simLayer = function(title, id) {
		var i = $.layer({
			type: 1,
			fix: false,
			offset: ['100px', ''],
			area: ['auto', 'auto'], //可以设置具体长宽（自定义层不需要再设置），也可以设置成auto来自适应自定义层长宽
			border: [10, 0.3, '#000', true],
			title: [title, true],
			closeBtn: ['0', true],
			page: {
				dom: '#' + id
			}
		});
		return i;
	};

	///////////////////////////////////////////     
	// 功能：layer弹出dom
	// 参数：tmpId－－jsRender模板
	// 参数：rendId－－需要写入dom的id  
	// 参数：data－－数据
	// 参数：type－－插入方式，append，before，html（默认）
	// ///////////////////////////////////////  
	exports.renderHtml = function(tmpId, rendId, data, type) {
		var tmpHtml;
		tmpHtml = $("#" + tmpId + "").render(data);
		switch (type) {
			case "append":
				$("#" + rendId + "").append(tmpHtml);
				break;
			case "before":
				$("#" + rendId + "").before(tmpHtml);
				break;
			default:
				$("#" + rendId + "").html(tmpHtml);
				break;
		}
	};

	///////////////////////////////////////////     
	// 功能：收集form里面的name转化成json
	// 参数：$dom－－dom的class或者id
	// ///////////////////////////////////////  
	exports.serializeToJson = function(id) {
		var serializeObj = {};
		var array = this.serializeArray();
		var str = this.serialize();
		$(id).each(function() {
			if (serializeObj[this.name]) {
				if ($.isArray(serializeObj[this.name])) {
					serializeObj[this.name].push(this.value);
				} else {
					serializeObj[this.name] = [serializeObj[this.name], this.value];
				}
			} else {
				serializeObj[this.name] = this.value;
			}
		});
		return serializeObj;
	};

	///////////////////////////////////////////     
	// 功能：将数据转化成金钱格式（千位分隔符）
	// 参数：value－－需要转化的数字
	// ///////////////////////////////////////  
	exports.formatMil = function(value) {
		// 转换亿
		if (!value) {
			return value;
		}

		if (value.toString().indexOf('.') >= 0) {
			value = toDecimal2(value); // 强制保留2位小数
		}

		value = value.toString().replace(/\,/, "");
		var len = value.length;
		var value2 = parseFloat(value).toFixed(0);
		if (value2.length >= 9) {
			value = value2;
			var arr = value.split('').reverse()
			value = arr.join('');
			var lastValue = value.substr(6, 2); // 00
			lastValue = lastValue.split('').reverse().join('');
			value = value.substr(8);
			value = value.split('').reverse().join('');
			value = value + "." + lastValue; // 转小数
			value = init.formatNum(value); // 小数是否要小数点
			value = fmoney(value, 0) + " 亿";

		} else {
			value = fmoney(value, 0);
		}

		return value;
	}

	///////////////////////////////////////////     
	// 功能：将金钱格式转化成数字（）
	// 参数：value－－需要转化的金钱
	// ///////////////////////////////////////  
	exports.formatMilRever = function(value) {
		var isInt = value.indexOf('.') > -1 ? true : false;
		return isInt ? parseInt(value.replace(',', ''), 10) : parseFloat(value.replace(',', ''), 10);
	}

	///////////////////////////////////////////     
	// 功能：获取url中的name的值
	// 参数：name－－url中的name
	// 参数：url－－url。不填默认为浏览器rul
	// ///////////////////////////////////////  
	exports.queryString = function(name, url) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = url ? url : regex.exec(window.location.search);
		if (results == null) {
			return "";
		} else {
			return decodeURIComponent(results[1].replace(/\+/g, " "));
		}
	}

	// 小数格式化小数点位数
	function formatNum(value, num) {
		if (typeof num === "undefined") {
			num = 2;
		}

		if (value) {
			value = parseFloat(value).toFixed(num);
			if (value.indexOf('.') >= 0) {
				var pointValue = value.substring(value.indexOf('.') + 1);
				if (pointValue === "00") {
					value = value.substring(0, value.indexOf('.'));
				}
			}
		}

		return parseFloat(value);
	}

	function fmoney(s, n) {
		n = n > 0 && n <= 20 ? n : 2;
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";

		var l = s.split(".")[0].split("").reverse(),
			r = s.split(".")[1];
		t = "";
		for (i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		var value = t.split("").reverse().join("") + "." + r;

		var len = value.length;
		if (value.indexOf('.') >= 0) {
			var pointValue = value.substring(value.indexOf('.') + 1);
			if (pointValue === "00") {
				value = value.substring(0, value.indexOf('.'));
			}
		}

		return value;
	}

	///////////////////////////////////////////     
	// 功能：修复Number原型链上的问题
	// 参数：d－－需要保留小数后几位
	// ///////////////////////////////////////  
	Number.prototype.toFixed = function(d) {
		var s = this + "";
		if (!d) d = 0;
		if (s.indexOf(".") == -1) s += ".";
		s += new Array(d + 1).join("0");
		if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
			var s = "0" + RegExp.$2,
				pm = RegExp.$1,
				a = RegExp.$3.length,
				b = true;
			if (a == d + 2) {
				a = s.match(/\d/g);
				if (parseInt(a[a.length - 1]) > 4) {
					for (var i = a.length - 2; i >= 0; i--) {
						a[i] = parseInt(a[i]) + 1;
						if (a[i] == 10) {
							a[i] = 0;
							b = i != 1;
						} else break;
					}
				}
				s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

			}
			if (b) s = s.substr(1);
			return (pm + s).replace(/\.$/, "");
		}
		return this + "";
	};
})