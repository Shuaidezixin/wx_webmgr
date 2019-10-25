import { GETLIST } from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const logsList = handleActions(
	{
		[GETLIST]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
