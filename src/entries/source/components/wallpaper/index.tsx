import * as React from "react";
import {
	Button,
	Tag,
	Modal,
	message,
	Input,
	List,
	Select,
	Row,
	Col,
	Icon,
	Popover
} from "antd";
import ListPage from "../../../../basecomponent/listpage";
import Tags from "@component/tags";
import InputBox from "@component/inputbox";
import ImgCard from "../cardbox";
import FooterCtrl from "@component/footer_ctrl";
import { requestUrl } from "../../../../config";
import PreviewImage from "@component/previewimage";
import "./index.less";
const Option = Select.Option;
interface Props extends BaseListProps {
	tagList?: any;
	getTagListAction?: Function;
	addTagAction?: Function;
	deleteTagAction?: Function;
	sourceBizhiList?: any;
	addSourceBizhiAction?: Function;
	getSourceBizhiListAction?: Function;
	deleteSourceBizhiAction?: Function;
	clearTagListAction?: Function;
	tagList1?: any;
	getTagListAction1?: Function;
}
interface State extends BaseListState {
	isLoading: boolean;
	isShowEdit: boolean;
	keyword: string;
	editObj: EditObj;
	isShowPreview: boolean;
	imgSrc: string;
	tags: any;
}
interface EditObj {
	tags: any;
	content: any;
	tag: any;
	target_id: string;
	title: string;
}

