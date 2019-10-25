import { isFSA } from "flux-standard-action";

function isPromise(obj: any) {
	return (
		!!obj &&
		(typeof obj === "object" || typeof obj === "function") &&
		typeof obj.then === "function"
	);
}

export default function promiseMiddleware({ dispatch }: any) {
	return (next: any) => {
		return (action: any) => {
			if (!isFSA(action)) {
				return isPromise(action) ? action.then(dispatch) : next(action);
			}

			const promise: any = action.payload;

			if (!isPromise(promise)) return next(action);
			Promise.resolve(promise)
				.then((res: any) => {
					return next({
						...action,
						payload: res && res.code == 200 ? res.data : res
					});
				})
				.catch((e: any) => {
					console.info(e);
				});

			return promise;
		};
	};
}
