import { GETINFO, GETDOWNLOAD, GETSCREENURL } from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const getDownloadInfoAction = createAction(GETINFO, (params: any) => {
	return http.post({
		url: "downloadsoftwarelist",
		params
	});
});
export const getDownloadAction = createAction(GETDOWNLOAD, (params: any) => {
	return http.post({
		url: "getuserapkpath",
		params
	});
});
export const getScreenUrlAction = createAction(GETSCREENURL, (params: any) => {
	return http.post({
		url: "downloadscreenpic",
		params
	});
});
