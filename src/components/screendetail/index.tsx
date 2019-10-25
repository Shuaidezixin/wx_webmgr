/**
 * 同屏相关代码
 */
import * as React from "react";
import { Modal, Icon, Button } from "antd";
import PhoneScreen from "@component/phonescreen";
import Scrollbars from "react-custom-scrollbars";
import DetailItem from "@component/detailitem";
import WebSocket from "../../utils/websocketscreen";
import * as classnames from "classnames";
import p1 from "@img/u1103.png";
import p2 from "@img/u1104.png";
import "./index.less";

interface Props {
	visible: boolean;
	onCancel?: Function;
	onHome?: Function;
	onReturn?: Function;
	onProcess?: Function;
	data?: any;
	img?: any[];
	onHand?: Function;
	initData?: any;
	apps?: any;
	orderClik?: Function;
	updateInitData?: any;
	onWechatLogin?: Function;
}
interface State {
	visible: boolean;
	isShowInit: boolean;
	img: any;
	initList: any;
	initArray: string[];
	step: number;
	updateInitData: any;
	isShowInput: boolean;
}

export default class Detail extends React.PureComponent<Props, State> {
	private ws: WebSocket;
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: true
	};
	readonly state: State = {
		visible: false,
		isShowInit: false,
		img: [],
		initList: null,
		step: -1,
		updateInitData: null,
		initArray: [],
		isShowInput: false
	};
	static getDerivedStateFromProps(nextProps: any, currentState: any): any {
		if (nextProps.visible && !currentState.visible) {
			let set: any = {};
			let init: any = [];
			let initArr: string[] = [];
			if (nextProps.initData && nextProps.initData.length > 0) {
				nextProps.initData.map((v: any, i: number) => {
					initArr.push(v.key);
					v.index = i;
					v.status = -2;
					if (i == 0) {
						v.status = -1;
					}
					init.push(v);
				});
			}
			set.initList = init;
			set.visible = true;
			set.initArray = initArr;
			return {
				...set
			};
		}
		if (!nextProps.visible && currentState.visible) {
			return {
				visible: false,
				step: -1
			};
		}
		if (nextProps.updateInitData != currentState.updateInitData) {
			let arr = nextProps.updateInitData.split(" ");
			if (arr[0] == "init") {
				let idx = currentState.initArray.indexOf(arr[1]);

				let nowList = JSON.parse(JSON.stringify(currentState.initList));
				let set: any = {};
				if (!nowList) {
					return null;
				}
				nowList.map((v: any, i: number) => {
					v.status = -2;
					if (i < idx) {
						v.status = 1;
					}
					if (i == idx) {
						v.status = arr[2];
					}
					if (i == idx + 1 && arr[2] == 1) {
						v.status = -1;
					}
				});
				if (arr[1] == "StartPluginMain") {
					set.isShowInput = true;
				}
				if (currentState.step != -1) {
					set.step = 1;
				}

				return {
					updateInitData: nextProps.updateInitData,
					initList: [...nowList],
					...set
				};
			}
		}
		return null;
	}
	componentDidUpdate(prevProps: any) {
		if (prevProps != this.props.img && this.refs.phonescreen) {
			let phone: any = this.refs.phonescreen;
			//phone.drawImg(this.props.img);
		}
	}
	public goInitStepBox(data: any) {
		this.setState({
			step: 1,
			initList: [...data]
		});
	}
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	goStep(num: number) {
		if (num == 1) {
			this.detailOrder(
				`init ${JSON.stringify({
					apps: this.props.apps,
					initmobilesetting: [this.props.initData[0]]
				})}`
			);
			let { initList } = this.state;
			initList.map((v: any, i: number) => {
				v.status = -2;
				if (i == 0) {
					v.status = -1;
				}
			});
			this.setState({
				initList: [...initList]
			});
		}
		this.setState({
			step: num
		});
	}
	openInit() {
		this.setState({
			step: 0
		});
	}
	closeInit() {
		this.setState({
			isShowInit: false
		});
	}
	phoneHand(data: any) {
		let { onHand } = this.props;
		if (onHand && typeof onHand === "function") {
			onHand({ data: data, id: this.props.data.id });
		}
	}
	detailOrder(type: string) {
		let { data, orderClik } = this.props;
		if (orderClik && typeof orderClik === "function") {
			orderClik(type, data);
		}
	}
	initStart() {
		let { apps, initData } = this.props;
		if (initData) {
			this.detailOrder(
				`init ${JSON.stringify({
					apps,
					initmobilesetting: initData
				})}`
			);
		}
	}
	goNext(type: string) {
		if (type == "PluginMain") {
			let { initList } = this.state;
			let step: number = 0;
			initList.map((v: any, i: number) => {
				if (v.key == type) {
					step = i;
				}
			});
			this.detailOrder(
				`init PluginMain ${JSON.stringify({
					apps: this.props.apps,
					initmobilesetting: initList.slice(step)
				})}`
			);
			initList.map((v: any) => {
				if (v.key == type) {
					v.status = -1;
				}
			});
			this.setState({
				initList: [...initList]
			});
		} else {
			this.detailOrder(`init_go ${type}`);
		}
	}
	reInit() {
		Modal.confirm({
			title: "重置",
			content: "确认重置初始化流程?",
			onOk: () => {
				this.detailOrder(
					`init reinit ${JSON.stringify({
						apps: this.props.apps,
						initmobilesetting: [this.props.initData[0]]
					})}`
				);
				let { initList } = this.state;
				let newList = JSON.parse(JSON.stringify(initList));
				newList.map((v: any, i: number) => {
					v.status = -2;
					if (i == 0) {
						v.status = -1;
					}
				});
				this.setState({
					initList: [...newList],
					updateInitData: null
				});
			}
		});
	}
	onWechatInfo(p: any) {
		let { data, onWechatLogin } = this.props;

		let params: any = {
			...p,
			account_id: data.id
		};
		if (onWechatLogin && typeof onWechatLogin === "function") {
			onWechatLogin(params);
		}
	}
	public onLogin(isLogin: boolean) {
		let { initList } = this.state;
		if (isLogin) {
			this.setState({
				isShowInput: false
			});
			initList.map((v: any, i: number) => {
				if (v.key == "ConfigureWeiChat") {
					v.status = 1;
				}
				if (v.key == "AutoLogin") {
					v.status = -1;
				}
			});
		} else {
			initList.map((v: any, i: number) => {
				if (v.key == "ConfigureWeiChat") {
					v.status = 0;
				}
			});
		}
		this.setState({
			initList: [...initList]
		});
	}
	render() {
		let {
			visible,
			isShowInit,
			initArray,
			step,
			initList,
			isShowInput
		} = this.state;
		let { data, img, apps } = this.props;
		let showInitList: any = {};
		let initGroup: any[] = [];
		if (initList && initList.length > 0) {
			initList.map((v: any) => {
				if (!showInitList[v.type]) {
					showInitList[v.type] = {};
					showInitList[v.type].type = v.type;
					showInitList[v.type].typename = v.typename;
					showInitList[v.type].children = [];
					initGroup.push({
						typename: v.typename,
						type: v.type
					});
				}
				showInitList[v.type].children.push(v);
			});
		}
		return (
			<Modal
				visible={visible}
				width={1100}
				centered={true}
				wrapClassName="screen-phone-detail-modal"
				footer={null}
				onCancel={this.cancelClick.bind(this)}
				maskClosable={false}
			>
				<div className="screen-phone-container">
					<div className="canvas-box">
						<div style={{ height: "calc(100% - 31px)" }}>
							{visible && (
								<PhoneScreen
									key="detailbox-screen"
									img={img}
									onHand={this.phoneHand.bind(this)}
									isShowInput={isShowInput}
									onWechatInfo={this.onWechatInfo.bind(this)}
									ref="phonescreen"
								/>
							)}
						</div>
						<div className="phone-footer">
							<div
								className="footer-item"
								onClick={this.detailOrder.bind(this, "reback")}
							>
								<Icon type="rollback" />
							</div>
							<div
								className="footer-item"
								onClick={this.detailOrder.bind(this, "home")}
							>
								<Icon type="home" />
							</div>
							<div
								className="footer-item"
								onClick={this.detailOrder.bind(this, "process")}
							>
								<Icon type="border" />
							</div>
						</div>
					</div>
					<div className="info-box">
						<div className="info-header">
							<div className="num">
								手机编号:{data && data.note_mobile}
							</div>
							<div className="nickname">
								微信昵称:{data && data.nickname}
							</div>
						</div>
						{step == -1 && (
							<Scrollbars
								autoHide={true}
								style={{ height: "calc(100% - 44px)" }}
							>
								<div className="status-box">
									{data && data.status == 1 && (
										<React.Fragment>
											<Icon
												type="check-circle"
												className="phone-status success"
											/>
											<div className="status-text success">
												设备正常
											</div>
											<div className="status-case">
												设备一切正常
											</div>
										</React.Fragment>
									)}
									{data && data.status == 2 && (
										<React.Fragment>
											<Icon
												type="user"
												className="phone-status unlogin"
											/>
											<div className="status-text unlogin">
												未登录
											</div>
											<div className="status-case">
												请检查账号登录情况
											</div>
										</React.Fragment>
									)}
									{data && data.status == 3 && (
										<React.Fragment>
											<Icon
												type="warning"
												className="phone-status warn"
											/>
											<div className="status-text warn">
												封号
											</div>
											<div className="status-case">
												请检查封号情况
											</div>
										</React.Fragment>
									)}
									{data && data.status == 4 && (
										<React.Fragment>
											<Icon
												type="warning"
												className="phone-status warn"
											/>
											<div className="status-text warn">
												设备故障
											</div>
											<div className="status-case">
												请优先检查网络是否正常，中控插件是否被关闭
											</div>
										</React.Fragment>
									)}
								</div>
								<div className="ctrl-item">
									<div className="title">基本操作</div>
									<div className="content">
										{/* <div
											className="phone-ctrl-item"
											onClick={this.detailOrder.bind(
												this,
												"close_process"
											)}
										>
											<div className="phone-icon close" />
											<div>关闭进程</div>
										</div> */}
										<div
											className="phone-ctrl-item"
											onClick={this.detailOrder.bind(
												this,
												"restart_vxp"
											)}
										>
											<div className="phone-icon vxp" />
											<div>重启VXP</div>
										</div>
										<div
											className="phone-ctrl-item"
											onClick={this.detailOrder.bind(
												this,
												"open_central"
											)}
										>
											<div className="phone-icon openctrl" />
											<div>打开中控</div>
										</div>
										<div
											className="phone-ctrl-item"
											onClick={this.detailOrder.bind(
												this,
												"openwe_chat"
											)}
										>
											<div className="phone-icon wechat" />
											<div>打开微信</div>
										</div>
										<div
											className="phone-ctrl-item"
											onClick={this.detailOrder.bind(
												this,
												"restart_phone"
											)}
										>
											<div className="phone-icon restart" />
											<div>重启手机</div>
										</div>
										<div
											className="phone-ctrl-item"
											onClick={this.detailOrder.bind(
												this,
												"manage_file"
											)}
										>
											<div className="phone-icon file" />
											<div>文件管理</div>
										</div>
										<div
											className="phone-ctrl-item"
											onClick={this.detailOrder.bind(
												this,
												"setting"
											)}
										>
											<div className="phone-icon set" />
											<div>设置</div>
										</div>
										<div
											className="phone-ctrl-item"
											onClick={this.detailOrder.bind(
												this,
												"find_phone"
											)}
										>
											<div className="phone-icon find" />
											<div>查找手机</div>
										</div>
									</div>
								</div>
								<div className="ctrl-item">
									<div className="title">程序安装</div>
									<div className="content">
										<div
											className="phone-ctrl-item"
											onClick={this.goStep.bind(this, 0)}
										>
											<div className="phone-icon all" />
											<div>一键初始化</div>
										</div>
										{apps &&
											apps.length > 0 &&
											apps.map((v: any, i: number) => {
												return (
													<div
														key={i}
														className="phone-ctrl-item"
														onClick={this.detailOrder.bind(
															this,
															`install_app ${v.applicationsrc}`
														)}
													>
														<div className="phone-icon">
															<img
																src={
																	v.applicationicon
																}
																alt=""
															/>
														</div>
														<div>
															{v.applicationname}
														</div>
													</div>
												);
											})}
									</div>
								</div>
								<div className="ctrl-item">
									<div className="title">
										<div className="title-t">硬件信息</div>
										<Icon type="sync" className="sync" />
									</div>
									<div className="content">
										<DetailItem
											labelName="品牌"
											content={data && data.device_pinpai}
										/>
										<DetailItem
											nameWidth="100px"
											labelName="MAC"
											content={data && data.device_mac}
										/>
										<DetailItem
											labelName="型号"
											content={
												data && data.device_xinghao
											}
										/>
										<DetailItem
											nameWidth="100px"
											labelName="IMEI"
											content={data && data.device_imei}
										/>
										<DetailItem
											labelName="内存"
											content={data && data.device_mem}
										/>
										<DetailItem
											nameWidth="100px"
											labelName="IMSI"
											content={data && data.device_imsi}
										/>
										<DetailItem
											labelName="系统"
											content={data && data.device_os}
										/>
										<DetailItem
											nameWidth="100px"
											labelName="集成电路识别码"
										/>
									</div>
								</div>
							</Scrollbars>
						)}
						{step == 0 && (
							<div className="init-before-container">
								<div className="title">
									执行初始化之前请确保已完成以下操作
								</div>
								<div className="text">
									1.在手机设置/开发者选项中打开“不锁定屏幕”和“USB调试”选项
								</div>
								<div className="img-box">
									<img src={p1} />
									<img src={p2} />
								</div>
								<div className="text">
									2.卸载不相干的第三方程序
								</div>
								<div className="btn-box">
									<Button
										type="primary"
										className="btn"
										onClick={this.goStep.bind(this, 1)}
									>
										开始初始化
									</Button>
									<Button
										className="btn"
										onClick={this.goStep.bind(this, -1)}
									>
										取消
									</Button>
								</div>
							</div>
						)}
						{step == 1 && (
							<div
								className="init-box"
								style={{ height: "calc(100% - 44px)" }}
							>
								<div className="init-header">
									<div className="text">初始化</div>
									<Button
										size="small"
										className="btn"
										type="primary"
										onClick={this.reInit.bind(this)}
									>
										重置
									</Button>
									<Button
										size="small"
										className="btn"
										onClick={this.goStep.bind(this, -1)}
									>
										关闭
									</Button>
								</div>
								<Scrollbars
									autoHide={true}
									style={{ height: "calc(100% - 44px)" }}
								>
									{initGroup &&
										initGroup.length > 0 &&
										initGroup.map((v: any, i: number) => {
											if (v.type == "BackStageAutotask") {
												return null;
											}
											return (
												<div
													className="init-item"
													key={i}
												>
													<div className="item-title">
														{v && v.typename}
													</div>
													{showInitList &&
														showInitList[v.type] &&
														showInitList[v.type]
															.children &&
														showInitList[v.type]
															.children.length >
															0 &&
														showInitList[
															v.type
														].children.map(
															(
																val: any,
																idx: number
															) => {
																return (
																	<div
																		className="item"
																		key={
																			idx
																		}
																	>
																		<div className="t">
																			{val &&
																				val.name}
																		</div>
																		{(val => {
																			let res: any;
																			switch (
																				val.key
																			) {
																				case "FengYunTrustThisSoftware":
																					return (
																						<span
																							style={{
																								color:
																									"orange"
																							}}
																						>
																							请在手机上打开此权限
																						</span>
																					);
																				case "FengYunReBootPower":
																					return (
																						<span
																							style={{
																								color:
																									"orange"
																							}}
																						>
																							请在手机上打开此权限
																						</span>
																					);
																				case "PluginMain":
																					if (
																						val.status ==
																						-1
																					) {
																						return (
																							<div className="state act">
																								执行中
																							</div>
																						);
																					}
																					if (
																						val.status ==
																						0
																					) {
																						return (
																							<div className="state error">
																								执行失败
																							</div>
																						);
																					}
																					if (
																						val.status ==
																						1
																					) {
																						return (
																							<div className="state act">
																								执行成功
																							</div>
																						);
																					}

																					if (
																						initList[
																							initArray.indexOf(
																								"FengYun"
																							)
																						] &&
																						initList[
																							initArray.indexOf(
																								"FengYun"
																							)
																						]
																							.status ==
																							1 &&
																						initList[
																							initArray.indexOf(
																								"FengYunTrustThisSoftware"
																							)
																						]
																							.status ==
																							-1
																					) {
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
																					}
																				case "ConfigureWeiChat":
																					if (
																						val.status ==
																						-1
																					) {
																						return (
																							<span
																								style={{
																									color:
																										"orange"
																								}}
																							>
																								请在左侧完成账户分配
																							</span>
																						);
																					}
																					if (
																						val.status ==
																						1
																					) {
																						return (
																							<div className="state act">
																								执行成功
																							</div>
																						);
																					}
																					return (
																						<div className="state wait">
																							待执行
																						</div>
																					);
																				case "LoginVerification" &&
																					val.status ==
																						-1:
																					return (
																						<span
																							style={{
																								color:
																									"orange"
																							}}
																						>
																							请在手机上完成登录验证
																						</span>
																					);
																				default:
																					if (
																						val &&
																						val.status ==
																							-2
																					) {
																						res = (
																							<div className="state wait">
																								待执行
																							</div>
																						);
																					}
																					if (
																						val &&
																						val.status ==
																							-1
																					) {
																						res = (
																							<div className="state act">
																								执行中
																							</div>
																						);
																					}
																					if (
																						val &&
																						val.status ==
																							0
																					) {
																						res = (
																							<div className="state error">
																								执行失败
																							</div>
																						);
																					}
																					if (
																						val &&
																						val.status ==
																							1
																					) {
																						res = (
																							<div className="state act">
																								执行成功
																							</div>
																						);
																					}
																					break;
																			}
																			return res;
																		})(val)}
																	</div>
																);
															}
														)}
												</div>
											);
										})}
								</Scrollbars>
							</div>
						)}
					</div>
				</div>
			</Modal>
		);
	}
}
