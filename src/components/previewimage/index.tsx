/**
 * 	图片预览
 */
import * as React from "react";

import { Modal, Icon } from "antd";

import "./index.less";

interface Props {
	imgurl?: string | void | any[];
	visible?: boolean;
	onCancel?: any;
	index?: number;
}
interface State {
	key: number;
	height: number;
}

export default class PreviewImage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: false,
		index: 0
	};
	readonly state: State = {
		key: 0,
		height: 0
	};
	componentDidMount() {
		this.setHeight();
		document.addEventListener("resize", this.setHeight.bind(this), false);
	}
	componentWillMount() {
		document.removeEventListener(
			"resize",
			this.setHeight.bind(this),
			false
		);
	}
	setHeight() {
		let wh = document.body.clientHeight;
		this.setState({
			height: wh - 100
		});
	}
	public componentDidUpdate(prevProp: any) {
		if (!prevProp.visible && prevProp.visible != this.props.visible) {
			this.setState({
				key: this.props.index
			});
		}
		if (prevProp.visible && prevProp.visible != this.props.visible) {
			this.setState({
				key: 0
			});
		}
	}
	public onCancelClick() {
		if (this.props.onCancel && typeof this.props.onCancel === "function") {
			this.props.onCancel();
		}
	}
	public addKey() {
		let { imgurl } = this.props;
		if (!(imgurl instanceof Array)) {
			return;
		}
		let len: number = imgurl.length;
		let key = this.state.key;
		if (key >= len - 1) {
			return;
		}
		this.setState({
			key: key + 1
		});
	}
	public minKey() {
		let { imgurl } = this.props;
		if (!(imgurl instanceof Array)) {
			return;
		}
		let key = this.state.key;
		if (key <= 0) {
			return;
		}
		this.setState({
			key: key - 1
		});
	}
	render() {
		let { visible, imgurl } = this.props;
		let { key, height } = this.state;
		return (
			<Modal
				bodyStyle={{ padding: 0 }}
				visible={visible}
				width={1200}
				footer={null}
				title={null}
				centered={true}
				wrapClassName="previewimage"
				onCancel={this.onCancelClick.bind(this)}
			>
				<div className="imgbox" style={{ maxHeight: height + "px" }}>
					{imgurl && typeof imgurl === "string" && (
						<img
							style={{ maxHeight: height - 40 + "px" }}
							src={imgurl}
						/>
					)}
					{imgurl && imgurl instanceof Array && imgurl.length > 0 && (
						<React.Fragment>
							<div
								className="cardbox"
								style={{
									width: imgurl.length * 1200 + "px",
									transform: `translateX(-${key * 1200}px)`
								}}
							>
								{imgurl.map((item: any, idx: any) => {
									return (
										<div
											style={{ width: "1200px" }}
											className="innerimg"
											key={idx}
										>
											<img
												style={{
													maxHeight:
														height - 40 + "px"
												}}
												src={item}
											/>
										</div>
									);
								})}
							</div>
							<Icon
								className="icon left"
								type="left"
								onClick={this.minKey.bind(this)}
							/>
							<Icon
								className="icon right"
								type="right"
								onClick={this.addKey.bind(this)}
							/>
							<div className="more-info">
								<span
									style={{
										fontSize: ".3rem",
										marginRight: ".05rem"
									}}
								>
									{key + 1}
								</span>
								/{imgurl.length}
							</div>
						</React.Fragment>
					)}
				</div>
			</Modal>
		);
	}
}
