import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "@models/actions";
let root: any = connect(
	({ accoutListForScreen, screenInit }: any) => ({
		accoutListForScreen,
		screenInit
	}),
	{
		getAccountListForScreenAction: actions.getAccountListForScreenAction,
		singleAccountCheckForScreenAction:
			actions.singleAccountCheckForScreenAction,
		allAccountCheckForScreenAction: actions.allAccountCheckForScreenAction,
		getScreenAddressAction: actions.getScreenAddressAction,
		getScreenInitAction: actions.getScreenInitAction,
		allotAccountWxAction: actions.allotAccountWxAction,
		initCmsAutoTaskAction: actions.initCmsAutoTaskAction,
		unlockScreenAction: actions.unlockScreenAction
	}
)(Root);
export default withRouter(root);
