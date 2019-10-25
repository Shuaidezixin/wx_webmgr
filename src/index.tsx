import * as React from "react";
import * as ReactDom from "react-dom";
import { LocaleProvider } from "antd";
import { Provider } from "react-redux";
import * as Util from "./utils/util";
import * as history from "history";
import zhCN from "antd/lib/locale-provider/zh_CN";
import "./assets/css/theme.less";
import "./assets/css/base.less";
import "./assets/css/common.less";
import { Router } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import storeFun from "./store";
import * as moment from "moment";
import Routes from "./routes";
let store: any = storeFun();
let appHistory: any = history.createHashHistory();
window.moment = moment;
window.appHistory = appHistory;
window.Util = Util;
window.store = store;
window.appName = "微信群控";
const render = (Component: any) => {
	ReactDom.render(
		<LocaleProvider locale={zhCN}>
			<Provider store={store}>
				<Router history={appHistory}>
					<Component />
				</Router>
			</Provider>
		</LocaleProvider>,
		document.getElementById("root")
	);
};
render(Routes);
registerServiceWorker();
