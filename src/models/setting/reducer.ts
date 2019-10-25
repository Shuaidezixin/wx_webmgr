import {
	GETTASK,
	UPDATETASK,
	GETSOURCE,
	UPDATESOURCE,
	GETADDFRIEND,
	UPDATEADDFRIEND,
	GETINIT
} from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const settingTask = handleActions(
	{
		[GETTASK]: (state, { payload }) => {
			return { ...payload };
		},
		[UPDATETASK]: (state, { payload }) => {
			return { ...state };
		}
	},
	defaultState
);
export const settingSource = handleActions(
	{
		[GETSOURCE]: (state, { payload }) => {
			return { ...payload };
		},
		[UPDATESOURCE]: (state, { payload }) => {
			return { ...state };
		}
	},
	defaultState
);
export const settingAddFriend = handleActions(
	{
		[GETADDFRIEND]: (state, { payload }) => {
			return { ...payload };
		},
		[UPDATEADDFRIEND]: (state, { payload }) => {
			return { ...state };
		}
	},
	defaultState
);
