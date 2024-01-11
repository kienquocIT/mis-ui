class SetupFormSubmit {
    static getUrlDetailWithID(url, pk) {
        url = url.split("/").slice(0, -1).join("/") + "/";
        if (url && pk) {
            return url + pk.toString();
        }
        return null;
    }

    static serializerObject(formSelected) {
        return formSelected.find(':not([dont_serialize]):not([name^="DataTables_"])').serializeArray().reduce((o, kv) => ({
            ...o,
            [kv.name]: kv.value
        }), {});
    }

    static groupDataFromPrefix(data, prefix) {
        let rs = {};
        Object.keys(data).map((key) => {
            if (key.startsWith(prefix)) {
                rs[key.split(prefix)[1]] = data[key]
            }
        })
        return rs;
    }

    constructor(formSelected, urlDefault = null, urlRedirectDefault = null, dataMethodDefault = null) {
        this.formSelected = formSelected;

        // URL call API
        this.dataUrl = formSelected.attr('data-url');
        if (!this.dataUrl) this.dataUrl = urlDefault ? urlDefault : window.location.pathname;

        // METHOD call API
        this.dataMethod = formSelected.attr('data-method');
        if (!this.dataMethod) {
            if (dataMethodDefault) {
                this.dataMethod = dataMethodDefault
            } else {
                if ($.fn.isDebug()) {
                    console.log(this.formSelected)
                }
                throw ('Data Method do not support! It is ' + this.dataMethod);
            }
        }

        // URL REDIRECT after success callback
        this.dataUrlRedirect = formSelected.attr('data-url-redirect');
        if (!this.dataUrlRedirect) this.dataUrlRedirect = urlRedirectDefault ? urlRedirectDefault : null;

        // REDIRECT TIMEOUT
        this.dataRedirectTimeout = formSelected.attr('data-redirect-timeout');
        if (!this.dataRedirectTimeout) this.dataRedirectTimeout = this.dataRedirectTimeout ? this.dataRedirectTimeout : 1000;

        // Data body get from form input
        this.dataForm = SetupFormSubmit.serializerObject(formSelected);

        // URL DETAIL
        this.dataUrlDetail = formSelected.attr('data-url-detail');
        if (!this.dataUrlRedirect) this.dataUrlRedirect = urlRedirectDefault ? urlRedirectDefault : null;
        if (this.dataUrlDetail) {
            this.dataUrlDetail = this.dataUrlDetail.split("/").slice(0, -1).join("/") + "/";
        }
    }

    getUrlDetail(pk) {
        if (this.dataUrlDetail && pk) {
            return this.dataUrlDetail + pk.toString();
        }
        return null;
    }

    validate(opts) {
        if (this.formSelected) {
            let submitHandler = opts?.['submitHandler'];
            if (opts.hasOwnProperty('submitHandler')) {
                delete opts['submitHandler'];
            }

            this.formSelected.each(function () {
                $(this).validate({
                    focusInvalid: true,
                    validClass: "is-valid",
                    errorClass: "is-invalid",
                    errorElement: "small",
                    showErrors: function (errorMap, errorList) {
                        this.defaultShowErrors();
                    },
                    errorPlacement: function (error, element) {
                        element.closest('.form-group').append(error);
                        // error.insertAfter(element);
                        error.css({
                            'color': "red",
                        })
                    },
                    submitHandler: function (form, event) {
                        event.preventDefault();
                        submitHandler ? submitHandler($(form), event) : form.submit();
                    },
                    onsubmit: true, // !!submitHandler,
                    ...opts,
                })
            })
        } else {
            throw Error('Form element must be required!');
        }
    }

    static validate(frmEle, opts) {
        return new SetupFormSubmit(frmEle).validate(opts)
    }
}

class MaskMoney2 {
    static _beforeParseFloatAndLimit(strData) {
        let data = strData.replace(/^0+0+$/, "");
        if (data.indexOf('.') > -1 && data.length > 18) {
            return data.slice(0, 18);
        } else if (data.indexOf('.') === -1 && data.length > 17) {
            return data.slice(0, 17);
        }
        return data;
    }

    static focusInputMoney($ele) {
        return $($ele).val($($ele).attr('value'));
    }

    static blurInputMoney($eleSelected) {
        DocumentControl.getCompanyCurrencyConfig().then((configData) => {
            $($eleSelected).val(new MaskMoney2(configData).applyConfig($($eleSelected).attr('value')));
        });
    }

    static realtimeInputMoney($ele) {
        $($ele).attr('value', parseFloat(MaskMoney2._beforeParseFloatAndLimit($($ele).val())));
    }

    constructor(configData) {
        this.configData = configData;
    }

    applyConfig(strAttrValue) {
        let strDataParsed = parseFloat(strAttrValue);
        if (strAttrValue !== null && Number.isFinite(strDataParsed)) {
            strAttrValue = strDataParsed.toString();

            // apply mask-money config
            let prefix = this.configData?.['prefix'];
            let suffix = this.configData?.['suffix'];
            let decimal = this.configData?.['decimal'];
            let thousand = this.configData?.['thousands'];
            let precision = parseInt(this.configData?.['precision']);
            let parsedFloatData = parseFloat(MaskMoney2._beforeParseFloatAndLimit(strAttrValue));
            if (Number.isInteger(precision)) parsedFloatData = parseFloat(parsedFloatData.toFixed(precision));
            if (Number.isFinite(parsedFloatData)) {
                let result = '';
                let arrData = parsedFloatData.toString().split(".");
                if (arrData[0].length > 0) {
                    let rs = [];
                    arrData[0].split("").reverse().map((item, idx, {length}) => {
                        rs.push(item);
                        if (idx !== length - 1 && idx !== 0 && (idx + 1) % 3 === 0) rs.push(thousand ? thousand : "");
                    });
                    if (arrData.length === 2 && arrData[1].length > 0) {
                        result = rs.reverse().join("") + (decimal ? decimal : ".") + arrData[1];
                    } else result = rs.reverse().join("");
                }
                return (prefix ? prefix : "") + result + (suffix ? suffix : "");
            }
        }
    }

    applyMaskMoney($ele, inputOrDisplay) {
        // inputOrDisplay choice in ['input', 'display']
        switch (inputOrDisplay) {
            case 'input':
                $($ele).val(this.applyConfig($($ele).attr('value')));
                break
            case 'display':
                $($ele).text(this.applyConfig($($ele).attr('data-init-money')));
                break
            default:
                if ($.fn.isDebug() === true) throw Error('strData must be required!')
        }
    }
}

class UrlGatewayReverse {
    static get_url(docID, docAppCode, params = {}) {
        let arrAppCode = docAppCode.split(".");
        let urlData = '#';
        if (docID && arrAppCode.length === 2) {
            urlData = globeGatewayMiddleDetailView.replaceAll('_plan_', arrAppCode[0]).replaceAll('_app_', arrAppCode[1]).replaceAll('_pk_', docID) + "?" + $.param(params);
        }
        return urlData;
    }
}

class LogController {
    constructor() {
        this.groupLogEle = $('#drawer_log_data');
        this.tabLog = $('#tab-diagram');
        this.logUrl = this.tabLog.attr('data-url');
        this.blockDataRuntime = $('#idxDataRuntime');
        this.tabActivityLog = $('#tab-activities');
        this.activityUrl = this.tabActivityLog.attr('data-url');
        this.blockDataActivities = $('#idxDataActivities');
    }

    setStyleBoxLog() {
        let heightNavHeader = $('.blog-header').outerHeight();
        $('.ntt-drawer').css('top', heightNavHeader).css('height', "calc(100vh - " + (heightNavHeader + "px") + ")");
    }

    parseLogOfDoc(stagesData) {
        let ulStages = [];
        if (stagesData.length > 0) {
            stagesData.map((item) => {
                let baseHTML = `<div class="row"><div class="col-12"><div class="card"><div class="hk-ribbon-type-1 start-touch">` + `<span>{stationName}</span></div><h5 class="card-title"></h5>{logData}{assigneeData}</div></div></div>`;
                let stationName = item['code'] ? `<i class="fas fa-cog"></i><span class="ml-1">${item['title']}</span>` : item['title'];

                let assigneeHTML = [];
                item['assignee_and_zone'].map((item2) => {
                    if (item2['is_done'] === false) {
                        assigneeHTML.push(`<span class="badge badge-warning badge-outline wrap-text mr-1">${item2['full_name']}</span>`)
                    }
                })
                let assignGroupHTML = assigneeHTML.length > 0 ? `<div class="card-footer card-text">${assigneeHTML.join("")}</div>` : ``;

                let logHTML = [];
                item['logs'].map((itemLog) => {
                    let childLogHTML = `<div class="mt-3"><span class="badge badge-secondary badge-outline mr-1">${UtilControl.parseDateTime(itemLog?.['date_created'])}</span>`;
                    if (itemLog['is_system'] === true) {
                        childLogHTML += `<span class="badge badge-soft-light mr-1"><i class="fas fa-robot"></i></span>`;
                        if ($.fn.hasOwnProperties(itemLog['actor_data'], ['full_name'])) {
                            childLogHTML += `<span class="badge badge-soft-light mr-1">${itemLog['actor_data']?.['full_name']}</span>`;
                        }
                    } else {
                        if ($.fn.hasOwnProperties(itemLog['actor_data'], ['full_name'])) {
                            childLogHTML += `<span class="badge badge-soft-success mr-1">${itemLog['actor_data']?.['full_name']}</span>`;
                        }
                    }
                    childLogHTML += ` <span class="text-low-em">${itemLog['msg']}</span></div>`;
                    logHTML.push(childLogHTML);
                })
                let logGroupHTML = `<div class="card-body mt-4"><div class="card-text">${logHTML.join("")}</div></div>`

                ulStages.push(baseHTML.format_by_key({
                    stationName: stationName,
                    assigneeData: assignGroupHTML,
                    logData: logGroupHTML,
                }))
            })
        }
        return ulStages.join("");
    }

    parseLogActivities(log_data) {
        return log_data.map((item) => {
            let dateCreatedHTML = `<span class="badge badge-dark badge-outline mr-1">${UtilControl.parseDateTime(item.date_created)}</span>`;
            let msgHTML = `<span class="badge badge-light badge-outline mr-1">${item.msg}</span>`;
            let isDataChangeHTML = Object.keys(item?.['data_change']).length > 0 ? `<button class="btn btn-icon btn-rounded bg-dark-hover btn-log-act-more mr-1"><span class="icon"><i class="fa-solid fa-info"></i></span></button>` : ``;
            let dataChangeHTML = `<pre class="log-act-data-change hidden">${JSON.stringify(item?.['data_change'], null, 2)}</pre>`;
            let baseHTML = ``;
            if (item?.['automated_logging'] === true) {
                baseHTML = `<div class="avatar avatar-icon avatar-xxs avatar-soft-dark avatar-rounded mr-1"><span class="initial-wrap"><i class="fa-solid fa-gear"></i></span></div>`;
            } else {
                baseHTML = `<span class="badge badge-primary mr-1">${item?.['employee_data']?.['full_name']}</span>`;
            }
            return `<p class="mb-1 mt-1"> ${baseHTML} ${dateCreatedHTML} ${msgHTML} ${isDataChangeHTML} </p> ${dataChangeHTML}` + `<hr class="bg-blue-dark-3" />`
        }).join("");
    }

    getDataLogAndActivities(pkID, runtimeID, forceLoad = null) {
        // reset style
        this.setStyleBoxLog();

        // reset title display
        let txtTitle = $("#txtDocTitleHistory");
        txtTitle.text("");

        // log runtime
        if (this.logUrl && (!this.groupLogEle.attr('data-log-runtime-loaded') || forceLoad === true)) {
            WindowControl.showLoadingWaitResponse(this.blockDataRuntime);
            this.blockDataRuntime.empty();
            let dataRuntimeCounter = 0;
            let intervalShowWfHistory = setInterval(() => {
                if (dataRuntimeCounter > 5) {
                    clearInterval(intervalShowWfHistory);
                    this.blockDataRuntime.html(`<span class="text-danger">${globeResourceLoadFailed}</span>`).removeClass('hidden');
                    WindowControl.hideLoadingWaitResponse(this.blockDataRuntime);
                } else {
                    dataRuntimeCounter += 1;
                    if (!runtimeID) runtimeID = WFRTControl.getWFRuntimeID();
                    if (runtimeID) {
                        clearInterval(intervalShowWfHistory);
                        $.fn.callAjax2({
                            url: SetupFormSubmit.getUrlDetailWithID(this.logUrl, runtimeID),
                            method: 'GET',
                        }).then((resp) => {
                            this.groupLogEle.attr('data-log-runtime-loaded', true);
                            let data = $.fn.switcherResp(resp);
                            if (data && $.fn.hasOwnProperties(data, ['diagram_data'])) {
                                let diagram_data = data?.['diagram_data'];
                                if (diagram_data) {
                                    let docTitle = diagram_data?.['doc_title'] || '';
                                    let stages = diagram_data?.['stages'] || [];
                                    txtTitle.text(docTitle ? docTitle : '').closest('.ntt-drawer-title-text').removeClass('hidden');
                                    this.blockDataRuntime.html(
                                        this.parseLogOfDoc(stages)
                                    ).removeClass('hidden');
                                    WindowControl.hideLoadingWaitResponse(this.blockDataRuntime);
                                }
                            }
                        });
                    }
                }
            }, 1000)
        }

        // log activities
        WindowControl.showLoadingWaitResponse(this.blockDataActivities);
        this.blockDataActivities.empty();
        let intervalDataActivity = setInterval(() => {
            if (!pkID) pkID = this.tabActivityLog.attr('data-id-value');
            if (this.activityUrl && pkID && (!this.groupLogEle.attr('data-log-activity-loaded') || forceLoad === true)) {
                clearInterval(intervalDataActivity);
                $.fn.callAjax2({
                    url: this.activityUrl,
                    method: 'GET',
                    data: {'doc_id': pkID},
                }).then((resp) => {
                    this.groupLogEle.attr('data-log-activity-loaded', true);
                    let data = $.fn.switcherResp(resp);
                    if (data && data['status'] === 200 && data.hasOwnProperty('log_data')) {
                        this.blockDataActivities.append(this.parseLogActivities(data['log_data']));
                    } else {
                        WindowControl.hideLoadingWaitResponse(this.blockDataActivities);
                    }
                }, (errs) => {

                });
            }
        }, 1000)
    }
}

class NotifyController {
    constructor() {
        this.bellIdx = $('#idxNotifyBell');
        this.bellIdxIcon = $('#idxNotifyBellIcon');
        this.bellCount = $('#my-notify-count');
        this.notifyCountUrl = this.bellIdx.attr('data-url');
        this.dropdownData = $('#notifyDropdownData');
        this.btnSeenAll = $('#btnNotifySeenAll');
        this.btnClearAll = $('#btnNotifyClearAll');
    }

    checkNotifyCount() {
        $.fn.callAjax2({
            url: this.notifyCountUrl,
            method: 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && data.hasOwnProperty('count') && data['count'] > 0) {
                this.bellCount.text(data['count']);
                this.bellIdxIcon.addClass('my-bell-ring');
            }
        });
    }

    // main
    active() {
        new NotifyPopup().cleanChildNotifyBlock();
        let realThis = this;
        if (realThis.notifyCountUrl) realThis.checkNotifyCount();
        realThis.dropdownData.on("show.bs.dropdown", function () {
            let dataArea = $('#idxNotifyShowData');
            WindowControl.showLoadingWaitResponse(dataArea);
            dataArea.empty();

            let dataUrl = $(this).attr('data-url');
            let dataMethod = $(this).attr('data-method');

            $.fn.callAjax2({
                url: dataUrl,
                method: dataMethod,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                let arr_no_seen = [];
                let arr_seen = [];
                if (data && data.hasOwnProperty('notify_data')) {
                    data['notify_data'].map((item) => {
                        let senderData = item?.['employee_sender_data']?.['full_name'];
                        let urlData = UrlGatewayReverse.get_url(item['doc_id'], item['doc_app'], {
                            'redirect': true,
                            'notify_id': item['id']
                        },);
                        let tmp = `
                            <a 
                                href="${urlData}" 
                                class="dropdown-item mb-1 border border-light ${item?.['is_done'] === true ? '' : 'bg-light'}"
                            >
                                <div class="media">
                                    <div class="media-head">
                                        <div class="avatar avatar-rounded avatar-sm">
                                            <span class="initial-wrap">${senderData ? $.fn.shortName(senderData) : '<i class="fa-solid fa-gear"></i>'}</span>
                                        </div>
                                    </div>
                                    <div class="media-body">
                                        <div>
                                            <div class="notifications-text">
                                                <span class="text-primary title">${item?.['title']}</span>
                                            </div>
                                            <div class="notifications-text mb-3">
                                                <small class="text-muted">${item?.['msg']}</small>
                                            </div>
                                            <div class="notifications-info">
                                                 <span class="badge badge-soft-success noti-custom">${item?.['doc_app']}</span>
                                                 <div class="notifications-time">${item?.['date_created']}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        `;
                        if (item?.['is_done'] === true) arr_seen.push(tmp); else arr_no_seen.push(tmp);
                    })
                }
                if (arr_no_seen.length > 0 || arr_seen.length > 0) {
                    dataArea.append(arr_no_seen.join("") + arr_seen.join(""));
                } else {
                    dataArea.append(`<small class="text-muted">${$.fn.transEle.attr('data-no-data')}</small>`);
                }
                WindowControl.hideLoadingWaitResponse(dataArea);
            }, (errs) => {
                WindowControl.hideLoadingWaitResponse(dataArea);
            });
        });
        realThis.btnSeenAll.click(function (event) {
            event.preventDefault();
            let dataUrl = $(this).attr('data-url');
            let dataMethod = $(this).attr('data-method');
            if (dataUrl && dataMethod) {
                $.fn.callAjax2({
                    url: dataUrl,
                    method: dataMethod,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        realThis.bellIdxIcon.removeClass('my-bell-ring');
                        realThis.bellCount.text("");
                    }

                },)
            }
        });
        realThis.btnClearAll.click(function (event) {
            event.preventDefault();
            let dataUrl = $(this).attr('data-url');
            let dataMethod = $(this).attr('data-method');
            if (dataUrl && dataMethod) {
                $.fn.callAjax2({
                    url: dataUrl,
                    method: dataMethod,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data['status'] === 204) {
                        realThis.checkNotifyCount();
                    }
                });
            }
        });
    }
}

class FileUtils {
    static clsButtonMain = 'btn-file-upload';
    static numberFileSizeMiBMax = 20;
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
    static keyTypeAccept = 'data-f-accept'; // default: undefined || null : allow all

    static keyInputTextID = 'data-f-input-id';
    static keyInputFileID = 'data-f-input-file-id';
    static keyInputTextName = 'data-f-input-name';
    static keyInputTextRequired = 'data-f-input-required';
    static keyInputTextDisabled = 'data-f-input-disabled';
    static keyInputMultiple = 'data-f-multiple';
    static keyEleFileNameID = 'data-f-name-ele-id';
    static clsNameInputFile = 'input-file-upload';

    static _getMaxSizeDisplay() {
        return globeMaxFileSize.replaceAll("{size}", FileUtils.numberFileSizeMiBMax);
    }

    static _getAllowMultiple() {
        return globeAllowMultiple;
    }

    static _checkTypeFileAllow(file_type, accept_list) {
        file_type = file_type.toLowerCase();
        if (accept_list.includes('*')) return true;

        for (let i = 0; i < accept_list.length; i++) {
            let typeF = accept_list[i].toLowerCase();
            if (typeF.endsWith("/*")) {
                if (file_type.split("/")[0] === typeF.split("/")[0]) return true;
            } else if (typeF === file_type) return true;
        }

        return false;
    }

    static checkTypeAccept(file, accept) {
        let acceptArr = accept.split(",").map((item) => item.trim());
        if (!FileUtils._checkTypeFileAllow(file.type, acceptArr)) {
            let typeMsgErr = acceptArr.map((item) => `"${item}"`).join(", ");
            $.fn.notifyB({
                'description': `${globeFileDeny}. <p>${globeFileAccept} ${typeMsgErr}<p>`,
            }, 'failure');
            return false;
        }
        return true;
    }

    static checkMaxFileSize(file_size) {
        if (file_size > FileUtils.numberFileSizeMiBMax * 1024 * 1024) {
            $.fn.notifyB({
                'description': FileUtils._getMaxSizeDisplay(),
            }, 'failure');
            return false;
        }
        return true;
    }

    static parseFileSize(file_size, fixRound = 2) {
        if (file_size) {
            // file_size: is bytes size
            const KiB = 1024;
            const MiB = KiB * 1024;
            const GiB = MiB * 1024;

            if (file_size >= GiB) {
                return (file_size / GiB).toFixed(fixRound) + " GB";
            } else if (file_size >= MiB) {
                return (file_size / MiB).toFixed(fixRound) + " MB";
            } else if (file_size >= KiB) {
                return (file_size / KiB).toFixed(fixRound) + " KB";
            } else {
                return file_size + " B";
            }
        }
        return '0 KiB';
    }

    static createInputText(mainEle, name, required, disabled, multiple = false) {
        let idRandom = UtilControl.generateRandomString(32);
        $(mainEle).attr(FileUtils.keyInputTextID, '#' + idRandom);
        let ele = $(`<input 
                type="text" 
                class="hidden" 
                name="${name}" 
                ${required === true ? "required" : ""}
                ${disabled === true ? "disabled" : ""}
                id="${idRandom}"
                ${multiple === true ? 'multiple' : ''}
            />`);
        ele.val("");
        ele.insertAfter(mainEle);
        return ele;
    }

    static updateInputText(inputText, required, disabled, multiple) {
        $(inputText).prop('required', required);
        $(inputText).prop('disabled', disabled);
        $(inputText).prop('multiple', multiple);
    }

    static createInputFile(mainEle, required, disabled, multiple) {
        let idRandom = UtilControl.generateRandomString(32);
        $(mainEle).attr(FileUtils.keyInputFileID, '#' + idRandom);

        let accept = $(mainEle).attr(FileUtils.keyTypeAccept);

        let ele = $(`
            <input 
                type="file" 
                value=""
                class="hidden ${FileUtils.clsNameInputFile}" id="${idRandom}"
                accept="${accept ? accept : '*'}"
                ${required ? "required" : ""}
                ${disabled ? "disabled" : ""}
                ${multiple ? "multiple" : ""}
            />
            <small><i>${multiple === true ? FileUtils._getAllowMultiple() : ""} ${FileUtils._getMaxSizeDisplay()}</i></small>
        `);
        ele.insertAfter(mainEle);
        return ele;
    }

    static updateInputFile(inputFile, required, disabled, multiple) {
        $(inputFile).prop('required', required);
        $(inputFile).prop('disabled', disabled);
        $(inputFile).prop('multiple', multiple);
    }

