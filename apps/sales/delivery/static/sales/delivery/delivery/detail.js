$(function(){
    class prodDetailUtil{
        prodList = {}

        set setProdList(data){
            this.prodList = data
        }
        get getProdList(){
            return this.prodList
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

    // init fucn

    getPageDetail()

})();
