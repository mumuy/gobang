import GameEngine from './model/GameEngine.js';
import {xLabels,yLabels,valueRole} from './module/config/chessboard.js';
import {gameTime,stepTime,winScore,loseScore,drawScore} from './module/config/rule.js';
import {formatTime} from './module/method/format.js';
import {drawRect,drawPiece,drawText,drawButton,drawCountdown,drawTarget,drawCurrent,drawLine} from './module/method/draw.js';
import {getStepScore,findBestCoord,findLine} from './module/method/robot.js';

let game = new GameEngine('canvas');
let gameStatus = 'waiting';
let playerSide = 'black';
let computerSide = 'white';
let currentRole = 'player';
let stepStartTime = Date.now();
let playerGameTime = gameTime;
let playerStepTime = stepTime;
let gameResult = null;
let playScore = 0;
let lastCoord = null;
let mapData = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];


// 游戏布景
let stage = game.createStage({backgroundColor:'#529888'});

// 棋盘
let map = stage.createMap({
    x:50,
    y:50,
    pxWidth:36,
    data:mapData,
    update(){
        this.status = gameStatus=='doing'&&currentRole=='player'?1:2;
    },
    draw(context){
        let pxWidth = this.pxWidth;
        context.save();
        context.translate(this.x+0.5*pxWidth,this.y+0.5*pxWidth);
        context.fillStyle = "#d9af74";
        context.fillRect(-pxWidth,-pxWidth,(this.xLength+1)*pxWidth,(this.yLength+1)*pxWidth);
        // 网格线
        context.fillStyle = '#261e19';
        context.strokeStyle = '#261e19';
        context.lineWidth = 1;
        context.font = '14px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        for(let i=0;i<this.xLength;i++){
            context.beginPath();
            context.fillText(yLabels[i], -0.5*pxWidth, i*pxWidth);
            context.moveTo(0,i*pxWidth);
            context.lineTo((this.xLength-1)*pxWidth,i*pxWidth);
            context.closePath();
            context.stroke();
        }
        for(let i=0;i<this.yLength;i++){
            context.beginPath();
            context.fillText(xLabels[i], i*pxWidth, -0.5*pxWidth);
            context.moveTo(i*pxWidth,0);
            context.lineTo(i*pxWidth,(this.yLength-1)*pxWidth);
            context.closePath();
            context.stroke();
        }
       
        let drawDot = function(x,y){
            context.save();
            context.beginPath();
            context.arc(x*pxWidth,y*pxWidth,0.125*pxWidth,0,2*Math.PI);
            context.closePath();
            context.fill();
            context.restore();
        };
        // 标记点
        drawDot(7,7);
        drawDot(3,3);
        drawDot(11,3);
        drawDot(3,11);
        drawDot(11,11);
        if(this.status==1&&this.coord){
            drawTarget(context,{
                x:this.coord.x*pxWidth,
                y:this.coord.y*pxWidth,
                size:pxWidth
            });
        }
        context.restore();
    }
});

