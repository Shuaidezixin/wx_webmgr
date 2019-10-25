import * as React from "react";
import * as Echarts from "echarts";
import "./index.less";

interface Props {
	data?: any;
	action?: Function;
}
interface State {}

export default class Pool extends React.PureComponent<Props, State> {
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
				this.initEchats(res.data.numberPooldaystatistics);
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
		let apply: any = [];
		let pass: any = [];
		let invalid: any = [];

		if (data && data.length > 0) {
			data.map((v: any) => {
				time.unshift(
					this.insertStr(this.insertStr(v.time, 4, "-"), 7, "-")
				);
				total.unshift(v.dayusednum);
				apply.unshift(v.dayapplytotal);
				pass.unshift(v.daypassnum);
				invalid.unshift(v.dayinvalidnumber);
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
						name: "使用",
						icon: "roundRect",
						textStyle: {
							padding: [3, 0, 0, 0]
						}
					},
					{
						name: "申请",
						icon: "roundRect",
						textStyle: {
							padding: [3, 0, 0, 0]
						}
					},
					{
						name: "通过",
						icon: "roundRect",
						textStyle: {
							padding: [3, 0, 0, 0]
						}
					},
					{
						name: "无效",
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
					name: "使用",
					data: total,
					type: "line",
					itemStyle: {
						color: "#FF9900"
					}
				},
				{
					name: "申请",
					data: apply,
					type: "line",
					itemStyle: {
						color: "#1890FF"
					}
				},
				{
					name: "通过",
					data: pass,
					type: "line",
					itemStyle: {
						color: "#33CC00"
					}
				},
				{
					name: "无效",
					data: invalid,
					type: "line",
					itemStyle: {
						color: "#FF0000"
					}
				}
			]
		};
		myChart.setOption(options);
	}
	render() {
		let { data } = this.props;
		return (
			<div className="pool-container">
				<div className="info">
					<div className="title">号池资源</div>
					<div className="info-item">总数:{data && data.total}</div>
					<div className="info-item">
						已使用:{data && data.usednum}
					</div>
					<div className="info-item">
						剩余:{data && data.nousednum}
					</div>
					<div className="info-item">
						无效:{data && data.invalidnumber}
					</div>
				</div>
				<div className="info">
					<div className="title">好友申请</div>
					<div className="info-item">
						总数:{data && data.applytotal}
					</div>
					<div className="info-item">通过:{data && data.passnum}</div>
					<div className="info-item">
						通过率:{data && data.passrate}
					</div>
				</div>
				<div className="info">
					<div className="title">昨日使用</div>
					<div className="info-item">
						使用:{data && data.dayusednum}
					</div>
					<div className="info-item">
						申请:{data && data.dayapplytotal}
					</div>
					<div className="info-item">
						通过:{data && data.daypassnum}
					</div>
					<div className="info-item">
						无效:{data && data.dayinvalidnumber}
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
