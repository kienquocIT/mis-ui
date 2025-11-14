$(document).ready(function(){
    const $formElm = $('#asset_provide_form')
    const $tblElm = $('#products_detail_tbl')

    function generateTag(is_stage) {
        let icon = ''
        if (is_stage === 'tool') icon = '<i class="fas fa-tools"></i>'
        else if (is_stage === 'fixed') icon = '<i class="fas fa-warehouse"></i>'
        let str = ''
        if (is_stage === 'tool' || is_stage === 'fixed')
            str = `<div class="tags-separate">${icon}</div>`
        return str
    }
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
                            else if ('product_fixed' in data && Object.keys(data?.product_fixed).length > 0)
                                html.append(`<option value="${data?.product_fixed.id}" selected>${data?.product_fixed.title}</option>`)
                            const istag = generateTag('product_fixed' in data ? 'fixed' : 'product' in data ? 'tool' : 'new')
                            return html.prop('outerHTML') + istag
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
                            if (!row && data?.['uom_data']) row = data['uom_data']
                            let html = $(`<input type="text">`)
                                .addClass('form-control')
                                .attr('name', `uom_${meta.row}`)
                                .attr('value', row)
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
                            return `<input type="text" class="form-control mask-money" name="price_${meta.row}" value="${row}" readonly>`
                        }
                    },
                    {
                        data: 'subtotal',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money"  name="subtotal_${meta.row}" readonly value="${row}">`
                        }
                    }
                ],
                drawCallback: (row) => {
                    $('.popover-elm').popover({
                        title: $.fn.gettext('Info'),
                        html: true,
                        trigger: 'click',
                        content: `<p><i class="fas fa-warehouse font-2"></i>  ${$.fn.gettext('Fixed assets')}</p>`
                            + `<p><i class="fas fa-tools font-2"></i>  ${$.fn.gettext('Instrument Tool')}</p>`
                    });
                    $.fn.initMaskMoney2($('.mask-money', row), 'input')
                },
                footerCallback: function () {
                    let api = this.api();

                    // Total footer row
                    let allSubtotal = 0
                    api.rows().every(function () {
                        let data = this.data()
                        if (data?.['subtotal']) allSubtotal += parseInt(data.subtotal)
                    });

                    // Update footer
                    $('tr:eq(1) th:eq(2)', api.table().footer()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${allSubtotal}"></span></p>`);
                    $.fn.initMaskMoney2()
                },
            })
            if (data.system_status >= 2) $('#idxRealAction').remove()

            // load attachments
            new $x.cls.file( $('#attachment') ).init({ enable_edit: false, data: data.attachments})
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )

    // Đóng popover khi click ra ngoài table
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.popover-elm').length &&
            !$(e.target).closest('.popover').length) {
            $('.popover-elm').popover('hide')
        }
    })
});