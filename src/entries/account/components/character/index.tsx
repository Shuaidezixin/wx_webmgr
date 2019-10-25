import * as React from "react";
import { Modal, Button, Checkbox, Tag, message } from "antd";
import ListPage from "@base/listpage";
import TableBox from "@component/tablebox";
import FooterCtrl from "@component/footer_ctrl";
import Toast from "@component/toast";
import "./index.less";

interface Props extends BaseListProps {
	visible: boolean;
	onCancel?: Function;
	getData?: Function;
	data?: any;
	users?: any[] | void;
	setData?: Function;
	onSuccess?: Function;
}
interface State extends BaseListState {
	visible: boolean;
	step: number;
	isLoadCharacterList: boolean;
	characterList: any;
	unsafeList: any;
	users: any[] | void;
}

export default class Character extends ListPage<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: false
	};
	readonly state: State = {
		visible: false,
		users: null,
		step: 0,
		page: 1,
		pagesize: 20,
		isLoadCharacterList: false,
		characterList: null,
		unsafeList: null
	};
	componentDidMount() {
		this.getCharacterList();
	}
	async getCharacterList() {
		let { page, pagesize } = this.state;
		this.setState({
			isLoadCharacterList: true
		});
		try {
			let res = await this.props.getData({
				page,
				pagesize
			});
			if (res && res.data && res.code == 200) {
				let data = res.data.personaldesgins;
				data.map((v: any) => {
					v.isChecked = false;
				});
				this.setState({
					characterList: [...data]
				});
			}
		} finally {
			this.setState({
				isLoadCharacterList: false
			});
		}
	}
	pageChange(e: number) {
		this.setState({ page: e }, this.getCharacterList);
	}
	characterCheckChange(data: any, idx: number, e: any) {
		let { characterList } = this.state;
		characterList.map((v: any) => {
			v.isChecked = false;
		});
		characterList[idx].isChecked = e.target.checked;
		this.setState({
			characterList: [...characterList]
		});
	}
	readerStep1Header() {
		return [
			{
				name: "",
				width: 40,
				class: "tc",
				render: (item: any, idx: number) => {
					return (
						<Checkbox
							checked={item && item.isChecked}
							onChange={this.characterCheckChange.bind(
								this,
								item,
								idx
							)}
						/>
					);
				}
			},
			{
				name: "人设名称",
				class: "tc",
				key: "title",
				width: 120
			},
			{
				name: "人设备注",
				class: "tc",
				key: "note",
				width: 80
			},
			{
				name: "形象",
				class: "tc",
				key: "figure_name",
				width: 120
			},
			{
				name: "标签",
				class: "tc",
				key: "tags",
				render: (item: any) => {
					return (
						<React.Fragment>
							{item &&
								item.tags &&
								item.tags.tag_value &&
								item.tags.tag_value.length > 0 &&
								item.tags.tag_value.map((v: any, i: number) => {
									return <Tag key={i}>{v}</Tag>;
								})}
						</React.Fragment>
					);
				}
			}
		];
	}
	renderHeader1() {
		return [
			{
				name: "序号",
				width: 50,
				class: "tc",
				render: (item: any, idx: number) => idx + 1
			},
			{
				name: "手机编号",
				width: 120,
				class: "tc",
				key: "note_mobile"
			},
			{
				name: "微信账号",
				width: 120,
				class: "tc",
				key: "login_user"
			},
			{
				name: "微信昵称",
				width: 120,
				class: "tc",
				key: "nickname"
			},
			{
				name: "备注信息",
				width: 120,
				class: "tc",
				key: "note_account"
			},
			{
				name: "人设配置",
				width: 120,
				class: "tc",
				key: "personal_desgin_name"
			},
			{
				name: "操作",
				class: "tc",
				width: 70,
				render: (item: any) => {
					return (
						<span
							style={{ color: "#1890ff", cursor: "pointer" }}
							onClick={this.removeUnSafe.bind(this, [item.id])}
						>
							移除
						</span>
					);
				}
			}
		];
	}
	removeUnSafe(ids: string[]) {
		let { unsafeList, users } = this.state;
		let newList: any[] = [];
		let newUsers: any[] = [];
		if (unsafeList && unsafeList.length > 0) {
			unsafeList.map((v: any) => {
				if (!ids.includes(v.id)) {
					newList.push(v);
				}
			});
		}
		if (users && users.length > 0) {
			newUsers = users.filter((v: any) => {
				if (!ids.includes(v.id)) {
					return v;
				}
			});
		}
		this.setState({
			unsafeList: [...newList],
			users: [...newUsers]
		});
	}
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	static getDerivedStateFromProps(nextProps: any, currentState: any): any {
		if (!nextProps.visible && currentState.visible) {
			if (
				currentState &&
				currentState.characterList &&
				currentState.characterList.length > 0
			) {
				currentState.characterList.map((v: any) => {
					v.isChecked = false;
				});
			}
			return {
				step: 0,
				unsafeList: [],
				users: null,
				visible: false,
				characterList: currentState.characterList
					? [...currentState.characterList]
					: null
			};
		}
		if (nextProps.visible && !currentState.visible) {
			return {
				visible: nextProps.visible,
				users: [...nextProps.users]
			};
		}

		return null;
	}
	async saveClick() {
		let { users } = this.state;
		let { characterList } = this.state;
		if (!characterList || characterList.length <= 0) {
			message.error("无人设相关配置，请先配置人设");
			return;
		}
		let ids: string[] = [];
		let personId: string = "";
		if (users && users.length > 0) {
			users.map(v => {
				ids.push(v.id);
			});
		}

		characterList.map((v: any) => {
			if (v.isChecked) {
				personId = v._id;
			}
		});
		if (!personId || personId.length <= 0) {
			message.error("请选择人设");
			return;
		}
		let sending = Toast.loading("正在提交数据", 0);
		let res: any = null;
		try {
			res = await this.props.setData({
				personal_design_id: personId,
				account_Ids: ids.join(";"),
				step: 0
			});
		} finally {
			sending.close();
		}
		if (res && res.code == 200) {
			if (!res.data) {
				message.success("修改成功");
				let { onSuccess, onCancel } = this.props;
				if (onCancel && typeof onCancel === "function") {
					onCancel();
				}
				if (onSuccess && typeof onSuccess === "function") {
					onSuccess();
				}
				return;
			}
			this.setState({
				step: 1,
				unsafeList: [...res.data]
			});
		}
	}
	async saveClick2() {
		let { users, characterList } = this.state;
		let personId: string = "";
		let ids: string[] = [];
		if (!users || users.length <= 0) {
			message.error("所有用户已移除");
			return;
		}
		users.map((v: any) => {
			ids.push(v.id);
		});
		characterList.map((v: any) => {
			if (v.isChecked) {
				personId = v._id;
			}
		});
		if (!personId || personId.length <= 0) {
			message.error("请选择人设");
			return;
		}
		let sending = Toast.loading("正在提交数据", 0);
		let res: any = null;
		try {
			res = await this.props.setData({
				personal_design_id: personId,
				account_Ids: ids.join(";"),
				step: 1
			});
		} finally {
			sending.close();
		}
		if (res && res.code == 200) {
			if (!res.data) {
				message.success("修改成功");
				let { onSuccess, onCancel } = this.props;
				if (onCancel && typeof onCancel === "function") {
					onCancel();
				}
				if (onSuccess && typeof onSuccess === "function") {
					onSuccess();
				}
				return;
			}
			this.setState({
				step: 0,
				unsafeList: []
			});
		}
	}
	getUnSagfeIds(): string[] {
		let { unsafeList } = this.state;
		let res: string[] = [];
		if (unsafeList && unsafeList.length > 0) {
			unsafeList.map((v: any) => {
				res.push(v.id);
			});
		}
		return res;
	}
	allClearUnSafe() {
		let { unsafeList, users } = this.state;
		let ids = this.getUnSagfeIds();
		let newUser: any[];
		if (users && users.length > 0) {
			newUser = users.filter((v: any) => {
				if (!ids.includes(v.id)) {
					return v;
				}
			});
		}
		this.setState(
			{
				unsafeList: [],
				users: [...newUser]
			},
			() => {
				this.saveClick2();
			}
		);
	}
	render() {
		let { visible, data } = this.props;
		let {
			step,
			page,
			pagesize,
			isLoadCharacterList,
			characterList,
			unsafeList
		} = this.state;
		return (
			<Modal
				visible={visible}
				title="人设"
				wrapClassName="character-account-modal-box"
				footer={null}
				width={800}
				onCancel={this.cancelClick.bind(this)}
			>
				<div className="character-inner-container">
					{step == 0 && (
						<div className="step step1">
							<div className="step-container list-page-box">
								<div className="list-center">
									<TableBox
										headerList={this.readerStep1Header()}
										data={characterList}
										isLoading={isLoadCharacterList}
									/>
								</div>
								<div className="list-footer">
									<FooterCtrl
										pageSize={pagesize}
										currentPage={page}
										total={data && data.total}
										pageChange={this.pageChange.bind(this)}
									/>
								</div>
							</div>
							<div className="step-footer">
								<Button
									className="character-btn"
									onClick={this.cancelClick.bind(this)}
								>
									关闭
								</Button>
								<Button
									className="character-btn"
									type="primary"
									onClick={this.saveClick.bind(this)}
								>
									确定
								</Button>
							</div>
						</div>
					)}
					{step == 1 && (
						<div className="step step2">
							<div className="step-header">
								<span className="red-text">
									以下账号在短时间内已操作过人设分配，请确认是否操作以下账号
								</span>
							</div>
							<div className="step-container list-page-box">
								<div className="list-center">
									<TableBox
										headerList={this.renderHeader1()}
										data={unsafeList}
									/>
								</div>
							</div>
							<div className="step-footer">
								<Button
									className="character-btn"
									onClick={this.allClearUnSafe.bind(this)}
								>
									全部移除
								</Button>
								<Button
									className="character-btn"
									type="primary"
									onClick={this.saveClick2.bind(this)}
								>
									确认保存
								</Button>
							</div>
						</div>
					)}
				</div>
			</Modal>
		);
	}
}
