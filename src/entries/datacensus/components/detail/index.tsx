import * as React from "react";
import { Modal, Tag } from "antd";
import DetailItem from "@component/detailitem";
import { itemMap } from "../../../../components/map";
import * as moment from "moment";
import "./index.less";

interface Props {
	visible: boolean;
	onCancel?: Function;
	data?: any;
}
interface State {}

export default class Detail extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {
		visible: false
	};
	// 不同任务对应的显示
	renderSay(props: any) {
		let { item, type } = props;
		return (
			<div className="contentbox">
				{item && item.msg && <div className="text">{item.msg}</div>}
				{/* {item && item.Name && <div className="text">{item.Name}</div>} */}
				{(type => {
					let res: any;
					switch (type) {
						case "User_touxiang":
							res = (
								<div className="imgbox">
									<img src={item.Name} className="img" />
								</div>
							);
							break;
						case "User_pyq_bizhi":
							res = (
								<div
									style={{
										display: "flex",
										justifyContent: "center"
									}}
								>
									<img
										src={item.Name}
										style={{ width: "200px" }}
									/>
								</div>
							);
							break;
						// case "User_profile":
						// 	res = (
						// 		<div className="user-profile">{item.Name}</div>
						// 	);
						// 	break;
						case "AddFriend_jiansuo":
							res = (
								<div className="mark">
									<div className="friend-detail">
										{item.MobileList && "号码："}
										{item.MobileList &&
											item.MobileList.map(
												(v: any, idx: number) => {
													return (
														<Tag
															key={idx}
															color="#2db7f5"
															style={{
																marginBottom:
																	"5px"
															}}
														>
															{v}
														</Tag>
													);
												}
											)}
									</div>
									{item.Desc && item.Desc.length > 0 && (
										<div className="desc">
											验证语：{item.Desc}
										</div>
									)}
								</div>
							);
							break;
						case "Pyq_comment":
							res = <div>内容：{item.Content}</div>;
							break;
						case "AddFriend_tongxunlu":
							res = (
								<div className="mark">
									<div>验证语：{item.Desc}</div>
									{/* <div className="friend-detail">
										{item.mobilelist && "手机号码："}
										{item.mobilelist &&
											item.mobilelist.map(
												(v: any, idx: number) => {
													return (
														<Tag
															key={idx}
															color="#2db7f5"
														>
															{v}
														</Tag>
													);
												}
											)}
									</div> */}
								</div>
							);
							break;
						case "AddFriend_qun":
							res = (
								<div className="mark">
									{item &&
										item.Desc &&
										item.Desc.length > 0 && (
											<div>验证语:{item.Desc}</div>
										)}
									{item &&
										item.GroupList &&
										item.GroupList.length > 0 && (
											<div className="friend-detail">
												群：
												{item.GroupList &&
													item.GroupList.length > 0 &&
													item.GroupList.map(
														(
															v: any,
															idx: number
														) => {
															return (
																<Tag
																	key={idx}
																	color="#2db7f5"
																>
																	{v}
																</Tag>
															);
														}
													)}
											</div>
										)}
									{item &&
										!item.Desc &&
										(!item.GroupList ||
											item.GroupList.length <= 0) && (
											<div>随机任务</div>
										)}
								</div>
							);
							break;
						case "AddFriend_tongguo":
							res = "";
							break;
						case "Pyq_sentshuoshuo":
							res = (
								<div className="send-shuoshuo">
									{/* {item &&
										item.msg &&
										item.msg.length > 0 && (
											<div className="shuoshuo-content">
												内容：{item.msg}
											</div>
										)} */}
									{item && item.pics && item.pics.length > 0 && (
										<div className="shuoshuo-pics">
											{item.pics.map(
												(v: any, i: number) => {
													return (
														<img
															src={v}
															key={i}
															alt=""
														/>
													);
												}
											)}
										</div>
									)}
									{item && item.self_zan && (
										<div className="shuoshuo-self">
											自赞
										</div>
									)}
									{item &&
										item.self_comment &&
										item.self_comment.length > 0 && (
											<div className="shuoshuo-self">
												自评:{item.self_comment}
											</div>
										)}
								</div>
							);
							break;
						case "SC_add_note":
							res = (
								<React.Fragment>
									<div className="text1">
										{item &&
										item.Name &&
										item.Name.length > 0
											? item.Name
											: "随机任务"}
									</div>
									<div className="imgbox">
										<img src={item.Pic} className="img" />
									</div>
								</React.Fragment>
							);
							break;
						case "Gzh_guanzhu_cancel":
							res = "随机";
							break;
						case "Gzh_dakaiyulan":
							res = "随机";
							break;
						case "Gzh_yuedu":
							res = "随机";
							break;
						case "Gzh_soucang":
							res = "随机";
							break;
						case "Gzh_zhuanfa_pyq":
							res = "随机";
							break;
						case "Gzh_zhuanfa_chat":
							res = "随机";
							break;
						case "Gzh_top":
							res = "随机";
							break;
						case "Gzh_delete_chat":
							res = "随机";
							break;
						case "Gzh_clear_content":
							res = "随机";
							break;
						case "Pyq_dianzan":
							res = "";
							break;
						case "User_password_update":
							res = <div>新密码:{item.NewPass}</div>;
							break;
						default:
							res = (
								<div className="text1">
									{item &&
										item.name &&
										item.name.length > 0 &&
										item.name}
									{item &&
										item.Name &&
										item.Name.length > 0 &&
										item.Name}
									{(!item ||
										(!item.name && !item.Name) ||
										(item.name &&
											item.name.length < 0 &&
											item.Name &&
											item.Name.length < 0)) &&
										"随机任务"}
								</div>
							);
							break;
					}
					return res;
				})(type)}

				{item && item.pic && item.pic.length > 0 && (
					<div className="imgbox">
						{item.pic.map((v: any, i: number) => {
							return <img src={v} key={i} className="img" />;
						})}
					</div>
				)}
				{item && item.video_url && item.video_url.length > 0 && (
					<video
						src={item.video_url}
						style={{ width: "200px" }}
						controls
					/>
				)}
				{item &&
					item.resoure_locationobj &&
					item.resoure_locationobj.get_poi_name && (
						<div className="txt">
							{item.resoure_locationobj.get_poi_name}
						</div>
					)}
				{item && item.selfzan && <div className="txt">自赞</div>}
				{item && item.selfcomment && (
					<div className="txt">自评：{item.selfcomment}</div>
				)}
			</div>
		);
	}
	// 取消
	cancelClick() {
		let { onCancel } = this.props;
		if (onCancel && typeof onCancel === "function") {
			onCancel();
		}
	}
	render() {
		let { visible, data } = this.props;
		return (
			<Modal
				visible={visible}
				width={700}
				title="任务详情"
				footer={null}
				wrapClassName="datacensus-detail"
				onCancel={this.cancelClick.bind(this)}
			>
				<div className="datacensus-detail-container">
					<div className="info-box">
						<div className="info-item">
							任务类型：
							{data && data.type && itemMap[data.sub_type]}
						</div>
						<div className="info-item">
							执行时间：
							{data &&
								data.task_exce_time &&
								moment(
									data.task_exce_time,
									"YYYYMMDD_HHmm"
								).format("YYYY-MM-DD HH:mm")}
						</div>
						<div className="info-item">
							执行相同任务账号数：{data && data.account_num}
						</div>
					</div>
					<div className="task-content">
						<this.renderSay
							item={
								data &&
								data.content &&
								data.content[data.content.sub_type]
							}
							type={data && data.sub_type}
						/>
					</div>
				</div>
			</Modal>
		);
	}
}
