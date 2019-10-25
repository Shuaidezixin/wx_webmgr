import * as React from "react";
import { Modal } from "antd";
import Echarts from "echarts";
import DetailItem from "@component/detailitem";
import "./index.less";

interface Props {
	visible?: boolean;
	onCancel?: Function;
	targetID?: string;
	modalAccountDetail?: any;
	modalAccountDevice?: any;
	getModalAccountDetailAction?: Function;
	getModalAccountDeviceAction?: Function;
}
interface State {}

export default class Detail extends React.PureComponent<Props, State> {
	private MemoryChart: React.RefObject<HTMLDivElement>;
	private CpuChart: React.RefObject<HTMLDivElement>;
	private NetChart: React.RefObject<HTMLDivElement>;
	private memoryChart: any;
	private cpuChart: any;
	private netChart: any;
	private deviceTimer: any = null;
	constructor(props: Props) {
		super(props);
		this.MemoryChart = React.createRef();
		this.CpuChart = React.createRef();
		this.NetChart = React.createRef();
	}
	static readonly defaultProps: Props = {
		visible: true
	};
	componentDidMount() {
		this.getBaseInfo();
		setTimeout(() => {
			this.initMemory();
			this.initCpu();
			this.initNet();
			this.getDeviceInfo();
		}, 300);
	}
	getBaseInfo() {
		this.props.getModalAccountDetailAction({
			account_id: this.props.targetID
		});
	}
	componentWillUnmount() {
		clearTimeout(this.deviceTimer);
		this.deviceTimer = null;
	}
	get128Time(len: number) {
		let res: any = [];
		let time = new Date().getTime();
		for (let i = 0; i < len; i++) {
			res.unshift(time);
			time = time - 15;
		}
		return res;
	}
	async getDeviceInfo() {
		if (this.deviceTimer) {
			clearTimeout(this.deviceTimer);
			this.deviceTimer = null;
		}
		let res = await this.props.getModalAccountDeviceAction({
			account_id: this.props.targetID
		});
		if (res && res.code == 200) {
			let data = res.data;
			this.setMemory(data.mems);
			this.setCpu(data.cpus);
			this.setNet(data.networks);
			this.deviceTimer = setTimeout(() => {
				this.getDeviceInfo();
			}, 15000);
		} else {
			this.deviceTimer = setTimeout(() => {
				this.getDeviceInfo();
			}, 60000);
		}
	}
	initMemory() {
		let box: any = this.MemoryChart.current;
		if (box && !this.memoryChart) {
			this.memoryChart = Echarts.init(box);
			this.setMemory([]);
		}
	}
	initCpu() {
		let box: any = this.CpuChart.current;
		if (box && !this.cpuChart) {
			this.cpuChart = Echarts.init(box);
			this.setCpu([]);
		}
	}
	initNet() {
		let box: any = this.NetChart.current;
		if (box && !this.netChart) {
			this.netChart = Echarts.init(box);
			this.setNet([]);
		}
	}
	grid = {
		x: "50",
		y: "30",
		width: "90%",
		height: "80%"
	};
	yAxis = {
		type: "value",
		show: true,
		name: "利用率(%)",
		nameLocation: "end",
		axisLine: {
			show: false
		},
		boundaryGap: false,
		max: 100,
		min: 0,
		nameTextStyle: {
			padding: [0, 0, 0, 50],
			fontSize: 10,
			color: "#404040"
		}
	};
	getToolTip() {
		return {
			trigger: "axis",
			formatter: function(d: any) {
				return `<span>利用率:${d[0].value}%</span>`;
			}
		};
	}
	getSet(color: string) {
		return {
			axisLine: {
				lineStyle: {
					color: `rgba(${color},1)` //rgba(61, 165, 253,1)
				}
			},
			axisLabel: {
				lineStyle: {
					color: `rgba(${color},0.1)`
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: [`rgba(${color},0.2)`],
					width: 1,
					type: "solid"
				}
			}
		};
	}
	setMemory(data: number[] = []) {
		let x = this.get128Time(data.length);
		let options = {
			tooltip: this.getToolTip(),
			xAxis: {
				show: true,
				type: "category",
				boundaryGap: false,
				data: x,
				...this.getSet("61, 165, 253")
			},
			grid: this.grid,
			yAxis: {
				...this.yAxis,
				...this.getSet("61, 165, 253")
			},
			series: [
				{
					data: data.reverse(),
					type: "line",
					stack: "Mon",
					smooth: false,
					symbol: "none",
					lineStyle: {
						width: 1
					},
					itemStyle: {
						color: "rgba(61, 165, 253,1)"
					},
					areaStyle: {
						color: "rgba(61, 165, 253,0.1)"
					},
					animationDelay: function(idx: any) {
						return idx * 10;
					}
				}
			]
		};
		this.memoryChart.setOption(options);
	}
	setCpu(data: number[] = []) {
		let x = this.get128Time(data.length);
		let options = {
			tooltip: this.getToolTip(),
			xAxis: {
				show: true,
				type: "category",
				boundaryGap: false,
				data: x,
				...this.getSet("149, 40, 180")
			},
			grid: this.grid,
			yAxis: {
				...this.yAxis,
				...this.getSet("149, 40, 180")
			},
			series: [
				{
					data: data.reverse(),
					type: "line",
					stack: "Mon",
					symbol: "none",
					lineStyle: {
						width: 1
					},
					itemStyle: {
						color: "#9528B4"
					},
					areaStyle: {
						color: "rgba(149, 40, 180,0.1)"
					}
				}
			]
		};
		this.cpuChart.setOption(options);
	}
	setNet(data: number[] = []) {
		let x = this.get128Time(data.length);
		let options = {
			tooltip: {
				...this.getToolTip(),
				formatter: function(d: any) {
					return `<span>网速:${d[0].value}kb</span>`;
				}
			},
			xAxis: {
				show: true,
				type: "category",
				boundaryGap: false,
				data: x,
				...this.getSet("234, 166, 131")
			},
			grid: { ...this.grid, x: "50" },
			yAxis: {
				...this.yAxis,
				...this.getSet("234, 166, 131"),
				name: "网速(kb)",
				max: function(value: any) {
					return value.max + 20;
				}
			},
			series: [
				{
					data: data.reverse(),
					type: "line",
					stack: "Mon",
					symbol: "none",
					lineStyle: {
						width: 1
					},
					itemStyle: {
						color: "rgba(234, 166, 131,1)"
					},
					areaStyle: {
						color: "rgba(234, 166, 131,0.1)"
					}
				}
			]
		};
		this.netChart.setOption(options);
	}
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	getAge(time: string) {
		let date = new Date(time);
		let now = new Date();
		let times = now.getTime() - date.getTime();
		let d = times / (1000 * 60 * 60 * 24);
		return parseInt(d.toString()) + "天";
	}
	render() {
		let { visible, modalAccountDetail } = this.props;
		return (
			<Modal
				visible={visible}
				wrapClassName="account-detail-modal"
				width={1000}
				title="账户详情"
				onCancel={this.cancelClick.bind(this)}
				footer={null}
			>
				<div className="baseinfo">
					<DetailItem
						nameWidth={"80px"}
						labelName="编组"
						isBlock={true}
						content={
							modalAccountDetail && modalAccountDetail.group_name
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="手机编号"
						isBlock={true}
						content={
							modalAccountDetail && modalAccountDetail.note_mobile
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="账号"
						isBlock={true}
						content={
							modalAccountDetail && modalAccountDetail.login_user
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="登陆密码"
						isBlock={true}
						content={
							modalAccountDetail && modalAccountDetail.login_pass
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="支付密码"
						isBlock={true}
						content={
							modalAccountDetail &&
							modalAccountDetail.pay_password
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="人设"
						isBlock={true}
						content={
							modalAccountDetail &&
							modalAccountDetail.personal_desgin_name
						}
					/>
					{/* <DetailItem
						nameWidth={"80px"}
						labelName="标签"
						isBlock={true}
						content={
							modalAccountDetail && modalAccountDetail.is_star
								? "是"
								: "否"
						}
					/> */}
					<DetailItem
						nameWidth={"80px"}
						labelName="星标"
						isBlock={true}
						content={
							modalAccountDetail && modalAccountDetail.is_star
								? "是"
								: "否"
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="昵称"
						isBlock={true}
						content={
							modalAccountDetail && modalAccountDetail.nickname
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="性别"
						isBlock={true}
						content={
							<span>
								{modalAccountDetail && modalAccountDetail.sex}
								{/* {modalAccountDetail &&
									modalAccountDetail.sex == 1 &&
									"男"}
								{modalAccountDetail &&
									modalAccountDetail.sex == 2 &&
									"女"}
								{modalAccountDetail &&
									modalAccountDetail.sex != 2 &&
									modalAccountDetail.sex != 1 &&
									"未知"} */}
							</span>
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="地区"
						isBlock={true}
						content={
							<span>
								{modalAccountDetail &&
									modalAccountDetail.province}
								{modalAccountDetail && modalAccountDetail.city
									? `-${modalAccountDetail.city}`
									: ""}
							</span>
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="个性签名"
						isBlock={true}
						content={
							modalAccountDetail && modalAccountDetail.profile
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="备注"
						isBlock={true}
						content={
							modalAccountDetail &&
							modalAccountDetail.note_account
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="号龄"
						isBlock={true}
						content={
							modalAccountDetail &&
							this.getAge(modalAccountDetail.create_time)
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="粉丝数"
						isBlock={true}
						content={
							modalAccountDetail &&
							modalAccountDetail.fensi_cnt.toString()
						}
					/>
				</div>
				<div className="other-info">
					<DetailItem
						nameWidth={"80px"}
						labelName="手机型号"
						className="phone-info"
						content={
							modalAccountDetail &&
							modalAccountDetail.device_xinghao
						}
						isBlock={true}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="处理器"
						className="phone-info"
						content={
							modalAccountDetail && modalAccountDetail.device_cpu
						}
						isBlock={true}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="运行内存"
						className="phone-info"
						content={
							modalAccountDetail && modalAccountDetail.device_mem
						}
						isBlock={true}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="系统"
						className="phone-info"
						content={
							modalAccountDetail && modalAccountDetail.device_os
						}
						isBlock={true}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="内存利用率"
						className="phone-info"
						isBlock={true}
						content={
							<div
								className="chart-box memory"
								ref={this.MemoryChart}
							/>
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="CPU利用率"
						className="phone-info"
						isBlock={true}
						content={
							<div
								className="chart-box memory"
								ref={this.CpuChart}
							/>
						}
					/>
					<DetailItem
						nameWidth={"80px"}
						labelName="网络"
						className="phone-info"
						isBlock={true}
						content={
							<div
								className="chart-box memory"
								ref={this.NetChart}
							/>
						}
					/>
				</div>
			</Modal>
		);
	}
}
