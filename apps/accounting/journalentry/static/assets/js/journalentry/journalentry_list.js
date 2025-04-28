$(document).ready(function() {
    function loadJEList() {
        if (!$.fn.DataTable.isDataTable('#je-table-list')) {
            let dtb = $('#je-table-list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['journal_entry_list'] ? resp.data['journal_entry_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-30',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `<span>${row?.['original_transaction']}</span>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `<span>${(row?.['je_transaction_data'] || {})?.['code'] || ''}</span>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'text-center w-15',
                        render: (data, type, row) => {
                            let text = [$.fn.gettext('Create manually'), $.fn.gettext('Create automatically')][Number(row?.['system_auto_create'])]
                            let color = ['text-primary', 'text-blue'][Number(row?.['system_auto_create'])]
                            return `<span class="${color}">${text}</span>`
                        }
                    },
                ]
            });
        }
    }

    loadJEList();
})