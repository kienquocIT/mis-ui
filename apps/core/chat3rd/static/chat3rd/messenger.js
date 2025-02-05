class SiteControl {
    get eleGlobal$() {
        return $('#current-chat');
    }

    get eleSite$() {
        return $('#chat-site');
    }

    get eleAction$() {
        return $("#chat-site-actions");
    }

    get eleLoading$() {
        return this.eleAction$.find('[data-code=loading]');
    }

    get eleActionAdvance$() {
        return this.eleAction$.find('.site-actions-advance');
    }

    get elePageList$() {
        return $('#messenger-chat-list');
    }

    get eleBtnCollapse$() {
        return $('#btn-collapse-site');
    }

    collapseToggle() {
        this.eleBtnCollapse$.toggleClass('active');
        this.eleSite$.find('.site-label').toggle();
        this.eleActionAdvance$.toggle();
        this.elePageList$.find('.body-item-title').toggle();
        this.elePageList$.find('a[data-code="link-to-meta-messenger"]').toggle();
        this.eleSite$.toggleClass('flex-none');
        this.eleAction$.parent().toggleClass('justify-content-center');
    }

    btnSync(connectId) {
        const clsThis = this;
        const btnSync$ = $(`
                <button class="btn btn-icon btn-rounded btn-flush-primary btn-xs">
                    <span class="icon">
                        <i class="fa-solid fa-rotate"></i>
                    </span>
                </button>
            `);
        btnSync$.on('click', function () {
            Swal.fire({
                title: $.fn.gettext("Sync pages from main accounts."),
                html: $.fn.gettext("Only pages with access from the main account will be kept. Pages with lost access will be removed."),
                showCancelButton: true,
                icon: 'question',
                confirmButtonText: $.fn.gettext('Confirm'),
                cancelButtonText: $.fn.gettext('Cancel'),
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    const urlSync = clsThis.eleAction$.data('url-sync').replaceAll('__pk__', connectId);
                    $.fn.callAjax2({
                        url: urlSync,
                        method: 'POST',
                        data: {},
                        isLoading: true,
                    }).then(
                        resp => {
                            const data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({
                                    'description': $.fn.gettext('Successful'),
                                }, 'success');
                                setTimeout(
                                    () => window.location.reload(),
                                    1200
                                );
                            }
                        },
                        errs => console.log('errs:', errs),
                    )
                }
            })
        });
        clsThis.eleActionAdvance$.prepend(btnSync$);
    }

    deActive() {
        this.elePageList$.find('.body-item').removeClass('active');
    }

    active(eleSite$, itemPage) {
        if (!eleSite$.hasClass('active')) {
            this.deActive();
            eleSite$.addClass('active');
            const conCls = new Conversation();
            conCls.deActive();
            conCls.empty();
            conCls.call(itemPage);
        }
    }

    static getPagePicture(pageData) {
        return pageData?.['picture']?.['data']?.['url'];
    }

    static getPageLink(pageData) {
        return pageData?.['link'];
    }

    add(itemPage) {
        const pagePicture = SiteControl.getPagePicture(itemPage);
        const pageLink = SiteControl.getPageLink(itemPage);
        const itemPage$ = $(`
            <div class="body-item">
                <div>
                    <div class="avatar avatar-rounded avatar-xs mr-1">
                        <img src="${pagePicture}" alt="user" class="avatar-img">
                    </div>
                    <span class="body-item-title">${itemPage.name}</span>
                </div>
                <a
                    target="_blank"
                    href="${pageLink}"
                    class="btn btn-icon btn-rounded btn-flush-primary btn-xs"
                    data-code="link-to-meta-messenger"
                >
                    <span>
                        <span class="icon">
                            <i class="fa-brands fa-facebook"></i>
                        </span>
                    </span>
                </a>
            </div>
        `);
        itemPage$.data('page', itemPage);
        this.elePageList$.append(itemPage$);
        itemPage$.data('page', itemPage);
        return itemPage$;
    }

    call() {
        const clsThis = this;
        clsThis.eleBtnCollapse$.on('click', function () {
            clsThis.collapseToggle();
        });
        $.fn.callAjax2({
            url: this.eleSite$.data('url-connected-data'),
            method: 'GET',
            errorOnly: true,
            error: function (jqXHR, textStatus, errorThrown) {
                let resp_data = jqXHR.responseJSON;
                if (resp_data && typeof resp_data === 'object') {
                    const status = resp_data?.['status'];
                    clsThis.eleLoading$.remove();
                    if (status === 404) {
                        const path = window.location.origin + '/chat3rd/messenger/connected';
                        const addNew$ = $(`
                            <a
                                href="https://www.facebook.com/v21.0/dialog/oauth?client_id=1125911575074544&redirect_uri=${path}&response_type=code&scope=pages_manage_metadata,pages_manage_engagement,pages_messaging,pages_show_list"
                                class="btn btn-rounded btn-outline-primary mt-1"
                                data-bs-toggle="tooltip"
                                title="${$.fn.gettext('Connect to Facebook')}"
                            >
                                <span>
                                    <span class="icon">
                                        <i class="fa-brands fa-facebook-f"></i>
                                    </span>
                                    <span class="no-transform">${$.fn.gettext('Connect to Facebook')}</span>
                                </span>
                            </a>
                        `);
                        const head1 = $.fn.gettext("When you click the 'Connect to Facebook' button, you will be redirected to Facebook, and our app will request access to the pages managed by your account.");
                        const head2 = $.fn.gettext("This connection allows our app to:");
                        const list1 = $.fn.gettext("Use your page access token to manage and automate Messenger interactions on your page.");
                        const list2 = $.fn.gettext("Provide tools for automating responses, handling customer inquiries, and improving communication efficiency through Messenger.");
                        const commit1 = $.fn.gettext("We are committed to protecting your privacy, and your Messenger data will only be used for enhancing your page's messaging capabilities with your consent.")
                        const instruction$ = $(`
                            <div class="p-3" style="width: 100%;text-align: start;">
                                <p>${head1}</p>
                                <p style="margin-top: 5px;">${head2}</p>
                                <ul style="list-style: circle;">
                                    <li>${list1}</li>
                                    <li>${list2}</li>
                                </ul>
                                <p>${commit1}</p>
                            </div>
                        `).append(addNew$);
                        clsThis.elePageList$.append(instruction$);
                        addNew$.tooltip();
                    }
                } else if (jqXHR.status === 204) reject({'status': 204});
            },
        }).then(
            resp => {
                clsThis.eleLoading$.remove();
                const data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('connected_data')) {
                    const connectedData = data['connected_data'];
                    if (connectedData) {
                        if (connectedData?.['is_syncing'] === true) {
                            clsThis.eleActionAdvance$.prepend(`<span class="badge badge-soft-secondary">Syncing</span>`)
                        }
                        if (connectedData?.['is_sync_accounts'] === false) {
                            clsThis.btnSync(connectedData['id']);
                        }
                        (connectedData?.['pages'] || []).map(
                            itemPage => {
                                const itemPage$ = clsThis.add(itemPage);
                                itemPage$.on('click', function () {
                                    clsThis.active($(this), itemPage);
                                });
                            }
                        )
                    }
                }
            },
            errs => {
            },
        );
        $.fn.callAjax2({
            'url': clsThis.eleGlobal$.data('url-messenger-limit'),
            'method': 'GET',
        }).then(
            resp => {
                const data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('messenger_limit')) {
                    const limitData = data['messenger_limit'];
                    const used = limitData['used'] || 0;
                    const maxCount = limitData['max'] || 200;
                    clsThis.eleSite$.find('.messenger-limit-used').text(used);
                    clsThis.eleSite$.find('.messenger-limit-max').text(maxCount);

                    const limit$ = clsThis.eleSite$.find('.messenger-limit');
                    let textColor;
                    const available = Math.abs(maxCount - used);
                    if (available < 10){
                        textColor = "#cf1322";
                    } else if (available < 50){
                        textColor = "#fa8c16";
                    } else if (available < 100) {
                        textColor = "#7cb305";
                    } else {
                        textColor = "#237804";
                    }
                    limit$.css('color', textColor);
                }
            },
            errs => console.log(errs),
        );
    }

    onEvents() {
        new PageConfig().onEvents();
        new Conversation().onEvents();
        new ChatList().onEvents();
        new PersonInfo().onEvents();
    }
}

