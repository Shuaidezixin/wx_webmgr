import * as React from "react";
import {
	Button,
	Modal,
	Input,
	Tag,
	Cascader,
	message,
	Select,
	Icon,
	Popover
} from "antd";
import ListPage from "../../../../basecomponent/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import Tags from "@component/tags";
import InputBox from "@component/inputbox";
import { requestUrl } from "../../../../config";
import "./index.less";
import Toast from "@component/toast";

const Option = Select.Option;
interface Props extends BaseListProps {
	getProvincesListAction?: Function;
	getCityListAction?: Function;
	provincesList?: Function;
	data?: any;
	tagList?: any;
	getTagListAction?: Function;
	addTagAction?: Function;
	deleteTagAction?: Function;
	getSourceFriendListAction?: Function;
	sourceFriendList?: any;
	addSourceFriendAction?: Function;
	deleteSourceFriendAction?: Function;
	clearTagListAction?: Function;
	importTemplateFriendAction?: Function;
	tagList1?: any;
	getTagListAction1?: Function;
}
interface State extends BaseListState {
	provincesList?: any;
	isShowEdit: boolean;
	isShowImport: boolean;
	isLoading: boolean;
	keyword: string;
	editObj: EditObj;
	template: any[];
	tags: any;
}

interface EditObj {
	tags: any;
	level: number;
	note: string;
	content: string;
	tag: any;
	target_id: string;
}
export default class AddFriend extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		keyword: "",
		provincesList: null,
		isShowEdit: false,
		isShowImport: false,
		isLoading: false,
		template: [],
		tags: [],
		editObj: {
			target_id: "",
			tags: [],
			level: 1,
			note: "",
			content: "",
			tag: {
				tag_sex: 0,
				tag_id: [],
				tag_value: [],
				tag_zone_cn: [],
				tag_zone_en: []
			}
		}
	};

	getTagList(e?: any) {
		let params: any = { page: 1, res_type: "addfriend" };
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getTagListAction1(params);
	}
	deleteClick(item: any) {
		let { addfriend } = item;
		if (!addfriend || !addfriend.id || addfriend.id.length <= 0) {
			return;
		}
		Modal.confirm({
			title: "警告",
			content: "你确定删除这条数据？",
			onOk: async () => {
				let id = addfriend.id;
				let res = await this.props.deleteSourceFriendAction({
					id: id
				});
				if (res && res.code == 200) {
					message.success("删除成功");
				}
			}
		});
	}
	renderHeader() {
		return [
			{
				name: "微信账号",
				width: 120,
				class: "tc",
				render: (item: any) => {
					return item.addfriend && item.addfriend.content;
				}
			},
			{
				name: "使用次数",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return item.addfriend && item.addfriend.used_count;
				}
			},
			{
				name: "标签",
				class: "tc sp-td",
				width: 250,
				render: (item: any) => {
					return (
						item.addfriend &&
						item.addfriend.tag &&
						item.addfriend.tag.tag_value &&
						item.addfriend.tag.tag_value.length > 0 &&
						item.addfriend.tag.tag_value.map(
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
				name: "性别",
				class: "tc",
				width: 50,
				render: (item: any) => {
					return (
						<span>
							{item.addfriend &&
								item.addfriend.tag &&
								item.addfriend.tag.tag_sex == 1 &&
								"男"}
							{item.addfriend &&
								item.addfriend.tag &&
								item.addfriend.tag.tag_sex == 2 &&
								"女"}
							{item.addfriend &&
								item.addfriend.tag &&
								item.addfriend.tag.tag_sex == 0 &&
								"通用"}
							{(!item.addfriend ||
								!item.addfriend.tag ||
								item.addfriend.tag.tag_sex.length <= 0) &&
								"未知"}
						</span>
					);
				}
			},
			{
				name: "地区",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return item.addfriend &&
						item.addfriend.tag &&
						item.addfriend.tag.tag_zone_cn
						? item.addfriend.tag.tag_zone_cn.join("-")
						: "未知";
				}
			},
			{
				name: "等级",
				class: "tc",
				width: 60,
				render: (item: any) => {
					return item.addfriend && item.addfriend.level;
				}
			},
			{
				name: "创建时间",
				class: "tc",
				width: 150,
				render: (item: any) => {
					return (
						item.addfriend &&
						item.addfriend &&
						item.addfriend.create_time
					);
				}
			},
			{
				name: "来源",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return (
						item.addfriend &&
						item.addfriend.tag &&
						item.addfriend.tag.writer_name
					);
				}
			},
			{
				name: "备注",
				render: (item: any) => {
					return item.addfriend && item.addfriend.note;
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
	componentDidMount() {
		this.initPage();
		this.getTagList();
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
			// let load = Toast.loading("数据加载中,请稍后...", 0);
			let res = await this.props.getSourceFriendListAction(params);
			// load.close();
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	openEdit(item?: any) {
		if (!item || !item.addfriend) {
			this.setState(
				{
					isShowEdit: true,
					editObj: {
						tags: [],
						level: 1,
						note: "",
						content: "",
						target_id: "",
						tag: {
							tag_sex: 0,
							tag_id: [],
							tag_value: [],
							tag_zone_cn: [],
							tag_zone_en: []
						}
					}
				},
				this.initArea
			);
			return;
		}
		let { addfriend } = item;
		let { content, level, note, tag, id } = addfriend;
		let set: any = { content, level, note };
		let tags: any = [];

		if (tag && tag.tag_id && tag.tag_id.length > 0) {
			tag.tag_id.map((v: any, idx: number) => {
				tags.push({
					tag_id: v,
					tag_name: tag.tag_value[idx]
				});
			});
		}
		set.target_id = id;
		set.tags = tags;
		set.tag = {
			tag_id: [],
			tag_value: []
		};
		if (tag) {
			set.tag.tag_zone_cn = tag.tag_zone_cn;
			set.tag.tag_zone_en = tag.tag_zone_en;
			set.tag.tag_sex = tag.tag_sex;
		}

		this.setState(
			{
				isShowEdit: true,
				editObj: { ...set }
			},
			this.initArea
		);
	}
	closeEdit() {
		this.setState({
			isShowEdit: false
		});
	}
	openImport() {
		this.setState({
			isShowImport: true
		});
	}
	closeImport() {
		this.setState({
			isShowImport: false
		});
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
	initArea() {
		let { editObj } = this.state;
		this.props
			.getProvincesListAction()
			.then((res: any) => {
				this.setState({
					provincesList: this.props.provincesList
				});
			})
			.then(() => {
				if (
					editObj &&
					editObj.tag &&
					editObj.tag.tag_zone_en &&
					editObj.tag.tag_zone_en[0]
				) {
					this.props
						.getCityListAction({ p: editObj.tag.tag_zone_en[0] })
						.then((city: any) => {
							let list: any = [];
							if (city && city.data && city.data.sub_provinces) {
								for (let key in city.data.sub_provinces) {
									list.push({
										label: city.data.sub_provinces[key],
										value: key
									});
								}
							}
							let d = this.state.provincesList;

							for (
								let i = 0;
								i < this.state.provincesList.length;
								i++
							) {
								if (
									d[i]["value"] == editObj.tag.tag_zone_en[0]
								) {
									d[i].children = list;
									break;
								}
							}

							this.setState({
								provincesList: [...d]
							});
						});
				}
			});
	}
	async loadData(selectedOptions: any) {
		const targetOption = selectedOptions[selectedOptions.length - 1];
		targetOption.loading = true;
		let city = await this.props.getCityListAction({
			p: targetOption.value
		});
		targetOption.loading = false;
		if (city && city.code == 200) {
			let list: any = [];
			if (city && city.data && city.data.sub_provinces) {
				for (let key in city.data.sub_provinces) {
					list.push({
						label: city.data.sub_provinces[key],
						value: key
					});
				}
			}
			targetOption.children = list;
		}
		this.setState({
			provincesList: [...this.state.provincesList]
		});
	}
	areaChange(value: any, selectedOptions: any) {
		let cn: any = [];
		if (selectedOptions) {
			selectedOptions.map((item: any) => {
				cn.push(item.label);
			});
		}
		let { editObj } = this.state;
		let set: any = {
			editObj: {
				...editObj,
				tag: {
					...editObj.tag,
					tag_zone_en: value,
					tag_zone_cn: cn
				}
			}
		};
		this.setState({ ...set });
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
	//新增编辑
	async addFriendClick() {
		let { editObj } = this.state;
		let { content, level, note, tag, tags, target_id } = editObj;
		if (!content || content.trim().length <= 0) {
			message.error("微信账号不能为空");
			return;
		}
		let params: any = {
			content,
			level,
			note
		};
		params.tag = {
			tag_zone_cn: tag.tag_zone_cn,
			tag_zone_en: tag.tag_zone_en,
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
		let res = await this.props.addSourceFriendAction(params);
		if (res && res.code == 200) {
			message.success("操作成功");
			this.getListData();
			this.closeEdit();
		}
	}
	downloadTemplate() {
		window.open("/file/Friend.xlsx");
	}
	uploadTemplateChange(data: any) {
		this.setState({
			template: data
		});
	}
	deleteTemplate(idx: number) {
		let { template } = this.state;
		template.splice(idx, 1);
		this.setState({
			template: [...template]
		});
	}
	async uploadFriendTemplate() {
		let { template } = this.state;
		if (!template || template.length <= 0) {
			return;
		}
		let res = await this.props.importTemplateFriendAction({
			sourcefilepath: template[0].url
		});
		if (res && res.code == 200) {
			message.success("上传模板成功");
			this.closeImport();
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
			provincesList,
			isShowEdit,
			isShowImport,
			editObj,
			page,
			pagesize,
			keyword,
			template,
			tags,
			isLoading
		} = this.state;
		let {
			tagList,
			getTagListAction,
			addTagAction,
			deleteTagAction,
			sourceFriendList,
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
			<div className="source-addfriend-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el keyword-box">
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf76e935680428222ba7"
							) && (
								<React.Fragment>
									{/* <Icon
										className="list-top-icon"
										title="添加"
										type="plus-circle"
										onClick={this.openEdit.bind(this)}
									/>
									<Icon
										type="download"
										className="list-top-icon"
										title="导入数据"
										onClick={this.openImport.bind(this)}
									/> */}
									<Button
										type="primary"
										className="ctrl-btn"
										onClick={this.openImport.bind(this)}
									>
										导入数据
									</Button>

									<Button
										type="primary"
										className="ctrl-btn"
										onClick={this.openEdit.bind(this)}
									>
										添加
									</Button>
								</React.Fragment>
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
								<React.Fragment>
									<Button
										type="primary"
										className="btn"
										onClick={this.openImport.bind(this)}
									>
										导入数据
									</Button>

									<Button
										type="primary"
										className="btn"
										onClick={this.openEdit.bind(this)}
									>
										添加
									</Button>
								</React.Fragment>
							)} */}
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={
								sourceFriendList && sourceFriendList.resources
							}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={sourceFriendList && sourceFriendList.total}
						/>
					</div>
				</div>
				{isShowEdit && (
					<Modal
						visible={isShowEdit}
						width={700}
						title="好友"
						wrapClassName="source-modal-box"
						onCancel={this.closeEdit.bind(this)}
						onOk={this.addFriendClick.bind(this)}
					>
						<div>
							<InputBox
								isRequired={true}
								labelName="微信账号"
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
								onChange={this.sexChange.bind(this)}
							/>
							<InputBox labelName="地区限制" autoWidth={true}>
								<Cascader
									placeholder="请选择地区"
									style={{ width: "100%" }}
									options={provincesList}
									loadData={this.loadData.bind(this)}
									onChange={this.areaChange.bind(this)}
									changeOnSelect={true}
									value={
										editObj &&
										editObj.tag &&
										editObj.tag.tag_zone_en
									}
								/>
							</InputBox>
							<InputBox
								type="select"
								labelName="等级"
								autoWidth={true}
								optionArr={[
									{
										key: 1,
										label: "一级"
									},
									{
										key: 2,
										label: "二级"
									},
									{
										key: 3,
										label: "三级"
									}
								]}
								value={
									editObj &&
									editObj.level &&
									Number(editObj.level)
								}
								onChange={this.addBoxChange.bind(this, "level")}
							/>
							<InputBox
								type="textarea"
								labelName="备注"
								autoWidth={true}
								flexTop={true}
								value={editObj && editObj.note}
								onChange={this.addBoxChange.bind(this, "note")}
							/>
						</div>
					</Modal>
				)}
				<Modal
					visible={isShowImport}
					title="导入数据"
					wrapClassName="source-modal-box"
					onCancel={this.closeImport.bind(this)}
					onOk={this.uploadFriendTemplate.bind(this)}
				>
					<div className="import-item">
						<div className="upload">
							<InputBox
								type="uploader"
								labelName="上传文件"
								limitSize={1024 * 1024 * 20}
								length={1}
								domain={requestUrl() + "/upload"}
								customRequest={true}
								autoWidth={true}
								limitType={["xlsx"]}
								value={template}
								onChange={this.uploadTemplateChange.bind(this)}
								deleteUplodaValue={this.deleteTemplate.bind(
									this
								)}
							/>
						</div>
						<span
							className="blue-text"
							onClick={this.downloadTemplate.bind(this)}
						>
							下载模板
						</span>
					</div>
				</Modal>
			</div>
		);
	}
}
