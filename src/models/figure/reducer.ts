import { ADD, GETDETAIL, GETLIST, DELETE } from "./types";
import { handleActions } from "redux-actions";
const defaultState: any = null;

export const figureList = handleActions(
	{
		[GETLIST]: (state, { payload }) => {
			return { ...payload };
		},
		[DELETE]: (state, { payload }) => {
			let list = state.figures;
			let newList = list.filter((item: any, idx: any) => {
				if (item.figure_id != payload) {
					return item;
				}
			});
			return { ...state, figures: [...newList] };
		}
	},
	defaultState
);

export const addFigure = handleActions(
	{
		[ADD]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
export const figureDetail = handleActions(
	{
		[GETDETAIL]: (state, { payload }) => {
			return { ...payload };
		}
	},
	defaultState
);
