import * as React from "react";
import { Button, Input, Icon, Modal, Switch, message, Empty } from "antd";
import * as classnames from "classnames";
import InputBox from "@component/inputbox";
import debounce from "lodash/debounce";
import Scrollbars from "react-custom-scrollbars";
import "./index.less";

interface Props {
	departmentList?: any;
	getDepartmentListAction?: Function;
	addDepartmentAction?: Function;
	deleteDepartmentAction?: Function;
	getRoleListAction?: Function;
	roleList?: any;
	addCustomerAction?: Function;
	deleteCustomerAction?: Function;
	getCustomerListAction?: Function;
	customerList?: any;
}
interface State {
	departmentId: string;
	isShowDepartment: boolean;
	isShowCustomer: boolean;
	departmentPage: number;
	departmentPagesize: number;
	customerPage: number;
	customerPagesize: number;
	department: Department;
	departmentActiveId: string;
	customer: Customer;
	isGetRole: boolean;
	keyword: string;
}
interface Department {
	name: string;
	describe: string;
}
interface Customer {
	_id: string;
	username: string;
	password: string;
	phone: string;
	role: any;
	status: boolean;
	nickname: string;
}
export default class Manager extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.getRoleList = debounce(this.getRoleList.bind(this), 800);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		keyword: "",
		isShowDepartment: false,
		departmentId: "",
		departmentActiveId: "",
		isShowCustomer: false,
		isGetRole: false,
		departmentPage: 1,
		departmentPagesize: 1000,
		customerPage: 1,
		customerPagesize: 500,
		department: {
			name: "",
			describe: ""
		},
		customer: {
			_id: "",
			username: "",
			password: "",
			phone: "",
			role: null,
			status: false,
			nickname: ""
		}
	};
	componentDidMount() {
		this.getDepartment();
		this.getRoleList("");
	}
	// 搜索
	searchClick() {
		let { keyword } = this.state;
		if (!keyword || keyword.trim().length <= 0) {
			return;
		}
		this.getCustomer(keyword);
	}
	// 获取用户列表
	async getCustomer(key?: string) {
		let { customerPage, customerPagesize, departmentActiveId } = this.state;
		let params: any = {
			page: customerPage,
			pagesize: customerPagesize
		};
		if (key != undefined) {
			params.searchwords = key;
		} else {
			params.admin_user_department_id = departmentActiveId;
		}
		let res = await this.props.getCustomerListAction(params);
	}
	// 获取部门列表
	async getDepartment() {
		let { departmentPage, departmentPagesize } = this.state;
		let params: any = {
			page: departmentPage,
			pagesize: departmentPagesize
		};
		let res = await this.props.getDepartmentListAction(params);
	}
	// 打开部门弹框
	openDepartment(data: any, e?: any) {
		let set: any = {};
		if (!data || !data.name) {
			set = {
				departmentId: "",
				department: {
					name: "",
					describe: ""
				}
			};
		} else {
			e.stopPropagation();
			set = {
				departmentId: data._id,
				department: {
					name: data.name,
					describe: data.describe
				}
			};
		}
		this.setState({
			isShowDepartment: true,
			...set
		});
	}
	// 删除部门
	deleteDepartment(data: any, e: any) {
		e.stopPropagation();
		if (!data) {
			return;
		}
		Modal.confirm({
			title: "提示",
			content: "您确定删除这个部门？",
			onOk: async () => {
				let res = await this.props.deleteDepartmentAction({
					admin_user_department_id: data._id
				});
				if (res && res.code == 200) {
					this.getDepartment();
					message.success("删除成功");
				}
			}
		});
	}
	// 关闭部门弹框
	closeDepartment() {
		this.setState({
			isShowDepartment: false
		});
	}
	// 打开用户弹框
	openCustomer(data: any) {
		let { departmentActiveId } = this.state;
		let customer: any;
		if (!data || !data._id) {
			if (!departmentActiveId || departmentActiveId.trim().length <= 0) {
				message.error("请选择需要添加用户的部门");
				return;
			}
			customer = {
				_id: "",
				username: "",
				password: "",
				nickname: "",
				phone: "",
				role: null,
				status: false
			};
		} else {
			let {
				username,
				phone,
				status,
				password,
				_id,
				admin_user_role_id,
				admin_user_role_name,
				nickname
			} = data;
			customer = {
				_id,
				username,
				phone,
				password,
				system_admin_user_id: _id,
				status: status == 1 ? true : false,
				nickname,
				role: {
					key: admin_user_role_id,
					label: admin_user_role_name
				}
			};
		}

		this.setState(
			{
				customer: { ...customer },
				isShowCustomer: true
			},
			() => {
				setTimeout(window.Util.forbidAutoComplete, 300);
			}
		);
	}
	// 关闭用户弹框
	closeCustomer() {
		this.setState({
			isShowCustomer: false
		});
	}
	// 获取角色列表
	async getRoleList(e: any) {
		let params: any = {
			page: 1,
			pagesize: 50,
			keyword: e
		};
		this.setState({
			isGetRole: true
		});
		try {
			let res = await this.props.getRoleListAction(params);
		} finally {
			this.setState({
				isGetRole: false
			});
		}
	}
	// 部门弹框确定按钮
	async departmentClick() {
		let { department, departmentId } = this.state;
		let { name, describe } = department;
		if (!name || name.trim().length <= 0) {
			message.error("部门名称不能为空");
			return;
		}
		let params: any = {
			name,
			describe
		};
		let successStr = "添加成功";
		if (departmentId && departmentId.length > 0) {
			params.admin_user_department_id = departmentId;
			successStr = "修改成功";
		}
		let res = await this.props.addDepartmentAction(params);
		if (res && res.code == 200) {
			message.success(successStr);
			this.getDepartment();
			this.closeDepartment();
		}
	}
	InputChange(target: string, type: string, e: any) {
		let state: any = this.state;
		let set: any = {
			[target]: {
				...state[target],
				[type]: e && e.target ? e.target.value : e
			}
		};
		this.setState({
			...set
		});
	}
	// 点击部门列表每条数据
	departmentItemClick(data: any) {
		this.setState(
			{
				departmentActiveId: data._id,
				keyword: ""
			},
			this.getCustomer
		);
	}
	// 用户弹框确定
	async customerClick() {
		let { customer, departmentActiveId, keyword } = this.state;
		let { username, password, phone, status, role, nickname } = customer;
		if (!username || username.trim().length <= 0) {
			message.error("用户不能为空");
			return;
		}
		if (!nickname || nickname.trim().length <= 0) {
			message.error("昵称不能为空");
			return;
		}
		if (!password || password.trim().length <= 0) {
			message.error("密码不能为空");
			return;
		}
		if (!role || !role.key) {
			message.error("角色不能为空");
			return;
		}
		let info = "新增成功";
		let r1 = "jh4bb4234n_j4";
		let r2 = "35hjkcd_jk4bnvkln_k53";
		let m1 = window.CryptoJS.MD5(password).toString();
		let m2 = window.CryptoJS.MD5(m1 + r1).toString();
		let m3 = window.CryptoJS.MD5(m2 + r2).toString();
		let params: any = {
			username,
			phone,
			status: status ? 1 : 0,
			admin_user_role_id: role.key,
			admin_user_role_name: role.label,
			nickname: nickname.trim()
		};
		if (customer._id && customer._id.trim().length > 0) {
			info = "修改成功";
			params.system_admin_user_id = customer._id;
		} else {
			params.system_admin_user_department_id = departmentActiveId;
			params.password = m3;
		}
		let res = await this.props.addCustomerAction(params);
		if (res && res.code == 200) {
			let key =
				keyword && keyword.trim().length > 0 ? keyword : undefined;
			message.success(info);
			this.getCustomer(key);
			this.closeCustomer();
		}
	}
	// 删除用户
	deleteCustomer(data: any) {
		if (!data) {
			return;
		}
		Modal.confirm({
			title: "提示",
			content: "你确定删除此用户？",
			onOk: async () => {
				let id = data._id;
				let res = await this.props.deleteCustomerAction({
					system_admin_user_id: id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
					this.getCustomer();
				}
			}
		});
	}
	render() {
		let {
			isShowDepartment,
			isShowCustomer,
			department,
			departmentActiveId,
			customer,
			isGetRole,
			keyword
		} = this.state;
		let { departmentList, roleList, customerList } = this.props;
		let role: any = [];
		if (
			roleList &&
			roleList.admin_user_role &&
			roleList.admin_user_role.length > 0
		) {
			roleList.admin_user_role.map((item: any) => {
				role.push({
					key: item._id,
					label: item.name
				});
			});
		}
		return (
			<div className="manager-component">
				<div className="manager-header">
					<Input
						placeholder="请输入用户名"
						className="input"
						value={keyword}
						onChange={window.Util.InputChange.bind(this, "keyword")}
					/>
					<Button
						className="btn"
						type="primary"
						onClick={this.searchClick.bind(this)}
					>
						搜索
					</Button>
				</div>
				<div className="manager-content">
					<div className="department">
						<div className="title-box">
							<div className="title-text">部门</div>
							<div className="title-after">
								{window.viliAuth(
									"5cebbbd7e935680d0497d249",
									"5cebc06ee935680428222bb7"
								) && (
									// <Icon
									// 	type="plus"
									// 	className="icon"
									// 	onClick={this.openDepartment.bind(this)}
									// />
									<Button
										type="primary"
										size="small"
										onClick={this.openDepartment.bind(this)}
									>
										添加
									</Button>
								)}
							</div>
						</div>
						<div className="message-container">
							<Scrollbars autoHide={true}>
								{departmentList &&
									departmentList.admin_user_department &&
									departmentList.admin_user_department
										.length > 0 &&
									departmentList.admin_user_department.map(
										(item: any, idx: number) => {
											return (
												<div
													className={classnames(
														"department-item item",
														departmentActiveId ==
															item._id && "act"
													)}
													key={idx}
													onClick={this.departmentItemClick.bind(
														this,
														item
													)}
												>
													<div className="name">
														{item && item.name}
													</div>
													<div className="ctrl">
														{window.viliAuth(
															"5cebbbd7e935680d0497d249",
															"5cebc33ae935680428222bb9"
														) && (
															<Icon
																type="edit"
																className="edit"
																onClick={this.openDepartment.bind(
																	this,
																	item
																)}
															/>
														)}

														{window.viliAuth(
															"5cebbbd7e935680d0497d249",
															"5cebc35ce935680428222bbb"
														) && (
															<Icon
																type="delete"
																className="delete"
																onClick={this.deleteDepartment.bind(
																	this,
																	item
																)}
															/>
														)}
													</div>
												</div>
											);
										}
									)}
								{(!departmentList ||
									!departmentList.admin_user_department ||
									departmentList.admin_user_department
										.length <= 0) && (
									<div
										style={{
											textAlign: "center",
											padding: "50px 0"
										}}
									>
										<Empty />
									</div>
								)}
							</Scrollbars>
						</div>
					</div>
					<div className="customer">
						<div className="title-box">
							<div className="name">用户</div>
							<div className="phone">手机号码</div>
							<div className="role">角色</div>
							<div className="status">状态</div>
							<div className="title-after ctrl">
								{window.viliAuth(
									"5cebbbd7e935680d0497d249",
									"5cebc06ee935680428222bb7"
								) && (
									// <Icon
									// 	type="plus"
									// 	className="icon"
									// 	onClick={this.openCustomer.bind(this)}
									// />
									<Button
										type="primary"
										size="small"
										onClick={this.openCustomer.bind(this)}
									>
										添加
									</Button>
								)}
							</div>
						</div>
						<div className="message-container">
							<Scrollbars autoHide={true}>
								{customerList &&
									customerList.admin_user &&
									customerList.admin_user.length > 0 &&
									customerList.admin_user.map(
										(item: any, idx: number) => {
											return (
												<div
													className="customer-item"
													key={idx}
												>
													<div className="name">
														{item && item.username}
													</div>
													<div className="phone">
														{item && item.phone}
													</div>
													<div className="role">
														{item &&
															item.admin_user_role_name}
													</div>
													<div className="status">
														{item &&
														item.status == 1
															? "启用"
															: "禁用"}
													</div>
													<div className="ctrl">
														{window.viliAuth(
															"5cebbbd7e935680d0497d249",
															"5cebc33ae935680428222bb9"
														) && (
															<Icon
																type="edit"
																className="edit"
																onClick={this.openCustomer.bind(
																	this,
																	item
																)}
															/>
														)}
														{window.viliAuth(
															"5cebbbd7e935680d0497d249",
															"5cebc35ce935680428222bbb"
														) && (
															<Icon
																type="delete"
																className="delete"
																onClick={this.deleteCustomer.bind(
																	this,
																	item
																)}
															/>
														)}
													</div>
												</div>
											);
										}
									)}
								{(!customerList ||
									!customerList.admin_user ||
									customerList.admin_user.length <= 0) && (
									<div
										style={{
											textAlign: "center",
											padding: "50px 0"
										}}
									>
										<Empty />
									</div>
								)}
							</Scrollbars>
						</div>
					</div>
				</div>
				<Modal
					visible={isShowDepartment}
					title="部门"
					wrapClassName="department-modal"
					onCancel={this.closeDepartment.bind(this)}
					onOk={this.departmentClick.bind(this)}
				>
					<div className="department-container">
						<InputBox
							autoWidth={true}
							value={department && department.name}
							labelName="部门名称"
							onChange={this.InputChange.bind(
								this,
								"department",
								"name"
							)}
						/>
						<InputBox
							flexTop={true}
							autoWidth={true}
							value={department && department.describe}
							type="textarea"
							labelName="部门描述"
							onChange={this.InputChange.bind(
								this,
								"department",
								"describe"
							)}
						/>
					</div>
				</Modal>
				<Modal
					title="用户"
					visible={isShowCustomer}
					width={700}
					wrapClassName="customer-modal"
					onCancel={this.closeCustomer.bind(this)}
					onOk={this.customerClick.bind(this)}
				>
					<div>
						<InputBox
							autoWidth={true}
							labelName="账号"
							isRequired={true}
							value={customer && customer.username}
							onChange={this.InputChange.bind(
								this,
								"customer",
								"username"
							)}
						/>
						<InputBox
							autoWidth={true}
							labelName="昵称"
							isRequired={true}
							value={customer && customer.nickname}
							onChange={this.InputChange.bind(
								this,
								"customer",
								"nickname"
							)}
						/>
						<InputBox
							autoWidth={true}
							labelName="密码"
							isRequired={true}
							style={{
								display:
									customer &&
									customer._id &&
									customer._id.length > 0
										? "none"
										: "block"
							}}
						>
							<Input.Password
								value={customer && customer.password}
								onChange={this.InputChange.bind(
									this,
									"customer",
									"password"
								)}
							/>
						</InputBox>

						<InputBox
							autoWidth={true}
							labelName="电话"
							value={customer && customer.phone}
							onChange={this.InputChange.bind(
								this,
								"customer",
								"phone"
							)}
						/>
						<InputBox
							autoWidth={true}
							labelName="角色"
							isRequired={true}
							type="select"
							showSearch={true}
							labelInValue={true}
							isFetch={isGetRole}
							onSearch={this.getRoleList.bind(this)}
							value={customer && customer.role}
							onChange={this.InputChange.bind(
								this,
								"customer",
								"role"
							)}
							optionArr={role}
						/>
						<InputBox autoWidth={true} labelName="状态">
							<Switch
								checked={customer && customer.status}
								checkedChildren="开"
								unCheckedChildren="关"
								onChange={this.InputChange.bind(
									this,
									"customer",
									"status"
								)}
							/>
						</InputBox>
					</div>
				</Modal>
			</div>
		);
	}
}
