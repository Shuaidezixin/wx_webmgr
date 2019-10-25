import * as React from "react";
import { message, Modal, Button, TimePicker } from "antd";
import * as moment from "moment";
import { requestUrl } from "../../../../config";
import InputBox from "@component/inputbox";
import "./index.less";
import SimpleTask from "../simple";
interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	workData?: any;
}
interface State {
	add_note: Note;
}
interface Note {
	Name: string;
	Pic: any;
	time: any;
}

export default class Sc extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		add_note: {
			Name: "",
			Pic: null,
			time: null
		}
	};
	async saveClick(type?: string, time?: string) {
		let { selectedData, createUserTaskAction } = this.props;
		let state: any = this.state;
		let params: any = {
			type: "SC"
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
		if (type == "add_note") {
			if (
				!state.add_note.Name ||
				state.add_note.Name.trim().length <= 0
			) {
				message.error("内容不能为空");
				return;
			}
			params.sub_type = `SC_${type}`;
			params.execute_hi = state[type].time
				? state[type].time.format("HHmm")
				: "0";
			params[`SC_${type}`] = {
				Name: state.add_note.Name,
				Pic:
					state.add_note &&
					state.add_note.Pic &&
					state.add_note.Pic[0]
						? state.add_note.Pic[0]["url"]
						: ""
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
				Pic: [
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
				Pic: null
			}
		};
		this.setState({
			...set
		});
	}
	render() {
		let { add_note } = this.state;
		let { workData } = this.props;
		return (
			<div className="chatcreate-task">
				{workData && workData.WriteNote && (
					<div className="group">
						<div className="group-title">
							<div className="text">写笔记</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(this, "add_note")}
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
										value={add_note && add_note.time}
										onChange={this.InputChange.bind(
											this,
											"add_note",
											"time"
										)}
									/>
								</div>
							</InputBox>
							<InputBox
								type="textarea"
								value={add_note && add_note.Name}
								placeholder="请输入文字"
								onChange={this.InputChange.bind(
									this,
									"add_note",
									"Name"
								)}
							/>
							<InputBox
								type="uploader-img"
								className="inner"
								desc="不上传图片则随机选择图片"
								domain={requestUrl() + "/upload"}
								length={1}
								limitType={["jpg", "jpeg"]}
								multiple={true}
								customRequest={true}
								onChange={this.uploadImg.bind(this, "add_note")}
								value={add_note && add_note.Pic}
								deleteUplodaValue={this.deleteImg.bind(
									this,
									"add_note"
								)}
							/>
						</div>
					</div>
				)}
				{workData && workData.BrowseSc && (
					<SimpleTask
						labelName="打开预览收藏（随机）"
						type="SC_dakaiyulan"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ReadSc && (
					<SimpleTask
						labelName="阅读收藏（随机）"
						type="SC_read"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.DeleteSc && (
					<SimpleTask
						labelName="删除收藏（随机）"
						type="SC_delete"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ForwardScLinkPyq && (
					<SimpleTask
						labelName="转发链接收藏到朋友圈（随机）"
						type="SC_zhuanfa_link_pyq"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ForwardScLinkChat && (
					<SimpleTask
						labelName="转发链接收藏到聊天（随机）"
						type="SC_zhuanfa_link_chat"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ScreenSc && (
					<SimpleTask
						labelName="筛选收藏（随机）"
						type="SC_shaixuan"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ForwardNotePyq && (
					<SimpleTask
						labelName="转发笔记到朋友圈（随机）"
						type="SC_zhuanfa_note_pyq"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ForwardNoteChat && (
					<SimpleTask
						labelName="转发笔记到聊天（随机）"
						type="SC_zhuanfa_note_chat"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{(!workData ||
					(!workData.WriteNote &&
						!workData.BrowseSc &&
						!workData.ReadSc &&
						!workData.DeleteSc &&
						!workData.ForwardScLinkPyq &&
						!workData.ForwardScLinkChat &&
						!workData.ScreenSc &&
						!workData.ForwardNotePyq &&
						!workData.ForwardNoteChat)) && (
					<div className="nodatabox">系统设置不允许手动任务</div>
				)}
			</div>
		);
	}
}
