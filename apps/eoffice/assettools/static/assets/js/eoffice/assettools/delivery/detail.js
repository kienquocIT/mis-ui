$(document).ready(function(){
    const $formElm = $('#asset_delivery_form')
    const $tblElm = $('#products_detail_tbl')

    // get detail request info
    $.fn.callAjax2({
        'url': $formElm.attr('data-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)

            $x.fn.renderCodeBreadcrumb(data);
            $('#titleInput').val(data.title)
            $('#dateCreatedInput').val($x.fn.reformatData(data.date_created, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#remarkInput').val(data.remark)
            $('#SystemStatusInput').val(JSON.parse($('#sys_stt').text())[data.system_status][1])
            $('#inputEmployeeInheritor').val(data.employee_inherit.full_name)
                .attr('value', data.employee_inherit.id)

            $('#selectProvide').append(`<option value="${data.provide.id}">${data.provide.title}</option>`)
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
                        width: '35%',
                        render: (row, type, data, meta) => {
                            const $elmTrans = $.fn.transEle;
                            let isFormat = [
                                {name: $elmTrans.attr('data-title'), value: 'title'},
                                {name: $elmTrans.attr('data-code'), value: 'code'},
                                {name: 'UoM', value: 'uom_data.title'},
                                {name: 'Available', value: 'available'}
                            ]
                            const dataCont = DataTableAction.item_view(row, $('#url-factory').attr('data-prod-detail'),
                                isFormat)
                            return `<div class="input-group">
                                        <div class="dropdown pointer mr-2">
                                            <i class="fas fa-info-circle text-blue info-btn"></i>
                                            <div class="dropdown-menu w-210p">${dataCont}</div>
                                        </div>
                                        <p>${row.title}</p>
                                    </div>`;
                        }
                    },
                    {
                        data: 'request_number',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            return row
                        }
                    },
                    {
                        data: 'delivered_number',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            return row
                        }
                    },
                    {
                        data: 'warehouse',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            if (!row && data?.['warehouse_data']) row = data['warehouse_data']
                            let html = $(`<select>`).addClass('form-select row_warehouse')
                                .attr('name', `warehouse_${meta.row}`).attr('disabled', true)
                            if (row && Object.keys(row).length > 0)
                                html.append(`<option selected value="${row.id}">${row.title}</option>`)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'done',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            return row
                        }
                    },
                    {
                        data: 'date_delivered',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            return moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        }
                    },
                    {
                        targets: 6,
                        width: '5%',
                        render: (row, type, data, meta) => {
                            return ``
                        }
                    }
                ],drawCallback: (row, data, index) =>{
                    DropdownBSHandle.init()
                }
            })
            if (data.system_status >= 2) $('#idxRealAction').remove()

            // load attachments
            new $x.cls.file(
                $('#attachment')
            ).init({
                enable_edit: false,
                data: data.attachments,
            })
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
});