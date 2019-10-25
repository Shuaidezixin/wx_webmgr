import * as React from "react";
import {
	Button,
	Select,
	TimePicker,
	Input,
	Cascader,
	Checkbox,
	Radio,
	Icon,
	Tag,
	Modal,
	message
} from "antd";
import InputBox from "@component/inputbox";
import Tags from "@component/tags";
import "./index.less";
import { requestUrl } from "../../../config";
import * as moment from "moment";

const Option = Select.Option;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
interface Props {
	provincesList?: any;
	cityList?: any;
	getProvincesListAction?: Function;
	getCityListAction?: Function;
	data?: any;
	tagList?: any;
	getTagListAction?: Function;
	addTagAction?: Function;
	deleteTagAction?: Function;
	addSourceShuoshuoAction?: Function;
	getSourceShuoshuoDetailAction?: Function;
	clearTagListAction?: Function;
}
interface State {
	provincesList: any;
	Pyq_sentshuoshuo: any;
	isShowTags: boolean;
	editObj: EditObj;
}
interface EditObj {
	tags: any;
	content: string;
	title: string;
	tag: any;
	target_id: string;
	self_zan: boolean;
	pics: any;
	self_location: boolean;
	pic_style: number;
	pic_count: number;
	contents: string[];
	comments: string[];
}
export default class Root extends React.PureComponent<Props, State> {
	constructor(props: any) {
		super(props);
	}
	readonly state: State = {
		provincesList: [],
		Pyq_sentshuoshuo: null,
		isShowTags: false,
		editObj: {
			contents: [""],
			comments: [""],
			target_id: "",
			tags: [],
			content: "",
			title: "",
			self_zan: false,
			self_location: false,
			pics: [],
			pic_count: 1,
			pic_style: 0,
			tag: {
				tag_id: [],
				tag_value: [],
				tag_sex: 0,
				tag_zone_cn: [],
				tag_zone_en: [],
				tag_date: 0,
				tag_date_value: "",
				tag_date_start: null,
				tag_date_end: null
			}
		}
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "朋友圈模板");
		this.initPage();
		this.initArea();
	}
	async initPage() {
		let id = window.sessionStorage.getItem("shuoshuoID");
		if (!id) {
			return;
		}
		let res = await this.props.getSourceShuoshuoDetailAction({
			id: id
		});
		if (
			res &&
			res.code == 200 &&
			res.data &&
			res.data.resources &&
			res.data.resources.shuoshuo
		) {
			let data = res.data.resources.shuoshuo;
			let set: any = {
				target_id: id,
				contents:
					data.contents && data.contents.length > 0
						? data.contents
						: [""],
				comments:
					data.comments && data.comments.length > 0
						? data.comments
						: [""],
				content: "",
				title: data.title,
				self_zan: data.self_zan,
				self_location: data.self_location,
				//pics: [],
				pic_count: data.pic_count,
				pic_style: data.pic_style,
				tag: {
					tag_id: [],
					tag_value: [],
					tag_sex: data.tag && data.tag.tag_sex,
					tag_zone_cn: data.tag && data.tag.tag_zone_cn,
					tag_zone_en: data.tag && data.tag.tag_zone_en,
					tag_date: data.tag && data.tag.tag_date,
					tag_date_value: "",
					tag_date_start: null,
					tag_date_end: null
				}
			};
			//初始化tag
			let tags: any = [];
			if (
				data &&
				data.tag &&
				data.tag.tag_id &&
				data.tag.tag_id.length > 0
			) {
				data.tag.tag_id.map((v: any, idx: number) => {
					tags.push({
						tag_id: v,
						tag_name: data.tag.tag_value[idx]
					});
				});
			}
			set.tags = tags;
			let pics: any = [];
			if (data.pics && data.pics.length > 0) {
				data.pics.map((v: any) => {
					pics.push({
						url: v
					});
				});
			}
			set.pics = pics;
			if (
				data.tag &&
				data.tag.tag_date_value &&
				data.tag.tag_date_value.length > 0
			) {
				let m = data.tag.tag_date_value.split("~");
				set.tag.tag_date_start = moment(m[0], "HHmm");
				set.tag.tag_date_end = moment(m[1], "HHmm");
			}

			this.setState(
				{
					editObj: {
						...set
					}
				},
				this.initArea
			);
		}
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
					editObj.tag.tag_zone_en.length > 0 &&
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
		let data: any;
		switch (type) {
			case "self_zan":
				data = e.target.checked;
				break;
			case "self_location":
				data = e.target.checked;
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
		console.log(set);
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
	timeLimitChange(e: any) {
		let { editObj } = this.state;
		let set: any = {
			editObj: {
				...editObj,
				tag: {
					...editObj.tag,
					tag_date: e
				}
			}
		};
		this.setState({ ...set });
	}
	timeChange(type: string, e: any) {
		let { editObj } = this.state;
		let set: any = {
			editObj: {
				...editObj,
				tag: {
					...editObj.tag,
					["tag_date_" + type]: e
				}
			}
		};
		this.setState({ ...set });
	}
	PicTypeChange(e: any) {
		let { editObj } = this.state;
		let set: any = {
			editObj: { ...editObj, pic_style: e.target.value }
		};

		this.setState({ ...set });
	}
	PicNumChange(e: any) {
		let { editObj } = this.state;
		let set: any = {
			editObj: { ...editObj, pic_count: e.target.value }
		};

		this.setState({ ...set });
	}
	textareaChange(type: string, idx: number, e: any) {
		let { editObj }: any = this.state;
		let textArr: any = editObj[type];
		textArr[idx] = e.target.value;
		this.setState({
			editObj: {
				...this.state.editObj,
				[type]: [...textArr]
			}
		});
	}
	PicsChange(e: any) {
		this.setState({
			editObj: {
				...this.state.editObj,
				pics: [
					...this.state.editObj.pics,
					{
						url: e[0].url
					}
				]
			}
		});
	}
	deleteText(type: string, idx: number) {
		Modal.confirm({
			title: "提示",
			content: `您确定删除这条${type == "Comments" ? "评论" : "文字"}?`,
			onOk: () => {
				let { editObj }: any = this.state;
				let list: any = editObj[type];
				list.splice(idx, 1);
				let set: any = {
					editObj: {
						...this.state.editObj,
						[type]: [...list]
					}
				};
				this.setState({
					...set
				});
			}
		});
	}
	deletePics(idx: number) {
		let list = this.state.editObj.pics;
		list.splice(idx, 1);
		let pcis = this.state.editObj.pic_count;
		if (list.length < this.state.editObj.pic_count) {
			if (list.length < 9) {
				pcis = 6;
			}
			if (list.length < 6) {
				pcis = 4;
			}
			if (list.length < 4) {
				pcis = 3;
			}
			if (list.length < 3) {
				pcis = 1;
			}
		}
		this.setState({
			editObj: {
				...this.state.editObj,
				pics: [...list],
				pic_count: Number(pcis)
			}
		});
	}
	addMore(type: string) {
		let { editObj }: any = this.state;
		this.setState({
			editObj: {
				...this.state.editObj,
				[type]: [...editObj[type], ""]
			}
		});
	}
	async saveClick() {
		let { editObj } = this.state;
		let {
			contents,
			comments,
			tag,
			tags,
			target_id,
			pics,
			pic_count,
			pic_style,
			title,
			self_location,
			self_zan
		} = editObj;
		let useContents: any = [];
		let useComments: any = [];
		let usePics: any = [];
		if (!title || title.trim().length <= 0) {
			message.error("标题不能为空");
			return;
		}
		if (contents && contents.length > 0) {
			useContents = contents.filter((v: any) => {
				if (v.trim().length > 0) {
					return v;
				}
			});
		}
		if (comments && comments.length > 0) {
			useComments = comments.filter((v: any) => {
				if (v.trim().length > 0) {
					return v;
				}
			});
		}
		if (pics && pics.length > 0) {
			pics.map((v: any) => {
				usePics.push(v.url);
			});
		}

		if (useContents.length <= 0) {
			message.error("文字不能为空");
			return;
		}

		if (
			tag.tag_date_start &&
			tag.tag_date_end &&
			tag.tag_date_start.format("HHmm") > tag.tag_date_end.format("HHmm")
		) {
			message.error("时间限制前面的时间不能大于后面的时间");
			return;
		}
		if (
			(tag.tag_date_start && !tag.tag_date_end) ||
			(!tag.tag_date_start && tag.tag_date_end)
		) {
			message.error("时间不能存在一个为空一个存在的情况");
			return;
		}
		let time = "";
		if (tag.tag_date_start && tag.tag_date_end) {
			time = `${tag.tag_date_start.format(
				"HHmm"
			)}~${tag.tag_date_end.format("HHmm")}`;
		}
		let params: any = {
			title,
			pic_count,
			pic_style,
			contents: useContents,
			comments: useComments,
			pics: usePics,
			self_location,
			self_zan
		};

		params.tag = {
			tag_zone_cn: tag.tag_zone_cn,
			tag_zone_en: tag.tag_zone_en,
			tag_sex: tag && tag.tag_sex ? tag.tag_sex : 0,
			tag_date: tag.tag_date,
			tag_date_value: time
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
		let res = await this.props.addSourceShuoshuoAction(params);
		if (res && res.code == 200) {
			message.success("操作成功");
			window.appHistory.push({
				pathname: "/source"
			});
		}
	}
	cancelClick() {
		window.appHistory.replace("/source");
	}
	render() {
		let { provincesList, Pyq_sentshuoshuo, editObj } = this.state;
		let {
			tagList,
			getTagListAction,
			addTagAction,
			deleteTagAction,
			clearTagListAction
		} = this.props;
		console.log("shuoshuo", editObj);
		if (
			!window.viliAuth(
				"5cebbbc4e935680d0497d245",
				"5cebbf76e935680428222ba7"
			)
		) {
			return (
				<div style={{ textAlign: "center", padding: "100px 0" }}>
					无权限
				</div>
			);
		}
		return (
			<div className="sourceshuoshuo-page">
				<div className="sourceshuoshuo-container">
					<div className="shuoshuo-header">
						<div className="t1">朋友圈</div>
						{window.viliAuth(
							"5cebbbc4e935680d0497d245",
							"5cebbf76e935680428222ba7"
						) && (
							<Button
								type="primary"
								onClick={this.saveClick.bind(this)}
							>
								保存
							</Button>
						)}
						<Button
							onClick={this.cancelClick.bind(this)}
							style={{
								marginLeft: "10px"
							}}
						>
							取消
						</Button>
					</div>
					<div className="sourceshuoshuo-content">
						<div className="shuoshuo-left">
							<div className="title-text" />
							<div className="attr-item">
								<InputBox
									labelName="标题"
									flexTop={true}
									isRequired={true}
									autoWidth={true}
									value={editObj && editObj.title}
									onChange={this.addBoxChange.bind(
										this,
										"title"
									)}
								/>
							</div>
							<div className="attr-item">
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
											onSave={this.tagSave.bind(this)}
											data={tagList}
											getData={getTagListAction}
											addTag={addTagAction}
											deleteTag={deleteTagAction}
											selectedData={
												editObj && editObj.tags
											}
											clear={clearTagListAction}
										/>
									</React.Fragment>
								</InputBox>
							</div>
							<div className="attr-item">
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
							<div className="attr-item">
								<InputBox labelName="时间限制" autoWidth={true}>
									<div className="item-inner">
										<Select
											className="input"
											value={
												editObj &&
												editObj.tag &&
												editObj.tag.tag_date
											}
											onChange={this.timeLimitChange.bind(
												this
											)}
										>
											<Option value={0}>不限</Option>
											<Option value={1}>工作日</Option>
											<Option value={2}>周末</Option>
										</Select>
										<TimePicker
											className="input"
											format="HH:mm"
											value={
												editObj &&
												editObj.tag &&
												editObj.tag.tag_date_start
											}
											onChange={this.timeChange.bind(
												this,
												"start"
											)}
										/>
										<span style={{ marginRight: "10px" }}>
											~
										</span>
										<TimePicker
											className="input"
											format="HH:mm"
											value={
												editObj &&
												editObj.tag &&
												editObj.tag.tag_date_end
											}
											onChange={this.timeChange.bind(
												this,
												"end"
											)}
										/>
									</div>
								</InputBox>
							</div>
							<div className="attr-item">
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
							</div>
							{/* <div className="attr-item">
								<InputBox labelName="定位" autoWidth={true}>
									<Checkbox
										checked={
											editObj && editObj.self_location
										}
										onChange={this.addBoxChange.bind(
											this,
											"self_location"
										)}
									>
										{editObj && editObj.self_location
											? "打开"
											: "关闭"}
									</Checkbox>
								</InputBox>
							</div> */}
							<div className="attr-item">
								<InputBox labelName="自赞" autoWidth={true}>
									<Checkbox
										checked={editObj && editObj.self_zan}
										onChange={this.addBoxChange.bind(
											this,
											"self_zan"
										)}
									>
										{editObj && editObj.self_zan
											? "打开"
											: "关闭"}
									</Checkbox>
								</InputBox>
							</div>
						</div>
						<div className="shuoshuo-right">
							<div className="title-text" />
							<div className="attr-item">
								<InputBox labelName="文字" flexTop={true}>
									<div className="mgt10 w100">
										<div className="w100">
											{editObj &&
												editObj.contents &&
												editObj.contents.length > 0 &&
												editObj.contents.map(
													(
														item: any,
														idx: number
													) => {
														return (
															<div
																className="textarea-box"
																key={idx}
															>
																<TextArea
																	className="textarea"
																	value={item}
																	onChange={this.textareaChange.bind(
																		this,
																		"contents",
																		idx
																	)}
																	autosize
																/>
																{editObj &&
																	editObj.contents &&
																	editObj
																		.contents
																		.length >
																		1 && (
																		<Icon
																			type="delete"
																			className="delete"
																			onClick={this.deleteText.bind(
																				this,
																				"contents",
																				idx
																			)}
																		/>
																	)}
															</div>
														);
													}
												)}
										</div>
										<Button
											type="primary"
											className="mgt10"
											size="small"
											onClick={this.addMore.bind(
												this,
												"contents"
											)}
										>
											添加文字
										</Button>
									</div>
								</InputBox>
							</div>
							<div className="attr-item">
								<InputBox
									labelName="图片"
									flexTop={true}
									type="uploader-img"
									autoWidth={true}
									value={editObj && editObj.pics}
									customRequest={true}
									domain={requestUrl() + "/upload"}
									onChange={this.PicsChange.bind(this)}
									deleteUplodaValue={this.deletePics.bind(
										this
									)}
									playVideo={true}
									limitDuration={10 * 1000}
									limitType={["jpg", "jpeg", "png", "mp4"]}
									limitSize={1024 * 1024 * 5}
									multiple={true}
									desc={
										<div className="w100">
											<div>
												请上传jpg,png,mp4格式小于5M的素材
											</div>
											<div className="flex ac">
												<div className="t">
													图片张数
												</div>
												<RadioGroup
													value={
														editObj &&
														editObj.pic_style
													}
													onChange={this.PicTypeChange.bind(
														this
													)}
												>
													<Radio value={0}>
														不限
													</Radio>
													<Radio value={1}>
														上传数
													</Radio>
												</RadioGroup>
												{editObj &&
													editObj.pic_style == 1 && (
														<RadioGroup
															value={
																editObj &&
																editObj.pic_count
															}
															onChange={this.PicNumChange.bind(
																this
															)}
														>
															{editObj &&
																editObj.pics
																	.length >=
																	1 && (
																	<Radio
																		value={
																			1
																		}
																	>
																		1张
																	</Radio>
																)}
															{editObj &&
																editObj.pics
																	.length >=
																	3 && (
																	<Radio
																		value={
																			3
																		}
																	>
																		3张
																	</Radio>
																)}
															{editObj &&
																editObj.pics
																	.length >=
																	4 && (
																	<Radio
																		value={
																			4
																		}
																	>
																		4张
																	</Radio>
																)}
															{editObj &&
																editObj.pics
																	.length >=
																	6 && (
																	<Radio
																		value={
																			6
																		}
																	>
																		6张
																	</Radio>
																)}
															{editObj &&
																editObj.pics
																	.length >=
																	9 && (
																	<Radio
																		value={
																			9
																		}
																	>
																		9张
																	</Radio>
																)}
														</RadioGroup>
													)}
											</div>
										</div>
									}
								/>
							</div>
							<div className="attr-item">
								<InputBox labelName="自评" flexTop={true}>
									<div className="w100">
										<div className="mgt10 w100">
											{editObj &&
												editObj.comments &&
												editObj.comments.length > 0 &&
												editObj.comments.map(
													(
														item: any,
														idx: number
													) => {
														return (
															<div
																className="textarea-box"
																key={idx}
															>
																<TextArea
																	value={item}
																	onChange={this.textareaChange.bind(
																		this,
																		"comments",
																		idx
																	)}
																	className="textarea"
																	autosize
																/>
																{editObj &&
																	editObj.comments &&
																	editObj
																		.comments
																		.length >
																		1 && (
																		<Icon
																			type="delete"
																			className="delete"
																			onClick={this.deleteText.bind(
																				this,
																				"comments",
																				idx
																			)}
																		/>
																	)}
															</div>
														);
													}
												)}
										</div>
										<Button
											type="primary"
											className="mgt10"
											size="small"
											onClick={this.addMore.bind(
												this,
												"comments"
											)}
										>
											添加自评
										</Button>
									</div>
								</InputBox>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