    static enableButtonFakeUpload(btnFakeEle, disabled) {
        $(btnFakeEle).prop('disabled', disabled);
    }

    static init(eleSelect$ = null, dataDetail = {}) {
        if (eleSelect$) {
            let idInputText = $(eleSelect$).attr(FileUtils.keyInputTextID);
            let idInputFile = $(eleSelect$).attr(FileUtils.keyInputFileID);
            let idInputTextName = $(eleSelect$).attr(FileUtils.keyInputTextName);
            let idInputTextRequired = $.fn.parseBoolean($(eleSelect$).attr(FileUtils.keyInputTextRequired), true) === true;
            let idInputTextDisabled = $.fn.parseBoolean($(eleSelect$).attr(FileUtils.keyInputTextDisabled), true) === true;
            let idInputMultipleUpload = $.fn.parseBoolean($(eleSelect$).attr(FileUtils.keyInputMultiple), false) === true;

            if (idInputText && idInputFile) {
                let eleInputText = $(idInputText);
                let eleInputFile = $(idInputFile);
                if (!(eleInputText.length > 0 && eleInputFile.length > 0)) {
                    FileUtils.createInputText(
                        $(eleSelect$),
                        idInputTextName,
                        idInputTextRequired,
                        idInputTextDisabled,
                        idInputMultipleUpload,
                    );
                    FileUtils.createInputFile(
                        $(eleSelect$),
                        idInputTextRequired,
                        idInputTextDisabled,
                        idInputMultipleUpload,
                    );
                } else {
                    FileUtils.updateInputText(
                        $(eleInputText[0]),
                        idInputTextRequired,
                        idInputTextDisabled,
                        idInputMultipleUpload
                    )
                    FileUtils.updateInputFile(
                        $(eleInputFile[0]),
                        idInputTextRequired,
                        idInputTextDisabled,
                        idInputMultipleUpload,
                    )
                }
            } else {
                FileUtils.createInputText(
                    $(eleSelect$),
                    idInputTextName,
                    $.fn.parseBoolean(idInputTextRequired, false) === true,
                    idInputTextDisabled,
                    idInputMultipleUpload,
                );
                FileUtils.createInputFile(
                    $(eleSelect$),
                    idInputTextRequired,
                    idInputTextDisabled,
                    idInputMultipleUpload,
                );
            }

            FileUtils.enableButtonFakeUpload($(eleSelect$), $.fn.parseBoolean(idInputTextDisabled, true) === true,)

            if (dataDetail && $.fn.hasOwnProperties(dataDetail, ['media_file_id', 'file_name'])) {
                let media_file_id = dataDetail?.['media_file_id'];
                let file_name = dataDetail?.['file_name'];
                let file_size = dataDetail?.['file_size'];
                if (media_file_id && file_name) {
                    let f_utils = new FileUtils(eleSelect$);
                    f_utils.setIdFile(media_file_id);
                    f_utils.setFileNameUploaded(file_name, file_size || null);
                }
            }
        } else {
            $('.btn-file-upload').each(function () {
                FileUtils.init($(this));
            });
        }
    }

    constructor(btnUploadFileEle$) {
        if (btnUploadFileEle$) {
            this.btnUploadFileEle$ = btnUploadFileEle$;

            this.idInputText = btnUploadFileEle$.attr(FileUtils.keyInputTextID);
            if (this.idInputText) this.eleInputText = $(this.idInputText);

            this.idInputFile = btnUploadFileEle$.attr(FileUtils.keyInputFileID);
            if (this.idInputFile) this.eleInputFile = $(this.idInputFile);

            this.idEleFileName = btnUploadFileEle$.attr(FileUtils.keyEleFileNameID);
        } else if ($.fn.isDebug() === true) throw Error('Required button upload when init new FileUtils');
    }

    resetValeInputFile() {
        this.eleInputFile.val(null);
    }

    setIdFile(fileID) {
        let eleInputText = $(this.idInputText);
        if (eleInputText.length > 0) {
            return eleInputText.val(fileID);
        }
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Upload process went wrong!',
            footer: '<a href="#" class="show-raise-ticket">Raise a ticket?</a>'
        })
        if ($.fn.isDebug() === true) throw Error('Input must be required before upload file!');
    }

    setFileNameUploaded(fName, fSize = null) {
        let textDisplay = fName ? `${fName} - ${FileUtils.parseFileSize(fSize, 2)}` : ''
        if (this.idEleFileName) {
            let ele = $(this.idEleFileName);
            if (ele.length > 0) {
                ele.text(textDisplay);
            }
        } else {
            let getEleFName = this.btnUploadFileEle$.siblings('.display-file-name-uploaded');
            if (getEleFName.length > 0) {
                getEleFName.text(textDisplay);
            } else {
                this.btnUploadFileEle$.parent().append($(`<small class="form-text text-muted display-file-name-uploaded">${textDisplay}</small>`));
            }
        }
    }

    callUploadFile(file, btnMainEle) {
        let clsThis = this;
        let dataUrl = globeUrlAttachmentUpload;

        let formData = new FormData();
        formData.append('file', file);

        let progressBarEle = $(`<div class="progress">
            <div
                class="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar"
                aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
            ></div>
        </div>
        `)
        $(btnMainEle).parent().append(progressBarEle);

        return $.fn.callAjax2({
            url: dataUrl,
            method: 'POST',
            data: formData,
            contentType: 'multipart/form-data',
            isNotify: false,
            xhr: function () {
                let xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        let percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        progressBarEle.find('.progress-bar').alterClass('w-*', 'w-' + Math.ceil(percentComplete).toString());

                        if (percentComplete === 100) {
                            console.log('complete upload');
                        }

                    }
                }, false);
                return xhr;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let resp_data = jqXHR.responseJSON;
                if ((!resp_data || typeof resp_data !== 'object') && jqXHR.status !== 204) {
                    WindowControl.hideLoadingButton($(btnMainEle));
                    progressBarEle.remove();
                }
            },
            errorOnly: false,
        }).then((resp) => {
            let detailFile = resp?.data?.detail;
            clsThis.setIdFile(detailFile?.['id']);
            clsThis.setFileNameUploaded(detailFile?.['file_name'], detailFile?.['file_size']);
            WindowControl.hideLoadingButton($(btnMainEle));
            progressBarEle.remove();
        }, (errs) => {
            progressBarEle.remove();
            let existData = errs?.data?.['errors']?.['exist'];
            let nameFile = existData?.['name'].split(".")[0];
            let extFile = existData?.['name'].split(".").pop();
            if (existData) {
                let newFileNameIDRandom = 'newFileName_' + UtilControl.generateRandomString(12);
                Swal.fire({
                    title: `<h5 class="text-danger"><i class="fa-solid fa-file"></i> ${nameFile}.${extFile}</h5> <p>What would you like to new upload with the file name to?</p>`,
                    confirmButtonText: 'New',
                    showCancelButton: true,
                    cancelButtonText: $.fn.transEle.attr('data-cancel'),
                    showDenyButton: true,
                    denyButtonText: `Use it`,
                    denyButtonColor: '#1d9e7d',
                    html: `<div class="input-group mb-3">
                                        <input type="text" autocapitalize="off" class="form-control" placeholder="New file name" id="${newFileNameIDRandom}">
                                        <span class="input-group-text" id="newFileExt" data-file-ext="${extFile}">.${extFile}</span>
                                    </div>`,
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        let newFileNewEle = $('#' + newFileNameIDRandom);
                        let fileNewNameExcludeExt = newFileNewEle.val();
                        if (fileNewNameExcludeExt) {
                            let nameNewFile = newFileNewEle.val() + "." + extFile;
                            let newFile = new File([file], nameNewFile, {
                                type: file.type,
                            });
                            let formDataNewName = new FormData();
                            formDataNewName.append('file', newFile);
                            return $.fn.callAjax2({
                                url: dataUrl,
                                method: 'POST',
                                data: formDataNewName,
                                contentType: 'multipart/form-data',
                                isNotify: false,
                            }).then((resp) => {
                                let detailNewFile = resp?.data?.detail;
                                clsThis.setIdFile(detailNewFile?.['id']);
                                clsThis.setFileNameUploaded(detailNewFile?.['file_name'], detailNewFile?.['file_size']);
                                return true;
                            }, (errs) => {
                                if ($.fn.isDebug() === true) console.log(errs);
                                clsThis.showErrsUploadFile(newFileNewEle);
                                return false;
                            });
                        } else {
                            clsThis.showErrsUploadFile(newFileNewEle);
                            return false;
                        }

                    },
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // change name
                        // data update to element at preConfirm
                        // Swal.fire('Saved!', '', 'success');
                    } else if (result.isDenied) {
                        // use file exist
                        clsThis.resetValeInputFile();
                        clsThis.setIdFile(existData['id']);
                        clsThis.setFileNameUploaded(existData['file_name'], existData['file_size']);
                    } else {
                        // cancel
                        clsThis.resetValeInputFile();
                        clsThis.setIdFile(null);
                        clsThis.setFileNameUploaded(null);
                    }
                    WindowControl.hideLoadingButton($(btnMainEle));
                })
            } else {
                if ($.fn.isDebug() === true) console.log(errs);
                clsThis.resetValeInputFile();
                WindowControl.hideLoadingButton($(btnMainEle));
            }
        },);
    }

    showErrsUploadFile(inputNewFileName$) {
        $(inputNewFileName$).addClass('is-invalid');
        let groupNewFileEle = $(inputNewFileName$).closest('.input-group').parent();
        let textErrs = groupNewFileEle.find('.file-errs');
        if (textErrs.length > 0) textErrs.text(`File name is exist`); else groupNewFileEle.append(`<small class="file-errs form-text text-danger">File name is exist</small>`);
    }
}

class ListeningEventController {
    switchCompany() {
        $('#btn-call-switch-company').click(function () {
            let current_company_id = $('#company-current-id').attr('data-id');
            let company_id_selected = $("input[name='switch_current_company']:checked").val();
            if (current_company_id !== company_id_selected) {
                $.fn.callAjax2({
                    url: $(this).attr('data-url'),
                    method: $(this).attr('data-method'),
                    data: {
                        'company': company_id_selected
                    },
                }).then((resp) => {
                    $.fn.notifyB({
                        'description': resp.data.detail
                    }, 'success');
                    setTimeout(() => {
                        $('#link-logout')[0].click();
                    }, 1200);
                });
            }
            $('#switchMyCompany').modal('toggle');
        });
    }

    selectELe() {
        // Listen event select and select2-init-v1 for set previous selected data
        $(document).on('focus', 'select', function () {
            $(this).data('previousValue', $(this).val());
        })
        $(document).on('click', '.select2-init-v1', function () {
            if (!$(this).attr('data-ajax-loaded')) {
                $(this).attr('data-ajax-loaded', true);

                let urlData = $(this).attr('data-url') + '?' + $(this).attr('data-params');
                let keyResult = $(this).attr('data-result-key');
                $(this).append(`<option class="x-item-loading" value="x-item-loading" disabled>` + $.fn.transEle.attr('data-loading') + '...' + `</option>`);
                $.fn.callAjax2({
                    url: urlData,
                    method: 'GET',
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty(keyResult)) {
                        let selectedVal = $(this).find(":selected").val();
                        let dataList = data?.[keyResult];
                        $.map(dataList, (item) => {
                            if (!selectedVal || (selectedVal && item.id !== selectedVal)) $(this).append(`<option value="${item.id}">${item.title}</option>`);
                        });
                        if (!selectedVal) {
                            $(this).find('option.x-item-loading').text("").attr('disable', 'disable').attr('selected', 'selected');
                        } else {
                            $(this).find('option.x-item-loading').attr('disable', 'disable').remove();
                        }
                    }
                });
            }
        });
        // -- Listen event select and select2-init-v1 for set previous selected data
        $(".select2").each(function () {
            $(this).initSelect2();
        });
    }

    formSubmitEle() {
        // button event submit form (last click)
        $(document).on('click', "[type='submit']", function (event) {
            DocumentControl.setBtnIDLastSubmit($(this).attr('id'));
        });
        // Submit support on listen from button
        $('.btn_support_submit').click(function (e) {
            let frm_id = $(this).attr('data-form-id');
            if (frm_id) {
                $('#' + frm_id).submit();
            }
        });
        // submit form from Page Actions
        //      - push status input to form when form create
        //      - update value of input status when submit
        $('.btn-saving-form').each(function (event) {
            let defaultStatus = ["0", "1"];
            let frm_idx = $(this).attr('form');
            let status_system = $(this).attr('data-status-submit');

            let allowNextStep = !!(
                $(this).attr('type') === 'submit'
                && frm_idx && typeof frm_idx === 'string' && frm_idx.length > 0
                && status_system && typeof status_system === "string" && status_system.length === 1
                && defaultStatus.indexOf(status_system) !== -1
            );
            if (allowNextStep === true) {
                let frmEle = $('#' + frm_idx);
                if (frmEle.length > 0) {
                    // setup input status
                    let statusInputEle = $(
                        `
                            <input 
                                name="system_status" 
                                class="hidden" 
                                type="text" 
                                id="idx-system_status" 
                                value=""
                                ${frmEle.attr('data-method').toUpperCase() === 'PUT' ? "" : "required"} 
                            />
                        `
                    );

                    // append input status if not exist
                    if (frmEle.find('input[name="system_status"]').length === 0) frmEle.append(statusInputEle);
                    else statusInputEle = frmEle.find('input[name="system_status"]');

                    // on submit push status to form
                    $(frmEle).on('submit', function (event) {
                        let submitterEle = $(event.originalEvent.submitter);
                        if (submitterEle && submitterEle.length > 0) {
                            let systemStatus = submitterEle.attr('data-status-submit');
                            let statusCode = statusInputEle.val();
                            if (statusCode === "" || statusCode === null || statusCode === undefined || statusCode === '0' || statusCode === 0) {
                                statusInputEle.val(Number.parseInt(systemStatus));
                            } else if (
                                (statusCode === '0' || statusCode === 0)
                                && (systemStatus === '1' || systemStatus === 1)
                            ) {
                                event.preventDefault();
                                return false;
                            }
                        } else {
                            // get submitter is undefined! => deny next step!
                            event.preventDefault();
                            return false;
                        }
                    });
                }
            }
        })
    }

    formInputClickOpenEdit() {
        DocumentControl.formDetailToUpdateAction();
    }

    nttDrawer() {
        // Active drawer
        $('.ntt-drawer-toggle-link').each(function () {
            if ($(this).attr('data-drawer-active') === "true") {
                $(this).trigger('click');
            }
        });
        // -- Active drawer
    }

    actionWFInHeader() {
        $('.btn-action-wf').click(function (event) {
            event.preventDefault();
            return WFRTControl.callActionWF($(this))
        });
        // Edit in Zone at DocDetail Page
        $('#btn-active-edit-zone-wf').click(function (event) {
            event.preventDefault();
            $(this).addClass('hidden');
            WFRTControl.activeZoneInDoc();
        })
        // -- Edit in Zone at DocDetail Page
    }

    log() {
        // Action support Workflow in Doc Detail
        $(document).on('click', '.btn-log-act-more', function (event) {
            event.preventDefault();
            $(this).closest('p').next('.log-act-data-change').toggleClass('hidden');
        })
        $('#btnLogShow').click(function (event) {
            event.preventDefault();
            new LogController().getDataLogAndActivities();
        });
        // -- Action support Workflow in Doc Detail
    }

    maskMoney() {
        $(document).on('focus', 'input.mask-money', function () {
            return MaskMoney2.focusInputMoney($(this));
        });
        $(document).on('blur', 'input.mask-money', function () {
            return MaskMoney2.blurInputMoney($(this));
        });
        $(document).on('input', 'input.mask-money', function () {
            return MaskMoney2.realtimeInputMoney($(this));
        });
        $.fn.initMaskMoney2();
    }

    ticket() {
        $('#ticket-hash-tag').select2({
            tags: true,
            tokenSeparators: [',', ' ']
        });
        $('#modalRaiseTicket').on('shown.bs.modal', function () {
            $('#ticket-email').val($('#email-request-owner').text());
            $('#ticket-email-auto').val($('#email-request-owner').text());
            $('#ticket-location-raise').val(window.location);
            $('#ticket-location-raise-auto').val(window.location);
        });

        $("#ticket-attachments").change(function () {
            let previewContainer = $("#ticket-attachment-preview");
            previewContainer.empty();

            if (this.files) {
                let filesAmount = this.files.length;
                for (let i = 0; i < filesAmount; i++) {
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        let imgElement = $("<img>");
                        imgElement.attr("src", event.target.result);
                        imgElement.css({
                            "max-width": "100px",
                            "max-height": "100px"
                        });
                        previewContainer.append(imgElement);
                    };
                    reader.readAsDataURL(this.files[i]);
                }
            }
        });

        let ticketFrm = $('#frm-send-a-ticket');
        ticketFrm.submit(function (event) {
            event.preventDefault();

            let urlData = $(this).attr('data-url');
            let methodData = $(this).attr('data-method');

            let formData = new FormData(this);
            formData.append("attachments", document.getElementById('ticket-attachments').files);

            WindowControl.showLoading();
            $.ajax({
                url: urlData, // point to server-side URL
                dataType: 'json', // what to expect back from server
                cache: false,
                contentType: false,
                processData: false, //data: {'data': form_data, 'csrfmiddlewaretoken': csrf_token},
                data: formData,
                type: methodData,
                success: function (resp) { // display success response
                    let data = $.fn.switcherResp(resp)
                    ticketFrm.find('input').attr('readonly', 'readonly');
                    ticketFrm.find('textarea').attr('readonly', 'readonly');
                    $('#staticTicketResp').val(data?.ticket?.code).closest('.form-group').removeClass('hidden');
                    $.fn.notifyB({
                        'description': $.fn.transEle.attr('data-success')
                    }, 'success')
                    WindowControl.hideLoading();
                },
                error: function (response) {
                    $.fn.notifyB({
                        'description': 'Try again!'
                    }, 'failure');
                    WindowControl.hideLoading();
                }
            });
        });
    }

    dataTable() {
        $(document).find('table').each((idx, tbl) => {
            if (!$(tbl).attr('load-data-hide-spinner')) {
                $(tbl).on('preXhr.dt', (e, settings, data) => {
                    // show loading full page
                    // WindowControl.showLoading();

                    // show loading tbody table
                    WindowControl.showLoadingWaitResponse($(tbl).find('tbody'));
                    // $x.fn.showLoadingPage();
                });
                $(tbl).on('draw.dt', () => {
                    // hide loading full page
                    // WindowControl.hideLoading();

                    // hide loading tbody table
                    WindowControl.hideLoadingWaitResponse($(tbl).find('tbody'));
                    // $x.fn.hideLoadingPage();
                });
            }
        });
    }

    navAndMenu() {
        $('.hk-navbar-togglable').click(function (event) {
            $(this).find('.icon').children().toggleClass('d-none');
        });

        DocumentControl.change_space();

        DocumentControl.menu_handler();
    }

    activeFileUpload() {
        $(document).on('click', '.show-raise-ticket', function () {
            Swal.close();
            let idBtnRaiseTicket = 'btnRaiseTicketInSWALFire';
            let eleBtnRaiseTicket = $('#' + idBtnRaiseTicket);
            if (eleBtnRaiseTicket.length > 0) {
                eleBtnRaiseTicket.click();
            } else {
                let btn = $(`<button data-bs-toggle="modal" data-bs-target="#modalRaiseTicket" id="${idBtnRaiseTicket}"></button>`);
                DocumentControl.getElePageContent().append(btn);
                btn.click();
            }
        });

        $(document).on('click', '.btn-file-upload', function (event) {
            let idInputText = $(this).attr(FileUtils.keyInputTextID);
            let idInputFile = $(this).attr(FileUtils.keyInputFileID);

            if (idInputFile && idInputFile) {
                let eleInputText = $(idInputText);
                let eleInputFile = $(idInputFile);

                if (eleInputText.length > 0 && eleInputFile.length > 0) return eleInputFile.click();

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'File upload went wrong!',
                    footer: '<a href="#" class="show-raise-ticket">Raise a ticket?</a>'
                })
                if ($.fn.isDebug() === true) throw Error('Upload file must be required setup attribute');
            }

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'File upload went wrong!',
                footer: '<a href="#" class="show-raise-ticket">Raise a ticket?</a>'
            })
            if ($.fn.isDebug() === true) throw Error('Upload file must be required setup attribute');
        });

        $(document).on('change', `.${FileUtils.clsNameInputFile}`, function (event) {
            let btnMain = $(this).siblings('button.' + FileUtils.clsButtonMain);
            if (btnMain.length > 0) {
                WindowControl.showLoadingButton($(btnMain));
                let file = event.target.files[0];
                if (FileUtils.checkMaxFileSize(file.size) === true && FileUtils.checkTypeAccept(file, $(this).attr('accept')) === true) {
                    let query = `[${FileUtils.keyInputFileID}="#${$(this).attr('id')}"]`;
                    let mainEle = $(query);
                    if (mainEle.length > 0) {
                        new FileUtils(mainEle).callUploadFile(file, btnMain);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Not found main element include file went wrong!',
                            footer: '<a href="#" class="show-raise-ticket">Raise a ticket?</a>'
                        });
                        if ($.fn.isDebug() === true) throw Error('Not found main element include file went wrong!');
                        WindowControl.hideLoadingButton($(btnMain));
                    }
                } else {
                    WindowControl.hideLoadingButton($(btnMain));
                }
            }
        });

        FileUtils.init();
    }

    avatarUpload() {
        $('#btnUploadMyAvatar').click(function () {
            Swal.fire({
                html: `
                    <h4>${$.fn.transEle.attr('data-choose-avatar-image')}</h4>
                    <small class="text-warning">${$.fn.transEle.attr('data-allow-file-properties').format_by_idx('*.jpg *.jpeg *.png *.gif')}</small>
                `,
                input: 'file',
                inputAttributes: {
                    autocapitalize: 'off',
                    name: 'file',
                },
                showCancelButton: true,
                cancelButtonText: $.fn.transEle.attr('data-cancel'),
                confirmButtonText: $.fn.transEle.attr('data-upload'),
                showLoaderOnConfirm: true,
                preConfirm: (file) => {
                    let formData = new FormData();
                    formData.append('file', file);
                    return $.fn.callAjax2({
                        url: globeUrlAvatarUpload,
                        method: 'POST',
                        data: formData,
                        contentType: 'multipart/form-data',
                        isNotify: false,
                    }).then(
                        (resp) => {
                            $.fn.switcherResp(resp);
                            return true;
                        },
                        (errs) => {
                            return false;
                        }
                    )
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: $.fn.transEle.attr('data-success'),
                        timer: 2000,
                        timerProgressBar: true,
                    }).then(() => {
                        window.location.reload();
                    })
                }
            })
        });
    }

    static tabHashUrl__parent_active(currentEle) {
        $(currentEle).closest('.nav-tabs a[data-bs-toggle="tab"]').each(function () {
            if ($(this).length > 0) {
                let drawerEle = $(this).closest('.ntt-drawer');
                if (drawerEle.length > 0) {
                    $('.ntt-drawer-toggle-link[data-drawer-target="#' + drawerEle.attr('id') + '"]').each(function () {
                        $(this).trigger('click');
                    });
                }
                $(this).tab('show');
                ListeningEventController.tabHashUrl__parent_active($(this).parent());
            }
        })
    }

    tabHashUrl() {
        $('.nav-tabs a[data-bs-toggle="tab"]').filter(function () {
            return this.hash === location.hash;
        }).each(function () {
            if ($(this).length > 0) {
                let drawerEle = $(this).closest('.ntt-drawer');
                if (drawerEle.length > 0) {
                    $('.ntt-drawer-toggle-link[data-drawer-target="#' + drawerEle.attr('id') + '"]').each(function () {
                        $(this).trigger('click');
                    });
                }
                $(this).tab('show');
                ListeningEventController.tabHashUrl__parent_active($(this).parent());
            }
        });

        $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            if ($(this).data('not-push-tab') === null || $(this).data('not-push-tab') === undefined) {
                window.history.pushState(null, null, $(e.target).attr("href"));
            }
        });
    }

    setValidatorDefaults() {
        $.validator.setDefaults({
            focusInvalid: true,
            validClass: "is-valid",
            errorClass: "is-invalid",
            errorElement: "small",
            errorPlacement: function (error, element) {
                element.closest('.form-group').append(error);
                // error.insertAfter(element);
                error.css({
                    'color': "red",
                })
            }
        });
    }

    dropdownInAccordion() {
        $('body').on('show.bs.dropdown', '.info-btn-more', function () {
            // add class for accordion show dropdown
            let accorItemEle = $(this).closest('.accordion-item');
            if (accorItemEle.length > 0) {
                accorItemEle.addClass('overflow-unset');
            }
            // check ID to link detail - Yes: show link | No: hide link
            let linkEle = $(this).parent().find('.link-detail-more');
            if (linkEle.length > 0) $(this).attr('data-id') ? linkEle.removeClass('hidden') : linkEle.addClass('hidden');
        }).on('hidden.bs.dropdown', '.info-btn-more', function () {
            // rollback to original for accordion
            let accorItemEle = $(this).closest('.accordion-item');
            if (accorItemEle.length > 0 && accorItemEle.find('.info-btn-more.show').length === 0) {
                accorItemEle.removeClass('overflow-unset');
            }
        })
    }

    static listenImageLoad(imgEle = null, add_margin=false){
        function resolve_title_tooltip(_ele){
            let parentTxt = '';
            if ($(_ele).parent().attr('data-toggle') === 'tooltip' || $(_ele).parent().attr('data-bs-toggle') === 'tooltip') {
                parentTxt = $(_ele).parent().attr('title');
            }
            return `${parentTxt ? parentTxt + "." : ""} ${globeFileNotFoundAlt}`
        }

        (
            imgEle ? imgEle : $('img')
        ).each(function (){
            if ($(this)[0].complete === true && $(this)[0].naturalWidth === 0 && $(this)[0].naturalHeight === 0) {
                $(this).attr('data-old-src', $(this).attr('src'));
                $(this).attr('src', globeFileNotFoundImg);
                $(this).attr('data-toggle', 'tooltip');
                $(this).attr('title', resolve_title_tooltip($(this)));
                $(this).tooltip();
            }

            $(this).on('error', function() {
                $(this).attr('data-old-src', $(this).attr('src'));
                $(this).attr('data-toggle', 'tooltip');
                $(this).attr('title', resolve_title_tooltip($(this)));
                $(this).attr('src', globeFileNotFoundImg);
            });
        })
    }

    // main
    active() {
        this.switchCompany();
        this.selectELe();
        this.formSubmitEle();
        this.formInputClickOpenEdit();
        this.nttDrawer();
        this.actionWFInHeader();
        this.log();
        this.maskMoney();
        this.ticket();
        this.dataTable();
        this.navAndMenu();
        this.activeFileUpload();
        this.avatarUpload();
        this.tabHashUrl();  // keep it run after nttDrawer and log
        this.setValidatorDefaults();
        this.dropdownInAccordion();
        ListeningEventController.listenImageLoad();
    }
}

