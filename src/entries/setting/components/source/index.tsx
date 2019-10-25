import * as React from "react";
import { Switch, Select } from "antd";
import DetailItem from "@component/detailitem";
import "./index.less";
const Option = Select.Option;

interface Props {
	settingSource?: any;
	getSettingSourceAction?: Function;
	updateSettingSourceAction?: Function;
}
interface State {
	clearcycle: number;
	distributiontype: number;
	needexamine: boolean;
	id: string;
}

export default class Source extends React.PureComponent<Props, State> {
	readonly state: State = {
		clearcycle: 0,
		distributiontype: 0,
		needexamine: false,
		id: ""
	};
	componentDidMount() {
		this.getSource();
	}
	async getSource() {
		let res = await this.props.getSettingSourceAction();
		if (res && res.code == 200) {
			let data = res.data;
			this.setState({
				clearcycle: data.clearcycle,
				distributiontype: data.distributiontype,
				needexamine: data.needexamine == 0 ? false : true,
				id: data._id
			});
		}
	}
	selectChange(key: string, e: any) {
		let set: any = {};
		set = {
			[key]: e
		};
		// if (key == "needexamine") {

		// } else {
		// 	set = {
		// 		[key]: e.target.value
		// 	};
		// }

		this.setState(set, () => {
			let { id, needexamine, distributiontype, clearcycle } = this.state;
			this.props.updateSettingSourceAction({
				resource_setting_id: id,
				needexamine: needexamine ? 1 : 0,
				distributiontype,
				clearcycle
			});
		});
	}
	render() {
		let { clearcycle, distributiontype, needexamine } = this.state;
		return (
			<div className="setting-source">
				<div className="item-title">素材配置</div>
				<div className="item-content">
					<DetailItem
						labelName="爬取素材入库审核"
						nameWidth="200px"
						isBlock={true}
						className="source-item"
						content={
							<Switch
								checked={needexamine}
								onChange={this.selectChange.bind(
									this,
									"needexamine"
								)}
							/>
						}
					/>
					<DetailItem
						labelName="爬取素材自动分发"
						nameWidth="200px"
						isBlock={true}
						className="source-item"
						content={
							<Select
								className="select"
								value={distributiontype}
								onChange={this.selectChange.bind(
									this,
									"distributiontype"
								)}
							>
								<Option key={0} value={0}>
									关闭
								</Option>
								<Option key={1} value={1}>
									按标签分发
								</Option>
								<Option key={2} value={2}>
									随机分发
								</Option>
							</Select>
						}
					/>
					<DetailItem
						labelName="时效性素材清理周期"
						nameWidth="200px"
						isBlock={true}
						className="source-item"
						content={
							<Select
								className="select"
								value={clearcycle}
								onChange={this.selectChange.bind(
									this,
									"clearcycle"
								)}
							>
								<Option key={0} value={0}>
									关闭
								</Option>
								<Option key={1} value={1}>
									1天
								</Option>
								<Option key={3} value={3}>
									3天
								</Option>
								<Option key={7} value={7}>
									7天
								</Option>
								<Option key={15} value={15}>
									15天
								</Option>
								<Option key={30} value={30}>
									30天
								</Option>
							</Select>
						}
					/>
				</div>
			</div>
		);
	}
}
