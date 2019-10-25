import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ logsList }: any) => ({ logsList }),
	{
		getLogsListAction: actions.getLogsListAction
	}
)(Root);
export default withRouter(root);