class WFRTControl {
    // Handle every thing about Workflow Runtime

    static appendBodyCheckWFTask(method, reqBodyData, url) {
        // handle body data before send
        // if BtnIdLastSubmit = 'idxSaveInZoneWF' => is update data in zones
        // check WF ID, task ID, url exist PK
        // False: return data input
        // True: convert body data with Zone Accept
        let pk = $.fn.getPkDetail();
        let btnIDLastSubmit = DocumentControl.getBtnIDLastSubmit();
        if ((btnIDLastSubmit === 'idxSaveInZoneWF' || btnIDLastSubmit === 'idxSaveInZoneWFThenNext')
            && WFRTControl.getWFRuntimeID() && WFRTControl.getTaskWF() && pk && url.includes(pk) && method.toLowerCase() === 'put') {
            let taskID = WFRTControl.getTaskWF();
            let keyOk = WFRTControl.getZoneKeyData();
            let newData = {};
            for (let key in reqBodyData) {
                if (keyOk.includes(key)) {
                    newData[key] = reqBodyData[key];
                }
            }
            newData['task_id'] = taskID;
            reqBodyData = newData;
        }
        return reqBodyData;
    }

    // static callActionWF(ele$) {
    //     // -- wf call action
    //     let actionSelected = $(ele$).attr('data-value');
    //     let taskID = $('#idxGroupAction').attr('data-wf-task-id');
    //     let urlBase = globeTaskDetail;
    //     if (actionSelected !== undefined && taskID && urlBase) {
    //         let urlData = SetupFormSubmit.getUrlDetailWithID(urlBase, taskID);
    //         WindowControl.showLoading();
    //         return $.fn.callAjax2({
    //             'url': urlData,
    //             'method': 'PUT',
    //             'data': {'action': actionSelected},
    //         }).then((resp) => {
    //             let data = $.fn.switcherResp(resp);
    //             if (data?.['status'] === 200) {
    //                 $.fn.notifyB({
    //                     'description': $.fn.transEle.attr('data-action-wf') + ': ' + $.fn.transEle.attr('data-success'),
    //                 }, 'success');
    //                 if (!($(ele$).attr('data-success-reload') === 'false' || $(ele$).attr('data-success-reload') === false)) {
    //                     setTimeout(() => {
    //                         window.location.reload()
    //                     }, 1000)
    //                 }
    //             }
    //             setTimeout(() => {
    //                 WindowControl.hideLoading();
    //             }, 1000)
    //         }, (errs) => {
    //             setTimeout(() => {
    //                 WindowControl.hideLoading();
    //             }, 500)
    //         });
    //     }
    // }

    static callActionWF(ele$) {
        // -- wf call action
        let actionSelected = $(ele$).attr('data-value');
        let taskID = $('#idxGroupAction').attr('data-wf-task-id');
        let urlBase = globeTaskDetail;
        let dataSuccessReload = $(ele$).attr('data-success-reload');
        let dataSubmit = {'action': actionSelected};
        let nextNodeCollab = ele$.attr('data-next-node-collab');
        if (actionSelected !== undefined && taskID && urlBase) {
            if (actionSelected === '1') {  // check approve if next node is out form need select person before submit
                return WFRTControl.callActionApprove(urlBase, taskID, dataSubmit, dataSuccessReload, nextNodeCollab);
            } else if (actionSelected === '3') {  // check return need remark before submit
                return WFRTControl.callActionReturn(urlBase, taskID, dataSubmit, dataSuccessReload);
            } else if (actionSelected === '4') {  // check receive if next node is out form need select person before submit
                return WFRTControl.callActionApprove(urlBase, taskID, dataSubmit, dataSuccessReload, nextNodeCollab);
            } else {
                return WFRTControl.callAjaxActionWF(urlBase, taskID, dataSubmit, dataSuccessReload);
            }
        }
    }

    static callAjaxActionWF(urlBase, taskID, dataSubmit, dataSuccessReload) {
        let urlData = SetupFormSubmit.getUrlDetailWithID(urlBase, taskID);
        WindowControl.showLoading();
        return $.fn.callAjax2({
            'url': urlData,
            'method': 'PUT',
            'data': dataSubmit,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data?.['status'] === 200) {
                $.fn.notifyB({
                    'description': $.fn.transEle.attr('data-action-wf') + ': ' + $.fn.transEle.attr('data-success'),
                }, 'success');
                if (!(dataSuccessReload === 'false' || dataSuccessReload === false)) {
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            }
            setTimeout(() => {
                WindowControl.hideLoading();
            }, 1000)
        }, (errs) => {
            setTimeout(() => {
                WindowControl.hideLoading();
            }, 500)
        });
    }

