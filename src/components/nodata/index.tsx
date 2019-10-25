/**
 * 	数据为空的页面
 */
import * as React from "react";
import { Empty } from "antd";
import "./index.less";

interface Props {}
interface State {}
export default class NoData extends React.PureComponent<Props, State> {
	render() {
		return (
			<div className="nodata">
				<Empty />
			</div>
		);
	}
}
