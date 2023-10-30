let tbl_pined = $('#tbl_block_doc_pined');
let frm_pined = new SetupFormSubmit(tbl_pined);
let boxBMDisplay = $('#boxBookmarkDisplay');

function renderCollaborationHTML(data) {
    let flexDiv = $(`<div class="justify-content-start flex-wrap"></div>`);
    data.reverse().map((item) => {
        let performAction = Array.isArray(item['action_perform']) ? item['action_perform'] : [];
        let dataPared = selectStatusAvatar(performAction);
        let bgColorStatus = dataPared[0];
        let iconHtml = dataPared[1];
        let employeeData = item?.['employee_data'];
        if (employeeData) {
            $($x.fn.renderAvatar(
                employeeData,
                'avatar-xs avatar-primary avatar-rounded position-relative mr-1 mb-1',
                `<span class="badge ${bgColorStatus} badge-indicator badge-indicator-xl position-bottom-end-overflow-1">${iconHtml}</span>`,
            )).appendTo(flexDiv)
        }
    })
    return flexDiv.prop('outerHTML');
}

function renderActions(doc_pin_id, runtime_id, doc_id, is_diagram = true, is_mute = true, is_pin = true, btn_unpin = false) {
    let empty = $(``);
    let box = $(`<div class="d-flex align-items-center justify-content-end"></div>`);
    let btnViewDiagram = is_diagram && doc_id && runtime_id ? $(`
                <button
                    data-drawer-target="#drawer_log_data"
                    data-drawer-push="false"
                    data-drawer-always-state="true"
                    class="btnViewDiagram btn btn-icon btn-rounded bg-dark-hover mr-1 ntt-drawer-toggle-link"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-original-title="View Diagram"
                    data-doc-id="${doc_id}"
                    data-runtime-id="${runtime_id}"
                >
                    <span class="icon">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </span>
                </button>
            `) : empty;
    let btnMute = is_mute ? $(`
                <button
                    class="disabled btn btn-icon btn-rounded bg-dark-hover mr-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-original-title="Mute"
                >
                    <span class="icon">
                        <i class="fa-regular fa-bell-slash"></i>
                    </span>
                </button>
            `) : empty;
    let btnPin = !doc_pin_id && is_pin ? $(`
                <button
                    class="btnDocPined btn btn-icon btn-rounded bg-dark-hover mr-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-original-title="Pin"
                    data-runtime-id="${runtime_id ? runtime_id : ''}"
                    data-pin-id="${doc_pin_id ? doc_pin_id : ''}"
                >
                    <span class="icon">
                        <i class="fa-solid fa-thumbtack"></i>
                    </span>
                </button>
            `) : empty;
    let btnUnpin = doc_pin_id && btn_unpin ? $(`
        <button
                    class="btnDocUnPined btn btn-icon btn-rounded bg-dark-hover mr-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-original-title="Pin"
                    data-pin-id="${doc_pin_id ? doc_pin_id : ''}"
                >
                    <span class="icon">
                        <i class="fa-solid fa-link-slash"></i>
                    </span>
                </button>
    `) : empty;
    return box.append(btnViewDiagram).append(btnMute).append(btnPin).append(btnUnpin).prop('outerHTML');
}

function selectStatusAvatar(performAction) {
    if (performAction.includes(1) || performAction.includes(4)) {
        return ['bg-success', `<i class="fa-solid fa-check"></i>`];
    } else if (performAction.includes(2)) {
        return ['bg-danger', `<i class="fa-solid fa-xmark"></i>`];
    } else if (performAction.includes(3)) {
        return ['bg-warning', `<i class="fa-solid fa-arrow-left"></i>`]
    }
    return ['bg-light', ``];
}

