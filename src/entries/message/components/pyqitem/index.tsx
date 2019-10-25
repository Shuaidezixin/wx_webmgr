import * as React from "react";
import { Icon, message } from "antd";
import { insetFace } from "@component/face";
import * as moment from "moment";
import * as classnames from "classnames";
import SinglePic from "@img/single.jpg";
import "./index.less";

interface Props {
	onZan?: Function;
	onReplay?: Function;
	data: any;
}
interface State {}

export default class PyqItem extends React.PureComponent<Props, State> {
	replyClick(
		pyqid: string,
		ownName: string,
		ownUserName: string,
		comment_username: string,
		commentName: string
	) {
		let { onReplay } = this.props;
		if (onReplay && typeof onReplay === "function") {
			if (!ownUserName || ownUserName.length <= 0) {
				message.error("获取自己username失败");
				return;
			}
			if (ownUserName == comment_username) {
				message.error("不能回复自己的评论");
				return;
			}
			onReplay({
				pyqid,
				ownName,
				ownUserName,
				commentName,
				comment_username
			});
		}
	}
	zanClick() {
		let { onZan } = this.props;
		if (onZan && typeof onZan === "function") {
			onZan();
		}
	}
	formatTime(data: any) {
		let res = "";
		if (!data || !data.pyq_time || data.pyq_time.toString().length != 10) {
			return res;
		}
		let t = data.pyq_time.toString() + "000";
		let d = moment(Number(t)); //.format("HH:mm");

		return d.fromNow();
	}
	formartData(data: string) {
		return data.replace(/\</gi, "&lt;").replace(/\>/gi, "&gt;");
	}
	render() {
		let { data } = this.props;
		let { dianzan_list, comment_list } = data;
		let dianzhan: any = [];
		let comment: any = [];
		if (dianzan_list && dianzan_list.length > 0) {
			dianzan_list.map((v: any) => {
				if (v.nickname && v.nickname.length > 0) {
					dianzhan.push(v);
				}
			});
		}
		if (comment_list && comment_list.length > 0) {
			comment_list.map((v: any) => {
				if (v && v.comment_nickname && v.comment_nickname.length > 0) {
					comment.push(v);
				}
			});
		}
		return (
			<div className="pyqitem">
				<img
					src={
						data && data.touxiang && data.touxiang.length > 0
							? data.touxiang
							: SinglePic
					}
					className="pyq-header"
				/>
				<div className="pyq-content">
					<div className="pyq-name">{data && data.nickname}</div>
					<div
						className="pyq-text"
						dangerouslySetInnerHTML={{
							__html: `${data &&
								insetFace(this.formartData(data.pyq_content))}`
						}}
					/>
					{data && data.pic_list_url && data.pic_list_url.length > 0 && (
						<div className="pyq-image">
							{data.pic_list_url.map((v: any, i: number) => {
								return (
									<img key={i} src={v} className="pyq-img" />
								);
							})}
						</div>
					)}
					{data && data.video_url && data.video_url.length > 0 && (
						<video width="210" controls src={data.video_url} />
					)}
					<div className="pyq-ctrl">
						<div className="time">{this.formatTime(data)}</div>
						<div className="ctrl">
							<Icon
								type="heart"
								className={classnames(
									"icon",
									data && data.isselfzan && "act"
								)}
								onClick={this.zanClick.bind(this)}
							/>
							<Icon
								type="message"
								className="icon"
								onClick={this.replyClick.bind(
									this,
									data.pyq_id,
									data.currentaccountnickname,
									data.currentaccountusername,
									"",
									""
								)}
							/>
						</div>
					</div>
					{dianzhan && dianzhan.length > 0 && (
						<div className="pyq-zan">
							<Icon type="heart" className="icon" />
							<div className="pyq-zan-name">
								{dianzhan.map((v: any, i: number) => {
									return (
										<span key={i}>
											{i > 0 && ","}
											{v.nickname}
										</span>
									);
								})}
							</div>
						</div>
					)}
					{comment && comment.length > 0 && (
						<div className="pyq-comment">
							{comment.map((v: any, i: number) => {
								return (
									<div
										key={i}
										className="comment-item"
										onClick={this.replyClick.bind(
											this,
											data.pyq_id,
											data.currentaccountnickname,
											data.currentaccountusername,
											v.comment_username,
											v.comment_nickname
										)}
									>
										<span className="name">
											{v.comment_nickname}
										</span>
										{v.send_username &&
											v.send_username.length > 0 && (
												<React.Fragment>
													<span className="to">
														回复
													</span>
													<span className="name">
														{v.send_username}
													</span>
												</React.Fragment>
											)}

										<span
											dangerouslySetInnerHTML={{
												__html: `:${insetFace(
													v.content
												)}`
											}}
										/>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		);
	}
}
