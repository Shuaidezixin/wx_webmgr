import * as React from "react";
import "./index.less";

export default class EditPage<
	P = { location: any },
	S = {},
	SS = any
> extends React.PureComponent<P, S, SS> {
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
}
