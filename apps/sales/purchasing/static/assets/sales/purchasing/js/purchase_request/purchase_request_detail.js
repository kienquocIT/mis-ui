$(document).ready(function () {
    const frmDetail = $('#frm-detail-pr');
    const pk = $.fn.getPkDetail();

    PurchaseRequestAction.loadDtbPrProductDetail([]);

    function loadDetail() {
        let url = frmDetail.data('url').format_url_with_uuid(pk);
        $.fn.callAjax2({
            'url': url,
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let detail = data?.['purchase_request'];
                $x.fn.renderCodeBreadcrumb(detail);
                $('[name="title"]').val(detail.title);
                PurchaseRequestLoadPage.loadSupplier(detail.supplier);
                $('#box-select-contact').append(`<option value="${detail.contact.id}">${detail.contact.name}</option>`);
                $('[name="request_for"]').val(detail.request_for);
                $('[name="purchase_status"]').val(detail.purchase_status);
                $('[name="delivered_date"]').val(detail.delivered_date.split(' ')[0]);
                $('[name="note"]').val(detail.note);

                if (detail.sale_order !== null) {
                    $('[name="sale_order"]').val(detail.sale_order.code);
                }

                let table_product = $('#datatable-pr-product').DataTable();
                detail.purchase_request_product_datas.map(function (item){
                    table_product.row.add(item).draw().node();
                })

                $('#input-product-pretax-amount').attr('value', detail.pretax_amount);
                $('#input-product-taxes').attr('value', detail.taxes);
                $('#input-product-total').attr('value', detail.total_price);
            }
        })
    }

    loadDetail();
})