function buildSelect2() {
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

function change_space() {
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
        $.fn.showLoading();
        $.fn.callAjax(urlData, methodData, {'space_code': spaceCode}, true,).then((resp) => {
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
                $.fn.hideLoading();
            }, 1000);
        }, (errs) => {
            $.fn.hideLoading();
        })
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

function active_menu(item) {
    if (item.length > 0) {
        item.first().addClass('active')
        let parent = item.first().parents('.nav-item');
        if (parent.length > 0) {
            parent.first().addClass('active');
            active_menu(parent.first());
        }
    }
    return null;
}

function menu_handler() {
    let nav_data = $('#get-menu-active');
    let menu_id_active = nav_data.attr('data-nav-menu');
    if (menu_id_active) {
        let ele_menu = $('#' + menu_id_active);
        if (ele_menu) {
            active_menu(ele_menu);
        }
    }
    let tenant_code_active = nav_data.attr('data-nav-tenant');
    if (tenant_code_active) $('#menu-tenant').children('option[value=' + tenant_code_active + ']').attr('selected', 'selected');
}

class UrlGatewayReverse {
    static get_url(docID, docAppCode) {
        let arrAppCode = docAppCode.split(".");
        let urlData = '#';
        if (docID && arrAppCode.length === 2) {
            urlData = $.fn.storageSystemData.attr('data-GatewayMiddleDetailView').replaceAll(
                '_plan_', arrAppCode[0]
            ).replaceAll(
                '_app_', arrAppCode[1]
            ).replaceAll(
                '_pk_', docID
            ) + "?redirect=true";
        }
        return urlData;
    }
}