class PageConfig {
    get modal$() {
        return $('#modalPageConfig');
    }

    get btn$() {
        return $('#btn-page-config');
    }

    enableBtnConfig() {
        this.btn$.prop('disabled', false);
    }

    disableBtnConfig() {
        this.btn$.prop('disabled', true);
    }

    onEvents() {
        const clsThis = this;
        clsThis.disableBtnConfig();
        clsThis.modal$.on('show.bs.modal', function () {
            const pageData = new Conversation().selectedPageData;
            if (pageData) {
                clsThis.modal$.find('.modal-title-text').text(pageData['name'] || '');
            }
        });
        clsThis.modal$.on('shown.bs.modal', function () {
            // call api
        });
    }
}

class Conversation {
    get eleConversation$() {
        return $('#chat-conversation');
    }

    get eleBody$() {
        return $('#inbox-body');
    }

    set selectedPageData(pageData) {
        new PageConfig().enableBtnConfig();
        this.eleConversation$.data('selectedPageData', pageData);
    }

    get selectedPageData() {
        return this.eleConversation$.data('selectedPageData') || null;
    }

    onEvents() {
    }

    empty() {
        this.eleBody$.empty();
        new ChatList().empty();
        new PersonInfo().empty();
    }

    deActive() {
        this.eleBody$.find('.body-item').removeClass('active');
    }

