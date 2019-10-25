import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ figureList }: any) => ({
		figureList
	}),
	{
		getFigureListAction: actions.getFigureListAction,
		deleteFigureAction: actions.deleteFigureAction
	}
)(Root);
export default withRouter(root);
