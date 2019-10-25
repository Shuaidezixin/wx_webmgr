import * as React from "react";
import "./index.less";

interface Props {}
interface State {}

export default class DeviceItem extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		return <div className="device-item">2</div>;
	}
}
