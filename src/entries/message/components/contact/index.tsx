import * as React from "react";
import * as classnames from "classnames";
import "./index.less";
import SinglePic from "@img/single.jpg";
import QunPic from "@img/qun.jpg";
interface Props {
	data?: any;
	onClick?: Function;
	activeID?: string;
}
interface State {}

export default class ContactItem extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {};
	itemClick(data: any) {
		let { onClick } = this.props;
		if (onClick && typeof onClick === "function") {
			onClick(data);
		}
	}
	render() {
		let { data, activeID } = this.props;

		return (
			<div
				className={classnames(
					"contact-item",
					activeID &&
						activeID.length > 0 &&
						data.talk_id == activeID &&
						"act"
				)}
				onClick={this.itemClick.bind(this, data)}
			>
				<div className="contact-inner">
					<img
						src={
							data && data.talk_pic && data.talk_pic.length > 0
								? data.talk_pic
								: data.is_group
								? QunPic
								: SinglePic
						}
						className="contact-header"
					/>
					<div className="contact-middle">
						<div className="name">
							{data && data.is_group
								? data.group_name
								: data.talk_name}
						</div>
						<div className="last-message">
							<span>{data && data.last_msg}</span>
						</div>
					</div>
					<div>
						{data && data.inside && (
							<div className="inner-person">内</div>
						)}
						{data && data.chat_left > 0 && (
							<span
								className={classnames(
									"circle",
									data.is_group && "group"
								)}
							>
								{data.chat_left}
							</span>
						)}
					</div>
				</div>
			</div>
		);
	}
}
