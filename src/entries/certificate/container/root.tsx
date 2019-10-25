import * as React from "react";
import { Modal } from "antd";
import ListPage from "../../../basecomponent/listpage";
import FooterCtrl from "@component/footer_ctrl";
import TableBox from "@component/tablebox";
import Toast from "@component/toast";

import "./index.less";

interface Props extends BaseListProps {
	certificateList?: any;
	getCertificateListAction?: Function;
	downloadNodeCertAction?: Function;
	updateNodeNoteAction?: Function;
}
interface State extends BaseListState {
	isLoading: boolean;
	isShowDetail: boolean;
	openDetailData: any;
	inputBoxData: any;
	focusValue: any;
}
export default class Root extends ListPage<Props, State> {
	readonly state: State = {
		page: 1,
		pagesize: 30,
		isLoading: false,
		isShowDetail: false,
		openDetailData: null,
		inputBoxData: null,
		focusValue: ""
	};
	static readonly defaultProp: Props = {};
	constructor(props: Props) {
		super(props);
	}
	public renderHeader(): any {
		return [
			{
				name: "序号",
				width: 100,
				class: "tc",
				render: (item: any, idx: number) => idx + 1
			},
			{
				name: "节点证书",
				key: "name",
				class: "tc",
				width: 200,
				render: (item: any) => {
					return (
						<span
							className="certificate-download"
							onClick={this.downloadCertificate.bind(this, item)}
						>
							下载
						</span>
					);
				}
			},
			{
				name: "证书状态",
				width: 200,
				// key: "node_status",
				class: "tc",
				render: (item: any) => {
					switch (item.node_status) {
						case 0:
							return "未使用";
						case 1:
							return "已使用";
					}
				}
			},
			{
				name: "节点编号",
				// key: "node_note",
				width: 400,
				class: "tc",
				render: (item: any, idx: number) => {
					let { inputBoxData } = this.state;
					return (
						<input
							placeholder="单击修改"
							className="node-note-box"
							value={
								inputBoxData ? inputBoxData[idx].node_note : ""
							}
							onChange={this.changeNote.bind(this, idx)}
							onBlur={this.blurNote.bind(this, item)}
							onFocus={this.focusNote.bind(this)}
						/>
					);
				}
			},
			{
				name: "节点信息",
				width: 200,
				class: "tc",
				render: (item: any) => {
					return (
						window.viliAuth(
							"5cefaa84875bc01b14b759d7",
							"5cefab0b875bc01b14b759df"
						) && (
							<span
								className="certificate-download"
								onClick={this.openDetail.bind(this, item)}
							>
								查看
							</span>
						)
					);
				}
			},
			{
				name: "",
				class: ""
			}
		];
	}
	public componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "节点证书");
		this.initPage();
	}
	async getListData() {
		let { page, pagesize } = this.state;
		this.setState({
			isLoading: true
		});
		let params: any = {
			page,
			pagesize
		};
		try {
			let res = await this.props.getCertificateListAction(params);
		} finally {
			this.setState({
				isLoading: false,
				inputBoxData: this.props.certificateList.nodes
			});
		}
	}
	// 下载证书
	async downloadCertificate(data: any) {
		let params: any = {
			node_server_id: data._id
		};
		let res = await this.props.downloadNodeCertAction(params);
		if (res && res.code == 200) {
			window.open(res.data);
			// window.location.href = res.data;
		}
	}
	// 打开查看弹框
	openDetail(data: any) {
		this.setState({
			isShowDetail: true,
			openDetailData: data
		});
	}
	// 关闭查看弹框
	closeDetail() {
		this.setState({
			isShowDetail: false,
			openDetailData: null
		});
	}
	// 改变节点编号
	changeNote(i: number, e: any) {
		let { inputBoxData } = this.state;
		inputBoxData[i].node_note = e.target.value;
		this.setState({
			inputBoxData: [...inputBoxData]
		});
	}
	focusNote(e: any) {
		this.setState({
			focusValue: e.target.value
		});
	}
	blurNote(data: any, e: any) {
		let { focusValue } = this.state;
		if (focusValue === e.target.value) {
			return;
		} else {
			let params: any = {
				node_server_id: data._id,
				nodenote: e.target.value
			};
			this.props.updateNodeNoteAction(params);
		}
	}

	usedTotal() {
		let { certificateList } = this.props;
		if (!certificateList.nodes) {
			return 0;
		}
		let total: number = 0;
		certificateList.nodes.map((v: any, i: number) => {
			if (v.node_status == 1) {
				total++;
			}
		});
		return total;
	}
	unusedTotal() {
		let { certificateList } = this.props;
		if (!certificateList.nodes) {
			return 0;
		}
		let total: number = 0;
		certificateList.nodes.map((v: any, i: number) => {
			if (v.node_status == 0) {
				total++;
			}
		});
		return total;
	}
	openHelp() {
		Toast.info({
			title: "如何使用证书？",
			content: "请前往-软件下载-下载'节点证书使用说明",
			width: 600,
			wrapClassName: "help-toast"
		});
	}
	public render() {
		let {
			page,
			pagesize,
			isShowDetail,
			isLoading,
			openDetailData
		} = this.state;
		let { certificateList } = this.props;
		return (
			<div className="certificate-page">
				<div className="list-page-box">
					<div className="list-header">
						{certificateList && (
							<React.Fragment>
								<div className="top-info-left">
									共有
									{certificateList && certificateList.total}
									条节点证书，已使用{this.usedTotal()}
									条，未使用{this.unusedTotal()}条
								</div>
								<div
									className="top-info-right"
									onClick={this.openHelp.bind(this)}
								>
									如何使用证书？
								</div>
							</React.Fragment>
						)}
					</div>
					<div className="list-center">
						<TableBox
							headerList={this.renderHeader()}
							data={certificateList && certificateList.nodes}
							isLoading={isLoading}
						/>
					</div>
					<div className="list-footer">
						<FooterCtrl
							currentPage={page}
							pageSize={pagesize}
							pageChange={this.pageChange.bind(this)}
							total={certificateList && certificateList.total}
						/>
					</div>
				</div>
				{isShowDetail && (
					<Modal
						visible={isShowDetail}
						width={600}
						wrapClassName="certificate-detail-modal"
						// title={openDetailData && openDetailData.node_note}
						title={`编号:${openDetailData.node_note}`}
						onCancel={this.closeDetail.bind(this)}
						footer={null}
					>
						<div className="modal-content">
							<p>
								<label>计算机名称：</label>
								{/* DESKTOP-D0H4RIE */}
								{openDetailData && openDetailData.computer_name}
							</p>
							<p>
								<label>Windows版本：</label>
								{/* Windows 10专业版 */}
								{openDetailData && openDetailData.computer_os}
							</p>
							{/* <p>
								<label>系统类型：</label>
								64位操作系统，基于×64位的处理器
							</p> */}
							<p>
								<label>处理器：</label>
								{/* i5-7500 CPU @ 3.40GHz i5-7500 CPU @ 3.40GHz */}
								{openDetailData && openDetailData.cpu}
							</p>
							<p>
								<label>已安装的内存（RAM）：</label>
								{/* 8.00GB */}
								{openDetailData && openDetailData.ram}
							</p>
						</div>
					</Modal>
				)}
			</div>
		);
	}
}
