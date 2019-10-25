/**
 * 	公共组件：
 *    消息输入框
 */
import * as React from "react";
import { KeyBindingUtil } from "draft-js";
const { isCtrlKeyCommand } = KeyBindingUtil;
import { ContentUtils } from "braft-utils/dist";
import BraftEditor1 from "braft-editor";
import "braft-editor/dist/index.css";
import { message } from "antd";
import * as classnames from "classnames";
import { requestUrl } from "../../config";
import "./index.less";
const BraftEditor: any = BraftEditor1;
interface Props {
	style?: any;
	className?: string;
	onChange?: Function;
	value?: any;
	onEnter?: Function;
}
interface State {
	content: any;
}

class Editor extends React.PureComponent<Props, State> {
	private editorBox: React.RefObject<BraftEditor>;
	constructor(props: Props) {
		super(props);
		this.editorBox = React.createRef();
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		content: BraftEditor.createEditorState(null)
	};
	componentDidMount() {
		// window.addEventListener(
		// 	"paste",
		// 	(e: any) => {
		// 		if (e.clipboardData.files) {
		// 			if (!e.clipboardData.files[0]) {
		// 				message.error(
		// 					"因为浏览器限制，不能通过复制本地图片上传"
		// 				);
		// 				e.preventDefault();
		// 				return false;
		// 			}
		// 		}
		// 	},
		// 	false
		// );
	}
	getContent() {
		return this.state.content.toHTML();
	}
	clearContent() {
		this.setState({
			content: ContentUtils.clear(this.state.content)
		});
	}
	public insertText(str: string) {
		this.setState({
			content: ContentUtils.insertText(this.state.content, str)
		});
	}
	componentWillUnmount() {
		this.setState({
			content: BraftEditor.createEditorState(null)
		});
	}
	editContentChange() {
		let { onChange } = this.props;
		if (onChange && typeof onChange === "function") {
			onChange();
		}
	}
	componentDidUpdate(props: any, state: any) {
		if (props.value != this.props.value) {
			this.setState({
				content: BraftEditor.createEditorState(this.props.value)
			});
		}
	}
	editorUploadMedia(param: any) {
		const xhr = new XMLHttpRequest();
		let file = param.file;
		let suffix = file.name.substr(
			file.name.lastIndexOf(".") + 1,
			file.name.length
		);
		let token = window.localStorage.getItem("token");
		let formData = new FormData();
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
		xhr.open("POST", requestUrl() + "/upload", true);
		formData.append("file", file);
		formData.append("token", token);
		const successFn = (response: any) => {
			// 假设服务端直接返回文件上传后的地址
			// 上传成功后调用param.success并传入上传后的文件地址
			if (
				!response ||
				!response.currentTarget ||
				!response.currentTarget.responseText
			) {
				message.error(`上传失败`);
				return;
			}
			let text = JSON.parse(response.currentTarget.responseText);
			param.success({
				url: text.data,
				meta: {
					id: param.libraryId
					// title: param.file.name,
					// alt: param.file.name,
					// loop: true, // 指定音视频是否循环播放
					// autoPlay: false, // 指定音视频是否自动播放
					// controls: true // 指定音视频是否显示控制栏
				}
			});
		};
		xhr.addEventListener("load", successFn, false);
		xhr.send(formData);
	}
	handlerChange(content: any) {
		this.setState({
			content
		});
	}
	editorProps = {
		onChange: this.handlerChange.bind(this),
		contentId:
			new Date().getTime() +
			"_" +
			parseInt((Math.random() * 100000).toString(), 10),
		forceNewLine: false,
		onBlur: this.editContentChange.bind(this),
		handleReturn: (e: any) => {
			if (
				e.keyCode == 13 &&
				!isCtrlKeyCommand(e) &&
				this.props.onEnter &&
				typeof this.props.onEnter === "function"
			) {
				this.props.onEnter();
				return "handled";
			}
			return "not-handled";
		},
		media: {
			allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
			image: true, // 开启图片插入功能
			video: true, // 开启视频插入功能
			audio: true, // 开启音频插入功能
			uploadFn: this.editorUploadMedia.bind(this), // 指定上传函数，说明见下文
			externalMedias: {
				image: true
			},
			imageControls: {
				floatLeft: false,
				floatRight: false,
				alignLeft: false,
				alignCenter: false,
				alignRight: false,
				link: false,
				size: false
			}
		}
	};
	editorClick() {
		let editor: any = this.editorBox.current;
		editor.requestFocus();
	}
	render() {
		let { style, className } = this.props;
		let { content } = this.state;
		return (
			<div
				className={classnames("beditor", className)}
				style={style}
				onClick={this.editorClick.bind(this)}
			>
				<BraftEditor
					ref={this.editorBox}
					{...this.editorProps}
					value={content}
				/>
			</div>
		);
	}
}
export default Editor;
