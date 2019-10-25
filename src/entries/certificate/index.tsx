import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({ certificateList }: any) => ({
		certificateList
	}),
	{
		getCertificateListAction: actions.getCertificateListAction,
		downloadNodeCertAction: actions.downloadNodeCertAction,
		updateNodeNoteAction: actions.updateNodeNoteAction
	}
)(Root);
export default withRouter(root);
