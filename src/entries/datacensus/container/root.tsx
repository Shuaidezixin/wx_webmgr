import * as React from "react";
import { Tabs } from "antd";
import AccountList from "../components/accountlist";
import TaskList from "../components/tasklist";
const TabPane = Tabs.TabPane;

import "./index.less";

interface Props {
	accountExecuteList?: any;
	getAccountExecuteListAction?: Function;
	getAccountTaskInfoAction?: Function;
	singleCheckDataCensusAction?: Function;
	allCheckDataCensusAction?: Function;
	batchRemoveTaskAction?: Function;
	taskExecuteList?: any;
	getTaskExecuteListAction?: Function;
	singleCheckTaskAction?: Function;
	allCheckTaskAction?: Function;
	accountTaskInfoList?: any;
	TaskExecInfoList?: any;
	getTaskExecuteInfoAction?: Function;
	singleCheckTaskQueueAction?: Function;
	allCheckTaskQueueAction?: Function;
	removeTaskByTypeAction?: Function;
}
interface State {
	pageType: DataCensusType;
}
declare type DataCensusType = "account" | "task" | "empty";

export default class Root extends React.PureComponent<Props, State> {
	readonly state: State = {
		pageType: "empty"
	};
	static readonly defaultProp: Props = {};
	constructor(props: Props) {
		super(props);
	}
	public componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "数据统计");
		let dataCensusKey = window.sessionStorage.getItem(
			"dataCensusKey"
		) as DataCensusType;
		this.setState({
			pageType: dataCensusKey ? dataCensusKey : "account"
		});
	}
	// tab栏改变
	tabChange(e: any) {
		window.sessionStorage.setItem("dataCensusKey", e);
		this.setState(
			{
				pageType: e
			},
			() => {
				window.appHistory.replace({
					pathname: "/datacensus",
					search: "page=1"
				});
			}
		);
	}
	public render() {
		let { pageType } = this.state;
		let {
			accountExecuteList,
			getAccountExecuteListAction,
			getAccountTaskInfoAction,
			singleCheckDataCensusAction,
			allCheckDataCensusAction,
			batchRemoveTaskAction,
			taskExecuteList,
			getTaskExecuteListAction,
			singleCheckTaskAction,
			allCheckTaskAction,
			accountTaskInfoList,
			TaskExecInfoList,
			getTaskExecuteInfoAction,
			singleCheckTaskQueueAction,
			allCheckTaskQueueAction,
			removeTaskByTypeAction
		} = this.props;
		return (
			<div className="datacensus-page">
				<Tabs activeKey={pageType} onChange={this.tabChange.bind(this)}>
					<TabPane tab="账号执行列表" key="account">
						{pageType == "account" && (
							<AccountList
								accountExecuteList={accountExecuteList}
								getAccountExecuteListAction={
									getAccountExecuteListAction
								}
								getAccountTaskInfoAction={
									getAccountTaskInfoAction
								}
								singleCheckDataCensusAction={
									singleCheckDataCensusAction
								}
								allCheckDataCensusAction={
									allCheckDataCensusAction
								}
								batchRemoveTaskAction={batchRemoveTaskAction}
								accountTaskInfoList={accountTaskInfoList}
							/>
						)}
					</TabPane>
					<TabPane tab="任务执行列表" key="task">
						{pageType == "task" && (
							<TaskList
								taskExecuteList={taskExecuteList}
								getTaskExecuteListAction={
									getTaskExecuteListAction
								}
								singleCheckTaskAction={singleCheckTaskAction}
								allCheckTaskAction={allCheckTaskAction}
								TaskExecInfoList={TaskExecInfoList}
								getTaskExecuteInfoAction={
									getTaskExecuteInfoAction
								}
								singleCheckTaskQueueAction={
									singleCheckTaskQueueAction
								}
								allCheckTaskQueueAction={
									allCheckTaskQueueAction
								}
								removeTaskByTypeAction={removeTaskByTypeAction}
								getAccountTaskInfoAction={
									getAccountTaskInfoAction
								}
								batchRemoveTaskAction={batchRemoveTaskAction}
								accountTaskInfoList={accountTaskInfoList}
							/>
						)}
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
