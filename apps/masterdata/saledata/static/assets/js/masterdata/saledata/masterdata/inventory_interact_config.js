$(document).ready(function () {
    const wh_listEle = $('#wh_list')
    const wh_list = wh_listEle.text() ? JSON.parse(wh_listEle.text()) : {};
    const main_table = $('#inventory-interact-config-table');
    const select_emp = $('#emp-name-select')
    const wh_list_table = $('#wh_list_table')
    const main_form = $('#form-inventory-interact-config')

    function LoadMainTable() {
        main_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(main_table);
        main_table.DataTableDefault(
            {
                rowIdx: true,
                useDataServer: true,
                reloadCurrency: true,
                paging: false,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('inventory_interact_config_list')) {
                            return resp.data['inventory_interact_config_list'] ? resp.data['inventory_interact_config_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="badge badge-primary">${row?.['employee']?.['code']}</span>`;
                        }
                    },
                    {
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['employee']?.['fullname']}</span>`;
                        }
                    },
                    {
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let html = ``
                            for (const item of row?.['warehouse_list']) {
                                html += `<span class="mb-2 badge badge-secondary">${item?.['code']}</span>&nbsp;<span class="text-secondary">${item?.['title']}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
                            }
                            return `${html}`;
                        }
                    },
                    {
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                ],
            },
        );
    }
    LoadMainTable()

    function LoadEmp(data) {
        select_emp.initSelect2({
            allowClear: true,
            ajax: {
                url: select_emp.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }
    LoadEmp()

    $(document).on("click", '.delete-btn', function () {
        $(this).closest('tr').remove()
        let count = 1
        for (const row of main_table.find('tbody tr')) {
            $(row).find('.num-row').text(count)
            count += 1
        }
    })

    $('#btn-add-row').on('click', function () {
        wh_list_table.find('tbody').html('')
        for (const wh_obj of wh_list) {
            wh_list_table.find('tbody').append(`
                <tr>
                    <td class="text-center">
                        <div class="form-check">
                            <input checked type="checkbox" class="form-check-input select-wh" id="${wh_obj?.['id']}">
                        </div>
                    </td>
                    <td><span class="badge badge-sm badge-soft-primary">${wh_obj?.['code']}</span>&nbsp;${wh_obj?.['title']}</td>
                    <td><textarea disabled readonly class="form-control">${wh_obj?.['full_address']}</textarea></td>
                </tr>
            `)
        }
    })

    function combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        let warehouse_list = []
        wh_list_table.find('tbody tr .select-wh').each(function() {
            if ($(this).prop('checked')) {
                warehouse_list.push($(this).attr('id'))
            }
        })
        frm.dataForm['warehouse_list'] = warehouse_list;
        frm.dataForm['employee'] = select_emp.val();

        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    main_form.submit(function (event) {
        event.preventDefault();
        let data = combinesData($(this));
        if (data) {
            WindowControl.showLoading();
            $.fn.callAjax2(data)
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