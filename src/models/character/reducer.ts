import {
	SAVEPERSONDESIGN,
	GETPERSONDESIGN,
	DELETEPERSONDESIGN,
	PERSONDESIGNINFO,
	SINGLECHECK,
	ALLCHECK,
	GETPERSONDESIGN1
} from "./types";
import { handleActions } from "redux-actions";
const defaultState: any = null;

export const characterList = handleActions(
	{
		[GETPERSONDESIGN]: (state, { payload }) => {
			return { ...payload };
		},
		[DELETEPERSONDESIGN]: (state, { payload }) => {
			let list = state.personaldesgins;
			let newList = list.filter((item: any, idx: any) => {
				if (item._id != payload) {
					return item;
				}
			});
			return { ...state, personaldesgins: [...newList] };
		}
	},
	defaultState
);

// 详情列表
export const characterInfoList = handleActions(
	{
		[PERSONDESIGNINFO]: (state, { payload }) => {
			if (payload && payload.accounts) {
				payload.accounts.map((item: any) => {
					item.isChecked = false;
				});
			}
			return { ...payload };
		},
		[SINGLECHECK]: (state, { payload }) => {
			let list = state.accounts;
			if (list) {
				list.map((item: any) => {
					if (item._id == payload.id) {
						item.isChecked = !item.isChecked;
					}
				});
			}
			return { ...state, accounts: [...list] };
		},
		[ALLCHECK]: (state, { payload }) => {
			let list = state.accounts;
			if (list) {
				list.map((item: any) => {
					item.isChecked = payload.type;
				});
			}
			return { ...state, accounts: [...list] };
		}
	},
	defaultState
);
export const characterList1 = handleActions(
	{
		[GETPERSONDESIGN1]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
