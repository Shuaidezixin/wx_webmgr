import { USERCREATE, GETSHORTGROUP, GETBEFORE, GETNEAREST } from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const createTask = handleActions(
	{
		[USERCREATE]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const shortGroupList = handleActions(
	{
		[GETSHORTGROUP]: (state, { payload }) => {
			return payload ? [...payload] : [];
		}
	},
	defaultState
);
export const beforeList = handleActions(
	{
		[GETBEFORE]: (state, { payload }) => {
			return payload ? { ...payload } : null;
		}
	},
	defaultState
);
export const nearestList = handleActions(
	{
		[GETNEAREST]: (state, { payload }) => {
			return payload ? [...payload] : [];
		}
	},
	defaultState
);
