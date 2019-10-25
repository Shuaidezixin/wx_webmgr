import * as React from "react";
import { Icon } from "antd";
import "./index.less";
import PlayIcon from "@img/play.png";
interface Props {}
export default class Root extends React.PureComponent<Props, any> {
	private listDom: React.RefObject<HTMLDivElement>;
	constructor(props: any) {
		super(props);
		this.listDom = React.createRef();
	}
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "模板");
	}
	renderPush(props: any) {
		return (
			<div className="pushbox">
				<div className="text">三打赏</div>
				<div className="imgbox">
					<img
						src="https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=2638618750,936836136&fm=85&s=776209E016E33EA74320015B0300D092"
						className="img"
					/>
					<img
						src="https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=2638618750,936836136&fm=85&s=776209E016E33EA74320015B0300D092"
						className="img"
					/>
					<img
						src="https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=2638618750,936836136&fm=85&s=776209E016E33EA74320015B0300D092"
						className="img"
					/>
				</div>
				<div className="videobox">
					<div className="video">
						<img
							src="https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=2638618750,936836136&fm=85&s=776209E016E33EA74320015B0300D092"
							className="img"
						/>
						<div className="cover">
							<img src={PlayIcon} />
						</div>
					</div>
				</div>
				<div className="link">
					<img
						src="https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=2638618750,936836136&fm=85&s=776209E016E33EA74320015B0300D092"
						className="coverimg"
					/>
					<div className="link-title">
						自评：哈哈哈哈哈大傻冒自评：哈哈哈哈哈大傻冒自评：哈哈哈哈哈大傻冒自评：哈哈哈哈哈大傻冒自评：哈哈哈哈哈大傻冒
					</div>
				</div>
				<div className="mark">
					<img src="https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=2638618750,936836136&fm=85&s=776209E016E33EA74320015B0300D092" />
				</div>
				<div className="txt">哈哈哈哈哈大傻冒</div>
			</div>
		);
	}
	goSroll(to: any) {
		if (typeof to === "string") {
			if (to == "top") {
				this.listDom.current.scrollTop = 0;
			}
			if (to == "bottom") {
				this.listDom.current.scrollTop = this.listDom.current.scrollHeight;
			}
		}
	}
	render() {
		return (
			<div className="template-page">
				<div>222</div>
				<div className="template-container">
					<div className="template-left">
						<div
							className="tem-nav"
							onClick={this.goSroll.bind(this, "top")}
						>
							到顶部
						</div>
						<div
							className="tem-nav"
							onClick={this.goSroll.bind(this, "bottom")}
						>
							到底部
						</div>
					</div>
					<div className="template-right" ref={this.listDom}>
						<div className="group">
							<div className="group-title">
								<div className="name">Day1</div>
								<div className="ctrl">
									<Icon className="ctrl-icon" type="plus" />
									<Icon className="ctrl-icon" type="delete" />
								</div>
							</div>
							<div className="group-content">
								<div className="group-item">
									<div className="time">10:23</div>
									<div className="type">发表朋友圈：</div>
									<div className="cont">
										<div className="event">
											<this.renderPush />
										</div>
										<div>
											<span className="delete">删除</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="group">
							<div className="group-title">
								<div className="name">Day1</div>
								<div className="ctrl">
									<Icon className="ctrl-icon" type="plus" />
									<Icon className="ctrl-icon" type="delete" />
								</div>
							</div>
							<div className="group-content">
								<div className="group-item">
									<div className="time">10:23</div>
									<div className="type">发表朋友圈：</div>
									<div className="cont">
										<div className="event">
											<this.renderPush />
										</div>
										<div>
											<span className="delete">删除</span>
										</div>
									</div>
								</div>
								<div className="group-item">
									<div className="time">10:23</div>
									<div className="type">发表朋友圈：</div>
									<div className="cont">
										<div className="event">
											<this.renderPush />
										</div>
										<div>
											<span className="delete">删除</span>
										</div>
									</div>
								</div>
								<div className="group-item">
									<div className="time">10:23</div>
									<div className="type">发表朋友圈：</div>
									<div className="cont">
										<div className="event">
											<this.renderPush />
										</div>
										<div>
											<span className="delete">删除</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
