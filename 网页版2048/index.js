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
var actions = ['up', 'left', 'down', 'right', 'reset']

function GameField(width = 4, height = 4, win = 2048) {
    this.width = width
    this.height = height
    this.win = win
    this.score = 0
    this.highscore = 0
    this.field = []

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

    GameField.prototype.move = function (direction) {
        var _this = this
        function row_left(row) {

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

            return tighten(merge(tighten(row)))
        }

        // console.log(this.score)
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

        if (direction == 'left' || direction === 'right' || direction == 'up' || direction == 'down') {
            if (this.move_is_possible(direction)) {
                this.field = moves[direction](this.field)
                // console.log(this.field)
                this.spawn()
                return true
            } else {
                return false
            }
        }

    }

    GameField.prototype.move_is_possible = function (direction) {

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
            return checks[direction](this.field)
        } else {
            return false
        }

    }

    GameField.prototype.spawn = function () {

        var new_element = 0
        if (Math.random() * 100 + 1 > 70) {
            new_element = 2
        } else {
            new_element = 4
        }

        var random_zone = []

        for (var i = 0; i < this.field.length; i++) {
            var field_row = this.field[i]
            for (var j = 0; j < field_row.length; j++) {
                if (field_row[j] == 0) {
                    random_zone.push([i, j])
                }
            }
        }

        function RandomNum(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.floor(Rand * Range); //舍去
            return num;
        }

        var random_num = RandomNum(0, random_zone.length)
        var x = random_zone[random_num][0]
        var y = random_zone[random_num][1]

        this.field[x][y] = new_element

    }


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

    GameField.prototype.is_gameover = function () {
        for (var i = 0; i < actions.length; i++) {
            if (this.move_is_possible(actions[i])) {
                return false
            }
        }
        this.highscore = this.score
        return true
    }

    GameField.prototype.draw = function () {
        var score = document.querySelectorAll('h3')[0]
        var highscore = document.querySelectorAll('h3')[1]
        var help_string = document.getElementsByTagName('h2')[0]
        score.innerHTML = 'Score: '+ this.score
        help_string.innerHTML = ''

        if(this.is_gameover()){
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

        var trs = document.querySelectorAll('tr')
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].children
            for (var j = 0; j < tds.length; j++) {
                if (this.field[i][j] != 0) {
                    tds[j].innerHTML = this.field[i][j]
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
                    tds[j].innerHTML = ''
                    tds[j].style.backgroundColor = '#cecece';
                }
            }
        }
    }
}

function main() {
    var gamefield = new GameField()

    function init() {
        gamefield.reset()
        gamefield.draw()
        return 'Game'
    }

    init()
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 65:
                gamefield.move('left');
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

//主函数
window.onload = function () {
    main()
}