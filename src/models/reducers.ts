import { combineReducers } from "redux";
import * as UserInfoReducer from "./userinfo/reducer";
import * as FigureReducer from "./figure/reducer";
import * as BaseDataReducer from "./basedata/reducer";
import * as HomeReducer from "./home/reducer";
import * as AccountReducer from "./account/reducer";
import * as LogsReducer from "./logs/reducer";
import * as TaskReducer from "./task/reducer";
import * as SourceReducer from "./source/reducer";
import * as MessageReducer from "./message/reducer";
import * as ManagerReducer from "./manager/reducer";
import * as SettingReducer from "./setting/reducer";
import * as AnalysisReducer from "./analysis/reducer";
import * as DownloadReducer from "./download/reducer";
import * as ScreenReducer from "./screen/reducer";
import * as CertificateReducer from "./certificate/reducer";
import * as CharacterReducer from "./character/reducer";
import * as DataCensusReducer from "./datacensus/reducer";
//analysis
const reducers = combineReducers({
	...UserInfoReducer,
	...FigureReducer,
	...BaseDataReducer,
	...HomeReducer,
	...AccountReducer,
	...LogsReducer,
	...TaskReducer,
	...SourceReducer,
	...MessageReducer,
	...ManagerReducer,
	...SettingReducer,
	...AnalysisReducer,
	...DownloadReducer,
	...ScreenReducer,
	...CertificateReducer,
	...CharacterReducer,
	...DataCensusReducer
});
export default reducers;
