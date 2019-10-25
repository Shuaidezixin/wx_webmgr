import {
	GETTASK,
	UPDATETASK,
	GETSOURCE,
	UPDATESOURCE,
	GETADDFRIEND,
	UPDATEADDFRIEND,
	GETINIT,
	UPDATEINIT
} from "./types";
import { createAction } from "redux-actions";
import http from "../../utils/ajax";

export const getSettingTaskAction = createAction(GETTASK, (params: any) => {
	return http.post({
		url: "systemsettingtasks"
	});
});
export const updateSettingTaskAction = createAction(
	UPDATETASK,
	(params: any) => {
		return http.post({
			url: "updatesystemsettingtask",
			params
		});
	}
);
export const getSettingSourceAction = createAction(GETSOURCE, (params: any) => {
	return http.post({
		url: "resourcesetting",
		params
	});
});
export const updateSettingSourceAction = createAction(
	UPDATESOURCE,
	(params: any) => {
		return http.post({
			url: "updateresourcesetting",
			params
		});
	}
);
export const getSettingAddFriendAction = createAction(
	GETADDFRIEND,
	(params: any) => {
		return http.post({
			url: "getaddfriendsetting",
			params
		});
	}
);
export const updateSettingAddFriendAction = createAction(
	UPDATEADDFRIEND,
	(params: any) => {
		return http.post({
			url: "updateaddfriendsetting",
			params
		});
	}
);
export const getInitAction = createAction(GETINIT, (params: any) => {
	return http.post({
		url: "initmobilesettings",
		params
	});
});
export const updateInitAction = createAction(UPDATEINIT, (params: any) => {
	return http.post({
		url: "updateinitmobilesetting",
		params
	});
});
