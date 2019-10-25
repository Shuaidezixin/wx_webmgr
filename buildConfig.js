//根据编译环境修改"src/config/index.js" 返回的HTTP请求前缀
console.log("编译http请求地址开始...");
const path = require("path");
const fs = require("fs");
const httpConfigT = path.join(__dirname, "./src/config/index_t.ts");
const httpUrl = path.join(__dirname, "./config/httpurl.json");
const httpConfig = path.join(__dirname, "./src/config/index.ts");

let urlConfig = fs.readFileSync(httpUrl, "utf8");
let httpFile = fs.readFileSync(httpConfigT, "utf8");
let res;
try {
	urlConfig = JSON.parse(urlConfig);
} catch (e) {
	console.error("获取配置文件错误，查看“/config/httpurl.json”");
	console.error(e);
}
console.log("开始写入配置...");
if (process.env.NODE_ENV) {
	res = httpFile.replace(
		/\$\{configUrl\}/gi,
		urlConfig[process.env.NODE_ENV]
			? urlConfig[process.env.NODE_ENV]
			: () => {
					throw new Error(
						"未配置运行环境${process.env.NODE_ENV}的相关信息,请查看./config/httpurl.json"
					);
			  }
	);
	res = res.replace(
		/\$\{socketUrl\}/gi,
		urlConfig[process.env.NODE_ENV + "-socket"]
			? urlConfig[process.env.NODE_ENV + "-socket"]
			: () => {
					throw new Error(
						"未配置运行环境${process.env.NODE_ENV}的相关信息,请查看./config/httpurl.json"
					);
			  }
	);
} else {
	throw new Error(`运行环境未配置，查看package.json命令执行`);
}
try {
	if (res) {
		fs.writeFileSync(httpConfig, res, "utf8");
		console.log("编译http请求地址结束.");
	} else {
		throw new Error("编译错误");
	}
} catch (e) {
	console.error(e);
}
