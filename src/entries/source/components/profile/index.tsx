import * as React from "react";
import {
	Button,
	Modal,
	Tag,
	message,
	Input,
	Select,
	Icon,
	Popover
} from "antd";
import ListPage from "../../../../basecomponent/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import Tags from "@component/tags";
import InputBox from "@component/inputbox";
import "./index.less";
const Option = Select.Option;
interface Props extends BaseListProps {
	tagList?: any;
	getTagListAction?: Function;
	addTagAction?: Function;
	deleteTagAction?: Function;
	sourceProfileList?: any;
	addSourceProfileAction?: any;
	getSourceProfileListAction?: Function;
	deleteSourceProfileAction?: Function;
	clearTagListAction?: Function;
	tagList1?: any;
	getTagListAction1?: Function;
}
interface State extends BaseListState {
	isShowEdit: boolean;
	isLoading: boolean;
	editObj: EditObj;
	keyword: string;
	tags: any;
}
interface EditObj {
	tags: any;
	content: string;
	tag: any;
	target_id: string;
}
export default class Autograph extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		keyword: "",
		isShowEdit: false,
		isLoading: false,
		tags: [],
		editObj: {
			target_id: "",
			tags: [],
			content: "",
			tag: {
				tag_id: [],
				tag_value: [],
				tag_sex: 0
			}
		}
	};

	componentDidMount() {
		this.initPage();
		this.getTagList();
	}
	getTagList(e?: any) {
		let params: any = { page: 1, res_type: "profile" };
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getTagListAction1(params);
	}
	async getListData() {
		let { page, pagesize, keyword, tags } = this.state;
		let params: any = {
			page,
			pagesize
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = keyword;
		}
		if (tags && tags.length > 0) {
			let arr = tags.map((v: any) => {
				return v.key;
			});
			params.tags = arr.join(";");
		}
		this.setState({
			isLoading: true
		});
		try {
			let res = await this.props.getSourceProfileListAction(params);
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	openEdit(item: any) {
		if (!item || !item.profile) {
			this.setState({
				isShowEdit: true,
				editObj: {
					target_id: "",
					tags: [],
					content: "",
					tag: {
						tag_id: [],
						tag_value: [],
						tag_sex: 0
					}
				}
			});
			return;
		}
		let { profile } = item;
		let { content, id, tag } = profile;
		let set: any = {
			content,
			target_id: id
		};
		let tags: any = [];

		if (tag && tag.tag_id && tag.tag_id.length > 0) {
			tag.tag_id.map((v: any, idx: number) => {
				tags.push({
					tag_id: v,
					tag_name: tag.tag_value[idx]
				});
			});
		}
		set.tags = tags;
		set.tag = {
			tag_id: [],
			tag_value: []
		};
		set.tag.tag_sex = tag && tag.tag_sex ? tag.tag_sex : 0;
		this.setState({
			isShowEdit: true,
			editObj: { ...set }
		});
	}
	closeEdit() {
		this.setState({
			isShowEdit: false
		});
	}
	renderHeader() {
		return [
			{
				name: "个性签名",
				render: (item: any) => {
					return item.profile && item.profile.content;
				}
			},
			{
				name: "标签",
				class: "tc",
				width: 300,
				render: (item: any) => {
					return (
						item.profile &&
						item.profile.tag &&
						item.profile.tag.tag_value &&
						item.profile.tag.tag_value.length > 0 &&
						item.profile.tag.tag_value.map(
							(v: any, idx: number) => {
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
							}
						)
					);
				}
			},
			{
				name: "性别限制",
				class: "tc",
				width: 100,
				render: (item: any) => {
					return (
						<span>
							{item.profile &&
								item.profile.tag &&
								item.profile.tag.tag_sex == 1 &&
								"男"}
							{item.profile &&
								item.profile.tag &&
								item.profile.tag.tag_sex == 2 &&
								"女"}
							{item.profile &&
								item.profile.tag &&
								item.profile.tag.tag_sex == 0 &&
								"通用"}
							{(!item.profile ||
								!item.profile.tag ||
								item.profile.tag.tag_sex.length <= 0) &&
								"未知"}
						</span>
					);
				}
			},
			{
				name: "创建时间",
				class: "tc",
				width: 150,
				render: (item: any) => {
					return (
						item.profile && item.profile && item.profile.create_time
					);
				}
			},
			{
				name: "来源",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return (
						item.profile &&
						item.profile.tag &&
						item.profile.tag.writer_name
					);
				}
			},
			{
				name: "操作",
				width: 120,
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
			}
		];
	}
	deleteClick(item: any) {
		let { profile } = item;
		if (!profile || !profile.id || profile.id.length <= 0) {
			return;
		}
		Modal.confirm({
			title: "警告",
			content: "你确定删除这条数据？",
			onOk: async () => {
				let id = profile.id;
				let res = await this.props.deleteSourceProfileAction({
					id: id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
				}
			}
		});
	}
	tagSave(data: any) {
		this.setState({
			editObj: {
				...this.state.editObj,
				tags: data
			}
		});
	}
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
	sexChange(e: any) {
		let { editObj } = this.state;
		let set: any = {
			editObj: {
				...editObj,
				tag: {
					...editObj.tag,
					tag_sex: e
				}
			}
		};
		this.setState({ ...set });
	}
	addBoxChange(type: string, e: any) {
		let { editObj } = this.state;
		let set: any = {
			editObj: {
				...editObj,
				[type]: e.target ? e.taget.value : e
			}
		};
		this.setState({
			...set
		});
	}
	async addProfileClick() {
		let { editObj } = this.state;
		let { content, tag, tags, target_id } = editObj;
		if (!content || content.trim().length <= 0) {
			message.error("个性签名不能为空");
			return;
		}
		let params: any = {
			content
		};
		params.tag = {
			tag_sex: tag.tag_sex
		};

		if (target_id && target_id.length > 0) {
			params.id = target_id;
		}
		if (tags && tags.length >= 0) {
			let value: any = [];
			let cn: any = [];

			tags.map((v: any) => {
				value.push(v.tag_id);
				cn.push(v.tag_name);
			});
			params.tag.tag_id = value;
			params.tag.tag_value = cn;
		}
		let res = await this.props.addSourceProfileAction(params);
		if (res && res.code == 200) {
			message.success("操作成功");
			this.getListData();
			this.closeEdit();
		}
	}
	goByQuery() {
		let { page, keyword, tags } = this.state;
		let params: any = {
			page
		};
		if (keyword && keyword.trim().length > 0) {
			params.keyword = encodeURI(keyword.trim());
		}
		if (tags && tags.length > 0) {
			params.tags = encodeURI(JSON.stringify(tags));
		}
		this.goPage(params);
	}
	InputChange(type: string, e: any) {
		let set: any = {
			[type]: e
		};
		this.setState(set, this.searchClick);
	}
	render() {
		let {
			isShowEdit,
			editObj,
			page,
			pagesize,
			keyword,
			tags,
			isLoading
		} = this.state;
		let {
			tagList,
			getTagListAction,
			addTagAction,
			deleteTagAction,
			sourceProfileList,
			clearTagListAction,
			tagList1
		} = this.props;
		let tagShowList: any = [];
		if (tagList1 && tagList1.tags && tagList1.tags.length > 0) {
			tagList1.tags.map((v: any) => {
				tagShowList.push({
					label: v.tag_name,
					key: v.tag_id
				});
			});
		}
		return (
			<div className="source-autograph-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el keyword-box">
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf76e935680428222ba7"
							) && (
								<Button
									type="primary"
									onClick={this.openEdit.bind(this)}
									className="ctrl-btn"
								>
									添加
								</Button>
								// <Icon
								// 	className="list-top-icon"
								// 	title="添加"
								// 	type="plus-circle"
								// 	onClick={this.openEdit.bind(this)}
								// />
							)}
							<Popover
								placement="bottomLeft"
								overlayClassName="filter-box"
								content={
									<div className="filter-item">
										<span>标签:</span>
										<Select
											showSearch={true}
											mode="multiple"
											style={{
												minWidth: "200px",
												margin: "0 5px"
											}}
											value={tags}
											onChange={this.InputChange.bind(
												this,
												"tags"
											)}
											filterOption={false}
											onSearch={this.getTagList.bind(
												this
											)}
											labelInValue={true}
										>
											{tagShowList.map(
												(v: any, i: number) => {
													return (
														<Option
															key={v.key}
															value={v.key}
														>
															{v.label}
														</Option>
													);
												}
											)}
										</Select>
									</div>
								}
							>
								<Button type="primary" className="ctrl-btn">
									筛选
								</Button>
							</Popover>

							{/* <Input
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
								onClick={this.searchClick.bind(this)}
							>
								搜索
							</Button> */}
						</div>
						<div className="right-el">
							{/* {window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf76e935680428222ba7"
							) && (
								<Button
									type="primary"
									onClick={this.openEdit.bind(this)}
								>
									添加个性签名
								</Button>
							)} */}
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={
								sourceProfileList && sourceProfileList.resources
							}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={sourceProfileList && sourceProfileList.total}
						/>
					</div>
				</div>
				<Modal
					visible={isShowEdit}
					wrapClassName="source-modal-box"
					title="个性签名"
					onCancel={this.closeEdit.bind(this)}
					onOk={this.addProfileClick.bind(this)}
				>
					<div>
						<InputBox
							labelName="个性签名"
							type="textarea"
							flexTop={true}
							isRequired={true}
							autoWidth={true}
							value={editObj && editObj.content}
							onChange={this.addBoxChange.bind(this, "content")}
						/>
						<InputBox labelName="标签" autoWidth={true}>
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
									clear={clearTagListAction}
									onSave={this.tagSave.bind(this)}
									data={tagList}
									getData={getTagListAction}
									addTag={addTagAction}
									deleteTag={deleteTagAction}
									selectedData={editObj && editObj.tags}
								/>
							</React.Fragment>
						</InputBox>
						<InputBox
							labelName="性别限制"
							type="select"
							autoWidth={true}
							value={
								editObj && editObj.tag && editObj.tag.tag_sex
							}
							onChange={this.sexChange.bind(this)}
							optionArr={[
								{
									key: 0,
									label: "通用"
								},
								{
									key: 1,
									label: "男"
								},
								{
									key: 2,
									label: "女"
								}
							]}
						/>
					</div>
				</Modal>
			</div>
		);
	}
}
