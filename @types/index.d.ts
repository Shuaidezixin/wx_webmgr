//全局ts接口
interface Window {
	__REDUX_DEVTOOLS_EXTENSION__?: any;
	appHistory?: any;
	CryptoJS?: any;
	firstWordUpcase?: any;
	Base64?: any;
	requestUrl?: string;
	store?: any;
	Util: Util;
	moment: any;
	isApp: any;
	platform: any;
	openAppDetail: Function;
	appName: string;
	pageTitle: string;
	managerAction: any;
	viliAuth: (str: string, str: string) => boolean;
	clipboardData: any;
	changeMessageType: any;
	webkitURL: any;
	childPageMessage: any;
	childPageScreen: any;
}
interface Document {
	selection: any;
}
interface Util {
	getQuery: (str: string) => any;
	singleCheckReducer: any;
	allCheckReducer: any;
	firstWordUpcase: (str: string) => string;
	vilidPhone: (str: string) => boolean;
	vilidTel: (str: string) => boolean;
	encryptPass: (str: string) => string;
	decryptPass: (str: string) => any;
	vilidEmail: (str: string) => boolean;
	vilidString: (str: string) => boolean;
	getBroswer: Function;
	parseNumber: Function;
	InputChange: Function;
	forbidAutoComplete: Function;
	aesEnParams: Function;
	aesDeParams: Function;
	viliAuth: (parent: string, sub: string) => boolean;
	toPassword: (str: string) => string;
	insertText: (obj: any, str: string) => string;
}

interface BaseListState {
	page: number;
	pagesize?: number;
}
interface BaseListProps {
	path?: string;
	location?: any;
}

interface WebSocket {
	onOpen: () => {};
	send: (data: any) => {};
	onMessage: (data: any) => {};
	onError: () => {};
	close: () => {};
	close: () => {};
	reconnect: () => {};
}
declare module "braft-utils/dist";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";
declare module "*.xlsx";
