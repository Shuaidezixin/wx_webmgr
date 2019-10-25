const webpackBaseConfig = require("./build/webpack.base");
const webpackMerge = require("webpack-merge");
var webpackConfig = null;
if (process.env.NODE_ENV === "development") {
	const webpackDevConfig = require("./build/webpack.dev");
	webpackConfig = webpackMerge(webpackBaseConfig, webpackDevConfig);
}
if (process.env.NODE_ENV === "production") {
	const webpackProConfig = require("./build/webpack.pro");
	webpackConfig = webpackMerge(webpackBaseConfig, webpackProConfig);
}
module.exports = webpackConfig;
