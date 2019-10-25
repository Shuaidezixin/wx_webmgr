import * as React from "react";
import { Icon, Modal, Input, Button, message, Table } from "antd";
import ListPage from "../../../../basecomponent/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import Face from "@component/face";
import SendImage from "@component/sendimg";
import { insetFace } from "@component/face";
import "./index.less";

interface Props extends BaseListProps {
	extensionScriptList?: any;
	addExtensionScriptAction?: Function;
	getExtensionScriptAction?: Function;
	deleteExtensionScriptAction?: Function;
}
interface State extends BaseListState {
	isShowTem: boolean;
	isShowEdit: boolean;
	isShowDetail: boolean;
	title: string;
	targetID: string | void;
	temList: any[];
	targetData: any;
	newList: any[];
	backupList: any[];
	searchVal: string;
	isChinese: boolean;
	openDetailData: any;
	isLoading: boolean;
}

export default class TGScript extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isShowTem: false,
		isShowEdit: false,
		isShowDetail: false,
		title: "",
		temList: [""],
		targetID: null,
		targetData: null,
		newList: null,
		backupList: null,
		searchVal: "",
		isChinese: true,
		openDetailData: null,
		isLoading: false
	};
	// 表头
	renderHeader() {
		return [
			{
				name: "序号",
				class: "tc",
				width: 100,
				render: (item: any, idx: number) => {
					return idx + 1;
				}
			},
			{
				name: "剧本标题",
				class: "tc",
				width: 200,
				render: (item: any) => {
					return (
						<span
							className="ctrlbtn"
							onClick={this.openDetail.bind(this, item)}
						>
							{item.title}
						</span>
					);
				}
			},
			{
				name: "创建人",
				class: "tc",
				width: 100,
				key: "createusername"
			},
			{
				name: "创建时间",
				class: "tc",
				width: 200,
				key: "createtime"
			},
			{
				name: "使用次数",
				class: "tc",
				width: 200,
				key: "total"
			},
			{
				name: "操作",
				width: 160,
				class: "tc",
				render: (item: any) => {
					return (
						<React.Fragment>
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf83e935680428222ba9"
							) && (
								<span
									className="ctrlbtn edit"
									onClick={this.openEdit.bind(this, item)}
								>
									编辑
								</span>
							)}
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf8de935680428222bab"
							) && (
								<span
									className="ctrlbtn delete"
									onClick={this.deleteClick.bind(this, item)}
								>
									删除
								</span>
							)}
							{!window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf83e935680428222ba9"
							) &&
								!window.viliAuth(
									"5cebbbc4e935680d0497d245",
									"5cebbf8de935680428222bab"
								) &&
								"无权限"}
						</React.Fragment>
					);
				}
			},
			{
				name: "",
				class: "tc"
			}
		];
	}
	renderListHeader() {
		return [
			// {
			// 	name: "序号",
			// 	class: "tc",
			// 	width: 100,
			// 	render: (item: any, idx: number) => {
			// 		return idx + 1;
			// 	}
			// },
			{
				name: "手机编号",
				class: "tc",
				width: 200,
				key: "mobile_note"
			},
			{
				name: "微信昵称",
				class: "tc",
				key: "nickname",
				width: 200
			},
			{
				name: "使用次数",
				class: "tc",
				key: "subtotal",
				width: 200
			}
		];
	}
	componentDidMount() {
		this.initPage();
	}
	async getListData() {
		let { page, pagesize } = this.state;
		let params: any = {
			page,
			pagesize
		};
		this.setState({
			isLoading: true
		});
		let res = await this.props.getExtensionScriptAction(params);
		if (res && res.code == 200) {
			this.setState({
				newList: res.data.resoureinsidescripts,
				backupList: res.data.resoureinsidescripts,
				isLoading: false
			});
		}
	}

	// 删除剧本
	deleteClick(data: any) {
		if (!data) {
			return;
		}
		Modal.confirm({
			title: "提示",
			content: `你确定删除名称为 ${data.title} 的聊天剧本吗？`,
			onOk: async () => {
				let res = await this.props.deleteExtensionScriptAction({
					extensionscriptid: data.id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
					this.getListData();
				}
			}
		});
	}
	//打开剧本详情
	openDetail(data: any) {
		this.setState({
			isShowDetail: true,
			targetData: data,
			openDetailData: data
		});
	}
	// 关闭剧本详情
	closeDetail() {
		this.setState({
			isShowDetail: false,
			targetData: null,
			openDetailData: null
		});
	}
	// 去修改
	toAlter() {
		let { openDetailData } = this.state;
		this.setState({
			isShowDetail: false
		});
		this.openEdit(openDetailData);
	}
	// 打开编辑弹框
	openEdit(data: any) {
		this.setState({
			isShowEdit: true,
			targetID: data ? data.id : null,
			temList: data ? data.scriptmessage : [""],
			title: data ? data.title : ""
		});
	}
	// 关闭编辑弹框
	closeEdit() {
		this.setState({
			isShowEdit: false,
			temList: [""],
			title: "",
			targetID: null
		});
	}
	// 保存
	async saveClick() {
		let { title, temList, targetID } = this.state;
		if (!title || title.trim().length <= 0) {
			message.error("标题不能为空");
			return;
		}
		let resList: any[] = [];
		temList.map((v: any) => {
			if (v.trim() != "") {
				resList.push(v);
			}
		});
		if (resList.length <= 0) {
			message.error("内容不能全部为空并且自动忽略内容为空的列");
			return;
		}
		let params: any = {
			title,
			scriptmessage: resList
		};
		if (targetID && targetID.length > 0) {
			params.id = targetID;
		}
		let res = await this.props.addExtensionScriptAction({
			extension_script: JSON.stringify(params)
		});
		if (res && res.code == 200) {
			message.success("保存剧本成功");
			this.closeEdit();
			this.getListData();
		}
	}

	// 打开内容参考模板
	// openTem() {
	// 	this.setState({
	// 		isShowTem: true
	// 	});
	// }
	// // 关闭内容参考模板
	// closeTem() {
	// 	this.setState({
	// 		isShowTem: false
	// 	});
	// }

	// 判断是否是图片
	isImg(data: string) {
		if (!data || data.length <= 0) {
			return false;
		}
		let reg = /^https?:\/\/.*?.(png|jpg|jpeg)$/gi;
		return reg.test(data);
	}
	// 删除图片
	deleteImg(idx: number) {
		let { temList } = this.state;
		temList[idx] = "";
		this.setState({
			temList: [...temList]
		});
	}
	// 输入框内容
	TemChange(idx: number, e: any) {
		let { temList } = this.state;
		temList[idx] = e.target.value;
		this.setState({
			temList: [...temList]
		});
	}
	// 选择表情
	faceClick(idx: number, word: string) {
		let { temList } = this.state;
		// temList[idx] = `${temList[idx]}[${word}]`;
		temList[idx] = window.Util.insertText(
			this.refs[`script-input-${idx}`],
			`[${word}]`
		);
		this.setState({
			temList: [...temList]
		});
	}

	// 保存图片
	sendImg(idx: number, url: string) {
		let { temList } = this.state;
		if (this.isImg(url)) {
			temList[idx] = `${url}`;
			this.setState({
				temList: [...temList]
			});
		}
	}
	// 删除行
	deleteTemClick(idx: number) {
		let { temList } = this.state;
		temList.splice(idx, 1);
		this.setState({
			temList: [...temList]
		});
	}
	// 添加行
	addTemClick() {
		let { temList } = this.state;
		temList = [...temList, ""];
		this.setState(
			{
				temList: [...temList]
			},
			this.editScroll2Bottom //点击添加
		);
	}
	editScroll2Bottom() {
		let box = this.refs["editBoxContainer"] as HTMLElement;
		box.scrollTop = box.scrollHeight - box.clientHeight;
	}
	// 搜索剧本标题
	searchTitle() {
		let _this = this;
		let arr: any[] = [];
		setTimeout(() => {
			let { isChinese, searchVal, newList } = _this.state;
			if (isChinese) {
				if (searchVal && searchVal.length > 0) {
					newList.map((v: any) => {
						if (v.title.indexOf(searchVal) != -1) {
							arr.push(v);
						}
					});
					this.setState({
						newList: [...arr]
					});
				}
			}
		}, 0);
	}
	iptVal(e: any) {
		let { backupList } = this.state;
		this.setState({
			searchVal: e.target.value
		});
		if (!e.target.value) {
			this.setState({
				newList: [...backupList]
			});
		}
	}
	startIpt() {
		this.setState({
			isChinese: false
		});
	}
	endIpt() {
		this.setState({
			isChinese: true
		});
	}

	render() {
		let {
			page,
			pagesize,
			temList,
			isShowEdit,
			isShowDetail,
			title,
			targetData,
			targetID,
			newList,
			searchVal,
			isLoading
		} = this.state;
		let { extensionScriptList } = this.props;
		return (
			<div className="source-extension-script-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el">
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf76e935680428222ba7"
							) && (
								<div>
									<Input
										placeholder="搜索剧本标题"
										value={searchVal}
										onInput={this.searchTitle.bind(this)}
										onChange={this.iptVal.bind(this)}
										onCompositionStart={this.startIpt.bind(
											this
										)}
										onCompositionEnd={this.endIpt.bind(
											this
										)}
										style={{ width: 200, marginRight: 20 }}
									/>
									<Button
										type="primary"
										onClick={this.openEdit.bind(this, null)}
										className="ctrl-btn"
									>
										添加剧本
									</Button>
								</div>
							)}
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							// data={
							// 	extensionScriptList &&
							// 	extensionScriptList.resoureinsidescripts
							// }
							data={newList}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={
								extensionScriptList && extensionScriptList.total
									? extensionScriptList.total
									: 0
							}
						/>
					</div>
				</div>
				{isShowEdit && (
					<Modal
						visible={isShowEdit}
						width={1000}
						wrapClassName="script-edit-modal"
						title={`${targetID ? "修改" : "新建"}剧本`}
						okText="保存"
						onCancel={this.closeEdit.bind(this)}
						onOk={this.saveClick.bind(this)}
					>
						<div
							className="script-container"
							ref="editBoxContainer"
						>
							<div className="script-header">
								<div className="head-text">
									<input
										className="input"
										placeholder="请输入剧本标题"
										value={title}
										onChange={window.Util.InputChange.bind(
											this,
											"title"
										)}
									/>
								</div>
								{/* <Icon
									type="question-circle"
									className="question-icon"
									onClick={this.openTem.bind(this)}
								/> */}
							</div>
							<div className="script-box">
								<div className="script-item">
									<div className="script-t order">序号</div>
									<div className="script-t content tc">
										对话内容
									</div>
									<div className="script-t ctrl tc">操作</div>
								</div>
								{temList &&
									temList.length > 0 &&
									temList.map((item: any, index: number) => {
										return (
											<div
												className="script-item"
												key={index}
											>
												<div className="script-t order">
													{index + 1}
												</div>
												<div className="script-t content inpbox">
													{this.isImg(item) ? (
														<div className="imgBox">
															<img src={item} />
															<div className="img-hover">
																<Icon
																	className="delete"
																	type="delete"
																	onClick={this.deleteImg.bind(
																		this,
																		index
																	)}
																/>
															</div>
														</div>
													) : (
														<input
															type="text"
															className="tem-input"
															value={item}
															placeholder="请输入内容"
															onChange={this.TemChange.bind(
																this,
																index
															)}
															ref={`script-input-${index}`}
														/>
													)}
													<div className="ctrl">
														{this.isImg(
															item
														) ? null : (
															<Face
																onClick={this.faceClick.bind(
																	this,
																	index
																)}
															/>
														)}
														<SendImage
															onSend={this.sendImg.bind(
																this,
																index
															)}
															buttonText="确定"
														/>
													</div>
												</div>
												<div className="script-t ctrl tc">
													{temList.length > 1 && (
														<Icon
															type="delete"
															onClick={this.deleteTemClick.bind(
																this,
																index
															)}
														/>
													)}
												</div>
											</div>
										);
									})}
							</div>
							<Button
								type="primary"
								className="add"
								onClick={this.addTemClick.bind(this)}
							>
								添加行
							</Button>
						</div>
					</Modal>
				)}
				<Modal
					visible={isShowDetail}
					wrapClassName="script-detail-modal"
					title="剧本详情"
					width={800}
					onCancel={this.closeDetail.bind(this)}
					// footer={null}
					okText="修改"
					onOk={this.toAlter.bind(this)}
				>
					<div className="detail-box extension-content">
						<div className="detail-title">
							{targetData && targetData.title}
						</div>
						<div className="detail-item-box">
							{targetData &&
								targetData.scriptmessage &&
								targetData.scriptmessage.length > 0 &&
								targetData.scriptmessage.map(
									(v: any, i: number) => {
										return (
											<React.Fragment key={i}>
												{v && v.length > 0 && (
													<div className="detail-item">
														<div className="name">
															{i + 1}
														</div>
														<div
															className="content"
															dangerouslySetInnerHTML={{
																__html: this.isImg(
																	v
																)
																	? `<img
																	class="detail_img"
																	src=${v}
																/>`
																	: insetFace(
																			v
																	  )
															}}
														/>
													</div>
												)}
											</React.Fragment>
										);
									}
								)}
						</div>
					</div>
					<div className="extension-bottom">
						<div className="total-times">
							共使用
							{targetData && targetData.total && (
								<span>{targetData.total}</span>
							)}
							次
						</div>
						<div className="phone-list">
							{targetData &&
								targetData.usedaccounts &&
								targetData.usedaccounts.length > 0 && (
									<TableBox
										headerList={this.renderListHeader()}
										data={targetData.usedaccounts}
										// data={[1, 2, 3, 4, 5, 6, 7]}
										isFullPage={false}
									/>
								)}
							{/* {targetData && targetData.length > 0 && (
									<Table
										columns={this.renderListHeader()}
										dataSource={targetData.usedaccounts}
									/>
									)} */}
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}
