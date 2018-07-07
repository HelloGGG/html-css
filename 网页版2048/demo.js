function invert(field) {
    var new_field = []
    for (var i = 0; i < field.length; i++) {
        new_field[i] = []
    }
    for (var i = 0; i < field.length; i++) {
        for (j = 0; j < field[i].length; j++) {
            new_field[i][j]=field[i][field[i].length - 1 - j]
        }
    }
    return new_field
}

function transpose(field) {
    //定义一个新的数组
    var arr_new = []
    for (var i = 0; i < field[0].length; i++) {
        arr_new[i] = []
    }
    for (i = 0; i < field.length; i++) //控制有几个元素
    {
        for (j = 0; j < field[i].length; j++) //遍历每一个具体的值
        {
            arr_new[j][i] = field[i][j]
        }
    }
    return arr_new
}

var field = [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,16]
]
console.log(invert(field))