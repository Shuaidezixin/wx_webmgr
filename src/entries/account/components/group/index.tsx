import * as React from "react";
import { Modal, Button, message, Icon } from "antd";
import ListPage from "@base/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import GroupEdit from "../groupedit";
import "./index.less";

interface Props extends BaseListProps {
	visible: boolean;
	accountListByGroup?: any;
	getAccountListByGroupAction?: Function;
	data?: any;
	getData?: Function;
	addGroups?: Function;
	deleteAction?: Function;
	onCancel?: Function;
}

interface State extends BaseListState {
	isShowEdit: boolean;
	targetID: string;
	targetAccount: any[];
	name: string;
}

export default class Group extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = { visible: false };
	readonly state: State = {
		isShowEdit: false,
		page: 1,
		pagesize: 30,
		targetID: "",
		targetAccount: [],
		name: ""
	};
	componentDidMount() {
		this.getListData();
	}
	getListData() {
		let { page, pagesize } = this.state;
		let { getData } = this.props;
		if (getData && typeof getData === "function") {
			getData({
				page,
				pagesize
			});
		}
	}
	headerList() {
		return [
			{
				name: "编组名称",
				key: "name"
			},
			{
				name: "操作",
				width: 150,
				class: "tc",
				render: (item: any) => {
					return (
						<React.Fragment>
							<Icon
								type="edit"
								className="icon edit"
								onClick={this.openEdit.bind(this, item)}
							/>
							<Icon
								type="delete"
								className="icon delete"
								onClick={this.deleteGroup.bind(this, item)}
							/>
						</React.Fragment>
					);
				}
			}
		];
	}
	deleteGroup(data: any) {
		let { deleteAction } = this.props;
		if (!data) {
			return;
		}
		if (!deleteAction || typeof deleteAction !== "function") {
			return;
		}
		Modal.confirm({
			title: "提示",
			content: "你确定删除此编组吗？",
			onOk: async () => {
				let res = await deleteAction({
					account_group_id: data.id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
					this.getListData();
				}
			}
		});
	}
	openEdit(data?: any) {
		let set: any = {};
		if (!data || !data.id) {
			set.targetID = "";
			set.targetAccount = [];
			set.name = "";
		} else {
			set.targetID = data.id;
			set.targetAccount = data.account;
			set.name = data.name;
		}
		this.setState({
			isShowEdit: true,
			...set
		});
	}
	closeEdit(data?: any) {
		this.setState({
			isShowEdit: false
		});
	}
	async saveClick(saveData: any) {
		let { targetID } = this.state;
		let { name, data, ids } = saveData;
		let params: any = {
			name,
			accountIds: ids.join(";")
		};
		let info: string = "新增编组成功";
		if (targetID && targetID.trim().length > 0) {
			info = "修改编组成功";
			params.account_group_id = targetID;
		}
		let res = await this.props.addGroups(params);
		if (res && res.code == 200) {
			message.success(info);
			this.getListData();
			this.setState({
				isShowEdit: false
			});
		}
	}
	pageChange(e: number) {
		this.setState(
			{
				page: e
			},
			this.getListData
		);
	}
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	render() {
		let {
			visible,
			getAccountListByGroupAction,
			accountListByGroup,
			data,
			addGroups
		} = this.props;
		let { isShowEdit, page, pagesize, targetAccount, name } = this.state;
		return (
			<Modal
				wrapClassName="group-modal"
				visible={visible}
				title="编组"
				width={800}
				centered={true}
				onCancel={this.cancelClick.bind(this)}
				footer={
					<div className="group-modal-footer">
						<Button
							type="primary"
							onClick={this.openEdit.bind(this)}
						>
							新增
						</Button>
						<div className="group-page">
							<FooterCtrl
								total={data && data.total}
								currentPage={page}
								pageSize={pagesize}
								pageChange={this.pageChange.bind(this)}
							/>
						</div>
					</div>
				}
			>
				<div className="group-container">
					<TableBox
						headerList={this.headerList.call(this)}
						data={data && data.accountgroups}
					/>
				</div>
				<div>
					{isShowEdit && (
						<GroupEdit
							visible={isShowEdit}
							getAccountData={getAccountListByGroupAction}
							accountData={accountListByGroup}
							onCancel={this.closeEdit.bind(this)}
							onOk={this.saveClick.bind(this)}
							account={targetAccount}
							name={name}
						/>
					)}
				</div>
			</Modal>
		);
	}
}
