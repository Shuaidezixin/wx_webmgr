import * as React from "react";
import {
	Input,
	Button,
	Radio,
	Checkbox,
	TimePicker,
	Modal,
	message
} from "antd";
import InputBox from "@component/inputbox";
import SimpleTask from "../simple";
import * as moment from "moment";
import "./index.less";
const TextArea = Input.TextArea;
interface Props {
	selectedData?: any;
	createUserTaskAction?: Function;
	workData?: any;
}
interface State {
	search: Gzh;
	guanzhu: Gzh;
}

interface Gzh {
	name: string;
	time: any;
	limit?: number;
}
export default class GzhTask extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	static readonly defaultProps: Props = {};
	readonly state: State = {
		search: {
			name: "",
			time: null
		},
		guanzhu: {
			name: "",
			time: null
		}
	};
	async saveClick(type: string, time?: string) {
		let { selectedData, createUserTaskAction } = this.props;
		let { search, guanzhu } = this.state;
		let params: any = {
			type: "Gzh"
		};
		let userID: any[] = [];
		if (!selectedData || selectedData.length <= 0) {
			message.error("请选择账户");
			return;
		}
		selectedData.map((item: any) => {
			userID.push(item.id);
		});
		params.account_ids = userID;
		if (type == "Gzh_search") {
			params.sub_type = "Gzh_search";
			if (search.name.trim().length <= 0) {
				message.error("公众号名称不能为空");
				return;
			}
			params.execute_hi = search.time ? search.time.format("HHmm") : "0";
			let names = search.name.split("\n");
			let narr = names.filter((item: any) => {
				if (item.trim().length > 0) {
					return item;
				}
			});
			params[type] = {
				Name: narr,
				LimitInt: search.limit
			};
		} else if (type == "Gzh_guanzhu") {
			params.sub_type = "Gzh_guanzhu";
			params.execute_hi = guanzhu.time
				? guanzhu.time.format("HHmm")
				: "0";

			if (guanzhu.name.trim().length <= 0) {
				message.error("公众号名称不能为空");
				return;
			}
			params.Gzh_guanzhu = {
				Name: guanzhu.name.trim()
			};
		} else {
			params.sub_type = type;
			params.execute_hi = time;
			params[type] = {
				Name: ""
			};
		}
		if (
			params.execute_hi != 0 &&
			Number(params.execute_hi) < Number(moment().format("HHmm"))
		) {
			message.error("执行时间不能小于当前时间");
			return;
		}
		if (createUserTaskAction && typeof createUserTaskAction == "function") {
			let res = await createUserTaskAction({
				taskobj: JSON.stringify(params)
			});
			if (res && res.code == 200) {
				Modal.success({ title: "成功", content: "创建成功" });
			}
		}
	}
	nameChange(type: string, e: any) {
		let state: any = this.state;
		let set: any = {
			[type]: {
				...state[type],
				name: e.target.value
			}
		};
		this.setState({
			...set
		});
	}
	limitChange(e: any) {
		let { search } = this.state;
		let names = search.name.split("\n");
		let narr = names.filter((item: any) => {
			if (item.trim().length > 0) {
				return item;
			}
		});

		let set: any = {
			search: {
				...this.state.search,
				limit: e > narr.length ? narr.length : e
			}
		};
		this.setState({
			...set
		});
	}
	timeChange(type: string, e: any) {
		let state: any = this.state;
		let set: any = {
			[type]: {
				...state[type],
				time: e
			}
		};
		this.setState({
			...set
		});
	}
	render() {
		let { search, guanzhu } = this.state;
		let { workData } = this.props;
		return (
			<div className="gzhcreate-task">
				{workData && workData.SearchGZH && (
					<div className="group">
						<div className="group-title">
							<div className="text">搜索公众号</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(
									this,
									"Gzh_search"
								)}
							>
								立即执行
							</Button>
						</div>
						<div className="group-content">
							<InputBox labelName="执行时间" flexTop={true}>
								<div className="w100">
									<TimePicker
										className="w100"
										format="HH:mm"
										value={search && search.time}
										onChange={this.timeChange.bind(
											this,
											"search"
										)}
									/>
									<div className="inner-item">
										<TextArea
											className="w100"
											style={{ height: "300px" }}
											placeholder="多个请换行分割"
											value={search && search.name}
											onChange={this.nameChange.bind(
												this,
												"search"
											)}
										/>
									</div>
								</div>
							</InputBox>
							<InputBox
								labelName="单个账户最多检索次数"
								value={search && search.limit}
								onChange={this.limitChange.bind(this)}
								type="number"
							/>
						</div>
					</div>
				)}
				{workData && workData.ForceGZH && (
					<div className="group">
						<div className="group-title">
							<div className="text">关注公众号</div>
							<Button
								className="btn"
								size="small"
								type="primary"
								onClick={this.saveClick.bind(
									this,
									"Gzh_guanzhu"
								)}
							>
								立即执行
							</Button>
						</div>
						<div className="group-content">
							<InputBox labelName="执行时间" flexTop={true}>
								<div className="w100">
									<TimePicker
										className="w100"
										format="HH:mm"
										value={guanzhu && guanzhu.time}
										onChange={this.timeChange.bind(
											this,
											"guanzhu"
										)}
									/>
									<div className="inner-item">
										<Input
											placeholder="公众号名称"
											value={guanzhu && guanzhu.name}
											onChange={this.nameChange.bind(
												this,
												"guanzhu"
											)}
										/>
									</div>
								</div>
							</InputBox>
						</div>
					</div>
				)}
				{workData && workData.CancelGZH && (
					<SimpleTask
						labelName="取消关注公众号（随机）"
						type="Gzh_guanzhu_cancel"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.BrowseGZH && (
					<SimpleTask
						labelName="预览公众号（随机）"
						type="Gzh_dakaiyulan"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ReadGZHArticle && (
					<SimpleTask
						labelName="阅读公众号文章（随机）"
						type="Gzh_yuedu"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ScGZHArticle && (
					<SimpleTask
						labelName="收藏公众号文章（随机）"
						type="Gzh_soucang"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ForwardGZHPyq && (
					<SimpleTask
						labelName="转发公众号文章到朋友圈（随机）"
						type="Gzh_zhuanfa_pyq"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ForwardGZHChat && (
					<SimpleTask
						labelName="转发公众号文章到聊天（随机）"
						type="Gzh_zhuanfa_chat"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.OPenGZHTop && (
					<SimpleTask
						labelName="置顶公众号（随机）"
						type="Gzh_top"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{workData && workData.ClearGZH && (
					<SimpleTask
						labelName="清空内容（随机）"
						type="Gzh_clear_content"
						onOk={this.saveClick.bind(this)}
					/>
				)}
				{(!workData ||
					(!workData.SearchGZH &&
						!workData.ForceGZH &&
						!workData.CancelGZH &&
						!workData.BrowseGZH &&
						!workData.ReadGZHArticle &&
						!workData.ScGZHArticle &&
						!workData.ForwardGZHPyq &&
						!workData.ForwardGZHChat &&
						!workData.OPenGZHTop &&
						!workData.ClearGZH)) && (
					<div className="nodatabox">系统设置不允许手动任务</div>
				)}

				{/* <SimpleTask
					labelName="删除内容（随机）"
					type="Gzh_delete_chat"
					onOk={this.saveClick.bind(this)}
				/> */}
			</div>
		);
	}
}
