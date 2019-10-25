import * as React from "react";
import { Button, TimePicker } from "antd";
import InputBox from "@component/inputbox";
import * as moment from "moment";
import "./index.less";

interface Props {
	labelName?: string;
	onOk?: Function;
	type?: string;
}
interface State {
	time: any;
}

export default class SimpleTask extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		time: null
	};
	timeChange(e: any) {
		this.setState({
			time: e
		});
	}
	okClick() {
		let { onOk, type } = this.props;
		let { time } = this.state;
		if (onOk && typeof onOk === "function") {
			onOk(type, time ? time.format("HHmm") : "0");
		}
	}
	timeOpen(e: boolean) {
		if (e) {
			this.setState({
				time: moment()
			});
		}
	}
	render() {
		let { labelName } = this.props;
		let { time } = this.state;
		return (
			<div className="silmpegroup group">
				<InputBox labelName="执行时间">
					<TimePicker
						format="HH:mm"
						value={time}
						onChange={this.timeChange.bind(this)}
						onOpenChange={this.timeOpen.bind(this)}
						style={{ width: "300px" }}
					/>
				</InputBox>
				<InputBox>
					<Button
						className="btn"
						type="primary"
						onClick={this.okClick.bind(this)}
					>
						立即执行
					</Button>
				</InputBox>
			</div>
		);
	}
}
