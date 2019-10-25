function insertHtml(options) {
	this.options = options;
}
insertHtml.prototype.apply = function(compiler) {
	var src = this.options.src;
	var hasHash = this.options.hash;
	compiler.plugin("compilation", function(compilation, options) {
		compilation.plugin(
			"html-webpack-plugin-before-html-processing",
			function(htmlPluginData, callback) {
				htmlPluginData.html = htmlPluginData.html.replace(
					"</body>",
					`<script src="${src}${
						hasHash ? "?" + compilation.hash : ""
					}"></script></body>`
				);
			}
		);
	});
};
module.exports = insertHtml;
