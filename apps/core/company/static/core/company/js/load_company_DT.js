/*Blog Init*/
$(function () {
    let company_current_id = $('#company-current-id').attr('data-id')
    let dtb = $('#datable_company_list');
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            data: function (d) {
                d.is_done = false;
            },
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('company_list')) {
                    return resp.data['company_list'] ? resp.data['company_list'] : [];
                }
                throw Error('Call data raise errors.')
            },
        },
        columns: [
            {
                width: '5%',
                render: () => {
                    return '';
                },
            }, {
                width: '10%',
                data: 'code',
                className: 'wrap-text',
                render: (data, type, row, meta) => {
                    return `<a href="/company/detail/` + row.id + `">` + data + `</a>`
                }
            }, {
                width: '30%',
                data: 'title',
                className: 'wrap-text',
                'render': (data, type, row, meta) => {
                    if (data) {
                        return `<div class="media align-items-center">
                                        <div class="media-head me-2">
                                            <div class="avatar avatar-xs avatar-success avatar-rounded">
                                                <span class="initial-wrap"><b>` + row.title.charAt(0).toUpperCase() + `</b></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <a href="/company/detail/` + row.id + `">
                                                <span class="d-block"><b>` + row.title + `</b></span>
                                            </a>
                                        </div>
                                    </div>`;
                    } else {
                        return ''
                    }
                }

            }, {
                width: '20%',
                data: 'date_created',
                render: (data, type, row, meta) => {
                    let date = new Date(data).toLocaleDateString("en-GB")
                    let time = new Date(data).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });
                    return date + ' ' + time;
                }
            }, {
                width: '20%',
                data: 'representative_fullname',
                render: (data, type, row, meta) => {
                    if (data) {
                        return `<div class="representative_fullname"><span class="badge badge-primary">` + data + `</span></div>`;
                    } else {
                        return `<div class="representative_fullname"><span class="badge badge-primary">` + $('input[name=default_representative_name]').val() + `</span></div>`;
                    }
                }
            }, {
                width: '15%',
                className: 'action-center',
                render: (data, type, row, meta) => {
                    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" id="edit-company-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="/company/update/` + row.id + `" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" id="del-company-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    let bt1 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-setting" data-bs-toggle="modal" data-bs-target="#modal-setting" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="settings"></i></span></span></a>`;
                    if (row.id === company_current_id) {
                        return `<div>` + bt2 + bt3 + bt1 + `</div>`;
                    } else {
                        return `<div>` + bt2 + bt3 + `</div>`;
                    }
                }
            },
        ]
    });

    // Load Data Config
    $('html').on('click', '.btn-setting', function (e) {
        e.preventDefault();
        let rowData = DTBControl.getRowData($(this));
        let modalControl = $('#modal-setting');
        Promise.all([
            $.ajax(
                modalControl.attr('data-url-detail'),
                'GET'
            ),
            $.ajax(
                modalControl.attr('data-url-currency-list'),
                'GET'
            )
        ]).then(([result1, result2]) => {
            let data1 = $.fn.switcherResp(result1);
            let data2 = $.fn.switcherResp(result2);
            let myCurrency = $('#idxCurrencyDefault');
            myCurrency.closest('.modal').find('.modal-title').text(
                DTBControl.getRowData($(this))?.['title']
            )
            if (data2['currency_list']) {
                myCurrency.empty();
                for (let i = 0; i < data2['currency_list'].length; i++) {
                    let option = $('<option>').val(
                        data2['currency_list'][i]['currency'].code
                    ).text(
                        data2['currency_list'][i]['currency'].code +
                        ' - ' +
                        data2['currency_list'][i]['currency'].title
                    );
                    myCurrency.append(option);
                }
                myCurrency.trigger('change');
            }
            if (data1['config']) {
                $('#idxLanguage').val(data1['config']['language']).trigger('change.select2');
                myCurrency.val(data1['config']['currency']['code']).trigger('change.select2');
                $('#idxCurrencyMaskPrefix').val(data1['config']['currency_rule'].prefix);
                $('#idxCurrencyMaskSuffix').val(data1['config']['currency_rule'].suffix);
                $('#idxCurrencyMaskThousand').val(data1['config']['currency_rule'].thousands);
                $('#idxCurrencyMaskDecimal').val(data1['config']['currency_rule'].decimal);
                $('#idxCurrencyMaskPrecision').val(data1['config']['currency_rule'].precision);
            }
        })
    })

    $('#tblCompanySetting').on('submit', function (e) {
        WindowControl.showLoading();

        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let dataBody = frm.dataForm
        dataBody['currency_rule'] = SetupFormSubmit.groupDataFromPrefix(dataBody, 'currency_rule__');

        if (
            dataBody['currency_rule'] &&
            (
                dataBody['currency_rule']['thousands'] &&
                dataBody['currency_rule']['decimal'] &&
                dataBody['currency_rule']['thousands'] === dataBody['currency_rule']['decimal']
            )
        ) {
            WindowControl.hideLoading();
            $.fn.notifyB({
                'description': "Decimal values are not allowed to be the same as thousands"
            }, 'failure');
            e.preventDefault();
        } else if (dataBody['currency_rule'] && dataBody['currency_rule']['thousands'] === '.' && !dataBody['currency_rule']['decimal']) {
            WindowControl.hideLoading();
            $.fn.notifyB({
                'description': "Decimal default values is dot(.), please select thousand value isn't dot(.)"
            }, 'failure');
            e.preventDefault();
        } else {
            $.fn.callAjax(frm.dataUrl, frm.dataMethod, dataBody, csr).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data['status'] === 200) {
                    window.location.reload();
                }
            }, (errs) => {
                WindowControl.hideLoading();
            });
        }
    })

});
