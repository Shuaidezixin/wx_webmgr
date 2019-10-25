/**
 * 	过渡Toast组件
 */
import * as React from "react";
import { Icon } from "antd";
import * as ReactDom from "react-dom";
import "./index.less";

interface Props {}
interface State {
	text: string;
}

interface InfoData {
	title?: string;
	content: string;
	width?: number;
	wrapClassName?: string;
}
export default class Toast extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static renderLoadHtml(str: string) {
		return (
			<div className="toast-body">
				<div className="toast-container">
					<Icon type="loading" spin className="icon" />
					<span className="text">{str}</span>
				</div>
			</div>
		);
	}
	static loading(str: string, duration?: number) {
		let node = document.createElement("div");
		document.body.appendChild(node);
		ReactDom.render(Toast.renderLoadHtml(str), node);
		if (duration == 0) {
			return {
				close: () => {
					document.body.removeChild(node);
				}
			};
		}
		if (duration == undefined) {
			setTimeout(() => {
				document.body.removeChild(node);
			}, 3000);
			return;
		}
		if (duration != 0 || duration != undefined) {
			setTimeout(() => {
				document.body.removeChild(node);
			}, duration);
			return;
		}
	}
	static renderInfoHtml(data: InfoData, closeFun: () => void) {
		let { title, content, width } = data;
		return (
			<div className="toast-body">
				<div className="toast-info-bg" onClick={closeFun} />
				<div
					className="toast-info-container show"
					style={{ width: width ? width + "px" : "400px" }}
				>
					{title && title.length > 0 && (
						<div className="toast-info-title">{title}</div>
					)}
					<div
						className="toast-info-content"
						dangerouslySetInnerHTML={{ __html: content }}
					></div>
					<div className="close" onClick={closeFun}>
						关闭
					</div>
				</div>
			</div>
		);
	}
	static info(data: InfoData) {
		let node = document.createElement("div");
		node.className = "toast-info-box";
		document.body.appendChild(node);
		setTimeout(() => {
			node.className = "toast-info-box show";
		}, 4);
		//关闭方法
		let close = (): void => {
			node.className = "toast-info-box";
			setTimeout(() => {
				document.body.removeChild(node);
			}, 150);
		};
		ReactDom.render(Toast.renderInfoHtml(data, close), node);
	}
}
