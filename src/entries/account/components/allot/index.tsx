import * as React from "react";
import { Modal, Radio } from "antd";
import "./index.less";
const RadioGroup = Radio.Group;
interface Props {
	visible: boolean;
	onCancel?: Function;
	onOk?: Function;
	getCustomerListAction?: Function;
}
interface State {
	adminList: any[];
	value: any;
}

export default class Allot extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: true
	};
	readonly state: State = {
		adminList: [],
		value: null
	};
	componentDidMount() {
		this.getListData();
	}
	async getListData() {
		let params: any = {
			page: 1,
			pagesize: 1000,
			isall: true
		};
		let res = await this.props.getCustomerListAction(params);
		if (res && res.code == 200) {
			let data = res.data;
			if (data) {
				let admin = data.admin_user;
				this.setState({
					adminList: [...admin]
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
	okClick() {
		let { onOk } = this.props;
		if (onOk && typeof onOk === "function") {
			onOk({ id: this.state.value });
		}
	}
	radioChange(e: any) {
		this.setState({
			value: e.target.value
		});
	}
	render() {
		let { visible } = this.props;
		let { adminList, value } = this.state;
		return (
			<Modal
				title="分配"
				visible={visible}
				onCancel={this.cancelClick.bind(this)}
				onOk={this.okClick.bind(this)}
				wrapClassName="allot-modal"
			>
				<div className="allot-container">
					<div className="allot-item header">
						<div className="radio">选择</div>
						<div className="name">名称</div>
					</div>
					<div
						style={{
							height: "calc(100% - 31px)",
							overflow: "auto"
						}}
					>
						<RadioGroup
							name="allot-radio"
							value={value}
							onChange={this.radioChange.bind(this)}
						>
							{adminList &&
								adminList.length > 0 &&
								adminList.map((v: any, i: number) => {
									return (
										<Radio value={v._id} key={i}>
											<div className="text">
												{v.username}
											</div>
										</Radio>
									);
								})}
						</RadioGroup>
					</div>
				</div>
			</Modal>
		);
	}
}
