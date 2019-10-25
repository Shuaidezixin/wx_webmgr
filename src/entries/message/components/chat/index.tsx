import * as React from "react";
import { Input, Button, Icon, message, Modal } from "antd";
import Scrollbars from "react-custom-scrollbars";
import ChatItem from "../chatitem";
import Face from "@component/face";
import SendImage from "@component/sendimg";
import Editor from "@component/editor";
import * as classnames from "classnames";

import InfoItem from "../infoitem";
import "./index.less";

const TextArea = Input.TextArea;

interface Props {
	data?: any;
	sendClick?: Function;
	updateInfo?: Function;
	isLoading?: boolean;
	info?: any;
	onPlus?: Function;
	onAddFriend?: Function;
	onCloseFull?: Function;
	onClose?: Function;
	withdrawMessage?: Function;
	messageExtensionScriptList?: any;
	getMessageExtensionScriptListAction?: Function;
	clearExtensionScriptListAction?: Function;
	isActive?: boolean;
}
interface State {
	name: string;
	messageText: string;
	imgUrl: string;
	isShowInfo: boolean;
}

export default class Chat extends React.PureComponent<Props, State> {
	private timer: any = 0;
	private MessageBox: React.RefObject<Scrollbars>;
	private SpreadBox: React.RefObject<Scrollbars>;
	private Editor: any;
	constructor(props: Props) {
		super(props);
		this.MessageBox = React.createRef();
		this.SpreadBox = React.createRef();
		this.Editor = React.createRef();
	}

	static readonly defaultProps: Props = {};
	readonly state: State = {
		name: "",
		messageText: "",
		imgUrl: "",
		isShowInfo: false
	};
	componentDidMount() {
		this.init();
		this.getExtensionScript();
	}
	openInfo() {
		this.setState({
			isShowInfo: true
		});
	}
	closeInfo() {
		this.setState({
			isShowInfo: false
		});
	}
	componentDidUpdate(prevProps: any) {
		if (!prevProps.data && this.props.data) {
			setTimeout(() => {
				this.MessageBox.current.scrollToBottom();
			}, 10);
		}
		this.init();
		if (JSON.stringify(prevProps.info) != JSON.stringify(this.props.info)) {
			this.props.clearExtensionScriptListAction();
			this.getExtensionScript();
		}
	}
	getExtensionScript() {
		let { info } = this.props;
		let { accountID, talk_id } = info;
		let params: any = {
			account_id: accountID,
			talker_id: talk_id
		};
		this.props.getMessageExtensionScriptListAction(params);
	}
	init() {
		let name = window.sessionStorage.getItem("messageTalkerName");
		if (name && name.length > 0) {
			this.setState({
				name: name
			});
		}
	}
	sendTime(t?: number) {
		let ti: number = 15;
		if (t != undefined) {
			ti = t;
		}
		this.timer = ti;
		if (t == 0) {
			return;
		}
		setTimeout(() => {
			ti--;
			this.sendTime(ti);
		}, 1000);
	}
	async sendClick() {
		let editor: any = this.Editor.current;
		let messageText = editor.getContent();
		let { sendClick, isActive } = this.props;
		if (!isActive) {
			message.error("账号不在活动状态");
			return;
		}

		if (sendClick && typeof sendClick === "function") {
			sendClick(this.props.info, { content: messageText });
			this.Editor.current.clearContent();
		}
		// this.props.sendClick(this.props.info, messageText);
		// let imgs = messageText.match(/\<img.*?\/\>/g);
		// if (imgs && imgs.length > 0) {
		// 	imgs.map((item: any) => {
		// 		let url = item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
		// 		if (url && url.length > 0 && url.indexOf("http") != -1) {
		// 			this.sendImg(url);
		// 		}
		// 	});
		// }
		// messageText = messageText.replace(/\<p\>\<\/p\>/g, "");
		// messageText = messageText.replace(/\<\/p\>/g, "</p>\r\n");
		// messageText = messageText.replace(/<\/?.+?>/g, "");

		// if (
		// 	!accountID ||
		// 	!talkerID ||
		// 	accountID.length <= 0 ||
		// 	talkerID.length <= 0 ||
		// 	messageText.length <= 0 ||
		// 	this.timer != 0
		// ) {
		// 	editor.clearContent();
		// 	this.setState(
		// 		{
		// 			messageText: ""
		// 		},
		// 		() => {
		// 			this.MessageBox.current.scrollToBottom();
		// 		}
		// 	);
		// 	return;
		// }
		// let params: any = {
		// 	account_id: accountID,
		// 	talker_id: talkerID,
		// 	type: 1,
		// 	content: messageText
		// };
		// if (sendClick && typeof sendClick === "function") {
		// 	let res = await sendClick({
		// 		...params
		// 	});
		// 	if (res && res.code == 200) {
		// 		//this.sendTime();
		// 		editor.clearContent();
		// 		this.setState(
		// 			{
		// 				messageText: ""
		// 			},
		// 			() => {
		// 				this.MessageBox.current.scrollToBottom();
		// 			}
		// 		);
		// 	}
		// }
	}

