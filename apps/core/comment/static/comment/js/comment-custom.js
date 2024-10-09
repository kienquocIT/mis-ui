$(document).ready(function () {
    // run init comment custom
    CommentHandle.init();
});

function checkTime(data){
    const momentDateData = moment(data), momentDateNow = moment(),
        sevenDaysAgo = momentDateNow.clone().subtract(7, 'days');

    if (momentDateNow.isSame(data, 'year'))
        if (momentDateNow.isSame(data, 'month')) {
            if (momentDateNow.diff(data, 'days') <= 7)
                return momentDateData.fromNow();
            else
                return momentDateData.format("DD-MMM");
        }
        else if (momentDateData.isAfter(sevenDaysAgo))
            return momentDateData.format("DD-MMM");
    return momentDateData.format("DD/MM/YYYY")
}

class CommentHandle {

    static convert_to_ID(txt){
        return txt.toLowerCase().replace(/ /g, '_').replace(/&/g, '');
    }

    static ClickIconGroup(){
        const $navElm = $('.emoji-category-nav'), $emoBody = $('.emoji-body')
        $('button:not(is_clicked)', $navElm).on('click', function(){
            $('button', $navElm).removeClass('is_clicked')
            $(this).addClass('is_clicked')
            let isID = $(this).attr('data-id')
            $emoBody.animate({ scrollTop: $emoBody.scrollTop() + $(`#${isID}`).offset().top - $emoBody.offset().top}, "fast");
        });
    }

    static ClickIcon(elm= undefined){
        const $elmIcon = $('.emoji-list');
        $('a', $elmIcon).on('click', function(e){
            let $txtArea = $('.custom_comment.is_actived .input_txt');
            if (elm) $txtArea = $('.input_txt', elm)
            e.preventDefault();
            let currentVal = $('textarea', $txtArea).val(), txtCode = this.textContent;
            if ($(this).find('span')) txtCode = $(this).find('span').text()
            $('textarea', $txtArea).val(currentVal+ txtCode);
        })
    }

    static ClickReply(){
        $('.item-comment .reply-cmt').on('click', function(){
            let $this = $(this), $parent = $this.closest('.card'), $item = $this.closest('.item-comment');
            let cloneHTML = $parent.find('.custom_comment').html();
            let empCode = JSON.parse($item.find('.cmt-name').attr('data-self').replaceAll("'", '"'))
            if ($item.find('.rep_comment_input').length !== 1)
                $item.append(`<div class="rep_comment_input">${cloneHTML}</div>`)
            let _new = []
            _new.push(empCode)
            $item.find('textarea').val(`@${empCode.code} `).data('data-mention', _new).focus()
            // click show popup emoji
            $('.emoji_btn', $item).on('click', function (e) {
                let $wrap = $('.emoji_wrapbox');
                let x = e.clientX;
                let y = e.clientY + 15;
                if ($(this).offset().top >= 438) y -= 460
                $wrap.css({'top': y, 'left': x}).toggleClass('is_showed')
                $(this).closest('.rep_comment_input').toggleClass('is_actived')
            });
            // run mention each input text
            CommentHandle.RunMentionTextarea($('.input_txt textarea', $item))
            // click show modal icon
            CommentHandle.ClickIcon($item)
            // run click submit function
            CommentHandle.CreateMessages($item)

        });
    }

    static replaceToHTMLComment(data){
        if(data){
            let messages = data.msg.split(" ");
            let mentions = data.mentions
            for (let idx in messages){
                let item = messages[idx]
                if (item.includes('@')){
                    let temp = item.slice(1, item.length);
                    const _employeeMention = mentions.filter((ment) => ment.code === temp)
                    if (_employeeMention.length)
                        messages[idx] = `<a href="#" class="txt_link">@${_employeeMention[0].full_name}</a>`
                }
            }
            let avatar, avtClass = 'avatar-xs';
            if (data['reply_from_id']) avtClass = 'avatar-xxs'
            if (data.employee_inherit.avatar_img)
                avatar = `<div class="avatar avatar-rounded avatar-grey ${avtClass}"><img src="${data.employee_inherit.avatar_img}" alt="user" class="avatar-img"></div>`
            else avatar = $x.fn.renderAvatar(data.employee_inherit, avtClass +' avatar-' +
                $x.fn.randomColor(), "", "full_name")

            let cmtBtn = `<a href="#" class="reply-cmt">${$.fn.gettext('Reply')}</a>`,
                childCmt = '<div class="child-comment"></div>'
            if (data['reply_from_id'] !== null){
                cmtBtn = ''
                childCmt = ''
            }

            return `<div class="item-comment" data-msg-id="${data.id}">${avatar}<div><p class="cmt-name" data-self="${JSON.stringify(data.employee_inherit).replaceAll('"', "'")}">`+
                `${data.employee_inherit.full_name}</p><p>${messages.join(" ")}</p>`+
                `<p class="nav-cmt">${moment(data.date_created).fromNow(true)}${cmtBtn}</p></div>${childCmt}</div>`
        }
        return '';
    }

