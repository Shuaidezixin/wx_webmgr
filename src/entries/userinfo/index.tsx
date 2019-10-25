import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ userinfo }: any) => ({
		userinfo
	}),
	{
		getUserInfoAction: actions.getUserInfoAction,
		updateUserInfoAction: actions.updateUserInfoAction
	}
)(Root);
export default withRouter(root);
