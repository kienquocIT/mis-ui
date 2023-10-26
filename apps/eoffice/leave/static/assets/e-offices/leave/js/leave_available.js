$(document).ready(function(){
    // declare variable scope
    const $urlElm = $('#url-factory')
    const $EmplTable = $('#employee_tbl')
    const $AvlList = $('#employee_available_detail_tbl')
    const $AvlHistoryList = $('#employee_adjust_history_tb')
    const $editForm = $('#edit_available_form')

    class EmployeeHandle {
        static LoadList(){
            let tbl = $EmplTable.DataTableDefault({
                ajax:{
                    url: $urlElm.attr('data-employee-list'),
                    type: "GET",
                    dataSrc: 'data.employee_list',
                },
                responsive: true,
                useDataServer: true,
                info: false,
                columns: [
                    {
                        data: 'code',
                        render: (row, type, data)=>{
                            return row
                        }
                    },
                    {
                        data: 'full_name',
                        render: (row, type, data)=>{
                            return `${row ? row : '--'}`
                        }
                    },
                    {
                        data: 'group',
                        render: (row, type, data)=>{
                            return `${row ? row?.title : "--"}`
                        }
                    },
                ],
            })
            // create event on click row of table
            tbl.on('click', 'tbody tr', (e) => {
                let classList = e.currentTarget.classList;
                if (classList.contains('selected')) classList.remove('selected');
                else {
                    tbl.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
                    classList.add('selected');
                    // row selected call jax load available list and history list of this employee has select
                    const row_data =  tbl.rows('.selected').data().toArray()
                    EmployeeHandle.CallAvailable(row_data[0]?.id)
                    EmployeeHandle.CallHistory(row_data[0]?.id)
                }
            })
        }
        static LoadAvailableTable(availableData){
            if ($AvlList.hasClass('dataTable')){
                $AvlList.DataTable().clear().rows.add(availableData).draw()
            }
            else{
                $AvlList.DataTableDefault({
                    data: availableData,
                    responsive: true,
                    info:false,
                    paging: false,
                    columns: [
                        {
                            data: 'leave_type',
                            render: (row, type, data) =>{
                                return row ? row?.title : '--'
                            }
                        },
                        {
                            data: 'open_year',
                            render: (row, type, data) =>{
                                return row ? row : '--'
                            }
                        },
                        {
                            data: 'total',
                            render: (row, type, data) =>{
                                return row
                            }
                        },
                        {
                            data: 'used',
                            render: (row, type, data) =>{
                                return row
                            }
                        },
                        {
                            data: 'available',
                            render: (row, type, data) =>{
                                return row
                            }
                        },
                        {
                            data: 'expiration_date',
                            render: (row, type, data) =>{
                                return row ? moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'
                            }
                        },
                        {
                            data: 'id',
                            render: function(row, type, data){
                                let html = $($('.adjust_btn').html())
                                return html.prop('outerHTML')
                            }
                        }
                    ],
                    rowCallback: (row, data, index)=>{
                        $('.btn-adjust-row', row).on('click', ()=>{
                            $editForm[0].reset()
                            $('input[name="id"]').val(data.id)
                            $('#inputTotal').val(data.total)
                            $('#inputAdjustedTotal').val(data.total)
                            $('input[name="employee_inherit"]').val(
                                $EmplTable.DataTable().rows('.selected').data().toArray()[0]['id'])
                            if (data.expiration_date !== null){
                                const exprElm = $('#inputExpirationDate')
                                if(data.leave_type.code !== 'AN' && data.leave_type.code !== 'ANPY') exprElm.prop('disabled', false)
                                exprElm.val(moment(data.expiration_date).format('DD/MM/YYYY')).trigger('change')
                            }
                        })
                    }
                })
            }
        }
        static LoadHistoryTable(HistoryData){
            const act_list = JSON.parse($('#leave_action').text())
            if ($AvlHistoryList.hasClass('dataTable')) {
                $AvlHistoryList.DataTable().clear().rows.add(HistoryData).draw()
            } else {
                $AvlHistoryList.DataTableDefault({
                    data: HistoryData,
                    responsive: true,
                    info: false,
                    paging: false,
                    columns: [
                        {
                            data: 'leave_available',
                            render: (row, type, data) => {
                                return row ? row?.title : '--'
                            }
                        },
                        {
                            data: 'open_year',
                            render: (row, type, data) => {
                                return row ? row : '--'
                            }
                        },
                        {
                            data: 'total',
                            render: (row, type, data) => {
                                return row
                            }
                        },
                        {
                            data: 'action',
                            render: (row, type, data) => {
                                return act_list[row]
                            }
                        },
                        {
                            data: 'quantity',
                            render: (row, type, data) => {
                                return row
                            }
                        },
                        {
                            data: 'date_modified',
                            render: (row, type, data) => {
                                return row ? moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'
                            }
                        }
                    ]
                })
                $('a[data-bs-toggle="tab"]').on( 'shown.bs.tab', function (e) {
                    $AvlHistoryList.DataTable.tables( {visible: true, api: true} ).columns.adjust();
                });
            }
        }
        static CallHistory(Employee_ID){
            const url = $urlElm.attr('data-available-history')
            $.fn.callAjax2({
                'url': url,
                'method': 'GET',
                'data': {'employee': Employee_ID}
            }).then((resp) => {
                    let data = $.fn.switcherResp(resp).leave_available_history;
                    EmployeeHandle.LoadHistoryTable(data)
                },
                (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
            )
        }
        static CallAvailable(Employee_ID){
            if (Employee_ID){
                $.fn.callAjax2({
                    'url': $urlElm.attr('data-available-list'),
                    'method': 'GET',
                    'data': {'employee': Employee_ID, 'check_balance': true}
                }).then((resp) => {
                        let data = $.fn.switcherResp(resp).leave_available;
                        EmployeeHandle.LoadAvailableTable(data)
                    },
                    (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
                )
            }
        }
    }

    // date-picker load init modal popup
    const $dateElm = $('#inputExpirationDate')
    $dateElm.daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        locale: {
            format: 'DD/MM/YYYY'
        },
    })

    // first time load table employee list
    EmployeeHandle.LoadList()

    // modal on change action,qunatity form field
    function commonTwoAction(){
        const expression = $('#selectAction option:selected').val()
        let isValue = $('#inputQuantity').val()
        if (expression === '1')
            $('#inputAdjustedTotal').val(parseFloat($('#inputTotal').val()) + parseFloat(isValue))
        else $('#inputAdjustedTotal').val(parseFloat($('#inputTotal').val()) - parseFloat(isValue))
    }
    $('#inputQuantity').on('blur', commonTwoAction)
    $('#selectAction').on('change', commonTwoAction)

    // on close modal
    $('#edit-available').on('hidden.bs.modal', ()=>{
        $dateElm.prop('disabled', true).val(null).trigger('change')
    })

    // handle form edit submit
    SetupFormSubmit.validate($editForm, {
        rules: {
            total: {
                required: true,
            },
            action: {
                required: true,
            },
            quantity: {
                required: true,
            },
            adjusted_total: {
                required: true,
            }
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: function () {
            const frm = new SetupFormSubmit($editForm);
            let frmData = frm.dataForm;
            if (!frmData?.expiration_date) frmData.expiration_date = null
            $.fn.callAjax2({
                "url": $urlElm.attr('data-available-list'),
                "method": 'PUT',
                "data": frmData
            }).then((resp)=>{
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: data.message}, 'success');
                    location.reload()
                }
            }, (errs) => {
                $.fn.switcherResp(errs);
            })
        }
    })
});