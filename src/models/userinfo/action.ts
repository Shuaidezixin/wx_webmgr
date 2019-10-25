import { LOGIN } from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const userLogin = createAction(LOGIN, (params: any) => {
	return {
		id: 1
	};
});
