

/* //创建数组
  var  arr = ['*','##',"***","&&","****","##*"];

   arr[7] = "**";
 //显示数组长度
/* document.write(arr.length);*/
 
 //将数组内容输出，完成达到的效果。
document.write(arr[0]+"<br>"+arr[7]+"<br>"+arr[2]+"<br>"+arr[4]);*/

 //创建数组
 var  arr = ['*','##',"***","&&","****","##*"];

 arr[7] = "**";
//删除数组中的非*项
var arrlen = arr.length;
for (var i = 0; i < arrlen; i++) {
    var arritemslen = arr[i].length;
    
    for (var j = 0;j < arritemslen; j++) {
        if (arr[i].split()[j] != "*") {
            arr.splice(i,1);
        }
    }
}

arr.sort(function (a, b) {
    if (a.length > b.length) {
        return 1;
    } else if (a.length < b.length) {
        return -1;
    } else {
        return 0;
    }
});

document.write(arr);
