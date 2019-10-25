import * as React from "react";
import {
	Input,
	Button,
	Radio,
	Icon,
	Checkbox,
	TimePicker,
	Modal,
	message
} from "antd";
import InputBox from "@component/inputbox";
import SimpleTask from "../newsimple";
import { requestUrl } from "../../../../config";
import * as moment from "moment";
import Toast from "@component/toast";
import "./index.less";
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	uploadAction?: Function;
	workData?: any;
	targetType?: string | void;
	targetSubType?: string | void;
}
interface State {
	picnumber: number;
	usePicType: number;
	Pyq_sentshuoshuo: SentShuosho;
}
interface SentShuosho {
	time: any;
	Msgs: string[];
	Pics: any[];
	Pic_type: number;
	Pic_num: number;
	Self_zan: boolean;
	Self_gps: boolean;
	Comments: string[];
}

export default class Pyq extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		picnumber: 1,
		usePicType: 0,
		Pyq_sentshuoshuo: {
			time: null,
			Msgs: [""],
			Pics: [],
			Pic_type: 0,
			Pic_num: 1,
			Self_zan: false,
			Self_gps: false,
			Comments: [""]
		}
	};
	sentShuoshuoTimeChange(e: any) {
		this.setState({
			Pyq_sentshuoshuo: { ...this.state.Pyq_sentshuoshuo, time: e }
		});
	}
	addMoreText() {
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Msgs: [...this.state.Pyq_sentshuoshuo.Msgs, ""]
			}
		});
	}
	MsgsChange(idx: number, e: any) {
		let { Pyq_sentshuoshuo } = this.state;
		let msgs = Pyq_sentshuoshuo.Msgs;
		msgs[idx] = e.target.value;
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Msgs: [...msgs]
			}
		});
	}
	addMoreComment() {
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Comments: [...this.state.Pyq_sentshuoshuo.Comments, ""]
			}
		});
	}
	deleteText(type: string, idx: number) {
		Modal.confirm({
			title: "提示",
			content: `您确定删除这条${type == "Comments" ? "评论" : "文字"}?`,
			onOk: () => {
				let { Pyq_sentshuoshuo }: any = this.state;
				let list: any = Pyq_sentshuoshuo[type];
				list.splice(idx, 1);
				let set: any = {
					Pyq_sentshuoshuo: {
						...this.state.Pyq_sentshuoshuo,
						[type]: [...list]
					}
				};

				this.setState({
					...set
				});
			}
		});
	}
	commentChange(idx: number, e: any) {
		let { Pyq_sentshuoshuo } = this.state;
		let comments = Pyq_sentshuoshuo.Comments;
		comments[idx] = e.target.value;
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Comments: [...comments]
			}
		});
	}
	async saveClick(type: string, time?: string) {
		let { Pyq_sentshuoshuo } = this.state;
		let { selectedData, createUserTaskAction } = this.props;

		let params: any = {
			type: "Pyq"
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
		if (type == "Pyq_sentshuoshuo") {
			params.sub_type = "Pyq_sentshuoshuo";
			params.execute_hi =
				Pyq_sentshuoshuo && Pyq_sentshuoshuo.time
					? Pyq_sentshuoshuo.time.format("HHmm")
					: "0";
			let newMsgs = Pyq_sentshuoshuo.Msgs.filter((item: string) => {
				if (item.trim().length > 0) {
					return item;
				}
			});
			if (newMsgs.length <= 0) {
				message.error("必须存在一条文字内容");
				return;
			}
			let newComments = Pyq_sentshuoshuo.Comments.filter(
				(item: string) => {
					if (item.trim().length > 0) {
						return item;
					}
				}
			);
			let newPics: any = [];
			Pyq_sentshuoshuo.Pics.map((item: any) => {
				newPics.push(item.url);
			});
			params.Pyq_sentshuoshuo = {
				Self_zan: Pyq_sentshuoshuo.Self_zan,
				Self_gps: Pyq_sentshuoshuo.Self_gps,
				Pic_type: Pyq_sentshuoshuo.Pic_type,
				Pic_num: Pyq_sentshuoshuo.Pic_num,
				Msgs: newMsgs,
				Comments: newComments,
				Pics: newPics
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
	PicsChange(e: any) {
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Pics: [
					...this.state.Pyq_sentshuoshuo.Pics,
					{
						url: e[0].url
					}
				]
			}
		});
	}
	deletePics(idx: number) {
		let list = this.state.Pyq_sentshuoshuo.Pics;
		list.splice(idx, 1);
		let pcis = this.state.Pyq_sentshuoshuo.Pic_num;
		if (list.length < this.state.Pyq_sentshuoshuo.Pic_num) {
			if (list.length <= 6) {
				pcis = 6;
			}
			if (list.length <= 4) {
				pcis = 4;
			}
			if (list.length <= 3) {
				pcis = 3;
			}
			if (list.length <= 1) {
				pcis = 1;
			}
		}
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Pics: [...list],
				Pic_num: pcis
			}
		});
	}
	PicTypeChange(e: any) {
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Pic_type: e.target.value
			}
		});
	}
	PicNumChange(e: any) {
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Pic_num: e.target.value
			}
		});
	}
	checkBoxChange(type: string, e: any) {
		let set: any = {
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				[type]: e.target.checked
			}
		};
		this.setState({
			...set
		});
	}
	timeOpen(e: boolean) {
		if (e) {
			this.setState({
				Pyq_sentshuoshuo: {
					...this.state.Pyq_sentshuoshuo,
					time: moment()
				}
			});
		}
	}
	render() {
		let { usePicType, picnumber, Pyq_sentshuoshuo } = this.state;
		let { workData, targetType, targetSubType } = this.props;

		return (
			<div className="taskcreate-pyq">
				{targetSubType && targetSubType == "Pyq_sentshuoshuo" && (
					<div className="group">
						{/* <div className="group-title">
							<div className="text">发说说</div>
							<Button
								className="btn"
								type="primary"
								onClick={this.saveClick.bind(
									this,
									"Pyq_sentshuoshuo"
								)}
							>
								立即执行
							</Button>
						</div> */}
						<div className="group-content">
							<InputBox labelName="执行时间">
								<TimePicker
									className="w100"
									format="HH:mm"
									value={
										Pyq_sentshuoshuo &&
										Pyq_sentshuoshuo.time
									}
									onChange={this.sentShuoshuoTimeChange.bind(
										this
									)}
									onOpenChange={this.timeOpen.bind(this)}
								/>
							</InputBox>
							<InputBox labelName="文字" flexTop={true}>
								<div className="w100">
									<div className="mgt10 w100">
										{Pyq_sentshuoshuo &&
											Pyq_sentshuoshuo.Msgs &&
											Pyq_sentshuoshuo.Msgs.length > 0 &&
											Pyq_sentshuoshuo.Msgs.map(
												(item: string, idx: number) => {
													return (
														<div
															className="textarea-box"
															key={idx}
														>
															<TextArea
																className="textarea"
																value={item}
																onChange={this.MsgsChange.bind(
																	this,
																	idx
																)}
																autosize={true}
															/>
															{Pyq_sentshuoshuo &&
																Pyq_sentshuoshuo.Msgs &&
																Pyq_sentshuoshuo
																	.Msgs
																	.length >
																	1 && (
																	<Icon
																		type="delete"
																		className="delete"
																		onClick={this.deleteText.bind(
																			this,
																			"Msgs",
																			idx
																		)}
																	/>
																)}
														</div>
													);
												}
											)}
									</div>
									<Button
										type="primary"
										className="mgt10"
										size="small"
										onClick={this.addMoreText.bind(this)}
									>
										添加文字
									</Button>
								</div>
							</InputBox>
							<InputBox
								labelName="图片/视频"
								flexTop={true}
								type="uploader-img"
								autoWidth={true}
								value={
									Pyq_sentshuoshuo && Pyq_sentshuoshuo.Pics
								}
								customRequest={true}
								domain={requestUrl() + "/upload"}
								onChange={this.PicsChange.bind(this)}
								deleteUplodaValue={this.deletePics.bind(this)}
								playVideo={true}
								limitDuration={10 * 1000}
								limitType={["jpg", "jpeg", "png", "mp4"]}
								limitSize={1024 * 1024 * 5}
								multiple={true}
								desc={
									<div className="w100">
										<div className="flex ac">
											<div className="t">
												发表图片张数
											</div>
											<RadioGroup
												value={
													Pyq_sentshuoshuo &&
													Pyq_sentshuoshuo.Pic_type
												}
												onChange={this.PicTypeChange.bind(
													this
												)}
											>
												<Radio value={0}>不限</Radio>
												<Radio value={1}>上传数</Radio>
											</RadioGroup>
											{Pyq_sentshuoshuo &&
												Pyq_sentshuoshuo.Pic_type ==
													1 && (
													<RadioGroup
														value={
															Pyq_sentshuoshuo &&
															Pyq_sentshuoshuo.Pic_num
														}
														onChange={this.PicNumChange.bind(
															this
														)}
													>
														{Pyq_sentshuoshuo &&
															Pyq_sentshuoshuo
																.Pics.length >=
																1 && (
																<Radio
																	value={1}
																>
																	1张
																</Radio>
															)}
														{Pyq_sentshuoshuo &&
															Pyq_sentshuoshuo
																.Pics.length >=
																3 && (
																<Radio
																	value={3}
																>
																	3张
																</Radio>
															)}
														{Pyq_sentshuoshuo &&
															Pyq_sentshuoshuo
																.Pics.length >=
																4 && (
																<Radio
																	value={4}
																>
																	4张
																</Radio>
															)}
														{Pyq_sentshuoshuo &&
															Pyq_sentshuoshuo
																.Pics.length >=
																6 && (
																<Radio
																	value={6}
																>
																	6张
																</Radio>
															)}
														{Pyq_sentshuoshuo &&
															Pyq_sentshuoshuo
																.Pics.length >=
																9 && (
																<Radio
																	value={9}
																>
																	9张
																</Radio>
															)}
													</RadioGroup>
												)}
										</div>
									</div>
								}
							/>
							{/* <InputBox labelName="定位">
							<Checkbox
								checked={
									Pyq_sentshuoshuo &&
									Pyq_sentshuoshuo.Self_gps
								}
								onChange={this.checkBoxChange.bind(
									this,
									"Self_gps"
								)}
							>
								{Pyq_sentshuoshuo && Pyq_sentshuoshuo.Self_gps
									? "打开"
									: "关闭"}
							</Checkbox>
						</InputBox> */}
							<InputBox labelName="自赞">
								<Checkbox
									checked={
										Pyq_sentshuoshuo &&
										Pyq_sentshuoshuo.Self_zan
									}
									onChange={this.checkBoxChange.bind(
										this,
										"Self_zan"
									)}
								>
									{Pyq_sentshuoshuo &&
									Pyq_sentshuoshuo.Self_zan
										? "打开"
										: "关闭"}
								</Checkbox>
							</InputBox>
							<InputBox labelName="自评" flexTop={true}>
								<div className="w100">
									<div className="mgt10 w100">
										{Pyq_sentshuoshuo &&
											Pyq_sentshuoshuo.Comments &&
											Pyq_sentshuoshuo.Comments.length >
												0 &&
											Pyq_sentshuoshuo.Comments.map(
												(item: any, idx: number) => {
													return (
														<div
															className="textarea-box"
															key={idx}
														>
															<TextArea
																value={item}
																onChange={this.commentChange.bind(
																	this,
																	idx
																)}
																className="textarea"
															/>
															{Pyq_sentshuoshuo &&
																Pyq_sentshuoshuo.Comments &&
																Pyq_sentshuoshuo
																	.Comments
																	.length >
																	1 && (
																	<Icon
																		type="delete"
																		className="delete"
																		onClick={this.deleteText.bind(
																			this,
																			"Comments",
																			idx
																		)}
																	/>
																)}
														</div>
													);
												}
											)}
									</div>
									<Button
										type="primary"
										className="mgt10"
										size="small"
										onClick={this.addMoreComment.bind(this)}
									>
										添加自评
									</Button>
								</div>
							</InputBox>
							<InputBox>
								<Button
									className="btn"
									type="primary"
									onClick={this.saveClick.bind(
										this,
										"Pyq_sentshuoshuo"
									)}
								>
									立即执行
								</Button>
							</InputBox>
						</div>
					</div>
				)}
				{targetSubType && targetSubType == "Pyq_delete" && (
					<SimpleTask
						labelName="删除我的朋友圈(随机)"
						type="Pyq_delete"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "Pyq_liulan" && (
					<SimpleTask
						labelName="浏览朋友圈"
						type="Pyq_liulan"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "Pyq_dakaiyuedu" && (
					<SimpleTask
						labelName="打开阅读(随机)"
						type="Pyq_dakaiyuedu"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "Pyq_zhuanfa_chat" && (
					<SimpleTask
						labelName="转发链接到聊天(随机)"
						type="Pyq_zhuanfa_chat"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "Pyq_zhuanfa_pyq" && (
					<SimpleTask
						labelName="转发链接到朋友圈(随机)"
						type="Pyq_zhuanfa_pyq"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "Pyq_sc" && (
					<SimpleTask
						labelName="朋友圈收藏(随机)"
						type="Pyq_sc"
						onOk={this.saveClick.bind(this)}
					/>
				)}

				{targetSubType && targetSubType == "Pyq_dianzan" && (
					<SimpleTask
						labelName="点赞(随机)"
						type="Pyq_dianzan"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{targetSubType && targetSubType == "Pyq_share_link" && (
					<SimpleTask
						labelName="分享第三方链接"
						type="Pyq_share_link"
						onOk={this.saveClick.bind(this)}
					/>
				)}

				{/* {(!workData ||
					(!workData.SendPyq &&
						!workData.DeletePyq &&
						!workData.BrowsePyq &&
						!workData.ReadPyq &&
						!workData.ForwardPyq &&
						!workData.ForwardLinkPyq &&
						!workData.ScPyq &&
						!workData.Pyq_dianzan &&
						!workData.Pyq_share_link)) && (
					<div className="nodatabox">系统设置不允许手动任务</div>
				)} */}

				{/* <SimpleTask
					labelName="图片下载(随机)"
					type="Pyq_download_pic"
					onOk={this.saveClick.bind(this)}
				/>
				<SimpleTask
					labelName="视频下载(随机)"
					type="Pyq_download_video"
					onOk={this.saveClick.bind(this)}
				/> */}
			</div>
		);
	}
}
