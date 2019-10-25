import * as React from "react";
import { Modal, Button, Input, Icon, Empty, message } from "antd";
import Scrollbars from "react-custom-scrollbars";
import * as classnames from "classnames";
import ListPage from "@base/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";

import "./index.less";

interface Props extends BaseListProps {
	visible: boolean;
	getAccountData?: Function;
	accountData?: any;
	onCancel?: Function;
	onOk?: Function;
	account?: any[];
	name: string;
}
interface State extends BaseListState {
	keyword: string;
	selectedData: any[];
	name: string;
}

export default class GroupEdit extends ListPage<Props, State> {
	private groupBox: React.RefObject<Scrollbars>;
	constructor(props: Props) {
		super(props);
		this.groupBox = React.createRef();
	}
	static readonly defaultProps: Props = {
		visible: false,
		account: [],
		name: ""
	};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		keyword: "",
		selectedData: [],
		name: ""
	};
	componentDidMount() {
		this.initAccout();
		this.getListData();
	}
	initAccout() {
		let { account, name } = this.props;
		if (account && account.length > 0 && account instanceof Array) {
			account.map((item: any) => {
				item.id = item._id;
			});
			this.setState({
				name: name,
				selectedData: [...account]
			});
		}
	}
	getListData() {
		let { page, pagesize, keyword } = this.state;
		let { getAccountData } = this.props;
		let params: any = {
			page,
			pagesize
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = keyword.trim();
		}
		if (getAccountData && typeof getAccountData === "function") {
			getAccountData(params);
		}
	}
	getSelectedId(): any[] {
		let { selectedData } = this.state;
		let res: any[] = [];
		res = selectedData.map((v: any) => {
			return v.id;
		});
		return res;
	}
	isInSelect(data: any): boolean {
		let { id } = data;
		let res: boolean = false;
		let sa = this.getSelectedId();
		if (sa.includes(id)) {
			res = true;
		}
		return res;
	}
	//人员单选点击
	selectClick(data: any) {
		let { id } = data;
		let { selectedData } = this.state;
		let sa = this.getSelectedId();
		let isIn: boolean = false;
		let list: any[] = JSON.parse(JSON.stringify(selectedData));
		if (selectedData && selectedData.length > 0) {
			list = selectedData.filter((v: any) => {
				if (v.id == id) {
					isIn = true;
				} else {
					return v;
				}
			});
		}
		if (!isIn) {
			list.push(data);
		}
		this.setState({
			selectedData: [...list]
		});
	}
	checkIsAll(): boolean {
		let { selectedData } = this.state;
		let { accountData } = this.props;
		let res: boolean = false;
		let ids: any[] = [];
		let selectCount = 0;
		if (accountData && accountData.users && accountData.users.length > 0) {
			ids = accountData.users.map((v: any) => {
				return v.id;
			});
		}
		if (selectedData && selectedData.length > 0) {
			selectedData.map((v: any) => {
				if (ids.includes(v.id)) {
					selectCount++;
				}
			});
		}
		if (ids.length == selectCount) {
			res = true;
		}
		return res;
	}
	allCheckClick() {
		let state = this.checkIsAll();
		let { selectedData } = this.state;
		let { accountData } = this.props;
		let ids: any[] = [];
		let list: any[] = [];
		if (state) {
			if (
				accountData &&
				accountData.users &&
				accountData.users.length > 0
			) {
				ids = accountData.users.map((v: any) => {
					return v.id;
				});
			}
			list = selectedData.filter((v: any) => {
				if (!ids.includes(v.id)) {
					return v;
				}
			});
		} else {
			let sids = selectedData.map((v: any) => {
				return v.id;
			});
			list = selectedData;
			if (
				accountData &&
				accountData.users &&
				accountData.users.length > 0
			) {
				accountData.users.map((v: any) => {
					if (!sids.includes(v.id)) {
						list.push(v);
					}
				});
			}
		}
		this.setState({
			selectedData: [...list]
		});
	}
	renderHeader() {
		return [
			{
				name: "",
				width: 60,
				class: "tc",
				titleRender: () => {
					return (
						<Icon
							type="left-circle"
							className={classnames(
								"icon",
								this.checkIsAll() && "act"
							)}
							onClick={this.allCheckClick.bind(this)}
						/>
					);
				},
				render: (item: any) => {
					return (
						<Icon
							type="left-circle"
							className={classnames(
								"icon",
								this.isInSelect(item) && "act"
							)}
							onClick={this.selectClick.bind(this, item)}
						/>
					);
				}
			},
			{
				name: "手机编号",
				class: "tc",
				key: "note_mobile"
			},
			{
				name: "账号",
				class: "tc",
				key: "login_user"
			},
			{
				name: "昵称",
				class: "tc",
				key: "nickname",
				idth: 150
			},
			{
				name: "性别",
				class: "tc",
				key: "sex",
				width: 50
			}
		];
	}
	deleteSelected(data: any, idx: number) {
		let { selectedData } = this.state;
		let list: any[] = JSON.parse(JSON.stringify(selectedData));
		list.splice(idx, 1);
		this.setState({
			selectedData: [...list]
		});
	}
	saveGroup() {
		let { selectedData, name } = this.state;
		let { onOk } = this.props;
		if (!name || name.trim().length <= 0) {
			message.error("编组名称不能为空");
			return;
		}
		if (!selectedData || selectedData.length <= 0) {
			message.error("用户不能为空");
			return;
		}
		if (onOk && typeof onOk === "function") {
			onOk({
				name,
				data: selectedData,
				ids: this.getSelectedId()
			});
		}
	}
	onCancel() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	groupItem(props: any) {
		let { data } = props;
		return (
			<div className="group-item">
				<div className="number">{props.idx + 1}</div>
				<div className="t1">{data && data.note_mobile}</div>
				<div className="t1">{data && data.login_user}</div>
				<div className="ctrlbox">
					<Icon
						type="delete"
						className="delete"
						onClick={props.onDelete.bind(this)}
					/>
				</div>
			</div>
		);
	}
	pageChange(e: any) {
		this.setState(
			{
				page: e
			},
			this.getListData
		);
	}
	searchClick() {
		this.setState(
			{
				page: 1
			},
			this.getListData
		);
	}
	render() {
		let { keyword, selectedData, name, page, pagesize } = this.state;
		let { accountData, visible } = this.props;
		return (
			<Modal
				visible={visible}
				title="编组"
				wrapClassName="group-edit-modal"
				width={1200}
				centered={true}
				onOk={this.saveGroup.bind(this)}
				onCancel={this.onCancel.bind(this)}
			>
				<div className="grouop-edit-container">
					<div className="group-left">
						<div className="group-name">
							<div className="text">编组名称:</div>
							<Input
								value={name}
								onChange={window.Util.InputChange.bind(
									this,
									"name"
								)}
							/>
						</div>
						<div className="group-item header">
							<div className="number">序号</div>
							<div className="t1">手机编号</div>
							<div className="t1">账号</div>
							<div className="ctrlbox">操作</div>
						</div>
						<div style={{ height: "calc(100% - 82px)" }}>
							<Scrollbars autoHide={true} ref={this.groupBox}>
								{selectedData &&
									selectedData.length > 0 &&
									selectedData.map(
										(item: any, idx: number) => {
											return (
												<this.groupItem
													key={idx}
													idx={idx}
													data={item}
													onDelete={this.deleteSelected.bind(
														this,
														item,
														idx
													)}
												/>
											);
										}
									)}
								{(!selectedData ||
									selectedData.length <= 0) && (
									<div className="nodatabox">
										<Empty />
									</div>
								)}
							</Scrollbars>
						</div>
					</div>
					<div className="group-right list-page-box">
						<div className="list-header">
							<Input
								className="input"
								value={keyword}
								onChange={window.Util.InputChange.bind(
									this,
									"keyword"
								)}
							/>
							<Button onClick={this.searchClick.bind(this)}>
								搜索
							</Button>
						</div>
						<div className="list-center">
							<TableBox
								headerList={this.renderHeader.call(this)}
								data={accountData && accountData.users}
							/>
						</div>
						<div className="list-footer ">
							<FooterCtrl
								currentPage={page}
								total={accountData && accountData.total}
								pageChange={this.pageChange.bind(this)}
								pageSize={pagesize}
							/>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}
