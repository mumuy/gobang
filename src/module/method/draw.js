// 绘制圆角矩形
export function drawRect(context,param){
    let {x,y,width,height,radius=8,color='rgba(0,0,0,0.1)'} = param;
    context.save();
    context.beginPath();
    context.fillStyle = color;
    context.roundRect(x,y,width,height,radius);
    context.closePath();
    context.fill();
    context.restore();
}

// 绘制棋子
export function drawPiece(context,param){
    let {x,y,size,color,text} = param;
    if(text){
        context.save();
        context.beginPath();
        context.fillStyle = 'rgba(0,0,0,0.1)';
        context.arc(x,y,0.55*size,0,2*Math.PI);
        context.closePath();
        context.fill();
        context.restore();
    }
    let bgColor = context.createRadialGradient(x,y-0.15*size, 0.1*size,x,y, size);
    if(color=='white'){
        bgColor.addColorStop(0, '#ffffff');
        bgColor.addColorStop(0.6, '#bababa');
    }else{
        bgColor.addColorStop(0, '#484848');
        bgColor.addColorStop(0.6, '#000000');
    }
    context.save();
    context.beginPath();
    context.fillStyle = bgColor;
    context.arc(x,y,0.475*size,0,2*Math.PI);
    context.closePath();
    context.fill();
    context.beginPath();
    let ftColor = context.createRadialGradient(x,y-0.3*size, 0.05*size,x,y-0.35*size, 0.45*size);
    ftColor.addColorStop(0, 'rgba(255,255,255,0.15)');
    ftColor.addColorStop(1, 'rgba(255,255,255,0.005)');
    context.fillStyle = ftColor;
    context.arc(x,y,0.475*size,0,2*Math.PI);
    context.closePath();
    context.fill();
    if(text){
        context.fillStyle = color=='white'?'#111111':'#eeeeee';
        context.font = 'bold 18px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text,x,y);
    }
    context.restore();
}

// 绘制文本
export function drawText(context,param){
    let {x,y,size,text,align='center',color='#ffffff',isStroke=true} = param;
    context.save();
    context.strokeStyle = '#355149';
    context.fillStyle = color;
    context.font = `bold ${size}px Arial`;
    context.textAlign = align;
    context.textBaseline = 'middle';
    context.lineWidth = Math.floor(size/4);
    if(isStroke){
        context.strokeText(text,x,y);
    }
    context.fillText(text,x,y);
    context.restore();
}

// 绘制按钮
export function drawButton(context,param){
    let {x,y,size,text,color='#fc9000'} = param;
    context.save();
    context.font = `bold ${size}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    drawRect(context,{
        x:x-textWidth/2-25,
        y:y-1.2*size,
        width: textWidth+50,
        height: 2.4*size,
        radius: 1.2*size,
        color
    });
    context.strokeStyle = 'rgba(0,0,0,0.35)';
    context.fillStyle = '#fff';
    context.lineWidth = 3;
    context.strokeText(text,x,y);
    context.fillText(text,x,y);
    context.restore();
}

// 绘制倒计时
export function drawCountdown(context,param){
    let {x,y,size,text,color='#ffffff'} = param;
    context.save();
    drawRect(context,{
        x,
        y:y-0.85*size,
        width:3.6*size,
        height:1.6*size,
        radius:0.3*size,
        color:'rgba(0,0,0,0.5)'
    });
    drawText(context,{
        x:x+1.8*size,
        y:y,
        size:size,
        text,
        color,
        isStroke:false
    });
    context.restore();
}

// 绘制棋盘悬浮标志
export function drawTarget(context,param){
    let {x,y,size,color='#ec7c78'} = param;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x-0.4*size,y-0.2*size);
    context.lineTo(x-0.2*size,y-0.2*size);
    context.lineTo(x-0.2*size,y-0.4*size);
    context.stroke();
    context.moveTo(x+0.4*size,y-0.2*size);
    context.lineTo(x+0.2*size,y-0.2*size);
    context.lineTo(x+0.2*size,y-0.4*size);
    context.stroke();
    context.moveTo(x-0.4*size,y+0.2*size);
    context.lineTo(x-0.2*size,y+0.2*size);
    context.lineTo(x-0.2*size,y+0.4*size);
    context.stroke();
    context.moveTo(x+0.4*size,y+0.2*size);
    context.lineTo(x+0.2*size,y+0.2*size);
    context.lineTo(x+0.2*size,y+0.4*size);
    context.stroke();
    context.closePath();
    context.restore();
}

// 绘制棋盘悬浮标志
export function drawCurrent(context,param){
    let {x,y,size,color='#ec7c78'} = param;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x-0.2*size,y);
    context.lineTo(x+0.2*size,y);
    context.stroke();
    context.moveTo(x,y-0.2*size);
    context.lineTo(x,y+0.2*size);
    context.stroke();
    context.closePath();
    context.restore();
}

// 绘制连珠
export function drawLine(context,param){
    let {x1,y1,x2,y2,color='#ec7c78'} = param;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
    context.closePath();
    context.restore();
}