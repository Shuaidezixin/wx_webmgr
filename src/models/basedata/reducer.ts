import {
	GETPROVINCES,
	GETCITY,
	LOGIN,
	GETTAGLIST,
	GETTAGLIST1,
	UPLOADIMG,
	ADDTAG,
	DELETETAG,
	CLEARTAG,
	GETHOMESTATISTICS,
	GETUSERINFO
} from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const provincesList = handleActions(
	{
		[GETPROVINCES]: (state, { payload }) => {
			let list: any = [];
			if (payload && payload.provinces) {
				for (let key in payload.provinces) {
					list.push({
						value: key,
						label: payload.provinces[key],
						isLeaf: false
					});
				}
			}
			return list;
		}
	},
	defaultState
);
export const cityList = handleActions(
	{
		[GETCITY]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const loginData = handleActions(
	{
		[LOGIN]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const tagList = handleActions(
	{
		[GETTAGLIST]: (state, { payload }) => {
			if (!payload.type) {
				return { ...payload };
			}
			if (payload.type == "scroll") {
				let list = state && state.tags ? state.tags : [];
				let newList = [...list, ...payload.tags];
				return { ...state, ...payload, tags: [...newList] };
			}
		},
		[ADDTAG]: (state, { payload }) => {
			let list = state && state.tags ? state.tags : [];
			if (payload.tag_id) {
				list.unshift(payload);
			}
			return { ...state, tags: [...list] };
		},
		[DELETETAG]: (state, { payload }) => {
			let list = state && state.tags ? state.tags : [];
			let newList = list.filter((item: any) => {
				if (item.tag_id != payload.tag_id) {
					return item;
				}
			});
			return { ...state, tags: [...newList] };
		},
		[CLEARTAG]: (state, { payload }) => {
			return { ...defaultState };
		}
	},
	defaultState
);
export const tagList1 = handleActions(
	{
		[GETTAGLIST1]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const uploadDetail = handleActions(
	{
		[UPLOADIMG]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const homeStatistics = handleActions(
	{
		[GETHOMESTATISTICS]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const userinfo = handleActions(
	{
		[GETUSERINFO]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
