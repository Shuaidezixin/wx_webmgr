import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ accountDetail, tagList, figureList, characterList }: any) => ({
		accountDetail,
		tagList,
		figureList,
		characterList
	}),
	{
		getAccountDetailAction: actions.getAccountDetailAction,
		getTagListAction: actions.getTagListAction,
		getFigureListAction: actions.getFigureListAction,
		updateAccountDetailAction: actions.updateAccountDetailAction,
		clearTagListAction: actions.clearTagListAction,
		getCharaterAction: actions.getCharaterAction
	}
)(Root);
export default withRouter(root);
