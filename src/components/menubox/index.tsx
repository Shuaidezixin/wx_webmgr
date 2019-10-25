/**
 * 	左侧menu栏
 * 		navList:
 * 			isGroup:是否二级菜单
 * 			_name:显示的菜单文字
 * 			_icon:图标
 * 			_url:路由
 * 			_id:查看权限 后台提供
 */
import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "antd";
import "./index.less";
const SubMenu = Menu.SubMenu;
interface Props {
	path: any;
}
interface State {
	actions: any;
}
export default class MenuBox extends React.PureComponent<Props, State> {
	public navList: any[];
	public menuBoxInner: React.RefObject<HTMLDivElement>;
	public menuBox: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);
		this.menuBoxInner = React.createRef();
		this.menuBox = React.createRef();
		this.navList = [
			{
				isGroup: false,
				_name: "首页",
				_icon: "home",
				_url: "/",
				_id: "_home"
			},
			{
				isGroup: false,
				_name: "消息聊天",
				_icon: "message",
				_url: "/message",
				_id: "5cefaa84875bc01b14b759d9"
			},
			{
				isGroup: false,
				_name: "同屏传输",
				_icon: "credit-card",
				_url: "/screen",
				_id: "_home"
			},
			{
				isGroup: false,
				_name: "账户管理",
				_icon: "user",
				_url: "/account",
				_id: "5cebbb94e935680d0497d241"
			},
			// {
			// 	isGroup: false,
			// 	_name: "形象管理",
			// 	_icon: "solution",
			// 	_url: "/figure",
			// 	_id: "5cebbbb6e935680d0497d243"
			// },
			{
				isGroup: false,
				_name: "人设管理",
				_icon: "solution",
				_url: "/character",
				_id: "5cebbbb6e935680d0497d244"
			},
			{
				isGroup: false,
				_name: "素材管理",
				_icon: "book",
				_url: "/source",
				onClick: () => {
					window.sessionStorage.removeItem("sourceKey");
				},
				_id: "5cebbbc4e935680d0497d245"
			},
			{
				isGroup: false,
				_name: "任务执行",
				_icon: "profile",
				_url: "/task",
				_id: "5cebbbcee935680d0497d247"
			},
			{
				isGroup: false,
				_name: "任务统计",
				_icon: "line-chart",
				_url: "/datacensus",
				onClick: () => {
					window.sessionStorage.removeItem("dataCensusKey");
				},
				_id: "5cebbbcee935680d0497d248"
			},
			{
				isGroup: false,
				_name: "节点证书",
				_icon: "flag",
				_url: "/certificate",
				_id: "5cefaa84875bc01b14b759d7"
			},
			{
				isGroup: false,
				_name: "用户管理",
				_icon: "idcard",
				_url: "/manager",
				_id: "5cebbbd7e935680d0497d249"
			},
			{
				isGroup: false,
				_name: "数据分析",
				_icon: "dashboard",
				_url: "/analysis",
				_id: "5cebbbe3e935680d0497d24b"
			},
			{
				isGroup: false,
				_name: "系统设置",
				_icon: "setting",
				_url: "/setting",
				_id: "5cecedfbe935680834d83085"
			},
			{
				isGroup: false,
				_name: "软件下载",
				_icon: "android",
				_url: "/download",
				_id: "5cecedfbe935680834d83085"
			}
			// {
			// 	isGroup: false,
			// 	_name: "操作日志",
			// 	_icon: "bars",
			// 	_url: "/operationlogs",
			// 	_id: "5cecee08e935680834d83087"
			// }
			//operationlogs
			// {
			// 	isGroup: true,
			// 	_name: "首页",
			// 	_icon: "dashboard",
			// 	_id: 0,
			// 	child: [
			// 		{
			// 			_url: "/",
			// 			_name: "数据统计",
			// 			_id: 1
			// 		}
			// 	]
			// },
		];
	}
	readonly state: State = {
		actions: {
			_home: []
		}
	};
	public event = window.Util.getBroswer("Firefox")
		? "DOMMouseScroll"
		: "mousewheel";
	componentDidMount() {
		let outH = this.menuBox.current;
		this.getAction();
		outH.addEventListener(this.event, this.menuScroll.bind(this), false);
	}
	getAction() {
		let actions = window.localStorage.getItem("actions");
		if (actions) {
			let actionsObj = JSON.parse(window.Util.decryptPass(actions));
			let actObj: any = {};
			if (actionsObj) {
				actionsObj.map((item: any) => {
					if (!actObj[item.key]) {
						actObj[item.key] = [];
					}
					if (item.value && item.value.length > 0) {
						item.value.map((v: any) => {
							actObj[item.key].push(v._id);
						});
					}
				});
				let set: any = {
					...this.state.actions,
					...actObj
				};
				window.managerAction = set;
				this.setState({
					actions: {
						...set
					}
				});
			}
		}
	}
	//menu滚动
	menuScroll(e: any) {
		e.stopPropagation();
		let outH = this.menuBox.current;
		let inH = this.menuBoxInner.current;
		let outHeight = outH.clientHeight;
		let inHeight = inH.clientHeight;

		if (outHeight < inHeight) {
			let deltaY: number;
			deltaY = e.wheelDelta || e.detail * 30 * -1;
			let nt: string = inH.style.top ? inH.style.top : "0";
			let next: number = parseInt(nt) + deltaY;
			if (next > 0) {
				next = 0;
			}
			if (next < outHeight - inHeight) {
				next = outHeight - inHeight;
			}
			inH.style.top = next + "px";
		}
	}

	componentWillUnmount() {
		let outH = this.menuBox.current;
		outH.removeEventListener(this.event, this.menuScroll, false);
	}
	public setMenu(path: string) {
		var pathname = path.toLowerCase();
		var number: number, key: any;
		this.navList.map((item, idx) => {
			if (!item.isGroup) {
				let path = item._url;
				var reg = new RegExp("^" + path + "/");
				if (pathname == item._url || reg.test(pathname)) {
					key = idx;
				}
			}
			if (item.isGroup && item.child && item.child.length > 0) {
				item.child.map((v: any, k: number) => {
					let path = v._url;
					var reg = new RegExp("^" + path + "/");
					if (pathname == v._url || reg.test(pathname)) {
						number = idx;
						key = `${idx}_${k}`;
					}
				});
			}
		});
		let res: any = {
			defaultSelectedKeys: [`sub_${key}`]
		};
		if (number != null) {
			res.defaultOpenKeys = [`sub_${number}`];
		}
		return res;
	}
	public render() {
		let navList = this.navList;
		let { actions } = this.state;
		let { path } = this.props;
		return (
			<div className="menu-box" ref={this.menuBox}>
				<div
					className="menu-box-inner"
					ref={this.menuBoxInner}
					style={{ top: "0px" }}
				>
					<Menu
						theme="dark"
						mode="inline"
						forceSubMenuRender={true}
						{...this.setMenu(path)}
					>
						{navList &&
							navList.length > 0 &&
							navList.map((item: any, index: number) => {
								if (item.isGroup) {
									return (
										<SubMenu
											key={"sub_" + index}
											title={
												<span>
													<Icon type={item._icon} />
													{item._name}
												</span>
											}
										>
											{item.child &&
												item.child.length > 0 &&
												item.child.map(
													(v: any, i: number) => {
														return (
															<Menu.Item
																key={
																	"sub_" +
																	index +
																	"_" +
																	i
																}
															>
																{path !==
																	v._url && (
																	<Link
																		to={{
																			pathname:
																				v._url
																		}}
																	>
																		{
																			v._name
																		}
																	</Link>
																)}
																{path ===
																	v._url && (
																	<span>
																		{
																			v._name
																		}
																	</span>
																)}
															</Menu.Item>
														);
													}
												)}
										</SubMenu>
									);
								} else {
									if (!actions || !actions[item._id]) {
										return null;
									}
									if (item._url == "/message") {
										return (
											<Menu.Item
												key={"sub_" + index}
												onClick={
													item.onClick
														? item.onClick
														: null
												}
												disabled
											>
												<div
													onClick={() => {
														let w = window.open(
															"/#/message",
															"message"
														);
														window.childPageMessage = w;
													}}
												>
													<Icon type={item._icon} />
													{item._name}
												</div>
											</Menu.Item>
										);
									}
									if (item._url == "/screen") {
										return (
											<Menu.Item
												key={"sub_" + index}
												onClick={
													item.onClick
														? item.onClick
														: null
												}
												disabled
											>
												<div
													onClick={() => {
														let s = window.open(
															"/#/screen",
															"screen"
														);
														window.childPageScreen = s;
													}}
												>
													<Icon type={item._icon} />
													{item._name}
												</div>
											</Menu.Item>
										);
									}
									return (
										<Menu.Item
											key={"sub_" + index}
											onClick={
												item.onClick
													? item.onClick
													: null
											}
										>
											{path !== item.path && (
												<Link
													to={{
														pathname: item._url
													}}
												>
													<Icon type={item._icon} />
													{item._name}
												</Link>
											)}
											{path === item._url && (
												<span>
													<Icon type={item._icon} />
													{item._name}
												</span>
											)}
										</Menu.Item>
									);
								}
							})}
					</Menu>
				</div>
			</div>
		);
	}
}
