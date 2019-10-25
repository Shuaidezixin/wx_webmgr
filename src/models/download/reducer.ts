import { GETINFO } from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const downloadInfo = handleActions(
	{
		[GETINFO]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
