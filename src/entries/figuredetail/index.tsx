import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ figureDetail }: any) => ({
		figureDetail
	}),
	{
		getFigureDetailAction: actions.getFigureDetailAction
	}
)(Root);
export default withRouter(root);
