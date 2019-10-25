import * as React from "react";
import { Modal, message } from "antd";
import InputBox from "@component/inputbox";
import "./index.less";

interface Props {
	visible?: boolean;
	onOk?: Function;
	onCancel?: Function;
}
interface State {
	AddFriendNote: string;
	MobileList: string;
}

export default class AddFriend extends React.PureComponent<Props, State> {
	static readonly defaultProps: Props = {
		visible: true
	};
	readonly state: State = {
		AddFriendNote: "",
		MobileList: ""
	};

	static getDerivedStateFromProps(nextProps: any, currentState: any): any {
		if (nextProps.visible && !currentState.visible) {
			return {
				AddFriendNote: "",
				MobileList: "",
				visible: true
			};
		}
		if (!nextProps.visible && currentState.visible) {
			return {
				AddFriendNote: "",
				MobileList: "",
				visible: false
			};
		}
		return null;
	}

	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	okClick() {
		let { onOk } = this.props;
		let { AddFriendNote, MobileList } = this.state;
		if (!MobileList || MobileList.length <= 0) {
			message.error("微信号不能为空");
			return;
		}
		if (onOk && typeof onOk === "function") {
			onOk({
				MobileList,
				AddFriendNote
			});
		}
	}
	render() {
		let { visible } = this.props;
		let { AddFriendNote, MobileList } = this.state;
		return (
			<Modal
				title="添加好友"
				visible={visible}
				wrapClassName="message-addfriend"
				onCancel={this.cancelClick.bind(this)}
				onOk={this.okClick.bind(this)}
			>
				<div>
					<InputBox
						placeholder="请输入要添加的微信号"
						labelName="微信号"
						autoWidth={true}
						value={MobileList}
						isRequired={true}
						onChange={window.Util.InputChange.bind(
							this,
							"MobileList"
						)}
					/>
					<InputBox
						autoWidth={true}
						placeholder="请输入招呼语"
						labelName="招呼语"
						value={AddFriendNote}
						onChange={window.Util.InputChange.bind(
							this,
							"AddFriendNote"
						)}
					/>
				</div>
			</Modal>
		);
	}
}