    active(eleConversation$, itemPerson, itemPage) {
        if (!eleConversation$.hasClass('active')) {
            this.deActive();
            eleConversation$.addClass('active');
            const chatCls = new ChatList();
            chatCls.empty();
            chatCls.call(itemPerson, itemPage);
        }
    }

    addEmpty() {
        this.eleBody$.append(`<div class="px-2 p-3 text-center">${$.fn.gettext("There are no conversations.")}</div>`);
    }

    add(itemPerson) {
        const dateStr = $x.fn.displayRelativeTime(itemPerson['last_updated'], {
            'callback': function (data) {
                return `<p>${data.relate}</p>`;
            }
        });
        const elePerson$ = $(`
                <div class="body-item px-2 p-3">
                    <div class="row m-0 w-100 pr-3">
                        <div class="col-8 m-0 p-0">
                            <div class="avatar avatar-rounded avatar-xs mr-1">
                                <img src="${itemPerson['avatar']}" alt="user" class="avatar-img">
                            </div>
                            <span>${itemPerson['name']}</span>
                        </div>
                        <div class="col-4 m-0 p-0" style="text-align: right;">
                            ${dateStr}
                        </div>
                    </div>
                </div>
            `);
        this.eleBody$.append(elePerson$);
        elePerson$.data('person', itemPerson);
        return elePerson$;
    }

    call(itemPage) {
        const clsThis = this;
        clsThis.selectedPageData = itemPage;
        clsThis.empty();
        $.fn.callAjax2({
            url: clsThis.eleConversation$.data('url-person').replaceAll('__pk__', itemPage['id']),
            method: 'GET',
            isLoading: true,
        }).then(
            resp => {
                const data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('persons')) {
                    const persons = data['persons'];
                    if (persons.length === 0) clsThis.addEmpty();
                    else {
                        persons.map(
                            itemPerson => {
                                const elePerson$ = clsThis.add(itemPerson);
                                elePerson$.on('click', function () {
                                    clsThis.active($(this), itemPerson, itemPage);
                                });
                            }
                        )
                    }
                }
            },
            errs => {
            },
        );
    }
}

