import {
	GETDEVICELIST,
	GETTASKLIST,
	DELETETASK,
	GETLOGLIST,
	CLEARTASKLIST
} from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const deviceList = handleActions(
	{
		[GETDEVICELIST]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const taskList = handleActions(
	{
		[GETTASKLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[DELETETASK]: (state, { payload }) => {
			let list = state.tasks;
			console.log(payload);
			let newList = list.filter((item: any) => {
				if (item.ArrInter.task_id != payload.task_id) {
					return item;
				}
			});
			return { ...state, tasks: newList };
		},
		[CLEARTASKLIST]: (state, { payload }) => {
			return null;
		}
	},
	defaultState
);
export const logList = handleActions(
	{
		[GETLOGLIST]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
