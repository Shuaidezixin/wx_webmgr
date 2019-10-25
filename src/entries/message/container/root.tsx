import * as React from "react";
import { message, Icon, Select, Input, Button, Tabs, Empty } from "antd";
import Scrollbars from "react-custom-scrollbars";
import * as classnames from "classnames";
import WechatItem from "../components/wechatitem";
import ContactItem from "../components/contact";
import SelectFriend from "@component/selectfriend";
import Chat from "../components/chat";
import EmptyChat from "../components/empty";
import TxlItem from "../components/txlitem";
import PyqItem from "../components/pyqitem";
import CommentList from "../components/comment";
import Reply from "../components/reply";
import Create from "../components/create";
import AddFriend from "../components/addfriend";
import PhoneBox from "../components/phone";
import ProvingBox from "../components/proving";
import { socketUrl } from "../../../config";
import Socket from "../../../utils/websocket";
import Toast from "@component/toast";

import "./index.less";
const Option = Select.Option;
const TabPane = Tabs.TabPane;
interface Props {
	messageList?: any;
	messageDevicesList?: any;
	messageTalkerList?: any;
	//messageDetail?: any;
	messageTalkList?: any;
	getMessageDevicesListAction?: Function;
	getMessageTalkerListAction?: Function;
	clearMessageTalkerListAction?: Function;
	getMessageTalkListAction?: Function;
	clearMessageTalkListAction?: Function;
	sendMessageAction?: Function;
	updateTalkerInfoAction?: Function;
	createUserTaskAction?: Function;
	pyqList?: any;
	getPyqListAction?: Function;
	txlList?: any;
	getTxlListAction?: Function;
	commentList?: any;
	getCommentListAction?: Function;
	clearPyqListAction?: Function;
	cleartXLListAction?: Function;
	pyqZanAction?: Function;
	pyqCommentAction?: Function;
	getTxlList2Action?: Function;
	txlList2?: any;
	operateQunAction?: Function;
	updateActiveTimeAction?: Function;
	clearCommentAction?: Function;
	allReadAction?: Function;
	getMessageAction?: Function;
	createMessageAction?: Function;
	getGroupsAction1?: Function;
	groupList1?: any;
	messageFriendValid?: any;
	getFriendValidMessage?: Function;
	messageFriendValidTask?: any;
	getFriendValidTask?: Function;
	withdrawMessageAction?: Function;
	messageExtensionScriptList?: any;
	getMessageExtensionScriptListAction?: Function;
	clearExtensionScriptListAction?: Function;
	updateTalkerLocalInfoAction?: Function;
	updateTxlLocalInfoAction?: Function;
}
interface State {
	actions: any;
	messageType: MessageType;
	devicePage: number;
	devicePagesize: number;
	talkerPage: number;
	talkerPagesize: number;
	talkPage: number;
	talkPagesize: number;
	accountID: string;
	talkerID: string;
	isLoadingTalk: boolean;
	isShowQun: boolean;
	qunKey: string;
	isShowCommentList: boolean;
	isShowCreate: boolean;
	isShowReply: boolean;
	pyqPage: number;
	pyqPagesize: number;
	isPqyLoaded: boolean;
	txlKey: string;
	txlPage: number;
	txlPagesize: number;
	isTxlLoaded: boolean;
	pyqid: string;
	comment_username: string;
	ownName: string;
	commentName: string;
	ownUserName: string;
	isShowAddFriend: boolean;
	actQunID: string;
	qunUser: any[];
	sorttype: number;
	deviceKey: string;
	isDeviceLoading: boolean;
	isShowPhoneList: boolean;
	targetChatList: any[];
	targetIndex: number;
	grouptype: string;
	isShowProving: boolean;
}
declare type MessageType = "single" | "qun" | "tongxunlu" | "pyq";
export default class Root extends React.PureComponent<Props, State> {
	private deviceTimer: any = null;
	private talkerTimer: any = null;
	private talkTimer: any = null;
	private validMsgTimer: any = null;
	private pyqScrollbars: React.RefObject<Scrollbars>;
	private txlScrollbars: React.RefObject<Scrollbars>;
	private socket: any;
	private loadTalker: any;
	constructor(props: Props) {
		super(props);
		this.pyqScrollbars = React.createRef();
		this.txlScrollbars = React.createRef();
	}
	readonly state: State = {
		actions: {},
		isLoadingTalk: false,
		messageType: "single",
		devicePage: 1,
		devicePagesize: 1000,
		talkerPage: 1,
		talkerPagesize: 1000,
		talkPage: 1,
		talkPagesize: 1000,
		accountID: "",
		talkerID: "",
		isShowQun: false,
		qunKey: "",
		isShowCommentList: false,
		isShowCreate: false,
		isShowReply: false,
		pyqPage: 1,
		pyqPagesize: 20,
		isPqyLoaded: false,
		txlKey: "",
		txlPage: 1,
		txlPagesize: 30,
		isTxlLoaded: false,
		pyqid: "",
		comment_username: "",
		ownName: "",
		commentName: "",
		ownUserName: "",
		isShowAddFriend: false,
		actQunID: "",
		qunUser: [],
		sorttype: 1,
		deviceKey: "",
		isDeviceLoading: false,
		isShowPhoneList: true,
		targetChatList: [],
		targetIndex: -1,
		grouptype: "0",
		isShowProving: false
	};
	componentDidMount() {
		this.getAction();
		document.title = window.pageTitle.replace("{title}", "消息");
		let set: any = {};
		let accountid = window.sessionStorage.getItem("messageAccountId");
		let talkerid = window.sessionStorage.getItem("messageTalkerID");
		let messageType = window.sessionStorage.getItem("messageType");
		if (accountid && accountid.length > 0) {
			set.accountID = accountid;
		}
		if (talkerid && talkerid.length > 0) {
			set.talkerID = talkerid;
		}
		if (messageType && messageType.length > 0) {
			set.messageType = messageType;
		}
		this.initSocket();
		this.props.getGroupsAction1({ page: 1, pagesize: 100 });
		window.changeMessageType = this.changeMessageType.bind(this);
		this.setState(
			{
				...set
			},
			() => {
				if (set.accountID && set.accountID.length > 0) {
					// this.props.getFriendValidMessage({
					// 	account_id: set.accountID
					// });
					this.getValidMsg(); //轮询
				}
				this.getDevicesList().then(() => {
					this.getCommentList();
					switch (messageType) {
						case "pyq":
							this.getPyqList();
							break;
						case "tongxunlu":
							this.getTxlList();
							break;
					}
				});
			}
		);
	}
	// 初始化websocket
	initSocket() {
		this.socket = new Socket(socketUrl());
		let token = window.localStorage.getItem("token");
		if (token) {
			this.socket.onOpen(() => {
				this.socket.send({
					type: "token"
				});
			});
			this.socket.onMessage((data: string) => {
				let d: any = data == "pushmessage" ? "pushmessage" : data;
				if (d && d.type) {
					if (d.code != 200) {
						message.error(d.message);
						return;
					}
					switch (d.type) {
						case "token":
							console.log("token验证成功");
							break;
						case "list":
							this.socketMessageList(d.data);
							break;
						case "message":
							this.socketMessageCreate(d.data);
							break;
						case "messagewithdrawal":
							this.socketWithdrawMessage(d);
							break;
					}
				}
			});
		}
	}
	// 聊天窗收到消息触发 draw
	socketWithdrawMessage(data: any) {
		let { withdrawMessageAction } = this.props;
		if (!data || data.code != 200) {
			message.error(data.message);
			return;
		}
		withdrawMessageAction(data.data);
	}
	// 弹出聊天窗触发 list
	socketMessageList(data: any) {
		if (!data) {
			return;
		}
		this.props.getMessageAction({ data: data });
		setTimeout(() => {
			let box: any = this.refs[`${data.account_id}_${data.talker_id}`];
			if (box) {
				box.scrollToBottom();
			}
		}, 300);
	}
	// 聊天窗发送消息触发 create
	socketMessageCreate(data: any) {
		if (!data) {
			return;
		}
		this.props.createMessageAction({ data: data });
		let box: any = this.refs[`${data[0].account_id}_${data[0].talker_id}`];
		let chat: any = this.refs[`chatBox`];
		if (box) {
			setTimeout(() => {
				box.scrollToBottom();
			}, 300);
		}
		if (chat) {
			setTimeout(() => {
				chat.scrollToBottom();
			}, 300);
		}
	}
	changeMessageType(type: MessageType) {
		this.setState(
			{
				messageType: type && type.length > 0 ? type : "single"
			},
			() => {
				switch (type) {
					case "pyq":
						if (!this.props.pyqList) {
							this.getPyqList();
						}
						break;
					case "tongxunlu":
						if (!this.props.txlList) {
							this.getTxlList();
						}
						break;
				}
			}
		);
	}
	getAction() {
		let actions = window.localStorage.getItem("actions");
		if (actions) {
			let actionsObj = JSON.parse(window.Util.decryptPass(actions)); //解密actions
			let actObj: any = {};
			if (actionsObj) {
				actionsObj.map((item: any) => {
					if (!actObj[item.key]) {
						actObj[item.key] = [];
					}
					if (item.value && item.value.length > 0) {
						item.value.map((v: any) => {
							actObj[item.key].push(v._id);
						});
					}
				});
				let set: any = {
					...this.state.actions,
					...actObj
				};
				window.managerAction = set;
				this.setState({
					actions: {
						...set
					}
				});
			}
		}
	}
	// 设备用户id集合 []
	getDevicesIds() {
		let { messageDevicesList } = this.props;
		let res: any = [];
		if (
			messageDevicesList &&
			messageDevicesList.msg_devices &&
			messageDevicesList.msg_devices.length > 0
		) {
			messageDevicesList.msg_devices.map((v: any) => {
				res.push(v.account_id);
			});
		}
		return res;
	}
	// 获取聊天列表
	async getTalkList() {
		let { talkPage, talkPagesize } = this.state;
		let id = window.sessionStorage.getItem("messageTalkerID");
		let aid = window.sessionStorage.getItem("messageAccountId");
		if (!id || id.length <= 0 || !aid || aid.length <= 0) {
			return;
		}
		if (this.getDevicesIds().indexOf(aid) == -1) {
			return;
		}
		if (this.talkTimer) {
			clearTimeout(this.talkTimer);
			this.talkTimer = null;
		}
		let params: any = {
			page: talkPage,
			pagesize: talkPagesize,
			talker_id: id,
			account_id: aid
		};
		this.setState({
			isLoadingTalk: true
		});
		try {
			let res = await this.props.getMessageTalkListAction(params);
			this.talkTimer = setTimeout(() => {
				this.getTalkShowList();
			}, 10 * 1000);
		} finally {
			this.setState({
				isLoadingTalk: false
			});
		}
	}
	// 获取朋友圈列表
	async getPyqList() {
		let { pyqPage, pyqPagesize, accountID, isPqyLoaded } = this.state;
		if (isPqyLoaded) {
			return;
		}
		if (this.getDevicesIds().indexOf(accountID) == -1) {
			return;
		}
		if (!accountID || accountID.length <= 0) {
			message.error("请选择设备");
			return;
		}
		let params: any = {
			page: pyqPage,
			pagesize: pyqPagesize,
			account_id: accountID
		};
		this.setState({
			isPqyLoaded: true
		});
		try {
			let res = await this.props.getPyqListAction(params);
		} finally {
			this.setState({
				isPqyLoaded: false
			});
		}
	}
	// 加载更多朋友圈
	pyqLoadMore(e: any) {
		if (
			this.props.pyqList &&
			this.props.pyqList.total <=
				this.state.pyqPage * this.state.pyqPagesize
		) {
			return;
		}
		if (this.state.isPqyLoaded) {
			return;
		}
		if (
			e.target.scrollTop + e.target.clientHeight ==
			e.target.scrollHeight
		) {
			this.setState(
				{
					pyqPage: this.state.pyqPage + 1
				},
				this.getPyqList
			);
		}
	}
	// 获取通讯录列表
	async getTxlList() {
		let {
			txlKey,
			txlPage,
			txlPagesize,
			accountID,
			isTxlLoaded
		} = this.state;
		if (isTxlLoaded) {
			return;
		}
		if (this.getDevicesIds().indexOf(accountID) == -1) {
			return;
		}
		if (!accountID || accountID.length <= 0) {
			message.error("请选择设备");
			return;
		}
		let params: any = {
			page: txlPage,
			pagesize: txlPagesize,
			account_id: accountID
		};
		if (txlKey && txlKey.trim().length > 0) {
			params.keyword = txlKey.trim();
		}
		this.setState({
			isTxlLoaded: true
		});
		try {
			let res = await this.props.getTxlListAction(params);
		} finally {
			this.setState({
				isTxlLoaded: false
			});
		}
	}
	// 滚动加载更多 通讯录
	txlLoadMore(e: any) {
		if (
			this.props.txlList &&
			this.props.txlList.total <=
				this.state.txlPage * this.state.txlPagesize
		) {
			return;
		}

		if (this.state.isTxlLoaded) {
			return;
		}
		if (
			e.target.scrollTop + e.target.clientHeight ==
			e.target.scrollHeight
		) {
			this.setState(
				{
					txlPage: this.state.txlPage + 1
				},
				this.getTxlList
			);
		}
	}
	// 获取设备列表
	async getDevicesList() {
		let {
			devicePage,
			devicePagesize,
			sorttype,
			isDeviceLoading,
			deviceKey,
			grouptype
		} = this.state;
		if (isDeviceLoading) {
			return;
		}
		let params: any = {
			page: devicePage,
			pagesize: devicePagesize,
			sorttype
		};
		if (deviceKey && deviceKey.trim().length > 0) {
			params.keyword = deviceKey;
		}
		if (window.appHistory.location.pathname != "/message") {
			return;
		}
		if (grouptype && grouptype != "0") {
			params.grouptype = grouptype;
		}
		if (this.deviceTimer) {
			clearTimeout(this.deviceTimer);
			this.deviceTimer = null;
		}
		this.setState({
			isDeviceLoading: true
		});
		let res: any = null;
		try {
			res = await this.props.getMessageDevicesListAction(params);
		} finally {
			this.setState({
				isDeviceLoading: false
			});
		}
		if (res && res.code == 200) {
			let devices = res.data.msg_devices;
			let isHas = false;
			if (!this.state.accountID || this.state.accountID.length <= 0) {
				return;
			}

			if (devices && devices.length > 0) {
				devices.map((item: any) => {
					if (item.account_id == this.state.accountID) {
						isHas = true;
					}
				});
			}

			if (!isHas) {
				this.setState({
					accountID: "",
					talkerID: ""
				});
				window.sessionStorage.removeItem("messageAccountId");
				window.sessionStorage.removeItem("messageTalkerID");
				// window.sessionStorage.removeItem("messageTalkerName");
			}
			this.getTalkerList();
		}
		this.deviceTimer = setTimeout(() => {
			this.getDevicesList();
		}, 60 * 1000);
	}
	// 聊天列表
	async getTalkerList() {
		let id = window.sessionStorage.getItem("messageAccountId");
		if (!id || id.length <= 0) {
			return;
		}
		if (this.getDevicesIds().indexOf(id) == -1) {
			this.props.clearMessageTalkerListAction();
			return;
		}
		if (window.appHistory.location.pathname != "/message") {
			return;
		}
		if (this.talkerTimer) {
			clearTimeout(this.talkerTimer);
			this.talkerTimer = null;
		}

		let { talkerPage, talkerPagesize } = this.state;
		let params: any = {
			page: talkerPage,
			pagesize: talkerPagesize,
			account_id: id
		};
		let res: any;
		try {
			res = await this.props.getMessageTalkerListAction(params);
		} finally {
			if (this.loadTalker) {
				this.loadTalker.close();
				this.loadTalker = null;
			}
		}
		if (res && res.code == 200) {
			let talkers = res.data.msg_talks;
			let isHas = false;
			if (!this.state.talkerID || this.state.talkerID.length <= 0) {
				return;
			}
			if (talkers && talkers.length > 0) {
				talkers.map((item: any) => {
					if (item.talk_id == this.state.talkerID) {
						isHas = true;
					}
				});
			}
			if (!isHas) {
				this.setState({
					talkerID: ""
				});
				window.sessionStorage.removeItem("messageTalkerID");
				// window.sessionStorage.removeItem("messageTalkerName");
			}
		}
	}
	componentWillUnmount() {
		if (this.deviceTimer) {
			clearTimeout(this.deviceTimer);
			this.deviceTimer = null;
		}
		if (this.talkerTimer) {
			clearTimeout(this.talkerTimer);
			this.talkerTimer = null;
		}
		if (this.talkTimer) {
			clearTimeout(this.talkTimer);
			this.talkTimer = null;
		}
		if (this.validMsgTimer) {
			clearTimeout(this.validMsgTimer);
			this.validMsgTimer = null;
		}
		if (this.socket) {
			this.socket.send({
				type: "socketClose"
			});
			this.socket.close();
		}
	}
	async getTalkShowList() {
		let { talkPage, talkPagesize, messageType } = this.state;
		if (messageType != "single" && messageType != "qun") {
			return;
		}
		let id = window.sessionStorage.getItem("messageTalkerID");
		let aid = window.sessionStorage.getItem("messageAccountId");
		if (!id || id.length <= 0 || !aid || aid.length <= 0) {
			return;
		}
		if (window.appHistory.location.pathname != "/message") {
			return;
		}
		if (this.talkTimer) {
			clearTimeout(this.talkTimer);
			this.talkTimer = null;
		}
		let params: any = {
			page: talkPage,
			pagesize: talkPagesize * talkPage,
			talker_id: id,
			account_id: aid
		};
		// let res = await this.props.getMessageTalkListAction(params);
		// this.talkTimer = setTimeout(() => {
		// 	this.getTalkShowList();
		// }, 10 * 1000);
	}
	openCommentList() {
		this.setState({
			isShowCommentList: true,
			isShowCreate: false
		});
		this.props.clearCommentAction({
			account_id: this.state.accountID
		});
	}
	closeCommentList() {
		this.setState({
			isShowCommentList: false
		});
	}
	// 打开 新建说说(朋友圈)
	openCreate() {
		this.setState({
			isShowCreate: true,
			isShowCommentList: false
		});
	}
	// 关闭 新建说说(朋友圈)
	closeCreate() {
		this.setState({
			isShowCreate: false
		});
	}
	// 回复
	openReply(data: any) {
		this.setState({
			isShowReply: true,
			...data
		});
	}
	// 打开添加好友
	openAddFriend() {
		if (!this.state.accountID || this.state.accountID.length <= 0) {
			message.error("请选择设备");
			return;
		}
		this.setState({
			isShowAddFriend: true
		});
	}
	// 关闭添加好友
	closeAddFriend() {
		this.setState({
			isShowAddFriend: false
		});
	}
	// 提交评论
	async commentOk(data: string) {
		if (!data || data.trim().length <= 0) {
			return;
		}
		let {
			pyqid,
			comment_username,
			accountID,
			ownName,
			commentName,
			ownUserName
		} = this.state;
		let params: any = {
			type: 2,
			pyqid,
			account_id: accountID,
			content: data,
			ownName,
			commentName,
			ownUserName
		};
		if (comment_username && comment_username.length > 0) {
			params.comment_username = comment_username;
		}
		let res = await this.props.pyqCommentAction(params);
		if (res && res.code == 200) {
			this.setState({
				isShowReply: false
			});
		}
	}
	getActive(id: string): boolean {
		let { messageDevicesList } = this.props;
		let res: boolean = false;
		if (
			messageDevicesList &&
			messageDevicesList.msg_devices &&
			messageDevicesList.msg_devices.length > 0
		) {
			messageDevicesList.msg_devices.map((v: any) => {
				if (v.account_id == id) {
					res = true;
				}
			});
		}

		return res;
	}
	closeReply() {
		this.setState({
			isShowReply: false
		});
	}
	renderTabHeader(message: string, onClick: Function, props: any) {
		let list: any[] = [
			{ name: "聊天", key: "single" },
			{ name: "群聊", key: "qun" },
			{ name: "通讯录", key: "tongxunlu" },
			{ name: "朋友圈", key: "pyq" }
		];
		return (
			<div>
				<div className="tab-header">
					{list.map((item: any, idx: number) => {
						return (
							<div
								key={idx}
								onClick={() => {
									onClick.call(this, item.key);
								}}
								className={classnames(
									"tab-item",
									props.activeKey == item.key && "act"
								)}
							>
								{item.name}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
	// 切换tab   e: type
	tabClick(e: any) {
		this.setState({
			messageType: e
		});
		window.sessionStorage.setItem("messageType", e);
		switch (e) {
			case "single":
				//this.getTalkShowList();
				break;
			case "qun":
				//this.getTalkShowList();
				break;
			case "pyq":
				this.setState(
					{
						pyqPage: 1,
						isShowCreate: false
					},
					this.getPyqList
				);
				this.getDevicesList();
				this.getCommentList();
				break;
			case "tongxunlu":
				if (!this.props.txlList) {
					this.getTxlList();
				}
				break;
		}
	}
	// 选择设备  data设备信息
	deviceClick(data: any) {
		if (!data || !data.account_id) {
			return;
		}
		if (data.account_id == this.state.accountID) {
			return;
		}
		window.sessionStorage.setItem("messageAccountId", data.account_id);
		//window.sessionStorage.setItem("messageAccountImg", data.talk_pic);
		window.sessionStorage.removeItem("messageTalkerID");
		this.props.clearMessageTalkerListAction();
		this.props.clearMessageTalkListAction();
		this.props.clearPyqListAction();
		this.props.cleartXLListAction();
		this.getValidMsg(); //轮询

		if (this.state.messageType == "pyq" && this.pyqScrollbars.current) {
			this.pyqScrollbars.current.scrollToTop();
		}
		if (
			this.state.messageType == "tongxunlu" &&
			this.txlScrollbars.current
		) {
			this.txlScrollbars.current.scrollToTop();
		}
		this.setState(
			{
				accountID: data.account_id,
				talkerID: "",
				txlPage: 1,
				pyqPage: 1,
				messageType: "single"
			},
			() => {
				this.loadTalker = Toast.loading("获取数据中", 0);
				this.getTalkerList();
				this.getCommentList();
			}
		);
		if (this.state.isShowProving) {
			this.setState({
				isShowProving: false
			});
		}
	}
	// 获取好友验证消息
	getValidMsg() {
		let account_id = window.sessionStorage.getItem("messageAccountId");
		this.props.getFriendValidMessage({ account_id });
		if (this.validMsgTimer) {
			clearTimeout(this.validMsgTimer);
			this.validMsgTimer = null;
		}
		this.validMsgTimer = setTimeout(() => {
			this.getValidMsg();
		}, 60 * 1000);
	}
	// 显示好友验证消息与否
	changeProving() {
		this.setState({
			isShowProving: !this.state.isShowProving
		});
	}
	// 获取评论列表
	getCommentList() {
		let { accountID } = this.state;
		if (this.getDevicesIds().indexOf(accountID) == -1) {
			return;
		}
		if (!accountID || accountID.length <= 0) {
			return;
		}
		this.props.getCommentListAction({
			page: 1,
			pageSize: 500,
			account_id: this.state.accountID
		});
	}
	getTalkerListID(): String[] {
		let { targetChatList } = this.state;
		let res: String[] = [];
		targetChatList.map((v: any) => {
			res.push(v.accountID + "_" + v.talk_id);
		});
		return res;
	}
	//获取聊天窗口聊天列表
	getMessage(data: any) {
		this.socket.send({
			type: "list",
			data: {
				account_id: data.accountID,
				talker_id: data.talk_id,
				page: 1,
				pagesize: 100
			}
		});
	}
	// 点击进入聊天窗口
	async talkerClick(data: any) {
		if (
			!this.props.messageDevicesList ||
			!this.props.messageDevicesList.msg_devices ||
			this.props.messageDevicesList.msg_devices.length <= 0
		) {
			message.error("设备列表为空");
			return;
		}
		if (!data || !data.talk_id) {
			return;
		}
		let act = this.getDeviceInfo(this.state.accountID);
		let d = {
			...data,
			accountID: this.state.accountID,
			accountImg: act ? act.talk_pic : ""
		};
		let { targetChatList } = this.state;
		let index: number;
		// console.log(
		// 	this.getTalkerListID().indexOf(
		// 		this.state.accountID + "_" + data.talk_id
		// 	)
		// );
		if (
			this.getTalkerListID().indexOf(
				this.state.accountID + "_" + data.talk_id
			) == -1
		) {
			if (targetChatList && targetChatList.length >= 8) {
				message.error("最多8个同时聊天");
				return;
			}
			targetChatList.push(d);
			index = targetChatList.length - 1;
			this.getMessage(d);
			window.sessionStorage.setItem("messageTalkerID", data.talk_id);

			//await this.props.clearMessageTalkListAction();
			//await this.getTalkList();
			await this.getDevicesList();
		} else {
			index = this.getTalkerListID().indexOf(
				this.state.accountID + "_" + data.talk_id
			);
		}
		this.setState({
			talkerID: data.talk_id,
			targetChatList: [...targetChatList],
			targetIndex: index
		});
	}
	async setQun(data: any) {
		let { operateQunAction } = this.props;
		let { accountID, actQunID } = this.state;

		if (data && data.length > 0) {
			let ids: any = [];
			data.map((v: any) => {
				ids.push(v.talk_id);
			});
			let params: any = {
				account_id: accountID,
				usernames: ids.join(";")
			};
			if (actQunID && actQunID.length > 0) {
				params.weichatgroupid = actQunID;
			}
			if (operateQunAction && typeof operateQunAction === "function") {
				let loading = Toast.loading("正在发布群相关任务", 0);
				let res: any;
				try {
					res = await operateQunAction(params);
				} finally {
					loading.close();
				}

				if (res && res.code == 200) {
					message.success("群相关任务发布成功");
				}
			}
		}
		this.setState({
			isShowQun: false
		});
	}
	getInfo(): any {
		let { talkerID } = this.state;
		if (!talkerID || talkerID.length <= 0) {
			return null;
		}
		let { messageTalkerList } = this.props;
		if (
			messageTalkerList &&
			messageTalkerList.msg_talks &&
			messageTalkerList.msg_talks.length > 0
		) {
			let m: any = null;
			messageTalkerList.msg_talks.map((v: any) => {
				if (v.talk_id == talkerID) {
					m = v;
				}
			});

			return m;
		}
		return null;
	}
	// 单聊是否为空
	singleIsEmpty() {
		let { messageTalkerList } = this.props;
		if (
			!messageTalkerList ||
			!messageTalkerList.msg_talks ||
			messageTalkerList.msg_talks.length <= 0
		) {
			return true;
		}
		let count = 0;
		messageTalkerList.msg_talks.map((v: any) => {
			if (!v.is_group) {
				count++;
			}
		});
		if (count == 0) {
			return true;
		}
		return false;
	}
	// 群聊是否为空
	qunIsEmpty() {
		let { messageTalkerList } = this.props;
		if (
			!messageTalkerList ||
			!messageTalkerList.msg_talks ||
			messageTalkerList.msg_talks.length <= 0
		) {
			return true;
		}
		let count = 0;
		messageTalkerList.msg_talks.map((v: any) => {
			if (v.is_group) {
				count++;
			}
		});
		if (count == 0) {
			return true;
		}
		return false;
	}
	openQun(data?: any) {
		if (!data || !data.users) {
			this.setState({
				isShowQun: true,
				qunUser: [],
				actQunID: ""
			});
		} else {
			this.setState({
				isShowQun: true,
				qunUser: [...data.users],
				actQunID: data.talk_id
			});
		}
	}
	closeQun() {
		this.setState({
			isShowQun: false,
			actQunID: "",
			qunUser: []
		});
	}
	// 朋友圈 点赞
	onZan(data: any) {
		if (!data || !data.pyq_id || data.pyq_id.length <= 0) {
			return;
		}
		let { accountID } = this.state;
		let { pyq_id } = data;
		this.props.pyqZanAction({
			type: 1,
			account_id: accountID,
			pyqid: pyq_id
		});
	}
	async addfriendClick(data: any) {
		let { accountID } = this.state;
		let { createUserTaskAction } = this.props;
		let params: any = {
			type: "AddFriend",
			account_ids: [accountID],
			sub_type: "AddFriend_qun",
			execute_hi: "0"
		};
		params.AddFriend_qun = {
			GroupId: data.Name,
			GroupList: data.Usernames,
			Desc: ""
		};
		if (createUserTaskAction && typeof createUserTaskAction == "function") {
			let loading = Toast.loading("正在提交任务", 0);
			let res: any;
			try {
				res = await createUserTaskAction({
					taskobj: JSON.stringify(params)
				});
			} finally {
				loading.close();
			}
			if (res && res.code == 200) {
				message.success("添加好友任务创建成功");
				this.closeAddFriend();
			}
		}
	}
	async addfriendByTxl(data: any) {
		let { accountID } = this.state;
		let { createUserTaskAction } = this.props;
		let params: any = {
			type: "AddFriend",
			account_ids: [accountID],
			sub_type: "AddFriend_jiansuo",
			execute_hi: "0"
		};
		params.AddFriend_jiansuo = {
			MobileList: [data.MobileList],
			AddFriendLimit: 1,
			AddFriendNote: data.AddFriendNote
		};
		if (createUserTaskAction && typeof createUserTaskAction == "function") {
			let loading = Toast.loading("正在提交任务", 0);
			let res: any;
			try {
				res = await createUserTaskAction({
					taskobj: JSON.stringify(params)
				});
			} finally {
				loading.close();
			}
			if (res && res.code == 200) {
				message.success("添加好友任务创建成功");
				this.closeAddFriend();
			}
		}
	}
	// 搜索通讯录
	txlChange(e: any) {
		this.setState(
			{
				txlKey: e.target.value
			},
			this.getTxlList
		);
	}
	// 点击通讯录下的用户
	async TxlItemClick(data: any) {
		if (
			!data ||
			!data.talk_id ||
			data.talk_id.length <= 0 ||
			data.is_self
		) {
			return;
		}

		let { targetChatList } = this.state;
		let d = {
			...data,
			accountID: this.state.accountID,
			accountImg: this.getDeviceInfo(this.state.accountID).talk_pic
		};
		if (
			this.getTalkerListID().indexOf(
				this.state.accountID + "_" + data.talk_id
			) == -1
		) {
			if (targetChatList && targetChatList.length >= 8) {
				message.error("最多8个同时聊天");
				return;
			}
			targetChatList.push(d);
			this.setState({
				targetChatList: [...targetChatList],
				targetIndex: targetChatList.length - 1
			});

			this.getMessage(d);
		} else {
			this.setState({
				targetIndex: this.getTalkerListID().indexOf(
					this.state.accountID + "_" + data.talk_id
				)
			});
		}
		let { is_group, talk_id } = data;
		let { updateActiveTimeAction } = this.props;
		window.sessionStorage.setItem("messageTalkerID", talk_id);
		window.sessionStorage.setItem(
			"messageType",
			data.is_group ? "qun" : "single"
		);
		this.setState({
			messageType: is_group ? "qun" : "single",
			talkerID: talk_id
		});
		if (
			updateActiveTimeAction &&
			typeof updateActiveTimeAction === "function"
		) {
			await updateActiveTimeAction({
				account_id: this.state.accountID,
				talker: talk_id
			});
			this.getTalkerList();
		}
	}
	// 设备列 排序
	deviceSelectChange(e: any) {
		this.setState(
			{
				sorttype: e
			},
			this.getDevicesList
		);
	}
	// 关闭聊天窗口
	deleteTargetChat(i: number) {
		let { targetChatList, targetIndex } = this.state;
		let index = -1;
		if (targetIndex > i) {
			index = targetIndex - 1;
		}
		if (targetIndex < i) {
			index = targetIndex;
		}

		let d = targetChatList.splice(i, 1);
		this.setState({
			targetChatList: [...targetChatList],
			targetIndex: index
		});
		this.socket.send({
			type: "close",
			data: {
				account_id: d[0].accountID,
				talker_id: d[0].talk_id
			}
		});
	}
	// 聊天窗口全屏
	chatFull(idx: number, data: any) {
		if (!data || !data.talk_id || data.talk_id.length <= 0) {
			return;
		}
		this.setState(
			{
				isShowPhoneList: false,
				targetIndex: idx
			},
			() => {
				let box: any = this.refs["chatBox"];
				if (box) {
					box.scrollToBottom();
				}
			}
		);
	}
	// 取消全屏
	chatCloseFull() {
		this.setState({
			isShowPhoneList: true
		});
	}
	// 设备列 关键词搜索
	deviceKeyChange(e: any) {
		this.setState(
			{
				deviceKey: e.target.value
			},
			this.getDevicesList
		);
	}
	// 全部已读
	addReadClick(type: number) {
		let { allReadAction, messageDevicesList } = this.props;
		let isZero = true;
		switch (type) {
			case 1:
				if (messageDevicesList && messageDevicesList.chat_left > 0) {
					isZero = false;
				}
				break;
			case 2:
				if (
					messageDevicesList &&
					messageDevicesList.chat_group_left > 0
				) {
					isZero = false;
				}
				break;
			case 3:
				if (messageDevicesList && messageDevicesList.pyq_left > 0) {
					isZero = false;
				}
				break;
		}
		if (isZero) {
			return;
		}
		if (allReadAction && typeof allReadAction === "function") {
			allReadAction({
				type
			}).then(() => {
				this.getDevicesList();
			});
		}
	}
	// 发送  sockcet
	socketSendMessage(data: any) {
		this.socket.send(
			{
				type: "message",
				data: data
			},
			true
		);
	}
	// 获取设备信息  id
	getDeviceInfo(id: string) {
		if (!id || id.length <= 0) {
			return;
		}
		let { messageDevicesList } = this.props;
		let res: any;
		if (
			messageDevicesList &&
			messageDevicesList.msg_devices &&
			messageDevicesList.msg_devices.length > 0
		) {
			messageDevicesList.msg_devices.map((v: any) => {
				if (v.account_id == id) {
					res = v;
				}
			});
		}
		return res;
	}
	// 发送消息
	sendMessage(talkerData: any, data: any) {
		// let isActive = this.getActive(talkerData.accountID);

		// if (!isActive) {
		// 	message.error("设备不在活动状态,暂时无法发送消息");
		// 	return;
		// }
		let imgs = data.content.match(/\<img.*?\/\>/g);
		let videos = data.content.match(/\<video.*?\/\>/g);
		let time =
			new Date().getTime() +
			"_" +
			parseInt((Math.random() * 10000000).toString(), 10);
		let info = this.getDeviceInfo(talkerData.accountID);

		if (imgs && imgs.length > 0) {
			imgs.map((item: any) => {
				let url = item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
				if (url && url.length > 0 && url.indexOf("http") != -1) {
					this.socketSendMessage({
						nickname: info.nickname,
						talk_pic: info.talk_pic,
						account_id: talkerData.accountID,
						talker_id: talkerData.talk_id,
						content: url,
						type: 2,
						timestamp: time
					});
				}
			});
		}
		if (videos && videos.length > 0) {
			videos.map((item: any) => {
				let url = item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
				if (url && url.length > 0 && url.indexOf("http") != -1) {
					this.socketSendMessage({
						nickname: info.nickname,
						talk_pic: info.talk_pic,
						account_id: talkerData.accountID,
						talker_id: talkerData.talk_id,
						content: url,
						type: 3,
						timestamp: time
					});
				}
			});
		}
		data.content = data.content.replace(/\<p\>\<\/p\>/g, "");
		data.content = data.content.replace(/\<\/p\>/g, "</p>\r");
		data.content = data.content.replace(/<\/?.+?>/g, "");
		if (data.content.length <= 0) {
			return;
		}
		this.socketSendMessage({
			nickname: info.nickname,
			talk_pic: info.talk_pic,
			account_id: talkerData.accountID,
			talker_id: talkerData.talk_id,
			content: data.content,
			type: 1,
			timestamp: time
		});
	}
	// 撤回
	withdrawMessage(data: any) {
		this.socket.send(
			{
				type: "messagewithdrawal",
				data: {
					talker_id: data.talker_id,
					account_id: data.account_id,
					content: data.content,
					create_time: data.create_time
				}
			},
			true
		);
	}
	closeWindow() {}
	updateInfo(params: any) {
		let { targetChatList } = this.state;
		let t: string = "";
		switch (params.type) {
			case 1:
				t = "note_name";
				break;
			case 2:
				t = "tag";
				break;
			case 3:
				t = "note_msg";
				break;
			case 4:
				t = "group_name";
				break;
			case 5:
				t = "nickname";
				break;
		}
		this.props.updateTalkerInfoAction(params).then(() => {
			targetChatList.map((v: any) => {
				if (
					v.accountID == params.account_id &&
					v.talk_id == params.talker_id
				) {
					v[t] = params.msg;
				}
			});
			this.props.updateTalkerLocalInfoAction({
				talk_id: params.talker_id,
				type: t,
				value: params.msg
			});
			this.props.updateTxlLocalInfoAction({
				talk_id: params.talker_id,
				type: t,
				value: params.msg
			});
			//this.getTalkerList();
		});
	}
	groupChange(e: any) {
		this.setState(
			{
				grouptype: e
			},
			this.getDevicesList
		);
	}
	phoneClick(idx: number) {
		this.setState({
			targetIndex: idx
		});
	}
	render() {
		let {
			messageType,
			accountID,
			talkerID,
			isLoadingTalk,
			actions,
			isShowQun,
			qunKey,
			isShowCommentList,
			isShowCreate,
			isShowReply,
			isPqyLoaded,
			isTxlLoaded,
			txlKey,
			qunUser,
			isShowAddFriend,
			sorttype,
			deviceKey,
			isShowPhoneList,
			targetChatList,
			targetIndex,
			grouptype,
			isDeviceLoading,
			isShowProving
		} = this.state;
		let {
			messageDevicesList,
			messageTalkerList,
			messageTalkList,
			sendMessageAction,
			updateTalkerInfoAction,
			createUserTaskAction,
			txlList,
			pyqList,
			commentList,
			txlList2,
			getTxlList2Action,
			messageList,
			groupList1,
			messageFriendValid,
			getFriendValidTask,
			getMessageExtensionScriptListAction,
			clearExtensionScriptListAction,
			messageExtensionScriptList
		} = this.props;
		if (!this.state.actions["5cefaa84875bc01b14b759d9"]) {
			return (
				<div style={{ textAlign: "center", padding: "100px 0" }}>
					无权限,页面即将
					<span
						style={{ color: "red", cursor: "pointer" }}
						onClick={this.closeWindow.bind(this)}
					>
						关闭
					</span>
					{(() => {
						setTimeout(() => {
							this.closeWindow();
						}, 5000);
					})()}
				</div>
			);
		}
		return (
			<div className="message-page">
				<div className="message-wechat">
					<div className="unread">
						<div className="unread-item type">
							<div className="num">
								{messageDevicesList &&
									messageDevicesList.chat_left}
							</div>
							<div className="text">单聊未读</div>
							<div
								className="read"
								onClick={this.addReadClick.bind(this, 1)}
							>
								全部已读
							</div>
						</div>
						<div className="unread-item type">
							<div className="num">
								{messageDevicesList &&
									messageDevicesList.chat_group_left}
							</div>
							<div className="text">群聊未读</div>
							<div
								className="read"
								onClick={this.addReadClick.bind(this, 2)}
							>
								全部已读
							</div>
						</div>
						<div className="unread-item type">
							<div className="num">
								{messageDevicesList &&
									messageDevicesList.pyq_left}
							</div>
							<div className="text">朋友圈未读</div>
							<div
								className="read"
								onClick={this.addReadClick.bind(this, 3)}
							>
								全部已读
							</div>
						</div>
					</div>
					<div className="message-filter">
						<Select
							className="select"
							onChange={this.deviceSelectChange.bind(this)}
							value={sorttype}
						>
							<Option value={1}>单聊降序</Option>
							<Option value={2}>单聊升序</Option>
							<Option value={3}>操作降序</Option>
							<Option value={4}>操作升序</Option>
						</Select>
						<Select
							className="select"
							value={grouptype}
							onChange={this.groupChange.bind(this)}
						>
							<Option value={"0"}>全部</Option>
							{groupList1 &&
								groupList1.accountgroups &&
								groupList1.accountgroups.length > 0 &&
								groupList1.accountgroups.map(
									(v: any, i: number) => {
										return (
											<Option key={v.id} value={v.id}>
												{v.name}
											</Option>
										);
									}
								)}
						</Select>
						<Icon
							type="sync"
							className="sync-device"
							title="同步设备"
							onClick={this.getDevicesList.bind(this)}
							spin={isDeviceLoading}
						/>
					</div>
					<div className="message-filter">
						<Input
							className="input"
							placeholder="请输入关键词语"
							value={deviceKey}
							onChange={this.deviceKeyChange.bind(this)}
						/>
					</div>
					<div className="wechat-list-box">
						<Scrollbars
							autoHide={true}
							renderThumbVertical={() => {
								return (
									<div
										style={{
											backgroundColor: "#fff",
											borderRadius: "4px"
										}}
									/>
								);
							}}
						>
							{messageDevicesList &&
								messageDevicesList.msg_devices &&
								messageDevicesList.msg_devices.length > 0 &&
								messageDevicesList.msg_devices.map(
									(v: any, idx: number) => {
										return (
											<WechatItem
												key={idx}
												data={v}
												onClick={this.deviceClick.bind(
													this
												)}
												activeID={accountID}
											/>
										);
									}
								)}
							{(!messageDevicesList ||
								!messageDevicesList.msg_devices ||
								messageDevicesList.msg_devices.length <= 0) && (
								<div
									style={{
										padding: "50px 0"
									}}
								>
									<Empty />
								</div>
							)}
						</Scrollbars>
					</div>
				</div>
				{/* {accountID&&accountID.length>0&&this.getDevicesIds().indexOf(accountID)!=-1&&} */}
				<div className="message-container">
					<Tabs
						activeKey={messageType}
						renderTabBar={this.renderTabHeader.bind(
							this,
							"message",
							this.tabClick.bind(this)
						)}
					>
						<TabPane tab="单聊" key="single">
							<Scrollbars
								autoHide={true}
								style={{ height: "calc(100% - 40px)" }}
							>
								{messageTalkerList &&
									messageTalkerList.msg_talks &&
									messageTalkerList.msg_talks.length > 0 &&
									messageTalkerList.msg_talks.map(
										(v: any, idx: number) => {
											if (v.is_group) {
												return null;
											}
											return (
												<ContactItem
													key={idx}
													data={v}
													onClick={this.talkerClick.bind(
														this
													)}
													activeID={talkerID}
												/>
											);
										}
									)}
								{this.singleIsEmpty() && (
									<div
										style={{
											padding: "50px 0"
										}}
									>
										<Empty />
									</div>
								)}
							</Scrollbars>
						</TabPane>
						<TabPane tab="群聊" key="qun">
							<div className="search">
								<Icon
									type="plus"
									className="add"
									onClick={this.openQun.bind(this)}
								/>
								<Input.Search
									placeholder="搜索"
									value={qunKey}
									onChange={window.Util.InputChange.bind(
										this,
										"qunKey"
									)}
								/>
							</div>
							<Scrollbars
								autoHide={true}
								style={{ height: "calc(100% - 83px)" }}
								ref={this.txlScrollbars}
							>
								{messageTalkerList &&
									messageTalkerList.msg_talks &&
									messageTalkerList.msg_talks.length > 0 &&
									messageTalkerList.msg_talks.map(
										(v: any, idx: number) => {
											if (!v.is_group) {
												return null;
											}
											if (
												qunKey &&
												qunKey.trim().length > 0
											) {
												if (
													v.group_name
														.toLowerCase()
														.indexOf(
															qunKey.trim()
														) != -1
												) {
													return (
														<ContactItem
															key={idx}
															data={v}
															onClick={this.talkerClick.bind(
																this
															)}
															activeID={talkerID}
														/>
													);
												}
												return null;
											} else {
												return (
													<ContactItem
														key={idx}
														data={v}
														onClick={this.talkerClick.bind(
															this
														)}
														activeID={talkerID}
													/>
												);
											}
										}
									)}
								{this.qunIsEmpty() && (
									<div
										style={{
											padding: "50px 0"
										}}
									>
										<Empty />
									</div>
								)}
							</Scrollbars>
						</TabPane>
						<TabPane tab="通讯录" key="tongxunlu">
							<div className="search">
								<Icon
									type="plus"
									className="add"
									onClick={this.openAddFriend.bind(this)}
								/>
								<Input.Search
									placeholder="搜索"
									value={txlKey}
									onChange={this.txlChange.bind(this)}
								/>
							</div>
							{messageFriendValid &&
								messageFriendValid.total > 0 && (
									<div
										className="has-proving"
										onClick={this.changeProving.bind(this)}
									>
										您有{messageFriendValid.total}条验证消息
									</div>
								)}
							<Scrollbars
								autoHide={true}
								style={
									messageFriendValid &&
									messageFriendValid.total > 0
										? { height: "calc(100% - 109px)" }
										: { height: "calc(100% - 83px)" }
								}
								onScroll={this.txlLoadMore.bind(this)}
							>
								{txlList &&
									txlList.msg_talks &&
									txlList.msg_talks.length > 0 &&
									txlList.msg_talks.map(
										(v: any, i: number) => {
											return (
												<TxlItem
													key={i}
													data={v}
													onClick={this.TxlItemClick.bind(
														this
													)}
												/>
											);
										}
									)}
								{(!txlList ||
									!txlList.msg_talks ||
									txlList.msg_talks.length <= 0) && (
									<div
										style={{
											padding: "50px 0"
										}}
									>
										<Empty />
									</div>
								)}
								{isTxlLoaded && (
									<div
										style={{
											padding: "10px 0",
											textAlign: "center"
										}}
									>
										<Icon type="loading" spin />
									</div>
								)}
							</Scrollbars>
						</TabPane>
						<TabPane tab="朋友圈" key="pyq">
							<div className="search">
								<Icon
									type="plus"
									className="add"
									onClick={this.openCreate.bind(this)}
								/>
								<div className="newmessage">
									{commentList && commentList.total > 0 && (
										<span
											onClick={this.openCommentList.bind(
												this
											)}
										>
											你有
											<span className="number">
												{commentList.total}
											</span>
											条新消息
										</span>
									)}
								</div>
							</div>
							<Scrollbars
								autoHide={true}
								style={{ height: "calc(100% - 83px)" }}
								onScroll={this.pyqLoadMore.bind(this)}
								ref={this.pyqScrollbars}
							>
								{pyqList &&
									pyqList.accountpyqs &&
									pyqList.accountpyqs.length > 0 &&
									pyqList.accountpyqs.map(
										(item: any, idx: number) => {
											return (
												<PyqItem
													key={idx}
													onZan={this.onZan.bind(
														this,
														item
													)}
													onReplay={this.openReply.bind(
														this
													)}
													data={item}
												/>
											);
										}
									)}
								{(!pyqList ||
									!pyqList.accountpyqs ||
									pyqList.accountpyqs.length <= 0) && (
									<div
										style={{
											padding: "50px 0"
										}}
									>
										<Empty />
									</div>
								)}
								{isPqyLoaded && (
									<div
										style={{
											padding: "10px 0",
											textAlign: "center"
										}}
									>
										<Icon type="loading" spin />
									</div>
								)}
							</Scrollbars>
						</TabPane>
					</Tabs>
				</div>
				<div className="message-detail-box">
					{(messageType == "single" || messageType == "qun") &&
						!isShowPhoneList &&
						talkerID &&
						talkerID.length > 0 && (
							<Chat
								isLoading={false}
								data={
									messageList &&
									targetChatList &&
									targetChatList[targetIndex] &&
									messageList[
										`${targetChatList[targetIndex].accountID}_${targetChatList[targetIndex].talk_id}`
									]
								}
								isActive={this.getActive(
									targetChatList[targetIndex].accountID
								)}
								onClose={() => {
									this.setState(
										{
											isShowPhoneList: true
										},
										() => {
											this.deleteTargetChat.call(
												this,
												this.state.targetIndex
											);
										}
									);
								}}
								ref="chatBox"
								sendClick={this.sendMessage.bind(this)}
								key="chat"
								info={targetChatList[targetIndex]}
								updateInfo={this.updateInfo.bind(this)}
								onPlus={this.openQun.bind(this)}
								onAddFriend={this.addfriendClick.bind(this)}
								onCloseFull={this.chatCloseFull.bind(this)}
								withdrawMessage={this.withdrawMessage.bind(
									this
								)}
								getMessageExtensionScriptListAction={
									getMessageExtensionScriptListAction
								}
								clearExtensionScriptListAction={
									clearExtensionScriptListAction
								}
								messageExtensionScriptList={
									messageExtensionScriptList
								}
							/>
						)}

					{(messageType == "single" ||
						messageType == "qun" ||
						messageType == "tongxunlu") &&
						(!targetChatList || targetChatList.length <= 0) &&
						!isShowProving && <EmptyChat />}

					{messageType === "pyq" &&
						(!isShowCommentList && !isShowCreate) && <EmptyChat />}
					{messageType == "tongxunlu" &&
						isShowProving &&
						messageFriendValid &&
						messageFriendValid.friendacceptusers &&
						messageFriendValid.friendacceptusers.length > 0 && (
							<ProvingBox
								data={messageFriendValid.friendacceptusers}
								task={getFriendValidTask}
							/>
						)}
					{messageType === "pyq" && isShowCommentList && (
						<CommentList
							data={commentList}
							onReplay={this.openReply.bind(this)}
						/>
					)}
					{messageType === "pyq" && isShowCreate && (
						<Create
							createUserTaskAction={createUserTaskAction}
							accountID={accountID}
							onCancel={this.closeCreate.bind(this)}
						/>
					)}
					{isShowPhoneList && targetChatList.length > 0 && (
						<div className="chat-phone">
							{targetChatList.map((v: any, i: number) => {
								return (
									<PhoneBox
										key={v.accountID + "_" + v.talk_id}
										onDelete={this.deleteTargetChat.bind(
											this,
											i
										)}
										isFocus={targetIndex == i}
										data={
											messageList &&
											messageList[
												`${v.accountID}_${v.talk_id}`
											]
										}
										isActive={this.getActive(v.accountID)}
										onClick={this.phoneClick.bind(this, i)}
										ref={`${v.accountID}_${v.talk_id}`}
										onSend={this.sendMessage.bind(this, v)}
										onFull={this.chatFull.bind(this, i)}
										talkerData={v}
										withdrawMessage={this.withdrawMessage.bind(
											this
										)}
									/>
								);
							})}
						</div>
					)}
				</div>
				{accountID &&
					accountID.length > 0 &&
					isShowQun &&
					this.getDevicesIds().indexOf(accountID) != -1 && (
						<SelectFriend
							visible={isShowQun}
							onCancel={this.closeQun.bind(this)}
							data={txlList2}
							getData={getTxlList2Action}
							accountID={accountID}
							onOk={this.setQun.bind(this)}
							outData={qunUser}
						/>
					)}

				<Reply
					visible={isShowReply}
					onCancel={this.closeReply.bind(this)}
					onOk={this.commentOk.bind(this)}
				/>
				{isShowAddFriend && (
					<AddFriend
						visible={isShowAddFriend}
						onCancel={this.closeAddFriend.bind(this)}
						onOk={this.addfriendByTxl.bind(this)}
					/>
				)}
			</div>
		);
	}
}
