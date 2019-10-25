import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({
		messageDevicesList,
		messageTalkerList,
		messageTalkList,
		pyqList,
		commentList,
		txlList,
		txlList2,
		messageList,
		groupList1,
		messageFriendValid,
		messageFriendValidTask,
		messageExtensionScriptList
	}: //messageDetail
	any) => ({
		messageDevicesList,
		messageTalkerList,
		messageTalkList,
		pyqList,
		commentList,
		txlList,
		txlList2,
		messageList,
		groupList1,
		messageFriendValid,
		messageFriendValidTask,
		messageExtensionScriptList
		//messageDetail
	}),
	{
		getMessageDevicesListAction: actions.getMessageDevicesListAction,
		getMessageTalkerListAction: actions.getMessageTalkerListAction,
		clearMessageTalkerListAction: actions.clearMessageTalkerListAction,
		getMessageTalkListAction: actions.getMessageTalkListAction,
		updateTalkerLocalInfoAction: actions.updateTalkerLocalInfoAction,
		clearMessageTalkListAction: actions.clearMessageTalkListAction,
		sendMessageAction: actions.sendMessageAction,
		updateTalkerInfoAction: actions.updateTalkerInfoAction,
		createUserTaskAction: actions.createUserTaskAction,
		getPyqListAction: actions.getPyqListAction,
		getTxlListAction: actions.getTxlListAction,
		getCommentListAction: actions.getCommentListAction,
		clearPyqListAction: actions.clearPyqListAction,
		cleartXLListAction: actions.cleartXLListAction,
		pyqZanAction: actions.pyqZanAction,
		pyqCommentAction: actions.pyqCommentAction,
		getTxlList2Action: actions.getTxlList2Action,
		updateTxlLocalInfoAction: actions.updateTxlLocalInfoAction,
		operateQunAction: actions.operateQunAction,
		updateActiveTimeAction: actions.updateActiveTimeAction,
		clearCommentAction: actions.clearCommentAction,
		allReadAction: actions.allReadAction,
		getGroupsAction1: actions.getGroupsAction1,
		getFriendValidMessage: actions.getFriendValidMessage,
		getFriendValidTask: actions.getFriendValidTask,
		//socket相关
		getMessageAction: actions.getMessageAction,
		createMessageAction: actions.createMessageAction,
		withdrawMessageAction: actions.withdrawMessageAction,
		//推广剧本相关
		getMessageExtensionScriptListAction:
			actions.getMessageExtensionScriptListAction,
		clearExtensionScriptListAction: actions.clearExtensionScriptListAction
	}
)(Root);
export default withRouter(root);
