$(document).ready(function () {
    const $transElm = $('#trans-factory')
    const $urlElm = $('#url-factory')
    const $EmpElm = $('#selectEmployeeInherit')

    function renderTemplateResult(state) {
        if (!state.id) {
            return state.text;
        }
        let $state = $(
            `<span><b>${state?.data?.leave_type.code}</b>&nbsp;|&nbsp;&nbsp;${state?.data?.leave_type.title
            } <span class="text-blue">(${state?.data.available})</span></b>`
        );
        return $state
    }

    class detailTab {
        static $tableElm = $('#leave_detail_tbl')
        static _listSample = [
            {
                'leave_type': '',
                'date_from': '',
                'morning_shift_f': true,
                'date_to': '',
                'morning_shift_t': false,
                'subtotal': 0,
                'remark': ''
            }
        ]

        static RepareReturn(data) {
            const dFrom = new Date(data.date_from) // số giờ bắt đầu
            const dTo = new Date(data.date_to) // số giờ kết thúc
            let tempTotal = Math.abs(
                Math.floor(dTo.getTime() / (3600 * 24 * 1000)) -
                Math.floor(dFrom.getTime() / (3600 * 24 * 1000))
            ) + 1 // cộng 1 cho kết quả vì, khi cộng, phép toán ko tính ngày bắt đầu.
            if (!data.morning_shift_f) tempTotal = tempTotal - 0.5
            if (data.morning_shift_t) tempTotal = tempTotal - 0.5
            return tempTotal
        }

        static load_table(datalist) {
            detailTab.$tableElm.DataTableDefault({
                data: datalist,
                ordering: false,
                paginate: false,
                info: false,
                columns: [
                    {
                        data: 'leave_type',
                        width: '30%',
                        class: 'child-mt',
                        render: (row, type, data, meta) => {
                            let dataLoad = []
                            dataLoad.push({
                                ...row.data,
                                selected: true
                            })
                            const dataRow = JSON.stringify(dataLoad)
                            let html = $(`<select>`).addClass('form-select row_leave-type').attr('name', `leave_type_${meta.row}`)
                            if (row !== '') html.attr('data-onload', dataRow)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'date_from',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            const dateFrom = moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            let html = $(`${$('.date_from').html()}`)
                            html.find('.f_mor').attr('id', `f_mor_${meta.row}`).attr('name', `morning_shift_f_${
                                meta.row}`).next('label').attr('for', `f_mor_${meta.row}`)
                            html.find('.f_aft').attr('id', `f_aft_${meta.row}`).attr('name', `morning_shift_f_${
                                meta.row}`).next('label').attr('for', `f_aft_${meta.row}`)
                            html.find('.date-picker').attr('name', `date_from_${meta.row}`).attr('value', dateFrom).attr('id', `InputDateFrom_${meta.row}`)
                            html.find(`[name="morning_shift_f_${meta.row}"][value="${data.morning_shift_f}"]`).attr('checked', true)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'date_to',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            const dateTo = moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            let html = $(`${$('.date_from').html()}`)
                            html.find('.f_mor').attr('id', `t_mor_${meta.row}`).attr('name', `morning_shift_t_${
                                meta.row}`).next('label').attr('for', `t_mor_${meta.row}`)
                            html.find('.f_aft').attr('id', `t_aft_${meta.row}`).attr('name', `morning_shift_t_${meta.row}`).next('label').attr('for', `t_aft_${meta.row}`)
                            html.find('.date-picker').attr('name', `date_to_${meta.row}`).attr('id', `InputDateTo_${meta.row}`).attr('value', dateTo)
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
                        width: '20%',
                        class: 'child-mt',
                        render: (row, type, data, meta) => {
                            return `<input class="form-control" name="remark_${meta.row}" value="${row}">`
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
                rowCallback: (row, data, index) => {

                    // run date picker after render row
                    $('.date-picker', row).daterangepicker({
                        singleDatePicker: true,
                        timepicker: false,
                        showDropdowns: false,
                        minYear: 2023,
                        locale: {
                            format: 'DD/MM/YYYY'
                        },
                        maxYear: parseInt(moment().format('YYYY'), 10),
                    }).on('change', function () {
                            // valid và add vào data table
                            if ($(this).attr('name').indexOf('date_from_') > -1) {
                                data.date_from = moment(this.value, 'DD/MM/YYYY').format('YYYY-MM-DD')
                                data.morning_shift_f = JSON.parse($('input[name*="morning_shift_f_"]:checked', row).val())
                            }
                            // valid và add vào data table
                            if ($(this).attr('name').indexOf('date_to_') > -1) {
                                data.date_to = moment(this.value, 'DD/MM/YYYY').format('YYYY-MM-DD')
                                data.morning_shift_t = JSON.parse($('input[name*="morning_shift_t_"]:checked', row).val())
                            }
                            // valid ngày kết thúc lớn hơn ngày bắt đầu
                            if (data.date_from && data.date_to && (new Date(data.date_to) < new Date(data.date_from))) {
                                $.fn.notifyB({description: $transElm.attr('data-err-date')}, 'failure')
                                return false
                            } else if (data.date_from && data.date_to) {
                                data.subtotal = detailTab.RepareReturn(data)
                                $('[name*="subtotal_"]', row).val(data.subtotal)
                                $(document).trigger("footerCallback");
                            }
                        })
                    // trigger shift follow by date pick
                    $('input[name*="morning_shift_"]', row).on('change', function () {
                        if ($(this).attr('name').indexOf('morning_shift_f_') > -1)
                            data.morning_shift_f = JSON.parse($('input[name*="morning_shift_f_"]:checked', row).val())
                        else
                            data.morning_shift_t = JSON.parse($('input[name*="morning_shift_t_"]:checked', row).val())
                        if (data.date_from && data.date_to) {
                            data.subtotal = detailTab.RepareReturn(data)
                            $('[name*="subtotal_"]', row).val(data.subtotal)
                            $(document).trigger("footerCallback");
                        }
                    })

                    // load leave type with employee filter
                    $('.row_leave-type', row).attr('data-url', $urlElm.attr('data-leave-available'))
                        .attr('data-keyResp', "leave_available")
                        .attr('data-keyText', "leave_type.title")
                        .attr('data-keyId', "leave_type.id")
                        .initSelect2({
                            callbackDataResp(resp, keyResp) {
                                let list_result = []
                                let temp = {}
                                for (let item of resp.data[keyResp]) {
                                    // merge 2 ANPY lại thành 1 record, cộng 2 available lại
                                    if (item.leave_type.code === 'ANPY' && Object.keys(temp).length > 0)
                                        temp.available += item.available
                                    else if (item.leave_type.code === 'ANPY') temp = item
                                    else list_result.push(item)
                                }
                                list_result.push(temp)
                                return list_result
                            },
                            'dataParams': {employee: $EmpElm.val()},
                            'templateResult': renderTemplateResult,
                            'cache': true
                        })
                        .on('select2:select', function (e) {
                            data.leave_type = e.params.data
                        })

                    // remark trigger on change
                    $('input[name*="remark_"]', row).on('blur', function () {
                        data.remark = this.value
                    })

                    // add index for detail list
                    data.order = index
                },
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

        static add(data = []) {
            let temp = detailTab._listSample
            if (data.length > 0)
                temp = data
            detailTab.$tableElm.DataTable().rows.add(temp).draw()
        }

        static get_data(){
            return detailTab.$tableElm.DataTable().data().toArray() || []
        }
    }

    class TabAvailable {
        static $tableElm = $('#leave_available_tbl')

        static load_table() {
            TabAvailable.$tableElm.DataTableDefault({
                ajax: {
                    url: $urlElm.attr('data-leave-available'),
                    type: "GET",
                    dataSrc: 'data.leave_available',
                    data: function (a) {
                        a.employee = $('#selectEmployeeInherit').val()
                        return a
                    }
                },
                ordering: false,
                paginate: false,
                info: false,
                columns: [
                    {
                        data: 'leave_type',
                        render: (row, type, data, meta) => {
                            return row?.title ? row?.title : '--'
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
                        class: 'text-center',
                        render: (row, type, data) => {
                            return row !== '' ? row : '--'
                        }
                    },
                    {
                        data: 'used',
                        class: 'text-center',
                        render: (row, type, data) => {
                            return row !== '' ? row : '--'
                        }
                    },
                    {
                        data: 'available',
                        class: 'text-center',
                        render: (row, type, data, meta) => {
                            return row !== '' ? row : '--'
                        }
                    },
                    {
                        data: 'expiration_date',
                        render: (row, type, data, meta) => {
                            return row ? moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'
                        }
                    }
                ]
            })
        }
    }

    // get detail request info
    $.fn.callAjax2({
        'url': $urlElm.attr('data-leave-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp).leave_request_detail
            $('#inputTitle').val(data.title)
            $('#inputSystemStatus').val(JSON.parse($('#sys_stt').text())[data.system_status][1])

            // load datepicker for request date
            $('#inputRequestDate').val(moment(data.request_date, 'YYYY-MM-DD').format('DD/MM/YYYY')).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY'
                },
                maxYear: parseInt(moment().format('YYYY'), 10)
            })

            $EmpElm.attr('data-onload', JSON.stringify(data.employee_inherit)).append(
                `<option selected value="${data.employee_inherit.id}">${
                    data.employee_inherit.full_name}</option>`).initSelect2()

            // wait until dropdown employee inherit init loaded then trigger element
            const awEmp = setInterval(function () {
                if ($EmpElm.hasClass("select2-hidden-accessible")) {
                    // Select2 has been initialized
                    clearInterval(awEmp)
                    $EmpElm.trigger('Employee.Loaded')
                }
            }, 200)

            // Wait employee trigger loaded
            // - load detail tab
            // - available load
            // - enable button add date
            // - trigger button add date
            $(document).on('Employee.Loaded', function () {
                // run table when page loaded
                detailTab.load_table(data.detail_data)

                // button click Add Date
                $('#add_new_line').prop('disabled', false)
                const $AddBtn = $('#add_new_line')
                $AddBtn.off().on('click', () => detailTab.add())

                // after load employee inherit load table leave available
                TabAvailable.load_table()
            })




        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )

    // form submit
    const $FormElm = $('#leave_edit')
    SetupFormSubmit.validate($FormElm,{
        rules: {
            title: {
                required: true,
            },
            request_date: {
                required: true,
            },
            employee_inherit: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: function () {
            const frm = new SetupFormSubmit($FormElm);
            let formData = frm.dataForm;
            formData.employee_inherit = $('#selectEmployeeInherit').val()
            formData.detail_data = detailTab.get_data()
            formData.total = 0
            $.map(formData.detail_data, (item)=>{
                if (!formData.start_day || new Date(item.date_from).getTime() < new Date(formData.start_day).getTime())
                    formData.start_day = item.date_from
                formData.total += item.subtotal
            })
            formData.request_date = moment(formData.request_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            WindowControl.showLoading();
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': formData,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (parseInt(data['status']) === 201 || parseInt(data['status']) === 200)) {
                        $.fn.notifyB({description: $('#base-trans-factory').attr('data-success')}, 'success');
                        setTimeout(() => {
                            window.location.replace($FormElm.attr('data-url-redirect'));
                        }, 1000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err.data.errors}, 'failure');
                }
            )
        }
    })

})