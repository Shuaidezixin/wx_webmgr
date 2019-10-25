export default class AppSocket {
	private wsurl: string;
	private ws: WebSocket;
	private handler: any;
	private messageQueue: any[];
	public isConnect: boolean = false;
	private messageID: number;
	private timer: any = null;
	constructor(wsurl: string) {
		this.wsurl = wsurl;
		this.handler = {};
		//this.inQueue = inQueue ? true : false;
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
			//this.reconnect();
		}
		if (this.ws) {
			this.ws.onopen = () => {
				console.log("websocket连接成功");
				this.isConnect = true;
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
				if (
					this.handler &&
					this.handler["message"] &&
					this.handler["message"].length > 0
				) {
					this.handler["message"].map((v: Function) => {
						v(evt && evt.data);
					});
				}
			};
			this.ws.onerror = (evt: any) => {
				this.isConnect = false;
				//this.reconnect();
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
	public send(data: string, isInQueue?: boolean) {
		if (this.ws) {
			console.log(`发送消息`, data);
			try {
				switch (this.ws.readyState) {
					case 0:
						break;
					case 1:
						this.ws.send(data);
						break;
					case 2:
						break;
					default:
						//this.reconnect();
						break;
				}
			} catch (e) {
				//this.reconnect();
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
					this.send("checkheart");
					this.checkHeart.reset();
				} catch (e) {
					//this.reconnect();
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
