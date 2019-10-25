import * as React from "react";
import { Input, Button, Modal, message, TimePicker } from "antd";
import InputBox from "@component/inputbox";
import SimpleTask from "../simple";
import { requestUrl } from "../../../../config";
import * as moment from "moment";
import "./index.less";

interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	workData?: any;
}
interface State {
	nickname: Type;
	touxiang: Type;
	profile: Type;
	pyq_bizhi: Type;
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
		if (type == "nickname" || type == "profile") {
			params.execute_hi = state[type].time
				? state[type].time.format("HHmm")
				: 0;
			params.sub_type = `User_${type}`;
			params[`User_${type}`] = {
				Name: state[type].name
			};
		} else if (type == "touxiang" || type == "pyq_bizhi") {
			params.execute_hi = state[type].time
				? state[type].time.format("HHmm")
				: 0;
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
			let res = await createUserTaskAction({
				taskobj: JSON.stringify(params)
			});
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
				[key]: e.target ? e.target.value : e
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
	render() {
		let { nickname, touxiang, profile, pyq_bizhi } = this.state;
		let { workData } = this.props;
		return (
			<div className="userinfocreate-task">
				{workData && workData.UpdateNickName && (
					<div className="group">
						<div className="group-title">
							<div className="text">修改昵称</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(this, "nickname")}
							>
								立即执行
							</Button>
						</div>
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
						</div>
					</div>
				)}
				{workData && workData.UpdateNote && (
					<div className="group">
						<div className="group-title">
							<div className="text">修改个性签名</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(this, "profile")}
							>
								立即执行
							</Button>
						</div>
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
						</div>
					</div>
				)}
				{workData && workData.UpdateTouXiang && (
					<div className="group">
						<div className="group-title">
							<div className="text">修改头像</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(this, "touxiang")}
							>
								立即执行
							</Button>
						</div>
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
						</div>
					</div>
				)}
				{workData && workData.UpdateBiZhi && (
					<div className="group">
						<div className="group-title">
							<div className="text">修改朋友圈壁纸</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(this, "pyq_bizhi")}
							>
								立即执行
							</Button>
						</div>
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
						</div>
					</div>
				)}
				{workData && workData.UpdateArea && (
					<SimpleTask
						labelName="修改地区"
						onOk={this.saveClick.bind(this)}
						type="User_myarea"
					/>
				)}
				{workData && workData.UpdateSex && (
					<SimpleTask
						labelName="修改性别"
						onOk={this.saveClick.bind(this)}
						type="User_sex"
					/>
				)}
				{workData && workData.UpdateAddress && (
					<SimpleTask
						labelName="修改我的地址"
						onOk={this.saveClick.bind(this)}
						type="User_myaddress"
					/>
				)}
				{workData && workData.AddFriendVerification && (
					<SimpleTask
						labelName="隐私-添加好友验证"
						onOk={this.saveClick.bind(this)}
						type="User_tianjiahaoyou_yanzheng"
					/>
				)}
				{workData && workData.MailListRecommendFriend && (
					<SimpleTask
						labelName="隐私-向我推荐通讯录朋友"
						onOk={this.saveClick.bind(this)}
						type="User_xiangwotuijian_txy_friend"
					/>
				)}
				{workData && workData.TenArticle && (
					<SimpleTask
						labelName="隐私-允许陌生人看十条朋友圈"
						onOk={this.saveClick.bind(this)}
						type="User_moshengren_10_tiao"
					/>
				)}
				{workData && workData.HalfYear && (
					<SimpleTask
						labelName="隐私-允许朋朋友产看朋友圈范围-最近半年"
						onOk={this.saveClick.bind(this)}
						type="User_pyq_half_year"
					/>
				)}
				{workData && workData.ThreeDay && (
					<SimpleTask
						labelName="隐私-允许朋朋友产看朋友圈范围-最近三天"
						onOk={this.saveClick.bind(this)}
						type="User_pyq_3_day"
					/>
				)}
				{workData && workData.PyqAll && (
					<SimpleTask
						labelName="隐私-允许朋朋友产看朋友圈范围-全部"
						onOk={this.saveClick.bind(this)}
						type="User_pyq_all"
					/>
				)}
				{workData && workData.PyqUpdateRemind && (
					<SimpleTask
						labelName="隐私-朋友圈更新提醒"
						onOk={this.saveClick.bind(this)}
						type="User_pyq_notice"
					/>
				)}
				{(!workData ||
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
				)}
			</div>
		);
	}
}
