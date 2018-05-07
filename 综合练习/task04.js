//全局变量
var tds = document.getElementsByTagName('td');
var select = document.getElementsByTagName('select')[0];
var activity;	//活动块
//声明二维数组,存放坐标
var arr = new Array();
var i = 20;
for(var j = 0;j < 10;j ++){
	arr[j] = new Array();
	for(var k = 0;k < 10;k ++){
		arr[j][k] = tds[i];
		i++;
	}
}
//初始化
function initial(){
	arr[5][5].appendChild(createTop());
	activity = document.querySelector('.red_blue').parentNode;
}
//创建四种不同的活动块
function createTop(){
	var newDiv = document.createElement('div');
	newDiv.className = 'red_blue top anim_top';
	return newDiv;
}
function createLeft(){
	var newDiv = document.createElement('div');
	newDiv.className = 'red_blue left anim_left';
	return newDiv;
}
function createRight(){
	var newDiv = document.createElement('div');
	newDiv.className = 'red_blue right anim_right';
	return newDiv;
}
function createBottom(){
	var newDiv = document.createElement('div');
	newDiv.className = 'red_blue bottom anim_bottom';
	return newDiv;
}

//转换方向
function direction(){
	document.getElementById('run').addEventListener('click', function(){
		var sub = document.querySelector('.red_blue');
		var clonesub = sub;
		activity = sub.parentNode;
		var index = select.selectedIndex;
		var text = select.options[index].text;		//选择文本
		var nowi;
		var nowj;
		for(var i = 0;i < 10;i ++){
			for(var j = 0;j < 10;j++){
				if(arr[i][j] == activity){
					nowi = i;
					nowj = j;
					break;
				}
			}
		}

		function mov_top(){
			if(nowi > 0){
				arr[nowi][nowj].removeChild(sub);
				arr[nowi - 1][nowj].appendChild(createTop());
			}else{
				alert('以到达边界');
			}
		}

		function mov_left(){
			if(nowj > 0){
				arr[nowi][nowj].removeChild(sub);
				arr[nowi][nowj - 1].appendChild(createLeft());
			}else{
				alert('以到达边界');
			}
		}

		function mov_right(){
			if(nowj < 9){
				arr[nowi][nowj].removeChild(sub);
				arr[nowi][nowj + 1].appendChild(createRight());
			}else{
				alert('以到达边界');
			}
		}

		function mov_bottom(){
			if(nowi < 9){
				arr[nowi][nowj].removeChild(sub);
				arr[nowi + 1][nowj].appendChild(createBottom());
			}else{
				alert('以到达边界');
			}
		}

		function border_direction(){
			if(document.defaultView.getComputedStyle(sub, null).borderTopStyle == 'solid'){
					clonesub.className = 'red_blue top';
			}else if(document.defaultView.getComputedStyle(sub, null).borderLeftStyle == 'solid'){
				clonesub.className = 'red_blue left';
			}else if(document.defaultView.getComputedStyle(sub, null).borderRightStyle == 'solid'){
				clonesub.className = 'red_blue right';
			}else{
				clonesub.className = 'red_blue bottom';
			}
		}

		function turn_left(){
			if(document.querySelector('.left')){
				sub.className = 'red_blue bottom';
				sub.className += ' turn_left1';
			}else if(document.querySelector('.top')){
				sub.className = 'red_blue left turn_left2';
			}else if(document.querySelector('.right')){
				sub.className = 'red_blue top turn_left3';
			}else{
				sub.className = 'red_blue right turn_left4';
			}
		}

		function turn_right(){
			if(document.querySelector('.left')){
				sub.className = 'red_blue top turn_right1';
			}else if(document.querySelector('.top')){
				sub.className = 'red_blue right turn_right2';
			}else if(document.querySelector('.right')){
				sub.className = 'red_blue bottom turn_right3';
			}else{
				sub.className = 'red_blue left turn_right4';
			}
		}

		function turn_back(){
			if(document.querySelector('.left')){
				sub.className = 'red_blue right turn_right1';
			}else if(document.querySelector('.top')){
				sub.className = 'red_blue bottom turn_back1';
			}else if(document.querySelector('.right')){
				sub.className = 'red_blue left turn_left1';
			}else{
				sub.className = 'red_blue top turn_back2';
			}
		}

		if(text.toLowerCase() == 'go'){
			if(document.querySelector('.top')){
				mov_top();
			}else if(document.querySelector('.bottom')){
				mov_bottom();
			}else if(document.querySelector('.left')){
				mov_left();
			}else{
				mov_right();
			}
		}
		else if(text == 'lef'){
			turn_left();
		}
		else if(text == 'rig'){
			turn_right();
		}
		else if(text == 'bac'){
			turn_back();
		}
		else if(text== 'TRA LEF'){
			if(nowj > 0){
				border_direction();
				clonesub.className += ' anim_left';
				arr[nowi][nowj].removeChild(sub);
				arr[nowi][nowj - 1].appendChild(clonesub);
			}else{
				alert('以到达边界');
			}
		}
		else if(text == 'TRA TOP'){
			if(nowi > 0){
				border_direction();
				clonesub.className += ' anim_top';
				arr[nowi][nowj].removeChild(sub);
				arr[nowi - 1][nowj].appendChild(clonesub);
			}else{
				alert('以到达边界');
			}
		}
		else if(text == 'TRA RIG'){
			if(nowj < 9){
				border_direction();
				clonesub.className += ' anim_right';
				arr[nowi][nowj].removeChild(sub);
				arr[nowi][nowj + 1].appendChild(clonesub);
			}else{
				alert('以到达边界');
			}
		}
		else if(text == 'TRA BOT'){
			if(nowi < 9){
				border_direction();
				clonesub.className += ' anim_bottom';
				arr[nowi][nowj].removeChild(sub);
				arr[nowi + 1][nowj].appendChild(clonesub);
			}else{
				alert('以到达边界');
			}
		}
		else if(text == 'MOV LEF'){
			mov_left();
		}
		else if(text == 'MOV TOP'){
			mov_top();
		}
		else if(text == 'MOV RIG'){
			mov_right();
		}
		else if(text == 'MOV BOT'){
			mov_bottom();
		}
	});
}

window.addEventListener('load', function(){
	initial();
	direction();
});