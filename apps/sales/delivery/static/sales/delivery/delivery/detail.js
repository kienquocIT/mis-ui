$(function(){
    class prodDetailUtil{
        prodList = {}

        set setProdList(data){
            this.prodList = data
        }
        get getProdList(){
            return this.prodList
        }

        initTableProd() {
            let $table = $('#dtbPickingProductList')
            $table.DataTableDefault({
                data: this.getProdList,
                columns: [
                    {
                        targets: 0,
                        class: 'w-5',
                        defaultContent: '',
                    },
                    {
                        targets: 1,
                        class: 'w-35',
                        render: (row, type, data) => {
                            let dataCont = DataTableAction.item_view(data, $('#url-factory').attr('data-prod-detail'))
                            let html = dataCont + `<p>${row.title}</p>`
                            return html;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-10 text-center',
                        render: (row, type, data) => {
                            return `<p>${data.uom.title}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        class: 'w-10 text-center',
                        render: (row, type, data) => {
                            return `<p>${data.total_order}</p>`;
                        }
                    },
                    {
                        targets: 4,
                        class: 'w-10 text-center',
                        render: (row, type, data) => {
                            return `<p>${data.delivery_before}</p>`;
                        }
                    },
                    {
                        targets: 5,
                        class: 'w-10 text-center',
                        render: (row, type, data) => {
                            return `<p>${data.remain}</p>`;
                        }
                    },
                    {
                        targets: 6,
                        class: 'w-10 text-center',
                        render: (row, type, data) => {
                            return `<p>${data.ready}</p>`;
                        }
                    },
                    {
                        targets: 7,
                        class: 'w-10',
                        render: (row, type, data) => {
                            return `<p>${data.ready_quantity}</p><i class="bi bi-three-dots" data-bs-toggle="modal" data-bs-target="#auditModalCreateInitial"></i>`;
                        }
                    },
                ],
                rowCallback(row, data) {
                    $('input[type="checkbox"]', row).on('change', function () {
                        data.checked = this.checked
                    });

                },
                rowIdx: false,
            });
        }

    }
    let prodTable = new prodDetailUtil();

    function getPageDetail(){
        const $form = $('#delivery_form')
        $.fn.callAjax($form.attr('data-url'), 'get')
            .then((req)=>{
                 const res = $.fn.switcherResp(req);
                 $('#inputSaleOrder').val(res.title)
                if (res.estimated_delivery_date){
                    let deliveryDate = moment(deliveryDate, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY hh:mm A')
                    $('#inputDeliveryDate').val(deliveryDate)
                }
                if(res.customer_data){
                    // let customerData = JSON.stringify(res.customer_data).replaceAll(/"/g, "'")
                    $('#inputCustomer').attr('data-onload', JSON.stringify(res.customer_data))
                }

                if(res.contact_data){
                    // let customerData = JSON.stringify(res.customer_data).replaceAll(/"/g, "'")
                    $('#inputContact').attr('data-onload', JSON.stringify(res.contact_data))
                }
                $('#inputState').val(res.state)
                $('#textareaRemarks').val(res.remarks)
                prodTable.setProdList = res.sub.products
                $('#textareaShippingAddress').val(res.shipping_address)
                $('#textareaBilling').val(res.bill_invoice_address)
                $('#input-attachment').val(res.attachments)
            })
    };

    // run get detail func
    getPageDetail()

})(jquery);
