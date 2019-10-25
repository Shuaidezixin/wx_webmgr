import * as React from "react";
import { Modal, Input } from "antd";
import Face from "@component/face";
import "./index.less";
const TextArea = Input.TextArea;
interface Props {
	title?: string;
	visible: boolean;
	onCancel?: Function;
	onOk?: Function;
}
interface State {
	messageText: string;
	visible: boolean;
}

export default class Reply extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: false,
		title: "评论"
	};
	readonly state: State = {
		messageText: "",
		visible: false
	};
	static getDerivedStateFromProps(nextProps: any, currentState: any): any {
		if (nextProps.visible && !currentState.visible) {
			return {
				messageText: "",
				visible: true
			};
		}
		if (!nextProps.visible && currentState.visible) {
			return {
				messageText: "",
				visible: false
			};
		}
		return null;
	}
	faceClick(word: string) {
		let value = window.Util.insertText(
			document.querySelector("#chatText"),
			`[${word}]`
		);
		this.setState({
			messageText: value
		});
	}
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	okClick() {
		let { onOk } = this.props;
		if (onOk && typeof onOk === "function") {
			onOk(this.state.messageText);
		}
	}
	render() {
		let { title, visible } = this.props;
		let { messageText } = this.state;
		return (
			<Modal
				title={title}
				visible={visible}
				wrapClassName="reply-box"
				onCancel={this.cancelClick.bind(this)}
				onOk={this.okClick.bind(this)}
			>
				<div>
					<TextArea
						className="text"
						autosize
						id="chatText"
						value={messageText}
						onChange={window.Util.InputChange.bind(
							this,
							"messageText"
						)}
					/>
					<Face onClick={this.faceClick.bind(this)} />
				</div>
			</Modal>
		);
	}
}
