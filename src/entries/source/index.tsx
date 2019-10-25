import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Root from "./container/root";
import actions from "../../models/actions";
let root: any = connect(
	({
		provincesList,
		cityList,
		tagList,
		tagList1,
		sourceFriendList,
		sourceGzhList,
		sourceNicknameList,
		sourceProfileList,
		sourceTouxiangList,
		sourceBizhiList,
		sourceShuoshuoList,
		scriptList,
		extensionScriptList
	}: any) => ({
		provincesList,
		cityList,
		tagList,
		tagList1,
		sourceFriendList,
		sourceGzhList,
		sourceNicknameList,
		sourceProfileList,
		sourceTouxiangList,
		sourceBizhiList,
		sourceShuoshuoList,
		scriptList,
		extensionScriptList
	}),
	{
		getProvincesListAction: actions.getProvincesListAction,
		getCityListAction: actions.getCityListAction,
		getTagListAction: actions.getTagListAction,
		deleteTagAction: actions.deleteTagAction,
		addTagAction: actions.addTagAction,
		clearTagListAction: actions.clearTagListAction,
		getTagListAction1: actions.getTagListAction1,
		//加好友相关
		getSourceFriendListAction: actions.getSourceFriendListAction,
		addSourceFriendAction: actions.addSourceFriendAction,
		deleteSourceFriendAction: actions.deleteSourceFriendAction,
		//公众号
		addSourceGzhAction: actions.addSourceGzhAction,
		getSourceGzhListAction: actions.getSourceGzhListAction,
		deleteSourceGzhAction: actions.deleteSourceGzhAction,
		//昵称
		addSourceNicknameAction: actions.addSourceNicknameAction,
		getSourceNicknameListAction: actions.getSourceNicknameListAction,
		deleteSourceNicknameAction: actions.deleteSourceNicknameAction,
		//个性签名
		addSourceProfileAction: actions.addSourceProfileAction,
		getSourceProfileListAction: actions.getSourceProfileListAction,
		deleteSourceProfileAction: actions.deleteSourceProfileAction,
		//头像
		addSourceTouxiangAction: actions.addSourceTouxiangAction,
		getSourceTouxiangListAction: actions.getSourceTouxiangListAction,
		deleteSourceTouxiangAction: actions.deleteSourceTouxiangAction,
		//壁纸
		addSourceBizhiAction: actions.addSourceBizhiAction,
		getSourceBizhiListAction: actions.getSourceBizhiListAction,
		deleteSourceBizhiAction: actions.deleteSourceBizhiAction,
		//说说
		getSourceShuoshuoListAction: actions.getSourceShuoshuoListAction,
		deleteSourceShuoshuoAction: actions.deleteSourceShuoshuoAction,
		importTemplateFriendAction: actions.importTemplateFriendAction,
		examineSourceShuoshuoAction: actions.examineSourceShuoshuoAction,
		//内部剧本
		getScriptListAction: actions.getScriptListAction,
		addScriptAction: actions.addScriptAction,
		deleteScriptAction: actions.deleteScriptAction,
		// 推广剧本
		addExtensionScriptAction: actions.addExtensionScriptAction,
		getExtensionScriptAction: actions.getExtensionScriptAction,
		deleteExtensionScriptAction: actions.deleteExtensionScriptAction
	}
)(Root);
export default withRouter(root);
