/**
 *  标签Tag组件
 * 		data:标签列表数据
 *		getData:传入的触发得到data的action
 * 		selectedData:已选择的tags
 * 		addTag:添加标签的action
 * 		deleteTag:删除标签的action
 * 		onSave:保存action
 *		clear:清空的action
 */
import * as React from "react";
import { Popover, Button, Tag, Input, Icon, Empty, Modal } from "antd";
import * as classnames from "classnames";
import "./index.less";

interface Props {
	data?: any;
	getData?: Function;
	selectedData?: any;
	addTag?: Function;
	deleteTag?: Function;
	onSave?: Function;
	clear?: Function;
}
interface State {
	page: number;
	pagesize: number;
	isLoading: boolean;
	chooseList: any[];
	oldChoose: any;
	name: string;
	visible: boolean;
}

export default class Tags extends React.PureComponent<Props, State> {
	private TagListBox: React.RefObject<HTMLDivElement>;
	static readonly defaultProps: Props = {
		selectedData: []
	};
	readonly state: State = {
		page: 1,
		pagesize: 50,
		isLoading: false,
		chooseList: [],
		oldChoose: null,
		name: "",
		visible: false
	};
	constructor(props: Props) {
		super(props);
		this.TagListBox = React.createRef();
	}
	componentDidMount() {
		this.getListData();
	}
	componentWillUnmount() {
		let { clear } = this.props;
		if (clear && typeof clear == "function") {
			this.props.clear();
		}
	}
	async getListData() {
		let { page, pagesize, isLoading } = this.state;
		if (isLoading) {
			return;
		}
		let params: any = {
			page,
			pagesize,
			type: "scroll"
		};
		this.setState({
			isLoading: true
		});
		try {
			let res = await this.props.getData(params);
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	static getDerivedStateFromProps(nextProps: any, prevState: any): any {
		if (
			JSON.stringify(nextProps.selectedData) !=
			JSON.stringify(prevState.oldChoose)
		) {
			return {
				oldChoose: nextProps.selectedData,
				chooseList: [...nextProps.selectedData]
			};
		}
		return null;
	}
	getMore(e: any) {
		let { page, pagesize } = this.state;
		let { data } = this.props;
		if (data && page * pagesize >= data.total) {
			return;
		}
		let box = this.TagListBox.current;
		let boxH = box.clientHeight;
		let scrollT = box.scrollTop;
		let scrollH = box.scrollHeight;
		if (boxH + scrollT == scrollH) {
			this.setState(
				{
					page: this.state.page + 1
				},
				this.getListData
			);
		}
	}
	getSelectedClass(item: any): boolean {
		let { chooseList } = this.state;
		let res = false;
		if (chooseList && chooseList.length > 0) {
			chooseList.map((v: any) => {
				if (v.tag_id == item.tag_id) {
					res = true;
				}
			});
		}
		return res;
	}
	toggleSelect(item: any) {
		let { chooseList } = this.state;
		let isHas: boolean = false;
		let newList: any = [];
		if (chooseList && chooseList.length > 0) {
			newList = chooseList.filter((v: any) => {
				if (v.tag_id != item.tag_id) {
					return item;
				}
				if (v.tag_id == item.tag_id) {
					isHas = true;
				}
			});
		}
		if (!isHas) {
			newList.push(item);
		}
		this.setState({
			chooseList: [...newList]
		});
	}
	async addClick() {
		let { addTag } = this.props;
		let { name } = this.state;
		if (!name || name.trim().length <= 0) {
			return;
		}
		if (addTag && typeof addTag === "function") {
			let res = await addTag({
				tag_name: name.trim()
			});
			if (res && res.code == 200) {
				this.setState({ name: "" });
			}
		}
	}
	nameChange(e: any) {
		this.setState({
			name: e.target.value
		});
	}
	DeleteClick(item: any) {
		let { deleteTag, onSave } = this.props;
		let { chooseList, oldChoose } = this.state;
		if (!deleteTag || typeof deleteTag !== "function") {
			return;
		}
		Modal.confirm({
			title: "警告",
			content: "您确定删除这个标签?",
			zIndex: 1200,
			onOk: async () => {
				let res = await deleteTag({
					tag_id: item.tag_id
				});

				if (res && res.tag_id) {
					if (oldChoose && oldChoose.length > 0) {
						let isInOld = false;
						let newO = oldChoose.filter((v: any) => {
							if (v.tag_id == item.tag_id) {
								isInOld = true;
							}
							if (v.tag_id != item.tag_id) {
								return v;
							}
						});
						if (isInOld && onSave && typeof onSave == "function") {
							onSave(newO);
						}
					}
					if (chooseList && chooseList.length > 0) {
						let nl = chooseList.filter((v: any) => {
							if (v.tag_id != item.tag_id) {
								return v;
							}
						});
						this.setState({
							chooseList: [...nl]
						});
					}
				}
			}
		});
	}
	togglePopoverClick() {
		this.setState(
			{
				visible: !this.state.visible
			},
			() => {
				setTimeout(() => {
					if (this.TagListBox.current) {
						if (this.state.visible) {
							this.TagListBox.current.addEventListener(
								"scroll",
								this.getMore.bind(this),
								false
							);
						} else {
							this.TagListBox.current.removeEventListener(
								"scroll",
								this.getMore.bind(this),
								false
							);
						}
					}
				}, 10);
			}
		);
	}
	closePopoverClick() {
		this.setState({
			visible: false
		});
		if (this.TagListBox.current) {
			this.TagListBox.current.removeEventListener(
				"scroll",
				this.getMore.bind(this),
				false
			);
		}
	}
	saveClick() {
		let { chooseList } = this.state;
		let { onSave } = this.props;
		if (onSave && typeof onSave === "function") {
			onSave(chooseList);
			if (this.TagListBox.current) {
				this.TagListBox.current.removeEventListener(
					"scroll",
					this.getMore.bind(this),
					false
				);
			}
			this.setState({
				visible: false
			});
		}
	}
	contentReander() {
		let { data } = this.props;
		let { isLoading, name } = this.state;
		return (
			<div className="tags-ctrl-box">
				<div className="tags-ctrl-header">
					<Input
						value={name}
						onChange={window.Util.InputChange.bind(this, "name")}
						placeholder="请输入标签"
					/>
					<Button
						className="tags-ctrl-btn"
						type="primary"
						onClick={this.addClick.bind(this)}
					>
						添加
					</Button>
					<Button
						className="tags-ctrl-btn"
						type="primary"
						onClick={this.saveClick.bind(this)}
					>
						保存
					</Button>
					<Button
						className="tags-ctrl-btn"
						type="danger"
						onClick={this.closePopoverClick.bind(this)}
					>
						关闭
					</Button>
				</div>
				<div className="tags-list-box" ref={this.TagListBox}>
					{data &&
						data.tags &&
						data.tags.length > 0 &&
						data.tags.map((item: any, idx: number) => {
							return (
								<div className={classnames("tagbtn")} key={idx}>
									<Tag
										className="tag-dom"
										color={
											this.getSelectedClass(item)
												? "magenta"
												: ""
										}
										onClick={this.toggleSelect.bind(
											this,
											item
										)}
									>
										<span>{item && item.tag_name}</span>
									</Tag>
									{item &&
										(item.res_count == 0 ||
											!item.res_count) && (
											<Icon
												onClick={this.DeleteClick.bind(
													this,
													item
												)}
												type="close"
												className="closebtn"
											/>
										)}
								</div>
							);
						})}
					{(!data || !data.tags || data.tags.length <= 0) && (
						<div style={{ padding: "10px" }}>
							<Empty />
						</div>
					)}
					{isLoading && (
						<div style={{ textAlign: "center", padding: "20px 0" }}>
							<Icon type="loading" spin />
							<span>加载中</span>
						</div>
					)}
				</div>
			</div>
		);
	}
	render() {
		let { visible } = this.state;
		return (
			<Popover
				className="tags-box"
				content={this.contentReander.bind(this)()}
				placement="bottomLeft"
				visible={visible}
				getPopupContainer={() => {
					return document.getElementById("root");
				}}
			>
				<Button
					size="small"
					className="tags-btn"
					onClick={this.togglePopoverClick.bind(this)}
				>
					+
				</Button>
			</Popover>
		);
	}
}
