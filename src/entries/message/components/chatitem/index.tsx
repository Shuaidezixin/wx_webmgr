import * as React from "react";
import * as classnames from "classnames";
import * as moment from "moment";
import { insetFace } from "@component/face";
import "./index.less";
import SinglePic from "@img/single.jpg";
interface Props {
	isOwn?: boolean;
	data?: any;
	isGroup?: boolean;
	ownImg?: string;
	withdrawMessage?: Function;
}
interface State {
	ownerImg: string;
	isShowWithdraw: boolean;
	isCanWithdraw: boolean;
}

export default class ChatItem extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		isOwn: false,
		isGroup: false
	};
	readonly state: State = {
		ownerImg: "",
		isShowWithdraw: false,
		isCanWithdraw: false
	};
	componentDidMount() {
		// let ownimg = window.sessionStorage.getItem("messageAccountImg");
		// if (ownimg) {
		// 	this.setState({
		// 		ownerImg: ownimg
		// 	});
		// }
	}
	renderContent(data: any) {
		if (!data) {
			return;
		}
		let res: any;
		switch (data.type) {
			case 1:
				res = insetFace(data && data.content).replace(
					/\r\n/g,
					"<br />"
				);
				break;
			case 2:
				let regImg = /^https?:\/\/.*?.(jpg|jpeg|png|gif)$/gi;

				if (data && data.content && data.content.length > 0) {
					if (regImg.test(data.content)) {
						res = `<img class="showimg" src='${data &&
							data.content}' />`;
					}
				}
				break;
			case 3:
				let regMp4 = /^https?:\/\/.*?.mp4$/gi;
				if (data && data.content && data.content.length > 0) {
					if (regMp4.test(data.content)) {
						res = `<video class="showimg" src='${data &&
							data.content}' controls />`;
					}
				}
				break;
		}
		return res;
	}
	isCanWithdraw(data: any): boolean {
		if (!data) {
			return false;
		}
		if (/^https?\:\/\//.test(data.content)) {
			return false;
		}
		if (data.create_time) {
			let t = moment(data.create_time).add(2, "minutes");
			let res: boolean = false;
			if (moment().isBefore(t)) {
				res = true;
			}
			if (data.msg_db_id) {
				res = true;
			}
			this.setState({
				isCanWithdraw: res
			});
		}
	}
	withdrawMessage(data: any) {
		if (!data) {
			return;
		}
		let { withdrawMessage } = this.props;
		if (withdrawMessage && typeof withdrawMessage === "function") {
			withdrawMessage(data);
		}
	}
	render() {
		let { isOwn, data, isGroup, ownImg } = this.props;
		let { isCanWithdraw } = this.state;
		return (
			<div className="chat-item">
				{!isOwn && (
					<div className="msg-item">
						<img src={data && data.talk_pic} className="img" />
						{isGroup ? (
							<div>
								<div className="nickname">{data.nickname}</div>
								<div
									className={classnames(
										"msg-box",
										data && data.type == 2 ? "img-show" : ""
									)}
									dangerouslySetInnerHTML={{
										__html: `${this.renderContent.call(
											this,
											data
										)}`
									}}
								/>
							</div>
						) : (
							<div
								className={classnames(
									"msg-box",
									data && data.type == 2 ? "img-show" : ""
								)}
								dangerouslySetInnerHTML={{
									__html: `${this.renderContent.call(
										this,
										data
									)}`
								}}
							/>
						)}
					</div>
				)}
				{isOwn && (
					<div
						className="own-item"
						onMouseEnter={this.isCanWithdraw.bind(this, data)}
					>
						<div className="prefix-div" />
						{isCanWithdraw && (
							<span
								className="withdraw"
								onClick={this.withdrawMessage.bind(this, data)}
							>
								撤回
							</span>
						)}
						<div
							className={classnames(
								"msg-box",
								data && data.type == 2 ? "img-show" : ""
							)}
							dangerouslySetInnerHTML={{
								__html: `${this.renderContent.call(this, data)}`
							}}
						/>

						<img
							src={
								ownImg && ownImg.length > 0 ? ownImg : SinglePic
							}
							className="img"
						/>
					</div>
				)}
			</div>
		);
	}
}
