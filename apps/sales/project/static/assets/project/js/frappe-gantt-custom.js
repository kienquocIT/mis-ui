$(document).ready(function(){

});

class fGanttCustom {
    static setup_left_header(title_list){
        // return HTML
        const parentElm = document.querySelector('.gantt-left')
        let left_header = document.createElement('div')
        left_header.classList.add('gantt-wrap-title');
        let stringHTML = '';
        let total_w = 0
        for (let item of title_list['left_list']){
            total_w += item.width
            stringHTML += (`<div style="width: ${item.width}px;"><p>${item.name}</p></div>`)
        }
        left_header.innerHTML = stringHTML
        parentElm.innerHTML = ''
        parentElm.appendChild(left_header)
        parentElm.style.width = total_w
    }

    static setup_left_content(data){
        console.log('after call back ', data)
    }
}