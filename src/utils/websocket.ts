export default class AppSocket {
	private wsurl: string;
	private ws: WebSocket;
	private handler: any;
	private messageQueue: any[];
	private isConnect: boolean = false;
	private messageID: number;
	private timer: any = null;
	constructor(wsurl: string) {
		this.wsurl = wsurl;
		this.handler = {};
		this.messageID = 0;
		this.messageQueue = [];
		this.init();
	}
	private init() {
		try {
			if ("WebSocket" in window) {
				this.ws = new WebSocket(this.wsurl);
			} else {
				console.dirxml(
					"你的浏览器不支持websocket,请使用现代浏览器https://www.google.cn/intl/zh-CN/chrome/"
				);
				throw new Error("你的浏览器不支持websocket,请使用现代浏览器");
			}
		} catch (e) {
			this.isConnect = false;
			this.reconnect();
		}
		if (this.ws) {
			this.ws.onopen = () => {
				this.isConnect = true;
				console.log("websocket连接成功");
				if (
					this.handler &&
					this.handler["open"] &&
					this.handler["open"].length > 0
				) {
					this.handler["open"].map((v: Function) => {
						v();
					});
				}
				this.resend();
				this.checkHeart.start();
			};
			this.ws.onmessage = (evt: any) => {
				let d: any;
				try {
					d = JSON.parse(window.Util.aesDeParams(evt.data));
				} catch (e) {
					d = window.Util.aesDeParams(evt.data);
				}
				console.log("socket接收数据：", d);
				if (d && d.date && d.messageID) {
					this.messageQueue = this.messageQueue.filter((v: any) => {
						if (v.messageID != d.messageID && v.date != d.date) {
							return v;
						}
					});
				}
				if (
					d &&
					d.token &&
					d.token != window.localStorage.getItem("token")
				) {
					window.localStorage.setItem("token", d.token);
				}
				if (d && d.code === 999) {
					let href = window.location.href;
					let pathname = window.appHistory.location.pathname;
					let search = href.split("?")[1]
						? href.split("?")[1].replace(/^\?/, "")
						: "";
					window.appHistory.replace({
						pathname: "/login",
						search: `from=${window.Util.encryptPass(
							JSON.stringify({
								pathname: pathname,
								search: search
							})
						)}`
					});
				}
				if (
					this.handler &&
					this.handler["message"] &&
					this.handler["message"].length > 0
				) {
					this.handler["message"].map((v: Function) => {
						v(evt && d);
					});
				}
			};
			this.ws.onerror = (evt: any) => {
				this.isConnect = false;
				this.reconnect();
				if (
					this.handler &&
					this.handler["error"] &&
					this.handler["error"].length > 0
				) {
					this.handler["error"].map((v: Function) => {
						v(evt);
					});
				}
			};
		}
	}
	public onOpen(openFun: Function) {
		if (openFun && typeof openFun === "function") {
			if (!this.handler["open"]) {
				this.handler["open"] = [];
			}
			this.handler["open"].push(openFun);
		}
	}
	public send(data: any, isInQueue?: boolean) {
		let token = window.localStorage.getItem("token");
		if (!token) {
			console.log("获取token失败");
			return;
		}
		if (this.ws) {
			let d = data && data.data ? data.data : {};
			let sendD: any = {
				type: data.type,
				...data,
				data: {
					...d,
					token: token
				}
			};
			if (isInQueue) {
				this.messageID++;
				sendD.date = new Date().getTime();
				sendD.messageID = this.messageID;
				this.messageQueue.push(sendD);
			}
			console.log(
				`${data.date && data.messageID ? "重发" : ""}发送消息:`,
				sendD
			);
			let sd = window.Util.aesEnParams(JSON.stringify(sendD));
			try {
				switch (this.ws.readyState) {
					case 0:
						break;
					case 1:
						this.ws.send(sd);
						break;
					case 2:
						break;
					default:
						this.reconnect();
						break;
				}
			} catch (e) {
				this.reconnect();
			}
			this.checkHeart.reset();
		} else {
			throw new Error("socket连接出错");
		}
	}
	public onMessage(messageFun: Function) {
		if (messageFun && typeof messageFun === "function") {
			if (!this.handler["message"]) {
				this.handler["message"] = [];
			}
			this.handler["message"].push(messageFun);
		}
	}
	public onError(errorFun: Function) {
		if (errorFun && typeof errorFun === "function") {
			if (!this.handler["error"]) {
				this.handler["error"] = [];
			}
			this.handler["error"].push(errorFun);
		}
	}
	private resend() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if (this.messageQueue && this.messageQueue.length > 0) {
			this.messageQueue.map((v: any) => {
				this.send(v);
			});
		}
		this.timer = setTimeout(() => {
			this.resend();
		}, 1000 * 60);
	}
	public close() {
		this.ws.close();
		this.ws = null;
	}
	private checkHeart: any = {
		time: 1000 * 60 * 10,
		timeoutObj: null,
		reset: () => {
			clearTimeout(this.checkHeart.timeoutObj);
			this.checkHeart.timeoutObj = null;
			this.checkHeart.start();
		},
		start: () => {
			this.checkHeart.timeoutObj = setTimeout(() => {
				try {
					this.send({ type: "checkheart" });
					this.checkHeart.reset();
				} catch (e) {
					this.reconnect();
				}
			}, this.checkHeart.time);
		}
	};
	public reconnect() {
		if (this.isConnect) {
			return;
		}
		//this.isConnect = true;
		console.log("socket将在2秒后重连");
		setTimeout(() => {
			this.init();
		}, 2000);
	}
}
