import * as React from "react";
import { InputNumber, Checkbox } from "antd";
import "./index.less";

interface Props {
	item: any;
	data?: any;
	onChange?: Function;
	input1Placeholder?: string;
	input2Placeholder?: string;
	input3Placeholder?: string;
	startWrod?: string;
	endWord?: string;
}
interface State {}

export default class ListItem extends React.PureComponent<Props, State> {
	static readonly defaultProps = {
		name: "",
		isOpen: false
	};
	constructor(props: Props) {
		super(props);
	}
	checkboxChange(e: any) {
		let data = this.props.data;
		data[0] = e.target.checked ? 1 : 0;
		this.props.onChange({
			key: this.props.item.key,
			value: data
		});
	}
	InputChange(idx: number, e: any) {
		let data = this.props.data;
		data[idx] = e;
		this.props.onChange({
			key: this.props.item.key,
			value: data
		});
	}
	inputBlur(idx: number, e: any) {
		let data = this.props.data;
		data[idx] = e.target.value == "" ? "0" : e.target.value;
		this.props.onChange({
			key: this.props.item.key,
			value: data
		});
	}
	public render() {
		let {
			data,
			item,
			input1Placeholder,
			input2Placeholder,
			input3Placeholder,
			startWrod,
			endWord
		} = this.props;
		return (
			<div className="step-item">
				<div className="item1">{item && item.name}</div>
				<div className="item2">
					<Checkbox
						checked={data && data[0] == 1}
						onChange={this.checkboxChange.bind(this)}
					>
						<span>{data && data[0] == 1 ? "开启" : "关闭"}</span>
					</Checkbox>
				</div>
				{/* <div className="item3">
					<span>命中率</span>
					<InputNumber
						className="input"
						value={data && data[1]}
						onChange={this.InputChange.bind(this, 1)}
						max={100}
						placeholder={input1Placeholder}
					/>
					<span>%</span>
				</div> */}
				<div className="item4">
					<span>{startWrod ? startWrod : "执行时间间隔"}</span>
					<InputNumber
						className="input"
						value={data && data[2]}
						onChange={this.InputChange.bind(this, 2)}
						onBlur={this.inputBlur.bind(this, 2)}
						precision={0}
						placeholder={input2Placeholder}
						min={0}
					/>
					<span>-</span>
					<InputNumber
						className="input"
						value={data && data[3]}
						onChange={this.InputChange.bind(this, 3)}
						onBlur={this.inputBlur.bind(this, 3)}
						precision={0}
						placeholder={input3Placeholder}
						min={0}
					/>
					<span>{endWord ? endWord : "天"}</span>
				</div>
			</div>
		);
	}
}
