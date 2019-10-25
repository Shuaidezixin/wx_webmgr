import * as React from "react";
import { Input, Button, Modal, message, TimePicker } from "antd";
import InputBox from "@component/inputbox";
import SimpleTask from "../newsimple";
import { requestUrl } from "../../../../config";
import * as moment from "moment";
import Toast from "@component/toast";
import "./index.less";

interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	workData?: any;
	targetType?: string | void;
	targetSubType?: string | void;
}
interface State {
	nickname: Type;
	touxiang: Type;
	profile: Type;
	pyq_bizhi: Type;
	password_update: Type;
	username: Type;
	sex: Type;
}
interface Type {
	time: any;
	name: any;
}

export default class UserInfoTask extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		nickname: {
			time: null,
			name: ""
		},
		touxiang: {
			time: null,
			name: ""
		},
		profile: {
			time: null,
			name: ""
		},
		pyq_bizhi: {
			time: null,
			name: ""
		},
		password_update: {
			time: null,
			name: ""
		},
		username: {
			time: null,
			name: "_"
		},
		sex: {
			time: null,
			name: "1"
		}
	};
	async saveClick(type: string, time?: string) {
		let { selectedData, createUserTaskAction } = this.props;
		let state: any = this.state;
		let params: any = {
			type: "User"
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
		if (type == "password_update") {
			let name = state["password_update"].name.trim();
			if (name.length < 8 || name.length > 16) {
				message.error("密码不能为空且长度是8-16位");
				return;
			}
			let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$/gi;
			if (!reg.test(name)) {
				message.error("密码只能是字母和数字");
				return;
			}
		}
		if (type == "username") {
			let reg = /^[0-9a-zA-Z]{1,}$/;
			let username = state[type].name.split("_");
			if (username[0].length > 0 && !reg.test(username[0])) {
				message.error("微信前缀只能是数字英文");
				return;
			}
			if (username[1].length > 0 && !reg.test(username[1])) {
				message.error("微信后缀只能是数字英文");
				return;
			}
			if (username[0].length == 0 && username[1].length == 0) {
				message.error("微信前后缀不能同时为空");
				return;
			}

			if (username[0].length + username[1].length > 9) {
				message.error("微信前后缀字符长度总和不能大于9");
				return;
			}
		}

		if (
			type == "nickname" ||
			type == "profile" ||
			type == "password_update" ||
			type == "username" ||
			type == "sex"
		) {
			params.execute_hi = state[type].time
				? state[type].time.format("HHmm")
				: "0";
			params.sub_type = `User_${type}`;
			params[`User_${type}`] = {
				Name: state[type].name
			};
		} else if (type == "touxiang" || type == "pyq_bizhi") {
			params.execute_hi = state[type].time
				? state[type].time.format("HHmm")
				: "0";
			params.sub_type = `User_${type}`;
			params[`User_${type}`] = {
				Name:
					state[type].name && state[type].name[0]
						? state[type].name[0].url
						: 0
			};
		} else {
			params.sub_type = type;
			params.execute_hi = time;
			params[type] = {
				Name: ""
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
	InputChange(type: string, key: string, e: any) {
		let state: any = this.state;
		let set: any = {
			[type]: {
				...state[type],
				[key]: e && e.target ? e.target.value : e
			}
		};
		this.setState({ ...set });
	}
	uploadImg(type: string, e: any) {
		let state: any = this.state;
		let set: any = {
			[type]: {
				...state[type],
				name: [
					{
						url: e[0].url
					}
				]
			}
		};

		this.setState({
			...set
		});
	}
	deleteImg(type: string) {
		let state: any = this.state;
		let set: any = {
			[type]: {
				...state[type],
				name: null
			}
		};
		this.setState({
			...set
		});
	}
	timeOpen(type: string, e: boolean) {
		if (e) {
			let state: any = this.state;
			let set: any = {
				[type]: {
					...state[type],
					time: moment()
				}
			};
			this.setState(set);
		}
	}
	usernameChange(type: string, e: any) {
		let { username } = this.state;
		let reg = /([0-9a-zA-Z]{1,})/gi;
		let value = e.match(reg).join("");
		let arr = username.name.split("_");
		if (type == "start") {
			arr[0] = value;
		}
		if (type == "end") {
			arr[1] = value;
		}
		this.setState({
			username: {
				...username,
				name: arr.join("_")
			}
		});
	}
	render() {
		let {
			nickname,
			touxiang,
			profile,
			pyq_bizhi,
			password_update,
			username,
			sex
		} = this.state;
		let { workData, targetType, targetSubType } = this.props;
		return (
			<div className="userinfocreate-task">
				{targetSubType && targetSubType == "User_nickname" && (
					<div className="group">
						{/* <div className="group-title">
							<div className="text">修改昵称</div>
							<Button
								className="btn"
								type="primary"
								onClick={this.saveClick.bind(this, "nickname")}
							>
								立即执行
							</Button>
						</div> */}
						<div className="group-content">
							<InputBox labelName="执行时间" flexTop={true}>
								<div className="w100">
									<TimePicker
										className="w100"
										format="HH:mm"
										value={nickname && nickname.time}
										onChange={this.InputChange.bind(
											this,
											"nickname",
											"time"
										)}
										onOpenChange={this.timeOpen.bind(
											this,
											"nickname"
										)}
									/>
									<div className="inner-item">
										<Input
											placeholder="请输入昵称"
											value={nickname && nickname.name}
											onChange={this.InputChange.bind(
												this,
												"nickname",
												"name"
											)}
										/>
									</div>
								</div>
							</InputBox>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(
										this,
										"nickname"
									)}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}
				{targetSubType && targetSubType == "User_password_update" && (
					<div className="group">
						<div className="group-content">
							<InputBox labelName="执行时间" flexTop={true}>
								<div className="w100">
									<TimePicker
										className="w100"
										format="HH:mm"
										value={
											password_update &&
											password_update.time
										}
										onChange={this.InputChange.bind(
											this,
											"password_update",
											"time"
										)}
										onOpenChange={this.timeOpen.bind(
											this,
											"password_update"
										)}
									/>
									<div className="inner-item">
										<Input
											placeholder="请输入新密码"
											value={
												password_update &&
												password_update.name
											}
											onChange={this.InputChange.bind(
												this,
												"password_update",
												"name"
											)}
										/>
									</div>
								</div>
							</InputBox>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(
										this,
										"password_update"
									)}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}
				{targetSubType && targetSubType == "User_profile" && (
					<div className="group">
						{/* <div className="group-title">
							<div className="text">修改个性签名</div>
							<Button
								className="btn"
								
								type="primary"
								onClick={this.saveClick.bind(this, "profile")}
							>
								立即执行
							</Button>
						</div> */}
						<div className="group-content">
							<InputBox labelName="执行时间" flexTop={true}>
								<div className="w100">
									<TimePicker
										className="w100"
										format="HH:mm"
										value={profile && profile.time}
										onChange={this.InputChange.bind(
											this,
											"profile",
											"time"
										)}
										onOpenChange={this.timeOpen.bind(
											this,
											"profile"
										)}
									/>
									<div className="inner-item">
										<Input
											placeholder="请输入个性签名"
											value={profile && profile.name}
											onChange={this.InputChange.bind(
												this,
												"profile",
												"name"
											)}
										/>
									</div>
								</div>
							</InputBox>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(
										this,
										"profile"
									)}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}
				{targetSubType && targetSubType == "User_touxiang" && (
					<div className="group">
						{/* <div className="group-title">
							<div className="text">修改头像</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(this, "touxiang")}
							>
								立即执行
							</Button>
						</div> */}
						<div className="group-content">
							<InputBox labelName="执行时间" flexTop={true}>
								<div className="w100">
									<TimePicker
										className="w100"
										format="HH:mm"
										value={touxiang && touxiang.time}
										onChange={this.InputChange.bind(
											this,
											"touxiang",
											"time"
										)}
										onOpenChange={this.timeOpen.bind(
											this,
											"touxiang"
										)}
									/>
								</div>
							</InputBox>
							<InputBox
								type="uploader-img"
								className="inner"
								desc="不上传图片则随机选择图片"
								domain={requestUrl() + "/upload"}
								length={1}
								limitType={["jpg", "jpeg"]}
								multiple={true}
								customRequest={true}
								onChange={this.uploadImg.bind(this, "touxiang")}
								value={touxiang && touxiang.name}
								deleteUplodaValue={this.deleteImg.bind(
									this,
									"touxiang"
								)}
							/>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(
										this,
										"touxiang"
									)}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}
				{targetSubType && targetSubType == "User_pyq_bizhi" && (
					<div className="group">
						{/* <div className="group-title">
							<div className="text">修改朋友圈壁纸</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(this, "pyq_bizhi")}
							>
								立即执行
							</Button>
						</div> */}
						<div className="group-content">
							<InputBox labelName="执行时间" flexTop={true}>
								<div className="w100">
									<TimePicker
										className="w100"
										format="HH:mm"
										value={pyq_bizhi && pyq_bizhi.time}
										onChange={this.InputChange.bind(
											this,
											"pyq_bizhi",
											"time"
										)}
										onOpenChange={this.timeOpen.bind(
											this,
											"pyq_bizhi"
										)}
									/>
								</div>
							</InputBox>

							<InputBox
								type="uploader-img"
								className="inner"
								desc="不上传图片则随机选择图片"
								domain={requestUrl() + "/upload"}
								length={1}
								customRequest={true}
								limitType={["jpg", "jpeg"]}
								onChange={this.uploadImg.bind(
									this,
									"pyq_bizhi"
								)}
								value={pyq_bizhi && pyq_bizhi.name}
								deleteUplodaValue={this.deleteImg.bind(
									this,
									"pyq_bizhi"
								)}
							/>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(
										this,
										"pyq_bizhi"
									)}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}

				{targetSubType && targetSubType == "User_username" && (
					<div className="group">
						<InputBox labelName="执行时间" flexTop={true}>
							<div className="w100">
								<TimePicker
									className="w100"
									format="HH:mm"
									value={username && username.time}
									onChange={this.InputChange.bind(
										this,
										"username",
										"time"
									)}
									onOpenChange={this.timeOpen.bind(
										this,
										"username"
									)}
								/>
							</div>
						</InputBox>
						<InputBox
							labelName="微信前缀"
							value={
								username &&
								username.name &&
								username.name.split("_")[0]
							}
							onChange={this.usernameChange.bind(this, "start")}
						/>
						<InputBox
							labelName="微信后缀"
							value={
								username &&
								username.name &&
								username.name.split("_")[1]
							}
							onChange={this.usernameChange.bind(this, "end")}
						/>
						<InputBox>
							<Button
								className="btn"
								type="primary"
								onClick={this.saveClick.bind(this, "username")}
							>
								立即执行
							</Button>
						</InputBox>
					</div>
				)}
				{targetSubType && targetSubType == "User_sex" && (
					// <SimpleTask
					// 	labelName="修改性别"
					// 	onOk={this.saveClick.bind(this)}
					// 	type="User_sex"
					// />
					<div className="group">
						<InputBox labelName="执行时间" flexTop={true}>
							<div className="w100">
								<TimePicker
									className="w100"
									format="HH:mm"
									value={sex && sex.time}
									onChange={this.InputChange.bind(
										this,
										"sex",
										"time"
									)}
									onOpenChange={this.timeOpen.bind(
										this,
										"sex"
									)}
								/>
							</div>
						</InputBox>
						<InputBox
							labelName="性别"
							type="select"
							optionArr={[
								{ label: "男", key: "1" },
								{ label: "女", key: "2" }
							]}
							value={sex && sex.name}
							onChange={this.InputChange.bind(
								this,
								"sex",
								"name"
							)}
						/>
						<InputBox>
							<Button
								className="btn"
								type="primary"
								onClick={this.saveClick.bind(this, "sex")}
							>
								立即执行
							</Button>
						</InputBox>
					</div>
				)}
				{/* {targetSubType && targetSubType == "User_sex" && (
					<SimpleTask
						labelName="修改性别"
						onOk={this.saveClick.bind(this)}
						type="User_sex"
					/>
				)} */}

				{targetSubType && targetSubType == "User_yaoyiyao_close" && (
					<SimpleTask
						labelName="开/关摇一摇"
						onOk={this.saveClick.bind(this)}
						type="User_yaoyiyao_close"
					/>
				)}
				{targetSubType && targetSubType == "User_fujinren_close" && (
					<SimpleTask
						labelName="开/关附近的人"
						onOk={this.saveClick.bind(this)}
						type="User_fujinren_close"
					/>
				)}
				{targetSubType && targetSubType == "User_myarea" && (
					<SimpleTask
						labelName="修改地区"
						onOk={this.saveClick.bind(this)}
						type="User_myarea"
					/>
				)}

				{targetSubType && targetSubType == "User_myaddress" && (
					<SimpleTask
						labelName="修改我的地址"
						onOk={this.saveClick.bind(this)}
						type="User_myaddress"
					/>
				)}
				{targetSubType &&
					targetSubType == "User_tianjiahaoyou_yanzheng" && (
						<SimpleTask
							labelName="隐私-添加好友验证"
							onOk={this.saveClick.bind(this)}
							type="User_tianjiahaoyou_yanzheng"
						/>
					)}
				{targetSubType &&
					targetSubType == "User_xiangwotuijian_txy_friend" && (
						<SimpleTask
							labelName="隐私-向我推荐通讯录朋友"
							onOk={this.saveClick.bind(this)}
							type="User_xiangwotuijian_txy_friend"
						/>
					)}
				{targetSubType &&
					targetSubType == "User_moshengren_10_tiao" && (
						<SimpleTask
							labelName="隐私-允许陌生人看十条朋友圈"
							onOk={this.saveClick.bind(this)}
							type="User_moshengren_10_tiao"
						/>
					)}
				{targetSubType && targetSubType == "User_pyq_half_year" && (
					<SimpleTask
						labelName="隐私-允许朋朋友产看朋友圈范围-最近半年"
						onOk={this.saveClick.bind(this)}
						type="User_pyq_half_year"
					/>
				)}
				{targetSubType && targetSubType == "User_pyq_3_day" && (
					<SimpleTask
						labelName="隐私-允许朋朋友产看朋友圈范围-最近三天"
						onOk={this.saveClick.bind(this)}
						type="User_pyq_3_day"
					/>
				)}
				{targetSubType && targetSubType == "User_pyq_all" && (
					<SimpleTask
						labelName="隐私-允许朋朋友产看朋友圈范围-全部"
						onOk={this.saveClick.bind(this)}
						type="User_pyq_all"
					/>
				)}
				{targetSubType && targetSubType == "User_pyq_notice" && (
					<SimpleTask
						labelName="隐私-朋友圈更新提醒"
						onOk={this.saveClick.bind(this)}
						type="User_pyq_notice"
					/>
				)}
				{/* {(!workData ||
					(!workData.UpdateNickName &&
						!workData.UpdateNote &&
						!workData.UpdateTouXiang &&
						!workData.UpdateBiZhi &&
						!workData.UpdateArea &&
						!workData.UpdateSex &&
						!workData.UpdateAddress &&
						!workData.AddFriendVerification &&
						!workData.MailListRecommendFriend &&
						!workData.TenArticle &&
						!workData.HalfYear &&
						!workData.ThreeDay &&
						!workData.PyqAll &&
						!workData.PyqUpdateRemind)) && (
					<div className="nodatabox">系统设置不允许手动任务</div>
				)} */}
			</div>
		);
	}
}
