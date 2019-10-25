import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ provincesList, cityList, tagList }: any) => ({
		provincesList,
		cityList,
		tagList
	}),
	{
		getProvincesListAction: actions.getProvincesListAction,
		getCityListAction: actions.getCityListAction,
		getTagListAction: actions.getTagListAction,
		addTagAction: actions.addTagAction,
		deleteTagAction: actions.deleteTagAction,
		addSourceShuoshuoAction: actions.addSourceShuoshuoAction,
		getSourceShuoshuoDetailAction: actions.getSourceShuoshuoDetailAction,
		clearTagListAction: actions.clearTagListAction
	}
)(Root);
export default withRouter(root);