function loadBookmarkList() {
    let boxBMDisplayData = $('#boxBookmarkDisplayData');
    WindowControl.showLoadingWaitResponse(boxBMDisplay);
    $.fn.callAjax(boxBMDisplay.attr('data-url'), 'GET',).then((resp) => {
        boxBMDisplayData.children(':not(#boxBtnAddNewBM)').remove();
        boxBMDisplayData.prop('data-loaded', true);
        let data = $.fn.switcherResp(resp);
        if (data && data.hasOwnProperty('bookmarks_list')) {
            let bookmarks_list = data['bookmarks_list'];
            bookmarks_list.reverse().map((item) => {
                let scriptStorageItemData = jQuery(`<script>`);
                scriptStorageItemData.addClass("bookmark-item-data hidden");
                scriptStorageItemData.attr("type", "application/json");
                scriptStorageItemData.text($x.fn.dumpJson(item));

                let btnActionHtml = $(`
                                        <div class="bookmark-item-action">
                                            <div class="d-flex">
                                            </div>
                                        </div>
                                    `);
                let btnEdit = $(`
                                    <button
                                        class="hidden bookmark-item-edit btn btn-icon btn-rounded bg-light text-dark border"
                                        data-bs-toggle="modal" data-bs-target="#modalAddBookMark"
                                    >
                                        <span class="icon">
                                            <i class="fa-solid fa-pen"></i>
                                        </span>
                                    </button>
                                `);
                btnEdit.appendTo(btnActionHtml);
                let btnDelete = $(`
                                        <button class="bookmark-item-delete btn btn-icon btn-rounded bg-light text-dark border">
                                                    <span class="icon">
                                                        <i class="fa-solid fa-xmark"></i>
                                                    </span>
                                                </button>
                                    `);
                btnDelete.appendTo(btnActionHtml);
                let itemHTML = $(`
                    <div 
                        class="bookmark-item bookmark-item-redirect d-15 m-2" 
                        data-id="${item.id}"
                        data-kind="${item.kind}"
                        data-view_name="${item?.['view_name']}"
                        data-customize_url="${item?.['customize_url']}"
                    >
                        <div class="bookmark-item-body bg-${item.box_style?.['bg_cls']} text-${item.box_style?.['text_cls']} rounded-5 d-15 d-flex flex-column justify-content-center align-items-center overflow-hidden">
                            <small class="text-center mb-1">${item.title}</small>
                            <span class="mb-1">
                                <i class="${item.box_style?.['icon_cls']} fa-lg"></i>
                            </span>
                            <small class="text-center"></small>
                        </div>
                    </div>
                `);
                scriptStorageItemData.appendTo(itemHTML);
                btnActionHtml.appendTo(itemHTML);

                boxBMDisplayData.prepend(itemHTML);
            })
        }
        WindowControl.hideLoadingWaitResponse(boxBMDisplay);
    },)
}