class ChatList {
    get eleChat$() {
        return $("#body-chat");
    }

    get eleInboxChat$() {
        return $('#inbox-chat');
    }

    get eleLoading() {
        return $('#icon-person-loading');
    }

    get btnScrollToTop() {
        return $('#btn-chat-scroll-top');
    }

    get btnScrollToBottom() {
        return $('#btn-chat-scroll-bottom');
    }

    get eleBtnCollapsePersonInfo$() {
        return $('#btn-collapse-person-info')
    }

    onEvents() {
        const clsThis = this;
        let timeout;
        clsThis.eleChat$.on(
            'scroll',
            function () {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(
                    () => {
                        if (!clsThis.eleLoading.is(":visible") && clsThis.eleChat$.attr('data-load-end') !== '1') {
                            if ($(this).scrollTop() <= 10) {
                                clsThis.eleChat$.trigger('data.loadMore');
                            }
                        }
                    },
                    300
                )
            }
        );
        clsThis.btnScrollToTop.on('click', function () {
            clsThis.eleChat$.animate({scrollTop: 0}, 'slow');
        });
        clsThis.btnScrollToBottom.on('click', function () {
            clsThis.eleChat$.stop().animate({scrollTop: -clsThis.eleChat$.prop('scrollHeight')}, 'slow');
        });
        clsThis.eleBtnCollapsePersonInfo$.on('click', function () {
            $(this).find('.icon i').toggle();
            new PersonInfo().toggleWidth();
        })
    }

    empty() {
        this.eleChat$.empty();
        this.eleInboxChat$.find('.person-title').text('');
        this.eleInboxChat$.find('.person-avatar').attr('src', '#');
        this.eleInboxChat$.find('.person-link').attr('href', '#').removeAttr('target');
        this.eleInboxChat$.find('.person-inbox-link').attr('href', '#').removeAttr('target');
    }

    fillHeader(personData, pageData) {
        this.eleInboxChat$.find('.person-title').text(personData['name']);
        this.eleInboxChat$.find('.person-avatar').attr('src', personData['avatar']);

        const linkProfile$ = this.eleInboxChat$.find('.person-link');
        linkProfile$.attr(
            'href',
            linkProfile$
                .data('href')
                .replaceAll(
                    '__person_id__',
                    personData['account_id']
                )
        ).attr('target', '_blank');

        const linkInbox$ = this.eleInboxChat$.find('.person-inbox-link');
        linkInbox$.attr(
            'href',
            linkInbox$.data('href').replaceAll(
                '__page_id__',
                pageData['account_id']
            ).replaceAll(
                '__person_id__',
                personData['account_id']
            )
        ).attr('target', '_blank');
    }

    _handleMsgText(ele$, messageData) {
        ele$.addClass(messageData['is_echo'] === true ? 'inbox-of-page' : 'inbox-of-customer');
        if (messageData['text']) {
            ele$.find('.msg-data').append(`<p class="inbox-line-text">${messageData['text']}</p>`);
        }
    }

    _handleMsgType(ele$, messageData) {
        (messageData?.['attachments'] || []).map(
            attData => {
                if (attData.hasOwnProperty('type') && attData.hasOwnProperty('payload')) {
                    switch (attData['type']) {
                        case 'image':
                            const payload = attData['payload'];
                            const url = payload?.['url'];
                            const sticker_id = payload?.['sticker_id'];
                            if (typeof url === 'string' && url.length > 0) {
                                if (sticker_id) {
                                    ele$.find('.msg-data').append(`
                                        <div 
                                            aria-label="" 
                                            class="chat-sticker" 
                                            role="img" 
                                            tabindex="-1" 
                                            style="background-image: url(${url});"
                                        ></div>
                                    `);
                                } else {
                                    ele$.find('.msg-data')
                                        .append(`
                                            <a href="${url}" target="_blank">
                                                <img class="chat-img" src="${url}"  alt="image"/>
                                            </a>
                                        `)
                                    // .append(`<a href="${url}" target="_blank" rel="nofollow" download><i class="fa-solid fa-download"></i></a>`);
                                }
                            }
                    }

                }
            }
        )
    }

