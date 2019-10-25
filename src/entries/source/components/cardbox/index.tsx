import * as React from "react";
import * as classnames from "classnames";
import { Tag, Button, Icon } from "antd";
import { requestUrl } from "../../../../config";
import "./index.less";
const ButtonGroup = Button.Group;
interface Props {
	className?: string;
	style: any;
	data?: any;
	onClick?: Function;
}
interface State {}
declare type clickType = "eye" | "edit" | "delete";
export default class ImgCard extends React.PureComponent<Props, State> {
	private cardBox: React.RefObject<HTMLDivElement>;
	private cardImgBox: React.RefObject<HTMLDivElement>;
	constructor(props: Props) {
		super(props);
		this.cardBox = React.createRef();
		this.cardImgBox = React.createRef();
	}
	static readonly defaultProps: Props = {
		style: null
	};
	readonly state: State = {};
	componentDidUpdate() {
		this.renderImg();
	}
	renderImg() {
		let { data } = this.props;
		if (data && data.content && data.content.trim().length > 0) {
			let img = new Image();
			img.src = data.content;
			img.className = "card-img";
			img.onload = function() {
				if (this.cardImgBox.current) {
					this.cardImgBox.current.innerHTML = "";
					this.cardImgBox.current.appendChild(img);
				}
			}.bind(this);
		}
	}
	btnClick(type: clickType) {
		let { onClick, data } = this.props;
		if (onClick && typeof onClick === "function") {
			onClick({
				type: type,
				data: data
			});
		}
	}
	render() {
		let { className, style, data } = this.props;
		return (
			<div
				className={classnames("img-card-box", className)}
				style={style}
				ref={this.cardBox}
			>
				<div
					className="card-img-box"
					key={data.id}
					ref={this.cardImgBox}
				>
					{/* <img src={data.content} className="card-img" /> */}
				</div>
				<div className="card-content">
					<div className="card-title">{data.title}</div>
					<div className="tags-box">
						{data.tag &&
							data.tag.tag_value &&
							data.tag.tag_value.length > 0 &&
							data.tag.tag_value.map((v: any, idx: number) => {
								return (
									<Tag
										color="#f50"
										style={{ marginBottom: "3px" }}
										key={idx}
									>
										{v}
									</Tag>
								);
							})}
					</div>
				</div>
				<div className="ctrl-box">
					<ButtonGroup>
						<Button onClick={this.btnClick.bind(this, "eye")}>
							<Icon type="eye" />
						</Button>
						{window.viliAuth(
							"5cebbbc4e935680d0497d245",
							"5cebbf83e935680428222ba9"
						) && (
							<Button onClick={this.btnClick.bind(this, "edit")}>
								<Icon type="edit" />
							</Button>
						)}
						{window.viliAuth(
							"5cebbbc4e935680d0497d245",
							"5cebbf8de935680428222bab"
						) && (
							<Button
								onClick={this.btnClick.bind(this, "delete")}
							>
								<Icon type="delete" />
							</Button>
						)}
					</ButtonGroup>
				</div>
			</div>
		);
	}
}
