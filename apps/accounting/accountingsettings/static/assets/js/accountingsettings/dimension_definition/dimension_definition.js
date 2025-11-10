$(document).ready(function () {
    const $datatableDimension = $('#datatable-dimension')
    const $formAddDimension = $('#form-add-dimension')
    const $formUpdateDimension = $('#form-update-dimension');
    let dimensionTableInstance = null;

    function initDimensionTable($form) {
        dimensionTableInstance = $datatableDimension.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            scrollCollapse: true,
            ajax: {
                url: $form.attr('data-url'),
                type: "GET",
                dataSrc: 'data.dimension_definition_list',
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div>${row?.['code']}</div>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<div>${row?.['title']}</div>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-edit"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-dimension"
                           data-bs-placement="top" title=""
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        return `${edit_btn}${delete_btn}`
                    }
                },
            ]
        })
    }

    function setupFormSubmit($form) {
        new SetupFormSubmit($form).validate({
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
                    'data': frm.dataForm,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')

                            if (dimensionTableInstance) {
                                dimensionTableInstance.ajax.reload(null, false);
                            }

                            $(form)[0].reset();

                            const $modal = $(form).closest('.modal');
                            if ($modal.length) {
                                $modal.modal('hide');
                            }
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        })
    }

    // Handle edit button click
    $datatableDimension.on('click', '.btn-edit', function() {
        const $btn = $(this);
        const id = $btn.data('id');
        const code = $btn.data('code');
        const title = $btn.data('title');

        const $formUpdate = $('#form-update-dimension');

        // Populate form fields
        $formUpdate.find('input[name="code"]').val(code);
        $formUpdate.find('input[name="title"]').val(title);

        const baseUrl = $formUpdate.attr('data-base-url');
        const newUrl = baseUrl.format_url_with_uuid(id)
        $formUpdate.attr('data-url', newUrl);
    });


    initDimensionTable($formAddDimension)
    setupFormSubmit($formUpdateDimension);
    setupFormSubmit($formAddDimension)
})