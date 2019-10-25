import * as React from "react";
import { Icon, Select, DatePicker, Button, message } from "antd";
import FooterCtrl from "@component/footer_ctrl";
//import TaskItem from "@component/taskItem";
import NoData from "@component/nodata";
import { itemMap } from "@component/map";
import * as moment from "moment";
import "./index.less";
const Option = Select.Option;
interface Props {
	onCancel?: Function;
	getData?: Function;
	id?: string;
	data?: any;
	name?: string;
}
interface State {
	day_start: any;
	day_end: any;
	task_type: any;
	page: number;
	pagesize: number;
}

export default class Log extends React.PureComponent<Props, State> {
	readonly state: State = {
		day_start: moment(),
		day_end: moment(),
		task_type: 0,
		page: 1,
		pagesize: 30
	};
	constructor(props: Props) {
		super(props);
	}
	componentDidMount() {
		this.getListData();
	}
	public closeClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	// 获取列表
	async getListData() {
		let { day_start, day_end, task_type, page, pagesize } = this.state;
		let { id } = this.props;
		if (!id) {
			return;
		}
		if (!day_start || day_start.length <= 0) {
			message.error("起始时间不能为空");
			return;
		}
		if (!day_end || day_end.length <= 0) {
			message.error("结束时间不能为空");
			return;
		}
		if (day_start.isAfter(day_end)) {
			message.error("开始时间不能大于结束时间");
			return;
		}
		let params: any = {
			page,
			pagesize,
			account_id: id,
			day_start: day_start.format("YYYYMMDD"),
			day_end: day_end.format("YYYYMMDD")
		};
		if (task_type && task_type != 0) {
			params.task_type = task_type;
		}
		let res = await this.props.getData(params);
	}
	searchClick() {
		this.setState(
			{
				page: 1
			},
			this.getListData
		);
	}
	SelectChange(e: any) {
		this.setState({
			task_type: e
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
	pageChange(e: any) {
		this.setState(
			{
				page: e
			},
			this.getListData
		);
	}
	// 每条数据显示
	renderItem(props: any) {
		let { item } = props;
		return (
			<div className="log-item">
				{/* <div className="user">{item && item.account_note}</div> */}
				<div className="type">{item && itemMap[item.task_type]}</div>
				<div className="sub-type">
					{item && itemMap[item.task_sub_type]}:
					{item.status == 3 && (
						<span style={{ color: "green" }}>成功</span>
					)}
					{item.status == 2 && (
						<span style={{ color: "red" }}>{item.note_msg}</span>
					)}
					{item.status == 4 && (
						<span style={{ color: "orange" }}>{item.note_msg}</span>
					)}
				</div>
				<div className="time">{item && item.create_time}</div>
			</div>
		);
	}
	public render() {
		let { day_start, day_end, task_type, page, pagesize } = this.state;
		let { data, name } = this.props;
		return (
			<div className="log-page">
				<div className="log-title">
					<Icon
						className="close-btn"
						onClick={this.closeClick.bind(this)}
						type="close"
					/>
					<span>
						{name}
						{name && name.length > 0 && "-"}操作日志
					</span>
				</div>
				<div className="filter-box">
					<DatePicker
						className="filter"
						value={day_start}
						onChange={this.timeChange.bind(this, "day_start")}
						disabledDate={(current: any) => {
							return current && current > moment().endOf("day");
						}}
						placeholder="起始时间"
					/>
					<span>到</span>
					<DatePicker
						className="filter"
						onChange={this.timeChange.bind(this, "day_end")}
						value={day_end}
						disabledDate={(current: any) => {
							return current && current > moment().endOf("day");
						}}
						placeholder="截至时间"
					/>
					<Select
						className="filter"
						value={task_type}
						onChange={this.SelectChange.bind(this)}
					>
						<Option value={0}>全部</Option>
						<Option value={"AddFriend"}>加好友</Option>
						{/* <Option value={2}>消息聊天</Option> */}
						<Option value={"Pyq"}>朋友圈</Option>
						<Option value={"Gzh"}>公众号</Option>
						<Option value={"SC"}>收藏</Option>
						<Option value={"User"}>账户及隐私</Option>
						<Option value={"ChatConfig"}>聊天设置</Option>
						<Option value={"ViewFriend"}>查看好友信息</Option>
					</Select>
					<Button
						type="primary"
						onClick={this.searchClick.bind(this)}
					>
						确定
					</Button>
				</div>
				<div className="log-middle">
					{/* <TaskItem /> */}
					{data &&
						data.logs &&
						data.logs.length > 0 &&
						data.logs.map((v: any, idx: number) => {
							return <this.renderItem item={v} key={idx} />;
						})}
					{(!data || !data.logs || data.logs.length <= 0) && (
						<NoData />
					)}
				</div>
				<div className="log-footer">
					<FooterCtrl
						total={data && data.total}
						pageSize={pagesize}
						pageChange={this.pageChange.bind(this)}
						currentPage={page}
					/>
				</div>
			</div>
		);
	}
}
