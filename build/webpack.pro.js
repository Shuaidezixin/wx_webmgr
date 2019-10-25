const webpack = require("webpack");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
// 	.BundleAnalyzerPlugin;

const config = require("../config");
const insertScript = require("./insertScript");
const path = require("path");
const glob = require("glob");
const rootPath = path.join(__dirname, "../src");
const getDll = function() {
	var dll = glob.sync(path.join(__dirname, "../dist/manifest/*.dll.js"));
	dll = dll[0];
	return dll.substr(dll.lastIndexOf("/") + 1, dll.length);
};

var webpackProConfig = {
	mode: "production",
	output: {
		path: config.outputRoot,
		filename: "assets/js/[name].[chunkhash:5].js",
		chunkFilename: "assets/js/[name].[chunkhash:5].js",
		publicPath: "/",
		sourceMapFilename: "[file].map"
	},
	devtool: false,
	plugins: [
		new insertScript({
			src: `./manifest/${getDll()}`,
			hash: false
		}),
		new webpack.DllReferencePlugin({
			context: path.join(__dirname, "../src"),
			manifest: require(path.join(
				__dirname,
				"../dist/manifest/manifest.json"
			)),
			name: "manifest"
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		//new BundleAnalyzerPlugin(),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require("cssnano"),
			cssProcessorPluginOptions: {
				preset: ["default", { discardComments: { removeAll: true } }]
			},
			canPrint: true
		})
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				sourceMap: true, // Must be set to true if using source-maps in production
				terserOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		],
		minimize: true,
		usedExports: true,
		providedExports: true,
		concatenateModules: true,
		mangleWasmImports: true,
		flagIncludedChunks: true,
		nodeEnv: "production",
		splitChunks: {
			chunks: "all",
			maxAsyncRequests: 10,
			maxInitialRequests: 10,
			name: true,
			cacheGroups: {
				vendors: {
					chunks: "all",
					test: /[\\/]node_modules[\\/]/,
					maxInitialRequests: 10,
					minChunks: 2,
					minSize: 10000,
					priority: -10
				},
				default: {
					//cacheGroups重写继承配置，设为false不继承
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		}
		// runtimeChunk: {
		// 	name: "manifest"
		// }
	}
};
module.exports = webpackProConfig;
