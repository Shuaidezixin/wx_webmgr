import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ downloadInfo }: any) => ({ downloadInfo }),
	{
		getDownloadInfoAction: actions.getDownloadInfoAction,
		getDownloadAction: actions.getDownloadAction,
		getScreenUrlAction: actions.getScreenUrlAction
	}
)(Root);
export default withRouter(root);
