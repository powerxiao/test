/*
	penster:jiujian
	特点:结合ztree、layer友好的交互，完成数据的选择。
*/
define(function(require, exports, module) {
        // 加载
        function SelectorLoad(opt) {
            var  options = {// 设置默认参数
			id:"", // 必填
                        title: "人员选择",
                        singleSelect: false,      // 单选 
                        nodeConfig: { // tree 节点数据项的配置 
                            idKey: "",  //id
                            pIdKey: "",  //pid
                            name: "",	// 节点名称
			         bindKey:"" // 用于反绑数据，必须唯一
                        },
                        checkLevel: 1, // checkbox 应用的级数 （如3表示应用于三级或以上）为空默认 全部有checkbox
                        hightLevelName: [false, 10, "-"],// false:是否返回上级名称,返回多少级上级名称，分隔符
                        searchPara: [], // 查询字段
			specialCheck:false,// 特殊选中 情况 true 触发
                        isSelParent: false,
			bindData:[],// options.nodeConfig.KeyID
                        data: [],// json数据
                        url: "", // 链接
                        loadComplete: "",// 加载完成后的回调方法
                        success: "" // 点击确定后的回调方法
                    },
            layerindex,
            /*
		展示部门选择器 
	  */
            staffSelector = {
                selContainer: [],// 存放 已选择的 人员临时容器 
                selRealContainer: [],// 存放 已选择的 人员最终容器 
                selWrapContainer: [],// 存放 已选择人员wrap的 容器
                firstSearch: true,
                getOptions: function () { return options },
                init: function () {// 初始化数据及默认参数
                   
					
			var $this = jQuery("#"+options.id);
				// 注册一个事件
				$this.on('click', function () {
					// 展示部门选择器
					staffSelector.showSelector();
				});
                },
                showSelector: function () {

                    // 检查传入的参数，是否存在问题
                    if (!staffSelector.checkParamData()) {
                        return false;
                    }
                    // 初始化弹出层
                    initLayer();
                    // 初始化ztree
                    treeObj.initZTree();

                },
                checkParamData: function () {// 配置检查
                    //检查node节点配置
                    var message = [];
                    for (var config in options.nodeConfig) {
                        if ($.trim(options.nodeConfig[config]) === "") {
                            message.push(config);
                        }
                    }
                    if (message.length > 0) {
                        layer.alert("节点配置：" + message.toString() + "不能为空");
                        return false;
                    }
                    // 检查查询参数问题
                    if (options.searchPara.length > 0) {
                        for (var index in options.searchPara) {
                            if (options.searchPara[index].feild === undefined || options.searchPara[index].searchType === undefined) {
                                layer.alert("查询参数关键字错误");
                                return false;
                            }
                            if ($.trim(options.searchPara[index].feild) === "" || $.trim(options.searchPara[index].searchType) === "") {
                                layer.alert("查询参数不能为空");
                                return false;
                            }
                            if (options.searchPara[index].searchType != "fuzzy" && options.searchPara[index].searchType != "accurate") {
                                layer.alert("查询关键字searchType的值只能为fuzzy或者accurate");
                                return false;
                            }
                        }
                    }

                    // 检查数据是否为空
                    if (options.data.length === 0 && $.trim(options.url) === "") {
                        layer.alert("数据Data或者url不能为空");
                        return false;
                    }
                    return true;
                },
                GetSelectedData: function () {// 获得选中的数据
                    // 清除 无用数据
                    var newData = {},
                    data = []; // 返回给用户的数据
                    for (var id in staffSelector.selContainer) {
                        if (staffSelector.selContainer[id] != undefined) {
                            newData[id] = staffSelector.selContainer[id];
                            data.push(staffSelector.selContainer[id]);
                        }
                    }
                    // newdata  的作用其实就是过滤一下 已经删除的废弃数据。
                    staffSelector.selContainer = newData;
                    staffSelector.selRealContainer = jQuery.extend(true, {}, newData);// 克隆数组

                    //填充层级名字
                    if (options.hightLevelName[0]) {
                        data = staffSelector.GetHightLevelName(data);
                    }

                    // 执行回调
                    if (options.success != "") {
                        options.success(data);
                    }
                },
                GetHightLevelName: function (data) {//得到层级名称

                    var keyId = options["nodeConfig"]["idKey"],
                             name = options["nodeConfig"]["name"],
                             hightNameLevel = options.hightLevelName[1],
                         nameCutLine = options.hightLevelName[2];

                    for (var d in data) {
                        var hightName = [];
                        var node = staffSelector.zTreeObj.getNodeByParam(keyId, data[d][keyId], null);
                        var currentNode = node;
                        for (var i = 0; i < hightNameLevel; i++) {
                            if (currentNode.level == 0) {
                                break;
                            }
                            currentNode = currentNode.getParentNode();
                            hightName.push(currentNode[name]);

                        }
                        // 得到字符窜形式的name
                        var HightName = "",
                            hightNameLength = hightName.length;
                        for (var j = hightNameLength - 1; j >= 0; j--) {
                            if (j == 0) {
                                HightName += hightName[j];
                            } else {
                                HightName += hightName[j] + nameCutLine;
                            }
                        }

                        data[d].HightLevelName = HightName;
                    }
                    return data;
                },
                search: function (serachParam) {// 搜索方法
                    var k = 0,
                        length = options.searchPara.length;
                    staffSelector.searchResult = [];

                    for (var i = 0; i < length; i++) {
                        var result = [];
                        // 匹配方式 有两种 模糊与精确
                        if (options.searchPara[i].searchType === "accurate") {
                            result = staffSelector.zTreeObj.getNodesByParam(options.searchPara[i].feild, serachParam);
                        } else if (options.searchPara[i].searchType === "fuzzy") {
                            result = staffSelector.zTreeObj.getNodesByParamFuzzy(options.searchPara[i].feild, serachParam);
                        }
                        var resultLength = result.length;
                        for (var j = 0; j < resultLength; j++) {
                            staffSelector.searchResult[k++] = result[j];
                        }
                    }
                },
                deleteHasSelStaff: function (id, name) {// 删除已选择的人员
                    staffSelector.selContainer[id + name] = undefined;
                    //删除ztree中对应的节点。
                    treeObj.checkedZTree(id, name, false);
                },
                deleteHasSelAllStaff: function () {// 清空已选择的人员
                    // 树形控件是否加载完成,没有则返回
                    if (staffSelector.zTreeObj === undefined) { return false; };

                    staffSelector.selContainer = {};

                    // 删除选中wrap中的数据
                    $("#selectedWrap").html("");
                    staffSelector.selWrapContainer = {};
                    // 删除树形控件中的数据
                    var rootNodes = staffSelector.zTreeObj.getNodes(),
                        nodes = [];
                    for (var rootNode in rootNodes) {
                        // 遍历出所有子节点
                        nodes = treeObj.getChild(rootNodes[rootNode]);
                        if (nodes.length === undefined)
                            continue;
                        // 勾上 已经选择的数据
                        for (var i = 0; i < nodes.length ; i++) {
                            nodes[i].checked = false;
                            nodes[i].open = false;
                        }
                    }
                    // 刷新tree
                    staffSelector.zTreeObj.refresh();
                },
                deleteSelWrap: function (key) {// 删除 人员容器
                    staffSelector.selWrapContainer[key].remove();
                    // 删除容器中对应的wrap 
                    staffSelector.selWrapContainer[key] = undefined;
                    // 以及删除  选中数据
                    staffSelector.selContainer[key] = undefined;
                },
                addSelStaff: function (node) {// 添加 选择的人员
                    // MODEL
                    var dataModel = {};
                    for (var i in options.nodeConfig) {
                        dataModel[options["nodeConfig"][i]] = node[options["nodeConfig"][i]];
                    }
                    staffSelector.selContainer[node[options.nodeConfig.idKey] + node[options.nodeConfig.name]] = dataModel;
                },
                createSelStaffWrap: function (treeNode) {// 创建div
                    var selSpan = $("<span/>");
                    selSpan.html("<span class='nodeNameSpan'>" + treeNode[options.nodeConfig.name] + "</span><a href = \"javascript:void(0);\" class=\"deptPlug_remove-link deptPlug_dataBackGround\"></a>" +
                    "<input class = 'keyId' type='hidden' value='" + treeNode[options.nodeConfig.idKey] + "'>");
                    selSpan.addClass("deptPlug_dataWrap");
                    $("#selectedWrap").append(selSpan);
                    // 将wrap 添加到 容器中
                    var key = treeNode[options.nodeConfig.idKey] + treeNode[options.nodeConfig.name];
                    staffSelector.selWrapContainer[key] = selSpan;

                    // 注册点击关闭事件
                    $(selSpan.find("a")[0]).on('click', function () {

                        var keyId = selSpan.find(".keyId").val(),
                        nodeName = selSpan.find(".nodeNameSpan").html();
                        // 关掉 层
                        selSpan.remove();
                        // 删除容器中对应的wrap 
                        staffSelector.selWrapContainer[key] = undefined;
                        // 清除 已删除的人 的数据
                        staffSelector.deleteHasSelStaff(keyId, nodeName);

                        // 计数
                        staffSelector.checkCount();
                    });
                    return selSpan;
                },
                backUpData: function () {// 回绑数据
                    var data = [];
                    // 清空wrap
                    staffSelector.selWrapContainer = {};
                    for (var id in staffSelector.selContainer) {
                        var dataModel = staffSelector.selContainer[id];
                        if (dataModel != null) {
                            staffSelector.createSelStaffWrap(dataModel);
                        }
                    }

                    treeObj.checkedZTreeForBigData();
                    // 计数
                    staffSelector.checkCount();
                },
		bindData:function(selecter,data,keys){
			 for (var index = 0; index < data.length; index++) {
						for (var indexI in data) {
							var per = data[indexI];
							if (per[options.nodeConfig.bindKey] === keys[index]) {
							
								var  perData = {};
								for(var key in  options.nodeConfig){
									var value = options.nodeConfig[key];
									perData[value] = per[value]
								}
								selecter.selRealContainer[per[options.nodeConfig.idKey] + per[options.nodeConfig.name]] = perData;
							}
						}
					}
		},
                singleCheckHandle: function () { //单选

                    // 清空已选的数据
                    for (var wrap in staffSelector.selWrapContainer) {
                        delete staffSelector.selContainer[wrap];
                        if (staffSelector.selWrapContainer[wrap] != undefined) {
                            staffSelector.selWrapContainer[wrap].remove();
                            staffSelector.selWrapContainer[wrap] = undefined;
                        }
                    }
                },
                checkCount: function () {// 统计

                    var count = 0;
                    for (var wrap in staffSelector.selWrapContainer) {

                        if (staffSelector.selWrapContainer[wrap] != undefined) {
                            count++;
                        }
                    }

                    $("#deptPlug_selectedCount").html(count);
                },
                eventRegister: function () {
                    // 取消
                    $("#btnCancle-jian").on('click', function () {
                        // 清空 临时容器
                        staffSelector.selContainer = [];
                        layer.close(layerindex);
                    });

                    // 确定
                    $("#btnConfirm-jian").on('click', function () {
                        // 将数据返回个页面
                        staffSelector.GetSelectedData();
                        layer.close(layerindex);
                    });

                    // 注册点击事件 处理ztree的搜索
                    $("#deptPlug_searchBtn").on('click', function () {

                        var serachParam = $("#searchInput").val();
                        if (serachParam === "") return;
                        // 清空上次 查询结果
                        if (staffSelector.searchResult != undefined) {
                            SearchBindAndNoBind(staffSelector.searchResult, false);
                        }
                        // 执行查询
                        staffSelector.search(serachParam);
                        SearchBindAndNoBind(staffSelector.searchResult, true);


                    });
                    // 清空已选数据
                    $("#clearAll").on('click', function () {

                        staffSelector.deleteHasSelAllStaff();
                        staffSelector.checkCount();

                    });
                    // 按键 按下事件
                    $("#searchInput").on('keydown', function (event) {

                        event = event || window.event;
                        currKey = event.keyCode || event.which || event.charCode;
                        if (currKey == 13) {
                            // 要处理的内容
                            $("#deptPlug_searchBtn").click();
                            currKey = 0;
                            // 阻止事件冒泡
                            if (event && event.stopPropagation) {
                                event.stopPropagation()
                            }
                            else {
                                window.event.cancelBubble = true;
                            }
                            return false;
                        }
                    });
                }
            },
            treeObj = { // 主要是操作tree的方法

                initZTree: function () {// 初始化 ztree参数
                    var setting = {
                        check: {
                            enable: true,
                            autoCheckTrigger: true,
                            chkStyle: options["singleSelect"] == false ? "checkbox" : "radio",
			    chkboxType: { "Y": options["specialCheck"]?"":"ps", "N": options["specialCheck"]?"":"ps" },
                            radioType: "all"
                        },
                        data: {
                            simpleData: {
                                enable: true,
                                idKey: options.nodeConfig.idKey,
                                pIdKey: options.nodeConfig.pIdKey,
                                rootPId: 0
                            }, key: {
                                name: options.nodeConfig.name
                            }
                        },
                        view: {
                            fontCss: getFontCss
                        },
                        callback: {
                            //onDblClick: treeObj.zTreeOnDblClick,
                            onCheck: treeObj.zTreeOnCheck,
                            onClick: treeObj.zTreeOnClick
                        },
                        async: {
                            enable: true

                        }
                    },
                    treeNodes = {};

                    // 获取数据 (一种是直接提供data，一种是提供url，ajax去获取)
                    if (options.data.length != 0) {// 直接给出数据data方式
                        treeNodes = options.data;
                        staffSelector.zTreeObj = $.fn.zTree.init($("#ztreeWrap"), setting, treeNodes);
			
                        // 对临时数据 赋值
                        staffSelector.selContainer = jQuery.extend(true, {}, staffSelector.selRealContainer);
                        // 如果有数据先加载 数据
                        staffSelector.backUpData();
                    } else {//给出url形式

                        $.ajax({//给出url,用ajax 去获取数据
                            url: options.url,
                            type: "post",
                            beforeSend: function () {
                                $("#ztreeWrap").addClass("deptPlug_loadBg");
                            },
                            success: function (data) {
                                // string 转换 json
                                if (typeof data === "string") {
                                    try {
                                        data = eval("(" + data + ")");
                                    }
                                    catch (e) {
                                        layer.alert("数据格式错误!");
                                    }
                                }

                                $("#ztreeWrap").removeClass("deptPlug_loadBg");
                                treeNodes = data;
                                options.data = data;// 将数据缓存下来
                                staffSelector.zTreeObj = $.fn.zTree.init($("#ztreeWrap"), setting, treeNodes);

                                // 树形控件 加载完成执行的方法
                                if (options.loadComplete != "") {
                                    options.loadComplete(staffSelector,data);
                                }
				// 绑定数据
				if(options.bindData.length>0){
					staffSelector.bindData(staffSelector,data,options.bindData);
				}
                                // 对临时数据 赋值
                                staffSelector.selContainer = jQuery.extend(true, {}, staffSelector.selRealContainer);
                                // 如果有数据先加载 数据
                                staffSelector.backUpData();

                            },
                            error: function (data) {
                                $("#ztreeWrap").removeClass("deptPlug_loadBg");
                                layer.alert("出错了，请配置正确的数据源", true, "信息", function (index) {
                                    layer.closeAll();
                                });
                            }
                        });
                    }
                },
                zTreeOnClick: function (event, treeId, treeNode) {
                    if (treeNode.isParent && !options["isSelParent"]) {
                        return; 
                    };
                    // 触发 check或者radio选中
                    staffSelector.zTreeObj.checkNode(treeNode, !treeNode.checked, true, true);
                },
                zTreeOnCheck: function (event, treeId, treeNode) {// 点击checkbox 所执行的方法
			
                    // 处理单选情况
                    if (options["singleSelect"]) {
                        staffSelector.singleCheckHandle();
                    }

                    // 如果点击类型为勾选 ，将选中的节点 加到右边方框中
                    if (staffSelector.selContainer[treeNode[options.nodeConfig.idKey] + treeNode[options.nodeConfig.name]] === undefined && (!treeNode.isParent || options["isSelParent"]) && treeNode.checked) {
                        // 创建已选择的人员div
                        staffSelector.createSelStaffWrap(treeNode);
                        // 将数据添加进数据模型中
                        staffSelector.addSelStaff(treeNode);
						
		       // 特殊选中	
			if(options["specialCheck"]){
				//  清除子节点 
				var nodes = treeObj.getChildDetachMe(treeNode);
				treeObj.deleteTreeNode(nodes);
				
				// 清除所有父级节点
				var nodes_ = treeObj.getParent(treeNode);
				treeObj.deleteTreeNode(nodes_);
			}
						
                    } else if (!treeNode.checked && (!treeNode.isParent || options["isSelParent"]) && staffSelector.selContainer[treeNode[options.nodeConfig.idKey] + treeNode[options.nodeConfig.name]] != undefined) {
                        // 如果点击类型为取消勾选，删除右边方框中对应的节点
                        //staffSelector.createSelStaffDiv
                        var key = treeNode[options.nodeConfig.idKey] + treeNode[options.nodeConfig.name];
                        staffSelector.deleteSelWrap(key);
                    }
                    // 计数
                    staffSelector.checkCount();

                },
                checkedZTree: function (id, name, type) {// 将节点 取消或者选中 根据id+name
                    function filter(node) {
                        return (node[options["nodeConfig"]["name"]] == name && node[options["nodeConfig"]["idKey"]] == id);
                    };
                    var node1 = staffSelector.zTreeObj.getNodesByFilter(filter);
                    staffSelector.zTreeObj.checkNode(node1[0], type, true);
                },
                checkedZTreeForBigData: function () {// 将节点 取消或者选中 根据id+name 对于大数据而言
                    var rootNode = staffSelector.zTreeObj.getNodes(),
                        nodes = [];
                    for (var index in rootNode) {
                        // 遍历出所有子节点
                        nodes = treeObj.getChild(rootNode[index]);
                        if (nodes.length === undefined)
                            continue;
                        // 勾上 已经选择的数据
                        var length = nodes.length;
                        for (var i = 0; i < length ; i++) {
                            var node = nodes[i];
                            if (staffSelector.selContainer[node[options["nodeConfig"]["idKey"]] + node[options["nodeConfig"]["name"]]] != undefined) {
                                node.checked = true;

                                // 展开选中节点的上级节点，以便能够一眼就能看见
                                var p = node;
                                for (var j = 0; j < node.level; j++) {
                                    p = p.getParentNode();
                                    p.open = true;
                                }
                            }
                            // 设置check展示级数
                            if (node.level < options["checkLevel"] && node.isParent) {
                                node.nocheck = true;
                            }
                        }
                    }
                    // 刷新tree
                    staffSelector.zTreeObj.refresh();

                },
		deleteTreeNode:function(allNodes){ // 删除指定 节点下面的所有选中的孩子节点(右边)
			if(typeof allNodes.length !== "undefined"){
				for(var i = 0;i<allNodes.length;i++){
					var node = allNodes[i];
					if(node.checked ){
					     var key = node[options.nodeConfig.idKey] + node[options.nodeConfig.name];
						 node.checked = false;
						staffSelector.deleteSelWrap(key);
					}
				}
			}
			staffSelector.zTreeObj.refresh();
		},
                getChild: function (node) {// 获得 一个节点下的所有节点
                    var allNode = [];
                    if (!node.isParent || options["isSelParent"]) {
                        allNode.push(node);
                    }
                    if (node.isParent) {
                        var nodeCurr = node.children,
                            length = nodeCurr.length;
                        for (var i = 0; i < length; i++) {
                            allNode = allNode.concat(treeObj.getChild(nodeCurr[i]));
                        }
                        allNode.push(node);
                    }
                    return allNode;
                },
		 getChildDetachMe: function (node) {// 获得 一个节点下的所有节点 不包括自己本身
                    var allNode = [];
                    if (node.isParent) {
                        var nodeCurr = node.children,
                            length = nodeCurr.length;
                        for (var i = 0; i < length; i++) {
                            allNode = allNode.concat(treeObj.getChild(nodeCurr[i]));
                        }
                    }
                    return allNode;
                },
                getParent: function (node) {// 获得 一个节点下的所有节点
                    var allNode = [],
			   currNode = node;
                    while(currNode.level !== 0){
				currNode = currNode.getParentNode();	
				allNode.push(currNode);
			}
			return allNode;
                }
            };
            // 初始化弹出层
            function initLayer() {

                var offsetTop = 200;
                if (self != top) {
                  //  offsetTop = self.parent.scrollY + 200;
                }
                layerindex = $.layer({
                    type: 1,
                    area: ['600', '420'],//可以设置具体长宽（即自定义层长宽），若自定义层已有长宽限制，则可以设置成auto来自适应
                    border: [10, 0.3, '#000', true],
                    title: [options["title"], true],
                    closeBtn: ['0', true],
                    offset: [offsetTop, '50%'],
                    page: {
                        html: '<div style="padding:10px;width:580px;font-family:Microsoft YaHei;">' +

                            '<div style="width:100%;margin-left:10px;">' +
                                '<span type="text" class="deptPlug_searchWrap">' +
                                        '<input id="searchInput" placeholder="请输入关键字"/>' +
                                        '<a href = "javascript:void(0);" id = "deptPlug_searchBtn" class="deptPlug_remove-link deptPlug_searchBackGround"></a>' +
                                '</span >' +
                            '</div>' +
                            '<div id = "ztreeWrap" class="ztree" style="height:280px;overflow:auto;width:300px;float:left;"></div>' +
                            '<div class= "deptPlug_wrapFirst" >' +
                                '<span class="deptPlug_topWrap">' +
                                    '<span>已选择数据&nbsp;&nbsp;<label class="deptPlug_red" id="deptPlug_selectedCount"> 0</label>&nbsp;&nbsp;条</span>' +
                                    '<a href = "javascript:void(0);" id="clearAll" class="deptPlug_remove-link deptPlug_topBackGround"></a>' +
                                '</span >' +
                                '<div class="deptPlug_wrap" id="selectedWrap">' +
                                '</div>' +
                            '</div>' +
                            '<div style="clear:both;text-align:right">' +
                            '<input type="button" value="确定" id="btnConfirm-jian"  class="deptPlug_modi" /><input type="button" value="取消" id="btnCancle-jian"  class="deptPlug_modi" />' +
                            '</div></div>'

                    }
                });
                // 注册事件
                staffSelector.eventRegister();

            };
            // 绑定选中的项
            function getFontCss(treeId, treeNode) {
                return (!!treeNode.highlight) ? { color: "#A60000", "font-weight": "bold" } : { color: "#333", "font-weight": "normal" };
            }
            function SearchBindAndNoBind(resultList, flag) {
                if (staffSelector.searchResult != undefined)
                    for (var i = 0, l = resultList.length; i < l; i++) {
                        if (!resultList[i].isParent || options["isSelParent"]) {
                            resultList[i].highlight = flag;
                            staffSelector.zTreeObj.updateNode(resultList[i]);
                            var parent = resultList[i].getParentNode();
                            staffSelector.zTreeObj.expandNode(parent, flag, false, true, true);
                        }
                    }
            }

            // 初始化参数
            staffSelector.init();
            // 对参数赋值
            jQuery.extend(options, opt);
	   this.render = function(){
		     staffSelector.init()
	     };
        };
		
	return SelectorLoad;
});