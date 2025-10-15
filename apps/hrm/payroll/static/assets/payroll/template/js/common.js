class PayrollTemplateCommon {
    constructor(){
        this.init()

    }
    getSystemAttribute(){
        $.fn.callAjax2({
            url: $('#url-factory').attr('data-attr-lst'),
            type: 'GET',
            isNotify: false
        }).then((req) => {
            const res = $.fn.switcherResp(req);

        })
    }

    init(){
        const _tblAttr = $('#tbl_attribute_list').DataTableDefault({
            data: [],
            rowIdx: true,
            pageLength: 50,
            columns: [
                {
                    data: 'order',
                    width: '5%',
                    orderable: false,
                    defaultContent: ''
                },
                {
                    data: 'name',
                    render: (row, type, data, meta) => {
                        let html = `<input type="text" class="form-control" id="attr_name_${meta.row}"/>`
                        if (row )
                            html = '<p>${row}</p>'
                        return html
                    }
                },
                {
                    data: 'source',
                    render: (row) => {
                        let html = `<select`
                        if (row !== null)

                        return html
                    }
                },
                {
                    data: 'code',
                    render: (row) => {
                        let name = 'this code';
                        return name
                    }
                },
                {
                    data: 'type',
                    render: (row, type, data) => {
                        let name = ``;
                        return name
                    }
                },
                {
                    data: 'formula',
                    render: (row) => {
                        let isFor = '';
                        const btn = `<div class="wrap-action"><button type="button" class="edit-formula btn btn-icon btn-flush-light btn-rounded">`
                            +`<span><i class="bi bi-pencil-square"></i></span></button></div>`
                        if (row)
                            isFor += btn
                        return isFor
                    }
                },
                {
                    data: 'id',
                    render: (row) => {
                        const delBtn = `<button type="button" class="btn btn-icon btn-flush-light btn-rounded delete-row" data-id="${row}">`
                            +`<span><i class="bi bi-trash"></i></span></button>`
                        return delBtn
                    }
                }
            ]
        })
        _tblAttr.on('click', '.delete-row', function (){
            let td = _tblAttr.cell($(this).closest('td'));
            let data = _tblAttr.row(td[0][0].row).data();
            console.log('data before', data)
            e.stopPropagation();
            _tblAttr.rows(_tblAttr.row(td[0][0].row).node()).remove().draw();
            console.log('data after', data)
        })
    }

    static actionAddNewRow(){
        const temp = [{
            order: 0,
            name: '',
            source: null,
            code: '',
            type: 0,
            formula: {},
            mandatory: false
        }]
        $('#tbl_attribute_list').DataTable().rows.add(temp).draw()
    }
}
$(document).ready(function(){
    $('#select-apply-for').initSelect2();

    new PayrollTemplateCommon()

    $('#add-new-row-attr').on('click', function(e) {
        e.preventDefault()
        PayrollTemplateCommon.actionAddNewRow()
    })


    const $form = $('#payroll_template_form')
    WFRTControl.setWFInitialData('payrolltemplate');
})