    static callActionReturn(urlBase, taskID, dataSubmit, dataSuccessReload) {
        Swal.fire({
            input: "textarea",
            inputLabel: $.fn.transEle.attr('data-returned-content'),
            inputPlaceholder: $.fn.transEle.attr('data-type-content'),
            inputAttributes: {
                "aria-label": "Type your message here",
                "maxlength": "255" // Set the maximum length attribute
            },
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: $.fn.transEle.attr('data-confirm'),
            showCancelButton: true,
            cancelButtonText: $.fn.transEle.attr('data-cancel'),
            inputValidator: (value) => {
                if (value.length > 255) {
                    return 'Maximum length exceeded (255 characters)';
                }
            },
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer || result.value) {
                dataSubmit['remark'] = result.value;
                return WFRTControl.callAjaxActionWF(urlBase, taskID, dataSubmit, dataSuccessReload);
            }
        });
    }

    static callActionApprove(urlBase, taskID, dataSubmit, dataSuccessReload, nextNodeCollab) {
        if (nextNodeCollab) {
            dataSubmit['next_node_collab_id'] = nextNodeCollab;
            return WFRTControl.callAjaxActionWF(urlBase, taskID, dataSubmit, dataSuccessReload);
        }
        let collabOutForm = WFRTControl.getCollabOutFormData();
        if (collabOutForm && collabOutForm.length > 0) {
            Swal.fire({
                title: $.fn.transEle.attr('data-select-next-node-collab'),
                html: String(WFRTControl.setupHTMLCollabNextNode(collabOutForm)),
                allowOutsideClick: false,
                showConfirmButton: true,
                confirmButtonText: $.fn.transEle.attr('data-confirm'),
                showCancelButton: true,
                cancelButtonText: $.fn.transEle.attr('data-cancel'),
                didOpen: () => {
                    // Add event listener after the modal is shown
                    let checkboxes = document.querySelectorAll('.checkbox-next-node-collab');
                    checkboxes.forEach((checkbox) => {
                        checkbox.addEventListener('click', function () {
                            let checked = checkbox.checked;
                            for (let eleCheck of checkboxes) {
                                eleCheck.checked = false;
                            }
                            checkbox.checked = checked;
                        });
                    });
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer || result.value) {
                    let eleChecked = document.querySelector('.checkbox-next-node-collab:checked');
                    if (eleChecked) {
                        dataSubmit['next_node_collab_id'] = eleChecked.getAttribute('data-id');
                        return WFRTControl.callAjaxActionWF(urlBase, taskID, dataSubmit, dataSuccessReload);
                    } else {
                        return "You need to select one person!";
                    }
                }
            });
        } else {
            return WFRTControl.callAjaxActionWF(urlBase, taskID, dataSubmit, dataSuccessReload);
        }
    }

    static callWFSubmitForm(_form) {
        let btnIDLastSubmit = DocumentControl.getBtnIDLastSubmit();
        if (btnIDLastSubmit === 'idxSaveInZoneWF') {  // check if btn idxSaveInZoneWF then submit not select collab
            if (_form.dataForm.hasOwnProperty('system_status')) {
                _form.dataForm['system_status'] = 1;
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': _form.dataUrl,
                    'method': _form.dataMethod,
                    'data': _form.dataForm,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            window.location.replace(_form.dataUrlRedirect);
                        }, 1000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
            return true;
        }

        let collabOutForm = WFRTControl.getCollabOutFormData();
        if (collabOutForm && collabOutForm.length > 0) {
            Swal.fire({
                title: $.fn.transEle.attr('data-select-next-node-collab'),
                html: String(WFRTControl.setupHTMLCollabNextNode(collabOutForm)),
                allowOutsideClick: false,
                showConfirmButton: true,
                confirmButtonText: $.fn.transEle.attr('data-confirm'),
                showCancelButton: true,
                cancelButtonText: $.fn.transEle.attr('data-cancel'),
                didOpen: () => {
                    // Add event listener after the modal is shown
                    let checkboxes = document.querySelectorAll('.checkbox-next-node-collab');
                    checkboxes.forEach((checkbox) => {
                        checkbox.addEventListener('click', function () {
                            let checked = checkbox.checked;
                            for (let eleCheck of checkboxes) {
                                eleCheck.checked = false;
                            }
                            checkbox.checked = checked;
                        });
                    });
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer || result.value) {
                    let eleChecked = document.querySelector('.checkbox-next-node-collab:checked');
                    if (eleChecked) {
                        if (_form.dataMethod.toLowerCase() === 'post') {
                            _form.dataForm['next_node_collab_id'] = eleChecked.getAttribute('data-id');
                        }
                        if (_form.dataMethod.toLowerCase() === 'put') {
                            let btnWF = document.querySelector('.btn-action-wf');
                            if (btnWF) {
                                btnWF.setAttribute('data-next-node-collab', eleChecked.getAttribute('data-id'));
                            }
                            if (_form.dataForm.hasOwnProperty('system_status')) {
                                _form.dataForm['system_status'] = 1;
                            }
                        }
                    } else {
                        return "You need to select one person!";
                    }
                    WindowControl.showLoading();
                    $.fn.callAjax2(
                        {
                            'url': _form.dataUrl,
                            'method': _form.dataMethod,
                            'data': _form.dataForm,
                        }
                    ).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && (data['status'] === 201 || data['status'] === 200)) {
                                $.fn.notifyB({description: data.message}, 'success');
                                setTimeout(() => {
                                    window.location.replace(_form.dataUrlRedirect);
                                }, 1000);
                            }
                        }, (err) => {
                            setTimeout(() => {
                                WindowControl.hideLoading();
                            }, 1000)
                            $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                        }
                    )
                }
            });
        } else {
            if (_form.dataForm.hasOwnProperty('system_status')) {
                _form.dataForm['system_status'] = 1;
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': _form.dataUrl,
                    'method': _form.dataMethod,
                    'data': _form.dataForm,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            window.location.replace(_form.dataUrlRedirect);
                        }, 1000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        }
    }

    static setupHTMLCollabNextNode(collabOutForm) {
        let htmlCustom = ``;
        for (let collab of collabOutForm) {
            htmlCustom += `<div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center">
                                    <span class="mr-2">${collab?.['full_name']}</span>
                                    <span class="badge badge-soft-success">${collab?.['group']?.['title'] ? collab?.['group']?.['title'] : ''}</span>
                                </div>
                                <div class="form-check form-check-theme ms-3">
                                    <input type="checkbox" class="form-check-input checkbox-next-node-collab" data-id="${collab?.['id']}">
                                </div>
                            </div><hr class="bg-teal">`;
        }
        return htmlCustom;
    }

    static setWFRuntimeID(runtime_id) {
        if (runtime_id) {
            let btn = $('#btnLogShow');
            btn.removeClass('hidden');
            let url = SetupFormSubmit.getUrlDetailWithID(btn.attr('data-url-runtime-detail'), runtime_id);
            $.fn.callAjax2({
                'url': url,
                'method': 'GET',
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if ($.fn.hasOwnProperties(data, ['runtime_detail'])) {
                    // khi phiếu trong trạng thái đã tạo ( state > 1) thì button save không có hiệu lực
                    if (data['runtime_detail']?.['state'] >= 1) $('#idxRealAction .btn[type="submit"][form]').addClass('hidden')
                    if (data['runtime_detail']?.['state'] === 3) $('#idxDataRuntimeNotFound').removeClass('hidden');

                    let actionMySelf = data['runtime_detail']['action_myself'];
                    if (actionMySelf) {
                        let grouAction = $('#idxGroupAction');
                        let taskID = actionMySelf['id'];
                        if (taskID) {
                            WFRTControl.setTaskWF(taskID);

                            let actions = actionMySelf['actions'];
                            if (actions && Array.isArray(actions) && actions.length > 0) {
                                WFRTControl.setActionsList(actions);
                                let priorityAdded = false;
                                actions.map((item) => {
                                    let liFound = grouAction.find('li[data-value=' + item + ']')
                                    let iconFound = liFound.find('.icon-action-wf');
                                    if (priorityAdded === false) {
                                        if (item === 0 || item === 1 || item === 4) {
                                            priorityAdded = true;
                                            $('#btnMainAction').attr('data-value', item).attr('data-bs-original-title', liFound.find('.dropdown-item').text()).removeClass('hidden').find('.icon').html(iconFound.clone());
                                        }
                                    }
                                    liFound.removeClass('hidden');
                                })
                                if (!(priorityAdded === true && actions.length === 1)) {
                                    grouAction.closest('.dropdown').removeClass('hidden');
                                }
                            }
                        }

                        // zones handler
                        if (window.location.href.includes('/update/')) {
                            if (actionMySelf.hasOwnProperty('zones') && actionMySelf.hasOwnProperty('zones_hidden') && actionMySelf.hasOwnProperty('is_edit_all_zone')) {
                                WFRTControl.activeButtonOpenZone(actionMySelf['zones'], actionMySelf['zones_hidden'], actionMySelf['is_edit_all_zone']);
                            } else {
                                WFRTControl.activeDataZoneHiddenMySelf(data['runtime_detail']['zones_hidden_myself']);
                            }
                        }
                        if (window.location.href.includes('/detail/')) {
                            WFRTControl.activeDataZoneHiddenMySelf(data['runtime_detail']['zones_hidden_myself']);
                        }
                        // collab out form handler
                        WFRTControl.setCollabOutFormData(actionMySelf['collab_out_form']);
                    }
                }
            })
        }
        globeWFRuntimeID = runtime_id;
    }

    static setWFInitialData(app_code) {
        if (app_code) {
            let btn = $('#btnLogShow');
            btn.removeClass('hidden');
            let url = btn.attr('data-url-current-wf');
            $.fn.callAjax2({
                'url': url,
                'method': 'GET',
                'data': {'code': app_code},
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data?.['app_list'].length === 1) {  // check only 1 wf config for application
                    let WFconfig = data?.['app_list'][0];
                    if (WFconfig?.['mode'] !== 0) {  // check if wf mode is not unapply (0)
                        let workflow_current = WFconfig?.['workflow_currently'];
                        if (workflow_current) {
                            // zones handler
                            WFRTControl.activeButtonOpenZone(workflow_current['initial_zones'], workflow_current['initial_zones_hidden'], workflow_current['is_edit_all_zone']);
                            // collab out form handler
                            WFRTControl.setCollabOutFormData(workflow_current['collab_out_form']);
                        }
                    }
                }
            })
        }
    }

    static getWFRuntimeID() {
        return globeWFRuntimeID;
    }

    static getActionsList() {
        let itemEle = $('#idxWFActionsData');
        if (itemEle && itemEle.length > 0) return JSON.parse(itemEle.text());
        return [];
    }

    static setActionsList(actions) {
        $('html').append(`<script class="hidden" id="idxWFActionsData">${JSON.stringify(actions)}</script>`);
    }

    static getTaskWF() {
        return $('#idxGroupAction').attr('data-wf-task-id');
    }

    static setTaskWF(taskID) {
        $('#idxGroupAction').attr('data-wf-task-id', taskID);
    }

    static activeZoneInDoc() {
        let zonesData = WFRTControl.getZoneData();
        let zonesHiddenData = WFRTControl.getZoneHiddenData();
        let isEditAllZone = WFRTControl.getIsEditAllZone();
        if (isEditAllZone === 'true') {
            // add button save at zones
            // idFormID
            if (window.location.href.includes('/update/')) {
                let idFormID = globeFormMappedZone;
                if (idFormID) {
                    DocumentControl.getElePageAction().find('[form=' + idFormID + ']').addClass('hidden');
                    $('#idxSaveInZoneWF').attr('form', idFormID).removeClass('hidden');

                    let actionList = WFRTControl.getActionsList();
                    let actionBubble = null;
                    if (actionList.includes(1)) {
                        actionBubble = 1;
                    } else if (actionList.includes(4)) {
                        actionBubble = 4;
                    }
                    if (actionBubble) {
                        $('#idxSaveInZoneWFThenNext').attr('form', idFormID).attr('data-wf-action', actionBubble).attr('data-actions-list', JSON.stringify(WFRTControl.getActionsList())).removeClass('hidden');
                    }
                }
            }
            return true;
        }
        if (Array.isArray(zonesData) && Array.isArray(zonesHiddenData)) {
            let pageEle = DocumentControl.getElePageContent();
            let input_mapping_properties = WFRTControl.getInputMappingProperties();

            // disable + readonly field (chỉ disabled các field trong form)
            pageEle.find('.required').removeClass('required');
            pageEle.find('input, select, textarea, button, span[data-zone]').each(function (event) {

                let inputMapProperties = input_mapping_properties[$(this).attr('name')];
                if (!inputMapProperties)
                    inputMapProperties = input_mapping_properties[$(this).attr('data-zone')];
                if (inputMapProperties && typeof inputMapProperties === 'object') {
                    let arrTmpFind = [];
                    inputMapProperties['name'].map((nameFind) => {
                        arrTmpFind.push("[name=" + nameFind + "]");
                        // cho các field trong table or list
                        if ($(this).attr('data-zone')) arrTmpFind.push("[data-zone=" + nameFind + "]");
                    })
                    inputMapProperties['id'].map((idFind) => {
                        arrTmpFind.push("[id=" + idFind + "]");
                    })
                    inputMapProperties['id_border_zones'].map((item) => {
                        arrTmpFind.push('#' + item)
                    })
                    inputMapProperties['cls_border_zones'].map((item) => {
                        arrTmpFind.push('.' + item);
                    })
                    arrTmpFind.map((item) => {
                        pageEle.find(item).each(function (event) {
                            $(this).changePropertiesElementIsZone({
                                add_disable: true,
                                add_readonly: true,
                                remove_required: true,
                            });
                        });
                    })
                } else {
                    $(this).changePropertiesElementIsZone({
                        add_disable: true,
                        add_readonly: true,
                        remove_required: true,
                    });
                }

                // case: input is Files
                if ($(this).hasClass('dm-uploader-ids')){
                    let uploaderEle = $(this).closest('.dad-file-control-group').find('.dm-uploader');
                    uploaderEle.dmUploader('disable');
                }
            });

            // apply zones editable config
            if (zonesData.length > 0) {
                // $('#select-box-emp').prop('readonly', true);
                zonesData.map((item) => {
                    if (item.code) {
                        let inputMapProperties = input_mapping_properties[item.code];
                        if (inputMapProperties && typeof inputMapProperties === 'object') {
                            let arrTmpFind = {};
                            let arrTmpOfDataListFind = {}
                            let readonly_not_disable = inputMapProperties['readonly_not_disable'];
                            inputMapProperties['name'].map((nameFind) => {
                                arrTmpFind[nameFind] = "[name=" + nameFind + "]";
                                // cho trường hợp field là table or list
                                arrTmpOfDataListFind[nameFind] = "[data-zone=" + nameFind + "]"
                            })
                            inputMapProperties['id'].map((idFind) => {
                                arrTmpFind[idFind] = "[id=" + idFind + "]";
                            })
                            Object.keys(arrTmpFind).map((key) => {
                                let findText = arrTmpFind[key];
                                if (pageEle.find(findText).length <= 0 && arrTmpOfDataListFind.hasOwnProperty(key))
                                    findText = arrTmpOfDataListFind[key]
                                pageEle.find(findText).each(function () {
                                    if (readonly_not_disable.includes(key)) {
                                        $(this).changePropertiesElementIsZone({
                                            'add_require_label': true,
                                            'add_require': false,
                                            'remove_disable': true,
                                            'add_readonly': true,
                                            'add_border': true,
                                            'add_class_active': true,
                                        });

                                        // case: input is Files
                                        if ($(this).hasClass('dm-uploader-ids')){
                                            let uploaderEle = $(this).closest('.dad-file-control-group').find('.dm-uploader');
                                            uploaderEle.dmUploader('disable');
                                        }
                                    } else {
                                        $(this).changePropertiesElementIsZone({
                                            'add_require_label': true,
                                            'add_require': false,
                                            'remove_disable': true,
                                            'remove_readonly': true,
                                            'add_border': true,
                                            'add_class_active': true,
                                        });

                                        // case: input is Files
                                        if ($(this).hasClass('dm-uploader-ids')){
                                            let uploaderEle = $(this).closest('.dad-file-control-group').find('.dm-uploader');
                                            uploaderEle.dmUploader('enable');
                                        }
                                    }
                                })
                            });
                            inputMapProperties['id_border_zones'].map((item) => {
                                pageEle.find('#' + item).changePropertiesElementIsZone({
                                    add_border: true,
                                    add_readonly: true,
                                });
                            })
                            inputMapProperties['cls_border_zones'].map((item) => {
                                pageEle.find('.' + item).changePropertiesElementIsZone({
                                    add_border: true,
                                    add_readonly: true,
                                });
                            })
                        }
                    }
                })
            }

            // apply zones hidden config
            if (zonesHiddenData.length > 0) {
                // $('#select-box-emp').prop('readonly', true);
                zonesHiddenData.map((item) => {
                    if (item.code) {
                        let inputMapProperties = input_mapping_properties[item.code];
                        if (inputMapProperties && typeof inputMapProperties === 'object') {
                            let arrTmpFind = {};
                            let arrTmpOfDataListFind = {}
                            let readonly_not_disable = inputMapProperties['readonly_not_disable'];
                            inputMapProperties['name'].map((nameFind) => {
                                arrTmpFind[nameFind] = "[name=" + nameFind + "]";
                                // cho trường hợp field là table or list
                                arrTmpOfDataListFind[nameFind] = "[data-zone=" + nameFind + "]"
                            })
                            inputMapProperties['id'].map((idFind) => {
                                arrTmpFind[idFind] = "[id=" + idFind + "]";
                            })
                            Object.keys(arrTmpFind).map((key) => {
                                let findText = arrTmpFind[key];
                                if (pageEle.find(findText).length <= 0 && arrTmpOfDataListFind.hasOwnProperty(key))
                                    findText = arrTmpOfDataListFind[key]
                                pageEle.find(findText).each(function () {
                                    if (readonly_not_disable.includes(key)) {
                                        $(this).changePropertiesElementIsZone({
                                            'add_empty_value': true,
                                        });
                                    } else {
                                        $(this).changePropertiesElementIsZone({
                                            'add_empty_value': true,
                                        });
                                    }
                                })
                            });
                        }
                    }
                })
            }

            // add button save at zones
            // idFormID
            if (zonesData.length > 0) {  // check if user has zone edit then show button save at zones
            if (window.location.href.includes('/update/')) {
                let idFormID = globeFormMappedZone;
                if (idFormID) {
                    DocumentControl.getElePageAction().find('[form=' + idFormID + ']').addClass('hidden');
                    $('#idxSaveInZoneWF').attr('form', idFormID).removeClass('hidden');

                    let actionList = WFRTControl.getActionsList();
                    let actionBubble = null;
                    if (actionList.includes(1)) {
                        actionBubble = 1;
                    } else if (actionList.includes(4)) {
                        actionBubble = 4;
                    }
                    if (actionBubble) {
                        $('#idxSaveInZoneWFThenNext').attr('form', idFormID).attr('data-wf-action', actionBubble).attr('data-actions-list', JSON.stringify(WFRTControl.getActionsList())).removeClass('hidden');
                    }
                }
            }
            }
        }
    }

    static activeZoneHiddenMySelf() {
        let zonesHiddenData = WFRTControl.getZoneHiddenData();
        if (Array.isArray(zonesHiddenData)) {
            let pageEle = DocumentControl.getElePageContent();
            let input_mapping_properties = WFRTControl.getInputMappingProperties();

            // apply zones hidden config
            if (zonesHiddenData.length > 0) {
                // $('#select-box-emp').prop('readonly', true);
                zonesHiddenData.map((item) => {
                    if (item.code) {
                        let inputMapProperties = input_mapping_properties[item.code];
                        if (inputMapProperties && typeof inputMapProperties === 'object') {
                            let arrTmpFind = {};
                            let arrTmpOfDataListFind = {}
                            let readonly_not_disable = inputMapProperties['readonly_not_disable'];
                            inputMapProperties['name'].map((nameFind) => {
                                arrTmpFind[nameFind] = "[name=" + nameFind + "]";
                                // cho trường hợp field là table or list
                                arrTmpOfDataListFind[nameFind] = "[data-zone=" + nameFind + "]"
                            })
                            inputMapProperties['id'].map((idFind) => {
                                arrTmpFind[idFind] = "[id=" + idFind + "]";
                            })
                            Object.keys(arrTmpFind).map((key) => {
                                let findText = arrTmpFind[key];
                                if (pageEle.find(findText).length <= 0 && arrTmpOfDataListFind.hasOwnProperty(key))
                                    findText = arrTmpOfDataListFind[key]
                                pageEle.find(findText).each(function () {
                                    if (readonly_not_disable.includes(key)) {
                                        $(this).changePropertiesElementIsZone({
                                            'add_empty_value': true,
                                        });
                                    } else {
                                        $(this).changePropertiesElementIsZone({
                                            'add_empty_value': true,
                                        });
                                    }
                                })
                            });
                        }
                    }
                })
            }
        }
    }

    static activeButtonOpenZone(zonesData, zonesHiddenData, isEditAllZone) {
        if (window.location.href.includes('/update/') || window.location.href.includes('/create')) {
            WFRTControl.setZoneData(zonesData);
            WFRTControl.setZoneHiddenData(zonesHiddenData);
            WFRTControl.setIsEditAllZoneData(isEditAllZone);
            if (zonesData && Array.isArray(zonesData) && zonesHiddenData && Array.isArray(zonesHiddenData)) {
                $('#btn-active-edit-zone-wf').removeClass('hidden');
                $('#btn-active-edit-zone-wf').click();
            }
        }
    }

    static activeDataZoneHiddenMySelf(zonesHiddenData) {
        if (window.location.href.includes('/detail/') || window.location.href.includes('/update/')) {
            WFRTControl.setZoneHiddenData(zonesHiddenData);
            WFRTControl.activeZoneHiddenMySelf();
        }
    }

    static getZoneData() {
        let itemEle = $('#idxZonesData');
        if (itemEle) {
            return JSON.parse(itemEle.text());
        }
        return [];
    }

    static getZoneHiddenData() {
        let itemEle = $('#idxZonesHiddenData');
        if (itemEle && itemEle.length > 0) {
            return JSON.parse(itemEle.text());
        }
        return [];
    }

    static getIsEditAllZone() {
        let itemEle = $('#idxIsEditAllZone');
        if (itemEle && itemEle.length > 0) {
            return itemEle.text();
        }
        return 'true';
    }

    static getCollabOutFormData() {
        let itemEle = $('#idxCollabOutFormData');
        if (itemEle && itemEle.length > 0) {
            return JSON.parse(itemEle.text());
        }
        return [];
    }

    static getZoneKeyData() {
        let itemEle = $('#idxZonesKeyData');
        if (itemEle) {
            return JSON.parse(itemEle.text());
        }
        return [];
    }

    static getZoneHiddenKeyData() {
        let itemEle = $('#idxZonesHiddenKeyData');
        if (itemEle && itemEle.length > 0) {
            return JSON.parse(itemEle.text());
        }
        return [];
    }

    static setZoneData(zonesData) {
        let body_fields = [];
        if (zonesData && Array.isArray(zonesData)) {
            zonesData.map((item) => {
                body_fields.push(item.code);
            });
        }
        $('html').append(`<script class="hidden" id="idxZonesData">${JSON.stringify(zonesData)}</script>` + `<script class="hidden" id="idxZonesKeyData">${JSON.stringify(body_fields)}</script>`);
    }

    static setZoneHiddenData(zonesHiddenData) {
        let body_fields = [];
        if (zonesHiddenData && Array.isArray(zonesHiddenData)) {
            zonesHiddenData.map((item) => {
                body_fields.push(item.code);
            });
            $('html').append(`<script class="hidden" id="idxZonesHiddenData">${JSON.stringify(zonesHiddenData)}</script>` + `<script class="hidden" id="idxZonesHiddenKeyData">${JSON.stringify(body_fields)}</script>`);
        }
    }

    static setIsEditAllZoneData(isEditAllZone) {
        $('html').append(`<script class="hidden" id="idxIsEditAllZone">${isEditAllZone}</script>`);
    }

    static setCollabOutFormData(collabOutFormData) {
        if (collabOutFormData && Array.isArray(collabOutFormData)) {
            $('html').append(`<script class="hidden" id="idxCollabOutFormData">${JSON.stringify(collabOutFormData)}</script>`);
        }
    }

    static getInputMappingProperties() {
        let input_mapping_properties = $('#input_mapping_properties').text();
        if (input_mapping_properties) {
            return JSON.parse(input_mapping_properties);
        }
        return {}
    }

    static compareStatusShowPageAction(resultDetail) {
        switch (resultDetail?.['system_status']) {
            case 1:
                break
            case 2:
                break
            case 3:
                DocumentControl.getElePageAction().find('[type="submit"]').each(function () {
                    $(this).addClass("hidden")
                });
                break
            case 4:
                DocumentControl.getElePageAction().find('[type="submit"]').each(function () {
                    $(this).addClass("hidden")
                });
                break
            default:
                break
        }
        $('#idxRealAction').removeClass('hidden');
    }

    static changePropertiesElementIsZone(ele$, opts) {
        let config = {
            'add_require_label': false,
            'add_require': false,
            'remove_required': false,
            'remove_disable': false,
            'add_disable': false,
            'remove_readonly': false,
            'add_readonly': false,
            'add_border': false,
            'add_class_active': false,  // flag to know element is active zone
            'add_empty_value': false, ...opts
        }
        if (config.add_require_label === true) {
            $(ele$).closest('.form-group').find('.form-label').addClass('required');
        }
        if (config.add_disable === true) {
            if (!$(ele$).hasClass('zone-active')) {
                $(ele$).attr('disabled', 'disabled');
                if ($(ele$).is('div')) {
                    $(ele$).css('cursor', 'no-drop')
                    $(ele$).addClass('bg-light');
                }
            }
        }
        if (config.remove_required === true) {
            $(ele$).removeAttr('required');
        }
        if (config.remove_disable === true) {
            $(ele$).removeAttr('disabled');
        }
        if (config.add_readonly === true) {
            if (!$(ele$).hasClass('zone-active')) {
                if ($(ele$).is('div')) {
                    $(ele$).addClass('bg-light');
                } else {
                    $(ele$).attr('readonly', 'readonly');
                }
            }
        }
        if (config.remove_readonly === true) {
            $(ele$).removeAttr('readonly');
        }
        if (config.add_require === true) {
            $(ele$).prop('required', true);
        }
        if (config.add_border === true) {
            $(ele$).addClass('border-warning');
        }

        if (config.add_class_active === true) {  // flag to know which fields are active by WF zones
            $(ele$).addClass('zone-active');
        }
        if (config.add_empty_value === true) {  // set value to empty
            if (!$(ele$).hasClass('zone-active')) {
                if ($(ele$).is('input')) {  // if input
                    $(ele$).val('');
                    if ($(ele$).hasClass('mask-money')) {  // if input mask-money
                        $(ele$).attr('value', '');
                    }
                    // add class hidden-zone (for use css in my-style.css)
                    $(ele$).attr('placeholder', $.fn.transEle.attr('data-hidden-by-workflow-config'));
                    $(ele$).addClass('hidden-zone');
                }
                if ($(ele$).is("select") && $(ele$).hasClass("select2-hidden-accessible")) {  // if select2
                    $(ele$).html(`<option value="" selected></option>`);
                    // add class hidden-zone (for use css in my-style.css)
                    $(ele$).initSelect2({placeholder: $.fn.transEle.attr('data-hidden-by-workflow-config'),});
                    $(ele$).next('.select2-container').addClass('hidden-zone');
                }
                if ($(ele$).is('textarea')) {  // if textarea
                    $(ele$).val('');
                    // add class hidden-zone (for use css in my-style.css)
                    $(ele$).attr('placeholder', $.fn.transEle.attr('data-hidden-by-workflow-config'));
                    $(ele$).addClass('hidden-zone');
                }
                if ($(ele$).is('span')) {  // if span (only span that have attr data-zone)
                    if ($(ele$).attr('data-zone')) {
                        if ($(ele$).hasClass('mask-money')) {
                            $(ele$).attr('data-init-money', '').html(`${$.fn.transEle.attr('data-hidden-by-workflow-config')}`);
                        } else {
                            $(ele$).html(`${$.fn.transEle.attr('data-hidden-by-workflow-config')}`);
                        }
                    }
                }
                if ($(ele$).is('button')) {  // if button (only button that have attr data-zone)
                    if ($(ele$).attr('data-zone')) {
                        $(ele$).attr('hidden', 'true');
                    }
                }
            }
        }

        // active border for select2
        if ($(ele$).is("select") && $(ele$).hasClass("select2-hidden-accessible"))
            WFRTControl.changePropertiesElementIsZone($(ele$).next('.select2-container').find('.select2-selection'), config)
    }

}

class UtilControl {
    static parseJson(data, defaultReturn = {}) {
        try {
            return JSON.parse(data);
        } catch (error) {
            return defaultReturn;
        }
    }

    static dumpJson(data, defaultReturn = '{}') {
        try {
            return JSON.stringify(data);
        } catch (error) {
            return defaultReturn;
        }
    }

    static generateRandomString(length = 32) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static generateUUID4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static checkUUID4(data) {
        if (
            typeof data === "string" && (
                data.length === 36 // string type
                || data.length === 36 - 4 // hex type
            )
        ) {
            const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
            return regexExp.test(data);
        }
        return false;
    }

