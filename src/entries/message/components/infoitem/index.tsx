import * as React from "react";
import * as classnames from "classnames";
import "./index.less";

interface Props {
	className?: string;
	name: string;
	value?: string;
	children?: any;
	onChange?: Function;
	canEdit?: boolean;
	onBlur?: Function;
}
interface State {
	isEdit: boolean;
	editWord: string;
	oldWord: string;
}

export default class InfoItem extends React.PureComponent<Props, State> {
	private editContext: React.RefObject<HTMLInputElement>;
	constructor(props: Props) {
		super(props);
		this.editContext = React.createRef();
	}
	static readonly defaultProps: Props = {
		name: "",
		value: "",
		canEdit: true
	};
	readonly state: State = {
		isEdit: false,
		editWord: "",
		oldWord: ""
	};
	static getDerivedStateFromProps(nextProps: any, prevState: any): any {
		if (
			nextProps.value != prevState.editWord &&
			prevState.oldWord != nextProps.value
		) {
			return {
				editWord: nextProps.value,
				oldWord: nextProps.value
			};
		}
		return null;
	}
	editEnter() {
		if (!this.props.canEdit) {
			return;
		}

		this.setState(
			{
				isEdit: true
			},
			() => {
				this.editContext.current.focus();
			}
		);
	}
	outEdit() {
		if (this.editContext.current == document.activeElement) {
			return;
		}
		this.setState({
			isEdit: false
		});
		if (this.state.oldWord == this.state.editWord) {
			return;
		}
		let { onBlur } = this.props;
		if (onBlur && typeof onBlur === "function") {
			onBlur(this.state.editWord);
			this.setState({
				oldWord: this.state.editWord
			});
		}
	}
	editChange(e: any) {
		let { onChange } = this.props;

		if (onChange && typeof onChange === "function") {
			onChange(e.target.value);
		}
		this.setState({
			editWord: e.target.value
		});
	}
	render() {
		let { name, value, children } = this.props;
		let { isEdit, editWord } = this.state;

		return (
			<div
				className={classnames("info-item")}
				onClick={this.editEnter.bind(this)}
			>
				<div className="info-name">{name}</div>
				<div className="info-content">
					{children && children}
					{!children && (
						<React.Fragment>
							{isEdit && (
								<input
									contentEditable
									className="content-edit"
									onBlur={this.outEdit.bind(this)}
									value={editWord}
									onChange={this.editChange.bind(this)}
									ref={this.editContext}
								/>
							)}
							{!isEdit && (
								<div className="content-read">{editWord}</div>
							)}
						</React.Fragment>
					)}
				</div>
			</div>
		);
	}
}