    static CreateMessages(elm=undefined){
        let $submitBtn = $('.send_btn');
        if (elm) $submitBtn = $('.send_btn', elm)
        $submitBtn.on('click', function () {
            let $thisDiv = $(this).closest('.card')
            $(this).addClass('disabled')
            let data_req = {
                "news": $thisDiv.attr('data-id'),
                "msg": $thisDiv.find('.input_txt textarea').val()
            }
            if (!data_req.msg) {
                $(this).removeClass('disabled')
                return true
            }
            let mention = $thisDiv.find('.input_txt textarea').data('data-mention')
            if (mention) data_req.mentions = mention.map((emp) => { return emp.id })
            if (elm)
                data_req.reply_from = elm.attr('data-msg-id')

            // get data
            let $elmUrl = $('#url-factory')
            $.fn.callAjax2({
                'url': $elmUrl.attr('data-comment-create'),
                'method': 'post',
                'data': data_req,
                'sweetAlertOpts': {'allowOutsideClick': true},
            }).then(
                (resp) => {
                    const data_res = $.fn.switcherResp(resp);
                    if (data_res) {
                        $.fn.notifyB({description: data_res.message}, 'success')
                        $(this).removeClass('disabled')
                        data_res.mentions = mention
                        if (elm)
                            elm.find('.child-comment').append(CommentHandle.replaceToHTMLComment(data_res))
                        else $thisDiv.find('.content_comment').append(CommentHandle.replaceToHTMLComment(data_res))

                        $thisDiv.find('.input_txt textarea').val('')
                        // run click reply
                        CommentHandle.ClickReply()
                    }
                },
                (error) => {
                    console.log('call submit error', error)
                }
            )
        });
    }

