$(document).ready(function () {
    function loadGoodsRegistrationList() {
        if (!$.fn.DataTable.isDataTable('#goods_registration_list')) {
            let dtb = $('#goods_registration_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            // console.log(resp.data['goods_registration_list'])
                            return resp.data['goods_registration_list'] ? resp.data['goods_registration_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'wrap-text w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="badge badge-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-30',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="text-primary"><b>${row.title}</b></a>`;
                        }
                    },
                    {
                        data: 'sale_order',
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            return `<span class="badge badge-secondary">${row?.['sale_order']?.['code']}</span>&nbsp;</span><span>${row?.['sale_order']?.['title']}</span>`
                        }
                    },
                    {
                        data: 'sale_person',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<span class="text-blue">${row?.['sale_order']?.['sale_person']?.['fullname']}</span>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `${moment(row.date_created.split(' ')[0]).format('DD/MM/YYYY')}`
                        }
                    },
                ],
            });
        }
    }

    loadGoodsRegistrationList();

    function Call(sale_order_id, product_id) {
        let dataParam11 = {}
        dataParam11['product_id'] = product_id
        dataParam11['so_item__sale_order_id'] = sale_order_id
        let ajax1 = $.fn.callAjax2({
            url: $('#call-btn').attr('data-url'),
            data: dataParam11,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('regis_borrow_list')) {
                    return data?.['regis_borrow_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ajax1]).then(
            (results) => {
                console.log(results[0])
            })
    }

    function loadBoxSaleOrder(data) {
        $('#sale_order_id_box').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#sale_order_id_box').attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    loadBoxSaleOrder()

    function loadBoxProduct(data) {
        $('#product_id_box').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#product_id_box').attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    loadBoxProduct()

    $(document).on("click", '#call-btn', function () {
        Call($('#sale_order_id_box').val(), $('#product_id_box').val())
    })
})