function loadTabTodo() {
    let tbl = $("#tbl_my_task");
    let dataLoaded = tbl.attr('data-loaded');
    if (!dataLoaded) {
        tbl.attr('data-loaded', true);
        WindowControl.showLoadingWaitResponse(tbl);
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTableDefault({
            pageLength: 5,
            rowIdx: false,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                data: function (d) {
                    d.is_done = false;
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    WindowControl.hideLoadingWaitResponse(tbl);
                    if (data && data.hasOwnProperty('task_list')) {
                        return resp.data['task_list'] ? resp.data['task_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    data: 'doc_title',
                    className: 'wrap-text',
                    width: "20%",
                    render: (data, type, row) => {
                        let stage__runtime = row['stage__runtime'];
                        let urlData = UrlGatewayReverse.get_url(
                            stage__runtime?.['doc_id'],
                            stage__runtime?.['app_code'],
                            {'redirect': true},
                        );
                        return `<a href="${urlData}">${data ? data : "_"}</a>`;
                    }
                }, {
                    className: 'wrap-text',
                    width: "10%",
                    data: 'app_code',
                    render: (data, type, row) => {
                        return data ? `<span class="badge badge-light">${data}</span>` : '';
                    }
                }, {
                    className: 'wrap-text',
                    width: "10%",
                    data: 'stage',
                    render: (data, type, row) => {
                        return data ? `<span class="badge badge-warning">${data['title']}</span>` : '';
                    }
                }, {
                    className: 'wrap-text',
                    width: "25%",
                    data: 'employee',
                    render: (data, type, row) => {
                        return $x.fn.renderAvatar(data, 'avatar-xs');
                    }
                }, {
                    className: 'wrap-text',
                    with: "25%",
                    data: "date_created",
                    render: (data, type, row)=>{
                        return $x.fn.displayRelativeTime(data);
                    }
                }, {
                    className: 'wrap-text',
                    width: "10%",
                    data: 'stage__runtime',
                    render: (data, type, row) => {
                        return renderActions(data?.['doc_pined_id'], data?.['id'], data?.['doc_id']);
                    }
                },
            ],
        }).on('draw.dt', function () {
            tbl.find('tbody').find('tr').each(function () {
                $(this).after('<tr class="table-row-gap"><td></td></tr>');
            });
        });
    }
}

function loadTabFollowing() {
    let tbl = $('#tbl_following_data');
    let dataLoaded = tbl.attr('data-loaded');
    if (!dataLoaded) {
        tbl.attr('data-loaded', true);
        WindowControl.showLoadingWaitResponse(tbl);
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTableDefault({
            pageLength: 5,
            rowIdx: false,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    WindowControl.hideLoadingWaitResponse(tbl);
                    if (data && data.hasOwnProperty('runtime_list')) {
                        return resp.data['runtime_list'] ? resp.data['runtime_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    data: 'doc_title',
                    width: "25%",
                    render: (data, type, row) => {
                        let urlData = UrlGatewayReverse.get_url(
                            row?.['doc_id'],
                            row?.['app_code'],
                            {'redirect': true},
                        );
                        return `<a href="${urlData}">${data ? data : "_"}</a>`;
                    }
                },
                {
                    data: 'app_code',
                    width: "10%",
                    render: (data, type, row) => {
                        return data ? `<span class="badge badge-light">${data ? data : ''}</span>` : '';
                    }
                },
                {
                    width: "15%",
                    data: 'stage_currents',
                    render: (data, type, row) => {
                        return data?.['title'] ? `<span class="badge badge-warning">${data?.['title']}</span>` : '';
                    }
                },
                {
                    data: 'assignees',
                    width: "20%",
                    render: (data, type, row) => {
                        return renderCollaborationHTML(data);
                    }
                },
                {
                    data: 'date_created',
                    width: "15%",
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(data);
                    }
                },
                {
                    width: "15%",
                    data: 'doc_pined_id',
                    render: (data, type, row) => {
                        return renderActions(data, row['id'], row['doc_id']);
                    }
                },
            ],
        }).on('draw.dt', function () {
            tbl.find('tbody').find('tr').each(function () {
                $(this).after('<tr class="table-row-gap"><td></td></tr>');
            });
        });
    }
}

function loadTabPined() {
    let dataLoaded = tbl_pined.attr('data-loaded');
    if (!dataLoaded) {
        tbl_pined.attr('data-loaded', true);
        WindowControl.showLoadingWaitResponse(tbl_pined);
        tbl_pined.DataTableDefault({
            pageLength: 5,
            rowIdx: false,
            ajax: {
                url: frm_pined.dataUrl,
                type: frm_pined.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    WindowControl.hideLoadingWaitResponse(tbl_pined);
                    if (data && data.hasOwnProperty('pin_doc_list')) {
                        return resp.data['pin_doc_list'] ? resp.data['pin_doc_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text',
                    width: "20%",
                    data: 'title',
                    render: (data, type, row) => {
                        let runtime = row['runtime'];
                        let urlData = UrlGatewayReverse.get_url(
                            runtime?.['doc_id'],
                            runtime?.['app_code'],
                            {'redirect': true},
                        );
                        return `<a href="${urlData}">${data ? data : "_"}</a>`;
                    }
                }, {
                    className: 'wrap-text',
                    width: "20%",
                    data: 'runtime',
                    render: (data, type, row) => {
                        if (data) {
                            let app_code = data['app_code'];
                            if (app_code) {
                                return `<span class="badge badge-light">${app_code}</span>`;
                            }
                        }
                        return '';
                    }
                }, {
                    className: 'wrap-text',
                    width: "20%",
                    data: 'runtime',
                    render: (data, type, row) => {
                        let stage_currents = data?.['stage_currents'];
                        if (stage_currents && stage_currents.hasOwnProperty('title')) {
                            return `<span class="badge badge-warning">${stage_currents['title']}</span>`;
                        }
                        return '';
                    }
                }, {
                    className: 'wrap-text',
                    width: "20%",
                    data: 'runtime',
                    render: (data, type, row) => {
                        let assignees = data?.['assignees'];
                        if (assignees && Array.isArray(assignees)) {
                            return renderCollaborationHTML(assignees);
                        }
                        return '';
                    }
                }, {
                    className: 'wrap-text',
                    width: "15%",
                    data: 'date_created',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(data);
                    }
                }, {
                    className: 'wrap-text',
                    width: "5%",
                    data: 'id',
                    render: (data, type, row) => {
                        return renderActions(
                            data,
                            row?.['runtime']?.['id'],
                            row?.['runtime']?.['doc_id'],
                            true,
                            false,
                            false,
                            true,
                        )
                    }
                },
            ],
        }).on('draw.dt', function () {
            tbl_pined.find('tbody').find('tr').each(function () {
                $(this).after('<tr class="table-row-gap"><td></td></tr>');
            });
        });
    }
}

