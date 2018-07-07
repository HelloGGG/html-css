// 矩阵反转
function invert(field) {
    var new_field = []
    for (var i = 0; i < field.length; i++) {
        new_field[i] = []
    }

    for (var i = 0; i < field.length; i++) {
        for (j = 0; j < field[i].length; j++) {
            new_field[i][j] = field[i][field[i].length - 1 - j]
        }
    }
    return new_field
}
// 矩阵转置
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
// 用户行为
var actions = ['up', 'left', 'down', 'right', 'reset']
// 定义一个类，名为游戏区域
function GameField(width = 4, height = 4, win = 2048) {
    // 初始化参数
    this.width = width
    this.height = height
    this.win = win
    this.score = 0
    this.highscore = 0
    this.field = []
    // 重新开始
    GameField.prototype.reset = function () {
        this.score = 0
        this.field = []
        for (var i = 0; i < this.width; i++) {
            this.field[i] = []
        }
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.field[i][j] = 0
            }
        }
        this.spawn()
        this.spawn()
    }
    // 移动
    GameField.prototype.move = function (direction) {
        var _this = this
        // 单行元素左移
        function row_left(row) {
            // 挤压掉零元素(空白区域)，使非零元素相靠
            function tighten(row) {
                var new_row = []
                for (var i = 0; i < row.length; i++) {
                    if (row[i] > 0) {
                        new_row.push(row[i])
                    }
                }
                // 保存新行长度，不能直接在循环里代入，那样长度会一直在变
                var new_len = new_row.length
                for (var i = 0; i < row.length - new_len; i++) {
                    new_row.push(0)
                }
                return new_row
            }
            // 合并相同值
            function merge(row) {
                var new_row = []
                var flag = false
                for (var i = 0; i < row.length; i++) {
                    if (flag) {
                        new_row.push(2 * row[i])
                        _this.score += 2 * row[i]
                        flag = false
                    } else {
                        if (i + 1 < row.length && row[i]!=0 &&row[i] == row[i + 1]) {
                            flag = true
                            new_row.push(0)
                        } else {
                            new_row.push(row[i])
                        }
                    }
                }

                return new_row
            }
            // 返回单行向左移动的结果
            return tighten(merge(tighten(row)))
        }

        // console.log(this.score)

        // 移动对象包含四个函数，处理不同方向的移动
        moves = {
            'left': function (field) {
                var new_field = []

                for (var i = 0; i < field.length; i++) {
                    new_field[i] = []
                }

                for (var row = 0; row < field.length; row++) {
                    new_field[row] = row_left(field[row])
                }
                return new_field

            },
            'right': function (field) {
                var new_field = invert(moves['left'](invert(field)))
                return new_field
            },
            'up': function (field) {
                var new_field = transpose(moves['left'](transpose(field)))
                return new_field
            },
            'down': function (field) {
                var new_field = transpose(moves['right'](transpose(field)))
                return new_field
            }
        }
        // 是否是非法指令
        if (direction == 'left' || direction === 'right' || direction == 'up' || direction == 'down') {
            // 判断是否可以移动
            if (this.move_is_possible(direction)) {
                // 移动后重置游戏区
                this.field = moves[direction](this.field)
                this.spawn()
                return true
            } else {
                return false
            }
        }

    }
    // 是否可以移动
    GameField.prototype.move_is_possible = function (direction) {
        // 单行是否可以左移动
        function move_row_left(row) {
            for (var i = 0; i < row.length - 1; i++) {
                if (row[i] == 0 && row[i + 1] != 0) {
                    return true
                }
                if (row[i] != 0 && row[i] == row[i + 1]) {
                    return true
                }
            }
            return false
        }
        // 定义checks对象包含四个函数来检验各个方向上是否可以移动
        checks = {
            'left': function (field) {
                for (var row = 0; row < field.length; row++) {
                    if (move_row_left(field[row])) {
                        return true
                    }
                }
                return false
            },
            'right': function (field) {
                return checks['left'](invert(field))

            },
            'up': function (field) {
                return checks['left'](transpose(field))
            },
            'down': function (field) {
                return checks['right'](transpose(field))
            }
        }

        if (direction == 'left' || direction == 'right' || direction == 'up' || direction == 'down') {
            // 返回检验结果
            return checks[direction](this.field)
        } else {
            // 非法方向
            return false
        }

    }
    // 随机空白位置产生随机数2或4
    GameField.prototype.spawn = function () {

        var new_element = 0
        if (Math.random() * 100 + 1 > 70) {
            new_element = 4
        } else {
            new_element = 2
        }
        // 随机位置
        var random_zone = []

        for (var i = 0; i < this.field.length; i++) {
            var field_row = this.field[i]
            for (var j = 0; j < field_row.length; j++) {
                if (field_row[j] == 0) {
                    // 把随机位置坐标点放入随机位置数组中
                    random_zone.push([i, j])
                }
            }
        }
        // 产生 min<= random_num < max
        function RandomNum(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.floor(Rand * Range); //舍去
            return num;
        }
        // 随机获取一对坐标的索引
        var random_num = RandomNum(0, random_zone.length)
        // 获取横纵坐标
        var x = random_zone[random_num][0]
        var y = random_zone[random_num][1]
        // 赋值给随机空白位置
        this.field[x][y] = new_element

    }

    // 是否赢了
    GameField.prototype.is_win = function () {
        for(var i = 0;i<this.width;i++){
            for(var j = 0;j<this.height;j++){
                if(this.field[i][j] >= this.win){
                    return true
                }
            }
        }
        return false
       
    }
    // 是否游戏结束
    GameField.prototype.is_gameover = function () {
        for (var i = 0; i < actions.length; i++) {
            if (this.move_is_possible(actions[i])) {
                return false
            }
        }
        return true
    }
    // 绘制数字和帮助内容，显示在table中
    GameField.prototype.draw = function () {
        var score = document.querySelectorAll('h3')[0]
        var highscore = document.querySelectorAll('h3')[1]
        var help_string = document.getElementsByTagName('h2')[0]
        score.innerHTML = 'Score: '+ this.score
        help_string.innerHTML = ''

        if(this.is_gameover()){
            // 游戏结束，获得最高分
            this.highscore = this.score
            help_string.innerHTML = 'You Are Gameover......'
        }
        if(this.is_win()){
            this.highscore = this.score
            help_string.innerHTML = 'You Are Win!!!'
        }
        
        if(this.highscore != 0){
            highscore.innerHTML = 'HighScore: ' + this.highscore
        }
        // 二维数组内容对应到table的单元格中去
        var trs = document.querySelectorAll('tr')
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].children
            for (var j = 0; j < tds.length; j++) {
                if (this.field[i][j] != 0) {
                    // 把数字填充到单元格中
                    tds[j].innerHTML = this.field[i][j]
                    // 不同数字，不同颜色背景
                    switch(this.field[i][j]){
                        case 2: tds[j].style.backgroundColor = '#e03636';break;
                        case 4: tds[j].style.backgroundColor = '#edd0be';break;
                        case 8: tds[j].style.backgroundColor = '#25c6fc';break;
                        case 16: tds[j].style.backgroundColor = '#00FF80';break;
                        case 32: tds[j].style.backgroundColor = '#BDB76A';break;
                        case 64: tds[j].style.backgroundColor = '#008573';break;
                        case 128: tds[j].style.backgroundColor = '#FD5B78';break;
                        case 256: tds[j].style.backgroundColor = '#8A3324';break;
                        case 512: tds[j].style.backgroundColor = '#495A80';break;
                        case 1024: tds[j].style.backgroundColor = '#ff3399';break;
                        case 2048: tds[j].style.backgroundColor = '#228fbd';break;
                        default:break;
                    }
                } else {
                    // 空白位置填充空白
                    tds[j].innerHTML = ''
                    tds[j].style.backgroundColor = '#cecece';
                }
            }
        }
    }
}
// 主函数
function main() {
    var gamefield = new GameField()
    // 初始化
    function init() {
        gamefield.reset()
        gamefield.draw()
        return 'Game'
    }

    init()
    // 获取用户键盘行为
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 65:
                gamefield.move('left');
                // 绘制更新html
                gamefield.draw();
                break;
            case 68:
                gamefield.move('right');
                gamefield.draw();
                break;
            case 82:
                init();
                break;
            case 83:
                gamefield.move('down');
                gamefield.draw();
                break;
            case 87:
                gamefield.move('up');
                gamefield.draw();
                break;
            default:
                break;
        }

    }
}

//入口
window.onload = function () {
    main()
}