    static arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        return a.every((value, index) => value === b[index]);
    }

    static arrayIncludesAll(a, b) {
        return b.every(value => a.includes(value));
    }

    static initElementInitSelect(opts, html_or_$ = 'html') {
        let configData = {
            'dummy-data': {},
            'key-display': 'title',
            'key-primary': 'id',
            'url': null,
            'method': 'GET',
            'params': {},
            'result-key': null,
            'class-name': '', ...opts
        }
        let selData = $('<select>');
        selData.addClass('form-select select2-init-v1');
        selData.addClass(configData['class-name']);
        selData.attr('data-init-loaded', null);
        selData.attr('data-ajax-loaded', null);

        selData.attr('data-dummy', JSON.stringify(configData['dummy-data']));
        selData.attr('data-key-display', configData['key-display']);
        selData.attr('data-key-primary', configData['key-primary']);
        selData.attr('data-url', configData['url']);
        selData.attr('data-method', configData['method']);
        selData.attr('data-params', $.param(configData['params']));
        selData.attr('data-result-key', configData['result-key']);
        switch (html_or_$) {
            case "$":
                return selData;
            case "html":
                return selData.prop('outerHTML');
            default:
                if ($.fn.isDebug() === true) throw Error('Init Select must be return type choice in: [html, object $]')
        }
    }

    static sumArray(array) {
        return array.reduce(function (acc, currentValue) {
            return acc + currentValue;
        }, 0);
    }

    static getValueOrEmpty(objData, key, defaultData = '') {
        if (typeof objData === 'object' && typeof key === 'string') {
            if (objData.hasOwnProperty(key) && objData[key]) {
                return objData[key];
            }
        }
        return defaultData;
    }

    static parseDateTime(dateStrUTC, microSecondLength = 0) {
        let dateNew = new Date(Date.parse(dateStrUTC));
        return "{day}/{month}/{year} {hour}:{minute}:{second}".format_by_key({
            day: dateNew.getDate().toString().padStart(2, '0'),
            month: (dateNew.getMonth() + 1).toString().padStart(2, '0'),
            year: dateNew.getFullYear().toString(),
            hour: dateNew.getHours().toString().padStart(2, '0'),
            minute: dateNew.getMinutes().toString().padStart(2, '0'),
            second: dateNew.getSeconds().toString().padStart(2, '0'),
        }) + (microSecondLength > 0 ? ("." + dateNew.getMilliseconds().toString().padStart(3, '0')) : "")
    }

    static parseDate(dateStrUTC) {
        let dateNew = new Date(Date.parse(dateStrUTC));
        return "{day}/{month}/{year}".format_by_key({
            day: dateNew.getDate().toString().padStart(2, '0'),
            month: (dateNew.getMonth() + 1).toString().padStart(2, '0'),
            year: dateNew.getFullYear().toString(),
        })
    }

    static popKey(data, key, defaultData = null, compareTypeWithDefault = false) {
        // Has key in "data" && (
        //      !compareTypeWithDefault || (compareTypeWithDefault === true && typeof data[key] === typeof defaultData)
        // )
        // otherwise return defaultData
        if (typeof data === 'object') {
            if (data.hasOwnProperty(key)) {
                let tmp = data[key];
                delete data[key];
                if (compareTypeWithDefault === true) {
                    if (typeof tmp === typeof defaultData) return tmp;
                } else return tmp;
            }
        }
        return defaultData;
    }

    static getKey(data, key, defaultData = null, compareTypeWithDefault = false) {
        if (typeof data === 'object') {
            if (data.hasOwnProperty(key)) {
                let tmp = data[key];
                if (compareTypeWithDefault === true) {
                    if (typeof tmp === typeof defaultData) return tmp;
                } else return tmp;
            }
        }
        return defaultData;
    }

    static cleanDataNotify(data) {
        if (data && typeof data === 'object' && data.hasOwnProperty('errors')) {
            data = data.errors;
            switch (typeof data) {
                case 'object':
                    ['status'].map((key) => {
                        delete data[key];
                    });
                    break;
                default:
                    data = {'': data.toString()}
            }
        } else {
            ['status'].map((key) => {
                delete data[key];
            });
        }
        return data;
    }

    static notifyErrors(errs) {
        if (errs) {
            if (typeof errs === 'object') {
                let errors_converted = UtilControl.cleanDataNotify(errs);
                Object.keys(errors_converted).map((key) => {
                    let notify_data = {
                        'title': key,
                        'description': errors_converted[key]
                    };
                    jQuery.fn.notifyB(notify_data, 'failure');
                });
            } else if (typeof errs === 'string') {
                jQuery.fn.notifyB({
                    'description': errs
                }, 'failure');
            } else if (Array.isArray(errs)) {
                errs.map((item) => {
                    jQuery.fn.notifyB({
                        'description': item
                    }, 'failure');
                })
            }
        }
    }

    static removeEmptyValuesFromObj(object) {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                let value = object[key];
                if (value === null || value === undefined || value === '') {
                    delete object[key];
                }
            }
        }
        return object;
    }

    static getRandomArbitrary(min, max) {
        min = Math.ceil(min);
        max = Math.ceil(max);
        return Math.ceil(Math.random() * (max - min) + min);

    }

    static getRandomInArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static keepExistInOther(arr_main, arr_check_remove) {
        // arr_main:    ["1", "2", "3"]
        // arr_check:   ["1", "3", "4"]
        // => ["1", "3"]
        if (Array.isArray(arr_main) && Array.isArray(arr_check_remove)) {
            return arr_main.filter(
                (item) => {
                    return arr_check_remove.indexOf(item) !== -1;
                }
            )
        }
        return [];
    }

    static removeExistInOther(arr_main, arr_check_remove) {
        // arr_main:    ["1", "2", "3"]
        // arr_check:   ["1", "3", "4"]
        // => ["2"]
        if (Array.isArray(arr_main) && Array.isArray(arr_check_remove)) {
            return arr_main.filter(
                (item) => {
                    return arr_check_remove.indexOf(item) === -1;
                }
            )
        }
        return [];
    }

    static hasOwnProperties(objData, keys) {
        if (objData && typeof objData === 'object' && Array.isArray(keys)) {
            for (let i = 0; i < keys.length; i++) {
                if (!objData.hasOwnProperty(keys[i])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    static displayRelativeTime(dataStr, opts = {}) {
        if (dataStr) {
            let format = opts?.['format'] || "YYYY-MM-DD HH:mm:ss";
            let outputFormat = opts?.['outputFormat'] || "DD-MM-YYYY HH:mm:ss";
            let callback = opts?.['callback'] || function (data) {
                return `<p>${data.relate}</p><small>${data.output}</small>`;
            }

            let relateTimeStr = moment(dataStr, format).fromNow();
            let appendStrData = moment(dataStr, format).format(outputFormat);
            return callback({
                'relate': relateTimeStr,
                'output': appendStrData,
            });
        }
        return '_';
    }

    static checkNumber(dataStr) {
        return !isNaN(Number(dataStr))
    }

    static convertToSlug(Text) {
        return Text.toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    }
}

class DTBControl {
    // Handle every thing about DataTable
    static getRowData(ele$) {
        // element call from in row of DataTable
        let row = $(ele$).closest('tr');
        return $($(ele$).closest('table')).DataTable().row(row).data();
    }

    static deleteRow(ele$) {
        $(ele$).closest('table').DataTable().row($(ele$).parents('tr')).remove().draw();
    }

    static updateDataRow(clsThis, func, isDraw = false) {
        clsThis = $(clsThis).closest('tr');
        let dtb = $(clsThis).closest('table').DataTable();
        let rowIdx = dtb.row(clsThis).index();
        let rowData = $x.fn.getRowData($(clsThis));
        let newData = func(clsThis, rowIdx, rowData);
        let dtbAfter = dtb.row(rowIdx).data(newData);
        if (isDraw === true) dtbAfter.draw(false, true);
        return dtbAfter;
    }

    checkRowSelect(opts) {
        let $this = this
        if (opts?.['fullToolbar'] === true)
            // init on click when enable count select
            $('.check-select, .check-select-all', this.dtb$).on('change', function (e) {
                e.stopPropagation()
                if ($(this).hasClass('check-select-all')) {
                    // continue
                    let listData = $(this).closest('table').DataTable().rows({page: 'current'}).data().toArray()
                    $('.check-select', $this.dtb$).prop('checked', this.checked)
                    for (let item of listData) {
                        $this.setRowSelected = {
                            item: item,
                            idTable: $(this).closest('table').attr('id'),
                            checked: this.checked
                        }
                    }
                } else {
                    const rowData = $(this).closest('table').DataTable().row($(this).closest('tr')).data();
                    $this.setRowSelected = {
                        item: rowData,
                        idTable: $(this).closest('table').attr('id'),
                        checked: this.checked
                    }

                }
                // count and print to text noti in toolbar
                const allData = $this.getRowSelected
                $('.count_selected').html($.fn.transEle.attr('data-datatable-count-txt').replace(
                    '{0}',
                    Object.keys(allData[$(this).closest('table').attr('id')]).length
                ))
            });
    }

    reCheckSelect(sgs) {
        const ckAll = $('.check-select-all', $(sgs.oInstance))
        if (ckAll.length) ckAll.prop('checked', false)
        let rowSelect = this.getRowSelected
        rowSelect = rowSelect[sgs.sInstance] || {}
        let isFull = true
        if (Object.keys(rowSelect).length > 0) {
            for (let item of sgs?.aoData) {
                if (rowSelect[item?._aData?.id]) {
                    item._aData.checked = true
                    $('input', item.anCells[0]).attr('checked', true)
                } else {
                    isFull = false
                    item._aData.checked = false
                }
            }
        } else isFull = false
        if (isFull) ckAll.prop('checked', true)
    }

    static getTableSelected(tableID) {
        let dataList = $('#tbl-stored').text()
        if (dataList) dataList = JSON.parse(dataList)
        dataList = dataList[tableID] || {}
        return dataList
    }

    static prepareHTMLToolbar(divWrap, _settgs) {
        // show selected show count select is display
        $('.count_selected', divWrap).html(`<p>${
            $.fn.transEle.attr('data-datatable-count-txt').replace('{0}', '0')}</p>`)
        divWrap.find('.select2:not(:disabled)').initSelect2();
        // show column show/hide
        const $custom_tb = $('.custom_toolbar', divWrap).append(
            `<div class="dropdown ct_toolbar-columns">` +
            `<button data-bs-toggle="dropdown" class="btn btn-outline-light dropdown-toggle" type="button">` +
            `<i class="fa-solid fa-list"></i></button><div role="menu" class="dropdown-menu p-4"></div></div>`
        )
        let columnList = `<div class="form-check form-check-sm">` +
            `<input type="checkbox" class="form-check-input check_all" id="tb_columns-all" checked>` +
            `<label class="form-check-label" for="tb_columns-all">${$.fn.transEle.attr('data-all')}</label></div><hr class="mt-1 mb-1">`;
        for (let item of _settgs.aoColumns) {
            if (item?.data) {
                columnList += `<div class="form-check form-check-sm">` +
                    `<input type="checkbox" class="form-check-input" data-column="${item.idx}" id="tb_columns-${item.idx}" checked>` +
                    `<label class="form-check-label" for="customChecks1">${item.sTitle}</label></div>`
            }
        }
        $('.ct_toolbar-columns .dropdown-menu', divWrap).html(columnList)
    }

    set setRowSelected(rowData) {
        let temp = this.dataSelect
        if (!temp.hasOwnProperty(rowData.idTable))
            temp[rowData.idTable] = {}
        if (rowData.checked)
            temp[rowData.idTable][rowData.item.id] = rowData.item
        else
            delete temp[rowData.idTable][rowData.item.id]
        this.dataSelect = temp
        let storeElm = $(`<script id="tbl-stored" type="application/json">`)
        storeElm.text(JSON.stringify(temp))
        if ($(`body`).find('#tbl-stored').length === 0) {
            storeElm.insertAfter($.fn.transEle)
        } else $('#tbl-stored', 'body').text(JSON.stringify(temp))
    }

    get getRowSelected() {
        return this.dataSelect
    }

    static __fillDefaultSelect2Filter(ele$) {
        if (!$(ele$).attr('data-maximumSelectionLength')) {
            $(ele$).attr('data-maximumSelectionLength', 5);
        }
        if (!$(ele$).attr('data-cache')) {
            $(ele$).attr('data-cache', 'true');
        }
        if (!$(ele$).attr('data-allowClear')) {
            $(ele$).attr('data-allowClear', 'true');
        }
        return $(ele$);
    }

    static parseHeaderDropdownFilter(columns, settings, tbl) {
        let api = tbl.DataTable();
        let $thead = api.table().header();
        let hasColHeaderFilter = false;
        let rowColFilterEle = $(`<tr class="row-custom-filter"></tr>`);
        (columns || []).map(
            (item) => {
                let colFilter = item?.['colFilter'];
                if (colFilter) {
                    hasColHeaderFilter = true;

                    let attrTxt = '';
                    Object.keys(colFilter).map(
                        (key) => {
                            if (key !== 'keyParam' && key !== 'dataUrl' && key !== 'keyResp') {
                                attrTxt += ` data-${key}="${colFilter[key]}"`
                            }
                        }
                    )
                    $(`<th>
                         <select
                            class="select-custom-filter"
                            data-keyParam="${colFilter.keyParam}"
                            data-url="${colFilter.dataUrl}"
                            data-keyResp="${colFilter.keyResp}"
                            ${attrTxt}
                            multiple
                        ></select>
                    </th>`).appendTo(rowColFilterEle);
                } else {
                    $(`<th></th>`).appendTo(rowColFilterEle);
                }
            }
        )
        if (hasColHeaderFilter) {
            rowColFilterEle.appendTo($($thead));
        }
        setTimeout(
            () => {
                $($thead).find('select.select-custom-filter').each(function () {
                    DTBControl.__fillDefaultSelect2Filter($(this)).initSelect2();
                }).on('select2:close', function () {
                    api.table().ajax.reload();
                }).on('select2:clear', function () {
                    api.table().ajax.reload();
                }).on('select2:unselect', function () {
                    api.table().ajax.reload();
                });
            },
            0
        );
    }

    // static parseFilter(dtb) {
    //     let dtbInited = $(dtb).DataTable();
    //
    //     let rowCustomFilter = $(`div.row-custom-filter[data-dtb-id="#` + dtb.attr('id') + `"]`);
    //
    //     let dtbWrapper = $(dtb).closest('.dataTables_wrapper');
    //     let dtbFilter = $(dtbWrapper).find('.dataTables_filter');
    //     let dtbFilterInput = $(dtbFilter).find('input[type="search"]');
    //
    //     rowCustomFilter.each(function () {
    //         $(this).find('select').each(function () {
    //             DTBControl.__fillDefaultSelect2Filter($(this)).initSelect2();
    //         }).on('select2:close', function () {
    //             dtbInited.table().ajax.reload();
    //         }).on('select2:clear', function () {
    //             dtbInited.table().ajax.reload();
    //         }).on('select2:unselect', function () {
    //             dtbInited.table().ajax.reload();
    //         });
    //
    //         let customFilterEle = $(this).find('.custom-filter-dtb');
    //         if (dtbFilterInput && dtbFilterInput.length > 0 && customFilterEle && customFilterEle.length > 0) {
    //             // dtbFilter.addClass('hidden');
    //             $(this).find('.custom-filter-dtb').on('keyup', function () {
    //                 $(dtbFilterInput).val($(this).val()).trigger('keyup');
    //             });
    //         } else {
    //             customFilterEle.remove();
    //         }
    //     })
    // }

    static _summaryFilterToText(textFilterEle, manualFilterEle = null, textManual = []) {
        if (textFilterEle) {
            let textFilterSelected = [];

            if (manualFilterEle) {
                manualFilterEle.find('select.custom-filter-manual-dtb').each(function () {
                    let valSelected = $(this).val();
                    if (valSelected) {
                        if (Array.isArray(valSelected)) {
                            let textDisplay = [];
                            $(this).find('option:selected').each(function () {
                                textDisplay.push($(this).text());
                            })
                            if (textDisplay && textDisplay.length > 0) {
                                textFilterSelected.push(`<span data-select-id="${$(this).attr('id')}"  class="badge badge-light badge-outline mr-1 mb-1"><i class="fa-regular fa-circle-xmark remove-filter-child"></i> ${$(this).closest('.form-group').find('label small').text()} : ${textDisplay.join(", ")}</span>`)
                            }
                        } else {
                            let textDisplay = $(this).find('option:selected').text();
                            if (textDisplay) {
                                textFilterSelected.push(`<span data-select-id="${$(this).attr('id')}"  class="badge badge-light badge-outline mr-1 mb-1"><i class="fa-regular fa-circle-xmark remove-filter-child"></i> ${$(this).closest('.form-group').find('label small').text()} : ${textDisplay}</span>`)
                            }
                        }
                    }
                });
            } else if (textManual) {
                textManual.map(
                    (item) => {
                        if (item.text) {
                            textFilterSelected.push(`<span data-select-id="${item.idx}" class="badge badge-light badge-outline mr-1 mb-1"><i class="fa-regular fa-circle-xmark remove-filter-child"></i> ${item.placeholder} : ${item.text}</span>`);
                        }
                    }
                )
            }
            if (textFilterSelected.length <= 5) {
                textFilterEle.html(textFilterSelected.join(``))
            } else {
                textFilterEle.html(textFilterSelected.slice(1, 5).join("") + `<button class='btn btn-soft-light btn-sm show-more-filter-text'>...</button><script class="hidden">${JSON.stringify(textFilterSelected)}</script>`)
            }

            textFilterEle.on('click', '.show-more-filter-text', function () {
                Swal.fire({
                    html: textFilterSelected.join(""),
                })
            }).on('click', '.remove-filter-child', function () {
                let ele = $('#' + $(this).closest('span').attr('data-select-id'));
                if (ele.length > 0) {
                    ele.val("");
                    ele.trigger('change');
                    $(this).remove();
                }
            })
        }
    }

    static _parseCusTools(settings, wrapperEle) {
        let cusToolData = [];
        (settings.oInit.cusTool || []).map(
            (item) => {
                let idx = $x.fn.randomStr(32);
                let autoFillRequired = {};
                switch (item.code) {
                    case 'draft':
                        autoFillRequired['icon'] = `<i class="fa-regular fa-note-sticky"></i>`;
                        autoFillRequired['text'] = $.fn.transEle.attr('data-msg-draft');
                        break
                    case 'export':
                        autoFillRequired['icon'] = `<i class="fa-solid fa-file-export"></i>`;
                        autoFillRequired['text'] = $.fn.transEle.attr('data-msg-export-to-file');
                        break
                }

                let config = {
                    'idx': idx,
                    'code': null,
                    'icon': '',
                    'text': '',
                    'url': '#',
                    'className': '',
                    'eClick': null,
                    ...autoFillRequired,
                    ...item,
                }

                if (config.icon) {
                    if (config.icon.includes('class="')) {
                        config.icon = config.icon.replace('class="', 'class="dropdown-icon ');
                    } else if (config.icon.includes("class='")) {
                        config.icon = config.icon.replace("class='", "class='dropdown-icon ");
                    }
                }

                let ele = $(`<a class="dropdown-item ${config.className}" id="${idx}" href="${config.url}">${config.icon}<span>${config.text}</span></a>`);
                if (config.eClick) wrapperEle.on('click', '#' + idx, config.eClick);
                cusToolData.push(ele.prop('outerHTML'));
            }
        );
        return cusToolData;
    }

    static parseFilter2(dtb, settings, json) {
        let wrapperEle = dtb.closest('.dataTables_wrapper');
        let groupCustomEle = wrapperEle.find('.util-btn');
        let filterEle = wrapperEle.find('.dataTables_filter');

        // handle customize filter
        let btnFilterEle = wrapperEle.find('.btnAddFilter');
        let textFilterEle = wrapperEle.find('.textFilter');
        let manualFilterEle = wrapperEle.find('.manualFilter');
        let cusFilterArr = [];
        let initTextFilter = [];
        let cusFilter = settings.oInit?.['cusFilter'] || [];
        if (cusFilter && Array.isArray(cusFilter)) {
            cusFilter.map(
                (item) => {
                    let config = {
                        keyText: 'title',
                        keyId: 'id',
                        keyResp: null,
                        dataUrl: null,
                        keyParam: null,
                        placeholder: null,
                        data: [],   // [{'id': '', 'text': '', selected: false}]
                        ...item,
                    }
                    if (
                        (config.keyResp && config.dataUrl && config.keyParam && config.keyText && config.keyId) ||
                        (!config.dataUrl && config.data && Array.isArray(config.data) && config.data.length > 0)
                    ) {
                        let textSelected = '';
                        let attrHTML = ['data-method="GET"'];
                        Object.keys(config).map(
                            (key) => {
                                if (config[key]) {
                                    if (key === 'dataUrl') {
                                        attrHTML.push(`data-url="${config.dataUrl}"`);
                                    } else if (key === 'dataMethod') {
                                        attrHTML.push(`data-method="${config.dataMethod}"`);
                                    } else if (key === 'placeholder') {
                                        attrHTML.push(`data-placeholder="${config.placeholder}"`);
                                    } else if (key === 'data') {
                                        config['data'].map(
                                            (itemOnload) => {
                                                if (itemOnload?.['selected'] === true) {
                                                    let keyTextTmp = config?.['keyText'] || 'title';
                                                    textSelected = itemOnload?.[keyTextTmp] || '';
                                                }
                                            }
                                        )
                                    } else if (key === 'multiple') {
                                        attrHTML.push(`multiple`);
                                    } else if (key === 'allowClear') {
                                        attrHTML.push('data-allowClear="true"');
                                    } else {
                                        attrHTML.push(`data-${key}="${config[key]}"`);
                                    }
                                }
                            }
                        )

                        let fakeIdx = $x.fn.randomStr(32);
                        cusFilterArr.push(`
                            <div class="col-12 col-md-4 w-200p mb-1">
                                <div class="form-group">
                                    <label for="${fakeIdx}"><small>${config.placeholder}</small></label>
                                    <select 
                                        id="${fakeIdx}"
                                        class="custom-filter-manual-dtb form-select form-select-sm"
                                        ${attrHTML.join(" ")}
                                        data-onload='${JSON.stringify(config.data || [])}'
                                    ></select>
                                </div>
                            </div>
                        `);
                        initTextFilter.push({
                            'placeholder': config.placeholder,
                            'text': textSelected,
                            'idx': fakeIdx,
                        })
                    }
                }
            )
        }
        if (cusFilterArr && cusFilterArr.length > 0) {
            btnFilterEle.html(`
                <button 
                    class="btn btn-light btn-sm mr-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="${$.fn.transEle.attr('data-msg-open-close-filter')}"
                    type="button"
                >
                    <span>
                        <span class="icon dtb-icon-btn-filter"><i class="fa-solid fa-filter" style="color: #707070;"></i></span>
                        <span class="dtb-text-btn-filter">${$.fn.transEle.attr('data-msg-filter')}</span>
                    </span>
                </button>
            `);
            manualFilterEle.html(cusFilterArr.join(""));
            wrapperEle.on('click', '.btnAddFilter', function () {
                wrapperEle.find('.manualFilter').toggleClass('hidden');
            });
            DTBControl._summaryFilterToText(textFilterEle, null, initTextFilter);
        }

        // append filter search class form-control-sm
        filterEle.addClass('mr-1');
        filterEle.find('input[type="search"]').addClass('form-control w-200p');

        // handle sort
        let preKeyVisible = settings.aoHeader[0].map((item) => {
            return $(item.cell).text().trim();
        });
        let keyVisible = [];

        let keySort = [];
        settings.aoColumns.map(
            (colConfig, idx) => {
                let colSortSTitle = colConfig?.['sTitle'] || '';
                let colSortEnabled = colConfig?.['orderable'] || false;
                let colSortMKey = colConfig?.['mData'] || '';
                if (colSortEnabled && colSortMKey) {
                    keySort.push(`<option value="${colSortMKey}">${colSortSTitle}</option>`);
                }

                let colText = preKeyVisible[idx];
                let isVisible = colConfig?.['bVisible'] || false;
                let idxCol = colConfig?.['idx'];
                let randomStringData = $x.fn.randomStr(32);
                if (colText)
                    keyVisible.push(`
                        <li class="d-flex align-items-center justify-content-between mb-1">
                            <div class="form-check">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input custom-visible-item-dtb" 
                                    id="${randomStringData}" ${isVisible ? 'checked' : ''}
                                    data-idx="${idxCol}"
                                >
                                <label class="form-check-label" for="${randomStringData}">${colText}</label>
                            </div>
                        </li>
                    `)
            }
        )

        let keySortHtml = '';
        if (settings.oInit['enableSortColumns'] === true) {
            keySortHtml = keySort.length > 0 ? `
                <div 
                    class="input-group input-group-sm w-115p ml-1"
                    data-bs-toggle="tooltip"
                    title="${$.fn.transEle.attr('data-msg-sorting-by')}"
                >
                    <select class="form-select form-select-sm w-80p custom-order-dtb">
                        <option selected></option>
                            ${keySort.join("")}
                    </select>
                    <button class="btn btn-light custom-order-asc-dtb w-35p" type="button" disabled>
                        <i class="fa-solid fa-arrow-down-a-z"></i>
                    </button>
                </div>
            ` : '';
        }

        // handle tools
        let cusToolHtml = '';
        if (settings.oInit['let cusToolHtml'] === true) {
            let cusToolData = DTBControl._parseCusTools(settings, wrapperEle) || [];
            cusToolHtml = cusToolData.length > 0 ? `
                <div 
                    class="btn-group btn-group-sm dropdown ml-1"
                    data-bs-toggle="tooltip"
                    title="${$.fn.transEle.attr('data-msg-tools')}"
                >
                    <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-regular fa-lightbulb"></i>
                    </button>
                    <div class="dropdown-menu w-150p">
                        ${cusToolData.join("")}
                    </div>
                </div>
            ` : '';
        }

        // handler visible
        let keyVisibleHtml = '';
        if (settings.oInit['enableVisibleColumns'] === true) {
            keyVisibleHtml = keyVisible.length > 0 ? `
                <div 
                    class="btn-group btn-group-sm dropdown ml-1"
                    data-bs-toggle="tooltip"
                    title="${$.fn.transEle.attr('data-msg-show-hide-columns')}"
                >
                    <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-list"></i>
                    </button>
                    <div class="dropdown-menu w-150p">
                        <ul class="p-0 m-0 custom-visible-dtb">
                            <li class="d-flex align-items-center justify-content-between mb-1">
                                <div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input check-all" 
                                        id="${dtb.attr('id')}-visible-check-all"
                                    >
                                    <blabel class="form-check-label" for="${dtb.attr('id')}-visible-check-all"><b>${$.fn.transEle.attr('data-all')}</b></label>
                                </div>
                            </li>
                            ${keyVisible.join("")}
                        </ul>
                    </div>
                </div>
            ` : '';
        }

        if (
            keySortHtml.length > 0 ||
            keyVisibleHtml.length > 0 ||
            cusToolHtml.length > 0
        ) {
            groupCustomEle.html(`
                <div class="d-flex justify-content-end align-items-center">
                    ${keySortHtml}
                    ${keyVisibleHtml}
                    ${cusToolHtml}
                </div>
            `).on(
                'change', 'select.custom-order-dtb', function () {
                    if ($(this).val()) {
                        $(this).parent().find('.custom-order-asc-dtb').prop('disabled', false);
                        dtb.DataTable().ajax.reload();
                    } else {
                        $(this).parent().find('.custom-order-asc-dtb').prop('disabled', true);
                    }
                }
            ).on(
                'click', 'button.custom-order-asc-dtb', function () {
                    $(this).find('i').toggleClass('fa-arrow-down-a-z').toggleClass('fa-arrow-down-z-a');
                    dtb.DataTable().ajax.reload();
                }
            ).on(
                'change', 'input.custom-visible-item-dtb',
                function () {
                    // handle check all
                    let ddEle = $(this).closest('.dropdown-menu');
                    let allEle = ddEle.find('input.check-all');
                    let arrChecked = true;
                    ddEle.find('input.custom-visible-item-dtb').each(function () {
                        if ($(this).prop('checked') === false) arrChecked = false;
                    });
                    allEle.prop('checked', arrChecked);

                    // handle this item
                    let idx = Number.parseInt($(this).attr('data-idx'));
                    if (Number.isInteger(idx)) {
                        let currentVal = $(this).prop('checked');
                        dtb.DataTable().column(idx).visible(currentVal);
                    }
                }
            ).on(
                'change', 'input.check-all',
                function () {
                    let currentVal = $(this).prop('checked');
                    $(this).closest('.dropdown-menu').find('input.custom-visible-item-dtb').each(function () {
                        $(this).prop('checked', currentVal).trigger('change');
                    });
                }
            );
            wrapperEle.on('change', 'select.custom-filter-manual-dtb', function () {
                dtb.DataTable().ajax.reload();
                DTBControl._summaryFilterToText(
                    textFilterEle, manualFilterEle,
                )
            });

            setTimeout(
                () => {
                    wrapperEle.find('select.custom-filter-manual-dtb').each(function () {
                        $(this).initSelect2({
                            allowClear: true,
                            keepIdNullHasText: true,
                        })
                    });
                    wrapperEle.find('input.custom-visible-item-dtb').each(function () {
                        $(this).trigger('change');
                    })
                },
                1000
            )
        } else {
            // hidden toolbar when not any tool has already.
            let stateHidden = true;
            let eleHeaderToolbar = wrapperEle.find('.dtb-header-toolbar');
            eleHeaderToolbar.children('div').each(function () {
                if ($(this).children().length > 0) stateHidden = false;
            });
            if (stateHidden === true) eleHeaderToolbar.addClass('hidden');
        }
    }

    static parseDomDtl(opts) {
        // header Toolbar class name
        let headerToolbarClsName = opts['headerToolbarClsName'] || 'my-2';

        // stateDefaultPageControl: disable all toolbar
        let stateDefaultPageControl = typeof opts?.['stateDefaultPageControl'] === 'boolean' ? opts?.['stateDefaultPageControl'] : true;
        if (opts.hasOwnProperty('stateDefaultPageControl')) delete opts['stateDefaultPageControl'];

        // let domDTL = "<'row miner-group'<'col-sm-12 col-md-3 col-lg-2 mt-3'f>>" +
        //     "<'row mt-3'<'col-sm-12 col-md-6'<'count_selected'>><'col-sm-12 col-md-6'<'custom_toolbar'>>>" +
        //     "<'row mt-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'p>>" +
        //     "<'row mt-3'<'col-sm-12'tr>>" +
        //     "<'row mt-3'<'col-sm-12 col-md-6'i>>";

        // style 1
        let styleDom = opts?.['styleDom'] || 'full';
        let domDTL = `<'d-flex dtb-header-toolbar ${headerToolbarClsName}'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>` + 'rt';
        if (styleDom === 'small') {
            domDTL += `<'row tbl-footer-toolbar' <'cus-page-info'<'col-12 d-flex justify-content-center py-1'l><'col-12  d-flex justify-content-center py-1'i><'col-12  d-flex justify-content-center py-1'p>>>`;
        } else if (styleDom === 'hide-foot') {
            domDTL += ``;
        } else {
            domDTL += `<'row tbl-footer-toolbar' <'col-lg-6 col-md-12 d-flex cus-page-info'li><'col-lg-6 col-md-12'p>>`;
        }

        let utilsDom = {
            // "l": Đại diện cho thanh điều hướng (paging) của DataTable.
            // "f": Đại diện cho hộp tìm kiếm (filtering) của DataTable.
            // "t": Đại diện cho bảng (table) chứa dữ liệu.
            // "i": Đại diện cho thông tin về số hàng hiển thị và tổng số hàng.
            // "p": Đại diện cho thanh phân trang (pagination).
            // "r": Đại diện cho sắp xếp (ordering) của các cột.
            // "s": Đại diện cho hộp chọn số hàng hiển thị.
            visiblePaging: stateDefaultPageControl, // "l"
            visibleSearchField: stateDefaultPageControl,   // "f"
            visibleDisplayRowTotal: stateDefaultPageControl,   // "i"
            visiblePagination: stateDefaultPageControl,   // "p"
            visibleOrder: stateDefaultPageControl,   // "r"
            visibleRowQuantity: stateDefaultPageControl,   // "s"
        }
        // show or hide search field
        if (opts.hasOwnProperty('visiblePaging')) {
            if ($.fn.isBoolean(opts['visiblePaging'])) utilsDom.visiblePaging = opts['visiblePaging'];
            delete opts['visiblePaging'];
        }
        if (utilsDom.visiblePaging === false) domDTL = domDTL.replace('l>', '>');

        // show or hide search field
        if (opts.hasOwnProperty('visibleSearchField')) {
            if ($.fn.isBoolean(opts['visibleSearchField'])) {
                utilsDom.visibleSearchField = opts['visibleSearchField'];
                opts.searching = opts['visibleSearchField'];
            }
            delete opts['visibleSearchField']
        }
        if (utilsDom.visibleSearchField === false) {
            domDTL = domDTL.replace('f>', '>').replaceAll('miner-group', 'miner-group hidden');
        }

        // show or hide row total field
        if (opts.hasOwnProperty('visibleDisplayRowTotal')) {
            if ($.fn.isBoolean(opts['visibleDisplayRowTotal'])) utilsDom.visibleDisplayRowTotal = opts['visibleDisplayRowTotal'];
            delete opts['visibleDisplayRowTotal']
        }
        if (utilsDom.visibleDisplayRowTotal === false) domDTL = domDTL.replace('i>', '>');

        // show or hide page field
        if (opts.hasOwnProperty('visiblePagination')) {
            if ($.fn.isBoolean(opts['visiblePagination'])) utilsDom.visiblePagination = opts['visiblePagination'];
            delete opts['visiblePagination']
        }
        if (utilsDom.visiblePagination === false) {
            domDTL = domDTL.replace('p>', '>');
            utilsDom['pageLength'] = -1; // full page
        }

        // show or hide order field
        if (opts.hasOwnProperty('visibleOrder')) {
            if ($.fn.isBoolean(opts['visibleOrder'])) utilsDom.visibleOrder = opts['visibleOrder'];
            delete opts['visibleOrder']
        }
        if (utilsDom.visibleOrder === false) domDTL = domDTL.replace('r>', '>');

        // show or hide row quantity field
        if (opts.hasOwnProperty('visibleRowQuantity')) {
            if ($.fn.isBoolean(opts['visibleRowQuantity'])) utilsDom.visibleRowQuantity = opts['visibleRowQuantity'];
            delete opts['visibleRowQuantity']
        }
        if (utilsDom.visibleRowQuantity === false) domDTL = domDTL.replace('s>', '>');

        // show/hide custom toolbar
        if (!opts.hasOwnProperty('fullToolbar') || opts?.['fullToolbar'] === false) {
            // show hide/row selected
            domDTL = domDTL.replace("<'count_selected'>", '')
            // show hide custom toolbar
            domDTL = domDTL.replace("<'custom_toolbar'>", '')
        }

        return [opts, domDTL];
    }

    static cleanBaseKeyOfDataAjax(d) {
        if (typeof d === "object" && Object.keys(d).length > 0) {
            let keyHasRemove = ['columns', 'draw', 'length', 'order', 'ordering', 'search', 'start', 'page', 'pageSize']
            let result = {};
            Object.keys(d).map(
                (key) => {
                    if (keyHasRemove.indexOf(key) === -1) {
                        result[key] = d[key];
                    }
                }
            )
            return result
        }
        return {};
    }

    static cleanParamBeforeCall(params, keyKeepEmpty = []) {
        let result = {}
        if (params && typeof params === 'object') {
            Object.keys(params).map(
                (key) => {
                    let val = params[key];
                    if (val || (!val && keyKeepEmpty.includes(key))) result[key] = val;
                }
            )
        }
        return result;
    }

    get reloadCurrency() {
        let reloadCurrency = this.opts?.['reloadCurrency'];
        return $.fn.isBoolean(reloadCurrency) ? reloadCurrency : false;
    }

    appendErrorConfirmAjax() {
        if (this.opts?.['ajax']) {
            if (this.opts['ajax']['url']) {
                if (!this.opts['ajax']?.['error']) {
                    this.opts['ajax']['error'] = function (xhr, error, thrown) {
                        $.fn.switcherResp(xhr?.['responseJSON']);
                        if ($.fn.isDebug() === true) console.log(xhr, error, thrown);
                    }
                }
            } else {
                if ($.fn.isDebug() === true) console.log('Ajax table cancels load data because config url Ajax is blank. Please config it, then try again!', {...this.opts});
                delete this.opts['ajax'];
                this.opts['data'] = [];
            }
        }
        if (isDenied) { // global variable
            // denied ajax and empty data
            if (this.opts.hasOwnProperty('ajax')) delete this.opts['ajax'];
            if (!this.opts.hasOwnProperty('data')) this.opts['data'] = [];
        } else {
            if (this.opts?.['ajax']) {
                // has ajax , remove data
                if (this.opts.hasOwnProperty('data')) delete this.opts['data'];
            } else {
                // hasn't ajax, add data empty
                if (!this.opts.hasOwnProperty('data')) this.opts['data'] = [];
            }
        }

        return true;
    }

    setUpUseDataServer() {
        let clsThis = this;
        // config server side processing
        if (this.opts['useDataServer']) {
            // server side v
            let ajaxDataCallback = this.opts?.['ajax']?.['data'] || {};
            let setupServerSide = {
                processing: true,
                serverSide: true,
                ordering: false,
                // ordering: true,
                searchDelay: 1000,
                order: [],
                ajax: $.extend(
                    this.opts['ajax'],
                    {
                        data: function (d) {
                            // re-configure (assign other config) to d
                            if (ajaxDataCallback instanceof Function) {
                                Object.assign(d, ajaxDataCallback(d));
                            } else if (ajaxDataCallback instanceof Object){
                                Object.assign(d, ajaxDataCallback)
                            }

                            // get wrapper element
                            let wrapperEle = clsThis.dtb$.closest('.dataTables_wrapper');

                            // setup ordering
                            let sortKey = wrapperEle.find('.custom-order-dtb').val();
                            let sortASC = wrapperEle.find('.custom-order-asc-dtb i').hasClass('fa-arrow-down-z-a');   // DESC
                            let orderingManual = d?.['ordering'] || null;
                            let orderTxt = sortKey ? `${sortASC ? '-' : ''}${sortKey}` : orderingManual ? orderingManual : '';

                            // setup another filtering
                            let keyKeepEmpty = [];
                            let customFilter = {};

                            $(`div.row-custom-filter[data-dtb-id="#` + clsThis.dtb$.attr('id') + `"]`).find('select').each(
                                function () {
                                    let val = $(this).val();
                                    if (val) {
                                        if ((typeof val === "string" && val) || (Array.isArray(val) && val.length > 0)) {
                                            customFilter[$(this).attr('data-keyParam')] = (!Array.isArray(val) ? [val] : val).join(",");
                                        }
                                    } else {
                                        if ($(this).attr('data-keepIdNullHasText') === 'true') {
                                            customFilter[$(this).attr('data-keyParam')] = "";
                                            keyKeepEmpty.push($(this).attr('data-keyParam'))
                                        }
                                    }
                                }
                            );

                            let customFilterData = {};
                            let filterManualEle = wrapperEle.find('select.custom-filter-manual-dtb');
                            if (filterManualEle.length > 0) {
                                filterManualEle.each(function () {
                                    customFilterData[$(this).attr('data-keyparam')] = $(this).val();
                                })
                            } else {
                                (clsThis.opts.cusFilter || []).map(
                                    (item) => {
                                        if (item.data && Array.isArray(item.data)) {
                                            let valParam = [];
                                            item.data.map(
                                                (item2) => {
                                                    if (item2.selected === true) {
                                                        valParam.push(item2.id);
                                                    }
                                                }
                                            )
                                            customFilterData[item.keyParam] = valParam.join(",");
                                        }

                                    }
                                )
                            }

                            return DTBControl.cleanParamBeforeCall({
                                ...DTBControl.cleanBaseKeyOfDataAjax(d),
                                'page': Math.ceil(d.start / d.length) + 1,
                                'pageSize': d.length,
                                'search': d?.search?.value ? d.search.value : '',
                                'ordering': orderTxt, ...customFilter, ...customFilterData,
                            }, keyKeepEmpty);
                        },
                        dataFilter: (data) => {
                            let json = JSON.parse(data);
                            json.recordsTotal = json?.data?.['page_count']
                            json.recordsFiltered = json?.data?.['page_count']
                            return JSON.stringify(json);
                        },
                        headers: {
                            "ENABLEXCACHECONTROL": !!(this.opts?.['ajax']?.['cache']) ? 'true' : 'false',
                        },
                    }
                )
            }
            this.opts = $.extend(this.opts, setupServerSide)
        }
    }

    get callbackGetLinkBlank() {
        return this.opts?.['callbackGetLinkBlank'] || function (rowData) {
            // return url was converted
            return null;
        }
    }

    get callbackRenderIdx() {
        let clsThis = this;
        let rowIdx = this.opts?.['rowIdx'];
        if (rowIdx === true) {
            return function (row, data, displayNum) {
                let dtbTmp = $(clsThis.dtb$).DataTable();
                let pageInfo = dtbTmp.page.info();
                let counter = '';
                if (pageInfo['serverSide'] === true) {
                    // serverSide --> displayNum was reset to 0 when render --> so page number * page size + display
                    counter = pageInfo.start + displayNum + 1;
                } else {
                    // for datatable not use serverSide.
                    counter = displayNum + 1;
                }
                let htmlDisplay = `${counter}`;
                let callbackGetLinkBlank = clsThis.callbackGetLinkBlank;
                let urlTargetHTML = callbackGetLinkBlank ? callbackGetLinkBlank(data) : null;
                if (urlTargetHTML) {
                    htmlDisplay = `<a 
                    href="${urlTargetHTML}" 
                    target="_blank" 
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom" 
                    title="${$.fn.transEle.attr('data-msg-open-new-tab')}"
                >${counter}</a>`;
                }
                $('td:eq(0)', row).html(htmlDisplay);
            }
        }
        return function (row, data, displayNum, displayIndex, dataIndex) {
            // default callback of detail datatable
            let editZElm = $('[data-zone]', row)
            // if (editZElm.length){
            //     editZElm.addClass('border-warning')
            //     editZElm.next('.select2-container').find('.select2-selection').addClass('border-warning')
            // }
        };
    }

    get mergeDrawCallback() {
        let clsThis = this;
        // merge two drawCallback function
        let drawCallback01 = this.opts?.['drawCallback'] || function (settings) {
        };
        let drawCallBackDefault = function (settings) {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-rounded pagination-simple');
            feather.replace();
            // reload all currency
            if (clsThis.reloadCurrency === true) $.fn.initMaskMoney2();
            // buildSelect2();
            setTimeout(() => DocumentControl.buildSelect2(), 0);
        }
        return function (settings) {
            drawCallback01(settings);
            drawCallBackDefault(settings);
        }
    }

    get mergeRowCallback() {
        let rowCallbackManual = this.opts?.['rowCallback'] || function (row, data, displayNum, displayIndex, dataIndex) {
        };
        let callbackRenderIdx = this.callbackRenderIdx;
        return function (row, data, displayNum, displayIndex, dataIndex) {
            rowCallbackManual(row, data, dataIndex);
            callbackRenderIdx(row, data, dataIndex);
        }
    }

    get mergeInitComplete() {
        let clsThis = this;
        let initCompleteManual = this.opts?.['initComplete'] || function (settings, json) {
        };
        return function (settings, json) {
            ListeningEventController.listenImageLoad(
                $(this.api().table().container()).find('img'),
                true,
            );

            $(this.api().table().container()).find('input').attr('autocomplete', 'off');
            initCompleteManual.bind(this)(settings, json);
            DTBControl.parseHeaderDropdownFilter.bind(this)(
                (clsThis.opts?.['columns'] || []), settings, clsThis.dtb$
            );
            DTBControl.parseFilter2.bind(this)(clsThis.dtb$, settings, json);
        }
    }

    get columns() {
        return (this.opts?.['columns'] || []).map(
            (item) => {
                let clsNameTmp = item?.['className'] ? (item?.['className'] + ' wrap-text') : 'wrap-text';
                return {
                    ...item,
                    className: clsNameTmp,
                }
            }
        );
    }

    parseWhenAllToolbarWasDisabled(opts) {
        let disableAll = opts['stateFullTableTools'];
        if (disableAll === false || disableAll === true) {
            opts.enableVisibleColumns = disableAll;
            opts.enableSortColumns = disableAll;
            opts.enableFilterCustom = disableAll;
            opts.enableTools = disableAll;
            opts.searching = disableAll;
            opts.ordering = disableAll;
            opts.visiblePaging = disableAll;
            opts.visibleSearchField = disableAll;
            opts.visibleDisplayRowTotal = disableAll;
            opts.visiblePagination = disableAll;
            opts.visibleOrder = disableAll;
            opts.visibleRowQuantity = disableAll;

            if (disableAll === false) {
                opts.paginate = false;
                opts.pageLength = -1;
                opts.lengthMenu = [];
            }
        }
        return opts;
    }

    parseDtlOpts() {
        // prepare config
        this.opts = this.parseWhenAllToolbarWasDisabled(this.opts);
        // init table
        let [domOpts, domDTL] = DTBControl.parseDomDtl(this.opts);
        // ajax
        this.appendErrorConfirmAjax();

        // config server side processing
        this.setUpUseDataServer();

        return {
            // default custom variable
            stateFullTableTools: null,
            enableVisibleColumns: true,
            enableSortColumns: true,
            enableFilterCustom: true,
            enableTools: true,

            // scrollY: '400px',
            // scrollCollapse: true,
            // fixedHeader: true,
            autoFill: false,
            search: $.fn.DataTable.ext.type.search['html-numeric'],
            searching: true,
            ordering: false,
            paginate: true,
            dom: domDTL,
            language: {
                url: globeDTBLanguageConfig.trim(),
            },
            lengthMenu: [
                [5, 10, 25, 50, -1], [5, 10, 25, 50, $.fn.transEle.attr('data-all')],
            ],
            pageLength: 5,
            ...domOpts,
            columns: this.columns,
            rowCallback: this.mergeRowCallback,
            drawCallback: this.mergeDrawCallback,
            initComplete: this.mergeInitComplete,
        };
    }

    constructor(dtb$) {
        this.dtb$ = $(dtb$);
        this.dataSelect = {};
        this.opts = {};
    }

    init(opts) {
        this.opts = opts;
        let config = this.parseDtlOpts(opts);
        let tbl = this.dtb$.DataTable(config);
        let $this = this;
        tbl.on('init.dt', function (event, settings) {
            let divWrap = $(this).closest('.dataTables_wrapper');
            // $(this).closest('.dataTables_wrapper').find('.select2:not(:disabled)').initSelect2();
            if (opts?.['fullToolbar'] === true) {
                // load toolbar if setup is true
                DTBControl.prepareHTMLToolbar(divWrap, settings)
                // handle on check on/off column
                $('.ct_toolbar-columns .dropdown-menu input[type="checkbox"]', divWrap).off().on('change', function (e) {
                    if ($(this).attr('id') === 'tb_columns-all') {
                        let listIdx = []
                        $(this).parent('.form-check').siblings('.form-check').each(function () {
                            listIdx.push($(this).find('input').attr('data-column'))
                        })
                        tbl.columns(listIdx).visible(this.checked)
                        $('input:not(#tb_columns-all)', $(this).closest('.dropdown-menu')).prop('checked', this.checked)
                    } else {
                        tbl.column($(this).attr('data-column')).visible(this.checked)
                        if (!this.checked) $('#tb_columns-all', divWrap).prop('checked', false)
                        else {
                            let isFull = true
                            $(this).parent('.form-check').siblings('.form-check').each(function () {
                                if ($(this).find('input:not(.check_all)').prop('checked') === false) {
                                    isFull = false
                                    return false
                                }
                            })
                            if (isFull) $('#tb_columns-all', divWrap).prop('checked', true)
                        }
                    }
                });
            }
            $(window).trigger("resize");
        });
        tbl.on('draw.dt', function (event, settings) {
            // init row has checkbox selection
            $this.checkRowSelect(opts);
            $this.reCheckSelect(settings);

            // select filter in header
            setTimeout(() => {
                $('.header-column_search th.flt-select select', this.dtb$).each(function () {
                    $(this).initSelect2()
                })
            }, 0)
        });
        return tbl;
    }
}

class WindowControl {
    static eleHrefActive(url) {
        let link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
    }

    static getHashUrl() {
        return location.hash;
    }

    static pushHashUrl(idHash) {
        window.history.pushState(null, null, idHash.includes('#') ? idHash : '#' + idHash);
    }

    static removeHashUrl() {
        window.history.replaceState(null, "", "#");
    }

    static redirectLogin(timeout = 0, location_to_next = true) {
        if (location_to_next === true) {
            return jQuery.fn.redirectUrl('/auth/logout', timeout, 'next=' + window.location.pathname);
        } else {
            return jQuery.fn.redirectUrl('/auth/logout', timeout, '');
        }
    }

    static showLoading(opts) {
        // loadingTitleAction: GET (default), CREATE, UPDATE, DELETE
        function resolve_title(){
            let title = '';
            let loadingTitleKeepDefault = opts?.['loadingTitleKeepDefault'] || true;
            if (loadingTitleKeepDefault === true){
                let loadingTitleAction = opts?.['loadingTitleAction'] || 'GET';
                if (loadingTitleAction === 'GET'){
                    title += $.fn.transEle.attr('data-loading');
                } else if (loadingTitleAction === 'CREATE'){
                    title += $.fn.transEle.attr('data-loading-creating');
                } else if (loadingTitleAction === 'UPDATE'){
                    title += $.fn.transEle.attr('data-loading-updating');
                } else if (loadingTitleAction === "DELETE") {
                    title += $.fn.transEle.attr('data-loading-deleting');
                }
            }
            let loadingTitleMore = opts?.['loadingTitleMore'] || '';
            if (loadingTitleMore) title += ' ' + loadingTitleMore;
            return title;
        }

        let didOpenStartSetup = opts?.['didOpenStart'] || null;
        if (didOpenStartSetup) delete opts['didOpenStart'];

        let didOpenEndSetup = opts?.['didOpenEnd'] || null;
        if (didOpenEndSetup) delete opts['didOpenEnd']

        let didDestroyStartSetup = opts?.['didDestroyStart'] || null;
        if (didDestroyStartSetup) delete opts['didDestroyStart'];

        let didDestroyEndSetup = opts?.['didDestroyEnd'] || null;
        if (didDestroyEndSetup) delete opts['didDestroyEnd'];
        Swal.fire({
            icon: 'info',
            title: resolve_title(),
            text: `${$.fn.transEle.attr('data-wait')}...`,
            allowOutsideClick: false,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: () => {
                if (didOpenStartSetup instanceof Function) didOpenStartSetup();
                Swal.showLoading();
                if (didOpenEndSetup instanceof Function) didOpenEndSetup();
            },
            didDestroy: () => {
                if (didDestroyStartSetup instanceof Function) didDestroyStartSetup();
                Swal.hideLoading();
                if (didDestroyEndSetup instanceof Function) didDestroyEndSetup();
            },
            ...opts,
        });
    }

    static hideLoading(checkIsLoading = true) {
        if (checkIsLoading === true) {
            try {
                if (Swal.isLoading()) {
                    checkIsLoading = false;
                }
            } catch (e) {
                checkIsLoading = false;
            }
        }
        if (checkIsLoading === false) {
            swal.close();
        }
    }

    static showLoadingButton(ele$, opts) {
        let startOrEnd = opts?.['location'] || 'end'; // 'start','end'
        let borderOrGrow = opts?.['type'] || 'border'; // 'border','grow'
        if (ele$ instanceof jQuery) {
            $(ele$).addClass('btn-upload-force-color');
            $(ele$).prop('disabled', true);
            if (startOrEnd === 'start') {
                $(ele$).prepend($(`<span class="spinner-${borderOrGrow} spinner-${borderOrGrow}-sm ntt-spinner-btn mr-1" role="status" aria-hidden="true"></span>`))
            } else if (startOrEnd === 'end') {
                $(ele$).append($(`<span class="spinner-${borderOrGrow} spinner-${borderOrGrow}-sm ntt-spinner-btn ml-1" role="status" aria-hidden="true"></span>`))
            }
        }
    }

    static hideLoadingButton(ele$, opts) {
        if (ele$ instanceof jQuery) {
            $(ele$).prop('disabled', false).removeClass('btn-upload-force-color');
            $(ele$).find('.ntt-spinner-btn').remove();
        }
    }

    static showLoadingWaitResponse(ele$, opts, addClass = '') {
        return $(ele$).fadeOut({
            'duration': 'fast', // 'start': function (){
            //     $(`<div class="spinner spinner-border text-secondary my-3" role="status"><span class="sr-only">Loading...</span></div>`).insertBefore($(this));
            // },
            'done': function () {
                $(`<div class="${addClass} spinner spinner-border text-secondary my-3" role="status"><span class="sr-only">Loading...</span></div>`).insertBefore($(this));
                if (!$(this).hasClass('fade-in-active')) $(this).addClass('hidden');
            }, ...opts
        });
    }

    static hideLoadingWaitResponse(ele$, opts) {
        return $(ele$).addClass('fade-in-active').fadeIn({
            'duration': 'fast',
            'start': function () {
                $(this).prev('.spinner').addClass('hidden').remove();
                $(this).removeClass("hidden")
            }, // 'done': function (){
            //     $(this).prev('.spinner').addClass('hidden').remove();
            // },
            ...opts
        });
    }

    static showForbidden(opts) {
        Swal.fire({
            title: globeMsgHttp403,
            icon: 'error',
            allowOutsideClick: false,
            showDenyButton: true,
            denyButtonText: globeHomePage,
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
            confirmButtonText: globePreviousPage,
            denyButtonColor: '#21b48f',
            preConfirm: function (opts) {
                window.location.href = document.referrer;
            },
            preDeny: function () {
                window.location.href = '/';
            },
            ...opts,
        })
    }

    static showNotFound(opts) {
        Swal.fire({
            title: globeMsgHttp404,
            icon: 'question',
            allowOutsideClick: false,
            showDenyButton: true,
            denyButtonText: globeHomePage,
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
            confirmButtonText: globePreviousPage,
            denyButtonColor: '#21b48f',
            preConfirm: function (opts) {
                window.location.href = document.referrer;
            },
            preDeny: function () {
                window.location.href = '/';
            },
            ...opts,
        })
    }

    static showUnauthenticated(opts, isRedirect = true) {
        if (isRedirect === true) {
            Swal.fire({
                title: globeMsgAuthExpires,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonColor: '#3085d6',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true,
                confirmButtonText: globeLoginPage,
                ...opts
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer || result.isConfirmed || result.value) {
                    return $x.fn.redirectLogin();
                }
            });
        } else {
            Swal.fire({
                title: globeMsgAuthExpires,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
                confirmButtonText: globeLoginPage,
                preConfirm: function (opts) {
                    return $x.fn.redirectLogin();
                },
                ...opts,
            });
        }
    }

    static showSVErrors() {
        Swal.fire({
            title: globeMsgHttp500,
            icon: 'error',
            allowOutsideClick: false,
            showDenyButton: true,
            denyButtonText: globeHomePage,
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
            confirmButtonText: globePreviousPage,
            denyButtonColor: '#21b48f',
            showCancelButton: true,
            cancelButtonText: globeCancelText,
            preConfirm: function (opts) {
                window.location.href = document.referrer;
            },
            preDeny: function () {
                window.location.href = '/';
            },
        })
    }
}

class PersonControl {
    static shortNameGlobe(personData, shortNameKey = null) {
        if (typeof personData === 'object') {
            if (shortNameKey === null) {
                if ($.fn.hasOwnProperties(personData, ['first_name', 'last_name'])) {
                    let last_name = personData['last_name'].split(' ')[0][0];
                    let first_name = personData['first_name'].split(' ');
                    first_name = first_name[first_name.length - 1][0]
                    return `${last_name.length > 0 ? last_name[0] : ''}${first_name.length > 0 ? first_name[0] : ''}`;
                }
            } else {
                if (personData.hasOwnProperty(shortNameKey)) {
                    let arr = personData[shortNameKey].split(" ").map(
                        (charTxt) => {
                            if (charTxt.length > 0) {
                                return charTxt[0];
                            }
                            return '';
                        }
                    )
                    if (arr.length > 2) {
                        arr = [arr[0], arr[1]];
                    }
                    return arr.join("");
                }
            }
        }
        return '';
    }

    static renderAvatar(personData, clsName = "", appendHtml = "", shortNameKey = null) {
        let avatar = personData?.['avatar_img'];
        let htmlTooltipFullname = `data-bs-toggle="tooltip" data-bs-placement="bottom" title="${personData?.['full_name']}"`;
        let shortName = PersonControl.shortNameGlobe(personData, shortNameKey);
        if (avatar && avatar !== 'None' && avatar !== 'none') {
            return `<div class="avatar ${clsName ? clsName : 'avatar-xs avatar-primary avatar-rounded'}" ${htmlTooltipFullname}><img src="${avatar}" alt="${shortName}" class="avatar-img">${appendHtml}</div>`;
        }
        return `
            <div class="avatar avatar-rounded ${clsName ? clsName : 'avatar-xs avatar-primary avatar-rounded'}" ${htmlTooltipFullname}>
                <span class="initial-wrap" >${shortName}</span>
                ${appendHtml}
            </div>
        `;
    }
}

class DocumentControl {
    static classOfPlan(code) {
        let classPlan = {
            'e-office': 'primary',
            'hrm': 'success',
            'personal': 'info',
            'sale': 'danger'
        }
        if (code) {
            return classPlan[code] ? classPlan[code] : 'primary'
        }
        return classPlan
    }

    static getBtnIDLastSubmit() {
        return globeIDLastSubmit;
    }

    static setBtnIDLastSubmit(idx) {
        globeIDLastSubmit = idx;
    }

    static getElePageAction() {
        return $("#idxPageAction");
    }

    static getElePageContent() {
        return $('#idxPageContent');
    }

    static async getCompanyConfig() {
        let dataText = globeDataCompanyConfig;
        if (!dataText || dataText === '') {
            let companyConfigUrl = globeUrlCompanyConfig;
            if (companyConfigUrl) {
                return await $.fn.callAjax2({
                    url: companyConfigUrl,
                    method: 'GET',
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    dataText = JSON.stringify(data);
                    globeDataCompanyConfig = dataText;
                    return data;
                }).then((rs) => {
                    return rs
                });
            }
        } else return JSON.parse(dataText);
    }

    static async getCompanyCurrencyConfig() {
        let data = await DocumentControl.getCompanyConfig();
        return data['config']?.['currency_rule'];
    }

    static formDetailToUpdateAction() {
        let $DetailForm = $('form[readonly]');
        if ($DetailForm) {
            $('.readonly > * + span').on('click', function () {
                // for input/select
                $('[readonly]', $(this).parent('.readonly')).attr('readonly', false);
                $('input[disabled]', $(this).parent('.readonly')).attr('disabled', false);
                // for radio/checkbox
                $('[type="checkbox"][disabled], [type="radio"][disabled]', $(this).parent('.readonly'))
                    .attr('disabled', false);
                // for select2 with icon info
                $('[disabled]', $(this).closest('.input-group.readonly')).attr('disabled', false);
                // for select2 with icon info
                $('select[disabled]', $(this).parent('.readonly')).attr('disabled', false);
                // for table
                $(`[data-table-readonly="${$(this).parent('.readonly').find('table').attr('id')}"]`).attr('disabled', false)
                $('.table-readonly', $(this).parent('.readonly')).removeClass('.readonly.table-readonly');

                // final delete class readonly
                $(`button[form="${$DetailForm.attr('id')}"]`).removeClass('hidden')
                $(this).parent('.readonly').removeClass('readonly');
            });
        }
    }

    static buildSelect2() {
        $('.select2-init-v1').each(function () {
            if (!$(this).attr('data-init-loaded')) {
                // flag is on
                $(this).attr('data-init-loaded', true);

                // display dummy data
                let dummyData = JSON.parse($(this).attr('data-dummy'));
                if (dummyData && typeof dummyData === 'object' && dummyData.hasOwnProperty('title') && dummyData.hasOwnProperty('id')) {
                    $(this).empty().append(`<option value="${dummyData.id}" selected>${dummyData.title}</option>`)
                }

            }
        })
    }

    static change_space() {
        function executeTimeOutChangeSpace(urlData, methodData, spaceCode, spaceName, urlRedirectData) {
            let baseMsg = $.fn.transEle;
            Swal.fire({
                title: $.fn.transEle.attr('data-msgLabelReloadPageIn') + `"${spaceName}"`,
                html: $.fn.transEle.attr('data-msgReloadPageIn') + '<br>',
                timer: 2000,
                timerProgressBar: true,
                showCancelButton: true,
                cancelButtonText: baseMsg.attr('data-cancel'),
                showConfirmButton: true,  // Hiển thị nút Confirm
                confirmButtonText: baseMsg.attr('data-confirm'),
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer || result.isConfirmed || result.value) {
                    callChangeSpaceAndReload(urlData, methodData, spaceCode, urlRedirectData);
                }
            });
        }

        $('#btnTestAlert').click(function () {
            executeTimeOutChangeSpace();
        })

        function callChangeSpaceAndReload(urlData, methodData, spaceCode, urlRedirectData) {
            WindowControl.showLoading();
            $.fn.callAjax2({
                url: urlData,
                method: methodData,
                data: {'space_code': spaceCode},
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && data['status'] === 200) {
                    $.fn.notifyB({
                        'description': $.fn.transEle.attr('data-success')
                    }, 'success');
                    setTimeout(() => {
                        window.location.href = urlRedirectData;
                    }, 1000,);
                }
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000);
            }, (errs) => {
                WindowControl.hideLoading();
            });
        }

        $('.space-item').click(function (event) {
            event.preventDefault();
            let space_selected = $('#menu-tenant').attr('data-space-selected');
            let urlData = $(this).closest('.dropdown-menu').attr('data-url');
            let urlRedirectData = $(this).closest('.dropdown-menu').attr('data-url-redirect');
            let methodData = $(this).closest('.dropdown-menu').attr('data-method');
            let spaceCode = $(this).attr('data-space-code');
            if (spaceCode !== space_selected) {
                executeTimeOutChangeSpace(urlData, methodData, spaceCode, $(this).attr('data-space-name'), urlRedirectData);
            }
        })
    }

    static active_menu(item) {
        if (item.length > 0) {
            item.first().addClass('active')
            let parent = item.first().parents('.nav-item');
            if (parent.length > 0) {
                parent.first().addClass('active');
                DocumentControl.active_menu(parent.first());
            }
        }
        return null;
    }

    static menu_handler() {
        let nav_data = $('#get-menu-active');
        let menu_id_active = nav_data.attr('data-nav-menu');
        if (menu_id_active) {
            let ele_menu = $('#' + menu_id_active);
            if (ele_menu) {
                DocumentControl.active_menu(ele_menu);
            }
        }
        let tenant_code_active = nav_data.attr('data-nav-tenant');
        if (tenant_code_active) $('#menu-tenant').children('option[value=' + tenant_code_active + ']').attr('selected', 'selected');
    }

    static renderCodeBreadcrumb(detailData, keyCode = 'code', keyActive = 'is_active', keyStatus = 'system_status') {
        if (typeof detailData === 'object') {
            let [code, is_active, system_status] = [detailData?.[keyCode], detailData?.[keyActive], detailData?.[keyStatus]];
            if (code) {
                let clsState = 'hidden';
                if (is_active === true) {
                    clsState = 'badge badge-info badge-indicator';
                } else if (clsState === false) {
                    clsState = 'badge badge-light badge-indicator';
                }
                $('#idx-breadcrumb-current-code').html(
                    `
                    <span class="${clsState}"></span>
                    <span class="badge badge-primary">${code}</span>
                `
                ).removeClass('hidden');
            }
            if (system_status) {
                let status_class = {
                    "Draft": "badge badge-soft-light",
                    "Created": "badge badge-soft-primary",
                    "Added": "badge badge-soft-info",
                    "Finish": "badge badge-soft-success",
                    "Cancel": "badge badge-soft-danger",
                }
                if ($x.fn.checkNumber(system_status)) {
                    const key = Object.keys(status_class);
                    system_status = key[system_status]
                }
                $('#idx-breadcrumb-current-code').append(
                    `<span class="${status_class[system_status]}">${system_status}</span>`
                ).removeClass('hidden');
            }
        }
    }

    static buttonLinkBlank(url, iconHtml = '<i class="fa-solid fa-arrow-up-right-from-square"></i>') {
        return `<a href="${url}" target="_blank">
            <button 
                class="btn btn-link btn-xs"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom" 
                title="${$.fn.transEle.attr('data-msg-open-new-tab')}"
            >${iconHtml}</button>
        </a>`;
    }

    static closeCard(eleCard, destroyParentClosest = null, isPurge = false) {
        let ele = $(eleCard).closest('.card');
        if (destroyParentClosest !== null) ele = ele.closest(destroyParentClosest);
        if (isPurge === true) {
            ele.remove();
        } else {
            ele.addClass('d-none');
        }
    }

    static openCard(eleCard, openParentClosest = null) {
        let ele = $(eleCard).closest('.card');
        if (openParentClosest !== null) ele = ele.closest(openParentClosest);
        ele.removeClass('d-none');
    }
}

