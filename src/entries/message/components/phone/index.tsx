import * as React from "react";
import { Icon, message } from "antd";
import Scrollbars from "react-custom-scrollbars";
import ChatItem from "../chatitem";
import EditBox from "@component/editor";
import Face from "@component/face";
import SendImage from "@component/sendimg";
import * as classnames from "classnames";
import "./index.less";

interface Props {
	onDelete?: Function;
	onFull?: Function;
	onSend?: Function;
	data?: any;
	talkerData?: any;
	isFocus?: Boolean;
	onClick?: Function;
	withdrawMessage?: Function;
	isActive?: boolean;
}
interface State {
	isFocus: boolean;
}

export default class PhoneBox extends React.PureComponent<Props, State> {
	private phoneMessage: React.RefObject<Scrollbars>;
	private Editor: any;
	readonly state: State = {
		isFocus: false
	};
	constructor(props: Props) {
		super(props);
		this.phoneMessage = React.createRef();
		this.Editor = React.createRef();
		this.clickEvent = this.clickEvent.bind(this);
	}
	componentDidMount() {
		//document.addEventListener("click", this.clickEvent, false);
	}
	componentWillUnmount() {}
	clickEvent(e: any) {
		let { onClick } = this.props;
		if (onClick && typeof onClick === "function") {
			onClick();
		}
	}
	setFocusFalse() {
		this.setState({
			isFocus: false
		});
	}
	editEnter() {
		//let { isFocus } = this.state;

		let { onSend, isFocus, isActive } = this.props;
		if (!isFocus) {
			return;
		}
		if (!isActive) {
			message.error("账号不在活动状态");
			return;
		}
		if (onSend && typeof onSend === "function") {
			onSend({
				content: this.Editor.current.getContent()
			});
			this.Editor.current.clearContent();
		}
	}
	boxMouseEnter(e: any) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		this.setState({
			isFocus: true
		});
	}
	faceClick(word: string) {
		this.Editor.current.insertText(`[${word}]`);
	}
	deleteClick(e: any) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		let { onDelete } = this.props;
		if (onDelete && typeof onDelete === "function") {
			onDelete();
		}
	}
	fullClick() {
		let { onFull } = this.props;
		if (onFull && typeof onFull === "function") {
			onFull(this.props.talkerData);
		}
	}
	sendImg(url: string) {
		let { onSend, isActive } = this.props;
		if (!isActive) {
			message.error("账号不在活动状态");
			return;
		}
		let regImg = /^https?:\/\/.*?.(jpg|jpeg|png|gif)$/gi;
		let regMp4 = /^https?:\/\/.*?.mp4$/gi;
		let content: string = "";
		if (regImg.test(url)) {
			content = `<img src='${url}' />`;
		}
		if (regMp4.test(url)) {
			content = `<video src='${url}' />`;
		}
		if (onSend && typeof onSend === "function") {
			onSend({
				content: content
			});
		}
	}
	scrollToBottom() {
		this.phoneMessage.current.scrollToBottom();
	}
	render() {
		let { talkerData, data, isFocus, withdrawMessage } = this.props;
		return (
			<div
				className={classnames("message-phone-box", isFocus && "act")}
				onClick={this.clickEvent.bind(this)}
				onDoubleClick={this.fullClick.bind(this)}
				// onMouseEnter={this.boxMouseEnter.bind(this)}
				// onMouseLeave={this.setFocusFalse.bind(this)}
			>
				<div className="phone-title">
					<div className="text">
						{talkerData && talkerData.is_group
							? talkerData.group_name +
							  `(${talkerData.groups.length})`
							: talkerData.talk_name}
					</div>
					<Icon
						type="fullscreen"
						className="phone-icon"
						onClick={this.fullClick.bind(this)}
					/>
					<Icon
						type="close"
						className="phone-icon"
						onClick={this.deleteClick.bind(this)}
					/>
				</div>
				<div className="phone-message">
					<Scrollbars autoHide={true} ref={this.phoneMessage}>
						{data &&
							data.message &&
							data.message.length > 0 &&
							data.message.map((v: any, i: number) => {
								return (
									<ChatItem
										data={v}
										key={
											v.create_time + "_" + i ||
											v.msg_db_id + "_" + i
										}
										isOwn={v.isSend == 1}
										ownImg={
											talkerData && talkerData.accountImg
										}
										isGroup={v.is_group}
										withdrawMessage={withdrawMessage}
									/>
								);
							})}
					</Scrollbars>
				</div>
				<div className="phone-ctrl">
					<EditBox
						style={{
							flex: "1",
							minHeight: "20px",
							backgroundColor: "#fff",
							marginLeft: "10px",
							borderRadius: "4px",
							padding: "5px 10px",
							maxHeight: "200px",
							overflow: "auto"
						}}
						onEnter={this.editEnter.bind(this)}
						ref={this.Editor}
					/>
					<Face onClick={this.faceClick.bind(this)} />
					<SendImage
						onSend={this.sendImg.bind(this)}
						supportVideo={true}
					/>
				</div>
			</div>
		);
	}
}
