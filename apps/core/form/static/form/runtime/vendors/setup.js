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

        $('#contents').on('click', 'button.btn-more-submitted', function () {
            $(this).closest('p').hide(100, function () {
                const group$ = $(this).closest('div#data-submitted');
                const item$ = group$.find('p');
                item$.show();
                $(this).remove();
            });
        })
    })

    const attrKeySkipErrorDetail = [
        'data-datepicker',
        'data-timepicker',
        'data-datetimepicker',
        'data-rate',
    ]
    const namePrefixSkipErrorDetail = [
        /^rating_[a-zA-Z0-9]*$/,
    ]

    if ($.validator) {
        $.fn.validateB = function (opts) {
            let defaultConfig = {
                focusInvalid: true,
                validClass: "is-valid",
                errorClass: "is-invalid",
                errorElement: 'div',
                showErrors: function (errorMap, errorList) {
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
                            const messageTmp = Array.isArray(item.message) ? item.message : [item.message];
                            // 1. Not element
                            // 2. Is detail
                            // 3. Is not visible
                            // => Push to detail

                            const stateNotVisible = !item.element || (
                                item.element && (
                                    $(item.element).is(inpDetail$)
                                    || !$(item.element).is(":visible")
                                )
                            )
                            let stateSkip = false;
                            if (item.element && stateNotVisible === true) {
                                for (let i = 0; i < attrKeySkipErrorDetail.length; i++) {
                                    if (stateSkip === false) {
                                        if ($(item.element).is(`[${attrKeySkipErrorDetail[i]}]`)) {
                                            stateSkip = true;
                                            break;
                                        }
                                    }
                                }
                                for (let i = 0; i < namePrefixSkipErrorDetail.length; i++) {
                                    if (stateSkip === false) {
                                        const nameTmp = $(item.element).attr('name');
                                        if (nameTmp) {
                                            stateSkip = namePrefixSkipErrorDetail[i].test(nameTmp);
                                        }
                                    }
                                }
                            }
                            if (stateNotVisible === true && stateSkip === false) {
                                errorDetailMessage = [...errorDetailMessage, ...messageTmp];
                            } else {
                                errorMapResolve[$(item.element).attr('name')] = item.message;
                                errorListResolve.push({
                                    ...item,
                                    'message': messageTmp.map(msg => `<small>${msg}</small>`)
                                });
                            }
                        }
                    );
                    if (errorDetailMessage.length > 0) {
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
                    if (key.startsWith('rate_')) {
                        const eleTmp$ = $(`[name=${key}]`);
                        if (eleTmp$.length > 0) {
                            const ratingGroup$ = eleTmp$.closest('.rating-group');
                            if (ratingGroup$.length > 0) {
                                let inputName = `rate_${$x.fn.formGenerateRandomString(32)}`;
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
            const query$ = formSelected.find(queryExclude);

            let obj = {};
            // first with all
            query$.find(':input[name]:not(disabled):not([type=radio])').each(function () {
                let item = $.fn.formSerializerInput($(this));
                if (item.name in obj) {
                    obj[item.name] = $.isArray(obj[item.name]) ? obj[item.name] : [obj[item.name]];
                    obj[item.name].push(item.value);
                } else obj[item.name] = item.value;
            });
            // case radio | override data
            query$.find(':input[name]:not(disabled)[type=radio]').each(function () {
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

                return obj;
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
            $('select').each(function () {
                const placeholder = $(this).attr('placeholder') || '';
                const optionEmpty = $(this).find('option[value=""]');
                if (optionEmpty.length === 0) $(this).prepend(`<option value=""></option>`)
                $(this).select2({
                    'dropdownParent': $(this).closest('.form-item'),
                    disabled: $(this).prop('disabled'),
                    placeholder: placeholder.toString(),
                    ...opts,
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
                $(this).flatpickr(pickerOpts);
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
                $(this).flatpickr(pickerOpts);
            });
        },

        formInitTimePickerAll: function (opts) {
            opts = {
                loadDefault: true,
                ...opts,
            }
            const pickerI18n = formFlatpickrLanguage(true);
            $("input[data-timepicker]").each(function () {
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
                $(this).flatpickr(pickerOpts);
            });
        },

        formRangeSlider: function (opts){
            $('[data-rangeslider]').ionRangeSlider();
        },
    });
})(jQuery);