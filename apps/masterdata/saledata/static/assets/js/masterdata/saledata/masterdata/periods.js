$(document).ready(function () {
    $('#periods-fiscal-year').on('change', function () {
        if ($(this).val() !== '') {
            $('#periods-start-date').val(`${$(this).val()}-01-01`)
            // $('#periods-start-date').prop('readonly', false)
            // InitPeriodsStartDate($(this).val())
        }
        else {
            $('#periods-start-date').prop('readonly', true)
        }
    })

    const TablePeriodsConfig = $('#table-periods-config')

    function loadPeriodsList() {
        TablePeriodsConfig.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(TablePeriodsConfig);
        TablePeriodsConfig.DataTableDefault(
            {
                useDataServer: true,
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('periods_list')) {
                            return resp.data['periods_list'] ? resp.data['periods_list'] : []
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
                        className: 'wrap-text w-10',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-primary">${row.code}</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-30',
                        render: (data, type, row, meta) => {
                            return `<span class="text-primary"><b>${row.title}</b></span>`
                        }
                    },
                    {
                        data: 'fiscal_year',
                        className: 'wrap-text w-20',
                        render: (data, type, row, meta) => {
                            return `<span class="initial-wrap">${row.fiscal_year}</span>`
                        }
                    },
                    {
                        data: 'start_date',
                        className: 'wrap-text w-25',
                        render: (data, type, row, meta) => {
                            let parsedDate = new Date(row.start_date);
                            let formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getFullYear()}`;
                            return `<span class="initial-wrap">${formattedDate}</span>`
                        }
                    },
                    {
                        className: 'wrap-text w-10 text-center',
                        render: (data, type, row, meta) => {
                            return `<button data-id="${row.id}" data-title="${row.title}" data-code="${row.code}" data-fiscal-year="${row.fiscal_year}" data-start-date="${row.start_date}"
                                            class="btn btn-icon btn-rounded btn-flush-primary edit-periods" type="button" data-bs-toggle="modal" data-bs-target="#modal-periods-update">
                                        <span class="icon"><i class="bi bi-pencil-square"></i></span>
                                    </button>`
                        }
                    }
                ],
            },
        );
    }

    loadPeriodsList()

    $(document).on("click", '.edit-periods', function () {
        let periods_id = $(this).attr('data-id')
        let periods_title = $(this).attr('data-title')
        let periods_code = $(this).attr('data-code')
        let periods_fiscal_year = $(this).attr('data-fiscal-year')
        let periods_start_date = $(this).attr('data-start-date')

        $('#form-update-periods-config').attr('data-id', periods_id)
        $('#periods-title-update').val(periods_title)
        $('#periods-code-update').val(periods_code)
        $('#periods-fiscal-year-update').val(periods_fiscal_year)
        $('#periods-start-date-update').val(periods_start_date)
    })

    function combinesDataPeriodsCreate(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#periods-title').val();
        frm.dataForm['code'] = $('#periods-code').val();
        frm.dataForm['fiscal_year'] = $('#periods-fiscal-year').val();
        frm.dataForm['start_date'] = $('#periods-start-date').val();

        console.log(frm.dataForm)
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    function combinesDataPeriodsUpdate(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#periods-title-update').val();
        frm.dataForm['code'] = $('#periods-code-update').val();
        frm.dataForm['fiscal_year'] = $('#periods-fiscal-year-update').val();
        frm.dataForm['start_date'] = $('#periods-start-date-update').val();

        console.log(frm.dataForm)
        let pk = frmEle.attr('data-id');
        return {
            url: frmEle.attr('data-url').format_url_with_uuid(pk),
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-create-periods-config').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataPeriodsCreate($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    $('#form-update-periods-config').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataPeriodsUpdate($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })
});