class ExcelToJSON {
    parseFile(file, callback_render, callback_error = null) {
        let reader = new FileReader();

        reader.onload = function (e) {
            let data = e.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (callback_render && typeof callback_render === 'function') callback_render(XL_row_object);
                else console.log(XL_row_object);
            })
        };

        reader.onerror = function (ex) {
            if (callback_error && typeof callback_error === 'function') callback_error(ex);
            else console.log('onerror: ', ex);
        };

        reader.readAsBinaryString(file);
    }
}

class DateTimeControl {
    static defaultFormatDatetime = 'YYYY-MM-DD hh:mm:ss';
    static defaultFormatDate = 'YYYY-MM-DD';

    static convertData(data, fromFormat, toFormat) {
        return moment(data, fromFormat).format(toFormat ? toFormat : DateTimeControl.defaultFormatDate);
    }

    static parseToMoment(data, format) {
        return moment(data, format);
    }

    static convertEleDate(ele$, opts = {}) {
        let toFormat = opts?.['toFormat'] || DateTimeControl.defaultFormatDate;
        let defaultIsEmpty = opts?.['defaultIsEmpty'] !== undefined ? opts?.['defaultIsEmpty'] : '';

        let data = $(ele$).val();
        if (data) {
            let fromFormat = $(ele$).attr('data-locale-format');
            return DateTimeControl.convertData(data, fromFormat, toFormat);
        }
        return defaultIsEmpty;
    }

