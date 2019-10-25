import * as React from "react";
import { InputNumber } from "antd";
import ListItem from "../listitem";
import "./index.less";

interface Props {
	data?: any;
	onChange?: Function;
	settingTask?: any;
}
interface State {
	addList: any[];
}

export default class Step2 extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		addList: [
			{
				name: "通讯录添加好友（随机）",
				setKey: "MailListFriend",
				key: "addfriend_tongxunlu",
				input3Placeholder: "不超过8次"
			},
			{
				name: "检索添加好友",
				setKey: "SearchFriend",
				key: "addfriend_jiansuo",
				input3Placeholder: "不超过10次"
			},
			{
				name: "群添加好友（随机）",
				setKey: "GroupFriend",
				key: "addfriend_qun",
				input3Placeholder: "不超过8次"
			}
		]
	};
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
		let { addList } = this.state;
		let { data, settingTask } = this.props;
		let erverDay, minus;
		if (data) {
			// erverDay = data["addfriend_count"].split(";");
			minus = data["addfriend_time_minus"].split(";");
		}
		if (settingTask && settingTask.length > 0) {
			return (
				<div className="step2">
					{/* <div className="item1">
							<span>每天任务总次数</span>
							<InputNumber
								className="input"
								value={erverDay && erverDay[0]}
								onChange={this.ownChange.bind(
									this,
									"addfriend_count",
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
									"addfriend_count",
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
								"addfriend_time_minus",
								"start",
								minus
							)}
							placeholder="不低于5分钟"
							precision={0}
							min={0}
						/>
						<span>-</span>
						<InputNumber
							className="input"
							value={minus && minus[1]}
							onChange={this.ownChange.bind(
								this,
								"addfriend_time_minus",
								"end",
								minus
							)}
							precision={0}
							min={0}
						/>
						<span>分钟</span>
					</div>
					{addList &&
						addList.length > 0 &&
						addList.map((item: any, idx: any) => {
							// if(!act[item.setKey].isauto)
							// {
							// 	return null
							// }
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
									startWrod="每天执行"
									endWord="次"
									onChange={this.listItemChange.bind(this)}
									input1Placeholder={item.input1Placeholder}
									input2Placeholder={item.input2Placeholder}
									input3Placeholder={item.input3Placeholder}
								/>
							);
						})}
				</div>
			);
		}
		return <div>获取数据中...</div>;
	}
}
