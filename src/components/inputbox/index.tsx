/**
 * 	公共组件：
 *    二次封装的输入框
 */
import * as React from "react";
import {
	Input,
	Select,
	DatePicker,
	Spin,
	Upload,
	Icon,
	notification,
	InputNumber,
	message,
	Modal
} from "antd";
import * as classnames from "classnames";

const Option = Select.Option;

const { TextArea } = Input;
import "./index.less";

interface Props {
	isRequired?: boolean;
	labelName?: string;
	type?: string;
	desc?: any;
	className?: string;
	length?: number;
	mode?: string;
	disabled?: boolean;
	onChange?: Function;
	onSearch?: Function;
	value?: any;
	optionArr?: OptionArr1 | OptionArr2 | any;
	showTime?: boolean;
	flexTop?: boolean;
	format?: string;
	filterOption?: boolean;
	isFetch?: boolean;
	children?: any;
	showSearch?: boolean;
	listType?: UploadListType;
	limitSize?: number;
	limitType?: string[];
	folder?: string;
	domain?: string;
	limitInfo?: LimitInfo;
	multiple?: boolean;
	placeholder?: string;
	endString?: string;
	aliyunData?: any;
	deleteUplodaValue?: Function;
	onClick?: Function;
	labelInValue?: boolean;
	min?: number;
	max?: number;
	precision?: number;
	formatter?: any;
	autoWidth?: boolean;
	parser?: any;
	customRequest?: boolean;
	style?: any;
	limitDuration?: number;
	playVideo?: boolean;
}
export interface uploaderData {}
export declare type UploadListType = "text" | "picture" | "picture-card";
export declare type InfoType = "equa" | "greater" | "less";
interface LimitInfo {
	width: number;
	height: number;
	type: InfoType;
}
interface OptionArr1 {
	value: number;
	label: string;
}
interface OptionArr2 {
	key: number;
	label: string;
}
interface State {
	fileList: null | any;
	uploadData?: any;
	isSearched: boolean;
	previewVideo: string;
	isShowVideo: boolean;
}
export default class InputBox extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	static readonly defaultProps: Props = {
		isRequired: false,
		labelName: "",
		type: "text",
		showTime: false,
		flexTop: false,
		disabled: false,
		format: "YYYY-MM-DD",
		filterOption: false,
		isFetch: false,
		className: "",
		showSearch: false,
		listType: "picture-card",
		length: 1000000,
		limitSize: 1024 * 1024 * 2,
		limitType: [],
		folder: "default/",
		domain: "http://sdkads.oss-cn-hangzhou.aliyuncs.com",
		multiple: false,
		labelInValue: false,
		autoWidth: false,
		parser: null,
		customRequest: false,
		playVideo: false
	};
	readonly state: State = {
		fileList: [],
		isSearched: false,
		previewVideo: "",
		isShowVideo: false,
		uploadData: {
			key: "",
			OSSAccessKeyId: "",
			policy: "",
			success_action_status: "200",
			Signature: ""
		}
	};

	componentDidUpdate(prevProps: any) {
		if (
			JSON.stringify(prevProps.aliyunData) !=
			JSON.stringify(this.props.aliyunData)
		) {
			this.setState({
				uploadData: {
					key: "",
					OSSAccessKeyId: this.props.aliyunData.AccessKeyId,
					success_action_status: "200",
					policy: this.props.aliyunData.policyBase64,
					Signature: this.props.aliyunData.sign
				}
			});
		}
	}
	componentWillUnmount() {
		this.setState({
			fileList: []
		});
	}
	public formatValue(value: any) {
		if (!value || value.length <= 0) {
			return [];
		}
		if (this.props.mode && value && value instanceof Array) {
			let a = value.map((item: any) => {
				if (typeof item == "string") {
					return Number(item);
				} else {
					return item;
				}
			});
			return a;
		}
		return value;
	}
	public inputChange(e: any) {
		let { type, onChange } = this.props;
		if (onChange && typeof onChange === "function") {
			let value = "";
			switch (type) {
				case "select":
					value = e;
					break;
				case "datepicker":
					value = e;
					break;
				case "uploader":
					value = e.map((item: any) => {
						let set: any = {
							url: item.serverUrl,
							size: item.size,
							name: item.name
						};
						if (item.width) {
							set.width = item.width;
						}
						if (item.height) {
							set.height = item.height;
						}
						return set;
					});
					break;
				case "number":
					value = e;
					break;
				case "uploader-img":
					value = e.map((item: any) => {
						let set: any = {
							url: item.serverUrl,
							size: item.size,
							name: item.name,
							width: item.width,
							height: item.height
						};
						return set;
					});
					break;
				default:
					value = e.target.value;
			}
			onChange(value);
		}
	}
	public selectSearch(value: any) {
		if (this.props.onSearch && typeof this.props.onSearch === "function") {
			this.props.onSearch(value);
		}
	}
	//获取图片信息
	public readImgInfo(file: any) {
		if (!file) {
			return;
		}
		let reg = /^https?:\/\//;
		if (reg.test(file)) {
			return new Promise((resolve, reject) => {
				var img = new Image();
				img.src = file;
				img.onload = () => {
					resolve({
						width: img.width,
						height: img.height
					});
				};
			});
		} else {
			return new Promise((resolve, reject) => {
				try {
					let fileReader = new FileReader();
					fileReader.onload = (e: any) => {
						var data = e.target.result;
						var img = new Image();
						img.onload = () => {
							resolve({
								width: img.width,
								height: img.height
							});
						};
						img.src = data;
					};
					fileReader.readAsDataURL(file);
				} catch (e) {
					reject(e);
				}
			});
		}
	}
	readVideoInfo(file: any): any {
		if (!file) {
			return;
		}
		let reg = /^https?:\/\//;
		return new Promise((resolve, reject) => {
			try {
				let url: any;
				if (reg.test(file)) {
					url = file;
				} else {
					url = URL.createObjectURL(file);
				}
				const video = document.createElement("video");
				video.onloadedmetadata = e => {
					URL.revokeObjectURL(url);
					resolve({
						width: video.videoWidth,
						height: video.videoHeight,
						duration: video.duration,
						canPlayType: video.canPlayType
					});
				};
				video.src = url;
				video.load();
			} catch (e) {
				reject(e);
			}
		});
	}
	customRequest(e: any) {
		let token = window.localStorage.getItem("token");
		let formData = new FormData();
		if (!token) {
			message.error("登录失效，请重新登录");
			let href = window.location.href;
			let pathname = href.split("?")[0];
			let search = href.split("?")[1]
				? href.split("?")[1].replace(/^\?/, "")
				: "";
			window.appHistory.push({
				pathname: "/login",
				search: `from=${window.Util.encryptPass(
					JSON.stringify({
						pathname: pathname,
						search: search
					})
				)}`
			});
			return;
		}

		formData.append("file", e.file);
		formData.append("token", token);
		let xhr: any = new XMLHttpRequest();

		xhr.open("POST", e.action, true);
		if (xhr.upload) {
			xhr.upload.onprogress = function(event: any) {
				let fileList = this.state.fileList;
				fileList.map((v: any) => {
					if (v.uid == e.file.uid) {
						v.uploadPrcent = (
							(event.loaded / event.total) *
							100
						).toFixed(2);
					}
				});

				this.setState({
					fileList: [...fileList]
				});
			}.bind(this);
		}
		xhr.onerror = function() {
			let fileList = this.state.fileList;
			let list = fileList.filter((v: any) => {
				if (v.uid != e.file.uid) {
					return v;
				}
			});

			this.setState({ fileList: [...list] });
		};
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var res = JSON.parse(xhr.responseText);
				if (res && res.code == 200) {
					if (e.action.indexOf("uploadapk") != -1) {
						let data: any = res.data;
						this.inputChange([
							{
								serverUrl: data.applicationsrc,
								name: data.applicationname,
								icon: data.applicationicon,
								version: data.applicationversion
							}
						]);
					} else {
						this.inputChange([
							{ serverUrl: res.data, name: e.file.name }
						]);
					}
				} else {
					message.error(res.msg);
				}
				let fileList = this.state.fileList;
				let list = fileList.filter((v: any) => {
					if (v.uid != e.file.uid) {
						return v;
					}
				});
				this.setState({ fileList: [...list] });
			}
		}.bind(this);
		xhr.send(formData);
	}
	public isImage(suf: string): boolean {
		let ia = ["jpg", "jpeg", "png", "gif", "bmp"];
		return ia.indexOf(suf) == -1 ? false : true;
	}
	public beforeUploader(file: any) {
		let { folder, domain, limitInfo } = this.props;
		if (!file) {
			return;
		}
		return new Promise(async (resolve, reject) => {
			let { limitSize, limitType, limitDuration } = this.props;
			let suffix = file.name.substr(
				file.name.lastIndexOf(".") + 1,
				file.name.length
			);
			if (limitSize < file.size) {
				notification.error({
					message: "上传",
					duration: 3,
					description: `上传文件大小超过限制，大小不能超过${limitSize /
						1024 /
						1024}M,此文件大小为${file.size / 1024 / 1024}M`
				});
				reject({ error: "文件大小错误" });
				return false;
			}
			if (limitDuration && suffix == "mp4") {
				let info = await this.readVideoInfo(file);
				if (info.duration * 1000 > limitDuration) {
					notification.error({
						message: "上传",
						duration: 3,
						description: `视频时长限制不能超过${limitDuration /
							1000}秒,当前时长为${info.duration}秒`
					});
					reject({ error: "视频时长不合法" });
					return false;
				}
			}
			if (limitType.length > 0) {
				if (limitType.indexOf(suffix) == -1) {
					notification.error({
						message: "上传",
						duration: 3,
						description: `文件格式错误，格式限定为${limitType.join(
							","
						)}`
					});
					reject({ error: "文件格式错误" });
					return false;
				}
			}

			if (
				limitInfo &&
				limitInfo.width &&
				limitInfo.height &&
				limitInfo.type &&
				this.isImage(suffix)
			) {
				let info: any = await this.readImgInfo(file);
				file.width = info.width;
				file.height = info.height;
				if (limitInfo.type === "equa") {
					if (
						limitInfo.width != info.width ||
						limitInfo.height != info.height
					) {
						notification.error({
							message: "上传",
							duration: 3,
							description: `文件尺寸错误，尺寸限定为${limitInfo.width}*${limitInfo.height}`
						});
						reject({ error: "文件尺寸错误" });
						return false;
					}
				}
				if (limitInfo.type === "less") {
					if (
						limitInfo.width > info.width ||
						limitInfo.height > info.height
					) {
						notification.error({
							message: "上传",
							duration: 3,
							description: `文件尺寸错误，尺寸小于${limitInfo.width}*${limitInfo.height}`
						});
						reject({ error: "文件尺寸错误" });
						return false;
					}
				}
				if (limitInfo.type === "greater") {
					if (
						limitInfo.width < info.width ||
						limitInfo.height < info.height
					) {
						notification.error({
							message: "上传",
							duration: 3,
							description: `文件尺寸错误，尺寸大于${limitInfo.width}*${limitInfo.height}`
						});
						reject({ error: "文件尺寸错误" });
						return false;
					}
				}
			}
			folder = /\/$/.test(folder) ? folder : folder + "/";
			let key = `${folder}${new Date().getTime()}_${parseInt(
				Math.random() * 1000000000 + ""
			)}.${suffix}`;
			file.serverUrl = domain + "/" + key;
			//验证图片尺寸
			if (key) {
				file.uploadData = {
					...this.state.uploadData,
					key
				};
				resolve(file);
				return true;
			} else {
				reject();
				return false;
			}
		});
	}

	public handlerUploaderChange({ file, fileList, event }: any) {
		let list: any[] = [];
		let isUploaded = true;

		fileList.map((item: any) => {
			if (item.status != "error") {
				if (item.status == "uploading" && event) {
					item.uploadPrcent = Number(
						(event.loaded / event.total) * 100
					).toFixed(2);
				}
				if (item.status == "uploading") {
					isUploaded = false;
				}

				list.push(item);
			} else {
				notification.warning({
					message: "上传",
					key: "uploader",
					duration: 3,
					description: `${
						item.name
					}上传失败,请重新上传,上传错误原因：${JSON.stringify(
						item.error
					)}`
				});
			}
		});
		if (isUploaded) {
			this.setState({
				fileList: []
			});
			this.inputChange(list);
		} else {
			this.setState({
				fileList: [...list]
			});
		}
	}
	public uploadBtn() {
		return (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">上传</div>
			</div>
		);
	}
	public deleteClick(idx: number, e: any) {
		e.nativeEvent.stopImmediatePropagation();
		e.stopPropagation();
		if (
			this.props.deleteUplodaValue &&
			typeof this.props.deleteUplodaValue === "function"
		) {
			this.props.deleteUplodaValue(idx);
		}
	}
	imgClick(idx: number, e: any) {
		if (this.props.onClick && typeof this.props.onClick === "function") {
			this.props.onClick(idx);
		}
	}
	formatUpdateData(file: any) {
		if (!file) {
			return;
		}
		if (file.uploadData) {
			return { ...file.uploadData };
		}
	}
	openPreviewVideo(url: string) {
		console.log(url);
		if (!url || url.trim().length <= 0) {
			return;
		}
		let { playVideo } = this.props;
		if (playVideo) {
			this.setState({
				isShowVideo: true,
				previewVideo: url
			});
		}
	}
	closePreviewVideo() {
		this.setState({
			isShowVideo: false,
			previewVideo: ""
		});
	}
	public render() {
		let {
			isRequired,
			labelName,
			type,
			value,
			className,
			optionArr,
			length,
			mode,
			showTime,
			flexTop,
			disabled,
			format,
			filterOption,
			isFetch,
			desc,
			children,
			showSearch,
			listType,
			limitType,
			domain,
			multiple,
			placeholder,
			endString,
			labelInValue,
			min,
			max,
			precision,
			formatter,
			autoWidth,
			parser,
			customRequest,
			style
		} = this.props;
		let { fileList, uploadData, isShowVideo, previewVideo } = this.state;
		let accpect = limitType.join(",");
		let upimgProps: any = null;

		return (
			<div
				className={classnames("inputbox-container", className)}
				style={style}
			>
				<div
					className={classnames(
						"input-item",
						flexTop || (desc && desc.length > 0) ? "at" : ""
					)}
					style={{
						paddingBottom: desc && desc.length > 0 ? "0" : "15px",
						width: autoWidth ? "auto" : "500px"
					}}
				>
					<div className="label-name">
						<span className="text">
							{labelName}
							<span />
						</span>
						<i className="must">{isRequired && "*"}</i>
						{labelName && labelName.trim().length > 0 && (
							<span>:</span>
						)}
					</div>
					<div className="label-input">
						{children}
						{!children && (
							<div className="label-cust">
								{(type === "text" ||
									type === "tel" ||
									type === "password") && (
									<Input
										disabled={disabled}
										type={type}
										value={value}
										maxLength={length}
										placeholder={placeholder}
										onChange={this.inputChange.bind(this)}
									/>
								)}
								{type === "number" && (
									<InputNumber
										precision={precision}
										min={min}
										max={max}
										disabled={disabled}
										type={type}
										value={value}
										parser={
											parser ? parser : value => value
										}
										formatter={formatter}
										maxLength={length}
										placeholder={placeholder}
										onChange={this.inputChange.bind(this)}
									/>
								)}

								{type === "select" && (!mode && !showSearch) && (
									<Select
										disabled={disabled}
										value={
											typeof value === "string"
												? Number(value)
												: value
										}
										onChange={this.inputChange.bind(this)}
										style={{ width: "100%" }}
										showSearch={showSearch}
										labelInValue={labelInValue}
									>
										{optionArr &&
											optionArr instanceof Array &&
											optionArr.length > 0 &&
											optionArr.map(
												(item: any, index: any) => {
													return (
														<Option
															key={index}
															value={Number(
																item.key
															)}
														>
															{item.label}
														</Option>
													);
												}
											)}
									</Select>
								)}

								{type === "select" && (mode || showSearch) && (
									<Select
										disabled={disabled}
										value={this.formatValue(value)}
										onChange={this.inputChange.bind(this)}
										filterOption={filterOption}
										style={{ width: "100%" }}
										mode={mode}
										labelInValue={labelInValue}
										showSearch={showSearch}
										notFoundContent={
											isFetch ? (
												<div
													style={{
														textAlign: "center"
													}}
												>
													<Spin size="small" />
													<span
														style={{
															fontSize: "12px",
															marginLeft: "10px"
														}}
													>
														正在搜索数据...
													</span>
												</div>
											) : (
												<div
													style={{
														textAlign: "center",
														fontSize: 12
													}}
												>
													暂无数据
												</div>
											)
										}
										onSearch={this.selectSearch.bind(this)}
									>
										{optionArr &&
											optionArr instanceof Array &&
											optionArr.length > 0 &&
											optionArr.map(
												(item: any, index: any) => {
													return (
														<Option
															key={index}
															value={item.key}
														>
															{item.label}
														</Option>
													);
												}
											)}
									</Select>
								)}
								{type === "datepicker" && (
									<DatePicker
										format={format}
										disabled={disabled}
										style={{ width: "100%" }}
										value={value}
										showTime={showTime}
										onChange={this.inputChange.bind(this)}
									/>
								)}
								{type === "textarea" && (
									<TextArea
										style={{ width: "100%" }}
										value={value}
										autosize={{ minRows: 4 }}
										onChange={this.inputChange.bind(this)}
										placeholder={placeholder}
									/>
								)}
								{type === "uploader-img" && (
									<div>
										{value &&
											value.length > 0 &&
											value.map((item: any, idx: any) => {
												let isMp4 =
													item.url.substring(
														item.url.lastIndexOf(
															"."
														) + 1,
														item.url.length
													) == "mp4";
												return (
													<div
														key={idx}
														className="uploadImg"
														onClick={this.imgClick.bind(
															this,
															idx
														)}
													>
														<div className="img-box">
															{isMp4 && (
																<video
																	src={
																		item.url
																	}
																/>
															)}
															{!isMp4 && (
																<img
																	src={
																		item.url
																	}
																/>
															)}
															{isMp4 && (
																<div className="video-play">
																	<Icon
																		className="play-icon"
																		type="play-circle"
																		onClick={this.openPreviewVideo.bind(
																			this,
																			item.url
																		)}
																	/>
																	<Icon
																		className="video-delete"
																		type="delete"
																		onClick={this.deleteClick.bind(
																			this,
																			idx
																		)}
																	/>
																</div>
															)}
															{!isMp4 && (
																<div className="img-cover">
																	<Icon
																		className="delete"
																		type="delete"
																		onClick={this.deleteClick.bind(
																			this,
																			idx
																		)}
																	/>
																</div>
															)}
														</div>
													</div>
												);
											})}
										{fileList.length > 0 &&
											fileList.map(
												(item: any, index: any) => {
													if (
														item.status ==
														"uploading"
													) {
														return (
															<div
																key={index}
																className="uploadImg"
															>
																<div className="uploading">
																	<Icon
																		type="loading"
																		className="icon"
																	/>
																	<div>
																		上传中...
																		{
																			item.uploadPrcent
																		}
																		%
																	</div>
																</div>
															</div>
														);
													} else {
														return null;
													}
												}
											)}
										<div
											style={{ display: "inline-block" }}
										>
											<Upload
												accept={accpect}
												data={this.formatUpdateData.bind(
													this
												)}
												action={domain}
												listType={listType}
												onChange={this.handlerUploaderChange.bind(
													this
												)}
												customRequest={
													customRequest
														? this.customRequest.bind(
																this
														  )
														: null
												}
												multiple={multiple}
												showUploadList={false}
												fileList={fileList}
												beforeUpload={this.beforeUploader.bind(
													this
												)}
											>
												{fileList.length +
													(value
														? value.length
														: 0) >=
												Number(length)
													? null
													: this.uploadBtn()}
											</Upload>
										</div>
									</div>
								)}
								{type === "uploader" && (
									<div>
										{value &&
											value.length > 0 &&
											value.map((item: any, idx: any) => {
												return (
													<div
														className="upload-item"
														key={idx}
													>
														<div className="upload-info">
															<div className="filename">
																{item.name}
															</div>
															<Icon
																type="close"
																className="icon"
																onClick={this.deleteClick.bind(
																	this,
																	idx
																)}
															/>
														</div>
													</div>
												);
											})}
										{fileList &&
											fileList.length > 0 &&
											fileList.map(
												(item: any, idx: any) => {
													if (
														item.status ===
														"uploading"
													) {
														return (
															<div
																key={idx}
																className="upload-item"
															>
																<div className="upload-info">
																	<div className="filename">
																		{
																			item.name
																		}
																	</div>
																	{item.status ==
																		"uploading" && (
																		<span>
																			{item.uploadPrcent +
																				"%"}
																		</span>
																	)}
																</div>
																<div
																	className="uploadbg"
																	style={{
																		width:
																			item.uploadPrcent +
																			"%"
																	}}
																/>
															</div>
														);
													} else {
														return null;
													}
												}
											)}

										<Upload
											accept={accpect}
											data={this.formatUpdateData.bind(
												this
											)}
											action={domain}
											multiple={multiple}
											beforeUpload={this.beforeUploader.bind(
												this
											)}
											customRequest={
												customRequest
													? this.customRequest.bind(
															this
													  )
													: null
											}
											fileList={fileList}
											showUploadList={false}
											onChange={this.handlerUploaderChange.bind(
												this
											)}
										>
											{fileList.length +
												(value ? value.length : 0) >=
											Number(length) ? null : (
												<div className="uploadFile">
													选择文件
												</div>
											)}
										</Upload>
									</div>
								)}
							</div>
						)}
						{endString && endString.length > 0 && (
							<div className="end-string">{endString}</div>
						)}
						{this.props.desc && (
							<div
								style={{
									color: "#a4a4a4",
									textAlign: "left",
									paddingLeft: "5px",
									position: "relative",
									width: "100%"
								}}
							>
								{this.props.desc}
							</div>
						)}
					</div>
				</div>
				<Modal
					title={null}
					visible={isShowVideo}
					footer={null}
					width={800}
					centered={true}
					wrapClassName="preview-video-box"
					onCancel={this.closePreviewVideo.bind(this)}
				>
					<video
						src={previewVideo}
						controls
						autoPlay={isShowVideo}
						style={{ width: "100%", height: "600px" }}
					/>
				</Modal>
			</div>
		);
	}
}
