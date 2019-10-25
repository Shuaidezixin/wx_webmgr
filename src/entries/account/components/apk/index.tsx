import * as React from "react";
import { Modal, Checkbox, message } from "antd";
import "./index.less";

interface Props {
	visible: boolean;
	onCancel?: Function;
	onOk?: Function;
	getData?: Function;
	id?: string | void;
}
interface State {
	appList: any[];
	appid: string;
	isSending: boolean;
}

export default class Apk extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: true
	};
	readonly state: State = {
		appList: [],
		appid: "",
		isSending: false
	};
	componentDidMount() {
		this.getApkData();
	}
	async getApkData() {
		let { id, getData } = this.props;
		if (getData && typeof getData === "function") {
			let res = await getData({
				accountid: id
			});
			let newList: any[] = [];
			if (res && res.code == 200) {
				let data = res.data;
				let app = data.applications;
				app.map((v: any) => {
					v.isChecked = false;
					newList.push(v);
				});
				this.setState({
					appList: [...newList],
					appid: data._id
				});
			}
		}
	}
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	async okClick() {
		let { onOk, id } = this.props;
		let { appList, appid } = this.state;
		if (onOk && typeof onOk === "function") {
			let checkIdx: any[] = [];
			if (appList && appList.length > 0) {
				appList.map((v: any, i: number) => {
					if (v.isChecked) {
						checkIdx.push(i);
					}
				});
			}
			if (!checkIdx || checkIdx.length <= 0) {
				message.error("请选择需要安装的app");
				return;
			}
			this.setState({
				isSending: true
			});
			let params: any = {
				amwebsiteversionid: appid,
				indexs: checkIdx.join(";"),
				accountid: id
			};
			try {
				await onOk(params);
			} finally {
				this.setState({
					isSending: false
				});
			}
		}
	}
	checkboxChange(i: number, e: any) {
		let { appList } = this.state;
		appList[i].isChecked = e.target.checked;
		this.setState({
			appList: [...appList]
		});
	}
	render() {
		let { visible } = this.props;
		let { appList, isSending } = this.state;
		return (
			<Modal
				visible={visible}
				title="apk安装"
				wrapClassName="account-apk-modal"
				onCancel={this.cancelClick.bind(this)}
				onOk={this.okClick.bind(this)}
				confirmLoading={isSending}
			>
				<div className="apk-container">
					<div className="title">请选择要安装的APK</div>
					{appList &&
						appList.length > 0 &&
						appList.map((v: any, i: number) => {
							return (
								<div
									className="item"
									key={i}
									onChange={this.checkboxChange.bind(this, i)}
								>
									<Checkbox checked={v.isChecked}>
										<div className="item-content">
											{v.applicationname}
										</div>
									</Checkbox>
								</div>
							);
						})}
				</div>
			</Modal>
		);
	}
}
