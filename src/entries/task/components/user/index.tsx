import * as React from "react";
import { Input, Button, Icon, Tag, Select } from "antd";
import ListPage from "../../../../basecomponent/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import * as classnames from "classnames";
import "./index.less";
const Option = Select.Option;
interface Props extends BaseListProps {
	data?: any;
	getData?: Function;
	onChange?: Function;
	selectedData?: any;
	goTask?: Function;
	figureList?: any;
	getFigureListAction?: Function;
	tagList1?: any;
	getTagListAction1?: Function;
	getCharaterAction1?: Function;
	characterList1?: any;
}
interface State extends BaseListState {
	keyword: string;
	selectIDList: any;
	figure_id: string | void;
	sex: number;
	tag: string | void;
	personal_desgin_id: string | void;
}

export default class UserList extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 30,
		keyword: "",
		selectIDList: [],
		figure_id: "0",
		sex: 0,
		tag: "0",
		personal_desgin_id: "0"
	};
	componentDidMount() {
		let state = window.sessionStorage.getItem("getAccountTaskState");
		if (state) {
			this.setState({
				...JSON.parse(state)
			});
		}
		this.getListData();
		this.getCharacterList();
		//this.getFigure();
		//this.getTagList();
	}
	getTagList(e?: any) {
		let params: any = { page: 1, type: "task" };
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getTagListAction1(params);
	}
	static getDerivedStateFromProps(nextProps: any, prevState: any): any {
		let arr: any = [];
		if (nextProps.selectedData && nextProps.selectedData.length > 0) {
			nextProps.selectedData.map((item: any) => {
				arr.push(item.id);
			});
		}
		if (JSON.stringify(arr) != JSON.stringify(prevState.selectIDList)) {
			return {
				selectIDList: arr
			};
		}
		return null;
	}
	componentWillUnmount() {
		window.sessionStorage.setItem(
			"getAccountTaskState",
			JSON.stringify(this.state)
		);
	}
	async getListData() {
		let {
			page,
			pagesize,
			keyword,
			figure_id,
			sex,
			tag,
			personal_desgin_id
		} = this.state;
		let params: any = {
			page,
			pagesize,
			type: "task"
		};

		if (keyword && keyword.trim().length > 0) {
			params.keyword = keyword;
		}
		if (figure_id && figure_id.trim().length > 0 && figure_id != "0") {
			params.figure_id = figure_id;
		}
		if (
			personal_desgin_id &&
			personal_desgin_id.trim().length > 0 &&
			personal_desgin_id != "0"
		) {
			params.personal_desgin_id = personal_desgin_id;
		}
		if (sex && sex != 0) {
			params.sex = sex;
		}
		if (tag && tag.length > 0 && tag != "0") {
			params.tag = tag;
		}
		this.props.getData(params);
	}
	leftGoClick(item: any, type: boolean) {
		let { onChange } = this.props;
		if (onChange && typeof onChange === "function") {
			onChange({ data: [item] }, type);
		}
	}
	leftGoAllClick(type: boolean) {
		let { onChange } = this.props;
		let { data } = this.props;
		if (onChange && typeof onChange === "function") {
			let all = [];
			if (data && data.users) {
				all = data.users;
			}
			onChange({ data: [...all] }, type);
		}
	}
	getAllCheckedState(): boolean {
		let { data } = this.props;
		let { selectIDList } = this.state;

		if (!data || !data.users || data.users.length <= 0) {
			return false;
		}
		let res: boolean = true;
		data.users.map((item: any) => {
			if (selectIDList.indexOf(item.id) == -1) {
				res = false;
			}
		});
		return res;
	}
	renderHeader() {
		return [
			{
				class: "tc",
				width: 60,
				titleRender: () => {
					return (
						<React.Fragment>
							<Icon
								type={
									this.getAllCheckedState()
										? "right-circle"
										: "left-circle"
								}
								className={classnames(
									"left-go",
									this.getAllCheckedState() && "act"
								)}
								onClick={this.leftGoAllClick.bind(
									this,
									this.getAllCheckedState()
								)}
							/>
						</React.Fragment>
					);
				},
				render: (item: any) => {
					return (
						<Icon
							type={
								this.state.selectIDList.indexOf(item.id) == -1
									? "left-circle"
									: "right-circle"
							}
							className={classnames(
								"left-go",
								this.state.selectIDList.indexOf(item.id) !=
									-1 && "act"
							)}
							onClick={this.leftGoClick.bind(
								this,
								item,
								this.state.selectIDList.indexOf(item.id) != -1
							)}
						/>
					);
				}
			},
			// {
			// 	name: "Token",
			// 	key: "device_token",
			// 	class: "tc",
			// 	width: 150
			// },
			{
				name: "手机编号",
				key: "note_mobile",
				class: "tc",
				width: 200
			},
			{
				name: "账号",
				key: "login_user",
				width: 180
			},
			{
				name: "星标",
				key: "2",
				width: 60,
				class: "tc",
				render: (item: any) => (
					<span>{item && item.is_star ? "是" : "否"}</span>
				)
			},
			{
				name: "昵称",
				key: "nickname",
				class: "tc",
				width: 150
			},
			{
				name: "性别",
				key: "2",
				width: 90,
				class: "tc",
				render: (item: any) => {
					return <span>{item.sex}</span>;
				}
			},
			{
				name: "地区",
				key: "province",
				width: 140,
				class: "tc",
				render: (item: any) => (
					<span>
						{item &&
							item.province &&
							item.province.length > 0 &&
							item.province + "-"}
						{item && item.city && item.city.length > 0 && item.city}
					</span>
				)
			},
			// {
			// 	name: "标签",
			// 	key: "2",
			// 	width: 250,
			// 	class: "tc sp-td",
			// 	render: (item: any) => {
			// 		return (
			// 			<span>
			// 				{item &&
			// 					item.tags_desc &&
			// 					item.tags_desc.length > 0 &&
			// 					item.tags_desc.map((v: any, idx: number) => {
			// 						return (
			// 							<Tag
			// 								color="#87d068"
			// 								key={idx}
			// 								style={{ marginBottom: "4px" }}
			// 							>
			// 								{v}
			// 							</Tag>
			// 						);
			// 					})}
			// 			</span>
			// 		);
			// 	}
			// },
			{
				name: "人设",
				class: "tc",
				key: "personal_desgin_name",
				width: 150
			},
			{
				name: "号龄",
				key: "2",
				width: 90,
				class: "tc",
				render: (item: any) => {
					return (
						<span>
							{((item: any) => {
								let date = new Date(item.create_time);
								let now = new Date();
								let times = now.getTime() - date.getTime();
								let d = times / (1000 * 60 * 60 * 24);
								return parseInt(d.toString()) + "天";
							})(item)}
						</span>
					);
				}
			},

			{
				name: "状态",
				key: "status",
				class: "tc",
				width: 90,
				render: (item: any) => (
					<span>
						{item.status == 0 ? (
							<span style={{ color: "red" }}>异常</span>
						) : (
							"正常"
						)}
					</span>
				)
			},
			{
				name: "备注",
				key: "note_account",
				class: "tc",
				width: 300
			}
		];
	}
	pageChange(e: any) {
		this.setState(
			{
				page: e
			},
			this.getListData
		);
	}
	searchClick() {
		this.setState(
			{
				page: 1
			},
			this.getListData
		);
	}
	backTask() {
		let { goTask } = this.props;
		if (goTask && typeof goTask === "function") {
			goTask();
		}
	}
	getFigure(e?: any) {
		let params: any = {
			page: 1,
			pagesize: 30,
			type: "task"
		};
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getFigureListAction(params);
	}
	getCharacterList(e?: any) {
		let params: any = {
			page: 1,
			pagesize: 30,
			type: "task"
		};
		if (e && e.length > 0) {
			params.keyword = e;
		}
		this.props.getCharaterAction1(params);
	}
	public InputChange(tag: string, e: any) {
		let value;
		if (e && e.target) {
			let type = e.target.type;
			switch (type) {
				case "checkbox":
					value = e.target.checked;
					break;
				default:
					value = e.target.value;
			}
			let set: any = {
				[tag]: value
			};
			this.setState(
				{
					...set
				},
				this.searchClick
			);
		} else {
			let set: any = {
				[tag]: e
			};
			this.setState(
				{
					...set
				},
				this.searchClick
			);
		}
	}
	resetSearch() {
		this.setState(
			{
				keyword: "",
				personal_desgin_id: "0",
				sex: 0,
				tag: "0"
			},
			this.searchClick
		);
	}
	render() {
		let { data, figureList, tagList1, characterList1 } = this.props;
		let {
			page,
			pagesize,
			keyword,
			figure_id,
			sex,
			tag,
			personal_desgin_id
		} = this.state;
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
			<div className="userlist-components">
				<div className="userlist-header">
					<span
						onClick={this.backTask.bind(this)}
						className="gobacktask"
					>
						<Icon type="double-left" />
						返回任务
					</span>
					<Input
						className="searchinput"
						value={keyword}
						onChange={this.InputChange.bind(this, "keyword")}
						placeholder="请输入编号/昵称"
					/>
					<Select
						value={sex}
						onChange={this.InputChange.bind(this, "sex")}
						style={{
							width: "120px",
							margin: "0 5px"
						}}
					>
						<Option value={0}>选择性别</Option>
						<Option value={1}>男</Option>
						<Option value={2}>女</Option>
					</Select>
					<Select
						value={personal_desgin_id}
						filterOption={false}
						onChange={this.InputChange.bind(
							this,
							"personal_desgin_id"
						)}
						style={{
							width: "120px",
							margin: "0 5px"
						}}
						onSearch={this.getCharacterList.bind(this)}
						showSearch={true}
					>
						<Option value={"0"}>选择人设</Option>
						{characterList1 &&
							characterList1.personaldesgins &&
							characterList1.personaldesgins.length > 0 &&
							characterList1.personaldesgins.map(
								(v: any, i: number) => {
									return (
										<Option key={v._id} value={v._id}>
											{v.title}
										</Option>
									);
								}
							)}
					</Select>
					{/* <Select
						showSearch={true}
						// mode="multiple"
						style={{
							width: "120px",
							margin: "0 5px"
						}}
						value={tag}
						onChange={this.InputChange.bind(this, "tag")}
						filterOption={false}
						onSearch={this.getTagList.bind(this)}
						// labelInValue={true}
						placeholder="选择标签"
					>
						<Option value={"0"}>选择标签</Option>
						{tagShowList.map((v: any, i: number) => {
							return (
								<Option key={v.key} value={v.key}>
									{v.label}
								</Option>
							);
						})}
					</Select> */}
					<Button
						type="primary"
						onClick={this.resetSearch.bind(this)}
					>
						重置
					</Button>
				</div>
				<div className="userlist-container">
					<TableBox
						headerList={this.renderHeader()}
						data={data && data.users}
					/>
				</div>
				<div className="userlist-footer">
					<FooterCtrl
						currentPage={page}
						total={data && data.total}
						pageSize={pagesize}
						pageChange={this.pageChange.bind(this)}
					/>
				</div>
			</div>
		);
	}
}
