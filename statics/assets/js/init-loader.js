let globeDataCompanyConfig = null;
let globeWFRuntimeID = null;
let globeIDLastSubmit = null;

$.fn.extend({
    transEle: $('#base-trans-factory'),
    isDebug: function () {
        return $.fn.parseBoolean(globeIsDebug, false)
    },
    alterClass: function (removals, additions) {
        // https://stackoverflow.com/a/8680251/13048590
        // https://gist.github.com/peteboere/1517285
        let self = this;
        if (removals.indexOf('*') === -1) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass(removals);
            return !additions ? self : self.addClass(additions);
        }
        let patt = new RegExp('\\s' + removals.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') + '\\s', 'g');
        self.each(function (i, it) {
            let cn = ' ' + it.className + ' ';
            while (patt.test(cn)) {
                cn = cn.replace(patt, ' ');
            }
            it.className = $.trim(cn);
        });

        return !additions ? self : self.addClass(additions);
    },
    isBoolean(value) {
        return typeof value === 'boolean';
    },
    getPkDetail: function () {
        return globePK;
    },
    hasOwnProperties: function (objData, keys) {
        if (typeof objData === 'object' && Array.isArray(keys)) {
            for (let i = 0; i < keys.length; i++) {
                if (!objData.hasOwnProperty(keys[i])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    shortName: function (name, defaultReturn = '', length = 2) {
        if (name) {
            let rs = name.split(" ").map((item) => {
                return item ? item.charAt(0) : ""
            }).join("");
            if (rs.length > length) return rs.slice(0, length);
            return rs;
        }
        return defaultReturn;
    },
    parseBoolean: function (value, no_value_is_false = false, defaultReturn = null) {
        if (typeof value === 'boolean') return value;
        if (typeof value === "string") {
            value = value.trim();
            if (value === 1 || value === '1' || value === 'true' || value === 'True') return true;
            if (value === 0 || value === '0' || value === 'false' || value === 'False') return false;
        }

        if (!value && no_value_is_false === true) return false;
        return null;
    },
    dateRangePickerDefault: function (opts, funcCallback) {
        return $(this).daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            startDate: moment().startOf('hour'),
            showDropdowns: true,
            minYear: 1901,
            "cancelClass": "btn-secondary",
            locale: {
                format: 'MM/DD/YYYY hh:mm A'
            }, ...(opts && typeof opts === 'object' ? opts : {})
        }, funcCallback ? funcCallback : function () {
        });
    },
    notifyB: function (option, typeAlert = null) {
        setTimeout(function () {
            $('.alert.alert-dismissible .close').addClass('btn-close').removeClass('close');
        }, option.timeout || 100);
        let msg = "";
        if (option.title) {
            msg += option.title;
        }
        if (option.description) {
            let des_tmp = '';
            if (typeof option.description === 'string') {
                des_tmp = option.description;
            } else if (Array.isArray(option.description)) {
                des_tmp = option.description.join(", ");
            } else if (typeof option.description === 'object') {
                let des_tmp_arr = [];
                for (const [_key, value] of Object.entries(option.description)) {
                    des_tmp_arr.push(value);
                }
                des_tmp = des_tmp_arr.join(", ");
            } else {
                des_tmp = option.description.toString();
            }
            if (msg) {
                msg += ": " + des_tmp;
            } else {
                msg = des_tmp;
            }
        }
        let alert_config = {
            animate: {
                enter: 'animated bounceInDown',
                exit: 'animated bounceOutUp'
            },
            type: "dismissible alert-primary",
            z_index: 2147483647, /* Maximum index */
        }
        switch (typeAlert) {
            case 'success':
                alert_config['type'] = "dismissible alert-success";
                break
            case 'failure':
                alert_config['type'] = "dismissible alert-danger";
                break
            case 'warning':
                alert_config['type'] = "dismissible alert-warning";
                break
            case 'info':
                alert_config['type'] = "dismissible alert-info";
                break
        }
        $.notify(msg, alert_config);
    },
    valCurrency: function (returnType = null) { // returnType choice in ['string', 'number']
        if (!returnType) returnType = $(this).attr('data-return-type');
        let result = $(this).attr('value'); // don't change attr('value') to .val() !!!!
        if (!result) result = '0';
        switch (returnType) {
            case 'string':
                result = result.toString();
                break
            case 'number':
                result = parseFloat(result);
                break
            default:
                break
        }
        return result;
    },
    initMaskMoney2: function ($eleSelected = null, selectType = null) {
        // $eleSelected && selectType are required when apply Mask-Money for concrete element.
        // ELSE: apply all element have 'input.mask-money' & 'span.mask-money'
        let inputElement = $(document).find('input.mask-money');
        let spanElement = $(document).find('span.mask-money');
        if (inputElement.length > 0 || spanElement.length > 0) {
            DocumentControl.getCompanyCurrencyConfig().then((configData) => {
                let clsMaskMoney2 = new MaskMoney2(configData);
                if ($eleSelected && selectType) {
                    clsMaskMoney2.applyMaskMoney($($eleSelected), selectType)
                } else {
                    inputElement.map((idx, item) => clsMaskMoney2.applyMaskMoney($(item), 'input'));
                    spanElement.map((idx, item) => clsMaskMoney2.applyMaskMoney($(item), 'display'));
                }
            });
        }
    },
    switcherResp: function (resp, isNotify = true, swalOpts={}) {
        if (typeof resp === 'object') {
            let status = 500;
            if (resp.hasOwnProperty('status')) status = resp.status;
            switch (status) {
                case 200:
                    return resp.data
                case 201:
                    return resp.data
                case 204:
                    if (isNotify === true) $.fn.notifyB({'description': $.fn.transEle.attr('data-success'),}, 'success');
                    return {'status': status}
                case 400:
                    let mess = resp.data;
                    if (resp.data.hasOwnProperty('errors')) mess = resp.data.errors;
                    if (isNotify === true) UtilControl.notifyErrors(mess);
                    return {};
                case 401:
                    WindowControl.showUnauthenticated(swalOpts,true);
                    return {};
                case 403:
                    WindowControl.showForbidden(swalOpts);
                    return {};
                case 404:
                    WindowControl.showNotFound(swalOpts);
                    return {};
                case 500:
                    WindowControl.showSVErrors(swalOpts);
                    return {};
                default:
                    return {};
            }
        }
    },
    redirectUrl: function (redirectPath, timeout = 0, params = '') {
        setTimeout(() => {
            if (params && (params !== '' && params !== undefined)) {
                window.location.href = redirectPath + '?' + params;
            } else {
                window.location.href = redirectPath;
            }
        }, timeout);
    },
    reloadWithHashID: function (tabID = null) {
        if (this instanceof jQuery) {
            // call from $('#id').reloadWithHashID()
            let tabPane = $(this).closest('.tab-pane');
            if (tabPane.length > 0) {
                let idTabPane = $(tabPane[0]).attr('id');
                if (idTabPane) {
                    WindowControl.pushHashUrl(idTabPane);
                    window.location.reload();
                }
            }

        } else {
            // call from $.fn.reloadWithHashID() | require tabId
            if (tabID) {
                WindowControl.pushHashUrl(tabID);
                window.location.reload();
            }
        }
    },
    callAjax: function (url, method, data = {}, csrfToken = null, headers = {}, content_type = "application/json", opts = {}) {
        if (isDenied && !globeUrlNotDeny.includes(url)) return new Promise(function (resolve, reject) {
        });
        else {
            let isDropdown = opts['isDropdown'];
            let isNotify = opts['isNotify'];
            if (!$.fn.isBoolean(isNotify)) isNotify = true;
            return new Promise(function (resolve, reject) {
                let ctx = {
                    url: url,
                    type: method, // dataType: 'json',
                    contentType: content_type === "multipart/form-data" ? false : content_type,
                    processData: content_type !== "multipart/form-data",
                    data: content_type === "application/json" ? JSON.stringify(data) : WFRTControl.appendBodyCheckWFTask(data, method),
                    headers: {
                        "X-CSRFToken": (csrfToken === true ? $("input[name=csrfmiddlewaretoken]").val() : csrfToken),
                        "DTISDD": isDropdown ? 'true' : '', ...headers
                    },
                    success: function (rest, textStatus, jqXHR) {
                        let data = $.fn.switcherResp(rest, isNotify);
                        if (data) {
                            if (DocumentControl.getBtnIDLastSubmit() === 'idxSaveInZoneWFThenNext') {
                                let btnSubmit = $('#idxSaveInZoneWFThenNext');
                                let dataWFAction = btnSubmit.attr('data-wf-action');
                                if (btnSubmit && dataWFAction) {
                                    let eleActionDoneTask = $('.btn-action-wf[data-value=' + dataWFAction + ']');
                                    if (eleActionDoneTask.length > 0) {
                                        DocumentControl.setBtnIDLastSubmit(null);
                                        $(eleActionDoneTask[0]).attr('data-success-reload', false)
                                        WFRTControl.callActionWF($(eleActionDoneTask[0])).then(() => {
                                            resolve(rest);
                                        })
                                    } else {
                                        resolve(rest);
                                    }
                                } else {
                                    resolve(rest);
                                }
                            } else {
                                resolve(rest);
                            }

                        } else resolve({'status': jqXHR.status});

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        let resp_data = jqXHR.responseJSON;
                        if (resp_data && typeof resp_data === 'object') {
                            $.fn.switcherResp(resp_data, isNotify);
                            reject(resp_data);
                        } else if (jqXHR.status === 204) reject({'status': 204});
                    },
                };
                if (method.toLowerCase() === 'get') ctx.data = data
                $.ajax(ctx);
            });
        }
    },
    callAjax2: function (opts = {}) {
        if (isDenied && !globeUrlNotDeny.includes(url)){
            return new Promise(function (resolve, reject) {});
        } else {
            let isDropdown = UtilControl.popKey(opts, 'isDropdown', false, true);
            let isNotify = UtilControl.popKey(opts, 'isNotify', false, true);
            if (!$.fn.isBoolean(isNotify)) isNotify = false;

            let isLoading = UtilControl.popKey(opts, 'isLoading', false, true);
            if (!$.fn.isBoolean(isLoading)) isLoading = false;
            if (isLoading) $x.fn.showLoadingPage();

            let sweetAlertOpts = UtilControl.popKey(opts, 'sweetAlertOpts', {}, true);

            return new Promise(function (resolve, reject) {
                // Setup then Call Ajax
                let url = opts?.['url'] || null;
                if (url) {
                    let method = opts?.['method'] || 'GET';
                    let processData = opts?.['processData'] || true;
                    let contentType = opts?.['contentType'] || "application/json";
                    if (contentType === "multipart/form-data") {
                        contentType = false;
                        processData = false;
                    }

                    let csrfToken = opts?.['csrf_token'] || $("input[name=csrfmiddlewaretoken]").val();
                    let headers = opts?.['headers'] || {}
                    let data = opts?.['data'];
                    if (method.toLowerCase() === 'put' && typeof data === 'object') {
                        data = WFRTControl.appendBodyCheckWFTask(method, data);
                    }
                    if (method.toLowerCase() !== 'get' && contentType === "application/json") {
                        data = JSON.stringify(data);
                    }

                    let successCallback = opts?.['success'] || null;
                    let onlySuccessCallback = UtilControl.popKey(opts, 'successOnly', false);
                    let errorCallback = opts?.['error'] || null;
                    let onlyErrorCallback = UtilControl.popKey(opts, 'errorOnly', false);
                    let statusCodeCallback = opts?.['statusCode'] || {};

                    let ctx = {
                        ...opts,
                        success: function (rest, textStatus, jqXHR) {
                            if (isLoading) $x.fn.hideLoadingPage(0);
                            if (successCallback) successCallback(rest, textStatus, jqXHR);
                            if (onlySuccessCallback === false) {
                                let data = $.fn.switcherResp(rest, isNotify, sweetAlertOpts);
                                if (data) {
                                    if (DocumentControl.getBtnIDLastSubmit() === 'idxSaveInZoneWFThenNext') {
                                        let btnSubmit = $('#idxSaveInZoneWFThenNext');
                                        let dataWFAction = btnSubmit.attr('data-wf-action');
                                        if (btnSubmit && dataWFAction) {
                                            let eleActionDoneTask = $('.btn-action-wf[data-value=' + dataWFAction + ']');
                                            if (eleActionDoneTask.length > 0) {
                                                DocumentControl.setBtnIDLastSubmit(null);
                                                $(eleActionDoneTask[0]).attr('data-success-reload', false)
                                                WFRTControl.callActionWF($(eleActionDoneTask[0])).then(() => {
                                                    resolve(rest);
                                                })
                                            } else {
                                                resolve(rest);
                                            }
                                        } else {
                                            resolve(rest);
                                        }
                                    } else resolve(rest);
                                } else resolve({'status': jqXHR.status});
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (isLoading) $x.fn.hideLoadingPage();
                            if (errorCallback) errorCallback(jqXHR, textStatus, errorThrown);
                            if (onlyErrorCallback === false) {
                                let resp_data = jqXHR.responseJSON;
                                if (resp_data && typeof resp_data === 'object') {
                                    $.fn.switcherResp(resp_data, isNotify, sweetAlertOpts);
                                    reject(resp_data);
                                } else if (jqXHR.status === 204) reject({'status': 204});
                            }
                        },
                        url: url,
                        type: method,
                        contentType: contentType,
                        processData: processData,
                        data: data,
                        headers: {
                            "DTISDD": isDropdown === true ? 'true' : '',
                            "X-CSRFToken": csrfToken, ...headers
                        },
                        statusCode: {
                            204: function () {
                                if (isNotify === true) $.fn.notifyB({
                                    'description': $.fn.transEle.attr('data-success'),
                                }, 'success');
                            },
                            401: function () {
                                if (isNotify === true) $.fn.notifyB({
                                    'description': globeMsgAuthExpires
                                }, 'failure');
                                return WindowControl.redirectLogin(1000);
                            },
                            403: function () {
                                if (isNotify === true) $.fn.notifyB({
                                    'description': globeMsgHttp403
                                }, 'failure');
                            },
                            404: function () {
                                if (isNotify === true) $.fn.notifyB({
                                    'description': globeMsgHttp404
                                }, 'failure');
                            }, ...statusCodeCallback,
                        },
                    };
                    return $.ajax(ctx);
                }
                throw Error('Ajax must be url setup before send');
            });
        }
    },
    DataTableDefault: function (opts) {
        return new DTBControl($(this)).init(opts);
    },
    initSelect2: function (opts) {
        return new SelectDDControl($(this), opts).init();
    },
    compareStatusShowPageAction: function (resultDetail) {
        WFRTControl.compareStatusShowPageAction(resultDetail);
    },
    changePropertiesElementIsZone: function (opts) {
        WFRTControl.changePropertiesElementIsZone($(this), opts);
    },
});

$(document).ready(function () {
    $('#idxRealAction').removeClass('hidden');
    new NotifyController().active();
    new ListeningEventController().active();
});


// backup zones

// initSelect2: function (opts) {
//         function renderDropdownInfo($elm, data) {
//             let keyArg = [
//                 {
//                     name: 'Title',
//                     value: 'title'
//                 },
//                 {
//                     name: 'Code',
//                     value: 'code'
//                 },
//             ];
//             const templateFormat = $elm.attr('data-template-format');
//             if (templateFormat) {
//                 keyArg = JSON.parse(templateFormat.replace(/'/g, '"'));
//             }
//             let linkDetail = $elm.data('link-detail');
//             let $elmTrans = $('#base-trans-factory');
//             let htmlContent = `<h6 class="dropdown-header header-wth-bg">${$elmTrans.attr('data-more-info')}</h6>`;
//             for (let key of keyArg) {
//                 if (data.hasOwnProperty(key.value))
//                     htmlContent += `<div class="row mb-1"><h6><i>${key.name}</i></h6><p>${data[key.value]}</p></div>`;
//             }
//             if (linkDetail) {
//                 let link = linkDetail.format_url_with_uuid(data['id']);
//                 htmlContent += `<div class="dropdown-divider"></div><div class="text-right">
//                     <a href="${link}" target="_blank" class="link-primary underline_hover">
//                         <span>${$elmTrans.attr('data-view-detail')}</span>
//                         <span class="icon ml-1">
//                             <i class="bi bi-arrow-right-circle-fill"></i>
//                         </span>
//                     </a>
//                 </div>`;
//             }
//             $elm.parents('.input-affix-wrapper').find('.dropdown-menu').html(htmlContent);
//         }
//
//         if (!opts) opts = {};
//         let currentThis = $(this)
//         let default_data = currentThis.attr('data-onload')
//         // handle default data selected
//         if (default_data && default_data.length) {
//             if (typeof default_data === 'string') {
//                 let temp = default_data.replaceAll("'", '"')
//                 default_data = temp
//                 try {
//                     default_data = JSON.parse(default_data)
//                 } catch (e) {
//                     console.log('Warning: ', $this.attr('id'), ' parse data onload is error with this error', e)
//                 }
//             }
//             if (default_data) {
//                 if (Array.isArray(default_data)) {
//                     let htmlTemp = ''
//                     for (let item of default_data) {
//                         let name = item?.title
//                         if (item?.fist_name && item?.last_name)
//                             name = `${item.last_name}. ${item.fist_name}`
//                         htmlTemp += `<option value="${item.id}" selected>${name}</option>`
//                     }
//                     currentThis.html(htmlTemp)
//                 } else {
//                     let name = default_data.title;
//                     if (default_data.first_name && default_data.last_name)
//                         name = `${default_data.last_name}. ${default_data.first_name}`
//                     currentThis.html(`<option value="${default_data.id}" selected>${name}</option>`)
//                 }
//             }
//         }
//         // handle ajax config
//         if (opts['ajax'] || $(this).attr('data-url')) {
//             opts['ajax'] = $.extend({}, opts['ajax'], {
//                 url: opts?.ajax?.url ? opts.ajax.url : $(this).attr('data-url'),
//                 headers: {
//                     "ENABLEXCACHECONTROL": true
//                 },
//                 data: function (params) {
//                     let query = params
//                     query.isDropdown = true
//                     if (params.term) query.search = params.term
//                     query.page = params.page || 1
//                     query.pageSize = params.pageSize || 10
//                     if (currentThis.attr('data-params')) {
//                         let strParams = currentThis.attr('data-params').replaceAll("'", '"')
//                         let data_params = JSON.parse(strParams);
//                         query = {...query, ...data_params}
//                     }
//                     return query
//                 },
//                 processResults: function (res, params) {
//                     let data_original = res.data[currentThis.attr('data-prefix')];
//                     let data_convert = []
//                     if (data_original.length) {
//                         for (let item of data_original) {
//                             let dataTitleKey = currentThis.attr('data-format') ? currentThis.attr('data-format') : item.hasOwnProperty('full_name') ? 'full_name' : 'title';
//                             data_convert.push({
//                                 'text': item[dataTitleKey],
//                                 'data': item,
//                                 'selected': !!((default_data && default_data.hasOwnProperty('id') && default_data.id === item.id)),
//                             });
//                         }
//                         if (
//                             currentThis.attr('data-virtual') !== undefined
//                             && currentThis.attr('data-virtual') !== ''
//                             && currentThis.attr('data-virtual') !== "[]"
//                         ) {
//
//                             data_convert.push(JSON.parse(currentThis.attr('data-virtual')))
//                         }
//                     }
//                     params.page = params.page || 1;
//                     return {
//                         results: data_convert,
//                         pagination: {
//                             more: (params.page * 10) < res?.data?.['page_count'] // Calculate if there are more pages
//                         }
//                     };
//                 },
//             })
//         }
//         let tokenSeparators = UtilControl.parseJsonDefault($(this).attr('data-select2-tokenSeparators'), null);
//         let closeOnSelect = $.fn.parseBoolean($(this).attr('data-select2-closeOnSelect'));
//         let allowClear = $.fn.parseBoolean($(this).attr('data-select2-allowClear'));
//
//         // placeholder
//         if (!opts['placeholder']) {
//             let placeholder = $(this).attr('data-select2-placeholder')
//             if (placeholder) opts['placeholder'] = placeholder;
//         }
//         // -- placeholder
//
//         // fix select2 for bootstrap modal
//         if (!opts['dropdownParent']) {
//             let dropdownParent = $(this).closest('div.modal');
//             if (dropdownParent.length > 0) opts['dropdownParent'] = $(dropdownParent[0]);
//         }
//         // -- fix select2 for bootstrap modal
//         if ($(this).find('option').length <= 0) {
//             $(this).append(`<option value=""></option>`);
//         }
//
//         if (opts?.['data'] && opts?.['ajax']) {
//             delete opts['data'];
//         }
//
//         $(this).select2({
//             placeholder: {
//                 id: '', // the value of the option
//                 text: $.fn.transEle.attr('data-select-placeholder')
//             },
//             multiple: !!$(this).attr('multiple') || !!$(this).attr('data-select2-multiple'),
//             closeOnSelect: closeOnSelect === null ? true : closeOnSelect,
//             allowClear: allowClear === null ? false : allowClear,
//             disabled: !!$(this).attr('data-select2-disabled') || $(this).prop('disabled'),
//             tags: !!$(this).attr('data-select2-tags'),
//             tokenSeparators: tokenSeparators ? tokenSeparators : [","],
//             width: "100%",
//             theme: 'bootstrap4',
//             language: {
//                 loadingMore: function () {
//                     return $.fn.transEle.attr('data-select2-loadmore'); // Replace with your translated text
//                 }
//             },
//             ...opts
//         });
//         if ($(this).attr('data-template-format')) {
//             $(this).on("select2:select", function (e) {
//                 currentThis.parents('.input-affix-wrapper').find('.dropdown i').attr('disabled', false)
//                 renderDropdownInfo(currentThis, e.params.data)
//             })
//             if ($(this).attr('data-onload')) {
//                 let dataOnload = JSON.parse($(this).attr('data-onload').replace(/'/g, '"'));
//                 $(this).parents('.input-affix-wrapper').find('.dropdown i').attr('disabled', false)
//                 renderDropdownInfo($(this), dataOnload)
//             }
//         }
//     },