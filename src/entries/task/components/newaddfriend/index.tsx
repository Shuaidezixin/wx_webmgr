import * as React from "react";
import {
	Input,
	Button,
	Radio,
	TimePicker,
	Select,
	message,
	Icon,
	Modal
} from "antd";
import InputBox from "@component/inputbox";
import * as moment from "moment";
import Toast from "@component/toast";
import "./index.less";
const Option = Select.Option;

const TextArea = Input.TextArea;
interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	workData?: any;
	targetType?: string | void;
	targetSubType?: string | void;
}
interface State {
	phoneType: PhoneType;
	appointList: any;
	randomPrefix: string;
	randomPhoneList: any;
	jiansuo_time: any;
	tongxunlu_time: any;
	qun_time: any;
	jiansuo_note: string;
	jiansuo_limit: number;
	tongxunlu_note: string;
	tongxunlu_limit: number;
	qun_note: string;
	qun_limit: string;
}
declare type PhoneType = "appoint" | "sql" | "random";
const randomPhonePrefix = [
	133,
	149,
	153,
	173,
	177,
	180,
	181,
	189,
	199,
	130,
	131,
	132,
	145,
	155,
	156,
	166,
	171,
	175,
	176,
	185,
	186,
	134,
	135,
	136,
	137,
	138,
	139,
	147,
	150,
	151,
	152,
	157,
	158,
	159,
	172,
	178,
	182,
	183,
	184,
	187,
	188,
	198,
	170
];

