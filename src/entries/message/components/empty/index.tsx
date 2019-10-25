import * as React from "react";
import { Icon } from "antd";
import "./index.less";

interface Props {}
interface State {}

export default class EmptyChat extends React.PureComponent<Props, State> {
	render() {
		return (
			<div className="empty-chat">
				<Icon type="wechat" className="wechat" />
			</div>
		);
	}
}
