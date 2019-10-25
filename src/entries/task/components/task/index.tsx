import * as React from "react";
import { Input, Button, Icon, Tabs } from "antd";
import AddFriend from "../addfriend";
import Pyq from "../pyq";
import UserInfo from "../userinfo";
import Gzh from "../gzh";
import Chat from "../chat";
import Sc from "../sc";
import ViewFriend from "../viewfriend";
const TabPane = Tabs.TabPane;
import "./index.less";
interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	settingTask?: any;
	getSettingTaskAction?: Function;
}
interface State {
	taskType: TaskType;
	infoData: any;
}
declare type TaskType =
	| "AddFriend"
	| "Pyq"
	| "Userinfo"
	| "Gzh"
	| "Chat"
	| "Sc"
	| "ViewFriend";
export default class TaskCreate extends React.PureComponent<Props, State> {
	private taskCreatePage: React.RefObject<HTMLDivElement>;
	constructor(props: Props) {
		super(props);
		this.taskCreatePage = React.createRef();
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		taskType: "AddFriend",
		infoData: null
	};
	componentDidMount() {
		this.initWidth();
		window.addEventListener("resize", this.initWidth.bind(this), false);
		this.getTask();
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
	componentWillUnmount() {
		window.removeEventListener("resize", this.initWidth.bind(this), false);
	}
	initWidth() {
		let w = document.body.clientWidth;
		if (this.taskCreatePage && this.taskCreatePage.current) {
			this.taskCreatePage.current.style.width = w - 520 - 160 + "px";
		}
	}
	ChangeTabs(e: any) {
		this.setState({
			taskType: e
		});
	}
	render() {
		let { taskType, infoData } = this.state;
		let { selectedData, createUserTaskAction, settingTask } = this.props;

		return (
			<div className="taskcreate-page" ref={this.taskCreatePage}>
				<Tabs
					activeKey={taskType}
					onChange={this.ChangeTabs.bind(this)}
				>
					<TabPane key="AddFriend" tab="加好友">
						<AddFriend
							selectedData={selectedData}
							createUserTaskAction={createUserTaskAction}
							workData={infoData && infoData.AddFriend}
						/>
					</TabPane>
					<TabPane key="Pyq" tab="朋友圈">
						<Pyq
							selectedData={selectedData}
							createUserTaskAction={createUserTaskAction}
							workData={infoData && infoData.Pyq}
						/>
					</TabPane>
					<TabPane key="Userinfo" tab="账户及隐私">
						<UserInfo
							selectedData={selectedData}
							createUserTaskAction={createUserTaskAction}
							workData={infoData && infoData.AccountSetting}
						/>
					</TabPane>
					<TabPane key="Gzh" tab="公众号">
						<Gzh
							selectedData={selectedData}
							createUserTaskAction={createUserTaskAction}
							workData={infoData && infoData.gzh}
						/>
					</TabPane>
					<TabPane key="Sc" tab="收藏">
						<Sc
							selectedData={selectedData}
							createUserTaskAction={createUserTaskAction}
							workData={infoData && infoData.Sc}
						/>
					</TabPane>
					<TabPane key="Chat" tab="聊天设置">
						<Chat
							selectedData={selectedData}
							createUserTaskAction={createUserTaskAction}
							workData={infoData && infoData.ChatConfig}
						/>
					</TabPane>
					<TabPane key="ViewFriend" tab="查看好友信息">
						<ViewFriend
							selectedData={selectedData}
							createUserTaskAction={createUserTaskAction}
							workData={infoData && infoData.FriendInfo}
						/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
