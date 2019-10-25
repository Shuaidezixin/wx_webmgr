import * as React from "react";
import { Tabs } from "antd";
import Pool from "../components/pool";
import Friend from "../components/friend";
import Qun from "../components/qun";
import Wechat from "../components/wechat";
import "./index.less";
const TabPane = Tabs.TabPane;
interface Props {
	poolAnalysis?: any;
	friendAnalysis?: any;
	groupAnalysis?: any;
	wechatAnalysis?: any;
	getPoolAnalysisAction?: Function;
	getFriendAnalysisAction?: Function;
	getGroupAnalysisAction?: Function;
	getWechatAnalysisAction?: Function;
}
interface State {
	tabType: TabType;
}
declare type TabType = "pool" | "friend" | "qun" | "wehcat";
export default class Root extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state: State = {
		tabType: "pool"
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "数据分析");
	}
	tabChange(e: TabType) {
		this.setState({
			tabType: e
		});
	}
	render() {
		let { tabType } = this.state;
		let {
			poolAnalysis,
			friendAnalysis,
			groupAnalysis,
			wechatAnalysis,
			getPoolAnalysisAction,
			getFriendAnalysisAction,
			getGroupAnalysisAction,
			getWechatAnalysisAction
		} = this.props;
		return (
			<div className="analysis-page">
				<Tabs activeKey={tabType} onChange={this.tabChange.bind(this)}>
					<TabPane key="pool" tab="号池">
						<div className="analysis-container">
							<Pool
								data={poolAnalysis}
								action={getPoolAnalysisAction}
							/>
						</div>
					</TabPane>
					<TabPane key="friend" tab="好友">
						<div className="analysis-container">
							<Friend
								data={friendAnalysis}
								action={getFriendAnalysisAction}
							/>
						</div>
					</TabPane>
					<TabPane key="qun" tab="群聊">
						<div className="analysis-container">
							<Qun
								data={groupAnalysis}
								action={getGroupAnalysisAction}
							/>
						</div>
					</TabPane>
					<TabPane key="wehcat" tab="微信号">
						<div className="analysis-container">
							<Wechat
								data={wechatAnalysis}
								action={getWechatAnalysisAction}
							/>
						</div>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
