import Base from './Base.js';
/*
* 地图
*/
export default class Map extends Base{
    constructor(params){
        super();
        this.config = Object.assign({
            x:0,					// 地图起点X轴坐标
            y:0,                    // 地图起点Y轴坐标
            pxWidth:20,				// 地图单元的宽度
            data:[],				// 地图数据
            xLength:0,				// 地图X轴长度
            yLength:0,				// 地图Y轴长度
            frames:1,				// 速度等级:对应内部计算器times多少帧变化一次
            times:0,				// 刷新计数:用于循环动画状态判断
            dynamic:true,    		// 是否动态（如静态则设置缓存）
            isHover:false,			// 鼠标是否悬浮
            coord:null,             // 当前坐标
            update:function(){},	// 更新地图数据
            draw:function(){},		// 绘制地图
        },params);
        Object.assign(this,this.config);
        this.data = structuredClone(this.config.data);
        this.xLength = this.data.length;
        this.yLength = this.data[0].length;
    }
    coord2position(cx,cy){
        return {
            x:this.x+cx*this.pxWidth+this.pxWidth/2,
            y:this.y+cy*this.pxWidth+this.pxWidth/2
        };
    }
    position2coord(x,y){
        let fx = Math.abs(x-this.x)%this.pxWidth-this.pxWidth/2;
        let fy = Math.abs(y-this.y)%this.pxWidth-this.pxWidth/2;
        return {
            x:Math.floor((x-this.x)/this.pxWidth),
            y:Math.floor((y-this.y)/this.pxWidth),
            offset:Math.sqrt(fx*fx+fy*fy)
        };
    }
    setValue(cx,cy,value){
        if(typeof this.data?.[cx]?.[cy]!='undefined'){
            this.data[cx][cy] = value;
        }
    }
    getValue(cx,cy){
        return this.data?.[cx]?.[cy]||false;
    }
}