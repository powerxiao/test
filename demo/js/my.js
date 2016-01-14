define(function(require, exports, module, Better) {
	Better.use(["treeSelect", "loading", "detail", "followTips", "previewPic", "interCity", "city", "threeLink", "queryFilter", "autoComplete"], function(treeSelect, loading, detail, Tips, Pic, InterCity, City, ThreeLink, QueryFilter, AutoComplete) {
		var d = {

			init: function() {
				new loading({
					type: 2,
					$dom: $("#main")
				}).start();

				setTimeout(function() {
					new loading({
						$dom: $("#main")
					}).close();
				}, 1500);
				// 注册人员选择 
				new treeSelect({
					id: "selBtn",
					title: "人员选择",
					data: treeData, // 必填

					singleSelect: false, //单选
					checkLevel: 2,
					nodeConfig: { // tree 节点数据项的配置 
						idKey: "DomainDeptID", //id 必填	
						pIdKey: "ForeNodeCode", //pid 必填
						name: "DeptNodeName" // 节点名称 必填
					},
					searchPara: [{
						feild: "DeptNodeName",
						searchType: "fuzzy"
					}, {
						feild: "DomainDeptID",
						searchType: "accurate"
					}], // 查询字段
					success: function(data) {
						$("input[name='buyerID']").val(data[0].DomainDeptID);
						$("input[name='buyerAccount']").val("11025ew");
						$("input[name='buyerName']").val(data[0].DeptNodeName);
					}
				}).render();



				// 注册保存按钮
				$("#saveBtn").on('click', function() {
					// 验证数据
					if (!detail.checkRequired(["buyerID", "addTime", "endTime", "reason"], $("#main"))) {
						return false;
					};
					layer.alert("保存成功");
				});
				new Tips({
					tipsText: "你猜猜?",
					$dom: $("#chonger"),
					name: "chonger",
					isShow: false,
					tipsPosition: "top",
					tipsLeftDistance: 0,
					tipsTopDistance: 0,
					tipsArrowDistance:10
				}).initTips();
				new Pic({
					$dom: $("#testImg"),
					$imgArr: [$("#img1"), $("#img2"), $(".img3")],
					picSize: 2
				})
				new InterCity({
					$dom: $("#bCity"),
					cityName: "",
					cityType: 1,
					cityFlightInter: "",
					cityLimit: 1,
					callBack: function(data) {
						alert(data);
					}
				}).InitCityInter();
				new City({
					cityName: "",
					$dom: $("#city"),
					callBack: function(data) {
						alert(data);
					}
				}).InitCity();
				new ThreeLink({
					$dom: $("#areas"),
					linkNum: 2,
					linkName: ["选择省", "选择市"]
				}).initLink();
				var param = [{
					filterName: "起飞时段",
					field: "TakeOffTime",
					map: {
						value: "time",
						name: "timeName"
					},
					item: [{ // 出发时间
						time: "6-12",
						timeName: "上午(6-12点)"
					}]
				}];
				new QueryFilter({
					$dom: $("#filter"), // 加载的地方，dom
					filterParam: param, //参数，即 要参加筛选的条件.格式如下
					fun: function(condition, $cliObj) { // 返回值，1筛选条件，2区域$dom(可以不填) 
						console.log(condition) // 按F12 看结果
					}
				}).render();
				new AutoComplete({
					$dom: $("#autoComplete"),
					ajaxOp: {
						url: "/PNRImport/SearchFrequent",
						type: "POST",
						cache: false,
						dataKey: {
							searchKey: "ChineseName"
						}
					},
					filterOp: {
						searchKeys: "ChineseName", // 检索关键字 |分隔
						displayWords: "ChineseName|CardID", // 下拉层显示内容 |分隔
						displayFormat: "ChineseName(CardID)", // 下拉层显示格式
						checkValue: "ChineseName", // 选中显示内容
						passValue: "", // 传值信息
						showNotFound: false, // 未找到时是否显示提示
						useCache: false, // 是否使用前端缓存
						ruquires: false, // 是否必须:离开后会不会默认选中
						callBack: function(data, e) {

						}
					}
				}).initComplete()
			}
		};
		d.init();
	});
});