$(document).ready(function(){
    const $formElm = $('#asset_delivery_form')
    const $tblElm = $('#products_detail_tbl')
    const urlFact = $('#url-factory')

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
                        render: (row, type, data) => {
                            const $elmTrans = $.fn.transEle, $localTrans = $('#trans-factory');
                            let isFormat = [
                                {name: $elmTrans.attr('data-title'), value: 'title'},
                                {name: $elmTrans.attr('data-code'), value: 'code'},
                                {name: $localTrans.attr('data-uom'), value: 'uom.title'},
                                {name: $localTrans.attr('data-avail'), value: 'available'}
                            ]
                            let prod = {title: data.product_remark}
                            let title = data.product_remark
                            let link = null
                            if (row){
                                prod = row
                                row.available = data.product_available
                                title = row.title
                                link = urlFact.attr('data-prod-detail')
                            }
                            else if ('product_fixed' in data){
                                prod = data.product_fixed
                                title = prod.title
                                link = urlFact.attr('data-fixed-detail')
                            }
                            const dataCont = DataTableAction.item_view(prod, link, isFormat)
                            let icon = ''
                            if (data?.['product_provide_type'] === 'fixed') icon = '<i class="fas fa-warehouse"></i>'
                            if (data?.['product_provide_type'] === 'tool') icon = '<i class="fas fa-tools"></i>'
                            return `<div class="input-group title_prod">`
                                        +`<div class="dropdown pointer mr-2">`
                                        +    `<i class="fas fa-info-circle text-blue info-btn"></i>`
                                        +   `<div class="dropdown-menu w-210p">${dataCont}</div>`
                                        +`</div><p>${title} <span>${icon}</span></p></div>`;
                        }
                    },
                    {
                        data: 'request_number',
                        width: '10%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: 'delivered_number',
                        width: '10%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: 'done',
                        width: '15%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: 'date_delivered',
                        width: '10%',
                        render: (row) => {
                            return moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        }
                    },
                    {
                        targets: 6,
                        width: '5%',
                        render: () => {
                            return ``
                        }
                    }
                ],
                drawCallback: () =>{
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