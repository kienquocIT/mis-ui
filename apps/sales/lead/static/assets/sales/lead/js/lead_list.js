$(document).ready(function () {
    function loadLeadList() {
        if (!$.fn.DataTable.isDataTable('#lead-list-table')) {
            let dtb = $('#lead-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['lead_list'] ? resp.data['lead_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `${row?.['title']}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `<span class="badge badge-sm badge-blue">${row?.['source']}</span>`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `${row?.['contact_name']}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `${moment(row?.['date_created'].split(' ')[0]).format('DD/MM/YYYY')}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `<span class="fst-italic">${row?.['lead_status']}</span>`;
                        }
                    },
                ]
            });
        }
    }

    loadLeadList();

    $('#reload-invoice-status-btn').on('click', function () {
        WindowControl.showLoading();
        let url_loaded = $('#datatable_ar_invoice_list').attr('data-url') + `?update_status=true`
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    WindowControl.hideLoading();
                    $.fn.notifyB({description: "Update successfully"}, 'success')
                    setTimeout(() => {
                        window.location.replace($('#datatable_ar_invoice_list').attr('data-url-redirect'));
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
            })
    })
})