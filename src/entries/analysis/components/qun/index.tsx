import * as React from "react";
import * as Echarts from "echarts";
import "./index.less";

interface Props {
	data?: any;
	action?: Function;
}
interface State {}

export default class Qun extends React.PureComponent<Props, State> {
	private chartsBox: React.RefObject<HTMLDivElement>;
	constructor(props: Props) {
		super(props);
		this.chartsBox = React.createRef();
	}
	componentDidMount() {
		this.init();
	}
	async init() {
		let { action } = this.props;
		if (action && typeof action === "function") {
			let res = await action();
			if (res && res.code == 200) {
				this.initEchats(res.data.groupfrienddaystatistics);
			}
		}
	}
	insertStr(soure: string, start: number, newStr: string): string {
		return soure.slice(0, start) + newStr + soure.slice(start);
	}
	initEchats(data: any) {
		if (!data) {
			return;
		}
		let time: any = [];
		let total: any = [];
		let passive: any = [];
		let active: any = [];
		if (data && data.length > 0) {
			data.map((v: any) => {
				time.unshift(
					this.insertStr(this.insertStr(v.time, 4, "-"), 7, "-")
				);
				total.unshift(v.total);
				passive.unshift(v.passive);
				active.unshift(v.active);
			});
		}

		var myChart = Echarts.init(this.chartsBox.current);
		let options: any = {
			grid: {
				left: "3%",
				right: "4%",
				bottom: "3%",
				top: "15%",
				containLabel: true
			},
			tooltip: {
				trigger: "axis"
			},
			legend: {
				left: "3%",
				data: [
					{
						name: "总数",
						icon: "roundRect",
						textStyle: {
							padding: [3, 0, 0, 0]
						}
					},
					{
						name: "创建",
						icon: "roundRect",
						textStyle: {
							padding: [3, 0, 0, 0]
						}
					},
					{
						name: "加入",
						icon: "roundRect",
						textStyle: {
							padding: [3, 0, 0, 0]
						}
					}
				]
			},
			xAxis: {
				type: "category",
				boundaryGap: false,
				data: time
			},
			yAxis: {
				type: "value",
				nameLocation: "end",
				name: "单位(个)",
				splitNumber: 1
			},
			series: [
				{
					name: "总数",
					data: total,
					type: "line",
					itemStyle: {
						color: "#FF9900"
					}
				},
				{
					name: "创建",
					data: active,
					type: "line",
					itemStyle: {
						color: "#FF0000"
					}
				},
				{
					name: "加入",
					data: passive,
					type: "line",
					itemStyle: {
						color: "#33CC00"
					}
				}
			]
		};
		myChart.setOption(options);
	}
	render() {
		let { data } = this.props;
		return (
			<div className="qun-container ">
				<div className="info">
					<div className="title">群数量</div>
					<div className="info-item">总数:{data && data.total}</div>
					<div className="info-item">
						创建的群:{data && data.active}
					</div>
					<div className="info-item">
						加入的群:{data && data.passive}
					</div>
				</div>
				<div className="info">
					<div className="title">昨日群</div>
					<div className="info-item">
						总数:{data && data.daytotal}
					</div>
					<div className="info-item">
						创建:{data && data.dayactive}
					</div>
					<div className="info-item">
						加入:{data && data.daypassive}
					</div>
				</div>

				<div className="chat-box">
					<div className="chat-title">数据统计</div>
					<div className="chat-container" ref={this.chartsBox} />
				</div>
			</div>
		);
	}
}
