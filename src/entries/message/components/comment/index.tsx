import * as React from "react";
import { Empty } from "antd";
import { insetFace } from "@component/face";
import Scrollbars from "react-custom-scrollbars";
import "./index.less";

interface Props {
	data?: any;
	onReplay?: Function;
}
interface State {}

export default class Comment extends React.PureComponent<Props, State> {
	renderItem(props: any): any {
		let { data } = props;
		return (
			<div className="comment-item" onClick={props.onClick.bind(this)}>
				<img src={data.touxiang} className="img" />
				<div className="content">
					<div className="name-box">
						<span className="name-text">
							{data.comment_nickname}
						</span>
						{data &&
							data.send_nickname &&
							data.send_nickname.length > 0 && (
								<React.Fragment>
									<span>回复</span>
									<span className="name-text">
										{data.send_nickname}
									</span>
								</React.Fragment>
							)}
					</div>
					<div
						className="text"
						dangerouslySetInnerHTML={{
							__html: `${insetFace(data.content)}`
						}}
					/>
				</div>
			</div>
		);
	}
	itemClick(data: any) {
		let { onReplay } = this.props;
		if (onReplay && typeof onReplay === "function") {
			onReplay({
				pyqid: data.pyqid,
				ownName: data.currentaccountnickname,
				ownUserName: data.currentaccountusername,
				commentName: data.comment_nickname,
				comment_username: data.comment_username
			});
		}
	}
	render() {
		let { data } = this.props;
		return (
			<div className="comment-box">
				<Scrollbars autoHide={true}>
					{data &&
						data.comment &&
						data.comment.length > 0 &&
						data.comment.map((item: any, idx: number) => {
							return (
								<this.renderItem
									data={item}
									key={idx}
									onClick={this.itemClick.bind(this, item)}
								/>
							);
						})}
					{(!data || !data.comment || data.comment.length <= 0) && (
						<div className="nodatabox">
							<Empty />
						</div>
					)}
				</Scrollbars>
			</div>
		);
	}
}
