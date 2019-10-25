import * as React from "react";
import * as Echarts from "echarts";
import "./index.less";

interface Props {
	data?: any;
	action?: Function;
}
interface State {}

export default class Wechat extends React.PureComponent<Props, State> {
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
				let data = res.data;
				this.initEchats(data.dayaccountstatistics);
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
		let todaycloseaccount: any = [];
		let closeaccountrate: any = [];
		if (data && data.length > 0) {
			data.map((v: any) => {
				time.unshift(
					this.insertStr(this.insertStr(v.time, 4, "-"), 7, "-")
				);
				total.unshift(v.total);
				todaycloseaccount.unshift(v.todaycloseaccount);
				closeaccountrate.unshift(v.closeaccountrate);
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
				trigger: "axis",
				formatter: function(d: any) {
					return `<span>时间：${d[0].name}</span><br />
					<span>
					<i class="circle" style="background:${d[0].color}"></i>总数：${d[0].data}
					</span><br />
					<span>
					<i class="circle"  style="background:${d[1].color}"></i>封号：${d[1].data}
					</span><br />
					<span>
					<i class="circle"  style="background:${d[2].color}"></i>封号率：${d[2].data}%
					</span>
					`;
				}.bind(this)
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
						name: "封号",
						icon: "roundRect",
						textStyle: {
							padding: [3, 0, 0, 0]
						}
					},
					{
						name: "封号率",
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
				name: "单位(个)"
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
					name: "封号",
					data: todaycloseaccount,
					type: "line",
					itemStyle: {
						color: "#FF0000"
					}
				},
				{
					name: "封号率",
					data: closeaccountrate,
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
			<div className="wechat-container ">
				<div className="info">
					<div className="title">微信账号</div>
					<div className="info-item">总数:{data && data.total}</div>
					<div className="info-item">
						封号:{data && data.closeaccount}
					</div>
					<div className="info-item">
						昨日封号:{data && data.todaycloseaccount}
					</div>
					<div className="info-item">
						封号率:
						{data &&
							(data.todaycloseaccount / data.total) * 100 + "%"}
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
