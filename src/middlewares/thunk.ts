//{ dispatch, getState }
export default function thunkMiddleware(params: any) {
	return (next: any) => (action: any) => {
		if (typeof action === "function") {
			return action(params.dispatch, params.getState);
		}
		// Compatible with redux action
		if (typeof action.payload === "function") {
			return action.payload(params.dispatch, params.getState);
		}
		return next(action);
	};
}
