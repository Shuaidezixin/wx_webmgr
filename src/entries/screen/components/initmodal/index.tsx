import * as React from "react";
import { Modal, Button } from "antd";
import "./index.less";
import p1 from "@img/u1103.png";
import p2 from "@img/u1104.png";
interface Props {
	visible?: boolean;
	onCancel?: Function;
	onOk?: Function;
}
interface State {}

export default class InitModal extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: false
	};
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	okClick() {
		let { onOk } = this.props;
		if (onOk && typeof onOk === "function") {
			onOk();
		}
	}
	render() {
		let { visible } = this.props;
		return (
			<Modal
				visible={visible}
				footer={null}
				width={600}
				wrapClassName="init-modal-page"
				onCancel={this.cancelClick.bind(this)}
			>
				<div className="init-before-container">
					<div className="title">
						执行初始化之前请确保已完成以下操作
					</div>
					<div className="text">
						1.在手机设置/开发者选项中打开“不锁定屏幕”和“USB调试”选项
					</div>
					<div className="img-box">
						<img src={p1} />
						<img src={p2} />
					</div>
					<div className="text">2.卸载不相干的第三方程序</div>
					<div className="btn-box">
						<Button
							type="primary"
							className="btn"
							onClick={this.okClick.bind(this)}
						>
							开始初始化
						</Button>
						<Button
							className="btn"
							onClick={this.cancelClick.bind(this)}
						>
							取消
						</Button>
					</div>
				</div>
			</Modal>
		);
	}
}
