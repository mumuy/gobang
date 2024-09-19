/*
* 基础元素
*/
export default class Base{
    constructor(params){
        this.id = Base.id++;        // 标识符递增
    }
    static id = 0;  
    events = {};                   // 事件订阅
    on(type,handler){
        if(typeof this.events[type] == 'undefined'){
            this.events[type] = [];
        }
        let id = Math.random().toString(16).substring(2);
        this.events[type].push({
            id,
            type,
            handler
        });
        return id;
    }
    off(id){
        for(let type of this.events){
            this.events[type] = this.events[type].filter(item=>item.id!=id);
        }
    }
}