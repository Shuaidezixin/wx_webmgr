/**
 *   公共组件
 * 		上传图片或者视频的组件
 */
import * as React from "react";
import { Popover, Icon, Button } from "antd";
import InputBox from "@component/inputbox";
import { requestUrl } from "../../config/index";
import "./index.less";

interface Props {
	onSend?: Function;
	buttonText?: string;
	supportVideo: boolean;
}
interface State {
	img: any;
	isShow: boolean;
}

export default class SendImg extends React.PureComponent<Props, State> {
	private sendImage: React.RefObject<HTMLDivElement>;
	constructor(props: Props) {
		super(props);
		this.sendImage = React.createRef();
	}
	static readonly defaultProps: Props = {
		supportVideo: false
	};
	readonly state: State = {
		img: null,
		isShow: false
	};

	uploadChange(e: any) {
		if (e && e[0] && e[0].url) {
			this.setState({
				img: e
			});
		}
	}
	deleteImg(idx: number) {
		let list = this.state.img;
		list.splice(idx, 1);
		this.setState({
			img: [...list]
		});
	}
	toggleFace(e?: any) {
		e.nativeEvent.stopImmediatePropagation;
		this.setState({ isShow: !this.state.isShow });
	}
	renderBox() {
		let { img } = this.state;
		let { buttonText, supportVideo } = this.props;
		let limitType = ["jpg", "jpeg", "gif", "png"];
		if (supportVideo) {
			limitType.push("mp4");
		}
		return (
			<div
				onClick={(e: any) => {
					e.nativeEvent.stopImmediatePropagation;
					e.stopPropagation();
				}}
			>
				<InputBox
					type="uploader-img"
					autoWidth={true}
					length={1}
					limitType={limitType}
					limitSize={1024 * 1024 * 30}
					value={img}
					customRequest={true}
					domain={requestUrl() + "/upload"}
					onChange={this.uploadChange.bind(this)}
					deleteUplodaValue={this.deleteImg.bind(this)}
				/>
				<div
					style={{ padding: "0 10px 10px 10px" }}
					onClick={this.toggleFace.bind(this)}
				>
					<Button
						type="primary"
						style={{ width: "100%" }}
						onClick={this.sendClick.bind(this)}
					>
						{buttonText ? buttonText : "发送"}
					</Button>
				</div>
			</div>
		);
	}
	sendClick() {
		let { onSend } = this.props;
		let { img } = this.state;
		if (
			onSend &&
			typeof onSend === "function" &&
			img &&
			img[0] &&
			img[0].url
		) {
			onSend(img[0].url);
			this.setState({
				isShow: false,
				img: null
			});
		}
	}
	render() {
		let { isShow } = this.state;
		return (
			<Popover
				placement="topLeft"
				content={this.renderBox.call(this)}
				overlayClassName="sendimg-box"
				ref="test"
				visible={isShow}
				arrowPointAtCenter
				getPopupContainer={() => this.sendImage.current}
			>
				<div
					style={{
						width: "40px",
						height: "30px",
						lineHeight: "38px",
						textAlign: "center"
					}}
					onClick={this.toggleFace.bind(this)}
					ref={this.sendImage}
				>
					<Icon type="file-image" className="sendimg-active" />
				</div>
			</Popover>
		);
	}
}
