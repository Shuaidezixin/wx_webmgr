import {
	GETDEPARTMENT,
	ADDDEPARTMENT,
	DELETEDEPARTMENT,
	GETAUTHLIIST,
	ADDROLE,
	DELETEROLE,
	GETROLELIST,
	ADDCUSTOMER,
	DELETECUSTOMER,
	GETCUSTOMERLIST,
	CLEARCUSTOMERLIST
	// GETPYQLIST,
	// CLEARPYQLIST,
	// GETTXLLIST,
	// CLEARTXLLIST,
	// GETNEWCOMMENTLIST,
	// ZAN,
	// COMMENT,
	// GETTXLLIST2,
	// OPERATEQUN
} from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const departmentList = handleActions(
	{
		[GETDEPARTMENT]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const authList = handleActions(
	{
		[GETAUTHLIIST]: (state, { payload }) => {
			return [...payload];
		}
	},
	defaultState
);
export const roleList = handleActions(
	{
		[GETROLELIST]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDROLE]: (state, { payload }) => {
			return { ...state };
		},
		[DELETEROLE]: (state, { payload }) => {
			return { ...state };
		}
	},
	defaultState
);
// ADDCUSTOMER,
// 	DELETECUSTOMER,
// 	GETCUSTOMERLIST
export const customerList = handleActions(
	{
		[GETCUSTOMERLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[CLEARCUSTOMERLIST]: (state, { payload }) => {
			return null;
		}
	},
	defaultState
);