export default class AddFriend extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		phoneType: "random",
		randomPrefix: "",
		randomPhoneList: "",
		appointList: "",
		jiansuo_time: null,
		tongxunlu_time: null,
		qun_time: null,
		jiansuo_note: "",
		jiansuo_limit: 1,
		tongxunlu_note: "",
		tongxunlu_limit: 1,
		qun_note: "",
		qun_limit: ""
	};
	phoneTypeChange(e: any) {
		this.setState({
			phoneType: e.target.value
		});
	}
	randomPhone(lel?: number) {
		let { randomPrefix, randomPhoneList } = this.state;
		if (!randomPrefix || randomPrefix.length <= 0) {
			message.error("请选择号段范围");
			return;
		}
		let res: any = [];

		let randomNumber = randomPrefix + this.randomNum();
		if (!randomPhoneList || randomPhoneList.length <= 0) {
			res = [randomNumber];
		} else {
			if (randomPhoneList.indexOf(randomNumber) != -1) {
				let l: number;
				if (!lel || isNaN(lel)) {
					l = 0;
				} else {
					l = lel;
				}
				if (lel > 5) {
					message.error("生成的号码已经存在，请重试");
					return;
				}
				l = Number(l) + 1;
				this.randomPhone(l);
				return;
			} else {
				res = [...randomPhoneList, randomNumber];
			}
		}
		this.setState({
			randomPhoneList: res
		});
	}
	randomNum() {
		let numberArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
		let res: string = "";
		for (let i = 0; i < 8; i++) {
			let r = parseInt((Math.random() * 10).toString(), 10);
			res += numberArr[r];
		}
		return res;
	}
	timeChange(type: string, e: any) {
		let set: any = {
			[type]: e
		};
		this.setState({
			...set
		});
	}
	//提交任务
	async saveClick(type: string) {
		let {
			phoneType,
			randomPhoneList,
			appointList,
			jiansuo_time,
			tongxunlu_time,
			qun_time,
			jiansuo_note,
			jiansuo_limit,
			tongxunlu_note,
			tongxunlu_limit,
			qun_note,
			qun_limit
		} = this.state;
		let { selectedData, createUserTaskAction } = this.props;
		let params: any = {
			type: "AddFriend"
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
		if (type == "jiansuo") {
			params.sub_type = "AddFriend_jiansuo";
			let mobile: any = [];
			params.execute_hi = jiansuo_time
				? jiansuo_time.format("HHmm")
				: "0";
			if (phoneType == "random") {
				if (randomPhoneList.length <= 0) {
					message.error("电话号码不能为空");
					return;
				}
				mobile = randomPhoneList;
			}
			if (phoneType == "appoint") {
				let list = appointList.split("\n");
				mobile = list;
				if (mobile.length <= 0) {
					message.error("电话号码不能为空");
					return;
				}
			}
			if (!jiansuo_limit || jiansuo_limit <= 0) {
				message.error("上限次数不能为空或者小于0");
				return;
			}
			params.AddFriend_jiansuo = {
				AddFriendNote: jiansuo_note,
				AddFriendLimit: jiansuo_limit,
				MobileList: mobile
			};
		}
		if (type == "tongxunlu") {
			params.sub_type = "AddFriend_tongxunlu";
			params.execute_hi = tongxunlu_time
				? tongxunlu_time.format("HHmm")
				: "0";
			if (!tongxunlu_limit || tongxunlu_limit <= 0) {
				message.error("上限次数不能为空或者小于0");
				return;
			}
			params.AddFriend_tongxunlu = {
				AddFriendNote: tongxunlu_note,
				AddFriendLimit: tongxunlu_limit
			};
		}
		if (type == "qun") {
			params.sub_type = "AddFriend_qun";
			params.execute_hi = qun_time ? qun_time.format("HHmm") : "0";
			params.AddFriend_qun = {
				AddFriendNote: qun_note,
				AddFriendLimit: qun_limit
			};
		}
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
	deletePhone(idx: number) {
		let { randomPhoneList } = this.state;
		randomPhoneList.splice(idx, 1);
		this.setState({
			randomPhoneList: [...randomPhoneList]
		});
	}
	timeOpen(type: string, e: boolean) {
		if (e) {
			let set: any = {
				[type]: moment()
			};
			this.setState(set);
		}
	}
	render() {
		let {
			phoneType,
			randomPrefix,
			randomPhoneList,
			jiansuo_time,
			tongxunlu_time,
			qun_time,
			jiansuo_note,
			jiansuo_limit,
			tongxunlu_note,
			tongxunlu_limit,
			qun_note,
			qun_limit,
			appointList
		} = this.state;
		let { workData, targetType, targetSubType } = this.props;

		return (
			<div className="task-addfriend">
				{targetSubType && targetSubType == "AddFriend_jiansuo" && (
					<div className="group">
						{/* <div className="group-title">
							<div className="text">检索添加好友</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(this, "jiansuo")}
							>
								立即执行
							</Button>
						</div> */}
						<div className="group-content">
							<InputBox labelName="执行时间">
								<TimePicker
									className="w100"
									format="HH:mm"
									value={jiansuo_time}
									onChange={this.timeChange.bind(
										this,
										"jiansuo_time"
									)}
									onOpenChange={this.timeOpen.bind(
										this,
										"jiansuo_time"
									)}
								/>
							</InputBox>
							<InputBox labelName="号码来源" flexTop={true}>
								<div style={{ width: "100%" }}>
									<div>
										<Radio.Group
											value={phoneType}
											onChange={this.phoneTypeChange.bind(
												this
											)}
										>
											<Radio.Button value={"appoint"}>
												指定
											</Radio.Button>
											<Radio.Button value={"sql"}>
												号码数据库
											</Radio.Button>
											<Radio.Button value={"random"}>
												随机
											</Radio.Button>
										</Radio.Group>
									</div>
									{phoneType == "appoint" && (
										<div className="inner-item">
											{/* <Button type="primary" size="small">
											导入账号
										</Button> */}
											<TextArea
												style={{
													width: "100%",
													height: "300px",
													marginTop: "10px"
												}}
												placeholder="多个请使用回车分割"
												value={appointList}
												onChange={window.Util.InputChange.bind(
													this,
													"appointList"
												)}
											/>
										</div>
									)}
									{/* {phoneType == "sql" && (
									<div className="inner-item">22</div>
								)} */}
									{phoneType == "random" && (
										<div className="inner-item">
											<div className="random-item">
												<div className="random-text">
													号段
												</div>
												<Select
													style={{
														width: "150px",
														margin: "0 5px"
													}}
													value={randomPrefix}
													onChange={window.Util.InputChange.bind(
														this,
														"randomPrefix"
													)}
												>
													<Option value="">
														请选择号段
													</Option>
													{randomPhonePrefix &&
														randomPhonePrefix.length >
															0 &&
														randomPhonePrefix.map(
															(
																item: number,
																idx: number
															) => {
																return (
																	<Option
																		key={
																			idx
																		}
																		value={
																			item
																		}
																	>
																		{item}
																	</Option>
																);
															}
														)}
												</Select>
												<Button
													type="primary"
													onClick={this.randomPhone.bind(
														this
													)}
												>
													生成随机号
												</Button>
											</div>

											<div
												style={{
													width: "100%",
													height: "300px",
													marginTop: "10px",
													border: "1px solid #ccc",
													borderRadius: "4px",
													boxSizing: "border-box",
													overflow: "auto",
													padding: "0 10px"
												}}
											>
												{randomPhoneList &&
													randomPhoneList.length >
														0 &&
													randomPhoneList.map(
														(
															item: any,
															idx: number
														) => {
															return (
																<div
																	key={idx}
																	className="phone-item"
																>
																	<div className="txt">
																		{item}
																	</div>
																	<Icon
																		className="phone-delete"
																		type="delete"
																		onClick={this.deletePhone.bind(
																			this,
																			idx
																		)}
																	/>
																</div>
															);
														}
													)}
											</div>
										</div>
									)}
								</div>
							</InputBox>
							<InputBox
								labelName="验证文案"
								value={jiansuo_note}
								onChange={window.Util.InputChange.bind(
									this,
									"jiansuo_note"
								)}
							/>
							<InputBox
								labelName="单个账户添加上限次数"
								type="number"
								value={jiansuo_limit}
								isRequired={true}
								onChange={window.Util.InputChange.bind(
									this,
									"jiansuo_limit"
								)}
							/>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(
										this,
										"jiansuo"
									)}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}
				{targetSubType && targetSubType == "AddFriend_tongxunlu" && (
					<div className="group">
						{/* <div className="group-title">
							<div className="text">通讯录添加好友（随机）</div>
							<Button
								className="btn"
								type="primary"
								onClick={this.saveClick.bind(this, "tongxunlu")}
							>
								立即执行
							</Button>
						</div> */}
						<div className="group-content">
							<InputBox labelName="执行时间">
								<TimePicker
									className="w100"
									format="HH:mm"
									value={tongxunlu_time}
									onChange={this.timeChange.bind(
										this,
										"tongxunlu_time"
									)}
									onOpenChange={this.timeOpen.bind(
										this,
										"tongxunlu_time"
									)}
								/>
							</InputBox>
							<InputBox
								labelName="验证文案"
								value={tongxunlu_note}
								onChange={window.Util.InputChange.bind(
									this,
									"tongxunlu_note"
								)}
							/>
							<InputBox
								labelName="单个账户添加上限次数"
								type="number"
								value={tongxunlu_limit}
								isRequired={true}
								onChange={window.Util.InputChange.bind(
									this,
									"tongxunlu_limit"
								)}
							/>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(
										this,
										"tongxunlu"
									)}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}

				{targetSubType && targetSubType == "AddFriend_qun" && (
					<div className="group">
						{/* <div className="group-title">
							<div className="text">群添加好友（随机）</div>
							<Button
								className="btn"
								type="primary"
								onClick={this.saveClick.bind(this, "qun")}
							>
								立即执行
							</Button>
						</div> */}
						<div className="group-content">
							<InputBox labelName="执行时间">
								<TimePicker
									className="w100"
									format="HH:mm"
									value={qun_time}
									onChange={this.timeChange.bind(
										this,
										"qun_time"
									)}
									onOpenChange={this.timeOpen.bind(
										this,
										"qun_time"
									)}
								/>
							</InputBox>
							<InputBox
								labelName="验证文案"
								value={qun_note}
								onChange={window.Util.InputChange.bind(
									this,
									"qun_note"
								)}
							/>
							<InputBox
								labelName="单个账户添加上限次数"
								type="number"
								value={qun_limit}
								onChange={window.Util.InputChange.bind(
									this,
									"qun_limit"
								)}
							/>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(this, "qun")}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}
			</div>
		);
	}
}
