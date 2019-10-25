import { GETCERTIFICATELIST } from "./types";
import { handleActions } from "redux-actions";
const defaultState: any = null;

export const certificateList = handleActions(
	{
		[GETCERTIFICATELIST]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
