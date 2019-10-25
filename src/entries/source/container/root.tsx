import * as React from "react";
import { Tabs } from "antd";
import "./index.less";

import ScriptBox from "../components/script";
import ShuoShuo from "../components/shuoshuo";
import AddFriend from "../components/addfried";
import Gzh from "../components/gzh";
import NickName from "../components/nickname";
import Profile from "../components/profile";
import Touxiang from "../components/touxiang";
import Wallpaper from "../components/wallpaper";
import TGScript from "../components/tgscript";

const TabPane = Tabs.TabPane;
interface Props {
	provincesList?: any;
	cityList?: any;
	getProvincesListAction?: Function;
	getCityListAction?: Function;
	tagList?: any;
	getTagListAction?: Function;
	deleteTagAction?: Function;
	addTagAction?: Function;
	clearTagListAction?: Function;
	tagList1?: any;
	getTagListAction1?: Function;
	//加好友
	getSourceFriendListAction?: Function;
	sourceFriendList?: any;
	addSourceFriendAction?: Function;
	deleteSourceFriendAction?: Function;
	importTemplateFriendAction?: Function;
	//公众号
	addSourceGzhAction?: Function;
	sourceGzhList?: any;
	getSourceGzhListAction?: any;
	deleteSourceGzhAction?: Function;
	//昵称
	sourceNicknameList?: any;
	addSourceNicknameAction?: Function;
	getSourceNicknameListAction?: Function;
	deleteSourceNicknameAction?: Function;
	//个性签名
	sourceProfileList?: any;
	addSourceProfileAction?: any;
	getSourceProfileListAction?: Function;
	deleteSourceProfileAction?: Function;
	//头像
	sourceTouxiangList?: any;
	addSourceTouxiangAction?: any;
	getSourceTouxiangListAction?: Function;
	deleteSourceTouxiangAction?: Function;
	//壁纸
	sourceBizhiList?: any;
	addSourceBizhiAction?: any;
	getSourceBizhiListAction?: Function;
	deleteSourceBizhiAction?: Function;
	//说说
	sourceShuoshuoList?: any;
	getSourceShuoshuoListAction?: any;
	deleteSourceShuoshuoAction?: Function;
	examineSourceShuoshuoAction?: Function;
	//剧本
	scriptList?: any;
	getScriptListAction?: Function;
	addScriptAction?: Function;
	deleteScriptAction?: Function;
	// 推广剧本
	extensionScriptList?: any;
	addExtensionScriptAction?: Function;
	getExtensionScriptAction?: Function;
	deleteExtensionScriptAction?: Function;
}
interface State {
	navKey: SourceType;
}
declare type SourceType =
	| "Template"
	| "Shuoshuo"
	| "AddFriend"
	| "Gzh"
	| "NickName"
	| "Touxiang"
	| "Wallpaper"
	| "Profile"
	| "Script"
	| "TGScript"
	| "";

