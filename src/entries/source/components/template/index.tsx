import * as React from "react";
import { Button } from "antd";
import ListPage from "../../../../basecomponent/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import "./index.less";

interface Props extends BaseListProps {}
interface State extends BaseListState {}

export default class Template extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		page: 1,
		pagesize: 30
	};
	renderHeader() {
		return [
			{
				name: "模板名称",
				width: 120
			},
			{
				name: "映射形象"
			},
			{
				name: "朋友圈数量",
				class: "tc",
				width: 120
			},
			{
				name: "创建人",
				class: "tc",
				width: 120
			},
			{
				name: "创建时间",
				class: "tc",
				width: 120
			},
			{
				name: "模板时长",
				class: "tc",
				width: 120
			},
			{
				name: "操作",
				width: 120,
				class: "tc",
				render: (item: any) => {
					return (
						<React.Fragment>
							<span className="ctrlbtn edit">编辑</span>
							<span className="ctrlbtn danger">删除</span>
						</React.Fragment>
					);
				}
			}
		];
	}
	render() {
		return (
			<div className="source-template-page">
				<div className="list-page-box">
					<div className="list-header">
						<div className="left-el" />
						<div className="right-el">
							<Button type="primary">新建模板</Button>
						</div>
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={[1, 1, 1]}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={1}
							pageSize={30}
							pageChange={this.pageChange.bind(this)}
							total={80}
						/>
					</div>
				</div>
			</div>
		);
	}
}
