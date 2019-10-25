import * as React from "react";
import {
	Button,
	Checkbox,
	Modal,
	message,
	Switch,
	Input,
	Select,
	Icon
} from "antd";

import ListPage from "../../../basecomponent/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import Detail from "../components/detail";
import Group from "../components/group";
import Apk from "../components/apk";
import Allot from "../components/allot";
import ExtensionBox from "../components/extension";
import Character from "../components/character";
import BatchLogin from "../components/batchlogin";
import debounce from "lodash/debounce";
import Toast from "@component/toast";
import "./index.less";
const Option = Select.Option;

interface Props extends BaseListProps {
	accountList?: any;
	tagList?: any;
	getAccoutListAction?: Function;
	getTagListAction?: Function;
	//figureList?: any;
	getFigureListAction?: Function;
	addAccountAction?: Function;
	singleCheckAccountAction?: Function;
	allCheckAccountAction?: Function;
	createAccountTaskAction?: Function;
	deleteAccountAction?: Function;
	changeChatStatusAction?: Function;
	changeChatAutoTaskAction?: Function;
	groupList?: any;
	getGroupsAction?: Function;
	accountListByGroup?: any;
	getAccountListByGroupAction?: Function;
	addGroupsAction?: Function;
	deleteGroupAction?: Function;
	groupList1?: any;
	getGroupsAction1?: Function;
	modalAccountDetail?: any;
	modalAccountDevice?: any;
	getModalAccountDetailAction?: Function;
	getModalAccountDeviceAction?: Function;
	getAppListAction?: Function;
	installAppAction?: Function;
	customerList?: any;
	getCustomerListAction?: Function;
	allotAction?: Function;
	getScreenAddressAction?: Function;
	getExtensionScriptAction?: Function;
	setAccountExtensionScriptAction?: Function;
	characterList1?: any;
	characterList?: any;
	getCharaterAction?: Function;
	getCharaterAction1?: Function;
	userSetPersonDesignAction?: Function;
	createUserTaskAction?: Function;
	batchAccountLoginAction?: Function;
	batchAccountList?: any;
	cleaAccountDataAction?: Function;
	exportAccountDataAction?: Function;
}
interface State extends BaseListState {
	page: number;
	pagesize: number;
	tagpage: number;
	tagpagesize: number;
	isShowNewAccount: boolean;
	isLoading: boolean;
	isAll: boolean;
	isShowGroup: boolean;
	keyword: string;
	statustype: number;
	grouptype: string;
	personal_desgin_id: string;
	isShowDetail: boolean;
	detailID: string;
	isShowApk: boolean;
	apkID: string | void;
	isShowAllot: boolean;
	targetID: string | void;
	isShowExtension: boolean;
	activeID: string;
	isShowCharacter: boolean;
	characterTarget: any[] | void;
	isFirst: boolean;
	isShowBatchLogin: boolean;
	batchIds: any[];
}
export default class Root extends ListPage<Props, State> {
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isShowNewAccount: false,
		isLoading: false,
		tagpage: 1,
		tagpagesize: 200,
		isAll: false,
		isShowGroup: false,
		keyword: "",
		statustype: 0,
		grouptype: "0",
		personal_desgin_id: "0",
		isShowDetail: false,
		detailID: "",
		isShowApk: false,
		apkID: null,
		isShowAllot: false,
		targetID: null,
		isShowExtension: false,
		activeID: "",
		isShowCharacter: false,
		characterTarget: null,
		isFirst: true,
		isShowBatchLogin: false,
		batchIds: null
	};
	static readonly defaultProp: Props = {};
	constructor(props: Props) {
		super(props);
		this.getGroup = debounce(this.getGroup, 1000);
		this.getCharacter = debounce(this.getCharacter, 1000);
	}
	public componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "账户管理");
		// this.getGroup();
		// //this.getFigure();
		// this.getCharacter();
		this.initPage();
	}
	componentWillUnmount() {
		this.props.cleaAccountDataAction();
	}
	// 依据编组来显示列表
	getGroup(e?: any) {
		let params: any = { page: 1, pagesize: 100 };
		if (e && typeof e === "string") {
			params.keyword = e.trim();
		}
		this.props.getGroupsAction1(params);
	}
	// 依据形象来显示列表
	getFigure(e?: any) {
		let params: any = {
			page: 1,
			pagesize: 30
		};
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getFigureListAction(params);
	}
	//依据人设来显示列表
	getCharacter(e?: any) {
		let params: any = {
			page: 1,
			pagesize: 30
		};
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getCharaterAction1(params);
	}
	// 获取标签列表
	async getTagList() {
		let { tagpage, tagpagesize } = this.state;
		this.props.getTagListAction({
			page: tagpage,
			pagesize: tagpagesize
		});
	}
	// 获取表格数据
	async getListData() {
		let {
			page,
			pagesize,
			keyword,
			statustype,
			grouptype,
			personal_desgin_id,
			isFirst
		} = this.state;
		let params: any = {
			page,
			pagesize,
			statustype
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = keyword.trim();
		}
		if (grouptype && grouptype != "0") {
			params.grouptype = grouptype;
		}
		if (personal_desgin_id && personal_desgin_id != "0") {
			params.personal_desgin_id = personal_desgin_id;
		}
		this.setState({
			isLoading: true
		});
		try {
			let res = await this.props.getAccoutListAction(params);
		} finally {
			if (isFirst) {
				this.getGroup();
				this.getCharacter();
				this.setState({
					isFirst: false
				});
			}
			this.setState({
				isLoading: false
			});
		}
	}
	// 点击分配弹出框
	openAllot(data: any) {
		this.setState({
			isShowAllot: true,
			targetID: data ? data.id : null
		});
	}
	// 关闭分配
	closeAllot() {
		this.setState({
			isShowAllot: false,
			targetID: null
		});
	}
	// 分配弹出框确定按钮
	async allotOkClick(data: any) {
		let { targetID } = this.state;
		let params: any = {
			adminuserid: data.id
		};
		if (targetID) {
			params.accountids = targetID;
		} else {
			let ids = this.getCheckedItem();
			if (ids.length <= 0) {
				message.error("请选择账户");
				return;
			}
			params.accountids = ids.join(";");
		}
		let res = await this.props.allotAction(params);
		if (res && res.code == 200) {
			message.success("分配成功");
			this.closeAllot();
		}
	}
	// 打开安装apk
	openApk(data: any) {
		if (data.status != 1) {
			message.error(
				"设备处于不正常状态,无法进行安装.请检查设备后刷新界面重试"
			);
			return;
		}
		this.setState({
			isShowApk: true,
			apkID: data.id
		});
	}
	// 关闭安装apk
	closeApk() {
		this.setState({
			isShowApk: false
		});
	}
	// 打开查看
	openDetail(data: any) {
		this.setState({
			isShowDetail: true,
			detailID: data.id
		});
	}
	// 关闭查看
	closeDetail() {
		this.setState({
			isShowDetail: false,
			detailID: ""
		});
	}
	// 单选
	singleCheckClick(item: any) {
		if (!item) {
			return;
		}
		this.props.singleCheckAccountAction({
			id: item.id,
			page: this.state.page
		});
		setTimeout(() => {
			this.checkIsAll();
		}, 0);
	}
	// 全选
	allCheckClick(e: any) {
		let type = e.target.checked;
		this.setState({
			isAll: type
		});
		this.props.allCheckAccountAction({
			type: type,
			page: this.state.page
		});
	}
	// 判断是否是全选
	checkIsAll() {
		let { accountList } = this.props;
		let { page } = this.state;
		if (
			accountList &&
			accountList.data &&
			accountList.data[page].length > 0
		) {
			let checkCount = 0;
			let len = accountList.data[page].length;

			accountList.data[page].map((item: any) => {
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
	// 打开编辑页面
	goEdit(item: any) {
		if (!item) {
			return;
		}
		window.sessionStorage.setItem("accountID", item.id);
		window.appHistory.push({
			pathname: "/account/edit"
		});
	}
	// 重新生成任务
	createTask(item: any) {
		let ids = this.getCheckedItem();
		if (!ids || ids.length <= 0) {
			message.error("请选择账号");
			return;
		}
		Modal.confirm({
			title: "提示",
			content: "你确定重新生成任务？",
			onOk: async () => {
				let res = await this.props.createAccountTaskAction({
					account_id: ids.join(";")
				});
			}
		});
	}
	// 批量上号弹窗
	openBatchLogin() {
		let ids = this.getCheckedItem1();
		if (!ids || ids.length <= 0) {
			message.error("请选择账号");
			return;
		}
		this.setState({
			isShowBatchLogin: true,
			batchIds: [...ids]
		});
	}
	closeBatchLogin() {
		this.setState({
			isShowBatchLogin: false,
			batchIds: null
		});
	}
	// 删除
	deleteClick(item: any) {
		if (!item) {
			return;
		}
		Modal.confirm({
			title: "提示",
			content: "你确定删除这个用户吗？",
			onOk: async () => {
				let res = await this.props.deleteAccountAction({
					user_ids: item.id,
					page: this.state.page
				});
				if (res && res.code == 200) {
					message.success("删除成功");
				}
			}
		});
	}
	// 打开/关闭自动聊天
	changeChatStatus(item: any, e: any) {
		if (!item) {
			return;
		}
		if (item.status != 1) {
			message.error("账号状态不正常,无法更改状态");
			return;
		}
		let params: any = {
			user_ids: item.id,
			type: e ? 1 : 2,
			page: this.state.page
		};
		this.props.changeChatStatusAction(params).then((res: any) => {
			if (res && res.code == 200) {
				message.success("操作成功");
			}
		});
	}
	// 顶部按钮-打开或关闭自动聊天
	batchChatChange(type: boolean) {
		let ids = this.getCheckedItem(true);
		if (!ids || ids.length <= 0) {
			message.error("未选择用户或者选择的用户不是正常状态");
			return;
		}
		let params: any = {
			user_ids: ids.join(","),
			type: type ? 1 : 2
		};
		this.props.changeChatStatusAction(params).then((res: any) => {
			if (res && res.code == 200) {
				message.success("操作成功");
			}
		});
	}
	// 获取复选框选中的id集合
	getCheckedItem(isNormal?: boolean): any[] {
		let { accountList } = this.props;
		let { page } = this.state;
		// let list = accountList && accountList.users ? accountList.users : [];
		let list =
			accountList && accountList.data ? accountList.data[page] : [];
		let idArr: any[] = [];
		if (list && list.length >= 0) {
			list.map((item: any) => {
				if (isNormal) {
					if (item.status == 1 && item.isChecked) idArr.push(item.id);
				} else {
					if (item.isChecked) idArr.push(item.id);
				}
			});
		}
		return idArr;
	}
	// 批量上号多选
	getCheckedItem1(isNormal?: boolean): any[] {
		let { accountList } = this.props;

		let idArr: any[] = [];
		for (let i in accountList.data) {
			let list =
				accountList && accountList.data ? accountList.data[i] : [];

			if (list && list.length >= 0) {
				list.map((item: any) => {
					if (isNormal) {
						if (item.status == 1 && item.isChecked)
							idArr.push(item.id);
					} else {
						if (item.isChecked) idArr.push(item.id);
					}
				});
			}
		}

		return Array.from(new Set(idArr));
	}
	// 顶部按钮--开启/关闭自动任务
	batchChatTaskChange(type: boolean) {
		let ids = this.getCheckedItem(true);
		if (!ids || ids.length <= 0) {
			message.error("未选择用户或者选择的用户不是正常状态");
			return;
		}
		let params: any = {
			user_ids: ids.join(","),
			type: type ? 1 : 2
		};
		this.props.changeChatAutoTaskAction(params).then((res: any) => {
			if (res && res.code == 200) {
				message.success("操作成功");
			}
		});
	}
	// 顶部按钮--删除
	batchDeleteClick() {
		let ids = this.getCheckedItem();
		if (!ids || ids.length <= 0) {
			message.error("未选择用户");
			return;
		}
		let params: any = {
			user_ids: ids.join(",")
		};
		Modal.confirm({
			title: "提示",
			content:
				ids.length > 0
					? "你确定删除选中用户吗？"
					: "你确定删除所有用户吗？",
			onOk: async () => {
				let res = await this.props.deleteAccountAction(params);
				if (res && res.code == 200) {
					message.success("删除成功");
					if (!ids || ids.length <= 0) {
						this.setState({ page: 1 }, this.getListData);
					}
				}
			}
		});
	}
	// 开/关自动任务
	changeAutoTask(item: any, e: any) {
		if (!item) {
			return;
		}
		if (item.status != 1) {
			message.error("账号状态不正常,无法更改状态");
			return;
		}
		let params: any = {
			user_ids: item.id,
			type: e ? 1 : 2,
			page: this.state.page
		};
		this.props.changeChatAutoTaskAction(params);
	}
	// 推广剧本弹框
	selectScript(data: any) {
		let ids = this.getCheckedItem();
		if ((ids && ids.length > 0) || (data && data.id)) {
			this.setState({
				isShowExtension: true,
				activeID: data && data.id ? data.id : ""
			});
		} else {
			message.error("请选择账户");
		}
	}
	// 关闭推广剧本
	closeExtension() {
		this.setState({
			isShowExtension: false
		});
	}
	// 确定推广剧本
	async extensionOkClick(data: any) {
		let { activeID } = this.state;
		let ids = this.getCheckedItem();
		let params: any = {
			account_ids: ids.length > 0 ? ids : activeID,
			extensionscript_id: data.id
		};
		let res = await this.props.setAccountExtensionScriptAction(params);
		if (res && res.code == 200) {
			message.success("剧本设置成功");
			this.closeExtension();
			this.getListData(); //重新请求
		}
	}

	async goScreen(data: any) {
		if (!data || !data.id || data.id.length <= 0) {
			return;
		}
		let res = await this.props.getScreenAddressAction({
			accountids: data.id
		});
		if (res && res.code == 200 && res.data && res.data.length > 0) {
			console.log(res.data);

			//window.open(res.data);
		}
	}
	// 表头数据
	public renderHeader(): any {
		return [
			{
				key: "name",
				class: "tc",
				width: 50,
				titleRender: () => {
					return (
						<React.Fragment>
							<Checkbox
								checked={this.state.isAll}
								onChange={this.allCheckClick.bind(this)}
							/>
						</React.Fragment>
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
			// {
			// 	name: "ID",
			// 	key: "id",
			// 	class: "tc",
			// 	width: 210
			// },
			{
				name: "Token",
				key: "device_token",
				class: "tc",
				width: 100,
				render: (item: any) => {
					return (
						<div className="line" title={item.device_token}>
							{(() => {
								let arr = item.device_token.split("_");
								if (arr[1]) {
									return arr[1];
								}
								return arr[0];
							})()}
						</div>
					);
				}
			},
			{
				name: "手机编号",
				key: "note_mobile",
				class: "tc",
				width: 200,
				render: (item: any) => {
					return (
						<div className="line" title={item.note_mobile}>
							{item.note_mobile}
						</div>
					);
				}
			},
			{
				name: "编组",
				key: "group_name",
				class: "tc",
				width: 120
			},
			// {
			// 	name: "账号",
			// 	key: "login_user",
			// 	class: "",
			// 	width: 120,
			// 	render: (item: any) => {
			// 		return (
			// 			<div className="line" title={item.login_user}>
			// 				{item.login_user}
			// 			</div>
			// 		);
			// 	}
			// },
			// {
			// 	name: "星标",
			// 	key: "is_star",
			// 	class: "tc",
			// 	width: 50,
			// 	render: (item: any) => <span>{item.star ? "是" : "否"}</span>
			// },
			{
				name: "昵称",
				key: "nickname",
				class: "tc",
				width: 100
			},
			// {
			// 	name: "性别",
			// 	key: "sex",
			// 	class: "tc",
			// 	width: 50
			// },
			{
				name: "广告剧本",
				key: "applyextensionscript",
				class: "tc",
				width: 100
			},
			// {
			// 	name: "标签",
			// 	key: "tags_desc",
			// 	class: "tc sp-td",
			// 	width: 200,
			// 	render: (item: any) => {
			// 		return (
			// 			<span>
			// 				{item &&
			// 					item.tags_desc &&
			// 					item.tags_desc.length > 0 &&
			// 					item.tags_desc.map((v: any, idx: number) => {
			// 						return (
			// 							<Tag
			// 								color="#87d068"
			// 								style={{ marginBottom: "4px" }}
			// 								key={idx}
			// 							>
			// 								{v}
			// 							</Tag>
			// 						);
			// 					})}
			// 			</span>
			// 		);
			// 	}
			// },
			{
				name: "人设",
				key: "personal_desgin_name",
				class: "tc",
				width: 100
			},
			{
				name: "号龄",
				key: "create_time",
				class: "tc",
				width: 60,
				render: (item: any) => (
					<span>
						{((item: any) => {
							let date = new Date(item.create_time);
							let now = new Date();
							let times = now.getTime() - date.getTime();
							let d = times / (1000 * 60 * 60 * 24);
							return parseInt(d.toString()) + "天";
						})(item)}
					</span>
				)
			},
			{
				name: "状态",
				key: "name",
				class: "tc",
				width: 150,
				render: (item: any) => (
					<div
						className="line"
						onClick={this.goScreen.bind(this, item)}
					>
						{item.status == 1 && (
							<span style={{ color: "#1dc433" }}>正常</span>
						)}
						{item.status == 2 && (
							<span style={{ color: "orange" }}>未登录</span>
						)}
						{item.status == 3 && (
							<span style={{ color: "red" }} title={item.err_msg}>
								封号
							</span>
						)}
						{item.status == 4 && (
							<span title={item.crash} style={{ color: "red" }}>
								系统故障
							</span>
						)}
					</div>
				)
			},
			{
				name: "备注",
				key: "note_account",
				class: "tc",
				width: 80
			},
			// {
			// 	name: "创建时间",
			// 	key: "create_time",
			// 	class: "tc",
			// 	width: 150
			// },
			{
				name: "操作",
				key: "name",
				class: "tc",
				width: 240,
				render: (item: any) => {
					return (
						<React.Fragment>
							{/* <span
								className="ctrlbtn"
								onClick={this.openApk.bind(this, item)}
								title="安装APK"
							>
								安装
							</span> */}
							<span
								className="ctrlbtn"
								onClick={this.openAllot.bind(this, item)}
							>
								分配
							</span>
							<span
								className="ctrlbtn"
								onClick={this.openDetail.bind(this, item)}
							>
								查看
							</span>
							<span
								className="ctrlbtn"
								onClick={this.selectScript.bind(this, item)}
							>
								剧本
							</span>
							<span
								className="ctrlbtn"
								onClick={this.openCharacter.bind(this, [item])}
							>
								人设
							</span>
							{window.viliAuth(
								"5cebbb94e935680d0497d241",
								"5cebbee3e935680428222b99"
							) && (
								<React.Fragment>
									<span
										className="ctrlbtn edit"
										onClick={this.goEdit.bind(this, item)}
									>
										编辑
									</span>
									{/* <span
										className="ctrlbtn edit"
										onClick={this.createTask.bind(
											this,
											item
										)}
									>
										生成模板
									</span> */}
								</React.Fragment>
							)}

							{window.viliAuth(
								"5cebbb94e935680d0497d241",
								"5cebbefbe935680428222b9b"
							) && (
								<span
									className="ctrlbtn delete"
									onClick={this.deleteClick.bind(this, item)}
								>
									删除
								</span>
							)}
							{(!window.managerAction[
								"5cebbb94e935680d0497d241"
							] ||
								(!window.viliAuth(
									"5cebbb94e935680d0497d241",
									"5cebbee3e935680428222b99"
								) &&
									!window.viliAuth(
										"5cebbb94e935680d0497d241",
										"5cebbefbe935680428222b9b"
									))) &&
								"无权限"}
						</React.Fragment>
					);
				}
			},
			{
				name: "自动任务",
				class: "tc",
				width: 80,
				render: (item: any) => {
					return (
						item.chat_status && (
							<Switch
								disabled={
									!window.viliAuth(
										"5cebbb94e935680d0497d241",
										"5cebbee3e935680428222b99"
									)
								}
								checkedChildren="开"
								unCheckedChildren="关"
								checked={item.is_auto_task}
								onChange={this.changeAutoTask.bind(this, item)}
							/>
						)
					);
				}
			},
			{
				name: "自动聊天",
				class: "tc",
				width: 80,
				render: (item: any) => {
					return (
						item.chat_status && (
							<Switch
								disabled={
									!window.viliAuth(
										"5cebbb94e935680d0497d241",
										"5cebbee3e935680428222b99"
									)
								}
								checkedChildren="开"
								unCheckedChildren="关"
								checked={item.chat_status == 1}
								onChange={this.changeChatStatus.bind(
									this,
									item
								)}
							/>
						)
					);
				}
			}
			// {
			// 	name: "自动任务",
			// 	key: "create_time",
			// 	class: "tc",
			// 	width: 100,
			// 	render: (item: any) => {
			// 		return <Switch />;
			// 	}
			// }
		];
	}
	// 打开添加账号弹框
	public openNewAccount() {
		this.setState({
			isShowNewAccount: true
		});
	}
	// 关闭添加账号弹框
	public closeNewAccount() {
		this.setState({
			isShowNewAccount: false
		});
	}
	// 打开编组弹框
	public openGroup() {
		this.setState({
			isShowGroup: true
		});
	}
	public closeGroup() {
		this.setState({
			isShowGroup: false
		});
	}
	// 搜索
	goByQuery() {
		let {
			page,
			keyword,
			statustype,
			grouptype,
			personal_desgin_id
		} = this.state;
		let params: any = {
			page,
			statustype
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = encodeURI(keyword.trim());
		}
		if (grouptype && grouptype != "0") {
			params.grouptype = grouptype;
		}
		if (personal_desgin_id && personal_desgin_id != "0") {
			params.personal_desgin_id = personal_desgin_id;
		}
		this.goPage(params);
	}
	// input框
	InputChange(type: string, e: any) {
		let set: any = {
			[type]: e
		};
		this.props.cleaAccountDataAction();
		this.setState(set, this.searchClick);
	}
	// 安装APP任务
	async installAppOk(data: any) {
		if (!data) {
			return;
		}
		let res = await this.props.installAppAction(data);
		if (res && res.code == 200) {
			message.success("安装APP任务发送成功");
			this.closeApk();
			return "success";
		}
	}
	// 打开人设弹框
	openCharacter(data?: any[]) {
		this.setState({
			isShowCharacter: true,
			characterTarget: [...data]
		});
	}
	// 关闭人设弹框
	closeCharacter() {
		this.setState({
			isShowCharacter: false,
			characterTarget: null
		});
	}
	// 多选--打开人设弹框
	batchCharacter() {
		let { accountList } = this.props;
		let { page } = this.state;
		let res: any = [];
		if (
			accountList &&
			accountList.data &&
			accountList.data[page] &&
			accountList.data[page].length > 0
		) {
			accountList.data[page].map((v: any) => {
				if (v.isChecked) {
					res.push(v);
				}
			});
		}
		if (!res || res.length <= 0) {
			message.error("请选择账号");
			return;
		}
		this.openCharacter(res);
	}
	// 屏幕截图
	async getScreen() {
		let ids = this.getCheckedItem();
		let { createUserTaskAction } = this.props;
		if (!ids || ids.length <= 0) {
			message.error("请选择账号");
			return;
		}
		let params: any = {};
		params.account_ids = ids;
		params.type = "User";
		params.sub_type = "User_upload_screen";
		params.execute_hi = "0";
		params.User_upload_screen = {
			Name: ""
		};
		if (createUserTaskAction && typeof createUserTaskAction == "function") {
			let loader = Toast.loading(
				"正在截屏，请稍后......截屏过程中请勿刷新等操作。",
				0
			);
			let res: any;
			try {
				res = await this.props.createUserTaskAction({
					taskobj: JSON.stringify(params)
				});
			} finally {
				loader.close();
			}
			if (res && res.code == 200) {
				Modal.confirm({
					title: null,
					content: (
						<span style={{ top: "-8px", position: "relative" }}>
							截图成功，是否立即下载？
							{res.msg && res.msg.length != "success" ? (
								<React.Fragment>
									<br />
									<span style={{ color: "red" }}>
										{res.msg}
									</span>
								</React.Fragment>
							) : (
								""
							)}
						</span>
					),
					icon: (
						<Icon type="check-circle" style={{ color: "green" }} />
					),
					onOk: () => {
						window.open(res.data);
					}
				});
			}
		}
	}
	// 清楚设备
	async clearDevice() {
		let ids = this.getCheckedItem();
		let { createUserTaskAction } = this.props;
		if (!ids || ids.length <= 0) {
			message.error("请选择账号");
			return;
		}
		let params: any = {};
		params.account_ids = ids;
		params.type = "User";
		params.sub_type = "User_clear_device";
		params.execute_hi = "0";
		params.User_clear_device = {
			Name: ""
		};
		if (createUserTaskAction && typeof createUserTaskAction == "function") {
			let res: any;
			try {
				res = await this.props.createUserTaskAction({
					taskobj: JSON.stringify(params)
				});
			} finally {
			}
			if (res && res.code == 200) {
				message.success("清除手机设备任务发布成功");
			}
		}
	}
	public render() {
		let {
			isShowNewAccount,
			isLoading,
			page,
			pagesize,
			isShowGroup,
			keyword,
			statustype,
			grouptype,
			isShowDetail,
			detailID,
			isShowApk,
			apkID,
			isShowAllot,
			isShowExtension,
			isShowCharacter,
			personal_desgin_id,
			characterTarget,
			isShowBatchLogin,
			batchIds
		} = this.state;
		let {
			accountList,
			tagList,
			getTagListAction,
			getFigureListAction,
			addAccountAction,
			groupList,
			getGroupsAction,
			getAccountListByGroupAction,
			accountListByGroup,
			deleteGroupAction,
			addGroupsAction,
			groupList1,
			modalAccountDetail,
			modalAccountDevice,
			getModalAccountDetailAction,
			getModalAccountDeviceAction,
			getAppListAction,
			getCustomerListAction,
			getExtensionScriptAction,
			getCharaterAction,
			characterList,
			characterList1,
			userSetPersonDesignAction,
			batchAccountLoginAction,
			batchAccountList,
			exportAccountDataAction
		} = this.props;
		if (
			!window.viliAuth(
				"5cebbb94e935680d0497d241",
				"5cebbea7e935680428222b95"
			)
		) {
			return (
				<div style={{ textAlign: "center", padding: "100px 0" }}>
					无权限
				</div>
			);
		}
		return (
			<div className="account-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el">
							{/* <Popover
								placement="bottomLeft"
								overlayClassName="filter-box"
								content={
									<React.Fragment>
										<div className="filter-item">
											<span>状态:</span>
											<Select
												value={statustype}
												onChange={this.InputChange.bind(
													this,
													"statustype"
												)}
												style={{
													width: "270px",
													margin: "0 5px"
												}}
											>
												<Option value={0}>全部</Option>
												<Option value={1}>正常</Option>
												<Option value={2}>
													未登录
												</Option>
												<Option value={3}>封号</Option>
												<Option value={4}>
													设备异常
												</Option>
											</Select>
										</div>
										<div className="filter-item">
											<span>编组:</span>
											<Select
												value={grouptype}
												onChange={this.InputChange.bind(
													this,
													"grouptype"
												)}
												style={{
													width: "270px",
													margin: "0 5px"
												}}
												onSearch={this.getGroup.bind(
													this
												)}
												showSearch={true}
												filterOption={false}
											>
												<Option value={"0"}>
													全部
												</Option>
												{groupList1 &&
													groupList1.accountgroups &&
													groupList1.accountgroups
														.length > 0 &&
													groupList1.accountgroups.map(
														(v: any, i: number) => {
															return (
																<Option
																	key={v.id}
																	value={v.id}
																>
																	{v.name}
																</Option>
															);
														}
													)}
											</Select>
										</div>
										<div className="filter-item">
											<span>形象:</span>
											<Select
												value={figure_id}
												filterOption={false}
												onChange={this.InputChange.bind(
													this,
													"figure_id"
												)}
												style={{
													width: "270px",
													margin: "0 5px"
												}}
												onSearch={this.getFigure.bind(
													this
												)}
												showSearch={true}
											>
												<Option value={"0"}>
													全部
												</Option>
												{figureList &&
													figureList.figures &&
													figureList.figures.length >
														0 &&
													figureList.figures.map(
														(v: any, i: number) => {
															return (
																<Option
																	key={
																		v.figure_id
																	}
																	value={
																		v.figure_id
																	}
																>
																	{
																		v.basic
																			.name
																	}
																</Option>
															);
														}
													)}
											</Select>
										</div>
										<div className="filter-item">
											<Input
												value={keyword}
												className="keyword-input"
												placeholder="请输入关键词"
												onChange={window.Util.InputChange.bind(
													this,
													"keyword"
												)}
											/>
											<Button
												type="primary"
												onClick={this.searchClick.bind(
													this
												)}
											>
												搜索
											</Button>
										</div>
									</React.Fragment>
								}
							>
								<Button className="ctrl-btn" type="primary">
									筛选
								</Button>
							</Popover> */}
							<div className="filtrate-box">
								{/* 状态 */}
								<div className="filtrate-item">
									<span>状态:</span>
									<Select
										value={statustype}
										onChange={this.InputChange.bind(
											this,
											"statustype"
										)}
										style={{
											width: "200px",
											margin: "0 5px"
										}}
									>
										<Option value={0}>全部</Option>
										<Option value={1}>正常</Option>
										<Option value={2}>未登录</Option>
										<Option value={3}>封号</Option>
										<Option value={4}>设备异常</Option>
									</Select>
								</div>
								{/* 编组 */}
								<div className="filtrate-item">
									<span>编组:</span>
									<Select
										value={grouptype}
										onChange={this.InputChange.bind(
											this,
											"grouptype"
										)}
										style={{
											width: "200px",
											margin: "0 5px"
										}}
										onSearch={this.getGroup.bind(this)}
										showSearch={true}
										filterOption={false}
									>
										<Option value={"0"}>全部</Option>
										{groupList1 &&
											groupList1.accountgroups &&
											groupList1.accountgroups.length >
												0 &&
											groupList1.accountgroups.map(
												(v: any, i: number) => {
													return (
														<Option
															key={v.id}
															value={v.id}
														>
															{v.name}
														</Option>
													);
												}
											)}
									</Select>
								</div>
								{/* 形象 */}
								<div className="filtrate-item">
									<span>人设:</span>
									<Select
										value={personal_desgin_id}
										filterOption={false}
										onChange={this.InputChange.bind(
											this,
											"personal_desgin_id"
										)}
										style={{
											width: "200px",
											margin: "0 5px"
										}}
										onSearch={this.getCharacter.bind(this)}
										showSearch={true}
									>
										<Option value={"0"}>全部</Option>
										{characterList1 &&
											characterList1.personaldesgins &&
											characterList1.personaldesgins
												.length > 0 &&
											characterList1.personaldesgins.map(
												(v: any, i: number) => {
													return (
														<Option
															key={v._id}
															value={v._id}
														>
															{v.title}
														</Option>
													);
												}
											)}
									</Select>
								</div>
								{/* 搜索 */}
								<div className="filtrate-item">
									<Input
										value={keyword}
										style={{ width: 200 }}
										className="keyword-input"
										placeholder="请输入手机编号/昵称/Token"
										onChange={window.Util.InputChange.bind(
											this,
											"keyword"
										)}
									/>
									<Button
										type="primary"
										onClick={this.searchClick.bind(this)}
									>
										搜索
									</Button>
								</div>
							</div>
							{window.viliAuth(
								"5cebbb94e935680d0497d241",
								"5cebbee3e935680428222b99"
							) && (
								<React.Fragment>
									<Button
										className="ctrl-btn"
										type="primary"
										onClick={this.openGroup.bind(this)}
									>
										编组
									</Button>
									<Button
										className="ctrl-btn"
										type="primary"
										onClick={this.batchCharacter.bind(this)}
									>
										人设
									</Button>
									{/* <Icon
										className="list-top-icon"
										title="编组"
										type="usergroup-add"
										onClick={this.openGroup.bind(this)}
									/> */}
									{/* <i
										className="icon-task"
										onClick={this.batchChatTaskChange.bind(
											this,
											true
										)}
										title="开启自动任务"
									/> */}
									<Button
										className="ctrl-btn"
										type="primary"
										onClick={this.batchChatTaskChange.bind(
											this,
											true
										)}
									>
										开启自动任务
									</Button>
									{/* <i
										className="icon-task-close"
										onClick={this.batchChatTaskChange.bind(
											this,
											false
										)}
										title="关闭自动任务"
									/> */}
									<Button
										className="ctrl-btn"
										type="danger"
										onClick={this.batchChatTaskChange.bind(
											this,
											false
										)}
									>
										关闭自动任务
									</Button>
									{/* <i
										className="icon-message"
										onClick={this.batchChatChange.bind(
											this,
											true
										)}
										title="开启自动聊天"
									/> */}
									<Button
										className="ctrl-btn"
										type="primary"
										onClick={this.batchChatChange.bind(
											this,
											true
										)}
									>
										开启自动聊天
									</Button>
									{/* <i
										className="icon-message-close"
										onClick={this.batchChatChange.bind(
											this,
											false
										)}
										title="关闭自动聊天"
									/> */}
									<Button
										className="ctrl-btn"
										type="danger"
										onClick={this.batchChatChange.bind(
											this,
											false
										)}
									>
										关闭自动聊天
									</Button>
									{/* <Icon
										type="apartment"
										className="list-top-icon"
										title="分配"
										onClick={this.openAllot.bind(
											this,
											null
										)}
									/> */}
								</React.Fragment>
							)}
							{window.viliAuth(
								"5cefaa84875bc01b14b759d8",
								"5cefab0b875bc01b14b759dc"
							) && (
								<Button
									className="ctrl-btn"
									type="primary"
									onClick={this.openAllot.bind(this, null)}
								>
									分配
								</Button>
							)}

							{window.viliAuth(
								"5cebbb94e935680d0497d241",
								"5cebbefbe935680428222b9b"
							) && (
								// <Icon
								// 	className="list-top-icon"
								// 	title="删除"
								// 	type="delete"
								// 	onClick={this.batchDeleteClick.bind(this)}
								// />
								<Button
									className="ctrl-btn"
									type="danger"
									onClick={this.batchDeleteClick.bind(this)}
								>
									删除
								</Button>
							)}
							{window.viliAuth(
								"5cebbb94e935680d0497d241",
								"5cebbee3e935680428222b99"
							) && (
								<Button
									className="ctrl-btn"
									type="primary"
									onClick={this.selectScript.bind(this)}
								>
									推广剧本
								</Button>
							)}
							{/* <Button className="ctrl-btn" type="primary" disabled={true}>
								屏幕截图
							</Button> */}
							<Button
								className="ctrl-btn"
								type="primary"
								onClick={this.getScreen.bind(this)}
							>
								屏幕截图
							</Button>
							<Button
								className="ctrl-btn"
								type="primary"
								onClick={this.clearDevice.bind(this)}
							>
								清除设备
							</Button>
							<Button
								className="ctrl-btn"
								type="primary"
								onClick={this.createTask.bind(this)}
							>
								重新生成任务
							</Button>
							<Button
								className="ctrl-btn"
								type="primary"
								onClick={this.openBatchLogin.bind(this)}
							>
								批量上号
							</Button>
						</div>
						<div className="right-el">
							{/* {window.viliAuth(
								"5cebbb94e935680d0497d241",
								"5cebbee3e935680428222b99"
							) && (
								<React.Fragment>
									<Button
										className="header-left-btn"
										type="primary"
										onClick={this.openGroup.bind(this)}
									>
										编组
									</Button>
									<Button
										className="header-left-btn"
										type="primary"
										onClick={this.batchChatTaskChange.bind(
											this,
											true
										)}
									>
										开启自动任务
									</Button>
									<Button
										className="header-left-btn"
										type="danger"
										onClick={this.batchChatTaskChange.bind(
											this,
											false
										)}
									>
										关闭自动任务
									</Button>
									<Button
										className="header-left-btn"
										type="primary"
										onClick={this.batchChatChange.bind(
											this,
											true
										)}
									>
										开启自动聊天
									</Button>
									<Button
										className="header-left-btn"
										type="danger"
										onClick={this.batchChatChange.bind(
											this,
											false
										)}
									>
										关闭自动聊天
									</Button>
								</React.Fragment>
							)}
							{window.viliAuth(
								"5cebbb94e935680d0497d241",
								"5cebbefbe935680428222b9b"
							) && (
								<Button
									className="header-left-btn"
									type="danger"
									onClick={this.batchDeleteClick.bind(this)}
								>
									删除
								</Button>
							)} */}

							{/* <Button
								type="primary"
								onClick={this.openNewAccount.bind(this)}
							>
								添加账号
							</Button> */}
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={
								accountList &&
								accountList.data &&
								accountList.data[page]
							}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							total={accountList && accountList.total}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
						/>
					</div>
				</div>
				{/* <NewAccount
					visible={isShowNewAccount}
					onCancel={this.closeNewAccount.bind(this)}
					tagList={tagList}
					figureList={figureList}
					getTag={getTagListAction}
					getFigure={getFigureListAction}
					addFunction={addAccountAction}
				/> */}
				{/* 打开编组模态框 */}
				{isShowGroup && (
					<Group
						visible={isShowGroup}
						getAccountListByGroupAction={
							getAccountListByGroupAction
						}
						accountListByGroup={accountListByGroup}
						data={groupList}
						getData={getGroupsAction}
						addGroups={addGroupsAction}
						deleteAction={deleteGroupAction}
						onCancel={this.closeGroup.bind(this)}
					/>
				)}
				{/* 打开查看模态框 */}
				{isShowDetail && (
					<Detail
						modalAccountDetail={modalAccountDetail}
						modalAccountDevice={modalAccountDevice}
						getModalAccountDetailAction={
							getModalAccountDetailAction
						}
						getModalAccountDeviceAction={
							getModalAccountDeviceAction
						}
						visible={isShowDetail}
						targetID={detailID}
						onCancel={this.closeDetail.bind(this)}
					/>
				)}
				{isShowApk && (
					<Apk
						visible={isShowApk}
						onCancel={this.closeApk.bind(this)}
						getData={getAppListAction}
						id={apkID}
						onOk={this.installAppOk.bind(this)}
					/>
				)}
				<Allot
					getCustomerListAction={getCustomerListAction}
					visible={isShowAllot}
					onCancel={this.closeAllot.bind(this)}
					onOk={this.allotOkClick.bind(this)}
				/>
				<ExtensionBox
					visible={isShowExtension}
					getExtensionScriptAction={getExtensionScriptAction}
					onCancel={this.closeExtension.bind(this)}
					onOk={this.extensionOkClick.bind(this)}
				/>
				<Character
					visible={isShowCharacter}
					onCancel={this.closeCharacter.bind(this)}
					getData={getCharaterAction}
					data={characterList}
					setData={userSetPersonDesignAction}
					users={characterTarget}
					onSuccess={this.getListData.bind(this)}
				/>
				{/* 批量上号 */}
				{isShowBatchLogin && (
					<BatchLogin
						visible={isShowBatchLogin}
						onCancel={this.closeBatchLogin.bind(this)}
						batchIds={batchIds}
						batchAccountLoginAction={batchAccountLoginAction}
						batchAccountList={batchAccountList}
						exportAccountDataAction={exportAccountDataAction}
						// data={}
					/>
				)}
			</div>
		);
	}
}
