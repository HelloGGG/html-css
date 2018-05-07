function writeContent(input){
	var result = [];
	var markPattern = [					//先处理块级标记,行内单独处理,因为块内可包含行内
		{reg:/^#\s+(.*)$/,name:'h1'},
		{reg:/^#{2}\s+(.*)$/,name:'h2'},
		{reg:/^#{3}\s+(.*)$/,name:'h3'},
		{reg:/^#{4}\s+(.*)$/,name:'h4'},
		{reg:/^#{5}\s+(.*)$/,name:'h5'},
		{reg:/^#{6}\s+(.*)$/,name:'h6'},
		{reg:/^[*-+]\s(.*)$/,name:'ul'},
		{reg:/^[0-9]+\.\s(.*)$/,name:'ol'},
		{reg:/^>\s(.*)$/,name:'quote'},
		{reg:/^```(.+)/,name:'blockopen'},
		{reg:/(.+)```$/,name:'blockclose'},
		{reg:/^-{3}$/,name:'hr'}
	];
	for(let inputEle of input){
		let last;
		if(result.length  > 0){
			last = result[result.length - 1];
		}
		else{
			last = null;
		}
		for(let patternEle of markPattern){
				
			if(patternEle.reg.test(inputEle)){
				if(patternEle.name === 'h1'||patternEle.name === 'h2'||patternEle.name === 'h3'||patternEle.name === 'h4'||patternEle.name === 'h5'||patternEle.name === 'h6'||patternEle.name === 'quote'){
					result.push({content:RegExp.$1,type:patternEle.name});break;
				}
				if(patternEle.name === 'ul' || patternEle.name === 'ol'){
					if(last !== null && last.type === patternEle.name){
						last.content.push(RegExp.$1);break;
					}else{
						result.push({content:[RegExp.$1],type:patternEle.name});
						break;
					}
				}
				if(patternEle.name === 'hr'){
					result.push({content:'',type:patternEle.name});
					break;
				}
				if(patternEle.name === 'blockopen'||patternEle.name=== 'blockclose'){
					result.push({content:RegExp.$1,type:patternEle.name});
					break;
				}
				

			}else{
				if(patternEle === markPattern[markPattern.length - 1]){
					if(last !== null && last.type === 'blockopen'){
						result.push({content:inputEle,type:'blockopen'});
					}else{
						result.push({content:inputEle,type:'p'});
					}
				}
			}
		}

	}

	return result;
}

function display(input){		
	var displayResult = [];
	for(let e of input){
		if(e.type === 'ul'||e.type ==='ol'){
			let con = '';
			for(let e1 of e.content){
				con += `<li>${e1}</li>`;
			}
			displayResult.push(`<${e.type}>${replace(con)}</${e.type}>`);
			continue;
		}
		if(e.type === 'quote'){
			displayResult.push(`<div class="quote">${replace(e.content)}</div>`);
			continue;
		}
		if(e.type === 'blockopen'||e.type === 'blockclose'){
			displayResult.push(`<pre class="codeblock">${replace(e.content)}</pre>`);
			continue;
		}
		displayResult.push(`<${e.type}>${replace(e.content)}</${e.type}>`);
	}
	return displayResult.join('');
}

function replace(str){		//处理行内标志
	return str.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/`(.+?)`/g,'<code>$1</code>').replace(/!\[(.+?)\]\((.+?)\)/g,'<img src=$2 alt=$1>').replace(/\[(.+?)\]\((.+?)\)/g,'<a href=$2>$1</a>');
}

function initialize(){
	var input = document.getElementsByTagName('textarea')[0].value.split('\n');
	var writeResult = writeContent(input);
	document.getElementsByClassName('display')[0].innerHTML = display(writeResult);
}

window.onload = function(){
	initialize();
	document.getElementsByTagName('textarea')[0].addEventListener('input', function(){
		initialize();
	});
}