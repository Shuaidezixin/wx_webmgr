import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ figureList, characterList, tagList, characterInfoList }: any) => ({
		figureList,
		characterList,
		tagList,
		characterInfoList
	}),
	{
		getCharaterAction: actions.getCharaterAction,
		getFigureListAction: actions.getFigureListAction,
		getTagListAction: actions.getTagListAction,
		addTagAction: actions.addTagAction,
		deleteTagAction: actions.deleteTagAction,
		clearTagListAction: actions.clearTagListAction,
		saveCharaterAction: actions.saveCharaterAction,
		deleteCharaterAction: actions.deleteCharaterAction,
		getcharacterInfoAction: actions.getcharacterInfoAction,
		singleCheckPersonAction: actions.singleCheckPersonAction,
		allCheckPersonAction: actions.allCheckPersonAction,
		userRemovePersonDesignAction: actions.userRemovePersonDesignAction
	}
)(Root);
export default withRouter(root);
