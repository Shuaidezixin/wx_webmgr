import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ departmentList, authList, roleList, customerList }: any) => ({
		departmentList,
		authList,
		roleList,
		customerList
	}),
	{
		getDepartmentListAction: actions.getDepartmentListAction,
		addDepartmentAction: actions.addDepartmentAction,
		deleteDepartmentAction: actions.deleteDepartmentAction,
		getAuthListAction: actions.getAuthListAction,
		addRoleAction: actions.addRoleAction,
		deleteRoleAction: actions.deleteRoleAction,
		getRoleListAction: actions.getRoleListAction,
		addCustomerAction: actions.addCustomerAction,
		getCustomerListAction: actions.getCustomerListAction,
		deleteCustomerAction: actions.deleteCustomerAction,
		clearCustomerListAction: actions.clearCustomerListAction
	}
)(Root);
export default withRouter(root);
