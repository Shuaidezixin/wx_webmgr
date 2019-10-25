import * as React from "react";
import { Select, Button, Icon, Popover, Input, Modal, message } from "antd";
import TableBox from "@component/tablebox";
import User from "../components/user";
import TaskCreate from "../components/task";
import TaskList from "../components/tasklist";
import InputBox from "@component/inputbox";
import * as classnames from "classnames";
import "./index.less";

const Option = Select.Option;
interface Props {
	getAccountListAction?: Function;
	accountList?: any;
	createUserTaskAction?: Function;
	uploadAction?: Function;
	groupList?: any;
	getGroupsAction?: Function;
	settingTask?: any;
	getSettingTaskAction?: Function;
	shortGroupList?: any;
	getShortGroupListAction?: Function;
	createOrUpdateShortGroupAction?: Function;
	deleteShortGroupAction?: Function;
	getBeforeAction?: Function;
	figureList?: any;
	getFigureListAction?: Function;
	tagList1?: any;
	getTagListAction1?: Function;
	nearestList?: any;
	getNearestListAction?: any;
	getCharaterAction1?: Function;
	characterList1?: any;
}
interface State {
	showType: ShowType;
	userList: any;
	groupKey: string;
	shortGroupKey: string;
	isOperateShortGroup: boolean;
	isShowGroupModal: boolean;
	shortGroupName: string | void;
	isCreateShortGroup: boolean;
	isInit: boolean;
}
declare type ShowType = "user" | "task";