function loadTabDraft() {

}

function initEventElement() {
    $('#modalAddBookMark').on('shown.bs.modal', function (event) {
        $('#newBookMarkApplication').initSelect2();
    });
    $('#frmAddNewBookMark').submit(function (event) {
        WindowControl.showLoading();
        event.preventDefault();
        let frmSetup = new SetupFormSubmit($(this));
        frmSetup.dataForm['box_style'] = SetupFormSubmit.groupDataFromPrefix(frmSetup.dataForm, 'box_style__');
        $.fn.callAjax(boxBMDisplay.attr('data-url'), 'POST', frmSetup.dataForm, true,).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyB({
                    'description': $.fn.transEle.attr('data-success')
                }, 'success');
                loadBookmarkList();
            }
            WindowControl.hideLoading();
            $('#modalAddBookMark').hide();
        }, (errs) => {
            WindowControl.hideLoading();
        })
    });

    $(document).on('click', '.bookmark-item-body', function (event) {
        event.preventDefault();
        let bookmarkItem = $(this).closest('.bookmark-item');
        let kind = bookmarkItem.attr('data-kind');
        let viewName = bookmarkItem.attr('data-view_name');
        let customizeUrl = bookmarkItem.attr('data-customize_url');
        if (kind === '0' && viewName) {
            let urlData = globeGatewayViewNameParseView.replaceAll('_view_name_', viewName);
            WindowControl.eleHrefActive(urlData + "?redirect=true");
        } else if (kind === '1' && customizeUrl) {
            window.location.href = customizeUrl;
        }
    });
    $(document).on('click', '.bookmark-item-delete', function (event) {
        event.preventDefault();
        let dataId = $(this).closest('.bookmark-item').attr('data-id');
        Swal.fire({
            title: $.fn.transEle.attr('data-are-you-sure'),
            html: $.fn.transEle.attr('data-msgExecuteThenReloadPageIn') + '<br>',
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: true,
            cancelButtonText: $.fn.transEle.attr('data-cancel'),
            showConfirmButton: true,
            confirmButtonText: $.fn.transEle.attr('data-confirm'),
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer || result.value) {
                WindowControl.showLoading();
                let dataUrl = SetupFormSubmit.getUrlDetailWithID(boxBMDisplay.attr('data-url-delete'), dataId);
                if (dataId && dataUrl) {
                    $.fn.callAjax(dataUrl, 'DELETE', {}, true,).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && data['status'] === 204) {
                            loadBookmarkList();
                        }
                        WindowControl.hideLoading();
                    }, (errs) => {
                        WindowControl.hideLoading();
                    })
                }
            }
        });
    });
    $(document).on('click', '.bookmark-item-edit', function (event) {
        event.preventDefault();
        let data = JSON.parse($(this).closest('.bookmark-item').find('.bookmark-item-data').text());
    });

    $('#newBookMarkTitle').change(function (event) {
        $('#previewBMTitle').html($(this).val());
    })

    $('#newBMSelectBG').change(function (event) {
        let blockPreview = $('#newBMBlockPreview');
        blockPreview.alterClass('bg-*');
        blockPreview.addClass('bg-' + $(this).val());
    });

    $('#newBMSelectTextColor').change(function (event) {
        let blockPreview = $('#newBMBlockPreview');
        blockPreview.alterClass('text-*');
        blockPreview.addClass('text-' + $(this).val());
    })

    $('#newBookMarkType').on('change', function (event) {
        let bmApp = $('#newBookMarkApplication');
        let bmURL = $('#newBookMarkCustomURL');
        if ($(this).val() === '0') {
            bmApp.removeAttr('disabled');
            bmURL.prop('disabled', true);
        } else {
            bmURL.removeAttr('disabled');
            bmApp.prop('disabled', true);
        }
    });

    $('#newBookMarkCustomURL').on('change', function (event) {
        let data = $(this).val();
        let arr = data.split(location.host);

        let urlCut = '';
        if (arr.length === 1) urlCut = arr[0];
        else if (arr.length === 2) urlCut = arr[1];

        if (urlCut && !(urlCut.includes('http') || urlCut.includes('https') || urlCut.includes('//'))) {
            if (!urlCut.startsWith('/')) urlCut = '/' + urlCut;
            return $(this).val(urlCut);
        }
        $.fn.notifyB({
            'description': $.fn.transEle.attr('data-url-invalid')
        }, 'failure');
        $(this).val("");
    });

    let selectIcon = $('#selectIconNewBookMark');
    selectIcon.initSelect2({
        templateResult: function formatState(state) {
            if (state.id) return $(`<span><i class="mr-1 ${state.id}"></i> ${state.text}</span>`);
            return state.text;
        },
    });
    selectIcon.on('change', function (event) {
        $('#previewBMSelectIcon').html(`<i class="fa-lg ${$(this).val()}"></i>`)
    });

    $(document).on('click', '.btnDocPined', function (event) {
        event.preventDefault();
        let runtime_id = $(this).attr('data-runtime-id');
        let pined_id = $(this).attr('data-pin-id');
        if (runtime_id && !pined_id) {
            WindowControl.showLoading();
            $.fn.callAjax(frm_pined.dataUrl, 'POST', {'runtime_id': runtime_id}, true,).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({
                        'description': $.fn.transEle.attr('data-success'),
                    }, 'success');
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                }
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
            }, (errs) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
            })
        }

    });

    $(document).on('click', '.btnDocUnPined', function (event) {
        WindowControl.showLoading();
        let id = $(this).attr('data-pin-id');
        let dataUrl = SetupFormSubmit.getUrlDetailWithID(tbl_pined.attr('data-url-detail'), id);
        if (id && dataUrl) {
            $.fn.callAjax(dataUrl, 'DELETE', {}, true,).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
            }, (errs) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
            })
        }
    });

    $(document).on('click', '.btnViewDiagram', function (event) {
        event.preventDefault();
        let docID = $(this).attr('data-doc-id');
        let runtimeID = $(this).attr('data-runtime-id');
        if (docID && runtimeID) {
            new LogController().getDataLogAndActivities(docID, runtimeID, true);
        } else {
            $.fn.notifyB({
                'description': $.fn.transEle.attr('data-no-data'),
            }, 'failure')
        }
    });

    $('.nav-link[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        let targetTab = $(e.target).attr('href');
        if (targetTab === '#tab-task') {
            loadTabTodo();
        } else if (targetTab === '#tab-owner') {
            loadTabFollowing();
        } else if (targetTab === '#tab-pined') {
            loadTabPined();
        } else if (targetTab === '#tab-draft') {
            loadTabDraft();
        }
    });
}

$(document).ready(function () {
    try {
        employeeCurrentData = JSON.parse(employeeCurrentData);
        if (!employeeCurrentData || !employeeCurrentData?.['id']) {
            Swal.fire({
                title: msgTitleErrLinked,
                html: `<p><b>${msgTextErrLinked}</b></p><br/><p>${msgTextErrLinked2}</p>`,
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: msgChangeCompany,
                showDenyButton: true,
                denyButtonText: $.fn.transEle.attr('data-cancel'),
            }).then((result)=>{
                if (result.isConfirmed) {
                    $('#btnChangeCurrentCompany').trigger('click');
                }
            })
        }
    } catch (e) {
    }


    initEventElement();
    loadTabTodo();
    loadBookmarkList();
});