// 游戏详情
stage.createItem({
    x:640,
    y:32,
    update(){
        if(gameStatus=='doing'){
            if(playerGameTime>0&&playerStepTime>0){
                let now = Date.now();
                let stepRunTime = Math.floor((now - stepStartTime)/1000);
                if(stepRunTime&&currentRole=='player'){
                    playerGameTime -= stepRunTime;
                    playerStepTime -= stepRunTime;
                    stepStartTime = now;
                }
            }else{
                playScore += loseScore;
                gameStatus = 'finished';
                gameResult = {
                    'type':'lose',
                    'msg':'🕒已超时！'
                };
                messageView.status = 1;
                starGameBtn.status = 1;
            }
        }
    },
    draw(context){
        context.save();
        context.translate(this.x,this.y);
        drawRect(context,{
            x:0,
            y:0,
            width:288,
            height:210
        });
        let gradientColor = context.createLinearGradient(0,0,288,60);
        gradientColor.addColorStop(0, '#f5deb4');
        gradientColor.addColorStop(0.45, '#f5deb4');
        gradientColor.addColorStop(0.55, '#ce8a43');
        gradientColor.addColorStop(1, '#ce8a43');
        drawRect(context,{
            x:0,
            y:0,
            width:288,
            height:60,
            color:gradientColor
        });
        drawPiece(context,{
            x:30,
            y:31,
            size:map.pxWidth,
            color:computerSide,
            text:computerSide=='black'?'黑':'白'
        });
        drawPiece(context,{
            x:258,
            y:31,
            size:map.pxWidth,
            color:playerSide,
            text:playerSide=='black'?'黑':'白'
        });
        drawText(context,{
            x:60,
            y:31,
            size:24,
            align:'left',
            text:'电脑'
        });
        drawText(context,{
            x:144,
            y:31,
            size:20,
            color:'#fc9000',
            text:'VS'
        });
        drawText(context,{
            x:228,
            y:31,
            size:24,
            align:'right',
            text:'玩家'
        });
        drawText(context,{
            x:60,
            y:120,
            size:20,
            align:'left',
            text:'单局计时'
        });
        drawCountdown(context,{
            x:150,
            y:120,
            size:24,
            text:formatTime(playerGameTime)
        });
        drawText(context,{
            x:60,
            y:165,
            size:20,
            align:'left',
            text:'单步计时'
        });
        drawCountdown(context,{
            x:150,
            y:165,
            size:24,
            text:formatTime(playerStepTime)
        });
        if(gameStatus=='doing'){
            let diff = 6*Math.cos(this.times/24);
            if(currentRole=='computer'){
                drawText(context,{
                    x:80,
                    y:64+diff,
                    size:32,
                    text:'👆🏻'
                });
            }else{
                drawText(context,{
                    x:208,
                    y:64+diff,
                    size:32,
                    text:'👆🏻'
                });
            }
        }
        context.restore();
    }
});

// 玩家得分
stage.createItem({
    x:640,
    y:548,
    draw(context){
        context.save();
        context.translate(this.x,this.y);
        drawRect(context,{
            x:0,
            y:0,
            width:288,
            height:60
        });
        drawText(context,{
            x:25,
            y:30,
            size:20,
            align:'left',
            text:'玩家得分：'
        });
        drawText(context,{
            x:125,
            y:30,
            size:24,
            align:'left',
            text:playScore,
            color:'#fc9000'
        });
        context.restore();
    }
});

let resetResultBtn = stage.createItem({
    x:895,
    y:578,
    width:40,
    height:40,
    dynamic:true,
    align:['center','center'],
    draw(context){
        context.save();
        drawText(context,{
            x:this.x,
            y:this.y+2,
            size:32,
            text:'↻',
            color:this.isHover?'#cccccc':'#ffffff'
        });
        context.restore();
    }
});

// 状态展示
let messageView = stage.createItem({
    x:784,
    y:350,
    width:96,
    height:40,
    dynamic:true,
    align:['center','center'],
    draw(context){
        if(this.status==1){
            context.save();
            drawText(context,{
                x:this.x,
                y:this.y,
                size:24,
                text:gameStatus=='waiting'?'准备开始':(gameResult?gameResult.msg:'')
            });
            context.restore();
        }
    }
});

// 开始游戏
let starGameBtn = stage.createItem({
    x:784,
    y:425,
    width:130,
    height:48,
    dynamic:true,
    align:['center','center'],
    draw(context){
        if(this.status==1){
            context.save();
            drawButton(context,{
                x:this.x,
                y:this.y,
                size:24,
                text:gameStatus=='waiting'?'开始游戏':'继续游戏',
                color:this.isHover?'#eb8600':'#fc9000'
            });
            context.restore();
        }
    }
});

// 放下棋子
let dropPiece = function(role = 'player',cx,cy){
    let side = role=='player'?playerSide:computerSide;
    let value = valueRole.indexOf(role);
    lastCoord = {
        x:cx,
        y:cy
    };
    map.setValue(cx,cy,value);
    return stage.createItem({
        type:'piece',
        location:map,
        coord:{
            x:cx,
            y:cy
        },
        draw(context){
            let x = this.x;
            let y = this.y;
            drawPiece(context,{
                x,
                y,
                size:map.pxWidth,
                color:side
            });
            if(gameStatus=='doing'&&role=='computer'&&this.coord.x==lastCoord.x&&this.coord.y==lastCoord.y){
                drawCurrent(context,{
                    x,
                    y,
                    size:map.pxWidth,
                });
            }
        }
    });
};