	faceClick(word: string) {
		this.Editor.current.insertText(`[${word}]`);
	}
	async sendImg(url: string) {
		let { sendClick, isActive } = this.props;
		if (!isActive) {
			message.error("账号不在活动状态");
			return;
		}
		if (sendClick && typeof sendClick === "function") {
			let regImg = /^https?:\/\/.*?.(jpg|jpeg|png|gif)$/gi;
			let regMp4 = /^https?:\/\/.*?.mp4$/gi;
			let content: string = "";
			if (regImg.test(url)) {
				content = `<img src='${url}' />`;
			}
			if (regMp4.test(url)) {
				content = `<video src='${url}' />`;
			}
			sendClick(this.props.info, { content: content });
			this.Editor.current.clearContent();
		}
	}
	messageChange() {
		//let editor: any = this.Editor.current;
	}
	// 更新信息
	async updateInfo(type: string, str: string) {
		let accountID = window.sessionStorage.getItem("messageAccountId");
		let talkerID = window.sessionStorage.getItem("messageTalkerID");
		let t: number;
		switch (type) {
			case "note_name":
				t = 1;
				break;
			case "tag":
				t = 2;
				break;
			case "note_msg":
				t = 3;
				break;
			case "group_name":
				t = 4;
				break;
			case "nickname":
				t = 5;
				break;
		}
		// if (!str || str.trim().length <= 0) {
		// 	message.error(type + "不能为空");
		// 	return;
		// }

		let params: any = {
			account_id: accountID,
			talker_id: talkerID,
			type: t,
			msg: str
		};
		this.props.updateInfo(params);
	}
	plusClick() {
		let { onPlus, info } = this.props;
		let data: any = [];
		if (info && info.groups) {
			info.groups.map((v: any) => {
				if (!v.is_self) {
					v.nickname = v.nick_name;
					data.push(v);
				}
			});
		}
		if (onPlus && typeof onPlus === "function") {
			onPlus({
				users: data,
				talk_id: info.talk_id
			});
		}
	}
	addFriendClick(data: any) {
		if (!data) {
			return;
		}
		let { info } = this.props;
		Modal.confirm({
			title: "提示",
			content: `你确定添加${data.nick_name}为好友吗？`,
			onOk: async () => {
				let { onAddFriend } = this.props;
				if (onAddFriend && typeof onAddFriend === "function") {
					onAddFriend({
						Name: info.talk_id,
						Usernames: [data.talk_id]
					});
				}
			}
		});
	}
	closeFull() {
		let { onCloseFull } = this.props;
		if (onCloseFull && typeof onCloseFull === "function") {
			onCloseFull();
		}
	}
	scrollToBottom() {
		this.MessageBox.current.scrollToBottom();
	}
	closeClick() {
		let { onClose } = this.props;
		if (onClose && typeof onClose === "function") {
			onClose();
		}
	}
	render() {
		let {
			data,
			isLoading,
			info,
			withdrawMessage,
			messageExtensionScriptList
		} = this.props;
		let { name, messageText, isShowInfo } = this.state;

		return (
			<div className="chat-component">
				<div className="chat-left">
					<div className="chat-name">
						<div className="chat-text">
							{info
								? info.is_group
									? info.group_name +
									  `(${info.groups.length})`
									: info.talk_name
								: ""}
						</div>
						<div>
							<Icon
								type="fullscreen-exit"
								className="more"
								onClick={this.closeFull.bind(this)}
							/>
							<Icon
								type="close"
								className="more"
								onClick={this.closeClick.bind(this)}
							/>
						</div>
					</div>
					<div className="chat-box">
						<Scrollbars autoHide={true} ref={this.MessageBox}>
							{isLoading && (
								<div className="tip">
									<Icon type="loading-3-quarters" spin />
									<span>加载中...</span>
								</div>
							)}
							{!isLoading &&
								data &&
								data.message &&
								data.message.length > 0 &&
								data.total > data.message.length && (
									<div className="tip">
										<span>
											<i className="more">查看更多</i>
										</span>
									</div>
								)}
							{(!data ||
								!data.message ||
								data.message.length <= 0) && (
								<div className="tip">
									<span>暂无消息</span>
								</div>
							)}
							{data &&
								data.message &&
								data.message.length > 0 &&
								data.message.map((v: any, idx: number) => {
									return (
										<ChatItem
											withdrawMessage={withdrawMessage}
											isGroup={info && info.is_group}
											key={idx}
											ownImg={info && info.accountImg}
											isOwn={v.isSend == 1}
											data={v}
										/>
									);
								})}
						</Scrollbars>
					</div>
					<div className="chat-ctrl">
						<div
							className="chat-ctrl-left"
							onClick={(e: any) => {
								e.nativeEvent.stopImmediatePropagation;
							}}
						>
							<Face onClick={this.faceClick.bind(this)} />
							<SendImage
								onSend={this.sendImg.bind(this)}
								supportVideo={true}
							/>
						</div>
						<Button
							type="primary"
							onClick={this.sendClick.bind(this)}
						>
							发送
						</Button>
					</div>
					<div className="chat-input textarea-box">
						<Scrollbars
							style={{
								maxHeight: "300px",
								minHeight: "201px",
								border: "1px solid #ccc"
							}}
						>
							<Editor
								ref={this.Editor}
								style={{ width: "100%" }}
								value={messageText}
								onChange={this.messageChange.bind(this)}
								onEnter={this.sendClick.bind(this)}
							/>
						</Scrollbars>
					</div>
				</div>
				<div className={classnames("info-box", info && "show")}>
					{info && !info.is_group && (
						<div className="info" style={{ background: "#fff" }}>
							<div className="info-header">信息</div>
							<div className="info-content">
								<InfoItem
									name="昵称"
									value={info && info.nickname}
									canEdit={false}
								/>
								<InfoItem
									name="备注名"
									value={info && info.note_name}
									onBlur={this.updateInfo.bind(
										this,
										"note_name"
									)}
								/>
								<InfoItem
									name="标签"
									canEdit={
										info && info.tag && info.tag.length > 0
											? false
											: true
									}
									value={info && info.tag}
									onBlur={this.updateInfo.bind(this, "tag")}
								/>
								<InfoItem
									name="批注"
									value={info && info.note_msg}
									onBlur={this.updateInfo.bind(
										this,
										"note_msg"
									)}
								/>
							</div>
						</div>
					)}
					{info && info.is_group && (
						<div
							className="info"
							style={{
								background: "#fff",
								width: info && info.is_group ? "300px" : 0
							}}
						>
							<div className="info-header">信息</div>
							<div className="info-content">
								<div className="member-box">
									{info &&
										info.is_group &&
										info.groups &&
										info.groups.length > 0 &&
										info.groups.map(
											(item: any, idx: number) => {
												return (
													<div
														className="member-item"
														key={
															item.talk_id + "idx"
														}
													>
														<img
															src={item.talk_pic}
															className="member-img"
														/>
														<div className="member-text">
															{item.nick_name}
														</div>
														{/* {console.log(
															item,
															item.is_self,
															item.is_friend
														)} */}
														{!item.is_self &&
															!item.is_friend && (
																<div
																	className="addfriend"
																	onClick={this.addFriendClick.bind(
																		this,
																		item
																	)}
																>
																	加好友
																</div>
															)}
													</div>
												);
											}
										)}
									<div
										className="member-item"
										onClick={this.plusClick.bind(this)}
									>
										<div className="member-plus">
											<Icon type="plus" />
										</div>
										<div className="member-text">添加</div>
									</div>
								</div>
								<InfoItem
									name="群名称"
									value={info && info.group_name}
									onBlur={this.updateInfo.bind(
										this,
										"group_name"
									)}
								/>
								<InfoItem
									name="批注"
									value={info && info.note_msg}
									onBlur={this.updateInfo.bind(
										this,
										"note_msg"
									)}
								/>
								{/* <InfoItem
									name="我的昵称"
									value={info && info.nickname}
									onBlur={this.updateInfo.bind(
										this,
										"nickname"
									)}
								/> */}
							</div>
						</div>
					)}

					{messageExtensionScriptList &&
						messageExtensionScriptList.length > 0 && (
							<React.Fragment>
								<div className="spread-title">推广记录</div>
								<div className="spread-box">
									<Scrollbars
										ref={this.SpreadBox}
										autoHide={true}
									>
										{messageExtensionScriptList.map(
											(v: any, i: number) => {
												return (
													<div
														className="spread-item"
														key={i}
													>
														<div className="spread-name">
															{v && v.title}
														</div>
														<div className="spread-time">
															{v && v.createtime}
														</div>
													</div>
												);
											}
										)}
									</Scrollbars>
								</div>
							</React.Fragment>
						)}
				</div>
			</div>
		);
	}
}
