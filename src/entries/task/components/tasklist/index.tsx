import * as React from "react";
import { Input, Button, message } from "antd";
import TaskDraw from "../taskdraw";
import DrawBox from "@component/darw";
import "./index.less";
interface Props {
	getSettingTaskAction?: Function;
	selectedData?: any;
	createUserTaskAction?: Function;
	nearestList?: any;
	getNearestListAction?: any;
}
interface State {
	infoData: any;
	isShowDraw: boolean;
	targetType: string | void;
	targetSubType: string | void;
	targetName: string | void;
	keyword: string;
	taskList: any[] | void;
}

export default class TaskPage extends React.PureComponent<Props, State> {
	private taskList: any = {};
	private taskGroup: any = [];
	constructor(props: Props) {
		super(props);
		this.taskGroup = [
			{
				key: "AddFriend",
				name: "添加好友",
				children: [
					{
						name: "检索添加好友",
						key: "SearchFriend",
						type: "AddFriend_jiansuo"
					},
					{
						name: "通讯录添加好友（随机）",
						key: "MailListFriend",
						type: "AddFriend_tongxunlu"
					},
					{
						name: "群添加好友（随机）",
						key: "GroupFriend",
						type: "AddFriend_qun"
					}
				]
			},
			{
				key: "Pyq",
				name: "朋友圈",
				children: [
					{
						name: "发朋友圈",
						key: "SendPyq",
						type: "Pyq_sentshuoshuo"
					},
					{
						name: "删除我的朋友圈(随机)",
						key: "DeletePyq",
						type: "Pyq_delete"
					},
					{
						name: "浏览朋友圈",
						key: "BrowsePyq",
						type: "Pyq_liulan"
					},
					{
						name: "打开阅读(随机)",
						key: "ReadPyq",
						type: "Pyq_dakaiyuedu"
					},
					{
						name: "转发链接到聊天(随机)",
						key: "ForwardPyq",
						type: "Pyq_zhuanfa_chat"
					},
					{
						name: "转发链接到朋友圈(随机)",
						key: "ForwardLinkPyq",
						type: "Pyq_zhuanfa_pyq"
					},
					{
						name: "朋友圈收藏(随机)",
						key: "ScPyq",
						type: "Pyq_sc"
					},
					{
						name: "点赞(随机)",
						key: "Pyq_dianzan",
						type: "Pyq_dianzan"
					},
					{
						name: "分享第三方链接",
						key: "Pyq_share_link",
						type: "Pyq_share_link"
					}
				]
			},
			{
				key: "AccountSetting",
				name: "账户及隐私",
				children: [
					{
						name: "修改昵称",
						key: "UpdateNickName",
						type: "User_nickname"
					},
					{
						name: "修改个性签名",
						key: "UpdateNote",
						type: "User_profile"
					},
					{
						name: "修改头像",
						key: "UpdateTouXiang",
						type: "User_touxiang"
					},
					{
						name: "修改朋友圈壁纸",
						key: "UpdateBiZhi",
						type: "User_pyq_bizhi"
					},
					{
						name: "修改地区",
						key: "UpdateArea",
						type: "User_myarea"
					},
					{
						name: "修改性别",
						key: "UpdateSex",
						type: "User_sex"
					},
					// {
					// 	name: "修改我的地址",
					// 	key: "UpdateAddress",
					// 	type: "User_myaddr"
					// },
					{
						name: "隐私-添加好友验证",
						key: "AddFriendVerification",
						type: "User_tianjiahaoyou_yanzheng"
					},
					{
						name: "隐私-向我推荐通讯录朋友",
						key: "MailListRecommendFriend",
						type: "User_xiangwotuijian_txy_friend"
					},
					{
						name: "隐私-允许陌生人看十条朋友圈",
						key: "TenArticle",
						type: "User_moshengren_10_tiao"
					},
					{
						name: "隐私-允许查看朋友圈范围-最近半年",
						key: "HalfYear",
						type: "User_pyq_half_year"
					},
					{
						name: "隐私-允许查看朋友圈范围-最近三天",
						key: "ThreeDay",
						type: "User_pyq_3_day"
					},
					// {
					// 	name: "隐私-允许查看朋友圈范围-全部",
					// 	key: "PyqAll",
					// 	type: "User_pyq_all"
					// },
					{
						name: "隐私-朋友圈更新提醒",
						key: "PyqUpdateRemind",
						type: "User_pyq_notice"
					},
					{
						name: "修改密码",
						key: "UpdatepasswordWeiXin",
						type: "User_password_update"
					},
					{
						name: "开/关摇一摇",
						key: "User_yaoyiyao_close",
						type: "User_yaoyiyao_close"
					},
					{
						name: "开/关附近的人",
						key: "User_fujinren_close",
						type: "User_fujinren_close"
					},
					{
						name: "修改微信号",
						key: "UpdateUsername",
						type: "User_username"
					}
				]
			},
			{
				name: "公众号",
				key: "gzh",
				children: [
					{
						name: "搜索公众号",
						key: "SearchGZH",
						type: "Gzh_search"
					},
					{
						name: "关注公众号",
						key: "ForceGZH",
						type: "Gzh_guanzhu"
					},
					{
						name: "取消关注公众号（随机）",
						key: "CancelGZH",
						type: "Gzh_guanzhu_cancel"
					},
					{
						name: "预览公众号（随机）",
						key: "BrowseGZH",
						type: "Gzh_dakaiyulan"
					},
					{
						name: "阅读公众号文章（随机）",
						key: "ReadGZHArticle",
						type: "Gzh_yuedu"
					},
					{
						name: "收藏公众号文章（随机）",
						key: "ScGZHArticle",
						type: "Gzh_soucang"
					},
					{
						name: "转发公众号文章到朋友圈（随机）",
						key: "ForwardGZHPyq",
						type: "Gzh_zhuanfa_pyq"
					},
					{
						name: "转发公众号文章到聊天（随机）",
						key: "ForwardGZHChat",
						type: "Gzh_zhuanfa_chat"
					},
					{
						name: "置顶公众号（随机）",
						key: "OPenGZHTop",
						type: "Gzh_top"
					},
					{
						name: "清空内容（随机）",
						key: "ClearGZH",
						type: "Gzh_clear_content"
					}
				]
			},
			{
				name: "收藏",
				key: "Sc",
				children: [
					,
					{
						name: "写笔记",
						key: "WriteNote",
						type: "SC_add_note"
					},
					{
						name: "打开预览收藏（随机）",
						key: "BrowseSc",
						type: "SC_dakaiyulan"
					},
					{
						name: "阅读收藏（随机）",
						key: "ReadSc",
						type: "SC_read"
					},
					{
						name: "转发链接收藏到朋友圈（随机）",
						key: "ForwardScLinkPyq",
						type: "SC_zhuanfa_link_pyq"
					},
					{
						name: "转发链接收藏到聊天（随机）",
						key: "ForwardScLinkChat",
						type: "SC_zhuanfa_link_chat"
					},
					{
						name: "筛选收藏（随机）",
						key: "ScreenSc",
						type: "SC_shaixuan"
					},
					{
						name: "转发笔记到朋友圈（随机）",
						key: "ForwardNotePyq",
						type: "SC_zhuanfa_note_pyq"
					},
					{
						name: "转发笔记到聊天（随机）",
						key: "ForwardNoteChat",
						type: "SC_zhuanfa_note_chat"
					}
				]
			},
			{
				name: "聊天设置",
				key: "ChatConfig",
				children: [
					,
					{
						name: "聊天收藏（随机）",
						key: "ChatSc",
						type: "ChatConfig_Sc"
					},
					{
						name: "单聊-置顶聊天（随机）",
						key: "ChatTop",
						type: "ChatConfig_One_Top"
					},
					{
						name: "单聊-消息免打扰（随机）",
						key: "ChatDonNotDisturb",
						type: "ChatConfig_One_Miandarao"
					},
					{
						name: "单聊-强提醒（随机）",
						// key: "ChatDonNotDisturb",
						key: "ChatDisturb",
						type: "ChatConfig_One_Qiangtixing"
					},
					{
						name: "单聊-设置聊天背景（随机）",
						key: "ChatBackGround",
						type: "ChatConfig_One_Backpic"
					},
					{
						name: "单聊-清空聊天记录（随机）",
						key: "ClearChat",
						type: "ChatConfig_One_ClearContent"
					},
					// {
					// 	name: "群聊-新建群聊（随机）",
					// 	key: "NewGroup",
					// 	type: "ChatConfig_Group_NewGroup"
					// },
					// {
					// 	name: "群聊-邀请好友加群（随机）",
					// 	key: "AddGroupFriend",
					// 	type: "ChatConfig_Group_AddGroupFriend"
					// },
					// {
					// 	name: "群聊-删除群好友（随机）",
					// 	key: "DeleteGroupFriend",
					// 	type: "ChatConfig_Group_DeleteGroupFriend"
					// },
					// {
					// 	name: "群聊-修改群名称（随机）",
					// 	key: "UpdateGroupName",
					// 	type: "ChatConfig_Group_GroupName"
					// },
					{
						name: "群聊-消息免打扰（随机）",
						key: "GroupDonNotDisturb",
						type: "ChatConfig_Group_Miandaran"
					},
					{
						name: "群聊-保存到通讯录（随机）",
						key: "SaveGroup",
						type: "ChatConfig_Group_Save"
					},
					{
						name: "群聊-显示群成员昵称（随机）",
						key: "ShowGroupMemberNickName",
						type: "ChatConfig_Group_ShowNickname"
					},
					{
						name: "群聊-清空聊天记录（随机）",
						// key: "GroupTop",
						key: "ClearGroup",
						type: "ChatConfig_Group_Clear"
					},
					{
						name: "推广剧本",
						key: "ExtensionScript",
						type: "ChatConfig_ExtensionScript"
					},
					// {
					// 	name: "内部剧本",
					// 	key: "InsideScript",
					// 	type: "ChatConfig_InsiderScript"
					// },
					{
						name: "添加表情商店表情包",
						key: "AddChatBiaoQingPkgStore",
						type: "ChatConfig_AddPackageBiaoqin"
					},
					{
						name: "移除表情包",
						key: "DeleteChatBiaoQingPkg",
						type: "ChatConfig_RemovePackageBiaoqin"
					},
					{
						name: "浏览表情包",
						key: "LookChatBiaoQingPkg",
						type: "ChatConfig_LookPackageBiaoqin"
					},
					{
						name: "群发",
						key: "QunFa",
						type: "ChatConfig_QunFa"
					}
				]
			},
			{
				name: "查看好友信息",
				key: "FriendInfo",
				children: [
					,
					{
						name: "查看好友资料主页（随机）",
						key: "BrowseFriendInfo",
						type: "ViewFriend_zhuye"
					},
					{
						name: "查看好友朋友圈（随机）",
						key: "BrowseFriendPyq",
						type: "ViewFriend_pyq"
					},
					{
						name: "查看更多信息（随机）",
						key: "BrowseFriendMoreInfo",
						type: "ViewFriend_more_info"
					},
					{
						name: "设为星标（随机）",
						key: "SetStart",
						type: "ViewFriend_set_star"
					},
					{
						name: "删除（随机）",
						key: "DeleteFriend",
						type: "ViewFriend_delete"
					}
				]
			}
		];
	}
	readonly state: State = {
		infoData: null,
		isShowDraw: false,
		targetType: null,
		targetSubType: null,
		targetName: null,
		keyword: "",
		taskList: null
	};
	componentDidMount() {
		this.getTask();
		this.setState({
			taskList: [...this.taskGroup]
		});
		this.props.getNearestListAction();
	}
	async getTask() {
		let res = await this.props.getSettingTaskAction();
		if (res && res.code == 200) {
			let localInfo: any = {};
			let info = res.data.taskinfos;
			if (info && info.length > 0) {
				info.map((item: any) => {
					let name: string = "";
					switch (item.type) {
						case "AddFriend":
							name = "加好友";
							break;
						case "Pyq":
							name = "朋友圈";
							break;
						case "AccountSetting":
							name = "账户及隐私";
							break;
						case "ChatConfig":
							name = "聊天设置";
							break;
						case "Sc":
							name = "收藏";
							break;
						case "gzh":
							name = "公众号";
							break;
						case "FriendInfo":
							name = "查看好友资料";
							break;
					}
					if (!localInfo[item.type]) {
						localInfo[item.type] = {
							name: name,
							type: item.type
						};
					}
					localInfo[item.type][item.key] = item.ismanual;
				});
			}
			this.setState({
				infoData: { ...localInfo }
			});
		}
	}
	openDrawClick(type: string, sub_type: string, name: string) {
		if (!this.props.selectedData || this.props.selectedData.length <= 0) {
			message.error("请先选择用户再执行任务操作");
			return;
		}
		this.setState({
			targetSubType: sub_type,
			targetType: type,
			isShowDraw: true,
			targetName: name
		});
	}
	closeDraw() {
		this.setState({
			targetSubType: null,
			targetType: null,
			isShowDraw: false,
			targetName: null
		});
	}
	searchClick() {
		let { keyword } = this.state;
		let k = keyword.trim();
		if (k.length <= 0) {
			this.setState({
				taskList: [...this.taskGroup]
			});
			return;
		}
		let res: any[] = [];
		this.taskGroup.map((v: any) => {
			if (v.name.indexOf(k) != -1) {
				res.push(v);
			} else {
				let childrenRes: any = [];
				if (v.children && v.children.length > 0) {
					v.children.map((c: any) => {
						if (c.name.indexOf(k) != -1) {
							childrenRes.push(c);
						}
					});
				}
				if (childrenRes.length > 0) {
					res.push({
						...v,
						children: [...childrenRes]
					});
				}
			}
		});
		this.setState({
			taskList: [...res]
		});
	}
	resetClick() {
		this.setState({
			keyword: "",
			taskList: [...this.taskGroup]
		});
	}
	InputChange(type: string, e: any) {
		let set: any = {
			[type]: e.target.value
		};
		this.setState(
			{
				...set
			},
			this.searchClick
		);
	}
	render() {
		let {
			infoData,
			isShowDraw,
			targetSubType,
			targetType,
			targetName,
			taskList,
			keyword
		} = this.state;
		let { createUserTaskAction, selectedData, nearestList } = this.props;

		return (
			<div className="task-list-page">
				<div className="task-header">
					<Input
						className="input"
						placeholder="请输入任务名称关键词"
						value={keyword}
						onChange={this.InputChange.bind(this, "keyword")}
					/>
					{/* <Button
						className="btn"
						type="primary"
						onClick={this.searchClick.bind(this)}
					>
						搜索
					</Button>
					<Button
						className="btn"
						type="primary"
						onClick={this.resetClick.bind(this)}
					>
						重置
					</Button> */}
				</div>
				<div className="task-list-container">
					{nearestList && nearestList.length > 0 && (
						<div className="task-item">
							<div className="item-title">近期执行</div>
							<div className="item-content">
								{nearestList.map((v: any, i: number) => {
									return (
										<Button
											className="item-btn"
											type="primary"
											key={i}
											title={v.name}
											onClick={this.openDrawClick.bind(
												this,
												v.type,
												v.sub_type,
												v.name
											)}
										>
											{v.name}
										</Button>
									);
								})}
							</div>
						</div>
					)}
					{taskList &&
						taskList.length > 0 &&
						taskList.map((val: any, idx: number) => {
							if (!infoData || !infoData[val.key]) {
								return null;
							}
							return (
								<div className="task-item" key={idx}>
									<div className="item-title">{val.name}</div>
									<div className="item-content">
										{val.children.map(
											(v: any, i: number) => {
												if (!infoData[val.key][v.key]) {
													return null;
												}
												return (
													<Button
														className="item-btn"
														type="primary"
														key={i}
														title={v.name}
														onClick={this.openDrawClick.bind(
															this,
															val.key,
															v.type,
															val.name +
																"--" +
																v.name
														)}
													>
														{v.name}
													</Button>
												);
											}
										)}
									</div>
								</div>
							);
						})}
				</div>
				<DrawBox
					visible={isShowDraw}
					onCancel={this.closeDraw.bind(this)}
					className="task-draw"
				>
					<TaskDraw
						targetType={targetType}
						targetSubType={targetSubType}
						targetName={targetName}
						createUserTaskAction={createUserTaskAction}
						selectedData={selectedData}
						onCancel={this.closeDraw.bind(this)}
					/>
				</DrawBox>
			</div>
		);
	}
}
