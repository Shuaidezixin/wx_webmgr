import * as CryptoJS from "crypto-js";
window.CryptoJS = CryptoJS;
//获取页面search
export const getQuery = function(location: string) {
	var search = location.split("?")[1];
	var query: any = {};
	if (search && search.length > 0) {
		var list = search.split("&");
		for (let i = 0; i < list.length; i++) {
			var q = list[i].split("=");
			query[q[0]] = q[1];
		}
	}
	return query;
};
//单选redux
export const singleCheckReducer = (state: any, { payload }: any): any => {
	let list = state && state.lists ? state.lists : [];
	if (list && list.length > 0) {
		list.map((item: any) => {
			if (item.id == payload.id) {
				item.isChecked = !item.isChecked;
			}
		});
	}
	return { ...state, lists: [...list] };
};
//全选redux
export const allCheckReducer = (state: any, { payload }: any): any => {
	let list = state.lists;
	if (list && list.length > 0) {
		list.map((item: any) => {
			item.isChecked = payload.state;
		});
	}
	return { ...state, lists: [...list] };
};
//首字母大写
export const firstWordUpcase = function(word: string): string {
	if (!word || typeof word !== "string") {
		throw new Error("word is not a string ");
	}
	return word.substring(0, 1).toUpperCase() + word.substring(1);
};
window.firstWordUpcase = firstWordUpcase;
//验证手机号
export const vilidPhone = function(n: string): boolean {
	var reg = /^1(3[0-9]|5[1-9]|7[0-9]|8[0-9])[0-9]{8}$/;
	return reg.test(n);
};
//验证固定电话
export const vilidTel = function(n: string): boolean {
	var reg = /^0\d{2,3}-?\d{7,8}$/;
	return reg.test(n);
};
var key = CryptoJS.enc.Utf8.parse("0102030405060708");
var iv = "0102030405060708";
//加密
export const encryptPass = function(value: string): string {
	if (!value) {
		return;
		//throw new Error("需要加密数据不能为空");
	}
	let data: any = {};
	data.iv = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(iv));
	data.value = CryptoJS.AES.encrypt(value, key, {
		iv: CryptoJS.enc.Utf8.parse(iv),
		mode: CryptoJS.mode.CBC
	}).toString();
	return CryptoJS.enc.Base64.stringify(
		CryptoJS.enc.Utf8.parse(JSON.stringify(data))
	);
};
//解密
export const decryptPass = function(ctrptText: string): any {
	if (!ctrptText) {
		//throw new Error("密文不能为空");
		return;
	}
	let s = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(ctrptText));
	try {
		let j = JSON.parse(s);
		let va = j.value;
		let vi = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(j.iv));
		return CryptoJS.AES.decrypt(va, key, {
			iv: CryptoJS.enc.Utf8.parse(vi),
			mode: CryptoJS.mode.CBC
		}).toString(CryptoJS.enc.Utf8);
	} catch (e) {
		throw new Error(e);
	}
};
//验证邮箱
export const vilidEmail = function(n: string): boolean {
	var reg = /.*?\@.*?\.(com|cn|cc|io|org|net|xyz)$/;
	return reg.test(n);
};
export const vilidString = function(s: string): boolean {
	var reg = /(\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\||\"||[\u4e00-\u9fa5]|\?|\\|\>|\<|\,|\.|\'|\:|\;)/;
	return reg.test(s);
};
export const InputChange = function(tag: string, e: any) {
	let value;
	if (e && e.target) {
		let type = e.target.type;
		switch (type) {
			case "checkbox":
				value = e.target.checked;
				break;
			default:
				value = e.target.value;
		}
		let set: any = {
			[tag]: value
		};
		this.setState({
			...set
		});
	} else {
		let set: any = {
			[tag]: e
		};
		this.setState({
			...set
		});
	}
};
// 插入文字至光标处
export const insertText = function(obj: any, str: string) {
	if (document.selection) {
		var sel = document.selection.createRange();
		sel.text = str;
	} else if (
		typeof obj.selectionStart === "number" &&
		typeof obj.selectionEnd === "number"
	) {
		var startPos = obj.selectionStart,
			endPos = obj.selectionEnd,
			cursorPos = startPos,
			tmpStr = obj.value;
		obj.value =
			tmpStr.substring(0, startPos) +
			str +
			tmpStr.substring(endPos, tmpStr.length);
		cursorPos += str.length;
		obj.selectionStart = obj.selectionEnd = cursorPos;
	} else {
		obj.value += str;
	}
	return obj.value;
};
//浏览器判断
export const getBroswer = function(browser: string): boolean {
	var u = navigator.userAgent;
	var match: any = {
		//内核
		Trident: u.indexOf("Trident") > 0 || u.indexOf("NET CLR") > 0,
		Presto: u.indexOf("Presto") > 0,
		WebKit: u.indexOf("AppleWebKit") > 0,
		Gecko: u.indexOf("Gecko/") > 0,
		//浏览器
		Safari: u.indexOf("Safari") > 0,
		Chrome: u.indexOf("Chrome") > 0 || u.indexOf("CriOS") > 0,
		IE: u.indexOf("MSIE") > 0 || u.indexOf("Trident") > 0,
		Edge: u.indexOf("Edge") > 0,
		Firefox: u.indexOf("Firefox") > 0,
		Opera: u.indexOf("Opera") > 0 || u.indexOf("OPR") > 0,
		Vivaldi: u.indexOf("Vivaldi") > 0,
		UC: u.indexOf("UC") > 0 || u.indexOf(" UBrowser") > 0,
		QQBrowser: u.indexOf("QQBrowser") > 0,
		QQ: u.indexOf("QQ/") > 0,
		Baidu: u.indexOf("Baidu") > 0 || u.indexOf("BIDUBrowser") > 0,
		Maxthon: u.indexOf("Maxthon") > 0,
		LBBROWSER: u.indexOf("LBBROWSER") > 0,
		"2345Explorer": u.indexOf("2345Explorer") > 0,
		Sogou: u.indexOf("MetaSr") > 0 || u.indexOf("Sogou") > 0,
		Wechat: u.indexOf("MicroMessenger") > 0,
		Taobao: u.indexOf("AliApp(TB") > 0,
		Alipay: u.indexOf("AliApp(AP") > 0,
		Weibo: u.indexOf("Weibo") > 0,
		Suning: u.indexOf("SNEBUY-APP") > 0,
		iQiYi: u.indexOf("IqiyiApp") > 0,
		//操作系统平台
		Windows: u.indexOf("Windows") > 0,
		Linux: u.indexOf("Linux") > 0,
		Mac: u.indexOf("Macintosh") > 0,
		Android: u.indexOf("Android") > 0 || u.indexOf("Adr") > 0,
		WP: u.indexOf("IEMobile") > 0,
		BlackBerry:
			u.indexOf("BlackBerry") > 0 ||
			u.indexOf("RIM") > 0 ||
			u.indexOf("BB") > 0,
		MeeGo: u.indexOf("MeeGo") > 0,
		Symbian: u.indexOf("Symbian") > 0,
		iOS: u.indexOf("like Mac OS X") > 0,
		//移动设备
		Mobile:
			u.indexOf("Mobi") > 0 ||
			u.indexOf("iPh") > 0 ||
			u.indexOf("480") > 0,
		Tablet:
			u.indexOf("Tablet") > 0 ||
			u.indexOf("iPad") > 0 ||
			u.indexOf("Nexus 7") > 0
	};
	return match[browser];
};
export const parseNumber = function(value: string) {
	return value.replace(".", "");
};
export const forbidAutoComplete = function() {
	let input = document.getElementsByTagName("input");
	for (let i = 0; i < input.length; i++) {
		if (
			input[i].getAttribute("type") == "password" &&
			!input[i].getAttribute("autocomplete")
		) {
			input[i].setAttribute("autocomplete", "new-password");
		}
	}
};
export const viliAuth = function(parent: string, sub: string): boolean {
	let res = false;
	if (
		window.managerAction &&
		window.managerAction[parent] &&
		window.managerAction[parent].indexOf(sub) != -1
	) {
		res = true;
	}
	return res;
};
window.viliAuth = viliAuth;
function random16word() {
	let arr = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z"
	];
	var str = "";
	for (let i = 0; i < 16; i++) {
		let pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos];
	}
	return str;
}
// 加密参数
export const aesEnParams = function(text: string) {
	let randomIV = random16word();
	let key = CryptoJS.enc.Utf8.parse("feadrgerg564sedf");
	let word = CryptoJS.enc.Utf8.parse(text);
	let data = CryptoJS.AES.encrypt(word, key, {
		iv: CryptoJS.enc.Utf8.parse(randomIV),
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	}).toString();
	let resD = CryptoJS.enc.Base64.stringify(
		CryptoJS.enc.Utf8.parse(randomIV + data)
	);
	return resD;
};
// 解密参数
export const aesDeParams = function(word: string) {
	if (!word || word.length <= 0) {
		return;
	}
	let oldData = word;
	let key = CryptoJS.enc.Utf8.parse("feadrgerg564sedf");
	let d = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(oldData));
	let iv = d.substr(0, 16);
	let pd = d.substr(16, d.length);
	let res = CryptoJS.AES.decrypt(pd, key, {
		iv: CryptoJS.enc.Utf8.parse(iv),
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	}).toString(CryptoJS.enc.Utf8);
	return res;
};
export const toPassword = function(word: string): string {
	let r1 = "jh4bb4234n_j4";
	let r2 = "35hjkcd_jk4bnvkln_k53";
	let m1 = window.CryptoJS.MD5(word).toString();
	let m2 = window.CryptoJS.MD5(m1 + r1).toString();
	let m3 = window.CryptoJS.MD5(m2 + r2).toString();
	return m3;
};
