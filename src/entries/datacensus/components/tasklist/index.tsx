import * as React from "react";
import {
	Modal,
	DatePicker,
	Button,
	Input,
	Select,
	Checkbox,
	message
} from "antd";
import ListPage from "../../../../basecomponent/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import Toast from "@component/toast";
import InputBox from "@component/inputbox";
import Detail from "../detail";
import TaskDetail from "../taskdetail";
import { itemMap } from "../../../../components/map";
import * as moment from "moment";
import debounce from "lodash/debounce";
import "./index.less";
const Option = Select.Option;

interface Props extends BaseListProps {
	taskExecuteList?: any;
	getTaskExecuteListAction?: Function;
	singleCheckTaskAction?: Function;
	allCheckTaskAction?: Function;
	TaskExecInfoList?: any;
	getTaskExecuteInfoAction?: Function;
	singleCheckTaskQueueAction?: Function;
	allCheckTaskQueueAction?: Function;
	removeTaskByTypeAction?: Function;
	getAccountTaskInfoAction?: Function;
	batchRemoveTaskAction?: Function;
	accountTaskInfoList?: any;
}
interface State extends BaseListState {
	isLoading: boolean;
	day_start: any;
	day_end: any;
	keyword: string;
	task_type: number;
	isAll: boolean;
	isShowDetail: boolean;
	isShowList: boolean;
	openQueue: any;
	timeRange: string;
}
interface State {}

