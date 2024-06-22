(function ($) {
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
                            if (
                                !item.element || (
                                    item.element && (
                                        $(item.element).is(inpDetail$)
                                        || !$(item.element).is(":visible")
                                    )
                                )
                            ) {
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

                    this.errorList = errorListResolve
                    this.errorMap = errorMapResolve
                    this.defaultShowErrors();
                },
                errorPlacement: function (error, element) {
                    // error.insertAfter(element);
                    let parentEle = element.parent();
                    let insertAfterEle = element;
                    if (
                        parentEle.hasClass('input-group')
                        || parentEle.hasClass('input-affix-wrapper')
                        || parentEle.css('display') === 'flex'
                    ) {
                        insertAfterEle = parentEle;
                    }

                    //
                    if (insertAfterEle.siblings('.select2-container').length > 0) {
                        insertAfterEle.parent().append(error);
                    } else error.insertAfter(insertAfterEle);
                },
                onsubmit: false,
            };

            let config = $.extend({}, defaultConfig, opts);
            const validator = $.fn.validate.call(this, config);
            $.validator.unpretentious($(this));
            return validator;
        };
    } else console.log("jQuery Validation was not loaded.");

    $.fn.extend({
        formGettext: function (txt) {
            try {
                return gettext(txt)
            } catch (e) {
                return txt
            }
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
            formSelected.find(queryExclude).find(':input[name]:not(disabled)').each(function () {
                let item = $.fn.formSerializerInput($(this));
                if (item.name in obj) {
                    obj[item.name] = $.isArray(obj[item.name]) ? obj[item.name] : [obj[item.name]];
                    obj[item.name].push(item.value);
                } else obj[item.name] = item.value;
            });
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

        formNotify: function (msg, typeAlert, opts = {}, defaults={}) {
            $.notify.defaults({
                'globalPosition': 'top center',
                ...defaults,
            });
            switch (typeAlert) {
                case 'success':
                    $.notify(msg, "success", opts);
                    break
                case 'failure':
                    $.notify(msg, "error", opts);
                    break
                case 'warning':
                    $.notify(msg, "warn", opts);
                    break
                case 'info':
                    $.notify(msg, "info",);
                    break
                default:
                    $.notify(msg);
            }
        },
    });
})(jQuery);