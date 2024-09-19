let scoreList = [
    // 立即成功
    {'key':'11111','value':900000},
    // 缺一步，且无解
    {'key':'011110','value':90000},
    {'key':'1011101','value':90000},
    {'key':'11011011','value':90000},
    {'key':'111010111','value':90000},
    // 缺一步，即可无解
    {'key':'001110','value':40000},
    {'key':'010110','value':40000},
    {'key':'011010','value':40000},
    {'key':'011100','value':40000},
    {'key':'1010101','value':40000},
    {'key':'11001011','value':40000},
    {'key':'11010011','value':40000},
    {'key':'111000111','value':40000},
    // 缺一步，即可成功
    {'key':'01111','value':35000},
    {'key':'10111','value':35000},
    {'key':'11011','value':35000},
    {'key':'11101','value':35000},
    {'key':'11110','value':35000},
    // 三子排列
    {'key':'01110','value':35000},
    {'key':'111','value':8000},
    {'key':'1011','value':7000},
    {'key':'1101','value':7000},
    {'key':'10101','value':6000},
    {'key':'10011','value':6000},
    {'key':'11001','value':6000},
    // 二子排列
    {'key':'0110','value':900},
    {'key':'11','value':800},
    {'key':'101','value':700},
    {'key':'1001','value':600},
    // 一子排列
    {'key':'010','value':90},
    {'key':'1','value':80},
    // 无子排列
    {'key':'0','value':70}
];

export function getStepScore(data,roleValue,x,y){
    let getValue = function(i,j){
        return data?.[i]?.[j]??-1;
    };
    let score = 0;
    let value = getValue(x,y);
    if(value==0||value==roleValue){           // 只对空值评分
        let ruleGroup= [];
        [[0,1],[1,0],[1,1],[1,-1]].forEach(function([xUnit,yUnit]){
            let rule = [];
            rule.push(1);
            for(let n=1;n<5;n++){
                let value = getValue(x-n*xUnit,y-n*yUnit);
                if([0,roleValue].includes(value)){
                    rule.unshift(value?1:0);
                }else{
                    break;
                }
            }
            for(let n=1;n<5;n++){
                let value = getValue(x+n*xUnit,y+n*yUnit);
                if([0,roleValue].includes(value)){
                    rule.push(value?1:0);
                }else{
                    break;
                }
            }
            if(rule.length>=5){
                ruleGroup.push(rule.join(''));
            }
        });
        ruleGroup.forEach(function(rule){
            for(let item of scoreList){
                if(rule.includes(item.key)){
                    score += item.value;
                    break;
                }
            }
            score += rule.length-5;    // 剩余空间长度
        });
    }
    return score;
}

export function findBestCoord(data,roleValue){
    let find = function(data,roleValue){
        let list = [];
        for(let x=0;x<data.length;x++){
            for(let y=0;y<data[x].length;y++){
                let score = getStepScore(data,roleValue,x,y);
                list.push({
                    x,
                    y,
                    score
                })
            }
        }
        list.sort(function(item1,item2){
            return item2.score-item1.score;
        });
        let maxScore = list[0].score;
        let result = list.filter(item=>item.score==maxScore);
        return result[Math.floor(Math.random() * result.length)];
    };

    let bestCoord = find(data,roleValue);
    console.log('[bestCoord]',bestCoord);
    let nextCoord = find(data,roleValue==1?2:1);
    console.log('[nextCoord]',nextCoord);
    if(nextCoord.score>bestCoord.score&&nextCoord.score-bestCoord.score>4000){
        bestCoord = {
            x:nextCoord.x,
            y:nextCoord.y,
            score:90000
        };
    }
    return bestCoord;
}

export function findLine(data,roleValue){
    let getValue = function(i,j){
        return data?.[i]?.[j]??-1;
    };
    let coordGroup= [];
    for(let x=0;x<data.length;x++){
        for(let y=0;y<data[x].length;y++){
            let roleValue = getValue(x,y);
            if(roleValue>0){           // 只对空值评分
                [[1,0],[0,1],[1,1],[-1,1]].forEach(function([xUnit,yUnit]){
                    let rule = [];
                    rule.push(1);
                    for(let n=1;n<5;n++){
                        let value = getValue(x+n*xUnit,y+n*yUnit);
                        if(value==roleValue){
                            rule.push(1);
                        }
                    }
                    if(rule.length==5){
                        coordGroup.push({
                            start:{
                                x,
                                y
                            },
                            end:{
                                x:x+4*xUnit,
                                y:y+4*yUnit
                            },
                            value:roleValue
                        });
                    }
                });
            }
        }
    }
    return coordGroup;
}