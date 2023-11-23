$(document).ready(function () {
    const $urlElm = $('#url-factory')
    const $EmpElm = $('#selectEmployeeInherit')
    const $trans = $('#trans-factory')

    class detailTab {
        static $tableElm = $('#leave_detail_tbl')

        static load_table(dataList) {
            detailTab.$tableElm.DataTableDefault({
                data: dataList,
                ordering: false,
                paginate: false,
                info: false,
                columns: [
                    {
                        data: 'leave_available',
                        width: '35%',
                        class: 'child-mt',
                        render: (row, type, data, meta) => {
                            let html = $(`<select>`).addClass('form-select row_leave-available').attr('name',
                                `leave_available_${meta.row}`).attr('disabled', true)
                            html.append($(`<option>`).val(row.leave_type.id).text(row.leave_type.title
                            ).attr('selected', true))
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'date_from',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            let html = $(`${$('.date_from').html()}`)
                            html.find('.f_mor').attr('id', `f_mor_${meta.row}`).attr('name', `morning_shift_f_${
                                meta.row}`).next('label').attr('for', `f_mor_${meta.row}`)
                            html.find('.f_aft').attr('id', `f_aft_${meta.row}`).attr('name', `morning_shift_f_${
                                meta.row}`).next('label').attr('for', `f_aft_${meta.row}`)
                            html.find('.date-picker').attr('name', `date_from_${meta.row
                            }`).attr('value', moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')).attr('id', `InputDateFrom_${
                                meta.row}`).attr('readonly', true)
                            html.find(`[name="morning_shift_f_${meta.row}"][value="${data.morning_shift_f
                            }"]`).attr('checked', true)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'date_to',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            let html = $(`${$('.date_from').html()}`)
                            let _date_row = moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            html.find('.f_mor').attr('id', `t_mor_${meta.row}`).attr('name', `morning_shift_t_${
                                meta.row}`).next('label').attr('for', `t_mor_${meta.row}`)
                            html.find('.f_aft').attr('id', `t_aft_${meta.row}`).attr('name', `morning_shift_t_${
                                meta.row}`).next('label').attr('for', `t_aft_${meta.row}`)
                            html.find('.date-picker').attr('name', `date_to_${meta.row}`).attr('id', `InputDateTo_${
                                meta.row}`).attr('value', _date_row).attr('readonly', true)
                            html.find('.spec-date-layout > span').remove()
                            html.find(`[name="morning_shift_t_${meta.row}"][value="${data.morning_shift_t}"]`).attr('checked', true)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'subtotal',
                        width: '5%',
                        class: 'child-mt',
                        render: (row, type, data, meta) => {
                            return `<input class="form-control" name="subtotal_${meta.row}" readonly value="${row ? row : 0}">`
                        }
                    },
                    {
                        data: 'remark',
                        width: '15%',
                        class: 'child-mt',
                        render: (row, type, data, meta) => {
                            return `<input class="form-control" name="remark_${meta.row}" value="${row}" readonly>`
                        }
                    },
                    {
                        targets: 6,
                        width: '5%',
                        render: (row, type, data, meta) => {
                            return $('.delete_btn').html()
                        }
                    }
                ],
                footerCallback: function (row, data, start, end, display) {
                    let api = this.api();

                    function handleTotal(row, data, start, end, display) {
                        // Total over this page
                        const allStock = api
                            .column(3, {page: 'current'})
                            .data()
                            .reduce(function (a, b) {
                                return a + b;
                            }, 0);
                        // Update footer
                        $(api.column(3).footer()).html(`<p class="pl-3 font-3"><b><i>${allStock}</i></b></p><b><i></i></b>`);
                    }

                    // first time to draw table
                    handleTotal()
                    // trigger when change data
                    $(document).on("footerCallback", function () {
                        handleTotal()
                    })
                },
            })
        }
    }

    class TabAvailable {
        static $tableElm = $('#leave_available_tbl')

        static load_table() {
            TabAvailable.$tableElm.DataTableDefault({
                ajax: {
                    url: $urlElm.attr('data-leave-available'),
                    type: "GET",
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('leave_available')) {
                            let dataList = resp.data['leave_available']
                            dataList.sort(function (a, b) {
                                let nameA = a.leave_type.code
                                let nameB = b.leave_type.code
                                let statement = 0
                                if (nameA < nameB) statement = -1
                                if (nameA > nameB) statement = 1
                                return statement
                            })
                            return dataList
                        }
                        throw Error('Call data raise errors.')
                    },
                    data: function (a) {
                        a.employee = $EmpElm.val()
                        return a
                    }
                },
                ordering: false,
                paginate: false,
                info: false,
                responsive: true,
                columns: [
                    {
                        data: 'leave_type',
                        width: '40%',
                        responsivePriority: 1,
                        render: (row, type, data, meta) => {
                            return row?.title ? row?.title : '--'
                        }
                    },
                    {
                        data: 'open_year',
                        width: '10%',
                        responsivePriority:2,
                        render: (row, type, data) => {
                            return row ? row : '--'
                        }
                    },
                    {
                        data: 'total',
                        width: '10%',
                        class: 'text-center',
                        render: (row, type, data) => {
                            return row !== '' ? row : '--'
                        }
                    },
                    {
                        data: 'used',
                        width: '10%',
                        class: 'text-center',
                        render: (row, type, data) => {
                            return row !== '' ? row : '--'
                        }
                    },
                    {
                        data: 'available',
                        width: '10%',
                        class: 'text-center',
                        render: (row, type, data, meta) => {
                            return row !== '' ? row : '--'
                        }
                    },
                    {
                        data: 'expiration_date',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            return row ? moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'
                        }
                    }
                ]
            })
        }
    }

    function validApproved(dataList){
        if (!dataList.length) return true
        for (let item of dataList) {
            const LType = item.leave_available
            if (LType.check_balance && item.subtotal > LType.available){
                let noti = $(`<span class="text-red">`)
                noti.text($trans.attr('data-out-of-stock'))

                let setITerval = setInterval(()=>{
                    const $btn = $('.btnAddFilter')
                    if ($btn.length){
                        clearInterval(setITerval)
                        $btn.append(noti)
                    }
                }, 200)
                $('.btn-action-wf').addClass('disabled')
                $('#idxGroupAction .btn-action-wf[data-value="1"] .dropdown-item').addClass('disabled')
            }
        }
    }

    // get detail request info
    $.fn.callAjax2({
        'url': $urlElm.attr('data-leave-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)?.['leave_request_detail']
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $('#inputTitle').val(data.title)
            $('#inputRequestDate').val(moment(data.request_date, 'YYYY-MM-DD').format('DD/MM/YYYY'))
            $EmpElm.append(
                `<option selected value="${data.employee_inherit.id}">${
                    data.employee_inherit.full_name || '--'}</option>`)
            $('#inputSystemStatus').val(JSON.parse($('#sys_stt').text())[data.system_status][1])

            // run table when page loaded
            detailTab.load_table(data.detail_data)
            validApproved(data.detail_data)

            // after load employee inherit load table leave available
            TabAvailable.load_table()
            if (data.system_status >= 2) $('#idxRealAction').remove()
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
})