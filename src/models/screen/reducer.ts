import { GETAPPLIST } from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const screenInit = handleActions(
	{
		[GETAPPLIST]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
