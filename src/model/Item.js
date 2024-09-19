import Base from './Base.js';
/*
* 活动元素
*/
export default class Item extends Base{
    constructor(params){
        super();
        this.config = Object.assign({
            // 基础属性
            type:'item',			// 对象类型
            x:0,					// 位置坐标:横坐标
            y:0,					// 位置坐标:纵坐标
            width:20,				// 对象的宽
            height:20,				// 对象的高
            align:['left','top'],   // 对齐方式
            status:1,				// 对象状态,0表示未激活/结束,1表示正常,2表示暂停,3表示临时,4表示异常
            zindex:0,               // 层级
            orientation:0,			// 当前定位方向,0表示右,1表示下,2表示左,3表示上
            speed:0,				// 移动速度
            isHover:false,			// 鼠标是否悬浮
            // 定位相关
            location:null,			// 定位地图,Map对象
            coord:null,				// 定位地图中的当前位置坐标;
            vector:null,			// 定位地图中的目标位置坐标
            // 布局相关
            frames:1,				// 速度等级:对应内部计算器times多少帧变化一次
            times:0,				// 刷新计数:用于循环动画状态判断
            control:{},				// 控制缓存
            dynamic:true,    		// 是否静态（如静态则设置缓存）
            update:function(){}, 	// 更新方法
            draw:function(){}		// 绘制方法
        },params);
        Object.assign(this,this.config);
        if(this.coord){
            this.setCoord(this.coord.x,this.coord.y);
        }
    }
    setCoord(x,y){
        this.coord = {x,y};
        if(this.location){
            Object.assign(this,this.location.coord2position(this.coord.x,this.coord.y));
        }
    }
    setVector(x,y){
        this.vector = {x,y};
    }
}