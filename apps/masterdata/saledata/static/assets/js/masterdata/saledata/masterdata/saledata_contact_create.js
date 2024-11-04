$(document).ready(function () {
    function loadSalutation() {
        let tbl = $('#datatable_salutation_list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('salutation_list')) {
                        return resp.data['salutation_list'] ? resp.data['salutation_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-15',
                    render: (data) => {
                        return `<span class="badge badge-primary">${data}</span>`
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-40',
                    render: (data) => {
                        return `<b class="text-primary">${data}</b>`
                    }
                },
                {
                    data: 'description',
                    className: 'wrap-text w-30',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'wrap-text w-10',
                    render: (data, type, row) => {
                        let url = $('#url-factory').data('salutation-detail').format_url_with_uuid(row?.['id'])
                        return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-salutation"
                                    data-id="${row?.['id']}"
                                    data-code="${row?.['code']}"
                                    data-title="${row?.['title']}"
                                    data-description="${row?.['description']}"
                                    data-url="${url}"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-update-salutation"
                                    data-bs-placement="top"
                                    title=""
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
        });
    }

    function loadInterest() {
        let tbl = $('#datatable_interests_list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault(
            {
                useDataServer: true,
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('interests_list')) {
                            return resp.data['interests_list'] ? resp.data['interests_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'wrap-text w-5',
                        render: () => {
                            return '';
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-15',
                        render: (data) => {
                            return `<span class="badge badge-primary">${data}</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-40',
                        render: (data) => {
                            return `<b class="text-primary">${data}</b>`
                        }
                    },
                    {
                        data: 'description',
                        className: 'wrap-text w-30',
                        render: (data) => {
                            return `<span class="initial-wrap">${data}</span>`
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let url = $('#url-factory').data('interest-detail').format_url_with_uuid(row.id)
                            return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-interest"
                                        data-id="${row?.['id']}"
                                        data-code="${row?.['code']}"
                                        data-title="${row?.['title']}"
                                        data-description="${row?.['description']}"
                                        data-url="${url}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-update-interest"
                                        data-bs-placement="top"
                                        title=""
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
            },
        );
    }

    loadSalutation()
    loadInterest()

    const form_create_salutation = $('#form-create-salutation')
    const frm_update_salutation = $('#form-update-salutation')

    $(document).on("click", '.btn-update-salutation', function () {
        let modal = $('#modal-update-salutation')
        modal.find('#code-update-salutation').val($(this).attr('data-code'))
        modal.find('#name-update-salutation').val($(this).attr('data-title'))
        modal.find('#description-update-salutation').val($(this).attr('data-description'))
        let url = frm_update_salutation.attr('data-url')
        frm_update_salutation.attr('data-url', url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(form_create_salutation).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-salutation').modal('hide');
                        $('#modal-new-salutation form')[0].reset()
                        loadSalutation();
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                })
        }
    })

    new SetupFormSubmit(frm_update_salutation).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-salutation').modal('hide');
                        loadSalutation()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    const form_create_interest = $('#form-create-interest')
    const frm_update_interest = $('#form-update-interest')

    $(document).on("click", '.btn-update-interest', function () {
        let modal = $('#modal-update-interest')
        modal.find('#code-update-interest').val($(this).attr('data-code'))
        modal.find('#name-update-interest').val($(this).attr('data-title'))
        modal.find('#description-update-interest').val($(this).attr('data-description'))
        let url = frm_update_interest.attr('data-url')
        frm_update_interest.attr('data-url', url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(form_create_interest).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-interest').modal('hide');
                        $('#modal-new-interest form')[0].reset()
                        loadInterest();
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                })
        }
    })

    new SetupFormSubmit(frm_update_interest).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-interest').modal('hide');
                        loadInterest()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
});
