/**
 * 	公共组件：
 *    左右弹出框，主要用于首页点击任务弹出的执行详情
 */
import * as React from "react";
import * as ReactDom from "react-dom";
import * as classnames from "classnames";
import "./index.less";
interface Props {
	children?: any; //子元素
	direction?: DirectionType; //动画出现方向
	visible?: boolean;
	onCancel?: () => void;
	className?: string;
}
interface State {
	visibleContent: boolean;
	visibleBox: boolean;
}
declare type DirectionType = "left" | "top" | "right" | "bottom";

export default class Darw extends React.PureComponent<Props, State> {
	private InnerDom: React.RefObject<HTMLDivElement>;
	private _id = `darwBox_${new Date().getTime()}_${parseInt(
		(Math.random() * 100000000).toString(),
		10
	)}`;
	static readonly defaultProps: Props = {
		children: null,
		direction: "right",
		visible: false
	};

	readonly state: State = {
		visibleContent: false,
		visibleBox: false
	};
	constructor(props: Props) {
		super(props);
		this.InnerDom = React.createRef();
	}
	public componentDidMount() {
		this.initRender();
		if (this.props.visible) {
			this.setState({
				visibleBox: this.props.visible
			});
			setTimeout(() => {
				this.setState({
					visibleContent: this.props.visible
				});
			}, 100);
		}
	}
	public initRender() {
		//初始化渲染设置默认宽高
		//当动画方式是左右的时候 默认宽度100%
		//当动画方式是上下的时候 默认高度100%
		let { direction, children } = this.props;
		if (!children) {
			return;
		}
		let innerDom = this.InnerDom.current;
		if (!innerDom) {
			return;
		}
		let childDom =
			direction == "left" || direction == "top"
				? (innerDom.firstChild as HTMLElement)
				: (innerDom.lastChild as HTMLElement);
		if (direction == "left" || direction == "right") {
			let width = children.props.style.width;
			if (!width) {
				childDom.style.width = "100%";
			}
		}
		if (direction == "top" || direction == "bottom") {
			let height = children.props.style.height;
			if (!height) {
				childDom.style.height = "100%";
			}
		}
	}
	public componentDidUpdate(prevProps: any) {
		//显示过程
		if (!prevProps.visible && this.props.visible) {
			this.setState({
				visibleBox: this.props.visible
			});
			setTimeout(() => {
				this.setState({
					visibleContent: this.props.visible
				});
			}, 100);
		}
		//隐藏过程
		if (prevProps.visible && !this.props.visible) {
			this.setState({
				visibleContent: this.props.visible
			});
			setTimeout(() => {
				this.setState({
					visibleBox: this.props.visible
				});
			}, 396);
		}
	}
	public innerClick(e: any) {
		e.stopPropagation();
	}
	public closeClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			this.props.onCancel();
		}
	}
	public renderDom() {
		let { children, direction, className } = this.props;
		let { visibleContent, visibleBox } = this.state;

		return (
			<div
				className={classnames(
					"darw-box",
					visibleBox ? "show" : "",
					className
				)}
				id={this._id}
				key={this._id}
			>
				<div
					className={classnames(
						"darw-inner",
						visibleContent ? "" : direction,
						direction == "top" || direction == "bottom"
							? "column"
							: ""
					)}
					ref={this.InnerDom}
					onClick={this.innerClick.bind(this)}
				>
					{(direction == "right" || direction == "bottom") && (
						<div
							className="darw-before"
							onClick={this.closeClick.bind(this)}
						/>
					)}
					{children && children}
					{(direction == "top" || direction == "left") && (
						<div
							className="darw-after"
							onClick={this.closeClick.bind(this)}
						/>
					)}
				</div>
			</div>
		);
	}
	public render() {
		let { visibleBox } = this.state;
		return visibleBox
			? ReactDom.createPortal(this.renderDom(), document.body)
			: null;
	}
}
