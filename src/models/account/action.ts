import {
	GETLIST,
	ADD,
	SINGLECHECK,
	ALLCHECK,
	CREATETASK,
	GETACCOUNTDETAIL,
	UPDATEACCOUNT,
	DELETE,
	CHATSTATUS,
	CHATAUTOTASK,
	ADDGROUPS,
	GETLISTBYGROUP,
	GETGROUPS,
	DELETEGROUP,
	GETGROUPS1,
	GETBASEINFO,
	GETDEVICEINFO,
	GETAPPLIST,
	INSTALLAPP,
	ALLOT,
	GETSCREENADDRESS,
	GETLISTFORSCREEN,
	SINGLELISTFORSCREEN,
	ALLLISTFORSCREEN,
	SETACCOUNTEXTENSION,
	BATCHACCOUNTLOGIN,
	CLEANACCOUNTLIST,
	EXPORTACCOUNTDATA
} from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const getAccountListByGroupAction = createAction(
	GETLISTBYGROUP,
	(params: any) => {
		return http.post({
			url: "user_list",
			params
		});
	}
);
export const getAccountListAction = createAction(GETLIST, (params: any) => {
	return http.post({
		url: "user_list",
		params
	});
});
export const getAccountListForScreenAction = createAction(
	GETLISTFORSCREEN,
	(params: any) => {
		return http.post({
			url: "user_list",
			params
		});
	}
);
export const addAccountAction = createAction(ADD, (params: any) => {
	return http.post({
		url: "user_add",
		params
	});
});
export const singleCheckAccountAction = createAction(
	SINGLECHECK,
	(params: any) => {
		return params;
	}
);
export const allCheckAccountAction = createAction(ALLCHECK, (params: any) => {
	return params;
});

export const cleaAccountDataAction = createAction(
	CLEANACCOUNTLIST,
	(params: any) => {
		return params;
	}
);

export const createAccountTaskAction = createAction(
	CREATETASK,
	(params: any) => {
		return http.post({
			url: "user_add_task_auto",
			params
		});
	}
);
export const getAccountDetailAction = createAction(
	GETACCOUNTDETAIL,
	(params: any) => {
		return http.post({
			url: "user_one",
			params
		});
	}
);
export const updateAccountDetailAction = createAction(
	UPDATEACCOUNT,
	(params: any) => {
		return http.post({
			url: "user_update",
			params
		});
	}
);
export const deleteAccountAction = createAction(DELETE, (params: any) => {
	return http
		.post({
			url: "user_delete_ids",
			params
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				return params;
			}
			return res;
		});
});
export const changeChatStatusAction = createAction(
	CHATSTATUS,
	(params: any) => {
		return http
			.post({
				url: "chat_status_ids",
				params
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return {
						...res,
						data: params
					};
				}
				return res;
			});
	}
);
export const changeChatAutoTaskAction = createAction(
	CHATAUTOTASK,
	(params: any) => {
		return http
			.post({
				url: "task_status_ids",
				params
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return {
						...res,
						data: params
					};
				}
				return res;
			});
	}
);
export const addGroupsAction = createAction(ADDGROUPS, (params: any) => {
	return http.post({
		url: "addaccountgroupaccount",
		params
	});
});
export const getGroupsAction = createAction(GETGROUPS, (params: any) => {
	return http.post({
		url: "accountgroups",
		params
	});
});
export const getGroupsAction1 = createAction(GETGROUPS1, (params: any) => {
	return http.post({
		url: "accountgroups",
		params
	});
});
export const deleteGroupAction = createAction(DELETEGROUP, (params: any) => {
	return http.post({
		url: "deleteaccountgroup",
		params
	});
});
export const getModalAccountDetailAction = createAction(
	GETBASEINFO,
	(params: any) => {
		return http.post({
			url: "getaccountdevicebaseinfo",
			params
		});
	}
);
export const getModalAccountDeviceAction = createAction(
	GETDEVICEINFO,
	(params: any) => {
		return http.post({
			url: "getaccountdeviceresourceinfo",
			params
		});
	}
);
export const getAppListAction = createAction(GETAPPLIST, (params: any) => {
	return http.post({
		url: "accountapklist",
		params
	});
});
export const installAppAction = createAction(INSTALLAPP, (params: any) => {
	return http.post({
		url: "installaccountapk",
		params
	});
});
export const allotAction = createAction(ALLOT, (params: any) => {
	return http.post({
		url: "updateaccountadminuser",
		params
	});
});
export const getScreenAddressAction = createAction(
	GETSCREENADDRESS,
	(params: any) => {
		return http.post({
			url: "getsocketrelay",
			params
		});
	}
);
export const singleAccountCheckForScreenAction = createAction(
	SINGLELISTFORSCREEN,
	(params: any) => {
		return params;
	}
);
export const allAccountCheckForScreenAction = createAction(
	ALLLISTFORSCREEN,
	(params: any) => {
		return params;
	}
);
// 设置推广剧本适用的账户
export const setAccountExtensionScriptAction = createAction(
	SETACCOUNTEXTENSION,
	(params: any) => {
		return http.post({
			url: "setaccountapplyextensionscript",
			params
		});
	}
);
// 批量上号
export const batchAccountLoginAction = createAction(
	BATCHACCOUNTLOGIN,
	(params: any) => {
		return http.post({
			url: "batchaccounttopnumber",
			params
		});
	}
);
// 导出上号成功文件
export const exportAccountDataAction = createAction(
	EXPORTACCOUNTDATA,
	(params: any) => {
		return http.post({
			url: "exportbatchaccounttopnumberdata",
			params
		});
	}
);
