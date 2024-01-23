$(document).ready(function(){
    const $formElm = $('#asset_provide_form')
    const $tblElm = $('#products_detail_tbl')

    // get detail request info
    $.fn.callAjax2({
        'url': $formElm.attr('data-url'),
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
            $('#selectEmployeeInherit').html(`<option value="${data.employee_inherit.id}" selected>${data.employee_inherit.full_name}</option>`).trigger('change')
            if (data.attachments) {
                const fileDetail = $.map(data.attachments, function(item){
                    return item?.['files']
                })
                FileUtils.init($(`[name="attachments"]`).siblings('button'), fileDetail);
            }

            $tblElm.DataTableDefault({
                data: data.products,
                ordering: false,
                paginate: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        data: 'product',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            let html = $(`<select>`).addClass('form-select row_product-item')
                                .attr('name', `product_${meta.row}`).attr('disabled', true)
                            if (row && Object.keys(row).length > 0)
                                html.append(`<option value="${row.id}" selected>${row.title}</option>`)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'product_remark',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" name="remark_${meta.row}" value="${row ? row : ''}" readonly>`
                        }
                    },
                    {
                        data: 'uom',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            let html = $(`<select>`).addClass('form-select row_uom-item')
                                .attr('name', `uom_${meta.row}`).attr('disabled', true)
                            if (row && Object.keys(row).length > 0)
                                html.append(`<option value="${row.id}" selected>${row.title}</option>`)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'quantity',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" name="quantity_${meta.row}" value="${row}" readonly>`
                        }
                    },
                    {
                        data: 'price',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money-price" name="price_${meta.row}" value="${row}" readonly>`
                        }
                    },
                    {
                        data: 'tax',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            let html = $(`<select>`).addClass('form-select row_tax-item')
                                .attr('name', `tax_${meta.row}`).attr('disabled', true)
                            if (row && Object.keys(row).length > 0)
                                html.append(`<option value="${row.id}" selected>${row.title}</option>`)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'subtotal',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money-subtotal"  name="subtotal_${meta.row}" readonly value="${row}">`
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
                        let taxRate = data?.tax?.rate ? data.tax.rate : data?.['tax_data']?.['rate'] ? data.tax_data.rate : 0
                        if (taxRate && data?.['price'] > 0 && data?.['quantity'] > 0)
                            calcTax += data.price * data.quantity / 100 * taxRate
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
                data: data.attachments,
            })
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
});