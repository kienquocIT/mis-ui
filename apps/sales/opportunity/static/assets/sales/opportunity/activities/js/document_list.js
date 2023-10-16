$(document).ready(function () {
    let urlEle = $('#url-factory')
    function loadDocument() {
        if (!$.fn.DataTable.isDataTable('#datatable-opportunity-document')) {
            let $table = $('#datatable-opportunity-document')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('document_list')) {
                            return resp.data['document_list'] ? resp.data['document_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        data: 'title',
                        targets: 0,
                        render: (data, type, row) => {
                            let urlDetail = urlEle.data('url-detail').format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="badge badge-primary">${data}</span></a>` + $x.fn.buttonLinkBlank(urlDetail);
                        }
                    },
                    {
                        data: 'opportunity',
                        targets: 1,
                        render: (data, type, row) => {
                            return `<p>${data.code}</p>`
                        }
                    },
                    {
                        data: 'person_in_charge',
                        targets: 2,
                        render: (data, type, row) => {
                            let html = ``;
                            data.map(function (item) {
                                html += `<span class="col-4 badge badge-soft-primary">${item.full_name}</span>`
                            })
                            return `<div class="row">${html}</div>`
                        }
                    },
                    {
                        data: 'request_completed_date',
                        targets: 3,
                        render: (data, type, row) => {
                            return `<p>${data.split(' ')[0]}</p>`
                        }
                    },
                ],
            });
        }
    }

    loadDocument();
})