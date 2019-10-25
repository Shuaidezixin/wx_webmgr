import { GETLIST } from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const getLogsListAction = createAction(GETLIST, (params: any) => {
	return http.post({
		url: "log_admin",
		params
	});
});
