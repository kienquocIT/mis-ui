$(document).ready(function () {
    // get comment id
    const _cmtID = $.fn.getPkDetail();
    // get detail comment
    $.fn.callAjax2({
        'url': $('#url-factory').attr('data-comment-detail').format_url_with_uuid(_cmtID),
        'method': 'get',
        'sweetAlertOpts': {'allowOutsideClick': true},
    })
        .then(
            (resp) => {
                let data = $.fn.switcherResp(resp), cmtHTML = '';

                // render HTML News
                for (let item of data.news) {
                    let cmtTemp = $($('.box_comment').html());
                    if (item.employee_inherit.avatar_img)
                        cmtTemp.find('.avatar-img').attr({
                            'src': item.employee_inherit.avatar_img,
                            'alt': item.employee_inherit.full_name
                        })
                    // short name
                    cmtTemp.find('.heading_txt').html(`
                            <span class="txt-link">${item.employee_inherit.full_name}</span> ${item['title']} <b>"${
                        item['document_title']}"</b> ${$.fn.gettext('in')} <span class="txt-link prj_info" data-project="${item.project.id}">${item.project.title}</span>.<p></p>`)
                    cmtTemp.find('.card-text').val(item.msg)
                    cmtTemp.find('.heading_txt p').append('<i class="fa-regular fa-clock"></i>' + checkTime(item.date_created))
                    cmtTemp.attr('data-id', item.id)
                    cmtTemp.find('.icon_wrap span').text(item['count_comment'])
                    cmtHTML += cmtTemp.prop('outerHTML')
                }
                let $WrapCmt = $('.wrap_comment')
                $WrapCmt.html(cmtHTML)
                $WrapCmt.find('.custom_comment').removeClass('hidden')
                $WrapCmt.find('.icon_wrap').addClass('hidden')

                // render HTML comment
                let html = '', htmlChild = {};
                for (let item of data.sequence) {
                    if (item['reply_from_id']) {
                        if (htmlChild[item['reply_from_id']] !== undefined)
                            htmlChild[item['reply_from_id']] += CommentHandle.replaceToHTMLComment(item)
                        else htmlChild[item['reply_from_id']] = CommentHandle.replaceToHTMLComment(item)
                    } else
                        html += CommentHandle.replaceToHTMLComment(item)
                }

                let $elm = $WrapCmt.find('.content_comment')
                $elm.append(html).removeClass('hidden')
                for (let item in htmlChild) {
                    const $child_comment = $(`[data-msg-id="${item}"]`, $elm).find('.child-comment');
                    $child_comment.append(htmlChild[item])
                    const height = $(`[data-msg-id="${item}"]`, $elm).height() - 24 - $('.item-comment:last-child', $child_comment).height()
                    $child_comment.append(`<span class="child-height" style="height: ${height}px"></span>`)
                }

                $(`.item-comment[data-msg-id="${_cmtID}"]`, $elm)[0].scrollIntoView()
                $(`.item-comment[data-msg-id="${_cmtID}"] > div:nth-child(2)`, $elm).addClass('animated pulse')

                // run click reply
                CommentHandle.ClickReply()
                CommentHandle.load_emoji()

                // click show popup emoji
                let $btn = $('.emoji_btn');
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
                });

                // run submit btn
                let $btnSubmit = $('.send_btn')
                CommentHandle.CreateMessages($btnSubmit)
            },
            (error) => {
                console.log('error', error)
            }
        )
});