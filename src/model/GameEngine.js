/*
* 小型游戏引擎
*/
import Stage from './Stage.js';

export default class GameEngine{
    #tempCanvas = null;
    #tempContext = null;
    #hander = null;
    #stages = [];
    #stageIndex = 0;
    constructor(id,params){
        this.config = Object.assign({
            width:960,
            height:640
        },params)
        Object.assign(this,this.config);
        this.$canvas = document.getElementById(id);
        this.$canvas.width = this.config.width;
        this.$canvas.height = this.config.height;
        this.context = this.$canvas.getContext('2d');
        this.#tempCanvas = document.createElement('canvas');
        this.#tempCanvas.width = this.config.width;
        this.#tempCanvas.height = this.config.height;
        this.#tempContext = this.#tempCanvas.getContext('2d');

        // 事件绑定
        let _ = this;
        ['click','keydown','keyup','mousemove'].forEach(function(eventType){
            window.addEventListener(eventType,function(e){
                let position = _.getPosition(e);
                let event = {
                    type:eventType,
                    ...position
                };
                _.#stages.forEach(function(stage){
                    if(stage.status==1&&position.x>=0&&position.y>=0&&position.x<=_.$canvas.width&&position.y<=_.$canvas.height){
                        if(stage.events[eventType]){
                            stage.events[eventType].forEach(function(item){
                                item['handler'](event);
                            });
                        }
                        let stageMap = null;
                        stage.maps.forEach(function(map){
                            let width = map.xLength*map.pxWidth;
                            let height = map.yLength*map.pxWidth;
                            if(eventType=='mousemove'){
                                map.isHover = false;
                            }
                            if(map.status==1&&position.x>=map.x&&position.x<=map.x+width&&position.y>=map.y&&position.y<=map.y+height){
                                map.isHover = true;
                                stageMap = map;
                            }
                        });
                        if(stageMap&&stageMap.events[eventType]){
                            stageMap.events[eventType].forEach(function(item){
                                item['handler'](event);
                            });
                        }
                        let stageItem = null;
                        stage.items.forEach(function(item){
                            let x = item.x;
                            if(item.align[0]=='center'){
                                x -= item.width/2;
                            }else if(item.align[0]=='right'){
                                x -= item.width;
                            }
                            let y = item.y;
                            if(item.align[1]=='center'){
                                y -= item.height/2;
                            }else if(item.align[1]=='bottom'){
                                y -= item.height;
                            }
                            if(eventType=='mousemove'){
                                item.isHover = false;
                            }
                            if(item.status==1&&x<=position.x&&position.x<=x+item.width&&y<=position.y&&position.y<=y+item.height){
                                item.isHover = true;
                                stageItem = item;
                            }
                        });
                        if(stageItem&&stageItem.events[eventType]){
                            stageItem.events[eventType].forEach(function(item){
                                item['handler'](event);
                            });
                        }
                    }
                });
            });            
        });
    }
    // 动画开始
    start() {
        let _ = this;
        let f = 0;		// 帧数计算
        let fn = function(){
            let stage = _.getStage();
            stage.status = 1;
            _.context.clearRect(0,0,_.width,_.height);		//清除画布
            _.context.fillStyle = stage.backgroundColor;
            _.context.fillRect(0,0,_.width,_.height);
            f++;
            if(stage.update()!=false){		            //update返回false,则不绘制
                stage.maps.forEach(function(item){
                    if(!(f%item.frames)){
                        item.times = f/item.frames;		//计数器
                    }
                    if(!item.dynamic){
                        _.context.save();
                        item.update();
                        _.#tempContext.clearRect(0,0,_.width,_.height);
                        item.draw(_.#tempContext);
                        _.context.drawImage(_.#tempCanvas,0,0,_.width,_.height);
                        _.context.restore();
                    }else{
                    	item.update();
                        item.draw(_.context);
                    }
                });
                stage.items.forEach(function(item){
                    if(!(f%item.frames)){
                        item.times = f/item.frames;		   //计数器
                    }
                    if(!item.dynamic){
                        _.context.save();
                        item.update();
                        _.#tempContext.clearRect(0,0,_.width,_.height);
                        item.draw(_.#tempContext);
                        _.context.drawImage(_.#tempCanvas,0,0,_.width,_.height);
                        _.context.restore();
                    }else{
                        if(stage.status==1&&item.status!=2){  	//对象及布景状态都不处于暂停状态
                            item.update();
                        }
                        item.draw(_.context);
                    }
                });
            }
            _.#hander = requestAnimationFrame(fn);
        };
        _.#hander = requestAnimationFrame(fn);
    }
    // 动画结束
    stop(){
        this.#hander&&cancelAnimationFrame(this.#hander);
    }
    // 事件坐标
    getPosition(e){
        let _ = this;
        let box = _.$canvas.getBoundingClientRect();
        return {
            x:e.clientX-box.left*(_.width/box.width),
            y:e.clientY-box.top*(_.height/box.height)
        };
    }
    // 创建布景
    createStage(params){
        let stage = new Stage(params);
        this.#stages.push(stage);
        return stage;
    }
    // 指定布景
    setStage(index){
        this.#stages[this.#stageIndex].status = 0;
        this.#stageIndex = index;
        let stage = this.#stages[this.#stageIndex];
        stage.status = 1;
        stage.reset();
        return stage;
    }
    // 获取当前布景
    getStage(){
        return this.#stages[this.#stageIndex];
    }
    // 下个布景
    nextStage(){
        if(this.#stageIndex<this.#stages.length-1){
            return this.setStage(++this.#stageIndex);
        }else{
            throw new Error('unfound new stage.');
        }
    }
    // 获取布景列表
    getStages(){
        return this.#stages;
    }
    //初始化游戏引擎
    init(){
        this.#stageIndex = 0;
        this.start();
    }
}