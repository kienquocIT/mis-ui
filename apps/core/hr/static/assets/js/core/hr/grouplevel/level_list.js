$(function () {
    $(document).ready(function () {

        let $table = $('#datable-group-level');
        let formSubmit = $('#frm_group_level_create');

        function loadDbl() {
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('group_level_list')) {
                            return resp.data['group_level_list'] ? resp.data['group_level_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columnDefs: [
                    {
                        "width": "5%",
                        "targets": 0
                    }, {
                        "width": "30%",
                        "targets": 1
                    }, {
                        "width": "30%",
                        "targets": 2
                    }, {
                        "width": "30%",
                        "targets": 3
                    }, {
                        "width": "5%",
                        "targets": 4
                    }
                ],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control table-row-level" value="${row.level}">`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control table-row-description" value="${row.description}">`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control table-row-first-manager-description" value="${row.first_manager_description}">`
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control table-row-second-manager-description" value="${row.second_manager_description}">`
                        }
                    },
                    {
                        targets: 4,
                        className: 'action-center',
                        render: (data, type, row) => {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover table-row-save" data-id="${row.id}" disabled><span class="icon"><i class="fa-regular fa-floppy-disk"></i></span></button>`;
                        },
                    }
                ],
            });
        }
        loadDbl();

        $table.on('change', '.table-row-level, .table-row-description, .table-row-first-manager-description, .table-row-second-manager-description', function() {
            let row = $(this)[0].closest('tr');
            row.querySelector('.table-row-save').removeAttribute('disabled');
            row.querySelector('.table-row-save').classList.remove('flush-soft-hover');
            row.querySelector('.table-row-save').classList.add('btn-soft-warning');
        });

// Action on btn cancel
        $('#btn-cancel-group-level').on('click', function() {
            $.fn.redirectUrl(formSubmit.attr('data-url-cancel'), 1000);
        })

// Setup data submit
        function setupDataSubmit(_form) {
            let order = 1;
            let tableEmpty = $table[0].querySelector('.dataTables_empty');
            let tableBody = $table[0].tBodies[0];
            if (tableBody.rows.length !== 0 && !tableEmpty) {
                order = (tableBody.rows.length + 1);
            }
            _form.dataForm['level'] = order;
            _form.dataForm['description'] = $('#group-level-create-description').val();
            _form.dataForm['first_manager_description'] = $('#group-level-create-first-manager-description').val();
            _form.dataForm['second_manager_description'] = $('#group-level-create-second-manager-description').val();
            return true
        }

// Submit form create
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            setupDataSubmit(_form)
            let submitFields = [
                'level',
                'description',
                'first_manager_description',
                'second_manager_description',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });

// submit edit on row
        $table.on('click', '.table-row-save', function() {
            let url_update = formSubmit.attr('data-url-update');
            let url = url_update.format_url_with_uuid($(this).attr('data-id'));
            let url_redirect = formSubmit.attr('data-url-redirect');
            let method = "PUT";
            let data_submit = {};
            let row = $(this)[0].closest('tr');
            data_submit['level'] = parseInt(row.querySelector('.table-row-level').value);
            data_submit['description'] = row.querySelector('.table-row-description').value;
            data_submit['first_manager_description'] = row.querySelector('.table-row-first-manager-description').value;
            data_submit['second_manager_description'] = row.querySelector('.table-row-second-manager-description').value;
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(url, method, data_submit, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl(url_redirect, 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });




    });
});