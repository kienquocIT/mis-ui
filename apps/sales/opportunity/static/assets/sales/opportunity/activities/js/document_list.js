$(document).ready(function (){
    function loadDocument() {
        if (!$.fn.DataTable.isDataTable('#datatable-opportunity-document')) {
            let $table = $('#datatable-opportunity-document')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
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
                        targets: 0,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                             return `<p>${row.to_contact}</p>`
                        }
                    },
                    {
                        targets: 1,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                             return `<p>${row.subject}</p>`
                        }
                    },
                    {
                        targets: 2,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                             return `<p>${row.opportunity.code}</p>`
                        }
                    },
                    {
                        targets: 3,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                             return `<p>${row.request_completed_date.split(' ')[0]}</p>`
                        }
                    },

                    {
                        targets: 4,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                             return `<a class="btn-primary btn" href="${$('#inp-url').data('url-detail').format_url_with_uuid(row.id)}">Detail</a>`
                        }
                    },
                ],
            });
        }
    }

    loadDocument();
})