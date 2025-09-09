$(document).ready(function () {
    function loadDtbOpportunityList() {
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
                            return `<span title="${row?.['customer']?.['title']}">${row?.['customer']?.['title']}</span>`
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
                        className: 'w-10',
                        render: (data, type, row) => {
                            let stage_current = row?.['stage'] || {}
                            return `<span class="badge badge-pill text-dark ${stage_current?.['win_rate'] === 100 ? 'bg-success-light-4' : 'bg-secondary-light-4'} w-100">${stage_current?.['indicator']} (${stage_current?.['win_rate']}%)</span>`
                        }
                    },
                ],
            });
        }
    }


    LoadConfigAndLoadStage.loadConfigPromise().then(
        config => {
            let employee_current = $('#employee_current_id').val();
            const customerSelectEle = $('#select-box-customer');

            loadDtbOpportunityList();

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
                    let combinesData = OpportunityLoadDropdown.combinesData($(form))
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

            OpportunityLoadDropdown.LoadOppCustomer({}, employee_current);
            OpportunityLoadDropdown.LoadOppProductCategory();

            customerSelectEle.on('change', function () {
                let customer = SelectDDControl.get_data_from_idx($(this), $(this).val());
                OpportunityLoadDropdown.loadSalePerson({}, config.is_account_manager_create, employee_current, customer.manager.map(obj => obj.id));
            })
        }
    );
})
