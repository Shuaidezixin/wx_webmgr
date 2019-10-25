import * as React from "react";
import { message, Modal } from "antd";
import * as moment from "moment";
import "./index.less";
import SimpleTask from "../simple";

interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	workData?: any;
}
interface State {}

export default class ViewFriend extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	async saveClick(type?: string, time?: string) {
		let { selectedData, createUserTaskAction } = this.props;
		let params: any = {
			type: "ViewFriend"
		};
		let userID: any[] = [];
		if (!selectedData || selectedData.length <= 0) {
			message.error("请选择账户");
			return;
		}
		selectedData.map((item: any) => {
			userID.push(item.id);
		});
		params.account_ids = userID;
		params.sub_type = type;
		params.execute_hi = time;
		params[type] = {
			Name: ""
		};
		if (
			params.execute_hi != 0 &&
			Number(params.execute_hi) < Number(moment().format("HHmm"))
		) {
			message.error("执行时间不能小于当前时间");
			return;
		}
		if (createUserTaskAction && typeof createUserTaskAction == "function") {
			let res = await createUserTaskAction({
				taskobj: JSON.stringify(params)
			});
			if (res && res.code == 200) {
				Modal.success({ title: "成功", content: "创建成功" });
			}
		}
	}
	render() {
		let { workData } = this.props;
		return (
			<div className="chatcreate-task">
				{workData && workData.BrowseFriendInfo && (
					<SimpleTask
						labelName="查看好友资料主页（随机）"
						type="ViewFriend_zhuye"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.BrowseFriendPyq && (
					<SimpleTask
						labelName="查看好友朋友圈（随机）"
						type="ViewFriend_pyq"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.BrowseFriendMoreInfo && (
					<SimpleTask
						labelName="查看更多信息（随机）"
						type="ViewFriend_more_info"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.SetStart && (
					<SimpleTask
						labelName="设为星标（随机）"
						type="ViewFriend_set_star"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.DeleteFriend && (
					<SimpleTask
						labelName="删除（随机）"
						type="ViewFriend_delete"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{(!workData ||
					(!workData.BrowseFriendInfo &&
						!workData.BrowseFriendPyq &&
						!workData.BrowseFriendMoreInfo &&
						!workData.SetStart &&
						!workData.DeleteFriend)) && (
					<div className="nodatabox">系统设置不允许手动任务</div>
				)}
			</div>
		);
	}
}
