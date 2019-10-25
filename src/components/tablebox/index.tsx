/**
 *  表格组件
 *		headerList:表头
		data:表格数据[]
		isLoading:数据加载的loading效果
		style:自定义样式
		isFullPage:是否铺满 true false
 */
import * as React from "react";
import * as ReactDom from "react-dom";
import { Icon, Empty } from "antd";
import * as classnames from "classnames";
import "./index.less";
interface Props {
	headerList: any;
	data: any[];
	isLoading?: boolean;
	style?: any;
	className?: string;
	isFullPage?: boolean;
	animationed?: boolean;
	columnClick?: Function;
	onScroll?: Function;
}
interface State {
	bodyHeight: number;
	isPadding: boolean;
}
export default class TableBox extends React.PureComponent<Props, State> {
	public event = window.Util.getBroswer("Firefox")
		? "DOMMouseScroll"
		: "mousewheel";
	constructor(props: Props) {
		super(props);
	}
	private preScrollTop: number = 0;
	static readonly defaultProps = {
		isLoading: false,
		isFullPage: true,
		animationed: false
	};
	readonly state: State = {
		bodyHeight: 0,
		isPadding: false
	};
	public componentDidMount() {
		this.reckonWidth();
		if (this.props.animationed) {
			this.setBodyHeight();
		}

		this.initScroll();
		window.addEventListener("resize", this.reckonWidth.bind(this), false);
		setTimeout(() => {
			this.setHeaderPadding();
		}, 100);
	}

