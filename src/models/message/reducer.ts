import {
	GETDEVICESLIST,
	GETTALKERLIST,
	CLEARTALKERLIST,
	GETTALKMESSAGELIST,
	CLEARTALKMESSAGELIST,
	SENDMESSAGE,
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
	UPDATETXLINFO,
	UPDATETALKERINFO
} from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const messageDevicesList = handleActions(
	{
		[GETDEVICESLIST]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const messageTalkerList = handleActions(
	{
		[GETTALKERLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[CLEARTALKERLIST]: (state, { payload }) => {
			return null;
		},
		[UPDATETALKERINFO]: (state, { payload }) => {
			let { msg_talks } = state;
			let { talk_id, type, value } = payload;

			if (msg_talks && msg_talks.length > 0) {
				msg_talks.map((v: any) => {
					if (v.talk_id == talk_id) {
						v[type] = value;
					}
				});
			}
			return { ...state, msg_talks: [...msg_talks] };
		}
	},
	defaultState
);
export const messageTalkList = handleActions(
	{
		[GETTALKMESSAGELIST]: (state, { payload }) => {
			return { ...payload };
		},
		[CLEARTALKMESSAGELIST]: (state, { payload }) => {
			return null;
		},
		[SENDMESSAGE]: (state, { payload }) => {
			let list = state.msgs && state.msgs.length > 0 ? state.msgs : [];
			if (payload) {
				list.push({ ...payload, isSend: 1 });
			}
			return { ...state, msgs: [...list] };
		}
	},
	defaultState
);
export const messageList = handleActions(
	{
		[GETMESSAGE]: (state, { payload }) => {
			if (!payload.data) {
				return state;
			}
			let { account_id, talker_id, msgs } = payload.data;
			if (!account_id || !talker_id) {
				return state;
			}
			if (!state) {
				state = {};
			}
			if (!state[`${account_id}_${talker_id}`]) {
				state[`${account_id}_${talker_id}`] = {
					account_id,
					talker_id,
					message: []
				};
			}
			state[`${account_id}_${talker_id}`].message = msgs ? msgs : [];
			return { ...state };
		},
		[CREATENEWMESSAGE]: (state, { payload }) => {
			let oldData = JSON.parse(JSON.stringify(state));
			if (payload.data && payload.data.length > 0) {
				let { account_id, talker_id } = payload.data[0];
				if (!oldData) {
					oldData = {};
				}
				if (!oldData[`${account_id}_${talker_id}`]) {
					oldData[`${account_id}_${talker_id}`] = {
						account_id,
						talker_id,
						message: []
					};
				}
				if (oldData[`${account_id}_${talker_id}`].message) {
					let d = JSON.parse(JSON.stringify(payload.data));
					let dataID = d.map((v: any) => {
						return v.msg_db_id;
					});
					oldData[`${account_id}_${talker_id}`].message.map(
						(v: any) => {
							if (dataID.indexOf(v.msg_db_id) != -1) {
								v = payload.data;
								d.splice(dataID.indexOf(v.msg_db_id), 1);
								dataID.splice(dataID.indexOf(v.msg_db_id), 1);
							}
						}
					);

					oldData[`${account_id}_${talker_id}`].message = [
						...oldData[`${account_id}_${talker_id}`].message,
						...d
					];
				}
			}
			return { ...oldData };
		},
		[WITHDRAWMESSAGE]: (state, { payload }) => {
			let oldData = JSON.parse(JSON.stringify(state));
			let { account_id, talker_id, create_time, content } = payload;
			let d = oldData[account_id + "_" + talker_id];
			let m = d["message"];
			let nm: any[];
			if (m && m.length > 0) {
				nm = m.filter((v: any) => {
					if (v.create_time != create_time && v.content != content) {
						return v;
					}
				});
			}
			d["message"] = [...nm];
			return { ...oldData };
		}
	},
	defaultState
);
// 请求验证消息
export const messageFriendValid = handleActions(
	{
		[FRIENDSVALIDMESSAGE]: (state, { payload }) => {
			return { ...payload };
		},
		[FRIENDSVALIDTASK]: (state, { payload }) => {
			let { username, account_id, type, content } = payload;
			let list = state.friendacceptusers ? state.friendacceptusers : [];
			if (list && list.length > 0) {
				list.map((v: any, i: number) => {
					if (v.username == username) {
						switch (type) {
							case 1:
								list.splice(i, 1);
								break;
							case 2:
								v.addstate = 2;
								break;
							case 3:
								v.addstate = 1;
								break;
							case 4:
								v.messages.push(content);
								break;
							default:
								break;
						}
					}
				});
			}

			return { ...state, friendacceptusers: [...list] };
		}
	},
	defaultState
);
export const pyqList = handleActions(
	{
		[GETPYQLIST]: (state, { payload }) => {
			if (payload && payload.page === 1) {
				return { ...payload };
			}
			if (payload && payload.page > 1 && payload.accountpyqs) {
				return {
					...state,
					...payload,
					accountpyqs: [...state.accountpyqs, ...payload.accountpyqs]
				};
			}
			return { ...state };
		},
		[ZAN]: (state, { payload }) => {
			let { pyqid } = payload;
			let { accountpyqs } = state;

			if (
				pyqid &&
				pyqid.length > 0 &&
				accountpyqs &&
				accountpyqs.length > 0
			) {
				accountpyqs.map((item: any) => {
					if (item.pyq_id == pyqid) {
						item.isselfzan = !item.isselfzan;
						if (item.isselfzan) {
							item.dianzan_list.push({
								nickname: item.currentaccountnickname
							});
						} else {
							let list: any = item.dianzan_list.filter(
								(v: any) => {
									if (
										v.nickname !=
										item.currentaccountnickname
									) {
										return v;
									}
								}
							);
							item.dianzan_list = [...list];
						}
					}
				});
			}

			return {
				...state,
				accountpyqs: [...accountpyqs]
			};
		},
		[COMMENT]: (state, { payload }) => {
			// comment_nickname: "A梦"
			// comment_username: "Ameng88k"
			// content: "萨达萨达"
			// send_username: "Ameng88k"
			// touxiang: ""
			let obj: any = null;
			if (payload) {
				obj = {
					send_username: payload.commentName,
					comment_nickname: payload.ownName,
					content: payload.content,
					// payload: payload.commentName,
					comment_username: payload.ownUserName
				};
			}
			let { accountpyqs } = state;
			if (obj) {
				accountpyqs.map((item: any) => {
					if (item.pyq_id == payload.pyqid) {
						item.comment_list.push(obj);
					}
				});
			}
			return {
				...state,
				accountpyqs: [...accountpyqs]
			};
		},
		[CLEARPYQLIST]: (state, { payload }) => {
			return null;
		}
	},
	defaultState
);
export const txlList = handleActions(
	{
		[GETTXLLIST]: (state, { payload }) => {
			if (payload && payload.page === 1) {
				return { ...payload };
			}
			if (payload && payload.page > 1 && payload.msg_talks) {
				return {
					...payload,
					msg_talks: [...state.msg_talks, ...payload.msg_talks]
				};
			}
			return { ...state };
		},
		[CLEARTXLLIST]: (state, { payload }) => {
			return null;
		},
		[UPDATETXLINFO]: (state, { payload }) => {
			if (!state) {
				return null;
			}
			let { msg_talks } = state;
			let { talk_id, type, value } = payload;
			if (msg_talks && msg_talks.length > 0) {
				msg_talks.map((v: any) => {
					if (v.talk_id == talk_id) {
						v[type] = value;
					}
				});
			}
			return { ...state, msg_talks: [...msg_talks] };
		}
	},
	defaultState
);
export const commentList = handleActions(
	{
		[GETNEWCOMMENTLIST]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const txlList2 = handleActions(
	{
		[GETTXLLIST2]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const operateQun = handleActions(
	{
		[OPERATEQUN]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const messageExtensionScriptList = handleActions(
	{
		[GETMESSAGEEXTENSIONSCRIPTLIST]: (state, { payload }) => {
			return payload ? [...payload] : [];
		},
		[CLEAREXTENSIONSCRIPTLIST]: (state, { payload }) => {
			return null;
		}
	},
	defaultState
);
