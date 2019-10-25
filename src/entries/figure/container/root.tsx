import * as React from "react";
import { Button, Modal, Icon } from "antd";
import ListPage from "../../../basecomponent/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";

import "./index.less";

interface Props extends BaseListProps {
	figureList?: any;
	getFigureListAction?: Function;
	deleteFigureAction?: Function;
}
interface State extends BaseListState {
	isLoading: boolean;
}
export default class Root extends ListPage<Props, State> {
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isLoading: false
	};
	static readonly defaultProp: Props = {};
	constructor(props: Props) {
		super(props);
	}

	public renderHeader(): any {
		return [
			{
				name: "形象名称",
				key: "basic.name",
				class: "tc",
				width: 150,
				render: (item: any) => (
					<span>{item && item.basic && item.basic.name}</span>
				)
			},
			// {
			// 	name: "标签",
			// 	key: "name",
			// 	class: "tc",
			// 	width: 80
			// },
			{
				name: "描述",
				key: "name",
				class: "",
				render: (item: any) => (
					<span>{item && item.basic && item.basic.desc}</span>
				)
			},
			{
				name: "性别",
				key: "name",
				class: "tc",
				width: 50,
				render: (item: any) => (
					<span>
						{item && item.basic && (
							<React.Fragment>
								{item.basic.sex == 1 && "男"}
								{item.basic.sex == 2 && "女"}
							</React.Fragment>
						)}
					</span>
				)
			},
			{
				name: "年龄",
				key: "name",
				class: "tc",
				width: 50,
				render: (item: any) => (
					<span>{item && item.basic && item.basic.age}</span>
				)
			},
			{
				name: "创建时间",
				key: "name",
				class: "tc",
				width: 150,
				render: (item: any) => <span>{item && item.create_time}</span>
			},
			{
				name: "操作",
				key: "name",
				class: "tc",
				width: 200,
				render: (item: any) => {
					return (
						<React.Fragment>
							<span
								className="ctrlbtn"
								onClick={this.goDetail.bind(
									this,
									item.figure_id
								)}
							>
								查看详情
							</span>
							{window.viliAuth(
								"5cebbbb6e935680d0497d243",
								"5cebbf43e935680428222ba1"
							) && (
								<span
									className="ctrlbtn edit"
									onClick={this.goEdit.bind(
										this,
										item.figure_id
									)}
								>
									编辑
								</span>
							)}
							{window.viliAuth(
								"5cebbbb6e935680d0497d243",
								"5cebbf54e935680428222ba3"
							) && (
								<span
									className="ctrlbtn delete"
									onClick={this.deleteClick.bind(
										this,
										item.figure_id
									)}
								>
									删除
								</span>
							)}
						</React.Fragment>
					);
				}
			}
		];
	}
	// 形象详情页
	goDetail(id: string) {
		window.sessionStorage.setItem("figureDetailId", id);
		window.appHistory.push({
			pathname: "/character/figure/detail"
		});
	}
	// 删除
	deleteClick(id: string) {
		if (!id || id.length <= 0) {
			return;
		}
		Modal.confirm({
			title: "警告",
			content: `确认删除此条形象？`,
			onOk: () => {
				this.props.deleteFigureAction({
					figure_id: id
				});
			}
		});
	}
	// 编辑or新建形象
	public goEdit(id?: number | void) {
		window.sessionStorage.removeItem("figureActiveIDX");
		if (!id) {
			window.sessionStorage.removeItem("figureID");
			window.appHistory.push({
				pathname: "/character/figure/edit"
			});
		} else {
			window.sessionStorage.setItem("figureID", id.toString());
			window.appHistory.push({
				pathname: "/character/figure/edit"
			});
		}
	}
	// 人设管理按钮
	toCharacter() {
		window.appHistory.push({
			pathname: "/character"
		});
	}
	// public pageChange(page: number) {}
	public componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "形象管理");
		this.initPage();
	}
	async getListData() {
		let { page, pagesize } = this.state;
		this.setState({
			isLoading: true
		});
		try {
			let res = await this.props.getFigureListAction({
				page,
				pagesize,
				type: "figures"
			});
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	public render() {
		let { isLoading, pagesize, page } = this.state;
		let { figureList } = this.props;
		return (
			<div className="figure-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el">
							{window.viliAuth(
								"5cebbbb6e935680d0497d244",
								"5cebbf29e935680428212b9d"
							) && (
								<Button
									// type="primary"
									style={{
										background: "#6594EB",
										color: "#fff",
										marginRight: "20px"
									}}
									onClick={this.toCharacter.bind(this)}
								>
									人设管理
								</Button>
							)}
							{window.viliAuth(
								"5cebbbb6e935680d0497d243",
								"5cebbf39e935680428222b9f"
							) && (
								<Button
									type="primary"
									onClick={this.goEdit.bind(this, null)}
								>
									新建形象
								</Button>
								// <Icon
								// 	className="list-top-icon"
								// 	title="新建形象"
								// 	type="plus-circle"
								// 	onClick={this.goEdit.bind(this, null)}
								// />
							)}
						</div>
						<div className="right-el">
							{/* {window.viliAuth(
								"5cebbbb6e935680d0497d243",
								"5cebbf39e935680428222b9f"
							) && (
								<Button
									type="primary"
									onClick={this.goEdit.bind(this, null)}
								>
									新建形象
								</Button>
							)} */}
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={figureList && figureList.figures}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							total={figureList && figureList.total}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
						/>
					</div>
				</div>
			</div>
		);
	}
}
