/**
 * 	批量上号
 */
import * as React from "react";
import { Modal, Input, Button, message, Icon } from "antd";
import InputBox from "@component/inputbox";
import { requestUrl } from "../../../../config/index";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import "./index.less";
const { TextArea } = Input;

interface Props {
	visible: boolean;
	onCancel?: Function;
	data?: any;
	batchIds?: any;
	batchAccountLoginAction?: Function;
	batchAccountList?: any;
	exportAccountDataAction?: Function;
}
interface State {
	accountInfo: string;
	documents: any[];
	step: number;
	unsafeList: any[];
	unsafeList1: any[];
	warningMsg: string;
	step4Data: any;
}

export default class BatchLogin extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: false
	};
	readonly state: State = {
		accountInfo: "",
		documents: [],
		step: 1,
		unsafeList: null,
		unsafeList1: null,
		warningMsg: "",
		step4Data: null
	};
	// 取消
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	inputChange(e: any) {
		this.setState({
			accountInfo: e.target.value
		});
	}
	// 删除文件
	documentDelete(i: number) {
		let { documents } = this.state;
		documents.splice(i, 1);
		this.setState({
			documents: [...documents]
		});
	}
	// 增删文件触发
	documentChange(e: any) {
		this.setState({
			documents: [...this.state.documents, ...e]
		});
	}
	// 确定or继续
	async confirm(num?: number) {
		let { batchIds } = this.props;
		let { documents, accountInfo, step } = this.state;

		let params: any = {
			account_ids: batchIds.join(";"),
			step: step
		};
		// if (num && num == 3) {
		// 	params.step = 3;
		// }

		if (!accountInfo && (!documents || documents.length <= 0)) {
			message.error("请输入账号密码或者上传文件！");
			return;
		}
		if (accountInfo && accountInfo.length > 0) {
			params.weichat_numbers = accountInfo;
		}
		if (documents && documents.length > 0) {
			params.weichat_numbers_filepath = documents[0].url;
		}
		let res = await this.props.batchAccountLoginAction(params);
		if (res && res.data && res.data.step == 1) {
			this.setState({
				step: 2,
				unsafeList: [...res.data.content],
				warningMsg: res.msg
			});
		}
		if (res && res.data && res.data.step == 2) {
			this.setState({
				step: 3,
				unsafeList1: [...res.data.content],
				warningMsg: res.msg
			});
		}

		if (res && res.data && res.data.step == 3) {
			this.setState({
				step: 4,
				step4Data: { ...res.data }
			});
		}
	}
	// 下载文件
	async downloadFile() {
		let { step4Data } = this.state;
		let ids: any[] = [];
		if (
			step4Data &&
			step4Data.success_accounts &&
			step4Data.success_accounts.length > 0
		) {
			step4Data.success_accounts.map((item: any) => {
				ids.push(item._id);
			});
		} else {
			message.error("暂无成功上号账户");
			return;
		}
		let res = await this.props.exportAccountDataAction({
			account_ids: ids.join(";")
		});
		if (res && res.code == 200) {
			window.location.href = res.data;
			// window.open(res.data)
		}
	}
	renderUnsafeHeader(): any {
		return [
			{
				name: "手机编号",
				class: "tc",
				key: "note_mobile",
				width: 100,
				render: (item: any) => {
					return (
						<span title={item.note_mobile}>{item.note_mobile}</span>
					);
				}
			},
			{
				name: "Token",
				class: "tc",
				key: "device_token",
				width: 100,
				render: (item: any) => {
					return (
						<span title={item.device_token}>
							{item.device_token}
						</span>
					);
				}
			}
		];
	}
	renderUnsafeHeader1() {
		return [
			{
				name: "账号编号",
				class: "tc",
				width: 90,
				render: (item: any, idx: number) => {
					return <span>{idx + 1}</span>;
				}
			},
			{
				name: "账号",
				class: "tc",
				width: 220,
				render: (item: any) => {
					let arr = item.split("--");
					return <span title={arr[0]}>{arr[0]}</span>;
				}
			},
			{
				name: "密码",
				class: "tc",
				width: 220,
				render: (item: any) => {
					let arr = item.split("--");
					return <span title={arr[1]}>{arr[1]}</span>;
				}
			}
		];
	}
	renderNoteHeader() {
		return [
			{
				name: "账号编号",
				class: "tc",
				width: 90,
				render: (item: any, idx: number) => {
					return <span>{idx + 1}</span>;
				}
			},
			{
				name: "账号",
				class: "tc",
				width: 220,
				render: (item: any) => {
					let arr = item.split("--");
					return <span title={arr[0]}>{arr[0]}</span>;
				}
			},
			{
				name: "密码",
				class: "tc",
				width: 220,
				render: (item: any) => {
					let arr = item.split("--");
					return <span title={arr[1]}>{arr[1]}</span>;
				}
			}
		];
	}
	render() {
		let { visible } = this.props;
		let {
			accountInfo,
			documents,
			step,
			unsafeList,
			unsafeList1,
			warningMsg,
			step4Data
		} = this.state;
		return (
			<div>
				<Modal
					visible={visible}
					width={550}
					title="导入账号密码"
					footer={null}
					wrapClassName="batchlogin-modal"
					onCancel={this.cancelClick.bind(this)}
				>
					<div className="batchlogin-modal-container">
						{step && step == 1 && (
							<React.Fragment>
								<div className="text-box">
									<TextArea
										autosize={false}
										style={{
											width: "70%",
											height: "350px",
											resize: "none"
										}}
										placeholder="请将您的账号密码粘贴于此处
                            
格式：账号--密码

分隔符：,（英文格式）"
										value={accountInfo}
										onChange={this.inputChange.bind(this)}
									/>
								</div>
								<div className="upload-box">
									<InputBox
										type={"uploader"}
										domain={requestUrl() + "/upload"}
										customRequest={true}
										desc="注：上传格式：与上方相同，支持txt和excel文档"
										flexTop={true}
										value={documents}
										multiple={true}
										limitType={["txt", "excel"]}
										limitSize={1024 * 1024 * 20}
										length={1}
										onChange={this.documentChange.bind(
											this
										)}
										deleteUplodaValue={this.documentDelete.bind(
											this
										)}
									/>
								</div>
							</React.Fragment>
						)}
						{step && step == 2 && (
							<div className="step2">
								<div className="top">
									<Icon
										type="info-circle"
										style={{
											color: "#D70023",
											fontSize: "20px",
											marginRight: "8px"
										}}
									/>
									警告
								</div>
								<div className="msg">{warningMsg}</div>
								<div className="list-box">
									<TableBox
										headerList={this.renderUnsafeHeader()}
										data={unsafeList}
									/>
								</div>
							</div>
						)}
						{step && step == 3 && (
							<div className="step2">
								<div className="top">
									<Icon
										type="info-circle"
										style={{
											color: "#D70023",
											fontSize: "20px",
											marginRight: "8px"
										}}
									/>
									警告
								</div>
								<div className="msg">{warningMsg}</div>
								<div className="list-box">
									<TableBox
										headerList={this.renderUnsafeHeader1()}
										data={unsafeList1}
									/>
								</div>
							</div>
						)}
						{step && step == 4 && (
							<div className="step4">
								<div className="top">
									<Icon
										type="info-circle"
										style={{
											color: "#72B622",
											fontSize: "20px",
											marginRight: "8px"
										}}
									/>
									上号完成
								</div>
								<div className="nums">
									<div className="num-item">
										账号密码总数：
										{step4Data.weichat_numbers}
									</div>
									<div className="num-item">
										勾选设备数量：{step4Data.account_number}
									</div>
									<div className="num-item">
										上号数量：
										{step4Data.success_account_number}
									</div>
								</div>
								<div className="list-box">
									{step4Data &&
										step4Data.defect_weichats &&
										step4Data.defect_weichats.length >
											0 && (
											<div className="tooltip">
												以下账号密码组中，账号或者密码缺失，该条数据不能用于上号
											</div>
										)}

									<div className="table-content">
										<TableBox
											headerList={this.renderNoteHeader()}
											data={
												step4Data &&
												step4Data.defect_weichats
											}
										/>
									</div>
								</div>
							</div>
						)}
						<div className="buttons">
							{step && step < 4 && (
								<Button.Group>
									<Button
										type="primary"
										onClick={this.confirm.bind(this)}
									>
										{step && step == 1 ? "上传" : "继续"}
									</Button>
									<Button
										type="primary"
										onClick={this.cancelClick.bind(this)}
									>
										取消
									</Button>
								</Button.Group>
							)}
							{step && step == 4 && (
								<div>
									{step4Data &&
										step4Data.success_accounts &&
										step4Data.success_accounts.length >
											0 && (
											<Button
												style={{ marginRight: "10px" }}
												onClick={this.downloadFile.bind(
													this
												)}
											>
												导出文件
											</Button>
										)}

									<Button
										type="primary"
										onClick={this.cancelClick.bind(this)}
									>
										确定
									</Button>
								</div>
							)}
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}
