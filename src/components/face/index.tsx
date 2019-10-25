/**
 * 	公共组件：
 *    表情选择
 */
import * as React from "react";
import { Popover, Icon } from "antd";
import "./index.less";
import emoji from "@img/emoji.png";
import qqface from "@img/qqface.png";

interface Props {
	onClick?: Function;
}
interface State {
	isShow: boolean;
}
// const word = [
// 	"微笑",
// 	"撇嘴",
// 	"色",
// 	"发呆",
// 	"得意",
// 	"流泪",
// 	"害羞",
// 	"闭嘴",
// 	"睡",
// 	"大哭",
// 	"尴尬",
// 	"发怒",
// 	"调皮",
// 	"龇牙",
// 	"惊讶",
// 	"难过",
// 	"酷",
// 	"冷汗",
// 	"抓狂",
// 	"吐",
// 	"偷笑",
// 	"可爱",
// 	"白眼",
// 	"傲慢",
// 	"饥饿",
// 	"困",
// 	"惊恐",
// 	"流汗",
// 	"憨笑",
// 	"大兵",
// 	"奋斗",
// 	"咒骂",
// 	"疑问",
// 	"嘘",
// 	"晕",
// 	"折磨",
// 	"衰",
// 	"骷髅",
// 	"敲打",
// 	"再见",
// 	"擦汗",
// 	"抠鼻",
// 	"鼓掌",
// 	"糗大了",
// 	"坏笑",
// 	"左哼哼",
// 	"右哼哼",
// 	"哈欠",
// 	"鄙视",
// 	"委屈",
// 	"快哭了",
// 	"阴险",
// 	"亲亲",
// 	"吓",
// 	"可怜",
// 	"菜刀",
// 	"西瓜",
// 	"啤酒",
// 	"篮球",
// 	"乒乓",
// 	"咖啡",
// 	"饭",
// 	"猪头",
// 	"玫瑰",
// 	"凋谢",
// 	"示爱",
// 	"爱心",
// 	"心碎",
// 	"蛋糕",
// 	"闪电",
// 	"炸弹",
// 	"刀",
// 	"足球",
// 	"瓢虫",
// 	"便便",
// 	"月亮",
// 	"太阳",
// 	"礼物",
// 	"拥抱",
// 	"强",
// 	"弱",
// 	"握手",
// 	"胜利",
// 	"抱拳",
// 	"勾引",
// 	"拳头",
// 	"差劲",
// 	"爱你",
// 	"不是",
// 	"好的",
// 	"爱情",
// 	"飞吻",
// 	"跳跳",
// 	"发抖",
// 	"怄火",
// 	"转圈",
// 	"磕头",
// 	"回头",
// 	"跳绳",
// 	"挥手",
// 	"激动",
// 	"街舞",
// 	"献吻",
// 	"左太极",
// 	"右太极"
// ];
//const word=["微笑","撇嘴","色","发呆","得意","流泪","害羞","闭嘴","睡","大哭","尴尬","发怒","调皮","呲牙","惊讶","难过","酷","冷汗","抓狂","吐","偷笑","愉快","白眼","傲慢","饥饿","困","惊恐","流汗","憨笑","悠闲","奋斗","咒骂","疑问","嘘","晕","疯了","衰","骷髅","敲打","再见","擦汗","抠鼻","鼓掌","糗大了","坏笑","左哼哼","右哼哼","哈欠","鄙视","委屈","快哭了","阴险","亲亲","吓","可怜","菜刀","西瓜","啤酒","篮球","乒乓","咖啡","饭","猪头","玫瑰","凋谢","嘴唇","爱心","心碎","蛋糕","闪电","炸弹","刀","足球","瓢虫","便便","月亮","太阳","礼物","拥抱","强","弱","握手","胜利","抱拳","勾引","拳头","差劲","爱你","NO","OK","爱情","飞吻","跳跳","发抖","怄火","转圈","磕头","回头","跳绳","投降","激动","乱舞","献吻","左太极","右太极","笑脸","生病","破涕为笑","吐舌","脸红","恐惧","失望","无语","嘿哈","捂脸","奸笑","机智","皱眉","耶","鬼魂","合十","强壮","庆祝","礼物","红包","鸡","开心","大笑","热情","眨眼","色","接吻","亲吻","露齿笑","满意","戏弄","得意","汗","低落","呸","焦虑","担心","震惊","悔恨","眼泪","哭","晕","心烦","生气","睡觉","恶魔","外星人","心","心碎","丘比特","闪烁","星星","叹号","问号","睡着","水滴","音乐","火","便便","强","弱","拳头","胜利","上","下","右","左","第一","吻","热恋","男孩","女孩","女士","男士","天使","骷髅","红唇","太阳","下雨","多云","雪人","月亮","闪电","海浪","猫","小狗","老鼠","仓鼠","兔子","狗","青蛙","老虎","考拉","熊","猪","牛","野猪","猴子","马","蛇","鸽子","鸡","企鹅","毛虫","章鱼","鱼","鲸鱼","海豚","玫瑰","花","棕榈树","仙人掌","礼盒","南瓜灯","圣诞老人","圣诞树","铃","气球","CD","相机","录像机","电脑","电视","电话","解锁","锁","钥匙","成交","灯泡","邮箱","浴缸","钱","炸弹","手枪","药丸","橄榄球","篮球","足球","棒球","高尔夫","奖杯","入侵者","唱歌","吉他","比基尼","皇冠","雨伞","手提包","口红","戒指","钻石","咖啡","啤酒","干杯","鸡尾酒","汉堡","薯条","意面","寿司","面条","煎蛋","冰激凌","蛋糕","苹果","飞机","火箭","自行车","高铁","警告","旗","男人","女人","O","X","版权","注册商标","商标"];
const word=["微笑","撇嘴","色","发呆","得意","流泪","害羞","闭嘴","睡","大哭","尴尬","发怒","调皮","呲牙","惊讶","难过","酷","冷汗","抓狂","吐","偷笑","愉快",
"白眼","傲慢","饥饿","困","惊恐","流汗","憨笑","悠闲","奋斗","咒骂","疑问","嘘","晕","疯了","衰","骷髅","敲打","再见","擦汗","抠鼻","鼓掌","糗大了","坏笑","左哼哼",
"右哼哼","哈欠","鄙视","委屈","快哭了","阴险","亲亲","吓","可怜","菜刀","西瓜","啤酒","篮球","乒乓","咖啡","饭","猪头","玫瑰","凋谢","嘴唇","爱心","心碎","蛋糕","闪电",
"炸弹","刀","足球","瓢虫","便便","月亮","太阳","礼物","拥抱","强","弱","握手","胜利","抱拳","勾引","拳头","差劲","爱你","NO","OK","爱情","飞吻","跳跳","发抖","怄火","转圈",
"磕头","回头","跳绳","投降","激动","乱舞","献吻","左太极","右太极",
"1f604","1f637","1f602", "1f61d", "1f633","1f631","1f614","1f612","嘿哈","捂脸","奸笑","机智","皱眉","耶","1f47b","1f64f","1f4aa","1f389","1f381","红包",'鸡',"1f60a", "1f603", "263a", "1f609", "1f60d", "1f618", "1f61a", "1f601","1f60c","1f61c",
"1f60f", "1f613", "1f61e", "1f616","1f625", "1f630", "1f628", "1f623", "1f622", "1f62d", "1f635", "1f620",
"1f621", "1f62a", "1f47f", "1f47d", "2764", "1f494", "1f498",
"2728", "1f31f", "2755", "2754", "1f4a4", "1f4a6", "1f3b5", "1f525", "1f4a9",
"1f44d", "1f44e", "1f44a", "270c", "1f446", "1f447", "1f449", "1f448", "261d",
"1f48f", "1f491", "1f466", "1f467",
"1f469","1f468","1f47c","1f480","1f48b","2600","2614","2601","26c4","1f319","26a1","1f30a","1f431","1f436","1f42d","1f439","1f430","1f43a","1f438",
"1f42f","1f428","1f43b","1f437","1f42e","1f417","1f435","1f434","1f40d","1f426","1f414","1f427","1f41b","1f419","1f420","1f433","1f42c","1f339",
"1f33a","1f334","1f335","1f49d","1f383","1f385","1f384","1f514","1f388","1f4bf","1f4f7","1f3a5","1f4bb","1f4fa","260e","1f513","1f512","1f511","1f528",
"1f4a1","1f4eb","1f6c0","1f4b0","1f4a3","1f52b","1f48a","1f3c8","1f3c0","26bd","26be","26f3","1f3c6","1f47e","1f3a4","1f3b8","1f459","1f451",
"1f302","1f45c","1f484","1f48d","1f48e","2615","1f37a","1f37b","1f378","1f354","1f35f","1f35d","1f363","1f35c",
"1f373","1f366","1f382","1f34e","2708","1f680","1f6b2","1f684","26a0","1f3c1","1f6b9","1f6ba","2b55","274c","a9","ae","2122"
];

