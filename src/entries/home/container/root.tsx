import * as React from "react";
import { Input, Button, message, Icon, Modal, Select } from "antd";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import DrawBox from "@component/darw";
import AccountDetai from "../components/accountdetail";
import Log from "../components/log";
import Task from "../components/task";
import "./index.less";
import ListPage from "../../../basecomponent/listpage";
import ScreenDetail from "@component/screendetail";
const Option = Select.Option;
interface Props extends BaseListProps {
	deviceList?: any;
	getDeviceListAction?: Function;
	getTaskListAction?: Function;
	taskList?: Function;
	deleteTaskAction?: Function;
	getLogListAction?: Function;
	logList?: any;
	homeStatistics?: any;
	getHomeStatisticsAction?: Function;
	createAccountTaskAction?: Function;
	groupList1?: any;
	getGroupsAction1?: Function;
	clearTaskListAction?: Function;
}
interface State extends BaseListState {
	isShowDetail: boolean;
	isShowTask: boolean;
	isShowLog: boolean;
	pagesize: number;
	page: number;
	keyword: string;
	isLoading: boolean;
	account_id: string;
	targtTitle: string;
	grouptype: string;
	isShowScreen: boolean;
}
export default class Root extends ListPage<Props, State> {
	private dashDom: React.RefObject<HTMLDivElement>;
	private cardData: any = null;
	readonly state: State = {
		isShowDetail: false,
		isShowTask: false,
		isShowLog: false,
		pagesize: 30,
		page: 1,
		keyword: "",
		isLoading: false,
		account_id: null,
		targtTitle: "",
		grouptype: "0",
		isShowScreen: false
	};
	static readonly defaultProp: Props = {};
	constructor(props: Props) {
		super(props);
		this.dashDom = React.createRef();
	}
	public componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "首页");
		this.initPage();
		this.getCardData();
	}
	componentWillUnmount() {
		if (this.cardData) {
			clearTimeout(this.cardData);
			this.cardData = true;
		}
	}
	// 获取编组
	getGroup(e?: any) {
		let params: any = { page: 1, pagesize: 100, type: "index" };
		if (e && typeof e === "string") {
			params.keyword = e.trim();
		}
		this.props.getGroupsAction1(params);
	}
	// 获取账户状态的数量
	getCardData() {
		this.props.getHomeStatisticsAction();
		if (this.cardData) {
			clearTimeout(this.cardData);
			this.cardData = true;
		}
		this.cardData = setTimeout(() => {
			this.getCardData();
		}, 60000);
	}
	// 获取列表数据
	async getListData(isFirst: boolean = true) {
		let { page, pagesize, keyword, grouptype } = this.state;
		let params: any = { page, pagesize };
		if (keyword && keyword.trim().length > 0) {
			params.keyword = keyword.trim();
		}
		if (grouptype && grouptype != "0") {
			params.grouptype = grouptype;
		}
		this.setState({
			isLoading: true
		});
		try {
			let res = await this.props.getDeviceListAction(params);
		} finally {
			if (isFirst) {
				this.getGroup();
			}

			this.setState({
				isLoading: false
			});
		}
	}
	openScreen() {
		// this.setState({
		// 	isShowScreen: true
		// });
	}
	closeScreen() {
		this.setState({
			isShowScreen: false
		});
	}
	openDetailDraw() {
		// this.setState({
		// 	isShowDetail: true
		// });
	}
	closeDetailDraw() {
		this.setState({
			isShowDetail: false
		});
	}
	// 打开任务侧弹框
	openTaskDraw(item: any, e: any) {
		e.stopPropagation();
		this.setState({
			isShowTask: true,
			account_id: item.account_id,
			targtTitle: `${item.nickname}/${item.mobile_note}`
		});
	}
	// 光闭任务侧弹框
	closeTaskDraw() {
		this.setState({
			isShowTask: false
		});
	}
	// 打开日志侧弹框
	openLogDraw(item: any, e: any) {
		e.stopPropagation();
		this.setState({
			isShowLog: true,
			account_id: item.account_id,
			targtTitle: `${item.nickname}/${item.mobile_note}`
		});
	}
	// 关闭日志侧弹框
	closeLogDraw() {
		this.setState({
			isShowLog: false
		});
	}
	pageChange(e: any) {
		this.setState(
			{
				page: e
			},
			() => {
				this.getListData(false);
			}
		);
	}
	// 重新生成任务按钮
	createTask(item: any) {
		if (!item) {
			return;
		}
		// if (!item.figureid || item.figureid.length <= 0) {
		// 	Modal.error({
		// 		title: "警告",
		// 		content: "此账户没有绑定的形象，请编辑添加"
		// 	});
		// 	return;
		// }
		Modal.confirm({
			title: "提示",
			content: "你确定重新生成任务？",
			onOk: async () => {
				let res = await this.props.createAccountTaskAction({
					account_id: item.account_id
				});
				if (res && res.code == 200) {
					message.success("生成成功");
					this.getListData(false);
				}
			}
		});
	}
	public renderHeader() {
		//last_access_time
		return [
			{
				name: "最后操作时间",
				key: "last_access_time",
				class: "tc",
				width: 160
			},
			// {
			// 	name: "设备Token",
			// 	key: "device_token",
			// 	class: "tc",
			// 	width: 120,
			// 	render: (item: any) => {
			// 		return (
			// 			<div className="line" title={item.device_token}>
			// 				{item.device_token}
			// 			</div>
			// 		);
			// 	}
			// },
			{
				name: "手机编号",
				key: "mobile_note",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return (
						<div className="line" title={item.mobile_note}>
							{item.mobile_note}
						</div>
					);
				}
			},
			{
				name: "账号",
				key: "mobile_zhanghao",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return (
						<div className="line" title={item.mobile_zhanghao}>
							{item.mobile_zhanghao}
						</div>
					);
				}
			},
			{
				name: "备注",
				key: "weichat_note",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return (
						<div className="line" title={item.weichat_note}>
							{item.weichat_note}
						</div>
					);
				}
			},
			{
				name: "昵称",
				key: "nickname",
				class: "tc",
				width: 150,
				render: (item: any) => {
					return (
						<div className="line" title={item.nickname}>
							{item.nickname}
						</div>
					);
				}
			},
			{
				name: "星标",
				key: "star",
				class: "tc",
				width: 80,
				render: (item: any) => <span>{item.star ? "是" : "否"}</span>
			},
			{
				name: "编组",
				key: "group",
				class: "tc",
				width: 80,
				render: (item: any) => {
					return (
						<div className="line" title={item.group}>
							{item.group}
						</div>
					);
				}
			},
			{
				name: "粉丝数",
				key: "fensi_cnt",
				class: "tc",
				width: 80
			},
			{
				name: "今日添加好友",
				key: "friendnum",
				class: "tc",
				width: 110,
				render: (item: any) => {
					return (
						<span
							className="ctrlbtn"
							onClick={this.cardClick.bind(this, "tongxunlu")}
						>
							{item.friendnum}
						</span>
					);
				}
			},
			{
				name: "今日未读消息",
				key: "messagenum",
				class: "tc",
				width: 110,
				render: (item: any) => {
					return (
						<span
							className="ctrlbtn"
							onClick={this.cardClick.bind(this, "message")}
						>
							{item.messagenum}
						</span>
					);
				}
			},
			{
				name: "今日未读评论",
				key: "pinlunnum",
				class: "tc",
				width: 110,
				render: (item: any) => {
					return (
						<span
							className="ctrlbtn"
							onClick={this.cardClick.bind(this, "pyq")}
						>
							{item.pinlunnum}
						</span>
					);
				}
			},
			{
				name: "今日任务",
				key: "pinlunnum",
				class: "tc",
				width: 110,
				render: (item: any) => {
					return (
						<span
							className="ctrlbtn"
							onClick={this.openTaskDraw.bind(this, item)}
						>
							{item.task_right}/{item.task_left}
						</span>
					);
				}
			},
			{
				name: "状态",
				key: "status",
				class: "tc",
				width: 80,
				render: (item: any) => (
					<div
						className="line"
						onClick={this.openScreen.bind(this, item)}
					>
						<span>
							{item.status == 1 && "正常"}
							{item.status == 2 && (
								<span style={{ color: "orange" }}>未登录</span>
							)}
							{item.status == 3 && (
								<span
									style={{ color: "red" }}
									title={item.err_msg}
								>
									封号
								</span>
							)}
							{item.status == 4 && (
								<span
									title={item.crash}
									style={{ color: "red" }}
								>
									系统故障
								</span>
							)}
						</span>
					</div>
				)
			},
			{
				name: "重新生成任务",
				key: "pinlunnum",
				class: "tc",
				width: 110,
				render: (item: any) => {
					return (
						<Icon
							type="reload"
							className="ctrlbtn edit"
							onClick={this.createTask.bind(this, item)}
						/>
					);
				}
			},
			// {
			// 	name: "任务",
			// 	key: "name",
			// 	class: "tc",
			// 	width: 90,
			// 	render: (item: any) =>
			// 		window.viliAuth(
			// 			"5cebbbcee935680d0497d247",
			// 			"5cebbfa3e935680428222bad"
			// 		) ? (
			// 			<span
			// 				className="ctrlbtn"
			// 				onClick={this.openTaskDraw.bind(this, item)}
			// 			>
			// 				剩余{item.task_left}条
			// 			</span>
			// 		) : (
			// 			"无权限"
			// 		)
			// },
			{
				name: "日志",
				key: "name",
				class: "tc",
				width: 80,
				render: (item: any) => (
					<span
						className="ctrlbtn"
						onClick={this.openLogDraw.bind(this, item)}
					>
						查看
					</span>
				)
			}
		];
	}
	// 表格滚动
	tableScroll(type: string, scrollTop: number, preScrollTop: number) {
		if (type == "down" && preScrollTop == 0) {
			this.dashDom.current.className = "home-dash close";
		}
		if (type == "up" && scrollTop == 0) {
			this.dashDom.current.className = "home-dash";
		}
	}
	// 点击顶部card
	cardClick(type?: string) {
		let w: any = null;
		switch (type) {
			case "message":
				if (!window.managerAction["5cefaa84875bc01b14b759d9"]) {
					message.error("无权限查看");
					return;
				}
				w = window.open("/#/message", "message");
				w.onload = () => {
					w.changeMessageType("single");
				};

				break;
			case "pyq":
				if (!window.managerAction["5cefaa84875bc01b14b759d9"]) {
					message.error("无权限查看");
					return;
				}
				w = window.open("/#/message", "message");
				w.onload = () => {
					w.changeMessageType("pyq");
				};
				break;
			case "tongxunlu":
				if (!window.managerAction["5cefaa84875bc01b14b759d9"]) {
					message.error("无权限查看");
					return;
				}
				w = window.open("/#/message", "message");
				w.onload = () => {
					w.changeMessageType("tongxunlu");
				};
				break;
		}
		window.childPageMessage = w;
	}
	// 顶部三个card框
	renderCard(props: any) {
		if (!props) {
			return;
		}
		return (
			<div className="dash-item" onClick={props.onClick}>
				<div className="dash-title">{props.title}</div>
				<div className="data">{props.data}</div>
				<div className="dash-footer">{props.footer}</div>
			</div>
		);
	}
	// 跳转account页面
	goAccount(status: number, e: any) {
		e.stopPropagation();
		window.appHistory.push({
			pathname: "/account",
			search: `statustype=${status}`
		});
	}
	// 搜索
	searchClick() {
		this.setState(
			{
				page: 1
			},
			this.getListData
		);
	}
	InputChange(type: string, e: any) {
		let set: any = {
			[type]: e
		};
		this.setState(set, this.searchClick);
	}
	public render() {
		let {
			isShowDetail,
			isShowLog,
			isShowTask,
			page,
			pagesize,
			isLoading,
			account_id,
			keyword,
			targtTitle,
			grouptype,
			isShowScreen
		} = this.state;
		let {
			deviceList,
			taskList,
			getTaskListAction,
			deleteTaskAction,
			logList,
			getLogListAction,
			homeStatistics,
			groupList1,
			clearTaskListAction
		} = this.props;
		return (
			<div className="home-page">
				<div className="home-header">
					<span>编组:</span>
					<Select
						value={grouptype}
						onChange={this.InputChange.bind(this, "grouptype")}
						style={{
							width: "100px",
							margin: "0 5px"
						}}
						onSearch={this.getGroup.bind(this)}
						showSearch={true}
						filterOption={false}
					>
						<Option value={"0"}>全部</Option>
						{groupList1 &&
							groupList1.accountgroups &&
							groupList1.accountgroups.length > 0 &&
							groupList1.accountgroups.map(
								(v: any, i: number) => {
									return (
										<Option key={v.id} value={v.id}>
											{v.name}
										</Option>
									);
								}
							)}
					</Select>
					<Input
						className="search-input"
						type="search"
						value={keyword}
						onChange={window.Util.InputChange.bind(this, "keyword")}
						placeholder="请输入手机编号/账户/备注/昵称等关键词"
					/>
					<Button
						type="primary"
						onClick={this.searchClick.bind(this)}
					>
						搜索
					</Button>
				</div>
				<div className="home-dash" ref={this.dashDom}>
					<this.renderCard
						title="账户状态"
						data={
							homeStatistics &&
							homeStatistics.account &&
							homeStatistics.account.erraccountnum ? (
								<span style={{ color: "red" }}>
									{homeStatistics.account.erraccountnum}
								</span>
							) : (
								0
							)
						}
						footer={
							<React.Fragment>
								<span>
									总数:
									{homeStatistics &&
										homeStatistics.account &&
										homeStatistics.account.total}
								</span>
								<span
									onClick={this.goAccount.bind(this, 1)}
									style={{ cursor: "pointer" }}
								>
									登录:
									{homeStatistics &&
										homeStatistics.account &&
										homeStatistics.account.loginnum}
								</span>
								<span
									onClick={this.goAccount.bind(this, 2)}
									style={{ cursor: "pointer" }}
								>
									未登录:
									{homeStatistics &&
									homeStatistics.account &&
									homeStatistics.account.loginoutnum > 0 ? (
										<span style={{ color: "orange" }}>
											{homeStatistics.account.loginoutnum}
										</span>
									) : (
										0
									)}
								</span>
								<span
									onClick={this.goAccount.bind(this, 3)}
									style={{ cursor: "pointer" }}
								>
									封号:
									{homeStatistics &&
									homeStatistics.account &&
									homeStatistics.account.closeaccountnum >
										0 ? (
										<span
											style={{
												color: "red"
											}}
										>
											{
												homeStatistics.account
													.closeaccountnum
											}
										</span>
									) : (
										0
									)}
								</span>
							</React.Fragment>
						}
					/>
					<this.renderCard
						title="今日添加好友总数"
						data={
							homeStatistics &&
							homeStatistics.addfriend &&
							homeStatistics.addfriend.todaytotal
						}
						// footer={
						// 	<React.Fragment>
						// 		<span>主动添加:{homeStatistics&&homeStatistics.addfriend&&homeStatistics.addfriend}</span>
						// 		<span>被动添加:68</span>
						// 	</React.Fragment>
						// }
					/>
					<this.renderCard
						title="今日未读单聊消息总数"
						data={
							homeStatistics &&
							homeStatistics.message &&
							homeStatistics.message.total
								? homeStatistics.message.total
								: 0
						}
						type="message"
						onClick={this.cardClick.bind(this, "message")}
					/>
					<this.renderCard
						title="今日未读评论总数"
						data={
							homeStatistics &&
							homeStatistics.pinglun &&
							homeStatistics.pinglun.total
						}
						type="pinglun"
						onClick={this.cardClick.bind(this, "pyq")}
					/>
				</div>
				<div className="home-list list-page-box">
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							onScroll={this.tableScroll.bind(this)}
							data={deviceList && deviceList.devices}
							columnClick={this.openDetailDraw.bind(this)}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							total={deviceList && deviceList.total}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
						/>
					</div>
				</div>
				<DrawBox
					className="home-draw"
					visible={isShowDetail}
					onCancel={this.closeDetailDraw.bind(this)}
				>
					<div className="home-draw-box">
						<AccountDetai
							onCancel={this.closeDetailDraw.bind(this)}
						/>
					</div>
				</DrawBox>
				<DrawBox
					className="home-draw"
					visible={isShowLog}
					onCancel={this.closeLogDraw.bind(this)}
				>
					<div className="home-draw-box">
						{isShowLog && (
							<Log
								onCancel={this.closeLogDraw.bind(this)}
								id={account_id}
								data={logList}
								getData={getLogListAction}
								name={targtTitle}
							/>
						)}
					</div>
				</DrawBox>
				<DrawBox
					className="home-draw"
					visible={isShowTask}
					onCancel={this.closeTaskDraw.bind(this)}
				>
					<div className="home-draw-box">
						{isShowTask && (
							<Task
								onCancel={this.closeTaskDraw.bind(this)}
								getData={getTaskListAction}
								data={taskList}
								id={account_id}
								delete={deleteTaskAction}
								title={targtTitle}
								clear={clearTaskListAction}
							/>
						)}
					</div>
				</DrawBox>
				<ScreenDetail
					visible={isShowScreen}
					onCancel={this.closeScreen.bind(this)}
				/>
			</div>
		);
	}
}
