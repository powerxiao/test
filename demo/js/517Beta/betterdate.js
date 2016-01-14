 define(function(require, exports, module) {
 /*
     * ���ڱȽϺ���new
     * @startDate String ��ʼ����
     * @endDate String ��ֹ����
     * @compareType String �Ƚ����ͣ�����y������m��
     * @crossNum int ��ʾ���ܿ�������������1��ʾ���ܿ�1���£�С�ڵ���0���������������ж�.
     * @keyWords String �ؼ���,����ƴ����ʾ��Ϣ��Ĭ��"��ʼ���ڲ���Ϊ�գ�"��������ѯ:���¶���Ϊ"��ѯ��ʼ���ڲ���Ϊ�գ�".
     */
    exports.compareDate = function(options) {
        /**
         * ��ʼ������
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
	 * ��������
	 */
        $.extend(config, options);

        if (typeof config.crossNum !== "number") {
            config.crossNum = parseInt(config.crossNum, 10);
        }

        /**
         * ��ʼʱ�䲻��Ϊ��.
         */
        if (config.startDate.replace(/(^\s*)|(\s*$)/g, "") === "") {
            msg = "��ʼ���ڲ���Ϊ�գ�";
            if (config.keyWords !== "" && typeof config.keyWords !== "undefined") {
                msg = config.keyWords + msg;
            }

            return msg;
        }

        /**
         * ����ʱ�䲻��Ϊ��.
         */
        if (config.endDate.replace(/(^\s*)|(\s*$)/g, "") === "") {
            msg = "�������ڲ���Ϊ�գ�";
            if (config.keyWords !== "" && typeof config.keyWords !== "undefined") {
                msg = config.keyWords + msg;
            }

            return msg;
        }

        /**
	 * ת��ʱ���ʽ�����ݸ��������
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
         * �����ж�.
         */
        var compareDateForYear = function() {
            if (end < start) {
                msg = "��ʼ���ڲ��ܴ��ڽ������ڣ�";
                return isKeyWord(msg);
            }

            var crossNumTemp = end.getYear() - start.getYear();
            if (crossNumTemp >= config.crossNum) {
                msg = config.crossNum === 1 ? "��ѯʱ�䲻�ܿ���!" : "��ѯʱ�䲻�ܿ�" + config.crossNum + "��!";
            }
        };

        /**
         * �����ж�.
         */
        var compareDateForMonth = function() {
		
		if (end < start) {
                msg = "��ʼ���ڲ��ܴ��ڽ������ڣ�";
                return isKeyWord(msg);
            }
			
            var years = end.getYear() - start.getYear(),
		     months = (end.getMonth() + years*12) - start.getMonth();
            if (months >= config.crossNum) {
                msg = config.crossNum === 1 ? "��ѯʱ�䲻�ܿ���!" : "��ѯʱ�䲻�ܿ�" + config.crossNum + "��!";
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