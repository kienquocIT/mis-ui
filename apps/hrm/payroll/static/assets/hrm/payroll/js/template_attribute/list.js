$(document).ready(function () {
    function loadTemplateAttributeList() {
        let tbl = $('#tbl_template_attr');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy();
        tbl.DataTableDefault({
            userDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('template_attribute_list')) {
                        return resp.data['template_attribute_list'] ?? [];
                    }
                    throw Error('Call data raise errors.');
                },
            },
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return ""
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row, meta) => {
                        return row?.['title'] || '';
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row, meta) => {
                        return row?.['name'] || '';
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row, meta) => {
                        return row?.['code'] || '--';
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row, meta) => {
                        return row?.['attribute_type'] || '--';
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row, meta) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                    }
                },
                {
                    className: "w-10 text-right",
                    render: () => {
                        return `
                            <button type="button" 
                                    class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover edit-row"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#templateAttributeModal"
                                    data-id="${row?.id}">
                                <span class="icon"><i class="far fa-edit text-primary"></i></span>
                            </button>
                            <button type="button" 
                                    class="btn btn-icon btn-rounded btn-flush-danger flush-soft-hover del-row">
                                <span class="icon"><i class="far fa-trash-alt text-danger"></i></span>
                            </button>
                        `;
                    }
                },
            ]
        });
    }

    loadTemplateAttributeList();
})