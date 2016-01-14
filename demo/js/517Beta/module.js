/**
 * @authors 万三
 */
define(function(require, exports, module) {
	exports.use = function(arrs, callback) {
		Paths.checkParamPath(arrs);
		var adds = [],
			rely = [];
		// 导入模块分类
		Paths.categoryPath(arrs, adds, rely);
		// Load resource AMD 加载资源 首先加载依赖 然后加载本体
		require.async(rely, function() {
			require.async(adds, function() {
				var agu = [].slice.apply(arguments);;
				var fun = callback;
				fun.apply(window, agu);
			});
		});
	};


	// 检查模块
	var Check = function() {
		var argu = [].slice.apply(arguments);
		var fun = {
			// 加载模块 参数检查 
			"parameter": function(arrs, aliasGroup) {
				var errorArr = [];
				$.each(arrs, function(index) {
					if (typeof aliasGroup[arrs[index]] === "undefined") {
						errorArr.push(arrs[index]);
					};
				});
				if (errorArr.length > 0) {
					this.bridge(errorArr, function(message) {
						throw new Error("不存在如下模块:" + message);
					});
				};
			},
			bridge: function(errorArr, cb) {
				cb(errorArr.join(','));
			}
		};
		fun[arguments[0]].apply(fun, argu.slice(1));
	};
	// 路劲
	var Paths = function(basePackage, pluginPackage, featurePackage) {
		var paths = {};
		return {
			mergePath: function() {
				paths["__"] = new Date().getTime();
				this.analyze(basePackage);
				this.analyze(pluginPackage);
				this.analyze(featurePackage);
			},
			categoryPath: function(arrs, adds, rely) { // 分类path adds rely
				// Analytic alias 解析别名
				$.each(arrs, function(index) {
					var path = paths[arrs[index]];
					if (Object.prototype.toString.call(path) === "[object Array]") {
						for (var i = 0, len = path.length; i < len; i++) {
							var per = path[i];
							if (per.indexOf(".css") > -1) { // 依赖(css)
								rely.push(per);
							} else if (per.indexOf(".js") === -1) { // 依赖(base)
								Array.prototype.push.apply(rely, paths[per])
							} else {
								adds.push(per);
							}
						}
					} else {
						adds.push(path);
					}
				});
			},
			analyze: function(pack) {
				for (var key in pack) {
					if (pack.hasOwnProperty(key)) {
						var pathArr = pack[key];
						if (typeof paths[key] === "undefined") {
							paths[key] = [];
							Array.prototype.push.apply(paths[key], pathArr);
						}
					}
				}
			},
			checkParamPath: function(arrs) { // 检查传入的参数，是否正确
				Check("parameter", arrs, paths);
			},
			initPath: function() {
				if (typeof paths["__"] === "undefined") {
					this.mergePath();
				}
				return this;
			}
		};
	};
	// ===================================基础配置==================================
	/*
		在配置的时候会更加的明确。主要目的是方便配置
	*/
	// 基础包 . 方便统一管理第三方插件。避免出现版本不一致，或者不同组件间引用多
	// 个版本.
	var basePackage = {
		"layer": ["./base/layer/layer-min.js", "./base/layer/skin/layer.css"],
		'zTree': ["./base/zTree_v3/js/jquery.ztree.core-3.5.min.js", "./base/zTree_v3/js/jquery.ztree.excheck-3.5.min.js", "./base/zTree_v3/css/zTreeStyle/zTreeStyle.css"]
	};
	// 组件包(基础包放前面 组件js放后面)
	var pluginPackage = {
		"treeSelect": ["layer", "zTree", "./plugin/treeSelect/treeSelect.js", "./plugin/treeSelect/skin/treeSelect.css"],
		"loading": ["plugin/loading/skin/loading.css", "plugin/loading/loading.js"],
	    "followTips": ["plugin/followTips.js"],
	    "previewPic": ["plugin/previewPic.js"],
	    "city":["plugin/city/skin/city.css","plugin/city/city.js"],
	    "interCity":["plugin/interCity/skin/city.css","plugin/interCity/interCity.js"],
	    "threeLink":["plugin/threeLink/threeLink.js"],
	    "queryFilter":["plugin/queryFilter/img/pic.png","plugin/queryFilter/queryFilter.js"],
	    "autoComplete":["plugin/autoComplete.js"]
	};
	// 功能包
	var featurePackage = {
			"table": ["./table.js"],
			"detail": ["./detail.js"],
			"core": ["./core.js"]
		}
		// init path
	Paths = Paths(basePackage, pluginPackage, featurePackage).initPath();
})