export default class Root extends React.PureComponent<Props, State> {
	constructor(props: any) {
		super(props);
	}
	readonly state: State = {
		navKey: ""
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "素材管理");
		let sourceKey = window.sessionStorage.getItem(
			"sourceKey"
		) as SourceType;
		if (sourceKey) {
			this.setState({
				navKey: sourceKey
			});
		} else {
			this.setState({
				navKey: "Shuoshuo"
			});
		}
	}
	navChange(e: SourceType) {
		window.sessionStorage.removeItem("sourceInfo");
		window.sessionStorage.setItem("sourceKey", e);
		this.setState(
			{
				navKey: e
			},
			() => {
				window.appHistory.replace({
					pathname: "/source",
					search: "page=1"
				});
			}
		);
	}
	render() {
		let { navKey } = this.state;
		let {
			provincesList,
			cityList,
			getProvincesListAction,
			getCityListAction,
			tagList,
			getTagListAction,
			deleteTagAction,
			addTagAction,
			getSourceFriendListAction,
			sourceFriendList,
			addSourceFriendAction,
			deleteSourceFriendAction,
			addSourceGzhAction,
			sourceGzhList,
			getSourceGzhListAction,
			deleteSourceGzhAction,
			addSourceNicknameAction,
			sourceNicknameList,
			getSourceNicknameListAction,
			deleteSourceNicknameAction,
			addSourceProfileAction,
			sourceProfileList,
			getSourceProfileListAction,
			deleteSourceProfileAction,
			sourceTouxiangList,
			addSourceTouxiangAction,
			getSourceTouxiangListAction,
			deleteSourceTouxiangAction,
			sourceBizhiList,
			addSourceBizhiAction,
			getSourceBizhiListAction,
			deleteSourceBizhiAction,
			sourceShuoshuoList,
			getSourceShuoshuoListAction,
			deleteSourceShuoshuoAction,
			clearTagListAction,
			importTemplateFriendAction,
			tagList1,
			getTagListAction1,
			examineSourceShuoshuoAction,
			scriptList,
			getScriptListAction,
			addScriptAction,
			deleteScriptAction,
			// 推广剧本
			extensionScriptList,
			addExtensionScriptAction,
			getExtensionScriptAction,
			deleteExtensionScriptAction
		} = this.props;
		return (
			<div className="source-page">
				<Tabs activeKey={navKey} onChange={this.navChange.bind(this)}>
					{/* <TabPane key="Template" tab="说说模板">
						<Template />
					</TabPane> */}
					<TabPane key="Shuoshuo" tab="朋友圈">
						{navKey == "Shuoshuo" && (
							<ShuoShuo
								key="Shuoshuo"
								sourceShuoshuoList={sourceShuoshuoList}
								getSourceShuoshuoListAction={
									getSourceShuoshuoListAction
								}
								tagList1={tagList1}
								getTagListAction1={getTagListAction1}
								deleteSourceShuoshuoAction={
									deleteSourceShuoshuoAction
								}
								examineSourceShuoshuoAction={
									examineSourceShuoshuoAction
								}
							/>
						)}
					</TabPane>
					<TabPane key="AddFriend" tab="加好友">
						{navKey == "AddFriend" && (
							<AddFriend
								tagList1={tagList1}
								getTagListAction1={getTagListAction1}
								key="AddFriend"
								provincesList={provincesList}
								getProvincesListAction={getProvincesListAction}
								getCityListAction={getCityListAction}
								tagList={tagList}
								getTagListAction={getTagListAction}
								deleteTagAction={deleteTagAction}
								addTagAction={addTagAction}
								getSourceFriendListAction={
									getSourceFriendListAction
								}
								sourceFriendList={sourceFriendList}
								addSourceFriendAction={addSourceFriendAction}
								deleteSourceFriendAction={
									deleteSourceFriendAction
								}
								clearTagListAction={clearTagListAction}
								importTemplateFriendAction={
									importTemplateFriendAction
								}
							/>
						)}
					</TabPane>
					<TabPane key="Gzh" tab="公众号">
						{navKey == "Gzh" && (
							<Gzh
								key="Gzh"
								tagList={tagList}
								getTagListAction={getTagListAction}
								deleteTagAction={deleteTagAction}
								addTagAction={addTagAction}
								addSourceGzhAction={addSourceGzhAction}
								sourceGzhList={sourceGzhList}
								getSourceGzhListAction={getSourceGzhListAction}
								deleteSourceGzhAction={deleteSourceGzhAction}
								clearTagListAction={clearTagListAction}
								tagList1={tagList1}
								getTagListAction1={getTagListAction1}
							/>
						)}
					</TabPane>
					<TabPane key="NickName" tab="昵称">
						{navKey == "NickName" && (
							<NickName
								key="NickName"
								tagList={tagList}
								getTagListAction={getTagListAction}
								deleteTagAction={deleteTagAction}
								addTagAction={addTagAction}
								sourceNicknameList={sourceNicknameList}
								addSourceNicknameAction={
									addSourceNicknameAction
								}
								getSourceNicknameListAction={
									getSourceNicknameListAction
								}
								deleteSourceNicknameAction={
									deleteSourceNicknameAction
								}
								clearTagListAction={clearTagListAction}
								tagList1={tagList1}
								getTagListAction1={getTagListAction1}
							/>
						)}
					</TabPane>
					<TabPane key="Touxiang" tab="头像">
						{navKey == "Touxiang" && (
							<Touxiang
								key="Touxiang"
								tagList={tagList}
								getTagListAction={getTagListAction}
								deleteTagAction={deleteTagAction}
								addTagAction={addTagAction}
								sourceTouxiangList={sourceTouxiangList}
								addSourceTouxiangAction={
									addSourceTouxiangAction
								}
								getSourceTouxiangListAction={
									getSourceTouxiangListAction
								}
								deleteSourceTouxiangAction={
									deleteSourceTouxiangAction
								}
								clearTagListAction={clearTagListAction}
								tagList1={tagList1}
								getTagListAction1={getTagListAction1}
							/>
						)}
					</TabPane>
					<TabPane key="Wallpaper" tab="壁纸">
						{navKey == "Wallpaper" && (
							<Wallpaper
								key="Wallpaper"
								tagList={tagList}
								getTagListAction={getTagListAction}
								deleteTagAction={deleteTagAction}
								addTagAction={addTagAction}
								sourceBizhiList={sourceBizhiList}
								addSourceBizhiAction={addSourceBizhiAction}
								getSourceBizhiListAction={
									getSourceBizhiListAction
								}
								deleteSourceBizhiAction={
									deleteSourceBizhiAction
								}
								clearTagListAction={clearTagListAction}
								tagList1={tagList1}
								getTagListAction1={getTagListAction1}
							/>
						)}
					</TabPane>
					<TabPane key="Profile" tab="个性签名">
						{navKey == "Profile" && (
							<Profile
								key="Profile"
								tagList={tagList}
								getTagListAction={getTagListAction}
								deleteTagAction={deleteTagAction}
								addTagAction={addTagAction}
								addSourceProfileAction={addSourceProfileAction}
								sourceProfileList={sourceProfileList}
								getSourceProfileListAction={
									getSourceProfileListAction
								}
								deleteSourceProfileAction={
									deleteSourceProfileAction
								}
								clearTagListAction={clearTagListAction}
								tagList1={tagList1}
								getTagListAction1={getTagListAction1}
							/>
						)}
					</TabPane>
					<TabPane key="Script" tab="内部好友剧本">
						{navKey == "Script" && (
							<ScriptBox
								key="Script"
								scriptList={scriptList}
								getScriptListAction={getScriptListAction}
								addScriptAction={addScriptAction}
								deleteScriptAction={deleteScriptAction}
							/>
						)}
					</TabPane>
					<TabPane key="TGScript" tab="推广剧本">
						{navKey == "TGScript" && (
							<TGScript
								key="TGScript"
								extensionScriptList={extensionScriptList}
								addExtensionScriptAction={
									addExtensionScriptAction
								}
								getExtensionScriptAction={
									getExtensionScriptAction
								}
								deleteExtensionScriptAction={
									deleteExtensionScriptAction
								}
							/>
						)}
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
