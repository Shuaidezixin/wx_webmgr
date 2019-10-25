import * as React from "react";
import { Checkbox, message } from "antd";
import "./index.less";

interface Props {
	getInitAction?: Function;
	updateInitAction?: Function;
}
interface State {
	initData: any;
	initArray: any[];
}

export default class InitPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		initData: {},
		initArray: []
	};
	componentDidMount() {
		this.getInit();
	}
	async getInit() {
		let { getInitAction } = this.props;
		if (getInitAction && typeof getInitAction === "function") {
			let res = await getInitAction();
			if (res && res.code == 200) {
				let data = res.data;
				let cont = data.initmobilesettings;
				let resData: any = {};
				let resArray: any[] = [];
				if (cont && cont.length > 0) {
					cont.map((v: any) => {
						if (!resData[v.type]) {
							resData[v.type] = [];
							resArray.push({
								type: v.type,
								typename: v.typename
							});
						}
						resData[v.type].push(v);
					});
				}
				this.setState({
					initArray: [...resArray],
					initData: { ...resData }
				});
			}
		}
	}
	async CheckBoxChange(type: string, idx: number, e: any) {
		let { initData } = this.state;
		let check = e.target.checked;
		if (initData[type][idx].initData == 0) {
			message.error("不可关闭");
			return;
		}
		let res = await this.props.updateInitAction({
			initmobilesettingid: initData[type][idx]._id
		});
		if (res && res.code == 200) {
			initData[type][idx].isauto = check;
			this.setState({
				initData: { ...initData }
			});
		}
	}
	render() {
		let { initArray, initData } = this.state;
		return (
			<div className="init-page">
				<div className="init-container">
					{initArray &&
						initArray.length > 0 &&
						initArray.map((item: any, idx: number) => {
							return (
								<div className="init-item" key={idx}>
									<div className="init-title">
										{item.typename}
									</div>
									<div className="init">
										{initData &&
											initData[item.type] &&
											initData[item.type].length > 0 &&
											initData[item.type].map(
												(v: any, i: number) => {
													return (
														<div
															className="checkbox"
															key={i}
														>
															<Checkbox
																checked={
																	v.isauto
																}
																onChange={this.CheckBoxChange.bind(
																	this,
																	item.type,
																	i
																)}
																disabled={
																	v.updatestatus ==
																	0
																}
															>
																{v && v.name}
															</Checkbox>
														</div>
													);
												}
											)}
									</div>
								</div>
							);
						})}
					{/* 
					<div className="init-item">
						<div className="init-title">导入程序</div>
						<div className="init">
							<div className="checkbox">
								<Checkbox>导入VXP</Checkbox>
							</div>
							<div className="checkbox">
								<Checkbox>导入VXP</Checkbox>
							</div>
							<div className="checkbox">
								<Checkbox>导入VXP</Checkbox>
							</div>
							<div className="checkbox">
								<Checkbox>导入VXP</Checkbox>
							</div>
						</div>
					</div> */}
				</div>
			</div>
		);
	}
}
