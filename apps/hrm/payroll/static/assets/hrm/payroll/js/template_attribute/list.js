$(document).ready(function () {
    const COMPONENT_TYPE_MAP = {
        0: 'Number',
        1: 'Text',
        2: 'Date',
        3: 'Boolean',
        4: 'Formula'
    };
    const modalElmForm = $('#frm_template_attribute')
    function loadTemplateAttributeList() {
        let tbl = $('#tbl_template_attr');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy();
        const attrTbl = tbl.DataTableDefault({
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
                    data: 'component_title',
                    className: 'w-25',
                    render: (row) => {
                        return `<a href="#" class="link-primary underline_hover edit-attr">${row}</a>`;
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return row?.['component_name'] || '';
                    }
                },
                {
                    data: 'component_code',
                    className: 'w-15',
                    render: (row) => {
                        return row || '--'
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        let typeValue = row?.['component_type'];
                        return COMPONENT_TYPE_MAP[typeValue] || '--';
                    }
                }
            ]
        });

        // view detail or edit attribute
        attrTbl.on('click', '.edit-attr', function(e){
            let td = attrTbl.cell($(this).closest('td'));
            let data = attrTbl.row(td[0][0].row).data();
            e.stopPropagation()
            e.preventDefault()
            const id = $(`<input name="id" value="${data.id}" type="hidden"/>`)
            modalElmForm.find('input[name="id"]').remove()
            modalElmForm.append(id)
            modalElmForm.find('#template_attr_title').val(data.component_title)
            modalElmForm.find('#template_attr_name').val(data.component_name)
            modalElmForm.find('#template_attr_code').val(data.component_code)
            modalElmForm.find(`#template_attr_type option[value="${data.component_type}"]`).attr('selected', true).trigger('change')
            modalElmForm.find(`#mandatory`).prop('checked', data.component_mandatory)
            modalElmForm.find(`#formula_element`).val(data.component_formula)

            modalElmForm.closest('.modal').modal('show');
        });
    }

    loadTemplateAttributeList();
})