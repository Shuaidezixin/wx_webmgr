import {
	GETFRIENDLIST,
	ADDFRIEND,
	DELETEADDFRIEND,
	IMPORTTEMPLATE,
	ADDGZH,
	GETGZHLIST,
	DELETEGZH,
	ADDTOUXIANG,
	GETTOUXIANGLIST,
	DELETETOUXIANG,
	ADDNICKNAME,
	GETNICKNAMELIST,
	DELETENICKNAME,
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
	//剧本
	GETSCRIPTLIST,
	ADDSCRIPT,
	DELETESCRIPT,
	// 推广剧本
	ADDEXTENSIONSCRIPT,
	GETEXTENSIONSCRIPT,
	DELETEEXTENSIONSCRIPT
	// SETACCOUNTEXTENSION
} from "./types";
import { createAction } from "redux-actions";
import http from "../../utils/ajax";

//加好友
export const getSourceFriendListAction = createAction(
	GETFRIENDLIST,
	(params: any) => {
		return http.post({
			url: "resource_list",
			params: {
				...params,
				res_type: "addfriend"
			}
		});
	}
);
export const addSourceFriendAction = createAction(ADDFRIEND, (params: any) => {
	return http
		.post({
			url: "resource_add",
			params: {
				resource_obj: JSON.stringify({
					addfriend: params
				}),
				res_type: "addfriend"
			}
		})
		.then((res: any) => {
			return res;
		});
});
export const deleteSourceFriendAction = createAction(
	DELETEADDFRIEND,
	(params: any) => {
		return http
			.post({
				url: "resource_delete",
				params: {
					resource_id: params.id,
					res_type: "addfriend"
				}
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return { id: params.id };
				}
				return res;
			});
	}
);
export const importTemplateFriendAction = createAction(
	IMPORTTEMPLATE,
	(params: any) => {
		return http.post({
			url: "importfriendexcel",
			params
		});
	}
);
//公众号
export const addSourceGzhAction = createAction(ADDGZH, (params: any) => {
	return http.post({
		url: "resource_add",
		params: {
			resource_obj: JSON.stringify({
				gzh: params
			}),
			res_type: "gzh"
		}
	});
});
export const getSourceGzhListAction = createAction(
	GETGZHLIST,
	(params: any) => {
		return http.post({
			url: "resource_list",
			params: {
				...params,
				res_type: "gzh"
			}
		});
	}
);
export const deleteSourceGzhAction = createAction(DELETEGZH, (params: any) => {
	return http
		.post({
			url: "resource_delete",
			params: {
				resource_id: params.id,
				res_type: "gzh"
			}
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				return { id: params.id };
			}
			return res;
		});
});
//昵称DELETENICKNAME
export const addSourceNicknameAction = createAction(
	ADDNICKNAME,
	(params: any) => {
		return http.post({
			url: "resource_add",
			params: {
				resource_obj: JSON.stringify({
					nickname: params
				}),
				res_type: "nickname"
			}
		});
	}
);
export const getSourceNicknameListAction = createAction(
	GETNICKNAMELIST,
	(params: any) => {
		return http.post({
			url: "resource_list",
			params: {
				...params,
				res_type: "nickname"
			}
		});
	}
);
export const deleteSourceNicknameAction = createAction(
	DELETENICKNAME,
	(params: any) => {
		return http
			.post({
				url: "resource_delete",
				params: {
					resource_id: params.id,
					res_type: "nickname"
				}
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return { id: params.id };
				}
				return res;
			});
	}
);
//个性签名
export const addSourceProfileAction = createAction(
	ADDPROFILE,
	(params: any) => {
		return http.post({
			url: "resource_add",
			params: {
				resource_obj: JSON.stringify({
					profile: params
				}),
				res_type: "profile"
			}
		});
	}
);
export const getSourceProfileListAction = createAction(
	GETPROFILELIST,
	(params: any) => {
		return http.post({
			url: "resource_list",
			params: {
				...params,
				res_type: "profile"
			}
		});
	}
);
export const deleteSourceProfileAction = createAction(
	DELETEPROFILE,
	(params: any) => {
		return http
			.post({
				url: "resource_delete",
				params: {
					resource_id: params.id,
					res_type: "profile"
				}
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return { id: params.id };
				}
				return res;
			});
	}
);
//头像
// GETTOUXIANGLIST,
// DELETETOUXIANG,
export const addSourceTouxiangAction = createAction(
	ADDTOUXIANG,
	(params: any) => {
		return http.post({
			url: "resource_add",
			params: {
				resource_obj: JSON.stringify({
					touxiang: params
				}),
				res_type: "touxiang"
			}
		});
	}
);
export const getSourceTouxiangListAction = createAction(
	GETTOUXIANGLIST,
	(params: any) => {
		return http.post({
			url: "resource_list",
			params: {
				...params,
				res_type: "touxiang"
			}
		});
	}
);
export const deleteSourceTouxiangAction = createAction(
	DELETETOUXIANG,
	(params: any) => {
		return http
			.post({
				url: "resource_delete",
				params: {
					resource_id: params.id,
					res_type: "touxiang"
				}
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return { id: params.id };
				}
				return res;
			});
	}
);
//壁纸
export const addSourceBizhiAction = createAction(ADDBIZHI, (params: any) => {
	return http.post({
		url: "resource_add",
		params: {
			resource_obj: JSON.stringify({
				bizhi: params
			}),
			res_type: "bizhi"
		}
	});
});
export const getSourceBizhiListAction = createAction(
	GETBIZHILIST,
	(params: any) => {
		return http.post({
			url: "resource_list",
			params: {
				...params,
				res_type: "bizhi"
			}
		});
	}
);
export const deleteSourceBizhiAction = createAction(
	DELETEBIZHI,
	(params: any) => {
		return http
			.post({
				url: "resource_delete",
				params: {
					resource_id: params.id,
					res_type: "bizhi"
				}
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return { id: params.id };
				}
				return res;
			});
	}
);
//说说
export const addSourceShuoshuoAction = createAction(
	ADDSHUOSHUO,
	(params: any) => {
		return http.post({
			url: "resource_add",
			params: {
				resource_obj: JSON.stringify({
					shuoshuo: params
				}),
				res_type: "shuoshuo"
			}
		});
	}
);
export const getSourceShuoshuoListAction = createAction(
	GETSHUOSHUOLIST,
	(params: any) => {
		return http.post({
			url: "resource_list",
			params: {
				...params,
				res_type: "shuoshuo"
			}
		});
	}
);
export const deleteSourceShuoshuoAction = createAction(
	DELETESHUOSHUO,
	(params: any) => {
		console.log(params);
		return http
			.post({
				url: "resource_delete",
				params: {
					resource_id: params.id,
					res_type: "shuoshuo"
				}
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return { id: params.id };
				}
				return res;
			});
	}
);
export const getSourceShuoshuoDetailAction = createAction(
	GETSHUOSHUODETAIL,
	(params: any) => {
		return http.post({
			url: "resource_one",
			params: {
				resource_id: params.id,
				res_type: "shuoshuo"
			}
		});
	}
);
export const examineSourceShuoshuoAction = createAction(
	EXAMINE,
	(params: any) => {
		return http
			.post({
				url: "resourcepyqexamine",
				params
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return {
						...res,
						data: {
							id: params.resource_pyq_id
						}
					};
				}
				return res;
			});
	}
);
export const getScriptListAction = createAction(
	GETSCRIPTLIST,
	(params: any) => {
		return http.post({
			url: "insidescripts",
			params
		});
	}
);
export const addScriptAction = createAction(ADDSCRIPT, (params: any) => {
	return http.post({
		url: "addorupdateinsidescript",
		params
	});
});
export const deleteScriptAction = createAction(DELETESCRIPT, (params: any) => {
	return http
		.post({
			url: "deleteinsidescript",
			params
		})
		.then((res: any) => {
			if (res && res.code == 200) {
				return {
					...res,
					data: {
						id: params.insidescriptid
					}
				};
			}
			return res;
		});
});
// 创建或更新推广剧本
export const addExtensionScriptAction = createAction(
	ADDEXTENSIONSCRIPT,
	(params: any) => {
		return http.post({
			url: "createorupdateextensionscript",
			params
		});
	}
);
// 获取推广剧本
export const getExtensionScriptAction = createAction(
	GETEXTENSIONSCRIPT,
	(params: any) => {
		return http.post({
			url: "extensionScripts",
			params
		});
	}
);
// 删除推广剧本
export const deleteExtensionScriptAction = createAction(
	DELETEEXTENSIONSCRIPT,
	(params: any) => {
		return http
			.post({
				url: "deleteextensionscript",
				params
			})
			.then((res: any) => {
				if (res && res.code == 200) {
					return {
						...res,
						data: {
							id: params.extensionscriptid
						}
					};
				}
				return res;
			});
	}
);
// // 设置推广剧本适用的账户
// export const setAccountExtensionScriptAction = createAction(
// 	SETACCOUNTEXTENSION,
// 	(params: any) => {
// 		return http.post({
// 			url: "setaccountapplyextensionscript",
// 			params
// 		});
// 	}
// );
