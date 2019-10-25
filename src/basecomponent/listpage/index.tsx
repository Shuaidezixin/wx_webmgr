import * as React from "react";
import "./index.less";
import * as moment from "moment";

export default class ListPage<
	P extends BaseListProps,
	S extends BaseListState
> extends React.PureComponent<P, S> {
	public initPage() {
		let query: any = this.getPageQuery();
		if (query) {
			let set: any = {};
			let keys: any[] = Object.keys(query);
			if (keys && keys.length > 0) {
				keys.map((item: any) => {
					switch (item) {
						case "keyword":
							set[item] = decodeURI(query[item]);
							break;
						case "day_start":
							set[item] = moment(
								query[item].indexOf("-") == -1
									? Number(query[item])
									: query[item]
							);
							break;
						case "day_end":
							set[item] = moment(
								query[item].indexOf("-") == -1
									? Number(query[item])
									: query[item]
							);
							break;
						case "tags":
							let arr: any = [];
							try {
								arr = JSON.parse(decodeURI(query[item]));
							} catch (e) {
								console.error(e);
							}
							set[item] = arr;
							break;
						default:
							set[item] =
								parseInt(query[item], 10) == query[item]
									? Number(query[item])
									: query[item];

							break;
					}
				});
			}
			this.setState(
				{
					...set
				},
				this.getListData
			);
		}
	}
	componentWillMount() {
		this.setState({
			page: 1
		});
	}
	getListData() {}
	public getPageQuery(): any {
		let href: string = window.location.href;
		let search = href.split("?")[1];
		let res: any = {};
		if (search && search.length > 0) {
			let quArr = search.split("&");
			if (quArr && quArr.length > 0 && quArr instanceof Array) {
				quArr.map((item: any) => {
					let s = item.split("=");
					res[s[0]] = s[1];
				});
			}
		}
		return res;
	}
	public pageChange(e: number) {
		if (e == this.state.page) {
			return;
		}
		this.setState(
			{
				page: e
			},
			this.goByQuery
		);
	}
	goByQuery() {
		let { page } = this.state;
		let params: any = {
			page
		};

		this.goPage(params);
	}
	public formatQuery(params?: any): string {
		if (!params) {
			return "";
		}
		let keys: string[] = Object.keys(params);
		let resArr: any[] = [];
		let res: string = "";
		if (keys && keys.length > 0) {
			keys.map((item: any) => {
				if (params[item]) {
					resArr.push(`${item}=${params[item]}`);
				}
			});
		}
		if (resArr && resArr.length > 0) {
			res = `?${resArr.join("&")}`;
		}
		return res;
	}
	public goPage(params: any) {
		let query = this.formatQuery(params);
		if (query === window.appHistory.location.search) {
			return;
		}

		window.appHistory.push({
			pathname: window.appHistory.location.pathname,
			search: query
		});
	}
	public searchClick() {
		this.setState({ page: 1 }, this.goByQuery);
	}
	public InputChange(tag: string, e: any) {
		let value;
		if (e && e.target) {
			let type = e.target.type;
			switch (type) {
				case "checkbox":
					value = e.target.checked;
					break;
				default:
					value = e.target.value;
			}
			let set: any = {
				[tag]: value
			};
			this.setState({
				...set
			});
		} else {
			let set: any = {
				[tag]: e
			};
			this.setState({
				...set
			});
		}
	}
	public goEdit(id?: any) {
		let query: string = "";
		if (id && typeof id === "number") {
			query = "?id=" + id;
		}
		window.appHistory.push(this.props.path + "/edit" + query);
	}
}
