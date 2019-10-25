import * as React from "react";
import { Modal, Checkbox, message } from "antd";
import InputBox from "@component/inputbox";
import debounce from "lodash/debounce";

interface Props {
	onOk?: Function;
	onCancel?: Function;
	visible?: boolean;
	addFunction?: Function;
	tagList?: any;
	figureList?: any;
	getTag?: Function;
	getFigure?: Function;
}
interface State {
	tags: any;
	tags_desc: any;
	figure_id: any;
	figure_desc: any;
	login_user: string;
	login_pass: string;
	pay_password: string;
	is_star: boolean;
	group_name: any;
	note_account: any;
	note_mobile: any;
	tagsList: any;
	figure: any;
	isGetTag: boolean;
	isGetFigure: boolean;
}

export default class NewAccount extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.getTagList = debounce(this.getTagList, 1000);
		this.getFigureList = debounce(this.getFigureList, 1000);
	}
	readonly state: State = {
		tags: null,
		tags_desc: null,
		tagsList: null,
		figure: null,
		figure_id: "",
		figure_desc: "",
		login_user: "",
		login_pass: "",
		pay_password: "",
		is_star: false,
		group_name: "",
		note_account: "",
		note_mobile: "",
		isGetTag: false,
		isGetFigure: false
	};
	static readonly defaultProps: Props = {
		visible: false
	};
	componentDidMount() {
		this.getFigureList();
	}

	public cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	public async okClick() {
		let { onOk, addFunction, onCancel } = this.props;
		if (addFunction && typeof addFunction === "function") {
			let {
				tagsList,
				figure,
				login_user,
				login_pass,
				pay_password,
				note_account,
				note_mobile,
				is_star
			} = this.state;
			if (!login_user || login_user.trim().length <= 0) {
				message.error("登录账号不能为空");
				return;
			}
			if (!login_pass || login_pass.trim().length <= 0) {
				message.error("登录密码不能为空");
				return;
			}
			if (!figure) {
				message.error("形象不能为空");
				return;
			}
			let params: any = {
				login_user,
				login_pass,
				pay_password,
				is_star,
				note_mobile,
				note_account,
				figure_id: figure.key,
				figure_desc: figure.label
			};
			let tags: any = [],
				tags_desc: any = [];
			if (tagsList && tagsList.length > 0) {
				tagsList.map((item: any) => {
					tags.push(item.key);
					tags_desc.push(item.label);
				});
				params.tags = tags;
				params.tags_desc = tags_desc;
			}
			let res = await this.props.addFunction({
				user_obj: JSON.stringify(params)
			});
			if (!res || res.code != 200) {
				return;
			} else {
				message.success("添加成功");
				this.setState({
					tags: null,
					tags_desc: null,
					tagsList: null,
					figure: null,
					figure_id: "",
					figure_desc: "",
					login_user: "",
					login_pass: "",
					pay_password: "",
					is_star: false,
					group_name: "",
					note_account: "",
					note_mobile: "",
					isGetTag: false,
					isGetFigure: false
				});
			}
		}
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	selectTag(value: any) {
		this.setState({
			tagsList: value
		});
	}
	async getTagList(word?: string) {
		this.setState({
			isGetTag: true
		});
		try {
			await this.props.getTag({
				page: 1,
				keyword: word ? word : ""
			});
		} finally {
			this.setState({
				isGetTag: false
			});
		}
	}
	selectFigure(value: any) {
		this.setState({
			figure: value
		});
	}
	async getFigureList(word?: string) {
		this.setState({
			isGetFigure: true
		});
		try {
			await this.props.getFigure({
				page: 1,
				pagesize: 30,
				keyword: word ? word : ""
			});
		} finally {
			this.setState({
				isGetFigure: false
			});
		}
	}
	public render() {
		let { visible, tagList, figureList } = this.props;
		let {
			tags,
			tags_desc,
			figure_id,
			figure_desc,
			tagsList,
			figure,
			login_user,
			login_pass,
			pay_password,
			is_star,
			group_name,
			note_mobile,
			note_account,
			isGetTag,
			isGetFigure
		} = this.state;
		let tagOption: any = [];
		let figureOption: any = [];
		if (tagList && tagList.tags && tagList.tags.length > 0) {
			tagList.tags.map((item: any) => {
				tagOption.push({
					key: item.tag_id,
					label: item.tag_name
				});
			});
		}
		if (figureList && figureList.figures && figureList.figures.length > 0) {
			figureList.figures.map((item: any) => {
				figureOption.push({
					key: item.figure_id,
					label: item.basic.name
				});
			});
		}

		return (
			<Modal
				wrapClassName="newaccount-modal"
				visible={visible}
				title="添加账号"
				width={600}
				onCancel={this.cancelClick.bind(this)}
				onOk={this.okClick.bind(this)}
			>
				{/* <InputBox labelName="编组" /> */}
				<InputBox
					labelName="手机编号"
					value={note_mobile}
					onChange={window.Util.InputChange.bind(this, "note_mobile")}
				/>
				<InputBox
					labelName="登录账号"
					isRequired={true}
					value={login_user}
					onChange={window.Util.InputChange.bind(this, "login_user")}
				/>
				<InputBox
					labelName="登录密码"
					type="password"
					isRequired={true}
					value={login_pass}
					onChange={window.Util.InputChange.bind(this, "login_pass")}
				/>
				<InputBox
					labelName="支付密码"
					type="password"
					value={pay_password}
					onChange={window.Util.InputChange.bind(
						this,
						"pay_password"
					)}
				/>
				<InputBox
					labelName="形象"
					isRequired={true}
					type="select"
					optionArr={figureOption}
					showSearch={true}
					isFetch={isGetFigure}
					onSearch={this.getFigureList.bind(this)}
					onChange={this.selectFigure.bind(this)}
					labelInValue={true}
					value={figure}
				/>
				<InputBox
					key={tags}
					labelName="标签"
					type="select"
					optionArr={tagOption}
					showSearch={true}
					isFetch={isGetTag}
					onSearch={this.getTagList.bind(this)}
					onChange={this.selectTag.bind(this)}
					labelInValue={true}
					value={tagsList}
					multiple={true}
					mode="multiple"
				/>
				<InputBox labelName="星标">
					<Checkbox
						value={is_star}
						onChange={window.Util.InputChange.bind(this, "is_star")}
					>
						<span>设置为星标</span>
					</Checkbox>
				</InputBox>
				<InputBox
					labelName="备注"
					type="textarea"
					value={note_account}
					onChange={window.Util.InputChange.bind(
						this,
						"note_account"
					)}
				/>
			</Modal>
		);
	}
}
