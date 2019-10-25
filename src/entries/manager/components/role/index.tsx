import * as React from "react";
import { Button, Icon, Modal, Checkbox, message, Tag } from "antd";
import ListPage from "@base/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import InputBox from "@component/inputbox";
import "./index.less";

interface Props extends BaseListProps {
	getAuthListAction?: Function;
	authList?: any;
	addRoleAction?: Function;
	getRoleListAction?: Function;
	roleList?: any;
	deleteRoleAction?: Function;
}
interface State extends BaseListState {
	isShowEdit: boolean;
	authList: any;
	name: string;
	targetID: string;
}

export default class Role extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 200,
		isShowEdit: false,
		authList: [],
		name: "",
		targetID: ""
	};
	componentDidMount() {
		this.getAuthList();
		this.getRoleList();
	}
	// 获取角色列表
	async getRoleList() {
		let { page, pagesize } = this.state;
		let params: any = { page, pagesize };
		let res = await this.props.getRoleListAction(params);
	}
	// 获取权限数据
	async getAuthList() {
		let res = await this.props.getAuthListAction();
		if (res && res.code == 200 && res.data) {
			let data = res.data;
			if (data && data.length > 0) {
				data.map((item: any) => {
					item.isChecked = false;
					if (item && item.value && item.value.length > 0) {
						item.value.map((v: any) => {
							v.isChecked = false;
						});
					}
				});
			}
			this.setState({
				authList: [...data]
			});
		}
	}
	// 打开编辑弹框
	openEdit(data?: any) {
		let set: any = [];
		let authList = this.props.authList;
		let list = JSON.parse(JSON.stringify(authList));
		let name = "";
		let id: "";
		if (!data || !data.key) {
			if (list && list.length > 0) {
				list.map((item: any) => {
					item.isChecked = false;
					if (item && item.value && item.value.length > 0) {
						item.value.map((v: any) => {
							v.isChecked = false;
						});
					}
					set.push(item);
				});
			}
		} else {
			if (data.value && data.value.length > 0) {
				let hasObj: any = {};
				name = data.name;
				id = data._id;
				data.value.map((item: any) => {
					if (!hasObj[item.admin_function_id]) {
						hasObj[item.admin_function_id] = [];
					}
					hasObj[item.admin_function_id].push(item._id);
				});
				list.map((item: any) => {
					if (
						hasObj[item.key] &&
						item.value &&
						item.value.length > 0
					) {
						item.value.map((v: any) => {
							if (hasObj[item.key].indexOf(v._id) != -1) {
								v.isChecked = true;
							}
						});
						if (hasObj[item.key].length == item.value.length) {
							item.isChecked = true;
						}
					}
					set.push(item);
				});
			}
		}
		this.setState({
			targetID: id,
			name,
			authList: [...set],
			isShowEdit: true
		});
	}
	// 关闭编辑弹框
	closeEdit() {
		this.setState({
			isShowEdit: false
		});
	}
	renderItem() {
		return [
			{
				name: "角色名称",
				class: "tc",
				width: 200,
				key: "name"
			},
			{
				name: "权限",
				class: "sp-td",
				render: (item: any) => {
					return (
						<React.Fragment>
							{item &&
								item.value &&
								item.value.length > 0 &&
								item.value.map((v: any, idx: number) => {
									return (
										<Tag
											key={idx}
											style={{ margin: "0 3px 4px 0" }}
										>
											{v.name}
										</Tag>
									);
								})}
						</React.Fragment>
					);
				}
			},
			{
				width: 70,
				class: "tc",
				titleRender: () => {
					return window.viliAuth(
						"5cebbbd7e935680d0497d249",
						"5cebc06ee935680428222bb7"
					) ? (
						// <Icon
						// 	type="plus"
						// 	className="plus"
						// 	onClick={this.openEdit.bind(this)}
						// />
						<Button
							type="primary"
							size="small"
							onClick={this.openEdit.bind(this)}
						>
							添加
						</Button>
					) : (
						""
					);
				},
				render: (item: any) => {
					return (
						<React.Fragment>
							{window.viliAuth(
								"5cebbbd7e935680d0497d249",
								"5cebc33ae935680428222bb9"
							) && (
								<Icon
									type="edit"
									className="edit"
									onClick={this.openEdit.bind(this, item)}
								/>
							)}
							{window.viliAuth(
								"5cebbbd7e935680d0497d249",
								"5cebc35ce935680428222bbb"
							) && (
								<Icon
									type="delete"
									className="delete"
									onClick={this.deleteClick.bind(this, item)}
								/>
							)}
							{!window.viliAuth(
								"5cebbbd7e935680d0497d249",
								"5cebc33ae935680428222bb9"
							) &&
								!window.viliAuth(
									"5cebbbd7e935680d0497d249",
									"5cebc35ce935680428222bbb"
								) &&
								"无权限"}
						</React.Fragment>
					);
				}
			}
		];
	}
	// 删除
	deleteClick(item: any) {
		if (!item) {
			return;
		}
		Modal.confirm({
			title: "提示",
			content: "您确认删除此角色吗？",
			onOk: async () => {
				let params: any = {
					admin_user_role_id: item._id
				};
				let res = await this.props.deleteRoleAction(params);
				if (res && res.code == 200) {
					message.success("删除成功");
					this.getRoleList();
				}
			}
		});
	}
	// 角色权限check框 即后面的子类
	ChildRoleChange(idx: number, v: any, e: any) {
		let { authList } = this.state;
		authList.map((item: any) => {
			if (v.key == item.key && v.value && v.value.length > 0) {
				if (idx != 0 && e.target.checked == true) {
					v.value[0].isChecked = true;
				}
				v.value[idx].isChecked = e.target.checked;

				let len = v.value.length;
				let count = 0;
				v.value.map((val: any) => {
					if (val.isChecked == true) {
						count++;
					}
				});

				if (idx == 0 && e.target.checked == false && count > 0) {
					v.value[idx].isChecked = true;
					count++;
				}

				if (len == count) {
					item.isChecked = true;
				} else {
					item.isChecked = false;
				}
			}
		});
		this.setState({
			authList: [...authList]
		});
	}
	// 角色权限首个check框 即类名
	roleChange(data: any, e: any) {
		let { authList } = this.state;
		let checkState = e.target.checked;
		for (let i = 0, len = authList.length; i < len; i++) {
			if (authList[i].key == data.key) {
				authList[i].isChecked = checkState;
				if (authList[i].value && authList[i].value.length > 0) {
					authList[i].value.map((val: any) => {
						val.isChecked = checkState;
					});
				}
				break;
			}
		}

		this.setState({
			authList: [...authList]
		});
	}
	// 角色弹框确定
	async editOkClick() {
		let { name, authList, targetID } = this.state;
		let info = "新增成功";
		if (!name || name.trim().length <= 0) {
			message.error("角色名称不能为空");
			return;
		}
		let params: any = {
			name
		};
		let checkedList: any = [];
		authList.map((item: any) => {
			if (item.value && item.value.length > 0) {
				item.value.map((v: any) => {
					if (v.isChecked) {
						checkedList.push(v._id);
					}
				});
			}
		});
		if (checkedList.length <= 0) {
			message.error("请选择相关权限");
			return;
		}
		params.actions = checkedList.join(";");
		if (targetID && targetID.trim().length > 0) {
			info = "修改成功";
			params.admin_user_role_id = targetID;
		}
		let res = await this.props.addRoleAction(params);

		if (res && res.code == 200) {
			message.success(info);
			this.getRoleList();
			this.closeEdit();
		}
	}
	render() {
		let { isShowEdit, authList, name } = this.state;
		let { roleList } = this.props;
		return (
			<div className="role-components">
				<div className="list-page-box">
					<div className="list-center">
						<TableBox
							headerList={this.renderItem()}
							data={
								roleList &&
								roleList.admin_user_role &&
								roleList.admin_user_role
							}
						/>
					</div>
					{/* <div className="list-footer">22</div> */}
				</div>
				<Modal
					visible={isShowEdit}
					title="角色"
					width={1000}
					wrapClassName="role-modal"
					onCancel={this.closeEdit.bind(this)}
					onOk={this.editOkClick.bind(this)}
				>
					<InputBox
						labelName="角色名称"
						autoWidth={true}
						value={name}
						onChange={window.Util.InputChange.bind(this, "name")}
						isRequired={true}
					/>
					<InputBox
						labelName="角色权限"
						flexTop={true}
						autoWidth={true}
					>
						<div className="role-box">
							{authList.map((v: any, idx: number) => {
								return (
									<div className="role-item" key={idx}>
										<div className="role-name">
											<Checkbox
												checked={v.isChecked}
												className="role-t"
												onChange={this.roleChange.bind(
													this,
													v
												)}
											>
												{v.name}
											</Checkbox>
										</div>
										<div className="role-content">
											{v.value &&
												v.value.length > 0 &&
												v.value.map(
													(c: any, i: number) => {
														return (
															<Checkbox
																key={i}
																className="role-d"
																checked={
																	c.isChecked
																}
																onChange={this.ChildRoleChange.bind(
																	this,
																	i,
																	v
																)}
															>
																{c.name}
															</Checkbox>
														);
													}
												)}
										</div>
									</div>
								);
							})}
						</div>
					</InputBox>
				</Modal>
			</div>
		);
	}
}