    static loadMessages(){
        let $chatIcon = $('.icon_wrap')
        $chatIcon.on('click', function(){
            const _this = $(this), _news_id = _this.closest('.card').attr('data-id');
            _this.closest('.card').find('.custom_comment').removeClass('hidden')
            _this.closest('.card').find('.icon_wrap').addClass('hidden')

            let $elmUrl = $('#url-factory')
            $.fn.callAjax2({
                'url': $elmUrl.attr('data-comment-create'),
                'method': 'get',
                'data': {'news': _news_id}
            })
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        let html = '', htmlChild = {};

                        for(let item of data['messages_list']){
                            if (item['reply_from_id']){
                                if (htmlChild[item['reply_from_id']] !== undefined)
                                    htmlChild[item['reply_from_id']] += CommentHandle.replaceToHTMLComment(item)
                                else htmlChild[item['reply_from_id']] = CommentHandle.replaceToHTMLComment(item)
                            }
                            else
                                html += CommentHandle.replaceToHTMLComment(item)
                        }
                        _this.closest('.card').find('.content_comment').append(html).removeClass('hidden')
                        let $elm = _this.closest('.card').find('.content_comment')
                        for (let item in htmlChild){
                            const $child_comment = $(`[data-msg-id="${item}"]`, $elm).find('.child-comment')
                            $child_comment.append(htmlChild[item])
                            const height = $child_comment.height() - 24 - $('.item-comment:last-child', $child_comment).height()
                            $child_comment.append(`<span class="child-height" style="height: ${height}px"></span>`)
                        }
                        // run click reply
                        CommentHandle.ClickReply()
                    },
                    (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
                )
        });
    }

    static load_emoji(){
        const $emojiElm = $('.emoji_wrapbox'), $emBody = $('.emoji-body'),
        iconLst = ['fa-regular fa-face-smile', 'fa-solid fa-basketball', 'fa-solid fa-music', 'fa-solid fa-shirt',
        'fa-solid fa-cat', 'fa-solid fa-car', 'fa-solid fa-burger', 'fa-regular fa-flag'];
        $.ajax({
            'url': $emojiElm.attr('data-url'),
            'method': 'get',
            success: function (rest) { // textStatus, jqXHR
                let data = rest, listHTML = '', listCategory = '', idx = 0;

                for (let val in data){
                    let is_id = CommentHandle.convert_to_ID(val)
                    listCategory += `<button type="button" tabindex="0" class="epr-btn ${
                        idx === 0 ? 'is_clicked' : ''
                    }" data-id="${is_id}"><i class="${iconLst[idx]}"></i></button>`;

                    let item = data[val], $divElm = $(`<div class="emoji_row" id="${is_id}"><h6></h6><div class="emoji-list"></div>`);
                    $divElm.find('h6').text(val)
                    for (let val of item){
                        let code  = val['html']
                        // if (val.icon) code = `<i class="${val.icon}"></i>`
                        listHTML += `<p><a href="#" title="${val.name}">${code}<span class="hidden">${val['html']}</span></a></p>`
                    }
                    $divElm.find('.emoji-list').append(listHTML)
                    $emBody.append($divElm.prop('outerHTML'))
                    listHTML = ''
                    idx++
                }
                $('.emoji-category-nav', $emojiElm).html(listCategory)
                CommentHandle.ClickIconGroup()
                CommentHandle.ClickIcon()
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error: ', jqXHR, textStatus, errorThrown);
            },
        });

    }

    static RunMentionTextarea(elm){
        function selectEmployeeMention(txtareaElm){
            $('.modal-mention li').on('click', function(){
                let crt = txtareaElm.data('data-mention') || [];
                crt.push({
                    "id": $(this).attr('data-id'),
                    "code": $(this).attr('data-code'),
                    "full_name": $(this).find('span').text(),
                    "avatar_img": $(this).attr('data-avt'),
                })
                txtareaElm.data('data-mention', crt);

                let crtVal = txtareaElm.val();
                crtVal = crtVal.split(" ");
                crtVal.pop();
                crtVal.push('@'+$(this).attr('data-code'))
                txtareaElm.val(crtVal.join(" "))
                $('.modal-mention').addClass('hidden')
            })
        }
        function callData(data, elm){
            let $empUrl = $('#employee-mention')
            $.fn.callAjax2({
                'url': $empUrl.attr('data-url'),
                'method': 'get',
                'data': {
                    'search': data,
                    'list_from_app': 'project.project.view',
                }
            })
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp), employee_lst = data['employee_list'],
                        cmtHTML = '';
                        for (let item of employee_lst){
                            let img = '/static/assets/images/systems/person-avt.png'
                            if (item.avatar_img) img = item.avatar_img
                            cmtHTML += `<li data-id="${item.id}" data-code="${item.code}" data-avt="${item.avatar_img}"><img src="${img}" alt="${
                                item.full_name}" class="m-3"><div><span>${item.full_name}</span><b>${item?.group?.title
                            }</b></div></li>`;
                        }
                        $empUrl.html(cmtHTML)
                        selectEmployeeMention(elm)
                        const coords = getCaretCoordinates(elm[0], elm[0].selectionEnd),
                        elmCoord = elm[0].getBoundingClientRect();
                        const top = coords.top + elmCoord.top + window.scrollY,
                            left = coords.left + elmCoord.left + window.scrollX
                        $('.modal-mention').removeClass('hidden').css({'top': top, 'left': left})
                        elm.attr('data-flag', false)
                    }
                )
        }

        // fire function wait use stop typing..
        function debounce(callback, wait) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    callback.apply(this, args);
                }, wait);
            };
        }
        elm.on('keydown', function(event){
            if (event.key === 'Enter')
                elm.css('height', elm.height() + 21)
            if (elm[0].selectionStart === 0) elm.css('height', 20)
            let caret = getCaretCoordinates(elm[0], elm[0].selectionEnd);

            // reset height when delete all text
            if (caret.left === 0 && event.key === 'Backspace' && elm[0].selectionStart !== 0)
                elm.css('height', elm.height() - 21)

            // delete employee when user erase mention
            let strArray = event.target.value.split(" ");
            const lastStr = strArray[strArray.length - 1];

            if (event.key === 'Backspace' && lastStr.includes('@') && lastStr.length <= 3){
                let mention_lst = $(this).data('data-mention')
                console.log('before', mention_lst)
                for (let idx in mention_lst){
                    const emp = mention_lst[idx]
                    if (!strArray.includes(emp.code)){
                        mention_lst = mention_lst.splice(idx, 1)
                        break;
                    }
                }
                console.log('after', mention_lst)
                $(this).data('data-mention', mention_lst)
            }

        }).on('keyup', debounce( function(event){
            let strArray = event.target.value.split(" ");
            const lastStr = strArray[strArray.length - 1];
            let isCall = elm.attr('data-flag');
            if (lastStr.includes('@') && lastStr.length >= 3 &&
                (isCall === false || isCall === undefined || isCall === 'false')) {
                elm.attr('data-flag', true);
                callData(lastStr.slice(1, lastStr.length), elm)
            }else $('.modal-mention').addClass('hidden')

        }, 1000));
    }

    static load_news(page=1){
        // get data
        let $elmUrl = $('#url-factory')
        $.fn.callAjax2({
            'url': $elmUrl.attr('data-comment-list'),
            'method': 'get',
            'data': {'page': page,
            'list_from_app': 'project.project.view',
            }
        })
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp), comment_lst = data['project_activities_list'],
                        cmtHTML = '';
                    for (let item of comment_lst) {
                        let cmtTemp = $($('.box_comment').html());
                        if (item.employee_inherit.avatar_img)
                            cmtTemp.find('.avatar-img').attr({
                                'src': item.employee_inherit.avatar_img,
                                'alt': item.employee_inherit.full_name
                            })
                        // short name
                        cmtTemp.find('.heading_txt').html(`
                            <span class="txt-link">${item.employee_inherit.full_name}</span> ${item['title']} <b>"${
                            item['document_title']}"</b> in <span class="txt-link prj_info" data-project="${item.project.id}">${item.project.title}</span>.<p></p>`)
                        cmtTemp.find('.card-text').val(item.msg)
                        cmtTemp.find('.heading_txt p').append('<i class="fa-regular fa-clock"></i>' + checkTime(item.date_created))
                        cmtTemp.attr('data-id', item.id)
                        cmtTemp.find('.icon_wrap span').text(item['count_comment'])
                        cmtHTML += cmtTemp.prop('outerHTML')
                    }
                    // render feed
                    $('.wrap_comment').html(cmtHTML)

                    // load emoji for comment popup
                    CommentHandle.load_emoji()
                    // run action load comment when click view comment icon
                    CommentHandle.loadMessages()
                    // load action submit comment
                    CommentHandle.CreateMessages()
                    // click show popup emoji
                    let $btn = $('.emoji_btn')
                    $btn.on('click', function (e) {
                        let $wrap = $('.emoji_wrapbox');
                        let x = e.clientX;
                        let y = e.clientY + 15;
                        if ($(this).offset().top >= 438) y -= 460
                        $wrap.css({'top': y, 'left': x}).toggleClass('is_showed')
                        $(this).closest('.custom_comment').toggleClass('is_actived')
                    });
                    // run mention each input text
                    $('.wrap_comment .card').each(function () {
                        const TxtArea = $(this).find('.input_txt textarea')
                        CommentHandle.RunMentionTextarea(TxtArea)
                    })
                },
                (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
            )
}

    static init() {
        CommentHandle.load_news()

        // click close emoji popup
        document.addEventListener('click', function (event) {
            let $wrap = $('.emoji_wrapbox'), $mdMention = $('.modal-mention');
            // Check if click is outside the popup
            if (!$wrap[0].contains(event.target) && !$(event.target.parentElement).hasClass('emoji_btn')){
                // Close the popup
                $wrap.removeClass('is_showed');
                $('.custom_comment').removeClass('is_actived');
            }
            // Check if click is outside mention popup
            if (!$mdMention[0].contains(event.target) && !$(event.target.parentElement).hasClass('modal-mention'))
                // Close the mention popup
                $mdMention.addClass('hidden');
        });
    };
}