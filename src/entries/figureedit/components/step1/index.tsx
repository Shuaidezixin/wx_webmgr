import * as React from "react";
import { Checkbox, InputNumber } from "antd";
import "./index.less";

interface Props {
	data?: any;
	onChange?: Function;
	settingTask?: any;
}
interface State {
	listArr: any[];
	typeArr: any[];
}

export default class Step1 extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	static readonly defaultProps: Props = {};
	readonly state: State = {
		listArr: [
			{
				name: "修改昵称",
				setKey: "UpdateNickName",
				key: "userinfo_nickName"
			},
			{
				name: "修改头像",
				setKey: "UpdateTouXiang",
				key: "userinfo_portrait"
			},
			{
				name: "修改个性签名",
				setKey: "UpdateNote",
				key: "userinfo_profile"
			},
			{
				name: "修改朋友圈壁纸",
				setKey: "UpdateBiZhi",
				key: "userinfo_pyq_pic"
			},
			// {
			// 	name: "微信号",
			// 	key: "userinfo_username"
			// },
			{
				name: "修改性别",
				setKey: "UpdateSex",
				key: "userinfo_sex"
			},
			{
				name: "修改我的地址",
				setKey: "UpdateAddress",
				key: "userinfo_area"
			},
			{
				name: "我的收货地址",
				setKey: "",
				key: "userinfo_address"
			},
			{
				name: "添加好友验证",
				setKey: "AddFriendVerification",
				key: "userinfo_addfriend_valid"
			},
			{
				name: "向我推荐通讯录好友",
				setKey: "MailListRecommendFriend",
				key: "userinfo_tuijianhaoyou"
			},
			{
				name: "允许陌生人看十条朋友圈",
				setKey: "TenArticle",
				key: "userinfo_moshengren_10"
			},
			{
				name: "允许好友查看朋友圈范围-最近半年",
				setKey: "HalfYear",
				key: "userinfo_pyq_half_year"
			},
			{
				name: "允许好友查看朋友圈范围-全部",
				setKey: "PyqAll",
				key: "userinfo_pyq_all"
			},
			{
				name: "允许好友查看朋友圈范围-最近三天",
				setKey: "ThreeDay",
				key: "userinfo_pyq_3_day"
			},
			// {
			// 	name: "允许朋友产看朋友圈范围-全部",
			//  setKey:"PyqAll",
			// 	key: "userinfo_pyq_pic",
			//
			// },
			{
				name: "朋友圈更新提醒",
				setKey: "PyqUpdateRemind",
				key: "userinfo_pyq_update"
			}
		],
		typeArr: []
	};
	checkboxChange(item: any, data: any, e: any) {
		this.props.onChange({
			type: item.key,
			value: [e.target.checked ? 1 : 0, data[1], data[2]]
		});
	}
	startInputChange(item: any, data: any, type: string, e: any) {
		let value: number = 0;
		if (e && e != "") {
			value = e;
		}
		this.props.onChange({
			type: item.key,
			value:
				type == "start"
					? [data[0], value, data[2]]
					: [data[0], data[1], value]
		});
	}
	FigureItem(props: any) {
		let { item, data } = props;
		return (
			<div className="figure-item">
				<div className="item1">{item && item.name}</div>
				<div className="item2">
					<Checkbox
						checked={data[0] != "0"}
						onChange={props.checkboxChange.bind(this, item, data)}
					/>
					<span>{data[0] != "0" ? "打开" : "关闭"}</span>
				</div>
				<div className="item3">
					<span>执行时间间隔</span>
					<InputNumber
						type="text"
						className="input"
						value={data[1]}
						onChange={props.startInputChange.bind(
							this,
							item,
							data,
							"start"
						)}
						precision={0}
						min={0}
					/>
					<span>-</span>
					<InputNumber
						type="text"
						className="input"
						value={data[2]}
						onChange={props.startInputChange.bind(
							this,
							item,
							data,
							"end"
						)}
						precision={0}
						min={0}
					/>
					<span>天</span>
				</div>
			</div>
		);
	}
	public render() {
		let { listArr } = this.state;
		let { data, settingTask } = this.props;
		if (settingTask && settingTask.length > 0) {
			return (
				<div>
					{listArr &&
						listArr.length > 0 &&
						listArr.map((item: any, idx: number) => {
							if (settingTask.indexOf(item.setKey) == -1) {
								return null;
							}
							return (
								<this.FigureItem
									item={item}
									data={
										data[item.key]
											? data[item.key].split(";")
											: []
									}
									key={idx}
									checkboxChange={this.checkboxChange.bind(
										this
									)}
									startInputChange={this.startInputChange.bind(
										this
									)}
								/>
							);
						})}
				</div>
			);
		}
		return <div>获取数据中...</div>;
	}
}
