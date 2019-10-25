import * as React from "react";
import "./index.less";
import DetailItem from "@component/detailitem";
import { Modal, Button } from "antd";
interface Props {
	figureDetail: any;
	getFigureDetailAction?: Function;
}
interface State {}
export default class Root extends React.PureComponent<Props, State> {
	private basicList: any;
	private userinfoList: any;
	private addfriendList: any;
	private pyqList: any;
	private gzhList: any;
	private chatconfigList: any;
	private viewfriendList: any;
	private scList: any;
	constructor(props: Props) {
		super(props);
		this.basicList = [
			{
				name: "名称",
				key: "name"
			},
			{
				name: "描述",
				key: "desc"
			},
			{
				name: "性别",
				key: "sex"
			},
			{
				name: "年龄",
				key: "age"
			},
			{
				name: "地区",
				key: "areaChina"
			},
			{
				name: "职业",
				key: "profession"
			},
			{
				name: "活跃时间",
				key: "active_time"
			}
		];
		this.userinfoList = [
			{
				name: "昵称",
				key: "userinfo_nickName"
			},
			{
				name: "头像",
				key: "userinfo_portrait"
			},
			{
				name: "个性签名",
				key: "userinfo_profile"
			},
			{
				name: "朋友圈壁纸",
				key: "userinfo_pyq_pic"
			},
			{
				name: "微信号",
				key: "userinfo_username"
			},
			{
				name: "性别",
				key: "userinfo_sex"
			},
			{
				name: "我的地址",
				key: "userinfo_area"
			},
			{
				name: "我的收货地址",
				key: "userinfo_address"
			},
			{
				name: "添加好友验证",
				key: "userinfo_addfriend_valid"
			},
			{
				name: "向我推荐通讯录好友",
				key: "userinfo_tuijianhaoyou"
			},
			{
				name: "允许陌生人看十条朋友圈",
				key: "userinfo_moshengren_10"
			},
			{
				name: "允许朋友产看朋友圈范围-最近半年",
				key: "userinfo_pyq_half_year"
			},
			{
				name: "允许朋友产看朋友圈范围-全部",
				key: "userinfo_pyq_all"
			},
			{
				name: "允许朋友产看朋友圈范围-最近三天",
				key: "userinfo_pyq_3_day"
			},
			// {
			// 	name: "允许朋友产看朋友圈范围-全部",
			// 	key: "userinfo_pyq_pic",
			//
			// },
			{
				name: "朋友圈更新提醒",
				key: "userinfo_pyq_update"
			}
		];
		this.addfriendList = [
			{
				name: "每天任务总次数",
				key: "addfriend_count"
			},
			{
				name: "每次任务间隔时间",
				key: "addfriend_time_minus"
			},
			{
				name: "通讯录添加",
				key: "addfriend_qun"
			},
			{
				name: "检索添加",
				key: "addfriend_jiansuo"
			},
			{
				name: "群添加",
				key: "addfriend_tongxunlu"
			}
		];
		this.pyqList = [
			{
				name: "每天任务总次数",
				key: "pyq_count"
			},
			{
				name: "每次任务间隔时间",
				key: "pyq_time_minus"
			},
			{
				name: "发朋友圈",
				key: "pyq_sentshuoshuo"
			},
			{
				name: "浏览朋友圈",
				key: "pyq_liulan"
			},
			{
				name: "打开阅读",
				key: "pyq_dakaiyuedu"
			},
			{
				name: "点赞",
				key: "pyq_dianzan"
			},
			{
				name: "删除我的朋友圈",
				key: "pyq_delete"
			},
			{
				name: "转发链接到聊天",
				key: "pyq_zhuanfa_chat"
			},
			{
				name: "转发链接到朋友圈",
				key: "pyq_zhuanfa_pyq"
			},
			{
				name: "文字收藏",
				key: "pyq_sc_text"
			},
			{
				name: "图片收藏",
				key: "pyq_sc_pic"
			},
			{
				name: "视频收藏",
				key: "pyq_sc_video"
			},
			{
				name: "链接收藏",
				key: "pyq_sc_link"
			},
			{
				name: "图片下载",
				key: "pyq_download_pic"
			},
			{
				name: "视频下载",
				key: "pyq_download_video"
			}
		];
		this.gzhList = [
			{
				name: "每天任务总次数",
				key: "gzh_count"
			},
			{
				name: "每次任务间隔时间",
				key: "gzh_time_minus"
			},
			{
				name: "阅读公众号文章",
				key: "gzh_yuedu"
			},
			{
				name: "预览公众号",
				key: "Gzh_yulan"
			},
			{
				name: "搜索公众号",
				key: "gzh_search"
			},
			{
				name: "关注公众号",
				key: "gzh_guanzhu"
			},
			{
				name: "取消关注公众号",
				key: "gzh_guanzhu_cancel"
			},
			{
				name: "收藏公众号文章",
				key: "gzh_soucang"
			},
			{
				name: "转发公众号文章到朋友圈",
				key: "gzh_zhuanfa_pyq"
			},
			{
				name: "转发公众号文章到聊天",
				key: "gzh_zhuanfa_chat"
			},
			{
				name: "公众号置顶",
				key: "gzh_zhuanfa_top"
			},
			{
				name: "删除聊天",
				key: "gzh_shanchu"
			},
			{
				name: "清空内容",
				key: "gzh_qingkong"
			}
		];
		this.chatconfigList = [
			{
				name: "消息每天的总数",
				key: "ChatConfig_Count"
			},
			{
				name: "每条消息的发送间隔",
				key: "ChatConfig_Time_Minus"
			},
			{
				name: "单聊-置顶聊天",
				key: "ChatConfig_One_Top"
			},
			{
				name: "推广消息",
				key: "ChatConfig_ExtensionScript"
			},
			{
				name: "内部好友按照剧本聊天",
				key: "ChatConfig_InSideScript"
			},
			{
				name: "浏览表情包",
				key: "ChatConfig_LookPackageBiaoqin"
			},
			{
				name: "添加表情包",
				key: "ChatConfig_AddPackageBiaoqin"
			},
			{
				name: "移除表情包",
				key: "ChatConfig_RemovePackageBiaoqin"
			},
			{
				name: "添加到我的表情",
				key: "ChatConfig_AddBiaoqin"
			},
			{
				name: "移除我添加的表情",
				key: "ChatConfig_RemoveBiaoqin"
			},
			{
				name: "聊天收藏",
				key: "ChatConfig_One_Sc"
			},
			{
				name: "单聊-打开免打扰",
				key: "ChatConfig_One_Miandarao"
			},
			{
				name: "单聊-打开强提醒",
				key: "ChatConfig_One_Qiangtixing"
			},
			{
				name: "单聊-设置聊天背景",
				key: "ChatConfig_One_Backpic"
			},
			{
				name: "单聊-记录清空",
				key: "ChatConfig_One_ClearContent"
			},
			{
				name: "新建群聊",
				key: "ChatConfig_Group_New"
			},
			{
				name: "群聊-邀请好友加群",
				key: "ChatConfig_Group_Addfrined"
			},
			{
				name: "群聊-删除群好友",
				key: "ChatConfig_Group_Deletefrined"
			},
			{
				name: "群聊-修改群名称",
				key: "ChatConfig_Group_NameUpdate"
			},
			{
				name: "群聊-免打扰",
				key: "ChatConfig_Group_Miandaran"
			},
			{
				name: "群聊-保存到通讯录",
				key: "ChatConfig_Group_Save"
			},
			{
				name: "群聊-显示群成员昵称",
				key: "ChatConfig_Group_ShowNickname"
			},
			{
				name: "群聊-置顶群聊",
				key: "ChatConfig_Group_Top"
			},
			{
				name: "群聊-修改我在本群的昵称",
				key: "ChatConfig_Group_MyNameUpdate"
			},
			{
				name: "群聊-清空聊天记录",
				key: "ChatConfig_Group_Clear"
			},
			{
				name: "群聊-设置聊天背景",
				key: "ChatConfig_Group_Backpic"
			},
			{
				name: "群聊-删除并退出",
				key: "ChatConfig_Group_DeleteAndQuit"
			}
		];
		this.viewfriendList = [
			{ key: "ViewFriend_Count", name: "每天的总数" },
			{ key: "ViewFriend_Time_Minus", name: "间隔" },
			{ key: "ViewFriend_zhuye", name: "查看好友资料主页" },
			{ key: "ViewFriend_pyq", name: "查看好友朋友圈" },
			{ key: "ViewFriend_more_info", name: "查看更多信息" },
			{ key: "ViewFriend_set_star", name: "设为星标" },
			{ key: "ViewFriend_delete", name: "删除" }
		];
		this.scList = [
			{ name: "每天执行总数", key: "sc_count" },
			{ name: "间隔", key: "sc_time_minus" },
			{ name: "打开预览收藏", key: "SC_dakaiyulan" },
			{ name: "阅读收藏", key: "SC_read" },
			{ name: "删除收藏", key: "SC_delete" },
			{ name: "转发链接收藏到朋友圈", key: "sc_zhuanfa_link_pyq" },
			{ name: "转发链接收藏到聊天", key: "SC_zhuanfa_link_chat" },
			{ name: "筛选收藏", key: "SC_shaixuan" },
			{ name: "写笔记", key: "SC_add_note" },
			{ name: "转发笔记到朋友圈", key: "SC_zhuanfa_note_pyq" },
			{ name: "转发笔记到聊天", key: "SC_zhuanfa_note_chat" }
		];
	}

	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "形象详情");
		this.getDetail();
	}
	// 获取详情数据
	getDetail() {
		let figure_id = window.sessionStorage.getItem("figureDetailId");
		if (figure_id) {
			this.props.getFigureDetailAction({
				figure_id
			});
		} else {
			Modal.error({
				title: "错误",
				content: "无法获取ID，请返回列表页重试"
			});
		}
	}
	baseData(key: string, data: any): string {
		let res = "";
		switch (key) {
			case "sex":
				res = data["sex"] == 1 ? "男" : "女";
				break;
			case "areaChina":
				res = data["areaChina"].join("-");
				break;
			case "active_time":
				let acArr = data["active_time"].split("_");
				acArr[0] = acArr[0] + ":00";
				acArr[1] = acArr[1] + ":00";
				res = acArr.join("-");
				break;
			default:
				res = data[key];
				break;
		}
		if (res && res.length <= 0) {
			res = "-";
		}
		return res;
	}
	userinfoData(key: string, data: any): string {
		let res = "";
		let arr: any[] = [];
		switch (key) {
			default:
				arr = data[key].split(";");
				res =
					"执行时间间隔  " +
					(arr[1] && arr[1].length > 0 ? arr[1] : 0) +
					"-" +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					" 天";
				break;
		}
		if (res && res.length <= 0) {
			res = "-";
		}
		return res;
	}
	friendData(key: string, data: any): string {
		let res = "";
		let arr: any[] = [];
		switch (key) {
			case "addfriend_count":
				// arr = data[key].split(";");
				// res = arr[0] + "-" + arr[1] + " 次";
				break;
			case "addfriend_time_minus":
				arr = data[key].split(";");
				res = arr[0] + "-" + arr[1] + " 分钟";
				break;
			default:
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
		}
		if (res && res.length <= 0) {
			res = "-";
		}
		return res;
	}
	pyqData(key: string, data: any): string {
		let res = "";
		let arr: any[] = [];
		switch (key) {
			case "pyq_count":
				// arr = data[key].split(";");
				// res = arr[0] + "-" + arr[1] + " 次";
				break;
			case "pyq_time_minus":
				arr = data[key].split(";");
				res = arr[0] + "-" + arr[1] + " 分钟";
				break;
			case "pyq_sentshuoshuo":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "pyq_liulan":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "pyq_dakaiyuedu":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "pyq_dianzan":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			default:
				arr = data[key].split(";");
				res =
					"执行时间间隔  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 天";
				break;
		}
		if (res && res.length <= 0) {
			res = "-";
		}
		return res;
	}
	gzhData(key: string, data: any): string {
		let res = "";
		let arr: any[] = [];
		switch (key) {
			case "gzh_count":
				// arr = data[key].split(";");
				// res = arr[0] + "-" + arr[1] + " 次";
				break;
			case "gzh_time_minus":
				arr = data[key].split(";");
				res = arr[0] + "-" + arr[1] + " 分钟";
				break;
			case "Gzh_yulan":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "gzh_yuedu":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			default:
				arr = data[key].split(";");
				res =
					"执行时间间隔  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 天";
				break;
		}
		if (res && res.length <= 0) {
			res = "-";
		}
		return res;
	}
	chatData(key: string, data: any): string {
		let res = "";
		let arr: any[] = [];
		switch (key) {
			case "ChatConfig_Count":
				// arr = data[key].split(";");
				// res = arr[0] + "-" + arr[1] + " 次";
				break;
			case "ChatConfig_Time_Minus":
				arr = data[key].split(";");
				res = arr[0] + "-" + arr[1] + " 分钟";
				break;
			case "ChatConfig_One_Top":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "ChatConfig_InSideScript":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "ChatConfig_ExtensionScript":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "ChatConfig_AddPackageBiaoqin":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "ChatConfig_RemovePackageBiaoqin":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			case "ChatConfig_LookPackageBiaoqin":
				arr = data[key].split(";");
				res =
					"每天执行  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 次";
				break;
			default:
				arr = data[key].split(";");
				res =
					"执行时间间隔  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 天";
				break;
		}
		if (res && res.length <= 0) {
			res = "-";
		}
		return res;
	}
	viewfriendData(key: string, data: any): string {
		let res = "";
		let arr: any[] = [];
		switch (key) {
			case "ViewFriend_Count":
				// arr = data[key].split(";");
				// res = arr[0] + "-" + arr[1] + " 次";
				break;
			case "ViewFriend_Time_Minus":
				// arr = data[key].split(";");
				// res = arr[0] + "-" + arr[1] + " 分钟";
				break;
			default:
				arr = data[key].split(";");
				res =
					"执行时间间隔  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 天";
				break;
		}
		if (res && res.length <= 0) {
			res = "-";
		}
		return res;
	}
	scData(key: string, data: any) {
		let res = "";
		let arr: any[] = [];
		switch (key) {
			case "sc_count":
				// arr = data[key].split(";");
				// res = arr[0] + "-" + arr[1] + " 次";
				break;
			case "sc_time_minus":
				// arr = data[key].split(";");
				// res = arr[0] + "-" + arr[1] + " 分钟";
				break;
			default:
				arr = data[key].split(";");
				res =
					"执行时间间隔  " +
					(arr[2] && arr[2].length > 0 ? arr[2] : 0) +
					"-" +
					(arr[3] && arr[3].length > 0 ? arr[3] : 0) +
					" 天";
				break;
		}
		if (res && res.length <= 0) {
			res = "-";
		}
		return res;
	}
	cancelClick() {
		window.appHistory.replace("/character/figure");
	}
	goEdit() {
		let { figureDetail } = this.props;
		window.sessionStorage.setItem("figureID", figureDetail.Id.toString());
		window.sessionStorage.setItem("figureActiveIDX", "0");
		window.appHistory.push({
			pathname: "/character/figure/edit"
		});
	}
	render() {
		let { figureDetail } = this.props;

		return (
			<div className="figuredetail-page">
				<div className="figuredetail-container">
					<div className="item-title">
						<div className="text">基本信息</div>
						{window.viliAuth(
							"5cebbbb6e935680d0497d243",
							"5cebbf43e935680428222ba1"
						) && (
							<Button
								type="primary"
								onClick={this.goEdit.bind(this)}
							>
								编辑
							</Button>
						)}
						<Button
							style={{ marginLeft: "10px" }}
							onClick={this.cancelClick.bind(this)}
						>
							取消
						</Button>
					</div>
					{figureDetail && figureDetail.basic && (
						<React.Fragment>
							<div className="item-box">
								{this.basicList.map(
									(item: any, idx: number) => {
										if (figureDetail.basic[item.key]) {
											return (
												<DetailItem
													key={idx}
													labelName={item.name}
													className="figuredetail-detail-item"
													nameWidth={"100px"}
													content={this.baseData(
														item.key,
														figureDetail.basic
													)}
													isBlock={true}
												/>
											);
										}
									}
								)}
							</div>
						</React.Fragment>
					)}
					{figureDetail && figureDetail.userinfo && (
						<React.Fragment>
							<div className="item-title">账户及隐私</div>
							<div className="item-box">
								{this.userinfoList.map(
									(item: any, idx: number) => {
										if (
											!figureDetail.userinfo[item.key] ||
											figureDetail.userinfo[
												item.key
											].split(";")[0] == "0"
										) {
											return null;
										}
										return (
											<DetailItem
												key={idx}
												labelName={item.name}
												className="figuredetail-detail-item"
												nameWidth={"250px"}
												content={this.userinfoData(
													item.key,
													figureDetail.userinfo
												)}
												isBlock={true}
											/>
										);
									}
								)}
							</div>
						</React.Fragment>
					)}
					{figureDetail && figureDetail.addfriend && (
						<React.Fragment>
							<div className="item-title">加好友</div>
							<div className="item-box">
								{this.addfriendList.map(
									(item: any, idx: number) => {
										if (
											item.key
												.toLowerCase()
												.indexOf("_count") != -1
										) {
											return null;
										}
										if (
											!figureDetail.addfriend[item.key] ||
											figureDetail.addfriend[
												item.key
											].split(";")[0] == "0"
										) {
											return null;
										}
										return (
											<DetailItem
												key={idx}
												labelName={item.name}
												className="figuredetail-detail-item"
												nameWidth={"250px"}
												content={this.friendData(
													item.key,
													figureDetail.addfriend
												)}
												isBlock={true}
											/>
										);
									}
								)}
							</div>
						</React.Fragment>
					)}
					{figureDetail && figureDetail.pyq && (
						<React.Fragment>
							<div className="item-title">朋友圈</div>
							<div className="item-box">
								{this.pyqList.map((item: any, idx: number) => {
									if (
										item.key
											.toLowerCase()
											.indexOf("_count") != -1
									) {
										return null;
									}
									if (
										!figureDetail.pyq[item.key] ||
										figureDetail.pyq[item.key].split(
											";"
										)[0] == "0"
									) {
										return null;
									}
									return (
										<DetailItem
											key={idx}
											labelName={item.name}
											className="figuredetail-detail-item"
											nameWidth={"250px"}
											content={this.pyqData(
												item.key,
												figureDetail.pyq
											)}
											isBlock={true}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}
					{figureDetail && figureDetail.gzh && (
						<React.Fragment>
							<div className="item-title">公众号</div>
							<div className="item-box">
								{this.gzhList.map((item: any, idx: number) => {
									if (
										item.key
											.toLowerCase()
											.indexOf("_count") != -1
									) {
										return null;
									}
									if (
										!figureDetail.gzh[item.key] ||
										figureDetail.gzh[item.key].split(
											";"
										)[0] == "0"
									) {
										return null;
									}
									return (
										<DetailItem
											key={idx}
											labelName={item.name}
											className="figuredetail-detail-item"
											nameWidth={"250px"}
											content={this.gzhData(
												item.key,
												figureDetail.gzh
											)}
											isBlock={true}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}
					{figureDetail && figureDetail.chatconfig && (
						<React.Fragment>
							<div className="item-title">聊天设置</div>
							<div className="item-box">
								{this.chatconfigList.map(
									(item: any, idx: number) => {
										if (
											item.key
												.toLowerCase()
												.indexOf("_count") != -1
										) {
											return null;
										}
										if (
											!figureDetail.chatconfig[
												item.key
											] ||
											figureDetail.chatconfig[
												item.key
											].split(";")[0] == "0"
										) {
											return null;
										}
										return (
											<DetailItem
												key={idx}
												labelName={item.name}
												className="figuredetail-detail-item"
												nameWidth={"250px"}
												content={this.chatData(
													item.key,
													figureDetail.chatconfig
												)}
												isBlock={true}
											/>
										);
									}
								)}
							</div>
						</React.Fragment>
					)}
					{figureDetail && figureDetail.viewfriend && (
						<React.Fragment>
							<div className="item-title">查看好友资料</div>
							<div className="item-box">
								{this.viewfriendList.map(
									(item: any, idx: number) => {
										if (
											item.key
												.toLowerCase()
												.indexOf("_count") != -1
										) {
											return null;
										}
										if (
											item.key
												.toLowerCase()
												.indexOf("_time_minus") != -1
										) {
											return null;
										}
										if (
											!figureDetail.viewfriend[
												item.key
											] ||
											figureDetail.viewfriend[
												item.key
											].split(";")[0] == "0"
										) {
											return null;
										}
										return (
											<DetailItem
												key={idx}
												labelName={item.name}
												className="figuredetail-detail-item"
												nameWidth={"250px"}
												content={this.viewfriendData(
													item.key,
													figureDetail.viewfriend
												)}
												isBlock={true}
											/>
										);
									}
								)}
							</div>
						</React.Fragment>
					)}
					{figureDetail && figureDetail.sc && (
						<React.Fragment>
							<div className="item-title">收藏</div>
							<div className="item-box">
								{this.scList.map((item: any, idx: number) => {
									if (
										item.key
											.toLowerCase()
											.indexOf("_count") != -1
									) {
										return null;
									}
									if (
										item.key
											.toLowerCase()
											.indexOf("_time_minus") != -1
									) {
										return null;
									}
									if (
										!figureDetail.sc[item.key] ||
										figureDetail.sc[item.key].split(
											";"
										)[0] == "0"
									) {
										return null;
									}
									return (
										<DetailItem
											key={idx}
											labelName={item.name}
											className="figuredetail-detail-item"
											nameWidth={"250px"}
											content={this.scData(
												item.key,
												figureDetail.sc
											)}
											isBlock={true}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		);
	}
}
