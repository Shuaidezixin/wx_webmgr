import {
	GETDEVICESLIST,
	GETTALKERLIST,
	CLEARTALKERLIST,
	GETTALKMESSAGELIST,
	CLEARTALKMESSAGELIST,
	SENDMESSAGE,
	UPDATETALKER,
	GETMESSAGE,
	CREATENEWMESSAGE,
	FRIENDSVALIDMESSAGE,
	FRIENDSVALIDTASK,
	WITHDRAWMESSAGE,
	GETPYQLIST,
	CLEARPYQLIST,
	GETTXLLIST,
	CLEARTXLLIST,
	GETNEWCOMMENTLIST,
	ZAN,
	COMMENT,
	GETTXLLIST2,
	OPERATEQUN,
	UPDATEACTIVETIME,
	CLEARCOMMENT,
	ALLREAD,
	GETMESSAGEEXTENSIONSCRIPTLIST,
	CLEAREXTENSIONSCRIPTLIST,
	UPDATETALKERINFO,
	UPDATETXLINFO
} from "./types";
import { createAction } from "redux-actions";

import http from "../../utils/ajax";

export const getMessageDevicesListAction = createAction(
	GETDEVICESLIST,
	(params: any) => {
		return http.post({
			url: "msg_device_list",
			params
		});
	}
);
export const getMessageTalkerListAction = createAction(
	GETTALKERLIST,
	(params: any) => {
		return http.post({
			url: "msg_talker_list",
			params
		});
	}
);
export const clearMessageTalkerListAction = createAction(
	CLEARTALKERLIST,
	(params: any) => {
		return {
			type: true
		};
	}
);
export const getMessageTalkListAction = createAction(
	GETTALKMESSAGELIST,
	(params: any) => {
		return http.post({
			url: "msg_talker_one_list",
			params
		});
	}
);
export const clearMessageTalkListAction = createAction(
	CLEARTALKMESSAGELIST,
	(params: any) => {
		return {
			type: true
		};
	}
);
//SENDMESSAGE
export const sendMessageAction = createAction(SENDMESSAGE, (params: any) => {
	return http
		.post({
			url: "msg_sent",
			params
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				console.log(params.content);
				return {
					...res,
					data: params
				};
			}
			return res;
		});
});
export const updateTalkerInfoAction = createAction(
	UPDATETALKER,
	(params: any) => {
		return http.post({
			url: "msg_talker_one_update",
			params
		});
	}
);
export const getMessageAction = createAction(GETMESSAGE, (params: any) => {
	return params;
});
export const createMessageAction = createAction(
	CREATENEWMESSAGE,
	(params: any) => {
		return params;
	}
);
// 好友请求验证请求
export const getFriendValidMessage = createAction(
	FRIENDSVALIDMESSAGE,
	(params: any) => {
		return http.post({
			url: "friendsvalidatemessages",
			params
		});
	}
);
// 好友验证任务
export const getFriendValidTask = createAction(
	FRIENDSVALIDTASK,
	(params: any) => {
		return http
			.post({
				url: "friendsvalidatetask",
				params
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return {
						...res,
						data: { ...params }
					};
				}
				return res;
			});
	}
);
export const withdrawMessageAction = createAction(
	WITHDRAWMESSAGE,
	(params: any) => {
		return params;
	}
);

//写错位置的message
export const getPyqListAction = createAction(GETPYQLIST, (params: any) => {
	return http.post({
		url: "accountpyqlist",
		params
	});
});
export const clearPyqListAction = createAction(CLEARPYQLIST, () => {
	return null;
});
export const pyqZanAction = createAction(ZAN, (params: any) => {
	return http
		.post({
			url: "accountpyqdianzanorcomment",
			params
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				return {
					...res,
					data: {
						...params
					}
				};
			}
			return res;
		});
});
export const pyqCommentAction = createAction(COMMENT, (params: any) => {
	return http
		.post({
			url: "accountpyqdianzanorcomment",
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
});
export const getTxlListAction = createAction(GETTXLLIST, (params: any) => {
	return http.post({
		url: "accountmaillist",
		params
	});
});
export const cleartXLListAction = createAction(CLEARTXLLIST, () => {
	return null;
});
export const getCommentListAction = createAction(
	GETNEWCOMMENTLIST,
	(params: any) => {
		return http.post({
			url: "accountpinlunlist",
			params
		});
	}
);
export const getTxlList2Action = createAction(GETTXLLIST2, (params: any) => {
	return http.post({
		url: "accountmaillist",
		params
	});
});
export const operateQunAction = createAction(OPERATEQUN, (params: any) => {
	return http.post({
		url: "weichatgroupoperation",
		params
	});
});
export const updateActiveTimeAction = createAction(
	UPDATEACTIVETIME,
	(params: any) => {
		return http.post({
			url: "weichattalkertime",
			params
		});
	}
);
export const clearCommentAction = createAction(CLEARCOMMENT, (params: any) => {
	return http.post({
		url: "accountpinglunread",
		params
	});
});
export const allReadAction = createAction(ALLREAD, (params: any) => {
	return http.post({
		url: "allread",
		params
	});
});
export const getMessageExtensionScriptListAction = createAction(
	GETMESSAGEEXTENSIONSCRIPTLIST,
	(params: any) => {
		return http.post({
			url: "getextensionscriptsbytalker",
			params
		});
	}
);
export const clearExtensionScriptListAction = createAction(
	CLEAREXTENSIONSCRIPTLIST,
	(params: any) => {
		return {};
	}
);
// UPDATETALKERINFO,
// 	UPDATETXLINFO
export const updateTalkerLocalInfoAction = createAction(
	UPDATETALKERINFO,
	(params: any) => {
		return params;
	}
);
export const updateTxlLocalInfoAction = createAction(
	UPDATETXLINFO,
	(params: any) => {
		return params;
	}
);
