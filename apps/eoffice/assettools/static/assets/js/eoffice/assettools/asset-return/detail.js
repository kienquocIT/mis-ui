$(document).ready(function(){
    const $formElm = $('#asset_return_form')
    const $tblElm = $('#products_detail_tbl')

    // get detail request info
    $.fn.callAjax2({
        'url': $formElm.attr('data-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data)
            $('#titleInput').val(data.title)
            $('#dateCreatedInput').val($x.fn.reformatData(data.date_return, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#remarkInput').val(data.remark)
            $('#SystemStatusInput').val(JSON.parse($('#sys_stt').text())[data.system_status][1])
            $('#selectEmployeeInherit').html(`<option selected>${data.employee_inherit.full_name}</option>`).trigger('change')
            if (data.attachments) {
                const fileDetail = $.map(data.attachments, function(item){
                    return item?.['files']
                })
                FileUtils.init($(`[name="attachments"]`).siblings('button'), fileDetail);
            }

            const $elmTrans = $.fn.transEle, $elmCrtTrans = $('#trans-factory');
            const urlFact = $('#url-factory')
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
                        width: '75%',
                        render: (row, type, data) => {
                            let isFormat = [
                                {name: $elmTrans.attr('data-title'), value: 'title'},
                                {name: $elmTrans.attr('data-code'), value: 'code'},
                                {name: $elmCrtTrans.attr('data-uom'), value: 'uom'},
                                {name: $elmCrtTrans.attr('data-available'), value: 'available'}
                            ]
                            let link = ''
                            let name = data.product_remark
                            let icon = ''
                            let rowData = {'title' : data.product_remark}
                            if (data.product_provide_type === 'tool'){
                                link = urlFact.attr('data-prod-detail')
                                icon = '<i class="fas fa-tools"></i>'
                                name = row.title
                                rowData = row
                            }
                            else if (data.product_provide_type === 'fixed'){
                                link = urlFact.attr('data-fixed-detail')
                                name = data?.product_fixed?.title
                                icon = '<i class="fas fa-warehouse"></i>'
                                rowData = data?.product_fixed
                            }
                            const dataCont = DataTableAction.item_view(rowData, link, isFormat)
                            return `<div class="input-group">
                                        <div class="dropdown pointer mr-2" data-dropdown-custom="true">
                                            <i class="fas fa-info-circle text-blue info-btn"></i>
                                            <div class="dropdown-menu w-210p">${dataCont}</div>
                                        </div>
                                        <p>${name} <span style="color: rgb(90, 147, 255)">${icon}</span></p>
                                    </div>`;
                        }
                    },
                    {
                        data: 'return_number',
                        width: '20%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        targets: 3,
                        width: '5%',
                        render: () => {
                            return $('.delete_btn').html()
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