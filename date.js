exports.getDate=function() {
let date=new Date();
var options={
    weekday:'long',
    day:'numeric',
    month:'long'
}
return date.toLocaleDateString("en-us",options)
}
exports.getDay=getDay
function getDay(){
    let date=new Date();
    var options={
        weekday:'long'
    }
    var day=date.toLocaleDateString("en-us",options)
    return day;
    }  
    