import * as React from "react";
import { Tabs } from "antd";
import "./index.less";
import Task from "../components/task";
import Source from "../components/source";
import AddFriend from "../components/addfriend";
import InitPage from "../components/init";
const { TabPane } = Tabs;
interface Props {
	settingTask?: any;
	getSettingTaskAction?: Function;
	updateSettingTaskAction?: Function;
	settingSource?: any;
	getSettingSourceAction?: Function;
	updateSettingSourceAction?: Function;
	settingAddFriend?: any;
	getSettingAddFriendAction?: Function;
	updateSettingAddFriendAction?: Function;
	getInitAction?: Function;
	updateInitAction?: Function;
	extensionScriptList?: any;
	getExtensionScriptAction?: Function;
}
interface State {
	pageType: TaskType;
}
declare type TaskType = "task" | "source" | "addfriend" | "init";
export default class Root extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		pageType: "task"
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "系统设置");
	}
	pageTypeChange(e: TaskType) {
		this.setState({
			pageType: e
		});
	}
	render() {
		let { pageType } = this.state;
		let {
			settingTask,
			getSettingTaskAction,
			updateSettingTaskAction,
			settingSource,
			getSettingSourceAction,
			updateSettingSourceAction,
			settingAddFriend,
			getSettingAddFriendAction,
			updateSettingAddFriendAction,
			getInitAction,
			updateInitAction,
			extensionScriptList,
			getExtensionScriptAction
		} = this.props;
		return (
			<div className="setting-page">
				<Tabs
					activeKey={pageType}
					onChange={this.pageTypeChange.bind(this)}
				>
					<TabPane tab="任务" key="task">
						<Task
							settingTask={settingTask}
							getSettingTaskAction={getSettingTaskAction}
							updateSettingTaskAction={updateSettingTaskAction}
						/>
					</TabPane>
					<TabPane tab="素材" key="source">
						<Source
							settingSource={settingSource}
							getSettingSourceAction={getSettingSourceAction}
							updateSettingSourceAction={
								updateSettingSourceAction
							}
						/>
					</TabPane>
					<TabPane tab="添加好友" key="addfriend">
						<AddFriend
							getSettingAddFriendAction={
								getSettingAddFriendAction
							}
							updateSettingAddFriendAction={
								updateSettingAddFriendAction
							}
							extensionScriptList={extensionScriptList}
							getExtensionScriptAction={getExtensionScriptAction}
						/>
					</TabPane>
					<TabPane tab="初始化配置" key="init">
						<InitPage
							getInitAction={getInitAction}
							updateInitAction={updateInitAction}
						/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
