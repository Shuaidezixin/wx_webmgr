import * as React from "react";
import "./index.less";
import SinglePic from "@img/single.jpg";
import QunPic from "@img/qun.jpg";
interface Props {
	data?: any;
	onClick?: Function;
}
interface State {}

export default class TxlItem extends React.PureComponent<Props, State> {
	itemClick(data: any) {
		let { onClick } = this.props;
		if (onClick && typeof onClick === "function") {
			onClick(data);
		}
	}
	render() {
		let { data } = this.props;
		return (
			<div className="txl-item" onClick={this.itemClick.bind(this, data)}>
				<img
					src={
						data && data.talk_pic && data.talk_pic.length > 0
							? data.talk_pic
							: data.is_group
							? QunPic
							: SinglePic
					}
					className="txl-img"
				/>
				<div className="name">
					{data && data.is_group ? data.group_name : data.talk_name}
				</div>
				{data && data.inside && <div className="inner-person">内</div>}
			</div>
		);
	}
}
