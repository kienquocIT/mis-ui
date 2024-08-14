// New field:
//  - define new class extends from FormComponentAbstract
//  - add match code with class in SortableField.matchForm
//  -

class ConfigField {
    get state() {
        let formData = this.ele$.data('forms');
        if (formData) {
            return formData.editing || false;
        }
        return false;
    }

    set state(value) {
        if (typeof value === "boolean") {
            let formData = this.ele$.data('forms');
            this.ele$.data('forms', {
                ...formData,
                'editing': value,
            });
        }
    }

    get current() {
        let formData = this.ele$.data('forms');
        if (formData) {
            return formData.current || null;
        }
        return null;
    }

    set current(value) {
        if (value instanceof jQuery) {
            let formData = this.ele$.data('forms');
            this.ele$.data('forms', {
                ...formData,
                'current': value,
            });
        }
    }

    constructor(props) {
        this.ele$ = $('#drawer-properties');
        this.sortableParent$ = $('#sortable-parent');
        this.sortableContent$ = $("#sortable-content");

        // init properties data
        let formData = this.ele$.data('forms');
        if (!formData) {
            this.ele$.data('forms', {
                'editing': false,
                'current': null,
            });

            let clsThis = this;
            this.ele$.find('form').each(function () {
                SetupFormSubmit.call_validate($(this), {
                    onsubmit: true,
                    submitHandler: function (form, event) {
                        event.preventDefault();
                        return false;
                    }
                });
            });
            this.ele$.find('#drawer-close').on('click', function () {
                clsThis.firing_close();
            });
            this.ele$.find('#drawer-cancel').on('click', function () {
                clsThis.firing_close();
            });
            this.ele$.find('#drawer-save').on('click', function () {
                clsThis.current.trigger('config.save');
            });
            this.ele$
                .find('select.input-radio-select')
                .hide()
                .on('change', function () {
                    let value = $(this).val();
                    let radioGroup$ = $(this).siblings('.radio-select-group');
                    if (radioGroup$.length > 0) {
                        radioGroup$
                            .find('.radio-select-item')
                            .each(function () {
                                if ($(this).attr('data-value') === value) {
                                    $(this).addClass('active')
                                } else $(this).removeClass('active')
                            });
                    }
                })
                .each(function () {
                    let select$ = $(this);

                    let radioGroup$ = select$.siblings('.radio-select-group');
                    if (radioGroup$.length === 0) {
                        let radioGroupCls = select$.attr('data-rs-class') ?? 'radio-select-group-full';
                        radioGroup$ = $(`<div class="radio-select-group ${radioGroupCls}"></div>`);
                        radioGroup$.insertAfter(select$);

                        $(this).find('option:not(:disabled)').each(function () {
                            let dataValue = $(this).attr('value');
                            let radioItem$ = $(`
                                    <div 
                                        class="radio-select-item" 
                                        data-value="${dataValue}"
                                    >${$(this).text()}</div>
                                `);
                            // tooltip
                            let dataTooltipTitle = $(this).attr('title');
                            if (dataTooltipTitle) radioItem$.attr('data-bs-toggle', 'tooltip').attr('title', dataTooltipTitle);

                            radioGroup$.append(radioItem$);
                            radioItem$.on('click', function () {
                                let value = $(this).attr('data-value');
                                $(select$).val(value).trigger('change');
                            });
                        });
                    }
                }).trigger('change');

            let timeoutInput = null;
            this.ele$.find('input,select,textarea')
                .on('change', function () {
                    if (!$(this).hasClass('form-not-check-change')) {
                        clsThis.state = true;
                        if (clsThis.current) {
                            clsThis.current.trigger('config.realtime');
                        }
                    }
                })
                .on('input', function () {
                    if (timeoutInput) clearTimeout(timeoutInput);
                    timeoutInput = setTimeout(() => {
                        if (!$(this).hasClass('form-not-check-change')) {
                            clsThis.state = true;
                            if (clsThis.current) {
                                clsThis.current.trigger('config.realtime');
                            }
                        }
                    }, 300)
                });

            // on "esc" keyup force close drawer
            $(window).keyup(function (e) {
                if (e.key === "Escape") { // escape key maps to keycode `27`
                    if (clsThis.current) {
                        clsThis.firing_close();
                    }
                }
            });
        }
    }

    open(current) {
        let clsThis = this;
        clsThis.state = false;
        clsThis.current = current;
        clsThis.ele$.show({
            'duration': 0,
            'start': function () {
                clsThis.ele$.find("#check-hide-warning").closest('.drawer-warning-group').hide();
            },
            'done': function () {
                if (clsThis.sortableParent$.width() / clsThis.sortableContent$.width() > 2) {
                    clsThis.sortableContent$.addClass('drawer-showing');
                }
                clsThis.ele$.find('#drawer-main').animate({
                    width: $x.fn.getPropertiesValue('--drawer-properties-width'),
                }, {
                    'duration': 400,
                    'done': function () {
                        // show/hide warning
                        clsThis.ele$.find("#check-hide-warning").trigger('change');
                    }
                });
            },
        });
    }

    firing_close() {
        let clsThis = this;
        if (clsThis.state === false) clsThis.close(); else {
            Swal.fire({
                title: $.fn.gettext('Unsaved changes?'),
                html: `
                    <p>${$.fn.gettext('You have made changes.')}</p>
                    <p>${$.fn.gettext('Do you want to discard them?')}</p>
                `,
                icon: "warning",
                showCloseButton: true,
                showCancelButton: true,
                cancelButtonColor: "#d33",
                cancelButtonText: $.fn.gettext('Close'),
                confirmButtonColor: "#3085d6",
                confirmButtonText: $.fn.gettext('Discard unsaved changes')
            }).then((result) => {
                if (result.isConfirmed) {
                    clsThis.close();
                }
            });
        }
    }

    close() {
        let clsThis = this;

        //
        clsThis.current.trigger('config.cancel');

        clsThis.state = false;
        clsThis.current = null;
        clsThis.ele$.find('#drawer-main').animate({
            width: "0",
        }, {
            'duration': 400,
            'start': function () {
                clsThis.sortableContent$.removeClass('drawer-showing')
            },
            'done': function () {
                clsThis.ele$.hide(0);
                clsThis.current.trigger('config.close');
            },
        });
    }
}

class SortableField {
    highlight(ele$) {
        $x.fn.scrollToIdx(ele$, this.eleParent$);
        ele$.addClass('sortable-item-highlight');
        setTimeout(
            () => ele$.removeClass('sortable-item-highlight'),
            1010
        )
    }

    _recheckStats() {
        const maxLength = 30;
        const statsLength = this.ele$.find('.sortable-item[data-code]').length;
        this.statsLength$.alterClass('text-*').addClass(statsLength > maxLength ? 'text-danger' : 'text-success');
        this.statsLength$.text(statsLength);

        const maxSize = 300;
        const htmlSanitized = SortableField.sanitize_html(this.html_all()).replace(/<!--(.*?)-->|\s\B/gm, '');
        const statsSize = (new Blob([htmlSanitized]).size / 1024).toFixed(2);
        this.statsSize$.alterClass('text-*').addClass(statsSize >= maxSize ? 'text-danger' : 'text-success');
        this.statsSize$.text(statsSize + ' kB');
    }

    recheckStats() {
        new Promise(
            (resolve, reject) => {
                this._recheckStats();
            }
        )
    }

    init_new_sortable(element, appendTo = false, scrollToNew = false) {
        let clsThis = this;
        const ele$ = $(element);
        const code = ele$.attr('data-code');
        const form = clsThis.getForm(code);
        if (appendTo === true) {
            ele$.trigger('sortable.add');
        } else if (appendTo instanceof jQuery) {
            ele$.trigger('sortable.add', appendTo);
        }
        $x.fn.showLoadingPage({
            'didOpenEnd': function () {
                if (ele$.prev('.sortable-item').length > 0 || ele$.next('.sortable-item').length > 0 || ele$.parent().is('div#sortable')) {
                    if (form && typeof form === 'function') {
                        const data = ele$.data('forms');
                        let obj;
                        if (data){
                            obj = data;
                        } else {
                            obj = new form();
                        }
                        ele$.replaceWith(obj.sortableItem$);
                        obj.trigger('sortable.new.before');
                        obj.trigger('obj.reinit_ele');
                        obj.trigger('sortable.new.after');
                        obj.trigger('all.change', true);
                        clsThis.trigger('sortable.check_empty');

                        if (scrollToNew === true) clsThis.highlight(obj.sortableItem$);
                        $x.fn.hideLoadingPage();
                    } else $(element).remove();
                } else $(element).remove();
            },
        })

    }

    init() {
        let clsThis = this;

        this.ele$.sortable({
            items: "div.sortable-item:not(.sortable-item-fixed)",
            revert: true,
            cancel: "div.sortable-item-disabled",
            placeholder: "sortable-item item-dragging",
            start: function (event, ui) {
                if ($(ui.item).hasClass('sortable-item')) {
                    $(ui.item).addClass('item-sorting');
                }
            },
            stop: function (event, ui) {
                if ($(ui.item).hasClass('sortable-item')) {
                    $(ui.item).removeClass('item-sorting');
                }
            },
            update: function (event, ui) {
                if (!$(ui.item).hasClass('sortable-item')) {
                    clsThis.init_new_sortable(ui.item, false, true);
                }
            },
        });
        this.ele$.find(".sortable-item").disableSelection();
        this.ele$.on('sortable.check_empty', function () {
            const child$ = clsThis.ele$.find('.sortable-item');
            const itemEmpty$ = clsThis.ele$.find(clsThis.itemEmptyQuery);
            if (child$.length > 0) {
                itemEmpty$.remove();
                clsThis.itemFoot$.show("slide", {direction: "left"}, 200);
            } else {
                if (itemEmpty$.length === 0) clsThis.ele$.append(clsThis.itemEmptyHTML);
                clsThis.itemFoot$.hide("slide", {direction: "right"}, 200);
            }
        });

        this.eleContent$.on('click', '.sortable-item', function (event) {
            let ele$ = $(event.target);
            let item$ = ele$.closest('.sortable-item');
            if (item$.length > 0) {
                item$.trigger('obj.click', ele$);
            } else return false;
        });

        // monitor
        this.monitorBtn$.on('click', () => {
            this.monitorDiv$.slideToggle('fast');
        })
    }

    static sanitize_html(html_txt) {
        // ['label', 'input', 'textarea', 'select', 'option', 'button', 'svg', 'path', 'iframe'].map(
        //     eleName => {
        //         HtmlSanitizer.AllowedTags[eleName.toUpperCase()] = true;
        //     }
        // );
        // [
        //     'for', 'type', 'name', 'placeholder', 'required', 'disabled', 'readonly', 'checked', 'value',
        //     'min', 'max', 'minlength', 'maxlength',
        //     'name', 'cols', 'rows', 'placeholder', 'required', 'disabled', 'readonly',
        //     'minlength', 'maxlength',
        //     'name', 'required', 'disabled', 'readonly', 'placeholder', 'multiple',
        //     'value', 'selected',
        //     'type',
        //     'xmlns', 'fill', 'class', 'viewBox',
        //     'd',
        //     'src', 'width', 'height', 'frameborder', 'title', 'allowfullscreen'
        // ].map(
        //     attrName => {
        //         HtmlSanitizer.AllowedAttributes[attrName.toLowerCase()] = true;
        //     }
        // )
        return HtmlSanitizer.SanitizeHtml(html_txt);
    }

    static cusNext(dataStorage$, matcher, from$, until$=null){
        let arrResult = [];
        const resolveFrom$ = dataStorage$.find(from$);
        if (resolveFrom$.length > 0){
            const parentFrom$ = resolveFrom$.parent();

            let fromIsMapped = false;
            let isStopLoop = false;
            $(parentFrom$).children().each(function (){
                if (isStopLoop === false){
                    if ($(this).is($(from$))){
                        fromIsMapped = true;
                    } else if($(this).is($(until$))) {
                        isStopLoop = true;
                    } else {
                        if (fromIsMapped === true){
                            if ($(this).is(matcher)){
                                arrResult.push($(this));
                            }
                        }
                    }
                }
            });
        }
        return arrResult;
    }

    html_all(keep_footer) {
        const sortable$ = $(this.ele$.prop('outerHTML'));
        const page$ = $('#page-sortable');

        let pageEnable = page$.data('forms').config?.['enabled'];
        if (!pageEnable) {
            console.log('pageEnable:', pageEnable);
            const head$ = sortable$.find('div.sortable-item[data-code="page-break-head"]');
            const foot$ = sortable$.find('div.sortable-item[data-code="page-break-foot"]');
            pageEnable = !!(head$.length > 0 || foot$.length > 0);
        }
        let pageData = [];
        if (pageEnable === true){
            const pageHead$ = sortable$.find('div[data-code=page-break-head]');
            for (let i=0; i < pageHead$.length ; i++){
                const currentPage$ = $(pageHead$[i]);
                const page$ = $('<div class="page-group" style="display: none;"></div>');
                page$.attr('data-page', currentPage$.attr('data-page'));
                const itemAndFootPage$ = i === pageHead$.length - 1 ? SortableField.cusNext(
                    sortable$, 'div.sortable-item', currentPage$, null
                ) : SortableField.cusNext(
                    sortable$, 'div.sortable-item', currentPage$, pageHead$[i+1]
                )
                page$.append(currentPage$);
                page$.append(itemAndFootPage$);
                pageData.push(page$);
            }
        } else {
            const page$ = $('<div class="page-group"></div>');
            page$.append(sortable$.find('div.sortable-item'));
            pageData.push(page$);
        }

        let html = this.eleParent$.prop('outerHTML');
        let html$ = $(html);

        html$.find('#sortable').removeAttr('id').empty().append(pageData);
        // remove masker
        html$.find('.group-masker').remove()
        // remove group--setting-group
        html$.find('.group--setting-group').remove();
        // remove box
        html$.find('.box').removeClass('box');
        // show form action
        html$.find('.form-action').removeClass('d-none');
        // show form-foot
        html$.find('.form-foot').show();
        // remove current user
        html$.find('#form-head--current-user-name').text('');
        // remove style of form head
        html$.find('.form-head').removeAttr('style');
        // remove style of form foot
        html$.find('.form-foot').removeAttr('style');
        // remove form-item--hide
        html$.find('.form-item--hide').remove();
        // remove form-head if not display

        // remove id
        html$.find('#sortable-content').removeAttr('id');
        html$.find('#head-sortable').removeAttr('id');
        html$.find('#form-title').removeAttr('id');

        // remove attribute data-code
        html$.find('[data-code]').removeAttr('data-code').removeAttr('id');
        // placeholder drop here
        html$.find('.sortable-drop-here').remove();
        // remove instruction when empty
        html$.find('#sortable-item-empty').remove();
        // remove group control
        html$.find('.group-control').remove();
        // remove class
        html$.find('.ui-sortable').removeClass('ui-sortable');
        html$.find('.sortable-item').removeClass('sortable-item').alterClass('sortable-item-*');

        // empty footer sub
        if (keep_footer === false) html$.find('.form-foot-sub').empty().text('${footerSub}');

        return html$.children().prop('outerHTML');
    }

    getForm(code) {
        if (this.matchForm.hasOwnProperty(code)) {
            return this.matchForm[code];
        }
        return null;
    }