    _handeMsgTimestamp(ele$, index, arrayUpon) {
        if (index === arrayUpon.length - 1) {
            const currentTime = arrayUpon[index]['timestamp'];
            const currentTimeObj = moment.unix(currentTime / 1000);
            const dateString = currentTimeObj.format("dddd DD/MM/YYYY HH:mm");
            return $(`<div class="inbox-line inbox-timestamp">${dateString}</div>`)
        } else if (arrayUpon.length > index + 1) {
            const prevTime = arrayUpon[index + 1]['timestamp'];
            const currentTime = arrayUpon[index]['timestamp'];

            const distance = Math.abs(currentTime - prevTime);
            if (distance > 1000 * 60 * 5) { // 5 minutes
                const systemNowObj = moment(moment.now());
                const prevTimeObj = moment.unix(prevTime / 1000);
                const currentTimeObj = moment.unix(currentTime / 1000);

                let dateString;

                if (prevTimeObj.isSame(currentTimeObj, 'day')) {
                    dateString = currentTimeObj.format("HH:mm");
                } else {
                    if (systemNowObj.isSame(currentTimeObj, 'year')) {
                        dateString = currentTimeObj.format("dddd DD/MM HH:mm");
                    } else {
                        dateString = currentTimeObj.format("dddd DD/MM/YYYY HH:mm");
                    }
                }

                return $(`<div class="inbox-line inbox-timestamp">${dateString}</div>`)
            } else {
                const maxPx = 15;
                const maxTime = 60 * 5;
                const marginBottomPx = (distance / 1000) * maxPx / maxTime;
                ele$.css('margin-top', `${marginBottomPx}px`);
            }
        }
        return $(``);
    }

    _handleMsgTooltip(ele$, messageData) {
        const currentTime = messageData['timestamp'];
        const isEcho = messageData['is_echo'];
        const currentTimeObj = moment.unix(currentTime / 1000);
        const dateStr = currentTimeObj.format("DD/MM/YYYY HH:mm:ss");
        // data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top"
        const msg$ = ele$.find('.msg-data');
        msg$.attr('data-bs-toggle', 'tooltip');
        msg$.attr('data-bs-placement', isEcho === true ? 'bottom' : 'bottom');
        msg$.attr('title', dateStr);
        msg$.tooltip();
    }

    _handleAvatar(ele$, messageData, personData, pageData) {
        const avatar$ = ele$.find('.avatar');
        const isEcho = messageData['is_echo'];
        const imgLink = isEcho === true ? SiteControl.getPagePicture(pageData) : personData['avatar'];
        avatar$.append(`<img src="${imgLink}" alt="user" class="avatar-img">`);
    }

    add(personData, pageData, messageData, index, arrayUpon) {
        const ele$ = $(`
            <div class="inbox-line">
                <div style="max-width: 50px" class="avatar avatar-rounded avatar-xs"></div>
                <div style="max-width: 70%;" class="d-inline-block msg-data"></div>
            </div>
        `);
        const time$ = this._handeMsgTimestamp(ele$, index, arrayUpon);
        this.eleChat$.append(ele$).append(time$);

        this._handleMsgText(ele$, messageData);
        this._handleMsgType(ele$, messageData);
        this._handleMsgTooltip(ele$, messageData);
        this._handleAvatar(ele$, messageData, personData, pageData);
    }

    _addEndConversation() {
        this.eleChat$.append(`<p class="inbox-line inbox-timestamp no-transform" style="text-decoration: underline;color: #7c7c7c;">${$.fn.gettext("You've reached the beginning of the conversation.")}</p>`)
    }

