export function formatTime(second){
    return Math.floor(second/60).toString().padStart(2,'0')+':'+Math.floor(second%60).toString().padStart(2,'0');
}