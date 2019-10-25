import * as React from "react";
import { Checkbox, Switch, TimePicker, InputNumber } from "antd";
import * as moment from "moment";
import DetailItem from "@component/detailitem";
import Toast from "@component/toast";
import "./index.less";

interface Props {
	settingTask?: any;
	getSettingTaskAction?: Function;
	updateSettingTaskAction?: Function;
}
interface State {
	infoData: any;
	isauto: boolean;
	createtime: string;
	infoArray: any[];
}

export default class Task extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		infoData: null,
		createtime: "00:00&00:00",
		isauto: false,
		infoArray: []
	};
	componentDidMount() {
		this.getTask();
	}
	async getTask() {
		let load = Toast.loading("数据加载中，请稍候...", 0);
		let res = await this.props.getSettingTaskAction();
		load.close();
		if (res && res.code == 200) {
			let localInfo: any = {};
			let info = res.data.taskinfos;
			let infoArr: any[] = [];
			if (info && info.length > 0) {
				info.map((item: any) => {
					let name: string = "";
					switch (item.type) {
						case "AddFriend":
							name = "加好友";
							break;
						case "Pyq":
							name = "朋友圈";
							break;
						case "AccountSetting":
							name = "账户及隐私";
							break;
						case "ChatConfig":
							name = "聊天设置";
							break;
						case "Sc":
							name = "收藏";
							break;
						case "gzh":
							name = "公众号";
							break;
						case "FriendInfo":
							name = "查看好友资料";
							break;
					}
					if (!localInfo[item.type]) {
						localInfo[item.type] = {
							name: name,
							type: item.type
						};
						localInfo[item.type].children = [];
					}
					localInfo[item.type].children.push(item);
					if (
						!infoArr.some((v: any) => {
							return v.type == item.type;
						})
					) {
						infoArr.push({
							name: name,
							type: item.type
						});
					}
				});
			}
			this.setState({
				infoData: { ...localInfo },
				isauto: res.data.isauto,
				infoArray: [...infoArr],
				createtime:
					res.data.createtime && res.data.createtime.length > 0
						? res.data.createtime
						: "00:00&00:00"
			});
		}
	}
	checkboxChange(
		type: string,
		key: string,
		idx: number,
		keyword: string,
		item: any,
		e: any
	) {
		let { infoData } = this.state;
		let value = e.target.checked;
		infoData[type].children[idx][keyword] = value;
		this.setState({
			infoData: { ...infoData }
		});
		this.props.updateSettingTaskAction({
			type: type,
			key: key,
			ishead: 0,
			isauto:
				keyword == "isauto"
					? value
					: infoData[type].children[idx]["isauto"],
			ismanual:
				keyword == "ismanual"
					? value
					: infoData[type].children[idx]["ismanual"],
			tasknum: infoData[type].children[idx]["tasknum"]
		});
	}
	taskNumChange(
		type: string,
		key: string,
		idx: number,
		keyword: string,
		item: any,
		e: any
	) {
		let { infoData } = this.state;
		let value = e;
		infoData[type].children[idx][keyword] = value;
		this.setState({
			infoData: { ...infoData }
		});
	}
	taskNumBlur(
		type: string,
		key: string,
		idx: number,
		keyword: string,
		item: any,
		e: any
	) {
		let { infoData } = this.state;
		this.props.updateSettingTaskAction({
			type: type,
			key: key,
			ishead: 0,
			isauto: infoData[type].children[idx]["isauto"],
			ismanual: infoData[type].children[idx]["ismanual"],
			tasknum: infoData[type].children[idx]["tasknum"]
		});
	}
	switchChange(e: any) {
		this.setState({
			isauto: e
		});
		this.props.updateSettingTaskAction({
			isauto: e,
			ishead: 1,
			createtime: this.state.createtime
		});
	}
	timePickerChange(type: string, e: any) {
		let { createtime } = this.state;
		let arr: string[] = createtime.split("&");
		let str: string = e.format("HH:mm");
		if (type == "start") {
			arr[0] = str;
		}
		if (type == "end") {
			arr[1] = str;
		}
		let t = arr.join("&");
		this.setState({
			createtime: t
		});
		this.props.updateSettingTaskAction({
			createtime: t,
			ishead: 1,
			isauto: this.state.isauto
		});
	}

	render() {
		let { infoData, isauto, createtime, infoArray } = this.state;

		return (
			<div className="setting-task">
				<div className="setting-task-container">
					<div className="item-title">任务生成设置</div>
					<div className="item-content">
						<DetailItem
							labelName="自动任务"
							nameWidth="150px"
							content={
								<Switch
									size="small"
									checked={isauto}
									onChange={this.switchChange.bind(this)}
								/>
							}
						/>
						{/* <DetailItem
							labelName="自动生成任务时间"
							nameWidth="150px"
							content={
								<div>
									<TimePicker
										format="HH:mm"
										value={
											createtime &&
											moment(
												createtime.split("&")[0]
													? createtime.split("&")[0]
													: "",
												"HH:mm"
											)
										}
										onChange={this.timePickerChange.bind(
											this,
											"start"
										)}
									/>
									<span style={{ padding: "0 5px" }}>~</span>
									<TimePicker
										format="HH:mm"
										value={
											createtime &&
											moment(
												createtime.split("&")[1],
												"HH:mm"
											)
										}
										onChange={this.timePickerChange.bind(
											this,
											"end"
										)}
									/>
								</div>
							}
						/> */}
					</div>
					<div className="item-title">任务配置</div>
					<div className="task-item header">
						<div className="classify">任务类别</div>
						<div className="task-content">
							<div className="child">
								<div className="name">任务名称</div>
								<div className="auto">形象管理/自动</div>
								<div className="self">任务管理/手动</div>
								<div className="tasklimit">
									单个手机每日任务限制次数
								</div>
							</div>
						</div>
					</div>
					{infoArray &&
						infoArray.length > 0 &&
						infoArray.map((val: any, idx: number) => {
							return (
								<div className="task-item body" key={idx}>
									<div className="classify">
										{val && val.name}
									</div>
									<div className="task-content">
										{infoData &&
											infoData[val.type] &&
											infoData[val.type].children &&
											infoData[val.type].children.length >
												0 &&
											infoData[val.type].children.map(
												(v: any, i: number) => {
													return (
														<div
															className="child"
															key={i}
														>
															<div className="name">
																{v && v.name}
															</div>
															<div className="auto">
																<Checkbox
																	checked={
																		v.isauto
																	}
																	onChange={this.checkboxChange.bind(
																		this,
																		[
																			val.type
																		],
																		v.key,
																		i,
																		"isauto",
																		v
																	)}
																/>
															</div>
															<div className="self">
																<Checkbox
																	checked={
																		v.ismanual
																	}
																	onChange={this.checkboxChange.bind(
																		this,
																		[
																			val.type
																		],
																		v.key,
																		i,
																		"ismanual",
																		v
																	)}
																/>
															</div>
															<div className="tasklimit">
																<InputNumber
																	precision={
																		0
																	}
																	min={0}
																	value={
																		v &&
																		v.tasknum
																	}
																	onChange={this.taskNumChange.bind(
																		this,
																		[
																			val.type
																		],
																		v.key,
																		i,
																		"tasknum",
																		v
																	)}
																	onBlur={this.taskNumBlur.bind(
																		this,
																		[
																			val.type
																		],
																		v.key,
																		i,
																		"tasknum",
																		v
																	)}
																/>
															</div>
														</div>
													);
												}
											)}
									</div>
								</div>
							);
						})}
				</div>
			</div>
		);
	}
}
