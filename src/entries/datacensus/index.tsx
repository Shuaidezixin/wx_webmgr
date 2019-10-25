import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({
		accountExecuteList,
		taskExecuteList,
		accountTaskInfoList,
		TaskExecInfoList
	}: any) => ({
		accountExecuteList, //账号执行列表
		taskExecuteList, //任务执行列表
		accountTaskInfoList, //账号->详情
		TaskExecInfoList //任务->队列
	}),
	{
		getAccountExecuteListAction: actions.getAccountExecuteListAction,
		getAccountTaskInfoAction: actions.getAccountTaskInfoAction,
		singleCheckDataCensusAction: actions.singleCheckDataCensusAction,
		allCheckDataCensusAction: actions.allCheckDataCensusAction,
		batchRemoveTaskAction: actions.batchRemoveTaskAction,
		getTaskExecuteListAction: actions.getTaskExecuteListAction,
		singleCheckTaskAction: actions.singleCheckTaskAction,
		allCheckTaskAction: actions.allCheckTaskAction,
		getTaskExecuteInfoAction: actions.getTaskExecuteInfoAction,
		singleCheckTaskQueueAction: actions.singleCheckTaskQueueAction,
		allCheckTaskQueueAction: actions.allCheckTaskQueueAction,
		removeTaskByTypeAction: actions.removeTaskByTypeAction
	}
)(Root);
export default withRouter(root);
