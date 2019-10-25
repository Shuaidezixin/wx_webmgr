import {
	//加好友
	GETFRIENDLIST,
	ADDFRIEND,
	DELETEADDFRIEND,
	//公众号
	ADDGZH,
	GETGZHLIST,
	DELETEGZH,
	//头像
	ADDTOUXIANG,
	GETTOUXIANGLIST,
	DELETETOUXIANG,
	//昵称
	ADDNICKNAME,
	GETNICKNAMELIST,
	DELETENICKNAME,
	//个性签名
	ADDPROFILE,
	GETPROFILELIST,
	DELETEPROFILE,
	//壁纸
	ADDBIZHI,
	GETBIZHILIST,
	DELETEBIZHI,
	//说说
	ADDSHUOSHUO,
	GETSHUOSHUOLIST,
	DELETESHUOSHUO,
	GETSHUOSHUODETAIL,
	EXAMINE,
	//内部剧本
	GETSCRIPTLIST,
	ADDSCRIPT,
	DELETESCRIPT,
	// 推广剧本
	ADDEXTENSIONSCRIPT,
	GETEXTENSIONSCRIPT,
	DELETEEXTENSIONSCRIPT
} from "./types";
import { handleActions } from "redux-actions";

const defaultState: any = null;

export const sourceFriendList = handleActions(
	{
		[GETFRIENDLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDFRIEND]: (state, { payload }) => {
			return { ...state };
		},
		[DELETEADDFRIEND]: (state, { payload }) => {
			if (!payload || !payload.id) {
				return { ...state };
			}
			let list = state.resources ? state.resources : [];
			let newList: any = [];

			if (payload && payload.id && list.length > 0) {
				newList = list.filter((item: any) => {
					if (item.addfriend.id != payload.id) {
						return item;
					}
				});
			}
			return { ...state, resources: [...newList] };
		}
	},
	defaultState
);

export const sourceGzhList = handleActions(
	{
		[GETGZHLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDGZH]: (state, { payload }) => {
			return { ...state };
		},
		[DELETEGZH]: (state, { payload }) => {
			if (!payload || !payload.id) {
				return { ...state };
			}

			let list = state.resources ? state.resources : [];
			let newList: any = [];

			if (payload && payload.id && list.length > 0) {
				newList = list.filter((item: any) => {
					if (item.gzh.id != payload.id) {
						return item;
					}
				});
			}
			return { ...state, resources: [...newList] };
		}
	},
	defaultState
);
//ADDNICKNAME
export const sourceNicknameList = handleActions(
	{
		[GETNICKNAMELIST]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDNICKNAME]: (state, { payload }) => {
			return { ...state };
		},
		[DELETENICKNAME]: (state, { payload }) => {
			if (!payload || !payload.id) {
				return { ...state };
			}

			let list = state.resources ? state.resources : [];
			let newList: any = [];

			if (payload && payload.id && list.length > 0) {
				newList = list.filter((item: any) => {
					if (item.nickname.id != payload.id) {
						return item;
					}
				});
			}
			return { ...state, resources: [...newList] };
		}
	},
	defaultState
);
//个性签名
export const sourceProfileList = handleActions(
	{
		[GETPROFILELIST]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDPROFILE]: (state, { payload }) => {
			return { ...state };
		},
		[DELETEPROFILE]: (state, { payload }) => {
			if (!payload || !payload.id) {
				return { ...state };
			}

			let list = state.resources ? state.resources : [];
			let newList: any = [];

			if (payload && payload.id && list.length > 0) {
				newList = list.filter((item: any) => {
					if (item.profile.id != payload.id) {
						return item;
					}
				});
			}
			return { ...state, resources: [...newList] };
		}
	},
	defaultState
);

//头像
export const sourceTouxiangList = handleActions(
	{
		[GETTOUXIANGLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDTOUXIANG]: (state, { payload }) => {
			return { ...state };
		},
		[DELETETOUXIANG]: (state, { payload }) => {
			if (!payload || !payload.id) {
				return { ...state };
			}

			let list = state.resources ? state.resources : [];
			let newList: any = [];

			if (payload && payload.id && list.length > 0) {
				newList = list.filter((item: any) => {
					if (item.touxiang.id != payload.id) {
						return item;
					}
				});
			}
			return { ...state, resources: [...newList] };
		}
	},
	defaultState
);
//壁纸  ADDBIZHI
export const sourceBizhiList = handleActions(
	{
		[GETBIZHILIST]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDBIZHI]: (state, { payload }) => {
			return { ...state };
		},
		[DELETEBIZHI]: (state, { payload }) => {
			if (!payload || !payload.id) {
				return { ...state };
			}

			let list = state.resources ? state.resources : [];
			let newList: any = [];

			if (payload && payload.id && list.length > 0) {
				newList = list.filter((item: any) => {
					if (item.bizhi.id != payload.id) {
						return item;
					}
				});
			}
			return { ...state, resources: [...newList] };
		}
	},
	defaultState
);
//说说
export const sourceShuoshuoList = handleActions(
	{
		[GETSHUOSHUOLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[ADDSHUOSHUO]: (state, { payload }) => {
			return { ...state };
		},
		[DELETESHUOSHUO]: (state, { payload }) => {
			if (!payload || !payload.id) {
				return { ...state };
			}

			let list = state.resources ? state.resources : [];
			let newList: any = [];

			if (payload && payload.id && list.length > 0) {
				newList = list.filter((item: any) => {
					if (item.shuoshuo.id != payload.id) {
						return item;
					}
				});
			}
			return { ...state, resources: [...newList] };
		},
		[EXAMINE]: (state, { payload }) => {
			if (!payload || !payload.id) {
				return { ...state };
			}
			let list = state.resources ? state.resources : [];
			let newList: any = [];

			if (payload && payload.id && list.length > 0) {
				newList = list.map((item: any) => {
					if (item.shuoshuo.id == payload.id) {
						item.shuoshuo.examine_status = 1;
					}
					return item;
				});
			}
			return { ...state, resources: [...newList] };
		}
	},
	defaultState
);
export const sourceShuoshuoDetail = handleActions(
	{
		[GETSHUOSHUODETAIL]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const scriptList = handleActions(
	{
		[GETSCRIPTLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[DELETESCRIPT]: (state, { payload }) => {
			let { id } = payload;
			let { resoureinsidescripts } = state;
			let newList: any = [];
			if (resoureinsidescripts && resoureinsidescripts.length > 0) {
				resoureinsidescripts.map((v: any) => {
					if (v.id != id) {
						newList.push(v);
					}
				});
			}
			return { ...state, resoureinsidescripts: [...newList] };
		}
	},
	defaultState
);
export const extensionScriptList = handleActions(
	{
		[GETEXTENSIONSCRIPT]: (state, { payload }) => {
			return { ...payload };
		},
		[DELETEEXTENSIONSCRIPT]: (state, { payload }) => {
			let { id } = payload;
			let { resoureinsidescripts } = state;
			let newList: any = [];
			if (resoureinsidescripts && resoureinsidescripts.length > 0) {
				resoureinsidescripts.map((v: any) => {
					if (v.id != id) {
						newList.push(v);
					}
				});
			}
			return { ...state, resoureinsidescripts: [...newList] };
		}
	},
	defaultState
);