export default class Root extends React.PureComponent<Props, State> {
	private userCreatePage: React.RefObject<HTMLDivElement>;
	constructor(props: Props) {
		super(props);
		this.userCreatePage = React.createRef();
	}
	readonly state: State = {
		showType: "task",
		userList: [],
		groupKey: "-1",
		shortGroupKey: "-1",
		isOperateShortGroup: false,
		isShowGroupModal: false,
		shortGroupName: null,
		isCreateShortGroup: false,
		isInit: true
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "任务管理");
		this.getGroupList();
		this.getShortGroup();
		this.getBefore();
		window.sessionStorage.removeItem("getAccountTaskState");
		this.initWidth();
		window.addEventListener("resize", this.initWidth.bind(this), false);
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.initWidth.bind(this), false);
	}

	async getBefore() {
		let res = await this.props.getBeforeAction();
		if (res && res.code == 200) {
			if (res.data) {
				let users = res.data.users;
				this.setState({
					userList: users ? [...users] : []
				});
			}
		}
	}
	async getShortGroup() {
		let res = await this.props.getShortGroupListAction();
	}
	async getGroupList() {
		let params: any = {
			page: 1,
			pagesize: 1000,
			type: "task"
		};
		let res = await this.props.getGroupsAction(params);
	}
	initWidth() {
		let w = document.body.clientWidth;
		if (this.userCreatePage.current) {
			this.userCreatePage.current.style.width = w - 520 - 160 + "px";
		}
	}
	renderCtrlHeader() {
		return [
			{
				name: "编组",
				key: "group_name",
				class: "tc td80"
			},
			{
				name: "手机编号",
				key: "note_mobile"
			},
			{
				name: "昵称",
				key: "nickname",
				width: 100
			},
			{
				name: "操作",
				key: "name",
				class: "td50 tc",
				render: (item: any) => {
					return (
						<Icon
							type="delete"
							className="userlist-delete"
							onClick={this.userListDeleteClick.bind(this, item)}
						/>
					);
				}
			}
		];
	}
	userListDeleteClick(item: any) {
		let { userList } = this.state;
		let newUser = userList.filter((v: any) => {
			if (v.id != item.id) {
				return v;
			}
		});
		this.setState({
			userList: [...newUser],
			isInit: false
		});
	}
	ChangeTypeClick(type: ShowType) {
		this.setState({
			showType: type
		});
	}
	userSelectChange(selectData: any, type: boolean) {
		let { userList } = this.state;
		if (!selectData || !selectData.data || selectData.data.length <= 0) {
			return;
		}
		if (!type) {
			let oldID: any = [];
			if (userList && userList.length > 0) {
				userList.map((item: any) => {
					oldID.push(item.id);
				});
			}
			let canPush = selectData.data.filter((item: any) => {
				if (oldID.indexOf(item.id) == -1) {
					return item;
				}
			});
			this.setState({
				userList: [...userList, ...canPush],
				isInit: false
			});
		}
		if (type) {
			let selectID: string[] = [];
			selectData.data.map((item: any) => {
				selectID.push(item.id);
			});
			let newArr: any[] = [];
			if (userList && userList.length > 0) {
				newArr = userList.filter((item: any) => {
					if (selectID.indexOf(item.id) == -1) {
						return item;
					}
				});
			}
			this.setState({
				userList: [...newArr],
				isInit: false
			});
		}
	}
	clearUser() {
		this.setState({
			userList: []
		});
	}
	groupChange(e: any) {
		let { userList, isInit, groupKey } = this.state;
		let { groupList } = this.props;
		let set: any = {
			groupKey: e,
			isOperateShortGroup: false,
			isInit: false,
			shortGroupKey: "-1"
		};

		if (userList && userList.length > 0 && !isInit) {
			userList = userList.filter((v: any) => {
				if (!v.isFromGroup) {
					return v;
				}
			});
		} else {
			userList = [];
		}
		let userIds: any = [];
		if (userList && userList.length > 0 && !isInit) {
			userList.map((v: any) => {
				userIds.push(v.id);
			});
		}
		if (groupKey != "-1") {
			if (
				groupList &&
				groupList[groupKey] &&
				groupList[groupKey].account &&
				groupList[groupKey].account.length > 0
			) {
				groupList[groupKey].account.map((v: any) => {
					if (userIds.includes(v._id)) {
						let id = userIds.indexOf(v._id);
						userList.splice(id, 1);
					}
				});
			}
		}
		if (e != "-1") {
			if (
				groupList &&
				groupList.accountgroups &&
				groupList.accountgroups[e] &&
				groupList.accountgroups[e].account &&
				groupList.accountgroups[e].account.length > 0
			) {
				groupList.accountgroups[e].account.map((v: any) => {
					v.isFromGroup = true;
					v.id = v._id;
					//v.group_name = groupList.accountgroups[e].name;
					if (!userIds.includes(v.id)) {
						userList.push(v);
					}
				});
			}
		}
		set.userList = [...userList];
		this.setState(set);
	}
	shortGroupChange(e: any) {
		let { userList, isInit, shortGroupKey } = this.state;
		let { shortGroupList } = this.props;
		let set: any = {
			shortGroupKey: e,
			groupKey: "-1",
			isOperateShortGroup: true,
			isInit: false
		};
		if (userList && userList.length > 0 && !isInit) {
			userList = userList.filter((v: any) => {
				if (!v.isFromGroup) {
					return v;
				}
			});
		} else {
			userList = [];
		}

		let userIds: any = [];
		if (userList && userList.length > 0 && !isInit) {
			userList.map((v: any) => {
				userIds.push(v.id);
			});
		}
		if (shortGroupKey != "-1") {
			if (
				shortGroupList &&
				shortGroupList[shortGroupKey] &&
				shortGroupList[shortGroupKey].account &&
				shortGroupList[shortGroupKey].account.length > 0
			) {
				shortGroupList[shortGroupKey].account.map((v: any) => {
					if (userIds.includes(v._id)) {
						let id = userIds.indexOf(v._id);
						userList.splice(id, 1);
					}
				});
			}
		}
		if (e != "-1") {
			if (
				shortGroupList &&
				shortGroupList[e] &&
				shortGroupList[e].account &&
				shortGroupList[e].account.length > 0
			) {
				shortGroupList[e].account.map((v: any) => {
					v.isFromGroup = true;
					v.id = v._id;
					if (!userIds.includes(v.id)) {
						userList.push(v);
					}
				});
			}
		}
		set.userList = [...userList];
		this.setState(set);
	}
	openGroupModal() {
		this.setState({
			isShowGroupModal: true,
			isCreateShortGroup: true
		});
	}
	closeGroupModal() {
		this.setState({
			isShowGroupModal: false,
			isCreateShortGroup: false
		});
	}
	async groupModalOkClick() {
		let {
			isCreateShortGroup,
			isOperateShortGroup,
			shortGroupName,
			userList
		} = this.state;
		let ids: any[] = [];
		if (userList && userList.length > 0) {
			userList.map((v: any) => {
				ids.push(v.id);
			});
		}
		let params: any = {
			accountids: ids.join(";")
		};
		if (isCreateShortGroup) {
			params.tempgroupname = shortGroupName;
		}
		let res = await this.props.createOrUpdateShortGroupAction(params);
		if (res && res.code == 200) {
			message.success("创建临时编组成功");
			this.closeGroupModal();
			this.getShortGroup();
		}
	}
	async saveGroupClick() {
		let { shortGroupKey, userList } = this.state;
		let { shortGroupList } = this.props;
		let ids: any[] = [];

		if (userList && userList.length > 0) {
			userList.map((v: any) => {
				ids.push(v._id ? v._id : v.id);
			});
		}
		let params: any = {
			accountids: ids.join(";")
		};
		let d = shortGroupList[shortGroupKey].id;
		params.tempgroupid = d;
		let res = await this.props.createOrUpdateShortGroupAction(params);
		if (res && res.code == 200) {
			message.success("修改临时编组成功");
			//this.closeGroupModal();
			this.getShortGroup();
		}
	}
	deleteShort() {
		let { shortGroupKey } = this.state;
		let { shortGroupList } = this.props;
		let d = shortGroupList[shortGroupKey].id;
		Modal.confirm({
			title: "提示",
			content: "你确定删除此临时编组吗？",
			onOk: async () => {
				let res = await this.props.deleteShortGroupAction({
					tempgroupid: d
				});
				if (res && res.code == 200) {
					message.success("删除临时编组成功");
					this.getShortGroup();
				}
			}
		});
	}
	render() {
		let {
			showType,
			userList,
			groupKey,
			shortGroupKey,
			isOperateShortGroup,
			isShowGroupModal,
			shortGroupName,
			isInit
		} = this.state;
		let {
			getAccountListAction,
			accountList,
			createUserTaskAction,
			uploadAction,
			groupList,
			getSettingTaskAction,
			settingTask,
			shortGroupList,
			getFigureListAction,
			figureList,
			tagList1,
			getTagListAction1,
			nearestList,
			getNearestListAction,
			getCharaterAction1,
			characterList1
		} = this.props;
		return (
			<div className="taskmanager-page">
				<div className="task-left">
					<div className="ctrl-div">
						<div className="select-div">
							{groupList &&
								groupList.accountgroups &&
								groupList.accountgroups.length > 0 && (
									<Select
										className="select ctrl-item"
										size="small"
										value={groupKey}
										onChange={this.groupChange.bind(this)}
									>
										<Option key={"-1"}>请选择编组</Option>
										{groupList.accountgroups.map(
											(v: any, idx: number) => {
												return (
													<Option key={`${idx}`}>
														{v && v.name}
													</Option>
												);
											}
										)}
									</Select>
								)}
						</div>
						<div className="select-div">
							{shortGroupList &&
								shortGroupList &&
								shortGroupList.length > 0 && (
									<Select
										className="select ctrl-item"
										size="small"
										value={shortGroupKey}
										onChange={this.shortGroupChange.bind(
											this
										)}
									>
										<Option key={"-1"}>
											请选择临时编组
										</Option>
										{shortGroupList.map(
											(v: any, idx: number) => {
												return (
													<Option key={`${idx}`}>
														{v && v.name}
													</Option>
												);
											}
										)}
									</Select>
								)}
						</div>
						<Button
							type="primary"
							className="ctrl-item"
							size="small"
							onClick={this.ChangeTypeClick.bind(this, "user")}
						>
							选择用户
						</Button>
						<Button
							type="primary"
							className="ctrl-item"
							size="small"
							onClick={this.clearUser.bind(this)}
						>
							清空列表
						</Button>
						{/* <Button
							type="primary"
							className="ctrl-item"
							size="small"
							onClick={this.ChangeTypeClick.bind(this, "task")}
						>
							任务
						</Button> */}
					</div>
					<div className="user-list">
						<TableBox
							headerList={this.renderCtrlHeader()}
							data={userList}
							isFullPage={false}
						/>
						{!isInit &&
							userList &&
							userList.length > 0 &&
							!isOperateShortGroup && (
								<div
									className="create-new-short"
									onClick={this.openGroupModal.bind(this)}
								>
									创建临时编组
								</div>
							)}
						{!isInit &&
							userList &&
							userList.length > 0 &&
							isOperateShortGroup && (
								<Popover
									content={
										<div className="popover-box">
											<div
												className="popover-item"
												onClick={this.saveGroupClick.bind(
													this
												)}
											>
												保存编组
											</div>
											<div
												className="popover-item"
												onClick={this.openGroupModal.bind(
													this
												)}
											>
												新建编组
											</div>
											<div
												className="popover-item"
												onClick={this.deleteShort.bind(
													this
												)}
											>
												移除编组
											</div>
										</div>
									}
								>
									<span className="create-new-short">
										修改临时编组
									</span>
								</Popover>
							)}
					</div>
				</div>
				<div className="task-right" ref={this.userCreatePage}>
					<div
						className={classnames(
							"container",
							showType == "user" && "show"
						)}
					>
						<User
							data={accountList}
							getData={getAccountListAction}
							onChange={this.userSelectChange.bind(this)}
							selectedData={userList}
							goTask={this.ChangeTypeClick.bind(this, "task")}
							figureList={figureList}
							getFigureListAction={getFigureListAction}
							tagList1={tagList1}
							getTagListAction1={getTagListAction1}
							getCharaterAction1={getCharaterAction1}
							characterList1={characterList1}
						/>
					</div>

					<div
						className={classnames(
							"container",
							showType == "task" && "show"
						)}
					>
						{/* 老的手动任务 */}
						{/* {window.viliAuth(
							"5cebbbcee935680d0497d247",
							"5cebbfb9e935680428222baf"
						) && (
							<TaskCreate
								selectedData={userList}
								createUserTaskAction={createUserTaskAction}
								getSettingTaskAction={getSettingTaskAction}
								settingTask={settingTask}
							/>
						)} */}
						{/* 新的手动任务 */}
						{window.viliAuth(
							"5cebbbcee935680d0497d247",
							"5cebbfb9e935680428222baf"
						) && (
							<TaskList
								getSettingTaskAction={getSettingTaskAction}
								selectedData={userList}
								createUserTaskAction={createUserTaskAction}
								nearestList={nearestList}
								getNearestListAction={getNearestListAction}
							/>
						)}
						{!window.viliAuth(
							"5cebbbcee935680d0497d247",
							"5cebbfb9e935680428222baf"
						) && (
							<div
								style={{
									textAlign: "center",
									padding: "100px 0"
								}}
							>
								无操作权限
							</div>
						)}
					</div>
				</div>
				<Modal
					visible={isShowGroupModal}
					title={`临时编组`}
					onCancel={this.closeGroupModal.bind(this)}
					onOk={this.groupModalOkClick.bind(this)}
				>
					<InputBox
						autoWidth={true}
						labelName="临时编组名称"
						value={shortGroupName}
						onChange={window.Util.InputChange.bind(
							this,
							"shortGroupName"
						)}
					/>
				</Modal>
			</div>
		);
	}
}