const faceData=[{"title":"微笑","backgroundImage":"qqface","backgroundPosition":"0px 0px"},{"title":"撇嘴","backgroundImage":"qqface","backgroundPosition":"-29px 0px"},{"title":"色","backgroundImage":"qqface","backgroundPosition":"-58px 0px"},{"title":"发呆","backgroundImage":"qqface","backgroundPosition":"-87px 0px"},{"title":"得意","backgroundImage":"qqface","backgroundPosition":"-116px 0px"},{"title":"流泪","backgroundImage":"qqface","backgroundPosition":"-145px 0px"},{"title":"害羞","backgroundImage":"qqface","backgroundPosition":"-174px 0px"},{"title":"闭嘴","backgroundImage":"qqface","backgroundPosition":"-203px 0px"},{"title":"睡","backgroundImage":"qqface","backgroundPosition":"-232px 0px"},{"title":"大哭","backgroundImage":"qqface","backgroundPosition":"-261px 0px"},{"title":"尴尬","backgroundImage":"qqface","backgroundPosition":"-290px 0px"},{"title":"发怒","backgroundImage":"qqface","backgroundPosition":"-319px 0px"},{"title":"调皮","backgroundImage":"qqface","backgroundPosition":"-348px 0px"},{"title":"呲牙","backgroundImage":"qqface","backgroundPosition":"-377px 0px"},{"title":"惊讶","backgroundImage":"qqface","backgroundPosition":"-406px 0px"},{"title":"难过","backgroundImage":"qqface","backgroundPosition":"0px -29px"},{"title":"酷","backgroundImage":"qqface","backgroundPosition":"-29px -29px"},{"title":"冷汗","backgroundImage":"qqface","backgroundPosition":"-58px -29px"},{"title":"抓狂","backgroundImage":"qqface","backgroundPosition":"-87px -29px"},{"title":"吐","backgroundImage":"qqface","backgroundPosition":"-116px -29px"},{"title":"偷笑","backgroundImage":"qqface","backgroundPosition":"-145px -29px"},{"title":"愉快","backgroundImage":"qqface","backgroundPosition":"-174px -29px"},{"title":"白眼","backgroundImage":"qqface","backgroundPosition":"-203px -29px"},{"title":"傲慢","backgroundImage":"qqface","backgroundPosition":"-232px -29px"},{"title":"饥饿","backgroundImage":"qqface","backgroundPosition":"-261px -29px"},{"title":"困","backgroundImage":"qqface","backgroundPosition":"-290px -29px"},{"title":"惊恐","backgroundImage":"qqface","backgroundPosition":"-319px -29px"},{"title":"流汗","backgroundImage":"qqface","backgroundPosition":"-348px -29px"},{"title":"憨笑","backgroundImage":"qqface","backgroundPosition":"-377px -29px"},{"title":"悠闲","backgroundImage":"qqface","backgroundPosition":"-406px -29px"},{"title":"奋斗","backgroundImage":"qqface","backgroundPosition":"0px -58px"},{"title":"咒骂","backgroundImage":"qqface","backgroundPosition":"-29px -58px"},{"title":"疑问","backgroundImage":"qqface","backgroundPosition":"-58px -58px"},{"title":"嘘","backgroundImage":"qqface","backgroundPosition":"-87px -58px"},{"title":"晕","backgroundImage":"qqface","backgroundPosition":"-116px -58px"},{"title":"疯了","backgroundImage":"qqface","backgroundPosition":"-145px -58px"},{"title":"衰","backgroundImage":"qqface","backgroundPosition":"-174px -58px"},{"title":"骷髅","backgroundImage":"qqface","backgroundPosition":"-203px -58px"},{"title":"敲打","backgroundImage":"qqface","backgroundPosition":"-232px -58px"},{"title":"再见","backgroundImage":"qqface","backgroundPosition":"-261px -58px"},{"title":"擦汗","backgroundImage":"qqface","backgroundPosition":"-290px -58px"},{"title":"抠鼻","backgroundImage":"qqface","backgroundPosition":"-319px -58px"},{"title":"鼓掌","backgroundImage":"qqface","backgroundPosition":"-348px -58px"},{"title":"糗大了","backgroundImage":"qqface","backgroundPosition":"-377px -58px"},{"title":"坏笑","backgroundImage":"qqface","backgroundPosition":"-406px -58px"},{"title":"左哼哼","backgroundImage":"qqface","backgroundPosition":"0px -87px"},{"title":"右哼哼","backgroundImage":"qqface","backgroundPosition":"-29px -87px"},{"title":"哈欠","backgroundImage":"qqface","backgroundPosition":"-58px -87px"},{"title":"鄙视","backgroundImage":"qqface","backgroundPosition":"-87px -87px"},{"title":"委屈","backgroundImage":"qqface","backgroundPosition":"-116px -87px"},{"title":"快哭了","backgroundImage":"qqface","backgroundPosition":"-145px -87px"},{"title":"阴险","backgroundImage":"qqface","backgroundPosition":"-174px -87px"},{"title":"亲亲","backgroundImage":"qqface","backgroundPosition":"-203px -87px"},{"title":"吓","backgroundImage":"qqface","backgroundPosition":"-232px -87px"},{"title":"可怜","backgroundImage":"qqface","backgroundPosition":"-261px -87px"},{"title":"菜刀","backgroundImage":"qqface","backgroundPosition":"-290px -87px"},{"title":"西瓜","backgroundImage":"qqface","backgroundPosition":"-319px -87px"},{"title":"啤酒","backgroundImage":"qqface","backgroundPosition":"-348px -87px"},{"title":"篮球","backgroundImage":"qqface","backgroundPosition":"-377px -87px"},{"title":"乒乓","backgroundImage":"qqface","backgroundPosition":"-406px -87px"},{"title":"咖啡","backgroundImage":"qqface","backgroundPosition":"0px -116px"},{"title":"饭","backgroundImage":"qqface","backgroundPosition":"-29px -116px"},{"title":"猪头","backgroundImage":"qqface","backgroundPosition":"-58px -116px"},{"title":"玫瑰","backgroundImage":"qqface","backgroundPosition":"-87px -116px"},{"title":"凋谢","backgroundImage":"qqface","backgroundPosition":"-116px -116px"},{"title":"嘴唇","backgroundImage":"qqface","backgroundPosition":"-145px -116px"},{"title":"爱心","backgroundImage":"qqface","backgroundPosition":"-174px -116px"},{"title":"心碎","backgroundImage":"qqface","backgroundPosition":"-203px -116px"},{"title":"蛋糕","backgroundImage":"qqface","backgroundPosition":"-232px -116px"},{"title":"闪电","backgroundImage":"qqface","backgroundPosition":"-261px -116px"},{"title":"炸弹","backgroundImage":"qqface","backgroundPosition":"-290px -116px"},{"title":"刀","backgroundImage":"qqface","backgroundPosition":"-319px -116px"},{"title":"足球","backgroundImage":"qqface","backgroundPosition":"-348px -116px"},{"title":"瓢虫","backgroundImage":"qqface","backgroundPosition":"-377px -116px"},{"title":"便便","backgroundImage":"qqface","backgroundPosition":"-406px -116px"},{"title":"月亮","backgroundImage":"qqface","backgroundPosition":"0px -145px"},{"title":"太阳","backgroundImage":"qqface","backgroundPosition":"-29px -145px"},{"title":"礼物","backgroundImage":"qqface","backgroundPosition":"-58px -145px"},{"title":"拥抱","backgroundImage":"qqface","backgroundPosition":"-87px -145px"},{"title":"强","backgroundImage":"qqface","backgroundPosition":"-116px -145px"},{"title":"弱","backgroundImage":"qqface","backgroundPosition":"-145px -145px"},{"title":"握手","backgroundImage":"qqface","backgroundPosition":"-174px -145px"},{"title":"胜利","backgroundImage":"qqface","backgroundPosition":"-203px -145px"},{"title":"抱拳","backgroundImage":"qqface","backgroundPosition":"-232px -145px"},{"title":"勾引","backgroundImage":"qqface","backgroundPosition":"-261px -145px"},{"title":"拳头","backgroundImage":"qqface","backgroundPosition":"-290px -145px"},{"title":"差劲","backgroundImage":"qqface","backgroundPosition":"-319px -145px"},{"title":"爱你","backgroundImage":"qqface","backgroundPosition":"-348px -145px"},{"title":"NO","backgroundImage":"qqface","backgroundPosition":"-377px -145px"},{"title":"OK","backgroundImage":"qqface","backgroundPosition":"-406px -145px"},{"title":"爱情","backgroundImage":"qqface","backgroundPosition":"0px -174px"},{"title":"飞吻","backgroundImage":"qqface","backgroundPosition":"-29px -174px"},{"title":"跳跳","backgroundImage":"qqface","backgroundPosition":"-58px -174px"},{"title":"发抖","backgroundImage":"qqface","backgroundPosition":"-87px -174px"},{"title":"怄火","backgroundImage":"qqface","backgroundPosition":"-116px -174px"},{"title":"转圈","backgroundImage":"qqface","backgroundPosition":"-145px -174px"},{"title":"磕头","backgroundImage":"qqface","backgroundPosition":"-174px -174px"},{"title":"回头","backgroundImage":"qqface","backgroundPosition":"-203px -174px"},{"title":"跳绳","backgroundImage":"qqface","backgroundPosition":"-232px -174px"},{"title":"投降","backgroundImage":"qqface","backgroundPosition":"-261px -174px"},{"title":"激动","backgroundImage":"qqface","backgroundPosition":"-290px -174px"},{"title":"乱舞","backgroundImage":"qqface","backgroundPosition":"-319px -174px"},{"title":"献吻","backgroundImage":"qqface","backgroundPosition":"-348px -174px"},{"title":"左太极","backgroundImage":"qqface","backgroundPosition":"-377px -174px"},{"title":"右太极","backgroundImage":"qqface","backgroundPosition":"-406px -174px"},{"title":"笑脸","backgroundImage":"emoji","backgroundPosition":"2px 2px"},{"title":"生病","backgroundImage":"emoji","backgroundPosition":"-30px 2px"},{"title":"破涕为笑","backgroundImage":"emoji","backgroundPosition":"-62px 2px"},{"title":"吐舌","backgroundImage":"emoji","backgroundPosition":"-94px 2px"},{"title":"脸红","backgroundImage":"emoji","backgroundPosition":"-126px 2px"},{"title":"恐惧","backgroundImage":"emoji","backgroundPosition":"-158px 2px"},{"title":"失望","backgroundImage":"emoji","backgroundPosition":"-190px 2px"},{"title":"无语","backgroundImage":"emoji","backgroundPosition":"-222px 2px"},{"title":"嘿哈","backgroundImage":"emoji","backgroundPosition":"-254px 2px"},{"title":"捂脸","backgroundImage":"emoji","backgroundPosition":"-286px 2px"},{"title":"奸笑","backgroundImage":"emoji","backgroundPosition":"-318px 2px"},{"title":"机智","backgroundImage":"emoji","backgroundPosition":"-350px 2px"},{"title":"皱眉","backgroundImage":"emoji","backgroundPosition":"-382px 2px"},{"title":"耶","backgroundImage":"emoji","backgroundPosition":"-414px 2px"},{"title":"鬼魂","backgroundImage":"emoji","backgroundPosition":"-446px 2px"},{"title":"合十","backgroundImage":"emoji","backgroundPosition":"2px -30px"},{"title":"强壮","backgroundImage":"emoji","backgroundPosition":"-30px -30px"},{"title":"庆祝","backgroundImage":"emoji","backgroundPosition":"-62px -30px"},{"title":"礼物","backgroundImage":"emoji","backgroundPosition":"-94px -30px"},{"title":"红包","backgroundImage":"emoji","backgroundPosition":"-126px -30px"},{"title":"鸡","backgroundImage":"emoji","backgroundPosition":"-158px -30px"},{"title":"开心","backgroundImage":"emoji","backgroundPosition":"-190px -30px"},{"title":"大笑","backgroundImage":"emoji","backgroundPosition":"-222px -30px"},
{"title":"热情","backgroundImage":"emoji","backgroundPosition":"-254px -30px"},{"title":"眨眼","backgroundImage":"emoji","backgroundPosition":"-286px -30px"},{"title":"色","backgroundImage":"emoji","backgroundPosition":"-318px -30px"},{"title":"接吻","backgroundImage":"emoji","backgroundPosition":"-350px -30px"},{"title":"亲吻","backgroundImage":"emoji","backgroundPosition":"-382px -30px"},{"title":"露齿笑","backgroundImage":"emoji","backgroundPosition":"-414px -30px"},{"title":"满意","backgroundImage":"emoji","backgroundPosition":"-446px -30px"},{"title":"戏弄","backgroundImage":"emoji","backgroundPosition":"2px -62px"},{"title":"得意","backgroundImage":"emoji","backgroundPosition":"-30px -62px"},{"title":"汗","backgroundImage":"emoji","backgroundPosition":"-62px -62px"},{"title":"低落","backgroundImage":"emoji","backgroundPosition":"-94px -62px"},{"title":"呸","backgroundImage":"emoji","backgroundPosition":"-126px -62px"},{"title":"焦虑","backgroundImage":"emoji","backgroundPosition":"-158px -62px"},{"title":"担心","backgroundImage":"emoji","backgroundPosition":"-190px -62px"},{"title":"震惊","backgroundImage":"emoji","backgroundPosition":"-222px -62px"},{"title":"悔恨","backgroundImage":"emoji","backgroundPosition":"-254px -62px"},{"title":"眼泪","backgroundImage":"emoji","backgroundPosition":"-286px -62px"},{"title":"哭","backgroundImage":"emoji","backgroundPosition":"-318px -62px"},{"title":"晕","backgroundImage":"emoji","backgroundPosition":"-350px -62px"},{"title":"心烦","backgroundImage":"emoji","backgroundPosition":"-382px -62px"},{"title":"生气","backgroundImage":"emoji","backgroundPosition":"-414px -62px"},{"title":"睡觉","backgroundImage":"emoji","backgroundPosition":"-446px -62px"},{"title":"恶魔","backgroundImage":"emoji","backgroundPosition":"2px -94px"},{"title":"外星人","backgroundImage":"emoji","backgroundPosition":"-30px -94px"},{"title":"心","backgroundImage":"emoji","backgroundPosition":"-62px -94px"},{"title":"心碎","backgroundImage":"emoji","backgroundPosition":"-94px -94px"},{"title":"丘比特","backgroundImage":"emoji","backgroundPosition":"-126px -94px"},{"title":"闪烁","backgroundImage":"emoji","backgroundPosition":"-158px -94px"},{"title":"星星","backgroundImage":"emoji","backgroundPosition":"-190px -94px"},{"title":"叹号","backgroundImage":"emoji","backgroundPosition":"-222px -94px"},{"title":"问号","backgroundImage":"emoji","backgroundPosition":"-254px -94px"},{"title":"睡着","backgroundImage":"emoji","backgroundPosition":"-286px -94px"},{"title":"水滴","backgroundImage":"emoji","backgroundPosition":"-318px -94px"},{"title":"音乐","backgroundImage":"emoji","backgroundPosition":"-350px -94px"},{"title":"火","backgroundImage":"emoji","backgroundPosition":"-382px -94px"},{"title":"便便","backgroundImage":"emoji","backgroundPosition":"-414px -94px"},{"title":"强","backgroundImage":"emoji","backgroundPosition":"-446px -94px"},{"title":"弱","backgroundImage":"emoji","backgroundPosition":"2px -126px"},{"title":"拳头","backgroundImage":"emoji","backgroundPosition":"-30px -126px"},{"title":"胜利","backgroundImage":"emoji","backgroundPosition":"-62px -126px"},{"title":"上","backgroundImage":"emoji","backgroundPosition":"-94px -126px"},{"title":"下","backgroundImage":"emoji","backgroundPosition":"-126px -126px"},{"title":"右","backgroundImage":"emoji","backgroundPosition":"-158px -126px"},{"title":"左","backgroundImage":"emoji","backgroundPosition":"-190px -126px"},{"title":"第一","backgroundImage":"emoji","backgroundPosition":"-222px -126px"},{"title":"吻","backgroundImage":"emoji","backgroundPosition":"-254px -126px"},{"title":"热恋","backgroundImage":"emoji","backgroundPosition":"-286px -126px"},{"title":"男孩","backgroundImage":"emoji","backgroundPosition":"-318px -126px"},{"title":"女孩","backgroundImage":"emoji","backgroundPosition":"-350px -126px"},{"title":"女士","backgroundImage":"emoji","backgroundPosition":"-382px -126px"},{"title":"男士","backgroundImage":"emoji","backgroundPosition":"-414px -126px"},{"title":"天使","backgroundImage":"emoji","backgroundPosition":"-446px -126px"},{"title":"骷髅","backgroundImage":"emoji","backgroundPosition":"2px -158px"},{"title":"红唇","backgroundImage":"emoji","backgroundPosition":"-30px -158px"},{"title":"太阳","backgroundImage":"emoji","backgroundPosition":"-62px -158px"},{"title":"下雨","backgroundImage":"emoji","backgroundPosition":"-94px -158px"},{"title":"多云","backgroundImage":"emoji","backgroundPosition":"-126px -158px"},{"title":"雪人","backgroundImage":"emoji","backgroundPosition":"-158px -158px"},{"title":"月亮","backgroundImage":"emoji","backgroundPosition":"-190px -158px"},{"title":"闪电","backgroundImage":"emoji","backgroundPosition":"-222px -158px"},{"title":"海浪","backgroundImage":"emoji","backgroundPosition":"-254px -158px"},{"title":"猫","backgroundImage":"emoji","backgroundPosition":"-286px -158px"},{"title":"小狗","backgroundImage":"emoji","backgroundPosition":"-318px -158px"},{"title":"老鼠","backgroundImage":"emoji","backgroundPosition":"-350px -158px"},{"title":"仓鼠","backgroundImage":"emoji","backgroundPosition":"-382px -158px"},{"title":"兔子","backgroundImage":"emoji","backgroundPosition":"-414px -158px"},{"title":"狗","backgroundImage":"emoji","backgroundPosition":"-446px -158px"},{"title":"青蛙","backgroundImage":"emoji","backgroundPosition":"2px -190px"},{"title":"老虎","backgroundImage":"emoji","backgroundPosition":"-30px -190px"},{"title":"考拉","backgroundImage":"emoji","backgroundPosition":"-62px -190px"},{"title":"熊","backgroundImage":"emoji","backgroundPosition":"-94px -190px"},{"title":"猪","backgroundImage":"emoji","backgroundPosition":"-126px -190px"},{"title":"牛","backgroundImage":"emoji","backgroundPosition":"-158px -190px"},{"title":"野猪","backgroundImage":"emoji","backgroundPosition":"-190px -190px"},{"title":"猴子","backgroundImage":"emoji","backgroundPosition":"-222px -190px"},{"title":"马","backgroundImage":"emoji","backgroundPosition":"-254px -190px"},{"title":"蛇","backgroundImage":"emoji","backgroundPosition":"-286px -190px"},{"title":"鸽子","backgroundImage":"emoji","backgroundPosition":"-318px -190px"},{"title":"鸡","backgroundImage":"emoji","backgroundPosition":"-350px -190px"},{"title":"企鹅","backgroundImage":"emoji","backgroundPosition":"-382px -190px"},{"title":"毛虫","backgroundImage":"emoji","backgroundPosition":"-414px -190px"},{"title":"章鱼","backgroundImage":"emoji","backgroundPosition":"-446px -190px"},{"title":"鱼","backgroundImage":"emoji","backgroundPosition":"2px -222px"},{"title":"鲸鱼","backgroundImage":"emoji","backgroundPosition":"-30px -222px"},{"title":"海豚","backgroundImage":"emoji","backgroundPosition":"-62px -222px"},{"title":"玫瑰","backgroundImage":"emoji","backgroundPosition":"-94px -222px"},{"title":"花","backgroundImage":"emoji","backgroundPosition":"-126px -222px"},{"title":"棕榈树","backgroundImage":"emoji","backgroundPosition":"-158px -222px"},{"title":"仙人掌","backgroundImage":"emoji","backgroundPosition":"-190px -222px"},{"title":"礼盒","backgroundImage":"emoji","backgroundPosition":"-222px -222px"},{"title":"南瓜灯","backgroundImage":"emoji","backgroundPosition":"-254px -222px"},{"title":"圣诞老人","backgroundImage":"emoji","backgroundPosition":"-286px -222px"},{"title":"圣诞树","backgroundImage":"emoji","backgroundPosition":"-318px -222px"},{"title":"铃","backgroundImage":"emoji","backgroundPosition":"-350px -222px"},{"title":"气球","backgroundImage":"emoji","backgroundPosition":"-382px -222px"},{"title":"CD","backgroundImage":"emoji","backgroundPosition":"-414px -222px"},{"title":"相机","backgroundImage":"emoji","backgroundPosition":"-446px -222px"},{"title":"录像机","backgroundImage":"emoji","backgroundPosition":"2px -254px"},{"title":"电脑","backgroundImage":"emoji","backgroundPosition":"-30px -254px"},{"title":"电视","backgroundImage":"emoji","backgroundPosition":"-62px -254px"},{"title":"电话","backgroundImage":"emoji","backgroundPosition":"-94px -254px"},{"title":"解锁","backgroundImage":"emoji","backgroundPosition":"-126px -254px"},{"title":"锁","backgroundImage":"emoji","backgroundPosition":"-158px -254px"},{"title":"钥匙","backgroundImage":"emoji","backgroundPosition":"-190px -254px"},{"title":"成交","backgroundImage":"emoji","backgroundPosition":"-222px -254px"},{"title":"灯泡","backgroundImage":"emoji","backgroundPosition":"-254px -254px"},{"title":"邮箱","backgroundImage":"emoji","backgroundPosition":"-286px -254px"},{"title":"浴缸","backgroundImage":"emoji","backgroundPosition":"-318px -254px"},{"title":"钱","backgroundImage":"emoji","backgroundPosition":"-350px -254px"},{"title":"炸弹","backgroundImage":"emoji","backgroundPosition":"-382px -254px"},{"title":"手枪","backgroundImage":"emoji","backgroundPosition":"-414px -254px"},{"title":"药丸","backgroundImage":"emoji","backgroundPosition":"-446px -254px"},{"title":"橄榄球","backgroundImage":"emoji","backgroundPosition":"2px -286px"},{"title":"篮球","backgroundImage":"emoji","backgroundPosition":"-30px -286px"},{"title":"足球","backgroundImage":"emoji","backgroundPosition":"-62px -286px"},{"title":"棒球","backgroundImage":"emoji","backgroundPosition":"-94px -286px"},{"title":"高尔夫","backgroundImage":"emoji","backgroundPosition":"-126px -286px"},{"title":"奖杯","backgroundImage":"emoji","backgroundPosition":"-158px -286px"},{"title":"入侵者","backgroundImage":"emoji","backgroundPosition":"-190px -286px"},{"title":"唱歌","backgroundImage":"emoji","backgroundPosition":"-222px -286px"},{"title":"吉他","backgroundImage":"emoji","backgroundPosition":"-254px -286px"},{"title":"比基尼","backgroundImage":"emoji","backgroundPosition":"-286px -286px"},{"title":"皇冠","backgroundImage":"emoji","backgroundPosition":"-318px -286px"},{"title":"雨伞","backgroundImage":"emoji","backgroundPosition":"-350px -286px"},{"title":"手提包","backgroundImage":"emoji","backgroundPosition":"-382px -286px"},{"title":"口红","backgroundImage":"emoji","backgroundPosition":"-414px -286px"},{"title":"戒指","backgroundImage":"emoji","backgroundPosition":"-446px -286px"},{"title":"钻石","backgroundImage":"emoji","backgroundPosition":"2px -318px"},{"title":"咖啡","backgroundImage":"emoji","backgroundPosition":"-30px -318px"},
{"title":"啤酒","backgroundImage":"emoji","backgroundPosition":"-62px -318px"},{"title":"干杯","backgroundImage":"emoji","backgroundPosition":"-94px -318px"},{"title":"鸡尾酒","backgroundImage":"emoji","backgroundPosition":"-126px -318px"},{"title":"汉堡","backgroundImage":"emoji","backgroundPosition":"-158px -318px"},{"title":"薯条","backgroundImage":"emoji","backgroundPosition":"-190px -318px"},{"title":"意面","backgroundImage":"emoji","backgroundPosition":"-222px -318px"},{"title":"寿司","backgroundImage":"emoji","backgroundPosition":"-254px -318px"},{"title":"面条","backgroundImage":"emoji","backgroundPosition":"-286px -318px"},{"title":"煎蛋","backgroundImage":"emoji","backgroundPosition":"-318px -318px"},{"title":"冰激凌","backgroundImage":"emoji","backgroundPosition":"-350px -318px"},{"title":"蛋糕","backgroundImage":"emoji","backgroundPosition":"-382px -318px"},{"title":"苹果","backgroundImage":"emoji","backgroundPosition":"-414px -318px"},{"title":"飞机","backgroundImage":"emoji","backgroundPosition":"-446px -318px"},{"title":"火箭","backgroundImage":"emoji","backgroundPosition":"2px -350px"},{"title":"自行车","backgroundImage":"emoji","backgroundPosition":"-30px -350px"},{"title":"高铁","backgroundImage":"emoji","backgroundPosition":"-62px -350px"},{"title":"警告","backgroundImage":"emoji","backgroundPosition":"-94px -350px"},{"title":"旗","backgroundImage":"emoji","backgroundPosition":"-126px -350px"},{"title":"男人","backgroundImage":"emoji","backgroundPosition":"-158px -350px"},{"title":"女人","backgroundImage":"emoji","backgroundPosition":"-190px -350px"},{"title":"O","backgroundImage":"emoji","backgroundPosition":"-222px -350px"},{"title":"X","backgroundImage":"emoji","backgroundPosition":"-254px -350px"},{"title":"版权","backgroundImage":"emoji","backgroundPosition":"-286px -350px"},{"title":"注册商标","backgroundImage":"emoji","backgroundPosition":"-318px -350px"},{"title":"商标","backgroundImage":"emoji","backgroundPosition":"-350px -350px"}]
class Face extends React.PureComponent<Props, State> {
	private faceBtn: React.RefObject<HTMLDivElement>;
	constructor(props: Props) {
		super(props);
		this.faceBtn = React.createRef();
		this.insetFace = this.insetFace.bind(this);
	}

