import * as React from "react";
import { Icon } from "antd";
import NewAddFriend from "../newaddfriend";
import NewPyq from "../newpyq";
import NewUserInfo from "../newuserinfo";
import NewGzh from "../newgzh";
import NewSc from "../newsc";
import NewChat from "../newchat";
import NewViewFriend from "../newviewfriend";
import "./index.less";

interface Props {
	targetType?: string | void;
	targetSubType?: string | void;
	targetName?: string | void;
	createUserTaskAction?: Function;
	selectedData?: any;
	onCancel?: Function;
}
interface State {}

export default class TaskDraw extends React.PureComponent<Props, State> {
	private Components: any = {};
	constructor(props: Props) {
		super(props);
		this.Components = {
			AddFriend: <NewAddFriend />,
			Pyq: <NewPyq />,
			AccountSetting: <NewUserInfo />,
			gzh: <NewGzh />,
			Sc: <NewSc />,
			ChatConfig: <NewChat />,
			FriendInfo: <NewViewFriend />
		};
	}
	static readonly defaultProps: Props = {
		targetType: null,
		targetSubType: null,
		targetName: null
	};
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	render() {
		let {
			targetName,
			targetType,
			targetSubType,
			createUserTaskAction,
			selectedData
		} = this.props;
		return (
			<div className="task-draw-container">
				<div className="title">
					<Icon
						type="close"
						className="title-icon"
						onClick={this.cancelClick.bind(this)}
					/>
					<div className="title-text">{targetName && targetName}</div>
				</div>
				<div className="task-draw-content">
					{targetType &&
						React.cloneElement(this.Components[targetType], {
							targetType: targetType,
							targetSubType: targetSubType,
							createUserTaskAction: createUserTaskAction,
							selectedData: selectedData
						})}
				</div>
			</div>
		);
	}
}
