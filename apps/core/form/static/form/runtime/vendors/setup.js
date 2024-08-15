function onlyView() {
    $('input, textarea, select').prop('disabled', true);
    $('[type=submit]').remove();
    $('.form-action').remove();
    $('.form-foot').remove();
    // $('.form-head').remove();
    $('#btnSwitchAccount').remove();
}

function resetInputValue() {
    $('textarea').empty().val('');
    $('select').find('option').removeAttr('checked');
    $('input[type=checkbox]').prop('checked', false);
    $('input[type=radio]').prop('checked', false);
    $('input').removeAttr('value').val('');
}


(function ($) {
    $(document).ready(function () {
        $("img").on("error", function(event) {
            $(this)
                .off('error')
                .attr('src', '/static/form/runtime/images/img-thumb.svg')
                .attr('title', $.fn.formGettext("This image failed to load"));
        });

        const userLang = navigator.language || navigator.userLanguage;
        moment.locale(userLang.trim().split("-")[0]);

        const content$ = $('#contents');
        if (content$.length > 0) {
            content$.on('click', 'button.btn-more-submitted', function () {
                $(this).closest('p').hide(100, function () {
                    const group$ = $(this).closest('div#data-submitted');
                    const item$ = group$.find('p');
                    item$.show();
                    $(this).remove();
                });
            });
            const frm$ = content$.find('form');
            if (frm$.length > 0) {
                // btn switch
                let btnSwitch$ = content$.find('#btnSwitchAccount');
                if (btnSwitch$.length > 0) {
                    btnSwitch$.attr('href', btnSwitch$.attr('href').replaceAll('__pk__', frm$.attr('data-code')));
                }

                // current user data
                let currentUserName$ = content$.find('#form-head--current-user-name');
                currentUserName$.text(frm$.data('user-current-name'));
                frm$.removeAttr('data-user-current-name');

                // add type for button send
                frm$.find('button').attr('type', 'button');
                frm$.find('.form-action').find('button').attr('type', 'submit');
            }
        }

        $.fn.formPageInit();
    })

    if ($.validator) {
        $.fn.validateB = function (opts) {
            let timerFormValid;
            const timeoutValid = 300;
            const defaultConfig = {
                ignore: ':not([name])',
                focusInvalid: false,
                onkeyup: function (element, event){
                    if (timerFormValid) clearTimeout(timerFormValid);
                    timerFormValid = setTimeout(
                        () => $(this.currentForm).valid(),
                        timeoutValid
                    );
                },
                onfocusout: function (element, event) {
                    if (timerFormValid) clearTimeout(timerFormValid);
                    timerFormValid = setTimeout(
                        () => $(this.currentForm).valid(),
                        timeoutValid
                    );
                },
                onclick: function (element, event) {
                    if (timerFormValid) clearTimeout(timerFormValid);
                    timerFormValid = setTimeout(
                        () => $(this.currentForm).valid(),
                        timeoutValid
                    );
                },
                validClass: "is-valid",
                errorClass: "is-invalid",
                errorElement: 'div',
                success: function (label, element){
                    $(element).addClass(this.validClass);
                    if ($(element).hasClass('flatpickr-input')){
                        const inputFlat$ = $(document).find($(element)).siblings('input');
                        if (inputFlat$.length > 0){
                            inputFlat$.removeClass('is-invalid').addClass('is-valid');
                        }
                    }
                },
                showErrors: function (errorMap, errorList) {
                    let clsThis = this;
                    // reset flatpickr class
                    $(this.currentForm).find('input.flatpickr-input').each(function (){
                        const inputFlat = $(this).siblings('input');
                        if (inputFlat.length > 0){
                            inputFlat.removeClass('is-valid').removeClass('is-invalid');
                        }
                    })

                    let inpDetail$ = $(this.currentForm).find('input[name=detail]');
                    if (inpDetail$.length === 0) {
                        inpDetail$ = $(`<input name="detail" type="hidden" disabled readonly/>`);
                        const group$ = $('<div></div>')
                            .attr('id', 'groupShowErrorsDetail')
                            .addClass('form-item')
                            .css('width', '100%')
                            .css('padding-top', 0)
                            .css('padding-bottom', 0)
                            .css('min-height', 'unset')
                            .css('height', 'auto');
                        group$.append(inpDetail$);
                        group$.insertBefore($('.form-action'));
                    }

                    let errorDetailMessage = []
                    let errorListResolve = [];
                    let errorMapResolve = {};
                    errorList.map(
                        item => {
                            const messageTmp = Array.from(
                                new Set(
                                    Array.isArray(item.message) ? item.message : [item.message]
                                )
                            );
                            if (!item.element) {
                                errorDetailMessage = [...errorDetailMessage, ...messageTmp];
                            } else {
                                errorMapResolve[$(item.element).attr('name')] = item.message;
                                if ($(item.element).hasClass('flatpickr-input')) {
                                    const inputFlat = $(item.element).siblings('input');
                                    if (inputFlat.length > 0){
                                        inputFlat.removeClass('is-valid').addClass('is-invalid');
                                    }
                                }
                                errorListResolve.push({
                                    ...item,
                                    'message': messageTmp.map(msg => `<small>${msg}</small>`)
                                });
                            }
                        }
                    );
                    if (errorDetailMessage.length > 0) {
                        errorDetailMessage = Array.from(new Set(errorDetailMessage));
                        errorListResolve.push({
                            'element': inpDetail$[0],
                            'message': errorDetailMessage.map(msg => `<small>${msg}</small>`),
                        })
                        errorMapResolve['detail'] = errorDetailMessage;
                    }

                    // // scroll to first error element
                    // if (errorListResolve.length > 0) {
                    //     for (let i = 0; i < errorListResolve.length; i++) {
                    //         const errItem = errorListResolve[i];
                    //         if (errItem.element) {
                    //             $('#contents').animate({
                    //                 scrollTop: $(errItem.element).position().top
                    //             }, 100);
                    //             break;
                    //         }
                    //     }
                    // }
                    this.errorList = errorListResolve
                    this.errorMap = errorMapResolve
                    this.defaultShowErrors();

                    // call valid check page
                    $.fn.formCountErrorInPage(errorListResolve);
                },
                errorPlacement: function (error, element) {
                    let inputParent$ = element.closest('.form-item-input-parent');
                    if (inputParent$.length === 0) inputParent$ = element.parent();
                    inputParent$.append(error);
                },
                onsubmit: false,
            };

            let config = $.extend({}, defaultConfig, opts);
            const validator = $.fn.validate.call(this, config);
            $.validator.unpretentious($(this));
            $(this).data('_validatorForm', validator);
            return validator;
        };
    } else console.log("jQuery Validation was not loaded.");

    function formFlatpickrLanguage(hasWeekend) {
        let pickerI18n = 'default';
        const browserLanguage = navigator.language.split('-')[0].toLowerCase();
        switch (browserLanguage) {
            case 'vi':
                pickerI18n = 'vn';
                if (hasWeekend === false) {
                    // month + year was wrapped to two line! increase height for showing.
                    $(document).find('head').append(`
                        <style>
                            .flatpickr-months .flatpickr-month {
                                height: 52px;
                            }
                        </style>
                    `);
                }
                break
            default:
                pickerI18n = 'default';
        }
        return pickerI18n;
    }

    $.fn.extend({
        formGetPublicIP: async function () {
            return await $.get("https://api.ipify.org?format=json").then(data => data.ip);
        },
        formGettext: function (txt) {
            try {
                return gettext(txt)
            } catch (e) {
                return txt
            }
        },
        formGenerateRandomString(length = 32, startFromLetter = false) {
            let result = '';
            let characterLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let characterNumber = '0123456789';
            let characters = characterLetter + characterNumber;

            if (startFromLetter === true) {
                result += characterLetter.charAt(Math.floor(Math.random() * characterLetter.length));
                length -= 1;
            }

            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        },
        formConvertErrorsBeforeRaise: function (errors) {
            let result = {};
            Object.keys(errors).map(
                key => {
                    result[key] = errors[key];
                    if (key.startsWith('rate_') || key.startsWith('select_')) {
                        const eleTmp$ = $(`[name=${key}]`);
                        if (eleTmp$.length > 0) {
                            const ratingGroup$ = eleTmp$.closest('.rating-group');
                            if (ratingGroup$.length > 0) {
                                let inputName = `${key.split("_")[0]}_${$x.fn.formGenerateRandomString(32)}`;
                                const eleInputErrs$ = ratingGroup$.next('input.fake-input');
                                if (eleInputErrs$.length === 0) {
                                    $(`<input class="fake-input" name="${inputName}" type="hidden" disabled readonly/>`).insertAfter(ratingGroup$);
                                } else {
                                    eleInputErrs$.prop('disabled', true).prop('readonly', true);
                                    inputName = eleInputErrs$.attr('name');
                                }
                                result[inputName] = errors[key];
                            }
                        }
                    }
                }
            )
            return result;
        },
        formSerializerInput: function (input$, toObject = false) {
            let item = {
                'name': $(input$).attr('name'),
                'value': $(input$).val(),
            }

            let dataType = $(input$).attr('data-type');
            switch (dataType) {
                case 'json':
                    try {
                        item['value'] = JSON.parse(item['value']);
                    } catch (err) {
                    }
                    break
                case 'date':
                    item['value'] = moment(
                        item['value'],
                        $(input$).attr('data-date-format') || 'DD-MM-YYYY',
                    ).format('YYYY-MM-DD');
                    break
                case 'datetime':
                    item['value'] = moment(
                        item['value'],
                        $(input$).attr('data-date-format') || 'DD-MM-YYYY HH:mm:ss',
                    ).format('YYYY-MM-DD HH:mm:ss');
                    break
            }
            if ($(input$).is(':checkbox')) item['value'] = $(input$).prop('checked');

            if (toObject === true) {
                let TempItem = {};
                TempItem[item.name] = item.value;
                return TempItem;
            }
            return item;
        },
        formCheckBodyDataEmpty: function (bodyData) {
            let existKeyHasData = false;
            if (bodyData && typeof bodyData === 'object') {
                Object.keys(bodyData).map(
                    key => {
                        if (!existKeyHasData && bodyData[key] !== "") existKeyHasData = true;
                    }
                )
            }
            return existKeyHasData;
        },
        formSerializerObject: function (formSelected) {
            const queryExclude = ':not([dont_serialize]):not([name^="DataTables_"])';
            let obj = {};
            // first with all
            formSelected.find(':input[name]:not(disabled):not([type=radio])' + queryExclude).each(function () {
                let item = $.fn.formSerializerInput($(this));
                if (item.name in obj) {
                    obj[item.name] = $.isArray(obj[item.name]) ? obj[item.name] : [obj[item.name]];
                    obj[item.name].push(item.value);
                } else obj[item.name] = item.value;
            });
            // case radio | override data
            formSelected.find(':input[name]:not(disabled)[type=radio]' + queryExclude).each(function () {
                const name = $(this).attr('name');
                const value = $(this).attr('value');
                const checked = $(this).prop('checked');
                if (checked === true) obj[name] = value;
            })

            // case datepicker | override data
            function showErrorsObject() {
                $.fn.formNotify(
                    $.fn.formGettext("We encountered an error while combining the data.") + $.fn.formGettext("Please refresh the page and try again."),
                    'failure'
                )
                $.fn.formNotify(
                    $.fn.formGettext("If you continue to experience this issue, please let us know at https://www.bflow.vn/issue/form/new"),
                    'info',
                    {
                        clickToHide: false,
                        autoHide: true,
                        autoHideDelay: 10000,
                    }
                )
                throw Error('Report at https://www.bflow.vn/issue/form/new');
            }

            // query$.find(':input[name][data-datepicker]').each(function () {
            //     const name = $(this).attr('name');
            //     const clsPicker = this._flatpickr;
            //     if (clsPicker) {
            //         switch (clsPicker.config.mode) {
            //             case 'single':
            //                 if (clsPicker.selectedDates[0] instanceof Date) {
            //                     obj[name] = clsPicker.selectedDates[0].toISOString();
            //                 } else showErrorsObject();
            //                 break
            //             case 'multiple':
            //                 obj[name] = Array.from(
            //                     clsPicker.selectedDates.map(
            //                         dateObj => {
            //                             if (dateObj instanceof Date) {
            //                                 return dateObj.toISOString();
            //                             } else showErrorsObject();
            //                         }
            //                     )
            //                 )
            //                 break
            //             case 'range':
            //                 if (clsPicker.selectedDates.length === 2) {
            //                     clsPicker.selectedDates.map(
            //                         dateObj => {
            //                             if (dateObj instanceof Date) {
            //                                 return dateObj.toISOString();
            //                             } else showErrorsObject();
            //                         }
            //                     )
            //                 }
            //                 break
            //             default:
            //                 showErrorsObject();
            //                 break
            //         }
            //     } else showErrorsObject();
            // })

            if ($.fn.formCheckBodyDataEmpty(obj)) {
                // get csrf token in form
                let csrf$ = $(formSelected).find('input[name=csrfmiddlewaretoken]');
                if (csrf$.length > 0) obj['csrfmiddlewaretoken'] = csrf$.val();

                return Object.fromEntries(Object.entries(obj).filter(([k, _v]) => k));
            }
            return {};
        },
        formCallAjax: function (opts) {
            return new Promise(function (resolve, reject) {
                let url = opts?.['url'] || null;
                let method = (opts?.['method'] || 'GET').toUpperCase();
                let processData = opts?.['processData'] || true;
                let contentType = opts?.['contentType'] || "application/json";
                let headers = opts?.['headers'] || {}
                let data = opts?.['data'] || {};
                let dataDumps = JSON.stringify(data);
                let csrfToken = data?.['csrfmiddlewaretoken'] || null;

                if (url && method && (method === 'GET' || (method !== 'GET' && csrfToken))) {
                    let ctx = {
                        ...opts,
                        success: function (rest, textStatus, jqXHR) {
                            resolve(rest);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            let resp_data = jqXHR.responseJSON;
                            if (resp_data && typeof resp_data === 'object') {
                                reject(resp_data);
                            } else if (jqXHR.status === 204) reject({'status': 204});
                        },
                        url: url,
                        type: method,
                        contentType: contentType,
                        processData: processData,
                        data: dataDumps,
                        headers: {
                            "X-CSRFToken": csrfToken,
                            ...headers
                        },
                        statusCode: {},
                    };
                    return $.ajax(ctx);
                }
            })
        },
        formDisplayRelativeTime: function (dataStr, opts = {}) {
            if (dataStr) {
                let format = opts?.['format'] || "YYYY-MM-DD HH:mm:ss";
                let outputFormat = opts?.['outputFormat'] || "DD-MM-YYYY HH:mm:ss";
                let callback = opts?.['callback'] || function (data) {
                    return `<p>${data.relate}</p><small>${data.output}</small>`;
                }

                let relateTimeStr = moment(dataStr, format).fromNow();
                let appendStrData = moment(dataStr, format).format(outputFormat);
                return {
                    'relate': relateTimeStr,
                    'output': appendStrData,
                };
            }
            return '_';
        },
        formNotify: function (msg, typeAlert, opts = {}, defaults = {}) {
            $.notify.defaults({
                'globalPosition': 'top center',
                ...defaults,
            });
            switch (typeAlert) {
                case 'success':
                    $.notify(msg, {
                        ...opts,
                        "className": "success"
                    });
                    break
                case 'failure':
                    $.notify(msg, {
                        ...opts,
                        "className": "error"
                    });
                    break
                case 'warning':
                    $.notify(msg, {
                        ...opts,
                        "className": "warn"
                    });
                    break
                case 'info':
                default:
                    $.notify(msg, {
                        ...opts,
                        "className": "info"
                    });
                    break
            }
        },
        formShowContent: function () {
            $('#contents').css('opacity', '100');
        },
        formShowLoaders: function (opacity='100%'){
            $('#content-loaders').css('opacity', opacity).fadeIn('fast');
        },
        formHideLoaders: function (timeout = null) {
            setTimeout(
                () => {
                    $('#content-loaders').fadeOut('fast');
                },
                timeout ? timeout : 0
            )
        },
        formShowContentAndHideLoader: function () {
            $.fn.formHideLoaders();
            $.fn.formShowContent();
        },
        formInitSelect2All: function (opts) {
            $('select:not([data-select-style]), select[data-select-style="default"]').each(function () {
                const placeholder = $(this).attr('placeholder') || '';
                const optionEmpty = $(this).find('option[value=""]');
                if (optionEmpty.length === 0) $(this).prepend(`<option value=""></option>`)
                $(this).select2({
                    'dropdownParent': $(this).closest('.form-item'),
                    disabled: $(this).prop('disabled'),
                    placeholder: placeholder.toString(),
                    width: '100%',
                    ...opts,
                })
            });
            $('select[data-select-style="xbox"]').each(function (){
                const disabled = $(this).prop('disabled');
                const selectCurrent$ = $(this);
                const parent$ = $(this).closest('.form-item-input-parent');
                const isMultiple = !!$(this).prop('multiple');
                const fakeName = `fakeName_select_` + $.fn.formGenerateRandomString(16);

                $(selectCurrent$).hide(0);
                $(selectCurrent$).find('option').each(function (){
                    const option$ = $(this);
                    const txt = option$.text();
                    const value = option$.val();
                    if (value){
                        const rdIdx = `select_` + $.fn.formGenerateRandomString(32);
                        let htmlTmp = ``;
                        if (isMultiple === true){
                            htmlTmp = `
                            <div class="form-checkbox-group mb-1">
                                <input data-value="${value}" type="checkbox" id="${rdIdx}" class="form-checkbox-input form-checkbox-md" ${disabled ? "disabled": ""} />
                                <label for="${rdIdx}" class="form-checkbox-label">${txt}</label>
                            </div>
                        `
                        } else {
                            htmlTmp = `
                            <div class="form-checkbox-group mb-1">
                                <input data-value="${value}" name="${fakeName}" type="radio" id="${rdIdx}" class="form-checkbox-input form-checkbox-md" ${disabled ? "disabled": ""} />
                                <label for="${rdIdx}" class="form-checkbox-label">${txt}</label>
                            </div>
                        `
                        }
                        parent$.append(htmlTmp)
                    }
                })
                if (isMultiple) {
                    parent$.find('input[type=checkbox]').on('change', function (){
                        const value = $(this).attr('data-value');
                        selectCurrent$.find(`option[value="${value}"]`).prop('selected', $(this).prop('checked'));
                    })
                } else {
                    parent$.find(`input[type=radio][name=${fakeName}]`).on('change', function (){
                        const value = $(this).attr('data-value');
                        selectCurrent$.val(value);
                    })
                }

                selectCurrent$.on('change', function (event, data){
                    if (data && data?.['skipByCheckboxChange'] === true) return true;
                    let selected = $(this).val();
                    if (!Array.isArray(selected)) selected = [selected];
                    parent$.find(`input[type=checkbox][data-value]`).prop('checked', false);
                    selected.map(
                        value => {
                            let query = `input[type=checkbox][data-value="${value}"]`
                            if (isMultiple === false) query = `input[type=radio][data-value="${value}"]`
                            parent$.find(query).prop('checked', true);
                        }
                    )
                })
            });
            $('select[data-select-style="matrix"]').each(function (){
                const disabled = $(this).prop('disabled');
                const selectCurrent$ = $(this);
                const parent$ = $(this).closest('.form-item-input-parent');
                const groupBy = selectCurrent$.attr('data-select-matrix-group');

                $(selectCurrent$).hide(0);
                let rows = new Set([]);
                let cols = new Set([]);
                $(selectCurrent$).find('option').each(function (){
                    const option$ = $(this);
                    const value = option$.val();
                    let dataRow = option$.attr('data-row');
                    let dataCol = option$.attr('data-col');
                    if (value && dataRow && dataCol){
                        rows.add(dataRow);
                        cols.add(dataCol);
                    }
                });

                rows = Array.from(rows);
                cols = Array.from(cols);

                const tbl$ = $(`<table class="matrix-table matrix-table-default"></table>`);
                const colFirst = cols.map(item => {
                    return `<td style="text-align: center;">${item}</td>`
                })
                const firstRow$ = `
                    <tr>
                        <td><i>${$.fn.formGettext("Contents")}</i></td>
                        ${colFirst}
                    </tr>
                `;
                const anotherRows = rows.map(
                    row_name => {
                        const arr = cols.map(
                            col_name => {
                                const option$ = selectCurrent$.find(`option[data-row="${row_name}"][data-col="${col_name}"]`);
                                if (option$.length > 0){
                                    const value = option$.attr('value');
                                    const dataGroup = option$.attr('data-group');
                                    return `
                                        <td class="matrix-cell-check">
                                            <input data-value="${value}" data-group="${dataGroup || ''}" type="checkbox" class="form-checkbox-input form-checkbox-md" ${disabled ? "disabled": ""} />
                                        </td>
                                    `
                                }
                        })
                        return `<tr><td>${row_name}</td>${arr.join("")}</tr>`;
                    }
                );

                tbl$.append([firstRow$, ...anotherRows]);
                parent$.append(tbl$);
                switch (groupBy) {
                    case 'row':
                        $(`<small class="matrix-text">${$.fn.formGettext("Each row can have only one tick, and if the data field is mandatory, it must be completed for all rows.")}</small>`).insertAfter(tbl$);
                        break
                    case 'col':
                        $(`<small class="matrix-text">${$.fn.formGettext("Each column can have only one tick, and if the data field is mandatory, it must be completed for all columns.")}</small>`).insertAfter(tbl$);
                        break
                }

                try {
                    let newRule = {};
                    newRule['matrixGroupBy'.toLowerCase()] = groupBy;
                    selectCurrent$.rules('add', newRule);
                } catch (e) {}

                tbl$.find('input[type=checkbox]').on('change', function (event, data){
                    if (data && data?.['skipBySelectChange'] === true) return true;

                    let inp$ = $(this);
                    const value = $(inp$).attr('data-value');
                    const dataGroup = $(inp$).attr('data-group');
                    if (value){
                        const option$ = selectCurrent$.find(`option[value="${value}"]`);
                        if (option$.length > 0){
                            option$.prop('selected', $(inp$).prop('checked'));
                            selectCurrent$.trigger('change', {'skipByCheckboxChange': true});
                        }
                        if (data && data?.['skipCheckbox'] === true) return;
                        if (dataGroup){
                            tbl$.find(`input[data-group="${dataGroup || ''}"]`).each(function (){
                                if (!$(this).is(inp$)){
                                    $(this).prop('checked', false).trigger('change', {'skipCheckbox': true});
                                }
                            })
                        }
                    }
                });
                selectCurrent$.on('change', function (event, data){
                    if (data && data?.['skipByCheckboxChange'] === true) return true;

                    let selected = $(this).val();
                    if (!Array.isArray(selected)) selected = [selected];

                    tbl$.find(`input[type=checkbox][data-value]`).prop('checked', false);
                    selected.map(
                        value => {
                            tbl$.find(`input[type=checkbox][data-value="${value}"]`).prop('checked', true);
                        }
                    )
                })
            });
        },
        formActiveThemeMode: function () {
            if ($(document).data('themeModeActivated') !== true) {
                // enable watch theme mode
                // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                //     $(document).data('themeMode', "dark");
                // }
                // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                //     const newColorScheme = e.matches ? "dark" : "light";
                //     $(document).data('themeMode', newColorScheme);
                // });

                // const baseFlatSrc = $(document).find('#flatpickr-static').attr('href').split('/').slice(0, -1).join("/");
                // const themeMode = $(document).data('themeMode');
                // switch (themeMode) {
                //     case 'dark':
                //         $(document).find('head').append(`<link rel="stylesheet" href="${baseFlatSrc}/themes/dark.css" />`)
                //         break
                //     default:
                //         $(document).find('head').append(`<link rel="stylesheet" href="${baseFlatSrc}/themes/airbnb.css" />`)
                //         break
                // }
                // $(document).data('themeModeActivated', true)
            }
        },
        formInitDatePickerAll: function (opts) {
            opts = {
                loadDefault: true,
                allowInvalidPreload: false,
                ...opts,
            }
            const pickerI18n = formFlatpickrLanguage(true);
            $("input[data-datepicker]").each(function () {
                let pickerOpts = {
                    altInput: true,
                    altFormat: $(this).attr('data-datepicker') ? $(this).attr('data-datepicker') : 'l j F Y',
                    dateFormat: 'Y-m-d',
                    enableTime: false,
                    mode: 'single',  // 'single' | 'multiple' | 'range'
                    locale: pickerI18n,
                    weekNumbers: true,
                    minDate: $(this).attr('data-datepicker-min') ? $(this).attr('data-datepicker-min') : null,
                    maxDate: $(this).attr('data-datepicker-max') ? $(this).attr('data-datepicker-max') : null,
                    onChange: function (selectedDates, dateStr, instance){
                        const frm$ = $(instance.input).closest('form');
                        if (frm$.length > 0) $(frm$).valid();
                    },
                    ...opts,
                }
                if (opts['loadDefault'] === true) {
                    let defaultDate = $(this).attr('data-datepicker-default') || null;
                    switch (defaultDate) {
                        case 'now':
                            defaultDate = new Date();
                            break
                        default:
                            try {
                                defaultDate = Date.parse(defaultDate)
                            } catch (e) {
                                defaultDate = null;
                            }
                    }
                    if (defaultDate) pickerOpts['defaultDate'] = defaultDate;
                }
                const flatPickrObj = $(this).flatpickr(pickerOpts);
                $(this).on('change', function (event, data){
                    flatPickrObj.setDate(new Date($(this).val()));
                })
            });
        },
        formInitDatetimePickerAll: function (opts) {
            opts = {
                loadDefault: true,
                ...opts,
            }
            const pickerI18n = formFlatpickrLanguage(true);
            $("input[data-datetimepicker]").each(function () {
                let pickerOpts = {
                    altInput: true,
                    altFormat: $(this).attr('data-datetimepicker') ? $(this).attr('data-datetimepicker') : 'l j F Y',
                    dateFormat: 'Y-m-d H:i:S',
                    enableTime: true,
                    mode: 'single',  // 'single' | 'multiple' | 'range'
                    locale: pickerI18n,
                    weekNumbers: true,
                    minDate: $(this).attr('data-datetimepicker-min') ? $(this).attr('data-datetimepicker-min') : null,
                    maxDate: $(this).attr('data-datetimepicker-max') ? $(this).attr('data-datetimepicker-max') : null,
                    onChange: function (selectedDates, dateStr, instance){
                        const frm$ = $(instance.input).closest('form');
                        if (frm$.length > 0) $(frm$).valid();
                    },
                    ...opts
                }
                if (opts['loadDefault'] === true) {
                    let defaultDate = $(this).attr('data-datetimepicker-default') || null;
                    switch (defaultDate) {
                        case 'now':
                            defaultDate = new Date();
                            break
                        default:
                            try {
                                defaultDate = Date.parse(defaultDate)
                            } catch (e) {
                                defaultDate = null;
                            }
                    }
                    if (defaultDate) pickerOpts['defaultDate'] = defaultDate;
                }
                const flatPickrObj = $(this).flatpickr(pickerOpts);
                $(this).on('change', function (event, data){
                    flatPickrObj.setDate(new Date($(this).val()));
                })
            });
        },
        formInitTimePickerAll: function (opts) {
            opts = {
                loadDefault: true,
                ...opts,
            }
            const pickerI18n = formFlatpickrLanguage(true);
            $("input[data-timepicker]").each(function () {
                const ele$ = $(this);
                let pickerOpts = {
                    altInput: true,
                    altFormat: $(this).attr('data-timepicker') ? $(this).attr('data-timepicker') : 'H:i',
                    dateFormat: 'H:i:S',
                    enableTime: true,
                    noCalendar: true,
                    mode: 'single',  // 'single' | 'multiple' | 'range'
                    locale: pickerI18n,
                    minTime: $(this).attr('data-timepicker-min') ? $(this).attr('data-timepicker-min') : null,
                    maxTime: $(this).attr('data-timepicker-max') ? $(this).attr('data-timepicker-max') : null,
                    onChange: function (selectedDates, dateStr, instance){
                        const frm$ = $(instance.input).closest('form');
                        if (frm$.length > 0) $(frm$).valid();
                    },
                    ...opts
                }
                if (opts['loadDefault'] === true) {
                    let defaultDate = $(this).attr('data-timepicker-default') || null;
                    switch (defaultDate) {
                        case 'now':
                            defaultDate = new Date();
                            break
                        default:
                            try {
                                defaultDate = Date.parse(defaultDate)
                            } catch (e) {
                                defaultDate = null;
                            }
                    }
                    if (defaultDate) pickerOpts['defaultDate'] = defaultDate;
                }
                const flatPickrObj = $(this).flatpickr(pickerOpts);
                $(this).on('change', function (event, data){
                    flatPickrObj.setDate(new Date('1900-01-01 ' + $(this).val()));
                })
            });
        },
        formRangeSlider: function (opts){
            $('[data-rangeslider]').ionRangeSlider();
        },
        formPageInit: function (){
            const pageProgres$ = $('.progress-steps');
            const progress$ = pageProgres$.find('.steps-bar-progress');
            const stepsGroup$ = pageProgres$.find('.steps-group');
            const progressJustify = stepsGroup$.attr('data-progress-justify');
            const progressStyle = stepsGroup$.attr('data-progress-style');
            const stepItems$ = stepsGroup$.find('.step-item');
            const stepItemInit = stepsGroup$.find('.step-item.active');

            function activePageProgress(dataPage, nextOrPrev=null) {
                if (dataPage && pageProgres$.length > 0) {
                    const stepActive$ = stepsGroup$.find(`.step-item[data-page=${dataPage}]`);
                    if (stepsGroup$.length > 0 && stepItems$.length > 0 && stepActive$.length > 0) {
                        stepItems$.removeClass('active');
                        stepActive$.addClass('active');

                        const maxLength = stepItems$.length;
                        const indexActive = Array.from(stepItems$).indexOf(stepActive$[0]);
                        if (indexActive !== -1) {
                            if (progressStyle === 'steps') {
                                if (progress$.length > 0){
                                    switch (progressJustify) {
                                        case 'evenly':
                                            const space = `((100% - 32px * ${maxLength})/${maxLength + 1})`
                                            let width = `${space} * ${indexActive + 1} + 32px * ${indexActive + 1}`;
                                            width += indexActive + 1 === maxLength ? ` + ${space}` : ` + ${space}/2`;
                                            progress$.css('width', `calc(${width})`);
                                            break
                                        case 'between':
                                            progress$.css('width', `calc(100% / ${maxLength - 1} * ${indexActive})`);
                                            break
                                        case 'around':
                                        default:
                                            progress$.css('width', ((indexActive + 1) / maxLength) * 100 + '%');
                                    }
                                }
                            } else if (progressStyle === 'proportion') {
                                if (progress$.length > 0){
                                    const percent = ((indexActive + 1) / maxLength) * 100 + '%';
                                    progress$
                                        .addClass('steps-style-proportion')
                                        .text(percent)
                                        .css('width', percent);
                                }
                            } else if (progressStyle === 'bar') {
                                // const space = `100% / ${maxLength}`;
                                // progress$
                                //     .css('width', `calc(${space})`)
                                //     .css('margin-left', `calc(${space} * ${indexActive})`);
                            }
                        }
                    }

                    const pageGroup$ = $('.page-group');
                    const pageActive$ = pageGroup$.find(`.form-item-controller[data-page=${dataPage}]`);
                    const pageActiveGroup$ = pageActive$.closest('.page-group');
                    const timeAnimated = 200;
                    pageGroup$.fadeOut(0);
                    switch (nextOrPrev) {
                        case 'next':
                            pageActiveGroup$.show("slide", { direction: "right" }, timeAnimated);
                            break
                        case 'prev':
                            pageActiveGroup$.show("slide", { direction: "left" }, timeAnimated);
                            break
                        default:
                            pageActiveGroup$.slideDown(timeAnimated);
                            break
                    }
                    pageActiveGroup$.show("slide", { direction: nextOrPrev === 'next' ? "right" : "left" }, 200);
                }
            }

            $('button.btn-previous').on('click', function (){
                const currentPage$ = $(this).closest('.page-group');
                if (currentPage$.length > 0){
                    const prevPage$ = currentPage$.prev('.page-group');
                    if (prevPage$.length > 0){
                        const pageController$ = prevPage$.find('.form-item-controller');
                        if (pageController$.length > 0){
                            const dataPage = pageController$.attr('data-page');
                            if (dataPage) activePageProgress(dataPage, 'prev');
                        }
                    }
                }
            });
            $('button.btn-next').on('click', function (){
                const currentPage$ = $(this).closest('.page-group');
                if (currentPage$.length > 0){
                    const nextPage$ = currentPage$.next('.page-group');
                    if (nextPage$.length > 0){
                        const pageController$ = nextPage$.find('.form-item-controller');
                        if (pageController$.length > 0){
                            const dataPage = pageController$.attr('data-page');
                            if (dataPage) activePageProgress(dataPage, 'next');
                        }
                    }
                }
            });

            stepItems$.on('click', function (){
                activePageProgress($(this).attr('data-page'));
            })

            if (stepItemInit.length > 0){
                activePageProgress(stepItemInit.attr('data-page'));
            }

            const formContent$ = $('.form-content');
            const pageGroup$ = formContent$.find('.page-group');
            pageGroup$.on('page.errors.reset', function (){
                const stepMatch$ = stepsGroup$.find(`.step-item[data-page=${$(this).attr('data-page')}]`);
                if (stepMatch$.length === 1){
                    stepMatch$.find('.errs-count').remove();
                }
            })
            pageGroup$.on('page.errors.count', function (event, data){
                data = {
                    'countErrs': 0,
                    ...data
                }
                const stepMatch$ = stepsGroup$.find(`.step-item[data-page=${$(this).attr('data-page')}]`);
                if (stepMatch$.length === 1){
                    stepMatch$.find('.errs-count').remove();
                    if (data.countErrs > 0) {
                        stepMatch$.append(`<span class="errs-count">${data.countErrs}</span>`);
                    }
                }
            })
        },
        formCountErrorInPage: function (errorList){
            const pageProgres$ = $('.progress-steps');
            const stepsGroup$ = pageProgres$.find('.steps-group');
            const stepItems$ = stepsGroup$.find('.step-item');
            const formContent$ = $('.form-content');
            if (stepItems$.length > 0){
                let errorsCountOfPage = {};
                (errorList || []).map(
                    errs => {
                        if (errs.element){
                            const pageGroup$ = $(errs.element).closest('.page-group');
                            if (pageGroup$.length === 1){
                                const dataPage = pageGroup$.attr('data-page');
                                if (dataPage){
                                    if (!errorsCountOfPage.hasOwnProperty(dataPage)){
                                        errorsCountOfPage[dataPage] = 0;
                                    }
                                    errorsCountOfPage[dataPage] += 1;
                                }
                            }
                        }
                    }
                )
                formContent$.find(`.page-group`).trigger('page.errors.reset');
                Object.keys(errorsCountOfPage).map(
                    pageIdx => {
                        const pageGroup$ = formContent$.find(`.page-group[data-page=${pageIdx}]`);
                        if (pageGroup$.length > 0){
                            pageGroup$.trigger('page.errors.count', {
                                'countErrs': errorsCountOfPage[pageIdx],
                            });
                        }
                    }
                )
            }
        },
        formLoadData: function (data){
            Object.keys(data).map(
                key => {
                    let nameRadioSkip = new Set([]);
                    const ele$ = $(`[name=${key}]`);
                    if (ele$.is('input[type=checkbox]')){
                        ele$.prop('checked', data[key]).trigger('change');
                    } else if (ele$.is('input[type=radio]')) {
                        const nameTmp = ele$.attr('name');
                        if (!nameRadioSkip.has(nameTmp)) {
                            const radio$ = $(`input[type=radio][name="${nameTmp}"][value="${data[key]}"]`);
                            if (radio$.length > 0){
                                radio$.prop('checked', true);
                                nameRadioSkip.add(nameTmp);
                            }
                        }
                    } else {
                        ele$.val(data[key]).trigger('change');
                    }
                }
            )
        },
    });
})(jQuery);