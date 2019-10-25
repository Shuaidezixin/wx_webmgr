import {
	ACCOUNTEXECUTELIST, //账号->列表数据
	ACCOUNTTASKINFO, //账号->详情
	ACCOUNTSINGLECHECK, //账号->单选
	ACCOUNTALLCHECK, //账号->全选
	BATCHREMOVETASK, //账号->批量删除
	TASKEXECUTELIST, //任务->列表数据
	TASKSINGLECHECK, //任务->单选
	TASKALLCHECK, //任务->全选
	TASKEXECLISTINFO, //任务->队列 列表数据
	TASKINFOSINGLECHECK, //任务->队列->单选
	TASKINFOALLCHECK, //任务->队列->全选
	REMOVETASKBYTYPE //任务->队列->删除该任务按钮
} from "./types";

import { createAction } from "redux-actions";
import http from "../../utils/ajax";

// 账户执行列表
export const getAccountExecuteListAction = createAction(
	ACCOUNTEXECUTELIST,
	(params: any) => {
		return http.post({
			url: "accountexecutelist",
			params
		});
	}
);
// 账户->任务详情
export const getAccountTaskInfoAction = createAction(
	ACCOUNTTASKINFO,
	(params: any) => {
		return http.post({
			url: "accounttaskinfo",
			params
		});
	}
);
// 账户->单选
export const singleCheckDataCensusAction = createAction(
	ACCOUNTSINGLECHECK,
	(params: any) => {
		return params;
	}
);
// 账户->全选
export const allCheckDataCensusAction = createAction(
	ACCOUNTALLCHECK,
	(params: any) => {
		return params;
	}
);
// 账户->批量删除
export const batchRemoveTaskAction = createAction(
	BATCHREMOVETASK,
	(params: any) => {
		return http.post({
			url: "batchremovetask",
			params
		});
	}
);

// 任务执行列表
export const getTaskExecuteListAction = createAction(
	TASKEXECUTELIST,
	(params: any) => {
		return http.post({
			url: "taskexeclist",
			params
		});
	}
);
// 任务->单选
export const singleCheckTaskAction = createAction(
	TASKSINGLECHECK,
	(params: any) => {
		return params;
	}
);
// 任务->全选
export const allCheckTaskAction = createAction(TASKALLCHECK, (params: any) => {
	return params;
});

// //任务->队列
export const getTaskExecuteInfoAction = createAction(
	TASKEXECLISTINFO,
	(params: any) => {
		return http.post({
			url: "taskexeclistinfo",
			params
		});
	}
);
// //任务->队列->单选
export const singleCheckTaskQueueAction = createAction(
	TASKINFOSINGLECHECK,
	(params: any) => {
		return params;
	}
);
// //任务->队列->全选
export const allCheckTaskQueueAction = createAction(
	TASKINFOALLCHECK,
	(params: any) => {
		return params;
	}
);
// //任务->队列->删除该任务按钮
export const removeTaskByTypeAction = createAction(
	REMOVETASKBYTYPE,
	(params: any) => {
		return http.post({
			url: "removetaskbytype",
			params
		});
	}
);
