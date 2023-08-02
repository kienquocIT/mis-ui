$(document).ready(function () {
    const frmDetail = $('#frm-detail-pr');
    const pk = $.fn.getPkDetail();

    function loadDtbPrProduct(product_datas){
        if (!$.fn.DataTable.isDataTable('#datatable-pr-product')) {
            let $table = $('#datatable-pr-product')
            $table.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                autoWidth: false,
                data: product_datas,
                columns: [
                    {
                        targets: 0,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        data: 'product',
                        targets: 1,
                        render: (data, type, row) => {
                            return `<div class="readonly"><input class="form-control inp-product" data-id="${data.id}" value="${data.title}" readonly/></div>`
                        }
                    },
                    {
                        data: 'description',
                        targets: 2,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<div class="readonly"><input class="form-control inp-description" value="${data}" /></div>`
                        }
                    },
                    {
                        data: 'uom',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p class="inp-uom" data-id="${data.id}">${data.title}</p>`
                        }
                    },
                    {
                        data: 'quantity',
                        targets: 4,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<div class="readonly"><input class="form-control inp-quantity" readonly value="${data}"></div>`
                        }
                    },
                    {
                        data: 'unit_price',
                        targets: 5,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<div class="readonly"><input class="form-control mask-money inp-unit-price" readonly value="${data}" /></div>`
                        }
                    },
                    {
                        data: 'tax',
                        targets: 6,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<select class="form-select"><option value="${data.id}" selected>${data.title}</option></select>`
                        }
                    },
                    {
                        data: 'sub_total_price',
                        targets: 7,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money inp-subtotal" data-init-money=${data}></span>`

                        }
                    },
                ],
            });
        }
    }

    loadDtbPrProduct([]);

    function loadDetail() {
        let url = frmDetail.data('url').format_url_with_uuid(pk);
        $.fn.callAjax2({
            'url': url,
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let detail = data?.['purchase_request'];
                $('[name="title"]').val(detail.title);
                $('#box-select-supplier').append(`<option value="${detail.supplier.id}">${detail.supplier.name}</option>`);
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