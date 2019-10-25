import * as React from "react";
import * as routerDom from "react-router-dom";
import * as Loadable from "react-loadable";
import NoPath from "./entries/nopath/index";
import PrivateRoute from "./components/main/index";
const { Route, Switch, Redirect }: any = routerDom;

let pathConfig = [
	{
		name: "Home",
		src: "./entries/home",
		path: "/",
		isPrivate: true
	},
	{
		name: "Message",
		src: "./entries/message",
		path: "/message",
		isPrivate: true
	},
	{
		name: "Login",
		src: "./entries/login",
		path: "/login",
		isPrivate: false
	},
	// 形象
	{
		name: "Figure",
		src: "./entries/figure",
		path: "/character/figure",
		isPrivate: true
	},
	// 人设
	{
		name: "Character",
		src: "./entries/character",
		path: "/character",
		isPrivate: true
	},
	{
		name: "Account",
		src: "./entries/account",
		path: "/account",
		isPrivate: true
	},
	{
		name: "Task",
		src: "./entries/task",
		path: "/task",
		isPrivate: true
	},
	// 节点证书
	{
		name: "Certificate",
		src: "./entries/certificate",
		path: "/certificate",
		isPrivate: true
	},
	{
		name: "OperationLogs",
		src: "./entries/operationlogs",
		path: "/operationlogs",
		isPrivate: true
	},
	{
		name: "Source",
		src: "./entries/source",
		path: "/source",
		isPrivate: true
	},
	{
		name: "Setting",
		src: "./entries/setting",
		path: "/setting",
		isPrivate: true
	},
	{
		name: "UserInfo",
		src: "./entries/userinfo",
		path: "/userinfo",
		isPrivate: true
	},
	{
		name: "Analysis",
		src: "./entries/analysis",
		path: "/analysis",
		isPrivate: true
	},
	{
		name: "Download",
		src: "./entries/download",
		path: "/download",
		isPrivate: true
	},
	{
		name: "Screen",
		src: "./entries/screen",
		path: "/screen",
		isPrivate: true
	},
	//编辑
	{
		name: "FigureEdit",
		src: "./entries/figureedit",
		path: "/character/figure/edit",
		isPrivate: true
	},
	{
		name: "SourceShuoshuo",
		src: "./entries/sourceshuoshuo",
		path: "/source/shuoshuo",
		isPrivate: true
	},
	{
		name: "Manager",
		src: "./entries/manager",
		path: "/manager",
		isPrivate: true
	},
	{
		name: "AccountEdit",
		src: "./entries/accountedit",
		path: "/account/edit",
		isPrivate: true
	},
	//详情
	{
		name: "FigureDetail",
		src: "./entries/figuredetail",
		path: "/character/figure/detail",
		isPrivate: true
	},
	//数据统计
	{
		name: "DataCensus",
		src: "./entries/datacensus",
		path: "/datacensus",
		isPrivate: true
	},
	//模板
	{
		name: "Template",
		src: "./entries/template",
		path: "/account/template",
		isPrivate: true
	}
];

let componentObj: any = {};
const createLoadable = function() {
	let res: any = [];
	pathConfig.map((item: any, index: any): any => {
		componentObj[item.name] = Loadable({
			loader: () => import(item.src + ""),
			loading: (): any => <div className="nodatabox">正在加载...</div>
		});
		if (item.isPrivate) {
			res.push(
				<PrivateRoute
					key={index}
					path={item.path}
					exact
					component={componentObj[item.name]}
				/>
			);
		} else {
			res.push(
				<Route
					key={index}
					path={item.path}
					exact
					component={componentObj[item.name]}
				/>
			);
		}
	});
	return res;
};
let routes = createLoadable();

export default () => {
	return (
		<Switch>
			{...routes}
			<Route path="/404" exact component={NoPath} />
			<Redirect
				from="*"
				to={{
					pathname: "/404"
				}}
				component={NoPath}
			/>
		</Switch>
	);
};
