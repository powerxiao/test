 define(function(require, exports, module) {
 /*
     * 日期比较函数new
     * @startDate String 起始日期
     * @endDate String 截止日期
     * @compareType String 比较类型（跨年y、跨月m）
     * @crossNum int 表示不能跨月数（包含）1表示不能跨1个月，小于等于0或者其他都不做判断.
     * @keyWords String 关键字,重新拼接提示信息，默认"开始日期不能为空！"；例：查询:重新定义为"查询开始日期不能为空！".
     */
    exports.compareDate = function(options) {
        /**
         * 初始化参数
         */
        var config = {
                startDate: "",
                endDate: "",
                compareType: "m",
                crossNum: 0,
                keyWords: ""
            },
            msg = "",
            start = "",
            end = "";

        /**
	 * 公布参数
	 */
        $.extend(config, options);

        if (typeof config.crossNum !== "number") {
            config.crossNum = parseInt(config.crossNum, 10);
        }

        /**
         * 开始时间不能为空.
         */
        if (config.startDate.replace(/(^\s*)|(\s*$)/g, "") === "") {
            msg = "开始日期不能为空！";
            if (config.keyWords !== "" && typeof config.keyWords !== "undefined") {
                msg = config.keyWords + msg;
            }

            return msg;
        }

        /**
         * 结束时间不能为空.
         */
        if (config.endDate.replace(/(^\s*)|(\s*$)/g, "") === "") {
            msg = "结束日期不能为空！";
            if (config.keyWords !== "" && typeof config.keyWords !== "undefined") {
                msg = config.keyWords + msg;
            }

            return msg;
        }

        /**
	 * 转换时间格式，兼容各个浏览器
	 * @type {Date}
	 */
        start = new Date(Date.parse(config.startDate.replace(/-/g, "/")));
        end = new Date(Date.parse(config.endDate.replace(/-/g, "/")));

        var isKeyWord = function(cond) {
            var msgTemp = "";
            if (cond !== "") {
                if (config.keyWords !== "" && typeof config.keyWords !== "undefined") {
                    msgTemp = config.keyWords + cond;
                }
            }
            return msgTemp;
        };

        /**
         * 跨年判断.
         */
        var compareDateForYear = function() {
            if (end < start) {
                msg = "开始日期不能大于结束日期！";
                return isKeyWord(msg);
            }

            var crossNumTemp = end.getYear() - start.getYear();
            if (crossNumTemp >= config.crossNum) {
                msg = config.crossNum === 1 ? "查询时间不能跨年!" : "查询时间不能跨" + config.crossNum + "年!";
            }
        };

        /**
         * 跨月判断.
         */
        var compareDateForMonth = function() {
		
		if (end < start) {
                msg = "开始日期不能大于结束日期！";
                return isKeyWord(msg);
            }
			
            var years = end.getYear() - start.getYear(),
		     months = (end.getMonth() + years*12) - start.getMonth();
            if (months >= config.crossNum) {
                msg = config.crossNum === 1 ? "查询时间不能跨月!" : "查询时间不能跨" + config.crossNum + "月!";
            }
        };

        switch (config.compareType.toUpperCase()) {
            case "Y":
                compareDateForYear();
                break;
            case "M":
                compareDateForMonth();
                break;
            default:
                break;
        }
        return isKeyWord(msg);
    };
});