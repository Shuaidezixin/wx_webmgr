import * as React from "react";
import { Input, Icon, Button, message, Checkbox } from "antd";
import bgimg from "@img/login.jpg";
import "./index.less";
interface Props {
	loginAction?: Function;
}
interface State {
	username: string;
	password: string;
	islogin: boolean;
	isRemember: boolean;
	admin_website: string;
}
export default class Root extends React.PureComponent<Props, State> {
	readonly state: State = {
		username: "",
		password: "",
		islogin: false,
		isRemember: false,
		admin_website: ""
	};
	static readonly defaultProp: Props = {};
	constructor(props: any) {
		super(props);
		this.keypressLogin = this.keypressLogin.bind(this);
	}
	public componentDidMount() {
		window.Util.forbidAutoComplete();
		document.title = window.pageTitle.replace("{title}", "登录");
		let loginInfo = window.localStorage.getItem("loginInfo");
		if (loginInfo) {
			let d = JSON.parse(window.Util.aesDeParams(loginInfo));
			this.setState({
				...d,
				isRemember: true
			});
		}
		document.addEventListener("keypress", this.keypressLogin, false);
	}
	public componentWillUnmount() {
		document.removeEventListener("keypress", this.keypressLogin, false);
	}
	// 监听Enter键
	keypressLogin(e: any) {
		if (window.appHistory.location.pathname != "/login") {
			return;
		}
		if (e.keyCode == 13) {
			this.loginClick();
		}
	}
	// 登录
	async loginClick() {
		if (document.querySelectorAll(".ajax-modal").length > 0) {
			return;
		}
		let {
			username,
			password,
			islogin,
			isRemember,
			admin_website
		} = this.state;
		if (islogin) {
			return;
		}
		if (!admin_website || admin_website.trim().length <= 0) {
			message.error("站点不能为空");
			return;
		}
		if (!username || username.trim().length <= 0) {
			message.error("用户名不能为空");
			return;
		}
		if (!password || password.trim().length <= 0) {
			message.error("密码不能为空");
			return;
		}

		// let r1 = "jh4bb4234n_j4";
		// let r2 = "35hjkcd_jk4bnvkln_k53";
		// let m1 = window.CryptoJS.MD5(password).toString();
		// let m2 = window.CryptoJS.MD5(m1 + r1).toString();
		// let m3 = window.CryptoJS.MD5(m2 + r2).toString();

		// 是否记住密码
		if (isRemember) {
			window.localStorage.setItem(
				"loginInfo",
				window.Util.aesEnParams(
					JSON.stringify({
						admin_website,
						username,
						password
					})
				)
			);
		} else {
			window.localStorage.removeItem("loginInfo");
		}
		let params: any = {
			admin_website,
			username,
			password: window.Util.toPassword(password)
		};

		this.setState({
			islogin: true
		});
		try {
			let res = await this.props.loginAction(params);

			if (res && res.code == 200) {
				document.removeEventListener(
					"keypress",
					this.keypressLogin,
					false
				);
				message.success("登录成功");
				window.localStorage.setItem("token", res.data.token);
				window.localStorage.setItem(
					"systemversion",
					res.data.systemversion
				);
				window.localStorage.setItem(
					"systemversiondesc",
					res.data.systemversiondesc
				);
				window.localStorage.setItem(
					"user",
					window.Util.encryptPass(JSON.stringify(res.data.user))
				);
				let data = res.data;
				let actions = data.actions;
				if (!actions) {
					message.error("此账号无权限登录");
					return;
				}
				window.localStorage.setItem(
					"actions",
					window.Util.encryptPass(JSON.stringify(actions))
				);
				if (window.appHistory.location.search) {
					let q = window.Util.getQuery(window.location.href);
					if (q && q.from) {
						let info = JSON.parse(window.Util.decryptPass(q.from));
						setTimeout(() => {
							window.appHistory.push({
								pathname:
									info.pathname == "/404"
										? "/"
										: info.pathname.indexOf("http") == -1
										? info.pathname
										: info.pathname.split("#")[1],
								search: info.search
							});
						}, 10);
					} else {
						setTimeout(() => {
							window.appHistory.push({
								pathname: "/"
							});
						}, 10);
					}
				} else {
					setTimeout(() => {
						window.appHistory.push({
							pathname: "/"
						});
					}, 10);
				}
			}
		} finally {
			this.setState({
				islogin: false
			});
		}
	}
	public render() {
		let {
			username,
			password,
			islogin,
			isRemember,
			admin_website
		} = this.state;
		//"https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture"  随机图片
		return (
			<div className="login-page">
				<div className="login-bg">
					<img src={bgimg} />
				</div>
				<div className="login-box">
					<div className="login-title">群控系统</div>
					<div className="login-input">
						<Input
							prefix={<Icon type="codepen" />}
							placeholder="请输入站点"
							size="large"
							className="input"
							value={admin_website}
							onChange={window.Util.InputChange.bind(
								this,
								"admin_website"
							)}
						/>
					</div>
					<div className="login-input">
						<Input
							prefix={<Icon type="user" />}
							placeholder="请输入用户名"
							size="large"
							className="input"
							value={username}
							onChange={window.Util.InputChange.bind(
								this,
								"username"
							)}
						/>
					</div>
					<div className="login-input">
						<Input
							prefix={<Icon type="lock" />}
							placeholder="请输入密码"
							type="password"
							size="large"
							className="input"
							value={password}
							onChange={window.Util.InputChange.bind(
								this,
								"password"
							)}
						/>
					</div>
					<div className="login-btnbox">
						<Button
							className="login-btn"
							type={"primary"}
							disabled={islogin}
							size="large"
							onClick={this.loginClick.bind(this)}
						>
							登录
						</Button>
					</div>
					<div className="login-footer">
						<Checkbox
							checked={isRemember}
							onChange={window.Util.InputChange.bind(
								this,
								"isRemember"
							)}
						>
							记住密码
						</Checkbox>
						{/* <div className="version">V0.6.3</div> */}
					</div>
				</div>
			</div>
		);
	}
}
