import * as React from "react";
import { Icon, Button } from "antd";
import PhoneScreen from "@component/phonescreen";
import * as classnames from "classnames";
import WebSocket from "../../../../utils/websocketscreen";
import "./index.less";

interface Props {
	onFull?: Function;
	isFocus?: boolean;
	onClick?: Function;
	onHome?: Function;
	onReturn?: Function;
	onProcess?: Function;
	phoneData?: any;
	updateImg?: Function;
	isFull?: boolean;
	initData?: any;
	updateInit?: Function;
	onWechatLogin?: Function;
	onInitEnd?: Function;
	onClose?: Function;
	onError?: Function;
}
interface State {
	img: any[];
	height: number;
	width: number;
	initStepArray: any[];
	initData: any[];
	initStep: number;
	isShowInput: boolean;
	isInit: boolean;
}

export default class PhoneBox extends React.PureComponent<Props, State> {
	private box: React.RefObject<HTMLDivElement>;
	private ws: WebSocket;
	constructor(props: Props) {
		super(props);
		this.box = React.createRef();
	}
	static readonly defaultProps: Props = {
		isFocus: true
	};
	readonly state: State = {
		img: [],
		height: 0,
		width: 0,
		initStepArray: [],
		initData: [],
		initStep: 0,
		isShowInput: false,
		isInit: false
	};
	static getDerivedStateFromProps(nextProps: any, currentState: any): any {
		if (
			nextProps.initData &&
			nextProps.initData.initmobilesetting &&
			currentState.initStepArray.length <= 0
		) {
			let res: any[] = [];
			let newArr: any[] = nextProps.initData.initmobilesetting.filter(
				(v: any, i: number) => {
					if (v.type != "BackStageAutotask") {
						res.push(v.key);
						v.status = -2;
						if (i == 0) {
							v.status = -1;
						}
						return v;
					}
				}
			);
			return {
				initData: [...newArr],
				initStepArray: [...res]
			};
		}
		return null;
	}
	componentDidMount() {
		this.initHeight();
		window.addEventListener(
			"beforeunload",
			this.closeSocket.bind(this),
			false
		);
	}
	componentWillUnmount() {
		this.closeSocket();
	}
	closeSocket() {
		if (this.ws) {
			this.ws.send("close");
			setTimeout(() => {
				this.ws.close();
			}, 0);
		}
	}
	initSocket() {
		let { onError } = this.props;
		this.ws = new WebSocket(this.props.phoneData.wsurl);
		let { updateImg } = this.props;
		this.ws.onOpen(() => {
			//this.ws.send(`${this.state.width}x${this.state.height}`);
		});
		this.ws.onError(() => {
			if (onError && typeof onError === "function") {
				onError();
			}
		});
		this.ws.onMessage((data: any) => {
			if (typeof data === "string") {
				let arr = data.split(" ");
				if (arr[0] == "init") {
					this.initStep(data);
				}
				if (arr[0] == "close") {
					if (onError && typeof onError === "function") {
						onError();
					}
				}
			} else {
				let { img } = this.state;
				img.push([data]);
				if (img.length > 20) {
					img.shift();
				}
				if (
					updateImg &&
					typeof updateImg === "function" &&
					this.props.isFull
				) {
					updateImg(img);
				}
				this.setState({
					img: [...img]
				});
				// let blob = null;
				// blob = new Blob([data], { type: "image/jpeg" });
				// let reader: any = null;
				// reader = new FileReader();
				// reader.readAsDataURL(blob);
				// // let URL = window.URL || window.webkitURL;
				// // let url = URL.createObjectURL(blob);
				// reader.onload = function(e: any) {
				// 	let url = e.target.result;
				// 	if (
				// 		updateImg &&
				// 		typeof updateImg === "function" &&
				// 		this.props.isFull
				// 	) {
				// 		updateImg(url);
				// 	}
				// 	//this.refs.phonescreen.drawImg(url);
				// 	this.setState({
				// 		img: url
				// 	});
				// 	blob = null;
				// 	reader = null;
				// }.bind(this);
			}
		});
	}
	initStep(data: string) {
		let { updateInit, onInitEnd, phoneData } = this.props;
		let { initStepArray, initData } = this.state;
		if (updateInit && typeof updateInit === "function") {
			updateInit(data);
		}
		let arr = data.split(" ");
		let key = arr[1];
		let idx = initStepArray.indexOf(key);
		let newInitData = JSON.parse(JSON.stringify(initData));
		newInitData[idx].status = arr[2];
		if (arr[2] == "1" && idx < newInitData.length) {
			if (newInitData[idx + 1]) {
				idx++;
				newInitData[idx].status = -1;
			}
		}
		if (key == "StartPluginMain") {
			this.setState({
				isShowInput: true
			});
		}
		if (key == "AutoLogin") {
			onInitEnd(phoneData.id);
			this.setState({
				isInit: false
			});
			newInitData.map((v: any, i: number) => {
				v.status = -2;
				if (i == 0) {
					v.status = -1;
				}
			});
		}

		this.setState({
			initStep: idx,
			initStepArray: [...initStepArray],
			initData: [...newInitData]
		});
	}
	public openInit() {
		this.setState({
			isInit: true
		});
	}
	initHeight() {
		let p = 1280 / 720;
		let box: Element = this.box.current;
		let w = box.clientWidth;
		this.setState(
			{
				height: w * p,
				width: w
			},
			this.initSocket
		);
	}
	fullClick(e: React.MouseEvent<HTMLElement>) {
		let { onFull, updateImg } = this.props;
		if (onFull && typeof onFull === "function") {
			setTimeout(() => {
				onFull(this.state.isInit, this.state.initData);
				updateImg(this.state.img);
			}, 400);
		}
	}
	boxClick() {
		let { onClick } = this.props;
		if (onClick && typeof onClick === "function") {
			onClick();
		}
	}
	public orderFun(type: string) {
		let { isInit } = this.state;
		let typeArr = type.split(" ");
		if (isInit) {
			if (typeArr[0] == "init" && typeArr[1] == "reinit") {
				this.props.updateInit(null);
			}
			if (
				typeArr[0] == "init" &&
				(typeArr[1] != "PluginMain" && typeArr[1] != "reinit")
			) {
				return;
			}
		}

		if (typeArr[1] && typeArr[1] == "PluginMain") {
			this.goNext("PluginMain");
		} else if (typeArr[1] == "reinit") {
			let order = type.replace(" reinit", "");
			this.ws.send(order);
			let { initData } = this.state;
			let newData = JSON.parse(JSON.stringify(initData));
			newData.map((v: any, i: number) => {
				v.status = -2;
				if (i == 0) {
					v.status = -1;
				}
			});
			this.setState({
				initData: [...newData],
				initStep: 0
			});
		} else {
			this.ws.send(type);
		}
	}
	public phoneHand(data: any) {
		if (!data) {
			return;
		}
		let pos = data.x + " " + data.y + " " + data.w + " " + data.h;
		switch (data.type) {
			case "start":
				this.ws.send("d " + "0 " + pos);
				break;
			case "move":
				this.ws.send("m " + "0 " + pos);
				break;
			case "end":
				this.ws.send("u " + "0 " + pos);
				break;
			default:
				break;
		}
	}
	goNext(key: string) {
		if (key == "PluginMain") {
			let idx = this.state.initStepArray.indexOf(key);
			let { initData } = this.state;
			let newData = JSON.parse(JSON.stringify(initData));
			newData.map((v: any, i: number) => {
				if (i < idx) {
					v.status = 1;
				}
				if (i == idx) {
					v.status = -1;
				}
			});
			this.setState({
				initData: [...newData],
				initStep: idx
			});
			this.ws.send(
				`init ${JSON.stringify({
					apps: this.props.initData.apps,
					initmobilesetting: this.state.initData.slice(idx)
				})}`
			);
		} else {
			this.ws.send(`init_go ${key}`);
		}
	}
	getWechatInfo(data: any) {
		if (!data) {
			return;
		}
		let { phoneData, onWechatLogin } = this.props;
		let params: any = {
			...data,
			account_id: phoneData.id
		};
		if (onWechatLogin && typeof onWechatLogin === "function") {
			onWechatLogin(params);
		}
	}
	public onLogin(isLogin: boolean) {
		let { initData } = this.state;
		if (isLogin) {
			this.ws.send("init_go AutoLogin");
			initData.map((v: any, i: number) => {
				if (v.key == "ConfigureWeiChat") {
					v.status = 1;
				}
				if (v.key == "AutoLogin") {
					v.status = -1;
				}
			});
			this.setState({
				isShowInput: false
			});
		} else {
			initData.map((v: any, i: number) => {
				if (v.key == "ConfigureWeiChat") {
					v.status = 0;
				}
			});
		}
		this.setState({
			initData: [...initData]
		});
	}
	closeClick() {
		let { onClose } = this.props;
		if (onClose && typeof onClose === "function") {
			onClose();
		}
	}
	PhoneScreenPosChange(type: string) {
		//console.log(this.ws);
		if (this.ws && this.ws.isConnect === true) {
			this.ws.send(type);
		} else {
			setTimeout(() => {
				this.PhoneScreenPosChange(type);
			}, 300);
		}
	}
	render() {
		let { isFocus, phoneData } = this.props;
		let {
			img,
			height,
			initStepArray,
			initStep,
			isShowInput,
			initData,
			isInit
		} = this.state;
		return (
			<div
				className={classnames("phone-components", isFocus && "act")}
				onClick={this.boxClick.bind(this)}
				ref={this.box}
			>
				<div className="phone-top">
					{!isInit && (
						<React.Fragment>
							{phoneData && phoneData.status == 1 && (
								<Icon
									type="check-circle"
									className="phone-status success"
								/>
							)}
							{phoneData && phoneData.status == 2 && (
								<Icon
									type="user"
									className="phone-status unlogin"
								/>
							)}
							{phoneData && phoneData.status == 3 && (
								<Icon
									type="warning"
									className="phone-status warn"
								/>
							)}
							{phoneData && phoneData.status == 4 && (
								<Icon
									type="warning"
									className="phone-status warn"
								/>
							)}
							<div className="phone-name">
								{phoneData &&
								phoneData.note_mobile &&
								phoneData.note_mobile.length > 0
									? phoneData.note_mobile
									: "暂无"}
							</div>
						</React.Fragment>
					)}
					{isInit &&
						initData &&
						initData.length > 0 &&
						initData.map((v: any, i: number) => {
							if (i == initStep) {
								return (
									<React.Fragment key={i}>
										<div className="phone-name init-step">
											{v.name}
										</div>
										{(v => {
											switch (v.key) {
												case "FengYunTrustThisSoftware":
													return (
														<Button
															size="small"
															type="primary"
															className="init-btn"
															onClick={this.goNext.bind(
																this,
																"PluginMain"
															)}
														>
															继续
														</Button>
													);
												case "FengYunReBootPower":
													return (
														<Button
															size="small"
															type="primary"
															className="init-btn"
															onClick={this.goNext.bind(
																this,
																"PluginMain"
															)}
														>
															继续
														</Button>
													);
												case "ConfigureWeiChat":
													return (
														<span
															style={{
																color: "orange"
															}}
														>
															分配账号
														</span>
													);
												case "LoginVerification":
													return (
														<span
															style={{
																color: "orange"
															}}
														>
															请完成登录
														</span>
													);
												default:
													return (
														<React.Fragment>
															{v.status == -1 && (
																<div className="state">
																	执行中...
																</div>
															)}
															{v.status == 0 && (
																<div className="state">
																	执行失败
																</div>
															)}
															{v.status == 1 && (
																<div className="state">
																	执行成功
																</div>
															)}
														</React.Fragment>
													);
											}
										})(v)}
									</React.Fragment>
								);
							}
							return null;
						})}
					<Icon
						type="fullscreen"
						className="full"
						onClick={this.fullClick.bind(this)}
					/>
					<Icon
						type="close"
						className="full"
						onClick={this.closeClick.bind(this)}
					/>
				</div>
				<div className="phone" style={{ height: height + "px" }}>
					{height > 0 && (
						<PhoneScreen
							img={img}
							onClick={this.boxClick.bind(this)}
							onHand={this.phoneHand.bind(this)}
							isShowInput={isShowInput}
							onWechatInfo={this.getWechatInfo.bind(this)}
							ref="phonescreen"
							onPosChange={this.PhoneScreenPosChange.bind(this)}
						/>
					)}
				</div>
				<div className="phone-footer">
					<div
						className="footer-item"
						onClick={this.orderFun.bind(this, "reback")}
					>
						<Icon type="rollback" />
					</div>
					<div
						className="footer-item"
						onClick={this.orderFun.bind(this, "home")}
					>
						<Icon type="home" />
					</div>
					<div
						className="footer-item"
						onClick={this.orderFun.bind(this, "process")}
					>
						<Icon type="border" />
					</div>
				</div>
			</div>
		);
	}
}
