$(document).ready(function () {
    function loadAccountType() {
        let tbl = $('#datatable-account-type-list')
        let frm = new SetupFormSubmit(tbl)
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp)
                    if (data && resp.data.hasOwnProperty('account_type_list')) {
                        return resp.data['account_type_list'] ? resp.data['account_type_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-10',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${data}</span>`
                        }
                        return `<span class="badge badge-primary w-70">${data}</span>`
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-30',
                    render: (data, type, row) => {
                        if (row.is_default) {
                             return `<b>${data}</b>`
                        }
                        return `${data}`
                    }
                },
                {
                    data: 'description',
                    className: 'wrap-text w-45',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        if (!row?.['is_default']) {
                            return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-account-type"
                                        data-id="${row?.['id']}"
                                        data-code="${row?.['code']}"
                                        data-title="${row?.['title']}"
                                        data-description="${row?.['description']}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-update-account-type"
                                        data-bs-placement="top" title=""
                                        data-bs-original-title="Edit">
                                <span class="btn-icon-wrap">
                                    <span class="feather-icon text-primary">
                                        <i data-feather="edit"></i>
                                    </span>
                                </span>
                            </a>`
                        }
                        return ``
                    }
                }
            ],
        })
    }
    function loadAccountGroup() {
        let tbl = $('#datatable-account-group-list')
        let frm = new SetupFormSubmit(tbl)
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp)
                    if (data && resp.data.hasOwnProperty('account_group_list')) {
                        return resp.data['account_group_list'] ? resp.data['account_group_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-10',
                    render: (data, type, row, meta) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${data}</span>`
                        }
                        return `<span class="badge badge-primary w-70">${data}</span>`
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-30',
                    render: (data) => {
                        return `${data}`
                    }
                },
                {
                    data: 'description',
                    className: 'wrap-text w-45',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-account-group"
                                    data-id="${row?.['id']}"
                                    data-code="${row?.['code']}"
                                    data-title="${row?.['title']}"
                                    data-description="${row?.['description']}"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-update-account-group"
                                    data-bs-placement="top" title=""
                                    data-bs-original-title="Edit">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-primary">
                                    <i data-feather="edit"></i>
                                </span>
                            </span>
                        </a>`
                    }
                }
            ],
        })
    }
    function loadIndustry() {
        let tbl = $('#datatable-industry-list')
        let frm = new SetupFormSubmit(tbl)
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp)
                    if (data && resp.data.hasOwnProperty('industry_list')) {
                        return resp.data['industry_list'] ? resp.data['industry_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-10',
                    render: (data, type, row, meta) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${data}</span>`
                        }
                        return `<span class="badge badge-primary w-70">${data}</span>`
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-30',
                    render: (data) => {
                        return `${data}`
                    }
                },
                {
                    data: 'description',
                    className: 'wrap-text w-45',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-industry"
                                    data-id="${row?.['id']}"
                                    data-code="${row?.['code']}"
                                    data-title="${row?.['title']}"
                                    data-description="${row?.['description']}"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-update-industry"
                                    data-bs-placement="top" title=""
                                    data-bs-original-title="Edit">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-primary">
                                    <i data-feather="edit"></i>
                                </span>
                            </span>
                        </a>`
                    }
                }
            ],
        })
    }

    loadAccountType()
    loadAccountGroup()
    loadIndustry()

    const frm_create_account_type = $('#form-create-account-type')
    const frm_update_account_type = $('#form-update-account-type')

    $(document).on("click", '.btn-update-account-type', function () {
        let modal = $('#modal-update-account-type')
        modal.find('#code-update-account-type').val($(this).attr('data-code'))
        modal.find('#name-update-account-type').val($(this).attr('data-title'))
        modal.find('#description-update-account-type').val($(this).attr('data-description'))
        let raw_url = frm_update_account_type.attr('data-url-raw')
        frm_update_account_type.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_account_type).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp)
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-account-type').modal('hide')
                        $('#modal-new-account-type form')[0].reset()
                        loadAccountType()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_account_type).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp)
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-account-type').modal('hide')
                        loadAccountType()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })

    const frm_create_account_group = $('#form-create-account-group')
    const frm_update_account_group = $('#form-update-account-group')

    $(document).on("click", '.btn-update-account-group', function () {
        let modal = $('#modal-update-account-group')
        modal.find('#code-update-account-group').val($(this).attr('data-code'))
        modal.find('#name-update-account-group').val($(this).attr('data-title'))
        modal.find('#description-update-account-group').val($(this).attr('data-description'))
        let raw_url = frm_update_account_group.attr('data-url-raw')
        frm_update_account_group.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_account_group).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp)
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-account-group').modal('hide')
                        $('#modal-new-account-group form')[0].reset()
                        loadAccountGroup()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_account_group).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp)
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-account-group').modal('hide')
                        loadAccountGroup()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })

    const frm_create_industry = $('#form-create-industry')
    const frm_update_industry = $('#form-update-industry')

    $(document).on("click", '.btn-update-industry', function () {
        let modal = $('#modal-update-industry')
        modal.find('#code-update-industry').val($(this).attr('data-code'))
        modal.find('#name-update-industry').val($(this).attr('data-title'))
        modal.find('#description-update-industry').val($(this).attr('data-description'))
        let raw_url = frm_update_industry.attr('data-url-raw')
        frm_update_industry.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_industry).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp)
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-industry').modal('hide')
                        $('#modal-new-industry form')[0].reset()
                        loadIndustry()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_industry).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp)
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-industry').modal('hide')
                        loadIndustry()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })
})