class LogController {
    constructor() {
        this.groupLogEle = $('#drawer_log_data');
        this.tabLog = $('#tab_block_diagram');
        this.logUrl = this.tabLog.attr('data-url');
        this.blockDataRuntime = $('#idxDataRuntime');
        this.tabActivityLog = $('#tab_block_activities');
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
                    let childLogHTML = `<div class="mt-3"><span class="badge badge-secondary badge-outline mr-1">${$.fn.parseDateTime(itemLog?.['date_created'])}</span>`;
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
            let dateCreatedHTML = `<span class="badge badge-dark badge-outline mr-1">${$.fn.parseDateTime(item.date_created)}</span>`;
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

        // log runtime
        if (this.logUrl && (!this.groupLogEle.attr('data-log-runtime-loaded') || forceLoad === true)) {
            if (!runtimeID) runtimeID = $.fn.getWFRuntimeID();
            if (runtimeID) {
                this.blockDataRuntime.showLoadingWaitResponse();
                this.blockDataRuntime.empty();
                $.fn.callAjax(SetupFormSubmit.getUrlDetailWithID(this.logUrl, runtimeID), 'GET',).then((resp) => {
                    this.groupLogEle.attr('data-log-runtime-loaded', true);
                    let data = $.fn.switcherResp(resp);
                    if (data && $.fn.hasOwnProperties(data, ['diagram_data'])) {
                        let diagram_data = data['diagram_data'];
                        let stages = diagram_data['stages'];
                        this.blockDataRuntime.html(this.parseLogOfDoc(stages)).removeClass('hidden').hideLoadingWaitResponse();
                    }
                })
            }
        }

        // log activities
        if (!pkID) pkID = this.tabActivityLog.attr('data-id-value');
        if (this.activityUrl && pkID && (!this.groupLogEle.attr('data-log-activity-loaded') || forceLoad === true)) {
            this.blockDataActivities.showLoadingWaitResponse();
            this.blockDataActivities.empty();
            $.fn.callAjax(this.activityUrl, 'GET', {'doc_id': pkID}, true,).then((resp) => {
                this.groupLogEle.attr('data-log-activity-loaded', true);
                let data = $.fn.switcherResp(resp);
                if (data && data['status'] === 200 && data.hasOwnProperty('log_data')) {
                    this.blockDataActivities.append(this.parseLogActivities(data['log_data'])).hideLoadingWaitResponse();
                }
            }, (errs) => {

            })
        }
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
        $.fn.callAjax(this.notifyCountUrl, 'GET',).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && data.hasOwnProperty('count') && data['count'] > 0) {
                this.bellCount.text(data['count']);
                this.bellIdxIcon.addClass('my-bell-ring');
            }
        })
    }

    // main
    active() {
        new NotifyPopup().cleanChildNotifyBlock();
        let realThis = this;
        if (realThis.notifyCountUrl) realThis.checkNotifyCount();
        realThis.dropdownData.on("show.bs.dropdown", function () {
            let dataArea = $('#idxNotifyShowData');
            dataArea.showLoadingWaitResponse();
            dataArea.empty();

            let dataUrl = $(this).attr('data-url');
            let dataMethod = $(this).attr('data-method');

            $.fn.callAjax(dataUrl, dataMethod).then((resp) => {
                let data = $.fn.switcherResp(resp);
                let arr_no_seen = [];
                let arr_seen = [];
                if (data && data.hasOwnProperty('notify_data')) {
                    data['notify_data'].map((item) => {
                        let senderData = item?.['employee_sender_data']?.['full_name'];
                        let urlData = UrlGatewayReverse.get_url(item['doc_id'], item['doc_app']);
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
                                                 <span class="badge badge-soft-success">${item?.['doc_app']}</span>
                                                 <div class="notifications-time">${item?.['date_created']}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        `;
                        if (item?.['is_done'] === true) arr_seen.push(tmp);
                        else arr_no_seen.push(tmp);
                    })
                }
                if (arr_no_seen.length > 0 || arr_seen.length > 0) {
                    dataArea.append(arr_no_seen.join("") + arr_seen.join(""));
                } else {
                    dataArea.append(`<small class="text-muted">${$.fn.transEle.attr('data-no-data')}</small>`);
                }
                dataArea.hideLoadingWaitResponse();
            }, (errs) => {
                dataArea.hideLoadingWaitResponse();
            })
        });
        realThis.btnSeenAll.click(function (event) {
            event.preventDefault();
            let dataUrl = $(this).attr('data-url');
            let dataMethod = $(this).attr('data-method');
            if (dataUrl && dataMethod) {
                $.fn.callAjax(dataUrl, dataMethod, {}, true,).then((resp) => {
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
                $.fn.callAjax(dataUrl, dataMethod, {}, true,).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data['status'] === 204) {
                        realThis.checkNotifyCount();
                    }
                },)
            }
        });
    }
}

class ListeningEventController {
    switchCompany() {
        $('#btn-call-switch-company').click(function () {
            let current_company_id = $('#company-current-id').attr('data-id');
            let company_id_selected = $("input[name='switch_current_company']:checked").val();
            if (current_company_id !== company_id_selected) {
                $.fn.callAjax($(this).attr('data-url'), $(this).attr('data-method'), {
                    'company': company_id_selected
                }, $('input[name=csrfmiddlewaretoken]').val(),).then((resp) => {
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
                $.fn.callAjax(urlData, 'GET').then((resp) => {
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
                },)
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
            $.fn.setBtnIDLastSubmit($(this).attr('id'));
        });
        // Submit support on listen from button
        $('.btn_support_submit').click(function (e) {
            let frm_id = $(this).attr('data-form-id');
            if (frm_id) {
                $('#' + frm_id).submit();
            }
        });
    }

    formInputClickOpenEdit() {
        $.fn.formDetailToUpdateAction();
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
            return $.fn.callActionWF($(this))
        });
        // Edit in Zone at DocDetail Page
        $('#btn-active-edit-zone-wf').click(function (event) {
            event.preventDefault();
            $(this).addClass('hidden');
            $.fn.activeZoneInDoc();
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
        <!-- Init Mask Money -->
        $.fn.initMaskMoney2();
        <!-- ## Init Mask Money -->
    }

    ticket() {
        <!-- Raise a ticket -->
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

            $.fn.showLoading();
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
                    $.fn.hideLoading();
                },
                error: function (response) {
                    $.fn.notifyB({
                        'description': 'Try again!'
                    }, 'failure');
                    $.fn.hideLoading();
                }
            });
        });
        <!-- ## Raise a ticket -->
    }

    dataTable() {
        <!-- Loading table ajax -->
        $(document).find('table').each((idx, tbl) => {
            if (!$(tbl).attr('load-data-hide-spinner')) {
                $(tbl).on('preXhr.dt', (e, settings, data) => {
                    // show loading full page
                    // $.fn.showLoading();

                    // show loading tbody table
                    $(tbl).find('tbody').showLoadingWaitResponse();
                });
                $(tbl).on('draw.dt', () => {
                    // hide loading full page
                    // $.fn.hideLoading();

                    // hide loading tbody table
                    $(tbl).find('tbody').hideLoadingWaitResponse();
                });
            }
        });
        <!-- ## Loading table ajax -->
    }

    navAndMenu() {
        <!-- Toggle Collapse -->
        $('.hk-navbar-togglable').click(function (event) {
            $(this).find('.icon').children().toggleClass('d-none');
        });
        <!-- ## Toggle Collapse -->

        <!-- Space current -->
        change_space();
        <!-- ## Space current -->


        <!-- Active menu -->
        menu_handler();
        <!-- ## Active menu -->
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
    }
}

// function extend to jQuery
$.fn.extend({
    // system
    storageSystemData: $('#storageSystemData'),
    isDebug: function () {
        return $.fn.parseBoolean($.fn.storageSystemData.attr('data-flagIsDebug'), false)
    },
    eleHrefActive: function (url) {
        let link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
    },

    // element
    transEle: $('#base-trans-factory'),
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

    // utils
    classOfPlan: function (code) {
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
    },
    parseJsonDefault: function (data, defaultReturn = {}) {
        try {
            return JSON.parse(data);
        } catch (error) {
            return defaultReturn;
        }
    },
    dumpJsonDefault: function (data, defaultReturn = '{}') {
        try {
            return JSON.stringify(data);
        } catch (error) {
            return defaultReturn;
        }
    },
    generateRandomString: function (length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    arraysEqual: function (a, b) {
        if (a.length !== b.length) return false;
        return a.every((value, index) => value === b[index]);
    },
    arrayIncludesAll: function (a, b) {
        return b.every(value => a.includes(value));
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
    isBoolean(value) {
        return typeof value === 'boolean';
    },
    parseBoolean: function (value, no_value_is_false = false, defaultReturn = null) {
        if (typeof value === 'boolean') return value;
        if (value === 1 || value === '1' || value === 'true' || value === 'True') return true;
        if (value === 0 || value === '0' || value === 'false' || value === 'False') return false;

        if (!value && no_value_is_false === true) return false;
        return null;
    },
    initElementInitSelect: function (opts, html_or_$ = 'html') {
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
                throw Error('Init Select must be return type choice in: [html, object $]')
        }
    },
    sumArray: (array) => {
        return array.reduce(function (acc, currentValue) {
            return acc + currentValue;
        }, 0);
    },
    getValueOrEmpty: function (objData, key) {
        if (typeof objData === 'object' && typeof key === 'string') {
            if (objData.hasOwnProperty(key) && objData[key]) {
                return objData[key];
            }
        }
        return '';
    },
    parseDateTime: (dateStrUTC, microSecondLength = 0) => {
        let dateNew = new Date(Date.parse(dateStrUTC));
        return "{day}/{month}/{year} {hour}:{minute}:{second}".format_by_key({
            day: dateNew.getDate().toString().padStart(2, '0'),
            month: (dateNew.getMonth() + 1).toString().padStart(2, '0'),
            year: dateNew.getFullYear().toString(),
            hour: dateNew.getHours().toString().padStart(2, '0'),
            minute: dateNew.getMinutes().toString().padStart(2, '0'),
            second: dateNew.getSeconds().toString().padStart(2, '0'),
        }) + (microSecondLength > 0 ? ("." + dateNew.getMilliseconds().toString().padStart(3, '0')) : "")
    },
    parseDate: (dateStrUTC) => {
        let dateNew = new Date(Date.parse(dateStrUTC));
        return "{day}/{month}/{year}".format_by_key({
            day: dateNew.getDate().toString().padStart(2, '0'),
            month: (dateNew.getMonth() + 1).toString().padStart(2, '0'),
            year: dateNew.getFullYear().toString(),
        })
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
    getPkDetail: function () {
        return $.fn.storageSystemData.attr('data-idPKDetail');
    },
    getElePageContent: function () {
        return $('#idxPageContent');
    },
    getElePageAction: function () {
        return $("#idxPageAction");
    },
    setBtnIDLastSubmit: function (idx) {
        $.fn.storageSystemData.attr('data-idBtnIDLastSubmit', idx);
    },
    getBtnIDLastSubmit: function () {
        return $.fn.storageSystemData.attr('data-idBtnIDLastSubmit');
    },

    // default components
    dateRangePickerDefault: function (opts) {
        $(this).daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            startDate: moment().startOf('hour'),
            showDropdowns: true,
            minYear: 1901,
            "cancelClass": "btn-secondary",
            locale: {
                format: 'MM/DD/YYYY hh:mm A'
            }, ...(opts && typeof opts === 'object' ? opts : {})
        });
    },

    // notify
    notifyB: function (option, typeAlert = null) {
        setTimeout(function () {
            $('.alert.alert-dismissible .close').addClass('btn-close').removeClass('close');
        }, 100);
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
    notifyPopup: function (option, typeAlert = 'info') {
        // option: Object
        //     - title: title notify
        //     - description: content of notify
        // typeAlert: string
        //     - Choice in info, success, failure, warning
        if (typeAlert === 'success') {
            new NotifyPopup().success(option);
        } else if (typeAlert === 'failure') {
            new NotifyPopup().error(option);
        } else if (typeAlert === 'warning') {
            new NotifyPopup().warning(option);
        } else if (typeAlert === 'info') {
            new NotifyPopup().info(option)
        }
    },
    notifyErrors: (errs) => {
        if (errs) {
            if (typeof errs === 'object') {
                let errors_converted = jQuery.fn.cleanDataNotify(errs);
                Object.keys(errors_converted).map((key) => {
                    let notify_data = $.fn.storageSystemData.attr('data-flagNotifyKey') === '1' ? {
                        'title': key,
                        'description': errors_converted[key]
                    } : {
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
    },

    // Config
    getCompanyConfig: async function () {
        let dataText = $.fn.storageSystemData.attr('data-urlCompanyConfigData');
        if (!dataText || dataText === '') {
            let companyConfigUrl = $.fn.storageSystemData.attr('data-urlCompanyConfig');
            if (companyConfigUrl) {
                return await $.fn.callAjax(companyConfigUrl, 'GET').then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    dataText = JSON.stringify(data);
                    $.fn.storageSystemData.attr('data-urlCompanyConfigData', dataText);
                    return data;
                }).then((rs) => {
                    return rs
                });
            }
        } else return JSON.parse(dataText);
    },
    getCompanyCurrencyConfig: async function () {
        let data = await $.fn.getCompanyConfig();
        return data['config']?.['currency_rule'];
    },

    // FORM handler
    serializerObject: function (formSelected) {
        return formSelected.serializeArray().reduce((o, kv) => ({
            ...o,
            [kv.name]: kv.value
        }), {});
    },
    formSubmit: function (formElement, notify = {
        'success': true,
        'failure': true
    }, enableRedirect = true,) {
        return new Promise(function (resolve, reject) {
            let frm = new SetupFormSubmit($(formElement));
            if (frm.dataUrl && frm.dataMethod) {
                $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm).then((resp) => {
                    if (notify.success) $.fn.notifyB({description: resp.detail}, 'info');
                    resolve(resp);
                    if (enableRedirect) if (frm.dataUrlRedirect) $.fn.redirectUrl(frm.dataUrlRedirect, frm.dataRedirectTimeout);
                }, (err) => {
                    if (notify.failure) $.fn.notifyB({description: err.detail}, 'failure');
                    if (reject) {
                        reject(err);
                    }
                })
            } else throw 'Setup call raise exception with URL or method is incorrect.!';
        });
    },
    formDetailToUpdateAction: function () {
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
    },

    // CURRENCY handler
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
            $.fn.getCompanyCurrencyConfig().then((configData) => {
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

    // HTTP response, redirect, Ajax
    switcherResp: function (resp) {
        if (typeof resp === 'object') {
            let status = 500;
            if (resp.hasOwnProperty('status')) {
                status = resp.status;
            }
            switch (status) {
                case 200:
                    return resp.data
                case 201:
                    return resp.data
                case 204:
                    $.fn.notifyB({
                        'description': $.fn.transEle.attr('data-success'),
                    }, 'success')
                    return {'status': status}
                case 400:
                    let mess = resp.data;
                    if (resp.data.hasOwnProperty('errors')) mess = resp.data.errors;
                    $.fn.notifyErrors(mess);
                    return {};
                case 401:
                    $.fn.notifyB({'description': resp.data}, 'failure');
                    return jQuery.fn.redirectLogin(1000);
                // return {}
                case 403:
                    jQuery.fn.notifyB({'description': resp.data.errors}, 'failure');
                    return {};
                case 500:
                    return {};
                default:
                    return {};
            }
        }
    },
    cleanDataNotify: (data) => {
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
    },
    redirectLogin: function (timeout = 0, location_to_next = true) {
        if (location_to_next === true) {
            jQuery.fn.redirectUrl('/auth/login', timeout, 'next=' + window.location.pathname);
        } else {
            jQuery.fn.redirectUrl('/auth/login', timeout, '');
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
    callAjax: function (url, method, data = {}, csrfToken = null, headers = {}, content_type = "application/json") {
        return new Promise(function (resolve, reject) {
            // handle body data before send
            // if BtnIdLastSubmit = 'idxSaveInZoneWF' => is update data in zones
            // check WF ID, task ID, url exist PK
            // False: return data input
            // True: convert body data with Zone Accept
            let pk = $.fn.getPkDetail();
            if (($.fn.getBtnIDLastSubmit() === 'idxSaveInZoneWF' || $.fn.getBtnIDLastSubmit() === 'idxSaveInZoneWFThenNext') && $.fn.getWFRuntimeID() && $.fn.getTaskWF() && pk && url.includes(pk) && (method === 'PUT' || method === 'put')) {
                let taskID = $.fn.getTaskWF();
                let keyOk = $.fn.getZoneKeyData();
                let newData = {};
                for (let key in data) {
                    if (keyOk.includes(key)) {
                        newData[key] = data[key];
                    }
                }
                data = newData;
                data['task_id'] = taskID;
            }

            // Setup then Call Ajax
            let ctx = {
                url: url,
                type: method,
                dataType: 'json',
                contentType: content_type,
                data: content_type === "application/json" ? JSON.stringify(data) : data,
                headers: {
                    "X-CSRFToken": (csrfToken === true ? $("input[name=csrfmiddlewaretoken]").val() : csrfToken), ...headers
                },
                success: function (rest, textStatus, jqXHR) {
                    let data = $.fn.switcherResp(rest);
                    if (data) {
                        if ($.fn.getBtnIDLastSubmit() === 'idxSaveInZoneWFThenNext') {
                            let btnSubmit = $('#idxSaveInZoneWFThenNext');
                            let dataWFAction = btnSubmit.attr('data-wf-action');
                            if (btnSubmit && dataWFAction) {
                                let eleActionDoneTask = $('.btn-action-wf[data-value=' + dataWFAction + ']');
                                if (eleActionDoneTask.length > 0) {
                                    $.fn.setBtnIDLastSubmit(null);
                                    $(eleActionDoneTask[0]).attr('data-success-reload', false)
                                    $.fn.callActionWF($(eleActionDoneTask[0])).then(() => {
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
                        $.fn.switcherResp(resp_data);
                        reject(resp_data);
                    } else if (jqXHR.status === 204) reject({'status': 204});
                },
            };
            if (method.toLowerCase() === 'get') ctx.data = data
            $.ajax(ctx);
        });
    },

    // Table: loading
    _parseDomDtl: function (opts) {
        let domDTL = "<'row miner-group'<'col-sm-12 col-md-3 col-lg-2 mt-3'f>>" + "<'row mt-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'p>>" + "<'row mt-3'<'col-sm-12'tr>>" + "<'row mt-3'<'col-sm-12 col-md-6'i>>";
        let utilsDom = {
            // "l": Đại diện cho thanh điều hướng (paging) của DataTable.
            // "f": Đại diện cho hộp tìm kiếm (filtering) của DataTable.
            // "t": Đại diện cho bảng (table) chứa dữ liệu.
            // "i": Đại diện cho thông tin về số hàng hiển thị và tổng số hàng.
            // "p": Đại diện cho thanh phân trang (pagination).
            // "r": Đại diện cho sắp xếp (ordering) của các cột.
            // "s": Đại diện cho hộp chọn số hàng hiển thị.
            visiblePaging: true, // "l"
            visibleSearchField: true,   // "f"
            visibleDisplayRowTotal: true,   // "i"
            visiblePagination: true,   // "p"
            visibleOrder: true,   // "r"
            visibleRowQuantity: true,   // "s"
        }

        // show or hide search field
        if (opts.hasOwnProperty('visiblePaging')) {
            if ($.fn.isBoolean(opts['visiblePaging'])) utilsDom.visiblePaging = opts['visiblePaging'];
            if (utilsDom.visiblePaging === false) domDTL = domDTL.replace('l>', '>');
            delete opts['visiblePaging']
        }
        // show or hide search field
        if (opts.hasOwnProperty('visibleSearchField')) {
            if ($.fn.isBoolean(opts['visibleSearchField'])) utilsDom.visibleSearchField = opts['visibleSearchField'];
            if (utilsDom.visibleSearchField === false) {

                domDTL = domDTL.replace('f>', '>').replaceAll('miner-group', 'miner-group hidden');
            }
            delete opts['visibleSearchField']
        }
        // show or hide search field
        if (opts.hasOwnProperty('visibleDisplayRowTotal')) {
            if ($.fn.isBoolean(opts['visibleDisplayRowTotal'])) utilsDom.visibleDisplayRowTotal = opts['visibleDisplayRowTotal'];
            if (utilsDom.visibleDisplayRowTotal === false) domDTL = domDTL.replace('i>', '>');
            delete opts['visibleDisplayRowTotal']
        }
        // show or hide search field
        if (opts.hasOwnProperty('visiblePagination')) {
            if ($.fn.isBoolean(opts['visiblePagination'])) utilsDom.visiblePagination = opts['visiblePagination'];
            if (utilsDom.visiblePagination === false) domDTL = domDTL.replace('p>', '>');
            delete opts['visiblePagination']
        }
        // show or hide search field
        if (opts.hasOwnProperty('visibleOrder')) {
            if ($.fn.isBoolean(opts['visibleOrder'])) utilsDom.visibleOrder = opts['visibleOrder'];
            if (utilsDom.visibleOrder === false) domDTL = domDTL.replace('r>', '>');
            delete opts['visibleOrder']
        }
        // show or hide search field
        if (opts.hasOwnProperty('visibleRowQuantity')) {
            if ($.fn.isBoolean(opts['visibleRowQuantity'])) utilsDom.visibleRowQuantity = opts['visibleRowQuantity'];
            if (utilsDom.visibleRowQuantity === false) domDTL = domDTL.replace('s>', '>');
            delete opts['visibleRowQuantity']
        }

        return [opts, domDTL];
    },
    _parseDtlOpts: function (opts) {
        // init table
        let [parsedOpts, domDTL] = $.fn._parseDomDtl(opts);

        // reload currency in table
        let reloadCurrency = opts?.['reloadCurrency'];
        if (opts.hasOwnProperty('reloadCurrency')) delete opts['reloadCurrency'];
        reloadCurrency = $.fn.isBoolean(reloadCurrency) ? reloadCurrency : false;

        // row callback |  rowIdx = true
        let rowIdx = opts?.['rowIdx'];
        if (opts.hasOwnProperty('rowIdx')) delete opts['rowIdx'];

        // ajax
        if (opts?.['ajax']) {
            if (opts['ajax']['url']) {
                if (!opts['ajax']?.['error']) {
                    opts['ajax']['error'] = function (xhr, error, thrown) {
                        $.fn.switcherResp(xhr?.['responseJSON']);
                        if ($.fn.isDebug() === true) console.log(xhr, error, thrown);
                    }
                }
            } else {
                if ($.fn.isDebug() === true) console.log('Ajax table cancels load data because config url Ajax is blank. Please config it, then try again!', {...opts});
                delete opts['ajax'];
                opts['data'] = [];
            }

        }

        // return data
        let configFinal = {
            // scrollY: '400px',
            // scrollCollapse: true,
            // fixedHeader: true,
            autoFill: false,
            search: $.fn.DataTable.ext.type.search['html-numeric'],
            searching: true,
            ordering: false,
            paginate: true,
            pageLength: 10,
            dom: domDTL,
            language: {
                url: $.fn.storageSystemData.attr('data-msg-datatable-language-config').trim(),
            },
            lengthMenu: [
                [5, 10, 25, 50, -1], [5, 10, 25, 50, $.fn.transEle.attr('data-all')],
            ],
            drawCallback: function () {
                $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-rounded pagination-simple');
                feather.replace();
                if (reloadCurrency === true) {
                    // reload all currency
                    $.fn.initMaskMoney2();
                }
                // buildSelect2();
                setTimeout(() => {
                    buildSelect2();
                }, 0)
            },
            initComplete: function () {
                $(this.api().table().container()).find('input').attr('autocomplete', 'off');
            },
            rowCallback: function (row, data, index) {
                if (rowIdx === true) $('td:eq(0)', row).html(index + 1);
            },
            data: [], ...parsedOpts,
        };

        // ajax delete data
        if (configFinal?.['ajax'] && configFinal.hasOwnProperty('data')) delete configFinal['data'];

        // returned
        return configFinal;
    },
    DataTableDefault: function (opts) {
        // adding header sticky table
        // $(this).addClass('table-bordered sticky-table-header').find('thead').addClass('thead-primary');

        // init DataTable
        let tbl = $(this).DataTable($.fn._parseDtlOpts(opts));
        tbl.on('init.dt', function () {
            let minerGroup = $(this).closest('.waiter-miner-group');
            if (minerGroup.length > 0) {
                let filterGroup = $(minerGroup[0]).find('.miner-group');
                let filterItem = $(minerGroup[0]).find('.waiter-miner-item').children();
                if (filterGroup.length > 0 && filterItem.length > 0) {
                    filterItem.addClass('col-sm-12 col-md-3 col-lg-2 mt-3');
                    filterGroup.append(filterItem);
                    $('.dataTables_filter input').removeClass('form-control-sm');
                }
            }
            $(this).closest('.dataTables_wrapper').find('.select2').select2();
            $.fn.initMaskMoney2();
        });
        return tbl;
    },
    showLoading: function (timeout) {
        $('#loadingContainer').removeClass('hidden');
        if (timeout) {
            setTimeout($.fn.hideLoading, (timeout > 100 ? timeout : 1000));
        }
    },
    hideLoading: function () {
        setTimeout(() => {
            $('#loadingContainer').addClass('hidden');
        }, 250,)
    },
    getRowData: function () {
        // element call from in row of DataTable
        let row = $(this).closest('tr');
        return $($(this).closest('table')).DataTable().row(row).data();
    },
    groupDataFromPrefix: function (data, prefix) {
        let rs = {};
        Object.keys(data).map((key) => {
            if (key.startsWith(prefix)) {
                rs[key.split(prefix)[1]] = data[key]
            }
        })
        return rs;
    },

    // select2
    initSelect2: function (opts) {
        if (!opts) opts = {};

        let tokenSeparators = $.fn.parseJsonDefault($(this).attr('data-select2-tokenSeparators'), null);
        let closeOnSelect = $.fn.parseBoolean($(this).attr('data-select2-closeOnSelect'));
        let allowClear = $.fn.parseBoolean($(this).attr('data-select2-allowClear'));

        // placeholder
        if (!opts['placeholder']) {
            let placeholder = $(this).attr('data-select2-placeholder')
            if (placeholder) opts['placeholder'] = placeholder;
        }
        // -- placeholder

        // fix select2 for bootstrap modal
        if (!opts['dropdownParent']) {
            let dropdownParent = $(this).closest('div.modal');
            if (dropdownParent.length > 0) opts['dropdownParent'] = $(dropdownParent[0]);
        }
        // -- fix select2 for bootstrap modal

        $(this).select2({
            multiple: !!$(this).attr('multiple') || !!$(this).attr('data-select2-multiple'),
            closeOnSelect: closeOnSelect === null ? true : closeOnSelect,
            allowClear: allowClear === null ? false : allowClear,
            disabled: !!$(this).attr('data-select2-disabled'),
            tags: !!$(this).attr('data-select2-tags'),
            tokenSeparators: tokenSeparators ? tokenSeparators : [","], ...opts
        });
    }, // -- select2

    //
    // workflow
    //
    // zone
    compareStatusShowPageAction: function (resultDetail) {
        switch (resultDetail?.['system_status']) {
            case 1:
                break
            case 2:
                break
            case 3:
                $.fn.getElePageAction().find('[type="submit"]').each(function () {
                    $(this).addClass("hidden")
                });
                break
            case 4:
                $.fn.getElePageAction().find('[type="submit"]').each(function () {
                    $(this).addClass("hidden")
                });
                break
            default:
                break
        }
        $('#idxRealAction').removeClass('hidden');
    },
    getInputMappingProperties: function () {
        let input_mapping_properties = $('#input_mapping_properties').text();
        if (input_mapping_properties) {
            return JSON.parse(input_mapping_properties);
        }
        return {}
    },
    setZoneData: function (zonesData) {
        let body_fields = [];
        if (zonesData && Array.isArray(zonesData)) {
            zonesData.map((item) => {
                body_fields.push(item.code);
            });
        }
        $('html').append(`<script class="hidden" id="idxZonesData">${JSON.stringify(zonesData)}</script>` + `<script class="hidden" id="idxZonesKeyData">${JSON.stringify(body_fields)}</script>`);
    },
    getZoneKeyData: function () {
        let itemEle = $('#idxZonesKeyData');
        if (itemEle) {
            return JSON.parse(itemEle.text());
        }
        return [];
    },
    getZoneData: function () {
        let itemEle = $('#idxZonesData');
        if (itemEle) {
            return JSON.parse(itemEle.text());
        }
        return [];
    },
    activeButtonOpenZone: function (zonesData) {
        if (window.location.href.includes('/update/')) {
            $.fn.setZoneData(zonesData);
            if (zonesData && Array.isArray(zonesData)) {
                $('#btn-active-edit-zone-wf').removeClass('hidden');
            }
        }
    },
    activeZoneInDoc: function () {
        let zonesData = $.fn.getZoneData();
        if (Array.isArray(zonesData)) {
            let pageEle = $.fn.getElePageContent();
            let input_mapping_properties = $.fn.getInputMappingProperties();

            // disable + readonly field
            pageEle.find('.required').removeClass('required');
            pageEle.find('input, select, textarea').each(function (event) {
                let inputMapProperties = input_mapping_properties[$(this).attr('name')];
                if (inputMapProperties && typeof inputMapProperties === 'object') {
                    let arrTmpFind = [];
                    inputMapProperties['name'].map((nameFind) => {
                        arrTmpFind.push("[name=" + nameFind + "]");
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
            });

            // apply zones config
            if (zonesData.length > 0) {
                // $('#select-box-emp').prop('readonly', true);
                zonesData.map((item) => {
                    if (item.code) {
                        let inputMapProperties = input_mapping_properties[item.code];
                        if (inputMapProperties && typeof inputMapProperties === 'object') {
                            let arrTmpFind = {};
                            let readonly_not_disable = inputMapProperties['readonly_not_disable'];
                            inputMapProperties['name'].map((nameFind) => {
                                arrTmpFind[nameFind] = "[name=" + nameFind + "]";
                            })
                            inputMapProperties['id'].map((idFind) => {
                                arrTmpFind[idFind] = "[id=" + idFind + "]";
                            })
                            Object.keys(arrTmpFind).map((key) => {
                                let findText = arrTmpFind[key];
                                pageEle.find(findText).each(function () {
                                    if (readonly_not_disable.includes(key)) {
                                        $(this).changePropertiesElementIsZone({
                                            'add_require_label': true,
                                            'add_require': false,
                                            'remove_disable': true,
                                            'add_readonly': true,
                                            'add_border': true,
                                        });
                                    } else {
                                        $(this).changePropertiesElementIsZone({
                                            'add_require_label': true,
                                            'add_require': false,
                                            'remove_disable': true,
                                            'remove_readonly': true,
                                            'add_border': true,
                                        });
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

            // add button save at zones
            // idFormID
            let idFormID = $.fn.storageSystemData.attr('data-idFormID');
            if (idFormID) {
                $.fn.getElePageAction().find('[form=' + idFormID + ']').addClass('hidden');
                $('#idxSaveInZoneWF').attr('form', idFormID).removeClass('hidden');

                let actionList = $.fn.getActionsList();
                let actionBubble = null;
                if (actionList.includes(1)) {
                    actionBubble = 1;
                } else if (actionList.includes(4)) {
                    actionBubble = 4;
                }
                if (actionBubble) {
                    $('#idxSaveInZoneWFThenNext').attr('form', idFormID).attr('data-wf-action', actionBubble).attr('data-actions-list', JSON.stringify($.fn.getActionsList())).removeClass('hidden');
                }
            }
        }
    },
    changePropertiesElementIsZone: function (opts) {
        let config = {
            'add_require_label': false,
            'add_require': false,
            'remove_required': false,
            'remove_disable': false,
            'add_disable': false,
            'remove_readonly': false,
            'add_readonly': false,
            'add_border': false, ...opts
        }
        if (config.add_require_label === true) {
            $(this).closest('.form-group').find('.form-label').addClass('required');
        }
        if (config.add_disable === true) {
            $(this).attr('disabled', 'disabled');
            if ($(this).is('div')) {
                $(this).css('cursor', 'no-drop')
                $(this).addClass('bg-light');
            }
        }
        if (config.remove_required === true) {
            $(this).removeAttr('required');
        }
        if (config.remove_disable === true) {
            $(this).removeAttr('disabled');
        }
        if (config.add_readonly === true) {
            if ($(this).is('div')) {
                $(this).addClass('bg-light');
            } else {
                $(this).attr('readonly', 'readonly');
            }
        }
        if (config.remove_readonly === true) {
            $(this).removeAttr('readonly');
        }
        if (config.add_require === true) {
            $(this).prop('required', true);
        }
        if (config.add_border === true) {
            $(this).addClass('border-warning');
        }

        // active border for select2
        if ($(this).is("select") && $(this).hasClass('select2')) {
            $(this).next('.select2-container').find('.select2-selection').changePropertiesElementIsZone(config);
        }
    }, // -- zone
    // task
    setTaskWF: function (taskID) {
        $('#idxGroupAction').attr('data-wf-task-id', taskID);
    },
    getTaskWF: function () {
        return $('#idxGroupAction').attr('data-wf-task-id');
    }, // -- task
    // action
    setActionsList: function (actions) {
        $('html').append(`<script class="hidden" id="idxWFActionsData">${JSON.stringify(actions)}</script>`);
    },
    getActionsList: function () {
        let itemEle = $('#idxWFActionsData');
        if (itemEle) {
            return JSON.parse(itemEle.text());
        }
        return [];
    }, // -- action
    // runtime
    setWFRuntimeID: function (runtime_id) {
        if (runtime_id) {
            let btn = $('#btnLogShow');
            btn.removeClass('hidden');
            $.fn.callAjax(SetupFormSubmit.getUrlDetailWithID(btn.attr('data-url-runtime-detail'), runtime_id), 'GET',).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if ($.fn.hasOwnProperties(data, ['runtime_detail'])) {
                    if (data['runtime_detail']?.['state'] === 3) $('#idxDataRuntimeNotFound').removeClass('hidden');

                    let actionMySelf = data['runtime_detail']['action_myself'];
                    if (actionMySelf) {
                        let grouAction = $('#idxGroupAction');
                        let taskID = actionMySelf['id'];
                        if (taskID) {
                            $.fn.setTaskWF(taskID);

                            let actions = actionMySelf['actions'];
                            if (actions && Array.isArray(actions) && actions.length > 0) {
                                $.fn.setActionsList(actions);
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
                        $.fn.activeButtonOpenZone(actionMySelf['zones']);
                    }
                }
            })
        }
        $.fn.storageSystemData.attr('data-idWFRuntime', runtime_id);
    },
    getWFRuntimeID: function () {
        return $.fn.storageSystemData.attr('data-idWFRuntime');
    }, // -- runtime

    // loading wait response data
    showLoadingWaitResponse: function (opts, addClass = '') {
        return $(this).fadeOut({
            'duration': 'fast', // 'start': function (){
            //     $(`<div class="spinner spinner-border text-secondary my-3" role="status"><span class="sr-only">Loading...</span></div>`).insertBefore($(this));
            // },
            'done': function () {
                $(`<div class="${addClass} spinner spinner-border text-secondary my-3" role="status"><span class="sr-only">Loading...</span></div>`).insertBefore($(this));
                if (!$(this).hasClass('fade-in-active')) $(this).addClass('hidden');
            }, ...opts
        });

    },
    hideLoadingWaitResponse: function (opts) {
        return $(this).addClass('fade-in-active').fadeIn({
            'duration': 'fast',
            'start': function () {
                $(this).prev('.spinner').addClass('hidden').remove();
                $(this).removeClass("hidden")
            }, // 'done': function (){
            //     $(this).prev('.spinner').addClass('hidden').remove();
            // },
            ...opts
        });
    }, // -- loading wait response data

    // wf call action
    callActionWF: function (ele$) {
        let actionSelected = $(ele$).attr('data-value');
        let taskID = $('#idxGroupAction').attr('data-wf-task-id');
        let urlBase = $.fn.storageSystemData.attr('data-idUrlTaskDetail');
        if (actionSelected !== undefined && taskID && urlBase) {
            let urlData = SetupFormSubmit.getUrlDetailWithID(urlBase, taskID);
            $.fn.showLoading();
            return $.fn.callAjax(urlData, 'PUT', {'action': actionSelected}, $("input[name=csrfmiddlewaretoken]").val(),).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data?.['status'] === 200) {
                    $.fn.notifyB({
                        'description': $.fn.transEle.attr('data-action-wf') + ': ' + $.fn.transEle.attr('data-success'),
                    }, 'success');
                    if (!($(ele$).attr('data-success-reload') === 'false' || $(ele$).attr('data-success-reload') === false)) {
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)
                    }
                }
                setTimeout(() => {
                    $.fn.hideLoading();
                }, 1000)
            }, (errs) => {
                setTimeout(() => {
                    $.fn.hideLoading();
                }, 500)
            });
        } else {
            return new Promise(function (resolve, reject) {
            });
        }
    }, // -- wf call action
})


$(document).ready(function () {
    // temp solution
    $('#idxRealAction').removeClass('hidden');

    // listen when document ready
    new NotifyController().active();
    new ListeningEventController().active()
    // -- listen when document ready
});


// support for Form Submit
class SetupFormSubmit {
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
        this.dataForm = $.fn.serializerObject(formSelected);

        // URL DETAIL
        this.dataUrlDetail = formSelected.attr('data-url-detail');
        if (!this.dataUrlRedirect) this.dataUrlRedirect = urlRedirectDefault ? urlRedirectDefault : null;
        if (this.dataUrlDetail) {
            this.dataUrlDetail = this.dataUrlDetail.split("/").slice(0, -1).join("/") + "/";
        }
    }

    getCtxAjax() {
        return {
            url: this.dataUrl,
            method: this.dataMethod,
            data: this.dataForm,
            redirect: this.dataUrlRedirect,
            redirectTimeout: this.dataRedirectTimeout
        }
    }

    getUrlDetail(pk) {
        if (this.dataUrlDetail && pk) {
            return this.dataUrlDetail + pk.toString();
        }
        return null;
    }

    getUrlDetailWithDataUrl(attrName, pk) {
        let data_url = this.convertUrlDetail(this.formSelected.attr('data-url-' + attrName));
        return data_url + pk.toString()
    }

    static getUrlDetailWithID(url, pk) {
        url = url.split("/").slice(0, -1).join("/") + "/";
        if (url && pk) {
            return url + pk.toString();
        }
        return null;
    }

    convertUrlDetail(url) {
        return url.split("/").slice(0, -1).join("/") + "/";
    }

    appendFilter(url, filter) {
        let params = '';
        Object.keys(filter).map((key) => {
            params += `{0}={1}`.format_by_idx(key, encodeURIComponent(filter[key]))
        })
        if (params) {
            return '{0}?{1}'.format_by_idx(url, params);
        }
        return url;
    }
}


// CURRENCY CLASS UTILS
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
        $.fn.getCompanyCurrencyConfig().then((configData) => {
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
                throw Error('strData must be required!')
        }
    }
}

// Extend and improvement base package
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

String.prototype.valid_uuid4 = function () {
    return /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(this.toString());
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
                $.fn.callAjax(url, 'DELETE', data, crf)
                    .then((res) => {
                        if (res.hasOwnProperty('status')) {
                            div.modal('hide');
                            div.remove();
                            if ($(row).length) $(row).closest('.table').DataTable().rows(row).remove().draw();
                            $.fn.notifyPopup({
                                description: res?.data?.message ? res.data.message : 'Delete item successfully'
                            }, 'success')
                        }
                    })
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