    call(personData, pageData, page = 1) {
        new PersonInfo().load(personData);

        const clsThis = this;

        clsThis.eleChat$.off('data.loadMore')

        clsThis.eleLoading.show(0);

        clsThis.fillHeader(personData, pageData);

        const urlChat = clsThis.eleChat$.data('url-chats')
            .replaceAll('__page_id__', pageData['id'])
            .replaceAll('__person_id__', personData['id']);

        $.fn.callAjax2({
            url: urlChat,
            method: 'GET',
            data: {
                'page': page,
                'pageSize': 15,
            },
        }).then(
            resp => {
                const data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('messages')) {
                    const messages = data['messages'];
                    messages.map(
                        (messageData, index, arrayUpon) => {
                            clsThis.add(personData, pageData, messageData, index, arrayUpon);
                        }
                    )
                    const pageNext = data['page_next'];
                    if (pageNext && pageNext > 0) {
                        clsThis.eleChat$.on('data.loadMore', function () {
                            clsThis.call(personData, pageData, page + 1);
                        });
                    } else {
                        clsThis._addEndConversation();
                        clsThis.eleChat$.attr('data-load-end', '1');
                    }
                    clsThis.eleLoading.hide(0);
                }
            },
            errs => console.log('errs:', errs),
        )
    }
}

class PersonInfo {
    get elePersonInfo$() {
        return $('#inbox-info');
    }

    get elePersonAvatar$() {
        return this.elePersonInfo$.find('.person-avatar');
    }

    get elePersonTitle$() {
        return this.elePersonInfo$.find('.person-title');
    }

    get eleExpandCompress$() {
        return $('#btn-min-max-info');
    }

    get formContact$() {
        return $('#form-contact');
    }

    get btnCreateContact$() {
        return $('#btn-create-contact');
    }

    get btnExistContact$() {
        return $('#btn-exits-contact');
    }

    get formLead$() {
        return $('#form-lead');
    }

    get btnCreateLead$() {
        return $('#btn-create-lead');
    }

    get btnExistLead$() {
        return $('#btn-exits-lead');
    }

    empty() {
        this.elePersonAvatar$.attr('src', '#');
        this.elePersonTitle$.text('');
        this.activeLinked({});
    }

    toggleWidth() {
        this.elePersonInfo$.toggleClass('flex-none').animate({
            width: "toggle"
        }, 300);
    }

    load(personData) {
        this.elePersonInfo$.data('personData', personData);
        this.elePersonAvatar$.attr('src', personData['avatar']).removeAttr('title');
        this.elePersonTitle$.text(personData['name']);
        this.btnCreateContact$.prop('disabled', false);
        this.btnCreateLead$.prop('disabled', false);
        this.activeLinked(personData);
    }

    activeLinked(personData) {
        const clsThis = this;
        if (personData['contact_id']) {
            clsThis.btnCreateContact$.hide(0);
            clsThis.btnExistContact$.attr(
                'href',
                clsThis.btnExistContact$.data('href').replaceAll('__pk__', personData['contact_id'])
            ).show(0);
        } else {
            clsThis.btnExistContact$.attr('href', '#').hide(0);
            clsThis.btnCreateContact$.show(0);
        }
        if (personData['lead_id']) {
            clsThis.btnCreateLead$.hide(0);
            clsThis.btnExistLead$.attr(
                'href',
                clsThis.btnExistLead$.data('href').replaceAll('__pk__', personData['lead_id'])
            ).show(0);
        } else {
            clsThis.btnExistLead$.attr('href', '#').hide(0);
            clsThis.btnCreateLead$.show(0);
        }
    }

