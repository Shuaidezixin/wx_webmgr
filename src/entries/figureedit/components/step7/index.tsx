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
}

export default class Step3 extends React.PureComponent<Props, State> {
	readonly state: State = {
		chatList: [
			{
				name: "查看好友资料主页",
				setKey: "BrowseFriendInfo",
				key: "ViewFriend_zhuye"
			},
			{
				name: "查看好友朋友圈",
				setKey: "BrowseFriendPyq",
				key: "ViewFriend_pyq"
			},
			{
				name: "查看更多信息",
				setKey: "BrowseFriendMoreInfo",
				key: "ViewFriend_more_info"
			},
			{
				name: "设为星标",
				setKey: "SetStart",
				key: "ViewFriend_set_star"
			},
			{
				name: "删除",
				setKey: "DeleteFriend",
				key: "ViewFriend_delete"
			}
			// {
			// 	name: "修改备注名",
			// 	setKey: "UpdateBz",
			// 	key: "ViewFriend_bzm"
			// },
			// {
			// 	name: "添加描述",
			// 	setKey: "AddNote",
			// 	key: "ViewFriend_addnote"
			// },
			// {
			// 	name: "贴标签",
			// 	setKey: "AddTag",
			// 	key: "ViewFriend_addtag"
			// }
		]
	};
	constructor(props: Props) {
		super(props);
	}
	ownChange(key: string, type: string, data: any, e: any) {
		let value = type == "start" ? [e, data[1]] : [data[0], e];
		this.props.onChange({
			key: key,
			value: value
		});
	}
	listItemChange(data: any) {
		this.props.onChange(data);
	}
	public render() {
		let { chatList } = this.state;
		let { data, settingTask } = this.props;
		let erverDay, minus;
		if (data) {
			//erverDay = data["ViewFriend_Count"].split(";");
			//minus = data["ViewFriend_Time_Minus"].split(";");
		}
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
									"ViewFriend_Count",
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
									"ViewFriend_Count",
									"end",
									erverDay
								)}
								precision={0}
							/>
							<span>次</span>
						</div> */}
					{/* <div className="item1">
							<span>每次任务间隔时间</span>
							<InputNumber
								className="input"
								value={minus && minus[0]}
								onChange={this.ownChange.bind(
									this,
									"ViewFriend_Time_Minus",
									"start",
									minus
								)}
								precision={0}
							/>
							<span>-</span>
							<InputNumber
								className="input"
								value={minus && minus[1]}
								onChange={this.ownChange.bind(
									this,
									"ViewFriend_Time_Minus",
									"end",
									minus
								)}
								precision={0}
							/>
							<span>分钟</span>
						</div> */}
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
