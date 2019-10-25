import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "./middlewares/thunk";
import promiseMiddleware from "./middlewares/promise";
import reduces from "./models/reducers";
const middlewareList = [promiseMiddleware, thunkMiddleware];

let store: any;

if (window && window.__REDUX_DEVTOOLS_EXTENSION__) {
	store = (): any => {
		return createStore(
			reduces,
			compose(
				applyMiddleware(promiseMiddleware, thunkMiddleware),
				window.__REDUX_DEVTOOLS_EXTENSION__ &&
					window.__REDUX_DEVTOOLS_EXTENSION__()
			)
		);
	};
} else {
	store = (): any => {
		return createStore(reduces, applyMiddleware(...middlewareList));
	};
}

export default store;
