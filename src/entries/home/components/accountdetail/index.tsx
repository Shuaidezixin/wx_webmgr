import * as React from "react";
import { Icon } from "antd";
import DetailItem from "@component/detailitem";
import "./index.less";

interface Props {
	onCancel?: Function;
}
interface State {}

export default class AccountDetail extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	public closeClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	public render() {
		return (
			<div className="accountdetail-page">
				<div className="accountdetail-title">
					<Icon
						className="close-btn"
						onClick={this.closeClick.bind(this)}
						type="close"
					/>
					<span>账户信息</span>
				</div>
				<div className="accountdetail-container">
					<div className="accountdetail-group">
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
					</div>
					<div className="accountdetail-group">
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
						<DetailItem
							labelName="编组"
							isBlock={true}
							nameWidth="70px"
							content="333"
						/>
					</div>
				</div>
			</div>
		);
	}
}