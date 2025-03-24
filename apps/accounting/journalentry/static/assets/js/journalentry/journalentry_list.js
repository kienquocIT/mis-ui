$(document).ready(function() {
    function loadJEList() {
        if (!$.fn.DataTable.isDataTable('#je-table-list')) {
            let dtb = $('#je-table-list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
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
                        className: 'wrap-text w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`;
                        }
                    },
                    {
                        className: 'wrap-text w-30',
                        render: (data, type, row) => {
                            return `<span class="text-muted">${row?.['original_transaction']}</span>`
                        }
                    },
                    {
                        className: 'wrap-text w-30',
                        render: (data, type, row) => {
                            if (row?.['je_transaction_data']?.['code']) {
                                return `<span class="badge badge-light">${row?.['je_transaction_data']?.['code']}</span>`
                            }
                            else {
                                return ``
                            }
                        }
                    },
                    {
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY',});
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let text = [$.fn.gettext('Create manually'), $.fn.gettext('Create automatically')][Number(row?.['system_auto_create'])]
                            let color = ['primary', 'blue'][Number(row?.['system_auto_create'])]
                            return `<span class="badge badge-outline badge-soft-${color}">${text}</span>`
                        }
                    },
                ]
            });
        }
    }

    loadJEList();
})