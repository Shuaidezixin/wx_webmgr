import * as React from "react";
import { Modal, Button, Checkbox, Select, message } from "antd";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import Detail from "../detail";
import * as moment from "moment";
import "./index.less";

const Option = Select.Option;

interface Props {
	visible: boolean;
	onCancel?: Function;
	data?: any;
	taskInfo?: any;
	getTaskExecuteInfoAction?: Function;
	timeRange?: string;
	singleCheckTaskQueueAction?: Function;
	allCheckTaskQueueAction?: Function;
	removeTaskByTypeAction?: Function;
	batchRemoveTaskAction?: Function; //批量移除
	getAccountTaskInfoAction?: Function; //详情
	accountTaskInfoList?: any;
}
interface State {
	page: number;
	pagesize: number;
	status: number;
	isLoading: boolean;
	isAll: boolean;
	isShowDetail: boolean;
	openID: string;
}

export default class TaskDetail extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		page: 1,
		pagesize: 30,
		status: 0,
		isLoading: false,
		isAll: false,
		isShowDetail: false,
		openID: ""
	};
	static readonly defaultProps: Props = {
		visible: true
	};
	pageChange(e: number) {
		this.setState(
			{
				page: e
			},
			this.getList
		);
	}
	reanderList() {
		return [
			{
				name: "",
				width: 50,
				class: "tc",
				titleRender: () => {
					return (
						<Checkbox
							checked={this.state.isAll}
							onChange={this.allCheckClick.bind(this)}
						/>
					);
				},
				render: (item: any) => {
					return (
						<Checkbox
							checked={item.isChecked}
							onChange={this.singleCheckClick.bind(this, item)}
						/>
					);
				}
			},
			{
				name: "微信账号",
				key: "weichat",
				class: "tc"
			},
			{
				name: "创建时间",
				width: 180,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span>
							{moment(
								item.create_time,
								"YYYY-MM-DD HH:mm:ss"
							).format("YYYY-MM-DD HH:mm")}
						</span>
					);
				}
			},
			{
				name: "执行时间",
				width: 180,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span>
							{moment(item.exce_time, "YYYYMMDD_HHmm").format(
								"YYYY-MM-DD HH:mm"
							)}
						</span>
					);
				}
			},
			{
				name: "执行状态",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<React.Fragment>
							{item.exce_status == 0 && (
								<span style={{ color: "orange" }}>
									等待执行
								</span>
							)}
							{item.exce_status == 1 && (
								<span style={{ color: "#179bd5" }}>
									正在执行
								</span>
							)}
							{item.exce_status == 2 && (
								<span style={{ color: "#fe1a5e" }}>
									执行失败
								</span>
							)}
							{item.exce_status == 3 && (
								<span style={{ color: "#1dc433" }}>
									执行成功
								</span>
							)}
							{item.exce_status == 4 && (
								<span style={{ color: "yellowgreen" }}>
									无效成功
								</span>
							)}
						</React.Fragment>
					);
				}
			},
			{
				name: "操作",
				width: 150,
				// class: "tca",
				render: (item: any) => {
					return (
						<React.Fragment>
							{window.viliAuth(
								"5cebbbcee935680d0497d248",
								"5cebbfa3e935680428223bad"
							) && (
								<span
									className="ctrlbtn"
									onClick={this.openDetail.bind(this, item)}
								>
									详情
								</span>
							)}

							{window.viliAuth(
								"5cebbbcee935680d0497d248",
								"5cebbfb9e935680428223baf"
							) &&
								item.exce_status == 0 && (
									<span
										className="ctrlbtn delete"
										onClick={this.singleRemove.bind(
											this,
											item._id
										)}
									>
										移除
									</span>
								)}
						</React.Fragment>
					);
				}
			}
		];
	}
	componentDidMount() {
		this.getList();
	}
	// 获取列表
	async getList() {
		let { page, pagesize, status } = this.state;
		let { timeRange, taskInfo } = this.props;
		let params: any = {
			page,
			pagesize,
			task_type: taskInfo.task_type,
			task_subtype: taskInfo.task_subtype,
			is_auto: taskInfo.is_auto,
			task_status: status
		};
		if (timeRange) {
			params.timeRange = timeRange;
		}

		this.setState({
			isLoading: true
		});
		try {
			await this.props.getTaskExecuteInfoAction(params);
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	// 取消
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	// 状态筛选
	SelectChange(e: any) {
		this.setState(
			{
				status: e
			},
			this.getList
		);
	}
	// 详情
	openDetail(data: any) {
		this.setState(
			{
				isShowDetail: true,
				openID: data._id
			},
			this.getTaskDetail
		);
	}
	closeDetail() {
		this.setState({
			isShowDetail: false,
			openID: ""
		});
	}
	// 获取详情
	getTaskDetail() {
		let { openID } = this.state;
		this.props.getAccountTaskInfoAction({
			task_id: openID
		});
	}
	allCheckClick(e: any) {
		let type = e.target.checked;
		this.setState({
			isAll: type
		});
		this.props.allCheckTaskQueueAction({
			type: type
		});
	}
	singleCheckClick(item: any) {
		if (!item) {
			return;
		}
		this.props.singleCheckTaskQueueAction({
			id: item._id
		});
		this.checkIsAll();
	}
	checkIsAll() {
		let { data } = this.props;
		if (data && data.tasks && data.tasks.length > 0) {
			let checkCount = 0;
			let len = data.tasks.length;
			data.tasks.map((item: any) => {
				if (item.isChecked) {
					checkCount++;
				}
			});
			if (checkCount == len) {
				this.setState({
					isAll: true
				});
			} else {
				this.setState({
					isAll: false
				});
			}
		}
	}
	getCheckedItem(): any[] {
		let { data } = this.props;
		let list = data && data.tasks ? data.tasks : [];
		let idArr: any[] = [];
		if (list && list.length >= 0) {
			list.map((item: any) => {
				if (item.isChecked) idArr.push(item._id);
			});
		}
		return idArr;
	}
	// 批量移除
	batchRemove() {
		let ids = this.getCheckedItem();
		Modal.confirm({
			title: "提示",
			content: `你确定删除吗？`,
			onOk: async () => {
				let res = await this.props.batchRemoveTaskAction({
					task_ids: ids.join(";")
				});
				if (res && res.code == 200) {
					message.success("删除成功");
					this.getList();
				}
			}
		});
	}
	// 单个移除
	singleRemove(id?: any) {
		Modal.confirm({
			title: "提示",
			content: `你确定删除吗？`,
			onOk: async () => {
				let res = await this.props.batchRemoveTaskAction({
					task_ids: id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
					this.getList();
				}
			}
		});
	}
	// 删除该任务
	deleteTask() {
		let { taskInfo } = this.props;
		let params: any = {
			task_type: taskInfo.task_type,
			task_subtype: taskInfo.task_subtype,
			is_auto: taskInfo.is_auto
		};
		Modal.confirm({
			title: "提示",
			content: `你确定删除吗？`,
			onOk: async () => {
				let res = await this.props.removeTaskByTypeAction(params);
				if (res && res.code == 200) {
					message.success("删除成功");
					this.getList();
				}
			}
		});
	}
	render() {
		let { visible, taskInfo, data, accountTaskInfoList } = this.props;
		let { page, pagesize, status, isLoading, isShowDetail } = this.state;
		return (
			<Modal
				visible={visible}
				width={900}
				wrapClassName="task-detail-modal"
				// title={`任务编号${taskInfo.task_id}执行情况`}
				title="任务执行情况"
				onCancel={this.cancelClick.bind(this)}
				footer={
					<FooterCtrl
						pageSize={pagesize}
						currentPage={page}
						total={data && data.total}
						pageChange={this.pageChange.bind(this)}
					/>
				}
			>
				<div className="task-detail-container">
					<div className="info-box">
						<div className="info-item">
							任务类型：{taskInfo.task_name}
						</div>
						<div className="info-item">
							执行类型：
							{taskInfo.is_auto ? "自动任务" : "手动任务"}
						</div>
						{/* <div className="info-item">
							任务状态:
							<Select
								style={{ width: "100px", marginLeft: "10px" }}
							>
								<Option value={0}>全部</Option>
								<Option value={1}>待执行</Option>
								<Option value={2}>成功执行</Option>
								<Option value={3}>失败执行</Option>
								<Option value={4}>无效执行</Option>
							</Select>
						</div> */}
						<div className="info-item">
							状态筛选:
							<Select
								style={{ width: "100px", marginLeft: "10px" }}
								value={status}
								onChange={this.SelectChange.bind(this)}
							>
								<Option value={0}>全部状态</Option>
								<Option value={1}>执行成功</Option>
								<Option value={2}>执行失败</Option>
								<Option value={3}>等待执行</Option>
							</Select>
						</div>
						<div className="right-info">
							{window.viliAuth(
								"5cebbbcee935680d0497d248",
								"5cebbfb9e935680428223baf"
							) && (
								<React.Fragment>
									<Button
										size="small"
										type="primary"
										className="btn"
										onClick={this.batchRemove.bind(this)}
									>
										批量移除
									</Button>
									<Button
										size="small"
										type="danger"
										className="btn"
										onClick={this.deleteTask.bind(this)}
									>
										删除该任务
									</Button>
								</React.Fragment>
							)}
						</div>
					</div>
					<div className="task-table">
						<TableBox
							headerList={this.reanderList()}
							data={data && data.tasks}
							isLoading={isLoading}
						/>
					</div>
				</div>
				{isShowDetail && accountTaskInfoList && (
					<Detail
						visible={isShowDetail}
						onCancel={this.closeDetail.bind(this)}
						data={accountTaskInfoList}
					/>
				)}
			</Modal>
		);
	}
}
