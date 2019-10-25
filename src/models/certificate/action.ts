import { GETCERTIFICATELIST, DOWNLOADNODECERT, UPDATENODENOTE } from "./types";

import { createAction } from "redux-actions";
import http from "../../utils/ajax";

export const getCertificateListAction = createAction(
	GETCERTIFICATELIST,
	(params: any) => {
		return http.post({
			url: "websitenodescertificates",
			params
		});
	}
);
export const downloadNodeCertAction = createAction(
	DOWNLOADNODECERT,
	(params: any) => {
		return http.post({
			url: "downloadnodecert",
			params
		});
	}
);
export const updateNodeNoteAction = createAction(
	UPDATENODENOTE,
	(params: any) => {
		return http.post({
			url: "updatenodenote",
			params
		});
	}
);
