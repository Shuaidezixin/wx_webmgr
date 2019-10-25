import * as React from "react";
import { message, Modal, TimePicker, Button, Icon } from "antd";
import * as moment from "moment";
import InputBox from "@component/inputbox";
import Face, { insetFace } from "@component/face";
import SendImage from "@component/sendimg";
import Toast from "@component/toast";
import "./index.less";
import SimpleTask from "../newsimple";
interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	workData?: any;
	targetType?: string | void;
	targetSubType?: string | void;
}
interface State {
	ExtensionScript: ChatData;
	ChatConfig_QunFa: ChatData;
	script: string[];
}
interface ChatData {
	time: any;
	name: string;
}

export default class Chat extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		ExtensionScript: { time: null, name: "" },
		script: [""],
		ChatConfig_QunFa: { time: null, name: "" }
	};
	async saveClick(type: string, time: string) {
		let { selectedData, createUserTaskAction } = this.props;
		let state: any = this.state;
		let params: any = {
			type: "ChatConfig"
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
		params.sub_type = type;
		params.execute_hi = time;
		params[type] = {};
		switch (type) {
			case "ChatConfig_ExtensionScript":
				let { script } = this.state;
				let r: string[] = [];
				if (script && script.length > 0) {
					script.map((v: string) => {
						if (v && v.trim().length > 0) {
							r.push(v.trim());
						}
					});
				}
				if (!r || r.length <= 0) {
					message.error("至少存在一条对话");
					return;
				}
				params.execute_hi = state["ExtensionScript"].time
					? state["ExtensionScript"].time.format("HHmm")
					: "0";
				params[type].Name = r;
				break;
			case "ChatConfig_QunFa":
				let { ChatConfig_QunFa } = this.state;
				params[type].name = ChatConfig_QunFa.name;
				params.execute_hi = state["ChatConfig_QunFa"].time
					? state["ChatConfig_QunFa"].time.format("HHmm")
					: "0";
				break;
			default:
				params[type].Name = "";
				break;
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
	inputChange(i: number, e: any) {
		let { script } = this.state;
		script[i] = e.target.value;
		this.setState({
			script: [...script]
		});
	}
	faceClick(idx: number, data: string) {
		let { script } = this.state;
		script[idx] = window.Util.insertText(
			this.refs[`script-input-${idx}`],
			`[${data}]`
		);
		this.setState({
			script: [...script]
		});
	}
	sendImg(idx: number, url: string) {
		let { script } = this.state;
		script[idx] = url;
		this.setState({
			script: [...script]
		});
	}
	timeChange(type: string, e: any) {
		let state: any = this.state;
		let set: any = {
			[type]: {
				...state[type],
				time: e
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
	isImg(data: string) {
		if (!data || data.length <= 0) {
			return false;
		}
		let reg = /^https?:\/\/.*?.(png|jpg|jpeg)$/gi;
		return reg.test(data);
	}
	deleteImg(idx: number) {
		let { script } = this.state;
		script[idx] = "";
		this.setState({
			script: [...script]
		});
	}
	deleteLine(idx: number) {
		let { script } = this.state;
		script.splice(idx, 1);
		this.setState({
			script: [...script]
		});
	}
	addLine() {
		let { script } = this.state;
		script.push("");
		this.setState({
			script: [...script]
		});
	}
	qunfaChange(e: any) {
		this.setState({
			ChatConfig_QunFa: {
				...this.state.ChatConfig_QunFa,
				name: e
			}
		});
	}
	render() {
		let { workData, targetType, targetSubType } = this.props;
		let { script, ChatConfig_QunFa } = this.state;
		return (
			<div className="chatcreate-task">
				{targetSubType &&
					targetSubType == "ChatConfig_ExtensionScript" && (
						<div className="group">
							<div className="group-content">
								<InputBox labelName="执行时间" flexTop={true}>
									<div className="w100">
										<TimePicker
											className="w100"
											format="HH:mm"
											onChange={this.timeChange.bind(
												this,
												"ExtensionScript"
											)}
											onOpenChange={this.timeOpen.bind(
												this,
												"ExtensionScript"
											)}
										/>
									</div>
								</InputBox>
								<InputBox>
									<div className="script-box">
										<div>
											<div className="script-item script-header">
												<div className="script-num">
													序号
												</div>
												<div className="script-content">
													内容
												</div>
												<div className="script-ctrl">
													操作
												</div>
											</div>
											{script &&
												script.length > 0 &&
												script.map(
													(v: any, i: number) => {
														return (
															<div
																className="script-item"
																key={i}
															>
																<div className="script-num">
																	{i + 1}
																</div>
																<div className="script-content">
																	{this.isImg(
																		v
																	) ? (
																		<div className="inner">
																			<div className="inner-img">
																				<img
																					src={
																						v
																					}
																				/>
																				<div
																					className="cover"
																					onClick={this.deleteImg.bind(
																						this,
																						i
																					)}
																				>
																					<Icon
																						type="delete"
																						className="img-delete"
																					/>
																				</div>
																			</div>
																		</div>
																	) : (
																		<React.Fragment>
																			<input
																				type="text"
																				className="inner"
																				value={
																					v
																				}
																				onChange={this.inputChange.bind(
																					this,
																					i
																				)}
																				ref={`script-input-${i}`}
																			/>
																			<Face
																				onClick={this.faceClick.bind(
																					this,
																					i
																				)}
																			/>
																		</React.Fragment>
																	)}

																	<SendImage
																		onSend={this.sendImg.bind(
																			this,
																			i
																		)}
																		buttonText="确定"
																	/>
																</div>
																<div className="script-ctrl">
																	{script &&
																		script.length >
																			1 && (
																			<Icon
																				type="delete"
																				className="delete-icon"
																				onClick={this.deleteLine.bind(
																					this,
																					i
																				)}
																			/>
																		)}
																</div>
															</div>
														);
													}
												)}
										</div>
										<span
											className="addline"
											onClick={this.addLine.bind(this)}
										>
											添加行
										</span>
									</div>
								</InputBox>
								<InputBox>
									<Button
										className="btn"
										type="primary"
										onClick={this.saveClick.bind(
											this,
											"ChatConfig_ExtensionScript"
										)}
									>
										立即执行
									</Button>
								</InputBox>
							</div>
						</div>
					)}
				{targetSubType && targetSubType == "ChatConfig_Sc" && (
					<SimpleTask
						labelName="聊天收藏（随机）"
						type="ChatConfig_Sc"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "ChatConfig_One_Top" && (
					<SimpleTask
						labelName="单聊-置顶聊天（随机）"
						type="ChatConfig_One_Top"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType &&
					targetSubType == "ChatConfig_One_Miandarao" && (
						<SimpleTask
							labelName="单聊-消息免打扰（随机）"
							type="ChatConfig_One_Miandarao"
							onOk={this.saveClick.bind(this)}
						/>
					)}
				{targetSubType &&
					targetSubType == "ChatConfig_One_Qiangtixing" && (
						<SimpleTask
							labelName="单聊-强提醒（随机）"
							type="ChatConfig_One_Qiangtixing"
							onOk={this.saveClick.bind(this)}
						/>
					)}
				{targetSubType && targetSubType == "ChatConfig_One_Backpic" && (
					<SimpleTask
						labelName="设置聊天背景（随机）"
						type="ChatConfig_One_Backpic"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType &&
					targetSubType == "ChatConfig_One_ClearContent" && (
						<SimpleTask
							labelName="单聊-清空聊天记录（随机）"
							type="ChatConfig_One_ClearContent"
							onOk={this.saveClick.bind(this)}
						/>
					)}
				{/* {workData && workData.NewGroup && (
					<SimpleTask
						labelName="群聊-新建群聊（随机）"
						type="ChatConfig_Group_New"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.AddGroupFriend && (
					<SimpleTask
						labelName="群聊-邀请好友加群（随机）"
						type="ChatConfig_Group_Addfrined"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.DeleteGroupFriend && (
					<SimpleTask
						labelName="群聊-删除群好友（随机）"
						type="ChatConfig_Group_Deletefrined"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.UpdateGroupName && (
					<SimpleTask
						labelName="群聊-修改群名称（随机）"
						type="ChatConfig_Group_NameUpdate"
						onOk={this.saveClick.bind(this)}
					/>
				)} */}
				{targetSubType &&
					targetSubType == "ChatConfig_Group_Miandaran" && (
						<SimpleTask
							labelName="群聊-消息免打扰（随机）"
							type="ChatConfig_Group_Miandaran"
							onOk={this.saveClick.bind(this)}
						/>
					)}
				{targetSubType && targetSubType == "ChatConfig_Group_Save" && (
					<SimpleTask
						labelName="群聊-保存到通讯录（随机）"
						type="ChatConfig_Group_Save"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType &&
					targetSubType == "ChatConfig_Group_ShowNickname" && (
						<SimpleTask
							labelName="群聊-显示群成员昵称（随机）"
							type="ChatConfig_Group_ShowNickname"
							onOk={this.saveClick.bind(this)}
						/>
					)}
				{targetSubType && targetSubType == "ChatConfig_Group_Top" && (
					<SimpleTask
						labelName="群聊-置顶群聊（随机）"
						type="ChatConfig_Group_Top"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "ChatConfig_Group_Clear" && (
					<SimpleTask
						labelName="群聊-清空聊天记录（随机）"
						type="ChatConfig_Group_Clear"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType &&
					targetSubType == "ChatConfig_AddPackageBiaoqin" && (
						<SimpleTask
							labelName="添加表情商店表情包"
							type="ChatConfig_AddPackageBiaoqin"
							onOk={this.saveClick.bind(this)}
						/>
					)}
				{targetSubType &&
					targetSubType == "ChatConfig_RemovePackageBiaoqin" && (
						<SimpleTask
							labelName="移除表情包"
							type="ChatConfig_RemovePackageBiaoqin"
							onOk={this.saveClick.bind(this)}
						/>
					)}
				{targetSubType &&
					targetSubType == "ChatConfig_LookPackageBiaoqin" && (
						<SimpleTask
							labelName="浏览表情包"
							type="ChatConfig_LookPackageBiaoqin"
							onOk={this.saveClick.bind(this)}
						/>
					)}
				{targetSubType && targetSubType == "ChatConfig_QunFa" && (
					<div className="group">
						<InputBox labelName="执行时间" flexTop={true}>
							<div className="w100">
								<TimePicker
									className="w100"
									format="HH:mm"
									onChange={this.timeChange.bind(
										this,
										"ChatConfig_QunFa"
									)}
									onOpenChange={this.timeOpen.bind(
										this,
										"ChatConfig_QunFa"
									)}
								/>
							</div>
						</InputBox>
						<InputBox
							labelName="群发内容"
							value={ChatConfig_QunFa && ChatConfig_QunFa.name}
							onChange={this.qunfaChange.bind(this)}
							placeholder="请输入内容"
						/>
						<InputBox>
							<Button
								className="btn"
								type="primary"
								onClick={this.saveClick.bind(
									this,
									"ChatConfig_QunFa"
								)}
							>
								立即执行
							</Button>
						</InputBox>
					</div>
				)}
				{/* {workData && workData.DeleteGroup && (
					<SimpleTask
						labelName="群聊-删除并退出（随机）"
						type="ChatConfig_Group_DeleteAndQuit"
						onOk={this.saveClick.bind(this)}
					/>
				)} */}
				{/* {(!workData ||
					(!workData.ChatSc &&
						!workData.ChatTop &&
						!workData.ChatDonNotDisturb &&
						!workData.ChatDisturb &&
						!workData.ChatBackGround &&
						!workData.ClearChat &&
						// !workData.NewGroup &&
						// !workData.AddGroupFriend &&
						// !workData.DeleteGroupFriend &&
						// !workData.UpdateGroupName &&
						!workData.GroupDonNotDisturb &&
						!workData.SaveGroup &&
						!workData.ShowGroupMemberNickName &&
						!workData.GroupTop &&
						!workData.ClearGroup)) && (
					//!workData.DeleteGroup
					<div className="nodatabox">系统设置不允许手动任务</div>
				)} */}
				{/* <SimpleTask
					labelName="群聊-设置聊天背景（随机）"
					type="ChatConfig_Group_Backpic"
					onOk={this.saveClick.bind(this)}
				/> */}
				{/* <SimpleTask
					labelName="添加聊天的表情（随机）"
					type="ChatConfig_AddBiaoqin"
					onOk={this.saveClick.bind(this)}
				/>
				<SimpleTask
					labelName="移除我添加的表情（随机）"
					type="ChatConfig_RemoveBiaoqin"
					onOk={this.saveClick.bind(this)}
				/>
				 */}
			</div>
		);
	}
}
