import * as React from "react";
import {
	Button,
	Tag,
	Modal,
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
import Toast from "@component/toast";
const Option = Select.Option;
interface Props extends BaseListProps {
	tagList?: any;
	getTagListAction?: Function;
	addTagAction?: Function;
	deleteTagAction?: Function;
	addSourceGzhAction?: Function;
	sourceGzhList?: any;
	getSourceGzhListAction?: Function;
	deleteSourceGzhAction?: Function;
	clearTagListAction?: Function;
	tagList1?: any;
	getTagListAction1?: Function;
}
interface State extends BaseListState {
	isShowEdit: boolean;
	isLoading: boolean;
	keyword: string;
	editObj: EditObj;
	tags: any;
}
interface EditObj {
	tags: any;
	content: string;
	tag: any;
	target_id: string;
}
export default class Gzh extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isShowEdit: false,
		isLoading: false,
		keyword: "",
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
		let params: any = { page: 1, res_type: "gzh" };
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getTagListAction1(params);
	}
	// componentDidUpdate() {
	// 	console.log(this.state.page);
	// }
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
			// let load = Toast.loading("数据加载中,请稍后...", 0);
			let res = await this.props.getSourceGzhListAction(params);
			// load.close();
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}

	openEdit(item: any) {
		if (!item || !item.gzh) {
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
		let { gzh } = item;
		let { content, id, tag } = gzh;
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
		set.tag.tag_sex = tag && tag.tag_sex;
		this.setState({
			isShowEdit: true,
			editObj: { ...set }
		});
	}
	deleteClick(item: any) {
		let { gzh } = item;
		if (!gzh || !gzh.id || gzh.id.length <= 0) {
			return;
		}
		Modal.confirm({
			title: "警告",
			content: "你确定删除这条数据？",
			onOk: async () => {
				let id = gzh.id;
				let res = await this.props.deleteSourceGzhAction({
					id: id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
				}
			}
		});
	}
	closeEdit() {
		this.setState({
			isShowEdit: false
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
	renderHeader() {
		return [
			{
				name: "公众号",
				width: 200,
				render: (item: any) => {
					return item.gzh && item.gzh.content;
				}
			},
			{
				name: "标签",
				class: "tc",
				render: (item: any) => {
					return (
						item.gzh &&
						item.gzh.tag &&
						item.gzh.tag.tag_value &&
						item.gzh.tag.tag_value.length > 0 &&
						item.gzh.tag.tag_value.map((v: any, idx: number) => {
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
				name: "性别限制",
				class: "tc",
				width: 100,
				render: (item: any) => {
					return (
						<span>
							{item.gzh &&
								item.gzh.tag &&
								item.gzh.tag.tag_sex == 1 &&
								"男"}
							{item.gzh &&
								item.gzh.tag &&
								item.gzh.tag.tag_sex == 2 &&
								"女"}
							{item.gzh &&
								item.gzh.tag &&
								item.gzh.tag.tag_sex == 0 &&
								"通用"}
							{(!item.gzh ||
								!item.gzh.tag ||
								item.gzh.tag.tag_sex.length <= 0) &&
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
					return item.gzh && item.gzh && item.gzh.create_time;
				}
			},
			{
				name: "来源",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return item.gzh && item.gzh.tag && item.gzh.tag.writer_name;
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
	tagSave(data: any) {
		this.setState({
			editObj: {
				...this.state.editObj,
				tags: data
			}
		});
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
	async addGzhClick() {
		let { editObj } = this.state;
		let { content, tag, tags, target_id } = editObj;
		if (!content || content.trim().length <= 0) {
			message.error("公众号不能为空");
			return;
		}
		let params: any = {
			content
		};

		params.tag = {
			tag_sex: tag && tag.tag_sex ? tag.tag_sex : 0
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
		let res = await this.props.addSourceGzhAction(params);
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
			sourceGzhList,
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
			<div className="source-gzh-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el keyword-box">
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf76e935680428222ba7"
							) && (
								// <Icon
								// 	type="plus-circle"
								// 	className="list-top-icon"
								// 	onClick={this.openEdit.bind(this)}
								// 	title="添加公众号"
								// >
								// 	添加公众号
								// </Icon>
								<Button
									type="primary"
									className="ctrl-btn"
									onClick={this.openEdit.bind(this)}
								>
									添加
								</Button>
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
									添加公众号
								</Button>
							)} */}
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={sourceGzhList && sourceGzhList.resources}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={sourceGzhList && sourceGzhList.total}
						/>
					</div>
				</div>
				{isShowEdit && (
					<Modal
						visible={isShowEdit}
						wrapClassName="source-modal-box"
						title="公众号"
						onCancel={this.closeEdit.bind(this)}
						onOk={this.addGzhClick.bind(this)}
					>
						<div>
							<InputBox
								labelName="公众号"
								isRequired={true}
								autoWidth={true}
								value={editObj && editObj.content}
								onChange={this.addBoxChange.bind(
									this,
									"content"
								)}
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
									editObj &&
									editObj.tag &&
									editObj.tag.tag_sex
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
				)}
			</div>
		);
	}
}
