import {
	ACCOUNTEXECUTELIST,
	ACCOUNTTASKINFO,
	ACCOUNTSINGLECHECK,
	ACCOUNTALLCHECK,
	TASKEXECUTELIST,
	TASKSINGLECHECK,
	TASKALLCHECK,
	TASKEXECLISTINFO, //任务->队列 列表数据
	TASKINFOSINGLECHECK, //任务->队列->单选
	TASKINFOALLCHECK //任务->队列->全选
} from "./types";
import { handleActions } from "redux-actions";
const defaultState: any = null;

// 账号执行列表
export const accountExecuteList = handleActions(
	{
		[ACCOUNTEXECUTELIST]: (state, { payload }) => {
			if (payload && payload.accounts) {
				payload.accounts.map((item: any) => {
					item.isChecked = false;
				});
			}
			return { ...payload };
		},
		// 单选
		[ACCOUNTSINGLECHECK]: (state, { payload }) => {
			let list = state.accounts;
			if (list) {
				list.map((item: any) => {
					if (item._id == payload.id) {
						item.isChecked = !item.isChecked;
					}
				});
			}
			return { ...state, accounts: [...list] };
		},
		// 全选
		[ACCOUNTALLCHECK]: (state, { payload }) => {
			let list = state.accounts;
			if (list) {
				list.map((item: any) => {
					item.isChecked = payload.type;
				});
			}
			return { ...state, accounts: [...list] };
		}
	},
	defaultState
);

// 账户->详情信息
export const accountTaskInfoList = handleActions(
	{
		[ACCOUNTTASKINFO]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);

// 任务执行列表
export const taskExecuteList = handleActions(
	{
		[TASKEXECUTELIST]: (state, { payload }) => {
			if (payload && payload.tasks) {
				payload.tasks.map((item: any) => {
					item.isChecked = false;
				});
			}
			return { ...payload };
		},
		[TASKSINGLECHECK]: (state, { payload }) => {
			let list = state.tasks;
			if (list) {
				list.map((item: any) => {
					if (item.task_id == payload.id) {
						item.isChecked = !item.isChecked;
					}
				});
			}
			return { ...state, tasks: [...list] };
		},
		[TASKALLCHECK]: (state, { payload }) => {
			let list = state.tasks;
			if (list) {
				list.map((item: any) => {
					item.isChecked = payload.type;
				});
			}
			return { ...state, tasks: [...list] };
		}
	},
	defaultState
);

// 任务->队列->数据列表
export const TaskExecInfoList = handleActions(
	{
		[TASKEXECLISTINFO]: (state, { payload }) => {
			if (payload && payload.tasks) {
				payload.tasks.map((item: any) => {
					item.isChecked = false;
				});
			}
			return { ...payload };
		},
		[TASKINFOSINGLECHECK]: (state, { payload }) => {
			let list = state.tasks;
			if (list) {
				list.map((item: any) => {
					if (item._id == payload.id) {
						item.isChecked = !item.isChecked;
					}
				});
			}
			return { ...state, tasks: [...list] };
		},
		[TASKINFOALLCHECK]: (state, { payload }) => {
			let list = state.tasks;
			if (list) {
				list.map((item: any) => {
					item.isChecked = payload.type;
				});
			}
			return { ...state, tasks: [...list] };
		}
	},
	defaultState
);
