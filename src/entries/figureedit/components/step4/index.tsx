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
				name: "发朋友圈",
				setKey: "SendPyq",
				key: "pyq_sentshuoshuo"
			},
			{
				name: "浏览朋友圈",
				setKey: "BrowsePyq",
				key: "pyq_liulan"
			},
			{
				name: "打开阅读",
				setKey: "ReadPyq",
				key: "pyq_dakaiyuedu"
			},
			{
				name: "点赞",
				setKey: "Pyq_dianzan",
				key: "pyq_dianzan"
			}
		],
		chatList: [
			{
				name: "删除我的朋友圈",
				setKey: "DeletePyq",
				key: "pyq_delete"
			},
			{
				name: "转发链接到聊天",
				setKey: "ForwardPyq",
				key: "pyq_zhuanfa_chat"
			},
			{
				name: "转发链接到朋友圈",
				setKey: "ForwardLinkPyq",
				key: "pyq_zhuanfa_pyq"
			},
			// {
			// 	name: "朋友圈收藏",
			// 	setKey: "ScPyq",
			// 	key: "pyq_sc_pyq"
			// },
			{
				name: "分享第三方链接",
				setKey: "Pyq_share_link",
				key: "pyq_share_link"
			},
			{
				name: "文字收藏",
				setKey: "",
				key: "pyq_sc_text"
			},
			{
				name: "图片收藏",
				setKey: "",
				key: "pyq_sc_pic"
			},
			{
				name: "视频收藏",
				setKey: "",
				key: "pyq_sc_video"
			},
			{
				name: "链接收藏",
				setKey: "",
				key: "pyq_sc_link"
			},
			{
				name: "图片下载",
				setKey: "",
				key: "pyq_download_pic"
			},
			{
				name: "视频下载",
				setKey: "",
				key: "pyq_download_video"
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
			//erverDay = data["pyq_count"].split(";");
			minus = data["pyq_time_minus"].split(";");
		}
		if (settingTask && settingTask.length > 0) {
			return (
				<div className="step4">
					{/* <div className="item1">
							<span>每天任务总次数</span>
							<InputNumber
								className="input"
								value={erverDay && erverDay[0]}
								onChange={this.ownChange.bind(
									this,
									"pyq_count",
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
									"pyq_count",
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
								"pyq_time_minus",
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
								"pyq_time_minus",
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
