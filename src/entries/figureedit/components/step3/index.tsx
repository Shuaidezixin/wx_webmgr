import * as React from "react";
import ListItem from "../listitem";
import { InputNumber } from "antd";
import "./index.less";

interface Props {
	data?: any;
	onChange?: Function;
	settingTask?: any;
}
interface State {
	chatList: any[];
	hotChatList: any[];
}

export default class Step3 extends React.PureComponent<Props, State> {
	readonly state: State = {
		hotChatList: [
			{
				name: "单聊-置顶聊天",
				setKey: "ChatTop",
				key: "ChatConfig_One_Top"
			},
			{
				// name: "内部好友按照剧本聊天",
				name: "内部剧本",
				setKey: "InsideScript",
				key: "ChatConfig_InSideScript"
			},
			{
				name: "推广剧本",
				setKey: "ExtensionScript",
				key: "ChatConfig_ExtensionScript"
			},
			// {
			// 	name: "添加聊天的表情",
			// setKey:"AddChatBiaoQingPkgStore",
			// 	key: "ChatConfig_AddBiaoqin"
			// },
			// {
			// 	name: "移除我添加的表情",
			// setKey:"DeleteChatBiaoQingPkg",
			// 	key: "ChatConfig_RemoveBiaoqin"
			// },
			{
				name: "添加表情商店表情包",
				setKey: "AddChatBiaoQingPkgStore",
				key: "ChatConfig_AddPackageBiaoqin"
			},
			{
				name: "移除表情包",
				setKey: "DeleteChatBiaoQingPkg",
				key: "ChatConfig_RemovePackageBiaoqin"
			},
			{
				name: "浏览表情包",
				setKey: "LookChatBiaoQingPkg",
				key: "ChatConfig_LookPackageBiaoqin"
			}
		],
		chatList: [
			{
				name: "聊天收藏",
				setKey: "ChatSc",
				key: "ChatConfig_One_Sc"
			},
			{
				name: "单聊-消息免打扰",
				setKey: "ChatDonNotDisturb",
				key: "ChatConfig_One_Miandarao"
			},
			{
				name: "单聊-强提醒",
				setKey: "ChatDisturb",
				key: "ChatConfig_One_Qiangtixing"
			},
			{
				name: "单聊-设置聊天背景",
				setKey: "ChatBackGround",
				key: "ChatConfig_One_Backpic"
			},
			{
				name: "单聊-清空聊天记录",
				setKey: "ClearChat",
				key: "ChatConfig_One_ClearContent"
			},
			// {
			// 	name: "群聊-新建群聊",
			// 	key: "ChatConfig_Group_New"
			// },
			// {
			// 	name: "群聊-邀请好友加群",
			// 	key: "ChatConfig_Group_Addfrined"
			// },
			// {
			// 	name: "群聊-删除群好友",
			// 	key: "ChatConfig_Group_Deletefrined"
			// },
			// {
			// 	name: "群聊-修改群名称",
			// 	key: "ChatConfig_Group_NameUpdate"
			// },
			{
				name: "群聊-消息免打扰",
				setKey: "GroupDonNotDisturb",
				key: "ChatConfig_Group_Miandaran"
			},
			{
				name: "群聊-保存到通讯录",
				setKey: "SaveGroup",
				key: "ChatConfig_Group_Save"
			},
			{
				name: "群聊-显示群成员昵称",
				setKey: "ShowGroupMemberNickName",
				key: "ChatConfig_Group_ShowNickname"
			},
			{
				name: "群聊-置顶群聊",
				setKey: "GroupTop",
				key: "ChatConfig_Group_Top"
			},
			// {
			// 	name: "群聊-修改我在本群的昵称",
			// setKey:"",
			// 	key: "ChatConfig_Group_MyNameUpdate"
			//},
			{
				name: "群聊-清空聊天记录",
				setKey: "ClearGroup",
				key: "ChatConfig_Group_Clear"
			},
			{
				name: "群聊-设置聊天背景",
				setKey: "GroupBackGround",
				key: "ChatConfig_Group_Backpic"
			}
			// {
			// 	name: "群聊-删除并退出",
			// setKey:"",
			// 	key: "ChatConfig_Group_DeleteAndQuit"
			// }
		]
	};
	constructor(props: Props) {
		super(props);
	}
	ownChange(key: string, type: string, data: any, e: any) {
		let se: number = 0;
		if (e && e != "") {
			se = e;
		}
		let value = type == "start" ? [se, data[1]] : [data[0], se];
		this.props.onChange({
			key: key,
			value: value
		});
	}
	listItemChange(data: any) {
		this.props.onChange(data);
	}
	public render() {
		let { chatList, hotChatList } = this.state;
		let { data, settingTask } = this.props;
		let erverDay, minus;
		if (data) {
			//erverDay = data["ChatConfig_Count"].split(";");
			minus = data["ChatConfig_Time_Minus"].split(";");
		}
		// if (
		// 	settingTask &&
		// 	settingTask.taskinfos &&
		// 	settingTask.taskinfos.length > 0
		// ) {
		// 	let arr = settingTask.taskinfos.filter((v: any) => v.isauto);
		// 	let set: any = [];
		// 	arr.map((v: any) => {
		// 		set.push(v.key);
		// 	});
		// 	if (set && set.length > 0) {
		if (settingTask && settingTask.length > 0) {
			return (
				<div className="step3">
					{/* <div className="item1">
							<span>每天任务总次数</span>
							<InputNumber
								className="input"
								value={erverDay && erverDay[0]}
								onChange={this.ownChange.bind(
									this,
									"ChatConfig_Count",
									"start",
									erverDay
								)}
								precision={0}
							/>
							<span>-</span>
							<InputNumber
								className="input"
								value={erverDay && erverDay[1]}
								onChange={this.ownChange.bind(
									this,
									"ChatConfig_Count",
									"end",
									erverDay
								)}
								precision={0}
							/>
							<span>次</span>
						</div> */}
					<div className="item1">
						<span>每次任务间隔时间</span>
						<InputNumber
							className="input"
							value={minus && minus[0]}
							onChange={this.ownChange.bind(
								this,
								"ChatConfig_Time_Minus",
								"start",
								minus
							)}
							precision={0}
							min={0}
						/>
						<span>-</span>
						<InputNumber
							className="input"
							value={minus && minus[1]}
							onChange={this.ownChange.bind(
								this,
								"ChatConfig_Time_Minus",
								"end",
								minus
							)}
							precision={0}
							min={0}
						/>
						<span>分钟</span>
					</div>
					{hotChatList &&
						hotChatList.length > 0 &&
						hotChatList.map((item: any, idx: number) => {
							if (settingTask.indexOf(item.setKey) == -1) {
								return null;
							}
							return (
								<ListItem
									key={idx}
									item={item}
									data={
										data &&
										data[item.key] &&
										data[item.key].split(";")
									}
									onChange={this.listItemChange.bind(this)}
									startWrod="每天执行"
									endWord="次"
								/>
							);
						})}
					<hr />
					{chatList &&
						chatList.length > 0 &&
						chatList.map((item: any, idx: number) => {
							if (settingTask.indexOf(item.setKey) == -1) {
								return null;
							}
							return (
								<ListItem
									key={idx}
									item={item}
									data={
										data &&
										data[item.key] &&
										data[item.key].split(";")
									}
									onChange={this.listItemChange.bind(this)}
								/>
							);
						})}
				</div>
			);
		}
		return <div>获取数据中...</div>;
	}
}
