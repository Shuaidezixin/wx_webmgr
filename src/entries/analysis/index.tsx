import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ poolAnalysis, friendAnalysis, groupAnalysis, wechatAnalysis }: any) => ({
		poolAnalysis,
		friendAnalysis,
		groupAnalysis,
		wechatAnalysis
	}),
	{
		getPoolAnalysisAction: actions.getPoolAnalysisAction,
		getFriendAnalysisAction: actions.getFriendAnalysisAction,
		getGroupAnalysisAction: actions.getGroupAnalysisAction,
		getWechatAnalysisAction: actions.getWechatAnalysisAction
	}
)(Root);
export default withRouter(root);
