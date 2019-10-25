import * as React from "react";
import { Tabs } from "antd";
import Manager from "../components/manager";
import Role from "../components/role";
const TabPane = Tabs.TabPane;

import "./index.less";
interface Props {
	departmentList?: any;
	authList?: any;
	getDepartmentListAction?: Function;
	addDepartmentAction?: Function;
	deleteDepartmentAction?: Function;
	getAuthListAction?: Function;
	addRoleAction?: Function;
	getRoleListAction?: Function;
	roleList?: any;
	deleteRoleAction?: Function;
	addCustomerAction?: Function;
	deleteCustomerAction?: Function;
	getCustomerListAction?: Function;
	customerList?: any;
	clearCustomerListAction?: Function;
}
interface State {
	pageType: ManagerType;
}
declare type ManagerType = "manager" | "role";

export default class Root extends React.PureComponent<Props, State> {
	constructor(props: any) {
		super(props);
	}
	readonly state: State = {
		pageType: "manager"
	};
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "用户管理");
		this.props.clearCustomerListAction();
	}
	tabChange(e: any) {
		this.setState({
			pageType: e
		});
	}
	render() {
		let { pageType } = this.state;
		let {
			getDepartmentListAction,
			departmentList,
			addDepartmentAction,
			deleteDepartmentAction,
			getAuthListAction,
			authList,
			addRoleAction,
			getRoleListAction,
			roleList,
			deleteRoleAction,
			addCustomerAction,
			getCustomerListAction,
			deleteCustomerAction,
			customerList
		} = this.props;
		return (
			<div className="manager-page">
				<Tabs activeKey={pageType} onChange={this.tabChange.bind(this)}>
					<TabPane tab="部门及用户" key="manager">
						<Manager
							getDepartmentListAction={getDepartmentListAction}
							departmentList={departmentList}
							addDepartmentAction={addDepartmentAction}
							deleteDepartmentAction={deleteDepartmentAction}
							getRoleListAction={getRoleListAction}
							roleList={roleList}
							addCustomerAction={addCustomerAction}
							deleteCustomerAction={deleteCustomerAction}
							getCustomerListAction={getCustomerListAction}
							customerList={customerList}
						/>
					</TabPane>
					<TabPane tab="角色" key="role">
						<Role
							getAuthListAction={getAuthListAction}
							authList={authList}
							addRoleAction={addRoleAction}
							getRoleListAction={getRoleListAction}
							roleList={roleList}
							deleteRoleAction={deleteRoleAction}
						/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
