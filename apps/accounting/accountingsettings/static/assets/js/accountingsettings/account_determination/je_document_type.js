$(document).ready(function() {
    const $je_document_type_table = $('#je-document-type-table')
    function LoadJEDocumentTypeTable() {
        $je_document_type_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($je_document_type_table);
        $je_document_type_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            ajax: {
                url: $('#script-url').attr('data-url-list'),
                data: {},
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_list = resp.data['je_document_type'] ? resp.data['je_document_type'] : []
                        return data_list ? data_list : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => ''
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn bflow-mirrow-btn bg-primary-light-4">${row?.['code'] || ''}</button>`;
                    }
                },
                {
                    className: 'w-45',
                    render: (data, type, row) => {
                        return `<span>${row?.['app_code_parsed'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['module_parsed'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10 text-center',
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input type="checkbox" data-app-id="${row?.['id']}" class="form-check-input is-active-app" ${row?.['is_auto_je'] ? 'checked' : ''}>
                        </div>`;
                    }
                },
                {
                    className: 'w-10 text-center',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn bflow-mirrow-btn"><i class="fa-solid fa-code-branch"></i></button>`;
                    }
                },
            ],
            rowGroup: {
                dataSrc: 'module_parsed'
            },
            columnDefs: [
                {
                    "visible": false,
                    "targets": [3]
                }
            ],
        });
    }

    LoadJEDocumentTypeTable()

    $(document).on('change', '.is-active-app', function () {
        let data = {'is_auto_je': $(this).prop('checked')}
        let app_id = $(this).attr('data-app-id')
        Swal.fire({
            html:
            `<div class="d-flex align-items-center">
                <h4 class="text-blue">${$.fn.gettext('Are you sure you want to enable automatic journal entries for this transaction?')}</h4>
            </div>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-blue',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg',
                htmlContainer: 'bg-transparent text-start',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: $.fn.gettext('Confirm'),
            cancelButtonText: $.fn.gettext('Cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let ajax_update = $.fn.callAjax2({
                    url: $('#script-url').attr('data-url-detail').replace('/0', `/${app_id}`),
                    data: data,
                    method: 'PUT'
                }).then(
                    (resp) => {
                        $.fn.notifyB({description: 'Successfully'}, 'success');
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )

                Promise.all([ajax_update]).then(
                    (results) => {
                        location.reload()
                    }
                )
            }
        })
    })
})