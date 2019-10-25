import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ deviceList, taskList, logList, homeStatistics, groupList1 }: any) => ({
		deviceList,
		taskList,
		logList,
		homeStatistics,
		groupList1
	}),
	{
		getDeviceListAction: actions.getDeviceListAction,
		getTaskListAction: actions.getTaskListAction,
		deleteTaskAction: actions.deleteTaskAction,
		getLogListAction: actions.getLogListAction,
		getHomeStatisticsAction: actions.getHomeStatisticsAction,
		createAccountTaskAction: actions.createAccountTaskAction,
		getGroupsAction1: actions.getGroupsAction1,
		clearTaskListAction: actions.clearTaskListAction
	}
)(Root);
export default withRouter(root);
