import * as React from "react";
import { message, Modal } from "antd";
import * as moment from "moment";
import Toast from "@component/toast";
import "./index.less";
import SimpleTask from "../newsimple";

interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	workData?: any;
	targetType?: string | void;
	targetSubType?: string | void;
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
			let loading = Toast.loading("正在提交任务", 0);
			let res = await createUserTaskAction({
				taskobj: JSON.stringify(params)
			});
			loading.close();
			if (res && res.code == 200) {
				Modal.success({ title: "成功", content: "创建成功" });
			}
		}
	}
	render() {
		let { workData, targetType, targetSubType } = this.props;
		return (
			<div className="chatcreate-task">
				{targetSubType && targetSubType == "ViewFriend_zhuye" && (
					<SimpleTask
						labelName="查看好友资料主页（随机）"
						type="ViewFriend_zhuye"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "ViewFriend_pyq" && (
					<SimpleTask
						labelName="查看好友朋友圈（随机）"
						type="ViewFriend_pyq"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "ViewFriend_more_info" && (
					<SimpleTask
						labelName="查看更多信息（随机）"
						type="ViewFriend_more_info"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "ViewFriend_set_star" && (
					<SimpleTask
						labelName="设为星标（随机）"
						type="ViewFriend_set_star"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "ViewFriend_delete" && (
					<SimpleTask
						labelName="删除（随机）"
						type="ViewFriend_delete"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{/* {(!workData ||
					(!workData.BrowseFriendInfo &&
						!workData.BrowseFriendPyq &&
						!workData.BrowseFriendMoreInfo &&
						!workData.SetStart &&
						!workData.DeleteFriend)) && (
					<div className="nodatabox">系统设置不允许手动任务</div>
				)} */}
			</div>
		);
	}
}