export default class Wallpaper extends ListPage<Props, State> {
	private AutoResponsive: React.RefObject<React.Component>;
	constructor(props: Props) {
		super(props);
		this.AutoResponsive = React.createRef();
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		isLoading: false,
		page: 1,
		keyword: "",
		pagesize: 30,
		isShowEdit: false,
		isShowPreview: false,
		imgSrc: "",
		tags: [],
		editObj: {
			target_id: "",
			title: "",
			tags: [],
			content: [],
			tag: {
				tag_id: [],
				tag_value: [],
				tag_sex: 0
			}
		}
	};
	openEdit(item: any) {
		if (!item || !item.id) {
			this.setState({
				isShowEdit: true,
				editObj: {
					target_id: "",
					title: "",
					tags: [],
					content: [],
					tag: {
						tag_id: [],
						tag_value: [],
						tag_sex: 0
					}
				}
			});
			return;
		}
		let { content, id, tag, title } = item;
		let set: any = {
			content: [{ url: content }],
			target_id: id,
			title
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
	closeEdit() {
		this.setState({
			isShowEdit: false
		});
	}
	componentDidMount() {
		this.initPage();
		this.getTagList();
	}
	getTagList(e?: any) {
		let params: any = { page: 1, res_type: "bizhi" };
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getTagListAction1(params);
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
	imgChange(e: any) {
		let { editObj } = this.state;
		let set: any = {
			editObj: {
				...editObj,
				content: [...editObj.content, ...e]
			}
		};
		this.setState({
			...set
		});
	}
	deleteImg(idx: number) {
		let { editObj } = this.state;
		let { content } = editObj;
		let list = content;
		list.splice(idx, 1);
		let set: any = {
			editObj: {
				...editObj,
				content: [...list]
			}
		};
		this.setState({
			...set
		});
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
			let res = await this.props.getSourceBizhiListAction(params);
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}

	imgCardClick(value: any) {
		if (!value) {
			return;
		}
		let { type, data } = value;
		if (type == "delete") {
			Modal.confirm({
				title: "警告",
				content: "你确定删除这个头像?",
				onOk: async () => {
					let res = await this.props.deleteSourceBizhiAction({
						id: data.id
					});
					if (res && res.code == 200) {
						message.success("删除成功");
					}
				}
			});
		}
		if (type == "edit") {
			this.openEdit(data);
		}
		if (type == "eye") {
			if (data && data.content && data.content.length > 0) {
				this.setState({
					imgSrc: data.content,
					isShowPreview: true
				});
			}
		}
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
	closePreview() {
		this.setState({
			isShowPreview: false
		});
	}
	async addBizhiClick() {
		let { editObj } = this.state;
		let { content, tag, tags, target_id, title } = editObj;
		if (!title || title.trim().length <= 0) {
			message.error("标题不能为空");
			return;
		}
		if (
			!content ||
			!content[0] ||
			!content[0].url ||
			content[0].url.length <= 0
		) {
			message.error("图片不能为空");
			return;
		}
		let params: any = {
			content: content && content[0] ? content[0].url : "",
			title
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
		let res = await this.props.addSourceBizhiAction(params);
		if (res && res.code == 200) {
			message.success("操作成功");
			this.getListData();
			this.closeEdit();
		}
	}
	InputChange(type: string, e: any) {
		let set: any = {
			[type]: e
		};
		this.setState(set, this.searchClick);
	}
	render() {
		let {
			sourceBizhiList,
			tagList,
			getTagListAction,
			addTagAction,
			deleteTagAction,
			clearTagListAction,
			tagList1
		} = this.props;
		let {
			isShowEdit,
			editObj,
			page,
			pagesize,
			keyword,
			isShowPreview,
			imgSrc,
			tags
		} = this.state;
		let tagShowList: any = [];
		let listData: any = [[], [], [], [], []];
		if (tagList1 && tagList1.tags && tagList1.tags.length > 0) {
			tagList1.tags.map((v: any) => {
				tagShowList.push({
					label: v.tag_name,
					key: v.tag_id
				});
			});
		}
		if (
			sourceBizhiList &&
			sourceBizhiList.resources &&
			sourceBizhiList.resources.length > 0
		) {
			sourceBizhiList.resources.map((v: any, i: number) => {
				if (i % 5 == 0) {
					listData[0].push(v);
				}
				if (i % 5 == 1) {
					listData[1].push(v);
				}
				if (i % 5 == 2) {
					listData[2].push(v);
				}
				if (i % 5 == 3) {
					listData[3].push(v);
				}
				if (i % 5 == 4) {
					listData[4].push(v);
				}
			});
		}

		return (
			<div className="source-wallpaper-page">
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
									添加壁纸
								</Button>
							)} */}
						</div>
					</div>
					<div className="list-center">
						{sourceBizhiList &&
							sourceBizhiList.resources &&
							sourceBizhiList.resources.length > 0 && (
								<Row gutter={10} style={{ display: "flex" }}>
									{listData &&
										listData.length > 0 &&
										listData.map((v: any, i: number) => {
											return (
												<Col
													style={{ flex: "1" }}
													key={"col_" + i}
												>
													{v.length > 0 &&
														v.map(
															(
																item: any,
																idx: number
															) => {
																return (
																	<ImgCard
																		key={
																			"imgcard_" +
																			idx
																		}
																		data={
																			item.bizhi
																		}
																		onClick={this.imgCardClick.bind(
																			this
																		)}
																	/>
																);
															}
														)}
												</Col>
											);
										})}
								</Row>
							)}

						{/* <List
							grid={{ gutter: 16, column: 6 }}
							dataSource={
								sourceBizhiList &&
								sourceBizhiList.resources &&
								sourceBizhiList.resources.length > 0 &&
								sourceBizhiList.resources
									? sourceBizhiList.resources
									: []
							}
							renderItem={(item: any) => (
								<List.Item>
									<ImgCard
										data={item.bizhi}
										onClick={this.imgCardClick.bind(this)}
									/>
								</List.Item>
							)}
						/> */}
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							total={sourceBizhiList && sourceBizhiList.total}
							pageChange={this.pageChange.bind(this)}
							pageSize={pagesize}
						/>
					</div>
				</div>
				<Modal
					visible={isShowEdit}
					wrapClassName="source-modal-box"
					title="壁纸"
					onCancel={this.closeEdit.bind(this)}
					onOk={this.addBizhiClick.bind(this)}
				>
					<div>
						<InputBox
							labelName="标题"
							isRequired={true}
							autoWidth={true}
							value={editObj && editObj.title}
							onChange={this.addBoxChange.bind(this, "title")}
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
						<InputBox
							type="uploader-img"
							labelName="图片"
							flexTop={true}
							autoWidth={true}
							length={1}
							domain={requestUrl() + "/upload"}
							customRequest={true}
							value={editObj && editObj.content}
							onChange={this.imgChange.bind(this)}
							deleteUplodaValue={this.deleteImg.bind(this)}
						/>
					</div>
				</Modal>
				<PreviewImage
					visible={isShowPreview}
					imgurl={imgSrc}
					onCancel={this.closePreview.bind(this)}
				/>
			</div>
		);
	}
}
