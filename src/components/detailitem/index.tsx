/**
 * 	公共组件：
 *    详情Item
 */
import * as React from "react";
import classnames from "classnames";
import "./index.less";
interface Props {
	className?: string;
	style?: any;
	isBlock?: boolean;
	labelName: string;
	content: string | any;
	nameWidth?: string;
	fixedTop?: boolean;
}

export default class DetailItem extends React.PureComponent<Props> {
	static readonly defaultProps: Props = {
		className: "",
		labelName: "",
		content: "",
		nameWidth: "auto",
		isBlock: false,
		style: {},
		fixedTop: false
	};
	private detailItem: React.RefObject<HTMLDivElement>;
	private detailContent: React.RefObject<HTMLSpanElement>;
	private detailName: React.RefObject<HTMLSpanElement>;
	constructor(props: Props) {
		super(props);
		this.detailItem = React.createRef();
		this.detailContent = React.createRef();
		this.detailName = React.createRef();
	}
	public componentDidMount() {
		if (this.props.isBlock) {
			this.countContentWidth();
		} else {
			this.countWidth();
		}
	}
	public countWidth() {
		let item: HTMLElement = this.detailItem.current;
		let w: number = item.clientWidth;
		let s: number = w / 300;
		let n: number = parseInt(Math.ceil(s).toString()) * 300;
		item.style.width = n + "px";
	}
	public countContentWidth() {
		let item: HTMLElement = this.detailItem.current;
		let name: HTMLElement = this.detailName.current;
		let content: HTMLElement = this.detailContent.current;
		let w: number = item.clientWidth;
		let nw: number = name.clientWidth;
		content.style.width = w - nw - 40 + "px";
	}
	render() {
		let {
			className,
			labelName,
			content,
			style,
			isBlock,
			nameWidth,
			fixedTop
		} = this.props;
		return (
			<div
				className={classnames(
					"detail-item",
					className,
					fixedTop ? "top" : ""
				)}
				style={{
					display: isBlock ? "block" : "inline-block",
					...style
				}}
				ref={this.detailItem}
			>
				<span
					className="detail-item-name"
					style={{ width: nameWidth }}
					ref={this.detailName}
				>
					{labelName}
				</span>
				<span className="detail-item-text" ref={this.detailContent}>
					{content ? content : "--"}
				</span>
			</div>
		);
	}
}
