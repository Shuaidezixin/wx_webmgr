import * as React from "react";
import { Select, Checkbox, Empty, message } from "antd";
import Scrollbars from "react-custom-scrollbars";
import PhoneBox from "../components/phone";
import Detail from "@component/screendetail";
import FooterCtrl from "@component/footer_ctrl";
import { socketUrl } from "../../../config";
import WebSocket from "../../../utils/websocket";
import InitModal from "../components/initmodal";
import Toast from "@component/toast";
import "./index.less";

const Option = Select.Option;
const limitNumber = 8;
interface Props {
	accoutListForScreen: any;
	getAccountListForScreenAction?: Function;
	singleAccountCheckForScreenAction?: Function;
	allAccountCheckForScreenAction?: Function;
	getScreenAddressAction?: Function;
	getScreenInitAction?: Function;
	screenInit?: any;
	allotAccountWxAction?: Function;
	initCmsAutoTaskAction?: Function;
	unlockScreenAction?: Function;
}
interface State {
	statustype: number;
	isShowDetail: boolean;
	isInit: boolean;
	targetID: string | void;
	page: number;
	pagesize: number;
	isAll: boolean;
	targetList: any;
	fullData: any;
	detailImg: any[];
	isShowInitModal: boolean;
	updateInitData: any;
}
export default class Root extends React.PureComponent<Props, State> {
	private work: Worker;
	private timer: any;
	constructor(props: Props) {
		super(props);
		this.phoneHand = this.phoneHand.bind(this);
	}
	readonly state: State = {
		statustype: 0,
		isShowDetail: false,
		isInit: false,
		targetID: null,
		page: 1,
		pagesize: 60,
		isAll: false,
		targetList: {},
		fullData: null,
		detailImg: [],
		isShowInitModal: false,
		updateInitData: null
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "同屏传输");
		this.getUserList();
		//this.initWork();
		this.props.getScreenInitAction();
		window.addEventListener(
			"beforeunload",
			this.unlockScreen.bind(this),
			false
		);
	}
	componentWillUnmount() {
		this.unlockScreen();
		this.setState({
			targetList: {}
		});
		window.removeEventListener(
			"beforeunload",
			this.unlockScreen.bind(this),
			false
		);
	}
	unlockScreen() {
		let { targetList } = this.state;
		let ids: string[] = [];
		for (let key in targetList) {
			ids.push(key);
		}
		if (ids && ids.length > 0) {
			this.props.unlockScreenAction({
				accountids: ids.join(";")
			});
		}
	}
	initWork() {
		var str = `self.addEventListener('message',(e)=>{
			if(e&&e.data){
				console.log(e)
				let d=e.data;
				if(typeof d!=='string'&&d.type){
					switch(d.type){
						case 'message':
								self.postMessage("data");
							break;
					}
				}
			}
		})`;
		var blob = new Blob([str]);
		var url = window.URL.createObjectURL(blob);
		this.work = new Worker(url);
		this.work.postMessage({ type: "message", data: "nihao" });
		this.work.onmessage = (e: any) => {
			console.log(1, e);
		};
	}
	// 获取设备列表
	async getUserList() {
		let { page, pagesize, statustype, targetList } = this.state;

		let params: any = {
			page,
			pagesize,
			type: "screen"
		};
		if (statustype && statustype != 0) {
			params.statustype = statustype;
		}
		let res = await this.props.getAccountListForScreenAction(params);
		if (res && res.code == 200 && res.data) {
			let users = res.data.users;
			if (users && users.length > 0) {
				let count: number = 0;
				users.map((v: any) => {
					if (targetList[v.id] && targetList[v.id] != null) {
						this.props.singleAccountCheckForScreenAction({
							id: v.id
						});
						count++;
					}
				});
				this.setState({
					isAll: count == users.length && count != 0 ? true : false
				});
			}
		}
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		this.timer = setTimeout(() => {
			this.getUserList();
		}, 60 * 1000);
	}
	openDetail(data: any, isInit: boolean, fromPhoneData: any) {
		this.setState(
			{
				isShowDetail: true,
				fullData: {
					...data
				}
			},
			() => {
				if (isInit) {
					let box: any = this.refs["detailbox"];
					box.goInitStepBox(fromPhoneData);
				}
			}
		);
	}
	closeDetail() {
		this.setState({
			isShowDetail: false,
			fullData: null
		});
	}
	allInitClick() {
		this.setState({
			isInit: true
		});
	}
	phoneClick(data: any) {
		let { targetID } = this.state;
	}
	// 下拉选择框
	InputChange(e: any) {
		this.setState(
			{
				statustype: e,
				isAll: false,
				targetList: {},
				page: 1
			},
			this.getUserList
		);
	}
	// 获取socket转播 参数id
	async getWs(data: string) {
		let res = await this.props.getScreenAddressAction({
			accountids: data
		});
		if (res && res.code == 200) {
			return res.data;
		}
	}
	getTargetDataLength() {
		let { targetList } = this.state;
		let count = 0;
		for (let key in targetList) {
			count++;
		}
		return count;
	}
	// 单选触发
	async deviceClick(data: any) {
		if (!data || !data.id || data.id.length <= 0) {
			return;
		}
		// if (this.getTargetDataLength() >= limitNumber) {
		// 	return;
		// }
		let { targetList } = this.state;
		let newTargetList = JSON.parse(JSON.stringify(targetList));
		this.props.singleAccountCheckForScreenAction({
			id: data.id
		});
		if (!data.isChecked) {
			delete newTargetList[data.id];
			this.props.unlockScreenAction({
				accountids: data.id
			});
		} else {
			let m = Toast.loading("获取设备中,请稍候...", 0);
			let res = await this.getWs(data.id);
			m.close();
			if (!res || res.length <= 0) {
				this.props.singleAccountCheckForScreenAction({
					id: data.id
				});
				message.error("获取websocketurl失败");
			} else {
				newTargetList[data.id] = {
					...data,
					wsurl: res[0].socketrelay
				};
			}
		}
		this.setState({
			targetList: { ...newTargetList }
		});
		let { accoutListForScreen } = this.props;
		let count: number = 0;
		let len: number = 0;
		if (
			accoutListForScreen &&
			accoutListForScreen.users &&
			accoutListForScreen.users.length > 0
		) {
			len = accoutListForScreen.users.length;
			accoutListForScreen.users.map((v: any) => {
				if (v.isChecked) {
					count++;
				}
			});
		}
		if (
			count != 0 &&
			accoutListForScreen &&
			accoutListForScreen.users &&
			accoutListForScreen.users.length > 0 &&
			count == len
		) {
			this.setState({
				isAll: true
			});
		} else {
			this.setState({
				isAll: false
			});
		}
	}
	// 全选
	async allCheckClick(e: any) {
		if (
			!this.props.accoutListForScreen ||
			!this.props.accoutListForScreen.users ||
			this.props.accoutListForScreen.users.length <= 0
		) {
			message.error("无设备列表");
			return;
		}
		let len = this.getTargetDataLength();
		// if (len >= limitNumber) {
		// 	return;
		// }
		let val = e.target.checked;
		this.setState({
			isAll: val
		});
		this.props.allAccountCheckForScreenAction({
			state: val
		});
		let { accoutListForScreen } = this.props;
		let targetList = JSON.parse(JSON.stringify(this.state.targetList));
		if (val) {
			let newArr: any[] = [];
			if (
				accoutListForScreen &&
				accoutListForScreen.users &&
				accoutListForScreen.users.length > 0
			) {
				accoutListForScreen.users.map((v: any, i: number) => {
					//20个上限限制处理
					// if (i + len >= limitNumber) {
					// 	return;
					// }
					if (!targetList[v.id]) {
						targetList[v.id] = v;
						newArr.push(v.id);
					}
				});
			}
			let m = Toast.loading("获取设备中,请稍候...", 0);
			let res = await this.getWs(newArr.join(";"));
			m.close();
			if (res && res.length > 0) {
				res.map((v: any, i: number) => {
					if (targetList[v.account_id]) {
						targetList[v.account_id].wsurl = v.socketrelay;
					}
				});
			} else {
				message.error("获取websocketurl失败");
			}

			for (let key in targetList) {
				if (
					!targetList[key].wsurl ||
					targetList[key].wsurl.length <= 0
				) {
					this.props.singleAccountCheckForScreenAction({
						id: key
					});
					delete targetList[key];
					this.setState({ isAll: false });
				}
			}
			this.setState({
				targetList: { ...targetList }
			});
		} else {
			let ids: string[] = [];
			for (let key in targetList) {
				ids.push(key);
			}
			if (ids && ids.length > 0) {
				this.props.unlockScreenAction({
					accountids: ids.join(";")
				});
			}
			this.setState({
				targetList: {}
			});
		}
	}
	// 翻页
	pageChange(e: number) {
		this.setState(
			{
				page: e,
				isAll: false
				// targetList: {}
			},
			this.getUserList
		);
	}
	uploadImg(img: any[]) {
		if (this.state.isShowDetail) {
			this.setState({
				detailImg: img
			});
		}
	}
	phoneHand(d: any) {
		let { data, id } = d;
		let currentPhone: any = this.refs["phonebox_" + id];
		currentPhone.phoneHand(data);
	}
	//基本操作命令
	orderClik(type: string, data?: any) {
		let { targetList } = this.state;
		if (!data) {
			let arr: any[] = [];
			if (targetList) {
				for (let d in targetList) {
					arr.push(targetList[d]);
				}
			}
			if (arr && arr.length > 0) {
				arr.map((v: any) => {
					let box: any = this.refs["phonebox_" + v.id];
					if (box) {
						if (type.split(" ")[0] == "init") {
							box.openInit();
						}
						box.orderFun(type);
					}
				});
			}
		} else {
			let box: any = this.refs["phonebox_" + data.id];
			if (box) {
				if (type.split(" ")[0] == "init") {
					box.openInit();
				}
				box.orderFun(type);
			}
		}
	}
	openInitModal() {
		this.setState({
			isShowInitModal: true
		});
	}
	closeInitModal() {
		this.setState({
			isShowInitModal: false
		});
	}
	initModalOk() {
		this.setState({
			isInit: true
		});
		let { screenInit } = this.props;
		if (screenInit) {
			this.orderClik(
				`init ${JSON.stringify({
					apps: screenInit.apps,
					initmobilesetting: [screenInit.initmobilesetting[0]]
				})}`
			);
			this.closeInitModal();
		} else {
			message.error("无法获取初始化数据，请刷新界面重试");
		}
	}
	updateInit(data: string) {
		this.setState({
			updateInitData: data
		});
	}
	async wechatLogin(d: any) {
		let { fullData } = this.state;
		let res = await this.props.allotAccountWxAction(d);
		let id = d.account_id;
		let box: any = this.refs["phonebox_" + id];
		if (res && res.code == 200) {
			if (box) {
				box.onLogin(true);
			}
			if (fullData && fullData.id == id) {
				let detail: any = this.refs["detailbox"];
				detail.onLogin(true);
			}
		} else {
			if (box) {
				box.onLogin(false);
			}
			if (fullData && fullData.id == id) {
				let detail: any = this.refs["detailbox"];
				detail.onLogin(false);
			}
		}
	}
	onInitEnd(id: string) {
		this.props.initCmsAutoTaskAction({
			account_id: id
		});
	}
	closePhone(id: string) {
		let { targetList } = this.state;
		delete targetList[id];
		this.setState({
			targetList: { ...targetList },
			isAll: false
		});
		this.props.unlockScreenAction({
			accountids: id
		});
		this.props.singleAccountCheckForScreenAction({ id: id });
	}
	phoneError(id: string) {
		let { targetList, fullData } = this.state;
		delete targetList[id];
		let set: any = {
			targetList: { ...targetList },
			isAll: false
		};
		if (fullData.id == id) {
			set.isShowDetail = false;
		}
		this.setState({ ...set });
		this.props.unlockScreenAction({
			accountids: id
		});
		this.props.singleAccountCheckForScreenAction({ id: id });
	}
	render() {
		let {
			statustype,
			isShowDetail,
			isInit,
			pagesize,
			page,
			isAll,
			targetList,
			fullData,
			detailImg,
			isShowInitModal,
			updateInitData
		} = this.state;
		let {
			accoutListForScreen,
			screenInit,
			allotAccountWxAction
		} = this.props;
		let phoneArr: any[] = [];
		if (targetList) {
			for (let d in targetList) {
				phoneArr.push(targetList[d]);
			}
		}
		return (
			<div className="screen-page">
				<div className="screen-left">
					<div className="left-top">
						<div>同屏传输</div>
						<Select
							value={statustype}
							onChange={this.InputChange.bind(this)}
							className="select"
						>
							<Option value={0}>全部</Option>
							<Option value={1}>正常</Option>
							<Option value={2}>未登录</Option>
							<Option value={3}>封号</Option>
							<Option value={4}>系统故障</Option>
							<Option value={5}>新接入</Option>
						</Select>
					</div>
					<div className="device-header">
						<div className="device-item">
							<div className="check">
								<Checkbox
									checked={isAll}
									onChange={this.allCheckClick.bind(this)}
								/>
							</div>
							<div className="num">手机编号</div>
							<div className="nick">昵称</div>
						</div>
					</div>
					<div className="left-container">
						<Scrollbars autoHide={true}>
							{accoutListForScreen &&
								accoutListForScreen.users &&
								accoutListForScreen.users.length > 0 &&
								accoutListForScreen.users.map(
									(v: any, i: number) => {
										return (
											<div
												className="device-item child"
												key={i}
												onClick={this.deviceClick.bind(
													this,
													v
												)}
											>
												<div className="check">
													<Checkbox
														checked={
															v && v.isChecked
														}
													/>
												</div>
												<div className="num">
													{v &&
													v.note_mobile &&
													v.note_mobile.length > 10
														? v.note_mobile.substring(
																v.note_mobile
																	.length -
																	10,
																v.note_mobile
																	.length
														  )
														: v.note_mobile}
												</div>
												<div className="nick">
													{v && v.nickname}
												</div>
											</div>
										);
									}
								)}
							{(!accoutListForScreen ||
								!accoutListForScreen.users ||
								accoutListForScreen.users.length <= 0) && (
								<div className="nodatabox">
									<Empty />
								</div>
							)}
						</Scrollbars>
					</div>
					<div style={{ padding: "3px" }}>
						<FooterCtrl
							isShowText={false}
							pageSize={pagesize}
							currentPage={page}
							total={
								accoutListForScreen && accoutListForScreen.total
							}
							pageChange={this.pageChange.bind(this)}
						/>
					</div>
				</div>
				<div className="screen-middle">
					<Scrollbars autoHide={true}>
						<div className="scroll-box">
							{phoneArr &&
								phoneArr.length > 0 &&
								phoneArr.map((v: any) => {
									if (!v.wsurl || v.wsurl.length <= 0) {
										return null;
									}
									return (
										<PhoneBox
											onFull={this.openDetail.bind(
												this,
												v
											)}
											onWechatLogin={this.wechatLogin.bind(
												this
											)}
											isFull={
												fullData && fullData.id == v.id
													? true
													: false
											}
											ref={"phonebox_" + v.id}
											onClick={this.phoneClick.bind(this)}
											key={v.id}
											phoneData={v}
											updateImg={this.uploadImg.bind(
												this
											)}
											initData={screenInit}
											updateInit={this.updateInit.bind(
												this
											)}
											onInitEnd={this.onInitEnd.bind(
												this
											)}
											onClose={this.closePhone.bind(
												this,
												v.id
											)}
											onError={this.phoneError.bind(
												this,
												v.id
											)}
										/>
									);
								})}
						</div>
					</Scrollbars>
				</div>
				<div className="screen-right">
					<div className="ctrl-item">
						<div className="title">基本操作</div>
						<div className="content">
							{/* <div
								className="phone-ctrl-item"
								onClick={this.orderClik.bind(
									this,
									"close_process",
									null
								)}
							>
								<div className="phone-icon close" />
								<div>关闭进程</div>
							</div> */}
							<div
								className="phone-ctrl-item"
								onClick={this.orderClik.bind(
									this,
									"restart_vxp",
									null
								)}
							>
								<div className="phone-icon vxp" />
								<div>重启VXP</div>
							</div>
							<div
								className="phone-ctrl-item"
								onClick={this.orderClik.bind(
									this,
									"open_central",
									null
								)}
							>
								<div className="phone-icon openctrl" />
								<div>打开中控</div>
							</div>
							<div
								className="phone-ctrl-item"
								onClick={this.orderClik.bind(
									this,
									"openwe_chat",
									null
								)}
							>
								<div className="phone-icon wechat" />
								<div>打开微信</div>
							</div>
							<div
								className="phone-ctrl-item"
								onClick={this.orderClik.bind(
									this,
									"restart_phone",
									null
								)}
							>
								<div className="phone-icon restart" />
								<div>重启手机</div>
							</div>
							<div
								className="phone-ctrl-item"
								onClick={this.orderClik.bind(
									this,
									"manage_file",
									null
								)}
							>
								<div className="phone-icon file" />
								<div>文件管理</div>
							</div>
							<div
								className="phone-ctrl-item"
								onClick={this.orderClik.bind(
									this,
									"setting",
									null
								)}
							>
								<div className="phone-icon set" />
								<div>设置</div>
							</div>
							<div
								className="phone-ctrl-item"
								onClick={this.orderClik.bind(
									this,
									"find_phone",
									null
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
								onClick={this.openInitModal.bind(this)}
							>
								<div className="phone-icon all" />
								<div>一键初始化</div>
							</div>
							{screenInit &&
								screenInit.apps &&
								screenInit.apps.length > 0 &&
								screenInit.apps.map((v: any, i: number) => {
									return (
										<div
											key={i}
											className="phone-ctrl-item"
											onClick={this.orderClik.bind(
												this,
												`install_app ${v.applicationsrc}`,
												null
											)}
										>
											<div className="phone-icon">
												<img
													src={v.applicationicon}
													alt=""
												/>
											</div>
											<div>{v.applicationname}</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>
				<Detail
					onCancel={this.closeDetail.bind(this)}
					visible={isShowDetail}
					data={fullData}
					img={detailImg}
					onHand={this.phoneHand.bind(this)}
					initData={screenInit && screenInit.initmobilesetting}
					apps={screenInit && screenInit.apps}
					orderClik={this.orderClik.bind(this)}
					updateInitData={updateInitData}
					onWechatLogin={this.wechatLogin.bind(this)}
					ref="detailbox"
				/>
				{isShowInitModal && (
					<InitModal
						visible={isShowInitModal}
						onCancel={this.closeInitModal.bind(this)}
						onOk={this.initModalOk.bind(this)}
					/>
				)}
			</div>
		);
	}
}
