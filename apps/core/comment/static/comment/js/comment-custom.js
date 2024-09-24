$(document).ready(function () {
    // run init comment custom
    CommentHandle.init()
});

class CommentHandle {

    static load_emoji(){
        const $emojiElm = $('.emoji_wrapbox')
        const iconLst = ['fa-regular fa-face-smile', 'fa-solid fa-basketball', 'fa-solid fa-music', 'fa-solid fa-shirt',
        'fa-solid fa-cat', 'fa-solid fa-car', 'fa-solid fa-burger', 'fa-regular fa-flag']
        $.fn.callAjax2({
            'url': $emojiElm.attr('data-url'),
            'method': 'get',
        }).then(
            (resp) => {
                let data = resp, listHTML = '', listCategory = '';
                for (let idx in data){
                    let item = data[idx];
                    listCategory += `<button type="button" tabindex="0" class="epr-btn"><i class="${iconLst[idx]}"></i></button>`;
                    for (let val of item){
                        listHTML += `<li><a href="#" title="${val.name}">${val['html']}</a></li>`
                    }
                    $('.emoji-list',$emojiElm).html(listHTML)
                    listHTML = ''
                }
                $('.emoji-category-nav',$emojiElm).html(listCategory)
            });
    }

    static init() {
        // load emoji for comment popup
        CommentHandle.load_emoji()
    };
}