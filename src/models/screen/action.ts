import {
	GETAPPLIST,
	ALLOTACCOUNTWX,
	INITCMSAUTOTASK,
	UNLOCKSCREEN
} from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const getScreenInitAction = createAction(GETAPPLIST, (params: any) => {
	return http.post({
		url: "websiteapkdownloadlist",
		params
	});
});

export const allotAccountWxAction = createAction(
	ALLOTACCOUNTWX,
	(params: any) => {
		return http.post({
			url: "distributionaccountwx",
			params
		});
	}
);

export const initCmsAutoTaskAction = createAction(
	INITCMSAUTOTASK,
	(params: any) => {
		return http.post({
			url: "initmobilebackstageautotask",
			params
		});
	}
);
export const unlockScreenAction = createAction(UNLOCKSCREEN, (params: any) => {
	return http.post({
		url: "unlockscreenequipment",
		params
	});
});
