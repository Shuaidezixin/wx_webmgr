import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({
		addFigure,
		provincesList,
		cityList,
		figureDetail,
		settingTask
	}: any) => ({
		addFigure,
		provincesList,
		cityList,
		figureDetail,
		settingTask
	}),
	{
		addFigureAction: actions.addFigureAction,
		getProvincesListAction: actions.getProvincesListAction,
		getCityListAction: actions.getCityListAction,
		getFigureDetailAction: actions.getFigureDetailAction,
		// 获取任务列表
		getSettingTaskAction: actions.getSettingTaskAction
	}
)(Root);
export default withRouter(root);
