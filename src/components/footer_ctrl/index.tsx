/**
 * 	公共组件：
 *    页脚分页
 */
import * as React from "react";
import { Pagination, Checkbox, Select, Button } from "antd";
import classnames from "classnames";
const Option = Select.Option;
import "./index.less";
export interface Props {
	currentPage: number;
	pageSize: number;
	total: number;
	batch?: any;
	isCheckAll?: boolean;
	batchSure?: any;
	batchValue?: number;
	pageChange: any;
	checkBoxChange?: any;
	className?: string;
	isShowText?: boolean;
}
export interface State {
	batch: any;
	batchValue: number;
}
export default class FooterCtrl extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	readonly state = {
		batch: this.props.batch ? this.props.batch : [],
		batchValue: this.props.batchValue
			? this.props.batchValue
			: this.props.batch && this.props.batch.length > 0
			? this.props.batch[0].value
			: 0
	};
	pageChange(e: any): void {
		let { pageChange } = this.props;
		if (pageChange && typeof pageChange === "function") {
			this.props.pageChange(e);
		}
	}
	batchChange(e: any): void {
		this.setState({
			batchValue: e
		});
	}
	checkAllBoxChange(e: any): void {
		if (
			this.props.checkBoxChange &&
			typeof this.props.checkBoxChange === "function"
		) {
			this.props.checkBoxChange(e);
		}
	}
	batchSureClick(): void {
		let { batchSure } = this.props;
		if (batchSure && typeof batchSure === "function") {
			batchSure({ value: this.state.batchValue });
		}
	}
	render() {
		let {
			currentPage = 1,
			pageSize = 20,
			total,
			isCheckAll = false,
			className,
			isShowText = true
		} = this.props;
		let { batch, batchValue } = this.state;
		return (
			<div className={classnames("footerctrl", className)}>
				<div className="left">
					{batch && batch.length > 0 && (
						<span>
							<Checkbox
								checked={isCheckAll}
								onChange={this.checkAllBoxChange.bind(this)}
							/>
							<span>全选</span>
							<Select
								onChange={this.batchChange.bind(this)}
								value={batchValue}
								style={{ width: "1rem" }}
							>
								{batch.map((item: any, index: any) => {
									return (
										<Option key={index} value={item.value}>
											{item.label}
										</Option>
									);
								})}
							</Select>
							<Button
								onClick={this.batchSureClick.bind(this)}
								style={{ marginLeft: ".1rem" }}
								type="primary"
							>
								确定
							</Button>
						</span>
					)}
				</div>
				<Pagination
					showTotal={(total, range) => {
						if (!isShowText) {
							return null;
						}
						return `共${Math.ceil(total / pageSize)}页/${
							total ? total : 0
						}条数据`;
					}}
					current={currentPage}
					pageSize={pageSize}
					total={total}
					onChange={this.pageChange.bind(this)}
					showQuickJumper={false}
				/>
			</div>
		);
	}
}