    constructor() {
        this.ele$ = $('#sortable');
        this.eleContent$ = $('#sortable-content');
        this.eleParent$ = $('#sortable-parent');
        this.itemEmptyQuery = '#sortable-item-empty'
        this.itemEmptyHTML = `
            <div id="sortable-item-empty" class="form-item form-item-md sortable-drop-here sortable-item-disabled">
                <div>
                    <h3 style="margin-bottom: 10px;">${$.fn.gettext('Start building!')}</h3>
                    <p>${$.fn.gettext('Drag fields from left panel and drop here to add them to your form.')}</p>
                </div>
            </div>
        `;
        this.itemFoot$ = this.eleContent$.find('.form-foot');

        this.monitor$ = $('#sortable-monitor');
        this.monitorBtn$ = this.monitor$.find('button');
        this.monitorDiv$ = this.monitor$.find('div');
        this.statsLength$ = this.monitor$.find('#stats-length');
        this.statsSize$ = this.monitor$.find('#stats-size');

        this.matchForm = matchForm;

        let formData = this.ele$.data('forms');
        if (!formData) {
            this.ele$.data('forms', {'initial': 'complete'});
            this.init();
        }
    }

    trigger(code, props) {
        this.ele$.trigger(code, props);
    }

    find(code) {
        return this.ele$.find(code);
    }

    append(item$) {
        this.ele$.append(item$);
    }

    remove(item$) {
        item$.remove();
    }
}

class DraggableField {
    init() {
        // init d&d
        let dragItems$ = this.ele$.find('.draggable-item');
        dragItems$.draggable({
            connectToSortable: "#sortable",
            revert: "invalid",
            helper: "clone",
            start: function (event, ui) {
                $(ui.helper)
                    .addClass('drag-item-start')
                    .css('padding', '10px 20px');
            },
        });
        dragItems$.disableSelection();
        dragItems$.on('dblclick', function () {
            let clsSort = new SortableField();
            let newEle$ = $(this).clone();
            newEle$.appendTo(clsSort.ele$);
            clsSort.init_new_sortable(newEle$, true, true);
        });

        // init collapse group drag
        this.ele$.find('.draggable-heading .heading-txt').on('click', function () {
            $(this).siblings('.draggable-group').slideToggle();
        });
    }

    hideAllExclude(arrCode) {
        if (!arrCode) arrCode = [];
        this.ele$.find(`.draggable-item[data-code]`).each(function () {
            const code = $(this).attr('data-code');
            if (arrCode.indexOf(code) === -1) {
                $(this).css('display', 'none');
            }
        });
    }

    constructor() {
        this.ele$ = $('#draggable');

        let formData = this.ele$.data('forms');
        if (!formData) {
            this.ele$.data('forms', {'initial': 'complete'});
            this.init();
        }
    }
}

class ToolboxField {
    get stateClone() {
        return !!this.autoConfirmClone$.prop('checked');
    }

    get stateRemove() {
        return !!this.autiConfirmRemove$.prop('checked');
    }

    get formTitleCls() {
        let data = this.formTitle$.data('forms');
        return data?.cls || null;
    }

    formConfig(key) {
        const cls = this.formTitleCls;
        if (cls) {
            const config = cls?.config;
            if (config) {
                if (!key) return config;
                if (config.hasOwnProperty(key)) {
                    return config[key];
                }
            }
        }
        return null;
    }

    init() {
        let clsThis = this;

        this.btnSettingHide$.on('click', function () {
            clsThis.group$.slideToggle('fast', function () {
                clsThis.btnSettingHide$.hide('fast', function () {
                    clsThis.btnSettingShow$.show('fast');
                });
            });
        });
        this.btnSettingShow$.on('click', function () {
            clsThis.btnSettingShow$.hide('fast', function () {
                clsThis.btnSettingHide$.show('fast', function () {
                    clsThis.group$.slideToggle('fast');
                });
            });
        });
        this.btnThemes$.on('click', function () {
            clsThis.themesSub$.animate({
                transform: 1,
            }, {
                'start': function () {
                    clsThis.themes$.css('visibility', 'visible');
                },
                'duration': 200,
                'step': function (now, fx) {
                    $(this).css('transform', `scale(${now})`)
                },
                'done': function () {
                    let body$ = clsThis.iframePreview$.contents().find("body");
                    let content$ = body$.find("#contents");
                    let html = clsThis.formTitleCls.return_html_all(true);

                    $.fn.callAjax2({
                        url: clsThis.iframePreview$.attr('data-format-url'),
                        method: 'POST',
                        data: {
                            'html': html
                        },
                        sweetAlertOpts: {'allowOutsideClick': true},
                    }).then(resp => {
                        let data = $.fn.switcherResp(resp);
                        if (data && data.hasOwnProperty('sanitize_html')) {
                            // add HTML
                            let sanitize_html = data['sanitize_html'];
                            if (content$.find('form').length > 0) content$.find('form').empty().append(sanitize_html); else content$.empty().append(sanitize_html);
                            // add JS
                            body$.append(`<script src="/static/form/runtime/js/preview.js"></script>`)
                            // active theme
                            const theme_selected = clsThis.formConfig('theme_selected');
                            if (theme_selected) {
                                setTimeout(() => {
                                    $(`.theme-item[data-code=${theme_selected}]`).trigger('click');
                                }, 100)
                            } else $(`.theme-item[data-code=simple]`).trigger('click');
                        }
                    }, errs => $.fn.switcherResp(errs),)
                },
            })
        });
        this.btnSaveTheme$.on('click', function () {
            let ele$ = clsThis.themeList$.find('.theme-item.active');
            let themeSelected = {};
            let themeAssets = {};
            if (ele$.length > 0) {
                themeSelected = ele$.attr('data-code');
                themeAssets = {
                    'css': [$(ele$).attr('data-css-url')],
                }
            }
            $.fn.callAjax2({
                url: clsThis.themes$.attr('data-url'),
                method: 'PUT',
                data: {
                    'theme_selected': themeSelected,
                    'theme_assets': themeAssets,
                },
                isLoading: true,
            }).then(
                resp => {
                    if ($.fn.switcherResp(resp)) {
                        $.fn.notifyB({
                            'description': $.fn.gettext('Successful'),
                        }, 'success');
                        setTimeout(
                            () => clsThis.btnClose$.trigger('click'),
                            500
                        )
                    }
                },
                errs => $.fn.switcherResp(errs),
            )
        });
        this.btnClose$.on('click', function () {
            clsThis.themesSub$.animate({
                transform: 0,
            }, {
                'duration': 200,
                'step': function (now, fx) {
                    $(this).css('transform', `scale(${now})`)
                },
                'done': function () {
                    clsThis.themes$.css('visibility', 'hidden');
                }
            })
        });
        this.selectDeviceDisplay$.on('change', function () {
            let ele$ = clsThis.themesSub$.find('.apply-preview-device');
            ele$.alterClass('responsive-*');
            switch ($(this).val()) {
                case 'pc':
                    ele$.addClass('responsive-pc');
                    break
                case 'table':
                    ele$.addClass('responsive-tablet');
                    break
                case 'mobile':
                    ele$.addClass('responsive-mobile');
                    break
                default:
                    break
            }
        }).trigger('change');
        this.selectDeviceStructure$.on('change', function () {
            let ele$ = clsThis.themesSub$.find('.apply-preview-device');
            ele$.removeClass('horizontal').removeClass('vertical');
            switch ($(this).val()) {
                case 'horizontal':
                    ele$.addClass('horizontal');
                    break
                case 'vertical':
                    ele$.addClass('vertical');
                    break
            }
        }).trigger('change');
        this.themeItemList$.on('click', function () {
            clsThis.themeList$.find('.theme-item').removeClass('active');
            $(this).addClass('active');
            const cssUrl = $(this).attr('data-css-url');
            let head$ = clsThis.iframePreview$.contents().find('head');
            head$.find('link[data-theme]').remove();
            if (cssUrl) head$.append(`<link rel="stylesheet" data-theme="true" href="${cssUrl}"/>`);
            // scroll to theme selected
            $x.fn.scrollToCus(clsThis.themeListSub$, $(this));
        });
        this.blockSplit$.on('click', function () {
            $(this).find('i').toggleClass('active');
            clsThis.themeList$.animate({
                width: 'toggle',
            }, {
                'easing': 'linear',
                'duration': 300,
            });
        });
        this.btnCloseEmbedForm$.on('click', function () {
            clsThis.configEmbedForm$.animate({
                'width': 'hide',
                'opacity': '0',
            });
        });
        this.btnOpenEmbedForm$.on('click', function () {
            clsThis.configEmbedForm$.animate({
                'width': 'show',
                'opacity': '1',
            },);
        });
        this.publishTypeItem$.on('click', function () {
            if (!$(this).hasClass('disable')) {
                let item$ = clsThis.publishFormType$.find('.publish-type-item');
                item$.removeClass('active');
                $(this).addClass('active');

                clsThis.publishTypeData$.find('.publish-data').hide();
                const group$ = clsThis.publishTypeData$.find(`.publish-data[data-code=${$(this).attr('data-code')}]`);
                if (group$.length > 0) group$.show();
            }
        });

        this.themes$
            .find('select.input-radio-select')
            .hide()
            .on('change', function () {
                let value = $(this).val();
                let radioGroup$ = $(this).siblings('.radio-select-group');
                if (radioGroup$.length > 0) {
                    radioGroup$
                        .find('.radio-select-item')
                        .each(function () {
                            if ($(this).attr('data-value') === value) {
                                $(this).addClass('active')
                            } else $(this).removeClass('active')
                        });
                }
            })
            .each(function () {
                let select$ = $(this);

                let radioGroup$ = select$.siblings('.radio-select-group');
                if (radioGroup$.length === 0) {
                    let radioGroupCls = select$.attr('data-rs-class') ?? 'radio-select-group-full';
                    radioGroup$ = $(`<div class="radio-select-group ${radioGroupCls}"></div>`);
                    radioGroup$.insertAfter(select$);

                    $(this).find('option:not(:disabled)').each(function () {
                        let dataValue = $(this).attr('value');
                        let radioItem$ = $(`
                                    <div 
                                        class="radio-select-item" 
                                        data-value="${dataValue}"
                                    >${$(this).text()}</div>
                                `);
                        // tooltip
                        let dataTooltipTitle = $(this).attr('title');
                        if (dataTooltipTitle) radioItem$.attr('data-bs-toggle', 'tooltip').attr('title', dataTooltipTitle);

                        radioGroup$.append(radioItem$);
                        radioItem$.on('click', function () {
                            let value = $(this).attr('data-value');
                            $(select$).val(value).trigger('change');
                        });
                    });
                }
            }).trigger('change');

        this.visibleMonitor$.on('change', function () {
            const ele$ = $("#sortable-monitor");
            if ($(this).prop('checked') === true) ele$.slideDown();
            else ele$.slideUp();
        })
    }

    constructor(props) {
        this.formTitle$ = $('#head-sortable');

        this.autoConfirmClone$ = $('#auto-confirm-clone');
        this.autiConfirmRemove$ = $('#auto-confirm-delete');
        this.visibleMonitor$ = $('#visible-monitor');

        this.group$ = $('#more-config-sub');
        this.btnSettingHide$ = $('#btn-setting-item-hide');
        this.btnSettingShow$ = $('#btn-setting-item-show');
        this.btnThemes$ = $('#btn-config-theme');
        this.themes$ = $('#config-themes');
        this.themesSub$ = $('#config-themes-sub');
        this.themeItemList$ = this.themesSub$.find('.theme-item');
        this.iframePreview$ = $('#iframe-preview');
        this.themeList$ = $('.theme-list');
        this.themeListSub$ = $('.theme-list-sub');
        this.btnClose$ = $('#close-config-theme');
        this.btnSaveTheme$ = $('#apply-config-theme');
        this.selectDeviceDisplay$ = $('#select-device-display');
        this.selectDeviceStructure$ = $('#select-device-structure');
        this.blockSplit$ = $('.block-split .block-split-btn');
        this.btnCloseEmbedForm$ = $('#btn-close-embed-form');
        this.btnOpenEmbedForm$ = $('#btn-embed-form');

        this.publishTypeData$ = $('.publish-form-data');
        this.publishFormType$ = this.publishTypeData$.find('.publish-form-type');
        this.publishTypeItem$ = this.publishFormType$.find('.publish-type-item');

        this.configEmbedForm$ = $('#config-embed-form');
        this.configEmbedFormSub$ = $('#config-embed-form-sub');
        this.btnAccessForm$ = $('#btn-access-form');
        this.formPermalink$ = $('#form-permalink');
        this.formIframeLink$ = $('#idx-iframe-url');

        let data = this.group$.data('forms');
        if (!data) {
            this.group$.data('forms', {'initial': 'complete'});
            this.init();
        }
    }

    render_published(form_published, form_title) {
        let clsThis = this;

        let url = this.configEmbedFormSub$.attr('data-url');
        url = url.replaceAll('__pk__', form_published['id']);
        this.configEmbedFormSub$.attr('data-url', url);

        let href = this.btnAccessForm$.attr('data-href');
        href = href.replaceAll('__pk__', form_published['id'])
        this.btnAccessForm$.attr('href', href);

        $('#public-form-enabled').prop('checked', form_published['is_public'] || false).on('change', function () {
            $.fn.callAjax2({
                url: clsThis.configEmbedFormSub$.attr('data-url'),
                method: clsThis.configEmbedFormSub$.attr('data-method') ?? 'PUT',
                data: {
                    'is_public': $(this).prop('checked'),
                }
            }).then(resp => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                }
            }, errs => $.fn.switcherResp(errs),)
        });

        $('#iframe-form-enabled').prop('checked', form_published['is_iframe'] || false).on('change', function () {
            $.fn.callAjax2({
                url: clsThis.configEmbedFormSub$.attr('data-url'),
                method: clsThis.configEmbedFormSub$.attr('data-method') ?? 'PUT',
                data: {
                    'is_iframe': $(this).prop('checked'),
                }
            }).then(resp => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                }
            }, errs => $.fn.switcherResp(errs),)
        });

        let code = form_published?.['code'];
        if (code) {
            let link = window.location.origin + clsThis.formPermalink$.attr('data-url').replaceAll('__form_code__', code);
            clsThis.formPermalink$
                .val(link)
                .on('click', function () {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(clsThis.formPermalink$.val()).then(function () {
                            $.fn.notifyB({
                                'description': $.fn.gettext('Copied')
                            }, 'success')
                        }, function () {
                        },);
                    }
                });
            clsThis.formPermalink$.siblings('a').attr('href', link);

            new QRCode(document.getElementById('QRCodeLink'), {
                text: link,
                width: 100,
                height: 100,
                colorDark: '#000',
                colorLight: '#fff',
                correctLevel: QRCode.CorrectLevel.H
            });
            $('#DownloadQRCodeLink').on('click', function () {
                let a = document.createElement("a"); //Create <a>
                a.href = "data:image/png;base64," + $('#QRCodeLink').find('img').attr('src').split('base64,').at(-1);
                a.download = `QR-${link.split("//").at(-1).split('/')[0].replaceAll('.', '-')}.png`;
                a.click();
            });

            let linkIframe = window.location.origin + clsThis.formIframeLink$.attr('data-url').replace('__form_code__', code);
            clsThis.formIframeLink$
                .val(`<iframe aria-label="${form_title}" frameborder="0" style="height:500px;width:100%;border:none;" src="${linkIframe}"></iframe>`)
                .on('click', function () {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(clsThis.formIframeLink$.val()).then(function () {
                            $.fn.notifyB({
                                'description': $.fn.gettext('Copied')
                            }, 'success')
                        }, function () {
                        },);
                    }
                });
        }
    }
}

