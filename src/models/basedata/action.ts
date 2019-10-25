import {
	GETPROVINCES,
	GETCITY,
	LOGIN,
	GETTAGLIST,
	GETTAGLIST1,
	UPLOADIMG,
	ADDTAG,
	DELETETAG,
	CLEARTAG,
	GETHOMESTATISTICS,
	GETUSERINFO,
	UPDATEUSERINFO
} from "./types";
import { createAction } from "redux-actions";
import http from "../../utils/ajax";

export const getProvincesListAction = createAction(
	GETPROVINCES,
	(params: any) => {
		return http.post({
			url: "get_all_provinces"
		});
	}
);
export const getCityListAction = createAction(GETCITY, (params: any) => {
	return http.post({
		url: "get_all_provinces",
		params: { p: params.p }
	});
});
export const loginAction = createAction(LOGIN, (params: any) => {
	return http.post(
		{
			url: "login",
			params
		},
		true
	);
});
export const getTagListAction = createAction(GETTAGLIST, (params: any) => {
	return http
		.post({
			url: "tag_list",
			params: {
				pagesize: 200,
				...params
			}
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				let m: any = { ...res };
				if (params.type) {
					m.data.type = params.type;
				}
				return { ...m };
			}
			return res;
		});
});
export const getTagListAction1 = createAction(GETTAGLIST1, (params: any) => {
	return http.post({
		url: "tag_list",
		params: {
			pagesize: 30,
			...params
		}
	});
});
export const clearTagListAction = createAction(CLEARTAG, () => {
	return null;
});
export const uploadAction = createAction(UPLOADIMG, (params: any) => {
	return http.post({
		url: "upload",
		params
	});
});
export const addTagAction = createAction(ADDTAG, (params: any) => {
	return http
		.post({
			url: "tag_add",
			params
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				return res;
			}
			return res;
		});
});
export const deleteTagAction = createAction(DELETETAG, (params: any) => {
	return http
		.post({
			url: "tag_delete",
			params
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				return params;
			}
			return res;
		});
});
export const getHomeStatisticsAction = createAction(
	GETHOMESTATISTICS,
	(params: any) => {
		return http.post(
			{
				url: "adminstatistics",
				params
			},
			true
		);
	}
);
export const getUserInfoAction = createAction(GETUSERINFO, (params: any) => {
	return http.post({
		url: "getuserinfo",
		params
	});
});
export const updateUserInfoAction = createAction(
	UPDATEUSERINFO,
	(params: any) => {
		return http.post({
			url: "updateuserinfo",
			params
		});
	}
);
