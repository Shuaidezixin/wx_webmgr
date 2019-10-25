/**
 * 选中好友的操作
 */
import * as React from "react";
import { Modal, Icon, Input, Button, Empty } from "antd";
import Scrollbars from "react-custom-scrollbars";
import * as classnames from "classnames";
import ListPage from "@base/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import SinglePic from "@img/single.jpg";
import "./index.less";

interface Props extends BaseListProps {
	visible: boolean;
	onCancel?: Function;
	onOk?: Function;
	data?: any;
	getData?: Function;
	accountID?: string;
	outData?: any[];
}
interface State extends BaseListState {
	keyword: string;
	selectedData: any[];
	name: string;
}

export default class SelectFriend extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: false
	};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		keyword: "",
		selectedData: [],
		name: ""
	};
	static getDerivedStateFromProps(nextProps: any, currentState: any): any {
		if (nextProps.visible && !currentState.visible) {
			return {
				selectedData: [...nextProps.outData],
				visible: true
			};
		}
		if (!nextProps.visible && currentState.visible) {
			return {
				selectedData: [],
				visible: false
			};
		}
		return null;
	}
	componentDidMount() {
		this.getListData();
	}
	getListData() {
		if (!this.props.accountID || this.props.accountID.length <= 0) {
			return;
		}
		let { keyword, page, pagesize } = this.state;
		let { getData } = this.props;
		let params: any = {
			page,
			pagesize,
			account_id: this.props.accountID,
			onlycontact: true
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = keyword.trim();
		}
		if (getData && typeof getData === "function") {
			getData(params);
		}
	}
	pageChange(e: any) {
		this.setState(
			{
				page: e
			},
			this.getListData
		);
	}
	getSelectedId(): any[] {
		let { selectedData } = this.state;
		let res: any[] = [];
		res = selectedData.map((v: any) => {
			return v.talk_id;
		});
		return res;
	}
	isInSelect(data: any): boolean {
		let { talk_id } = data;
		let res: boolean = false;
		let sa = this.getSelectedId();
		if (sa.includes(talk_id)) {
			res = true;
		}
		return res;
	}
	//人员单选点击
	selectClick(data: any) {
		let { talk_id } = data;
		let { selectedData } = this.state;
		let sa = this.getSelectedId();
		let isIn: boolean = false;
		let list: any[] = JSON.parse(JSON.stringify(selectedData));
		if (selectedData && selectedData.length > 0) {
			list = selectedData.filter((v: any) => {
				if (v.talk_id == talk_id) {
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
		let { data } = this.props;
		let res: boolean = false;
		let ids: any[] = [];
		let selectCount = 0;
		if (data && data.msg_talks && data.msg_talks.length > 0) {
			ids = data.msg_talks.map((v: any) => {
				return v.talk_id;
			});
		}
		if (selectedData && selectedData.length > 0) {
			selectedData.map((v: any) => {
				if (ids.includes(v.talk_id)) {
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
		let { data } = this.props;
		let ids: any[] = [];
		let list: any[] = [];
		if (state) {
			if (data && data.msg_talks && data.msg_talks.length > 0) {
				ids = data.msg_talks.map((v: any) => {
					return v.talk_id;
				});
			}
			list = selectedData.filter((v: any) => {
				if (!ids.includes(v.talk_id)) {
					return v;
				}
			});
		} else {
			let sids = selectedData.map((v: any) => {
				return v.talk_id;
			});
			list = selectedData;
			if (data && data.msg_talks && data.msg_talks.length > 0) {
				data.msg_talks.map((v: any) => {
					if (!sids.includes(v.talk_id)) {
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
				name: "头像",
				width: 60,
				class: "tc",
				render: (item: any) => {
					return (
						<img
							style={{ width: "40px", height: "40px" }}
							src={
								item &&
								item.talk_pic &&
								item.talk_pic.length > 0
									? item.talk_pic
									: SinglePic
							}
						/>
					);
				}
			},
			{
				name: "昵称",
				class: "tc",
				key: "nickname"
			},
			{
				name: "是否内部联系人",
				class: "tc",
				width: 160,
				render: (item: any) => {
					return item.inside ? (
						<div className="inner-person">内</div>
					) : (
						""
					);
				}
			}
		];
	}
	searchClick() {
		this.setState(
			{
				page: 1
			},
			this.getListData
		);
	}
	onCancel() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	eleteSelected(data: any, idx: number) {
		let { selectedData } = this.state;
		let list: any[] = JSON.parse(JSON.stringify(selectedData));
		list.splice(idx, 1);
		this.setState({
			selectedData: [...list]
		});
	}
	deleteSelected(data: any, idx: number) {
		let { selectedData } = this.state;
		let list: any[] = JSON.parse(JSON.stringify(selectedData));
		list.splice(idx, 1);
		this.setState({
			selectedData: [...list]
		});
	}
	okClick() {
		let { selectedData } = this.state;
		let { onOk } = this.props;
		if (onOk && typeof onOk === "function") {
			onOk(selectedData);
		}
	}
	render() {
		let { keyword, page, pagesize, name, selectedData } = this.state;
		let { visible, data } = this.props;
		return (
			<Modal
				title="群聊"
				centered={true}
				width={1000}
				visible={visible}
				wrapClassName="modal-select-friend"
				onCancel={this.onCancel.bind(this)}
				onOk={this.okClick.bind(this)}
			>
				<div className="select-friend-container">
					<div className="select-friend-left">
						<div className="name">
							{/* <div className="text">群名称：</div>
							<Input
								value={name}
								onChange={window.Util.InputChange.bind(
									this,
									"name"
								)}
							/> */}
						</div>
						<div className="left-item header">
							<div className="header">头像</div>
							<div className="nickname">昵称</div>
							<div className="ctrl">操作</div>
						</div>
						<div
							style={{
								height: "calc(100% - 77px)"
							}}
						>
							<Scrollbars autoHide={true}>
								{selectedData &&
									selectedData.length > 0 &&
									selectedData.map((v: any, i: number) => {
										return (
											<div className="left-item" key={i}>
												<div className="header">
													<img
														src={
															v.talk_pic &&
															v.talk_pic.length >
																0
																? v.talk_pic
																: SinglePic
														}
													/>
												</div>
												<div className="nickname">
													{v.nickname}
												</div>
												<div className="ctrl">
													<Icon
														type="delete"
														className="icon delete"
														onClick={this.deleteSelected.bind(
															this,
															v,
															i
														)}
													/>
												</div>
											</div>
										);
									})}
								{(!selectedData ||
									selectedData.length <= 0) && (
									<div className="nodatabox">
										<Empty />
									</div>
								)}
							</Scrollbars>
						</div>
					</div>
					<div className="select-friend-right list-page-box">
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
								data={data && data.msg_talks}
							/>
						</div>
						<div className="list-footer ">
							<FooterCtrl
								currentPage={page}
								total={data && data.total}
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
