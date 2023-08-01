$(document).ready(function () {
    const frmDetail = $('#frm-detail-pr');
    const pk = $.fn.getPkDetail();

    function getHtmlProductTitle(product) {
        let ele_trans = $('#trans-factory');
        let ele_url = $('#url-factory');
        return `<span class="input-affix-wrapper">
                <span class="input-prefix" id="dropdownBeneficiary">
                    <i class="fas fa-info-circle text-primary" aria-expanded="false"
                       data-bs-toggle="dropdown"></i>
                    <span role="menu" class="dropdown-menu ml-4 pl-3 pr-3 pt-3 pb-3"
                          style="width: 25rem;">
                        <div class="row">
                            <span class="col-7">${ele_trans.data('trans-more-info')}</span>
                            <a class="col-5 text-right" target="_blank"
                               href="${ele_url.data('url-product-detail')}">
                                <span class="badge btn-outline-primary">${ele_trans.data('trans-more')}&nbsp;<i
                                    class="bi bi-arrow-right"></i></span>
                            </a>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="row">
                            <span class="col-5">${ele_trans.data('trans-product-name')}</span>
                            <span class="col-7 text-primary span-product-name"></span>
                        </div>
                        <div class="row">
                            <span class="col-5">${ele_trans.data('trans-code')}</span>
                            <span class="col-7 text-primary span-product-code"></span>
                        </div>
                        <div class="row">
                            <span class="col-5">UoM Group</span>
                            <span class="col-7 text-primary span-product-uom-group"></span>
                        </div>
                        <div class="row">
                            <span class="col-5">UoM</span>
                            <span class="col-7 text-primary span-product-uom"></span>
                        </div>
                    </span>
                </span>
                <input class="form-control inp-product" data-id="${product.id}" value="${product.title}" readonly/>
            </span>`
    }

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
                            return getHtmlProductTitle(data);
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