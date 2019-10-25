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
	GETLISTFORSCREEN,
	SINGLELISTFORSCREEN,
	ALLLISTFORSCREEN,
	SETACCOUNTEXTENSION,
	BATCHACCOUNTLOGIN,
	CLEANACCOUNTLIST
} from "./types";
import { handleActions } from "redux-actions";
const defaultState: any = null;

export const accountListByGroup = handleActions(
	{
		[GETLISTBYGROUP]: (state, { payload }) => {
			if (payload && payload.users) {
				payload.users.map((item: any) => {
					item.isChecked = false;
				});
			}
			return { ...payload };
		}
	},
	defaultState
);
export const accountList = handleActions(
	{
		[GETLIST]: (state: any, { payload }: any) => {
			let newIds: any = [];
			if (state && state.data) {
				let oldData = state.data[payload.page];
				if (oldData && oldData.length > 0 && oldData instanceof Array) {
					oldData.map((v: any) => {
						if (v.isChecked) {
							newIds.push(v.id);
						}
					});
				}
			}
			let newList = payload && payload.users ? payload.users : [];
			if (newList && newList.length > 0 && newList instanceof Array) {
				newList.map((v: any) => {
					if (newIds.includes(v.id)) {
						v.isChecked = true;
					} else {
						v.isChecked = false;
					}
				});
			}
			let oldState = state ? state.data : null;
			return {
				...payload,
				data: {
					...oldState,
					[payload.page]: payload.users ? [...payload.users] : null
				}
			};
		},
		[SINGLECHECK]: (state, { payload }) => {
			let baseData = JSON.parse(JSON.stringify(state.data));
			let list1 = JSON.parse(JSON.stringify(baseData[payload.page]));
			if (list1 && list1.length > 0) {
				list1.map((item: any) => {
					if (item.id == payload.id) {
						item.isChecked = !item.isChecked;
					}
				});
			}
			baseData[payload.page] = list1;
			return {
				...state,
				data: {
					...baseData
				}
			};
		},
		[ALLCHECK]: (state, { payload }) => {
			let baseData = JSON.parse(JSON.stringify(state.data));
			let list1 = JSON.parse(JSON.stringify(baseData[payload.page]));
			if (list1 && list1.length > 0) {
				list1.map((item: any) => {
					item.isChecked = payload.type;
				});
			}
			baseData[payload.page] = list1;

			return {
				...state,
				data: {
					...baseData
				}
			};
		},
		[ADD]: (state, { payload }) => {
			return { ...state };
		},
		[DELETE]: (state, { payload }) => {
			let baseData = JSON.parse(JSON.stringify(state.data));
			let list1 = JSON.parse(JSON.stringify(baseData[payload.page]));

			let ids = payload.user_ids.split(",");
			if (ids.length <= 0) {
				return null;
			}
			let newList = list1.filter((item: any) => {
				if (ids.indexOf(item.id) == -1) {
					return item;
				}
			});
			baseData[payload.page] = newList;
			return {
				...state,
				data: {
					...baseData
				}
			};
		},
		[CHATSTATUS]: (state, { payload }) => {
			let baseData = JSON.parse(JSON.stringify(state.data));
			let list = state && state.data ? state.data[payload.page] : [];
			// let list = state && state.users ? state.users : [];
			let ids = payload.user_ids.split(",");

			if (list && list.length > 0) {
				list.map((item: any) => {
					if (ids.length <= 0) {
						item.chat_status = payload.type;
					} else {
						if (ids.indexOf(item.id) != -1) {
							item.chat_status = payload.type;
						}
					}
				});
			}
			baseData[payload.page] = list;
			return {
				...state,
				data: {
					...baseData
				}
			};
		},
		[CHATAUTOTASK]: (state, { payload }) => {
			let baseData = JSON.parse(JSON.stringify(state.data));
			let list = state && state.data ? state.data[payload.page] : [];
			let ids = payload.user_ids.split(",");
			if (list && list.length > 0) {
				list.map((item: any) => {
					if (ids.length <= 0) {
						item.is_auto_task = payload.type == 1 ? true : false;
					} else {
						if (ids.indexOf(item.id) != -1) {
							item.is_auto_task =
								payload.type == 1 ? true : false;
						}
					}
				});
			}
			baseData[payload.page] = list;
			return {
				...state,
				data: {
					...baseData
				}
			};
		},
		[CLEANACCOUNTLIST]: (state, { payload }) => {
			return null;
		}
	},
	defaultState
);

export const accoutListForScreen = handleActions(
	{
		[GETLISTFORSCREEN]: (state, { payload }) => {
			let { users } = payload;
			if (users && users.length > 0) {
				users.map((v: any) => {
					v.isChecked = false;
				});
			}
			return { ...payload, users: users ? [...users] : null };
		},
		[SINGLELISTFORSCREEN]: (state: any, { payload }: any): any => {
			let users = state && state.users ? state.users : [];
			if (users && users.length > 0) {
				users.map((item: any) => {
					if (item.id == payload.id) {
						item.isChecked = !item.isChecked;
					}
				});
			}
			return { ...state, users: [...users] };
		},
		[ALLLISTFORSCREEN]: (state: any, { payload }: any): any => {
			let users = state.users;
			if (users && users.length > 0) {
				users.map((item: any) => {
					item.isChecked = payload.state;
				});
			}
			return { ...state, users: users ? [...users] : null };
		}
	},
	defaultState
);
export const createAccountTask = handleActions(
	{
		[CREATETASK]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const accountDetail = handleActions(
	{
		[GETACCOUNTDETAIL]: (state, { payload }) => {
			return { ...payload };
		},
		[UPDATEACCOUNT]: (state, { payload }) => {
			return { ...state };
		}
	},
	defaultState
);
export const groupList = handleActions(
	{
		[GETGROUPS]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDGROUPS]: (state, { payload }) => {
			return { ...state };
		},
		[DELETEGROUP]: (state, { payload }) => {
			return { ...state };
		}
	},
	defaultState
);
export const groupList1 = handleActions(
	{
		[GETGROUPS1]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const modalAccountDetail = handleActions(
	{
		[GETBASEINFO]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const modalAccountDevice = handleActions(
	{
		[GETDEVICEINFO]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const batchAccountList = handleActions(
	{
		[BATCHACCOUNTLOGIN]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
