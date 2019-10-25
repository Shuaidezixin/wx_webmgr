import {
	GETDEVICELIST,
	GETTASKLIST,
	DELETETASK,
	GETLOGLIST,
	CLEARTASKLIST
} from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const getDeviceListAction = createAction(
	GETDEVICELIST,
	(params: any) => {
		return http.post({
			url: "index",
			params
		});
	}
);
export const getTaskListAction = createAction(GETTASKLIST, (params: any) => {
	return http.post({
		url: "task_index",
		params
	});
});
export const deleteTaskAction = createAction(DELETETASK, (params: any) => {
	return http
		.post({
			url: "task_delete",
			params
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				return {
					...params
				};
			}
		});
});
export const getLogListAction = createAction(GETLOGLIST, (params: any) => {
	return http.post({
		url: "log_index",
		params
	});
});
export const clearTaskListAction = createAction(
	CLEARTASKLIST,
	(params: any) => {
		return {
			isclear: true
		};
	}
);
