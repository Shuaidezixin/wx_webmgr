import { GETPOOL, GETFRIEND, GETGROUP, GETWECHAT } from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const getPoolAnalysisAction = createAction(GETPOOL, (params: any) => {
	return http.post({
		url: "getnumberpoolstatistics"
	});
});
export const getFriendAnalysisAction = createAction(
	GETFRIEND,
	(params: any) => {
		return http.post({
			url: "getfriendstatistics"
		});
	}
);
export const getGroupAnalysisAction = createAction(GETGROUP, (params: any) => {
	return http.post({
		url: "getgroupfriendstatistics"
	});
});
export const getWechatAnalysisAction = createAction(
	GETWECHAT,
	(params: any) => {
		return http.post({
			url: "getaccountstatistics"
		});
	}
);
