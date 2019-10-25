import * as React from "react";
import { Button, Input, message } from "antd";
import "./index.less";
import defaultPic from "@img/default.jpg";

interface Props {
	data?: any;
	task?: Function;
}
interface State {
	rlpMsg: string[];
}

export default class Proving extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	state: State = {
		rlpMsg: []
	};
	componentDidMount() {
		let { data } = this.props;
		let len = data.length;
		let res: any[] = [];
		if (len > 0) {
			data.map((v: any) => {
				res.push("");
			});
		}
		this.setState({
			rlpMsg: [...res]
		});
	}
	// 添加
	async addFriend(data: any) {
		let account_id = window.sessionStorage.getItem("messageAccountId");
		let res = await this.props.task({
			username: data.username,
			account_id,
			type: 2
		});
		if (res && res.code == 200) {
			message.success("添加成功，等待验证");
		}
	}
	// 接受
	async acceptFriend(data: any) {
		let account_id = window.sessionStorage.getItem("messageAccountId");
		let res = this.props.task({
			username: data.username,
			account_id,
			type: 3
		});
		if (res && res.code == 200) {
			message.success("添加成功！");
		}
	}
	// 删除
	async deleteFriend(data: any) {
		let account_id = window.sessionStorage.getItem("messageAccountId");
		let res = await this.props.task({
			username: data.username,
			account_id,
			type: 1
		});
		if (res && res.code == 200) {
			message.success("删除成功！");
		}
	}
	// 回复
	replyMeg(data: any, i: number, value: any) {
		let account_id = window.sessionStorage.getItem("messageAccountId");
		this.props.task({
			username: data.username,
			account_id,
			type: 4,
			content: value
		});
		let { rlpMsg } = this.state;
		rlpMsg[i] = "";
		this.setState({
			rlpMsg: [...rlpMsg]
		});
	}
	handlReply(i: number, e: any) {
		let { rlpMsg } = this.state;
		rlpMsg[i] = e.target.value;
		this.setState({
			rlpMsg: [...rlpMsg]
		});
	}

	render() {
		let { data } = this.props;
		let { rlpMsg } = this.state;
		const { Search } = Input;
		return (
			<div className="proving-box">
				{data &&
					data.map((v: any, i: number) => {
						return (
							<div className="proving-item" key={i}>
								<div className="info">
									<div className="left">
										<img
											src={
												!v.headimg && v.headimg == ""
													? defaultPic
													: v.headimg
											}
											className="header-img"
										/>
										<span className="header-name">
											{v.nickname}
										</span>
									</div>
									<div className="right">
										{v.addstate == 0 ? (
											<div>
												<Button
													type="primary"
													size="small"
													className="proving-btn"
													onClick={this.addFriend.bind(
														this,
														v
													)}
												>
													添加
												</Button>
												<Button
													size="small"
													className="proving-btn"
													onClick={this.deleteFriend.bind(
														this,
														v
													)}
												>
													&nbsp;&nbsp;删除&nbsp;&nbsp;
												</Button>
											</div>
										) : null}
										{v.addstate == 3 ? (
											<div>
												<Button
													type="primary"
													size="small"
													className="proving-btn"
													onClick={this.acceptFriend.bind(
														this,
														v
													)}
												>
													接受
												</Button>
												<Button
													size="small"
													className="proving-btn"
													onClick={this.deleteFriend.bind(
														this,
														v
													)}
												>
													&nbsp;&nbsp;删除&nbsp;&nbsp;
												</Button>
											</div>
										) : null}
										{v.addstate == 1 ? (
											<div>已添加</div>
										) : null}
										{v.addstate == 2 ? (
											<div>等待验证</div>
										) : null}
									</div>
								</div>
								<div className="proving-msg">
									<div>
										{v.messages.map(
											(item: any, idx: number) => {
												return (
													<div
														key={idx}
														style={{
															marginBottom: "5px"
														}}
													>
														{/* <span>{item}</span> */}
														{item.indexOf(
															v.nickname
														) == 0 ||
														item.indexOf("我:") ==
															0 ? (
															<span>{item}</span>
														) : (
															<span>
																我:{item}
															</span>
														)}
													</div>
												);
											}
										)}
									</div>
									{v.addstate && v.addstate == 1 ? null : (
										<div>
											<Search
												placeholder="请输入回复文字"
												enterButton="发送"
												value={rlpMsg[i]}
												onChange={this.handlReply.bind(
													this,
													i
												)}
												style={{ width: 250 }}
												onSearch={this.replyMeg.bind(
													this,
													v,
													i
												)}
											/>
										</div>
									)}
								</div>
							</div>
						);
					})}
			</div>
		);
	}
}
