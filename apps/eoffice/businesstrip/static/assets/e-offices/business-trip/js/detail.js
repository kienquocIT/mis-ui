$(document).ready(function(){
    const $formElm = $('#business_trip_form')
    const $tblElm = $('#expense_detail_tbl')

    // get detail request info
    $.fn.callAjax2({
        'url': $formElm.attr('data-url-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $('#titleInput').val(data.title)
            $('#dateCreatedInput').val($x.fn.reformatData(data.date_created, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#remarkInput').val(data.remark)
            $('#SystemStatusInput').val(JSON.parse($('#sys_stt').text())[data.system_status][1])
            if (data['departure']?.['id'])
                $('#selectDeparture').append(
                    `<option value="${data['departure'].id}" selected>${data['departure'].title}</option>`
                ).trigger('change')
            if (data['departure']?.['id'])
                $('#selectDestination').append(
                    `<option value="${data.destination.id}" selected>${data.destination.title}</option>`
                ).trigger('change')
            data.employee_on_trip.map(function(item){
                item.selected = true
                return item
            })
            $('#selectEmployeeOnTrip').initSelect2({data:data.employee_on_trip})
            $(`[name="morning_f"][value="${data.morning_f}"], [name="morning_t"][value="${data.morning_t}"]`).prop('checked', true)
            $('#dateFInput').val($x.fn.reformatData(data.date_f, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#dateTInput').val($x.fn.reformatData(data.date_t, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#totalDayInput').val(data.total_day)
            if (data.attachment) {
                const fileDetail = data.attachment[0]?.['files']
                FileUtils.init($(`[name="attachment"]`).siblings('button'), fileDetail);
            }

            $tblElm.DataTableDefault({
                data: data.expense_items,
                ordering: false,
                paginate: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        data: 'title',
                        width: '16.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" name="title_${meta.row}" value="${row}" readonly>`
                        }
                    },
                    {
                        data: 'expense_item_data',
                        width: '16.66%',
                        render: (row, type, data, meta) => {
                            let html = $(`<select>`).addClass('form-select row_expense-item')
                                .attr('name', `expense_item_${meta.row}`).attr('disabled', true)
                            if (row && Object.keys(row).length > 0)
                                html.append(`<option value="${row.id}" selected>${row.title}</option>`)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'uom_txt',
                        width: '6.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" name="uom_txt_${meta.row}" value="${row}" readonly>`
                        }
                    },
                    {
                        data: 'quantity',
                        width: '6.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" name="quantity_${meta.row}" value="${row}" readonly>`
                        }
                    },
                    {
                        data: 'price',
                        width: '16.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money-price" name="price_${meta.row}" value="${row}" readonly>`
                        }
                    },
                    {
                        data: 'tax_data',
                        width: '12%',
                        render: (row, type, data, meta) => {
                            let html = $(`<select>`).addClass('form-select row_tax')
                                .attr('name', `tax_${meta.row}`).attr('disabled', true)
                            if (row && Object.keys(row).length > 0)
                                html.append(`<option value="${row.id}" selected>${row.title}</option>`)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'subtotal',
                        width: '16.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money-subtotal" name="subtotal_${meta.row}" readonly value="${row}">`
                        }
                    },
                    {
                        targets: 6,
                        width: '3.33%',
                        render: () => {
                            return $('.delete_btn').html()
                        }
                    }
                ],
                drawCallback: (settings) => {
                    $.fn.initMaskMoney2($('.mask-money-price'), 'input')
                    $.fn.initMaskMoney2($('.mask-money-subtotal'), 'input')
                },
                footerCallback: function () {
                    let api = this.api();

                    // Total footer row
                    let totalPrice = 0
                    let allSubtotal = 0
                    let calcTax = 0
                    api.rows().every(function () {
                        let data = this.data()
                        if (data?.['tax_data']?.['rate'] && data?.['tax_data']?.['rate'] > 0 && data?.['price'] > 0 &&
                            data?.['quantity'] > 0)
                            calcTax += data.price * data.quantity / 100 * data.tax_data.rate
                        if (data?.['price'] > 0 && data?.['quantity'] > 0)
                            totalPrice += parseInt(data.price) * parseInt(data.quantity)
                        if (data?.['subtotal']) allSubtotal += parseInt(data.subtotal)
                    });

                    // Update footer
                    $(api.column(6).footer()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${totalPrice}"></span></p>`);
                    $('tr:eq(1) th:eq(2)', api.table().footer()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${calcTax}"></span></p>`);
                    $('tr:eq(2) th:eq(2)', api.table().footer()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${allSubtotal}"></span></p>`);
                    $.fn.initMaskMoney2()
                },
            })
            if (data.system_status >= 2) $('#idxRealAction').remove()

            // load attachments
            new $x.cls.file(
                $('#attachment')
            ).init({
                enable_edit: false,
                data: data.attachment,
            })
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
});