	static readonly defaultProps: Props = {};
	readonly state: State = {
		isShow: false
	};
	public insetFace(content: string): any {
		if (!content || content.trim().length <= 0) {
			return "";
		}
		let c=Array.from(content);
		let newC=c.map((v:any)=>{
			let code=v.codePointAt(0).toString(16)
			if(word.indexOf(code)!=-1){
				let face=faceData[word.indexOf(code)]
				if(face){
					v=`<div class='face-show' style="background-position:${face.backgroundPosition};background-image:url(${face.backgroundImage=='qqface'?qqface:emoji})"></div>`;
				}
			}
			return v
		})
		content=newC.join('');

		let reg = /\[.*?\]/gi;
		let rgArr = content.match(reg);
		if (rgArr && rgArr.length > 0) {
			rgArr.map((item: string) => {
				let w = item.replace(/^\[|\]$/gi, "");
				if (word.indexOf(w) != -1) {
					let idx=word.indexOf(w);
					let face=faceData[idx]
					content = content.replace(
						item,
						// `<img class="emoji-item" src='${require("@img/face/face_" +
						// 	word.indexOf(w) +
						// 	".png")}'/>`
						`<div class='face-show' style="background-position:${face.backgroundPosition};background-image:url(${face.backgroundImage=='qqface'?qqface:emoji})"></div>`
					);
				}

			});
		}
		
		return content;
	}
	componentDidMount() {
		document.body.addEventListener(
			"click",
			() => {
				if (this.state.isShow) {
					this.setState({ isShow: false });
				}
			},
			false
		);
	}
	faceClick(item: string, e: any) {
		e.nativeEvent.stopImmediatePropagation;
		let { onClick } = this.props;
		if (onClick && typeof onClick === "function") {
			onClick(item);
		}
		this.setState({
			isShow: false
		});
	}

