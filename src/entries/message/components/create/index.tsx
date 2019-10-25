import * as React from "react";
import { Button, TimePicker, Checkbox, message, Modal, Icon } from "antd";
import * as moment from "moment";
import InputBox from "@component/inputbox";
import { requestUrl } from "../../../../config";
import Toast from "@component/toast";
import "./index.less";

interface Props {
	createUserTaskAction?: Function;
	accountID?: string;
	onCancel?: Function;
}

interface State {
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
export default class Create extends React.PureComponent<Props, State> {
	readonly state: State = {
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
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Pics: [...list]
			}
		});
	}
	sentShuoshuoTimeChange(e: any) {
		this.setState({
			Pyq_sentshuoshuo: { ...this.state.Pyq_sentshuoshuo, time: e }
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
	MsgsChange(idx: number, e: any) {
		let { Pyq_sentshuoshuo } = this.state;
		let msgs = Pyq_sentshuoshuo.Msgs;
		msgs[idx] = e;
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Msgs: [...msgs]
			}
		});
	}
	commentChange(idx: number, e: any) {
		let { Pyq_sentshuoshuo } = this.state;
		let comments = Pyq_sentshuoshuo.Comments;
		comments[idx] = e;
		this.setState({
			Pyq_sentshuoshuo: {
				...this.state.Pyq_sentshuoshuo,
				Comments: [...comments]
			}
		});
	}
	closePyq() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	async saveClick() {
		let { Pyq_sentshuoshuo } = this.state;
		let params: any = {
			type: "Pyq"
		};
		let { createUserTaskAction } = this.props;
		if (!this.props.accountID || this.props.accountID.length <= 0) {
			message.error("请选择设备");
			return;
		}
		let userID: any[] = [this.props.accountID];
		params.account_ids = userID;
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
		let newComments = Pyq_sentshuoshuo.Comments.filter((item: string) => {
			if (item.trim().length > 0) {
				return item;
			}
		});
		let newPics: any = [];
		Pyq_sentshuoshuo.Pics.map((item: any) => {
			newPics.push(item.url);
		});
		params.Pyq_sentshuoshuo = {
			Self_zan: Pyq_sentshuoshuo.Self_zan,
			Self_gps: Pyq_sentshuoshuo.Self_gps,
			Pic_type: 1,
			Pic_num: newPics.length,
			Msgs: newMsgs,
			Comments: newComments,
			Pics: newPics
		};
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
				Modal.success({ title: "成功", content: "朋友圈任务发布成功" });
				this.setState({
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
				});
			}
		}
	}

	render() {
		let { Pyq_sentshuoshuo } = this.state;
		return (
			<div className="pyq-create">
				<div className="title">
					<div
						className="close-pyq"
						onClick={this.closePyq.bind(this)}
					>
						<Icon type="double-left" />
						关闭
					</div>
					<div className="title-txt">新建朋友圈</div>
				</div>
				<div className="container">
					<InputBox labelName="执行时间" autoWidth={true}>
						<TimePicker
							className="time"
							format="HH:mm"
							value={Pyq_sentshuoshuo && Pyq_sentshuoshuo.time}
							onChange={this.sentShuoshuoTimeChange.bind(this)}
						/>
					</InputBox>
					<InputBox
						type="textarea"
						labelName="文字"
						flexTop={true}
						value={
							Pyq_sentshuoshuo &&
							Pyq_sentshuoshuo.Msgs &&
							Pyq_sentshuoshuo.Msgs[0]
						}
						onChange={this.MsgsChange.bind(this, 0)}
					/>
					<InputBox
						type="uploader-img"
						labelName="图片/视频"
						desc="当上传视频时只有第一个生效"
						flexTop={true}
						customRequest={true}
						value={Pyq_sentshuoshuo && Pyq_sentshuoshuo.Pics}
						domain={requestUrl() + "/upload"}
						onChange={this.PicsChange.bind(this)}
						deleteUplodaValue={this.deletePics.bind(this)}
						limitType={["jpg", "jpeg", "png", "mp4"]}
						multiple={true}
						limitSize={1024 * 1024 * 10}
						length={9}
					/>
					{/* <InputBox type="checkbox" labelName="定位">
						<Checkbox
							checked={
								Pyq_sentshuoshuo && Pyq_sentshuoshuo.Self_gps
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
					<InputBox type="checkbox" labelName="自赞">
						<Checkbox
							checked={
								Pyq_sentshuoshuo && Pyq_sentshuoshuo.Self_zan
							}
							onChange={this.checkBoxChange.bind(
								this,
								"Self_zan"
							)}
						>
							{Pyq_sentshuoshuo && Pyq_sentshuoshuo.Self_zan
								? "打开"
								: "关闭"}
						</Checkbox>
					</InputBox>
					<InputBox
						type="textarea"
						labelName="自评"
						flexTop={true}
						value={
							Pyq_sentshuoshuo &&
							Pyq_sentshuoshuo.Comments &&
							Pyq_sentshuoshuo.Comments[0]
						}
						onChange={this.commentChange.bind(this, 0)}
					/>
					<InputBox>
						<Button
							type="primary"
							onClick={this.saveClick.bind(this)}
						>
							确定
						</Button>
					</InputBox>
				</div>
			</div>
		);
	}
}
