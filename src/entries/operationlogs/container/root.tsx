import * as React from "react";
import { DatePicker, Input, Button, message, Select } from "antd";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import * as moment from "moment";
import "./index.less";
import ListPage from "../../../basecomponent/listpage";
const Option = Select.Option;
interface Props extends BaseListProps {
	logsList?: any;
	getLogsListAction?: Function;
}
interface State extends BaseListState {
	isLoading: boolean;
	day_start: any;
	day_end: any;
	keyword: string;
	type: OperationType;
}

declare type OperationType = "admin" | "mobile";

export default class Root extends ListPage<Props, State> {
	constructor(props: any) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isLoading: false,
		day_start: moment(),
		day_end: moment(),
		keyword: "",
		type: "admin"
	};

	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "操作日志");
		this.initPage();
	}
	async getListData() {
		let { page, pagesize, day_end, day_start, keyword, type } = this.state;
		if (!moment.isMoment(day_start)) {
			message.error("时间选择不能为空");
			return;
		}
		if (!moment.isMoment(day_end)) {
			message.error("时间选择不能为空");
			return;
		}
		if (day_start.isAfter(day_end)) {
			message.error("起始时间不能大于截至时间");
			return;
		}
		let params: any = {
			page,
			pagesize,
			type,
			day_start: day_start.format("YYYYMMDD"),
			day_end: day_end.format("YYYYMMDD")
		};
		if (keyword && keyword.trim().length > 0) {
			params.method = encodeURI(keyword.trim());
		}
		this.setState({
			isLoading: true
		});
		try {
			let res = await this.props.getLogsListAction(params);
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}

	renderHeader() {
		return [
			{ name: "操作人", key: "who_is_me", width: 180 },
			{ name: "时间", key: "create_time", width: 150 },
			{
				name: "运行时间",
				key: "used_time",
				width: 150,
				class: "tc",
				render: (item: any) => {
					return <span>{item.used_time}毫秒</span>;
				}
			},
			{ name: "参数", key: "parms", width: 350 },
			{ name: "设备", key: "ua" }, //who_is_me
			{ name: "方法", key: "method", width: 180 },
			{ name: "ip地址", key: "ip", width: 150 }
		];
	}
	dateChange(type: string, e: any) {
		let set: any = {
			[type]: e
		};
		this.setState({
			...set
		});
	}
	searchClick() {
		this.setState(
			{
				page: 1
			},
			this.goByQuery
		);
	}
	goByQuery() {
		let { page, day_end, day_start, keyword, type } = this.state;
		if (!moment.isMoment(day_start)) {
			message.error("时间选择不能为空");
			return;
		}
		if (!moment.isMoment(day_end)) {
			message.error("时间选择不能为空");
			return;
		}
		if (day_start.isAfter(day_end)) {
			message.error("起始时间不能大于截至时间");
			return;
		}
		let params: any = {
			page,
			type,
			day_start: day_start.format("YYYYMMDD"),
			day_end: day_end.format("YYYYMMDD")
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = encodeURI(keyword.trim());
		}
		this.goPage(params);
	}
	pageChange(e: any) {
		this.setState(
			{
				page: e
			},
			this.goByQuery
		);
	}
	render() {
		let { logsList } = this.props;
		let {
			day_start,
			day_end,
			isLoading,
			page,
			pagesize,
			keyword,
			type
		} = this.state;
		return (
			<div className="operationlogs-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el">
							<DatePicker
								className="input"
								value={day_start}
								onChange={this.dateChange.bind(
									this,
									"day_start"
								)}
								disabledDate={(current: any) => {
									return (
										current &&
										current > moment().endOf("day")
									);
								}}
							/>
							<DatePicker
								className="input"
								value={day_end}
								onChange={this.dateChange.bind(this, "day_end")}
								disabledDate={(current: any) => {
									return (
										current &&
										current > moment().endOf("day")
									);
								}}
							/>
							<Input
								className="input"
								placeholder="请输入操作方式"
								style={{ width: "200px" }}
								value={keyword}
								onChange={window.Util.InputChange.bind(
									this,
									"keyword"
								)}
							/>
							<Select
								className="input"
								value={type}
								onChange={window.Util.InputChange.bind(
									this,
									"type"
								)}
							>
								<Option value="admin">后台</Option>
								<Option value="mobile">终端</Option>
							</Select>
							<Button
								type="primary"
								onClick={this.searchClick.bind(this)}
							>
								搜索
							</Button>
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={logsList && logsList.admin_logs}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={logsList && logsList.total}
						/>
					</div>
				</div>
			</div>
		);
	}
}