	public componentDidUpdate() {
		if (this.props.animationed) {
			this.setBodyHeight();
		}
		this.setHeaderPadding();
	}
	public componentWillUnmount() {
		let { onScroll } = this.props;
		let tableBox = this.refs.tableBody as HTMLElement;
		window.removeEventListener(
			"resize",
			this.reckonWidth.bind(this),
			false
		);
		if (onScroll && typeof onScroll === "function") {
			tableBox.removeEventListener(
				this.event,
				this.scrollEvent.bind(this),
				false
			);
		}
	}
	public initScroll() {
		let { onScroll } = this.props;
		let tableBox = this.refs.tableBody as HTMLElement;
		if (onScroll && typeof onScroll === "function") {
			tableBox.addEventListener(
				this.event,
				this.scrollEvent.bind(this),
				false
			);
		}
	}
	public scrollEvent(e: any) {
		e.stopPropagation();
		let { onScroll } = this.props;
		let tableBox = this.refs.tableBody as HTMLElement;
		if (onScroll && typeof onScroll === "function") {
			if (tableBox.scrollTop >= 0 && e.deltaY > 0) {
				onScroll("down", tableBox.scrollTop, this.preScrollTop);
				setTimeout(() => {
					this.setHeaderPadding();
				}, 300);
			}

			if (tableBox.scrollTop <= this.preScrollTop && e.deltaY < 0) {
				onScroll("up", tableBox.scrollTop, this.preScrollTop);
				setTimeout(() => {
					this.setHeaderPadding();
				}, 300);
			}
			this.preScrollTop = tableBox.scrollTop;
		}
	}
	public reckonWidth() {
		let { headerList } = this.props;
		let box = ReactDom.findDOMNode(this.refs.tableBox) as HTMLElement;
		if (!box) {
			return;
		}
		let tableW = box.clientWidth;
		let parentNode = box.parentNode as HTMLElement;
		let pw = parentNode.clientWidth;
		let tw: number = 0;
		headerList.map((item: any) => {
			if (item.width) {
				tw = tw + item.width;
			} else {
				let w: number = 150;
				if (item.class && item.class.length > 0) {
					let cls = item.class.split(" ");
					cls.map((item: any) => {
						let reg = /^td\d{1,3}$/;
						if (reg.test(item)) {
							w = Number(item.replace("td", ""));
						}
					});
				}
				tw = tw + w;
			}
		});
		if (tw > tableW) {
			box.style.width = tw + "px";
		}
		if (pw > tw) {
			box.style.width = "100%";
		}
	}
	public renderProps(item: any, index?: number): any {
		var res: any = {};
		if (item.width) {
			res.style = { width: item.width + "px" };
		}
		return res;
	}
	public setHeaderPadding() {
		let body = this.refs["tableBody"] as HTMLElement;
		let container = this.props.animationed
			? (this.refs["tableContainerDiv"] as HTMLElement)
			: (this.refs["tableContainer"] as HTMLElement);
		if (body && container && body.clientHeight < container.clientHeight) {
			this.setState({
				isPadding: true
			});
		} else {
			this.setState({
				isPadding: false
			});
		}
	}
	public setBodyHeight() {
		let { data } = this.props;
		let h: number = 0;
		let body = this.refs["tableBody"] as HTMLElement;
		if (body && data && data.length > 0) {
			data.map((item: any) => {
				let i = this.refs["dataRow" + item.key] as HTMLElement;
				if (i) {
					i.style.top = item.idx * i.clientHeight + "px";
					h = h + i.clientHeight;
				}
			});
			this.setState({
				bodyHeight: h
			});
		}
	}
	public trClick(item: any) {
		let { columnClick } = this.props;
		if (columnClick && typeof columnClick === "function") {
			columnClick(item);
		}
	}
	public render() {
		let {
			headerList,
			data,
			isLoading,
			style,
			className,
			isFullPage,
			animationed
		} = this.props;
		let { bodyHeight, isPadding } = this.state;

		return (
			<div
				className={classnames(
					"table-container",
					className,
					isFullPage ? "" : "nofull"
				)}
				style={style}
			>
				<div className="table-box" id="tableBox" ref="tableBox">
					<div className="left-fixed">
						<table className="table-header">
							<tbody>
								<tr>
									{headerList &&
										headerList.length > 0 &&
										headerList.map(
											(item: any, idx: number) => {
												if (
													item.fixed &&
													item.fixed == "left"
												) {
													if (item.renderTitle) {
														return item.renderTitle();
													}
													return (
														<td key={idx}>
															{item.name}
														</td>
													);
												}
											}
										)}
								</tr>
							</tbody>
						</table>
						<table className="table-body">
							<tbody>
								{data &&
									data.length > 0 &&
									data instanceof Array &&
									data.map((item: any, idx: number) => {
										return (
											<tr key={idx}>
												{headerList &&
													headerList.map(
														(v: any, i: number) => {
															if (
																v.fixed &&
																v.fixed ==
																	"left"
															) {
																return (
																	<td
																		key={i}
																		className={
																			v.class
																		}
																		{...this.renderProps(
																			v
																		)}
																	>
																		{v.render &&
																			v.render(
																				item,
																				idx
																			)}
																		{!v.render &&
																			item[
																				v
																					.key
																			]}
																	</td>
																);
															}
														}
													)}
											</tr>
										);
									})}
							</tbody>
						</table>
					</div>
					<div style={{ overflow: "auto" }}>
						<div
							className="table-header"
							style={{ paddingRight: isPadding ? "17px" : 0 }}
						>
							<table className="table">
								<thead>
									<tr>
										{headerList &&
											headerList.length > 0 &&
											headerList.map(
												(item: any, index: any) => {
													if (item.fixed) {
														return null;
													}
													if (item.titleRender) {
														return (
															<td
																key={index}
																className={
																	item.class
																}
																{...this.renderProps(
																	item
																)}
															>
																{item.titleRender()}
															</td>
														);
													} else {
														return (
															<td
																key={index}
																className={
																	item.class
																}
																{...this.renderProps(
																	item
																)}
															>
																{item.name}
															</td>
														);
													}
												}
											)}
									</tr>
								</thead>
							</table>
						</div>
						<div
							className={classnames(
								"table-body",
								isFullPage ? "" : "notfull"
							)}
							style={{
								height: animationed ? bodyHeight + "px" : "auto"
							}}
							ref="tableBody"
						>
							{isLoading && (
								<div className="loadingbox">
									<Icon
										type="loading-3-quarters"
										style={{ fontSize: "30px" }}
										spin
									/>
									<div className="loading-text">
										加载中...
									</div>
								</div>
							)}

							{!isLoading &&
								!animationed &&
								data &&
								data.length > 0 &&
								data instanceof Array && (
									<table
										className="table"
										ref="tableContainer"
									>
										<tbody>
											{data.map(
												(item: any, index: any) => {
													return (
														<tr
															key={index}
															className={(index => {
																return index %
																	2 ==
																	0
																	? "odd"
																	: "";
															})(index)}
															onClick={this.trClick.bind(
																this,
																item
															)}
														>
															{headerList &&
																headerList.length >
																	0 &&
																headerList.map(
																	(
																		v: any,
																		i: any
																	) => {
																		if (
																			v.fixed
																		) {
																			return null;
																		}
																		return (
																			<td
																				key={
																					i
																				}
																				className={
																					v.class
																				}
																				{...this.renderProps(
																					v
																				)}
																			>
																				{v.render &&
																					v.render(
																						item,
																						index
																					)}
																				{!v.render &&
																					item[
																						v
																							.key
																					]}
																			</td>
																		);
																	}
																)}
														</tr>
													);
												}
											)}
										</tbody>
									</table>
								)}
							{animationed && (
								<div
									ref="tableContainerDiv"
									style={{
										height: animationed
											? bodyHeight + "px"
											: "auto"
									}}
								>
									{data &&
										data.map((item: any, index: any) => {
											return (
												<div
													key={index}
													className={classnames(
														"item",
														(index => {
															return item.idx %
																2 ==
																0
																? "odd"
																: "";
														})(index)
													)}
													data-key={item.key}
													ref={"dataRow" + item.key}
													onClick={this.trClick.bind(
														this,
														item
													)}
												>
													{headerList &&
														headerList.length > 0 &&
														headerList.map(
															(
																v: any,
																i: any
															) => {
																if (v.fixed) {
																	return null;
																}
																return (
																	<div
																		key={i}
																		className={classnames(
																			"div",
																			v.class
																		)}
																		{...this.renderProps(
																			v
																		)}
																	>
																		{v.render &&
																			v.render(
																				item,
																				index
																			)}
																		{!v.render &&
																			item[
																				v
																					.key
																			]}
																	</div>
																);
															}
														)}
												</div>
											);
										})}
								</div>
							)}

							{!isLoading &&
								(!data ||
									data.length <= 0 ||
									!(data instanceof Array)) && (
									<div className="nodata">
										<Empty />
										{/* <Icon
										type="frown"
										style={{
											fontSize: "40px",
											color: "#a4a4a4"
										}}
									/> */}
										{/* <div className="nodata-text">暂无数据</div> */}
									</div>
								)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
