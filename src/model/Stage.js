import Base from './Base.js';
import Map from './Map.js';
import Item from './Item.js';
/*
* 布景
*/
export default class Stage extends Base{
    constructor(params){
        super();
        this.config = Object.assign({
            status:0,						// 布景状态,0表示未激活/结束,1表示正常,2表示暂停,3表示临时
            maps:[],						// 地图队列
            items:[],						// 对象队列
            backgroundColor:'#000',
            update:function(){}				// 嗅探,处理布局下不同对象的相对关系
        },params);
        this.index = Stage.index++;         // 标识符递增
        Object.assign(this,this.config);
        this.maps = structuredClone(this.config.maps);
        this.items = structuredClone(this.config.items);
    }
    static index = 0;
    // 添加元素
    createItem(params){
        let item = new Item(params);
        //动态属性
        if(item.location){
            Object.assign(item,item.location.coord2position(item.coord.x,item.coord.y));
        }
        //关系绑定
        item.stage = this;
        this.items.push(item);
        this.items.sort(function(item1,item2){
            return item1.zindex-item2.zindex;
        });
        return item;
    }
    // 重置元素
    resetItems(){
        this.items.forEach(function(item){
            Object.assign(item,item.config);
            if(item.location){
                Object.assign(item,item.location.coord2position(item.coord.x,item.coord.y));
            }
        });
    }
    // 清除元素
    clearItems(type){
        if(type){
            this.items = this.items.filter(item=>item.type != type);
        }else{
            this.items = [];
        }
    }
    // 过滤元素
    getItems(type){
        if(type){
            return this.items.filter(item=>item.type == type);
        }else{
            return this.items;
        }
    }
    // 添加地图
    createMap(params){
        let map = new Map(params);
        //动态属性
        map.data = structuredClone(map.config.data);
        map.yLength = map.data.length;
        map.xLength = map.data[0].length;
        map.imageData = null;
        //关系绑定
        map.stage = this;
        this.maps.push(map);
        return map;
    }
    // 重置地图
    resetMaps(){
        this.maps.forEach(function(map){
            Object.assign(map,map.config);
            map.data = structuredClone(map.config.data);
            map.yLength = map.data.length;
            map.xLength = map.data[0].length;
            map.imageData = null;
        });
    }
    // 清除地图
    clearMaps(){
        this.maps = [];
    }
    // 重置
    reset(){
        for(let key in this.config){
            if(!['maps','items'].includes(key)){
                this[key] = this.config[key];
            }
        }
        this.status = 1;
        this.resetItems();
        this.resetMaps();
    }
}