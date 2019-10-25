import * as React from "react";
import { Icon, Modal, message } from "antd";
import InputBox from "@component/inputbox";
import "./index.less";
import defaultPic from "@img/default.jpg";
import { requestUrl } from "../../../config/";
interface Props {
	getUserInfoAction?: Function;
	updateUserInfoAction?: Function;
	userinfo?: any;
}
interface State {
	isShowPassword: boolean;
	oldPassword: string;
	newPassword: string;
	newPassword1: string;
	touxiang: string;
	phone: string;
	username: string;
	id: string;
	isShowPhone: boolean;
	newPhone: string;
	nickname: string;
	system_admin_user_department_name: string;
	isLoaded: boolean;
}

export default class Root extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		isShowPassword: false,
		isShowPhone: false,
		oldPassword: "",
		newPassword: "",
		newPassword1: "",
		touxiang: "",
		phone: "",
		username: "",
		id: "",
		newPhone: "",
		nickname: "",
		system_admin_user_department_name: "",
		isLoaded: false
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "用户信息");
		window.Util.forbidAutoComplete();
		this.initData();
	}
	async initData() {
		let res = await this.props.getUserInfoAction();
		if (res && res.code == 200) {
			this.setState({
				isLoaded: true
			});
			let data = res.data;
			let set: any = {
				touxiang: data.touxiang,
				phone: data.phone,
				username: data.username,
				nickname: data.nickname,
				system_admin_user_department_name:
					data.system_admin_user_department_name,
				id: data._id
			};
			this.setState(set);
		}
	}
	openPassword() {
		this.setState({
			isShowPassword: true
		});
	}
	closePassword() {
		this.setState({
			isShowPassword: false,
			oldPassword: "",
			newPassword: "",
			newPassword1: ""
		});
	}
	openPhone() {
		this.setState({
			isShowPhone: true
		});
	}
	closePhone() {
		this.setState({
			isShowPhone: false,
			newPhone: ""
		});
	}
	async uploadImgChange(e: any) {
		if (!e || !e[0] || e[0].length <= 0) {
			return;
		}
		let { id } = this.state;
		if (!id || id.length <= 0) {
			return;
		}
		let value = e[0].url;
		this.setState({
			touxiang: value
		});
		let res = await this.props.updateUserInfoAction({
			touxiang: value,
			adminuser_id: id
		});
		if (res && res.code == 200) {
			message.success("头像上传成功");
			let user = window.localStorage.getItem("user");
			if (user) {
				let u = JSON.parse(window.Util.decryptPass(user));
				u.touxiang = value;
				window.localStorage.setItem(
					"user",
					window.Util.encryptPass(JSON.stringify(u))
				);
				let leftUserImg = document.querySelector(
					"#userImg"
				) as HTMLImageElement;
				if (leftUserImg) {
					leftUserImg.src = value;
				}
			}
		}
	}
	uploadImg() {
		let box = document.querySelectorAll(
			".ant-upload-select-picture-card"
		)[0] as HTMLElement;
		let span = box.children[0] as HTMLElement;
		let input = span.children[0] as HTMLElement;
		input.click();
	}
	async changePassword() {
		let { oldPassword, newPassword, newPassword1, id } = this.state;
		if (!id || id.length <= 0) {
			return;
		}
		if (!oldPassword || oldPassword.trim().length <= 0) {
			message.error("旧密码不能为空");
			return;
		}
		if (!newPassword || newPassword.trim().length <= 0) {
			message.error("新密码不能为空");
			return;
		}
		if (!newPassword1 || newPassword1.trim().length <= 0) {
			message.error("确认密码不能为空");
			return;
		}
		if (newPassword != newPassword1) {
			message.error("两次输入密码不一致");
			return;
		}
		let res = await this.props.updateUserInfoAction({
			adminuser_id: id,
			oldpassword: window.Util.toPassword(oldPassword),
			password: window.Util.toPassword(newPassword)
		});
		if (res && res.code == 200) {
			message.success("密码修改成功");
			this.closePassword();
		}
	}
	async changePhoneClick() {
		let { newPhone, id } = this.state;
		if (!id || id.length <= 0) {
			return;
		}
		if (newPhone.trim().length != 11) {
			message.error("手机号码长度");
			return;
		}
		let res = await this.props.updateUserInfoAction({
			adminuser_id: id,
			phone: newPhone.trim()
		});
		if (res && res.code == 200) {
			message.success("手机号码修改成功");
			this.setState({
				phone: newPhone
			});
			this.closePhone();
		}
	}
	render() {
		let { userinfo } = this.props;
		let {
			isShowPassword,
			isShowPhone,
			oldPassword,
			newPassword,
			newPassword1,
			touxiang,
			newPhone,
			nickname,
			username,
			phone,
			system_admin_user_department_name,
			isLoaded
		} = this.state;
		if (!isLoaded) {
			return <div className="nodatabox">正在加载...</div>;
		}
		return (
			<div className="userinfo-page">
				<div className="userinfo-container">
					<div className="user-header">
						<img
							src={
								touxiang && touxiang.length > 0
									? touxiang
									: defaultPic
							}
							className="user-img"
						/>
						<div
							className="user-img-cover"
							onClick={this.uploadImg.bind(this)}
						>
							点击上传
						</div>
						<div className="name">{nickname}</div>
					</div>
					<div className="info-box">
						<div className="info-item">
							<div className="name">账户</div>
							<div className="cont">{username}</div>
						</div>
						<div className="info-item">
							<div className="name">密码</div>
							<div className="cont">******</div>
							<Icon
								type="edit"
								className="icon"
								onClick={this.openPassword.bind(this)}
							/>
						</div>
						<div className="info-item">
							<div className="name">部门</div>
							<div className="cont">
								{system_admin_user_department_name}
							</div>
						</div>
						<div className="info-item">
							<div className="name">电话</div>
							<div className="cont">{phone}</div>
							<Icon
								type="edit"
								className="icon"
								onClick={this.openPhone.bind(this)}
							/>
						</div>
					</div>
				</div>
				<div style={{ display: "none" }}>
					<InputBox
						type="uploader-img"
						length={1}
						customRequest={true}
						domain={requestUrl() + "/upload"}
						onChange={this.uploadImgChange.bind(this)}
						limitType={["jpg", "png", "jpeg"]}
					/>
				</div>
				<Modal
					visible={isShowPassword}
					title="修改密码"
					onCancel={this.closePassword.bind(this)}
					onOk={this.changePassword.bind(this)}
				>
					<InputBox
						labelName="旧密码"
						type="password"
						autoWidth={true}
						value={oldPassword}
						onChange={window.Util.InputChange.bind(
							this,
							"oldPassword"
						)}
					/>
					<InputBox
						labelName="新密码"
						type="password"
						autoWidth={true}
						value={newPassword}
						onChange={window.Util.InputChange.bind(
							this,
							"newPassword"
						)}
					/>
					<InputBox
						labelName="确认新密码"
						type="password"
						autoWidth={true}
						value={newPassword1}
						onChange={window.Util.InputChange.bind(
							this,
							"newPassword1"
						)}
					/>
				</Modal>
				<Modal
					visible={isShowPhone}
					title="修改电话"
					onCancel={this.closePhone.bind(this)}
					onOk={this.changePhoneClick.bind(this)}
				>
					<InputBox
						labelName="手机号码"
						type="tel"
						autoWidth={true}
						value={newPhone}
						onChange={window.Util.InputChange.bind(
							this,
							"newPhone"
						)}
					/>
				</Modal>
			</div>
		);
	}
}