    onEvents() {
        const clsThis = this;
        clsThis.eleExpandCompress$.on('click', function () {
            $(this).find('.icon i').toggle();
            clsThis.elePersonInfo$.toggleClass('expand');
        });

        clsThis.btnCreateContact$.on('click', function () {
            clsThis.formContact$.slideToggle('slow', function () {
                if ($(this).is(':visible') && $(this).attr('data-load-1') !== '1') {
                    $(this).attr('data-load-1', '1');
                    const personData = clsThis.elePersonInfo$.data('personData');
                    if (personData && personData.hasOwnProperty('name')) {
                        $(this).find(':input[name=fullname]').val(personData['name']);
                    }
                    if (personData && personData.hasOwnProperty('link')) {
                        $(this).find(':input[name=additional_information__facebook]').val(personData['link']);
                    }
                }
            });
        });
        new SetupFormSubmit(clsThis.formContact$).validate({
            submitHandler: function (form) {
                let payload = $(form).serializeObject();
                if (payload?.['additional_information__facebook']) {
                    payload['additional_information'] = {
                        'facebook': payload['additional_information__facebook'],
                    };
                }
                $.fn.callAjax2({
                    url: $(form).data('url'),
                    method: 'POST',
                    isLoading: true,
                    data: payload,
                }).then(
                    resp => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            clsThis.btnCreateContact$.hide(0);
                            clsThis.btnExistContact$.attr(
                                'href',
                                clsThis.btnExistContact$.data('href').replaceAll('__pk__', data['id'])
                            ).show(0);

                            $.fn.notifyB({
                                'description': $.fn.gettext('Create successful contact'),
                            }, 'success');

                            const personData = clsThis.elePersonInfo$.data('personData');
                            $.fn.callAjax2({
                                url: $(form).data('url-person-link').replaceAll('__pk__', personData['id']),
                                method: 'PUT',
                                isLoading: true,
                                data: {
                                    'contact_id': data['id']
                                },
                            }).then(
                                resp => {
                                    const data = $.fn.switcherResp(resp);
                                    if (data) {
                                        $.fn.notifyB({
                                            'description': $.fn.gettext('Link account Facebook with contact successfully'),
                                        }, 'success');
                                        clsThis.formContact$.hide(0);
                                    }
                                },
                                errs => console.log('errs:', errs),
                            );
                        }
                    },
                    errs => console.log('errs:', errs),
                )
            },
        });

        clsThis.btnCreateLead$.on('click', function () {
            clsThis.formLead$.slideToggle('slow', function () {
                if ($(this).is(':visible') && $(this).attr('data-load-1') !== '1') {
                    $(this).attr('data-load-1', '1');
                    const personData = clsThis.elePersonInfo$.data('personData');
                    if (personData && personData.hasOwnProperty('name')) {
                        $(this).find(':input[name=contact_name]').val(personData['name']);
                    }
                }
            });
        });
        new SetupFormSubmit(clsThis.formLead$).validate({
            submitHandler: function (form) {
                const payload = $(form).serializeObject();
                $.fn.callAjax2({
                    url: $(form).data('url'),
                    method: 'POST',
                    data: payload,
                }).then(
                    resp => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            clsThis.btnCreateLead$.hide(0);
                            clsThis.btnExistLead$.attr(
                                'href',
                                clsThis.btnExistContact$.data('href').replaceAll('__pk__', data['id'])
                            ).show(0);

                            $.fn.notifyB({
                                'description': $.fn.gettext('Create successful lead'),
                            }, 'success');

                            const personData = clsThis.elePersonInfo$.data('personData');
                            $.fn.callAjax2({
                                url: $(form).data('url-person-link-lead').replaceAll('__pk__', personData['id']),
                                method: 'PUT',
                                isLoading: true,
                                data: {
                                    'lead_id': data['id']
                                },
                            }).then(
                                resp => {
                                    const data = $.fn.switcherResp(resp);
                                    if (data) {
                                        $.fn.notifyB({
                                            'description': $.fn.gettext('Link account Facebook with lead successfully'),
                                        }, 'success');
                                        clsThis.formLead$.hide(0);
                                    }
                                },
                                errs => console.log('errs:', errs),
                            );
                        }
                    },
                    errs => console.log(errs),
                )
            }
        });
    }
}
