$(document).ready(function () {
    function LoadDtbOpportunityList() {
        if (!$.fn.DataTable.isDataTable('#table_opportunity_list')) {
            let $table = $('#table_opportunity_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('opportunity_list')) {
                            return resp.data['opportunity_list'] ? resp.data['opportunity_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        targets: 0,
                        className: 'w-5',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            const link = $('#opportunity-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover fw-bold" title="${row?.['code']}">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        targets: 2,
                        className: 'ellipsis-cell-lg w-20',
                        render: (data, type, row) => {
                            const link = $('#opportunity-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
                        className: 'ellipsis-cell-lg w-20',
                        render: (data, type, row) => {
                            return `<span title="${row?.['customer']?.['name']}">${row?.['customer']?.['name']}</span>`
                        }
                    },
                    {
                        targets: 4,
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<span>${row?.['sale_person']?.['full_name']}</span>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        targets: 5,
                        className: 'w-15',
                        data: "open_date",
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['close_date'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        targets: 7,
                        className: 'w-10 text-center',
                        render: (data, type, row) => {
                            let stage_current = row?.['stage'] || {}
                            return `<span title="${stage_current?.['win_rate']}%" class="bflow-mirrow-badge ${stage_current?.['win_rate'] === 100 ? 'bg-success-light-4' : 'bg-secondary-light-4'} w-100">${stage_current?.['indicator']}</span>`
                        }
                    },
                ],
            });
        }
    }

    function CallDataConfig(url, method='GET') {
        return $.fn.callAjax2({
            url: url,
            method: method,
        }).then((resp) => {
            return $.fn.switcherResp(resp);
        },
        (errs) => {
            console.log(errs)
        });
    }

    function LoadConfigPromise() {
        let url = $("#url-factory").data('url-config');
        let method = 'GET';
        return CallDataConfig(url, method).then(
            result => {
                return result?.['opportunity_config']
            },
        );
    }

    function LoadOppCustomer(data, sale_person_id) {
        $('#select-box-customer').initSelect2({
            data: data,
            dataParams: {
                'account_types_mapped__account_type_order': 0,
                'employee__id': sale_person_id,
            },
        })
    }

    function LoadOppProductCategory(data) {
        $('#select-box-product-category').initSelect2({
            data: data,
        })
    }

    function LoadSalePerson(data, config, emp_current_id, list_account_manager) {
        $('#select-box-sale-person').initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                if (!config) {
                    resp.data[keyResp].map(function (item) {
                        // if (item.group.id === $('#employee_current_group').val() && list_account_manager.includes(item.id)) {
                        if (list_account_manager.includes(item.id)) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                } else {
                    resp.data[keyResp].map(function (item) {
                        if (item.id === emp_current_id) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                }
            }
        })
    }

    function CombinesDataCreate(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['product_category'] = $('#select-box-product-category').val();
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    LoadConfigPromise().then(
        config => {
            let employee_current = $('#employee_current_id').val();
            const customerSelectEle = $('#select-box-customer');

            LoadDtbOpportunityList();

            new SetupFormSubmit($('#form-create_opportunity')).validate({
                rules: {
                    customer: {
                        required: true,
                    },
                    title: {
                        required: true,
                    },
                    employee_inherit_id: {
                        required: true,
                    }
                },
                submitHandler: function (form) {
                    let combinesData = CombinesDataCreate($(form))
                    $.fn.callAjax2({
                        url: combinesData.url,
                        method: combinesData.method,
                        data: combinesData.data,
                        isLoading: true,
                        loadingOpts: {'loadingTitleAction': 'CREATE'}
                    }).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            setTimeout(() => {
                                window.location.href = $(form).data('url-detail').format_url_with_uuid(data.id);
                            }, 1000)
                        }
                    }, (errs) => {
                        $.fn.switcherResp(errs);
                    })
                }
            });

            LoadOppCustomer({}, employee_current);
            LoadOppProductCategory();

            customerSelectEle.on('change', function () {
                let customer = SelectDDControl.get_data_from_idx($(this), $(this).val());
                LoadSalePerson({}, config?.['is_account_manager_create'], employee_current, customer?.['manager'].map(obj => obj?.['id']));
            })
        }
    );
})
