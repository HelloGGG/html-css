function block(input) {         //input为数组,将输入源变为数组,由'\n'分隔
    let blockPatterns = [
        { pattern: /^#\s+(.*)/, name: 'h1' },
        { pattern: /^#{2}\s+(.*)/, name: 'h2' },
        { pattern: /^#{3}\s+(.*)/, name: 'h3' },
        { pattern: /^#{4}\s+(.*)/, name: 'h4' },
        { pattern: /^#{5}\s+(.*)/, name: 'h5' },
        { pattern: /^={6,}\s*$/, name: 'header' },
        { pattern: /^-{6,}\s*$/, name: 'subheader' },
        { pattern: /^>\s+(.*)/, name: 'blockquote' },
        { pattern: /^\s*$/, name: 'blank' },
        { pattern: /^[-*]\s+(.*)/, name: 'ul' },
        { pattern: /^[0-9]+\.\s+(.*)/, name: 'ol' },
        { pattern: /^-{3,5}\s*$/, name: 'hr' },
        { pattern: /^`{3,}\s*$/, name: 'codeblockopen' },
        { pattern: /(.+)/, name: 'para' }
    ]
    let result = [];
    var last;
    for (let lineNumber in input) {         //遍历数组
        for (let obj of blockPatterns) {    //遍历对象数组
            if (obj.pattern.test(input[lineNumber])) {
                if (result.length > 0) {
                    last = result[result.length - 1];
                    if (last.type === 'codeblockopen') {
                        if (obj.name === 'codeblockopen') {
                            last.type = 'pre';
                        } else {
                            last.content += (RegExp.input + '\n');
                        }
                        break;
                    }
                } else {
                    last = null;
                }
                switch (obj.name) {
                    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'blockquote':
                        result.push({ content: RegExp.$1, type: obj.name });
                        break;
                    case 'header':
                        if (last) {
                            last.type = 'h1';
                        }
                        break;
                    case 'subheader':
                        if (last) {
                            last.type = 'h2';
                        }
                        break;
                    case 'blank': case 'hr': case 'codeblockopen':
                        result.push({ content: '', type: obj.name });
                        break;
                    case 'para':
                        if (!last) {
                            result.push({ content: RegExp.$1, type: 'p' });
                            break;
                        }
                        if (last.type === 'p' || last.type === 'blockquote') {
                            last.content += (' ' + RegExp.$1);
                        }
                        else {
                            result.push({ content: RegExp.$1, type: 'p' });
                        }
                        break;
                    case 'ul': case 'ol':
                        if (last.type === obj.name) {
                            last.content.push(RegExp.$1);
                        } else {
                            result.push({
                                content: [RegExp.$1],
                                type: obj.name
                            })
                        }
                        break;
                }
                break;
            }
        }
    }
    return result;
}
// this **![Link](https://www.baidy.com)**
function inline(input) {        //显示效果
    var result = [];
    for (let obj of input) {
        if (obj.type === 'blank') {
            continue;
        }
        if (obj.type === 'pre') {
            result.push('<pre>' + obj.content + '</pre>');
            continue;
        }
        if (obj.type === 'ol' || obj.type ==='ul'){
            let content = '<'+obj.type + '>';
            for(let item of obj.content){
                content += `<li>${replace(item)}</li>`;
            }
            content += '</'+obj.type + '>';
            result.push(content);
            continue;
        }
        result.push(`<${obj.type}>${replace(obj.content)}</${obj.type}>`);
    }
    return result.join('');         //数组转为字符串
}
function replace(str) {
    var start = str.indexOf('`');
    var end = str.indexOf('`', start + 1);
    if (start == -1 || end == -1) {
        return str.replace(/\*\*(.+?)\*\*/g, `<strong>$1</strong>`).replace(/\*(.+?)\*/g, `<em>$1</em>`);
    } else {
        return replace(str.substring(0,start)) +'<code>'+ str.substring(start + 1,end) + '</code>' + replace(str.substring(end + 1,str.length));
    }
}
function markmark(source) {
    var input = source.split('\n');
    var blockResult = block(input);
    
    return inline(blockResult);
}