class FormComponentAbstract {
    // interface
    sortable_toolbar(props) {
        const iconSetting = `
            <svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16"
            >
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                <path
                        d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"
                />
            </svg>
        `;
        const controlSetting = `
            <button 
                type="button" 
                class="btn-setting" 
                data-bs-toggle="tooltip" data-bs-placement="right" title="Properties"
            >${iconSetting}</button
        `;

        const iconClone = `
            <svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16"
            >
                <path
                        fill-rule="evenodd"
                        d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                />
            </svg>
        `;
        const controlClone = `
            <button 
                type="button" 
                class="btn-clone" 
                data-bs-toggle="tooltip" data-bs-placement="right" title="Duplicate"
            >${iconClone}</button>
        `;

        const iconRemove = `
            <svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"
            >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
        `;
        const controlRemove = `
            <button 
                type="button" 
                class="btn-remove" 
                data-bs-toggle="tooltip" data-bs-placement="right" title="Remove"
            >${iconRemove}</button>
        `;

        let controlGroup$ = $(`<div class="group-control"></div>`);
        if (props.indexOf('setting') !== -1) controlGroup$.append(controlSetting);
        if (props.indexOf('clone') !== -1) controlGroup$.append(controlClone);
        if (props.indexOf('remove') !== -1) controlGroup$.append(controlRemove);

        let maskerGroup$ = $(`<div class="group-masker"></div>`);

        return [maskerGroup$, controlGroup$];
    }

    clean_toolbar() {
        this.sortableItem$.find('.group-control').remove();
        this.sortableItem$.find('.group-masker').remove();
    }

    get cls_label_group() {
        return 'form-item-group-label'
    }

    get cls_input_group() {
        return 'form-item-input-parent';
    }

    get cls_instruction() {
        return 'form-item-instruction';
    }

    formTitleGetConfig(key, storage = 'config') {
        const data = $('#head-sortable').data('forms');
        if (data && typeof data === 'object' && data.hasOwnProperty(storage)) {
            const config = data[storage];
            if (key) {
                if (config && config.hasOwnProperty(key)) return config[key];
            } else return config;
        }
        return null;
    }

    // -- interface

    generateName(counter = 1, skipCheckExist = false) {
        if (counter > 10) throw Error('The generate name maximum call')

        let prefixCode = $x.fn.convertToSlug(this.code);
        let code = `${prefixCode}_${$x.fn.randomStr(5)}`;
        if (skipCheckExist === false) {
            if (this.sortableCls.find(`[name=${code}]`).length === 0) return code;
            return this.generateName(counter + 1, skipCheckExist);
        }
        return code;
    }

    get config() {
        return this._config;
    }

    set config(value) {
        this._config = {...this._config, ...value}

        let data = this.sortableItem$.data('forms');
        data['config'] = this._config;
        data['configRealtime'] = this._config;
        this.sortableItem$.data('forms', data);
        this.trigger_configWasChanged();
    }

    get resolveConfig() {
        this.trigger('obj.reinit_ele');  // Make this.inputs_data data is correct!

        let config = this.config;  // return config of field
        let inputs_data = this.inputs_data.map(data => {
            data['args'] = Array.from(data['args']);
            data['kwargs']['class'] = Array.from(data['kwargs']['class']);
            return data;
        });  // return config by input name. Use it apply when runtime.

        return {
            'type': this.code,
            'config': config,
            'inputs_data': inputs_data,
        }
    }

    get $dataFormsDefault() {
        return {
            'cls': this,
            'idx': this.idx,
            'code': this.code,
            'config': this._config,
            'configRealtime': this._config,
        }
    }

    _defaultInputsDataItem() {
        return {
            'args': new Set(),
            'kwargs': {
                'type': 'text',
                'class': new Set(['form-item-input']),
            },
            'label': '', // present role of input | override at client
            'display': true,
            'element': 'input',
        }
    }

    generateGroupFieldFrame(storage) {
        // generate element enclose dynamic input of type field
        let label$ = $(`<div class="${this.cls_label_group}"></div>`);

        let inp$ = $(`<div class="${this.cls_input_group}"></div>`);
        let instruction$ = $(`<small class="${this.cls_instruction}"></small>`);

        let groupInp$ = $(`<div class="form-item-group-input"></div>`);
        const instruction_placement = this.instruction_placement ? this.instruction_placement : this.formTitleGetConfig('instruction_placement', storage);
        switch (instruction_placement) {
            case 'top':
                groupInp$.append(instruction$).append(inp$);
                break
            case 'bottom':
                groupInp$.append(inp$).append(instruction$);
                break
        }
        let groupAll$ = $(`<div class="form-item-group"></div>`);
        groupAll$
            .append(label$)
            .append(groupInp$);
        const label_placement = this.label_placement ? this.label_placement : this.formTitleGetConfig('label_placement', storage);
        switch (label_placement) {
            case 'top':
                groupAll$.addClass('form-item-group-top');
                break
            case 'left':
                groupAll$.addClass('form-item-group-left');
                break
            case 'right':
                groupAll$.addClass('form-item-group-right');
                break
        }
        this.sortableItem$.append(groupAll$);
        return groupAll$;
    }

    applyInputsDataToInput(inp$, inputs_data) {
        inp$.attr('name', inputs_data.name);
        inputs_data['args'].forEach(key => inp$.prop(key, true));
        Object.keys(inputs_data['kwargs']).map(key => {
            if (key === 'class') inp$.addClass(Array.from(inputs_data['kwargs']['class'])); else inp$.attr(key, inputs_data['kwargs'][key]);
        });
    }

    constructor(props) {
        this.idx = $x.fn.randomStr(32, true);
        this._config = {
            ...this.defaultConfig, ...props?.['config'], ...props?.['_config'],
        };
        this.inputs_data = props?.inputs_data ? [...props?.inputs_data] : [];
        this.instruction_placement = props?.['instruction_placement'] || null;
        this.label_placement = props?.['label_placement'] || null;

        // element pieces
        this.sortableItem$ = $(`<div></div>`)
            .addClass('sortable-item form-item form-item-md')
            .attr('data-code', this.code)
            .attr('id', this.idx);
        this.sortableItemUtil$ = this.sortable_toolbar(['setting', 'clone', 'remove']);
        this.sortableItem$.data('forms', this.$dataFormsDefault);
        this.on_trigger();

        // config of field
        this.configOfFieldCls = new ConfigField();
        this.sortableCls = new SortableField();
        this.draggableCls = new DraggableField();
        this.toolboxCls = new ToolboxField();
    }

    // must be override in children class

    get code() {
        throw Error('The code method is not implement');
    }

    generateField(temp_config) {
        throw Error('The generate field method is not implement')
    }

    get defaultConfig() {
        throw Error('The default config method is not implement')
    }

    get configGroupEle$() {
        throw Error('The "get config group element" method is not implement')
    }

    // -- must be override in children class

    trigger(code, props = {}) {
        this.sortableItem$.trigger(code, props);
        return this;
    }

    register_trigger(trigger_extends){
        let ele$ = this.sortableItem$;
        if (ele$ && ele$ instanceof jQuery) {
            let clsThis = this;
            // trigger extends
            if (typeof trigger_extends === 'object') {
                Object.keys(trigger_extends).map(
                    triggerName => {
                        const callbackOfTrigger = trigger_extends[triggerName];
                        if (triggerName && typeof callbackOfTrigger === 'function') {
                            ele$.on(
                                triggerName,
                                callbackOfTrigger.bind(clsThis)
                            )
                        } else {
                            console.log(`Trigger ${triggerName} has not been registered.`);
                        }
                    }
                )
            }
        }
    }

    on_trigger() {
        let ele$ = this.sortableItem$;
        if (ele$ && ele$ instanceof jQuery) {
            let clsThis = this;

            // add to sortable if not exist in sortable
            ele$.on('sortable.add', function (event, previousEle$) {
                clsThis.trigger_sortableAdd(previousEle$ instanceof jQuery || previousEle$ instanceof HTMLElement ? previousEle$ : null);
                clsThis.sortableCls.trigger('sortable.check_empty');
            });
            ele$.on('sortable.add_before', function (event, nextEle$) {
                clsThis.trigger_sortableAddBefore(
                    nextEle$ instanceof jQuery || nextEle$ instanceof HTMLElement
                        ? nextEle$ : null
                );
                clsThis.sortableCls.trigger('sortable.check_empty');
            });

            // event sortable new item from Drag and Drop
            ele$.on('sortable.new.before', function () {
                clsThis.trigger_sortableNewBefore();
            })
            ele$.on('sortable.new.after', function () {
                clsThis.trigger_sortableNewAfter();
            })

            // re-init element present by configure
            ele$.on('obj.reinit_ele', function (event, props) {
                props = {
                    'storage': 'config',
                    'config': {}, ...props
                }
                clsThis.trigger_objReinitEle(props.config, props.storage);
            });

            // load config to config editor
            ele$.on('config.load', function (event, props) {
                clsThis.trigger_configLoad(props);
            });

            // open config editor
            ele$.on('config.open', function (event) {
                clsThis.trigger_configOpen();
            });

            // close config editor
            ele$.on('config.close', function (event) {
                clsThis.trigger_configClose();
            });

            // update config
            ele$.on('config.save', function (event, props) {
                clsThis.trigger_configSave(props);
                clsThis.trigger('all.change', true);
            });

            // realtime config
            ele$.on('config.realtime', function (event) {
                clsThis.trigger_configRealtime();
            });

            // cancel
            ele$.on('config.cancel', function (event) {
                clsThis.trigger_configCancel();
            });

            // clone
            ele$.on('obj.clone', function (event) {
                clsThis.trigger_objClone();
                clsThis.trigger('all.change', true);
            });

            // destroy
            ele$.on('obj.remove', function (event) {
                clsThis.trigger_objRemove();
                clsThis.sortableCls.trigger('sortable.check_empty');
                // clsThis.trigger('all.change', true); // event not firing because element was removed
                clsThis.setStateAndCallRecheck(true);
            });

            // click
            ele$.on('obj.click', function (event, target$) {
                clsThis.trigger_objClick(target$);
            });

            // globe change all
            ele$.on('all.change', function (event, state) {
                clsThis.setStateAndCallRecheck(state);
            });
        }
    }

    setStateAndCallRecheck(state){
        const cls = $('#head-sortable').data('forms').cls;
        cls.stateChangeAll = !!state;
    }

    trigger_configWasChanged(){}

    trigger_sortableAdd(previousEle$) {
        let ele_exist$ = this.sortableCls.find('#' + this.idx);
        if (ele_exist$.length === 0) {
            if (previousEle$) {
                this.sortableItem$.insertAfter(previousEle$);
            } else {
                this.sortableCls.append(this.sortableItem$);
            }
        }
        this.trigger('obj.reinit_ele');
    }

    trigger_sortableAddBefore(nextEle$){
        if (nextEle$){
            nextEle$ = $(nextEle$);
            let ele_exist$ = this.sortableCls.find('#' + this.idx);
            if (ele_exist$.length === 0) {
                if (nextEle$.length > 0) {
                    this.sortableItem$.insertBefore(nextEle$);
                } else {
                    this.sortableCls.append(this.sortableItem$);
                }
            }
            this.trigger('obj.reinit_ele');
        }
    }

    trigger_sortableNewBefore() {
    }

    trigger_sortableNewAfter() {
    }

    trigger_objReinitEle(temp_config, storage) {
        // Reset
        this.sortableItem$.empty();
        // Add input group frame
        this.generateGroupFieldFrame(storage);
        // Add main element
        this.generateField(temp_config);
        // Add element utils
        // Insert the latest item at the top for display.
        this.sortableItem$.append(this.sortableItemUtil$);
        setTimeout(
            () => this.sortableCls.recheckStats(),
            300
        )
    }

    trigger_configLoad(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        }
        Object.keys(config).map(input_name => {
            let value = config[input_name];
            let inp$ = this.configGroupEle$.find(`[name=${input_name}]`);
            if (inp$.length > 0) {
                if (inp$.is('input:radio')) {
                    this.configGroupEle$.find(`[name=${input_name}][value=${value}]`).prop('checked', true).trigger('change');
                } else {
                    let valueArr = Array.isArray(value) ? value : [value];
                    if (inp$.length <= valueArr.length) {
                        inp$.each(function () {
                            if ($(this).is('input:checkbox')) {
                                $(this).prop('checked', !!value).trigger('change');
                            } else {
                                // (inp$.is('select') || inp$.is('input') || inp$.is('textarea'))
                                $(this).val(value).trigger('change');
                            }
                        })

                    }
                }
            }
        })
    }

    _trigger_configOpen__active() {
        this.sortableItem$.addClass('active');
    }

    trigger_configOpen() {
        this._trigger_configOpen__active();
        let parent$ = this.configGroupEle$.closest('.drawer-content');
        parent$.find('.drawer-config').addClass('d-none');
        this.configGroupEle$.removeClass('d-none');
    }

    trigger_configClose() {
        this.sortableItem$.removeClass('active');
    }

    trigger_configSave(new_config) {
        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}
            let configResolve = {};
            Object.keys(configSum).map(
                key => {
                    if (this.defaultConfig.hasOwnProperty(key)) {
                        configResolve[key] = configSum[key];
                    }
                }
            )
            this.config = configResolve
            this.configOfFieldCls.close();
            this.trigger('obj.reinit_ele', {'config': this.config});
            this.sortableCls.highlight(this.sortableItem$);
        } else {
            $.fn.notifyB({
                'description': $.fn.gettext('Some configuration data is not correct')
            }, 'failure');
        }
    }

    trigger_configRealtime() {
        let frm$ = this.configGroupEle$.find('form');
        let config = SetupFormSubmit.serializerObject(frm$);
        config = {
            ...this.config, ...config,
        }
        // update configRealtime
        let data = this.sortableItem$.data('forms');
        data['configRealtime'] = config;
        this.sortableItem$.data('forms', data);
        // trigger
        this.trigger('obj.reinit_ele', {'config': config});
        return config;
    }

    trigger_configCancel() {
        this.trigger('obj.reinit_ele');
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    trigger_objClone() {
        let clsConstructor = this.sortableCls.getForm(this.code);
        if (clsConstructor && clsConstructor.prototype instanceof FormComponentAbstract){
            let config = {
                ...this,
                'inputs_data': this.inputs_data.map(data => {
                    return {
                        ...data,
                        ...this.defaultInputsDataItem,
                        'name': this.generateName(),
                    }
                })
            }
            let cls = new clsConstructor(config)
            cls.trigger('obj.reinit_ele');
            cls.trigger('sortable.add', this.sortableItem$);
            cls.sortableCls.highlight(cls.sortableItem$);
        } else {
            $.fn.notifyB({'description': $.fn.gettext('The field duplication failed')})
        }
    }

    trigger_objRemove() {
        this.sortableCls.remove(this.sortableItem$);
    }

    trigger_objClick(target$) {
        const clsThis = this;
        let belongToButton$ = $(target$).closest('button');
        if (belongToButton$.length > 0) {
            if (belongToButton$.is('button.btn-setting')) {
                clsThis.trigger('config.load');
                clsThis.trigger('config.open');
                clsThis.configOfFieldCls.open($(this.sortableItem$));
            } else if (belongToButton$.is('button.btn-clone')) {
                if (clsThis.toolboxCls.stateClone === true) clsThis.trigger('obj.clone'); else {
                    Swal.fire({
                        title: `${$.fn.gettext('Clone field')}: ${clsThis.config.label}`,
                        html: `<p>${$.fn.gettext('Are you sure about cloning?')}</p>`,
                        icon: "question",
                        showCloseButton: true,
                        showCancelButton: true,
                        cancelButtonColor: "#d33",
                        cancelButtonText: $.fn.gettext('Cancel'),
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: $.fn.gettext('Yes, clone it')
                    }).then((result) => {
                        if (result.isConfirmed) {
                            clsThis.trigger('obj.clone');
                        }
                    });
                }
            } else if (belongToButton$.is('button.btn-remove')) {
                if (clsThis.toolboxCls.stateRemove === true) clsThis.trigger('obj.remove'); else {
                    Swal.fire({
                        title: `${$.fn.gettext('Delete field')}: ${clsThis.config.label}`,
                        html: `<p>${$.fn.gettext('Are you sure about deleting?')}</p>`,
                        icon: "question",
                        showCloseButton: true,
                        showCancelButton: true,
                        cancelButtonColor: "#d33",
                        cancelButtonText: $.fn.gettext('Cancel'),
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: $.fn.gettext('Yes, delete it')
                    }).then((result) => {
                        if (result.isConfirmed) {
                            clsThis.trigger('obj.remove');
                        }
                    });
                }
            }
        } else {
            clsThis.trigger('config.load');
            clsThis.trigger('config.open');
            clsThis.configOfFieldCls.open($(this.sortableItem$));
        }
    }
}

class FormTitleComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-title-config');
    }

    get defaultConfig() {
        return {
            'title': $.fn.gettext('Form title'),
            'remark': $.fn.gettext('Form descriptions'),
            'label_placement': 'top',
            'instruction_placement': 'bottom',
            'authentication_required': false,
            'authentication_type': 'system',
            'submit_only_one': false,
            'edit_submitted': false,
            'display_referrer_name': false,
            'display_creator': false,
            'theme_selected': 'simple',
            'theme_assets': {},
        }
    }

    get code() {
        return 'form-title';
    }

    get stateChangeAll() {
        return this._stateChangeAll;
    }

    set stateChangeAll(value) {
        this._stateChangeAll = value;
        this.pageCls.trigger('obj.reinit_ele');
    }

    constructor(props) {
        if (typeof props !== 'object') props = {};
        super(props);

        this._stateChangeAll = false;
        this.sortableItem$ = $('#head-sortable');
        this.sortableItem$.data('forms', this.$dataFormsDefault);
        this.on_trigger();

        let clsThis = this;
        $(window).on('beforeunload', function (e) {
            if (clsThis.stateChangeAll === true) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        // page
        this.pageCls = new FormPageListComponentType({
            'config': this.config.page,
        })

        // auto hide draggable item is not support
        if (this.sortableCls && this.draggableCls) {
            const arrCode = this.sortableCls.matchForm ? Object.keys(this.sortableCls.matchForm) : [];
            this.draggableCls.hideAllExclude(arrCode);
        } else this.draggableCls.hideAllExclude([]);

        clsThis.sortableCls.trigger('sortable.check_empty');
    }

    trigger_sortableAdd() {
        this.trigger('obj.reinit_ele');
    }

    trigger_objReinitEle(temp_config, storage) {
        let config = {
            ...this.config, ...temp_config,
        }
        this.sortableItem$.find('#form-title').text(config.title);
        this.sortableItem$.find('#form-title-remark').text(config.remark);
        if (!this.sortableItem$.attr('data-toolbar-loaded')) {
            this.sortableItem$.attr('data-toolbar-loaded', 'true');
            this.sortableItem$.append(this.sortable_toolbar(['setting']));
        }
        if (config.authentication_required){
            $("#idx-form-head").alterClass('form-item--*');
        } else {
            $("#idx-form-head").addClass('form-item--hide');
        }
    }

    trigger_configRealtime() {
        super.trigger_configRealtime();

        // trigger children
        let clsThis = this;
        this.sortableCls.find('.sortable-item').each(function () {
            if (!$(this).is(clsThis.sortableItem$)) {
                $(this).trigger('obj.reinit_ele', {'storage': 'configRealtime'});
            }
        });
    }

    trigger_objClone() {
    }

    trigger_configCancel() {
        super.trigger_configCancel();
        let clsThis = this;
        this.sortableCls.find('.sortable-item').each(function () {
            if (!$(this).is(clsThis.sortableItem$)) {
                $(this).trigger('obj.reinit_ele');
            }
        });
    }

    generateField(temp_config) {
    }

    // Export for all

    return_html_all(keep_footer=false) {
        return this.sortableCls.html_all(keep_footer);
    }

    return_config_all() {
        let _mainConfig = $('#head-sortable').data('forms').cls.config;
        let mainConfig = {
            ..._mainConfig,
            'entries_default_show': {
                'display_referrer_name': _mainConfig.display_referrer_name,
                'display_creator': _mainConfig.display_creator,
            },
            'page': this.pageCls.resolveConfig.config,
        };

        let configsOrder = [];
        let configs = {};
        let query = '.sortable-item[data-code]';
        query += ':not([data-code="form-title"])';
        query += ':not([data-code="form-page"])';

        $('#sortable-content')
            .find(query)
            .each(function () {
                if ($(this).data('code') !== 'form-title') {
                    let idx = $(this).attr('id');
                    if (idx) {
                        let data = $(this).data('forms');
                        if (data){
                            configsOrder.push($(this).attr('id'));
                            configs[idx] = data.cls.resolveConfig;
                        }
                    }
                }
            })

        // keep sortable-page at first
        mainConfig['configs_order'] = configsOrder;
        mainConfig['configs'] = configs;
        mainConfig['html_text'] = this.return_html_all();
        return mainConfig;
    }

    check_rules_form_global(mainConfig) {
        let required = 0;
        let inputsDataPass = 0;
        Object.keys(mainConfig['configs']).map(
            idx => {
                const config = mainConfig['configs'][idx];
                if (config?.['config']) {
                    if (config['config']?.['required'] === true) required += 1;
                }
                if (config?.['inputs_data']?.length > 0) {
                    inputsDataPass += 1;
                }
            }
        )
        let state = true;
        if (inputsDataPass === 0) {
            state = false;
            $.fn.notifyB({
                'description': $.fn.gettext('The form requires at least one input field'),
            }, 'failure');
        } else if (required === 0) {
            state = false;
            $.fn.notifyB({
                'description': $.fn.gettext('The form must have at least one required data field'),
            }, 'failure');
        }

        return state;
    }

    generate_init_load(configs_order, configs) {
        let clsThis = this;
        configs_order.map((idx) => {
            let config = configs?.[idx];
            if (config && config.hasOwnProperty('type')) {
                let form = clsThis.sortableCls.getForm(config.type);
                if (form) {
                    let cls = new form(config);
                    cls.trigger('obj.reinit_ele');
                    cls.trigger('sortable.add');
                }
            }
        });
        clsThis.pageCls.trigger('obj.reinit_ele');
    }

    // -- Export for all
}

class FormPageListComponentType extends FormComponentAbstract {
    static pageEle$(){
        return $('#page-sortable');
    }

    get configGroupEle$() {
        return $('#form-page-config');
    }

    get defaultConfig() {
        return {
            'enabled': false,
            'items': [],
            'show_progress_page': true,
            'display_title': 'bar',  // , page, ''
            'progress_style': 'steps', // bar, proportion, steps, step-piece
            'justify_progress_item': 'around', // around, between, evenly
            'display_page_number': true,
        }
    }

    get code() {
        return 'form-page';
    }

    findPageElement(opts){
        opts = {
            from: null,
            nextOrPrev: 'next',
            until: null,
            matcher: 'div.sortable-item',
            ...opts,
        }
        const from$ = opts.from instanceof jQuery ? opts.from : this.sortableCls.eleContent$;
        const until$ = opts.until instanceof jQuery ? opts.until : null;

        switch (opts.nextOrPrev) {
            case 'next':
                if (until$ instanceof jQuery && until$.length > 0){
                    return from$.nextUntil(until$, opts.matcher);
                }
                return from$.nextAll(opts.matcher);
            case 'prev':
                if (until$ instanceof jQuery && until$.length > 0){
                    return from$.prevUntil(until$, opts.matcher);
                }
                return from$.prevAll(opts.matcher);
        }
        return $(``);
    }

    get pageLength(){
        return this.config.items.length;
    }

    getConfigIndexHeadOfPage(ele$){
        const allPage$ = this.sortableCls.eleContent$.find(this.queryItemHead);
        for (let i=0; i < allPage$.length ; i++){
            if ($(allPage$[i]).is(ele$)) return i;
        }
        return null;
    }

    getConfigIndexOfFootOfPage(ele$){
        const pageListPrev$ = this.findPageElement({
            from: ele$,
            nextOrPrev: 'prev',
            matcher: this.queryItemHead,
        });
        if (pageListPrev$.length > 0){
            return this.getConfigIndexHeadOfPage(pageListPrev$.eq(0));
        }
        return null;
    }

    getHTMLStepPage(){
        return `
            <div class="step-item">
                <div class="icon-group">
                    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon icon-active" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="7.1" fill="#fff"/>
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M12.03 4.97a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon icon-deactivate" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="7.1" fill="#fff"/>
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    </svg>
                    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon icon-current" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="7.1" fill="#fff"/>
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <circle cx="8" cy="8" r="4"/>
                    </svg>
                </div>
                <div class="step-mask"></div>
            </div>
        `;
    }

    getHTMLProportionPage(){
        return `
            <div class="step-item">
                <div class="step-mask"></div>
            </div>
        `;
    }

    getHTMLBarPage(){
        return `
            <div class="step-item">
                <div class="step-mask"></div>
            </div>
        `;
    }

    getHTMLPiecePage(){
        return `
            <div class="step-item">
                <div class="step-mask"></div>
            </div>
        `;
    }

    getPlaceHolderEmptyOfPage(){
        return `
            <div class="sortable-item form-item form-item-md sortable-drop-here sortable-item-disabled" data-code="page-placeholder">
                <div><p>${$.fn.gettext('Drag fields from left panel and drop here to add them to your form.')}</p></div>
            </div>
        `
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        this.inputs_data = [];
        this.sortableItemUtil$ = this.sortable_toolbar(['setting', 'remove']);
        this.sortableItem$ = FormPageListComponentType.pageEle$();
        this.sortableItem$.data('forms', this.$dataFormsDefault);
        this.on_trigger()

        this.queryItemHead = `div.sortable-item[data-code=page-break-head]`;
        this.queryItemFoot = `div.sortable-item[data-code=page-break-foot]`;
        this.queryDropHere = 'div.sortable-item[data-code=page-placeholder]';
    }

    trigger_configWasChanged(){
        if (this.config.items.length > 0){
            this.sortableItem$.show();
        } else {
            this.sortableItem$.hide();
        }
    }

    reloadPageItemConfig(items, temp_config){
        const config = {...this.config, ...temp_config};

        // show / hide page list
        if (items.length > 0) this.sortableItem$.show();
        else this.sortableItem$.hide();

        //
        let isShowPage = false;
        switch (config.display_title) {
            case 'page':
                isShowPage = true;
                break
            case 'bar':
                isShowPage = false;
                break
            case 'bar-and-page':
                isShowPage = true
                break
            case '':
            default:
                isShowPage = false
                break
        }

        //
        return items.map(
            (item, index) => {
                // head
                item['head']['show_head'] = isShowPage;
                // footer
                item['foot']['page_number'] = index + 1;
                item['foot']['page_length'] = items.length;
                item['foot']['is_prev'] = index !== 0;
                item['foot']['is_next'] = index !== items.length - 1;
                item['foot']['show_page_number'] = config.display_page_number === true;
                return item;
            }
        )
    }

    get defaultConfigPageItemHead(){
        return {
            'label': `${$.fn.gettext('Page')}`,
            'show_head': false,
        }
    }

    get defaultConfigPageItemFoot(){
        return {
                'is_prev': true,
                'is_next': true,
                'title_prev': $.fn.gettext('Previous page'),
                'title_next': $.fn.gettext('Next page'),
                'page_number': null,
                'page_length': null,
            }
    }

    pageAdd(indexInsert= 0){
        let items = this.config?.['items'] || [];
        if (items.length === 0){
            // add first page element to sortable
            const firstPageConfig = {
                'head': {
                    ...this.defaultConfigPageItemHead,
                    'label': `${$.fn.gettext('Page')} 1`,
                },
                'foot': {
                    ...this.defaultConfigPageItemFoot,
                },
            };
            const firstPageCls = new FormPageItemHeadComponentType({
                    'config': firstPageConfig,
            });
            firstPageCls.trigger('obj.reinit_ele');
            this.sortableCls.ele$.prepend(firstPageCls.sortableItem$);

            //
            items = [
                firstPageConfig,
                {
                    'head': {
                        ...this.defaultConfigPageItemHead,
                        'label': `${$.fn.gettext('Page')} 2`,
                    },
                    'foot': {
                        ...this.defaultConfigPageItemFoot,
                    },
                },
            ]
        } else {
            const newConfig = {
                'head': {
                    ...this.defaultConfigPageItemHead,
                    'label': `${$.fn.gettext('Page')} ${items.length + 1}`,
                },
                'foot': {
                    ...this.defaultConfigPageItemFoot,
                },
            }
            if (items.length === 0){
                items = [
                    newConfig,
                    ...items
                ]
            } else if (items.length === indexInsert) {
                items = [
                    ...items,
                    newConfig,
                ]
            } else if (items.length > indexInsert){
                items = [
                    ...items.slice(0, indexInsert),
                    newConfig,
                    ...items.slice(indexInsert),
                ]
            } else return false;
        }
        this.config = {
            'enabled': items.length > 0,
            'items': this.reloadPageItemConfig(items)
        }
        return this.config;
    }

    pageRemove(indexRemove){
        let items = this.config.items;
        if (indexRemove < items.length){
            items = [
                ...items.slice(0, indexRemove),
                ...items.slice(indexRemove + 1),
            ]
            this.config = {
                'enabled': items.length > 0,
                'items': items
            };
        }
    }

    pageItemConfigUpdate(indexChanges, dataHead, dataFoot){
        const items = this.config.items;
        if (Number.isInteger(indexChanges) && indexChanges < items.length){
            let itemChanges = items[indexChanges];
            itemChanges['head'] = {
                ...itemChanges['head'],
                ...dataHead,
            }
            itemChanges['foot'] = {
                ...itemChanges['foot'],
                ...dataFoot,
            }
            this.config = {
                'items': [
                    ...items.slice(0, indexChanges),
                    itemChanges,
                    ...items.slice(indexChanges + 1),
                ]
            }
        }
    }

    trigger_sortableAdd(previousEle$) {
        this.trigger('obj.reinit_ele');
        this.trigger_configWasChanged();
    }

    trigger_sortableAddBefore(nextEle$) {
        this.trigger('obj.reinit_ele');
        this.trigger_configWasChanged();
    }

    trigger_objReinitEle(temp_config, storage){
        const config = {...this.config, ...temp_config};
        const items = this.reloadPageItemConfig(config?.['items'] || [], temp_config);

        const progress$ = this.sortableItem$.find('.progress-steps');
        const group$ = this.sortableItem$.find('.steps-group');

        let addTitle = true;
        progress$.alterClass('steps-*')
        switch (config.display_title) {
            case 'page':
                addTitle = false;
                break
            case 'bar':
                addTitle = true;
                progress$.addClass('steps-bar-has-title');
                break
            case 'bar-and-page':
                addTitle = true;
                progress$.addClass('steps-bar-has-title');
                break
            case '':
            default:
                addTitle = false;
                break
        }

        group$.alterClass('steps-space-*');
        group$.attr('data-progress-justify', config.justify_progress_item);
        switch (config.justify_progress_item){
            case 'around':
                group$.addClass('steps-space-around');
                break
            case 'between':
                group$.addClass('steps-space-between');
                break
            case 'evenly':
                group$.addClass('steps-space-evenly');
                break
        }

        group$.attr('data-progress-style', config.progress_style);
        group$.empty();
        switch (config.progress_style){
            case 'proportion':
                items.map(
                    (item, index) => {
                        const ele$ = $(this.getHTMLProportionPage());
                        ele$.attr('data-page', item.foot.page_number)
                        if (addTitle === true) ele$.find('.step-mask').text(item.head.label || '');
                        if (index === 0) ele$.addClass('active');
                        group$.append(ele$);
                    }
                )
                break
            case 'bar':
                items.map(
                    (item, index) => {
                        const ele$ = $(this.getHTMLBarPage());
                        ele$.attr('data-page', item.foot.page_number)
                        if (addTitle === true) ele$.find('.step-mask').text(item.head.label || '');
                        if (index === 0) ele$.addClass('active');
                        group$.append(ele$);
                    }
                )
                break
            case 'piece':
                items.map(
                    (item, index) => {
                        const ele$ = $(this.getHTMLPiecePage());
                        ele$.attr('data-page', item.foot.page_number)
                        if (addTitle === true) ele$.find('.step-mask').text(item.head.label || '');
                        if (index === 0) ele$.addClass('active');
                        group$.append(ele$);
                    }
                )
                break
            case 'steps':
            default:
                items.map(
                    (item, index) => {
                        const ele$ = $(this.getHTMLStepPage());
                        ele$.attr('data-page', item.foot.page_number);
                        if (addTitle === true) ele$.find('.step-mask').text(item.head.label || '');
                        if (index === 0) ele$.addClass('active');
                        group$.append(ele$);
                    }
                )
                break
        }

        this.sortableItem$.alterClass('form-item--*');
        let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
        if (config.show_progress_page === false){
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            settingSpecial$.empty().append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
            this.sortableItem$.addClass('form-item--hide');
        } else {
            settingSpecial$.remove();
        }

        this.clean_toolbar();
        this.sortableItem$.append(this.sortableItemUtil$);

        // step 0: destroy sortable-drop-here
        this.sortableCls.eleContent$.find(this.queryDropHere).remove();
        // step 1: destroy footer
        this.sortableCls.eleContent$.find(this.queryItemFoot).remove();
        // // step 2: call render of head (foot render depends on)
        let i = 0;
        this.sortableCls.eleContent$.find(this.queryItemHead).each(function (){
            const itemData = items?.[i];
            if (typeof itemData === 'object'){
                $(this).trigger('page.head.render', items[i]);
            } else {
                $(this).remove();
            }
            i += 1;
        });
    }

    trigger_objRemove() {
        this.config = {'items': []};
        this.trigger_objReinitEle();
        this.sortableItem$.hide();
    }

    trigger_objClone() {}
}

class FormPageItemHeadComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#page-break-head');
    }

    get defaultConfig() {
        return {
            'label': '',
            'head': {
                'label': '',
                'show_head': false,
            },
            'foot': {
                'is_prev': false,
                'is_next': false,
                'title_prev': '',
                'title_next': '',
                'show_page_number': false,
                'page_number': null,
                'page_length': null,
            },
        }
    }

    get code() {
        return 'page-break-head';
    }

    get pageCls(){
        return FormPageListComponentType.pageEle$().data('forms').cls;
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        this.config = {
            ...this.config,
            'head': {
                ...this.defaultConfig['head'],
                ...this.config?.['head'],
            },
            'foot': {
                ...this.defaultConfig['foot'],
                ...this.config?.['foot'],
            },
            'label': this.config.head.label || '',
        }

        this.inputs_data = [];

        this.sortableItem$ = $(`<div></div>`)
            .addClass('sortable-item form-item form-item-md sortable-item-fixed form-item-page-break')
            .attr('data-code', this.code)
            .attr('id', this.idx);
        this.sortableItemUtil$ = this.sortable_toolbar(['setting', 'remove']);
        this.sortableItem$.data('forms', this.$dataFormsDefault);
        this.on_trigger();

        this.register_trigger({
            'page.head.render': this.trigger_pageHeadRender,
        });
    }

    _getNextPage(){
        const nextPage$ = this.pageCls.findPageElement({
            from: this.sortableItem$,
            matcher: this.pageCls.queryItemHead,
        })
        if (nextPage$.length > 0){
            return nextPage$.eq(0);
        }
        return null;
    }

    _getFootOfHead(){
        const nextPage$ = this._getNextPage();
        if (nextPage$){
            const foot$ = this.pageCls.findPageElement({
                from: this.sortableItem$,
                until: nextPage$.length > 0 ? nextPage$.eq(0) : null,
                matcher: this.pageCls.queryItemFoot,
            })

            return foot$.length > 0 ? foot$.eq(0) : null;
        }
        return null;
    }

    trigger_pageHeadRender(event, config){
        // head
        this.config = {
            ...config,
            'head': {
                ...this.defaultConfig['head'],
                ...config?.['head'],
            },
            'foot': {
                ...this.defaultConfig['foot'],
                ...config?.['foot'],
            },
            'label': this.config.head.label || '',
        };
        this.trigger_objReinitEle();

        // footer
        const nextPage$ = this._getNextPage();
        const footCls = new FormPageItemFootComponentType({
            config: this.config?.['foot'] || {},
        });
        if (nextPage$){
            footCls.trigger('sortable.add_before', nextPage$)
        } else {
            footCls.trigger('sortable.add');
        }

        // check between head and foot is empty!
        const between$ = this.pageCls.findPageElement({
            from: this.sortableItem$,
            until: footCls.sortableItem$,
        });
        if (between$.length === 0){
            $(this.pageCls.getPlaceHolderEmptyOfPage()).insertAfter(this.sortableItem$)
        }
    }

    trigger_sortableNewAfter() {
        super.trigger_sortableNewAfter();
        const indexPage = this.pageCls.getConfigIndexHeadOfPage(this.sortableItem$);
        this.pageCls.pageAdd(indexPage);
        this.pageCls.trigger_objReinitEle();
    }

    trigger_configLoad(temp_config) {
        const config = {...this.config, ...temp_config};
        this.configGroupEle$.find(`[name=label]`).val(config.head.label);
        const prev$ = this.configGroupEle$.find(`[name=title_prev]`);
        if (config.foot.is_prev === true) {
            prev$.val(config.foot.title_prev).prop('disabled', false);
            prev$.closest('.form-group').show();
        } else {
            prev$.val('').prop('disabled', true);
            prev$.closest('.form-group').hide();
        }
        const next$ = this.configGroupEle$.find(`[name=title_next]`);
        if (config.foot.is_next === true){
            next$.val(config.foot.title_next).prop('disabled', false);
            next$.closest('.form-group').show();
        } else {
            next$.val(config.foot.title_next).prop('disabled', true);
            next$.closest('.form-group').hide();
        }
    }

    trigger_configSave(new_config) {
        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}

            super.trigger_configSave(new_config);

            const indexPage = this.pageCls.getConfigIndexHeadOfPage(this.sortableItem$);
            this.pageCls.pageItemConfigUpdate(
                indexPage,
                {
                    'label': configSum.label,
                },
                    {
                    'title_prev': configSum['title_prev'],
                    'title_next': configSum['title_next'],
                }
            );
            this.pageCls.trigger_objReinitEle();
        }
    }

    trigger_objReinitEle(temp_config, storage) {
        const config = {...this.config, ...temp_config};

        this.clean_toolbar();
        this.sortableItem$
            .attr('data-page', config.foot.page_number)
            .empty()
            .append(
                `<div><p class="page-title">${config.head.label}</p></div>`
            )
            .append(this.sortableItemUtil$);
        this.sortableItem$.alterClass('form-item--*');
        if (config.head.show_head === false){
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
            this.sortableItem$.addClass('form-item--hide');
        }
    }

    trigger_objRemove() {
        const indexPage = this.pageCls.getConfigIndexHeadOfPage(this.sortableItem$);
        this.pageCls.pageRemove(indexPage);
        super.trigger_objRemove();
        this.pageCls.trigger_objReinitEle();
    }
}

class FormPageItemFootComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#page-break-foot');
    }

    get defaultConfig() {
        return {
            'is_prev': false,
            'is_next': false,
            'title_prev': '',
            'title_next': '',
            'show_page_number': false,
            'page_number': null,
            'page_length': null,
        }
    }

    get code() {
        return 'page-break-foot';
    }

    get pageCls(){
        return FormPageListComponentType.pageEle$().data('forms').cls;
    }

    constructor(props) {
        if (!props) props ={}
        super(props);

        this.inputs_data = [];
        this.sortableItem$ = $(`<div></div>`)
            .addClass('sortable-item form-item form-item-sm sortable-item-fixed')
            .attr('data-code', this.code)
            .attr('id', this.idx);
        this.sortableItem$.addClass('form-item-controller');
        this.sortableItemUtil$ = this.sortable_toolbar(['setting']);
        this.sortableItem$.data('forms', this.$dataFormsDefault);
        this.on_trigger();
    }

    trigger_configLoad(temp_config) {
        const config = {...this.config, ...temp_config};
        const prev$ = this.configGroupEle$.find(`[name=title_prev]`);
        if (config.is_prev === true) {
            prev$.val(config.title_prev).prop('disabled', false);
            prev$.closest('.form-group').show();
        } else {
            prev$.val('').prop('disabled', true);
            prev$.closest('.form-group').hide();
        }
        const next$ = this.configGroupEle$.find(`[name=title_next]`);
        if (config.is_next === true){
            next$.val(config.title_next).prop('disabled', false);
            next$.closest('.form-group').show();
        } else {
            next$.val('').prop('disabled', true);
            next$.closest('.form-group').hide();
        }
    }

    trigger_configSave(new_config) {
        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}

            super.trigger_configSave(new_config);

            const indexPage = this.pageCls.getConfigIndexOfFootOfPage(this.sortableItem$);
            this.pageCls.pageItemConfigUpdate(
                indexPage,
                null,
                {
                    'title_prev': configSum['title_prev'],
                    'title_next': configSum['title_next'],
                }
            );
            this.pageCls.trigger_objReinitEle();
        }
    }

    trigger_objReinitEle(temp_config, storage) {
        const config = {...this.config, ...temp_config};
        const groupBtn$ = $(`<div class="page-btn-group"></div>`);
        if (config.is_prev === true) groupBtn$.append(`<button type="button" class="btn-previous">${config.title_prev}</button>`);
        if (config.is_next === true) groupBtn$.append(`<button type="button" class="btn-next">${config.title_next}</button>`);
        this.sortableItem$
            .empty().append(groupBtn$)
            .attr('data-page', config.page_number);
        if (config.show_page_number && config.page_number && config.page_length) {
            this.sortableItem$.append(
                `<div class="page-number-group"><p>${config.page_number}/${config.page_length}</p></div>`
            );
        }
        this.clean_toolbar();
        this.sortableItem$.append(this.sortableItemUtil$);
    }

    trigger_objRemove() {}
}

class FormSingleLineComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-single-line');
    }

    get defaultConfig() {
        return {
            'label': 'Single Line',
            'is_hide_label': false,
            'instruction': '',
            'size': 'medium',
            'place_holder': '',
            'init_value': '',
            'minlength': 0,
            'maxlength': 255,
            'required': false,
            'unique': false,
            'visibility': 'unset',
            'input_type': 'any-character',
            'input_type_value': '',
            'input_text_case': 'unset',
        }
    }

    get code() {
        return 'single-line';
    }

    get defaultInputsDataItem() {
        let data = super._defaultInputsDataItem();
        data['label'] = this.config.label;
        return data;
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                }
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
    }

    trigger_configRealtime() {
        const config = super.trigger_configRealtime();
        //
        const visibility = config?.visibility;
        const required = config?.required;
        const unique = config?.unique;
        if (visibility === 'hide' || visibility === 'disable') {
            if (required) {
                this.configGroupEle$
                    .find('input[name=required]')
                    .prop('checked', false)
                    .trigger('change');
            }
            if (unique) {
                this.configGroupEle$
                    .find('input[name=unique]')
                    .prop('checked', false)
                    .trigger('change');
            }
        }
    }

    trigger_objClone() {
        let config = {
            ...this,
            'inputs_data': this.inputs_data.map(data => {
                return {
                    ...data, ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                }
            })
        }
        let cls = new FormSingleLineComponentType(config);
        cls.trigger('obj.reinit_ele');
        cls.trigger('sortable.add', this.sortableItem$);
    }

    trigger_objReinitEle(temp_config, storage) {
        super.trigger_objReinitEle(temp_config, storage);
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = this.inputs_data[0];
        inputs_data = {
            ...inputs_data, // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }

        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<input class="form-item-input" type="text" name="${inputs_data.name}" />`);

        if (config.maxlength || typeof config.minlength === 'number') {
            inputs_data['kwargs']['maxlength'] = config.maxlength;
        }
        if (config.minlength || typeof config.minlength === 'number') {
            inputs_data['kwargs']['minlength'] = config.minlength;
        }
        if (config.init_value) {
            inputs_data['kwargs']['value'] = config.init_value;
        }
        switch (config.input_text_case) {
            case 'lower':
                inputs_data['kwargs']['class'].add('text-lower');
                break
            case 'upper':
                inputs_data['kwargs']['class'].add('text-upper');
                break
            case 'capitalize':
                inputs_data['kwargs']['class'].add('text-capitalize');
                break
        }
        switch (config.input_type) {
            case 'letters-only':
                inputs_data['kwargs']['pattern'] = '[a-zA-Z]*';
                break
            case 'letters-number':
                inputs_data['kwargs']['pattern'] = '[a-zA-Z0-9]*';
                break
            case 'letter-number-space':
                inputs_data['kwargs']['pattern'] = '[a-zA-Z0-9 ]*';
                break
            case 'letters-space':
                inputs_data['kwargs']['pattern'] = '[a-zA-Z ]*';
                break
            case 'custom':
                inputs_data['kwargs']['pattern'] = config.input_type_value || '';
                break
        }
        if (config.place_holder) {
            inputs_data['kwargs']['placeholder'] = config.place_holder;
        }
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }
        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-input-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-input-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-input-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-input-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-input-xl');
                break
        }
        if (config.unique) {
            inputs_data['args'].add('data-unique');
        }

        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_input_group)
            .empty()
            .append(inp$)
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

class FormNumberComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-number');
    }

    get defaultConfig() {
        return {
            'label': 'Number',
            'label_for_report': $.fn.gettext('Value number'),
            'is_hide_label': false,
            'instruction': '',
            'size': 'medium',
            'place_holder': '',
            'init_value': '',
            'min': 0,
            'max': 999999999,
            'required': false,
            'unique': false,
            'visibility': 'unset',
            'unit_code': '',
            'unit_placement': 'suffix',
            'unit_width_px': 60,
            'unit_text_align': 'center',
            'validate_value_type': 'unset',
            'unit_label_for_report': $.fn.gettext('Unit code'),
        }
    }

    get code() {
        return 'number';
    }

    get defaultInputsDataItem() {
        let data = super._defaultInputsDataItem();
        data['kwargs']['type'] = 'number';
        data['label'] = this.config.label_for_report;
        return data;
    }

    get defaultInputDataItemUnitCode() {
        let data = super._defaultInputsDataItem();
        data['label'] = this.config.unit_label_for_report;
        data['args'].add('readonly');
        return data;
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            const nameTmp = this.generateName();
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': nameTmp,
                }, {
                    ...this.defaultInputDataItemUnitCode,
                    'name': `${nameTmp}_unit_code`,
                }
            ];
        } else if (this.inputs_data.length === 2) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of single-line field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
    }

    trigger_configRealtime() {
        const config = super.trigger_configRealtime();
        //
        const visibility = config?.visibility;
        const required = config?.required;
        const unique = config?.unique;
        if (visibility === 'hide' || visibility === 'disable') {
            if (required) {
                this.configGroupEle$
                    .find('input[name=required]')
                    .prop('checked', false)
                    .trigger('change');
            }
            if (unique) {
                this.configGroupEle$
                    .find('input[name=unique]')
                    .prop('checked', false)
                    .trigger('change');
            }
        }
    }

    trigger_objClone() {
        let config = {
            ...this,
            'inputs_data': [
                {
                    ...this.inputs_data[0], ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                }, {
                    ...this.inputs_data[1], ...this.defaultInputDataItemUnitCode,
                    'name': this.generateName(),
                },
            ]
        }
        let cls = new FormNumberComponentType(config);
        cls.trigger('obj.reinit_ele');
        cls.trigger('sortable.add', this.sortableItem$);
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputsData0 = {
            ...this.inputs_data[0], // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }
        let inputsData1 = {
            ...this.inputs_data[1], // reset args and kwargs before handle
            ...this.defaultInputDataItemUnitCode,
        }
        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp0$ = $(`<input class="form-item-input" type="number" name="${inputsData0.name}" />`);
        let inp1$ = $(`<input class="form-item-input" type="text" name="${inputsData1.name}" />`);

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);
        const inputGroup$ = groupAll$
            .find('.' + this.cls_input_group)
            .empty();
        switch (config.unit_placement) {
            case 'prefix':
                inputGroup$.append(inp1$).append(inp0$);
                break
            case 'suffix':
                inputGroup$.append(inp0$).append(inp1$);
                break
        }
        switch (config.size) {
            case 'extra-small':
                inputsData0['kwargs']['class'].add('form-input-xs');
                inputsData1['kwargs']['class'].add('form-input-unit-xs');
                break
            case 'small':
                inputsData0['kwargs']['class'].add('form-input-sm');
                inputsData1['kwargs']['class'].add('form-input-unit-sm');
                break
            case 'medium':
                inputsData0['kwargs']['class'].add('form-input-md');
                inputsData1['kwargs']['class'].add('form-input-unit-md');
                break
            case 'large':
                inputsData0['kwargs']['class'].add('form-input-lg');
                inputsData1['kwargs']['class'].add('form-input-unit-lg');
                break
            case 'extra-large':
                inputsData0['kwargs']['class'].add('form-input-xl');
                inputsData1['kwargs']['class'].add('form-input-unit-xl');
                break
        }
        if (config.place_holder) inputsData0['kwargs']['placeholder'] = config.place_holder;
        if (config.init_value) inputsData0['kwargs']['value'] = config.init_value;
        if (config.max || typeof config.max === 'number') inputsData0['kwargs']['max'] = config.max;
        if (config.min || typeof config.min === 'number') inputsData0['kwargs']['min'] = config.min;
        if (config.unit_code) {
            inputsData0['kwargs']['class'].add('form-input-has-unit');
            inputsData1['kwargs']['class'].add('form-input-is-unit');
            inputsData1['kwargs']['value'] = config.unit_code;

            if (config.unit_width_px) inp1$.css('width', `${config.unit_width_px}px`);

            switch (config.unit_text_align) {
                case 'left':
                    inputsData1['kwargs']['class'].add('text-align-left');
                    break
                case 'center':
                    inputsData1['kwargs']['class'].add('text-align-center');
                    break
                case 'right':
                    inputsData1['kwargs']['class'].add('text-align-right');
                    break
            }
        } else {
            inputsData1['args'].add('disabled');
            inputsData1['kwargs']['class'].add('hidden');
            inputsData1['display'] = false;
        }
        switch (config.validate_value_type) {
            case 'unset':
                break
            case 'int':
                inputsData0['kwargs']['data-valid-numberType'] = 'int';
                break
            case 'float':
                inputsData0['kwargs']['data-valid-numberType'] = 'float';
                break
        }
        if (config.required) {
            label$.addClass('required');
            inputsData0['args'].add('required');
        }
        if (config.unique) inputsData0['args'].add('data-unique');
        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputsData0['kwargs']['class'].add('hidden');
                    inputsData1['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputsData0['args'].add('disabled');
                    inputsData1['args'].add('disabled');
                    break
            }
        }

        this.applyInputsDataToInput(inp0$, inputsData0);
        this.applyInputsDataToInput(inp1$, inputsData1);
        this.inputs_data[0] = inputsData0;
        this.inputs_data[1] = inputsData1;
    }
}

class FormMultipleLineComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-multiple-line');
    }

    get defaultConfig() {
        return {
            'label': 'Multiple Line',
            'is_hide_label': false,
            'instruction': '',
            'place_holder': '',
            'size': 'medium',
            'cols': '',
            'rows': 3,
            'init_value': '',
            'type_count': 'characters',
            'min': 0,
            'max': 65535,
            'required': false,
            'visibility': 'unset',
            'input_text_case': 'unset'
        }
    }

    get code() {
        return 'multiple-line';
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                },
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of single-line field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
    }

    trigger_configRealtime() {
        const config = super.trigger_configRealtime();
        //
        const visibility = config?.visibility;
        const required = config?.required;
        const unique = config?.unique;
        if (visibility === 'hide' || visibility === 'disable') {
            if (required) {
                this.configGroupEle$
                    .find('input[name=required]')
                    .prop('checked', false)
                    .trigger('change');
            }
            if (unique) {
                this.configGroupEle$
                    .find('input[name=unique]')
                    .prop('checked', false)
                    .trigger('change');
            }
        }
    }

    trigger_objClone() {
        let config = {
            ...this,
            'inputs_data': [
                {
                    ...this.inputs_data[0], ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                },
            ]
        }
        let cls = new FormMultipleLineComponentType(config);
        cls.trigger('obj.reinit_ele');
        cls.trigger('sortable.add', this.sortableItem$);
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = {
            ...this.inputs_data[0], // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }
        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<textarea class="form-item-input" rows="${config.rows}" name="${inputs_data.name}" />`);

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);
        const inputGroup$ = groupAll$
            .find('.' + this.cls_input_group)
            .empty()
            .append(inp$);

        if (config.place_holder) inputs_data['kwargs']['placeholder'] = config.place_holder;
        if (config.init_value) inputs_data['kwargs']['value'] = config.init_value;
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }
        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-input-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-input-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-input-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-input-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-input-xl');
                break
        }
        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }
        switch (config.input_text_case) {
            case 'lower':
                inputs_data['kwargs']['class'].add('text-lower');
                break
            case 'upper':
                inputs_data['kwargs']['class'].add('text-upper');
                break
            case 'capitalize':
                inputs_data['kwargs']['class'].add('text-capitalize');
                break
        }
        switch (config.type_count) {
            case 'characters':
                inputs_data['kwargs']['minlength'] = config.min;
                inputs_data['kwargs']['maxlength'] = config.max;
                break
            case 'words':
                inputs_data['kwargs']['data-valid-counterWordsMin'] = config.min;
                inputs_data['kwargs']['data-valid-counterWordsMax'] = config.max;
                break
        }

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

class FormPhoneComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-phone');
    }

    get defaultConfig() {
        return {
            'label': 'Phone',
            'is_hide_label': false,
            'instruction': '',
            'place_holder': '',
            'size': 'medium',
            'required': false,
            'visibility': 'unset',
            'label_for_report': $.fn.gettext('Phone number'),
            'label_region_for_report': $.fn.gettext('Region code'),
            'region_enable': true,
            'region_visible': true,
            'region_allowed_list': ['84'],
            'region_default': '84',
        }
    }

    get code() {
        return 'phone';
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            const name = this.generateName();
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': name,
                }, {
                    ...this.defaultInputsDataItem,
                    'name': `${name}_region`,
                },
            ];
        } else if (this.inputs_data.length === 2) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of single-line field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = {
            ...this.inputs_data[0], // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }
        let inputsDataRegion = {
            ...this.inputs_data[1], // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }

        const stateRegion = config.region_enable || false;

        inputs_data['label'] = config.label_for_report ? config.label_for_report : '';
        inputsDataRegion['label'] = config.label_region_for_report ? config.label_region_for_report : '';
        inputsDataRegion['display'] = stateRegion === true;

        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<input class="form-item-input" name="${inputs_data.name}" type="text" />`);
        let inpRegion$ = $(`
            <select 
                class="data-phone-region form-item-input" 
                name="${inputsDataRegion.name}" 
                data-selected-id="84"
                data-selected-text="Việt Nam"
                data-selected-url="/static/form/runtime/vendors/flags/vn.svg"
            ></select>
        `);

        let regionAllowed$ = this.configGroupEle$.find('[name="region_allowed_list"]');
        if (regionAllowed$.length > 0) {
            config.region_allowed_list.map(countryCode => {
                let eleMatch$ = regionAllowed$.find(`option[value="${countryCode}"]`);
                if (eleMatch$.length > 0) {
                    const optionVal = eleMatch$.val();
                    inpRegion$.append(new Option(eleMatch$.text(), optionVal, optionVal === config.region_default, optionVal === config.region_default))
                }
            });
        }

        inputs_data['kwargs']['data-valid-phone'] = true;

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);

        let groupSelect = $('<div class="data-phone-region-parent" style="margin-right: 10px;"></div>');
        if (config.region_visible === false) groupSelect.css('display', 'none').css('visible', false);
        groupSelect.append(inpRegion$)

        let inputGroup$ = groupAll$.find('.' + this.cls_input_group).empty();
        if (stateRegion === true) inputGroup$.append(groupSelect).append(inp$); else inputGroup$.append(inp$);

        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-input-xs');
                inputsDataRegion['kwargs']['class'].add('form-input-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-input-sm');
                inputsDataRegion['kwargs']['class'].add('form-input-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-input-md');
                inputsDataRegion['kwargs']['class'].add('form-input-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-input-lg');
                inputsDataRegion['kwargs']['class'].add('form-input-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-input-xl');
                inputsDataRegion['kwargs']['class'].add('form-input-xl');
                break
        }
        if (config.place_holder) inputs_data['kwargs']['placeholder'] = config.place_holder;
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
            inputsDataRegion['args'].add('required');
        }
        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }

        this.applyInputsDataToInput(inp$, inputs_data);
        this.applyInputsDataToInput(inpRegion$, inputsDataRegion);
        this.inputs_data[0] = inputs_data;
        this.inputs_data[1] = inputsDataRegion;
    }
}

class FormEmailComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-email');
    }

    get defaultConfig() {
        return {
            'label': 'Mail',
            'is_hide_label': false,
            'instruction': '',
            'place_holder': '',
            'size': 'medium',
            'init_value': '',
            'domain_allow_validation': 'unset',
            'domain_allow_validation_data': '',
            'domain_restrict_validation': 'unset',
            'domain_restrict_validation_data': '',
            'max': 255,
            'required': false,
            'visibility': 'unset',
            'input_text_case': 'lower',
        }
    }

    get code() {
        return 'email';
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            const name = this.generateName();
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': name,
                },
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = {
            ...this.inputs_data[0], // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }
        inputs_data['kwargs']['type'] = 'email';
        inputs_data['label'] = config.label_for_report ? config.label_for_report : '';

        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<input class="form-item-input" name="${inputs_data.name}" type="email" />`);
        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);
        groupAll$.find('.' + this.cls_input_group).empty().append(inp$);

        if (config.place_holder) inputs_data['kwargs']['placeholder'] = config.place_holder;
        if (config.init_value) inputs_data['kwargs']['value'] = config.init_value;
        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-input-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-input-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-input-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-input-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-input-xl');
                break
        }
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }
        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }
        switch (config.input_text_case) {
            case 'lower':
                inputs_data['kwargs']['class'].add('text-lower');
                break
            case 'upper':
                inputs_data['kwargs']['class'].add('text-upper');
                break
            case 'capitalize':
                inputs_data['kwargs']['class'].add('text-capitalize');
                break
        }

        const domainAllowValidData = Array.from(config.domain_allow_validation_data.split(",").map(item => item.trim())).join(",");
        config.domain_allow_validation_data = domainAllowValidData;
        switch (config.domain_allow_validation) {
            case 'unset':
                break
            case 'allow':
                inputs_data['kwargs']['data-valid-allow_emailDomainValidation'] = domainAllowValidData;
                break
        }

        const domainRestrictValidData = Array.from(config.domain_restrict_validation_data.split(",").map(item => item.trim())).join(",");
        config.domain_restrict_validation_data = domainRestrictValidData;

        switch (config.domain_restrict_validation) {
            case 'unset':
                break
            case 'restrict':
                inputs_data['kwargs']['data-valid-restrict_emailDomainValidation'] = domainRestrictValidData;
                break
        }

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

class FormSelectComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-select');
    }

    get code() {
        return 'select';
    }

    get defaultConfig() {
        return {
            'label': 'Select Box',
            'is_hide_label': false,
            'instruction': '',
            'place_holder': $.fn.gettext("Select..."),
            'size': 'medium',
            'required': false,
            'visibility': 'unset',
            'is_multiple': false,
            'style': 'default',
            'matrix_cols': [],
            'matrix_rows': [],
            'matrix_group_by': '',
            'options': [
                {
                    'title': $.fn.gettext('First Choice'),
                    'is_default': false,
                    'is_default_multiple': false,
                },
                {
                    'title': $.fn.gettext('Second Choice'),
                    'is_default': false,
                    'is_default_multiple': false,
                },
                {
                    'title': $.fn.gettext('Third Choice'),
                    'is_default': false,
                    'is_default_multiple': false,
                },
            ],
        }
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            const name = this.generateName();
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': name,
                    'element': 'select',
                },
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }

        const config = {...this.config, ...temp_config};
        const optionBase$ = this.configGroupEle$.find('#select-option-base');
        optionBase$.trigger('data.clean');
        optionBase$.trigger('data.load', config);
        optionBase$.trigger('data.multiple.set');

        const optionMatrix$ = this.configGroupEle$.find('#select-group-option-matrix');
        optionMatrix$.trigger('data.clean');
        optionMatrix$.trigger('data.load', config);
    }

    trigger_configSave(new_config) {
        let frm$ = this.configGroupEle$.find('form');
        let config = SetupFormSubmit.serializerObject(frm$);
        const is_multiple = frm$.find('input[type=checkbox][name="is_multiple"]').prop('checked');
        const configSum = {...this.config, ...config, ...new_config};

        function showErrorOfField(errs) {
            frm$.validate().showErrors(errs);
            $.fn.notifyB({
                'description': $.fn.gettext('Some configuration data is not correct')
            }, 'failure');
        }

        let configResult = [];
        if (configSum['style'] === 'default' || configSum['style'] === 'xbox') {
            let arrTitleName = [];
            let arrTitle = [];
            let arrDefaultValueMultiple = [];

            Object.keys(configSum).map(
                key => {
                    if (key.startsWith('select_option_title_')) {
                        arrTitleName.push(key);
                        arrTitle.push(configSum[key]);
                    }
                }
            )

            this.configGroupEle$.find('input[name^="select_option_default_multiple_"]').each(function () {
                if ($(this).prop('checked') === true) {
                    const valueTitleTmp = $(this).closest('.select-box-item-data').find('input[name^="select_option_title"]').val();
                    if (valueTitleTmp) {
                        arrDefaultValueMultiple.push(valueTitleTmp);
                    }
                }
            })

            const defaultValue = configSum['select_option_default'];
            if (defaultValue && arrTitle.indexOf(defaultValue) === -1) {
                showErrorOfField({
                    'select-option-error-general': $.validator.messages?.['required'] || 'This field is required',
                    'select_option_default': ''
                })
                return false;
            }

            if (arrTitle.length) {
                if ((new Set(arrTitle)).size !== arrTitle.length) {
                    let errors = {
                        'select-option-error-general': $.fn.gettext('Ensure that titles are unique in the list'),
                    };
                    arrTitleName.map(
                        key => {
                            errors[key] = ''
                        }
                    )
                    showErrorOfField(errors);
                    return false;
                }
                for (let i = 0; i < arrTitle.length; i++) {
                    configResult.push({
                        'title': arrTitle[i].trim(),
                        'value': arrTitle[i].trim(),
                        'is_default': arrTitle[i] === defaultValue,
                        'is_default_multiple': arrDefaultValueMultiple.indexOf(arrTitle[i]) !== -1,
                        'col': '',
                        'row': '',
                    })
                }
            }
        }
        else if (configSum['style'] === 'matrix') {
            let matrix_values = new Set([]);
            configSum['matrix_cols'].map(
                (col_name, col_index) => {
                    configSum['matrix_rows'].map(
                        (row_name, row_index) => {
                            let group;
                            if (configSum['matrix_group_by'] === 'row'){
                                group = row_index;
                            }
                            else if (configSum['matrix_group_by'] === 'col') {
                                group = col_index;
                            }
                            else {
                                group = '';
                            }
                            let counter = 1;
                            const valueInit = `${col_name} & ${row_name}`;
                            let value = valueInit;
                            while (matrix_values.has(value)) {
                                value = `${valueInit} ${counter}`;
                                counter += 1;
                            }
                            configResult.push({
                                'title': `${col_name} & ${row_name}`,
                                'value': value,
                                'is_default': false,
                                'is_default_multiple': false,
                                'col': col_name,
                                'row': row_name,
                                'group': group,
                            });
                        }
                    )
                }
            )
        }

        this.config = {'options': configResult, 'is_multiple': is_multiple};
        super.trigger_configSave(new_config);
        this.trigger('obj.reinit_ele', {'config': this.config});
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = {
            ...this.inputs_data[0], // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
            'element': 'select',
        };
        inputs_data['label'] = config.label_for_report ? config.label_for_report : '';

        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<select class="form-item-input" name="${inputs_data.name}"></select>`);
        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);
        groupAll$.find('.' + this.cls_input_group).empty().append(inp$);

        // insert option
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }
        if (!config.is_multiple) {
            inp$.empty().append(`<option value="" selected></option>`)
        }
        if (config.is_multiple) {
            inp$.attr('multiple', true);
            inputs_data['args'].add('multiple');
        }

        inp$.attr('data-select-style', config['style']);
        inp$.attr('data-select-matrix-group', config['matrix_group_by']);
        config['options'].map(
            item => {
                let selectedTmp = config.is_multiple === true ? !!(item.is_default_multiple) : !!(item.is_default);
                inp$.append(`
                    <option 
                        value="${item.value}"
                        data-col="${item.col}"
                        data-row="${item.row}" 
                        data-group="${item.group}"
                        ${selectedTmp ? "selected" : ""}
                    >${item.title}</option>
                `);
            }
        )
        if (config.place_holder) inputs_data['kwargs']['placeholder'] = config.place_holder;
        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-input-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-input-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-input-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-input-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-input-xl');
                break
        }

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

class FormCheckboxComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-checkbox');
    }

    get code() {
        return 'checkbox';
    }

    get defaultConfig() {
        return {
            'label': 'Checkbox',
            'instruction': '',
            'size': 'medium',
            'required': false,
            'visibility': 'unset',
            'checkbox_style': 'default',
            'init_value': 'unchecked',
        }
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            const name = this.generateName();
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': name,
                },
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = {
            ...this.inputs_data[0], // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }
        inputs_data['kwargs']['type'] = 'checkbox';
        inputs_data['label'] = config.label_for_report ? config.label_for_report : '';
        inputs_data['kwargs']['class'].delete('form-item-input');

        const idx = $x.fn.randomStr(32, true);
        let label$ = $(`<label class="form-checkbox-label" for="${idx}">${config.label}</label>`);
        let inp$ = $(`<input class="form-checkbox-input" id="${idx}" name="${inputs_data.name}" type="email" />`);
        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);
        groupAll$
            .find('.' + this.cls_input_group)
            .empty()
            .append(
                $(`<div class="form-checkbox-group"></div>`)
                    .append(inp$)
                    .append(label$)
            )
        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-checkbox-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-checkbox-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-checkbox-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-checkbox-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-checkbox-xl');
                break
        }
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }
        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }
        switch (config.checkbox_style) {
            case 'default':
                break
            case 'switch':
                const checkboxGroup$ = inp$.closest('.form-checkbox-group');
                checkboxGroup$.addClass('form-checkbox-switch');
                break
        }
        switch (config.init_value) {
            case 'unchecked':
                inp$.removeAttr('checked');
                break
            case 'checked':
                inp$.attr('checked', true);
                break
        }

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

class FormManyCheckboxComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-many-checkbox');
    }

    get code() {
        return 'many-checkbox';
    }

    get defaultConfig() {
        return {
            'label': 'Many Checkbox',
            'instruction': '',
            'size': 'medium',
            'visibility': 'unset',
            'checkbox_style': 'default',
            'list_checkbox': [],
        }
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    defaultItemInListCheckbox(label, isDefault, name = null) {
        return {
            'name': name ? name : this.generateName(),
            'label': label,
            'is_default': !!isDefault,
        }
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.config['list_checkbox'].length === 0) {
            this.config = {
                'list_checkbox': [
                    this.defaultItemInListCheckbox('First Choice', false, null),
                    this.defaultItemInListCheckbox('Second Choice', false, null),
                    this.defaultItemInListCheckbox('Third Choice', false, null),
                ]
            }
        }

        if (this.inputs_data.length === 0) {
            this.inputs_data = [];
        } else if (this.inputs_data.length >= 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }

        const groupDynamic$ = this.configGroupEle$.find('#many-checkbox-group-dynamic');
        groupDynamic$.trigger('data.clean');
        groupDynamic$.trigger('data.load', {
            'list_checkbox': this.config.list_checkbox || []
        })
    }

    trigger_configSave(new_config) {
        let clsThis = this;
        if (!new_config) new_config = {};

        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}

            let listCheckbox = [];
            this.configGroupEle$.find('#many-checkbox-group-dynamic').find('.many-checkbox-group').each(function () {
                const nameVal = $(this).find('input.name_of_choice').val();
                const labelVal = $(this).find('input.label_of_choice').val();
                const defaultVal = $(this).find('input.default_of_choice').prop('checked');
                if (nameVal && labelVal) {
                    listCheckbox.push(
                        clsThis.defaultItemInListCheckbox(labelVal, defaultVal, nameVal)
                    )
                } else {
                    let errors = {}
                    if (!nameVal) {
                        errors[$(this).find('input.name_of_choice').attr('name')] = $.fn.gettext('This field is required')
                    }
                    if (!labelVal) {
                        errors[$(this).find('input.label_of_choice').attr('name')] = $.fn.gettext('This field is required')
                    }
                    frm$.validate().showErrors(errors);
                    return;
                }
            })

            new_config['list_checkbox'] = listCheckbox;
            super.trigger_configSave(new_config);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inpArr$ = [];
        let labelArr$ = [];
        let configArr = [];

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);
        groupAll$
            .find('.' + this.cls_label_group)
            .append(`<label class="form-item-label">${config.label}</label>`);

        const inputGroup$ = groupAll$.find('.' + this.cls_input_group);
        inputGroup$.empty()
        config['list_checkbox'].map(
            inputData => {
                let itemConfig = {
                    ...this.defaultInputsDataItem,
                    'name': inputData['name'],
                    'label': inputData['label'],
                }
                itemConfig['kwargs']['type'] = 'checkbox';
                itemConfig['kwargs']['class'].add('form-checkbox-input').delete('form-item-input');

                const idx = `${itemConfig['name']}_${$x.fn.randomStr(10)}`
                const inp$ = $(`<input type="checkbox" id="${idx}" name="${itemConfig['name']}" />`);
                const label$ = $(`<label for="${idx}" class="form-checkbox-label">${itemConfig['label']}</label>`);

                switch (config.size) {
                    case 'sm':
                        itemConfig['kwargs']['class'].add('form-checkbox-sm');
                        break
                    case 'lg':
                        itemConfig['kwargs']['class'].add('form-checkbox-lg');
                        break
                    default:
                        itemConfig['kwargs']['class'].add('form-checkbox-md');
                        break
                }

                switch (config.visibility) {
                    case 'hide':
                        itemConfig['kwargs']['class'].add('hidden');
                        break
                    case 'disable':
                        itemConfig['args'].add('disabled');
                        break
                }

                if (inputData['is_default'] === true) itemConfig['kwargs']['checked'] = true;

                inpArr$.push(inp$);
                labelArr$.push(label$);
                configArr.push(itemConfig);
            }
        )

        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    break
            }
        }

        for (let i = 0; i < configArr.length; i++) {
            this.applyInputsDataToInput(inpArr$[i], configArr[i]);
            const ele$ = $(`<div class="form-checkbox-group mb-1"></div>`).append(inpArr$[i]).append(labelArr$[i]);
            switch (config.checkbox_style) {
                case 'default':
                    break
                case 'switch':
                    ele$.addClass('form-checkbox-switch')
                    break
            }
            inputGroup$.append(ele$)
        }
        this.inputs_data = configArr;
    }
}

class FormDateComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-date');
    }

    get code() {
        return 'date';
    }

    get defaultConfig() {
        return {
            'label': 'Date',
            'instruction': '',
            'size': 'medium',
            'place_holder': '',
            'visibility': 'unset',
            'required': false,
            'init_value_type': 'unset',
            'init_value_custom': null,
            'format': 'l, j F Y',
            'min_value': null,
            'max_value': null,
        }
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                }
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
        const resolveConfig = {...this.config, ...temp_config}
        this.configGroupEle$.find('input[name=min_value]')[0]._flatpickr.setDate(resolveConfig.min_value);
        this.configGroupEle$.find('input[name=max_value]')[0]._flatpickr.setDate(resolveConfig.max_value);
    }

    trigger_configSave(new_config) {
        if (!new_config) new_config = {};
        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}

            if (!configSum['init_value_custom']) new_config['init_value_custom'] = null;
            if (!configSum['min_value']) new_config['min_value'] = null;
            if (!configSum['max_value']) new_config['max_value'] = null;

            super.trigger_configSave(new_config);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = this.inputs_data[0];
        inputs_data = {
            ...inputs_data, // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }

        inputs_data['kwargs']['type'] = 'text';
        inputs_data['kwargs']['data-datepicker'] = true;
        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<input class="form-item-input" name="${inputs_data.name}" />`);

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_input_group)
            .empty()
            .append(inp$)
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);

        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-input-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-input-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-input-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-input-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-input-xl');
                break
        }
        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }
        if (config.place_holder) {
            inputs_data['kwargs']['placeholder'] = config.place_holder;
        }
        if (config.format) {
            inputs_data['kwargs']['data-datepicker'] = config.format;
        }
        switch (config.init_value_type) {
            case 'now':
                inputs_data['kwargs']['data-datepicker-default'] = 'now';
                break
            case 'custom':
                if (config.init_value_custom) {
                    inputs_data['kwargs']['data-datepicker-default'] = config.init_value_custom;
                }
                break
            case 'unset':
                break
        }
        if (config.min_value) inputs_data['kwargs']['data-datepicker-min'] = config.min_value;
        if (config.max_value) inputs_data['kwargs']['data-datepicker-max'] = config.max_value;

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

class FormTimeComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-time');
    }

    get code() {
        return 'time';
    }

    get defaultConfig() {
        return {
            'label': 'Time',
            'instruction': '',
            'size': 'medium',
            'place_holder': '',
            'required': false,
            'visibility': 'unset',
            'format': 'H:i',
            'init_value_type': 'unset',
            'init_value_custom': null,
            'min_value': null,
            'max_value': null,
        }
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                }
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
    }

    trigger_configSave(new_config) {
        if (!new_config) new_config = {};
        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}

            if (!configSum['init_value_custom']) new_config['init_value_custom'] = null;
            if (!configSum['min_value']) new_config['min_value'] = null;
            if (!configSum['max_value']) new_config['max_value'] = null;
            super.trigger_configSave(new_config);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = this.inputs_data[0];
        inputs_data = {
            ...inputs_data, // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }

        inputs_data['kwargs']['type'] = 'text';
        inputs_data['kwargs']['data-timepicker'] = true;
        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<input class="form-item-input" name="${inputs_data.name}" />`);

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_input_group)
            .empty()
            .append(inp$)
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);

        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-input-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-input-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-input-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-input-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-input-xl');
                break
        }
        if (config.place_holder) {
            inputs_data['kwargs']['placeholder'] = config.place_holder;
        }
        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }

        if (config.format) {
            inputs_data['kwargs']['data-timepicker'] = config.format;
        }
        switch (config.init_value_type) {
            case 'now':
                inputs_data['kwargs']['data-timepicker-default'] = 'now';
                break
            case 'custom':
                if (config.init_value_custom) {
                    inputs_data['kwargs']['data-timepicker-default'] = config.init_value_custom;
                }
                break
            case 'unset':
                break
        }
        if (config.min_value) inputs_data['kwargs']['data-timepicker-min'] = config.min_value;
        if (config.max_value) inputs_data['kwargs']['data-timepicker-max'] = config.max_value;

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

class FormDatetimeComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-datetime');
    }

    get code() {
        return 'datetime';
    }

    get defaultConfig() {
        return {
            'label': 'Datetime',
            'instruction': '',
            'size': 'medium',
            'place_holder': '',
            'visibility': 'unset',
            'required': false,
            'init_value_type': 'unset',
            'init_value_custom': null,
            'format': 'l, j-m-Y H:i',
            'min_value': null,
            'max_value': null,
        }
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                }
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }

        const configResolved = {...this.config, ...temp_config}
        this.configGroupEle$.find('[name=init_value_custom]')[0]._flatpickr.setDate(configResolved['init_value_custom']);
        this.configGroupEle$.find('input[name=min_value]')[0]._flatpickr.setDate(this.config.min_value);
        this.configGroupEle$.find('input[name=max_value]')[0]._flatpickr.setDate(this.config.max_value);
    }

    trigger_configSave(new_config) {
        if (!new_config) new_config = {};
        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}

            if (!configSum['init_value_custom']) new_config['init_value_custom'] = null;
            if (!configSum['min_value']) new_config['min_value'] = null;
            if (!configSum['max_value']) new_config['max_value'] = null;

            super.trigger_configSave(new_config);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = this.inputs_data[0];
        inputs_data = {
            ...inputs_data, // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }

        inputs_data['kwargs']['type'] = 'text';
        inputs_data['kwargs']['data-datetimepicker'] = true;
        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<input class="form-item-input" name="${inputs_data.name}" />`);

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_input_group)
            .empty()
            .append(inp$)
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);

        switch (config.size) {
            case 'extra-small':
                inputs_data['kwargs']['class'].add('form-input-xs');
                break
            case 'small':
                inputs_data['kwargs']['class'].add('form-input-sm');
                break
            case 'medium':
                inputs_data['kwargs']['class'].add('form-input-md');
                break
            case 'large':
                inputs_data['kwargs']['class'].add('form-input-lg');
                break
            case 'extra-large':
                inputs_data['kwargs']['class'].add('form-input-xl');
                break
        }
        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }
        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }
        if (config.place_holder) {
            inputs_data['kwargs']['placeholder'] = config.place_holder;
        }
        if (config.format) {
            inputs_data['kwargs']['data-datetimepicker'] = config.format;
        }
        switch (config.init_value_type) {
            case 'now':
                inputs_data['kwargs']['data-datetimepicker-default'] = 'now';
                break
            case 'custom':
                if (config.init_value_custom) {
                    inputs_data['kwargs']['data-datetimepicker-default'] = config.init_value_custom;
                }
                break
            case 'unset':
                break
        }
        if (config.min_value) inputs_data['kwargs']['data-datetimepicker-min'] = config.min_value;
        if (config.max_value) inputs_data['kwargs']['data-datetimepicker-max'] = config.max_value;

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

class FormRatingComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-rating');
    }

    get code() {
        return 'rating';
    }

    get defaultConfig() {
        return {
            'label': 'Rating',
            'instruction': '',
            'size': 'medium',
            'visibility': 'unset',
            'required': false,
            'place_holder': $.fn.gettext('Write a brief review'),
            'label_of_vote': $.fn.gettext('Vote'),
            'label_of_review': $.fn.gettext('Review'),
            'items': [
                {
                    'value': $.fn.gettext('Very bad'),
                    'icon': 'f005',
                    'color': '#7c7c7c',
                    'review_require': false,
                    'icon_style': 'solid',
                },
                {
                    'value': $.fn.gettext('Bad'),
                    'icon': 'f005',
                    'color': '#7c7c7c',
                    'review_require': false,
                    'icon_style': 'solid',
                },
                {
                    'value': $.fn.gettext('Normal'),
                    'icon': 'f005',
                    'color': '#7c7c7c',
                    'review_require': false,
                    'icon_style': 'solid',
                },
                {
                    'value': $.fn.gettext('Good'),
                    'icon': 'f005',
                    'color': '#7c7c7c',
                    'review_require': false,
                    'icon_style': 'solid',
                },
                {
                    'value': $.fn.get('Excellent'),
                    'icon': 'f005',
                    'color': '#7c7c7c',
                    'review_require': false,
                    'icon_style': 'solid',
                },
            ],
            'isolation_animate': false,
        }
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                },
                {
                    ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                    'element': 'textarea',
                },
            ];
        } else if (this.inputs_data.length === 2) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }

        const frm$ = this.configGroupEle$;
        const ratingGroup$ = frm$.find('#rating-value-group');
        const config = {
            ...this.config, ...temp_config,
        }
        ratingGroup$.trigger('data.clean');
        ratingGroup$.trigger('data.load', config)
    }

    trigger_configSave(new_config) {
        if (!new_config) new_config = {};
        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}

            let items = [];
            for (let i = 0; i < configSum['items_title'].length; i++) {
                items.push({
                    'value': configSum['items_title'][i],
                    'icon': configSum['items_symbol'][i],
                    'color': configSum['items_color'][i],
                    'review_require': configSum['items_review_require'][i],
                    'icon_style': configSum['items_icon_style'][i],
                })
            }
            new_config['items'] = items;

            super.trigger_configSave(new_config);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = this.inputs_data[0];
        inputs_data = {
            ...inputs_data, // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
            'label': config.label_of_vote || '',
        }
        let input_data_review = this.inputs_data[1];
        input_data_review = {
            ...input_data_review,
            ...this.defaultInputsDataItem,
            'label': config.label_of_review || '',
        }

        inputs_data['kwargs']['type'] = 'text';
        inputs_data['kwargs']['data-rate'] = true;
        let label$ = $(`<label class="form-item-label">${config.label}</label>`);

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);

        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);

        const groupRate$ = $(`
            <div class="rating-group">
                <div class="rating-state">
                    <span class="state-default">
                        <span style="opacity: 0;">Vote</span>
                    </span>
                    <span class="state-current"></span>
                    <span class="state-hover"></span>
                    <button class="btn-reset-vote" type="button">
                        <span class="icon">
                            <i class="fa-solid fa-xmark fa-2xs"></i>
                        </span>
                    </button>
                </div>
                <div class="rating-vote-group">
                    <div class="rating-vote"></div>
                    <div class="rating-utils">
                        <div class="rating-utils-content">
                            <textarea placeholder="Write a brief review" class="form-item-input"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `);
        const rateVote$ = groupRate$.find('.rating-vote');
        const rateBriefReview$ = groupRate$.find('.rating-utils textarea');

        (config.items || []).map(
            (item, index) => {
                const idxRd = `rating-${$x.fn.randomStr(10)}`;
                let clsIcon = 'fa-solid';
                switch (item.icon_style) {
                    case 'regular':
                        clsIcon = 'fa-regular';
                        break
                    case 'solid':
                    default:
                        clsIcon = 'fa-solid';
                        break
                }
                rateVote$.append(`
                    <label 
                        for="${idxRd}" 
                        style="--rating-color-default: ${item.color};" 
                    >
                        <i class="${clsIcon} icon">&#x${item.icon || 'f005'}</i>
                    </label>
                    <input 
                        type="radio" 
                        id="${idxRd}" 
                        name="${inputs_data.name}" 
                        value="${item.value || ''}"
                        data-review-require=${!!item.review_require}
                        ${index === 0 && config.required ? "required" : ""} 
                    />
                `);
            }
        )
        groupAll$.find('.' + this.cls_input_group).empty().append(groupRate$);

        rateBriefReview$.attr('name', input_data_review['name']).attr('placeholder', config.place_holder || '');
        input_data_review['kwargs']['placeholder'] = config.place_holder || '';

        if (config.isolation_animate === true) {
            groupRate$.addClass('rating-animated-isolation');
        } else {
            groupRate$.addClass('rating-animated');
        }

        switch (config.justify_content) {
            case 'left':
                groupRate$.addClass('rating-start');
                break
            case 'center':
                groupRate$.addClass('rating-center');
                break
        }

        if (config.visibility !== 'unset') {
            this.sortableItem$.alterClass('form-item--hide').alterClass('form-item--disable');
            let settingSpecial$ = this.sortableItem$.find('.group--setting-group');
            if (settingSpecial$.length === 0) {
                settingSpecial$ = $('<div class="group--setting-group"></div>');
                this.sortableItem$.append(settingSpecial$);
            }
            switch (config.visibility) {
                case 'hide':
                    settingSpecial$.append(`<div class="group--setting-hide"><i class="fa-solid fa-eye-slash"></i></div>`);
                    this.sortableItem$.addClass('form-item--hide');
                    inputs_data['kwargs']['class'].add('hidden');
                    break
                case 'disable':
                    settingSpecial$.append(`<div class="group--setting-disable"><i class="fa-solid fa-ban"></i></div>`);
                    this.sortableItem$.addClass('form-item--disable')
                    inputs_data['args'].add('disabled');
                    break
            }
        }

        switch (config.size) {
            case 'small':
                groupRate$.addClass('rating-sm');
                break
            case 'medium':
                groupRate$.addClass('rating-md');
                break
            case 'large':
                groupRate$.addClass('rating-lg');
                break
        }

        if (config.required) {
            label$.addClass('required');
            inputs_data['args'].add('required');
        }

        this.applyInputsDataToInput(rateBriefReview$, input_data_review)
        this.inputs_data[0] = inputs_data;
        this.inputs_data[1] = input_data_review
    }
}

class FormCardTextComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-card-text');
    }

    get code() {
        return 'card-text';
    }

    get defaultConfig() {
        return {
            'label': 'Description',
            'content': `
                <p style="font-size: 1.1rem;color: #007d88;">${$.fn.gettext("Design your own way")}</p>
                <div style="margin-top: 10px;padding: 10px;background-color: rgba(61,156,165,0.1);border-radius: 5px;font-style: italic;">
                    <p>${$.fn.gettext("Build your layout here to customize the appearance of your content with a wide range of formatting options.")}</p> 
                    <p>${$.fn.gettext("Make your information come alive with different styles and layouts.")}</p> 
                </div>
            `,
        }
    }

    constructor(props) {
        if (!props) props = {};
        props['label_placement'] = 'top';
        props['instruction_placement'] = 'bottom';
        super(props);

        this.inputs_data = [];
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }

        const config = {
            ...this.config, ...temp_config,
        }
        const ratingGroup$ = this.configGroupEle$.find('[name=content]');
        let tinyCls = ratingGroup$.tinymce();
        tinyCls.setContent(config['content']);
        tinyCls.fire('change');
    }

    trigger_configSave(new_config) {
        if (!new_config) new_config = {};
        let frm$ = this.configGroupEle$.find('form');
        if (frm$.valid()) {
            let config = SetupFormSubmit.serializerObject(frm$);
            const configSum = {...this.config, ...config, ...new_config}

            if (configSum['content']) {
                $.fn.callAjax2({
                    url: this.configGroupEle$.data('url-sanitize-html'),
                    method: 'POST',
                    data: {'html': configSum['content']},
                    isLoading: true,
                }).then(
                    resp => {
                        const data = $.fn.switcherResp(resp);
                        const htmlStr = (data?.['sanitize_html'] || '').toString();
                        if (data) {
                            new_config['content'] = htmlStr;
                        }
                        super.trigger_configSave(new_config)
                    },
                    errs => $.fn.switcherResp(errs),
                )
            } else super.trigger_configSave(new_config);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);

        groupAll$
            .find('.' + this.cls_input_group)
            .empty()
            .append(config.content || '');
    }
}

class FormCardHeadingComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-card-heading');
    }

    get code() {
        return 'card-heading';
    }

    get defaultConfig() {
        return {
            'label': 'Heading',
            'instruction': 'remark',
        }
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        this.inputs_data = [];
    }

    generateField(temp_config) {
        const config = {
            ...this.config, ...temp_config,
        };

        const groupHeading$ = $(`
            <div class="form-item-group">
                <p style="font-size: 1.5rem;">${config.label}</p>
                <hr 
                    style="border: 0;border-top: 1px solid #000;width: 100%;display: block;margin-bottom: 1rem;margin-top: 1rem;"
                />
                <p>${config.instruction}</p>
            </div>
        `);
        this.sortableItem$.empty().append(groupHeading$);
    }
}

class FormSliderComponentType extends FormComponentAbstract {
    get configGroupEle$() {
        return $('#form-slider');
    }

    get code() {
        return 'slider';
    }

    get defaultConfig() {
        return {
            'label': 'Slider',
            'is_hide_label': false,
            'instruction': '',
            'size': 'medium',
            'init_value': 0,
            'min_value': 0,
            'max_value': 100,
            'unit_prefix': '',
            'unit_postfix': '',
            'step': 1,
            'skin': 'flat',
        }
    }

    get defaultInputsDataItem() {
        return super._defaultInputsDataItem();
    }

    constructor(props) {
        if (!props) props = {};
        super(props);

        if (this.inputs_data.length === 0) {
            this.inputs_data = [
                {
                    ...this.defaultInputsDataItem,
                    'name': this.generateName(),
                }
            ];
        } else if (this.inputs_data.length === 1) {
            for (let idx in this.inputs_data) {
                if (!this.inputs_data[idx]?.['name']) throw Error('Item must has "name" property.')
            }
        } else throw Error('The input data of field configuration must have a length of one item.')
    }

    trigger_configLoad(temp_config) {
        super.trigger_configLoad(temp_config);

        let inp$ = this.configGroupEle$.find('input[name="name"]');
        inp$.prop('readonly', true).prop('disabled', true);
        if (this.inputs_data.length > 0) {
            inp$.val(this.inputs_data[0].name);
        }
    }

    generateField(temp_config) {
        let config = {
            ...this.config, ...temp_config,
        };

        let inputs_data = this.inputs_data[0];
        inputs_data = {
            ...inputs_data, // reset args and kwargs before handle
            ...this.defaultInputsDataItem,
        }

        inputs_data['kwargs']['type'] = 'range';
        inputs_data['kwargs']['data-rangeslider'] = true;
        let label$ = $(`<label class="form-item-label">${config.label}</label>`);
        let inp$ = $(`<input class="form-item-input" name="${inputs_data.name}" />`);

        let groupAll$ = this.sortableItem$;
        groupAll$
            .find('.' + this.cls_label_group)
            .css('display', config.is_hide_label === true ? 'none' : 'block')
            .append(label$);
        groupAll$
            .find('.' + this.cls_input_group)
            .empty()
            .append(inp$)
        groupAll$
            .find('.' + this.cls_instruction)
            .text(config.instruction);

        inputs_data['kwargs']['value'] = config.init_value;
        inputs_data['kwargs']['data-from'] = config.init_value;
        inputs_data['kwargs']['data-min'] = config.min_value;
        inputs_data['kwargs']['data-max'] = config.max_value;
        inputs_data['kwargs']['data-step'] = config.step;
        inputs_data['kwargs']['data-prefix'] = config.unit_prefix;
        inputs_data['kwargs']['data-postfix'] = config.unit_postfix;
        inputs_data['kwargs']['data-skin'] = config.skin;

        this.applyInputsDataToInput(inp$, inputs_data);
        this.inputs_data[0] = inputs_data;
    }
}

const matchForm = {
    'single-line': FormSingleLineComponentType,
    'multiple-line': FormMultipleLineComponentType,
    'number': FormNumberComponentType,
    'phone': FormPhoneComponentType,
    'email': FormEmailComponentType,
    'select': FormSelectComponentType,
    'checkbox': FormCheckboxComponentType,
    'many-checkbox': FormManyCheckboxComponentType,
    'date': FormDateComponentType,
    'time': FormTimeComponentType,
    'datetime': FormDatetimeComponentType,
    'rating': FormRatingComponentType,
    'card-text': FormCardTextComponentType,
    'card-heading': FormCardHeadingComponentType,
    'slider': FormSliderComponentType,
    'form-page': FormPageListComponentType,
    'page-break-head': FormPageItemHeadComponentType,
    'page-break-foot': FormPageItemFootComponentType,
}
