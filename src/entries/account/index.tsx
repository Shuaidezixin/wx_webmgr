import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({
		accountList,
		tagList,
		figureList,
		groupList,
		groupList1,
		accountListByGroup,
		modalAccountDetail,
		modalAccountDevice,
		customerList,
		characterList,
		characterList1,
		batchAccountList
	}: any) => ({
		accountList,
		tagList,
		figureList,
		groupList,
		groupList1,
		accountListByGroup,
		modalAccountDetail,
		modalAccountDevice,
		customerList,
		characterList,
		characterList1,
		batchAccountList
	}),
	{
		getAccoutListAction: actions.getAccountListAction,
		getTagListAction: actions.getTagListAction,
		getFigureListAction: actions.getFigureListAction,
		addAccountAction: actions.addAccountAction,
		singleCheckAccountAction: actions.singleCheckAccountAction,
		allCheckAccountAction: actions.allCheckAccountAction,
		createAccountTaskAction: actions.createAccountTaskAction,
		deleteAccountAction: actions.deleteAccountAction,
		changeChatStatusAction: actions.changeChatStatusAction,
		changeChatAutoTaskAction: actions.changeChatAutoTaskAction,
		addGroupsAction: actions.addGroupsAction,
		getGroupsAction: actions.getGroupsAction,
		getGroupsAction1: actions.getGroupsAction1,
		getAccountListByGroupAction: actions.getAccountListByGroupAction,
		deleteGroupAction: actions.deleteGroupAction,
		getModalAccountDetailAction: actions.getModalAccountDetailAction,
		getModalAccountDeviceAction: actions.getModalAccountDeviceAction,
		getAppListAction: actions.getAppListAction,
		installAppAction: actions.installAppAction,
		getCustomerListAction: actions.getCustomerListAction,
		allotAction: actions.allotAction,
		getScreenAddressAction: actions.getScreenAddressAction,
		// 获取推广剧本
		getExtensionScriptAction: actions.getExtensionScriptAction,
		setAccountExtensionScriptAction:
			actions.setAccountExtensionScriptAction,
		//人设
		getCharaterAction1: actions.getCharaterAction1,
		getCharaterAction: actions.getCharaterAction,
		userSetPersonDesignAction: actions.userSetPersonDesignAction,
		//任务相关
		createUserTaskAction: actions.createUserTaskAction,
		// 批量上号
		batchAccountLoginAction: actions.batchAccountLoginAction,
		cleaAccountDataAction: actions.cleaAccountDataAction,
		exportAccountDataAction: actions.exportAccountDataAction
	}
)(Root);
export default withRouter(root);
