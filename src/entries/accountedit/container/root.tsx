import * as React from "react";
import InputBox from "@component/inputbox";
import { Checkbox, Switch, Button, message } from "antd";
import debounce from "lodash/debounce";
import Toast from "@component/toast";
import "./index.less";
interface Props {
	accountDetail?: any;
	getAccountDetailAction?: Function;
	tagList?: any;
	getTagListAction?: Function;
	getFigureListAction?: Function;
	updateAccountDetailAction?: Function;
	clearTagListAction?: Function;
	getCharaterAction?: Function;
	characterList?: any;
}
interface State {
	id: string;
	tags: any;
	tags_desc: any;
	login_user: string;
	login_pass: string;
	pay_password: string;
	is_star: boolean;
	group_name: any;
	note_account: any;
	note_mobile: any;
	tagsList: any;
	character: any;
	isGetTag: boolean;
	isGetCharacter: boolean;
	wechat_source: string;
}

export default class Root extends React.PureComponent<Props, State> {
	private debounceTag: any = null;
	private debounceFigure: any = null;
	constructor(props: any) {
		super(props);
		//this.getTagList1 = debounce(this.getTagList1.bind(this), 200);
		this.getCharacter = debounce(this.getCharacter.bind(this), 200);
	}
	readonly state: State = {
		id: "",
		tags: null,
		tags_desc: null,
		tagsList: null,
		character: null,
		login_user: "",
		login_pass: "",
		pay_password: "",
		is_star: false,
		group_name: "",
		note_account: "",
		note_mobile: "",
		isGetTag: false,
		isGetCharacter: false,
		wechat_source: ""
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "账号编辑");
		this.getCharacter();
		//this.getTagList1();
		this.getDetail();
		window.Util.forbidAutoComplete();
	}
	componentWillUnmount() {
		this.props.clearTagListAction();
	}
	// 账号回填
	async getDetail() {
		let id = window.sessionStorage.getItem("accountID");
		if (id) {
			let res = await this.props.getAccountDetailAction({ user_id: id });
			if (res && res.code == 200) {
				let data = res.data;
				let set: any = {
					...data
				};
				// let tagList: any = [];
				// if (data.tags && data.tags.length > 0) {
				// 	data.tags.map((item: any, idx: number) => {
				// 		tagList.push({ key: item, label: data.tags_desc[idx] });
				// 	});
				// }
				// set.tagsList = [...tagList];
				set.character = {
					label: data.personal_desgin_name,
					key: data.personal_desgin_id
				};
				this.setState(set);
			}
		}
	}
	selectTag(value: any) {
		this.setState({
			tagsList: value
		});
	}
	// async getTagList1(word?: string) {
	// 	if (this.debounceTag) {
	// 		clearTimeout(this.debounceTag);
	// 		this.debounceTag = null;
	// 	}
	// 	this.setState({
	// 		isGetTag: true
	// 	});
	// 	try {
	// 		await this.props.getTagListAction({
	// 			page: 1,
	// 			keyword: word ? word : ""
	// 		});
	// 	} finally {
	// 		this.setState({
	// 			isGetTag: false
	// 		});
	// 	}
	// }

	//选择人设
	selectCharacter(value: any) {
		this.setState({
			character: value
		});
	}
	// 获取人设列表
	async getCharacter(word?: string) {
		this.setState({
			isGetCharacter: true
		});
		try {
			await this.props.getCharaterAction({
				page: 1,
				pagesize: 30,
				keyword: word ? word : ""
			});
		} finally {
			this.setState({
				isGetCharacter: false
			});
		}
	}
	// 保存按钮
	async updateClick() {
		let {
			tagsList,
			character,
			login_user,
			login_pass,
			pay_password,
			note_account,
			note_mobile,
			is_star,
			id,
			wechat_source
		} = this.state;
		// if (!login_user || login_user.trim().length <= 0) {
		// 	message.error("登录账号不能为空");
		// 	return;
		// }
		// if (!login_pass || login_pass.trim().length <= 0) {
		// 	message.error("登录密码不能为空");
		// 	return;
		// }
		// if (!figure) {
		// 	message.error("形象不能为空");
		// 	return;
		// }
		let params: any = {
			id,
			login_user,
			login_pass,
			pay_password,
			is_star,
			note_mobile,
			note_account,
			personal_desgin_id: character.key,
			personal_desgin_name: character.label,
			wechat_source
		};
		// let tags: any = [],
		// 	tags_desc: any = [];
		// if (tagsList && tagsList.length > 0) {
		// 	tagsList.map((item: any) => {
		// 		tags.push(item.key);
		// 		tags_desc.push(item.label);
		// 	});
		// 	params.tags = tags;
		// 	params.tags_desc = tags_desc;
		// }
		let loading = Toast.loading("正在保存", 0);
		let res = await this.props.updateAccountDetailAction({
			user_obj: JSON.stringify(params)
		});
		loading.close();
		if (!res || res.code != 200) {
			return;
		} else {
			message.success("修改成功");
			setTimeout(() => {
				window.appHistory.replace("/account");
			}, 1500);
		}
	}
	render() {
		let { tagList, accountDetail, characterList } = this.props;
		let {
			tags,
			tags_desc,
			tagsList,
			character,
			login_user,
			login_pass,
			pay_password,
			is_star,
			group_name,
			note_mobile,
			note_account,
			isGetTag,
			isGetCharacter,
			wechat_source
		} = this.state;
		let tagOption: any = [];
		let characterOption: any = [];
		if (tagList && tagList.tags && tagList.tags.length > 0) {
			tagList.tags.map((item: any) => {
				tagOption.push({
					key: item.tag_id,
					label: item.tag_name
				});
			});
		}
		if (
			characterList &&
			characterList.personaldesgins &&
			characterList.personaldesgins.length > 0
		) {
			characterList.personaldesgins.map((item: any) => {
				characterOption.push({
					key: item._id,
					label: item.title
				});
			});
		}
		console.log(accountDetail);
		return (
			<div className="accountedit-page">
				<div className="accountedit-container">
					<div className="title">
						<div className="title-text">账号编辑</div>
						<Button
							type="primary"
							onClick={this.updateClick.bind(this)}
						>
							保存
						</Button>
					</div>
					<div className="accountedit-cont">
						{/* <InputBox labelName="编组" /> */}
						<InputBox
							labelName="手机编号"
							value={note_mobile}
							onChange={window.Util.InputChange.bind(
								this,
								"note_mobile"
							)}
						/>
						<InputBox
							labelName="账号"
							value={login_user}
							onChange={window.Util.InputChange.bind(
								this,
								"login_user"
							)}
						/>
						<InputBox
							labelName="登录密码"
							isRequired={true}
							value={login_pass}
							onChange={window.Util.InputChange.bind(
								this,
								"login_pass"
							)}
						/>
						<InputBox
							labelName="支付密码"
							// type="password"
							value={pay_password}
							onChange={window.Util.InputChange.bind(
								this,
								"pay_password"
							)}
						/>

						<InputBox
							labelName="人设"
							isRequired={true}
							type="select"
							optionArr={characterOption}
							showSearch={true}
							isFetch={isGetCharacter}
							onSearch={this.getCharacter.bind(this)}
							onChange={this.selectCharacter.bind(this)}
							labelInValue={true}
							value={character}
						/>
						{/* <InputBox
							key={tags}
							labelName="标签"
							type="select"
							optionArr={tagOption}
							showSearch={true}
							isFetch={isGetTag}
							onSearch={this.getTagList1.bind(this)}
							onChange={this.selectTag.bind(this)}
							labelInValue={true}
							value={tagsList}
							multiple={true}
							mode="multiple"
						/> */}
						<InputBox labelName="星标">
							<Checkbox
								checked={is_star}
								onChange={window.Util.InputChange.bind(
									this,
									"is_star"
								)}
							>
								<span>设置为星标</span>
							</Checkbox>
						</InputBox>
						<InputBox labelName="昵称">
							<div>
								{accountDetail &&
								accountDetail.nickname &&
								accountDetail.nickname.length > 0
									? accountDetail.nickname
									: "--"}
							</div>
						</InputBox>
						<InputBox labelName="性别">
							<span>{accountDetail && accountDetail.sex}</span>
						</InputBox>
						<InputBox labelName="地区">
							{accountDetail && accountDetail.province}
							{accountDetail && accountDetail.city
								? `-${accountDetail.city}`
								: ""}
						</InputBox>
						<InputBox labelName="个性签名">
							<div>
								{accountDetail &&
								accountDetail.profile &&
								accountDetail.profile.length > 0
									? accountDetail.profile
									: "--"}
							</div>
						</InputBox>
						{/* <InputBox labelName="头像">
							<img
								className="headerimg"
								src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=546485285,1216335072&fm=173&app=49&f=JPEG?w=218&h=146&s=82DA7F8749E2189809E5F908030040E3"
							/>
						</InputBox>
						<InputBox labelName="壁纸">
							<img
								className="bgimg"
								src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=546485285,1216335072&fm=173&app=49&f=JPEG?w=218&h=146&s=82DA7F8749E2189809E5F908030040E3"
							/>
						</InputBox> */}
						<InputBox
							labelName="微信来源"
							type="textarea"
							value={note_account}
							onChange={window.Util.InputChange.bind(
								this,
								"note_account"
							)}
						/>
						<InputBox
							labelName="备注"
							type="textarea"
							value={wechat_source}
							onChange={window.Util.InputChange.bind(
								this,
								"wechat_source"
							)}
						/>
						{/* <InputBox labelName="禁用">
							<Switch />
						</InputBox> */}
					</div>
				</div>
			</div>
		);
	}
}