	renderFace() {
		return (
			<div className="face-img-box">
				{faceData&&faceData.length>0&&faceData.map((item:any,idx:number)=>{
					if(idx>=105){
						return null;
					}
					return <div
								className="face-new-item"
								key={"face_" + idx}
								onClick={this.faceClick.bind(this, item.title)}
								style={{
									backgroundImage:`url(${item.backgroundImage=='qqface'?qqface:emoji})`,
									backgroundPosition:item.backgroundPosition
								}}
							>
							</div>
					
				})}

				{/* {word &&
					word.length > 0 &&
					word.map((item: any, idx: number) => {
						return (
							<div
									className="face-item"
									key={"face_" + idx}
									onClick={this.faceClick.bind(this, item)}
								>
									<img
										src={require(`@img/face/face_${idx}.png`)}
									/>
								</div>
						);
					})} */}
			</div>
		);
	}
	toggleFace(e?: any) {
		e.nativeEvent.stopImmediatePropagation;
		this.setState({ isShow: !this.state.isShow });
	}
	render() {
		let { isShow } = this.state;
		return (
			<Popover
				placement="topLeft"
				content={this.renderFace.call(this)}
				overlayClassName="face-box"
				visible={isShow}
				arrowPointAtCenter
				getPopupContainer={() => this.faceBtn.current}
			>
				<div
					style={{
						width: "40px",
						height: "30px",
						lineHeight: "38px",
						textAlign: "center"
					}}
					onClick={this.toggleFace.bind(this)}
					ref={this.faceBtn}
				>
					<Icon type="smile" className="face-active" />
				</div>
			</Popover>
		);
	}
}
export default Face;
const FaceFun = new Face(null);
export const insetFace = FaceFun.insetFace;
