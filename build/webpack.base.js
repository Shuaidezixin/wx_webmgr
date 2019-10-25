const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const rootPath = path.join(__dirname, "../src");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
var entries = {};
entries.polyfill = ["babel-polyfill", "whatwg-fetch"];
entries.app = [path.resolve(rootPath, "index.tsx")];

var webpackConfig = {
	entry: entries,
	resolve: {
		extensions: [".js", ".json", ".jsx", ".tsx", ".ts", ".less", ".css"],
		alias: {
			"@img": path.resolve(rootPath, "./assets/images"),
			"@js": path.resolve(rootPath, "./assets/js"),
			"@css": path.resolve(rootPath, "./assets/css"),
			"@component": path.resolve(rootPath, "./components"),
			"@base": path.resolve(rootPath, "./basecomponent"),
			"@models": path.resolve(rootPath, "./models")
		}
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				test: /\.html$/,
				use: {
					loader: "underscore-template-loader"
				}
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "babel-loader"
					},
					{
						loader: "awesome-typescript-loader"
					}
				],
				include: rootPath
			},
			{
				test: /\.jsx?$/,
				use: [
					{
						loader: "babel-loader"
					}
				],
				include: rootPath
			},
			{
				//antd样式处理
				test: /\.css|less$/,
				include: /node_modules/,
				use: [
					{ loader: "style-loader" },
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						}
					},
					{
						loader: "postcss-loader"
					},
					{
						loader: "less-loader",
						options: {
							javascriptEnabled: true,
							modifyVars: {
								"primary-color": "#179BD5",
								// "danger-color": "#FE1A5E",
								"default-color": "#179BD5",
								"disabled-color": "#C0C0C0"
							}
						}
					}
				]
			},
			// {
			// 	test: /\.css|less$/,
			// 	exclude: /node_modules/,
			// 	use: ExtractTextPlugin.extract({
			// 		fallback: "style-loader",
			// 		use: [
			// 			{ loader: "css-loader" },
			// 			"postcss-loader",
			// 			"less-loader"
			// 		],
			// 		publicPath: "/"
			// 	})
			// },
			{
				test: /\.css|less$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: (resourcePath, context) => {
								// publicPath is the relative path of the resource to the context
								// e.g. for ./css/admin/main.css the publicPath will be ../../
								// while for ./css/main.css the publicPath will be ../
								return "/";
							}
						}
					},
					{ loader: "css-loader" },
					"postcss-loader",
					"less-loader"
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 10000,
							outputPath: "./assets/images/",
							name: "[name].[hash:9].[ext]"
						}
					}
				]
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 10000,
							outputPath: "./assets/fonts/",
							name: "[name].[hash:9].[ext]"
						}
					}
				]
			}
		]
	},
	plugins: [
		//html处理
		new HtmlWebpackPlugin({
			template: path.resolve(rootPath, "../public/index.html"),
			minify: {
				collapseWhitespace: true //折叠空白区域 也就是压缩代码
			},
			favicon: path.join(__dirname, "../public/favicon.ico"),
			hash: false,
			inject: "body"
		}),
		//复制file文件夹下文件到dist/file
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, "../file"),
				to: path.join(__dirname, "../dist/file")
			}
		]),
		//css处理相关
		new MiniCssExtractPlugin({
			filename: "assets/css/[name]_[chunkhash:9].css",
			chunkFilename: "assets/css/[id]_[chunkhash:9].css"
		})
		// new ExtractTextPlugin({
		// 	filename: "assets/css/[name]_[chunkhash:9].css",
		// 	allChunks: true
		// })
	]
};
module.exports = webpackConfig;
