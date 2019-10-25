import * as React from "react";
import { Icon, Select, DatePicker, Button, Modal } from "antd";
import * as classnames from "classnames";
import FooterCtrl from "@component/footer_ctrl";
import TaskItem from "@component/taskItem";
import NoData from "@component/nodata";
import Toast from "@component/toast";
import "./index.less";
const Option = Select.Option;
interface Props {
	onCancel?: Function;
	getData?: Function;
	data?: any;
	id?: string;
	delete?: Function;
	title?: String;
	clear?: Function;
}
interface State {
	status: number;
	type: number;
	page: number;
	pagesize: number;
}

export default class Log extends React.PureComponent<Props, State> {
	private timer: any = null;
	private isLoading: any = null;
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		status: 0,
		type: 0,
		page: 1,
		pagesize: 30
	};
	public closeClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	componentDidMount() {
		this.getListData();
	}
	componentWillUnmount() {
		this.props.clear();
		this.setState({
			page: 1,
			status: 0,
			type: 0
		});
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
	async getListData() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		let { status, type, page, pagesize } = this.state;
		let { id } = this.props;
		let params: any = {
			page,
			pagesize,
			account_id: id
		};
		if (status) {
			params.type_status = status;
		}
		if (type) {
			params.type_task = type;
		}
		try {
			let res = await this.props.getData(params);
			this.timer = setTimeout(() => {
				this.getListData();
			}, 60000);
		} finally {
			if (this.isLoading) {
				this.isLoading.close();
				this.isLoading = null;
			}
		}
	}
	// 任务tab栏切换
	statusChange(status: number) {
		if (this.state.status == status) {
			return;
		}
		this.isLoading = Toast.loading("正在加载数据...", 0);
		this.setState(
			{
				status: status,
				page: 1
			},
			this.getListData
		);
	}
	// 状态筛选
	typeChange(e: any) {
		if (e == this.state.type) {
			return;
		}
		this.isLoading = Toast.loading("正在加载数据...", 0);
		this.setState(
			{
				type: e,
				page: 1
			},
			this.getListData
		);
	}
	pageChange(e: number) {
		this.isLoading = Toast.loading("正在加载数据...", 0);
		this.setState(
			{
				page: e
			},
			this.getListData
		);
	}
	// 删除
	deleteClick(task_id: string) {
		if (!task_id) {
			return;
		}
		Modal.confirm({
			title: "警告",
			content: "您确定删除这条任务？",
			onOk: async () => {
				await this.props.delete({ task_id });
			}
		});
	}
	public render() {
		let { page, pagesize, status, type } = this.state;
		let { data, title } = this.props;
		return (
			<div className="task-page">
				<div className="log-title">
					<Icon
						className="close-btn"
						onClick={this.closeClick.bind(this)}
						type="close"
					/>
					<span>
						{title}
						{title && title.length > 0 && "-"}任务列表
					</span>
				</div>
				<div className="filter-box">
					<span
						className={classnames(
							"filterbtn",
							status == 0 && "act"
						)}
						onClick={this.statusChange.bind(this, 0)}
					>
						新任务（{data && data.status_0_count}）
					</span>
					<span
						onClick={this.statusChange.bind(this, 3)}
						className={classnames(
							"filterbtn",
							status == 3 && "act"
						)}
					>
						成功（{data && data.status_3_count}）
					</span>
					<span
						onClick={this.statusChange.bind(this, 2)}
						className={classnames(
							"filterbtn",
							status == 2 && "act"
						)}
					>
						失败（{data && data.status_2_count}）
					</span>
					<span
						onClick={this.statusChange.bind(this, 4)}
						className={classnames(
							"filterbtn",
							status == 4 && "act"
						)}
					>
						无效成功（{data && data.status_4_count}）
					</span>
					<span
						onClick={this.statusChange.bind(this, 9)}
						className={classnames(
							"filterbtn",
							status == 9 && "act"
						)}
					>
						任务总数（{data && data.status_all_count}）
					</span>
					<Select
						className="filter"
						value={type}
						onChange={this.typeChange.bind(this)}
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
				</div>
				<div className="log-middle">
					<div className="log-content">
						{data &&
							data.tasks &&
							data.tasks.length > 0 &&
							data.tasks.map((item: any, idx: number) => {
								return (
									<TaskItem
										key={idx}
										canDelete={status == 0 ? true : false}
										data={item}
										index={data.tasks.length - idx}
										onDelete={this.deleteClick.bind(this)}
									/>
								);
							})}
						{(!data || !data.tasks || data.tasks.length <= 0) && (
							<NoData />
						)}
					</div>
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
