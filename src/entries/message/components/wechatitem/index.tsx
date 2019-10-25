import * as React from "react";
import * as classnames from "classnames";
import "./index.less";
import SinglePic from "@img/single.jpg";
interface Props {
	data?: any;
	onClick?: Function;
	activeID?: string;
}
interface State {}
export default class WechatItem extends React.PureComponent<Props, State> {
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
					"wechat-item",
					activeID &&
						activeID.length > 0 &&
						data.account_id == activeID &&
						"act"
				)}
				onClick={this.itemClick.bind(this, data)}
			>
				<div className="wechat-inner">
					<img
						src={
							data && data.talk_pic && data.talk_pic.length > 0
								? data.talk_pic
								: SinglePic
						}
						className="wechat-img"
					/>
					<div className="wechat-content">
						<div className="wechat-name">
							{data && data.device_note}&nbsp;&nbsp;
							{data && data.note}
						</div>
						<div className="status">
							<div className={classnames("now-state", "act")}>
								在线
							</div>
							<div>
								{data && data.chat_left > 0 && (
									<span
										className="state type"
										style={{ background: "red" }}
									>
										{data && data.chat_left}
									</span>
								)}
								{data && data.chat_group_left > 0 && (
									<span
										className="state type"
										style={{
											background: "rgb(52, 223, 0)"
										}}
									>
										{data && data.chat_group_left}
									</span>
								)}
								{data && data.pyq_left > 0 && (
									<span
										className="state"
										style={{
											background: "rgb(0, 204, 255)"
										}}
									>
										{data && data.pyq_left}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
