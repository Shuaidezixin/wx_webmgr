import * as React from "react";
import {
	Button,
	Input,
	Tag,
	Modal,
	message,
	Select,
	Icon,
	Popover
} from "antd";
import ListPage from "../../../../basecomponent/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import * as moment from "moment";
import debounce from "lodash/debounce";
import "./index.less";

const Option = Select.Option;

interface Props extends BaseListProps {
	sourceShuoshuoList?: any;
	getSourceShuoshuoListAction?: Function;
	deleteSourceShuoshuoAction?: Function;
	tagList1?: any;
	getTagListAction1?: Function;
	examineSourceShuoshuoAction?: Function;
}
interface State extends BaseListState {
	keyword: string;
	isLoading: boolean;
	tags: any;
	isShowConfirm: boolean;
	targetID: string;
}

export default class ShuoShuo extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
		this.getTagList = debounce(this.getTagList, 1000);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		keyword: "",
		isLoading: false,
		tags: [],
		isShowConfirm: false,
		targetID: ""
	};
	componentDidMount() {
		let info = window.sessionStorage.getItem("sourceInfo");
		let set: any = {};
		if (info) {
			set = JSON.parse(info);
		}
		this.getTagList();
		this.setState(
			{
				...set
			},
			this.initPage
		);
	}
	getTagList(e?: any) {
		let params: any = { page: 1, res_type: "shuoshuo" };
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
		console.log(tags);
		if (keyword && keyword.trim().length > 0) {
			params.keyword = keyword;
		}
		if (tags && tags.length > 0 && tags instanceof Array) {
			let arr = tags.map((v: any) => {
				return v.key;
			});
			params.tags = arr.join(";");
		}

		this.setState({
			isLoading: true
		});
		try {
			let res = await this.props.getSourceShuoshuoListAction(params);
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	async examineOK() {
		let { targetID } = this.state;
		if (
			!window.viliAuth(
				"5cebbbc4e935680d0497d245",
				"5cebbf83e935680428222ba9"
			)
		) {
			message.error("无编辑权限");
			return;
		}
		let res = await this.props.examineSourceShuoshuoAction({
			resource_pyq_id: targetID
		});
		if (res && res.code == 200) {
			message.success("审核通过");
			this.closeExamine();
		}
	}
	async examineNO() {
		let { targetID } = this.state;
		if (
			!window.viliAuth(
				"5cebbbc4e935680d0497d245",
				"5cebbf8de935680428222bab"
			)
		) {
			message.error("无删除权限");
			return;
		}
		let res = await this.props.deleteSourceShuoshuoAction({
			id: targetID
		});
		if (res && res.id.length > 0) {
			message.success("删除成功");
			this.closeExamine();
		}
	}
	examineClick(data: any) {
		this.setState({
			isShowConfirm: true,
			targetID: data.shuoshuo.id
		});
	}
	closeExamine() {
		this.setState({
			isShowConfirm: false,
			targetID: ""
		});
	}
	renderHeader() {
		//examine_status
		return [
			{
				name: "序号",
				width: 50,
				class: "tc",
				render: (item: any, idx: number) => idx + 1
			},
			{
				name: "朋友圈标题",
				width: 120,
				render: (item: any) => {
					return (
						<div className="line">
							{item.shuoshuo && item.shuoshuo.title}
						</div>
					);
				}
			},
			{
				name: "标签",
				class: "tc",
				width: 200,
				render: (item: any) => {
					return (
						item.shuoshuo &&
						item.shuoshuo.tag &&
						item.shuoshuo.tag.tag_value &&
						item.shuoshuo.tag.tag_value.length > 0 &&
						item.shuoshuo.tag.tag_value.map(
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
				name: "文字内容",
				width: 300,
				render: (item: any) => {
					return (
						<React.Fragment>
							{item.shuoshuo &&
								item.shuoshuo.contents &&
								item.shuoshuo.contents.length > 0 &&
								item.shuoshuo.contents.map(
									(v: any, idx: number) => {
										return (
											<div key={idx} title={v}>
												<Tag
													color="blue"
													style={{
														marginBottom: "4px",
														maxWidth: "100%"
														// display: "block"
													}}
													className="line"
												>
													{v}
												</Tag>
											</div>
										);
									}
								)}
						</React.Fragment>
					);
				}
			},
			{
				name: "自赞",
				class: "tc",
				width: 50,
				render: (item: any) => {
					return item.shuoshuo && item.shuoshuo.self_zan
						? "是"
						: "否";
				}
			},
			{
				name: "自评",
				width: 60,
				render: (item: any) => {
					return (
						<React.Fragment>
							{item.shuoshuo &&
								item.shuoshuo.comments &&
								item.shuoshuo.comments.length > 0 && (
									<div
										style={{
											textAlign: "center"
										}}
									>
										有
									</div>
								)}

							{(!item.shuoshuo ||
								!item.shuoshuo.comments ||
								item.shuoshuo.comments.length <= 0) && (
								<div
									style={{
										textAlign: "center",
										color: "red"
									}}
								>
									无
								</div>
							)}
						</React.Fragment>
					);
				}
			},
			{
				name: "时间限制",
				class: "tc",
				width: 180,
				render: (item: any) => {
					if (
						(!item.shuoshuo ||
							!item.shuoshuo.tag ||
							item.shuoshuo.tag.tag_date == 0) &&
						(!item.shuoshuo.tag.tag_date_value ||
							!this.formatTime(item.shuoshuo.tag.tag_date_value))
					) {
						return (
							<div
								style={{
									textAlign: "center",
									color: "red"
								}}
							>
								无
							</div>
						);
					}
					return (
						<React.Fragment>
							<div>
								时段：
								{item.shuoshuo &&
									item.shuoshuo.tag &&
									item.shuoshuo.tag.tag_date == 0 &&
									"不限"}
								{item.shuoshuo &&
									item.shuoshuo.tag &&
									item.shuoshuo.tag.tag_date == 1 &&
									"工作日"}
								{item.shuoshuo &&
									item.shuoshuo.tag &&
									item.shuoshuo.tag.tag_date == 2 &&
									"周末"}
							</div>
							<div>
								{item.shuoshuo &&
								item.shuoshuo.tag &&
								item.shuoshuo.tag.tag_date_value
									? this.formatTime(
											item.shuoshuo.tag.tag_date_value
									  )
									: "时间点：不限"}
							</div>
						</React.Fragment>
					);
				}
			},
			{
				name: "性别限制",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return (
						<span>
							{item.shuoshuo &&
								item.shuoshuo.tag &&
								item.shuoshuo.tag.tag_sex == 1 &&
								"男"}
							{item.shuoshuo &&
								item.shuoshuo.tag &&
								item.shuoshuo.tag.tag_sex == 2 &&
								"女"}
							{item.shuoshuo &&
								item.shuoshuo.tag &&
								item.shuoshuo.tag.tag_sex == 0 &&
								"通用"}
							{(!item.shuoshuo ||
								!item.shuoshuo.tag ||
								item.shuoshuo.tag.tag_sex.length <= 0) &&
								"未知"}
						</span>
					);
				}
			},
			{
				name: "地点限制",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return item.shuoshuo &&
						item.shuoshuo.tag &&
						item.shuoshuo.tag.tag_zone_cn &&
						item.shuoshuo.tag.tag_zone_cn.length > 0
						? item.shuoshuo.tag.tag_zone_cn.join("-")
						: "无限制";
				}
			},
			{
				name: "来源",
				class: "tc",
				width: 120,
				render: (item: any) => {
					return (
						item.shuoshuo &&
						item.shuoshuo.tag &&
						item.shuoshuo.tag.writer_name
					);
				}
			},
			{
				name: "创建时间",
				class: "tc",
				width: 150,
				render: (item: any) => {
					return (
						item.shuoshuo &&
						item.shuoshuo &&
						item.shuoshuo.create_time
					);
				}
			},
			{
				name: "操作",
				width: 160,
				class: "tc",
				render: (item: any) => {
					return (
						<React.Fragment>
							{/* {item.shuoshuo.examine_status == 0 && (
								<span
									className="ctrlbtn edit"
									onClick={this.examineClick.bind(this, item)}
								>
									审核
								</span>
							)} */}
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf83e935680428222ba9"
							) && (
								<span
									className="ctrlbtn edit"
									onClick={this.goEdit.bind(this, item)}
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
	deleteClick(data: any) {
		if (!data) {
			return;
		}
		let id = data && data.shuoshuo && data.shuoshuo.id;
		Modal.confirm({
			title: "警告",
			content: "你确定删除这条数据？",
			onOk: async () => {
				let res = await this.props.deleteSourceShuoshuoAction({
					id: id
				});
				if (res && res.id.length > 0) {
					message.success("删除成功");
				}
			}
		});
	}
	formatTime(value: string) {
		if (!value) {
			return false;
		}
		let arr = value.split("~");
		return (
			"时间点：" +
			moment(arr[0], "HHmm").format("HH:mm") +
			"~" +
			moment(arr[1], "HHmm").format("HH:mm")
		);
	}
	goEdit(data?: any) {
		let { page, pagesize } = this.state;
		window.sessionStorage.setItem(
			"sourceInfo",
			JSON.stringify({
				page
			})
		);
		if (data && data.shuoshuo) {
			window.sessionStorage.setItem("shuoshuoID", data.shuoshuo.id);
		} else {
			window.sessionStorage.removeItem("shuoshuoID");
		}
		window.appHistory.push({
			pathname: "/source/shuoshuo"
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
		if (tags && tags.length > 0 && tags instanceof Array) {
			params.tags = encodeURI(JSON.stringify(tags));
		}
		this.goPage(params);
	}
	render() {
		let {
			isLoading,
			page,
			pagesize,
			keyword,
			tags,
			isShowConfirm
		} = this.state;
		let { sourceShuoshuoList, tagList1 } = this.props;
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
			<div className="source-shuoshuo-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el keyword-box">
							{window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf76e935680428222ba7"
							) && (
								// <Icon
								// 	type="plus-circle"
								// 	onClick={this.goEdit.bind(this)}
								// 	className="list-top-icon"
								// 	title="添加说说"
								// />
								<Button
									onClick={this.goEdit.bind(this)}
									type="primary"
									className="ctrl-btn"
								>
									添加
								</Button>
							)}
							<Popover
								placement="bottomLeft"
								overlayClassName="filter-box"
								content={
									<React.Fragment>
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
												onChange={window.Util.InputChange.bind(
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
										<div className="filter-item">
											<Input
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
												onClick={this.searchClick.bind(
													this
												)}
											>
												搜索
											</Button>
										</div>
									</React.Fragment>
								}
							>
								{/* <Icon
									type="filter"
									// onClick={this.goEdit.bind(this)}
									className="list-top-icon"
									title="筛选"
								/> */}
								<Button className="ctrl-btn" type="primary">
									筛选
								</Button>
							</Popover>
						</div>
						<div className="right-el">
							{/* {window.viliAuth(
								"5cebbbc4e935680d0497d245",
								"5cebbf76e935680428222ba7"
							) && (
								<Button
									type="primary"
									onClick={this.goEdit.bind(this)}
								>
									添加说说
								</Button>
							)} */}
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={
								sourceShuoshuoList &&
								sourceShuoshuoList.resources
							}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={
								sourceShuoshuoList && sourceShuoshuoList.total
							}
						/>
					</div>
				</div>
				<Modal
					title="审核"
					visible={isShowConfirm}
					onCancel={this.closeExamine.bind(this)}
					footer={
						<div>
							<Button
								type="danger"
								onClick={this.examineNO.bind(this)}
							>
								不通过
							</Button>
							<Button
								type="primary"
								onClick={this.examineOK.bind(this)}
							>
								通过
							</Button>
						</div>
					}
				>
					你是否审核通过此朋友圈素材？
				</Modal>
			</div>
		);
	}
}
