/*
	penster:jiujian
	特点:加载层
    调用方式：
     new loading({ status: true, type: 1 ,$dom:''});status = true 表示 展现加载层，status = false 表示关闭，type 表示图标样式。 
     注意：应用与加载层的元素 要么有id，要么 需有属性 loadingCode ="" 。
*/
define(function(require, exports, module) {
	var loadDomCollection = {};
	function Loading(op){
		this.op = {  
			type: 0,// 图标类型
			z_index:99,
			$dom:null // 作用对象 dom（jq）
			};
		 $.extend(this.op, op);
		return this;
	};
	
	// 创建加载层
	Loading.prototype.start = function () {
	 var that = this,
	 obj = that.op.$dom;
        var eleObj = {
            ele: obj,
            eleHeigh: 0,
            eleWidth: 0,
            SetHeightAndWidth: function () {// 获取高度和宽度
                var currentEle = eleObj.ele;
                // 检查元素 的高度或者宽度是否有值，没有值，就取父元素的值
				if($(currentEle).length === 0){
				return ;
				};
                while ($(currentEle).height() <= 0 || $(currentEle).width() <= 0) {
                    currentEle = $(currentEle).parent();
                }
                eleObj.eleHeigh = $(currentEle).height();
                eleObj.eleWidth = $(currentEle).width();
            },
            Create: function () {
                var loadDomHouse = $("<dt />"),
                    loadDom = $("<dt />");
                loadDomHouse.css({ "position": "relative" });
                loadDom.css({ "position": "absolute", "height": eleObj.eleHeigh, "width": eleObj.eleWidth, "z-index": that.op.z_index });

                // 设置样式
                $(loadDom).addClass("jian_load_bg" + that.op.type);
                loadDomHouse.append(loadDom);
                loadDomHouse.prependTo(obj);

                // 找唯一标识
                var flag = "";
                if (typeof obj.selector === "string" && obj.selector != "") {
                    if (obj.selector.indexOf("#") === 0) {
                        flag = obj.selector.substring(1);
                    } else {
                        flag = $(obj).attr("loadingCode");
                    }
                }
                else {
                    flag = $(obj).attr("loadingCode");
                }	
                loadDomCollection[flag] = loadDomHouse;
             }
         };
        eleObj.SetHeightAndWidth();
        eleObj.Create();
      };
	  
      Loading.prototype.close = function () {
	   var obj = this.op.$dom;
	   $(loadDomCollection[$(obj).attr("id") || $(obj).attr("loadingCode")]).remove();
	};
	
	return Loading;
});

