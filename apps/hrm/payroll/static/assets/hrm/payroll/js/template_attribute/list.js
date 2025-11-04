$(document).ready(function () {
    const COMPONENT_TYPE_MAP = {
        0: 'Number',
        1: 'Text',
        2: 'Date',
        3: 'Boolean',
        4: 'Formula'
    };

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
                    className: 'w-25',
                    render: (data, type, row) => {
                        const title = row?.['component_title'] || '';
                        return `<a href="javascript:void(0)" 
                                   class="link-primary underline_hover edit-attr" data-id="${row?.['id']}" data-action="edit"
                                   data-bs-toggle="modal" data-bs-target="#templateAttributeModal"
                                   data-id="${row?.id || ''}"
                                   data-title="${row?.['component_title'] || ''}"
                                   data-name="${row?.['component_name'] || ''}"
                                   data-code="${row?.['component_code'] || ''}"
                                   data-type="${row?.['component_type'] ?? ''}"
                                   data-mandatory="${row?.['component_mandatory'] || false}"
                                   data-formula="${row?.['component_formula'] || ''}">${title}
                                </a>`;
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return row?.['component_name'] || '';
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        const code = row?.['component_code'] || '--';
                        return `<a href="javascript:void(0)" 
                                   class="link-primary underline_hover edit-attr" data-id="${row?.['id']}" data-action="edit"
                                   data-bs-toggle="modal" data-bs-target="#templateAttributeModal"
                                   data-id="${row?.id || ''}"
                                   data-title="${row?.['component_title'] || ''}"
                                   data-name="${row?.['component_name'] || ''}"
                                   data-code="${row?.['component_code'] || ''}"
                                   data-type="${row?.['component_type'] ?? ''}"
                                   data-mandatory="${row?.['component_mandatory'] || false}"
                                   data-formula="${row?.['component_formula'] || ''}">${code}
                                </a>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        let typeValue = row?.['component_type'];
                        return COMPONENT_TYPE_MAP[typeValue] || '--';
                    }
                },
                {
                    className: "w-10 text-right",
                    render: (data, type, row) => {
                        return `
                            <button type="button" 
                                    class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover edit-attr"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#templateAttributeModal"
                                    data-id="${row?.id || ''}"
                                    data-title="${row?.['component_title'] || ''}"
                                    data-name="${row?.['component_name'] || ''}"
                                    data-code="${row?.['component_code'] || ''}"
                                    data-type="${row?.['component_type'] ?? ''}"
                                    data-mandatory="${row?.['component_mandatory'] || false}"
                                    data-formula="${row?.['component_formula'] || ''}">
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