    static convertEleDatetime(ele$, opts = {}) {
        let toFormat = opts?.['toFormat'] || DateTimeControl.defaultFormatDatetime;
        let defaultIsEmpty = opts?.['defaultIsEmpty'] !== undefined ? opts?.['defaultIsEmpty'] : '';

        let data = $(ele$).val();
        if (data) {
            let fromFormat = $(ele$).attr('data-locale-format');
            return DateTimeControl.convertData(data, fromFormat, toFormat);
        }
        return defaultIsEmpty;
    }

    static convertDateToMoment(data, opts = {}) {
        let toFormat = opts?.['toFormat'] || DateTimeControl.defaultFormatDate;
        let defaultIsEmpty = opts?.['defaultIsEmpty'] !== undefined ? opts?.['defaultIsEmpty'] : '';
        if (data) {
            return moment(data, toFormat);
        }
        return defaultIsEmpty;
    }

    static convertDatetimeToMoment(data, opts = {}) {
        let toFormat = opts?.['toFormat'] || DateTimeControl.defaultFormatDatetime;
        let defaultIsEmpty = opts?.['defaultIsEmpty'] !== undefined ? opts?.['defaultIsEmpty'] : '';
        if (data) {
            return moment(data, toFormat);
        }
        return defaultIsEmpty;
    }

    static reformatData(data, fromFormat, toFormat, defaultIsEmpty = '') {
        if (data) {
            return moment(data, fromFormat).format(toFormat);
        }
        return defaultIsEmpty;
    }
}

class Beautiful {
    static randomColorClass() {
        const randomColor = [
            "primary", "success", "warning", "danger", "info", "red", "green", "pink", "purple",
            "violet", "indigo", "blue", "sky", "cyan", "teal", "neon", "lime", "sun", "yellow", "orange", "pumpkin",
            "brown", "gold", "light", "dark"
        ]
        return randomColor[Math.floor(Math.random() * 25)]
    }
}

class FileControl {
    static get_val(input_val, default_empty=null){
        if (input_val){
            let result = [];
            input_val.split(",").map(
                (item) => {if (item && UtilControl.checkUUID4(item)) result.push(item);}
            )
            return result;
        }
        return default_empty
    }

    static convert_size_to_simple_display(value, typeCode) {
        function upto_level(_typeCode) {
            if (_typeCode === '') {
                return 'KB';
            }
            if (_typeCode === 'KB') {
                return 'MB';
            }
            if (_typeCode === 'MB') {
                return 'GB';
            }
            return 'TB';
        }

        if (value > 1024) {
            if (typeCode === 'TB') {
                return {
                    value,
                    typeCode
                }
            }
            return FileControl.convert_size_to_simple_display(
                value / 1024,
                upto_level(typeCode)
            )
        }
        return {
            value,
            typeCode
        }
    }

    static parse_size(value, round = 2) {
        let data = FileControl.convert_size_to_simple_display(value, "")
        return `${data.value.toFixed(round)} ${data.typeCode}`;
    }

    static resolve_ids(ids){
        let result = [];
        ids.split(",").map(
            (item) => {
                if (item){
                    result.push(item.trim());
                }
            }
        )
        return result.join(",");
    }

    ui_multi_add_file(id, file) {
        // Creates a new file and add it to our list
        let base64Capture = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzVweCIgaGVpZ2h0PSIzNXB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGc+CiAgICA8cGF0aCBkPSJNMTkgOVYxNy44QzE5IDE4LjkyMDEgMTkgMTkuNDgwMiAxOC43ODIgMTkuOTA4QzE4LjU5MDMgMjAuMjg0MyAxOC4yODQzIDIwLjU5MDMgMTcuOTA4IDIwLjc4MkMxNy40ODAyIDIxIDE2LjkyMDEgMjEgMTUuOCAyMUg4LjJDNy4wNzk4OSAyMSA2LjUxOTg0IDIxIDYuMDkyMDIgMjAuNzgyQzUuNzE1NjkgMjAuNTkwMyA1LjQwOTczIDIwLjI4NDMgNS4yMTc5OSAxOS45MDhDNSAxOS40ODAyIDUgMTguOTIwMSA1IDE3LjhWNi4yQzUgNS4wNzk4OSA1IDQuNTE5ODQgNS4yMTc5OSA0LjA5MjAyQzUuNDA5NzMgMy43MTU2OSA1LjcxNTY5IDMuNDA5NzMgNi4wOTIwMiAzLjIxNzk5QzYuNTE5ODQgMyA3LjA3OTkgMyA4LjIgM0gxM00xOSA5TDEzIDNNMTkgOUgxNEMxMy40NDc3IDkgMTMgOC41NTIyOCAxMyA4VjMiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8L2c+Cjwvc3ZnPgo=';
        let template = this.ele$.find('.pattern-file-text-plain').text()
            .replace('%%filename%%', file.name)
            .replace('%%fileid%%', id)
            .replace('%%fileinfo%%', FileControl.parse_size(file.size))
            .replace('%%filecapture%%', base64Capture)
            .replace('%%fileremark%%', file.remarks || '')
        ;

        this.ele$.find('.dm-uploader-no-files').hide();

        this.ele$.find('.dm-uploader-result-list').prepend(template).fadeIn();
    }

    ui_multi_update_file_progress(id, percent, class_state) {
        let ele = this.ele$.find(`[data-file-id="${id}"]`);
        if (ele.length > 0) {
            ele.alterClass('state-f-*').addClass(class_state);
            if (percent) {
                ele.find('.btn-percent-upload').addClass('show').text(percent + '%');
                if (percent === 100) {
                    setTimeout(
                        () => {
                            ele.find('.btn-percent-upload').fadeOut().removeClass('show');
                        },
                        1000
                    )
                }
            }
        }
    }

    ui_update_input_file(config) {
        // resolve type
        let acceptData = [];
        let acceptDataTxt = 'ALL';
        let allowType = config.allowedTypes;
        if (allowType && allowType !== '*') {
            let inputFileEle = this.ele$.find('.dm-uploader input[type="file"]');
            if (inputFileEle.length > 0){
                if (allowType.endsWith("/*")) {
                    acceptData.push(allowType);
                } else {
                    let extFile = config.extFilter;
                    if (extFile && Array.isArray(extFile)) extFile.map(
                        (item) => {
                            acceptData.push(
                                `${allowType}/${item}`
                            )
                        }
                    );
                    else acceptData.push(`${allowType}/*`);
                }

                acceptDataTxt = acceptData.join(", ");
                inputFileEle.attr('accept', acceptDataTxt);
            } else {
                acceptDataTxt = allowType;
            }
        }


        // resolve size
        let sizeLimitTxt = FileControl.parse_size(config.maxFileSize);

        // show instruction
        let htmlOfType = acceptDataTxt === 'ALL' ? '' : this.ele$.find('.template-data-error-type').text().replace('%%fileaccept%%', acceptDataTxt);
        let htmlOfSize = this.ele$.find('.template-data-error-size').text().replace('%%filesizelimit%%', sizeLimitTxt);
        this.ele$.find('.instruction-upload-file-text').append(htmlOfType, htmlOfSize);
    }

    ui_check_id_exist(id){
        let inputEle = this.ele$.find('.dm-uploader-ids');
        return inputEle.val().indexOf(id) !== -1;
    }

    ui_add_id(id) {
        let inputEle = this.ele$.find('.dm-uploader-ids');
        let ids = inputEle.val();
        if (typeof ids === 'string' && ids.indexOf(id) === -1) {
            ids = FileControl.resolve_ids(ids + ',' + id)
            inputEle.val(ids);
        }
    }

