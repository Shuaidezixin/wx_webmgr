import * as UserInfoAction from "./userinfo/action";
import * as FigureAction from "./figure/action";
import * as BaseDataAction from "./basedata/action";
import * as HomeAction from "./home/action";
import * as AccountAction from "./account/action";
import * as LogsAction from "./logs/action";
import * as TaskAction from "./task/action";
import * as SourceAction from "./source/action";
import * as MessageAction from "./message/action";
import * as ManagerAction from "./manager/action";
import * as SettingAction from "./setting/action";
import * as AnalysisAction from "./analysis/action";
import * as DownloadAction from "./download/action";
import * as ScreenAction from "./screen/action";
import * as CertificateAction from "./certificate/action";
import * as CharacterAction from "./character/action";
import * as DataCensusAction from "./datacensus/action";
//analysis
export default {
	...UserInfoAction,
	...FigureAction,
	...BaseDataAction,
	...HomeAction,
	...AccountAction,
	...LogsAction,
	...TaskAction,
	...SourceAction,
	...MessageAction,
	...ManagerAction,
	...SettingAction,
	...AnalysisAction,
	...DownloadAction,
	...ScreenAction,
	...CertificateAction,
	...CharacterAction,
	...DataCensusAction
};
