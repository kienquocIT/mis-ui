/**
 * Khai báo các Element
 */
class ShipmentElement {
    constructor() {
        this.$tblContainer = $('#datatable-container');
        this.$formContainer = $('#form-container');
        this.$containerModal = $('#container-modal-title');
        this.$containerTypeName = $('#container_masterdata_name');

        this.$tblPackage = $('#datatable-package');
        this.$formPackage = $('#form-package');
        this.$packageModal = $('#package-modal-title');
        this.$packageTypeName = $('#package_masterdata_name');
    }
}

const pageElements = new ShipmentElement();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class ShipmentPageFunction {
    static combineContainerDataForm() {
        return {
            title: pageElements.$containerTypeName.val()
        };
    }

    static combinePackageDataForm() {
        return {
            title: pageElements.$packageTypeName.val()
        };
    }
}

/**
 * Khai báo các hàm chính
 */
class ShipmentLoadDataHandle {
    static initContainerList() {
        let tblContainer = pageElements.$tblContainer;
        let frm = new SetupFormSubmit(tblContainer);
        tblContainer.DataTable().clear().destroy();
        tblContainer.DataTableDefault({
            userDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('container_list')) {
                        return resp.data['container_list'] ?? [];
                    }
                    throw Error('Call data raise errors.');
                }
            },
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return ""
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                    }
                },
                {
                    className: 'w-70',
                    render: (data, type, row) => {
                        return `<span class="text-muted">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<a 
                                   data-id="${row?.['id']}" 
                                   data-title="${row?.['title']}" 
                                   class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-container">
                                   <span class="btn-icon-wrap">
                                        <span class="feather-icon text-primary">
                                            <i data-feather="edit"></i>
                                        </span>
                                   </span>
                               </a>`
                    }
                }
            ]
        });
    }

    static initPackageList() {
        let tblPackage = pageElements.$tblPackage;
        let frm = new SetupFormSubmit(tblPackage);
        tblPackage.DataTable().clear().destroy();
        tblPackage.DataTableDefault({
            userDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('package_list')) {
                        return resp.data['package_list'] ?? [];
                    }
                    throw Error('Call data raise errors.');
                }
            },
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return ""
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                    }
                },
                {
                    className: 'w-70',
                    render: (data, type, row) => {
                        return `<span class="text-muted">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<a 
                                   data-id="${row?.['id']}" 
                                   data-title="${row?.['title']}" 
                                   class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-package">
                                   <span class="btn-icon-wrap">
                                        <span class="feather-icon text-primary">
                                            <i data-feather="edit"></i>
                                        </span>
                                   </span>
                               </a>`
                    }
                }
            ]
        });
    }
}

/**
 * Các hàm submit
 */
class ShipmentSubmitData {
    static submitContainer() {
        new SetupFormSubmit(pageElements.$formContainer).validate({
            rules: {
                title: {
                    required: true,
                    maxlength: 100
                }
            },
            submitHandler: function (form) {
                if (pageElements.$containerModal.attr('data-id') === '') {
                    WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
                    let frm = new SetupFormSubmit($(form));
                    $.fn.callAjax2({
                        'url': frm.dataUrl,
                        'method': "POST",
                        'data': ShipmentPageFunction.combineContainerDataForm(),
                        'url_redirect': frm.dataUrlRedirect,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Create new container type successfully"}, 'success');
                                setTimeout(function () {
                                    window.location.href = frm.dataUrlRedirect;
                                }, 1000);
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                            WindowControl.hideLoading();
                        }
                    )
                } else {
                    WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                    let frm = new SetupFormSubmit($(form));
                    $.fn.callAjax2({
                        'url': pageElements.$formContainer.attr('data-url-detail').replace("0", pageElements.$containerModal.attr('data-id')),
                        'method': "PUT",
                        'data': ShipmentPageFunction.combineContainerDataForm(),
                        'url_redirect': frm.dataUrlRedirect,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Update container type successfully"}, 'success');
                                setTimeout(function () {
                                    window.location.href = frm.dataUrlRedirect;
                                }, 1000);
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                            WindowControl.hideLoading();
                        }
                    )
                }
            }
        })
    }

    static submitPackage() {
        new SetupFormSubmit(pageElements.$formPackage).validate({
            rules: {
                title: {
                    required: true,
                    maxlength: 100
                }
            },
            submitHandler: function (form) {
                if (pageElements.$packageModal.attr('data-id') === '') {
                    WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
                    let frm = new SetupFormSubmit($(form));
                    $.fn.callAjax2({
                        'url': frm.dataUrl,
                        'method': "POST",
                        'data': ShipmentPageFunction.combinePackageDataForm(),
                        'url_redirect': frm.dataUrlRedirect,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Create new package type successfully"}, 'success');
                                setTimeout(function () {
                                    window.location.href = frm.dataUrlRedirect;
                                }, 1000);
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                            WindowControl.hideLoading();
                        }
                    )
                } else {
                    WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                    let frm = new SetupFormSubmit($(form));
                    $.fn.callAjax2({
                        'url': pageElements.$formPackage.attr('data-url-detail').replace("0", pageElements.$packageModal.attr('data-id')),
                        'method': "PUT",
                        'data': ShipmentPageFunction.combinePackageDataForm(),
                        'url_redirect': frm.dataUrlRedirect,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Update package type successfully"}, 'success');
                                setTimeout(function () {
                                    window.location.href = frm.dataUrlRedirect;
                                }, 1000);
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                            WindowControl.hideLoading();
                        }
                    )
                }
            }
        })
    }
}

/**
 * Khai báo các Event
 */
class ShipmentLoadEventHandler {
    static initPageEvent() {
        $(document).on("click", "#create_container_type", function () {
            pageElements.$containerModal.text($.fn.gettext('Add Container Type'));
            pageElements.$containerModal.attr('data-id', '');
            pageElements.$containerTypeName.val('');
        });

        $(document).on('click', '.edit-container', function () {
            pageElements.$containerModal.text($.fn.gettext('Update Container Type'));
            pageElements.$containerModal.attr('data-id', $(this).attr('data-id'));
            pageElements.$containerTypeName.val($(this).attr('data-title'));
            $('#modal_container').modal('show');
        });

        $(document).on("click", "#create_package_type", function () {
            pageElements.$packageModal.text($.fn.gettext('Add Package Type'));
            pageElements.$packageModal.attr('data-id', '');
            pageElements.$packageTypeName.val('');
        });

        $(document).on('click', '.edit-package', function () {
            pageElements.$packageModal.text($.fn.gettext('Update Package Type'));
            pageElements.$packageModal.attr('data-id', $(this).attr('data-id'));
            pageElements.$packageTypeName.val($(this).attr('data-title'));
            $('#modal_package').modal('show');
        });
    }
}

$(document).ready(function () {
    ShipmentLoadEventHandler.initPageEvent();
    ShipmentLoadDataHandle.initContainerList();
    ShipmentLoadDataHandle.initPackageList();

    ShipmentSubmitData.submitContainer();
    ShipmentSubmitData.submitPackage();
})