// 绘制标记
let mark = stage.createItem({
    type:'mark',
    x:map.x,
    y:map.y,
    zindex:999,
    draw(context){
        let pxWidth = map.pxWidth;
        context.save();
        context.translate(this.x+0.5*pxWidth,this.y+0.5*pxWidth);
        if(gameStatus=='finished'){
            let coordGroup = findLine(map.data);
            coordGroup.forEach(function(data){
                drawLine(context,{
                    x1:data.start.x*pxWidth,
                    y1:data.start.y*pxWidth,
                    x2:data.end.x*pxWidth,
                    y2:data.end.y*pxWidth,
                });
            });
        }
        context.restore();
    }
});

// 电脑方落子
let computerTurn = function(){
    currentRole = 'computer';
    stepStartTime = Date.now();
    let value = valueRole.indexOf(currentRole);
    let bestCoord = findBestCoord(map.data,value);
    if(bestCoord.score==0){
        playScore += drawScore;
        gameStatus = 'finished';
        gameResult = {
            'type':'lose',
            'msg':'😐平局了！'
        };
        messageView.status = 1;
        starGameBtn.status = 1;
    }else{
        setTimeout(function(){
            dropPiece(currentRole,bestCoord.x,bestCoord.y);
            console.log('[电脑落子]',xLabels[bestCoord.x],yLabels[bestCoord.y]);
            if(bestCoord.score>=900000){
                playScore += loseScore;
                gameStatus = 'finished';
                gameResult = {
                    'type':'lose',
                    'msg':'😭你输了！'
                };
                messageView.status = 1;
                starGameBtn.status = 1;
            }else{
                playerTurn();
            }
        },500);
    } 
};

// 玩家落子
let playerTurn = function(){
    currentRole = 'player';
    stepStartTime = Date.now();
    playerStepTime = stepTime;
    let value = valueRole.indexOf(currentRole);
    let bestCoord = findBestCoord(map.data,value);
    if(bestCoord.score==0){
        playScore += drawScore;
        gameStatus = 'finished';
        gameResult = {
            'type':'lose',
            'msg':'😐平局了！'
        };
        messageView.status = 1;
        starGameBtn.status = 1;
    }
};

// 重置游戏
let resetGame = function(){
    gameStatus = 'doing';
    playerSide = Math.random()>0.5?'black':'white';
    computerSide = playerSide!='black'?'black':'white';
    stepStartTime = Date.now();
    playerGameTime = gameTime;
    playerStepTime = stepTime;
    stage.clearItems('piece');
    stage.reset();
    messageView.status = 2;
    starGameBtn.status = 2;
    if(playerSide=='black'){
        playerTurn();
    }else{
        computerTurn();
    }
};

/********** 事件绑定 *********/
// 棋盘坐标更新
stage.on('mousemove',function(){
    map.coord = null;
});
map.on('mousemove',function(event){
    map.coord = map.position2coord(event.x,event.y);
});
map.on('click',function(event){
    map.coord = map.position2coord(event.x,event.y);
    if(map.getValue(map.coord.x,map.coord.y)==0){
        dropPiece('player',map.coord.x,map.coord.y);
        console.log('[玩家落子]',xLabels[map.coord.x],yLabels[map.coord.y]);
        let value = valueRole.indexOf('player');
        let score = getStepScore(map.data,value,map.coord.x,map.coord.y);
        if(score>=900000){
            playScore += winScore;
            gameStatus = 'finished';
            gameResult = {
                'type':'win',
                'msg':'😃你赢了！'
            };
            messageView.status = 1;
            starGameBtn.status = 1;
        }else{
            computerTurn();
        }
    }
});
// 开始游戏
starGameBtn.on('click',function(){
    resetGame();
});
// 重置记录
resetResultBtn.on('click',function(){
    playScore = 0;
    alert('玩家得分已重置！');
});

// 初始化
game.init();