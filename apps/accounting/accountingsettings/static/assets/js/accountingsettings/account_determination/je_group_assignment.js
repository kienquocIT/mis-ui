$(document).ready(function() {
    const $je_group_assignment_table = $('#je-group-assignment-table')
    function LoadJEGroupAssignmentTable() {
        $je_group_assignment_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($je_group_assignment_table);
        $je_group_assignment_table.DataTableDefault({
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
                        let data_list = resp.data['je_group_assignment'] ? resp.data['je_group_assignment'] : []
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
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span>${row?.['code'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-55',
                    render: (data, type, row) => {
                        return `<span class="fw-bold">${row?.['posting_group']?.['code'] || ''}</span><br><span>${row?.['posting_group']?.['title'] || ''}</span>`;
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

    LoadJEGroupAssignmentTable()

})