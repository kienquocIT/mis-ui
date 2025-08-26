class handleCommon {
    constructor() {
        this.$employeeTblElm = $('#table_employee');
        this.$GroupChecked = $('#group-checked');
        this.$EmployeeChecked = $('#employee-checked');
        this.init()
    }

    runEmployeeTable(){
        let _tbl = this.$employeeTblElm.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: this.$employeeTblElm.attr('data-url'), type: 'GET',
                dataSrc: 'data.employee_list',
            },
            info: false,
            columns: [
                {
                    data: 'id',
                    width: '70%',
                    render: (row, type, data) => {
                        const checked = !!(this.$GroupChecked.data('checked')?.[data?.['group']['id']] || data.selected)
                        return `<div class="form-check form-check-lg d-flex align-items-center">`
                            + `<input type="checkbox" id="check_employee_${row}" class="form-check-input" data-group-id="${data?.['group']?.['id']}" ${checked}>`
                            + `<label class="form-check-label" for="check_employee_${row}">${data?.['full_name']}</label></div>`;
                    }
                },
                {
                    data: 'code',
                    width: '30%',
                    render: (row) => {
                        return `<span class="form-check-label">${row}</span>`;
                    }
                }
            ]
        });
        const _this = this;
        _tbl.on('change', 'tbody input[id*="check_employee_"]', function(){
            const td = _tbl.cell($(this).closest('td'));
            let data = _tbl.row(td[0][0].row).data();
            let beforeData = _this.$EmployeeChecked.data('checked') || {};
            debugger
            if ($(this).prop('checked')){
                data.selected = true;
                beforeData[data.id] = data
            }
            else{
                if(beforeData?.[data.id])
                    delete beforeData[data.id]
            }
            _this.$EmployeeChecked.data('checked', beforeData)
        })
    }

    runGroupTable(){

    }
    init(){
        this.runEmployeeTable()
        this.runGroupTable()
    }
}

$(document).ready(function(){
    const $ElmEmployeeTable = $('#table_employee');
    let tbl = new handleCommon();
});