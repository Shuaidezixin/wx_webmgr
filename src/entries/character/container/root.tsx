import * as React from "react";
import { Modal, Button, Tag, Select, message, Checkbox } from "antd";
import InputBox from "@component/inputbox";
import Tags from "@component/tags";
import ListPage from "../../../basecomponent/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import Toast from "@component/toast";
const Option = Select.Option;
import "./index.less";

interface Props extends BaseListProps {
	figureList?: any;
	characterList?: any;
	characterInfoList?: any;
	getCharaterAction?: Function;
	getFigureListAction?: Function;
	getTagListAction?: Function;
	addTagAction?: Function;
	deleteTagAction?: Function;
	clearTagListAction?: Function;
	tagList?: any;
	saveCharaterAction?: Function;
	deleteCharaterAction?: Function;
	getcharacterInfoAction?: Function;
	singleCheckPersonAction?: Function;
	allCheckPersonAction?: Function;
	userRemovePersonDesignAction?: Function;
}
interface State extends BaseListState {
	isLoading: boolean;
	isShowDetail: boolean;
	openDetailData: any;
	focusValue: any;
	isOpenEdit: boolean;
	openEditData: any;
	editObj: EditObj;
	targetID: string | void;
	openData: any;
	innerPage: number;
	innerPageszie: number;
	isAll: boolean;
	statustype: number;
	openID: string;
}
interface EditObj {
	title: string;
	note: string;
	figure_id: string;
	tags: any;
}
export default class Root extends ListPage<Props, State> {
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isLoading: false,
		innerPage: 1,
		innerPageszie: 12,
		isShowDetail: false,
		isOpenEdit: false,
		openDetailData: null,
		focusValue: "",
		openEditData: null,
		editObj: {
			title: "",
			note: "",
			figure_id: "0",
			tags: null
		},
		targetID: "",
		openData: null,
		isAll: false,
		statustype: 0,
		openID: ""
	};
	static readonly defaultProp: Props = {};
	constructor(props: Props) {
		super(props);
	}
	public renderHeader(): any {
		return [
			// {
			// 	name: "序号",
			// 	width: 100,
			// 	class: "tc",
			// 	render: (item: any, idx: number) => idx + 1
			// },
			{
				name: "人设名称",
				key: "title",
				class: "tc",
				width: 200
			},
			{
				name: "人设备注",
				width: 200,
				key: "note",
				class: "tc"
			},
			{
				name: "形象配置",
				key: "figure_name",
				width: 200,
				class: "tc"
			},
			{
				name: "标签配置",
				width: 300,
				class: "tc",
				render: (item: any) => {
					return (
						item.tags &&
						item.tags.tag_value &&
						item.tags.tag_value.length > 0 &&
						item.tags.tag_value.map((v: any, idx: number) => {
							return (
								<Tag
									style={{
										marginRight: "5px",
										marginBottom: "4px"
									}}
									key={idx}
									color="#2db7f5"
								>
									{v}
								</Tag>
							);
						})
					);
				}
			},
			{
				name: "操作",
				width: 200,
				class: "tc",
				render: (item: any) => {
					return (
						<React.Fragment>
							{window.viliAuth(
								"5cebbbb6e935680d0497d244",
								"5cebbf43e935680428212ba1"
							) && (
								<span
									className="ctrlbtn edit"
									onClick={this.openEdit.bind(this, item)}
								>
									编辑
								</span>
							)}
							{window.viliAuth(
								"5cebbbb6e935680d0497d244",
								"5cebbf29e935680428212b9d"
							) && (
								<span
									className="ctrlbtn"
									onClick={this.openDetail.bind(this, item)}
								>
									详情
								</span>
							)}
							{window.viliAuth(
								"5cebbbb6e935680d0497d244",
								"5cebbf54e935680428212ba3"
							) && (
								<span
									className="ctrlbtn delete"
									onClick={this.deleteClick.bind(this, item)}
								>
									删除
								</span>
							)}
						</React.Fragment>
					);
				}
			},
			{
				name: "",
				class: ""
			}
		];
	}
	public renderInnerHeader(): any {
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
			{
				name: "手机编号",
				width: 100,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span title={item && item.note_mobile}>
							{item.note_mobile}
						</span>
					);
				}
			},
			{
				name: "微信账号",
				width: 100,
				// key: "login_user",
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span title={item && item.login_user}>
							{item.login_user}
						</span>
					);
				}
			},
			{
				name: "微信昵称",
				width: 100,
				// key: "nickname",
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span title={item && item.nickname}>
							{item.nickname}
						</span>
					);
				}
			},
			{
				name: "备注信息",
				width: 100,
				// key: "wechat_source",
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<span title={item && item.wechat_source}>
							{item.wechat_source}
						</span>
					);
				}
			},
			{
				name: "使用时长(天)",
				width: 100,
				class: "tc",
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
				name: "账号情况",
				width: 100,
				class: "tc",
				render: (item: any) => (
					<div className="line">
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
								设备异常
							</span>
						)}
					</div>
				)
			}
		];
	}
	public componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "人设管理");
		this.initPage();
	}
	async getListData() {
		this.setState({
			isLoading: true
		});
		try {
			let res = await this.getCharacter();
			let res2 = await this.getFigure();
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	// 获取人设列表
	getCharacter(e?: any) {
		let { page, pagesize } = this.state;
		let params: any = {
			page,
			pagesize
		};
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getCharaterAction(params);
	}
	// 详情
	openDetail(data: any) {
		this.setState(
			{
				isShowDetail: true,
				openID: data._id
			},
			this.getCharacterList
		);
	}
	// 人设详情
	getCharacterList() {
		let { innerPage, innerPageszie, statustype, openID } = this.state;
		let params: any = {
			personal_design_id: openID,
			page: innerPage,
			pagesize: innerPageszie
		};
		if (statustype && statustype != 0) {
			params.status = statustype;
		}
		this.props.getcharacterInfoAction(params);
	}
	closeDetail() {
		this.setState({
			isShowDetail: false,
			openID: "",
			statustype: 0,
			isAll: false
		});
	}
	// 跳转至形象管理
	toFigure() {
		window.appHistory.push({
			pathname: "/character/figure"
		});
	}
	// 编辑or新增
	openEdit(data?: any) {
		if (data && data._id) {
			let set: any = {};
			set.title = data.title;
			set.note = data.note;
			set.figure_id = data.figure_id;
			set.tags = [];
			data.tags.tag_id.map((v: any, i: number) => {
				data.tags.tag_value.map((item: any, idx: number) => {
					if (i === idx) {
						set.tags.push({ tag_id: v, tag_name: item });
					}
				});
			});
			this.setState({
				isOpenEdit: true,
				targetID: data._id,
				editObj: { ...set }
			});
		}
		this.setState({
			isOpenEdit: true
		});
	}
	closeEdit() {
		let set: any = {
			title: "",
			note: "",
			figure_id: "0",
			tags: null
		};
		this.setState({
			isOpenEdit: false,
			targetID: "",
			editObj: { ...set }
		});
	}
	// 删除
	async deleteClick(data: any) {
		console.log(data);
		if (!data) {
			return;
		}
		Modal.confirm({
			title: "提示",
			content: `你确定删除名称为 ${data.title} 的人设吗？`,
			onOk: async () => {
				let res = await this.props.deleteCharaterAction({
					personal_design_id: data._id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
				}
			}
		});
	}
	// 输入框
	inputChange(type: string, e: any) {
		let { editObj } = this.state;
		let data: any;
		switch (type) {
			case "title":
				data = e;
				break;
			case "note":
				data = e;
				break;
			case "figure_id":
				data = e;
				break;
			default:
				data = e.target && e.target.value ? e.taget.value : e;
				break;
		}
		let set: any = {
			editObj: {
				...editObj,
				[type]: data
			}
		};
		this.setState({
			...set
		});
	}
	// 获取形象列表
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
	// 删除tag
	deleteTagClick(item: any, e: any) {
		e.preventDefault();
		let { editObj } = this.state;
		let nl: any = [];
		if (editObj && editObj.tags && editObj.tags.length > 0) {
			nl = editObj.tags.filter((v: any) => {
				if (v.tag_id != item.tag_id) {
					return v;
				}
			});
		}
		this.setState({
			editObj: {
				...this.state.editObj,
				tags: [...nl]
			}
		});
	}
	tagSave(data: any) {
		console.log("baio", [...data]);
		this.setState({
			editObj: {
				...this.state.editObj,
				tags: [...data]
			}
		});
	}
	InputChange(type: string, e: any) {
		let { characterInfoList } = this.props;
		let set: any = {
			[type]: e
		};
		if (
			characterInfoList.abnormal > 0 ||
			characterInfoList.closeaccount > 0 ||
			characterInfoList.normal > 0
		) {
			this.setState(set, this.getCharacterList);
		}
		this.setState(set);
	}
	// 保存
	async saveClick() {
		let { editObj, targetID } = this.state;
		console.log("targetID", targetID);
		let params: any = {};
		if (!editObj) {
			return;
		}
		if (!editObj.title) {
			message.error("请设置人设名称");
			return;
		}
		params.title = editObj.title;
		if (!editObj.note) {
			message.error("请设置人设备注");
			return;
		}
		params.note = editObj.note;

		if (!editObj.figure_id || editObj.figure_id == "0") {
			message.error("请选择形象");
			return;
		}
		params.figure_id = editObj.figure_id;

		let arr: any[] = [];
		if (!editObj.tags || editObj.tags.length <= 0) {
			message.error("请至少选择一种标签");
			return;
		}
		editObj.tags.map((v: any) => {
			arr.push(v.tag_id);
		});
		let tags: string = arr.join(";");
		if (!tags) {
			message.error("请至少选择一种标签");
			return;
		}
		params.tags = tags;

		// 修改
		if (targetID) {
			params.personal_design_id = targetID;
		}
		console.log("params", params);
		let res = await this.props.saveCharaterAction(params);
		if (res && res.code == 200) {
			message.success("保存人设成功");
			this.getCharacter();
			this.closeEdit();
		}
	}
	allCheckClick(e: any) {
		let { characterInfoList } = this.props;
		let type = e.target.checked;
		this.setState({
			isAll: type
		});
		if (
			characterInfoList.abnormal > 0 ||
			characterInfoList.closeaccount > 0 ||
			characterInfoList.normal > 0
		) {
			this.props.allCheckPersonAction({
				type: type
			});
		}
	}
	singleCheckClick(item: any) {
		if (!item) {
			return;
		}
		this.props.singleCheckPersonAction({
			id: item._id
		});
		this.checkIsAll();
	}
	checkIsAll() {
		let { characterInfoList } = this.props;
		if (
			characterInfoList &&
			characterInfoList.accounts &&
			characterInfoList.accounts.length > 0
		) {
			let checkCount = 0;
			let len = characterInfoList.accounts.length;
			characterInfoList.accounts.map((item: any) => {
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
	getCheckedItem(): any[] {
		let { characterInfoList } = this.props;
		let list =
			characterInfoList && characterInfoList.accounts
				? characterInfoList.accounts
				: [];
		let idArr: any[] = [];
		if (list && list.length >= 0) {
			list.map((item: any) => {
				if (item.isChecked) idArr.push(item._id);
			});
		}
		return idArr;
	}
	// 移除账号
	async removeAccount() {
		let { openID } = this.state;
		let ids = this.getCheckedItem();
		console.log(openID, ids);
		if (!ids || ids.length <= 0) {
			message.error("请选择账号");
			return;
		}
		let params: any = {
			personal_design_id: openID,
			account_Ids: ids.join(";")
		};
		let sending = Toast.loading("正在提交数据", 0);
		let res: any = null;
		try {
			res = await this.props.userRemovePersonDesignAction(params);
		} finally {
			sending.close();
		}
		if (res && res.code == 200) {
			message.success("移除成功");
			this.getCharacterList();
		}
	}
	// 详情弹框内部翻页
	ModalPageChange(e: number) {
		this.setState(
			{
				innerPage: e
			},
			this.getCharacterList
		);
	}
	public render() {
		let {
			page,
			pagesize,
			innerPage,
			innerPageszie,
			isShowDetail,
			isLoading,
			openDetailData,
			isOpenEdit,
			openEditData,
			editObj,
			targetID,
			openData,
			statustype
		} = this.state;
		let {
			figureList,
			tagList,
			characterList,
			getTagListAction,
			addTagAction,
			deleteTagAction,
			clearTagListAction,
			characterInfoList
		} = this.props;

		return (
			<div className="character-page">
				<div className="list-page-box">
					<div className="list-header">
						{window.viliAuth(
							"5cebbbb6e935680d0497d243",
							"5cebbf29e935680428222b9d"
						) && (
							<Button
								// type="primary"
								style={{ background: "#6594EB", color: "#fff" }}
								onClick={this.toFigure.bind(this)}
							>
								形象管理
							</Button>
						)}
						{window.viliAuth(
							"5cebbbb6e935680d0497d244",
							"5cebbf39e935680428212b9f"
						) && (
							<Button
								type="primary"
								onClick={this.openEdit.bind(this)}
							>
								新建人设
							</Button>
						)}
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={
								characterList && characterList.personaldesgins
							}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={characterList && characterList.total}
						/>
					</div>
				</div>
				{isOpenEdit && (
					<Modal
						visible={isOpenEdit}
						width={600}
						wrapClassName="character-edit-modal"
						title={`${targetID ? "修改" : "新增"}人设`}
						onCancel={this.closeEdit.bind(this)}
						onOk={this.saveClick.bind(this)}
					>
						<div className="modal-content">
							<InputBox
								labelName="人设名称"
								value={editObj && editObj.title}
								onChange={this.inputChange.bind(this, "title")}
								isRequired={true}
							/>
							<InputBox
								labelName="人设备注"
								value={editObj && editObj.note}
								onChange={this.inputChange.bind(this, "note")}
								isRequired={true}
							/>
							<InputBox labelName="形象选择" isRequired={true}>
								<Select
									value={editObj && editObj.figure_id}
									filterOption={false}
									onChange={this.inputChange.bind(
										this,
										"figure_id"
									)}
									style={{
										width: "250px"
									}}
									onSearch={this.getFigure.bind(this)}
									showSearch={true}
								>
									<Option value={"0"}>请选择形象</Option>
									{figureList &&
										figureList.figures &&
										figureList.figures.length > 0 &&
										figureList.figures.map(
											(v: any, i: number) => {
												return (
													<Option
														key={v.figure_id}
														value={v.figure_id}
													>
														{v.basic.name}
													</Option>
												);
											}
										)}
								</Select>
							</InputBox>
							<InputBox
								labelName="标签"
								autoWidth={true}
								isRequired={true}
							>
								<React.Fragment>
									{editObj &&
										editObj.tags &&
										editObj.tags.length > 0 &&
										editObj.tags.map(
											(item: any, idx: number) => {
												return (
													<Tag
														className="tag"
														key={idx}
														closable
														onClose={this.deleteTagClick.bind(
															this,
															item
														)}
													>
														{item.tag_name}
													</Tag>
												);
											}
										)}
									<Tags
										onSave={this.tagSave.bind(this)}
										data={tagList}
										getData={getTagListAction}
										addTag={addTagAction}
										deleteTag={deleteTagAction}
										selectedData={editObj && editObj.tags}
										clear={clearTagListAction}
									/>
								</React.Fragment>
							</InputBox>
						</div>
					</Modal>
				)}
				{isShowDetail && characterInfoList && (
					<Modal
						visible={isShowDetail}
						width={900}
						wrapClassName="character-detail-modal"
						title="人设详情"
						onCancel={this.closeDetail.bind(this)}
						footer={null}
					>
						<div className="detail-header">
							<div className="item">
								<label>人设名称:</label>
								<div
									title={
										characterInfoList.personaldesgin.title
									}
								>
									{characterInfoList.personaldesgin.title}
								</div>
							</div>
							<div className="item">
								<label>备注信息:</label>
								<div
									title={
										characterInfoList.personaldesgin.note
									}
								>
									{characterInfoList.personaldesgin.note}
								</div>
							</div>
							<div className="item">
								<label>使用形象:</label>
								<div
									title={
										characterInfoList.personaldesgin
											.figure_name
									}
								>
									{
										characterInfoList.personaldesgin
											.figure_name
									}
								</div>
							</div>
							<div className="item tags">
								<label>使用标签:</label>
								<div className="tag-item">
									{characterInfoList.personaldesgin.tags.tag_value.map(
										(v: string, i: number) => (
											<Tag key={i} className="detail-tag">
												{v}
											</Tag>
										)
									)}
								</div>
							</div>
							<div className="item">
								<label>使用数量:</label>
								<div>
									{characterInfoList.normal +
										characterInfoList.closeaccount +
										characterInfoList.abnormal}
								</div>
							</div>
							<div className="item">
								<label>正常账号:</label>
								<div>{characterInfoList.normal}</div>
							</div>
							<div className="item">
								<label>封禁账号:</label>
								<div>{characterInfoList.closeaccount}</div>
							</div>
							<div className="item">
								<label>设备异常:</label>
								<div>{characterInfoList.abnormal}</div>
							</div>
						</div>
						{characterInfoList && (
							<div className="account-list">
								<div className="list-page-box">
									<div className="list-header">
										{window.viliAuth(
											"5cebbbb6e935680d0497d244",
											"5cebbf43e935680428212ba1"
										) && (
											<Button
												type="primary"
												style={{
													marginRight: "20px"
												}}
												onClick={this.removeAccount.bind(
													this
												)}
											>
												移除账号
											</Button>
										)}

										{/* 账号状态 */}
										<div className="status-item">
											<span>账号状态:</span>
											<Select
												value={statustype}
												onChange={this.InputChange.bind(
													this,
													"statustype"
												)}
												style={{
													width: "130px",
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
									</div>
									<div className="list-center">
										<TableBox
											headerList={this.renderInnerHeader()}
											data={
												characterInfoList &&
												characterInfoList.accounts
											}
											// isFullPage={false}
										/>
									</div>
									<div className="list-footer">
										<FooterCtrl
											currentPage={innerPage}
											pageSize={innerPageszie}
											pageChange={this.ModalPageChange.bind(
												this
											)}
											total={
												characterInfoList &&
												characterInfoList.total
											}
										/>
									</div>
								</div>
							</div>
						)}
					</Modal>
				)}
			</div>
		);
	}
}
