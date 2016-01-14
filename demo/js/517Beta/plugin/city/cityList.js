﻿/**
 * @authors  three 15-12-25
 * 说明 : 正对某一dom元素，移动上去有框来解释说明
 */
define(function(require, exports, module) {
	var citysFlight = new Array();
	citysFlight[0] = new Array('pek', '北京', 'beijing', 'bj', '50');
	citysFlight[1] = new Array('sha', '上海', 'shanghai', 'sh', '49');
	citysFlight[2] = new Array('kmg', '昆明', 'kunming', 'km', '48');
	citysFlight[3] = new Array('hgh', '杭州', 'hangzhou', 'hz', '47');
	citysFlight[4] = new Array('can', '广州', 'guangzhou', 'gz', '46');
	citysFlight[5] = new Array('ctu', '成都', 'chengdu', 'cd', '45');
	citysFlight[6] = new Array('xiy', '西安', 'xian', 'xa', '44');
	citysFlight[7] = new Array('nkg', '南京', 'nanjing', 'nj', '43');
	citysFlight[8] = new Array('szx', '深圳', 'shenzhen', 'sz', '42');
	citysFlight[9] = new Array('ckg', '重庆', 'chongqing', 'cq', '41');
	citysFlight[10] = new Array('csx', '长沙', 'changsha', 'cs', '40');
	citysFlight[11] = new Array('she', '沈阳', 'shenyang', 'sy', '39');
	citysFlight[12] = new Array('xmn', '厦门', 'xiamen', 'xm', '38');
	citysFlight[13] = new Array('wuh', '武汉', 'wuhan', 'wh', '37');
	citysFlight[14] = new Array('hak', '海口', 'haikou', 'hk', '36');
	citysFlight[15] = new Array('urc', '乌鲁木齐', 'wulumuqi', 'wlmq', '35');
	citysFlight[16] = new Array('tao', '青岛', 'qingdao', 'qd', '34');
	citysFlight[17] = new Array('dlc', '大连', 'dalian', 'dl', '33');
	citysFlight[18] = new Array('hrb', '哈尔滨', 'haerbin', 'heb', '1');
	citysFlight[19] = new Array('hfe', '合肥', 'hefei', 'hf', '1');
	citysFlight[20] = new Array('cgo', '郑州', 'zhengzhou', 'zz', '1');
	citysFlight[21] = new Array('khn', '南昌', 'nanchang', 'nc', '1');
	citysFlight[22] = new Array('tyn', '太原', 'taiyuan', 'ty', '1');
	citysFlight[23] = new Array('kwe', '贵阳', 'guiyang', 'gy', '1');
	citysFlight[24] = new Array('xic', '西昌', 'xichang', 'xc', '0');
	citysFlight[25] = new Array('xil', '锡林浩特', 'xilinhaote', 'xlht', '0');
	citysFlight[26] = new Array('xen', '兴城', 'xingcheng', 'xc', '0');
	citysFlight[27] = new Array('xin', '兴宁', 'xingning', 'xn', '0');
	citysFlight[28] = new Array('xnt', '邢台', 'xingtai', 'xt', '0');
	citysFlight[29] = new Array('xnn', '西宁', 'xining', 'xn', '0');
	citysFlight[30] = new Array('jhg', '景洪', 'jinghong', 'jh', '0');
	citysFlight[31] = new Array('xuz', '徐州', 'xuzhou', 'xz', '0');
	citysFlight[32] = new Array('eny', '延安', 'yanan', 'ya', '0');
	citysFlight[33] = new Array('ynz', '盐城', 'yancheng', 'yc', '0');
	citysFlight[34] = new Array('ynj', '延吉', 'yanji', 'yj', '0');
	citysFlight[35] = new Array('ynt', '烟台', 'yantai', 'yt', '0');
	citysFlight[36] = new Array('ybp', '宜宾', 'yibin', 'yb', '0');
	citysFlight[37] = new Array('yih', '宜昌', 'yichang', 'yc', '0');
	citysFlight[38] = new Array('yln', '铱兰', 'yilan', 'yl', '0');
	citysFlight[39] = new Array('inc', '银川', 'yinchuan', 'yc', '0');
	citysFlight[40] = new Array('yin', '伊宁', 'yining', 'yn', '0');
	citysFlight[41] = new Array('yiw', '义乌', 'yiwu', 'yw', '0');
	citysFlight[42] = new Array('llf', '永州', 'yongzhou', 'yz', '0');
	citysFlight[43] = new Array('yua', '元谋', 'yuanmou', 'ym', '0');
	citysFlight[44] = new Array('uyn', '榆林', 'yulin', 'yl', '0');
	citysFlight[45] = new Array('dyg', '张家界', 'zhangjiajie', 'zjj', '0');
	citysFlight[46] = new Array('zha', '湛江', 'zhanjiang', 'zj', '0');
	citysFlight[47] = new Array('zat', '昭通', 'zhaotong', 'zt', '0');
	citysFlight[48] = new Array('tsn', '天津', 'tianjin', 'tj', '0');
	citysFlight[49] = new Array('thq', '天水', 'tianshui', 'ts', '0');
	citysFlight[50] = new Array('tnh', '通化', 'tonghua', 'th', '0');
	citysFlight[51] = new Array('tgo', '通辽', 'tongliao', 'tl', '0');
	citysFlight[52] = new Array('ten', '铜仁', 'tongren', 'tr', '0');
	citysFlight[53] = new Array('hlh', '乌兰浩特', 'wulanhaote', 'wlht', '0');
	citysFlight[54] = new Array('sjw', '石家庄', 'shijiazhuang', 'sjz', '0');
	citysFlight[55] = new Array('szv', '苏州', 'suzhou', 'sz', '0');
	citysFlight[56] = new Array('tcg', '塔城', 'tacheng', 'tc', '0');
	citysFlight[57] = new Array('wxn', '万州', 'wanzhou', 'wz', '0');
	citysFlight[58] = new Array('wef', '潍坊', 'weifang', 'wf', '0');
	citysFlight[59] = new Array('weh', '威海', 'weihai', 'wh', '0');
	citysFlight[60] = new Array('wnz', '温州', 'wenzhou', 'wz', '0');
	citysFlight[61] = new Array('whu', '芜湖', 'wuhu', 'wh', '0');
	citysFlight[62] = new Array('wus', '武夷山', 'wuyishan', 'wys', '0');
	citysFlight[63] = new Array('wuz', '梧州', 'wuzhou', 'wz', '0');
	citysFlight[64] = new Array('nao', '南充', 'nanchong', 'nc', '0');
	citysFlight[65] = new Array('hzg', '汉中', 'hanzhong', 'hz', '0');
	citysFlight[66] = new Array('nng', '南宁', 'nanning', 'nn', '0');
	citysFlight[67] = new Array('ntg', '南通', 'nantong', 'nt', '0');
	citysFlight[68] = new Array('nny', '南阳', 'nanyang', 'ny', '0');
	citysFlight[69] = new Array('ngb', '宁波', 'ningbo', 'nb', '0');
	citysFlight[70] = new Array('iqm', '且末', 'qiemo', 'qm', '0');
	citysFlight[71] = new Array('shp', '秦皇岛', 'qinhuangdao', 'qhd', '0');
	citysFlight[72] = new Array('iqn', '庆阳', 'qingyang', 'qy', '0');
	citysFlight[73] = new Array('ndg', '齐齐哈尔', 'qiqihaer', 'qqhe', '0');
	citysFlight[74] = new Array('juz', '衢州', 'quzhou', 'qz', '0');
	citysFlight[75] = new Array('syx', '三亚', 'sanya', 'sy', '0');
	citysFlight[76] = new Array('pvg', '上海', 'shanghai', 'sh', '0');
	citysFlight[77] = new Array('swa', '揭阳', 'jieyang', 'jy', '0');
	citysFlight[78] = new Array('shs', '荆州', 'jingzhou', 'jz', '0');
	citysFlight[79] = new Array('hsn', '舟山', 'zhoushan', 'zs', '0');
	citysFlight[80] = new Array('zuh', '珠海', 'zhuhai', 'zh', '0');
	citysFlight[81] = new Array('zyi', '遵义', 'zunyi', 'zy', '0');
	citysFlight[82] = new Array('tpe', '桃园', 'taoyuan', 'tb', '0');
	citysFlight[83] = new Array('cyi', '嘉义', 'jiayi', 'jy', '0');
	citysFlight[84] = new Array('pzi', '攀枝花', 'panzhihua', 'pzh', '0');
	citysFlight[85] = new Array('jzh', '九寨沟', 'jiuzhaigou', 'jzg', '0');
	citysFlight[86] = new Array('nay', '北京', 'beijing', 'bj', '0');
	citysFlight[87] = new Array('lzy', '林芝', 'linzhi', 'lz', '0');
	citysFlight[88] = new Array('wux', '无锡', 'wuxi', 'wx', '0');
	citysFlight[89] = new Array('hdg', '邯郸', 'handan', 'hd', '0');
	citysFlight[90] = new Array('ycu', '运城', 'yuncheng', 'yc', '0');
	citysFlight[91] = new Array('wua', '乌海', 'wuhai', 'wh', '0');
	citysFlight[92] = new Array('ddg', '丹东', 'dandong', 'dd', '0');
	citysFlight[93] = new Array('lcx', '连城', 'liancheng', 'lc', '0');
	citysFlight[94] = new Array('jgs', '井冈山', 'jinggangshan', 'jgs', '0');
	citysFlight[95] = new Array('hjj', '怀化', 'huaihua', 'hh', '0');
	citysFlight[96] = new Array('lum', '芒市', 'mangshi', 'ms', '0');
	citysFlight[97] = new Array('dig', '迪庆', 'diqing', 'dq', '0');
	citysFlight[98] = new Array('lnj', '临沧', 'lincang', 'lc', '0');
	citysFlight[99] = new Array('wnh', '文山', 'wenshan', 'ws', '0');
	citysFlight[100] = new Array('sym', '思茅', 'simao', 'sm', '0');
	citysFlight[101] = new Array('bpx', '昌都邦达', 'changdoubangda', 'cdbd', '0');
	citysFlight[102] = new Array('aku', '阿克苏', 'akesu', 'aks', '0');
	citysFlight[103] = new Array('htn', '和田', 'hetian', 'ht', '0');
	citysFlight[104] = new Array('xfn', '襄樊', 'xiangfan', 'xf', '0');
	citysFlight[105] = new Array('ava', '安顺', 'anshun', 'as', '0');
	citysFlight[106] = new Array('acx', '兴义', 'xingyi', 'xy', '0');
	citysFlight[107] = new Array('hzh', '黎平', 'liping', 'lp', '0');
	citysFlight[108] = new Array('gys', '广元', 'guangyuan', 'gy', '0');
	citysFlight[109] = new Array('aeb', '百色田阳', 'baisetianyang', 'bsty', '0');
	citysFlight[110] = new Array('goq', '格尔木', 'geermu', 'gem', '0');
	citysFlight[111] = new Array('kgt', '康定', 'kangding', 'kd', '0');
	citysFlight[112] = new Array('hun', '花莲', 'hualian', 'hl', '0');
	citysFlight[113] = new Array('mzg', '马公', 'magong', 'mg', '0');
	citysFlight[114] = new Array('knh', '金门县', 'jinmenxian', 'jm', '0');
	citysFlight[115] = new Array('lzn', '马祖', 'mazu', 'mz', '0');
	citysFlight[116] = new Array('mfk', '马祖', 'mazu', 'mz', '0');
	citysFlight[117] = new Array('kyd', '兰屿', 'lanyu', 'ly', '0');
	citysFlight[118] = new Array('nzh', '满洲里', 'manzhouli', 'mzl', '0');
	citysFlight[119] = new Array('ohe', '漠河', 'mohe', 'mh', '0');
	citysFlight[120] = new Array('tcz', '腾冲', 'tengchong', 'tc', '0');
	citysFlight[121] = new Array('nlt', '那拉提', 'nalati', 'nlt', '0');
	citysFlight[122] = new Array('kji', '喀纳斯', 'kanasi', 'kns', '0');
	citysFlight[123] = new Array('nbs', '长白山', 'changbaishan', 'cbs', '0');
	citysFlight[124] = new Array('zhy', '中卫', 'zhongwei', 'zw', '0');
	citysFlight[125] = new Array('llb', '荔波', 'libo', 'lb', '0');
	citysFlight[126] = new Array('yus', '玉树', 'yushu', 'ys', '0');
	citysFlight[127] = new Array('dqa', '大庆', 'daqing', 'dq', '0');
	citysFlight[128] = new Array('jxa', '鸡西', 'jixi', 'jx', '0');
	citysFlight[129] = new Array('lds', '伊春', 'yichun', 'yc', '0');
	citysFlight[130] = new Array('erl', '二连浩特', 'erlianhaote', 'elht', '0');
	citysFlight[131] = new Array('gyu', '固原', 'guyuan', 'gy', '0');
	citysFlight[132] = new Array('tvs', '唐山', 'tangshan', 'ts', '0');
	citysFlight[133] = new Array('bpl', '博乐', 'bole', 'bl', '0');
	citysFlight[134] = new Array('hia', '淮安', 'huaian', 'ha', '0');
	citysFlight[135] = new Array('jiq', '舟白', 'zhoubai', 'zb', '0');
	citysFlight[136] = new Array('ngq', '阿里', 'ali', 'al', '0');
	citysFlight[137] = new Array('rkz', '日喀则', 'rikaze', 'rkz', '0');
	citysFlight[138] = new Array('jic', '金昌', 'jinchang', 'jc', '0');
	citysFlight[139] = new Array('yzy', '张掖', 'zhangye', 'zy', '0');
	citysFlight[140] = new Array('rlk', '巴彦淖尔', 'bayannaoer', 'byne', '0');
	citysFlight[141] = new Array('yie', '阿尔山', 'aershan', 'aes', '0');
	citysFlight[142] = new Array('yty', '扬州', 'yangzhou', 'yz', '0');
	citysFlight[143] = new Array('jgd', '加格达奇', 'jiagedaqi', 'jgdq', '0');
	citysFlight[144] = new Array('tlq', '吐鲁番', 'tulufan', 'tlf', '0');
	citysFlight[145] = new Array('yic', '宜春', 'yichun', 'yc', '0');
	citysFlight[146] = new Array('bfj', '毕节', 'bijie', 'bj', '0');
	citysFlight[147] = new Array('zqz', '张家口', 'zhangjiakou', 'zjk', '0');
	citysFlight[148] = new Array('juh', '九华山', 'jiuhuashan', 'jhs', '0');
	citysFlight[149] = new Array('dcy', '稻城', 'daocheng', 'dc', '0');
	citysFlight[150] = new Array('gxh', '甘肃夏河机场', 'gansuxiahejichang', 'gsxhjc', '0');
	citysFlight[151] = new Array('kjh', '凯里', 'kaili', 'kl', '0');
	citysFlight[152] = new Array('axf', '阿拉善左旗', 'alashanzuoqi', 'alszq', '0');
	citysFlight[153] = new Array('ejn', '额济纳', 'ejina', 'ejn', '0');
	citysFlight[154] = new Array('rht', '阿拉善右旗', 'alashanyouqi', 'alsyq', '0');
	citysFlight[155] = new Array('llv', '吕梁', 'lvliang', 'll', '0');
	citysFlight[156] = new Array('hek', '黑河', 'heihe', 'hh', '0');
	citysFlight[157] = new Array('hny', '衡阳', 'hengyang', 'hy', '0');
	citysFlight[158] = new Array('het', '呼和浩特', 'huhehaote', 'hhht', '0');
	citysFlight[159] = new Array('txn', '黄山', 'huangshan', 'hs', '0');
	citysFlight[160] = new Array('hyn', '台州', 'taizhou', 'tz', '0');
	citysFlight[161] = new Array('huz', '徽州', 'huizhou', 'hz', '0');
	citysFlight[162] = new Array('jmu', '佳木斯', 'jiamusi', 'jms', '0');
	citysFlight[163] = new Array('knc', '吉安', 'jian', 'ja', '0');
	citysFlight[164] = new Array('jgn', '嘉峪关', 'jiayuguan', 'jyg', '0');
	citysFlight[165] = new Array('jil', '吉林', 'jilin', 'jl', '0');
	citysFlight[166] = new Array('tna', '济南', 'jinan', 'jn', '0');
	citysFlight[167] = new Array('jdz', '景德镇', 'jingdezhen', 'jdz', '0');
	citysFlight[168] = new Array('jng', '济宁', 'jining', 'jn', '0');
	citysFlight[169] = new Array('jjn', '晋江', 'jinjiang', 'jj', '0');
	citysFlight[170] = new Array('jnz', '锦州', 'jinzhou', 'jz', '0');
	citysFlight[171] = new Array('jiu', '九江', 'jiujiang', 'jj', '0');
	citysFlight[172] = new Array('chw', '酒泉', 'jiuquan', 'jq', '0');
	citysFlight[173] = new Array('khg', '喀什', 'kashi', 'ks', '0');
	citysFlight[174] = new Array('kry', '克拉玛依', 'kelamayi', 'klmy', '0');
	citysFlight[175] = new Array('krl', '库尔勒', 'kuerle', 'kel', '0');
	citysFlight[176] = new Array('kca', '库车', 'kuche', 'kc', '0');
	citysFlight[177] = new Array('lhw', '兰州', 'lanzhou', 'lz', '0');
	citysFlight[178] = new Array('lxa', '拉萨', 'lasa', 'ls', '0');
	citysFlight[179] = new Array('lia', '梁平', 'liangping', 'lp', '0');
	citysFlight[180] = new Array('lyg', '连云港', 'lianyungang', 'lyg', '0');
	citysFlight[181] = new Array('ljg', '丽江', 'lijiang', 'lj', '0');
	citysFlight[182] = new Array('lxi', '林西', 'linxi', 'lx', '0');
	citysFlight[183] = new Array('lyi', '临沂', 'linyi', 'ly', '0');
	citysFlight[184] = new Array('lhn', '梨山', 'lishan', 'ls', '0');
	citysFlight[185] = new Array('lzh', '柳州', 'liuzhou', 'lz', '0');
	citysFlight[186] = new Array('lya', '洛阳', 'luoyang', 'ly', '0');
	citysFlight[187] = new Array('luz', '庐山', 'lushan', 'ls', '0');
	citysFlight[188] = new Array('lzo', '泸州', 'luzhou', 'lz', '0');
	citysFlight[189] = new Array('mxz', '梅州', 'meizhou', 'mz', '0');
	citysFlight[190] = new Array('mig', '绵阳', 'mianyang', 'my', '0');
	citysFlight[191] = new Array('mdg', '牡丹江', 'mudanjiang', 'mdj', '0');
	citysFlight[192] = new Array('dat', '大同', 'datong', 'dt', '0');
	citysFlight[193] = new Array('dax', '达州', 'dazhou', 'dz', '0');
	citysFlight[194] = new Array('dzu', '大足', 'dazu', 'dz', '0');
	citysFlight[195] = new Array('dsn', '鄂尔多斯', 'eerduosi', 'eeds', '0');
	citysFlight[196] = new Array('doy', '东营', 'dongying', 'dy', '0');
	citysFlight[197] = new Array('dnh', '敦煌', 'dunhuang', 'dh', '0');
	citysFlight[198] = new Array('enh', '恩施', 'enshi', 'es', '0');
	citysFlight[199] = new Array('fuo', '佛山', 'foshan', 'fs', '0');
	citysFlight[200] = new Array('fug', '阜阳', 'fuyang', 'fy', '0');
	citysFlight[201] = new Array('fyn', '富蕴', 'fuyun', 'fy', '0');
	citysFlight[202] = new Array('foc', '福州', 'fuzhou', 'fz', '0');
	citysFlight[203] = new Array('kow', '赣州', 'ganzhou', 'gz', '0');
	citysFlight[204] = new Array('ghn', '广汉', 'guanghan', 'gh', '0');
	citysFlight[205] = new Array('hld', '海拉尔', 'hailaer', 'hle', '0');
	citysFlight[206] = new Array('hmi', '哈密', 'hami', 'hm', '0');
	citysFlight[207] = new Array('kwl', '桂林', 'guilin', 'gl', '0');
	citysFlight[208] = new Array('dlu', '大理', 'dali', 'dl', '0');
	citysFlight[209] = new Array('cif', '赤峰', 'chifeng', 'cf', '0');
	citysFlight[210] = new Array('hin', '清州', 'qingzhou', 'qz', '0');
	citysFlight[211] = new Array('cih', '长治', 'changzhi', 'cz', '0');
	citysFlight[212] = new Array('czx', '常州', 'changzhou', 'cz', '0');
	citysFlight[213] = new Array('chg', '朝阳', 'chaoyang', 'cy', '0');
	citysFlight[214] = new Array('ccc', '潮州', 'chaozhou', 'cz', '0');
	citysFlight[215] = new Array('bfu', '蚌埠', 'bengbu', 'bb', '0');
	citysFlight[216] = new Array('cgq', '长春', 'changchun', 'cc', '0');
	citysFlight[217] = new Array('cgd', '常德', 'changde', 'cd', '0');
	citysFlight[218] = new Array('cni', '长海', 'changhai', 'ch', '0');
	citysFlight[219] = new Array('ala', '阿尔玛塔', 'aermata', 'aemt', '0');
	citysFlight[220] = new Array('aat', '阿勒泰', 'aletai', 'alt', '0');
	citysFlight[221] = new Array('aka', '安康', 'ankang', 'ak', '0');
	citysFlight[222] = new Array('aqg', '安庆', 'anqing', 'aq', '0');
	citysFlight[223] = new Array('aog', '鞍山', 'anshan', 'as', '0');
	citysFlight[224] = new Array('ayn', '安阳', 'anyang', 'ay', '0');
	citysFlight[225] = new Array('bsd', '保山', 'baoshan', 'bs', '0');
	citysFlight[226] = new Array('bav', '包头', 'baotou', 'bt', '0');
	citysFlight[227] = new Array('bhy', '北海', 'beihai', 'bh', '0');

	exports.getCity = function() {
		return citysFlight;
	}
})