import * as React from "react";
import { Modal, Radio } from "antd";
import "./index.less";
import { itemMap } from "entries/figureedit/container/map";
const RadioGroup = Radio.Group;
interface Props {
	visible: boolean;
	onCancel?: Function;
	onOk?: Function;
	getExtensionScriptAction?: Function;
}
interface State {
	scriptList: any[];
	value: any;
}

export default class ExtensionBox extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: true
	};
	readonly state: State = {
		scriptList: [],
		value: null
	};
	componentDidMount() {
		this.getListData();
	}
	async getListData() {
		let params: any = {
			page: 1,
			pagesize: 1000
		};
		let res = await this.props.getExtensionScriptAction(params);
		if (res && res.code == 200) {
			let data = res.data;
			if (data) {
				let scripts = data.resoureinsidescripts;
				this.setState({
					scriptList: [...scripts]
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
		let { scriptList, value } = this.state;
		return (
			<Modal
				title="推广剧本"
				visible={visible}
				onCancel={this.cancelClick.bind(this)}
				onOk={this.okClick.bind(this)}
				wrapClassName="allot-modal"
			>
				<div className="allot-container">
					<div className="allot-item header">
						<div className="radio">选择</div>
						<div className="name">剧本标题</div>
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
							{scriptList &&
								scriptList.length > 0 &&
								scriptList.map((v: any, i: number) => {
									return (
										<Radio value={v.id} key={i}>
											<div className="text">
												{v.title}
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
