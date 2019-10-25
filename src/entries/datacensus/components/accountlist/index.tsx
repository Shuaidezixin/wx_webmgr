import * as React from "react";
import {
	message,
	DatePicker,
	Button,
	Input,
	Select,
	Checkbox,
	Modal
} from "antd";
import ListPage from "../../../../basecomponent/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import Toast from "@component/toast";
import Detail from "../detail";
import { itemMap } from "../../../../components/map";
import * as moment from "moment";
import debounce from "lodash/debounce";
import "./index.less";
const Option = Select.Option;

interface Props extends BaseListProps {
	accountExecuteList?: any;
	getAccountExecuteListAction?: Function;
	getAccountTaskInfoAction?: Function;
	singleCheckDataCensusAction?: Function;
	allCheckDataCensusAction?: Function;
	batchRemoveTaskAction?: Function;
	accountTaskInfoList?: any;
}
interface State extends BaseListState {
	isLoading: boolean;
	day_start: any;
	day_end: any;
	keyword: string;
	status: number;
	isAll: boolean;
	isShowDetail: boolean;
	openID: string;
}
interface State {}

export default class AccountList extends ListPage<Props, State> {
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isLoading: false,
		day_start: null,
		day_end: null,
		keyword: "",
		status: 0,
		isAll: false,
		isShowDetail: false,
		openID: ""
	};
	static readonly defaultProp: Props = {};
	constructor(props: Props) {
		super(props);
		this.handleSearch = debounce(this.handleSearch, 500); //点击查询防抖
	}
	renderHeader(): any {
		return [
			{
				key: "name",
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
				name: "手机编号",
				width: 250,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span title={item && item.mobile_note}>
							{item.mobile_note}
						</span>
					);
				}
			},
			{
				name: "微信账号",
				width: 150,
				// key: "login_user",
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span title={item && item.login_user}>
							{item.login_user}
						</span>
					);
				}
			},
			{
				name: "备注信息",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span title={item && item.wechat_source}>
							{item.wechat_source}
						</span>
					);
				}
			},
			{
				name: "人设设定",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return <span>{item.personal_desgin_name}</span>;
				}
			},
			{
				name: "执行任务",
				width: 250,
				class: "tc",
				render: (item: any, idx: number) => {
					return <span>{itemMap[item.task_name]}</span>;
				}
			},
			{
				name: "执行类型",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span>{item.task_type ? "自动执行" : "手动执行"}</span>
					);
				}
			},
			{
				name: "执行时间",
				width: 200,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span>
							{moment(
								item.task_exce_time,
								"YYYYMMDD_HHmm"
							).format("YYYY-MM-DD HH:mm")}
						</span>
					);
				}
			},
			{
				name: "任务详情",
				width: 150,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span
							className="ctrlbtn"
							onClick={this.openDetail.bind(this, item)}
						>
							详情
						</span>
					);
				}
			},
			{
				name: "手机状态",
				width: 120,
				// key: "wechat_source",
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<div>
							{item.account_status == 1 && (
								<span style={{ color: "#1dc433" }}>正常</span>
							)}
							{item.account_status == 2 && (
								<span style={{ color: "orange" }}>未登录</span>
							)}
							{item.account_status == 3 && (
								<span style={{ color: "red" }}>封号</span>
							)}
							{item.account_status == 4 && (
								<span style={{ color: "red" }}>设备异常</span>
							)}
						</div>
					);
				}
			}
		];
	}
	public componentDidMount() {
		this.initPage();
	}
	// 获取列表
	async getListData() {
		let {
			page,
			pagesize,
			keyword,
			day_start,
			day_end,
			status
		} = this.state;

		let params: any = {
			page,
			pagesize,
			status
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
			await this.props.getAccountExecuteListAction(params);
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	// 获取详情
	getTaskDetail() {
		let { openID } = this.state;
		this.props.getAccountTaskInfoAction({
			task_id: openID
		});
	}
	// 全选
	allCheckClick(e: any) {
		let type = e.target.checked;
		this.setState({
			isAll: type
		});
		this.props.allCheckDataCensusAction({
			type: type
		});
	}
	// 单选
	singleCheckClick(item: any) {
		if (!item) {
			return;
		}
		this.props.singleCheckDataCensusAction({
			id: item._id
		});
		this.checkIsAll();
	}
	// 判断是否全选
	checkIsAll() {
		let { accountExecuteList } = this.props;
		if (
			accountExecuteList &&
			accountExecuteList.accounts &&
			accountExecuteList.accounts.length > 0
		) {
			let checkCount = 0;
			let len = accountExecuteList.accounts.length;
			accountExecuteList.accounts.map((item: any) => {
				if (item.isChecked) {
					checkCount++;
				}
			});
			console.log("len", len, checkCount);
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
	// 获取选中的id集合
	getCheckedItem(): any[] {
		let { accountExecuteList } = this.props;
		let list =
			accountExecuteList && accountExecuteList.accounts
				? accountExecuteList.accounts
				: [];
		let idArr: any[] = [];
		if (list && list.length >= 0) {
			list.map((item: any) => {
				if (item.isChecked) idArr.push(item._id);
			});
		}
		return idArr;
	}
	// 打开详情
	openDetail(data: any) {
		let auth = window.viliAuth(
			"5cebbbcee935680d0497d248",
			"5cebbfa3e935680428223bad"
		);
		if (!auth) {
			message.error("您没有权限查看");
			return;
		}
		this.setState(
			{
				isShowDetail: true,
				openID: data.task_id
			},
			this.getTaskDetail
		);
	}
	// 关闭详情
	closeDetail() {
		this.setState({
			isShowDetail: false,
			openID: ""
		});
	}
	timeChange(type: string, e: any) {
		let set: any = {
			[type]: e
		};
		this.setState({
			...set
		});
	}
	searchChange(e: any) {
		let val = e.target.value;
		this.setState({
			keyword: val
		});
	}
	// 查询按钮
	handleSearch() {
		this.goByQuery();
		// this.getListData();
	}
	goByQuery() {
		let { keyword, day_start, day_end, page, status } = this.state;
		let params: any = {
			page,
			status
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
	SelectChange(e: any) {
		this.setState(
			{
				status: e
			},
			this.goByQuery
		);
	}
	// 批量删除
	async deleteBatch() {
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
					this.getListData();
				}
			}
		});
	}
	public render() {
		const {
			day_start,
			day_end,
			keyword,
			status,
			page,
			pagesize,
			isShowDetail,
			isLoading
		} = this.state;
		const { accountExecuteList, accountTaskInfoList } = this.props;
		return (
			<div className="account-box">
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
									value={status}
									onChange={this.SelectChange.bind(this)}
								>
									<Option value={0}>全部任务</Option>
									<Option value={1}>手动任务</Option>
									<Option value={2}>自动任务</Option>
								</Select>
							</div>
							{window.viliAuth(
								"5cebbbcee935680d0497d248",
								"5cebbfb9e935680428223baf"
							) && (
								<Button
									type="danger"
									onClick={this.deleteBatch.bind(this)}
								>
									批量删除任务
								</Button>
							)}
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={
								accountExecuteList &&
								accountExecuteList.accounts
							}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={
								accountExecuteList && accountExecuteList.total
							}
						/>
					</div>
				</div>
				{/* 详情 */}
				{isShowDetail && accountTaskInfoList && (
					<Detail
						visible={isShowDetail}
						onCancel={this.closeDetail.bind(this)}
						data={accountTaskInfoList}
					/>
				)}
			</div>
		);
	}
}
