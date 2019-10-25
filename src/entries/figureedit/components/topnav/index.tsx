import * as React from "react";
import { Button } from "antd";
import * as classnames from "classnames";
import "./index.less";
interface Props {
	activeIndex?: number;
	onChange?: Function;
	isCanClickNav?: boolean;
}
interface State {}

export default class TopNav extends React.PureComponent<Props, State> {
	private navList: any;
	static readonly defaultProps: Props = {
		activeIndex: 0,
		isCanClickNav: true
	};
	constructor(props: Props) {
		super(props);
		this.navList = [
			{
				name: "基本信息",
				key: 0,
				type: "basic"
			},
			{
				name: "账户及隐私",
				key: 1,
				type: "userinfo"
			},
			{
				name: "加好友",
				key: 2,
				type: "addfriend"
			},
			{
				name: "消息设置",
				key: 3,
				type: "chatconfig"
			},
			{
				name: "朋友圈",
				key: 4,
				type: "pyq"
			},
			{
				name: "公众号",
				key: 5,
				type: "gzh"
			},
			{
				name: "收藏",
				key: 6,
				type: "sc"
			},
			{
				name: "查看好友资料",
				key: 7,
				type: "viewfriend"
			}
		];
	}
	public navItemClick(idx: number) {
		let { onChange, isCanClickNav, activeIndex } = this.props;
		if (!isCanClickNav) {
			return;
		}
		if (onChange && typeof onChange === "function") {
			onChange(idx, this.navList[activeIndex].type);
		}
	}
	public preClick() {
		let { activeIndex, onChange } = this.props;
		if (onChange && typeof onChange === "function") {
			let pre: any, type: string;
			this.navList.map((item: any, idx: number) => {
				if (item.key == activeIndex) {
					pre = this.navList[idx - 1];
					type = item.type;
				}
			});
			onChange(pre.key, type);
		}
	}
	public nextClick() {
		let { activeIndex, onChange } = this.props;
		if (onChange && typeof onChange === "function") {
			let next: any, type: string;
			this.navList.map((item: any, idx: number) => {
				if (item.key == activeIndex) {
					next = this.navList[idx + 1];
					type = item.type;
				}
			});
			onChange(next.key, type);
		}
	}
	public overClick() {
		let { activeIndex, onChange } = this.props;
		if (onChange && typeof onChange === "function") {
			let type = this.navList[this.navList.length - 1].type;
			onChange("last", type);
			window.sessionStorage.removeItem("figureActiveIDX");
		}
	}
	cancelClick() {
		window.appHistory.push({
			pathname: "/character/figure"
		});
	}
	public render() {
		let { activeIndex } = this.props;
		return (
			<div className="topnav-component">
				<div className="topnav-left">
					{this.navList &&
						this.navList.map((item: any, idx: number) => {
							return (
								<span
									className={classnames(
										"nav-item",
										activeIndex >= item.key ? "act" : ""
									)}
									key={idx}
									onClick={this.navItemClick.bind(
										this,
										item.key
									)}
								>
									{idx + 1}.{item.name}
								</span>
							);
						})}
				</div>
				<div className="topnav-right">
					<Button
						className="topnav-btn"
						type={"primary"}
						disabled={activeIndex == 0 ? true : false}
						onClick={this.preClick.bind(this)}
					>
						上一步
					</Button>
					{activeIndex <
						this.navList[this.navList.length - 1].key && (
						<Button
							className="topnav-btn"
							// disabled={
							// 	activeIndex >=
							// 	this.navList[this.navList.length - 1].key
							// 		? true
							// 		: false
							// }
							type={"primary"}
							onClick={this.nextClick.bind(this)}
						>
							下一步
						</Button>
					)}
					{activeIndex >=
						this.navList[this.navList.length - 1].key && (
						<Button
							className="topnav-btn"
							type={"primary"}
							onClick={this.overClick.bind(this)}
						>
							完成
						</Button>
					)}
					<Button
						style={{ marginLeft: "5px" }}
						onClick={this.cancelClick.bind(this)}
					>
						返回列表
					</Button>
				</div>
			</div>
		);
	}
}
