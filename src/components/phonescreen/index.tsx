/**
 * 	手机同屏相关代码
 */
import * as React from "react";
import { message, Input, Button } from "antd";
import "./index.less";

interface Props {
	img: any[];
	onClick?: Function;
	onHand?: ({  }: HandData) => {};
	isShowInput: boolean;
	onWechatInfo?: Function;
	onPosChange?: Function;
}
interface State {
	img: any[];
	note_mobile: string;
	wechat_user: string;
	wechat_password: string;
	wechat_source: string;
}
interface HandData {
	x: number;
	y: number;
	w: number;
	h: number;
	type: HandType;
}
declare type HandType = "start" | "move" | "end";
export default class PhoneScreen extends React.PureComponent<Props, State> {
	private PhoneCanvas: React.RefObject<HTMLCanvasElement>;
	private ctx: any;
	private w: number;
	private h: number;
	private isMouseDown: boolean;
	private startPos: any;
	private startTime: number;
	private isIn: boolean = false;
	private top1: number = 0;
	private mouseTimer: any;
	private prePoint: any;
	static readonly defaultProps: Props = {
		img: [],
		isShowInput: false
	};
	readonly state: State = {
		img: [],
		note_mobile: "",
		wechat_user: "",
		wechat_password: "",
		wechat_source: ""
	};
	constructor(props: Props) {
		super(props);
		this.PhoneCanvas = React.createRef();
	}
	static getDerivedStateFromProps(nextProps: any, currentState: any): any {
		if (
			nextProps.img &&
			nextProps.img.length > 0 &&
			nextProps.img != currentState.img
		) {
			return {
				img: nextProps.img
			};
		}
		if (!nextProps.isShowInput) {
			return {
				note_mobile: "",
				wechat_user: "",
				wechat_password: "",
				wechat_source: ""
			};
		}
		return null;
	}
	componentDidMount() {
		let { onPosChange } = this.props;
		this.initCanvas();
		this.drawImg();
		let el = this.PhoneCanvas.current;
		let bound = el.getBoundingClientRect();
		if (bound.top > document.body.clientHeight || bound.bottom < 0) {
			if (onPosChange && typeof onPosChange === "function") {
				onPosChange("screen_out");
			}
		}
		document.addEventListener(
			"mousewheel",
			this.listenMouseWheel.bind(this),
			false
		);
	}
	componentWillUnmount() {
		document.removeEventListener(
			"mousewheel",
			this.listenMouseWheel.bind(this),
			false
		);
	}

	listenMouseWheel() {
		if (this.isIn) {
			return;
		}
		if (this.mouseTimer) {
			clearTimeout(this.mouseTimer);
			this.mouseTimer = null;
		}
		this.mouseTimer = setTimeout(() => {
			// let el = this.PhoneCanvas.current;
			// let bound = el.getBoundingClientRect();
			// let t = bound.top;
			// console.log(t, this.top1, t == this.top1);
			// if (t == this.top1) {
			// 	this.drawImg();
			// }
			// this.top1 = t;
			this.drawImg();
			clearTimeout(this.mouseTimer);
			this.mouseTimer = null;
		}, 300);
		//this.drawImg();
	}
	componentDidUpdate() {
		this.drawImg();
	}
	getOffsetTop(obj: any) {
		var tmp = obj.offsetTop;
		var val = obj.offsetParent;
		while (val != null) {
			tmp += val.offsetTop - val.scrollTop;
			val = val.offsetParent;
		}
		return tmp;
	}
	getOffsetLeft(obj: any) {
		var tmp = obj.offsetLeft;
		var val = obj.offsetParent;
		while (val != null) {
			tmp += val.offsetLeft;
			val = val.offsetParent;
		}
		return tmp;
	}
	initCanvas() {
		let canvas = this.PhoneCanvas.current;
		if (!canvas) {
			message.error("无法获取canvas");
			return;
		}
		this.w = canvas.clientWidth;
		this.h = canvas.clientHeight;
		canvas.width = this.w;
		canvas.height = this.h;
		this.ctx = canvas.getContext("2d");
	}
	public drawImg() {
		let el = this.PhoneCanvas.current;
		let { onPosChange } = this.props;
		let bound = el.getBoundingClientRect();
		this.top1 = bound.top;

		if (bound.top > document.body.clientHeight || bound.bottom < 0) {
			if (this.isIn) {
				this.isIn = false;
				if (onPosChange && typeof onPosChange === "function") {
					onPosChange("screen_out");
				}
			}
			return;
		} else {
			if (!this.isIn) {
				if (onPosChange && typeof onPosChange === "function") {
					onPosChange("screen_in");
				}
				this.isIn = true;
			}
		}
		if (document.visibilityState != "visible") {
			return;
		}
		this.doDrawImg();
	}
	doDrawImg() {
		let { img } = this.state;
		if (img && img.length > 0) {
			requestAnimationFrame(() => {
				let { img } = this.state;
				let d: any = img[img.length - 1];
				let blob = null;
				blob = new Blob(d, { type: "image/jpeg" });
				let URL = window.URL || window.webkitURL;
				let url = URL.createObjectURL(blob);
				let showImg: HTMLImageElement = null;
				showImg = new Image();
				showImg.src = url;
				showImg.onload = function() {
					//this.ctx.clearRect(0, 0, this.w, this.h);
					this.ctx.drawImage(showImg, 0, 0, this.w, this.h);
					URL.revokeObjectURL(url);
					showImg = null;
					blob = null;
					url = null;
				}.bind(this);
			});
		} else {
			let txt = "暂无画面同步";
			this.ctx.clearRect(0, 0, this.w, this.h);
			this.ctx.fontSize = "30px 宋体";
			this.ctx.fillStyle = "#a4a4a4";
			this.ctx.fillText(
				txt,
				(this.w - this.ctx.measureText(txt).width) / 2,
				this.h / 2
			);
		}
	}
	getPos(data: any) {
		if (!data) {
			return;
		}
		let top = this.getOffsetTop(this.PhoneCanvas.current);
		let left = this.getOffsetLeft(this.PhoneCanvas.current);
		return {
			w: this.w,
			h: this.h,
			x: data.pageX - left,
			y: data.pageY - top
		};
	}

