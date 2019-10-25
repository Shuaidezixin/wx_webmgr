import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
let root: any = connect()(Root);
export default withRouter(root);
