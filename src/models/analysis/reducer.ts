import { GETPOOL, GETFRIEND, GETGROUP, GETWECHAT } from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const poolAnalysis = handleActions(
	{
		[GETPOOL]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const friendAnalysis = handleActions(
	{
		[GETFRIEND]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const groupAnalysis = handleActions(
	{
		[GETGROUP]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const wechatAnalysis = handleActions(
	{
		[GETWECHAT]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