	handlerStart(data: any) {
		let resData: HandData = {
			...data,
			type: "start"
		};
		let { onHand } = this.props;
		if (onHand && typeof onHand === "function") {
			onHand(resData);
		}
	}
	handlerMove(data: any) {
		let resData: HandData = {
			...data,
			type: "move"
		};
		let { onHand } = this.props;
		if (onHand && typeof onHand === "function") {
			onHand(resData);
		}
	}
	handlerEnd(data: any) {
		let resData: HandData = {
			...data,
			type: "end"
		};
		let { onHand } = this.props;
		if (onHand && typeof onHand === "function") {
			if (resData.x > resData.w) {
				resData.x = resData.w;
			}
			if (resData.x < 0) {
				resData.x = 0;
			}
			if (resData.y > resData.h) {
				resData.y = resData.h;
			}
			if (resData.y < 0) {
				resData.y = 0;
			}
			onHand(resData);
		}
	}
	mouseDown(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		let { onClick } = this.props;
		if (onClick && typeof onClick === "function") {
			onClick();
		}
		this.isMouseDown = true;
		let pos = this.getPos(e);
		this.prePoint = pos;
		this.startPos = pos;
		this.startTime = new Date().getTime();
		this.handlerStart(pos);
	}
	mouseMove(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		let left = this.getOffsetLeft(this.PhoneCanvas.current);
		let top = this.getOffsetTop(this.PhoneCanvas.current);
		if (!this.isMouseDown) {
			return;
		}
		if (
			e.pageX > left &&
			e.pageX < left + this.w &&
			e.pageY > top &&
			e.pageY < top + this.h &&
			this.isMouseDown
		) {
			let pos = this.getPos(e);
			if (
				Math.abs(this.prePoint.x - pos.x) >= 30 ||
				Math.abs(this.prePoint.y - pos.y) >= 30
			) {
				this.prePoint = pos;
				this.handlerMove(pos);
			}
		} else {
			this.isMouseDown = false;
			let pos = this.getPos(e);
			this.handlerEnd(pos);
		}
	}
	mouseUp(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		if (this.isMouseDown) {
			this.isMouseDown = false;
			let endTime = new Date().getTime();
			let pos = this.getPos(e);
			if (
				endTime - this.startTime < 200 &&
				JSON.stringify(pos) == JSON.stringify(this.startPos)
			) {
				this.handlerEnd(pos);
			} else {
				this.handlerEnd(pos);
			}
			this.prePoint = null;
		}
	}
	mouseLeave(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		if (this.isMouseDown) {
			this.isMouseDown = false;
			let pos = this.getPos(e);
			this.handlerEnd(pos);
			this.prePoint = null;
		}
	}
	BoxClick(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
	}
	sendWechatInfo() {
		let {
			note_mobile,
			wechat_user,
			wechat_password,
			wechat_source
		} = this.state;
		let { onWechatInfo } = this.props;
		let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$/gi;
		if (!note_mobile || note_mobile.trim().length <= 0) {
			message.error("手机编号不能为空");
			return;
		}
		if (!wechat_user || wechat_user.trim().length <= 0) {
			message.error("微信账号不能为空");
			return;
		}
		if (
			!wechat_password ||
			wechat_password.trim().length <= 0 ||
			!reg.test(wechat_password.trim())
		) {
			message.error("微信密码不能为空并且长度在8-16位");
			return;
		}
		let params: any = {
			note_mobile,
			wechat_user,
			wechat_password,
			wechat_source
		};
		if (onWechatInfo && typeof onWechatInfo == "function") {
			onWechatInfo(params);
		}
	}
	render() {
		let { isShowInput } = this.props;
		let {
			note_mobile,
			wechat_user,
			wechat_password,
			wechat_source
		} = this.state;
		return (
			<div className="phonecanvas-box" onClick={this.BoxClick.bind(this)}>
				<canvas
					className="phonecanvas"
					onMouseDown={this.mouseDown.bind(this)}
					onMouseMove={this.mouseMove.bind(this)}
					onMouseUp={this.mouseUp.bind(this)}
					onMouseLeave={this.mouseLeave.bind(this)}
					ref={this.PhoneCanvas}
				/>
				{isShowInput && (
					<div className="screen-input-box">
						<div className="container">
							<div className="input-item">
								<Input
									placeholder="手机编号"
									value={note_mobile}
									onChange={window.Util.InputChange.bind(
										this,
										"note_mobile"
									)}
								/>
							</div>
							<div className="input-item">
								<Input
									placeholder="微信账号"
									value={wechat_user}
									onChange={window.Util.InputChange.bind(
										this,
										"wechat_user"
									)}
								/>
							</div>
							<div className="input-item">
								<Input
									placeholder="微信密码"
									value={wechat_password}
									onChange={window.Util.InputChange.bind(
										this,
										"wechat_password"
									)}
								/>
							</div>
							<div className="input-item">
								<Input
									placeholder="微信来源"
									value={wechat_source}
									onChange={window.Util.InputChange.bind(
										this,
										"wechat_source"
									)}
								/>
							</div>
							<div className="input-item">
								<Button
									className="input-btn"
									type="primary"
									onClick={this.sendWechatInfo.bind(this)}
								>
									确定
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
