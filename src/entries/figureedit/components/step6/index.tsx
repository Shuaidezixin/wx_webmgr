import * as React from "react";
import ListItem from "../listitem";
import { InputNumber } from "antd";
import "./index.less";

interface Props {
	data: any;
	onChange: Function;
	settingTask?: any;
}
interface State {
	chatList: any[];
}

export default class Step3 extends React.PureComponent<Props, State> {
	readonly state: State = {
		chatList: [
			{
				name: "打开预览收藏",
				setKey: "BrowseSc",
				key: "SC_dakaiyulan"
			},
			{
				name: "阅读收藏",
				setKey: "ReadSc",
				key: "SC_read"
			},
			{
				name: "删除收藏",
				setKey: "DeleteSc",
				key: "SC_delete"
			},
			{
				name: "转发链接收藏到朋友圈",
				setKey: "ForwardScLinkPyq",
				key: "sc_zhuanfa_link_pyq"
			},
			{
				name: "转发链接收藏到聊天",
				setKey: "ForwardScLinkChat",
				key: "SC_zhuanfa_link_chat"
			},
			{
				name: "筛选收藏",
				setKey: "ScreenSc",
				key: "SC_shaixuan"
			},
			{
				name: "写笔记",
				setKey: "WriteNote",
				key: "SC_add_note"
			},
			{
				name: "转发笔记到朋友圈",
				setKey: "ForwardNotePyq",
				key: "SC_zhuanfa_note_pyq"
			},
			{
				name: "转发笔记到聊天",
				setKey: "ForwardNoteChat",
				key: "SC_zhuanfa_note_chat"
			}
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
		let { chatList } = this.state;
		let { data, settingTask } = this.props;
		let erverDay, minus;
		if (data) {
			//erverDay = data["sc_count"] ? data["sc_count"].split(";") : [0, 0];
			// minus = data["sc_time_minus"]
			// 	? data["sc_time_minus"].split(";")
			// 	: [0, 0];
		}
		if (settingTask && settingTask.length > 0) {
			return (
				<div className="step6">
					{/* <div className="item1">
							<span>每天任务总次数</span>
							<InputNumber
								className="input"
								value={erverDay && erverDay[0]}
								onChange={this.ownChange.bind(
									this,
									"sc_count",
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
									"sc_count",
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
									"sc_time_minus",
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
									"sc_time_minus",
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
