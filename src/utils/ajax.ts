import "whatwg-fetch";
import { requestUrl } from "../config/";
import { Modal, message } from "antd";

const METHODS = ["get", "delete"];
const BODY_METHODS = ["post", "put", "patch"];

function checkStatus(response: any) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	throw new Error(response.status);
}
function checkCode(response: any) {
	if (response.Authorization) {
		window.localStorage.setItem("token", response.Authorization);
	}
	if (response.code == 999) {
		let href = window.location.href;
		let pathname = window.appHistory.location.pathname;
		let search = href.split("?")[1]
			? href.split("?")[1].replace(/^\?/, "")
			: "";
		window.localStorage.removeItem("token");
		if (window.appHistory.location.pathname != "/login") {
			window.appHistory.push({
				pathname: "/login",
				search: `from=${window.Util.encryptPass(
					JSON.stringify({
						pathname: pathname,
						search: search
					})
				)}`
			});
		}
		return;
	}
	if (response.code != 200) {
		Modal.error({
			title: "错误",
			keyboard: false,
			className: "ajax-modal",
			content:
				typeof response.msg === "string"
					? response.msg
					: JSON.stringify(response.msg)
		});
		return {
			data: null,
			code: response.code,
			msg: response.msg
		};
	}

	return response;
}
var convert_FormData_to_json = function(formData: any) {
	var objData: any = {};

	for (var entry of formData.entries()) {
		objData[entry[0]] = entry[1];
	}
	return objData;
};
function getClientType() {
	let agent = navigator.userAgent.toLocaleLowerCase();
	if (window.platform) {
		return window.platform;
	}
	if (agent.indexOf("micromessage") != -1) {
		return "WeChat";
	}
	if (agent.indexOf("iphone") != -1 || agent.indexOf("android") != -1) {
		return "H5";
	}
	return "PC";
}

function request(
	method: string,
	url: string,
	params: any = {},
	header: any = {},
	outError: boolean = false
) {
	// let token = localStorage.getItem("token");
	// let Token;
	// if (
	// 	token != null &&
	// 	(window.location.href.indexOf("/login") == -1 ||
	// 		window.location.href.indexOf("/register") == -1 ||
	// 		window.location.href.indexOf("/findpassword") == -1)
	// ) {
	// 	Token = window.Util.decryptPass(token);
	// 	if (Token.indexOf("Bearer ") == -1) {
	// 		Token = "Bearer " + Token;
	// 	}
	// 	header["Authorization"] = Token;
	// }
	const headers = {
		//"Content-Type": "application/x-www-form-urlencoded",
		// UTM: "",
		// "CLIENT-VERSION": "1.0.0",
		// "CLIENT-TYPE": getClientType(),
		...header
	};

	let _url = requestUrl();
	let body: any;

	if (METHODS.indexOf(method) != -1) {
		const _params = [];
		for (let key in params) {
			_params.push(`${key}=${params[key]}`);
		}
		if (_params.length) {
			_url += "?";
			_url += _params.join("&");
		}
	} else {
		let data = new FormData();
		let token = window.localStorage.getItem("token");
		if (window.location.href.indexOf("/login") == -1) {
			if (!token) {
				message.error("登录失效，请重新登录");
				let href = window.location.href;
				let pathname = href.split("?")[0];
				let search = href.split("?")[1]
					? href.split("?")[1].replace(/^\?/, "")
					: "";
				window.appHistory.push({
					pathname: "/login",
					search: `from=${window.Util.encryptPass(
						JSON.stringify({
							pathname: pathname,
							search: search
						})
					)}`
				});
				return;
			}
			data.append("token", token);
		} else {
			let randerString =
				new Date().getTime() +
				"_" +
				parseInt((Math.random() * 100000).toString(), 10);
			data.append("token", randerString);
		}
		if (params) {
			for (let key in params) {
				data.append(key, params[key]);
			}
		}
		let sendData = convert_FormData_to_json(data);
		console.log(`${url}:`, sendData);
		body = window.Util.aesEnParams(
			JSON.stringify({
				api: url,
				params: JSON.stringify(sendData)
			})
		);
		//body = JSON.stringify(params);
	}
	//处理超时
	var _fetch = function(url: string, options: any) {
		var timeout_promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject("timeout");
			}, 6000000);
		});
		let res = Promise.race([fetch(url, options), timeout_promise]);
		return res;
	};
	var _fetchData = _fetch(_url, {
		method,
		body,
		headers
	});
	return _fetchData
		.then(checkStatus)
		.then(async res => {
			let m = await res.text();
			let r = window.Util.aesDeParams(m);
			let resData: any = null;
			try {
				resData = JSON.parse(r);
				console.log("返回数据:", {
					url: url,
					...resData
				});
				return resData;
			} catch (e) {
				throw new Error(e);
			}
		})
		.then(checkCode)
		.catch((e: any) => {
			if (!outError) {
				Modal.error({ title: "错误", content: `数据请求错误${e}` });
			}
			throw new Error(e.toString().replace("Error:", ""));
		});
}
const methods: any = {};

let methodArr: string[] = [...METHODS, ...BODY_METHODS];
interface AjaxParams {
	url: string;
	params: any;
	header: any;
}
methodArr.forEach((method: string) => {
	methods[method] = <R>(
		{ url, params = {}, header = {} }: AjaxParams,
		outError: boolean
	): Promise<R> => request(method, url, params, header, outError);
});

export default methods;
