class PayrollTemplateCommon {
    constructor(){
        this.objAttributeList = {}
        this.getSystemAttribute()
        this.init()
    }
    set setAttrLst(data) {
        this.objAttributeList = data
    }
    get getAttrLst() {
        return this.objAttributeList
    }
    getSystemAttribute(){
        const isURL = $('#url-factory').attr('data-attr-lst-api')
        if (isURL !== undefined)
            $.fn.callAjax2({
                url: isURL,
                type: 'GET',
                isNotify: false
            }).then((req) => {
                const res = $.fn.switcherResp(req);
                if (res && res.hasOwnProperty('template_attribute_list')) {
                    let tempHtml = ''
                    const objAttrLst = {}
                    const valCodeLst = []
                    for(let attr of res.template_attribute_list){
                        objAttrLst[attr.id] = attr
                        tempHtml += `<li><a href="#" data-id="${attr.id}">${attr.component_title}</a></li>`
                        if (attr.component_type === 0)
                            valCodeLst.push(attr)
                    }
                    $('#template_select .menus-attr > ul').append(tempHtml)
                    ComponentListController.render(valCodeLst)
                    this.setAttrLst = objAttrLst
                }
            })
    }

    init(){
        // button add new row attribute
        $('#add-new-row-attr').on('click', function (e) {
            e.preventDefault()
            PayrollTemplateCommon.actionAddNewRow()
        });

        const _this = this
        let _tblAttr = $('#tbl_attribute_list').DataTableDefault({
            data: [],
            rowIdx: true,
            paging: false,
            info: false,
            // autoWidth: true,
            // scrollX: true,
            columns: [
                {
                    data: 'order',
                    width: '5%',
                    orderable: false,
                    defaultContent: ''
                },
                {
                    data: 'name',
                    width: '15%',
                    render: (row, type, data, meta) => {
                        return `<div class="form-group min-w-275p d-block"><input type="text" class="form-control" id="attr_name_${meta.row}" value="${row}"/></div>`
                    }
                },
                {
                    data: 'source',
                    width: '15%',
                    render: (row, index, data) => {
                        let htmlElmNode = $($('#template_select').html())
                        const text = row === 1 ? 'Formula' : data?.data_source_component_data
                            ? data.data_source_component_data?.['component_name'] : ''
                        if (text) htmlElmNode.find('.dropdown-toggle').text(text)
                        return htmlElmNode.prop('outerHTML')
                    }
                },
                {
                    data: 'code',
                    width: '15%',
                    render: (row, index, data, meta) => {
                        let name = '--';
                        if (row) name = row
                        if (data.source === 1)
                            name = `<input type="text" class="form-control" id="value_code_${meta.row}" value="${
                                data.formula.code ? data.formula.code : ''}"/>`
                        return name
                    }
                },
                {
                    data: 'type',
                    width: '5%',
                    render: (row, index, data) => {
                        let name = ``;
                        if (data.source === 1) name = 'Number'
                        return name
                    }
                },
                {
                    data: 'formula',
                    width: '40%',
                    render: (row, index, data) => {
                        let isFor = ``;
                        if (data.source === 1){
                            if (data.formula_type === 0 || data.formula_type === false)
                                isFor = `<span class="w-100 d-flex justify-content-start">=<i class="font-3 w-90 overflow-hidden white-space-nowrap d-inline-block text-ellipsis">${row?.txt || ''}</i></span>`
                            if (data.formula_type === 1 || data.formula_type === true){
                                if (data?.formula?.txt)
                                    isFor = data?.formula?.txt
                                else isFor = $.fn.gettext('Custom')
                            }
                            const btn = `<button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFormula" class="edit-formula btn btn-icon btn-flush-light btn-rounded ml-auto">`
                                +`<span><i class="bi bi-pencil-square"></i></span></button>`
                            isFor += btn
                        }
                        return `<div class="d-flex align-items-center justify-content-start">${isFor}</div>`
                    }
                },
                {
                    data: 'id',
                    class: 'text-center',
                    width: '5%',
                    render: (row) => {
                        return `<button type="button" class="btn btn-icon btn-flush-light btn-rounded delete-row" data-id="${row}">`
                            +`<span><i class="bi bi-trash"></i></span></button>`
                    }
                }
            ]
        })

        _tblAttr.on('click', '.delete-row', function (e){
            let td = _tblAttr.cell($(this).closest('td'));
            e.stopPropagation();
            e.preventDefault()
            _tblAttr.rows(_tblAttr.row(td[0][0].row).node()).remove().draw();
        })
        // select data source
        _tblAttr.on('click', '.menus-attr > ul a', function (e){
            let td = _tblAttr.cell($(this).closest('td'));
            let data = _tblAttr.row(td[0][0].row).data();
            e.stopPropagation()
            e.preventDefault()
            const thisID = $(this).attr('data-id')
            if (!thisID && !$(this).hasClass('disabled'))
                window.open($('#url-factory').attr('data-attr-lst'), "_blank")
            else{
                const componentData = _this.getAttrLst[thisID]
                if (Object.keys(componentData).length === 0)
                    $.fn.notifyB({description: $.fn.gettext('Oops, something went wrong, please reload the page and try again')}, 'failure')
                data.name = componentData?.['component_title']
                data.code = componentData?.component_code
                data.source = 0
                data.data_source_component_data = componentData
                data.type = componentData?.['component_type']
                data.id = componentData?.id
                data.mandatory = componentData?.['component_mandatory']
                data.formula = componentData?.['component_formula'] || {}
                _tblAttr.row(td[0][0].row).data(data).draw()
            }
        })
        // select formula
        _tblAttr.on('click', '.dropdown-item', function (){
            if (!$(this).hasClass('menus-attr')){
                let td = _tblAttr.cell($(this).closest('td'));
                let data = _tblAttr.row(td[0][0].row).data();
                data.source = 1
                data.name = ''
                data.code = ''
                _tblAttr.row(td[0][0].row).data(data).draw()
            }
        })
        // input change column title
        _tblAttr.on('blur', 'input[id*="attr_name_"]', function(){
            let td = _tblAttr.cell($(this).closest('td'));
            let data = _tblAttr.row(td[0][0].row).data();
            data.name = this.value
        })
        // input change column value code
        _tblAttr.on('blur', 'input[id*="value_code_"]', function(){
            let td = _tblAttr.cell($(this).closest('td'));
            let data = _tblAttr.row(td[0][0].row).data();
            data.code = this.value
            if (data?.source === 1) data.formula.code = this.value
            if (!this.value) $.fn.notifyB({description: $.fn.gettext('Value code should not be null')}, 'failure')
        })
        // input on click edit formula
        _tblAttr.on('click', 'button.edit-formula', function(){
            let td = _tblAttr.cell($(this).closest('td'));
            let rowData = _tblAttr.row(td[0][0].row).data();
            /**
            * Register callback cho offcanvas
             * @property data
            * @callback <function() => {}> là một "lệnh" để offcanvas biết "Khi user click Save Formula, hãy thực thi function này"
            */
            if (typeof ComponentListController !== 'undefined'){
                ComponentListController.setOnSaveCallback((offcanvasData) => {
                    if (offcanvasData?.rowIndex !== undefined) {
                        let curtData = _tblAttr.row(offcanvasData.rowIndex).data();
                        curtData.formula.txt = offcanvasData.formula
                        curtData.formula.explain_txt = offcanvasData.formula_explain
                        curtData.formula_type = offcanvasData.formulaType
                        _tblAttr.row(offcanvasData.rowIndex).data(curtData).draw(false);
                    }
                })
                ComponentListController.setOnEditCallback(rowData)
            }
            $('#offcanvasFormula .offcanvas-body').append(`<input type="hidden" class="table_index" data-idx="${td[0][0].row}"/>`)

        })
        // input on hover select attr
        _tblAttr.on('mouseenter', '.menus-attr', function(){
            const crtPosition = $(this).closest('.dropdown-in-table')[0].getBoundingClientRect()
            if (window.innerHeight - crtPosition.top < 250){
                // 24 là margin của ul trên UI
                const heightPlus = 250 - (window.innerHeight - crtPosition.top) + 24
                $(this).find('ul').css('top', `-${heightPlus}px`)
            }
        })

        if (typeof ComponentListController !== 'undefined'){
            // render danh sách at
            ComponentListController.setOnOpenCallback(()=>{
                const dataList = _tblAttr.data().toArray();
                const data = []
                // get all formula
                for (let formula of dataList) {
                    if (formula.source === 1) {  // row source===1 data is formula
                        data.push({
                            'component_code': formula.code,
                            'component_name': formula.name,
                            'component_title': 'Formula_' + formula.name,
                            'component_type': formula.type,
                        })
                    }
                }
                ComponentListController.render(data, true)
                $('input[name="formula_type"][value="0"]').prop('checked', true)
            })
        }
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
    // init select2 group
    const group_data = []
    $('#select-apply-for').initSelect2().on('select2:select', function (e){
        group_data.push(e.params.data.data)
    });

    // init form workflow
    const $form = $('#payroll_template_form')
    // setup for app have workflow
    WFRTControl.setWFInitialData('payrolltemplate');

    // form submit
    let lastClickTime = 0;
    const minClickInterval = 500;
    function submitHandleFunc(){
        // xử lý khi click double
        const currentTime = Date.now();
        if (currentTime - lastClickTime < minClickInterval) {
            e.preventDefault();
            return false;
        }
        lastClickTime = currentTime;

        const frm = new SetupFormSubmit($form);
        let formData = frm.dataForm;
        let method = frm.dataMethod.toLowerCase()

        if (method === 'post') formData.system_status = 1
        if(group_data.length) formData.department_applied_data = group_data

        formData.attribute_list = []
        const getData = $('#tbl_attribute_list').DataTable().data().toArray()
        if (!getData.length)
            $.fn.notifyB({description: $.fn.gettext('Attribute list not found')}, 'failure')
        else formData.attribute_list = getData
        WFRTControl.callWFSubmitForm(frm);
    }
    SetupFormSubmit.validate($form, {
        rules: {
            title: {
                required: true,
            }
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
})