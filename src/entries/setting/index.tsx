import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({
		settingTask,
		settingSource,
		settingAddFriend,
		extensionScriptList
	}: any) => ({
		settingTask,
		settingSource,
		settingAddFriend,
		extensionScriptList
	}),
	{
		getSettingTaskAction: actions.getSettingTaskAction,
		updateSettingTaskAction: actions.updateSettingTaskAction,
		getSettingSourceAction: actions.getSettingSourceAction,
		updateSettingSourceAction: actions.updateSettingSourceAction,
		getSettingAddFriendAction: actions.getSettingAddFriendAction,
		updateSettingAddFriendAction: actions.updateSettingAddFriendAction,
		getInitAction: actions.getInitAction,
		updateInitAction: actions.updateInitAction,
		getExtensionScriptAction: actions.getExtensionScriptAction
	}
)(Root);
export default withRouter(root);
