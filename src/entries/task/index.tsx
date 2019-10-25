import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({
		settingTask,
		accountList,
		groupList,
		shortGroupList,
		figureList,
		tagList1,
		nearestList,
		characterList1
	}: any) => ({
		settingTask,
		accountList,
		groupList,
		shortGroupList,
		figureList,
		tagList1,
		nearestList,
		characterList1
	}),
	{
		getAccountListAction: actions.getAccountListAction,
		createUserTaskAction: actions.createUserTaskAction,
		uploadAction: actions.uploadAction,
		getGroupsAction: actions.getGroupsAction,
		getSettingTaskAction: actions.getSettingTaskAction,
		getShortGroupListAction: actions.getShortGroupListAction,
		createOrUpdateShortGroupAction: actions.createOrUpdateShortGroupAction,
		deleteShortGroupAction: actions.deleteShortGroupAction,
		getBeforeAction: actions.getBeforeAction,
		getFigureListAction: actions.getFigureListAction,
		getTagListAction1: actions.getTagListAction1,
		getNearestListAction: actions.getNearestListAction,
		getCharaterAction1: actions.getCharaterAction1
	}
)(Root);
export default withRouter(root);
