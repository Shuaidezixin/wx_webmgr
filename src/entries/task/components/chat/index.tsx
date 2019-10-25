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

export default class Chat extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {};
	async saveClick(type: string, time: string) {
		let { selectedData, createUserTaskAction } = this.props;
		let state: any = this.state;
		let params: any = {
			type: "ChatConfig"
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
				{workData && workData.ChatSc && (
					<SimpleTask
						labelName="聊天收藏（随机）"
						type="ChatConfig_Sc"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ChatTop && (
					<SimpleTask
						labelName="单聊-置顶聊天（随机）"
						type="ChatConfig_One_Top"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ChatDonNotDisturb && (
					<SimpleTask
						labelName="单聊-消息免打扰（随机）"
						type="ChatConfig_One_Miandarao"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ChatDisturb && (
					<SimpleTask
						labelName="单聊-强提醒（随机）"
						type="ChatConfig_One_Qiangtixing"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ChatBackGround && (
					<SimpleTask
						labelName="设置聊天背景（随机）"
						type="ChatConfig_One_Backpic"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ClearChat && (
					<SimpleTask
						labelName="单聊-清空聊天记录（随机）"
						type="ChatConfig_One_ClearContent"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{/* {workData && workData.NewGroup && (
					<SimpleTask
						labelName="群聊-新建群聊（随机）"
						type="ChatConfig_Group_New"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.AddGroupFriend && (
					<SimpleTask
						labelName="群聊-邀请好友加群（随机）"
						type="ChatConfig_Group_Addfrined"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.DeleteGroupFriend && (
					<SimpleTask
						labelName="群聊-删除群好友（随机）"
						type="ChatConfig_Group_Deletefrined"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.UpdateGroupName && (
					<SimpleTask
						labelName="群聊-修改群名称（随机）"
						type="ChatConfig_Group_NameUpdate"
						onOk={this.saveClick.bind(this)}
					/>
				)} */}
				{workData && workData.GroupDonNotDisturb && (
					<SimpleTask
						labelName="群聊-消息免打扰（随机）"
						type="ChatConfig_Group_Miandaran"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.SaveGroup && (
					<SimpleTask
						labelName="群聊-保存到通讯录（随机）"
						type="ChatConfig_Group_Save"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ShowGroupMemberNickName && (
					<SimpleTask
						labelName="群聊-显示群成员昵称（随机）"
						type="ChatConfig_Group_ShowNickname"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.GroupTop && (
					<SimpleTask
						labelName="群聊-置顶群聊（随机）"
						type="ChatConfig_Group_Top"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ClearGroup && (
					<SimpleTask
						labelName="群聊-清空聊天记录（随机）"
						type="ChatConfig_Group_Clear"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{/* {workData && workData.DeleteGroup && (
					<SimpleTask
						labelName="群聊-删除并退出（随机）"
						type="ChatConfig_Group_DeleteAndQuit"
						onOk={this.saveClick.bind(this)}
					/>
				)} */}
				{(!workData ||
					(!workData.ChatSc &&
						!workData.ChatTop &&
						!workData.ChatDonNotDisturb &&
						!workData.ChatDisturb &&
						!workData.ChatBackGround &&
						!workData.ClearChat &&
						// !workData.NewGroup &&
						// !workData.AddGroupFriend &&
						// !workData.DeleteGroupFriend &&
						// !workData.UpdateGroupName &&
						!workData.GroupDonNotDisturb &&
						!workData.SaveGroup &&
						!workData.ShowGroupMemberNickName &&
						!workData.GroupTop &&
						!workData.ClearGroup)) && (
					//!workData.DeleteGroup
					<div className="nodatabox">系统设置不允许手动任务</div>
				)}

				{/* <SimpleTask
					labelName="群聊-设置聊天背景（随机）"
					type="ChatConfig_Group_Backpic"
					onOk={this.saveClick.bind(this)}
				/> */}
				{/* <SimpleTask
					labelName="添加聊天的表情（随机）"
					type="ChatConfig_AddBiaoqin"
					onOk={this.saveClick.bind(this)}
				/>
				<SimpleTask
					labelName="移除我添加的表情（随机）"
					type="ChatConfig_RemoveBiaoqin"
					onOk={this.saveClick.bind(this)}
				/>
				<SimpleTask
					labelName="添加表情包商店表情包（随机"
					type="ChatConfig_AddPackageBiaoqin"
					onOk={this.saveClick.bind(this)}
				/>
				<SimpleTask
					labelName="移除表情包（随机）"
					type="ChatConfig_RemovePackageBiaoqin"
					onOk={this.saveClick.bind(this)}
				/> */}
			</div>
		);
	}
}
