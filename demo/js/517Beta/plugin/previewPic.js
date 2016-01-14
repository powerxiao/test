/**
 * @authors  three sword 15-12-22
 * 图片预览Tips:
 *   1、图片上传必须使用jquery.form,伪form提交，一方面是友好交互，一方面为了防止异常带来的各种兼容问题，
 *   2、图片上传过程中不能跳转其他页面，回绑到<input type="file">有兼容问题,<input type="file">不能赋值
 *   3、图片大小，IE需要改ActiveXObjec，还是不验证了，主要后台web.config需要改配置
 *   4、<input type="file">只能用鼠标点，不能用事件触发，IE8会阻止
 */
define(function(require, exports, module) {
    function previewPic(op) {
        var that = this;
        op.$dom.live("change", function() {
            that.pic(op);
        })
    }

    previewPic.prototype.pic = function(op) {
        /*
         * 图片上传预览函数
         * @targetId String 预览图片img的id,为数组，支持多个显示
         * @picSize 单位：M，限制图片大小，目前不兼容IE，请后台验证
         * @fun 回调函数
         */
        var that = op.$dom,
            targetId = op.$imgArr || [],
            picSize = 2 || op.picSize;
        if (that.val() === "") {
            return false;
        }

        var $this = that.eq(0),
            ext = $this.val().substring($this.val().lastIndexOf(".") + 1).toLowerCase(),
            fileSize = 0;
        // 验证大小,格式,由于IE中file只可读，所以清除的时候直接干掉dom
        try {
            if ($this.get(0).files[0]) {
                fileSize = $this.get(0).files[0].size;
                if (fileSize / 1024 / 1024 >= picSize || fileSize === 0) {
                    layer.alert("图片大小不能为空并且小于" + picSize + "M!");
                    for (var i = 0; i < targetId.length; i++) {
                        targetId[i].attr("src", "");
                    };
                    var htmlStr = $this.clone();
                    $(this).after(htmlStr);
                    $(this).remove();
                    return false;
                }
            }
            if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== "gif" && ext !== "bmp") {
                layer.alert("文件必须为图片！");
                for (var i = 0; i < targetId.length; i++) {
                    targetId[i].attr("src", "");
                };
                var htmlStr = $this.clone();
                $(this).after(htmlStr);
                $(this).remove();
                return false;
            }
        } catch (e) {}
        // 验证格式


        // IE浏览器
        if (document.all) {
            this.select();
            var ie9 = /msie 9/i.test(navigator.userAgent);
            if (ie9) {
                this.blur();
            }
            var reallocalpath,
                ie6 = /msie 6/i.test(navigator.userAgent),
                ie8 = /msie 8/i.test(navigator.userAgent),
                ie10 = /msie 10/i.test(navigator.userAgent);
            // IE6浏览器设置img的src为本地路径可以直接显示图片
            if (ie6) {
                reallocalpath = document.selection.createRange().text;
                for (var i = 0; i < targetId.length; i++) {
                    targetId[i].get(0).src = reallocalpath;
                };
                backFun(targetId);
            } else if (ie8 || ie9) {
                reallocalpath = document.selection.createRange().text;
                for (var i = 0; i < targetId.length; i++) {
                    // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现
                    targetId[i].get(0).style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\"" + reallocalpath + "\")";
                    // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
                    targetId[i].get(0).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                };
                backFun(targetId);
            } else {
                html5Reader(that, targetId);
            }
        } else {
            html5Reader(that, targetId);
        }

        //html5

        function html5Reader(obj, targetId) {

            var file = obj[0].files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function(e) {
                for (var i = 0; i < targetId.length; i++) {
                    targetId[i].get(0).src = this.result;
                };
                backFun(targetId);
            }

        }
        //图片不为空执行回调

        function backFun(targetId) {
            if (targetId[0].attr("src") != "") {
                fun();
            }
        }
    }

    return previewPic;
})