export default class TaskList extends ListPage<Props, State> {
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isLoading: false,
		day_start: null,
		day_end: null,
		keyword: "",
		task_type: 0,
		isAll: false,
		isShowDetail: false,
		isShowList: false,
		openQueue: null,
		timeRange: ""
	};
	static readonly defaultProp: Props = {};
	constructor(props: Props) {
		super(props);
		this.handleSearch = debounce(this.handleSearch, 1000);
	}
	renderHeader(): any {
		return [
			{
				key: "",
				class: "tc",
				width: 50,
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
				name: "任务编号",
				width: 200,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span title={item && item.task_id}>{item.task_id}</span>
					);
				}
			},
			{
				name: "任务创建时间",
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
				name: "任务执行时间",
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
				name: "执行任务类型",
				width: 250,
				class: "tc",
				render: (item: any, idx: number) => {
					// return <span>{itemMap[item.task_subtype]}</span>;
					return <span>{item.task_name}</span>;
				}
			},
			{
				name: "执行账号数量",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return <span>{item.account_num}</span>;
				}
			},
			{
				name: "执行成功数量",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return <span>{item.task_success_num}</span>;
				}
			},
			{
				name: "执行失败数量",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return <span>{item.task_fail_num}</span>;
				}
			},
			{
				name: "任务详情",
				width: 100,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<React.Fragment>
							{/* <span
								className="ctrlbtn"
								onClick={this.openDetail.bind(this, item)}
							>
								详情
							</span> */}
							<span
								className="ctrlbtn"
								onClick={this.openTaskList.bind(this, item)}
							>
								队列
							</span>
						</React.Fragment>
					);
				}
			},
			{
				name: "执行类型",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span>{item.is_auto ? "自动任务" : "手动任务"}</span>
					);
				}
			}
			// {
			// 	name: "",
			// 	class: "tc"
			// }
		];
	}
	public componentDidMount() {
		this.initPage();
	}
	async getListData() {
		let {
			page,
			pagesize,
			keyword,
			day_start,
			day_end,
			task_type
		} = this.state;
		let params: any = {
			page,
			pagesize,
			task_type
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = keyword.trim();
		}
		if ((day_start && !day_end) || (!day_start && day_end)) {
			message.error("时间区间错误");
			return;
		}
		if (day_start && day_end) {
			let start = day_start.format("YYYYMMDDHHmm");
			let end = day_end.format("YYYYMMDDHHmm");
			if (start && end && day_start.isBefore(day_end)) {
				params.timeRange = `${start}-${end}`;
			} else {
				message.error("开始时间不能大于结束时间");
				return;
			}
		}
		this.setState({
			isLoading: true
		});
		try {
			await this.props.getTaskExecuteListAction(params);
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	// 全选
	allCheckClick(e: any) {
		let type = e.target.checked;
		this.setState({
			isAll: type
		});
		this.props.allCheckTaskAction({
			type: type
		});
	}
	// 单选
	singleCheckClick(item: any) {
		if (!item) {
			return;
		}
		this.props.singleCheckTaskAction({
			id: item.task_id
		});
		this.checkIsAll();
	}
	// 判断是否全选
	checkIsAll() {
		let { taskExecuteList } = this.props;
		if (
			taskExecuteList &&
			taskExecuteList.tasks &&
			taskExecuteList.tasks.length > 0
		) {
			let checkCount = 0;
			let len = taskExecuteList.tasks.length;
			taskExecuteList.tasks.map((item: any) => {
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
	// 获取选中id集合
	getCheckedItem(): any[] {
		let { taskExecuteList } = this.props;
		let list =
			taskExecuteList && taskExecuteList.tasks
				? taskExecuteList.tasks
				: [];
		let idArr: any[] = [];
		if (list && list.length >= 0) {
			list.map((item: any) => {
				if (item.isChecked) idArr.push(item.task_id);
			});
		}
		return idArr;
	}
	// 打开任务队列
	openTaskList(data: any) {
		let { day_start, day_end } = this.state;

		let timeRange: string = "";
		if ((day_start && !day_end) || (!day_start && day_end)) {
			message.error("时间区间错误");
			return;
		}
		if (day_start && day_end) {
			let start = day_start.format("YYYYMMDDHHmm");
			let end = day_end.format("YYYYMMDDHHmm");
			if (start && end && day_end.isBefore(day_start)) {
				message.error("开始时间不能大于结束时间");
				return;
			}
			timeRange = `${start}-${end}`;
		}
		this.setState({
			isShowList: true,
			openQueue: { ...data },
			timeRange: timeRange
		});
	}
	// 关闭任务队列
	closeTaskList() {
		this.setState({
			isShowList: false,
			openQueue: null,
			timeRange: ""
		});
	}
	// datePicker时间选择
	timeChange(type: string, e: any) {
		let set: any = {
			[type]: e
		};
		this.setState({
			...set
		});
	}
	// 查询框
	searchChange(e: any) {
		let val = e.target.value;
		this.setState({
			keyword: val
		});
	}
	// 查询按钮
	handleSearch() {
		this.goByQuery();
		//this.getListData();
	}
	goByQuery() {
		let { keyword, day_start, day_end, page, task_type } = this.state;
		let params: any = {
			page,
			task_type
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = encodeURI(keyword.trim());
		}
		if ((day_start && !day_end) || (!day_start && day_end)) {
			message.error("时间区间错误");
			return;
		}
		if (day_start && day_end) {
			let start = day_start.format("YYYY-MM-DD HH:mm");
			let end = day_end.format("YYYY-MM-DD HH:mm");
			if (start && end && day_start.isBefore(day_end)) {
				params.day_start = day_start.unix() + "000";
				params.day_end = day_end.unix() + "000";
			} else {
				message.error("开始时间不能大于结束时间");
				return;
			}
		}
		this.goPage(params);
	}
	// 下拉框选择
	SelectChange(e: any) {
		this.setState(
			{
				task_type: e
			},
			this.goByQuery
		);
	}
	public render() {
		const {
			day_start,
			day_end,
			keyword,
			task_type,
			page,
			pagesize,
			isShowDetail,
			isShowList,
			openQueue,
			timeRange,
			isLoading
		} = this.state;
		const {
			taskExecuteList,
			TaskExecInfoList,
			getTaskExecuteInfoAction,
			singleCheckTaskQueueAction,
			allCheckTaskQueueAction,
			removeTaskByTypeAction,
			batchRemoveTaskAction,
			getAccountTaskInfoAction,
			accountTaskInfoList
		} = this.props;
		return (
			<div className="task-box">
				<div className="list-page-box">
					<div className="list-header">
						<div className="handle-box">
							<div className="timer">
								时间筛选:
								<DatePicker
									format="YYYY-MM-DD HH:mm"
									showTime={{ format: "HH:mm" }}
									className="filter"
									value={day_start}
									onChange={this.timeChange.bind(
										this,
										"day_start"
									)}
									disabledDate={(current: any) => {
										return (
											current &&
											current > moment().endOf("day")
										);
									}}
									placeholder="起始时间"
									style={{ marginLeft: "10px" }}
								/>
								<span
									style={{
										marginLeft: "5px",
										marginRight: "5px"
									}}
								>
									到
								</span>
								<DatePicker
									format="YYYY-MM-DD HH:mm"
									showTime={{ format: "HH:mm" }}
									className="filter"
									onChange={this.timeChange.bind(
										this,
										"day_end"
									)}
									value={day_end}
									disabledDate={(current: any) => {
										return (
											current &&
											current > moment().endOf("day")
										);
									}}
									placeholder="截至时间"
								/>
							</div>
							<div className="search-box">
								<Input
									placeholder="请输入关键字"
									value={keyword}
									onChange={this.searchChange.bind(this)}
								/>
								<Button
									type="primary"
									onClick={this.handleSearch.bind(this)}
									style={{ margin: "0 10px" }}
								>
									查询
								</Button>
							</div>
							<div className="types">
								<span style={{ marginRight: "10px" }}>
									执行类型:
								</span>
								<Select
									className="filter"
									value={task_type}
									onChange={this.SelectChange.bind(this)}
								>
									<Option value={0}>全部任务</Option>
									<Option value={1}>手动任务</Option>
									<Option value={2}>自动任务</Option>
								</Select>
							</div>
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={taskExecuteList && taskExecuteList.tasks}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={taskExecuteList && taskExecuteList.total}
						/>
					</div>
				</div>
				{/* {isShowDetail && (
					<Detail
						visible={isShowDetail}
						onCancel={this.closeDetail.bind(this)}
						// data={openDetailData}
					/>
				)} */}
				{/* 打开队列 */}
				{isShowList && (
					<TaskDetail
						visible={isShowList}
						onCancel={this.closeTaskList.bind(this)}
						data={TaskExecInfoList}
						taskInfo={openQueue}
						getTaskExecuteInfoAction={getTaskExecuteInfoAction}
						timeRange={timeRange}
						singleCheckTaskQueueAction={singleCheckTaskQueueAction}
						allCheckTaskQueueAction={allCheckTaskQueueAction}
						removeTaskByTypeAction={removeTaskByTypeAction}
						batchRemoveTaskAction={batchRemoveTaskAction}
						getAccountTaskInfoAction={getAccountTaskInfoAction}
						accountTaskInfoList={accountTaskInfoList}
					/>
				)}
			</div>
		);
	}
}
