import {
	SAVEPERSONDESIGN,
	GETPERSONDESIGN,
	DELETEPERSONDESIGN,
	PERSONDESIGNINFO,
	SINGLECHECK,
	ALLCHECK,
	GETPERSONDESIGN1,
	USERSETPERSONDESIGN,
	USERREMOVEPERSONDESIGN
} from "./types";

import { createAction } from "redux-actions";
import http from "../../utils/ajax";

export const getCharaterAction = createAction(
	GETPERSONDESIGN,
	(params: any) => {
		return http.post({
			url: "personaldesigns",
			params
		});
	}
);
export const getCharaterAction1 = createAction(
	GETPERSONDESIGN1,
	(params: any) => {
		return http.post({
			url: "personaldesigns",
			params
		});
	}
);
export const deleteCharaterAction = createAction(
	DELETEPERSONDESIGN,
	(params: any) => {
		return http
			.post({
				url: "deletepersonaldesign",
				params
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return {
						...res,
						data: params.personal_design_id
					};
				}
				return res;
			});
	}
);

export const getcharacterInfoAction = createAction(
	PERSONDESIGNINFO,
	(params: any) => {
		return http.post({
			url: "personaldesigninfo",
			params
		});
	}
);

export const saveCharaterAction = createAction(
	SAVEPERSONDESIGN,
	(params: any) => {
		return http.post({
			url: "saveorupdatepersonaldesign",
			params
		});
		// .then((res: any) => {
		// 	if (res && res.code == 200) {
		// 		return {
		// 			...res,
		// 			data: params
		// 		};
		// 	}
		// 	return res;
		// });
	}
);

export const userSetPersonDesignAction = createAction(
	USERSETPERSONDESIGN,
	(params: any) => {
		return http.post({
			url: "accountbindpersonaldesign",
			params: {
				...params,
				type: 1
			}
		});
	}
);
export const userRemovePersonDesignAction = createAction(
	USERREMOVEPERSONDESIGN,
	(params: any) => {
		return http.post({
			url: "accountbindpersonaldesign",
			params: {
				...params,
				type: 2
			}
		});
	}
);

export const singleCheckPersonAction = createAction(
	SINGLECHECK,
	(params: any) => {
		return params;
	}
);
export const allCheckPersonAction = createAction(ALLCHECK, (params: any) => {
	return params;
});
