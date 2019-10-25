import * as React from "react";
import Toast from "@component/toast";
import "./index.less";
interface Props {
	downloadInfo?: any;
	getDownloadInfoAction?: Function;
	getDownloadAction?: Function;
	getScreenUrlAction?: Function;
}
interface State {}
export default class Root extends React.PureComponent<Props, State> {
	constructor(props: any) {
		super(props);
	}
	componentDidMount() {
		document.title = window.pageTitle.replace("{title}", "软件下载");
		this.props.getDownloadInfoAction();
	}
	// 点击apk下载
	appClick(data: any, idx: number) {
		this.props
			.getDownloadAction({
				amwebsiteversionid: this.props.downloadInfo._id,
				index: idx
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					window.open(res.data);
				}
			});
	}
	// 下载站点程序
	async downloadScreenClick() {
		let loading = Toast.loading("正在生成下载文件...", 0);
		try {
			let res = await this.props.getScreenUrlAction();
			if (
				res &&
				res.code == 200 &&
				res.data &&
				res.data.length > 0 &&
				/^https?:\/\/.*?/.test(res.data)
			) {
				window.open(res.data);
			}
		} finally {
			loading.close();
		}
	}
	render() {
		let { downloadInfo } = this.props;
		return (
			<div className="download-page">
				<div className="download-container">
					<div className="title">操作说明</div>
					{downloadInfo &&
						downloadInfo.documentobjs &&
						downloadInfo.documentobjs.length > 0 &&
						downloadInfo.documentobjs.map((v: any, i: number) => {
							return (
								<a
									href={v.documentssrc}
									key={i}
									className="intro"
								>
									{v.filename}
								</a>
							);
						})}
					{downloadInfo &&
						downloadInfo.nodezip &&
						downloadInfo.nodezip.length > 0 && (
							<React.Fragment>
								<div className="title">站点程序</div>
								<a
									href={downloadInfo && downloadInfo.nodezip}
									download="站点程序"
									className="intro"
								>
									下载
								</a>
							</React.Fragment>
						)}
					<div className="title">必备软件</div>
					{downloadInfo &&
						downloadInfo.applications &&
						downloadInfo.applications.length > 0 &&
						downloadInfo.applications.map((v: any, i: number) => {
							return (
								<div
									className="app-item"
									key={i}
									onClick={this.appClick.bind(this, v, i)}
									title="点击下载"
								>
									<img
										src={v.applicationicon}
										className="app-icon"
									/>
									<div className="app-name">
										{v.applicationname}
									</div>
									<div className="app-version">
										{v.applicationversion}
									</div>
									<div className="app-filename">
										{v.applicationsrc.substring(
											v.applicationsrc.lastIndexOf("/") +
												1,
											v.applicationsrc.length
										)}
									</div>
								</div>
							);
						})}
					{downloadInfo && downloadInfo.screen_zip === "1" && (
						<React.Fragment>
							<div className="title">截屏图片</div>
							<span
								className="intro"
								onClick={this.downloadScreenClick.bind(this)}
							>
								下载
							</span>
						</React.Fragment>
					)}
				</div>
			</div>
		);
	}
}