    ui_remove_id(id){
        if (this.init_opts.enable_remove === true){
            let inputEle = this.ele$.find('.dm-uploader-ids');
            let ids = inputEle.val();
            if (typeof ids === 'string' && ids.indexOf(id) !== -1) {
                inputEle.val(
                    FileControl.resolve_ids(
                        ids.replace(id, '')
                    )
                );
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Remove was not support!',
            });
        }
    }

    ui_remove_line_file_by_id(id) {
        let itemEle = this.ele$.find(`.dm-uploader-result-list .dm-uploader-result-item[data-file-id="${id}"]`);
        if (itemEle.length > 0){
            this.ui_remove_id(itemEle.attr('data-file-id'));
            itemEle.remove();
        }

        let resultItem = this.ele$.find('.dm-uploader-result-list .dm-uploader-result-item');
        if (resultItem.length === 0) {
            this.ele$.find('.dm-uploader-no-files').fadeIn();
            this.ele$.find('.dm-uploader-result-list').fadeOut();
        }
    }

    ui_on_click_remove(parentEle = null) {
        if (this.init_opts.enable_remove === true) {
            let clsThis = this;
            let itemEle = parentEle ? parentEle : clsThis.ele$.find('.dm-uploader-result-item');
            itemEle.find('.btn-destroy-file').on('click', function () {
                let itemEle = $(this).closest('.dm-uploader-result-item');
                Swal.fire({
                    title: $.fn.transEle.attr('data-sure-delete'),
                    icon: 'question',
                    html: `
                        <p>${itemEle.find('.f-item-name').text()}</p>
                        <small class="text-warning">${$.fn.transEle.attr('data-change-not-save-until-doc-save')}</small>
                    `,
                    confirmButtonText: $.fn.transEle.attr('data-msg-yes-delete-it'),
                    cancelButtonText: $.fn.transEle.attr('data-cancel'),
                    showCancelButton: true,
                }).then(
                    (results) => {
                        if (results.isConfirmed) {
                            clsThis.ui_remove_line_file_by_id(itemEle.attr('data-file-id'));
                        }
                    }
                )
            })
        }
    }

    ui_on_show_file_cloud() {
        // Call ajax (DTB) when fist open modal
        let clsThis = this;
        let modalEle = this.ele$.find('.modal.modal-file-cloud');
        let selectedGroup = modalEle.find('.selected-file-cloud');
        let tblEle = modalEle.find('table.select-file-cloud');

        function refresh_dtb(){
            tblEle.DataTable().rows().clear();
            selectedGroup.empty().closest('.selected-file-cloud-group').fadeOut();
        }

        modalEle.on('show.bs.modal', function () {
            if (tblEle.length === 1) {
                if($.fn.DataTable.isDataTable(tblEle)){
                    refresh_dtb();
                    tblEle.DataTable().ajax.reload();
                } else {
                    tblEle.DataTableDefault({
                        useDataServer: true,
                        styleDom: 'small',
                        ajax: {
                            url: tblEle.attr('data-url'),
                            type: 'GET',
                            dataSrc: function (resp) {
                                let data = $.fn.switcherResp(resp);
                                if (data && resp.data.hasOwnProperty('file_list')) {
                                    return resp.data['file_list'] ? resp.data['file_list'] : [];
                                }
                                throw Error('Call data raise errors.')
                            },
                        },
                        columns: [
                            {
                                width: '10%',
                                render: (data, type, row) => {
                                    return `<div class="form-check"><input type="checkbox" class="form-check-input row-select"></div>`;
                                }
                            },
                            {
                                width: '25%',
                                className: 'wrap-text',
                                data: 'file_name',
                                render: (data, type, row) => {
                                    return data;
                                }
                            },
                            {
                                width: '15%',
                                className: 'wrap-text',
                                data: 'file_size',
                                render: (data, type, row) => {
                                    if (data) {
                                        return FileControl.parse_size(data)
                                    }
                                    return data;
                                }
                            },
                            {
                                width: '25%',
                                className: 'wrap-text',
                                data: 'remarks',
                                render: (data, type, row) => {
                                    return data || '';
                                }
                            },
                            {
                                width: '25%',
                                className: 'wrap-text',
                                data: 'date_created',
                                render: (data, type, row) => {
                                    if (data) {
                                        return $x.fn.displayRelativeTime(data);
                                    }
                                    return data;
                                }
                            },
                        ],
                        rowCallback: function (row, data, displayNum, displayIndex, dataIndex) {
                            $(row).find('input[type="checkbox"].row-select').on('change', function () {
                                if ($(this).prop('checked') === true) {
                                    selectedGroup.closest('.selected-file-cloud-group').fadeIn();
                                    selectedGroup.append(
                                        $(`
                                        <span 
                                            class="selected-file-cloud-item badge badge-soft-primary mr-1 mb-1" 
                                            data-id="${data.id}"
                                        >
                                            ${data.file_name}
                                            <script type="application/json" class="d-none">
                                                ${JSON.stringify(data)}
                                            </script>
                                        </span>
                                    `)
                                    )
                                } else {
                                    selectedGroup.find(`.selected-file-cloud-item[data-id="${data.id}"]`).remove();
                                    if (selectedGroup.find('.selected-file-cloud-item').length === 0) {
                                        selectedGroup.closest('.selected-file-cloud-group').fadeOut();
                                    }
                                }
                            })
                        },
                        initComplete: function (settings, json){
                            modalEle.find('button.save-change-file-cloud').on('click', function (){
                                let ids = {};
                                selectedGroup.find('.selected-file-cloud-item').each(function (){
                                    ids[$(this).attr('data-id')] = JSON.parse($(this).find('script').text());
                                })
                                let skipFileName = [];
                                Object.keys(ids).map(
                                    (key) => {
                                        let file_id = ids[key]?.['id'];
                                        if (file_id && clsThis.ui_check_id_exist(file_id)) skipFileName.push(ids[key].file_name);
                                        else clsThis.ui_load_file_data(ids[key]);
                                    }
                                )
                                if (skipFileName.length > 0){
                                    Swal.fire({
                                        position: "top-end",
                                        icon: "info",
                                        html: `<p>${clsThis.ele$.attr('data-msg-skip-exist-file')}</p> <b>${skipFileName.join(", ")}</b>`,
                                        showConfirmButton: false,
                                        timer: 1000,
                                    });
                                }
                            })
                        },
                    });
                }
            }
        })
    }

    event_for_destroy(element, hide_or_show){
        let itemEle = $(element).closest('.dad-file-control-group').find('.dm-uploader-result-list').find('button.btn-destroy-file').addClass('d-none');
        if (itemEle.length > 0){
            if (hide_or_show === 'hide') {
                itemEle.addClass('d-none')
            } else if (hide_or_show === 'show'){
                itemEle.removeClass('d-none')
            }
        }
    }

    ui_load_file_data(fileData) {
        let file_id = fileData?.['id'];
        if (file_id){
            if (!this.ui_check_id_exist(file_id)){
                let f_obj = new File([""], fileData.file_name, {
                    name: fileData.file_name,
                    type: fileData.file_type,
                    lastModified: $x.fn.parseDateTime(fileData.date_created),
                });
                Object.defineProperty(f_obj, 'remarks', {value: fileData.remarks});
                Object.defineProperty(f_obj, 'size', {value: fileData.file_size})
                this.ui_multi_add_file(fileData.id, f_obj);
                this.ui_multi_update_file_progress(fileData.id, null, 'state-f-success');
                this.ui_on_click_remove(
                    this.ele$.find(`.dm-uploader-result-item[data-file-id="${fileData.id}"]`)
                )
                this.ui_add_id(fileData.id);
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "info",
                    html: `<p>${this.ele$.attr('data-msg-skip-exist-file')}</p> <b>${fileData.file_name}</b>`,
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: this.ele$.attr('data-msg-upload-exception'),
            });
        }
    }

    _config() {
        let clsThis = this;
        return {
            url: '#',
            maxFileSize: 3 * 1024 * 1024, // 3 Megs (MB)
            allowedTypes: "*",
            extFilter: null,
            onDragEnter: function () {
                // Happens when dragging something over the DnD area
                this.addClass('active');
            },
            onDragLeave: function () {
                // Happens when dragging something OUT of the DnD area
                this.removeClass('active');
            },
            onInit: function () {
                // Plugin is ready to use
            },
            onComplete: function () {
                // All files in the queue are processed (success or error)
            },
            onNewFile: function (id, file) {
                // When a new file is added using the file selector or the DnD area
                clsThis.ui_multi_add_file(id, file);
            },
            onBeforeUpload: function (id) {
                // about tho start uploading a file
                clsThis.ui_multi_update_file_progress(id, 0, 'state-f-wait');
            },
            onUploadCanceled: function (id) {
                // Happens when a file is directly canceled by the user.
                clsThis.ui_multi_update_file_progress(id, 0, 'state-f-cancel');
            },
            onUploadProgress: function (id, percent) {
                // Updating file progress
                clsThis.ui_multi_update_file_progress(id, percent, 'state-f-progress');
            },
            onUploadSuccess: function (id, data) {
                // A file was successfully uploaded
                clsThis.ui_multi_update_file_progress(id, 100, 'state-f-success');
            },
            onUploadError: function (id, xhr, status, message) {
                clsThis.ui_multi_update_file_progress(id, 0, 'state-f-error');
            },
            onFallbackMode: function () {},
            onFileTypeError: function (file) {},
            onFileSizeError: function (file) {},
            onFileExtError: function (file) {},
            onDestroy: function (){
                $(element).addClass('d-none');
                this.onDisableDaD();
            },
            onDisableDaD: function (){
                $(this).find('input[type="file"]').prop('disabled', true).prop('readonly', true);
                $(this).find('button.btn-select-cloud').prop('disabled', true).prop('readonly', true);
                clsThis.event_for_destroy(this, 'hide');
            },
            onEnableDaD: function (){
                $(this).find('input[type="file"]').prop('disabled', false).prop('readonly', false);
                $(this).find('button.btn-select-cloud').prop('disabled', false).prop('readonly', false);
                clsThis.event_for_destroy(this, 'show');
            },
        }
    }

    constructor(ele$, opts = {}) {
        this.ele$ = ele$;
        this.config = {
            ...this._config(),
            ...opts,
        }
        this.init_opts = {};
    }

    init(opts = {}) {
        let clsThis = this;
        const config = this.config;

        if (!this.ele$.hasClass('dad-file-control-group')){
            this.ele$.find('.dad-file-control-group').each(function (){
                new FileControl(
                    $(this),
                    config,
                ).init(opts);
            });
            return;
        } else {
            opts = {
                'name': '',
                'data': [],
                ...(
                    opts?.['enable_edit'] === true || opts?.['enable_edit'] === undefined ? {
                        'readonly': false,
                        'disabled': false,
                        'enable_choose_file': true,
                        'enable_remove': true,
                    }: {
                        'readonly': true,
                        'disabled': true,
                        'enable_choose_file': false,
                        'enable_remove': false,
                    }
                ),
                'required': false,
                ...opts
            }
            this.init_opts = opts;
            this.ele$.each(function () {
                let groupEle = $(this);
                let dmUploaderEle = $(groupEle).find('.dm-uploader');
                let dmResults = $(groupEle).find('.dm-uploader-results')

                if (dmUploaderEle.length > 0 && dmResults.length > 0) {
                    dmUploaderEle.dmUploader({
                        ...config,
                        extraData: async function(fileId, fileData){
                            return await Swal.fire({
                                input: "text",
                                title: groupEle.attr('data-msg-description-file'),
                                html: fileData.name,
                                inputAttributes: {
                                    autocapitalize: "off"
                                },
                                cancelButtonText: $.fn.transEle.attr('data-cancel'),
                                showCancelButton: true,
                                allowOutsideClick: false,
                                preConfirm: (remark) => {
                                    return {'remarks': remark}
                                },
                            }).then(
                                async (result) => {
                                    if (result.isConfirmed) {
                                        return {
                                            'state': true,
                                            'data': result.value,
                                        }
                                    } else {
                                        clsThis.ui_remove_line_file_by_id(fileId);
                                        return {
                                            'state': false,
                                            'data': 'CANCEL',
                                        }
                                    }
                                }
                            )
                        },
                        url: $(clsThis.ele$).attr('data-url'),
                        headers: {
                            'X-CSRFToken': clsThis.ele$.find('input[name="csrfmiddlewaretoken"]').val()
                        },
                        onUploadSuccess: function (id, data){
                            let fileData = data?.['data']?.['file_detail'] || null;
                            if (typeof fileData === 'object' && fileData.hasOwnProperty('id')){
                                config.onUploadSuccess(id, data);
                                let eleItem = clsThis.ele$.find(`.dm-uploader-result-item[data-file-id="${id}"]`);
                                eleItem.attr('data-file-id', data);
                                eleItem.find('input.file-txt-remark').val(fileData.remarks);
                                clsThis.ui_on_click_remove(eleItem);
                                clsThis.ui_add_id(fileData.id);
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: clsThis.ele$.attr('data-msg-upload-exception'),
                                });
                            }
                        },
                        onUploadError: function (id, xhr, status, message) {
                            config.onUploadError(id, xhr, status, message);
                            Swal.fire({
                                icon: 'error',
                                title: clsThis.ele$.attr('data-msg-upload-exception'),
                            });
                            clsThis.ui_remove_line_file_by_id(id);
                        },
                        onInit: function () {
                            // append input file ids storages
                            $(dmResults).append(`
                                <input 
                                    type="text" 
                                    ${opts.name ? 'name="' + opts.name + '"' : ''} 
                                    value="" 
                                    class="dm-uploader-ids hidden" 
                                    ${opts.readonly ? "readonly": ""}
                                    ${opts.disabled ? "disabled": ""}
                                    ${opts.required ? "required": "" }
                                />
                            `);

                            // init table file cloud
                            clsThis.ui_on_show_file_cloud();

                            // update input file
                            clsThis.ui_update_input_file(config);

                            // resolve exist data
                            if (Array.isArray(opts.data) && opts.data.length > 0){
                                opts.data.map((item) => clsThis.ui_load_file_data(item))
                            } else {
                                clsThis.ele$.find('.dm-uploader-no-files').show();
                            }

                            // show choose file
                            if (!opts.enable_choose_file){
                                dmUploaderEle.remove();
                            }
                            // show remove file exist
                            if (!opts.enable_remove){
                                clsThis.ele$.find('button.btn-destroy-file').remove()
                            }
                        },
                        onFileTypeError: function (file) {
                            let templateTitle = clsThis.ele$.find('.template-title-error-type').html();
                            let templateData = clsThis.ele$.find('.instruction-upload-file-text').html();

                            Swal.fire({
                                title: templateTitle,
                                icon: "error",
                                html: templateData,
                            });
                        },
                        onFileSizeError: function (file) {
                            let templateTitle = clsThis.ele$.find('.template-title-error-size').html();
                            let templateData = clsThis.ele$.find('.instruction-upload-file-text').html();

                            Swal.fire({
                                title: templateTitle,
                                icon: "error",
                                html: templateData,
                            });
                        },
                        onFileExtError: function (file) {
                            let templateTitle = clsThis.ele$.find('.template-title-error-type').html();
                            let templateData = clsThis.ele$.find('.instruction-upload-file-text').html();

                            Swal.fire({
                                title: templateTitle,
                                icon: "error",
                                html: templateData,
                            });
                        },
                    });
                }
            });
        }
    }
}

let $x = {
    cls: {
        frm: SetupFormSubmit,
        window: WindowControl,
        wf: WFRTControl,
        util: UtilControl,
        dtb: DTBControl,
        person: PersonControl,
        doc: DocumentControl,
        bastionField: BastionFieldControl,
        excelToJSON: ExcelToJSON,
        datetime: DateTimeControl,
        file: FileControl,
    },
    fn: {
        fileInit: FileUtils.init,

        setWFRuntimeID: WFRTControl.setWFRuntimeID,

        getRowData: DTBControl.getRowData,
        deleteRow: DTBControl.deleteRow,
        updateDataRow: DTBControl.updateDataRow,
        getSelection: DTBControl.getTableSelected,

        redirectLogin: WindowControl.redirectLogin,

        showLoadingButton: WindowControl.showLoadingButton,
        hideLoadingButton: WindowControl.hideLoadingButton,
        showLoadingPage: WindowControl.showLoading,
        hideLoadingPage: WindowControl.hideLoading,
        showLoadingWaitResponse: WindowControl.showLoadingWaitResponse,
        hideLoadingWaitResponse: WindowControl.hideLoadingWaitResponse,

        shortNameGlobe: PersonControl.shortNameGlobe,
        renderAvatar: PersonControl.renderAvatar,

        renderCodeBreadcrumb: DocumentControl.renderCodeBreadcrumb,
        buttonLinkBlank: DocumentControl.buttonLinkBlank,
        closeCard: DocumentControl.closeCard,
        openCard: DocumentControl.openCard,

        getFeatureCode: BastionFieldControl.getFeatureCode,

        parseDateTime: UtilControl.parseDateTime,
        parseDate: UtilControl.parseDate,
        parseJson: UtilControl.parseJson,
        dumpJson: UtilControl.dumpJson,
        convertToSlug: UtilControl.convertToSlug,

        randomStr: UtilControl.generateRandomString,
        checkUUID4: UtilControl.checkUUID4,
        checkNumber: UtilControl.checkNumber,

        removeEmptyValuesFromObj: UtilControl.removeEmptyValuesFromObj,
        getRandomArbitrary: UtilControl.getRandomArbitrary,
        getRandomInArray: UtilControl.getRandomInArray,
        keepExistInOther: UtilControl.keepExistInOther,
        removeExistInOther: UtilControl.removeExistInOther,

        popKey: UtilControl.popKey,
        getKey: UtilControl.getKey,

        hasOwnProperties: UtilControl.hasOwnProperties,

        displayRelativeTime: UtilControl.displayRelativeTime,

        reformatData: DateTimeControl.reformatData,
        parseToMoment: DateTimeControl.parseToMoment,
        convertDatetime: DateTimeControl.convertData,
        convertEleDate: DateTimeControl.convertEleDate,
        convertEleDatetime: DateTimeControl.convertEleDatetime,
        convertDateToMoment: DateTimeControl.convertDateToMoment,
        convertDatetimeToMoment: DateTimeControl.convertDatetimeToMoment,

        randomColor: Beautiful.randomColorClass
    },
}


String.format = function () {
    // String.format("{0} : {1}", "Fullname", "Nguyen Van A") => "Fullname : Nguyen Van A"
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
        let reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}
String.format_by_key = function () {
    let s = arguments[0];
    let objKey = arguments[1];
    Object.keys(objKey).forEach(function (key) {
        s = s.replace(new RegExp("\\{" + key + "\\}", "gm"), objKey[key]);
    });
    return s;
}

String.prototype.format_by_idx = function () {
    // argument of function start 0+ for fill to this
    // `<a href="{0}">{1}</a>`.format("http://...", "Tag a")
    // Return ==> `<a href="http://...">Tag A</a>`
    let s = this.toString();
    return s.replace(/\{(\d)\}/gm, (match, index) => arguments[index]);
}

String.prototype.format_url_with_uuid = function (uuid) {
    let s = this.toString();
    let reg = new RegExp(/([0-9])$/, "gm");
    s = s.replace(reg, uuid);
    return s;
}

String.prototype.format_by_key = function (objKey) {
    // objKey: Object Key-Value fill to this
    // `<a href="{href}">{title}</a>`.format_by_key({"href": "http://...", "title": "Tag A"})
    // Return ==> `<a href="http://...">Tag A</a>`
    let s = this.toString();
    Object.keys(objKey).forEach(function (key) {
        s = s.replace(new RegExp("\\{" + key + "\\}", "gm"), objKey[key]);
    });
    return s;
}

// return boolean value
// accept to type string with dashes and without dashes
String.prototype.valid_uuid4 = function () {
    let isCheck = this.toString()
    if (this.toString().indexOf('-') === -1) {
        isCheck = this.toString().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/g, '$1-$2-$3-$4-$5')
    }
    return /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(isCheck);
}

Array.prototype.convert_to_key = function (key = 'id') {
    if (Array.isArray(this)) {
        let objData = {};
        this.map((item) => {
            objData[item[key]] = item
        })
        return objData;
    }
    return {};
}

// -- Array Customize}
/**
 * common function for DataTable action
 */
var DataTableAction = {
    'delete': function (url, data, crf, row) {
        let div = jQuery('<div>');
        let $transElm = $('#trans-factory')
        let $content = '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' + `<div class="modal-header"><h5 class="modal-title">${$transElm.data('terms-mess_tit')}</h5></div>` + `<div class="modal-body"><p class="text-center">${$transElm.data('terms-mess')}</p></div>` + '<div class="modal-footer justify-content-between">' + `<button type="button" class="btn btn-primary" data-type="confirm">${$transElm.data('terms-config')}</button>` + `<button type="reset" class="btn btn-outline-primary" data-type="cancel">${$transElm.data('terms-cancel')}` + '</button></div></div></div>';
        div.addClass('modal fade')
        div.html($content)
        div.appendTo('body');
        div.modal('show');
        div.find('.btn').off().on('click', function (e) {
            if ($(this).attr('data-type') === 'cancel') div.remove(); else {
                $.fn.callAjax2({
                    url: url,
                    method: 'DELETE',
                    data: data,
                }).then((res) => {
                    if (res.hasOwnProperty('status')) {
                        div.modal('hide');
                        div.remove();
                        if ($(row).length) $(row).closest('.table').DataTable().rows(row).remove().draw();
                        $.fn.notifyB({
                            description: res?.data?.message ? res.data.message : 'Delete item successfully'
                        }, 'success')
                    }
                });
            }
        })
    },
    'status': function (stt) {
        let html = '';
        const $baseTrans = $.fn.transEle
        const listSys = {
            '0': $baseTrans.attr('data-draft'),
            '1': $baseTrans.attr('data-created'),
            '2': $baseTrans.attr('data-added'),
            '3': $baseTrans.attr('data-finish'),
            '4': $baseTrans.attr('data-cancel'),
        }
        html = `<span>${listSys[stt]}</span>`
        return html
    },
    'item_view': function (data, link, format = null) {
        const $elmTrans = $.fn.transEle;
        let keyArg = [
            {
                name: $elmTrans.attr('data-title'),
                value: 'title'
            }, {
                name: $elmTrans.attr('data-code'),
                value: 'code'
            },
        ];
        if (format) keyArg = JSON.parse(templateFormat.replace(/'/g, '"'));


        let htmlContent = `<h6 class="dropdown-header header-wth-bg">${$elmTrans.attr('data-more-info')}</h6>`;
        for (let key of keyArg) {
            if (data.hasOwnProperty(key.value)) htmlContent += `<div class="mb-1"><h6><i>${key.name}</i></h6><p>${data[key.value]}</p></div>`;
        }
        if (link) {
            link = link.format_url_with_uuid(data['id']);
            htmlContent += `<div class="dropdown-divider"></div><div class="text-right">
            <a href="${link}" target="_blank" class="link-primary underline_hover">
                <span>${$elmTrans.attr('data-view-detail')}</span>
                <span class="icon ml-1">
                    <i class="bi bi-arrow-right-circle-fill"></i>
                </span>
            </a></div>`;
        }
        return htmlContent
    }
}
