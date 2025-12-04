$(document).ready(function() {
    const $je_posting_group_table = $('#je-posting-group-table')
    function LoadJEPostingGroupTable() {
        $je_posting_group_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($je_posting_group_table);
        $je_posting_group_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '68vh',
            scrollCollapse: true,
            ajax: {
                url: $('#script-url').attr('data-url-list'),
                data: {},
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_list = resp.data['je_posting_group'] ? resp.data['je_posting_group'] : []
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
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="fw-bold">${row?.['code'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-45',
                    render: (data, type, row) => {
                        return `<span>${row?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span>${row?.['posting_group_type_parsed'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10 text-right',
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input type="checkbox" data-id="${row?.['id']}" class="form-check-input is-active" ${row?.['is_active'] ? 'checked' : ''}>
                        </div>`;
                    }
                },
            ],
        });
    }

    LoadJEPostingGroupTable()

})