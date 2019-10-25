/**
 * 	项目整体布局
 * 		左侧的menu栏
 * 		右侧的所有页面内容
 */
import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import Toast from "@component/toast";
import MenuBox from "../menubox/index";
import defaultPic from "@img/default.jpg";

import "./index.less";
let userInfo: any, authArr: string[];

const getFakeAuth = function(path: string): boolean {
	authArr = [
		"/",
		// "/figure",
		"/account",
		"/task",
		"/operationlogs",
		"/source",
		"/message",
		"/manager",
		"/setting",
		"/userinfo",
		"/analysis",
		"/download",
		"/screen",
		"/certificate",
		"/character",
		"/datacensus"
	];
	// if (
	// 	authArr.indexOf(path.replace("/edit", "")) != -1 ||
	// 	authArr.indexOf(path.replace("/detail", "")) != -1 ||
	// 	authArr.indexOf(path.replace("/shuoshuo", "")) != -1 ||
	// 	authArr.indexOf(path.replace("/figure", "")) != -1
	// ) {
	// 	return true;
	// }
	let reg = /(\/.*?)(\/)/gi;
	let res = reg.exec(path);
	if (res && res.length > 2) {
		if (authArr.includes(res[1])) {
			return true;
		}
	} else {
		if (authArr.includes(path)) {
			return true;
		}
	}

	return false;
};
const getPageAuth = function(path: string): boolean {
	let token = window.localStorage.getItem("token");
	if (!token) {
		if (authArr.indexOf(path) != -1) {
			return false;
		}
		return true;
	}
	return true;
};
function loginOut() {
	window.localStorage.removeItem("token");
	if (window.childPageMessage) {
		window.childPageMessage.close();
	}
	if (window.childPageScreen) {
		window.childPageScreen.close();
	}
	window.appHistory.push({
		pathname: "/login"
	});
	window.location.reload();
}
function goUserInfo() {
	window.appHistory.push({
		pathname: "/userinfo"
	});
}
function openVersinInfo() {
	let desc = window.localStorage.getItem("systemversiondesc");
	Toast.info({
		title: "版本概要",
		content: desc,
		width: 600,
		wrapClassName: "version-toast"
	});
}
const PrivateRoute = ({ component: Component, ...rest }: any) => (
	<Route
		{...rest}
		render={props => {
			// init();
			const version = window.localStorage.getItem("systemversion");
			let m = window.localStorage.getItem("user");
			const user: any = m ? JSON.parse(window.Util.decryptPass(m)) : null;

			if (!getFakeAuth(rest.location.pathname)) {
				return (
					<Redirect
						to={{
							pathname: "/404"
						}}
					/>
				);
			}
			if (!getPageAuth(rest.location.pathname)) {
				return (
					<Redirect
						to={{
							pathname: "/login",
							search:
								`from=` +
								window.Util.encryptPass(
									JSON.stringify({
										pathname: location.pathname,
										search:
											location.search &&
											location.search.length > 0
												? location.search
												: ""
									})
								)
						}}
					/>
				);
			}
			if (rest.location.pathname == "/message") {
				return (
					<Component {...rest} key={JSON.stringify(rest.location)} />
				);
			}
			if (rest.location.pathname == "/screen") {
				return (
					<Component {...rest} key={JSON.stringify(rest.location)} />
				);
			}
			return (
				<div className="layout-page">
					{/* 左侧的menu栏 */}
					<div className="layout-menu-box">
						<div className="cms-header">微信群控</div>
						<div className="cms-version" onClick={openVersinInfo}>
							版本:{version}
						</div>
						<div className="cms-middle">
							<MenuBox {...rest} />
						</div>
						{/* {Toast.info({
							title: "版本概要",
							content: "萨达萨达萨达",
							width: 600
						})} */}
						{/* 底部头像信息 */}
						<div className="cms-footer">
							<div className="user" onClick={goUserInfo}>
								<img
									className="user-img"
									id="userImg"
									src={
										user &&
										user.touxiang &&
										user.touxiang.length > 0
											? user.touxiang
											: defaultPic
									}
								/>
								<div>
									<div className="text1">
										{user && user.nickname}
									</div>
									{/* <div className="text">
								{user && user.username}
							</div> */}
								</div>
							</div>
							<span className="login-out" onClick={loginOut}>
								退出
							</span>
						</div>
					</div>
					{/* 右侧内容部分 */}
					<div className="layout-content-box">
						<Component
							{...rest}
							key={JSON.stringify(rest.location)}
						/>
					</div>
				</div>
			);
		}}
	/>
);
export default PrivateRoute;
