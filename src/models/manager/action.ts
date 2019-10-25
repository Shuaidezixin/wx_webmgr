import {
	GETDEPARTMENT,
	ADDDEPARTMENT,
	DELETEDEPARTMENT,
	GETAUTHLIIST,
	ADDROLE,
	DELETEROLE,
	GETROLELIST,
	ADDCUSTOMER,
	DELETECUSTOMER,
	GETCUSTOMERLIST,
	CLEARCUSTOMERLIST
} from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const getDepartmentListAction = createAction(
	GETDEPARTMENT,
	(params: any) => {
		return http.post({
			url: "adminuserdepartments",
			params
		});
	}
);
export const addDepartmentAction = createAction(
	ADDDEPARTMENT,
	(params: any) => {
		return http.post({
			url: "addadminuserdepartment",
			params
		});
	}
);
export const deleteDepartmentAction = createAction(
	DELETEDEPARTMENT,
	(params: any) => {
		return http.post({
			url: "deleteadminuserdepartment",
			params
		});
	}
);
export const getAuthListAction = createAction(GETAUTHLIIST, (params: any) => {
	return http.post({
		url: "adminactions"
	});
});
// ADDROLE,
// 	DELETEROLE,
// 	GETROLELIST
//角色
export const getRoleListAction = createAction(GETROLELIST, (params: any) => {
	return http.post({
		url: "adminroles",
		params
	});
});
export const addRoleAction = createAction(ADDROLE, (params: any) => {
	return http.post({
		url: "addadminrole",
		params
	});
});
export const deleteRoleAction = createAction(DELETEROLE, (params: any) => {
	return http.post({
		url: "deleteadminrole",
		params
	});
});
// ADDCUSTOMER,
// 	DELETECUSTOMER,
// 	GETCUSTOMERLIST
export const getCustomerListAction = createAction(
	GETCUSTOMERLIST,
	(params: any) => {
		return http.post({
			url: "systemadminusers",
			params
		});
	}
);
export const addCustomerAction = createAction(ADDCUSTOMER, (params: any) => {
	return http.post({
		url: "addsystemadminuser",
		params
	});
});
export const deleteCustomerAction = createAction(
	DELETECUSTOMER,
	(params: any) => {
		return http.post({
			url: "deletesystemadminuser",
			params
		});
	}
);

export const clearCustomerListAction = createAction(
	CLEARCUSTOMERLIST,
	(params: any) => {
		return {};
	}
);
// //写错位置的message
// export const getPyqListAction = createAction(GETPYQLIST, (params: any) => {
// 	return http.post({
// 		url: "accountpyqlist",
// 		params
// 	});
// });
// export const clearPyqListAction = createAction(CLEARPYQLIST, () => {
// 	return null;
// });
// export const pyqZanAction = createAction(ZAN, (params: any) => {
// 	return http
// 		.post({
// 			url: "accountpyqdianzanorcomment",
// 			params
// 		})
// 		.then((res: any) => {
// 			if (res && res.code == 200) {
// 				return {
// 					...res,
// 					data: {
// 						...params
// 					}
// 				};
// 			}
// 			return res;
// 		});
// });
// export const pyqCommentAction = createAction(COMMENT, (params: any) => {
// 	return http
// 		.post({
// 			url: "accountpyqdianzanorcomment",
// 			params
// 		})
// 		.then((res: any) => {
// 			if (res && res.code == 200) {
// 				return {
// 					...res,
// 					data: params
// 				};
// 			}
// 			return res;
// 		});
// });
// export const getTxlListAction = createAction(GETTXLLIST, (params: any) => {
// 	return http.post({
// 		url: "accountmaillist",
// 		params
// 	});
// });
// export const cleartXLListAction = createAction(CLEARTXLLIST, () => {
// 	return null;
// });
// export const getCommentListAction = createAction(
// 	GETNEWCOMMENTLIST,
// 	(params: any) => {
// 		return http.post({
// 			url: "accountpinlunlist",
// 			params
// 		});
// 	}
// );
// export const getTxlList2Action = createAction(GETTXLLIST2, (params: any) => {
// 	return http.post({
// 		url: "accountmaillist",
// 		params
// 	});
// });
// export const operateQunAction = createAction(OPERATEQUN, (params: any) => {
// 	return http.post({
// 		url: "weichatgroupoperation",
// 		params
// 	});
// });
// export const updateActiveTimeAction = createAction(
// 	UPDATEACTIVETIME,
// 	(params: any) => {
// 		return http.post({
// 			url: "weichattalkertime",
// 			params
// 		});
// 	}
// );
// export const clearCommentAction = createAction(CLEARCOMMENT, (params: any) => {
// 	return http.post({
// 		url: "accountpinglunread",
// 		params
// 	});
// });
// export const allReadAction = createAction(ALLREAD, (params: any) => {
// 	return http.post({
// 		url: "allread",
// 		params
// 	});
// });
