import * as React from "react";
import {
	Input,
	Radio,
	Icon,
	Button,
	Switch,
	Select,
	Modal,
	InputNumber,
	message
} from "antd";
import TableBox from "@component/tablebox";
import DetailItem from "@component/detailitem";
import debounce from "lodash/debounce";
import "./index.less";
const Option = Select.Option;
interface Props {
	settingAddFriend?: any;
	getSettingAddFriendAction?: Function;
	updateSettingAddFriendAction?: Function;
	extensionScriptList?: any;
	getExtensionScriptAction?: Function;
}
interface State {
	automessage: boolean;
	examinetype: number;
	examinewords: any[];
	greetwords: any[];
	_id: string;
	limitationusage: number;
	autoaddinsidefriend: boolean;
	autoaddinsidefriendnum: string;
	shieldinsidefriendmessage: boolean;
	relieveinsidefriend: boolean;
	auto_script: boolean;
	extensionscript: any;
}

export default class AddFriend extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.scriptSearch = debounce(this.scriptSearch, 1000);
	}
	readonly state: State = {
		automessage: false,
		examinetype: 0,
		examinewords: [],
		greetwords: [],
		_id: "",
		limitationusage: 0,
		autoaddinsidefriend: false,
		autoaddinsidefriendnum: "3-5",
		shieldinsidefriendmessage: false,
		relieveinsidefriend: false,
		auto_script: false,
		extensionscript: []
	};
	componentDidMount() {
		this.getAddFriend();
		this.getList();
	}
	// 获取剧本列表
	async getList(key?: string) {
		let params: any = {
			page: 1,
			pagesize: 20
		};
		if (key && key.trim().length > 0) {
			params.keyword = key.trim();
		}
		let res = await this.props.getExtensionScriptAction(params);
	}
	// 获取添加好友
	async getAddFriend() {
		let res = await this.props.getSettingAddFriendAction();
		if (res && res.code == 200) {
			let data = res.data;
			this.setState({
				...data,
				automessage: data.automessage == 0 ? false : true,
				// autoaddinsidefriend:
				// 	data.autoaddinsidefriend == 0 ? false : true,
				shieldinsidefriendmessage:
					data.shieldinsidefriendmessage == 0 ? false : true,
				relieveinsidefriend:
					data.relieveinsidefriend == 0 ? false : true,
				auto_script: data.auto_script == 0 ? false : true,
				autoaddinsidefriendnum: `${
					data.autoaddinsidefriendnum.split("-")[0]
				}-${data.autoaddinsidefriendnum.split("-")[1]}`,
				extensionscript: {
					key:
						data.extensionscript_id &&
						data.extensionscript_id.length > 0
							? data.extensionscript_id
							: "0",
					label:
						data.extensionscript_name &&
						data.extensionscript_name.length > 0
							? data.extensionscript_name
							: "随机剧本"
				}
			});
		}
	}
	changeContent(type: string, idx: number, e: any) {
		let state: any = this.state;
		let data = state[type];
		data[idx] = e.target.value;
		let set: any = {
			[type]: [...data]
		};
		this.setState(set);
	}
	deleteArray(type: string, idx: number) {
		let state: any = this.state;
		let data = state[type];
		data.splice(idx, 1);
		let set: any = {
			[type]: [...data]
		};
		this.setState(set, () => {
			this.updateAddFriend();
		});
	}
	inputBlur() {
		this.updateAddFriend();
	}
	viliHeader() {
		return [
			{
				name: "序号",
				width: 60,
				class: "tc",
				render: (item: any, idx: number) => {
					return idx + 1;
				}
			},
			{
				name: "内容",
				class: "nopadding",
				render: (item: any, idx: number) => {
					return (
						<input
							className="content-input"
							type="text"
							placeholder="请输入内容"
							value={item}
							onChange={this.changeContent.bind(
								this,
								"examinewords",
								idx
							)}
							onBlur={this.inputBlur.bind(this)}
						/>
					);
				}
			},
			{
				name: "",
				width: 60,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<Icon
							type="close"
							className="close"
							onClick={this.deleteArray.bind(
								this,
								"examinewords",
								idx
							)}
						/>
					);
				}
			}
		];
	}
	viliHeader1() {
		return [
			{
				name: "序号",
				width: 60,
				class: "tc",
				render: (item: any, idx: number) => {
					return idx + 1;
				}
			},
			{
				name: "内容",
				class: "nopadding",
				render: (item: any, idx: number) => {
					return (
						<input
							className="content-input"
							type="text"
							placeholder="请输入内容"
							value={item}
							onBlur={this.inputBlur.bind(this)}
							onChange={this.changeContent.bind(
								this,
								"greetwords",
								idx
							)}
						/>
					);
				}
			},
			{
				name: "",
				width: 60,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<Icon
							type="close"
							className="close"
							onClick={this.deleteArray.bind(
								this,
								"greetwords",
								idx
							)}
						/>
					);
				}
			}
		];
	}
	checkChange(key: string, e: any) {
		let { automessage, auto_script } = this.state;
		let set: any = {
			[key]: e
		};
		switch (key) {
			case "examinetype":
				set[key] = e.target.value;
				break;
			case "auto_script":
				set[key] = e;
				if (automessage) {
					set["automessage"] = false;
				}
				break;
			case "automessage":
				set[key] = e;
				if (auto_script) {
					set["auto_script"] = false;
				}
				break;
			default:
				break;
		}

		this.setState(
			{
				...set
			},
			() => {
				this.updateAddFriend();
			}
		);
	}
	async updateAddFriend() {
		let {
			automessage,
			examinetype,
			examinewords,
			greetwords,
			_id,
			limitationusage,
			autoaddinsidefriend,
			autoaddinsidefriendnum,
			shieldinsidefriendmessage,
			relieveinsidefriend,
			auto_script,
			extensionscript
		} = this.state;
		let examinewordsArray = examinewords.filter((v: string) => {
			if (v && v.trim().length > 0) {
				return v;
			}
		});
		let greetwordsArray = greetwords.filter((v: string) => {
			if (v && v.trim().length > 0) {
				return v;
			}
		});
		// if (autoaddinsidefriend) {
		// 	let arr = autoaddinsidefriendnum.split("-");
		// 	if (arr && arr.length == 2) {
		// 		if (Number(arr[1]) <= Number(arr[0])) {
		// 			message.error("好友数量前面的数字必须小于后面的数字");
		// 			return;
		// 		}
		// 	} else {
		// 		console.log(arr);
		// 		message.error("好友数量不能为空");
		// 		return;
		// 	}
		// }
		let arr = autoaddinsidefriendnum.split("-");
		if (arr && arr.length == 2) {
			if (Number(arr[1]) < Number(arr[0])) {
				message.error("好友数量前面的数字必须小于等于后面的数字");
				return;
			}
		} else {
			console.log(arr);
			message.error("好友数量不能为空");
			return;
		}

		let res = await this.props.updateSettingAddFriendAction({
			addfriendsetting_id: _id,
			examinetype,
			limitationusage,
			examinewords: examinewordsArray.join("XSL"),
			automessage: automessage ? 1 : 0,
			greetwords: greetwordsArray.join("XSL"),
			//autoaddinsidefriend: autoaddinsidefriend ? 1 : 0,
			autoaddinsidefriendnum,
			shieldinsidefriendmessage: shieldinsidefriendmessage ? 1 : 0,
			relieveinsidefriend: relieveinsidefriend ? 1 : 0,
			auto_script: auto_script ? 1 : 0,
			extensionscript_id:
				extensionscript &&
				extensionscript.key.length > 0 &&
				extensionscript.key != "0"
					? extensionscript.key
					: "",
			extensionscript_name:
				extensionscript &&
				extensionscript.label.length > 0 &&
				extensionscript.label != "0"
					? extensionscript.label
					: ""
		});
	}
	addArray(type: any) {
		let state: any = this.state;
		let data = state[type];

		data.push("");
		let set: any = {
			[type]: [...data]
		};
		this.setState({ ...set });
	}
	addFriendNumber(idx: number, e: any) {
		let { autoaddinsidefriendnum } = this.state;
		if (!autoaddinsidefriendnum || autoaddinsidefriendnum.length <= 0) {
			autoaddinsidefriendnum = "0-0";
		}
		let arr = autoaddinsidefriendnum.split("-");
		arr[idx] = e;
		this.setState({
			autoaddinsidefriendnum: arr.join("-")
		});
	}
	addFriendNumberBlur() {
		this.updateAddFriend();
	}
	scriptSearch(e: string) {
		this.getList(e);
	}
	render() {
		let {
			automessage,
			examinetype,
			examinewords,
			greetwords,
			limitationusage,
			autoaddinsidefriend,
			autoaddinsidefriendnum,
			shieldinsidefriendmessage,
			relieveinsidefriend,
			auto_script,
			extensionscript
		} = this.state;
		let { extensionScriptList } = this.props;
		let extensionScriptArray: any[] = [{ key: "0", label: "随机剧本" }];
		console.log(extensionScriptList);
		if (
			extensionScriptList &&
			extensionScriptList.resoureinsidescripts &&
			extensionScriptList.resoureinsidescripts.length > 0
		) {
			extensionScriptList.resoureinsidescripts.map((v: any) => {
				console.log(11);
				extensionScriptArray.push({
					key: v.id,
					label: v.title
				});
			});
		}
		console.log(extensionScriptArray);
		return (
			<div className="setting-addfriend">
				<div className="setting-addfriend-container">
					<div className="item-title">添加好友验证语</div>
					<div className="item-content">
						<Radio.Group
							name="radiogroup"
							className="radio-group"
							value={examinetype}
							onChange={this.checkChange.bind(
								this,
								"examinetype"
							)}
						>
							<div className="item">
								<Radio value={0}>使用默认验证语</Radio>
							</div>
							<div className="item">
								<Radio value={1}>使用自定义验证语</Radio>
							</div>
						</Radio.Group>
						<TableBox
							headerList={this.viliHeader()}
							data={examinewords}
							isFullPage={false}
						/>
						<Button
							className="addbtn"
							type="primary"
							onClick={this.addArray.bind(this, "examinewords")}
						>
							<Icon type="plus" />
						</Button>
					</div>
					<div className="item-title">添加同意</div>
					<div className="item-content">
						<div className="isopen-item">
							<Switch
								checked={automessage}
								onChange={this.checkChange.bind(
									this,
									"automessage"
								)}
							/>
							<div className="txt">添加好友同意后立即发消息</div>
						</div>
						{/* <DetailItem
							labelName="添加好友同意后立即发消息"
							nameWidth="200px"
							isBlock={true}
							content={
								<Switch
									checked={automessage}
									onChange={this.checkChange.bind(
										this,
										"automessage"
									)}
								/>
							}
						/> */}
						<DetailItem
							labelName="添加好友同意后立即发消息内容"
							nameWidth="200px"
							isBlock={true}
							content={"  "}
						/>
						<TableBox
							headerList={this.viliHeader1()}
							data={greetwords}
							isFullPage={false}
						/>
						<Button
							className="addbtn"
							type="primary"
							onClick={this.addArray.bind(this, "greetwords")}
						>
							<Icon type="plus" />
						</Button>
						<div
							className="isopen-item"
							style={{ marginTop: "10px" }}
						>
							<Switch
								checked={auto_script}
								onChange={this.checkChange.bind(
									this,
									"auto_script"
								)}
							/>
							<div className="txt">使用推广剧本</div>
						</div>
						<DetailItem
							labelName="选择剧本"
							nameWidth="200px"
							isBlock={true}
							content={
								<Select
									className="select"
									value={extensionscript}
									onChange={this.checkChange.bind(
										this,
										"extensionscript"
									)}
									labelInValue={true}
									showSearch={true}
									onSearch={this.scriptSearch.bind(this)}
								>
									{extensionScriptArray &&
										extensionScriptArray.length > 0 &&
										extensionScriptArray.map(
											(v: any, i: number) => {
												return (
													<Option
														value={v.key}
														key={i}
													>
														{v.label}
													</Option>
												);
											}
										)}
								</Select>
							}
						/>
					</div>
					<div className="item-title">微信号使用</div>
					<div className="item-content">
						<DetailItem
							labelName="添加微信号复用次数限制"
							nameWidth="200px"
							isBlock={true}
							content={
								<Select
									className="select"
									value={limitationusage}
									onChange={this.checkChange.bind(
										this,
										"limitationusage"
									)}
								>
									<Option value={0}>不限制</Option>
									<Option value={1}>1次</Option>
									<Option value={2}>2次</Option>
									<Option value={3}>3次</Option>
									<Option value={4}>4次</Option>
									<Option value={5}>5次</Option>
								</Select>
							}
						/>
					</div>
					<div className="item-title">添加内部好友</div>
					<div className="item-content">
						{/* <div className="isopen-item">
							<Switch
								checked={autoaddinsidefriend}
								onChange={this.checkChange.bind(
									this,
									"autoaddinsidefriend"
								)}
							/>
							<div className="txt">自动添加系统内部好友</div>
						</div> */}
						<div className="addnumber">
							<div>每个添加内部好友数量</div>
							<InputNumber
								className="input"
								value={
									autoaddinsidefriendnum &&
									Number(autoaddinsidefriendnum.split("-")[0])
								}
								onChange={this.addFriendNumber.bind(this, 0)}
								onBlur={this.addFriendNumberBlur.bind(this)}
								min={0}
							/>
							~
							<InputNumber
								className="input"
								value={
									autoaddinsidefriendnum &&
									Number(autoaddinsidefriendnum.split("-")[1])
								}
								onChange={this.addFriendNumber.bind(this, 1)}
								onBlur={this.addFriendNumberBlur.bind(this)}
								min={0}
							/>
							<div>个</div>
						</div>
						<div className="isopen-item">
							<Switch
								checked={shieldinsidefriendmessage}
								onChange={this.checkChange.bind(
									this,
									"shieldinsidefriendmessage"
								)}
							/>
							<div className="txt">
								内部好友消息免打扰(web后台不显示此类消息)
							</div>
						</div>
						<div className="isopen-item">
							<Switch
								checked={relieveinsidefriend}
								onChange={this.checkChange.bind(
									this,
									"relieveinsidefriend"
								)}
							/>
							<div className="txt">
								自动解除与被封账号的好友关系
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
