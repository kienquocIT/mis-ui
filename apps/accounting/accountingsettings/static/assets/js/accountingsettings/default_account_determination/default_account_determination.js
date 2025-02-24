$(document).ready(function() {
    const account_determination_table = $('#account-determination-table')
    const sale_table_data = $('#sale-table-data')
    const purchasing_table_data = $('#purchasing-table-data')
    const inventory_table_data = $('#inventory-table-data')
    const columns_cfg = [
        {
            className: 'wrap-text w-5',
            'render': () => {
                return ``;
            }
        },
        {
            className: 'wrap-text w-35',
            'render': (data, type, row) => {
                return `<span class="${row?.['is_default'] ? 'text-secondary' : 'text-primary'}">${row?.['title']}</span>`;
            }
        },
        {
            className: 'wrap-text w-20',
            'render': (data, type, row) => {
                return `<span class="${row?.['is_default'] ? 'text-secondary' : 'text-primary'}">${row?.['account_mapped']?.['acc_code']}</span>`;
            }
        },
        {
            className: 'wrap-text w-30',
            'render': (data, type, row) => {
                return `<span class="${row?.['is_default'] ? 'text-secondary' : 'text-primary'}">${row?.['account_mapped']?.['acc_name']}</span>`;
            }
        },
        {
            className: 'wrap-text text-right w-10',
            'render': (data, type, row) => {
                let btn_edit = `<button class="btn btn-icon btn-rounded btn-flush-primary btn-sm btn-edit-row">
                    <span class="icon">
                        <i class="fas fa-edit"></i>
                    </span>
                </button>`
                let btn_delete = `<button class="btn btn-icon btn-rounded btn-flush-secondary btn-sm btn-delete-row">
                    <span class="icon">
                        <i class="fas fa-trash-alt"></i>
                    </span>
                </button>`
                return row?.['is_default'] ? '' : btn_edit + btn_delete;
            }
        },
    ]

    $('.tab-btn').on('click', function() {
        $('.tab-btn').removeClass('btn-primary w-20').addClass('btn-outline-primary w-10');
        $(this).removeClass('btn-outline-primary w-10').addClass('btn-primary w-20');
    });

    function loadDefinitionTable(data_param={}, data_list={}) {
        let frm = new SetupFormSubmit(account_determination_table);
        account_determination_table.DataTable().clear().destroy()
        if (Object.keys(data_list).length === 0) {
            account_determination_table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    data: data_param,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            let data_list = resp.data['default_account_determination_list'] ? resp.data['default_account_determination_list'] : []
                            data_list.sort((a, b) => {
                                const codeA = a?.['account_mapped']?.['acc_code'];
                                const codeB = b?.['account_mapped']?.['acc_code'];
                                if (codeA < codeB) {
                                    return -1;
                                }
                                if (codeA > codeB) {
                                    return 1;
                                }
                                return 0;
                            });
                            if (data_param?.['default_account_determination_type'] === 0) {
                                sale_table_data.text(JSON.stringify(data_list))
                            }
                            else if (data_param?.['default_account_determination_type'] === 1) {
                                purchasing_table_data.text(JSON.stringify(data_list))
                            }
                            else if (data_param?.['default_account_determination_type'] === 2) {
                                inventory_table_data.text(JSON.stringify(data_list))
                            }

                            return data_list ? data_list : [];
                        }
                        return [];
                    },
                },
                columns: columns_cfg,
            });
        }
        else {
            account_determination_table.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                data: data_list,
                columns: columns_cfg,
            });
        }
    }

    loadDefinitionTable({'default_account_determination_type': 0})

    $('#btn-sale').on('click', function () {
        let data_list = sale_table_data.text() ? JSON.parse(sale_table_data.text()) : []
        loadDefinitionTable({'default_account_determination_type': 0}, data_list)
    })

    $('#btn-purchasing').on('click', function () {
        let data_list = purchasing_table_data.text() ? JSON.parse(purchasing_table_data.text()) : []
        loadDefinitionTable({'default_account_determination_type': 1}, data_list)
    })

    $('#btn-inventory').on('click', function () {
        let data_list = inventory_table_data.text() ? JSON.parse(inventory_table_data.text()) : []
        loadDefinitionTable({'default_account_determination_type': 2}, data_list)
    })

});