/**
 *	任务执行情况的item
 */
import * as React from "react";
import "./index.less";
import { Tag } from "antd";
import { itemMap } from "../map";
import * as moment from "moment";

interface Props {
	canDelete?: boolean;
	onDelete?: (item: any) => void;
	data?: any;
	index?: number;
}
interface State {}

export default class TaskItem extends React.PureComponent<Props, State> {
	static readonly defaultProps: Props = {
		canDelete: false
	};
	constructor(props: Props) {
		super(props);
	}
	public renderSay(props: any) {
		let { item, type } = props;
		return (
			<div className="contentbox">
				{item && item.msg && <div className="text">{item.msg}</div>}
				{(type => {
					let res: any;
					switch (type) {
						case "User_touxiang":
							res = (
								<div className="imgbox">
									<img src={item.name} className="img" />
								</div>
							);
							break;
						case "User_pyq_bizhi":
							res = (
								<div className="mark">
									<img src={item.name} />
								</div>
							);
							break;
						case "AddFriend_chat":
							res =
								item.Content && item.Content.length > 0 ? (
									<div>内容：{item.Content}</div>
								) : (
									"随机"
								);
							break;
						case "AddFriend_jiansuo":
							res = (
								<div className="mark">
									<div className="friend-detail">
										{item.mobilelist && "号码："}
										{item.mobilelist &&
											item.mobilelist.map(
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
									{item.desc && item.desc.length > 0 && (
										<div>验证语：{item.desc}</div>
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
									<div>{item.desc}</div>
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
									<div>{item.desc}</div>
									<div className="friend-detail">
										{item.grouplist &&
											item.grouplist.length > 0 &&
											"群："}
										{item.grouplist.length <= 0 && "随机"}
										{item.grouplist &&
											item.grouplist.length > 0 &&
											item.grouplist.map(
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
									</div>
								</div>
							);
							break;
						case "AddFriend_tongguo":
							res = "";
							break;
						case "Pyq_sentshuoshuo":
							res = null;
							break;
						case "SC_add_note":
							res = (
								<React.Fragment>
									<div className="text">
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
								<div className="text">
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
				{/* <div className="videobox">
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
				</div> */}
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
	deleteClick() {
		let { canDelete, onDelete, data } = this.props;
		if (canDelete && onDelete && typeof onDelete === "function") {
			onDelete(data.ArrInter.task_id);
		}
	}
	public render() {
		let { canDelete, index } = this.props;
		let finishTime =
			this.props.data &&
			this.props.data.finish_time &&
			this.props.data.finish_time.length > 0
				? this.props.data.finish_time
				: null;
		let data =
			this.props.data && this.props.data.ArrInter
				? this.props.data.ArrInter
				: null;
		if (data) {
			data.errorMsg = this.props.data.errmsg;
		}
		return (
			<div className="taskitem">
				<div className="sortnum">{index}</div>
				<div className="type">
					{data &&
						data.sub_type &&
						itemMap[data.sub_type.split("_")[0]]}
				</div>
				<div className="task-name">
					{data && data.sub_type && itemMap[data.sub_type]
						? itemMap[data.sub_type]
						: ""}
				</div>
				<div className="task-content">
					<this.renderSay
						item={data && data[data.sub_type]}
						type={data && data.sub_type}
					/>
				</div>
				{data && data.status == 4 && (
					<div style={{ margin: "0 5px", color: "orange" }}>
						{data && data.errorMsg}
					</div>
				)}
				{data && (data.status == 0 || data.status == 2) && (
					<div style={{ margin: "0 5px", color: "red" }}>
						{data &&
							data.errorMsg &&
							data.errorMsg.length > 0 &&
							data.errorMsg}
					</div>
				)}
				<div className="task-time">
					{finishTime
						? moment(finishTime).format("YYYY-MM-DD HH:mm")
						: data &&
						  data.execute_ymd &&
						  moment(
								data.execute_time_display,
								"YYYYMMDDHHmm"
						  ).format("YYYY-MM-DD HH:mm")}
					{/* {data &&
						data.execute_ymd &&
						moment(
							data.execute_time_display,
							"YYYYMMDDHHmm"
						).format("YYYY-MM-DD HH:mm")} */}
					{/* {data &&
					data.execute_hi &&
					data.execute_hi.toString().length == 3
						? moment("0" + data.execute_hi, "HHmm").format("HH:mm")
						: moment(data.execute_hi, "HHmm").format("HH:mm")} */}
				</div>

				{canDelete &&
					window.viliAuth(
						"5cebbbcee935680d0497d247",
						"5cebbfd2e935680428222bb3"
					) && (
						<div
							className="delete"
							onClick={this.deleteClick.bind(this)}
						>
							删除
						</div>
					)}
			</div>
		);
	}
}
