import * as React from "react";
import { Icon, Modal, Input, Button, message } from "antd";
import ListPage from "../../../../basecomponent/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import Face from "@component/face";
import SendImage from "@component/sendimg";
import { insetFace } from "@component/face";
import "./index.less";

interface Props extends BaseListProps {
	scriptList?: any;
	getScriptListAction?: Function;
	addScriptAction?: Function;
	deleteScriptAction?: Function;
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
	isLoading: boolean;
}

export default class ScriptBox extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isShowTem: false,
		isShowEdit: false,
		isShowDetail: false,
		title: "",
		temList: [["", ""]],
		targetID: null,
		targetData: null,
		newList: null,
		backupList: null,
		searchVal: "",
		isChinese: true,
		isLoading: false
	};
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
				width: 160,
				key: "createtime"
			},
			{
				name: "操作",
				class: "tc",
				width: 160,
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

		let res = await this.props.getScriptListAction(params);

		if (res && res.code == 200) {
			this.setState({
				newList: res.data.resoureinsidescripts,
				backupList: res.data.resoureinsidescripts,
				isLoading: false
			});
		}
	}
	deleteClick(data: any) {
		if (!data) {
			return;
		}
		Modal.confirm({
			title: "提示",
			content: `你确定删除名称为 ${data.title} 的聊天剧本吗？`,
			onOk: async () => {
				let res = await this.props.deleteScriptAction({
					insidescriptid: data.id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
					this.getListData();
				}
			}
		});
	}
	openTem() {
		this.setState({
			isShowTem: true
		});
	}
	closeTem() {
		this.setState({
			isShowTem: false
		});
	}
	TemChange(idx: number, i: number, e: any) {
		let { temList } = this.state;
		temList[idx][i] = e.target.value;
		this.setState({
			temList: [...temList]
		});
	}
	editScroll2Bottom() {
		let box = this.refs["editBoxContainer"] as HTMLElement;
		box.scrollTop = box.scrollHeight - box.clientHeight;
	}
	addTemClick() {
		let { temList } = this.state;
		temList = [...temList, ["", ""]];
		this.setState(
			{
				temList: [...temList]
			},
			this.editScroll2Bottom //点击添加
		);
	}
	deleteTemClick(idx: number) {
		let { temList } = this.state;
		temList.splice(idx, 1);
		this.setState({
			temList: [...temList]
		});
	}
	openEdit(data: any) {
		this.setState({
			isShowEdit: true,
			targetID: data ? data.id : null,
			temList: data ? data.scriptmessage : [["", ""]],
			title: data ? data.title : ""
		});
	}
	closeEdit() {
		this.setState({
			isShowEdit: false,
			temList: [["", ""]],
			title: "",
			targetID: null
		});
	}
	openDetail(data: any) {
		this.setState({
			isShowDetail: true,
			targetData: data
		});
	}
	closeDetail() {
		this.setState({
			isShowDetail: false,
			targetData: null
		});
	}
	async saveClick() {
		let { title, temList, targetID } = this.state;
		if (!title || title.trim().length <= 0) {
			message.error("标题不能为空");
			return;
		}
		let resList: any[] = [];
		temList.map((v: any) => {
			if (
				v[0].trim() != v[1].trim() ||
				(v[0].trim() != "" && v[1].trim() != "")
			) {
				resList.push(v);
			}
		});
		if (resList.length <= 0) {
			message.error("内容不能全部为空并且自动忽略A与B同时为空的列");
			return;
		}
		let params: any = {
			title,
			scriptmessage: resList
		};
		if (targetID && targetID.length > 0) {
			params.id = targetID;
		}
		let res = await this.props.addScriptAction({
			insidescriptjson: JSON.stringify(params)
		});
		if (res && res.code == 200) {
			message.success("保存剧本成功");
			this.closeEdit();
			this.getListData();
		}
	}
	faceClick(idx: number, i: number, word: string) {
		let { temList } = this.state;
		// temList[idx][i] = `${temList[idx][i]}[${word}]`;
		// console.log(
		// 	window.Util.insertText(
		// 		this.refs[`script-input-${idx}${i}`],
		// 		`[${word}]`
		// 	)
		// );
		temList[idx][i] = window.Util.insertText(
			this.refs[`script-input-${idx}${i}`],
			`[${word}]`
		);
		this.setState({
			temList: [...temList]
		});
	}

	sendImg(idx: number, i: number, url: string) {
		let { temList } = this.state;
		if (this.isImg(url)) {
			temList[idx][i] = `${url}`;
			this.setState({
				temList: [...temList]
			});
		}
	}
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
	isImg(data: string) {
		if (!data || data.length <= 0) {
			return false;
		}
		let reg = /^https?:\/\/.*?.(png|jpg|jpeg)$/gi;
		return reg.test(data);
	}
	deleteImg(idx: number, i: number) {
		let { temList } = this.state;
		temList[idx][i] = "";
		this.setState({
			temList: [...temList]
		});
	}
	render() {
		let {
			page,
			pagesize,
			isShowTem,
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
		let { scriptList } = this.props;

		return (
			<div className="source-script-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el">
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf76e935680428222ba7"
							) && (
								// <Icon
								// 	type="plus-circle"
								// 	className="list-top-icon"
								// 	onClick={this.openEdit.bind(this, null)}
								// 	title="添加剧本"
								// />
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
							// data={scriptList && scriptList.resoureinsidescripts}
							data={newList}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							total={
								scriptList && scriptList.total
									? scriptList.total
									: 0
							}
							pageChange={this.pageChange.bind(this)}
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
							{isShowTem && (
								<div style={{ marginBottom: "10px" }}>
									<div className="script-header">
										<div className="head-text">
											内容参考模板
										</div>
										<Icon
											type="close"
											className="question-icon"
											onClick={this.closeTem.bind(this)}
										/>
									</div>
									<div className="script-box">
										<div className="script-item">
											<div className="script-t order">
												序号
											</div>
											<div className="script-t content tc">
												A
											</div>
											<div className="script-t content tc">
												B
											</div>
										</div>
										<div className="script-item">
											<div className="script-t order">
												1
											</div>
											<div className="script-t content">
												你好呀
											</div>
											<div className="script-t content">
												你好
											</div>
										</div>
										<div className="script-item">
											<div className="script-t order">
												2
											</div>
											<div className="script-t content" />
											<div className="script-t content">
												你是哪位？
											</div>
										</div>
										<div className="script-item">
											<div className="script-t order">
												3
											</div>
											<div className="script-t content">
												哈哈，我是小强呀
											</div>
											<div className="script-t content">
												哈哈，好久不见
											</div>
										</div>
									</div>
								</div>
							)}

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
								<Icon
									type="question-circle"
									className="question-icon"
									onClick={this.openTem.bind(this)}
								/>
							</div>
							<div className="script-box">
								<div className="script-item">
									<div className="script-t order">序号</div>
									<div className="script-t content tc">A</div>
									<div className="script-t content tc">B</div>
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
													{this.isImg(item[0]) ? (
														<div className="imgBox">
															<img
																src={item[0]}
															/>
															<div className="img-hover">
																<Icon
																	className="delete"
																	type="delete"
																	onClick={this.deleteImg.bind(
																		this,
																		index,
																		0
																	)}
																/>
															</div>
														</div>
													) : (
														<input
															type="text"
															className="tem-input"
															value={item[0]}
															placeholder="请输入内容"
															onChange={this.TemChange.bind(
																this,
																index,
																0
															)}
															ref={`script-input-${index}0`}
														/>
													)}
													<div className="ctrl">
														{this.isImg(
															item[0]
														) ? null : (
															<Face
																onClick={this.faceClick.bind(
																	this,
																	index,
																	0
																)}
															/>
														)}
														<SendImage
															onSend={this.sendImg.bind(
																this,
																index,
																0
															)}
															buttonText="确定"
														/>
													</div>
												</div>
												<div className="script-t content inpbox">
													{this.isImg(item[1]) ? (
														<div className="imgBox">
															<img
																src={item[1]}
															/>
															<div className="img-hover">
																<Icon
																	className="delete"
																	type="delete"
																	onClick={this.deleteImg.bind(
																		this,
																		index,
																		1
																	)}
																/>
															</div>
														</div>
													) : (
														<input
															type="text"
															className="tem-input"
															value={item[1]}
															placeholder="请输入内容"
															onChange={this.TemChange.bind(
																this,
																index,
																1
															)}
															ref={`script-input-${index}1`}
														/>
													)}
													<div className="ctrl">
														{this.isImg(
															item[1]
														) ? null : (
															<Face
																onClick={this.faceClick.bind(
																	this,
																	index,
																	1
																)}
															/>
														)}

														<SendImage
															onSend={this.sendImg.bind(
																this,
																index,
																1
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
					footer={null}
				>
					<div className="detail-box">
						<div className="detail-title">
							{targetData && targetData.title}
						</div>
						{targetData &&
							targetData.scriptmessage &&
							targetData.scriptmessage.length > 0 &&
							targetData.scriptmessage.map(
								(v: any, i: number) => {
									return (
										<React.Fragment key={i}>
											{v[0] && v[0].length > 0 && (
												<div className="detail-item">
													<div className="name">
														A:
													</div>
													<div
														className="content"
														dangerouslySetInnerHTML={{
															__html: this.isImg(
																v[0]
															)
																? `<img
																	class="detail_img"
																	src=${v[0]}
																/>`
																: insetFace(
																		v[0]
																  )
														}}
													>
														{/* {this.isImg(v[0]) ? (
															<img
																className="detail_img"
																src={v[0]}
															/>
														) : (
															insetFace(v[0])
														)} */}
													</div>
												</div>
											)}
											{v[1] && v[1].length > 0 && (
												<div className="detail-item">
													<div className="name">
														B:
													</div>
													<div
														className="content"
														dangerouslySetInnerHTML={{
															__html: this.isImg(
																v[1]
															)
																? `<img
																	class="detail_img"
																	src=${v[1]}
																/>`
																: insetFace(
																		v[1]
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
				</Modal>
			</div>
		);
	}
}
