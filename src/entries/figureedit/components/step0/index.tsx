import * as React from "react";
import { TimePicker, Cascader, Icon, Switch } from "antd";
import InputBox from "@component/inputbox";
import "./index.less";
import * as moment from "moment";

interface Props {
	provincesList?: any;
	cityList?: any;
	getProvincesListAction?: Function;
	getCityListAction?: Function;
	data?: any;
	onChange?: Function;
}
interface State {
	ageList: any[];
	provincesList: any;
}

export default class Step0 extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		ageList: [],
		provincesList: []
	};
	componentDidMount() {
		this.initAge();
		this.initArea();
	}
	// 初始化地区
	initArea() {
		this.props
			.getProvincesListAction()
			.then((res: any) => {
				this.setState({
					provincesList: this.props.provincesList
				});
			})
			.then(() => {
				if (
					this.props.data &&
					this.props.data.areaArr &&
					this.props.data.areaArr[0]
				) {
					this.props
						.getCityListAction({ p: this.props.data.areaArr[0] })
						.then((city: any) => {
							let list: any = [];
							if (city && city.data && city.data.sub_provinces) {
								for (let key in city.data.sub_provinces) {
									list.push({
										label: city.data.sub_provinces[key],
										value: key
									});
								}
							}
							let d = this.state.provincesList;

							for (
								let i = 0;
								i < this.state.provincesList.length;
								i++
							) {
								if (
									d[i]["value"] == this.props.data.areaArr[0]
								) {
									d[i].children = list;
									break;
								}
							}

							this.setState({
								provincesList: [...d]
							});
						});
				}
			});
	}
	// 初始化年龄
	initAge() {
		let res = [];
		for (let i = 1; i < 80; i++) {
			res.push({
				key: i,
				label: i
			});
		}
		this.setState({
			ageList: res
		});
	}
	// 获取城市
	async loadData(selectedOptions: any) {
		const targetOption = selectedOptions[selectedOptions.length - 1];
		targetOption.loading = true;
		let city = await this.props.getCityListAction({
			p: targetOption.value
		});
		targetOption.loading = false;
		if (city && city.code == 200) {
			let list: any = [];
			if (city && city.data && city.data.sub_provinces) {
				for (let key in city.data.sub_provinces) {
					list.push({
						label: city.data.sub_provinces[key],
						value: key
					});
				}
			}
			targetOption.children = list;
		}
		this.setState({
			provincesList: [...this.state.provincesList]
		});
	}
	areaChange(value: any, selectedOptions: any) {
		this.props.onChange({
			type: "areaArr",
			value: value,
			valueChina: selectedOptions
		});
	}
	inputChange(type: string, e: any) {
		this.props.onChange({
			type: type,
			value: e
		});
	}
	switchChange(type: string, e: any) {
		this.props.onChange({
			type: type,
			value: e
		});
	}
	activeTimeChange(type: any, e: any) {
		let propTime = this.props.data.active_time.split("_");
		let t = e ? e.format("HH") : undefined;
		let time =
			type == "start" ? t + "_" + propTime[1] : propTime[0] + "_" + t;
		this.props.onChange({
			type: "active_time",
			value: time
		});
	}
	public render() {
		let { ageList, provincesList } = this.state;
		let { data } = this.props;

		return (
			<div>
				<InputBox
					labelName="名称"
					value={data && data.name}
					onChange={this.inputChange.bind(this, "name")}
					isRequired={true}
				/>
				<InputBox labelName="活跃时间" isRequired={true}>
					<TimePicker
						format="HH"
						value={
							data &&
							data.active_time &&
							data.active_time.split("_")[0] != "undefined"
								? moment(data.active_time.split("_")[0], "HH")
								: null
						}
						onChange={this.activeTimeChange.bind(this, "start")}
					/>
					<span>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span>
					<TimePicker
						format="HH"
						value={
							data &&
							data.active_time &&
							data.active_time.split("_")[1] != "undefined"
								? moment(data.active_time.split("_")[1], "HH")
								: null
						}
						onChange={this.activeTimeChange.bind(this, "end")}
					/>
					<Icon
						type="question-circle"
						style={{
							fontSize: "20px",
							color: "#a4a4a4",
							marginLeft: "10px"
						}}
						title="在活跃期间，微信执行的自动任务会比非活跃时间多"
					/>
				</InputBox>
				<InputBox
					labelName="描述"
					type="textarea"
					flexTop={true}
					value={data && data.desc}
					onChange={this.inputChange.bind(this, "desc")}
				/>
				<InputBox
					labelName="性别"
					type="select"
					optionArr={[
						// { label: "请选择", key: 0 },
						{ label: "男", key: 1 },
						{ label: "女", key: 2 }
					]}
					value={data && data.sex}
					onChange={this.inputChange.bind(this, "sex")}
				/>
				<InputBox
					labelName="年龄"
					type="select"
					optionArr={ageList}
					value={data && data.age}
					onChange={this.inputChange.bind(this, "age")}
				/>
				<InputBox labelName="地区">
					<Cascader
						placeholder="请选择地区"
						style={{ width: "100%" }}
						options={provincesList}
						loadData={this.loadData.bind(this)}
						onChange={this.areaChange.bind(this)}
						changeOnSelect={true}
						value={data && data.areaArr}
					/>
				</InputBox>
				<InputBox
					labelName="职业"
					value={data && data.profession}
					onChange={this.inputChange.bind(this, "profession")}
				/>
				<InputBox labelName="自动添加内部好友">
					<Switch
						checked={data && data.autoaddinsidefriend}
						onChange={this.switchChange.bind(
							this,
							"autoaddinsidefriend"
						)}
					/>
				</InputBox>
			</div>
		);
	}
}
