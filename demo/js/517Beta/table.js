define(function(require,exports) {
	/////////////////////////////////////////     
	// 功能：合并单元格 
	// 参数：tb－－需要检查的表格ID(从左到右)
	// 参数：colLength－－需要合并的列数  
	// ///////////////////////////////////////  
	exports.mergeCells = function(tb, colLength) {
		var id = tb;
		tb = $("#" + tb).get(0);
		//   检查表格是否规整     
		if (!checkTab(tb))
			return;
		var i = 0;
		var j = 0;
		var l = 0;
		var rowCount = tb.rows.length; // 行数  
		var colCount = tb.rows[0].cells.length; // 列数  
		var obj1 = null;
		var obj2 = null;
		var objtemp1 = new Array();
		var objtemp2 = new Array();

		//为每个单元格命名,表头不命名  
		for (i = 1; i < rowCount; i++) {
			for (j = 0; j < colCount; j++) {
				tb.rows[i].cells[j].id = id + "tb_" + i.toString() + "_" + j.toString();
			}
		}
		var k = colLength - 1;
		//从后往前检查，进行逐列检查合并,开始列为colLength-1  
		for (i = k; i >= 0; i--) {
			//当i>0时有前方的单元格  
			objtemp1 = [];

			if (i > 0) {
				//查找当前单元格前几单元格,l为列值  
				for (l = 0; l < i; l++) {
					objtemp1[l] = document.getElementById(id + "tb_1_" + l.toString());
					//alert("单元格objtemp1,1_" + l.toString() + ",内容:" + objtemp1[l].innerText);
				}
			}
			obj1 = document.getElementById(id + "tb_1_" + i.toString());
			for (j = 2; j < rowCount; j++) {
				if (i > 0) {
					objtemp2 = [];
					//查找当前单元格前几单元格,l为列值  
					for (l = 0; l < i; l++) {
						objtemp2[l] = document.getElementById(id + "tb_" + j.toString() + "_" + l.toString());
					}
				}
				obj2 = document.getElementById(id + "tb_" + j.toString() + "_" + i.toString());
				if (obj1.innerText == obj2.innerText) {
					if (i > 0) {
						if (checkArray(objtemp1, objtemp2)) {
							obj1.rowSpan++;
							obj2.parentNode.removeChild(obj2);
						} else {
							obj1 = document.getElementById(id + "tb_" + j.toString() + "_" + i.toString());
							for (l = 0; l < i; l++) {
								objtemp1[l] = document.getElementById(id + "tb_" + j.toString() + "_" + l.toString());
							}
						}
					} else {
						obj1.rowSpan++;
						obj2.parentNode.removeChild(obj2);
					}

				} else {
					obj1 = document.getElementById(id + "tb_" + j.toString() + "_" + i.toString());
					if (i > 0) {
						//查找当前单元格前几单元格,l为列值  
						for (l = 0; l < i; l++) {
							objtemp1[l] = document.getElementById(id + "tb_" + j.toString() + "_" + l.toString());
							//alert("单元格objtemp1,1_" + l.toString() + ",内容:" + objtemp1[l].innerText);
						}
					}
				}
			}
		}
	}

	/////////////////////////////////////////     
	// 功能：表格全选功能（需要为tabel添加class：ChooseChkBoxPlug,同时表格第一列要包含checkbox）
	// 参数：cssColorOrTest:String/Int 颜色值和颜色名称/测试是否绑定事件需要测试传值1.
	// ///////////////////////////////////////  
	exports.chooseCheckBoxPlug = function(cssColorOrTest) {
		var CheckBoxObj = {
				LayerJSPathErr: "",
				AddJSCSS: function(jsCssOption, cssOption) {

					for (var cssColorItem in cssOption) {
						var cssColor = "<style type='text/css'>.LCCheckBoxBackColor{background-color: " + cssOption[cssColorItem] + ";}</style>";
						$("head").append(cssColor);
					}

					for (var jsCssItem in jsCssOption) {
						if (jsCssItem === "cssOption") {
							for (var cssItem in jsCssOption[jsCssItem]) {
								if (CheckBoxObj.FindCSS(cssItem)) {
									var css = "<link type='text/css' rel='stylesheet' charset='utf-8' href='" + jsCssOption[jsCssItem][cssItem] + "' />";
									$("head").append(css);
								}
							}
						} else if (jsCssItem === "jsOption") {
							for (var jsItem in jsCssOption[jsCssItem]) {
								if (CheckBoxObj.FindScript(jsItem)) {
									var script = "<script type='text/javascript' charset='utf-8' src='" + jsCssOption[jsCssItem][jsItem] + "'></script>";
									$("body").append(script);
								}
							}
						}
					}
				},
				FindScript: function(script) {
					var scriptObj = $("script");
					for (var i = 0; i < scriptObj.length; i++) {
						var $this = scriptObj[i];
						var reg = /<script.*?><\/script>/img;
						if (reg.test($this.outerHTML)) {
							if (script === "layer") {
								if ($this.outerHTML.indexOf(script + '-min.js') >= 0 || $this.outerHTML.indexOf(script + '.js') >= 0) {
									return false;
								}
							} else {
								if ($this.outerHTML.indexOf(script + '.js') >= 0) {
									return false;
								}
							}
						}
					}

					return true;
				},
				FindCSS: function(css) {
					var linkObj = $("link");
					for (var i = 0; i < linkObj.length; i++) {
						var $this = linkObj[i];
						if ($this.outerHTML.indexOf(css + '.css') >= 0) {
							return false;
						}
					}

					return true;
				},
				FindTable: function() {
					var $tableObjs = $("body").find("table");
					var tableNum = 0;
					for (var i = 0; i < $tableObjs.length; i++) {
						var $this = $($tableObjs[i]);
						if ($this.attr("class") !== undefined) {
							if ($this.attr("class").indexOf("ChooseChkBoxPlug") >= 0) {
								tableNum++;
							}
						}
					}

					return tableNum > 0 ? true : false;
				},
				AddEventListrer: function(tableObj) {
					tableObj.find("tr").each(function() {
						var $this = $(this);
						if ($this.find("td:first").find("input[type='checkbox']").attr("checked") === "checked" || $this.find("td:first").find("input[type='radio']").attr("checked") === "checked") {
							$this.find("td").addClass("LCCheckBoxBackColor");
						}
					})
				},
				Go: function(test) {
					if (CheckBoxObj.FindTable()) {
						var tableObj = $("table"),
							tableObjTrue;

						// 判断是否table第一个td中是否包含:checkbox
						for (var i = 0; i < tableObj.length; i++) {
							var $thisTable = tableObj[i],
								trObj = $($thisTable).find("tr"),
								checkBoxNum = 0;
							if ($($thisTable).attr("class") !== undefined) {
								if ($($thisTable).attr("class").indexOf("ChooseChkBoxPlug") >= 0) {
									for (var j = 0; j < trObj.length; j++) {
										var $this = $(trObj[j]);
										if ($this.find("td:first").find("input[type='checkbox']").length === 1 || $this.find("td:first").find("input[type='radio']").length === 1) {
											checkBoxNum++;
										}
									}
								}
							}

							if (checkBoxNum > 0) {
								tableObjTrue = $($thisTable);
							}

							if (tableObjTrue !== undefined) {
								var trNum = 0;

								if (test === 1) {
									try {
										layer.alert("事件绑定完毕,取消test传参正常使用吧!");
									} catch (ex) {
										if (CheckBoxObj.LayerJSPathErr === "") {
											CheckBoxObj.LayerJSPathErr = ex.message;
											console.log("ERR:" + ex.message);
											alert("事件绑定完毕,取消test传参正常使用吧!");
										}
									}
								}

								CheckBoxObj.AddEventListrer(tableObjTrue);

								tableObjTrue.find("tr").each(function() {
									var $this = $(this);
									$this.css("cursor", "pointer");
									// 全选按钮功能实现
									if (trNum === 0) {
										$this.off("click").on("click", function(e) {
											if (e.target.nodeName.toUpperCase() === "TD" || e.target.nodeName.toUpperCase() === "TH") {
												if ($this.find("td:first").find("input[type='checkbox']").length > 0) {
													if ($this.find("td:first").find("input[type='checkbox']")[0].checked) {
														$this.find("td:first").find("input[type='checkbox']").attr("checked", false);
													} else {
														$this.find("td:first").find("input[type='checkbox']").attr("checked", true);
													}

													$this.find("td:first").find("input[type='checkbox']").click();

													// click时间过后修改正确即可
													if ($this.find("td:first").find("input[type='checkbox']")[0].checked) {
														$this.find("td:first").find("input[type='checkbox']").attr("checked", false);
													} else {
														$this.find("td:first").find("input[type='checkbox']").attr("checked", true);
													}
												} else if ($this.find("th:first").find("input[type='checkbox']").length > 0) {
													if ($this.find("th:first").find("input[type='checkbox']")[0].checked) {
														$this.find("th:first").find("input[type='checkbox']").attr("checked", false);
													} else {
														$this.find("th:first").find("input[type='checkbox']").attr("checked", true);
													}

													$this.find("th:first").find("input[type='checkbox']").click();

													// click时间过后修改正确即可
													if ($this.find("th:first").find("input[type='checkbox']")[0].checked) {
														$this.find("th:first").find("input[type='checkbox']").attr("checked", false);
													} else {
														$this.find("th:first").find("input[type='checkbox']").attr("checked", true);
													}
												}
											}
										});

										if ($this.find("td:first").find("input[type='checkbox']").length >= 1 || $this.find("th:first").find("input[type='checkbox']").length >= 1) {
											var allCheckBoxObj, NowTdOrTh = false;
											if ($this.find("td:first").find("input[type='checkbox']").length >= 1) {
												allCheckBoxObj = $this.find("td:first").find("input[type='checkbox']");
												NowTdOrTh = true;
											} else if ($this.find("th:first").find("input[type='checkbox']").length >= 1) {
												allCheckBoxObj = $this.find("th:first").find("input[type='checkbox']");
											}
											// 全选功能
											allCheckBoxObj.off("click").on("click", function() {
												var trObj = $(this).parents("table:first").find("tr");
												if (trObj.find("td").length > 0) {
													if ($(this).attr("checked") === "checked") {
														var num = 0;
														trObj.each(function() {
															if (NowTdOrTh) {
																if (num !== 0) {
																	if (trObj.find("td").length > 0) {
																		if ($(this).find("td:first").find("input[type='checkbox']").length > 0) {
																			$(this).find("td:first").find("input[type='checkbox']").attr("checked", true);
																			$(this).find("td").addClass("LCCheckBoxBackColor");
																		}
																	}
																}
																num++;
															} else {
																if (trObj.find("td").length > 0) {
																	if ($(this).find("td:first").find("input[type='checkbox']").length > 0) {
																		$(this).find("td:first").find("input[type='checkbox']").attr("checked", true);
																		$(this).find("td").addClass("LCCheckBoxBackColor");
																	}
																}
															}
														});
													} else {
														var numNo = 0;
														trObj.each(function() {
															if (NowTdOrTh) {
																if (numNo !== 0) {
																	if (trObj.find("td").length > 0) {
																		if ($(this).find("td:first").find("input[type='checkbox']").length > 0) {
																			$(this).find("td:first").find("input[type='checkbox']").attr("checked", false);
																			$(this).find("td").removeClass("LCCheckBoxBackColor");
																		}
																	}
																}
																numNo++;
															} else {
																if (trObj.find("td").length > 0) {
																	if ($(this).find("td:first").find("input[type='checkbox']").length > 0) {
																		$(this).find("td:first").find("input[type='checkbox']").attr("checked", false);
																		$(this).find("td").removeClass("LCCheckBoxBackColor");
																	}
																}
															}
														})
													}
												}
											});
										}
									}

									if (trNum >= 1) {
										$this.off("click").on("click", function(e) {
											if (e.target.nodeName.toUpperCase() === "TD" || e.target.nodeName.toUpperCase() === "DIV") {
												if ($this.find("td:first").find("input[type='checkbox']").length > 0) {
													if ($this.find("td:first").find("input[type='checkbox']")[0].checked) {
														$this.find("td:first").find("input[type='checkbox']").attr("checked", false);
													} else {
														$this.find("td:first").find("input[type='checkbox']").attr("checked", true);
													}

													$this.find("td:first").find("input[type='checkbox']").click();

													// click时间过后修改正确即可
													if ($this.find("td:first").find("input[type='checkbox']")[0].checked) {
														$this.find("td:first").find("input[type='checkbox']").attr("checked", false);
													} else {
														$this.find("td:first").find("input[type='checkbox']").attr("checked", true);
													}
													var firstTr = $this.parents("table:first").find("tr:first");
													if (firstTr.find("td").length > 0) {
														var num = 0,
															checkTrueNum = 0;
														checkBoxNum = 0;
														$this.parents("table:first").find("tr").each(function() {
															if (num != 0) {
																if ($(this).find("td:first").find("input[type='checkbox']").length >= 1) {
																	checkBoxNum++;
																}
																if ($(this).find("td:first").find("input[type='checkbox']:checked").length >= 1) {
																	checkTrueNum++;
																}
															}
															num++;
														});

														if (checkBoxNum === checkTrueNum) {
															if (firstTr.find("td").length > 0) {
																firstTr.find("td:first").find("input[type='checkbox']").attr("checked", true);
															} else {
																firstTr.find("th:first").find("input[type='checkbox']").attr("checked", true);
															}
														} else {
															if (firstTr.find("td").length > 0) {
																firstTr.find("td:first").find("input[type='checkbox']").attr("checked", false);
															} else {
																firstTr.find("th:first").find("input[type='checkbox']").attr("checked", false);
															}
														}
													} else if (firstTr.find("th").length > 0) {
														if ($this.parents("table:first").find("tr").find("td:first").find("input[type='checkbox']").length === $this.parents("table:first").find("tr").find("td:first").find("input[type='checkbox']:checked").length) {
															if (firstTr.find("td").length > 0) {
																firstTr.find("td:first").find("input[type='checkbox']").attr("checked", true);
															} else {
																firstTr.find("th:first").find("input[type='checkbox']").attr("checked", true);
															}
														} else {
															if (firstTr.find("td").length > 0) {
																firstTr.find("td:first").find("input[type='checkbox']").attr("checked", false);
															} else {
																firstTr.find("th:first").find("input[type='checkbox']").attr("checked", false);
															}
														}
													}

												} else if ($this.find("td:first").find("input[type='radio']").length > 0) {
													$this.find("td:first").find("input[type='radio']").attr("checked", true);
													$this.find("td:first").find("input[type='radio']").click();
												}
											} else if (e.target.type === "checkbox") {
												$this.find("td").toggleClass("LCCheckBoxBackColor");
											} else if (e.target.type === "radio") {
												$this.find("td").toggleClass("LCCheckBoxBackColor");
												$(e.target).parents("table:first").find("tr").each(function() {
													if ($(this).find("td:first").find("input[type='radio']").attr("checked") === "checked") {
														$(this).find("td").addClass("LCCheckBoxBackColor");
													} else {
														$(this).find("td").removeClass("LCCheckBoxBackColor");
													}
												})
											}
										})
									}
									trNum++;
								});

								tableObjTrue = undefined;
							}
						}
					}
				}
			},
			cssOptionTmp, jsOptionTmp, jsCssOptionTmp, cssColorTmp, testTmp = 0;

		// 添加css
		cssOptionTmp = {
			layer: "http://rs.517na.com/js/automation/Common/layer/skin/layer.css"
		};

		// 添加js
		jsOptionTmp = {
			layer: "http://rs.517na.com/js/inter/Common/layer/layer-min.js"
		};

		jsCssOptionTmp = {
			jsOption: jsOptionTmp,
			cssOption: cssOptionTmp
		};

		// 背景颜色设置
		if (cssColorOrTest !== "" && typeof cssColorOrTest !== "undefined") {
			if (cssColorOrTest === 1) {
				testTmp = cssColorOrTest
				cssColorTmp = {
					background: "#BDD2FF"
				};
			} else {
				cssColorTmp = {
					background: cssColorOrTest
				};
			}
		} else {
			cssColorTmp = {
				background: "#BDD2FF"
			};
		}

		CheckBoxObj.AddJSCSS(jsCssOptionTmp, cssColorTmp);
		CheckBoxObj.Go(testTmp);
	}

	/////////////////////////////////////////     
	// 功能：检查表格是否规整  
	// 参数：tb－－需要检查的表格ID  
	// ///////////////////////////////////////  
	function checkTab(tb) {
		if (tb.rows.length == 0)
			return false;
		//如果只有一行表头也返回false  
		if (tb.rows.length == 1)
			return false;
		if (tb.rows[0].cells.length == 0)
			return false;
		for (var i = 0; i < tb.rows.length; i++) {
			if (tb.rows[0].cells.length != tb.rows[i].cells.length)
				return false;
		}
		return true;
	}

	//检查取出的值是否相等  
	function checkArray(arr1, arr2) {
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i].innerText == arr2[i].innerText) {

			} else {
				return false;
			}
		}
		return true;
	}

})