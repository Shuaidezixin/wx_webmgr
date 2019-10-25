import * as React from "react";
import { itemMap } from "./map";
import { Icon, message } from "antd";
import * as moment from "moment";
import Toast from "@component/toast";
import TopNav from "../components/topnav";
import Step0 from "../components/step0";
import Step1 from "../components/step1";
import Step2 from "../components/step2";
import Step3 from "../components/step3";
import Step4 from "../components/step4";
import Step5 from "../components/step5";
import Step6 from "../components/step6";
import Step7 from "../components/step7";
import "./index.less";
interface Props {
	addFigureAction?: Function;
	provincesList?: any;
	cityList?: any;
	getProvincesListAction?: Function;
	getCityListAction?: Function;
	figureDetail?: any;
	getFigureDetailAction?: Function;
	getSettingTaskAction?: Function;
	settingTask?: any;
}
interface State {
	activeIdx: number;
	basic: any;
	userinfo: any;
	addfriend: any;
	pyq: any;
	gzh: any;
	sc: any;
	viewfriend: any;
	chatconfig: any;
	figureID: string;
	openList: any[];
}
export default class Root extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		activeIdx: -1,
		figureID: "",
		openList: [],
		basic: {
			active_time: "",
			age: 0,
			areaArr: [],
			desc: "",
			name: "",
			profession: "",
			sex: 1,
			areaChina: [],
			autoaddinsidefriend: false
		},
		userinfo: {
			userinfo_addfriend_valid: "0;0;0",
			userinfo_moshengren_10: "0;0;0",
			userinfo_nickName: "0;0;0",
			userinfo_portrait: "0;0;0",
			userinfo_profile: "0;0;0",
			userinfo_pyq_all: "0;0;0",
			userinfo_pyq_3_day: "0;0;0",
			userinfo_pyq_half_year: "0;0;0",
			userinfo_pyq_pic: "0;0;0",
			userinfo_pyq_update: "0;0;0",
			userinfo_tuijianhaoyou: "0;0;0",
			userinfo_username: "0;0;0",
			userinfo_sex: "0;0;0",
			userinfo_area: "0;0;0",
			userinfo_address: "0;0;0"
		},
		addfriend: {
			// addfriend_count: "0;0",
			addfriend_jiansuo: "0;0;0;0",
			addfriend_qun: "0;0;0;0",
			addfriend_time_minus: "0;0",
			addfriend_tongxunlu: "0;0;0;0"
		},
		pyq: {
			//pyq_count: "0;0",
			pyq_dakaiyuedu: "0;0;0;0",
			pyq_delete: "0;0;0;0",
			pyq_dianzan: "0;0;0;0",
			pyq_download_pic: "0;0;0;0",
			pyq_download_video: "0;0;0;0",
			pyq_liulan: "0;0;0;0",
			pyq_sc_link: "0;0;0;0",
			pyq_sc_pic: "0;0;0;0",
			pyq_sc_text: "0;0;0;0",
			pyq_sc_video: "0;0;0;0",
			pyq_sentshuoshuo: "0;0;0;0",
			pyq_time_minus: "0;0",
			pyq_zhuanfa_chat: "0;0;0;0",
			pyq_zhuanfa_pyq: "0;0;0;0",
			pyq_share_link: "0;0;0;0"
		},
		gzh: {
			Gzh_yulan: "0;0;0;0",
			// gzh_count: "0;0",
			gzh_guanzhu: "0;0;0;0",
			gzh_guanzhu_cancel: "0;0;0;0",
			gzh_qingkong: "0;0;0;0",
			gzh_search: "0;0;0;0",
			gzh_shanchu: "0;0;0;0",
			gzh_soucang: "0;0;0;0",
			gzh_time_minus: "0;0",
			gzh_yuedu: "0;0;0;0",
			gzh_zhuanfa_chat: "0;0;0;0",
			gzh_zhuanfa_pyq: "0;0;0;0",
			gzh_zhuanfa_top: "0;0;0;0"
		},
		sc: {
			// sc_count: "0;0",
			sc_time_minus: "0;0",
			SC_dakaiyulan: "0;0;0;0",
			SC_read: "0;0;0;0",
			SC_delete: "0;0;0;0",
			sc_zhuanfa_link_pyq: "0;0;0;0",
			SC_zhuanfa_link_chat: "0;0;0;0",
			SC_shaixuan: "0;0;0;0",
			SC_add_note: "0;0;0;0",
			SC_zhuanfa_note_pyq: "0;0;0;0",
			SC_zhuanfa_note_chat: "0;0;0;0"
		},
		viewfriend: {
			// ViewFriend_Count: "0;0",
			ViewFriend_Time_Minus: "0;0",
			ViewFriend_zhuye: "0;0;0;0",
			ViewFriend_pyq: "0;0;0;0",
			ViewFriend_more_info: "0;0;0;0",
			ViewFriend_set_star: "0;0;0;0",
			ViewFriend_delete: "0;0;0;0"
		},
		chatconfig: {
			// ChatConfig_Count: "0;0",
			ChatConfig_Time_Minus: "0;0",
			ChatConfig_AddBiaoqin: "0;0;0;0",
			ChatConfig_RemoveBiaoqin: "0;0;0;0",
			ChatConfig_AddPackageBiaoqin: "0;0;0;0",
			ChatConfig_RemovePackageBiaoqin: "0;0;0;0",
			ChatConfig_LookPackageBiaoqin: "0;0;0;0",
			ChatConfig_One_Top: "0;0;0;0",
			ChatConfig_One_Sc: "0;0;0;0",
			ChatConfig_One_Miandarao: "0;0;0;0",
			ChatConfig_One_Qiangtixing: "0;0;0;0",
			ChatConfig_One_Backpic: "0;0;0;0",
			ChatConfig_One_ClearContent: "0;0;0;0",
			ChatConfig_Group_New: "0;0;0;0",
			ChatConfig_Group_Addfrined: "0;0;0;0",
			ChatConfig_Group_Deletefrined: "0;0;0;0",
			ChatConfig_Group_NameUpdate: "0;0;0;0",
			ChatConfig_Group_Miandaran: "0;0;0;0",
			ChatConfig_Group_Save: "0;0;0;0",
			ChatConfig_Group_ShowNickname: "0;0;0;0",
			ChatConfig_Group_Top: "0;0;0;0",
			ChatConfig_Group_MyNameUpdate: "0;0;0;0",
			ChatConfig_Group_Clear: "0;0;0;0",
			ChatConfig_Group_Backpic: "0;0;0;0",
			ChatConfig_Group_DeleteAndQuit: "0;0;0;0",
			ChatConfig_InSideScript: "0;0;0;0",
			ChatConfig_ExtensionScript: "0;0;0;0"
		}
	};
	async componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "形象");
		let actIDX = window.sessionStorage.getItem("figureActiveIDX");
		let figureID = window.sessionStorage.getItem("figureID");
		if (actIDX) {
			this.setState({
				activeIdx: Number(actIDX)
			});
		} else {
			this.setState({
				activeIdx: 0
			});
		}
		if (figureID) {
			let res = await this.props.getFigureDetailAction({
				figure_id: figureID
			});
			if (res && res.code == 200) {
				let data = res.data;
				let set: any = {};
				let state: any = this.state;
				for (let key in data) {
					if (data[key]) {
						if (data[key] && key != "basic") {
							for (let k in data[key]) {
								if (!data[key][k] || data[key][k].length <= 0) {
									data[key][k] = "0;0;0;0";
								}
							}
						}
						set[key] = { ...state[key], ...data[key] };
					}
				}
				this.setState({
					...set,
					figureID: figureID
				});
			}
		}
		// 请求任务列表
		let res = await this.props.getSettingTaskAction();

		/******  将isauto为true的所有key值push到一个openList中 ******/
		let settingTask = this.props.settingTask;
		if (
			settingTask &&
			settingTask.taskinfos &&
			settingTask.taskinfos.length > 0
		) {
			let arr = settingTask.taskinfos.filter((v: any) => v.isauto);
			let set: any = [];
			arr.map((v: any) => {
				set.push(v.key);
			});
			this.setState({
				openList: [...set]
			});
		}
	}
	hotCheck(arr: any, key: string) {
		let res: any = {};
		if (Number(arr[3]) < Number(arr[2]) || Number(arr[3] <= 0)) {
			res.hasError = true;
			res.errorName = (
				<span>
					<i style={{ color: "red" }}> {itemMap[key]}</i>
					行为时间后面数字必须大于等于前面数字并且不能小于0
				</span>
			);
		}
		return res;
	}
	public async navChange(idx: number | string, type: string) {
		if (idx < this.state.activeIdx) {
			window.sessionStorage.setItem("figureActiveIDX", idx.toString());
			this.setState({
				activeIdx: Number(idx)
			});
			return;
		}
		let params: any = {};
		let id = window.sessionStorage.getItem("figureID");
		if (id) {
			params.figure_id = id;
		}
		let hasError: boolean = false;
		let errorName: any = "";
		///基本信息保存
		if (type == "basic") {
			let { basic } = this.state;
			params.basic = this.state.basic;
			if (!basic.name || basic.name.trim().length <= 0) {
				hasError = true;
				errorName = (
					<span>
						<i style={{ color: "red" }}>名称</i> 不能为空
					</span>
				);
			} else if (!basic.active_time || basic.active_time.length <= 0) {
				hasError = true;
				errorName = (
					<span>
						<i style={{ color: "red" }}>活跃时间</i> 不能为空
					</span>
				);
			} else {
				let activeArr = basic.active_time.split("_");
				if (
					activeArr.indexOf("undefined") != -1 ||
					activeArr.length < 2
				) {
					hasError = true;
					errorName = (
						<span>
							<i style={{ color: "red" }}>活跃时间</i> 不能为空
						</span>
					);
				} else {
					if (
						moment(activeArr[0], "HH").isAfter(
							moment(activeArr[1], "HH")
						)
					) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}>活跃时间</i>{" "}
								起始时间不能大于结束时间
							</span>
						);
					}
				}
			}

			if (hasError) {
				message.error(errorName);
				return;
			}
		}
		//账户及隐私
		if (type == "userinfo") {
			let userData = this.state.userinfo;
			for (let userKey in userData) {
				let arr = userData[userKey].split(";");
				if (
					arr[0] == 1 &&
					(Number(arr[2]) < Number(arr[1]) || Number(arr[2]) < 0)
				) {
					hasError = true;
					errorName = (
						<span>
							<i style={{ color: "red" }}>{itemMap[userKey]}</i>{" "}
							后面数字必须大于等于前面数字
						</span>
					);
					break;
				}
			}
			if (hasError) {
				message.error(errorName);
				return;
			}
			params.userinfo = userData;
		}
		//加好友
		if (type == "addfriend") {
			let data = this.state.addfriend;
			for (let key in data) {
				let arr = data[key].split(";");
				if (key == "addfriend_time_minus") {
					if (Number(arr[0]) < 5) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}> {itemMap[key]}</i>
								每次任务间隔不能低于5分钟
							</span>
						);
						break;
					}

					if (
						(Number(arr[0]) == 0 && Number(arr[1]) == 0) ||
						Number(arr[1]) < Number(arr[0])
					) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}> {itemMap[key]}</i>
								后面数字必须大于等于前面数字并且不能同时为0
							</span>
						);
						break;
					}
				}
				if (arr[0] == 1) {
					if (
						(Number(arr[3]) < Number(arr[2]) ||
							Number(arr[3] <= 0)) &&
						!hasError
					) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}> {itemMap[key]}</i>
								行为时间后面数字必须大于等于前面数字并且不能小于0
							</span>
						);
					}
					if (hasError) {
						break;
					}
				}
			}
			if (hasError) {
				message.error(errorName);
				return;
			}
			params.addfriend = data;
		}
		//朋友圈
		if (type == "pyq") {
			let data = this.state.pyq;
			for (let key in data) {
				let arr = data[key].split(";");
				if (key == "pyq_time_minus") {
					if (
						(Number(arr[0]) == 0 && Number(arr[1]) == 0) ||
						Number(arr[1]) < Number(arr[0])
					) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}> {itemMap[key]}</i>
								后面数字必须大于等于前面数字并且不能同时为0
							</span>
						);
						break;
					}
				}
				if (arr[0] == 1) {
					let check: any;
					switch (key) {
						case "pyq_sentshuoshuo":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "pyq_liulan":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "pyq_dakaiyuedu":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "pyq_dianzan":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						default:
							if (
								(Number(arr[3]) < Number(arr[2]) ||
									Number(arr[3] < 0)) &&
								!hasError
							) {
								hasError = true;
								errorName = (
									<span>
										<i style={{ color: "red" }}>
											{" "}
											{itemMap[key]}
										</i>
										行为时间后面数字必须大于等于前面数字
									</span>
								);
							}
							break;
					}
					if (hasError) {
						break;
					}
				}
			}
			if (hasError) {
				message.error(errorName);
				return;
			}
			params.pyq = data;
		}
		//公众号
		if (type == "gzh") {
			let data = this.state.gzh;
			for (let key in data) {
				let arr = data[key].split(";");
				if (key == "gzh_time_minus") {
					if (
						(Number(arr[0]) == 0 && Number(arr[1]) == 0) ||
						Number(arr[1]) < Number(arr[0])
					) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}> {itemMap[key]}</i>
								后面数字必须大于等于前面数字并且不能同时为0
							</span>
						);
						break;
					}
				}
				if (arr[0] == 1) {
					let check: any;
					switch (key) {
						case "Gzh_yulan":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "gzh_yuedu":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						default:
							if (
								(Number(arr[3]) < Number(arr[2]) ||
									Number(arr[3] < 0)) &&
								!hasError
							) {
								hasError = true;
								errorName = (
									<span>
										<i style={{ color: "red" }}>
											{" "}
											{itemMap[key]}
										</i>
										行为时间后面数字必须大于等于前面数字
									</span>
								);
							}
							break;
					}
					if (hasError) {
						break;
					}
				}
			}
			if (hasError) {
				message.error(errorName);
				return;
			}
			params.gzh = data;
		}
		//消息设置
		if (type == "chatconfig") {
			let data = this.state.chatconfig;
			for (let key in data) {
				let arr = data[key].split(";");
				if (key == "ChatConfig_Time_Minus") {
					if (
						(Number(arr[0]) == 0 && Number(arr[1]) == 0) ||
						Number(arr[1]) < Number(arr[0])
					) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}> {itemMap[key]}</i>
								后面数字必须大于等于前面数字并且不能同时为0
							</span>
						);
						break;
					}
				}
				if (arr[0] == 1) {
					let check: any;
					switch (key) {
						case "ChatConfig_One_Top":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "ChatConfig_InSideScript":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "ChatConfig_ExtensionScript":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "ChatConfig_AddPackageBiaoqin":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "ChatConfig_RemovePackageBiaoqin":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						case "ChatConfig_LookPackageBiaoqin":
							check = this.hotCheck(arr, key);
							hasError = check.hasError;
							errorName = check.errorName;
							break;
						default:
							if (
								Number(arr[3]) < Number(arr[2]) ||
								(Number(arr[3] < 0) && !hasError)
							) {
								hasError = true;
								errorName = (
									<span>
										<i style={{ color: "red" }}>
											{" "}
											{itemMap[key]}
										</i>
										行为时间后面数字必须大于等于前面数字
									</span>
								);
							}
							break;
					}
					if (hasError) {
						break;
					}
				}
			}

			if (hasError) {
				message.error(errorName);
				return;
			}
			params.chatconfig = data;
		}
		//查看好友资料
		if (type == "viewfriend") {
			let data = this.state.viewfriend;
			for (let key in data) {
				let arr = data[key].split(";");
				if (arr[0] == 1) {
					if (
						(Number(arr[3]) < Number(arr[2]) ||
							Number(arr[2] < 0)) &&
						!hasError
					) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}> {itemMap[key]}</i>
								行为时间后面数字必须大于等于前面数字并且不能小于0
							</span>
						);
					}
					if (hasError) {
						break;
					}
				}
			}
			if (hasError) {
				message.error(errorName);
				return;
			}
			params.viewfriend = data;
		}
		//收藏
		if (type == "sc") {
			let data = this.state.sc;
			for (let key in data) {
				let arr = data[key].split(";");
				if (arr[0] == 1) {
					if (
						(Number(arr[3]) < Number(arr[2]) ||
							Number(arr[2] < 0)) &&
						!hasError
					) {
						hasError = true;
						errorName = (
							<span>
								<i style={{ color: "red" }}> {itemMap[key]}</i>
								行为时间后面数字必须大于等于前面数字并且不能小于0
							</span>
						);
					}
					if (hasError) {
						break;
					}
					break;
				}
			}
			if (hasError) {
				message.error(errorName);
				return;
			}
			params.sc = data;
		}
		let load = Toast.loading("数据保存中，请稍候...", 0);
		let res = await this.props.addFigureAction({
			figure_obj: JSON.stringify(params)
		});
		load.close();
		if (res && res.code == 200) {
			window.sessionStorage.setItem("figureID", res.data.figure_id);
			message.success("保存成功");
			//记录当前页码 确定刷新的额时候保持页面
			if (idx == "last") {
				setTimeout(() => {
					window.appHistory.push({
						pathname: "/character/figure"
					});
				}, 1500);
			} else {
				window.sessionStorage.setItem(
					"figureActiveIDX",
					idx.toString()
				);
				this.setState({
					activeIdx: Number(idx)
				});
			}
		}
	}
	// step0
	step0Change(data: any) {
		if (!data) {
			return;
		}
		let changeData: any;
		switch (data.type) {
			case "areaArr":
				let china: any[] = [];
				if (data.valueChina && data.valueChina.length > 0) {
					data.valueChina.map((item: any) => {
						china.push(item.label);
					});
				}
				changeData = {
					basic: {
						...this.state.basic,
						areaArr: [...data.value],
						area: data.value[0],
						area_sub: data.value[1],
						areaChina: china
					}
				};
				break;
			case "name":
				changeData = {
					basic: {
						...this.state.basic,
						name: data.value
					}
				};
				break;
			case "desc":
				changeData = {
					basic: {
						...this.state.basic,
						desc: data.value
					}
				};
				break;
			case "sex":
				changeData = {
					basic: {
						...this.state.basic,
						sex: data.value
					}
				};
				break;
			case "age":
				changeData = {
					basic: {
						...this.state.basic,
						age: data.value
					}
				};
				break;
			case "profession":
				changeData = {
					basic: {
						...this.state.basic,
						profession: data.value
					}
				};
				break;
			case "active_time":
				changeData = {
					basic: {
						...this.state.basic,
						active_time: data.value
					}
				};
				break;
			case "autoaddinsidefriend":
				changeData = {
					basic: {
						...this.state.basic,
						autoaddinsidefriend: data.value
					}
				};
				break;
		}
		this.setState({ ...changeData });
	}
	// step1
	step1Change(data: any) {
		let set: any = {};
		let changeStr = "";
		if (data && data.value && data.value instanceof Array) {
			data.value.map((item: any, idx: number) => {
				if (idx == 0) {
					changeStr += item;
				} else {
					changeStr += ";" + item;
				}
			});
		}
		set = {
			[data.type]: changeStr
		};

		this.setState({
			userinfo: {
				...this.state.userinfo,
				...set
			}
		});
	}
	// step2
	step2Change(data: any) {
		let set: any = {
			[data.key]: data.value.join(";")
		};
		this.setState({
			addfriend: {
				...this.state.addfriend,
				...set
			}
		});
	}
	// step3
	step3Change(data?: any) {
		let set: any = {
			[data.key]: data.value.join(";")
		};
		this.setState({
			chatconfig: {
				...this.state.chatconfig,
				...set
			}
		});
	}
	// step4
	step4Change(data: any) {
		let set: any = {
			[data.key]: data.value.join(";")
		};
		this.setState({
			pyq: {
				...this.state.pyq,
				...set
			}
		});
	}
	// step5
	step5Change(data: any) {
		let set: any = {
			[data.key]: data.value.join(";")
		};
		this.setState({
			gzh: {
				...this.state.gzh,
				...set
			}
		});
	}
	// step6
	step6Change(data: any) {
		let set: any = {
			[data.key]: data.value.join(";")
		};
		this.setState({
			sc: {
				...this.state.sc,
				...set
			}
		});
	}
	// step7
	step7Change(data?: any) {
		let set: any = {
			[data.key]: data.value.join(";")
		};
		this.setState({
			viewfriend: {
				...this.state.viewfriend,
				...set
			}
		});
	}
	public render() {
		let {
			activeIdx,
			basic,
			userinfo,
			addfriend,
			pyq,
			gzh,
			sc,
			chatconfig,
			viewfriend,
			figureID,
			openList
		} = this.state;
		if (
			!window.viliAuth(
				"5cebbbb6e935680d0497d243",
				"5cebbf39e935680428222b9f"
			)
		) {
			return (
				<div style={{ textAlign: "center", padding: "100px 0" }}>
					无权限
				</div>
			);
		}
		return (
			<div className="figure-edit-page">
				<div className="title">
					形象
					<Icon
						type="question-circle"
						style={{
							fontSize: "20px",
							color: "#a4a4a4",
							marginLeft: "10px"
						}}
						title="形象是控制微信每天自动执行任务的依据，当微信账户绑定形象后，微信就按照形象配置来执行每天的任务。形象配置得越详细，微信操作的真人行为模拟效果更好。可根据不同的需求配置丰富而又不同的形象。"
					/>
				</div>
				<div className="nav-box">
					<div className="edit-container">
						<TopNav
							activeIndex={activeIdx}
							onChange={this.navChange.bind(this)}
							isCanClickNav={figureID && figureID.length > 0}
						/>
					</div>
				</div>
				<div className="edit-container stepbox">
					{activeIdx == 0 && (
						<Step0
							getProvincesListAction={
								this.props.getProvincesListAction
							}
							getCityListAction={this.props.getCityListAction}
							cityList={this.props.cityList}
							provincesList={this.props.provincesList}
							data={basic}
							onChange={this.step0Change.bind(this)}
						/>
					)}
					{activeIdx == 1 && (
						<Step1
							data={userinfo}
							settingTask={openList}
							onChange={this.step1Change.bind(this)}
						/>
					)}
					{activeIdx == 2 && (
						<Step2
							data={addfriend}
							settingTask={openList}
							onChange={this.step2Change.bind(this)}
						/>
					)}
					{activeIdx == 3 && (
						<Step3
							data={chatconfig}
							settingTask={openList}
							onChange={this.step3Change.bind(this)}
						/>
					)}
					{activeIdx == 4 && (
						<Step4
							data={pyq}
							settingTask={openList}
							onChange={this.step4Change.bind(this)}
						/>
					)}
					{activeIdx == 5 && (
						<Step5
							data={gzh}
							settingTask={openList}
							onChange={this.step5Change.bind(this)}
						/>
					)}
					{activeIdx == 6 && (
						<Step6
							data={sc}
							settingTask={openList}
							onChange={this.step6Change.bind(this)}
						/>
					)}
					{activeIdx == 7 && (
						<Step7
							data={viewfriend}
							settingTask={openList}
							onChange={this.step7Change.bind(this)}
						/>
					)}
				</div>
			</div>
		);
	}
}
