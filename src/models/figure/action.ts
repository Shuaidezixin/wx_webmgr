import { ADD, GETDETAIL, GETLIST, DELETE } from "./types";
import { createAction } from "redux-actions";
import http from "../../utils/ajax";

export const addFigureAction = createAction(ADD, (params: any) => {
	return http.post({
		url: "figure_add",
		params
	});
});
export const getFigureDetailAction = createAction(GETDETAIL, (params: any) => {
	return http.post({
		url: "figure_one",
		params
	});
});
export const getFigureListAction = createAction(GETLIST, (params: any) => {
	return http.post({
		url: "figure_list",
		params
	});
});
export const deleteFigureAction = createAction(DELETE, (params: any) => {
	return http
		.post({
			url: "figure_delete",
			params
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				return {
					...res,
					data: params.figure_id
				};
			}
			return res;
		});
});
