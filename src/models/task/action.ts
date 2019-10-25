import {
	USERCREATE,
	GETSHORTGROUP,
	CREATEORUPDATESHORTGROUP,
	DELETESHORTGROUP,
	GETBEFORE,
	GETNEAREST
} from "./types";
import { createAction } from "redux-actions";
import http from "../../utils/ajax";

export const createUserTaskAction = createAction(USERCREATE, (params: any) => {
	return http.post({
		url: "user_add_task_manual",
		params
	});
});
export const getShortGroupListAction = createAction(
	GETSHORTGROUP,
	(params: any) => {
		return http.post({
			url: "accounttempgroups",
			params
		});
	}
);
export const createOrUpdateShortGroupAction = createAction(
	CREATEORUPDATESHORTGROUP,
	(params: any) => {
		return http.post({
			url: "createorupdatetempgroup",
			params
		});
	}
);
export const deleteShortGroupAction = createAction(
	DELETESHORTGROUP,
	(params: any) => {
		return http.post({
			url: "deleteaccounttempgroup",
			params
		});
	}
);
export const getBeforeAction = createAction(GETBEFORE, (params: any) => {
	return http.post({
		url: "recentuseaccounttasks"
	});
});
export const getNearestListAction = createAction(GETNEAREST, (params: any) => {
	return http.post({
		url: "latelytasks",
		params
	});
});
