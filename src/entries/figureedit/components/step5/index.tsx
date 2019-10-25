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
	hotChatList: any[];
}

export default class Step3 extends React.PureComponent<Props, State> {
	readonly state: State = {
		hotChatList: [
			{
				name: "预览公众号",
				setKey: "BrowseGZH",
				key: "Gzh_yulan"
			},
			{
				name: "阅读公众号文章",
				setKey: "ReadGZHArticle",
				key: "gzh_yuedu"
			}
		],
		chatList: [
			{
				name: "搜索公众号",
				setKey: "SearchGZH",
				key: "gzh_search"
			},
			{
				name: "关注公众号",
				setKey: "ForceGZH",
				key: "gzh_guanzhu"
			},
			{
				name: "取消关注公众号",
				setKey: "CancelGZH",
				key: "gzh_guanzhu_cancel"
			},

			{
				name: "收藏公众号文章",
				setKey: "ScGZHArticle",
				key: "gzh_soucang"
			},
			{
				name: "转发公众号文章到朋友圈",
				setKey: "ForwardGZHPyq",
				key: "gzh_zhuanfa_pyq"
			},
			{
				name: "转发公众号文章到聊天",
				setKey: "ForwardGZHChat",
				key: "gzh_zhuanfa_chat"
			},
			{
				name: "置顶公众号",
				setKey: "OPenGZHTop",
				key: "gzh_zhuanfa_top"
			},
			// {
			// 	name: "关闭置顶公众号",
			// 	setKey: "CloseGZHTop",
			// 	key: "gzh_zhuanfa_closetop"
			// },
			{
				name: "删除聊天",
				setKey: "",
				key: "gzh_shanchu"
			},
			{
				name: "清空内容",
				setKey: "ClearGZH",
				key: "gzh_qingkong"
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
		let { chatList, hotChatList } = this.state;
		let { data, settingTask } = this.props;
		let erverDay, minus;
		if (data) {
			//erverDay = data["gzh_count"].split(";");
			minus = data["gzh_time_minus"].split(";");
		}
		if (settingTask && settingTask.length > 0) {
			return (
				<div className="step5">
					{/* <div className="item1">
							<span>每天任务总次数</span>
							<InputNumber
								className="input"
								value={erverDay && erverDay[0]}
								onChange={this.ownChange.bind(
									this,
									"gzh_count",
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
									"gzh_count",
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
								"gzh_time_minus",
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
								"gzh_time_minus",
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
